/**
 * Format number as Indian Rupee (INR)
 * @param {number} amount
 * @returns {string}
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Generate unique 5-character verification token (e.g. A7K42)
 * @returns {string}
 */
export function generateToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // exclude ambiguous 0, O, 1, I
  let token = '';
  for (let i = 0; i < 5; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Generate unique Booking ID (e.g. SUN-2026-00128)
 * @param {number} sequenceNumber
 * @returns {string}
 */
export function generateBookingId(sequenceNumber = 1) {
  const year = new Date().getFullYear();
  const padded = String(sequenceNumber).padStart(5, '0');
  return `SUN-${year}-${padded}`;
}

/**
 * Format ISO date string into readable format (e.g. 24 Oct 2026)
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
