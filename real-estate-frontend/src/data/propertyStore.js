// Durable storage for listings this browser created, and for edits made to
// listings that have no database row.
//
// Why this exists: /api/v1/properties is the real store, and anything it serves
// is still saved with a PATCH back to it. But the built-in sample listings
// (ids like `prop-1`) exist in src/data/mockProperties.js only, and listings
// posted from the Post Property form were kept in React state alone. Both were
// therefore thrown away on the next refresh, which read as "my save did not
// work".
//
// This module never invents listing data. It stores exactly the object the
// person typed in, and re-applies it on load.

const LOCAL_LISTINGS_KEY = 'properties:local:v1';
const EDITS_KEY = 'properties:edits:v1';

// Keep localStorage from growing without limit.
const MAX_LOCAL_LISTINGS = 100;
const MAX_EDITS = 300;

function hasStorage() {
  return typeof window !== 'undefined' && !!window.localStorage;
}

function readJson(key, fallback) {
  if (!hasStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed === null || typeof parsed !== 'object') return fallback;
    return parsed;
  } catch (e) {
    return fallback;
  }
}

function writeJson(key, value) {
  if (!hasStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    // Quota or private-mode failure: say nothing here, the caller still has the
    // change in state for this session.
    return false;
  }
}

function hasId(prop) {
  return prop && typeof prop === 'object' && prop.id !== undefined && prop.id !== null;
}

// ---------------------------------------------------------------------------
// Listings posted from this browser
// ---------------------------------------------------------------------------

export function getLocalListings() {
  const stored = readJson(LOCAL_LISTINGS_KEY, []);
  return Array.isArray(stored) ? stored.filter(hasId) : [];
}

export function saveLocalListing(prop) {
  if (!hasId(prop)) return false;
  const existing = getLocalListings().filter(
    (item) => String(item.id) !== String(prop.id)
  );
  return writeJson(LOCAL_LISTINGS_KEY, [prop, ...existing].slice(0, MAX_LOCAL_LISTINGS));
}

export function removeLocalListing(id) {
  const next = getLocalListings().filter((item) => String(item.id) !== String(id));
  return writeJson(LOCAL_LISTINGS_KEY, next);
}

export function isLocalListing(id) {
  if (id === undefined || id === null) return false;
  return getLocalListings().some((item) => String(item.id) === String(id));
}

// ---------------------------------------------------------------------------
// Edits to listings that have no database row
// ---------------------------------------------------------------------------

export function getPropertyEdits() {
  const stored = readJson(EDITS_KEY, {});
  return stored && typeof stored === 'object' && !Array.isArray(stored) ? stored : {};
}

export function savePropertyEdit(prop) {
  if (!hasId(prop)) return false;
  const key = String(prop.id);
  const edits = getPropertyEdits();

  // A locally posted listing is stored in full, so update it in place rather
  // than keeping the same object twice.
  if (isLocalListing(prop.id)) {
    if (edits[key]) delete edits[key];
    writeJson(EDITS_KEY, edits);
    return saveLocalListing(prop);
  }

  edits[key] = prop;

  const keys = Object.keys(edits);
  if (keys.length > MAX_EDITS) {
    const trimmed = {};
    for (const k of keys.slice(keys.length - MAX_EDITS)) trimmed[k] = edits[k];
    return writeJson(EDITS_KEY, trimmed);
  }

  return writeJson(EDITS_KEY, edits);
}

export function clearPropertyEdit(id) {
  const edits = getPropertyEdits();
  const key = String(id);
  if (!(key in edits)) return false;
  delete edits[key];
  return writeJson(EDITS_KEY, edits);
}

// ---------------------------------------------------------------------------
// Merge helpers used on load
// ---------------------------------------------------------------------------

export function applySavedEdits(list) {
  if (!Array.isArray(list)) return [];
  const edits = getPropertyEdits();
  if (!Object.keys(edits).length) return list;
  return list.map((prop) => {
    if (!hasId(prop)) return prop;
    const saved = edits[String(prop.id)];
    return saved ? { ...prop, ...saved } : prop;
  });
}

// Listings this browser posted come first, then whatever was passed in
// (live API rows and the samples). Duplicate ids keep the first copy.
export function mergeStoredProperties(list) {
  const incoming = Array.isArray(list) ? list : [];
  const combined = [...getLocalListings(), ...incoming];
  const seen = new Set();
  const deduped = [];
  for (const prop of combined) {
    if (!hasId(prop)) continue;
    const key = String(prop.id);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(prop);
  }
  return applySavedEdits(deduped);
}
