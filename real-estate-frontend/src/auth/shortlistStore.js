// Persistent storage for shortlisted / wishlisted properties.
// Keyed by user email (or 'guest' when not signed in) so buyer wishlists
// persist across browser refreshes and sync between tabs.

const SHORTLIST_KEY_PREFIX = 'activity:shortlist:';
const CACHE_KEY_PREFIX = 'activity:shortlist:cache:';
export const SHORTLIST_EVENT = 'shortlist:change';

// Initial sample properties to seed guest storage if never set, matching
// the default sample properties previously shown in App.jsx.
export const DEFAULT_INITIAL_SHORTLIST = ['prop-1', 'prop-3'];

function keyFor(email) {
  return SHORTLIST_KEY_PREFIX + String(email || 'guest').toLowerCase();
}

function cacheKeyFor(email) {
  return CACHE_KEY_PREFIX + String(email || 'guest').toLowerCase();
}

export function getStoredShortlist(email) {
  if (typeof window === 'undefined') return DEFAULT_INITIAL_SHORTLIST;
  try {
    const raw = localStorage.getItem(keyFor(email));
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((id) => (typeof id === 'number' ? id : String(id)));
      }
    }
    // If not logged in and never set, check legacy key
    if (!email || email === 'guest') {
      const legacy = localStorage.getItem('shortlistIds');
      if (legacy !== null) {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) {
          return parsed.map((id) => (typeof id === 'number' ? id : String(id)));
        }
      }
      return DEFAULT_INITIAL_SHORTLIST;
    }
    // If user is logged in but has no shortlist yet, check guest shortlist to migrate
    const guestRaw = localStorage.getItem(keyFor('guest'));
    if (guestRaw !== null) {
      const parsed = JSON.parse(guestRaw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localStorage.setItem(keyFor(email), JSON.stringify(parsed));
        const guestCache = localStorage.getItem(cacheKeyFor('guest'));
        if (guestCache) {
          localStorage.setItem(cacheKeyFor(email), guestCache);
        }
        return parsed.map((id) => (typeof id === 'number' ? id : String(id)));
      }
    }
    return DEFAULT_INITIAL_SHORTLIST;
  } catch (e) {
    return DEFAULT_INITIAL_SHORTLIST;
  }
}

export function getCachedProperties(email) {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(cacheKeyFor(email));
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function saveStoredShortlist(email, ids, propertiesMap = {}) {
  if (typeof window === 'undefined') return;
  try {
    const normalizedIds = Array.from(
      new Set(ids.map((id) => (typeof id === 'number' ? id : String(id))))
    );
    localStorage.setItem(keyFor(email), JSON.stringify(normalizedIds));

    // Update cached property objects
    const currentCache = getCachedProperties(email);
    const updatedCache = { ...currentCache };
    for (const [id, prop] of Object.entries(propertiesMap)) {
      if (prop && normalizedIds.some((item) => String(item) === String(id))) {
        updatedCache[String(id)] = prop;
      }
    }
    for (const id of Object.keys(updatedCache)) {
      if (!normalizedIds.some((item) => String(item) === String(id))) {
        delete updatedCache[id];
      }
    }
    localStorage.setItem(cacheKeyFor(email), JSON.stringify(updatedCache));

    window.dispatchEvent(new Event(SHORTLIST_EVENT));
  } catch (e) {}
}
