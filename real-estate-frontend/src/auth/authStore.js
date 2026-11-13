import { useState, useEffect } from 'react';
import { isAdminEmail } from '../config/featureFlags';

const STORAGE_KEY = 'authUser';
const AUTH_EVENT = 'auth:userchange';

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setStoredUser(user) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

export function clearStoredUser() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

// Database-backed sign-in ke saath aaya JWT access token. Ye authUser ke andar
// hi rakha jaata hai, isliye logout (clearStoredUser) karte hi token bhi chala
// jaata hai — koi alag key peeche nahi rehti.
export function getAuthToken() {
  const user = getStoredUser();
  return user && user.token ? String(user.token) : '';
}

// Roles that are allowed to list and manage properties. Kept in step with the
// backend's restrictTo('OWNER', 'BUILDER', 'AGENT', 'ADMIN') on property routes.
export const LISTER_ROLES = ['OWNER', 'BUILDER', 'AGENT', 'ADMIN'];

export function getUserRole(user) {
  // An admin is decided by VITE_ADMIN_EMAILS, not by what the account itself
  // claims, so the signup role picker can never hand out the admin view.
  if (user && user.email && isAdminEmail(user.email)) return 'ADMIN';
  const role = user && user.role ? String(user.role).toUpperCase() : '';
  return role || 'BUYER';
}

export function isAdminUser(user) {
  return getUserRole(user) === 'ADMIN';
}

export function isListerRole(user) {
  return LISTER_ROLES.includes(getUserRole(user));
}

// Returns the signed-in user (or null) and re-renders whenever it changes,
// including from another tab via the native storage event.
export function useAuthUser() {
  const [user, setUser] = useState(getStoredUser);

  useEffect(() => {
    const sync = () => setUser(getStoredUser());
    window.addEventListener(AUTH_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(AUTH_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return user;
}
