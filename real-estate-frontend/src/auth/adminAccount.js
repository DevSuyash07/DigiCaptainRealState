// The site's admin sign-in helper.
//
// Hardcoded password has been removed. Authentication now runs against the
// backend server (/api/v1/auth/login) where the admin account is stored
// securely in MySQL with a bcrypt-hashed password.
// If VITE_ADMIN_PASSWORD is set in the environment, it can still override locally.

import { BUILTIN_ADMIN_EMAIL } from '../config/featureFlags';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

export const DEFAULT_ADMIN_PASSWORD = '';

const configuredPassword = String(env.VITE_ADMIN_PASSWORD || '').trim();

export const ADMIN_EMAIL = BUILTIN_ADMIN_EMAIL;
export const ADMIN_PASSWORD = configuredPassword;

export const USING_DEFAULT_ADMIN_PASSWORD = false;

const normEmail = (email) => String(email || '').trim().toLowerCase();

export const isAdminSignInEmail = (email) => normEmail(email) === ADMIN_EMAIL;

// Returns the admin user object when env password matches, or null so the
// sign-in falls through to the server API (/api/v1/auth/login).
export const signInAdminAccount = (email, password) => {
  if (!isAdminSignInEmail(email) || !ADMIN_PASSWORD) return null;

  const pass = String(password == null ? '' : password);
  if (pass !== ADMIN_PASSWORD) {
    throw new Error('Wrong password for the admin account.');
  }

  return {
    id: 'admin-builtin',
    email: ADMIN_EMAIL,
    name: 'Site Admin',
    role: 'ADMIN'
  };
};
