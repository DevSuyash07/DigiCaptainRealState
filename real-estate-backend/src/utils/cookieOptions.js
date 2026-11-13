// Flags for the two auth cookies (accessToken / refreshToken).
//
// Why this file exists: the site and this API are deployed as two separate
// Vercel projects, so the browser treats every /api/v1 call as CROSS-SITE.
// A cross-site cookie is only stored and sent back when it carries
// SameSite=None together with Secure. The previous hard-coded
// `sameSite: 'strict'` meant the browser silently dropped both cookies in
// production: login looked like it worked, then the next page load was signed
// out again and /auth/refresh could never find a refresh token.
//
// Overrides:
//   COOKIE_SAMESITE  'lax' | 'strict' | 'none' - set this to 'lax' if the API
//                    is ever served from the same domain as the site (e.g.
//                    behind a single-domain proxy), which is stricter.
//   COOKIE_DOMAIN    only needed when sharing a cookie across subdomains.

const isProduction = () => process.env.NODE_ENV === 'production';

export const cookieBaseOptions = () => {
  const sameSite = String(
    process.env.COOKIE_SAMESITE || (isProduction() ? 'none' : 'lax')
  )
    .trim()
    .toLowerCase();

  // Browsers reject SameSite=None unless the cookie is also Secure, so this is
  // not a preference - it is the condition for the cookie existing at all.
  const secure = sameSite === 'none' ? true : isProduction();

  const options = { httpOnly: true, secure, sameSite };
  if (process.env.COOKIE_DOMAIN) options.domain = process.env.COOKIE_DOMAIN;
  return options;
};

export default cookieBaseOptions;
