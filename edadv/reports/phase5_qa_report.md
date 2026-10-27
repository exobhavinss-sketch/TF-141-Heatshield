# Phase 5 QA Report — HeatShield

**Project:** HeatShield — Urban Heat Exposure Analysis and Cooling Intelligence Platform  
**Team:** TF-141  
**Study area:** Solapur, Maharashtra, India  
**QA date:** 27 October 2026  
**Environment:** Windows PowerShell; Python 3.11; Node/Vite local development server at `http://127.0.0.1:3000`; isolated Chrome DevTools browser context.  
**Scope:** Local verification of Phase 4 research integration, static access/security review, and final build checks. No deployment, commit, database mutation, auth configuration change, or schema change was performed.

## Readiness summary

**Release readiness: NOT VERIFIED.** The local build and rendered research/map screens passed the checks below. The configured Supabase endpoint returned connection-refused errors, the master table returned no records, and no authenticated account was used. Therefore successful remote master-data queries, saved-query writes, live readings, RLS enforcement against the live project, and authenticated flows remain unverified.

All master-dataset research values shown in the application are summaries of **synthetic academic simulation data**, not verified Solapur weather observations. Source-encoded heat-risk labels are not independently validated health-risk categories. WRF-Chem, ERA5-Land, and IMD provenance remains unverified. No causal interpretation is supported.

## Results

| Check | Result | Evidence / scope |
|---|---|---|
| Source integrity | **PASS** | `Heat Shield Master Dataset(2).csv`, 66,009,030 bytes; SHA-256 `b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83` matches Phase 2 summary, Phase 3 validation, Phase 3 audit verification, and generated web-summary metadata. No source rewrite was performed. |
| Web-summary counts | **PASS** | Export regenerated `src/data/edadvSummary.json`: 150,000 rows, 57 columns, all synthetic, 100 stations, 1,500 source rows per station, and 150,000 source risk labels. |
| Phase 3 validation | **PASS, with runner cleanup issue** | Validator output reported `passed` and all 14 named checks passed, including source hash, shape, synthetic disclosure, numeric/correlation checks, station/zone/risk/date totals, IQR flags, report claims, figure manifest, and absent unsupported fields. The temporary-output wrapper then exited nonzero because Windows raised `WinError 145` while cleaning its temporary directory. This is a harness cleanup issue after the PASS result; the run is not recorded as a clean exit. |
| Local Dashboard | **PASS** | `/dashboard` rendered research overview and synthetic-data caveats. API summary stayed in an explicit unavailable state instead of showing a local fixture as live. Narrow viewport had no horizontal overflow; Chrome reported a 482 CSS-pixel viewport for this page despite a 390-pixel mobile emulation request, so exact Dashboard-at-390 layout is not verified. |
| Explore Data route and empty state | **PASS** | `/explore-data` rendered summary cards, charts, correlation results, date coverage, zone/station outputs, and source-risk-label caveat. With no available Supabase master rows, the page clearly stated that no rows were available. |
| Explore controls | **PARTIAL** | Search, zone, and risk controls accepted values and updated query state. Export was correctly disabled with zero visible rows. Authenticated saved-query creation was not attempted. Result-level filtering, pagination, populated-row export, and persisted saved-query behavior are **NOT TESTED** because the configured master table yielded zero rows and no test account was used. |
| IndiaHeatMap | **PASS** | `/heat-map` rendered 100 synthetic station aggregate points. Metric switching changed the selected layer and marker styling; station filter reduced the visible count to 1/100; popup values matched the selected station aggregate and showed `n=1,500`. The map uses station summaries and does not interpolate a continuous surface. |
| Responsive layout | **PARTIAL** | Map layout was checked at desktop and 390×844 emulated mobile, with no horizontal overflow and a visible map. Dashboard narrow layout showed no overflow at the browser-reported 482 CSS pixels; exact 390-pixel behavior for all routes is **NOT TESTED** due viewport emulation discrepancy. |
| Navigation/auth route rendering | **PASS** | Login, register, forgot-password, reset-password, and auth-callback routes rendered their expected forms or missing-token states. No credentials were submitted; sign-in, registration, email delivery, and recovery are **NOT TESTED**. The callback's missing-token console error was expected for the deliberately tokenless route. |
| Browser console/network | **PARTIAL** | Dashboard displayed a clear unavailable-data message. Chrome logged `ERR_CONNECTION_REFUSED` for configured network requests; these errors were not represented as live readings. No other uncaught application exception was observed in the reviewed pages. Remote service availability is **NOT TESTED / unavailable in this run**. |
| RLS and client access | **PASS — static inspection only** | Both SQL migrations enable RLS. `heatshield_master` grants anon/authenticated SELECT only and has a public read policy. Profiles/settings/reading/saved-analysis policies constrain access by `auth.uid()`; reading inserts require the caller's ID and `pending` status; contact messages have insert-only public permissions and no public read/update/delete policies. Client profile/settings and saved-query access are user scoped. No live policy probes were performed. |
| Secret handling | **PASS — static inspection only** | Client code references `VITE_SUPABASE_URL` and publishable/anon key variables. No service-role key variable was found in scanned client source/config. `.env` is ignored and is not tracked; values were not printed or inspected. This does not verify deployment secret configuration. |
| Production build | **PASS** | `npm run build` completed with Vite 5.4.21; 2,431 modules transformed and chart assets emitted. |
| Existing project tests/lint | **NOT TESTED** | `npm run` exposes only `dev`, `build`, and `preview`; no test or lint scripts are configured. Top-level Playwright/Puppeteer packages were absent. Browser checks used the already available Chrome DevTools tooling; no dependencies were installed. |
| Git whitespace validation | **PASS** | Final `git diff --check` completed with exit code 0 and no whitespace diagnostics. Git/RTK emitted line-ending, global ignore-config access, and inaccessible temporary-directory warnings during `git status`; these did not change the whitespace-check result. |

