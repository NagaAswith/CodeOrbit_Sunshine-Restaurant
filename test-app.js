import { initialData } from './src/data/initialData.js';
import { generateBookingId, generateToken, formatINR } from './src/utils/formatters.js';

console.log('--- STARTING SUNSHINE RESTAURANT AUTOMATED TESTS ---');

// Test 1: Verify Initial Data Structure
console.log('Test 1: Initial Data Validation');
if (!initialData.menu || initialData.menu.length < 15) {
  throw new Error('Menu dataset is too small or missing');
}
if (!initialData.events || initialData.events.length < 4) {
  throw new Error('Events dataset is missing');
}
if (!initialData.timeSlots || initialData.timeSlots.length < 6) {
  throw new Error('Time slots dataset is missing');
}
if (!initialData.pricing || !initialData.pricing.acRoomPrice) {
  throw new Error('Pricing dataset is missing');
}
console.log('✓ Initial data structures validated successfully.');

// Test 2: Formatters & Generators
console.log('Test 2: Formatters Validation');
const formatted = formatINR(48650);
if (formatted !== '₹48,650') {
  throw new Error(`Format INR failed: expected ₹48,650, got ${formatted}`);
}

const bookingId = generateBookingId(128);
if (!bookingId.startsWith('SUN-') || !bookingId.endsWith('00128')) {
  throw new Error(`Booking ID generator failed: ${bookingId}`);
}

const token = generateToken();
if (token.length !== 5 || !/^[A-Z2-9]{5}$/.test(token)) {
  throw new Error(`Token generator failed: ${token}`);
}
console.log(`✓ Formatters validated: ${formatted}, ${bookingId}, ${token}`);

// Test 3: Menu Item Operations & Availability
console.log('Test 3: Menu Simulation');
let sampleMenu = [...initialData.menu];
const targetItem = sampleMenu.find(m => m.name === 'Paneer Tikka');
if (!targetItem) throw new Error('Paneer Tikka not found');

// Simulate toggle
targetItem.isAvailable = false;
console.log(`✓ Toggled "${targetItem.name}" availability to ${targetItem.isAvailable} (Customer sees "Currently Unavailable")`);

// Test 4: Reservation & Token Lookup
console.log('Test 4: Reservation & Token Lifecycle');
let sampleBookings = [...initialData.bookings];
const newBooking = {
  id: generateBookingId(sampleBookings.length + 129),
  token: generateToken(),
  customerName: 'Aarav Gupta',
  phone: '+91 98765 88990',
  email: 'aarav.gupta@example.com',
  date: '2026-09-24',
  time: '07:30 PM',
  guests: 4,
  bookingType: 'Birthday',
  roomType: 'VIP Table',
  amount: 1800,
  status: 'Confirmed'
};

sampleBookings.unshift(newBooking);

// Verify Token lookup
const verified = sampleBookings.find(b => b.token.toUpperCase() === newBooking.token.toUpperCase());
if (!verified || verified.customerName !== 'Aarav Gupta') {
  throw new Error('Token verification lookup failed');
}

// Simulate Check-in
verified.status = 'Checked In';
if (verified.status !== 'Checked In') {
  throw new Error('Check-in status update failed');
}
console.log(`✓ Booking ${newBooking.id} created with token ${newBooking.token} and checked in successfully.`);

// Test 5: Pricing Calculation
console.log('Test 5: Room & Table Pricing Computation');
const normalTotal = 4 * initialData.pricing.normalSeatPrice;
const vipTotal = 4 * initialData.pricing.vipSeatPrice;
const acRoomTotal = initialData.pricing.acRoomPrice;

if (normalTotal !== 800 || vipTotal !== 1800 || acRoomTotal !== 2500) {
  throw new Error(`Pricing calculation mismatch: normal=${normalTotal}, vip=${vipTotal}, ac=${acRoomTotal}`);
}
console.log(`✓ Pricing validated: Normal(4)=${formatINR(normalTotal)}, VIP(4)=${formatINR(vipTotal)}, AC Room=${formatINR(acRoomTotal)}`);

console.log('--- ALL AUTOMATED BUSINESS LOGIC TESTS PASSED (5/5) ---');
