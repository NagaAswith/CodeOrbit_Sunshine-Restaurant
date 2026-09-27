import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

// Robust local .env loader ensuring local .env has highest precedence
export function loadLocalEnv() {
  const possiblePaths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Z]:)/i, '$1'), '.env')
  ];

  for (const envPath of possiblePaths) {
    try {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            // Local .env takes strict precedence over any ambient system variables
            process.env[key] = val;
          }
        }
        break;
      }
    } catch {
      // Continue or ignore if file unreadable
    }
  }
}

// Initial load
loadLocalEnv();

// In-memory rate limiting tracker: ip -> { count: number, resetAt: number }
const loginAttempts = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_FAILED_ATTEMPTS = 5;

// In-memory audit log
const auditLogs = [];
const MAX_AUDIT_LOGS = 100;

// Session signing secret (from server environment or cryptographically generated per process)
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// PBKDF2 Password Hashing Utility
export function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(String(password), String(salt), 100000, 64, 'sha512').toString('hex');
}

export function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

// Helper to resolve Super Admin configuration dynamically from server environment
export function getSuperAdminConfig() {
  loadLocalEnv();
  return {
    email: (process.env.SUPER_ADMIN_EMAIL || 'nagaaswith7@gmail.com').trim().toLowerCase(),
    salt: process.env.SUPER_ADMIN_SALT || '',
    hash: process.env.SUPER_ADMIN_PASSWORD_HASH || '',
    name: 'Naga Aswith (Super Admin)',
    role: 'super_admin'
  };
}

// Helper to resolve Standard Admin configuration dynamically from server environment
export function getStandardAdminConfig() {
  loadLocalEnv();
  return {
    email: (process.env.STANDARD_ADMIN_EMAIL || 'admin@sunshine.com').trim().toLowerCase(),
    salt: process.env.STANDARD_ADMIN_SALT || '',
    hash: process.env.STANDARD_ADMIN_PASSWORD_HASH || '',
    name: 'Chef Vikrant Roy (Standard Admin)',
    role: 'admin'
  };
}

// Rate limiting check
export function checkRateLimit(identifier) {
  const now = Date.now();
  const record = loginAttempts.get(identifier);

  if (record) {
    if (now > record.resetAt) {
      loginAttempts.delete(identifier);
      return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
    }
    if (record.count >= MAX_FAILED_ATTEMPTS) {
      const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
      return {
        allowed: false,
        error: `Too many failed login attempts. Please wait ${waitSeconds} seconds before trying again.`
      };
    }
    return { allowed: true, remaining: MAX_FAILED_ATTEMPTS - record.count };
  }

  return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
}

export function recordFailedAttempt(identifier) {
  const now = Date.now();
  const record = loginAttempts.get(identifier);
  if (!record || now > record.resetAt) {
    loginAttempts.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  } else {
    record.count += 1;
  }
}

export function clearFailedAttempts(identifier) {
  loginAttempts.delete(identifier);
}

// Safe programmatic rate-limit reset (strictly for local development & testing)
export function clearAllRateLimits() {
  loginAttempts.clear();
  return { success: true, message: 'All rate limits have been cleared.' };
}

// Verify credentials server-side strictly against PBKDF2 hashes
export function verifyCredentials(email, password) {
  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return null;
  }

  const cleanEmail = email.trim().toLowerCase();
  const superAdmin = getSuperAdminConfig();
  const standardAdmin = getStandardAdminConfig();

  // Check Super Admin
  if (cleanEmail === superAdmin.email) {
    if (superAdmin.salt && superAdmin.hash) {
      const computed = hashPassword(password, superAdmin.salt);
      const compBuf = Buffer.from(computed, 'hex');
      const hashBuf = Buffer.from(superAdmin.hash, 'hex');
      if (compBuf.length === hashBuf.length && crypto.timingSafeEqual(compBuf, hashBuf)) {
        return {
          email: superAdmin.email,
          name: superAdmin.name,
          role: superAdmin.role
        };
      }
    }
  }

  // Check Standard Admin
  if (cleanEmail === standardAdmin.email) {
    if (standardAdmin.salt && standardAdmin.hash) {
      const computed = hashPassword(password, standardAdmin.salt);
      const compBuf = Buffer.from(computed, 'hex');
      const hashBuf = Buffer.from(standardAdmin.hash, 'hex');
      if (compBuf.length === hashBuf.length && crypto.timingSafeEqual(compBuf, hashBuf)) {
        return {
          email: standardAdmin.email,
          name: standardAdmin.name,
          role: standardAdmin.role
        };
      }
    }
  }

  return null;
}

// Session Token Generation & Verification with HMAC-SHA256
export function createSessionToken(user, expiresInMs = 8 * 60 * 60 * 1000) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Date.now(),
    exp: Date.now() + expiresInMs
  })).toString('base64url');

  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, payload, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  try {
    const sigA = Buffer.from(signature, 'utf-8');
    const sigB = Buffer.from(expectedSignature, 'utf-8');
    if (sigA.length !== sigB.length || !crypto.timingSafeEqual(sigA, sigB)) {
      return null;
    }

    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (Date.now() > data.exp) {
      return null; // Expired
    }
    return data;
  } catch {
    return null;
  }
}

// Parse Cookie Header
export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [name, ...rest] = pair.trim().split('=');
    if (name) {
      cookies[name.trim()] = decodeURIComponent(rest.join('='));
    }
  }
  return cookies;
}

// Format Set-Cookie header string
export function serializeSessionCookie(token, isProduction = false, maxAge = 8 * 60 * 60) {
  const secureFlag = isProduction ? '; Secure' : '';
  return `sunshine_admin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secureFlag}`;
}

export function serializeLogoutCookie(isProduction = false) {
  const secureFlag = isProduction ? '; Secure' : '';
  return `sunshine_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secureFlag}`;
}

// Origin & CSRF verification
export function verifyOrigin(origin, host) {
  if (!origin) return true; // Non-browser / same-origin relative request
  try {
    const originUrl = new URL(origin);
    if (!host) return true;
    const cleanHost = host.split(':')[0];
    return originUrl.hostname === cleanHost || originUrl.hostname === 'localhost' || originUrl.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

// Sanitization of user input
export function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
}

// Audit logging
export function addAuditLog(adminRole, adminEmail, action, target) {
  const entry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    adminRole: adminRole || 'unknown',
    adminEmail: adminEmail || 'system',
    action,
    target: sanitizeString(target || '')
  };

  auditLogs.unshift(entry);
  if (auditLogs.length > MAX_AUDIT_LOGS) {
    auditLogs.pop();
  }
  return entry;
}

export function getAuditLogs() {
  return [...auditLogs];
}
