# Netlify Deployment Readiness — HeatShield

**Project:** HeatShield — Urban Heat Exposure Analysis and Cooling Intelligence Platform  
**Team:** TF-141  
**Review date:** 28 October 2026  
**Repository:** `exobhavinss-sketch/TF-141-Heatshield`  
**Status:** **READY FOR NETLIFY CONFIGURATION; NOT DEPLOYED.** The production build and local production-preview checks passed. Netlify account configuration, a Netlify-hosted deploy, and authenticated production-domain flows have not been tested.

## Summary

HeatShield is a React 18/Vite 5 client-side application using React Router, Supabase JS, Recharts, and Leaflet/React Leaflet. It has no Netlify Functions or application server. The public, read-only master relation and authenticated user features use the existing Supabase project directly. EDADV results come from a compact generated JSON summary and imported chart images; the full 150,000-row CSV is not included in the frontend build.

`netlify.toml` defines `npm run build`, publishes `dist`, pins the build runtime to Node.js 24, provides one non-forced SPA rewrite, adds compatible security headers, and caches Vite's hashed assets for one year. The project already has a root `package-lock.json` (lockfile version 3), and the build requires no Netlify plugin or new dependency.

## Changed files

- `netlify.toml` — build/runtime settings, SPA rewrite, response headers, and hashed-asset caching.
- `public/_redirects` — retained as a comment pointing to the single fallback rule in `netlify.toml` to prevent duplicate rules.
- `.env.example` — safe blank public placeholders and optional frontend variable names only.
- `.gitignore` — added `.netlify/`; existing environment, `dist`, and `node_modules` exclusions remain.
- `src/utils/authRedirect.js` — browser auth links now return to the origin that initiated the flow, including Netlify and deploy-preview hosts.
- `index.html` — clarified academic/synthetic description and added theme-color and basic social metadata; existing title, language, viewport, and favicon remain.
- `README.md` — added Netlify setup, environment, Supabase URL configuration, route verification, error handling, and rollback instructions; corrected deployment and dataset statements that had become stale.
- `edadv/reports/netlify_deployment_readiness.md` — this report.

No dependency, lockfile, Supabase schema/policy, user data, domain, DNS, or Netlify account setting was changed. The existing local `.env` was not printed or added to Git.

The shared worktree also contains prior Phase 1–5 EDADV reports/figures, application updates, and a pending local migration file. Those pre-existing changes were preserved; this Netlify pass did not regenerate the master dataset or alter the EDADV analysis outputs.

## Build and generated assets

**PASS** — `rtk npm run build` completed using Vite 5.4.21. It transformed 2,431 modules and exited 0. Local runtime versions were Node.js 24.18.0 and npm 11.16.0; `package.json` declares Node.js `>=18.0.0`.

The build emitted no Vite chunk-size warnings. Vite's configured warning threshold is 650 kB. Largest generated JavaScript chunks were:

| Chunk | Raw | Gzip |
|---|---:|---:|
| `vendor-charts` | 354.84 kB | 98.43 kB |
| `vendor-supabase` | 223.76 kB | 58.63 kB |
| `edadvSummary` | 197.81 kB | 31.85 kB |
| `vendor-framework` | 202.54 kB | 63.97 kB |

The production output contained 38 files, including 30 files under `dist/assets/`, lazy page chunks, 2 CSS assets, the bundled EDADV summary, 4 imported EDADV chart images, and `branding/heatshield-icon.svg`. No CSV was present. The Vite-generated JavaScript/CSS/image filenames are content-hashed. Google Fonts and Material Symbols are referenced from Google Fonts and are not bundled locally; if that provider is unavailable, the browser uses the CSS fallback fonts.

Route-level pages already use React `lazy()`/`Suspense`. Existing manual vendor splitting keeps the map, charts, Supabase, and framework chunks separate. These controls were preserved; no new bundling rules were needed.

## Netlify routing and security configuration

**PASS — static configuration review.** Python 3.11 `tomllib` parsed `netlify.toml` and confirmed:

- Build command `npm run build`, publish directory `dist`, Node.js version `24`.
- One `/*` → `/index.html` rewrite with status `200`; `force` is omitted. Per Netlify's redirect behavior, existing files take precedence, so real assets are not shadowed. The rule is last/only in the Netlify redirect configuration.
- The React router's unknown-path behavior remains its existing redirect to `/`.
- `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`, and a `Permissions-Policy` that disables camera/microphone while allowing same-origin geolocation for the existing location-entry feature.
- `Content-Security-Policy: frame-ancestors 'none'`. This deliberately sets only the framing restriction; it does not block project-specific Supabase requests, optional API requests, Google Fonts, OSM/CARTO map tiles, or the map submission marker assets.
- One-year immutable caching is limited to `/assets/*`, which Vite emits with content hashes. HTML and mutable public files are not assigned immutable caching.

