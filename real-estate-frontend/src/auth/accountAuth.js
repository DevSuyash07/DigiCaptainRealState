// Central authentication service connecting frontend to the backend server API.
//
// By default, authentication now communicates directly with the deployed
// Express backend (/api/v1/auth/login and /api/v1/auth/register).
// If VITE_ENABLE_FIREBASE_EMAIL_AUTH=true is set, it uses Firebase.
// Local in-browser accounts are available as fallback if needed.

import { FIREBASE_EMAIL_AUTH_ENABLED, API_BASE_URL } from '../config/featureFlags';
import {
  emailAuthStatus as firebaseAuthStatus,
  signInWithEmailPassword as firebaseSignIn,
  registerWithEmailPassword as firebaseRegister,
  sendPasswordReset as firebaseSendPasswordReset
} from './firebaseEmailAuth';
import {
  localAuthStatus,
  signInLocalAccount,
  registerLocalAccount,
  sendLocalPasswordReset
} from './localAccounts';
import { isAdminSignInEmail, signInAdminAccount } from './adminAccount';

// Role (BUYER / OWNER / AGENT) persist helper
export { rememberRoleForEmail, roleForEmail } from './firebaseEmailAuth';

export const authMode = () => (FIREBASE_EMAIL_AUTH_ENABLED ? 'firebase' : 'server');

export const emailAuthStatus = () => {
  if (FIREBASE_EMAIL_AUTH_ENABLED) {
    return { ...firebaseAuthStatus(), mode: 'firebase', canResetPassword: true };
  }
  return { enabled: true, mode: 'server', canResetPassword: true, missing: [] };
};

export const isEmailAuthEnabled = () => emailAuthStatus().enabled;

const apiUrl = (path) => `${API_BASE_URL}${path}`;

export const signInWithEmailPassword = async (emailOrPhone, password) => {
  const admin = signInAdminAccount(emailOrPhone, password);
  if (admin) return admin;

  if (FIREBASE_EMAIL_AUTH_ENABLED) {
    return firebaseSignIn(emailOrPhone, password);
  }

  const res = await fetch(apiUrl('/api/v1/auth/login'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ emailOrPhone: String(emailOrPhone || '').trim(), password })
  });

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Sign-in failed (status ${res.status})`;
    throw new Error(msg);
  }

  const user = (data && data.data && data.data.user) || {};
  return {
    id: user.id,
    name: user.name || user.email || emailOrPhone,
    email: user.email || (String(emailOrPhone).includes('@') ? emailOrPhone : ''),
    phone: user.phone || (!String(emailOrPhone).includes('@') ? emailOrPhone : ''),
    role: user.role === 'USER' ? 'BUYER' : (user.role || 'BUYER'),
    accessToken: data && data.accessToken
  };
};

export const registerWithEmailPassword = async (payload) => {
  if (isAdminSignInEmail(payload && payload.email)) {
    throw new Error(
      'This email is the site admin account — it already exists and cannot be registered. Use Sign In with the admin password instead.'
    );
  }

  if (FIREBASE_EMAIL_AUTH_ENABLED) {
    return firebaseRegister(payload);
  }

  const roleInput = String((payload && payload.role) || 'BUYER').toUpperCase();
  const backendRole = roleInput === 'BUYER' ? 'USER' : roleInput;

  const requestBody = {
    name: String((payload && payload.name) || '').trim(),
    email: String((payload && payload.email) || '').trim().toLowerCase(),
    password: String((payload && payload.password) || ''),
    role: backendRole
  };

  if (payload && payload.phone && String(payload.phone).trim()) {
    requestBody.phone = String(payload.phone).trim();
  }

  const res = await fetch(apiUrl('/api/v1/auth/register'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(requestBody)
  });

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Registration failed (status ${res.status})`;
    throw new Error(msg);
  }

  const user = (data && data.data && data.data.user) || {};
  return {
    id: user.id,
    name: user.name || payload.name,
    email: user.email || payload.email,
    phone: user.phone || (payload && payload.phone) || '',
    role: user.role === 'USER' ? 'BUYER' : (user.role || (payload && payload.role) || 'BUYER'),
    accessToken: data && data.accessToken
  };
};

export const sendPasswordReset = async (email) => {
  if (FIREBASE_EMAIL_AUTH_ENABLED) {
    return firebaseSendPasswordReset(email);
  }

  const res = await fetch(apiUrl('/api/v1/auth/forgot-password'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: String(email || '').trim().toLowerCase() })
  });

  let data = null;
  try {
    data = await res.json();
  } catch (err) {
    data = null;
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `Password reset failed (status ${res.status})`;
    throw new Error(msg);
  }

  return data;
};
