// Email + password sign-in that actually works on the live site.
//
// Kyun Firebase: is project ka Express backend frontend ke saath deploy nahi
// hota (Vercel sirf real-estate-frontend build karta hai), isliye
// /api/v1/auth/login live site par kabhi chalta hi nahi -- wahan se sirf
// index.html wapas aata hai aur login "fail" dikhta hai. Firebase Email/
// Password sign-in poora browser me chalta hai aur free Spark plan me aata hai
// (Phone OTP ki tarah billing nahi maangta).
//
// Yahan koi dummy account, koi mock login nahi hai. Config missing ho ya
// Firebase mana kar de to asli error upar jaata hai, chupaya nahi jaata.

const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || '',
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: env.VITE_FIREBASE_PROJECT_ID || '',
  appId: env.VITE_FIREBASE_APP_ID || '',
  // Optional; email/password auth inke bina bhi chalta hai.
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || undefined
};

const REQUIRED_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId'];

export const emailAuthStatus = () => {
  const missing = REQUIRED_KEYS.filter((key) => !firebaseConfig[key]);
  return { enabled: missing.length === 0, missing };
};

export const isEmailAuthEnabled = () => emailAuthStatus().enabled;

let authPromise = null;

// Same Firebase app instance as the phone-OTP module, so initialising twice
// cannot happen.
const loadAuth = async () => {
  if (!authPromise) {
    authPromise = (async () => {
      const [{ initializeApp, getApps, getApp }, authModule] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth')
      ]);
      const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      const auth = authModule.getAuth(app);
      auth.useDeviceLanguage();
      return { auth, authModule };
    })();
  }
  return authPromise;
};

const FRIENDLY_ERRORS = {
  'auth/invalid-email': 'That email address does not look valid.',
  'auth/missing-password': 'Enter your password.',
  'auth/weak-password': 'Password is too short — use at least 6 characters.',
  'auth/email-already-in-use': 'This email already has an account. Use Sign In instead.',
  'auth/invalid-credential': 'Email or password is wrong.',
  'auth/invalid-login-credentials': 'Email or password is wrong.',
  'auth/wrong-password': 'Email or password is wrong.',
  'auth/user-not-found': 'No account exists for this email yet. Register first.',
  'auth/user-disabled': 'This account has been disabled in the Firebase project.',
  'auth/too-many-requests':
    'Too many attempts from this device. Firebase has paused it for a while — try again later.',
  'auth/operation-not-allowed':
    'Email/Password sign-in is switched off in the Firebase project. Enable Authentication → Sign-in method → Email/Password.',
  'auth/unauthorized-domain':
    'This domain is not in the Firebase project’s authorised domains, so sign-in was refused.',
  'auth/network-request-failed': 'Could not reach Firebase. Check the connection and try again.'
};

const toError = (err) => {
  const code = err && err.code ? err.code : '';
  const message = FRIENDLY_ERRORS[code] || (err && err.message) || 'Sign-in failed';
  const out = new Error(message);
  out.code = code;
  return out;
};

const requireConfig = () => {
  const { enabled, missing } = emailAuthStatus();
  if (!enabled) {
    throw new Error(
      `Email sign-in is not configured on this deployment. Missing: ${missing.join(', ')}`
    );
  }
};

const toAccount = (user) => ({
  id: user && user.uid ? user.uid : null,
  name: (user && user.displayName) || '',
  email: (user && user.email) || ''
});

export const signInWithEmailPassword = async (email, password) => {
  requireConfig();
  const { auth, authModule } = await loadAuth();
  try {
    const res = await authModule.signInWithEmailAndPassword(
      auth,
      String(email).trim(),
      String(password)
    );
    return toAccount(res.user);
  } catch (err) {
    throw toError(err);
  }
};

export const registerWithEmailPassword = async ({ email, password, name }) => {
  requireConfig();
  const { auth, authModule } = await loadAuth();
  try {
    const res = await authModule.createUserWithEmailAndPassword(
      auth,
      String(email).trim(),
      String(password)
    );
    const displayName = String(name || '').trim();
    if (displayName && res.user) {
      await authModule.updateProfile(res.user, { displayName });
    }
    const account = toAccount(res.user);
    return { ...account, name: displayName || account.name };
  } catch (err) {
    throw toError(err);
  }
};

export const sendPasswordReset = async (email) => {
  requireConfig();
  const { auth, authModule } = await loadAuth();
  try {
    await authModule.sendPasswordResetEmail(auth, String(email).trim());
    return { sent: true };
  } catch (err) {
    throw toError(err);
  }
};

// Role (BUYER / OWNER / AGENT) pehle backend me store hota tha; live site par
// backend nahi hai, isliye registration ka chuna hua role isi browser me email
// ke saath yaad rakha jaata hai, taki agli baar sign in par sahi dashboard
// khule. Firebase ka uid hi account ki asli pehchaan rehti hai.
const ROLE_KEY = 'authRolesByEmail';

// Teen fixed accounts, ek-ek role ke liye: buyer, owner, agent. Yahan sirf
// role mapping hai -- password Firebase Auth me rehta hai, repo me nahi, aur
// ye accounts bhi asli Firebase accounts hi hain (koi mock login nahi).
// Fayda: in emails se sign in karte hi sahi dashboard khulta hai, chahe us
// browser me pehle register kiya ho ya na kiya ho.
export const DEMO_ROLE_EMAILS = {
  'demo.buyer@digicaptain.in': 'BUYER',
  'demo.owner@digicaptain.in': 'OWNER',
  'demo.agent@digicaptain.in': 'AGENT'
};

const readRoleMap = () => {
  try {
    const raw = localStorage.getItem(ROLE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
};

export const rememberRoleForEmail = (email, role) => {
  if (!email || !role) return;
  try {
    const map = readRoleMap();
    map[String(email).trim().toLowerCase()] = String(role).toUpperCase();
    localStorage.setItem(ROLE_KEY, JSON.stringify(map));
  } catch (e) {}
};

export const roleForEmail = (email) => {
  if (!email) return '';
  const key = String(email).trim().toLowerCase();
  // Fixed demo accounts ka role inhi ka rehta hai -- isi liye wo "user
  // specific" hain; baaki sab emails ke liye browser ki yaad dekhi jaati hai.
  if (DEMO_ROLE_EMAILS[key]) return DEMO_ROLE_EMAILS[key];
  const map = readRoleMap();
  return map[key] || '';
};
