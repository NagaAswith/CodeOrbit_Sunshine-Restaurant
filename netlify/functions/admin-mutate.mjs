import {
  parseCookies,
  verifySessionToken,
  verifyOrigin,
  addAuditLog,
  sanitizeString
} from '../../server/auth-service.js';

// Sensitive mutations strictly requiring SUPER ADMIN role
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

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Origin / CSRF Check
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (!verifyOrigin(origin, host)) {
    return new Response(JSON.stringify({ error: 'Forbidden: Invalid Request Origin' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Session verification
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const token = cookies.sunshine_admin_session || req.headers.get('authorization')?.replace('Bearer ', '');

  const session = verifySessionToken(token);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Active administrative session required.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { action, target } = body;

    if (!action) {
      return new Response(JSON.stringify({ error: 'Missing action parameter.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Role Enforcement: Super Admin Check
    const requiresSuperAdmin = SUPER_ADMIN_ONLY_ACTIONS.has(action.toUpperCase());
    if (requiresSuperAdmin && session.role !== 'super_admin') {
      return new Response(JSON.stringify({
        error: 'Forbidden: Super Administrator privileges required to perform this modification.',
        requiredRole: 'super_admin',
        currentRole: session.role
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Record audit log
    const auditEntry = addAuditLog(session.role, session.email, action.toUpperCase(), sanitizeString(target || ''));

    return new Response(JSON.stringify({
      success: true,
      audit: auditEntry
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid payload.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
