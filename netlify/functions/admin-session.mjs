import {
  parseCookies,
  verifySessionToken
} from '../../server/auth-service.js';

export default async (req) => {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Parse Cookie or Bearer Token
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = parseCookies(cookieHeader);
  const token = cookies.sunshine_admin_session || req.headers.get('authorization')?.replace('Bearer ', '');

  const session = verifySessionToken(token);
  if (!session) {
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    authenticated: true,
    user: {
      name: session.name,
      email: session.email,
      role: session.role
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
