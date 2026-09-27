import {
  verifyCredentials,
  createSessionToken,
  serializeSessionCookie,
  checkRateLimit,
  recordFailedAttempt,
  clearFailedAttempts,
  verifyOrigin
} from '../../server/auth-service.js';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Origin check
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (!verifyOrigin(origin, host)) {
    return new Response(JSON.stringify({ error: 'Invalid Origin' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Rate Limiting
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown-client';
  const rateLimitStatus = checkRateLimit(clientIp);
  if (!rateLimitStatus.allowed) {
    return new Response(JSON.stringify({ error: rateLimitStatus.error }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { email, password } = body;

    const user = verifyCredentials(email, password);
    if (!user) {
      recordFailedAttempt(clientIp);
      return new Response(JSON.stringify({ error: 'Invalid email or password.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Success
    clearFailedAttempts(clientIp);
    const token = createSessionToken(user);
    const isProd = process.env.NODE_ENV === 'production';
    const cookieHeader = serializeSessionCookie(token, isProd);

    return new Response(JSON.stringify({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request payload.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
