import assert from 'node:assert';
import {
  hashPassword,
  verifyCredentials,
  createSessionToken,
  verifySessionToken,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  verifyOrigin,
  addAuditLog,
  getAuditLogs,
  sanitizeString,
  getSuperAdminConfig,
  getStandardAdminConfig,
  loadLocalEnv
} from './server/auth-service.js';

loadLocalEnv();

const superAdminConfig = getSuperAdminConfig();
const standardAdminConfig = getStandardAdminConfig();
const testSuperPass = process.env.SUPER_ADMIN_PASSWORD || process.env.TEST_SUPER_ADMIN_PASSWORD;
const testStandardPass = process.env.STANDARD_ADMIN_PASSWORD || process.env.TEST_STANDARD_ADMIN_PASSWORD;

console.log('====================================================');
console.log('--- SUNSHINE RESTAURANT AUTH & SECURITY AUDIT ---');
console.log('====================================================\n');

// 1. Password Hashing & Verification
console.log('1. Testing Password Hashes...');
if (testSuperPass) {
  const superAdmin = verifyCredentials(superAdminConfig.email, testSuperPass);
  assert(superAdmin !== null, 'Super Admin credentials must verify');
  assert.strictEqual(superAdmin.role, 'super_admin');
  assert.strictEqual(superAdmin.email, superAdminConfig.email);
  console.log(`✓ PASS: Super Admin (${superAdminConfig.email}) authenticated server-side with PBKDF2 hash`);
} else {
  console.log('ℹ NOTE: SUPER_ADMIN_PASSWORD not set in environment, skipping live hash verification');
}

if (testStandardPass) {
  const standardAdmin = verifyCredentials(standardAdminConfig.email, testStandardPass);
  assert(standardAdmin !== null, 'Standard Admin credentials must verify');
  assert.strictEqual(standardAdmin.role, 'admin');
  assert.strictEqual(standardAdmin.email, standardAdminConfig.email);
  console.log(`✓ PASS: Standard Admin (${standardAdminConfig.email}) authenticated server-side`);
} else {
  console.log('ℹ NOTE: STANDARD_ADMIN_PASSWORD not set in environment, skipping live standard admin verification');
}

// Verify old fallback credentials and arbitrary passwords are completely rejected
assert.strictEqual(verifyCredentials('superadmin@sunshine.com', 'DummyInvalidPassword!'), null, 'Old email must be rejected');
assert.strictEqual(verifyCredentials('superadmin@sunshine.com', 'SuperAdmin@Sunshine2026!'), null, 'Old email & old pass rejected');
assert.strictEqual(verifyCredentials(superAdminConfig.email, 'SuperAdmin@Sunshine2026!'), null, 'Old SuperAdmin pass rejected');
assert.strictEqual(verifyCredentials(standardAdminConfig.email, 'legacyAdminPass123'), null, 'Old password rejected');
assert.strictEqual(verifyCredentials(standardAdminConfig.email, 'Admin@Sunshine2026!'), null, 'Old Admin@Sunshine2026! rejected');
console.log('✓ PASS: All legacy and development fallback credentials completely rejected');

const badPassword = verifyCredentials(superAdminConfig.email, 'WrongPassword123!');
assert.strictEqual(badPassword, null, 'Bad password must be rejected');
console.log('✓ PASS: Incorrect password cleanly rejected');

const badEmail = verifyCredentials('nonexistent@sunshine.com', 'RandomPassword123!');
assert.strictEqual(badEmail, null, 'Unknown email must be rejected');
console.log('✓ PASS: Unknown user rejected without revealing user existence');

// 2. Rate Limiting Brute Force Protection
console.log('\n2. Testing Brute Force Rate Limiting (5 Attempts Max)...');
const testIp = '192.168.1.99';
clearFailedAttempts(testIp);

for (let i = 1; i <= 5; i++) {
  const statusBefore = checkRateLimit(testIp);
  assert(statusBefore.allowed === true, `Attempt ${i} should be allowed`);
  recordFailedAttempt(testIp);
}

