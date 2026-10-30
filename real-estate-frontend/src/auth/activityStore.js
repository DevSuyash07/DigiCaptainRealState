import { useState, useEffect } from 'react';

// Records what the signed-in person actually did in THIS browser, keyed by their
// email, so the buyer dashboard can show real recently-viewed listings.
// The backend has no views or enquiries endpoint yet, so this is deliberately
// per-browser only and the dashboard says so rather than implying server history.

const MAX_VIEWS = 12;
const KEY_PREFIX = 'activity:views:';
const ACTIVITY_EVENT = 'activity:change';

function keyFor(email) {
  return KEY_PREFIX + String(email || 'guest').toLowerCase();
}

export function getRecentViews(email) {
  try {
    const raw = localStorage.getItem(keyFor(email));
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch (e) {
    return [];
  }
}

export function recordPropertyView(email, property) {
  if (!email || !property || !property.id) return;
  try {
    const existing = getRecentViews(email).filter(
      (v) => String(v.id) !== String(property.id)
    );
    const entry = {
      id: property.id,
      title: property.title || 'Untitled listing',
      locality: property.locality || '',
      city: property.city || '',
      price: property.price || 0,
      purpose: property.purpose || 'buy',
      slug: property.slug || '',
      viewedAt: new Date().toISOString()
    };
    localStorage.setItem(
      keyFor(email),
      JSON.stringify([entry, ...existing].slice(0, MAX_VIEWS))
    );
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(ACTIVITY_EVENT));
    }
  } catch (e) {}
}

export function useRecentViews(email) {
  const [views, setViews] = useState(() => getRecentViews(email));

  useEffect(() => {
    const sync = () => setViews(getRecentViews(email));
    sync();
    window.addEventListener(ACTIVITY_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(ACTIVITY_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [email]);

  return views;
}
