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
import { isAdminSignInEmail, signInAdminAccount } from './adminAccount';

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

// Site ki admin email dono modes se pehle check hoti hai, taki admin kisi bhi
// browser me bina register kiye sign in kar sake (local mode me accounts sirf
// usi device par hote hain, aur Firebase me Email/Password band hai).
export const signInWithEmailPassword = async (email, password) => {
  const admin = signInAdminAccount(email, password);
  if (admin) return admin;

  return FIREBASE_EMAIL_AUTH_ENABLED
    ? firebaseSignIn(email, password)
    : signInLocalAccount(email, password);
};

export const registerWithEmailPassword = async (payload) => {
  // Admin email par register karne dena matlab ek doosra account bana dena jo
  // asli admin credential ko dhak de — isliye saaf mana kiya jaata hai.
  if (isAdminSignInEmail(payload && payload.email)) {
    throw new Error(
      'This email is the site admin account — it already exists and cannot be registered. Use Sign In with the admin password instead.'
    );
  }

  return FIREBASE_EMAIL_AUTH_ENABLED ? firebaseRegister(payload) : registerLocalAccount(payload);
};

export const sendPasswordReset = (email) =>
  FIREBASE_EMAIL_AUTH_ENABLED ? firebaseSendPasswordReset(email) : sendLocalPasswordReset(email);
