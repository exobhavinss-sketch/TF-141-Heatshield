# HeatShield Final Project Readiness Report

**Project:** HeatShield — Urban Heat Exposure Analysis and Cooling Intelligence Platform  
**Team:** TF-141  
**Study area:** Solapur, Maharashtra, India  
**Review date:** 28 October 2026  
**Environment:** Windows, Python 3.11, Node.js/Vite development server at `http://127.0.0.1:3000`, Playwright browser tooling, existing configured Supabase project.  
**Recommendation:** **NOT VERIFIED for full release.** The public read-only research routes and the current master-table query path passed local runtime checks. Authenticated user writes and remote authentication settings remain unverified, and a least-privilege profile grant migration is prepared but not applied.

## Architecture and scope

The application is a React 18/Vite 5 single-page frontend. Supabase JS provides authentication and database access. `heatshield_master` is the public read-only master-data relation; user submissions and saved analyses use separate protected relations. The EDADV interface imports a precomputed JSON summary generated from the repository master CSV. The Leaflet map displays 100 station-level synthetic summaries at their source coordinates; it does not interpolate values across unsampled areas.

No new Supabase project was created. No deployment, commit, push, production data write, authentication-setting change, or destructive operation was performed. Existing work was preserved.

## Supabase connection diagnosis

**PASS — current configured endpoint reachable.** The configured project URL is syntactically valid. A read-only request to Supabase Auth health returned HTTP 200 when sent with the configured publishable key. Read-only requests to `public.heatshield_master` returned HTTP 206 with a reported relation size of 150,000; count checks returned 150,000 total and 150,000 `is_synthetic=true`. No records were inserted or updated. The key value was not printed or copied into this report.

The earlier connection-refused condition was not reproducible against the currently configured Supabase endpoint. The separate optional REST API configuration, `VITE_API_BASE_URL`, is absent from the local `.env`, and no process was listening on the example `localhost:5000` address. The dashboard now reports that no live API is configured instead of displaying fixture data as live. Supabase master records remain available through their own service path. Do not treat build success as proof of remote connectivity; the HTTP checks and browser table response are the connectivity evidence for this run.

The master query uses the existing `heatshield_master` relation and the real columns `record_id`, `location_id`, `zone_type`, `observation_date`, `air_temperature_c`, `relative_humidity_pct`, `land_surface_temperature_c`, and `heat_risk_category`. It selects only displayed fields, pages on the server, applies zone/risk filters in the query, uses exact counts for non-search filters, and uses a bounded look-ahead query for identifier-prefix searches. The initial broad multi-column search and exact-count preflight were removed because they caused excessive scans/timeouts. The Explore Data page opts out of local fixture fallback.

The dashboard's optional API source accepts metrics only from a response explicitly marked `is_live_backend: true` and containing the required numeric fields. Missing configuration, failed requests, and unrecognized payloads do not become live readings.

## Features and runtime checks

| Check | Result | Evidence |
|---|---|---|
| Dashboard | **PASS** | Rendered research summaries and the explicit “No live API is configured” state. No API fixture values were presented as live readings. |
| Explore Data master query | **PASS** | Browser received populated rows from `heatshield_master`; the page reports 150,000 matches. Server-side pagination advanced from page 1 to page 2. |
| Zone/risk filters | **PASS** | `Industrial` plus source label `High` returned 3,876 matches, consistent with read-only query results. |
| Identifier search | **PASS** | Indexed ID-prefix search is implemented with a page-size-plus-one look-ahead. Earlier browser check returned paged station results without an exact-count request; unsupported free-form prefixes return a clear empty result. |
| Visible-row CSV export | **PASS** | Browser downloaded `heatshield_master_page_1.csv` from the currently visible filtered rows. |
| Saved query while signed out | **PASS** | UI clearly asks the visitor to sign in; no write was attempted. Authenticated save/load/update/delete remains **NOT TESTED**. |
| Empty and retry states | **PASS / PARTIAL** | No-match state and query retry control are present. A forced offline/API-error browser test was not completed in this pass. |
| India Heat Map | **PASS** | 100 synthetic station points rendered. Metric selection changed to air temperature; station filter reduced the rendered marker count to 1. The popup showed station mean values and n=1,500; those values agree with the Phase 3 station aggregate. |
| Map tiles and attribution | **PASS, local run** | OpenStreetMap attribution rendered and no failed tile images were observed during this browser check. External provider uptime is not established. |
| Desktop and mobile layout | **PASS after fix** | At 390×844 CSS pixels, Dashboard, Explore Data, and map had no document-level horizontal overflow. A 64-character unbroken CSV hash had caused Dashboard/Explore overflow; it now comes from the validated JSON and wraps at mobile widths. |
| Authentication route rendering | **PASS, route rendering only** | Login, registration, forgot-password, reset-password, and callback routes rendered. A tokenless callback displayed the expected invalid/missing-token message. No credentials were submitted. |
| Browser console | **PASS with informational warnings** | No browser errors or uncaught application exceptions on checked routes. Two React Router v7 future-flag warnings were present; they are dependency notices, not runtime errors. |
| Authenticated flows and redirects | **NOT TESTED** | No authorized test account or valid callback/recovery token was available. Email delivery and remote Site URL/redirect allow-list were not verified. |

## EDADV integrity

**PASS.** The master CSV `Heat Shield Master Dataset(2).csv` remains unchanged at 66,009,030 bytes. Its SHA-256 is `b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83`, matching the Phase 2 summary, Phase 3 validation, Phase 3 audit verification, and exported website summary. The export contains 150,000 rows, 57 columns, 100 station aggregates with 1,500 source rows each, and 150,000 source-encoded risk labels. Every source record is synthetic academic simulation data, not a verified real-world Solapur observation.

