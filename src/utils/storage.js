const STORAGE_KEY = 'sunshine_restaurant_db_v1';

export function getStoredData(fallbackData) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackData));
      return fallbackData;
    }
    const parsed = JSON.parse(raw);
    // ensure any missing keys from updates are merged
    return { 
      ...fallbackData, 
      ...parsed,
      settings: { ...fallbackData.settings, ...(parsed.settings || {}) },
      reviews: parsed.reviews && Array.isArray(parsed.reviews) && parsed.reviews.length > 0 
        ? parsed.reviews 
        : (fallbackData.reviews || [])
    };
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return fallbackData;
  }
}

export function saveStoredData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    // Trigger custom event for intra-window sync
    window.dispatchEvent(new CustomEvent('sunshine_db_updated', { detail: data }));
  } catch (error) {
    console.error('Failed to write to localStorage:', error);
  }
}

export function resetStoredData(fallbackData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackData));
    window.dispatchEvent(new CustomEvent('sunshine_db_updated', { detail: fallbackData }));
    return fallbackData;
  } catch (error) {
    console.error('Failed to reset localStorage:', error);
    return fallbackData;
  }
}
