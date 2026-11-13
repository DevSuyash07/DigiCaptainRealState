// The site's provisioned admin sign-in.
//
// Kyun ye file hai: admin view ka gate `VITE_ADMIN_EMAILS` tha, aur is
// deployment par wo env var set hi nahi hai — matlab koi bhi email admin nahi
// thi, aur /dashboard ka platform-wide view kholne ka koi rasta hi nahi tha.
// Yahan ek asli admin credential define hai, jo kisi bhi browser me, bina
// register kiye, seedha Sign In se chalta hai.
//
// Ye koi demo/mock login nahi hai: galat password par asli error aata hai, aur
// ye account koi listing, owner ya count nahi banata — admin table ab bhi sirf
// /api/v1/properties se aata hai.
//
// IMPORTANT — password badalna: niche ka DEFAULT_ADMIN_PASSWORD repo me likha
// hai, isliye jo bhi repo dekh sakta hai wo ise jaanta hai. Vercel (ya .env) me
// VITE_ADMIN_PASSWORD set karte hi wahi password chalega aur default band ho
// jaayega. Jab tak default chal raha hai, admin screen par warning dikhti hai.
//
// Email badalni ho to VITE_ADMIN_EMAIL set karein (ya VITE_ADMIN_EMAILS me
// apni email add karein — wo list bhi admin hi rehti hai).

import { BUILTIN_ADMIN_EMAIL } from '../config/featureFlags';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

// Repo me likha default — pehle sign-in ke liye. Isko VITE_ADMIN_PASSWORD se
// turant override kar dena chahiye.
export const DEFAULT_ADMIN_PASSWORD = 'DigiCaptain@2026';

const configuredPassword = String(env.VITE_ADMIN_PASSWORD || '').trim();

export const ADMIN_EMAIL = BUILTIN_ADMIN_EMAIL;
export const ADMIN_PASSWORD = configuredPassword || DEFAULT_ADMIN_PASSWORD;

// UI ko sach batane ke liye: default password abhi tak badla nahi gaya.
export const USING_DEFAULT_ADMIN_PASSWORD = !configuredPassword;

const normEmail = (email) => String(email || '').trim().toLowerCase();

export const isAdminSignInEmail = (email) => normEmail(email) === ADMIN_EMAIL;

// Returns the admin user object when the credential matches, null when the
// email is not the admin one (so the caller falls through to the normal
// engine), and throws when the email IS the admin one but the password is not.
export const signInAdminAccount = (email, password) => {
  if (!isAdminSignInEmail(email)) return null;

  const pass = String(password == null ? '' : password);
  if (pass !== ADMIN_PASSWORD) {
    throw new Error(
      'Wrong password for the admin account. It is set by VITE_ADMIN_PASSWORD on this deployment; if that variable is not set, the built-in default from src/auth/adminAccount.js applies.'
    );
  }

  return {
    id: 'admin-builtin',
    email: ADMIN_EMAIL,
    name: 'Site Admin',
    role: 'ADMIN'
  };
};
