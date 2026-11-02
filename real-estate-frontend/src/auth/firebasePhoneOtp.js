// Real phone OTP straight from the browser, via Firebase Phone Authentication.
//
// Kyun Firebase: is project ka backend Vercel par deploy nahi hota (sirf
// frontend build hota hai), isliye /api/v1/auth/phone-otp/* live site par
// kabhi chalta hi nahi. Firebase Phone Auth poora browser me chalta hai,
// free tier me aata hai, aur India me DLT / sender-id approval ka wait nahi
// hai -- yani OTP aaj se asli phone par jaata hai.
//
// Yahan koi mock OTP nahi hai. Agar config missing hai to ye module khud ko
// disabled batata hai aur caller purana backend route use karta hai; agar
// bhejne me koi error aata hai to wo error upar jaata hai, chupaya nahi jaata.

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
  // Optional, Firebase console inhe deta hai; phone auth inke bina bhi chalta hai.
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined
};

const REQUIRED_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId'];

export const firebaseOtpStatus = () => {
  const missing = REQUIRED_KEYS.filter((key) => !firebaseConfig[key]);
  return { enabled: missing.length === 0, missing };
};

export const isFirebaseOtpEnabled = () => firebaseOtpStatus().enabled;

const RECAPTCHA_CONTAINER_ID = 'firebase-otp-recaptcha';

let authPromise = null;
let recaptchaVerifier = null;
let pendingConfirmation = null;

const loadAuth = async () => {
  if (!authPromise) {
    authPromise = (async () => {
      const [{ initializeApp, getApps, getApp }, authModule] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth')
      ]);
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const auth = authModule.getAuth(app);
      // SMS ki bhasha browser ke hisaab se.
      auth.useDeviceLanguage();
      return { auth, authModule };
    })();
  }
  return authPromise;
};

const ensureRecaptchaContainer = () => {
  let el = document.getElementById(RECAPTCHA_CONTAINER_ID);
  if (!el) {
    el = document.createElement('div');
    el.id = RECAPTCHA_CONTAINER_ID;
    document.body.appendChild(el);
  }
  return el;
};

const ensureRecaptcha = async () => {
  const { auth, authModule } = await loadAuth();
  if (!recaptchaVerifier) {
    ensureRecaptchaContainer();
    recaptchaVerifier = new authModule.RecaptchaVerifier(auth, RECAPTCHA_CONTAINER_ID, {
      size: 'invisible'
    });
    await recaptchaVerifier.render();
  }
  return recaptchaVerifier;
};

// Ek fail hua reCAPTCHA dobara use nahi hota, warna resend chup-chaap fail hota hai.
const clearRecaptcha = () => {
  if (recaptchaVerifier) {
    try {
      recaptchaVerifier.clear();
    } catch (e) {
      /* already gone */
    }
    recaptchaVerifier = null;
  }
  const el = document.getElementById(RECAPTCHA_CONTAINER_ID);
  if (el) el.innerHTML = '';
};

const FRIENDLY_ERRORS = {
  'auth/invalid-phone-number': 'That mobile number does not look valid. Enter 10 digits.',
  'auth/missing-phone-number': 'Enter a mobile number first.',
  'auth/too-many-requests':
    'Too many OTP attempts from this device. Firebase has paused it for a while — try again later.',
  'auth/quota-exceeded': 'The OTP quota for this project is used up for now.',
  'auth/operation-not-allowed':
    'Phone sign-in is switched off in the Firebase project. Enable Authentication → Sign-in method → Phone.',
  'auth/unauthorized-domain':
    'This domain is not in the Firebase project’s authorised domains, so Firebase refused to send the OTP.',
  'auth/captcha-check-failed':
    'The reCAPTCHA check failed on this domain. Add the site domain to the Firebase authorised domains.',
  'auth/invalid-app-credential':
    'Firebase rejected this app’s credentials — check the VITE_FIREBASE_* values.',
  'auth/invalid-verification-code': 'That OTP is not correct. Check the SMS and try again.',
  'auth/code-expired': 'That OTP has expired. Send a new one.'
};

const toError = (err) => {
  const code = err && err.code ? err.code : '';
  const message = FRIENDLY_ERRORS[code] || (err && err.message) || 'OTP request failed';
  const out = new Error(message);
  out.code = code;
  return out;
};

// `digits` = bare 10-digit Indian mobile number (UI +91 dikhata hai).
export const sendFirebaseOtp = async (digits) => {
  const { enabled, missing } = firebaseOtpStatus();
  if (!enabled) {
    throw new Error(`Firebase OTP is not configured. Missing: ${missing.join(', ')}`);
  }

  const { auth, authModule } = await loadAuth();
  const verifier = await ensureRecaptcha();

  try {
    pendingConfirmation = await authModule.signInWithPhoneNumber(
      auth,
      `+91${String(digits).slice(-10)}`,
      verifier
    );
    return { sent: true };
  } catch (err) {
    clearRecaptcha();
    pendingConfirmation = null;
    throw toError(err);
  }
};

export const confirmFirebaseOtp = async (code) => {
  if (!pendingConfirmation) {
    throw new Error('Send the OTP again — this verification session has ended.');
  }
  try {
    const result = await pendingConfirmation.confirm(String(code).trim());
    // Backend baad me isko firebase-admin se verify kar sakta hai.
    const idToken = result && result.user ? await result.user.getIdToken() : null;
    pendingConfirmation = null;
    clearRecaptcha();
    return { verified: true, idToken };
  } catch (err) {
    throw toError(err);
  }
};

export const resetFirebaseOtp = () => {
  pendingConfirmation = null;
  clearRecaptcha();
};