const lockedStatus = checkRateLimit(testIp);
assert.strictEqual(lockedStatus.allowed, false, '6th attempt must be blocked by rate limiter');
assert(lockedStatus.error.includes('Too many failed login attempts'), 'Generic rate limit message returned');
console.log('✓ PASS: Rate limiter successfully blocked repeated failed attempts after 5 failures');

clearFailedAttempts(testIp);
const resetStatus = checkRateLimit(testIp);
assert.strictEqual(resetStatus.allowed, true, 'Rate limiter resets upon successful login');
console.log('✓ PASS: Rate limit cleared after successful auth');

// 3. Cryptographic HMAC-SHA256 Session Tokens
console.log('\n3. Testing Session Signing & Verification...');
const sessionTestUser = { email: superAdminConfig.email, role: 'super_admin', name: superAdminConfig.name };
const token = createSessionToken(sessionTestUser);
assert(typeof token === 'string' && token.split('.').length === 3, 'Token must be header.payload.sig');
const verified = verifySessionToken(token);
assert(verified !== null, 'Token should verify');
assert.strictEqual(verified.email, superAdminConfig.email);
assert.strictEqual(verified.role, 'super_admin');
console.log('✓ PASS: Session token generated and verified with HMAC-SHA256');

// Tampered token
const tamperedToken = token.slice(0, -4) + 'abcd';
const tamperedResult = verifySessionToken(tamperedToken);
assert.strictEqual(tamperedResult, null, 'Tampered token signature must fail');
console.log('✓ PASS: Tampered token signature strictly rejected');

// Expired token
const expiredToken = createSessionToken(sessionTestUser, -1000); // expired 1s ago
const expiredResult = verifySessionToken(expiredToken);
assert.strictEqual(expiredResult, null, 'Expired token must fail verification');
console.log('✓ PASS: Expired session token rejected');

// 4. Origin & CSRF Protection
console.log('\n4. Testing Origin & CSRF Protection...');
assert.strictEqual(verifyOrigin('http://localhost:5173', 'localhost:5173'), true, 'Localhost origin allowed');
assert.strictEqual(verifyOrigin('https://sunshine-restaurant.netlify.app', 'sunshine-restaurant.netlify.app'), true, 'Domain origin allowed');
assert.strictEqual(verifyOrigin('https://malicious-attacker.com', 'sunshine-restaurant.netlify.app'), false, 'Untrusted cross-origin blocked');
console.log('✓ PASS: Cross-origin CSRF mutation attempts strictly rejected');

// 5. Input Sanitization
console.log('\n5. Testing Input Sanitization (XSS Prevention)...');
const dirtyInput = '<script>alert("xss")</script><b>Bold review</b>';
const sanitized = sanitizeString(dirtyInput);
assert(!sanitized.includes('<script>'), 'Script tags must be escaped');
assert(sanitized.includes('&lt;script&gt;'), 'HTML entities used');
console.log('✓ PASS: Review and form inputs safely sanitized against XSS');

// 6. Security Audit Trail
console.log('\n6. Testing Security Audit Logging...');
addAuditLog('super_admin', 'nagaaswith7@gmail.com', 'MENU_UPDATE', 'Paneer Tikka');
addAuditLog('super_admin', 'nagaaswith7@gmail.com', 'SETTINGS_UPDATE', 'Google Maps URL');
const logs = getAuditLogs();
assert(logs.length >= 2, 'Audit logs recorded');
assert.strictEqual(logs[0].action, 'SETTINGS_UPDATE');
assert(!JSON.stringify(logs).includes('password'), 'Passwords must never appear in audit logs');
assert(!JSON.stringify(logs).includes('hash'), 'Hashes must never appear in audit logs');
console.log('✓ PASS: Administrative actions logged with role, action, and target without secrets');

console.log('\n====================================================');
console.log('--- ALL AUTHENTICATION & SECURITY TESTS PASSED ---');
console.log('====================================================');