Leaflet CSS is imported by the map components. Map tiles use the existing OSM and CARTO HTTPS URLs and display attribution. The marker icons used by the location-entry form load from unpkg; no API-key-required tile provider was found. The frame-only CSP leaves these resources available.

## Environment variables

`VITE_*` values are compiled into public browser assets and must contain no secrets.

| Variable | Use | Netlify |
|---|---|---|
| `VITE_SUPABASE_URL` | Required public URL for the current Supabase project | Set in Production; add to previews only if those builds should use that project. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Required browser-safe publishable key | Set in Production; add to previews only if needed. |
| `VITE_SUPABASE_ANON_KEY` | Legacy public key fallback if the publishable-key variable is absent | Optional compatibility only. |
| `VITE_API_BASE_URL` | Optional external analytics API base URL; no local default is used | Leave unset unless a real API is deployed. |
| `VITE_AUTH_REDIRECT_URL` | Optional canonical auth callback origin override | Normally leave unset; browser auth uses the current site origin. |
| `VITE_SITE_URL` | Legacy fallback alias for auth redirect origin | Optional compatibility only. |

There is no app server or Netlify function, so there are no server-only variables required by the frontend deployment. Local CSV import scripts separately accept `SUPABASE_SERVICE_ROLE_KEY` (the Node importer also accepts `SUPABASE_SERVICE_KEY`) and `SUPABASE_URL` as a URL fallback. Those are for a deliberate local batch-import operation only; do not set them in Netlify, in a `VITE_` variable, or in browser code. No import was run.

`.env.example` contains blank public placeholders and commented optional names. `.env`/`.env.*` remain ignored, with `.env.example` explicitly allowed. `git check-ignore .env` confirmed the local file is ignored; `git ls-files --error-unmatch .env` confirmed it is not tracked. `.netlify/`, `dist/`, and `node_modules/` are ignored. Public branding, fonts references, and EDADV charts/JSON are not ignored.

The Supabase client handles absent public variables without failing the static build and shows a configuration message in the UI. Vite variables are build-time values, so update Netlify's environment settings and start a new deploy after changing them. No secret values were included in this report or commands.

## Authentication and current Supabase project

**PASS — redirect code review.** Email verification and password recovery use `/auth/callback` and `/reset-password`. The browser helper now uses the active browser origin for non-local deployments instead of sending Netlify users to the old Render origin. Explicit `VITE_AUTH_REDIRECT_URL`/`VITE_SITE_URL` overrides remain available. Supabase's configured redirect allow-list is still the authorization boundary.

**PASS — prior read-only connection evidence in this project session.** The configured existing Supabase Auth health endpoint returned HTTP 200, and read-only `heatshield_master` requests returned HTTP 206; counts confirmed 150,000 records and 150,000 synthetic records. The production preview served 150,000 matching rows from that relation. No new project was created and no remote schema, RLS, data, or auth setting was modified.

**NOT TESTED:** Netlify production environment configuration, current Supabase Auth Site URL/Redirect URL values, signup/sign-in/sign-out, verification email delivery, valid callback token exchange, password recovery email, authenticated profile/settings updates, submissions, saved-query persistence, or cross-user RLS probes. A local build or browser route render does not verify these remote/authenticated flows.

After the actual Netlify site name or custom domain is known, configure in the **current Supabase project → Authentication → URL Configuration**:

- **Site URL:** `https://<site-name>.netlify.app` (or the chosen existing custom domain).
- **Redirect URLs:** `https://<site-name>.netlify.app/auth/callback` and `https://<site-name>.netlify.app/reset-password`.
- Also include the exact custom-domain versions if applicable. For local testing, include `http://localhost:3000/auth/callback`, `http://localhost:3000/reset-password`, `http://127.0.0.1:3000/auth/callback`, and `http://127.0.0.1:3000/reset-password`.
- If testing from Deploy Previews, add the exact preview callback/reset URLs used, or a narrowly scoped Supabase glob pattern for the site's preview hosts. Do not broadly allow unrelated domains.

These dashboard settings were not changed because the production Netlify host is not yet known and changing the current project's existing auth destinations could disrupt its current site.

## Browser verification

