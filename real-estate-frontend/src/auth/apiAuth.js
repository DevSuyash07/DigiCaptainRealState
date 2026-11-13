// Email + password accounts that live in the project's OWN DATABASE.
//
// Ye raasta real-estate-backend ke /api/v1/auth/register aur /api/v1/auth/login
// ko call karta hai, jo Prisma se MySQL me `User` row banata hai (bcrypt hashed
// password, JWT access + refresh token). Matlab account server par hota hai:
// wahi email-password kisi bhi device, kisi bhi browser se chalega, aur site ka
// data clear karne par account nahi jaata.
//
// Ye tab chalta hai jab VITE_API_BASE_URL (ya VITE_ENABLE_API_AUTH=true) set ho.
// Set na ho to accountAuth.js purana browser-only raasta use karta hai, kyunki
// bina deployed API ke database jaisa kuch bhi dikhana jhooth hoga.
//
// Yahan koi fallback, koi demo account, koi fake success nahi hai. API na mile,
// HTML bheje, ya 400/401 de -> asli error upar jaata hai aur UI use dikhata hai.

import { API_BASE_URL, apiUrl } from '../config/featureFlags';

const AUTH_PATH = '/api/v1/auth';

// UI ka role picker "BUYER" bolta hai; database enum me wahi role "USER" hai.
const ROLE_TO_API = {
  BUYER: 'USER',
  USER: 'USER',
  OWNER: 'OWNER',
  AGENT: 'AGENT',
  BUILDER: 'BUILDER',
  ADMIN: 'ADMIN'
};

export const toApiRole = (role) => ROLE_TO_API[String(role || '').trim().toUpperCase()] || 'USER';

const fromApiRole = (role) => {
  const value = String(role || '').trim().toUpperCase();
  if (!value || value === 'USER') return 'BUYER';
  return value;
};

export const apiAuthStatus = () => ({
  enabled: true,
  missing: [],
  baseUrl: API_BASE_URL || "this site's own origin"
});

const normEmail = (email) => String(email || '').trim().toLowerCase();

// Backend ka regex: /^\+?[1-9]\d{9,14}$/ (10-15 digits, optional +).
const normPhone = (phone) => {
  const raw = String(phone == null ? '' : phone).replace(/[\s()\-.]/g, '');
  if (!raw) return '';
  if (!/^\+?[1-9]\d{9,14}$/.test(raw)) {
    throw new Error(
      'That mobile number is not in a form the server accepts — use 10 digits (or +91 and the number). Leave it empty to skip it.'
    );
  }
  return raw;
};

const messageFromBody = (data, status) => {
  if (data && Array.isArray(data.errors) && data.errors.length) {
    return data.errors
      .map((item) => (item && item.field ? `${item.field}: ${item.message}` : item && item.message))
      .filter(Boolean)
      .join(' · ');
  }
  if (data && data.message) return String(data.message);
  return `The accounts API refused the request (HTTP ${status}).`;
};

const postJson = async (path, body) => {
  const url = apiUrl(`${AUTH_PATH}${path}`);

  let res;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body)
    });
  } catch (e) {
    throw new Error(
      `Could not reach the accounts API at ${url} (${
        e && e.message ? e.message : 'network error'
      }). Nothing was saved.`
    );
  }

  const raw = await res.text();
  let data = null;
  try {
    data = raw ? JSON.parse(raw) : null;
  } catch (e) {
    data = null;
  }

  // Vercel ka plain-text 404 ya frontend ka index.html — matlab API wahan deploy
  // nahi hai. Ise "login failed" bolna galat hoga, isliye saaf wajah batai jaati hai.
  if (!data || typeof data !== 'object') {
    throw new Error(
      `The accounts API at ${url} answered ${res.status} and not JSON, so no account was created or signed in. The backend is not serving that address — deploy real-estate-backend and set VITE_API_BASE_URL to its URL.`
    );
  }

  if (!res.ok || (data.status && data.status !== 'success')) {
    throw new Error(messageFromBody(data, res.status));
  }

  return data;
};

const toAccount = (data) => {
  const user = (data && data.data && data.data.user) || null;
  if (!user || !user.id) {
    throw new Error(
      'The accounts API answered without a user record, so the account state is unknown. Nothing was stored in this browser.'
    );
  }
  return {
    id: user.id,
    email: user.email || '',
    name: user.name || '',
    phone: user.phone || '',
    role: fromApiRole(user.role),
    emailVerified: Boolean(user.emailVerified),
    phoneVerified: Boolean(user.phoneVerified),
    token: (data && data.accessToken) || '',
    source: 'api',
    message: (data && data.message) || ''
  };
};

export const registerApiAccount = async ({ email, password, name, phone, role }) => {
  const mail = normEmail(email);
  const fullName = String(name || '').trim();
  const pass = String(password == null ? '' : password);

  // Server ki shartein pehle yahan check hoti hain, kyunki /register par 15 min
  // me sirf 5 koshishein milti hain — ek typo us limit ko kha jaata.
  if (!fullName || fullName.length < 2) throw new Error('Enter your full name (at least 2 characters).');
  if (!mail || mail.indexOf('@') < 1) throw new Error('That email address does not look valid.');
  if (pass.length < 8) throw new Error('Password must be at least 8 characters — that is what the server requires.');

  const payload = {
    name: fullName,
    email: mail,
    password: pass,
    role: toApiRole(role)
  };
  const mobile = normPhone(phone);
  if (mobile) payload.phone = mobile;

  return toAccount(await postJson('/register', payload));
};

export const signInApiAccount = async (emailOrPhone, password) => {
  const id = String(emailOrPhone || '').trim();
  const pass = String(password == null ? '' : password);
  if (!id) throw new Error('Enter your email address.');
  if (!pass) throw new Error('Enter your password.');

  return toAccount(
    await postJson('/login', { emailOrPhone: id.indexOf('@') > 0 ? id.toLowerCase() : id, password: pass })
  );
};

// Backend forgot-password ka link FRONTEND_URL/reset-password/:token par bhejta
// hai, aur site par abhi wo page nahi hai — to "link sent" dikhana ek dead end
// hota. Isliye reset link UI me chhupaya gaya hai (canResetPassword: false) aur
// ye function sach bolta hai.
export const sendApiPasswordReset = async () => {
  throw new Error(
    'Password reset is not wired up yet: the server can email a reset link, but the site has no /reset-password page to open it on. Ask for that page and it will be added.'
  );
};

// Signed-in account ka access token Authorization header me bhejne ke liye.
export const authHeader = (token) => (token ? { Authorization: `Bearer ${token}` } : {});
