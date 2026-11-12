// Ek hi jagah se decide hota hai ki email + password kis raaste se chalega.
//
// Flag OFF (default) -> localAccounts.js: account isi browser me banta aur verify
// hota hai, Firebase ko chhua bhi nahi jaata. Yahi abhi live site par chalta hai,
// kyunki Firebase project me Email/Password provider band hai aur backend is
// deployment ke saath deploy nahi hota.
//
// Flag ON (Vercel/.env me VITE_ENABLE_FIREBASE_EMAIL_AUTH=true) ->
// firebaseEmailAuth.js, jo bilkul jaisa tha waisa hi pada hai. Phone OTP wale
// switch ka exactly wahi pattern hai: code hataaya nahi, sirf raasta chuna jaata
// hai.

import { FIREBASE_EMAIL_AUTH_ENABLED } from '../config/featureFlags';
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

// Role (BUYER / OWNER / AGENT) dono modes me same tarike se yaad rehta hai —
// ye helpers sirf localStorage use karte hain, Firebase ko call nahi karte.
export { rememberRoleForEmail, roleForEmail } from './firebaseEmailAuth';

export const authMode = () => (FIREBASE_EMAIL_AUTH_ENABLED ? 'firebase' : 'local');

export const emailAuthStatus = () => {
  if (FIREBASE_EMAIL_AUTH_ENABLED) {
    return { ...firebaseAuthStatus(), mode: 'firebase', canResetPassword: true };
  }
  return { ...localAuthStatus(), mode: 'local', canResetPassword: false };
};

export const isEmailAuthEnabled = () => emailAuthStatus().enabled;

export const signInWithEmailPassword = (email, password) =>
  FIREBASE_EMAIL_AUTH_ENABLED
    ? firebaseSignIn(email, password)
    : signInLocalAccount(email, password);

export const registerWithEmailPassword = (payload) =>
  FIREBASE_EMAIL_AUTH_ENABLED ? firebaseRegister(payload) : registerLocalAccount(payload);

export const sendPasswordReset = (email) =>
  FIREBASE_EMAIL_AUTH_ENABLED ? firebaseSendPasswordReset(email) : sendLocalPasswordReset(email);
