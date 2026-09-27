import assert from 'node:assert';
import { loadLocalEnv, getSuperAdminConfig, getStandardAdminConfig } from './server/auth-service.js';

loadLocalEnv();
const superAdminConfig = getSuperAdminConfig();
const standardAdminConfig = getStandardAdminConfig();
const testSuperPassword = process.env.SUPER_ADMIN_PASSWORD || process.env.TEST_SUPER_ADMIN_PASSWORD;
const testStandardPassword = process.env.STANDARD_ADMIN_PASSWORD || process.env.TEST_STANDARD_ADMIN_PASSWORD;

const BASE_URL = 'http://localhost:5173';

async function runE2ETests() {
  console.log('====================================================');
  console.log('--- SUNSHINE RESTAURANT FULL END-TO-END SUITE ---');
  console.log('====================================================\n');

  // Test 1: Web server root response
  console.log('1. Checking Frontend Web Server...');
  const rootRes = await fetch(`${BASE_URL}/`);
  assert.strictEqual(rootRes.status, 200, 'Frontend server must respond with 200');
  const rootHtml = await rootRes.text();
  assert(rootHtml.includes('<div id="root"></div>'), 'App root element present');
  console.log('✓ PASS: Vite frontend dev server is active and serving the application');

  // Test 2: Invalid Admin Login & Rate Limit Reset Test
  console.log('\n2. Testing Invalid Admin Login & Generic Error Messages...');
  const badLoginRes = await fetch(`${BASE_URL}/api/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nagaaswith7@gmail.com', password: 'WrongPassword!' })
  });
  assert.strictEqual(badLoginRes.status, 401, 'Invalid credentials must return 401');
  const badLoginJson = await badLoginRes.json();
  assert.strictEqual(badLoginJson.error, 'Invalid email or password.', 'Generic error message returned');
  console.log('✓ PASS: Invalid login returns generic 401 without exposing account existence');

  // Verify old fallback email is rejected
  const oldEmailRes = await fetch(`${BASE_URL}/api/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'superadmin@sunshine.com', password: 'SuperAdmin@Sunshine2026!' })
  });
  assert.strictEqual(oldEmailRes.status, 401, 'Old fallback email must be rejected');
  console.log('✓ PASS: Old fallback email (superadmin@sunshine.com) rejected with 401');

  // Reset rate limits so local development IP is clean
  await fetch(`${BASE_URL}/api/dev/reset-rate-limit`, { method: 'POST' });

  // Test 3: Unauthenticated Call to Protected Mutate Endpoint
  console.log('\n3. Testing Direct Mutation Call Without Authentication...');
  const unauthRes = await fetch(`${BASE_URL}/api/admin/mutate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'MENU_UPDATE', target: 'Paneer Tikka' })
  });
  assert.strictEqual(unauthRes.status, 401, 'Direct mutation without cookie must return 401 Unauthorized');
  console.log('✓ PASS: Server-side endpoint blocks unauthenticated mutation attempts');

  // Test 4: Cross-Origin / CSRF Protection
  console.log('\n4. Testing Cross-Origin CSRF Protection...');
  const csrfRes = await fetch(`${BASE_URL}/api/admin/mutate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Origin': 'https://evil-attacker-site.com'
    },
    body: JSON.stringify({ action: 'MENU_UPDATE', target: 'Paneer Tikka' })
  });
  assert.strictEqual(csrfRes.status, 403, 'Cross-origin request must be rejected with 403 Forbidden');
  console.log('✓ PASS: Cross-origin CSRF mutation request rejected with 403 Forbidden');

  // Test 5: Standard Admin Authentication & Permissions
  console.log('\n5. Testing Standard Admin Login & Role Separation...');
  const standardLoginRes = await fetch(`${BASE_URL}/api/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: standardAdminConfig.email, password: testStandardPassword })
  });
  assert.strictEqual(standardLoginRes.status, 200, 'Standard Admin login should succeed');
  const standardCookie = standardLoginRes.headers.get('set-cookie');
  assert(standardCookie && standardCookie.includes('sunshine_admin_session='), 'HttpOnly session cookie received');
  assert(standardCookie.includes('HttpOnly'), 'Cookie must have HttpOnly flag');
  assert(standardCookie.includes('SameSite=Lax'), 'Cookie must have SameSite flag');
  const standardData = await standardLoginRes.json();
  assert.strictEqual(standardData.user.role, 'admin');
  assert.strictEqual(standardData.user.email, 'admin@sunshine.com');
  console.log('✓ PASS: Standard Admin authenticated; HttpOnly SameSite cookie issued');

  // Verify old Standard Admin passwords fail
  const oldStdRes1 = await fetch(`${BASE_URL}/api/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: standardAdminConfig.email, password: 'legacyAdminPass123' })
  });
  assert.strictEqual(oldStdRes1.status, 401, 'Old legacy password must fail');
  const oldStdRes2 = await fetch(`${BASE_URL}/api/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: standardAdminConfig.email, password: 'Admin@Sunshine2026!' })
  });
  assert.strictEqual(oldStdRes2.status, 401, 'Old Admin@Sunshine2026! must fail');
  console.log('✓ PASS: Old Standard Admin passwords (legacyAdminPass123, Admin@Sunshine2026!) rejected');

  // Clean cookie string for subsequent requests
  const standardSessionCookie = standardCookie.split(';')[0];

  // Test 6: Verify Session via GET /api/admin-session
  console.log('\n6. Testing Session Verification via /api/admin-session...');
  const sessionRes = await fetch(`${BASE_URL}/api/admin-session`, {
    headers: { 'Cookie': standardSessionCookie }
  });
  assert.strictEqual(sessionRes.status, 200, 'Session verification must succeed');
  const sessionData = await sessionRes.json();
  assert.strictEqual(sessionData.authenticated, true);
  assert.strictEqual(sessionData.user.role, 'admin');
  console.log('✓ PASS: /api/admin-session verifies active session and returns user role');

  // Test 7: Standard Admin Attempting Super Admin-Only Action (Must Be Rejected 403)
  console.log('\n7. Testing Role Guard: Standard Admin Calling Super Admin Mutation...');
  const forbiddenRes = await fetch(`${BASE_URL}/api/admin/mutate`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Cookie': standardSessionCookie 
    },
    body: JSON.stringify({ action: 'SETTINGS_UPDATE', target: 'Business Settings' })
  });
  assert.strictEqual(forbiddenRes.status, 403, 'Super Admin mutation by Standard Admin must return 403 Forbidden');
  const forbiddenJson = await forbiddenRes.json();
  assert(forbiddenJson.error.includes('Super Administrator privileges required'), 'Role guard error message');
  console.log('✓ PASS: Server enforces 403 Forbidden when Standard Admin attempts Super Admin mutation');

  // Test 8: Logout Standard Admin
  console.log('\n8. Testing Admin Logout...');
  const logoutRes = await fetch(`${BASE_URL}/api/admin-logout`, {
    method: 'POST',
    headers: { 'Cookie': standardSessionCookie }
  });
  assert.strictEqual(logoutRes.status, 200, 'Logout should succeed');
  const logoutCookie = logoutRes.headers.get('set-cookie');
  assert(logoutCookie.includes('Max-Age=0'), 'Session cookie invalidated with Max-Age=0');
  console.log('✓ PASS: Logout endpoint destroys session and invalidates cookie');

  // Test 9: Super Admin Authentication
  console.log('\n9. Testing Super Admin Login & Full Management Access...');
  const superLoginRes = await fetch(`${BASE_URL}/api/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: superAdminConfig.email, password: testSuperPassword })
  });
  assert.strictEqual(superLoginRes.status, 200, 'Super Admin login must succeed');
  const superCookie = superLoginRes.headers.get('set-cookie');
  const superSessionCookie = superCookie.split(';')[0];
  const superData = await superLoginRes.json();
  assert.strictEqual(superData.user.role, 'super_admin');
  assert.strictEqual(superData.user.email, 'nagaaswith7@gmail.com');
  console.log('✓ PASS: Super Admin (nagaaswith7@gmail.com) authenticated successfully');

  // Verify old Super Admin password fails
  const oldSuperRes = await fetch(`${BASE_URL}/api/admin-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'nagaaswith7@gmail.com', password: 'SuperAdmin@Sunshine2026!' })
  });
  assert.strictEqual(oldSuperRes.status, 401, 'Old SuperAdmin@Sunshine2026! must fail');
  console.log('✓ PASS: Old Super Admin password (SuperAdmin@Sunshine2026!) rejected');

  // Test 10: Super Admin Executing Sensitive Mutations
  console.log('\n10. Testing Super Admin Mutations...');
  const mutations = [
    { action: 'SETTINGS_UPDATE', target: 'Google Maps & Contact Information' },
    { action: 'WEBSITE_CONTENT_UPDATE', target: 'Hero & Promotional Banner CMS' },
    { action: 'PRICING_UPDATE', target: 'Table and Suite Tariff Updates' },
    { action: 'REVIEW_PUBLISH', target: 'Customer Review #rev-1' },
    { action: 'MEDIA_UPLOAD', target: 'Special Tasting Photo' }
  ];

  for (const m of mutations) {
    const res = await fetch(`${BASE_URL}/api/admin/mutate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': superSessionCookie
      },
      body: JSON.stringify(m)
    });
    assert.strictEqual(res.status, 200, `Super Admin mutation ${m.action} should succeed`);
    const json = await res.json();
    assert.strictEqual(json.success, true);
    console.log(`  ✓ Authorized: ${m.action} -> ${m.target}`);
  }

  // Test 11: Security Audit Log Endpoint
  console.log('\n11. Testing Security Audit Logs Retrieval...');
  const auditRes = await fetch(`${BASE_URL}/api/admin/audit-logs`, {
    headers: { 'Cookie': superSessionCookie }
  });
  assert.strictEqual(auditRes.status, 200, 'Audit logs retrieval should succeed');
  const auditData = await auditRes.json();
  assert(Array.isArray(auditData.logs), 'Logs must be an array');
  assert(auditData.logs.length >= 5, 'Recorded mutations present in audit log');
  console.log(`✓ PASS: Audit log contains ${auditData.logs.length} securely recorded events`);

  console.log('\n====================================================');
  console.log('--- ALL END-TO-END INTEGRATION TESTS PASSED (11/11) ---');
  console.log('====================================================');
}

runE2ETests().catch((err) => {
  console.error('E2E TEST FAILURE:', err);
  process.exit(1);
});
