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
