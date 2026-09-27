import {
  serializeLogoutCookie
} from '../../server/auth-service.js';

export default async (req) => {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieHeader = serializeLogoutCookie(isProd);

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': cookieHeader
    }
  });
};
