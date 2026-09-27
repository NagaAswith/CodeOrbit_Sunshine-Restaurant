// Local Development Rate Limit Reset Helper
// This script clears any locked out IP addresses in the running local dev server.
// In production, the reset endpoint is disabled.

async function resetRateLimits() {
  try {
    const res = await fetch('http://localhost:5173/api/dev/reset-rate-limit', {
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      const data = await res.json();
      console.log('✓ SUCCESS:', data.message || 'Development rate limits have been cleared.');
      process.exit(0);
    } else {
      const err = await res.json().catch(() => ({}));
      console.error('✗ ERROR:', err.error || `HTTP ${res.status}`);
      process.exit(1);
    }
  } catch (err) {
    console.error('✗ Connection failed: Is the dev server running on http://localhost:5173/?', err.message);
    process.exit(1);
  }
}

resetRateLimits();