Browser tests used the existing Playwright browser tooling against local Vite's production preview at `http://127.0.0.1:4173`; this is not a Netlify deployment.

| Check | Result | Evidence |
|---|---|---|
| Direct nested-route visits | **PASS** | Dashboard, Explore Data, India Heat Map, login, register, callback, reset password, profile, and contact were visited directly. Profile followed the existing protected-route redirect to login when signed out. Tokenless callback showed its expected missing-token state. |
| Nested route refresh | **PASS** | Refreshed `/contact` from the production preview; it remained on `/contact` and rendered the page. This verifies Vite preview behavior; Netlify rewrite is statically checked, not remotely deployed. |
| Explore Data | **PASS** | Production bundle rendered 20 rows and reported 150,000 matching rows from `Supabase heatshield_master`; synthetic disclosure was visible. |
| Map | **PASS** | 100 points rendered, OSM attribution was visible, 18 tile images were present with 0 failed images in that local preview, metric selection and station filter reduced the point set to one, and the popup displayed the synthetic mean/sample count. |
| Mobile layout | **PASS** | Production preview at 390×844 showed no document-level horizontal overflow on Explore Data. Dashboard/map had also passed 390-pixel checks in the preceding project QA. |
| Browser console | **PASS for checked preview routes** | Current Explore/map checks reported no browser errors or warnings. Authentication forms were rendered without submitting credentials. |
| Real production domain / Netlify headers | **NOT TESTED** | No Netlify deployment was made. Therefore delivered headers, Netlify's actual rewrite processing, deployed CDN caching, and deployed service reachability remain unverified. |
| Authenticated workflows and email delivery | **NOT TESTED** | No authorized test account or valid email token was used. |

## Commands and verification

```text
rtk git status --short
rtk git diff --stat
rtk npm run
rtk npm ls --depth=0
rtk node --version
rtk npm --version
rtk npm run build
rtk python -X utf8 -c "...tomllib and dist asset/config assertions..."
rtk git check-ignore .env
rtk git ls-files --error-unmatch .env
git diff --check
```

`npm run` exposes `dev`, `build`, and `preview`; there is no existing test or lint script. No dependency install was needed. `npm ls --depth=0` showed the installed package set satisfied `package.json`. The TOML/dist assertions passed: config values matched, imported images and summary bundle were present, favicon and generated assets existed, and no raw CSV was published. `git diff --check` passed after edits; Git may print LF→CRLF normalization warnings for modified JSX files. `git status` also reports the previously inaccessible temporary directory/global ignore permission warning recorded in the project readiness report; no cleanup was attempted.

## Manual steps before a production deploy

1. Connect the GitHub repository `exobhavinss-sketch/TF-141-Heatshield` to the intended Netlify site. Use the repository root, build command `npm run build`, publish directory `dist`, and keep the Node version at 24 as specified in `netlify.toml`.
2. In Netlify's build environment settings, set only `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for Production. Add optional API/auth-origin variables only if their services/domains are actually configured. Do not set service-role secrets.
3. Once the Netlify hostname/custom domain is selected, configure the current Supabase project's Site URL and exact callback/reset Redirect URLs listed above. Preserve existing domain URLs still in use.
4. Trigger a production build and verify the deployed nested routes, headers, OSM tiles, and auth flows using an authorized test account. Confirm deploy-preview hosts are allow-listed only if they are used for authentication testing.
5. If a deploy fails, publish the previous successful Netlify deploy from its Deploys page; this does not roll back Supabase configuration or data.

## Release recommendation

**READY FOR NETLIFY CONFIGURATION; NOT DEPLOYED.** No local configuration blocker remains for a static Vite deploy. The production build, dist inspection, route-level production preview, Supabase master read, and map behavior passed their stated checks. Netlify account/site setup, delivery of configured headers and rewrites at a Netlify hostname, deployed Supabase environment variables, Supabase URL allow-list updates, and authenticated/email flows remain manual or **NOT TESTED**. Do not mark the website deployed or authentication production-ready until those checks have been completed.

## Documentation references

- [Netlify Vite setup](https://docs.netlify.com/build/frameworks/framework-setup-guides/vite/)
- [Netlify rewrites and SPA fallback](https://docs.netlify.com/manage/routing/redirects/rewrites-proxies/)
- [Netlify response headers](https://docs.netlify.com/manage/routing/headers/)
- [Netlify Node.js build versions](https://docs.netlify.com/build/configure-builds/manage-dependencies/)
- [Supabase Auth redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls)