## Research data checks

The generated summary's source path is the repository-root master CSV. Its source hash matches all three recorded audit/validation hashes. It reports 150,000 records and 57 columns; all records are synthetic, and station aggregates comprise 100 locations with 1,500 rows each. Source risk labels total 150,000. The source has 1,500 observed dates and 326 dates without observations in the inclusive calendar range; these gaps remain gaps.

The Phase 3 validator's 14 passing checks confirmed the principal grouped totals and claims against the source outputs. It also confirmed the screened IQR candidate counts for the four core fields: air temperature 0, relative humidity 0, LST 17, and UHI intensity 0. These flags are candidates for review, not invalid records. Correlations are row-level paired summaries over repeated station/date observations; their row count is not an independent sample size. The UI and report must retain that qualification.

## Static Supabase and data-access review

- `heatshield_master` is intentionally publicly readable through the anon/authenticated SELECT policy; the migration grants no public write permissions.
- User-owned records in profiles, user settings, heat readings, and saved analyses are restricted by `auth.uid()` in the inspected migration policies. Contact messages are insert-only for anon/authenticated users; the migration grants no public read or moderation access.
- `Profile.jsx` scopes reading and saved-analysis queries by the authenticated user ID; Explore Data includes the current user ID on a saved-analysis insert and requires sign-in before that action. The live RLS behavior was not exercised.
- Dashboard summary handling only accepts responses flagged as live; its offline fixture was explicitly withheld in the browser run. Explore Data showed an unavailable/empty message when Supabase was unreachable or empty.
- This review inspected repository migrations and client paths only. It did not inspect deployed policies or production data.

## Commands executed

