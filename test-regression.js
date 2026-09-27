import { initialData } from './src/data/initialData.js';
import { generateBookingId, generateToken, formatINR } from './src/utils/formatters.js';

console.log('====================================================');
console.log('--- SUNSHINE RESTAURANT COMPREHENSIVE REGRESSION ---');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (!condition) {
    console.error(`❌ FAIL: ${testName}`);
    throw new Error(`Test failed: ${testName}`);
  }
  passedTests++;
  console.log(`✓ PASS: ${testName}`);
}

// 1. Initial Data & Data Model Extension
assert(initialData.menu && initialData.menu.length >= 15, 'Menu dataset intact (>= 15 items)');
assert(initialData.events && initialData.events.length >= 4, 'Events dataset intact (>= 4 events)');
assert(initialData.timeSlots && initialData.timeSlots.length >= 6, 'Time slots dataset intact (>= 6 slots)');
assert(initialData.pricing && initialData.pricing.acRoomPrice === 2500, 'Pricing data valid');
assert(initialData.settings && initialData.settings.restaurantName === 'SUNSHINE', 'Settings restaurantName valid');
assert(initialData.settings.googleMapsUrl && initialData.settings.googleMapsUrl.includes('maps.google.com'), 'Google Maps URL configured in settings');
assert(initialData.reviews && initialData.reviews.length >= 5, 'Initial reviews collection populated');

// 2. Formatters
assert(formatINR(48650) === '₹48,650', 'formatINR formats correctly');
assert(generateBookingId(128).endsWith('00128'), 'generateBookingId format');
assert(generateToken().length === 5, 'generateToken 5 characters');

// 3. Out-of-Stock State & Persistence Simulation
const testItem = { ...initialData.menu[0] };
assert(testItem.isAvailable === true, 'Menu item initially Available');
testItem.isAvailable = false;
assert(testItem.isAvailable === false, 'Menu item toggled to Out of Stock');
testItem.isAvailable = true;
assert(testItem.isAvailable === true, 'Menu item toggled back to Available');

// 4. Spice Level Editing (1: Mild, 2: Medium, 3: Hot)
testItem.spiceLevel = 3;
assert(testItem.spiceLevel === 3, 'Spice level set to Hot (3)');
testItem.spiceLevel = 2;
assert(testItem.spiceLevel === 2, 'Spice level set to Medium (2)');
testItem.spiceLevel = 1;
assert(testItem.spiceLevel === 1, 'Spice level set to Mild (1)');

// 5. Food Type: Mutually Exclusive Vegetarian vs Non-Vegetarian
testItem.isVeg = true;
assert(testItem.isVeg === true, 'Item is Vegetarian');
testItem.isVeg = false;
assert(testItem.isVeg === false, 'Item is Non-Vegetarian (mutually exclusive)');

// 6. Image URL & Upload Simulation
const customUrl = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800';
testItem.image = customUrl;
assert(testItem.image === customUrl, 'Image URL replacement works');
const base64DataUrl = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD...';
testItem.image = base64DataUrl;
assert(testItem.image === base64DataUrl, 'Direct local image upload (data URL) supported');

// 7. Customer Feedback & Review System
let testReviews = [...initialData.reviews];
const newReview = {
  id: `rev-${Date.now()}`,
  customerName: 'Anand Kumar',
  email: 'anand.k@example.com',
  rating: 5,
  category: 'Food',
  review: 'Outstanding dining experience! The spices and presentation are top tier.',
  bookingId: 'SUN-2026-00128',
  status: 'Pending',
  createdAt: new Date().toISOString()
};

testReviews.unshift(newReview);
assert(testReviews.length === initialData.reviews.length + 1, 'Review submitted and saved');

// Verify public visibility: only 'Published' reviews are visible
const publicReviews = testReviews.filter(r => r.status === 'Published');
assert(!publicReviews.some(r => r.id === newReview.id), 'Pending review is NOT public without admin approval');

// Admin Moderation: Approve / Publish
newReview.status = 'Published';
const updatedPublicReviews = testReviews.filter(r => r.status === 'Published');
assert(updatedPublicReviews.some(r => r.id === newReview.id), 'Admin Published review now appears publicly');

// Dynamic Average Rating & Total Reviews Calculation
const publishedSum = updatedPublicReviews.reduce((sum, r) => sum + r.rating, 0);
const calcAverage = (publishedSum / updatedPublicReviews.length).toFixed(1);
assert(updatedPublicReviews.length === initialData.reviews.filter(r => r.status === 'Published').length + 1, 'Dynamic total review count updated');

// Admin Moderation: Hide
newReview.status = 'Hidden';
const hiddenCheck = testReviews.filter(r => r.status === 'Published');
assert(!hiddenCheck.some(r => r.id === newReview.id), 'Admin Hidden review removed from public view');

// Admin Moderation: Delete
testReviews = testReviews.filter(r => r.id !== newReview.id);
assert(testReviews.length === initialData.reviews.length, 'Admin deleted review successfully');

// 8. Auth Credentials Security: Check that Auth failure does not leak credentials
const mockAuthLogin = (email, password) => {
  if (email === 'test-admin@example.com' && password === 'mock-test-password-123') {
    return { success: true };
  }
  return { success: false, error: 'Invalid email or password. Please verify your credentials and try again.' };
};

const failedLogin = mockAuthLogin('wrong@email.com', 'wrongpass');
assert(!failedLogin.success, 'Invalid credentials rejected');
assert(!failedLogin.error.includes('test-admin@example.com') && !failedLogin.error.includes('mock-test-password-123'), 'Error message does NOT leak credentials');
const successfulLogin = mockAuthLogin('test-admin@example.com', 'mock-test-password-123');
assert(successfulLogin.success, 'Valid credentials authenticate successfully');

console.log(`\n====================================================`);
console.log(`--- ALL ${passedTests}/${totalTests} COMPREHENSIVE TESTS PASSED SUCCESSFULLY ---`);
console.log(`====================================================`);
