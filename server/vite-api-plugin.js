import {
  verifyCredentials,
  createSessionToken,
  verifySessionToken,
  parseCookies,
  serializeSessionCookie,
  serializeLogoutCookie,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  clearAllRateLimits,
  verifyOrigin,
  addAuditLog,
  getAuditLogs,
  sanitizeString
} from './auth-service.js';

const SUPER_ADMIN_ONLY_ACTIONS = new Set([
  'MENU_CREATE',
  'MENU_UPDATE',
  'MENU_DELETE',
  'MENU_AVAILABILITY_TOGGLE',
  'EVENT_CREATE',
  'EVENT_UPDATE',
  'EVENT_DELETE',
  'EVENT_STATUS_TOGGLE',
  'TIMESLOT_CREATE',
  'TIMESLOT_UPDATE',
  'TIMESLOT_DELETE',
  'TIMESLOT_STATUS_TOGGLE',
  'PRICING_UPDATE',
  'SETTINGS_UPDATE',
  'WEBSITE_CONTENT_UPDATE',
  'REVIEW_PUBLISH',
  'REVIEW_HIDE',
  'REVIEW_DELETE',
  'DATA_RESET',
  'MEDIA_UPLOAD'
]);

function readBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data, headers = {}) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  for (const [k, v] of Object.entries(headers)) {
    res.setHeader(k, v);
  }
  res.end(JSON.stringify(data));
}

export function adminApiPlugin() {
  return {
    name: 'admin-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (!url || !url.startsWith('/api/')) {
          return next();
        }

        // 0. POST /api/dev/reset-rate-limit (Local Development Only)
        if (url === '/api/dev/reset-rate-limit' && req.method === 'POST') {
          if (process.env.NODE_ENV === 'production') {
            return sendJson(res, 403, { error: 'Rate limit reset is strictly disabled in production.' });
          }
          clearAllRateLimits();
          return sendJson(res, 200, {
            success: true,
            message: 'Local development rate-limit state has been reset successfully.'
          });
        }

        // 1. POST /api/admin-login
        if (url === '/api/admin-login' && req.method === 'POST') {
          const origin = req.headers['origin'];
          const host = req.headers['host'];
          if (!verifyOrigin(origin, host)) {
            return sendJson(res, 403, { error: 'Forbidden: Invalid request origin.' });
          }

          const clientIp = req.socket?.remoteAddress || '127.0.0.1';
          const rateStatus = checkRateLimit(clientIp);
          if (!rateStatus.allowed) {
            return sendJson(res, 429, { error: rateStatus.error });
          }

          const body = await readBody(req);
          const { email, password } = body;

          const user = verifyCredentials(email, password);
          if (!user) {
            recordFailedAttempt(clientIp);
            return sendJson(res, 401, { error: 'Invalid email or password.' });
          }

          clearFailedAttempts(clientIp);
          const token = createSessionToken(user);
          const cookieHeader = serializeSessionCookie(token, false);

          return sendJson(res, 200, {
            success: true,
            user: {
              name: user.name,
              email: user.email,
              role: user.role
            }
          }, { 'Set-Cookie': cookieHeader });
        }

        // 2. GET /api/admin-session
        if (url === '/api/admin-session' && req.method === 'GET') {
          const cookies = parseCookies(req.headers['cookie']);
          const token = cookies.sunshine_admin_session || req.headers['authorization']?.replace('Bearer ', '');

          const session = verifySessionToken(token);
          if (!session) {
            return sendJson(res, 401, { authenticated: false });
          }

          return sendJson(res, 200, {
            authenticated: true,
            user: {
              name: session.name,
              email: session.email,
              role: session.role
            }
          });
        }

        // 3. POST /api/admin-logout
        if (url === '/api/admin-logout' && req.method === 'POST') {
          const cookieHeader = serializeLogoutCookie(false);
          return sendJson(res, 200, { success: true }, { 'Set-Cookie': cookieHeader });
        }

        // 4. POST /api/admin/mutate
        if (url === '/api/admin/mutate' && req.method === 'POST') {
          const origin = req.headers['origin'];
          const host = req.headers['host'];
          if (!verifyOrigin(origin, host)) {
            return sendJson(res, 403, { error: 'Forbidden: Invalid request origin.' });
          }

          const cookies = parseCookies(req.headers['cookie']);
          const token = cookies.sunshine_admin_session || req.headers['authorization']?.replace('Bearer ', '');

          const session = verifySessionToken(token);
          if (!session) {
            return sendJson(res, 401, { error: 'Unauthorized: Active administrative session required.' });
          }

          const body = await readBody(req);
          const { action, target } = body;

          if (!action) {
            return sendJson(res, 400, { error: 'Missing action parameter.' });
          }

          const requiresSuperAdmin = SUPER_ADMIN_ONLY_ACTIONS.has(String(action).toUpperCase());
          if (requiresSuperAdmin && session.role !== 'super_admin') {
            return sendJson(res, 403, {
              error: 'Forbidden: Super Administrator privileges required for this operation.',
              requiredRole: 'super_admin',
              currentRole: session.role
            });
          }

          const audit = addAuditLog(session.role, session.email, String(action).toUpperCase(), sanitizeString(target || ''));
          return sendJson(res, 200, { success: true, audit });
        }

        // 5. GET /api/admin/audit-logs
        if (url === '/api/admin/audit-logs' && req.method === 'GET') {
          const cookies = parseCookies(req.headers['cookie']);
          const token = cookies.sunshine_admin_session || req.headers['authorization']?.replace('Bearer ', '');

          const session = verifySessionToken(token);
          if (!session) {
            return sendJson(res, 401, { error: 'Unauthorized' });
          }

          return sendJson(res, 200, { logs: getAuditLogs() });
        }

        // Unknown /api route
        return sendJson(res, 404, { error: 'API route not found' });
      });
    }
  };
}