`python edadv/validate_phase3.py` passed all 14 checks with exit code 0 in this run. Checks covered source hash and shape, synthetic disclosure, audit consistency, numeric and correlation claims, station/zone/risk totals, temporal coverage, IQR counts, grouped summaries, report claims, figure dimensions/manifest, and absence of unsupported fields. The prior QA report's Windows temporary-cleanup problem did not recur in this direct validator run.

The interface continues to label risk fields as source-encoded labels, not validated health-risk classifications. Correlations are descriptive associations across repeated, dependent records. WRF-Chem, ERA5-Land, and IMD are repository-documented provenance claims that have not been independently verified. Synthetic station aggregates are not live measurements.

## Security and RLS review

**PASS — repository/static review. NOT TESTED — authenticated live enforcement.** The migrations enable RLS on `profiles`, `user_settings`, `heat_readings`, `saved_analyses`, `contact_messages`, and `heatshield_master`. User-owned policies constrain reads/writes with `auth.uid()` and the appropriate `id`/`user_id`; reading inserts require the caller's ID and `pending` status. Contact messages are insert-only for anon/authenticated roles. `heatshield_master` grants anon/authenticated SELECT only with a public read policy, and no public write grant is present.

Client paths scope profile/settings and saved-analysis requests to the signed-in user. The Explore Data save action includes the current user ID, with RLS remaining authoritative. Anonymous requests to protected user relations returned authorization failures during the read-only remote checks; authenticated cross-user denial was not probed.

Client code uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (with legacy anon-key fallback). `.env` is ignored and is not tracked. No server-role secret is referenced in browser code during the static scan; secret values were not printed. Deployment environment configuration was not inspected.

`supabase/migrations/20261028000001_profiles_limit_self_writable_columns.sql` is a proposed additive permission hardening migration. It revokes table-level profile insert/update grants and grants only user-editable columns, while leaving existing RLS policies intact. **It has not been applied.** The available Supabase management connection referred to a different project, so applying it through that connection would risk changing the wrong project. Verify the linked project reference locally, then apply through the normal migration process if approved. Do not use the unrelated management project.

## Confirmed fixes in this completion pass

- Replaced the slow broad master-data search/count pattern with bounded server-side filtering and pagination.
- Made Explore Data explicitly return an error/empty state on Supabase failure instead of falling back to station fixtures.
- Removed the default request to an unconfigured local REST API and gated Dashboard live metrics on a positively identified live payload.
- Made auth-state listener work synchronous and moved profile/settings loading out of the Supabase auth callback.
- Whitelisted profile update fields in application code and prepared a pending least-privilege SQL migration; no remote permissions were changed.
- Made callback handling avoid exchanging the same PKCE code twice and clean callback tokens/query parameters from the visible URL.
- Changed the displayed master CSV hash to read from the generated summary JSON; wrapping it also fixed verified 390-pixel horizontal overflow on Dashboard and Explore Data.
- Removed one trailing whitespace defect found by `git diff --check`.

## Commands and reproduction

Commands run in this completion pass:

```text
rtk npm run
rtk npm ls playwright @playwright/test puppeteer --depth=0
rtk python edadv/export_web_summary.py
rtk python edadv/validate_phase3.py
rtk npm run build
git diff --check
```

The existing Vite server was observed at `http://127.0.0.1:3000`; it was reused. Playwright was supplied by the existing browser tooling, not installed as a project dependency. `npm run` exposes only `dev`, `build`, and `preview`; no project test or lint script is configured.

For local reproduction:

```text
npm run dev -- --host 127.0.0.1
python edadv/export_web_summary.py
python edadv/validate_phase3.py
npm run build
git diff --check
```

Do not run the exporter if you intend to preserve the generated summary byte-for-byte; it deterministically rewrites `src/data/edadvSummary.json` from the unchanged source dataset.

## Final validation and remaining limits

**PASS:** production build (`vite build`, 2,431 modules transformed); Phase 3 validation (14/14); source/export hash and row/station/risk totals; local runtime read-only access to the current master relation; checked browser routes, table filtering/pagination/export, map metric/filter/popup, and responsive layout; final `git diff --check` after the whitespace fix.

Git emitted line-ending normalization warnings for modified JSX files during `git diff --check`, but the command exited 0 with no remaining whitespace errors. `git status` also reported an inaccessible temporary directory named `tmpzs_v9t94` and a global ignore-file permission warning; no tracked project file was associated with that warning, and no cleanup was attempted.

**NOT TESTED:** authenticated signup/sign-in/sign-out, password recovery email, callback completion with a valid token, profile and settings writes, user-submission writes, authenticated saved-query persistence, cross-user RLS denial, deployed environment variables, Supabase Auth Site URL/redirect allow-list, production map-provider connectivity, and a forced offline browser retry. No project test/lint suite exists. No production write test was run.

**Release recommendation: NOT VERIFIED for full release.** The read-only research/data demo is ready for review against the existing Supabase project. Full release verification requires: (1) confirm the Supabase migration target matches the configured project and apply/review the pending profile column-grant migration through the normal authorized migration process; (2) confirm Site URL and allowed callback/reset redirect URLs in the current project's Auth settings; and (3) run authenticated user-scoped flows with an authorized test account, including saved query and submission access, without using production data. No credentials should be sent in chat.
