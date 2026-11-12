# Deploying this project (and why production got stuck)

## The error

```
The deployment was blocked because the commit author doesn't have
permission to create deployments for this project.
```

This is **not** a code or build problem. The code on `main` is fine. Vercel's
Git integration checks *who authored the commit*, and if that person is not a
member of the Vercel project, it refuses to deploy. Nothing in this repository
can change that check.

There are three ways out. Option A is free and permanent, and is what the
files in this repo set up.

---

## Option A - deploy through a Vercel Deploy Hook (free, permanent)

A Deploy Hook belongs to **the person who created it**, i.e. the project
owner. Calling the hook creates the deploy under the owner's permissions, so
the commit-author check never applies. A small GitHub Actions workflow calls
that hook on every push to `main`.

### One-time setup - must be done by the Vercel project owner

1. **Create the hook.**
   Vercel -> this project -> **Settings -> Git -> Deploy Hooks**
   - Name: `github-main`
   - Branch: `main`
   - Click Create, then copy the URL.
   The URL is a secret. Do not paste it into chat or commit it.

2. **Store it in GitHub.**
   This repo -> **Settings -> Secrets and variables -> Actions -> New
   repository secret**
   - Name: `VERCEL_DEPLOY_HOOK_URL`
   - Value: the URL from step 1

3. **Install the workflow.**
   Copy `.github/vercel-deploy.yml.example` to
   `.github/workflows/deploy-vercel.yml` and commit it.
   (It is shipped as `.example` because the automation that wrote this file is
   not permitted to create files inside `.github/workflows/`. Moving it is a
   rename - no edits needed.)

4. **Avoid double deploys (recommended).**
   Vercel -> Settings -> Git -> turn **off** automatic deploys for the
   production branch. Otherwise each push to `main` tries twice: once via Git
   (blocked) and once via the hook (works).

### After setup

- Every push to `main` deploys to production.
- You can also deploy without pushing: repo -> **Actions -> Deploy to Vercel
  -> Run workflow**.
- Watch the result in Vercel -> Deployments.

---

## Option B - deploy by hand, right now

Use this to get the currently merged code live in the next two minutes,
without any setup. The owner must do it from their own Vercel account.

- Vercel -> this project -> **Deployments -> Create Deployment** -> branch
  `main` -> Deploy.
- Do **not** use the **Redeploy** button on the blocked deployment. Redeploy
  rebuilds that same old commit, and a blocked deployment cannot be rebuilt.
- If a **preview** build of the latest `main` commit succeeded, open that
  deployment -> `...` menu -> **Promote to Production**. That is the fastest
  route of all.

---

## Option C - give the commit author permission

Vercel -> **Settings -> Members** -> invite the GitHub account that authors the
commits. On Vercel's Team plans this consumes a paid seat, which is why Option
A exists. Alternatively, keep the project on the owner's personal Hobby
account and have the owner author the commits.

---

## Repo layout

- `real-estate-frontend/` - the frontend app
- `real-estate-backend/` - the backend API

If the Vercel project's **Root Directory** is not set to `real-estate-frontend`
(Settings -> General -> Root Directory), fix that too - a deploy that starts
building and then fails on a missing `package.json` is this setting, not the
permission error above.
