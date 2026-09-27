import { verifyCredentials, getSuperAdminConfig, getStandardAdminConfig, loadLocalEnv } from '../server/auth-service.js';

loadLocalEnv();
const superConfig = getSuperAdminConfig();
const standardConfig = getStandardAdminConfig();
const testSuperPassword = process.env.SUPER_ADMIN_PASSWORD || process.env.TEST_SUPER_ADMIN_PASSWORD;
const testStandardPassword = process.env.STANDARD_ADMIN_PASSWORD || process.env.TEST_STANDARD_ADMIN_PASSWORD;

console.log('Super Admin email configured:', Boolean(superConfig.email));
console.log('Super Admin password hash configured:', Boolean(superConfig.hash && superConfig.salt));
console.log('Standard Admin email configured:', Boolean(standardConfig.email));
console.log('Standard Admin password hash configured:', Boolean(standardConfig.hash && standardConfig.salt));

if (testSuperPassword && testStandardPassword) {
  const superOk = verifyCredentials(superConfig.email, testSuperPassword);
  const standardOk = verifyCredentials(standardConfig.email, testStandardPassword);

  console.log('Super Admin login success:', Boolean(superOk && superOk.role === 'super_admin'));
  console.log('Standard Admin login success:', Boolean(standardOk && standardOk.role === 'admin'));

  if (!superOk || superOk.role !== 'super_admin') {
    console.error('FATAL: Super Admin failed to verify');
    process.exit(1);
  }
  if (!standardOk || standardOk.role !== 'admin') {
    console.error('FATAL: Standard Admin failed to verify');
    process.exit(1);
  }
} else {
  console.log('ℹ NOTE: Local test passwords not in environment; skipping live credential verification.');
}

const oldSuper1 = verifyCredentials('superadmin@sunshine.com', 'SuperAdmin@Sunshine2026!');
const oldSuper2 = verifyCredentials('superadmin@sunshine.com', 'OldDummyPassword123!');
const oldSuper3 = verifyCredentials(superConfig.email, 'SuperAdmin@Sunshine2026!');
const oldStd1 = verifyCredentials(standardConfig.email, 'legacyAdminPass123');
const oldStd2 = verifyCredentials(standardConfig.email, 'Admin@Sunshine2026!');

console.log('Old superadmin@sunshine.com rejected:', oldSuper1 === null && oldSuper2 === null);
console.log('Old SuperAdmin@Sunshine2026! rejected:', oldSuper3 === null);
console.log('Old legacy password rejected:', oldStd1 === null);
console.log('Old Admin@Sunshine2026! rejected:', oldStd2 === null);

if (oldSuper1 || oldSuper2 || oldSuper3 || oldStd1 || oldStd2) {
  console.error('FATAL: Old fallback credentials were not rejected');
  process.exit(1);
}

console.log('ALL AUTH STATE CHECKS PASSED');
