import {
  parseCookies,
  verifySessionToken,
  getAuditLogs
} from '../../server/auth-service.js';

export default async (req) => {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const token = cookies.sunshine_admin_session || req.headers.get('authorization')?.replace('Bearer ', '');

  const session = verifySessionToken(token);
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const logs = getAuditLogs();
  return new Response(JSON.stringify({ logs }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
