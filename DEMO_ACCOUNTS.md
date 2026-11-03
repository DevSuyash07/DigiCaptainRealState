# Teen demo logins (ek per role)

Live site ka email + password sign-in **Firebase Auth** se chalta hai
(`real-estate-frontend/src/auth/firebaseEmailAuth.js`), Express backend se
nahi -- backend Vercel par deploy nahi hota. Matlab ye teen accounts Firebase
project me bante hain, repo me koi password check nahi hota.

| Role  | Email                       | Password     | Sign in ke baad kya khulta hai            |
| ----- | --------------------------- | ------------ | ----------------------------------------- |
| Buyer | `demo.buyer@digicaptain.in` | `Buyer@1234` | BuyerDashboard: saved + recently viewed   |
| Owner | `demo.owner@digicaptain.in` | `Owner@1234` | Listings table (apni properties) + Post   |
| Agent | `demo.agent@digicaptain.in` | `Agent@1234` | Listings table (apni properties) + Post   |

Role mapping code me fixed hai (`DEMO_ROLE_EMAILS`), isliye kisi bhi browser
me in teen emails se sign in karo to sahi dashboard khulta hai -- us browser
me pehle register kiya ho ya na kiya ho, farq nahi padta.

## Pehle ek baar Firebase me ye on karna zaroori hai

Abhi Firebase project `real-estate-285dc` me **Email/Password sign-in band
hai**. Live API saaf-saaf `PASSWORD_LOGIN_DISABLED` / `OPERATION_NOT_ALLOWED`
wapas bhejti hai, isliye na naya account ban sakta hai na purana login ho
sakta hai -- kisi bhi email se nahi, sirf in teen se nahi.

1. Firebase Console -> project `real-estate-285dc`
2. Build -> Authentication -> Sign-in method
3. **Email/Password** -> Enable -> Save

Uske baad in teen accounts ko ek baar banana hai (dono tareeke theek hain):

- Live site par **New Register** tab kholo, upar wali email/password daalo,
  role picker se wahi role chuno, aur Create Account dabao. Teen baar.
- Ya DevPilot se bolo "ab bana do" -- wo Firebase ke signUp API se teenon
  bana dega.

## Dhyan rakhne wali do baatein

- `VITE_FIREBASE_*` variables Vercel me sirf **Production** par set hain,
  isliye PR ke preview URL par sign-in form "not configured" dikhayega. Asli
  test production domain par hi hoga: https://digi-captain-real-state.vercel.app
- Firebase ke authorised domains me `digi-captain-real-state.vercel.app`
  pehle se hai, to production par domain ki dikkat nahi aayegi.
