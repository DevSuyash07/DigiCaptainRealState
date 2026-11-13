# Getting `/api/v1/*` to answer JSON

## What is actually wrong

The admin dashboard shows `--` for every count and says

> the properties API answered 404 with text/plain, not JSON

That is not "there are no listings". It means **only the frontend is deployed**.
The Vercel project builds `real-estate-frontend/`, and that project's
`vercel.json` deliberately does not rewrite `/api/...` to `index.html`, so a
call to `/api/v1/properties` hits nothing and Vercel returns its own plain-text
404. `real-estate-backend/` - the Express + Prisma + MySQL API - has never been
deployed anywhere, so there is no server to answer.

Nothing in the frontend can fix this. The API has to exist somewhere first.

## Step 1 - a MySQL database

The schema is MySQL (`prisma/schema/main.prisma`). Any hosted MySQL 8 works -
PlanetScale, Railway, Aiven, or the MySQL that comes with most shared hosting.
Copy its connection string; that is `DATABASE_URL`.

Then, from a machine with the repo checked out:

```bash
cd real-estate-backend
npm install
npx prisma migrate deploy      # or: npx prisma db push   (first time, empty DB)
npm run create:admin           # creates the ADMIN row
```

## Step 2 - a second Vercel project for the API

The API cannot share the frontend's project: one Vercel project builds one root
directory. Add a new project from the same repository and set:

| Setting | Value |
| --- | --- |
| Root Directory | `real-estate-backend` |
| Framework Preset | Other |
| Build Command | leave default (`npm run build` runs `prisma generate`) |

`real-estate-backend/vercel.json` already routes every path into
`api/index.js`, which exports the Express app, so no extra config is needed.

Add the environment variables from `real-estate-backend/.env.example`. The
API will not start serving rows without `DATABASE_URL`, `JWT_ACCESS_SECRET` and
`JWT_REFRESH_SECRET`; set `FRONTEND_URL` to the site's exact origin and
`NODE_ENV=production` at the same time.

Deploy, then check the health route in a browser:

```
https://<api-project>.vercel.app/api/v1/health
```

It must return JSON. If it returns HTML or a plain-text 404, the Root Directory
is wrong. If it returns a 500, read the function log - that is almost always
`DATABASE_URL`.

## Step 3 - point the site at it

In the **frontend** Vercel project, add:

```
VITE_API_BASE_URL = https://<api-project>.vercel.app
```

No trailing slash. `src/config/featureFlags.js` reads it, and every call becomes
`https://<api-project>.vercel.app/api/v1/...`. Vite only reads env vars at build
time, so **redeploy the frontend** after adding it - the value does not reach an
existing build.

The admin dashboard then loads real rows, and the red banner disappears on its
own.

## Step 4 - the two other warnings on that page

- **Built-in admin password.** `VITE_ADMIN_PASSWORD` is unset, so the password
  committed in `src/auth/adminAccount.js` is live and anybody who can read the
  repo can sign in as the admin. Set `VITE_ADMIN_PASSWORD` in the frontend
  project and redeploy; the amber warning disappears.
- **Listings held in a browser.** While the API was unreachable, the Post
  Property form kept new listings in the visitor's own browser
  (`src/data/propertyStore.js`). Those never left that device and cannot be
  recovered server-side - they have to be posted again once the API answers.

## What this branch changed in the code

Four things that would have broken the moment the API went live on its own
domain:

1. **One Prisma client, not four.** `auth`, `property` and `propertyImage`
   controllers each called `new PrismaClient()`, so a single request could open
   several MySQL connections and a warm serverless instance never reused them.
   They now import the singleton in `src/utils/prisma.js`, which is also cached
   on `globalThis` in production now.
2. **Auth cookies that actually arrive.** Every cookie was `SameSite=Strict`.
   With the site and the API on different domains the browser drops such a
   cookie outright: login would appear to succeed and the next page load would
   be signed out. They now use `src/utils/cookieOptions.js`
   (`SameSite=None; Secure` in production, `lax` locally).
3. **A CORS check that rejects.** The origin callback ended with
   `callback(null, true)` on its failure path, so with `credentials: true` any
   website could call authenticated endpoints as a signed-in visitor. It now
   allows `FRONTEND_URL`, localhost and `*.vercel.app` only.
4. **`trust proxy`.** Behind Vercel's proxy, rate limiting counted every
   visitor as the same IP.