Commands used in this Phase 5 continuation (each shell command was invoked through the repository's `rtk` wrapper):

```text
rtk git status --short
rtk git diff --check
rtk git diff --check -- src/components/map/HeatMapLegend.jsx src/components/map/HeatMapMarkers.jsx src/components/map/HeatMapPopup.jsx src/pages/Dashboard.jsx src/pages/ExploreData.jsx src/pages/IndiaHeatMap.jsx src/services/masterDataService.js
rtk npm run
rtk npm ls playwright @playwright/test puppeteer --depth=0
rtk python edadv/export_web_summary.py
rtk npm run build
rtk python -c "import tempfile,shutil; from pathlib import Path; import edadv.validate_phase3 as v; t=tempfile.TemporaryDirectory(dir=str(v.ROOT)); target=Path(t.name)/'outputs'; shutil.copytree(v.OUT,target); v.OUT=target; v.main(); t.cleanup()"
```

The Phase 3 validator was run with its output directory redirected to a temporary copy so the canonical validation output was not replaced. It printed `status: passed` with all 14 checks passing, then the wrapper returned exit code 1 during temporary-directory cleanup (`WinError 145`). A second attempt also printed all 14 passing checks before cleanup failed. The generated web export completed with exit code 0. The production build completed with exit code 0. The final `git diff --check` completed with exit code 0 and no whitespace diagnostics. Git status still reports an inaccessible validator temp directory and global ignore-config access warnings.

The master file used by the exporter is `Heat Shield Master Dataset(2).csv`; the separate `Datasets/` CSVs were not substituted. The site was inspected at `http://127.0.0.1:3000`, the URL observed from the existing local Vite process rather than inferred from a default port.

## Defects and changes in this Phase 5 continuation

- Updated `edadv/export_web_summary.py` to calculate and compare the actual master CSV SHA-256 against the Phase 2 and nested Phase 3 hash records before exporting.
- Corrected India map date labeling so a station-summary popup does not imply a single-date measurement; clarified the requested date/status in the India-wide map label.
- Removed threshold-based “hotspot” styling from synthetic station-summary markers, and clarified map legend temperature buckets and app-derived score labels as visual displays rather than official or validated risk classifications.
- No dataset, Supabase schema, database rows, authentication configuration, or unrelated application areas were modified.

## Not tested and remaining risks

- Live Supabase connectivity was not available: browser network requests returned connection-refused errors and no populated master rows were returned.
- Authenticated saved-query persistence, data-table pagination/results, result filtering against populated rows, and nonempty visible-row CSV export remain untested.
- Live authentication, account creation, reset-email delivery, and callback completion remain untested.
- Deployed RLS enforcement, Supabase environment configuration, deployment secrets, and map-provider availability outside this local run remain unverified.
- Full mobile behavior of every route at a confirmed 390 CSS-pixel viewport remains unverified. Map behavior was checked at 390×844; Dashboard's browser-reported viewport did not match the requested emulation width.
- The validator's analytical assertions passed, but its temporary cleanup wrapper did not exit cleanly on Windows. The cleanup failure is separate from the validator's printed check results and should be resolved before relying on that command as a clean CI step.
- A temporary directory created by the validator run became inaccessible (`tmpzs_v9t94`, Windows access denied). It does not appear in the tracked/untracked status listing, but Git/RTK reports it during checks; local filesystem access is needed to remove it safely.

## Release recommendation

**NOT VERIFIED for release.** The local production build passes and the synthetic research integration renders correctly. Before release, run the remaining runtime checks against a controlled staging Supabase project with a populated `heatshield_master` table and a dedicated test account. Verify saved-query ownership and RLS with that account, test filters/pagination/export against populated rows, exercise authentication recovery without sending production messages, and repeat mobile checks at a confirmed 390 CSS-pixel viewport. Also rerun the Phase 3 validator in an environment where temporary outputs can be cleaned successfully. Do not use production data or credentials for these checks.

## Completion update — 28 October 2026

This addendum records a later continuation and supersedes the historical statements above that the current Supabase endpoint was unavailable, the master table was empty, the 390-pixel mobile viewport could not be confirmed, and validator cleanup failed. Those statements accurately describe the earlier run but no longer describe the checks below.

| Follow-up check | Result | Evidence |
|---|---|---|
| Current Supabase endpoint | **PASS** | Read-only Auth health request returned HTTP 200 with the configured publishable key. `heatshield_master` returned HTTP 206, and read-only counts confirmed 150,000 rows with 150,000 synthetic rows. |
| Explore Data | **PASS** | Populated rows rendered from `heatshield_master`; exact page count and Next pagination worked. Industrial + High returned 3,876 records. Identifier search uses indexed prefixes and a look-ahead page. Visible filtered rows downloaded as CSV. Signed-out Save Query clearly requested sign-in; no write was attempted. |
| Dashboard live-data state | **PASS** | Local `VITE_API_BASE_URL` is absent and no process listens at the example port 5000. Dashboard says no live API is configured and keeps synthetic EDADV summaries separate. |
| Map | **PASS** | 100 markers rendered; air-temperature selection, station filtering to one point, and popup values/sample count were checked. Popup identifies the values as synthetic station means. OpenStreetMap attribution displayed; no failed tile image was observed. |
| Mobile layout | **PASS after fix** | Dashboard, Explore Data, and India Heat Map checked at 390×844. A long unbroken hash had widened Dashboard/Explore; the hash now reads from summary JSON and wraps. No document-level horizontal overflow remained. |
| Routes and browser console | **PASS, route rendering only** | Login, register, forgot-password, reset-password, and tokenless auth callback rendered expected states. No browser errors; two React Router future-flag warnings remain. Authentication and email flows were not submitted. |
| EDADV integrity | **PASS** | `rtk python edadv/validate_phase3.py` exited 0 with 14/14 checks. The master CSV SHA-256 matches Phase 2, Phase 3, audit-verification, and generated web-summary metadata. Export records 150,000 rows, 57 columns, 100 stations, and 150,000 risk labels. |
| Build and diff whitespace | **PASS** | `rtk npm run build` completed with 2,431 modules transformed. After removing a trailing-space defect from `HeatMapMarkers.jsx`, `git diff --check` exited 0. |

The service query was changed to use bounded server-side pagination, indexed identifier-prefix search, and server-side zone/risk filters. Explore Data opts out of local fixture fallback. The Dashboard no longer requests an unconfigured localhost API or labels fallback metrics as live. Auth state loading no longer awaits database requests inside the Supabase auth callback. Callback URL parameters are removed after processing. The profile column-grant migration is prepared but **not applied**; the available Supabase management connection referred to a different project and was not used.

Authenticated sign-in, user writes, saved-query persistence, password email delivery, deployed redirect settings, cross-user RLS enforcement, and forced-offline retry remain **NOT TESTED**. The full-project recommendation remains **NOT VERIFIED** until these checks are completed against the intended current project with an authorized account. See `final_project_readiness_report.md` for the consolidated evidence and next actions.
