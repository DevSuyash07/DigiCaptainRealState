// Email + password accounts that live in THIS browser — no Firebase, no backend.
//
// Kyun: is deployment ke saath Express backend deploy nahi hota (Vercel ka root
// real-estate-frontend hai, isliye /api/v1/auth/* se sirf index.html milta hai)
// aur Firebase project me Email/Password provider band hai
// (auth/operation-not-allowed). Dono raaste band hone par bhi normal user ko
// account banana aur sign in karna hai — isliye account isi device par banta hai,
// theek usi tarah jaise phone OTP ko flag se bypass kiya gaya tha.
//
// Yahan koi demo account, koi mock login, koi fake success nahi hai. Galat
// password, missing account, ya browser ka storage band — har case me asli error
// upar jaata hai. Password plain text me kabhi store nahi hota: per-account salt
// ke saath SHA-256 hash hi rakha jaata hai.
//
// Saaf baat (UI me bhi likha hai, chhupaya nahi): ye account sirf isi browser me
// hai. Doosre device par wahi email se dobara register karna padega, aur site ka
// data clear karne par account chala jaata hai. Server-side accounts chahiye to
// backend deploy karna hoga ya Firebase Email/Password wapas on karna hoga.

const STORE_KEY = 'localAccountsV1';

const webCrypto = () => (typeof crypto !== 'undefined' && crypto ? crypto : null);

const subtleCrypto = () => {
  const c = webCrypto();
  return c && c.subtle ? c : null;
};

// Kya is browser me account banaya ja sakta hai? (private mode / http page par
// storage ya crypto.subtle nahi milta — tab UI ko sach batana hai.)
export const localAuthStatus = () => {
  const missing = [];
  try {
    const probe = '__localAuthProbe';
    localStorage.setItem(probe, '1');
    localStorage.removeItem(probe);
  } catch (e) {
    missing.push('browser storage');
  }
  if (!subtleCrypto()) missing.push('secure password hashing (needs an https page)');
  return { enabled: missing.length === 0, missing };
};

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    return {};
  }
};

const writeAll = (map) => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(map));
  } catch (e) {
    throw new Error(
      'This browser would not save the account (storage is full or blocked — private browsing does this). Nothing was created.'
    );
  }
};

const normEmail = (email) => String(email || '').trim().toLowerCase();

const toHex = (bytes) =>
  Array.from(new Uint8Array(bytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

const randomHex = (size) => {
  const c = webCrypto();
  if (!c || !c.getRandomValues) {
    throw new Error(
      'This browser cannot generate the random values a secure account needs, so nothing was created.'
    );
  }
  return toHex(c.getRandomValues(new Uint8Array(size)));
};

const hashPassword = async (password, salt) => {
  const c = subtleCrypto();
  if (!c) {
    throw new Error(
      'This browser cannot hash the password securely (crypto.subtle needs an https page), so sign-in was not attempted.'
    );
  }
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await c.subtle.digest('SHA-256', bytes);
  return toHex(digest);
};

const toAccount = (account) => ({
  id: account.id,
  email: account.email,
  name: account.name || ''
});

export const registerLocalAccount = async ({ email, password, name }) => {
  const mail = normEmail(email);
  if (!mail || mail.indexOf('@') < 1) {
    throw new Error('That email address does not look valid.');
  }
  const pass = String(password == null ? '' : password);
  if (!pass) throw new Error('Enter a password.');
  if (pass.length < 6) {
    throw new Error('Password is too short — use at least 6 characters.');
  }

  const all = readAll();
  if (all[mail]) {
    throw new Error('This email already has an account in this browser. Use Sign In instead.');
  }

  const salt = randomHex(16);
  const passwordHash = await hashPassword(pass, salt);
  const account = {
    id: `local-${randomHex(8)}`,
    email: mail,
    name: String(name || '').trim(),
    salt,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  writeAll({ ...all, [mail]: account });
  return toAccount(account);
};

export const signInLocalAccount = async (email, password) => {
  const mail = normEmail(email);
  const account = readAll()[mail];
  if (!account) {
    throw new Error(
      'No account exists for this email in this browser. Tap “New Register” first — accounts are stored on this device, not on a server.'
    );
  }
  const passwordHash = await hashPassword(String(password == null ? '' : password), account.salt);
  if (passwordHash !== account.passwordHash) {
    throw new Error('Email or password is wrong.');
  }
  return toAccount(account);
};

// Browser-only mode me reset link bhejne ke liye koi mail service nahi hai, aur
// jhoothi "link sent" dikhana sabse bura jawab hota. Isliye seedha sach:
export const sendLocalPasswordReset = async () => {
  throw new Error(
    'A reset link cannot be sent while sign-in runs in this browser only — there is no mail service behind it. Turn Firebase email sign-in back on for reset emails.'
  );
};

export const hasLocalAccount = (email) => Boolean(readAll()[normEmail(email)]);
