// Site ke feature switches — ek jagah, taki code hataane ki zaroorat na pade.
//
// PHONE_OTP_ENABLED: mobile OTP verification on/off. Abhi OFF hai, kyunki
// Firebase Phone Auth is project me billing/approval ke bina reliably SMS
// nahi bhej pa raha tha aur wo poore form ko block kar deta tha.
//
// Wapas on karne ke liye: Vercel (ya .env) me VITE_ENABLE_PHONE_OTP=true
// set karo aur redeploy karo. OTP ka poora code (Firebase + backend route)
// jaisa tha waisa hi hai — sirf ye flag use/bypass decide karta hai.

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

const truthy = (val) => {
  const s = String(val === undefined || val === null ? '' : val)
    .trim()
    .toLowerCase();
  return s === 'true' || s === '1' || s === 'on' || s === 'yes';
};

export const PHONE_OTP_ENABLED = truthy(env.VITE_ENABLE_PHONE_OTP);

export const isPhoneOtpEnabled = () => PHONE_OTP_ENABLED;

// FIREBASE_EMAIL_AUTH_ENABLED: email + password sign-in Firebase se karana hai
// ya nahi. Abhi OFF hai, do wajah se:
//   1. Firebase project me Email/Password provider band hai, isliye har register
//      aur login auth/operation-not-allowed se wapas aata tha.
//   2. Is deployment ke saath Express backend deploy nahi hota, to
//      /api/v1/auth/* bhi koi raasta nahi hai.
// OFF hone par account isi browser me banta hai (src/auth/localAccounts.js) —
// hashed password, asli error messages, aur UI me saaf likha hai ki account is
// device tak hi hai.
//
// Wapas Firebase par jaane ke liye: Firebase Console -> Authentication ->
// Sign-in method -> Email/Password enable karo, phir Vercel (ya .env) me
// VITE_ENABLE_FIREBASE_EMAIL_AUTH=true set karke redeploy karo. Firebase ka
// poora code jaisa tha waisa hi hai — sirf ye flag raasta decide karta hai.

export const FIREBASE_EMAIL_AUTH_ENABLED = truthy(env.VITE_ENABLE_FIREBASE_EMAIL_AUTH);

export const isFirebaseEmailAuthEnabled = () => FIREBASE_EMAIL_AUTH_ENABLED;
