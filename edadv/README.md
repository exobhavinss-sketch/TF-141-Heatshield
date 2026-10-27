# HeatShield EDADV — Phase 1 Audit and Analysis Plan

## Scope and source

This Phase 1 audit reads the existing synthetic master CSV and records its actual structure and data-quality checks. It does not modify the source data, database schema, or website. The canonical audit input used here is the root file `Heat Shield Master Dataset(2).csv` (66,009,030 bytes; approximately 62.94 MiB). Two files under `Datasets/datasets/` have the same byte size, header, and SHA-256, so they are byte-identical copies rather than distinct datasets. SHA-256: `b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83`.

The CSV contains **150,000 rows × 57 columns**. A complete machine-readable audit is in [`outputs/dataset_audit.json`](outputs/dataset_audit.json). It records each column’s inferred type, missing count and percentage, numeric summaries, categorical distributions, identifier and exact-row duplicate checks, timestamp checks, coordinate bounds, and physical range checks.

### Actual column groups and inferred types

The audit infers 41 numeric, 12 text/category, 2 date/time, and 2 boolean columns. Names below are from the CSV header, not inferred from the README:

- **Date/time**: `observation_datetime`, `observation_date`.
- **Boolean**: `is_synthetic`, `cooling_infrastructure_present`.
- **Numeric**: `year`, `month`, `day`, `latitude`, `longitude`, `elevation_m`, `population_density_per_km2`, `distance_to_green_space_m`, `air_temperature_c`, `max_air_temperature_c`, `min_air_temperature_c`, `relative_humidity_pct`, `wind_speed_mps`, `wind_direction_deg`, `solar_radiation_w_m2`, `precipitation_mm`, `cloud_cover_pct`, `atmospheric_pressure_hpa`, `land_surface_temperature_c`, `surface_temperature_anomaly_c`, `ndvi`, `ndbi`, `ndwi`, `vegetation_cover_pct`, `impervious_surface_pct`, `building_density_index`, `road_density_km_per_km2`, `tree_canopy_cover_pct`, `shade_availability_pct`, `surface_albedo`, `distance_to_water_m`, `pedestrian_activity_index`, `traffic_intensity_index`, `built_up_intensity_index`, `heat_exposure_index`, `vulnerable_population_index`, `urban_heat_island_intensity_c`, `shade_gap_index`, `green_cover_deficit_pct`, `cooling_priority_score`, `estimated_cooling_potential_c`.
- **Text/category**: `record_id`, `location_id`, `season`, `data_source_type`, `city`, `state`, `country`, `location_name`, `zone_type`, `cooling_infrastructure_type`, `heat_risk_category`, `recommended_intervention`.

Field names for station IDs, substrate, status, and heat index were not assumed. The master CSV has `location_id`, but no `station_id`, `substrate`, `status`, or `heat_index_c`. `substrate`, `status`, `heat_index_c`, humidity, and a separate surface reading are present in the distinct user-submission workflow/schema (`heat_readings`), not in this master dataset. Keep those two data sources separate in later analysis.

## Audit findings

- **Missingness**: 0 empty, `NA`, `N/A`, `null`, or `NaN` cells. Literal `None` in `cooling_infrastructure_type` is a valid fifth category (84,000 rows), documented as absence of infrastructure; do not silently convert it to null in pandas.
- **Duplicates**: 0 exact duplicate rows, 0 duplicate `record_id` values, and 0 duplicate `(location_id, observation_date)` pairs (150,000 unique station-date pairs). There are 100 `location_id` values, each repeated 1,500 times.
- **Time**: valid ISO timestamps from `2021-01-01T08:00:00+00:00` through `2025-12-31T12:47:00+00:00`; no timestamp parse failures or mismatches against `observation_date`, `year`, `month`, or `day`. There are 1,500 distinct observed dates, each with 100 records. The inclusive date span contains 1,826 days, so 326 dates have no observations (largest gap between observed dates: 2 days). This is a sparse daily schedule, not complete daily coverage.
- **Geography**: all coordinates are valid latitude/longitude and fall inside the broad screening envelope 17.4–17.9° N, 75.7–76.2° E. Actual coordinate extent is 17.612–17.722° N and 75.836–75.962° E, with 100 unique coordinate pairs. The envelope is a screening box, not a verified municipal boundary.
- **Range checks**: no values fall outside the configured broad plausibility ranges for air temperature, humidity, LST, or heat-index field where present; no violations of `min_air_temperature_c <= air_temperature_c <= max_air_temperature_c`. The dataset has no heat-index field, so heat index cannot be audited or analyzed from this CSV.
- **Units**: headers and database schema use Celsius (`*_c`), humidity percent (`*_pct`), solar radiation W/m², pressure hPa, and coordinates in decimal degrees. A full unit/dictionary cross-check remains an analysis-preparation item. `wind_direction_deg` is circular data and must not be treated as a linear measure.
- **Categorical availability**: `location_id` has 100 values; `season` has 4; `data_source_type` has one value, `Synthetic simulation`; `is_synthetic` is `True` for all 150,000 rows; `heat_risk_category` has Low, Moderate, High, and Very High; infrastructure type has five values including literal `None`. Master data has no substrate types or submission statuses.

### Numeric audit snapshot (computed from the CSV)

Values are in the units implied by the column names. Standard deviation is sample SD. The complete 41-column summary, including Q1, median, and Q3, is in the JSON audit.

| Field | Mean ± SD | Min | Median | Max |
|---|---:|---:|---:|---:|
| `air_temperature_c` | 34.28 ± 5.62 °C | 19.35 | 34.15 | 46.81 |
| `relative_humidity_pct` | 48.55 ± 21.32 % | 14.8 | 42.9 | 98.0 |
| `land_surface_temperature_c` | 35.89 ± 6.96 °C | 17.06 | 35.54 | 55.35 |
| `urban_heat_island_intensity_c` | 3.27 ± 2.66 °C | 0.0 | 2.81 | 9.8 |

These are summaries of the provided simulation records; they are not claims about observed Solapur conditions.

## Provenance and interpretation

The repository’s README, import guide, row-level `data_source_type`, and `is_synthetic` field consistently describe the master records as **synthetic academic simulation data** for Solapur. The project documentation attributes the modeling/calibration to WRF-Chem/ERA5-Land and historical IMD baselines. The repository does not provide an independently verifiable generator, calibration inputs, or source observations, so those modeling and calibration claims are recorded as project documentation, not independently confirmed facts. Do not call these official IMD measurements, live readings, or verified sensor observations.

Separate user-submitted readings in Supabase are a distinct source with status fields; do not merge them into the master simulation analysis without explicit source labels, quality rules, and a separate audit.

## Existing EDADV work and repository fit

The repository already contains:

- [`Datasets/reports/Heat Shield Dataset Analysis Report.md`](../Datasets/reports/Heat%20Shield%20Dataset%20Analysis%20Report.md), a prior analysis/report;
- [`Datasets/reports/Heat Shield Validation Report.txt`](../Datasets/reports/Heat%20Shield%20Validation%20Report.txt) and a misspelled duplicate `Heat Shield Vadilation Report.txt`;
- ten chart PNGs under `Datasets/charts/`;
- `scripts/generate_dashboard_data.py`, an existing dashboard-data utility;
- master CSV import scripts and SQL schemas.

Do not recreate these charts or rename/overwrite the existing report in Phase 2. The old analysis report contains a prior set of figures and claims and points at a different historical workspace path; recheck each claim against the CSV before reusing it. This new audit is source-data-derived. Keep using `Datasets/charts/` for any revised chart exports unless a later phase has a specific reason to add `edadv/figures/`.

## Preprocessing decisions for Phase 2

1. Read the canonical master CSV with explicit UTF-8 handling and preserve literal `None` as a string category (for pandas, use `keep_default_na=False`, then define missing tokens explicitly).
2. Parse `observation_datetime` as timezone-aware UTC and `observation_date` as date; retain both original text and parsed forms if exporting cleaned data. Do not fill the 326 unobserved dates by interpolation.
3. Treat one row as a station-date simulation record. There are 100 station locations with 1,500 rows each, not 150,000 independent physical sites. For time trends, aggregate by date/station as the question requires and account for repeated observations within station; avoid treating all rows as independent replicates.
4. Validate units and all categorical labels against the data dictionary/SQL schema before deriving fields. In particular, document the exact risk-category rule; do not infer it from labels alone.
5. Derive heat index only in a later analysis if a suitable formula and input assumptions are selected and documented. It is not present in this master CSV. Keep any derived value separately named and never present it as a source field.
6. Preserve the original CSV and write any cleaned/aggregated tables only to `edadv/outputs/`. Record source path, source hash, script version, and transformation decisions with outputs.
7. Use Tukey fences and/or robust z-scores as flags for review, not automatic deletion. Confirm extreme values against simulation rules and source documentation.

## Recommended analyses and figures

These are planned analyses, not completed findings:

1. **Distribution and QC**: histograms/density plots plus boxplots for air temperature, RH, LST, anomaly, and UHI intensity; report n, mean, SD, median, IQR, min, max. Flag outliers with IQR fences, then inspect by station/date and simulation provenance.
2. **Temperature–humidity**: scatter/hexbin of air temperature vs RH, optionally faceted by month/season; report Pearson and Spearman associations with confidence intervals. Interpret only as association within the simulation.
3. **Surface temperature by urban context**: LST by `zone_type`, `season`, and any valid surface/land-cover categories. There is no `substrate` field in the master file, so do not claim substrate-specific comparisons from it.
4. **Correlation**: Pearson matrix for approximately continuous fields, paired with Spearman sensitivity checks. Report sample sizes and flag redundant/derived index relationships. Avoid causal language, especially where indices or risk scores may be constructed from related variables.
5. **Temporal patterns**: monthly/seasonal summaries and date series are supported by parsed timestamps. Hourly analysis is not justified as a general diurnal curve without adequate repeated hourly sampling; first inspect the actual time-of-day distribution. Report observed-date coverage and do not fill gaps.
6. **Risk categories**: counts and percentages for Low/Moderate/High/Very High, stratified by season and zone; include category definitions if documented. Since labels are simulation-derived and the rule is not independently verified here, describe the encoded classification rather than validated health risk.
7. **Spatial distribution**: map 100 unique station coordinates using station-level aggregates, not 150,000 overlapping points. Label the coordinates as representative/simulation locations and avoid asserting verified sensor locations.
8. **Context comparisons**: compare LST and air temperature with NDVI, NDBI, impervious cover, canopy, and shade; show effect sizes and uncertainty. These are exploratory relationships, not evidence that interventions caused cooling.

For grouped comparisons, inspect distributions and station-level dependence first. Use Kruskal–Wallis or ANOVA only when assumptions and sampling structure support it, followed by multiplicity-adjusted pairwise comparisons where applicable. Report effect sizes and intervals alongside p-values; for repeated dates by station, use station-clustered uncertainty, mixed models, or station-level summaries rather than naive independent-row tests. Statistical inference on synthetic data describes this simulation and its encoded assumptions only.

## Limitations and quality concerns

- Synthetic-only data cannot establish actual Solapur weather, health outcomes, intervention effectiveness, or municipal priorities.
- The documented generator and calibration cannot be independently reproduced from the repository contents inspected; include that limitation in any submission.
- Timestamps cover 1,500 dates out of 1,826 in the date span. The daily records are synthetic and do not support claims of uninterrupted coverage.
- `heat_index_c`, `substrate`, and `status` are absent from the master CSV. Existing user submission fields are from a separate data table/workflow.
- `heat_risk_category`, UHI intensity, cooling score, and recommended intervention may be derived fields; definitions and source formulas need verification before interpreting associations.
- Some prior reports and charts exist, but should be treated as legacy deliverables pending reproducibility checks. Avoid copying their results without rerunning against the audited input.

## Reproduction

The audit script uses only Python’s standard library; no package installation is required.

```powershell
python edadv/audit_dataset.py "Heat Shield Master Dataset(2).csv" --output edadv/outputs/dataset_audit.json
```

The script is read-only with respect to the CSV. It writes the requested JSON output path. Python 3.11.15 was available during this audit. `numpy` and `matplotlib` are installed; `pandas`, `seaborn`, and `scipy` are not. Phase 2 should use the installed tools where adequate, or request/approve an environment change before adding packages.

## Academic submission outputs planned

- reproducible dataset audit JSON and a concise audit report;
- documented, source-labeled preprocessing and analysis script/notebook;
- distribution, temporal, correlation, risk-category, zone-comparison, and station-level spatial figures as supported by data;
- machine-readable summary tables and a figure manifest with captions, units, source hash, and methods;
- limitations/provenance text clearly stating that the source is synthetic simulation data.

## Phase 2 implementation

Phase 2 is implemented in [`run_phase2_eda.py`](run_phase2_eda.py). It reads the audited source path and SHA-256, validates all 57 columns, row count, numeric parsing, UTC dates, station consistency, and synthetic flags, then generates:

- `outputs/descriptive_statistics.csv` and `.json` for all numeric variables, plus categorical summaries/frequencies;
- IQR screening, zone/season/month/year grouped summaries, station aggregates, and station-level zone comparisons;
- month/year station-mean summaries, risk-category-by-zone counts, complete date coverage, and timestamp hour counts;
- Pearson/Spearman pairwise correlations and matrices, plus station-mean correlations;
- `outputs/phase2_summary.json` and a figure manifest;
- twelve figures under `figures/` and `reports/phase2_eda_report.md`.

Reproduce from the repository root with `python edadv/run_phase2_eda.py`. The input must match the hash in the Phase 1 audit. Use `--overwrite` only to regenerate this script's own Phase 2 outputs. The analysis uses Python 3.11+, NumPy, and Matplotlib; no dependencies were added. It does not run hypothesis tests, infer a full diurnal curve from partial hour coverage, interpolate missing dates or spatial surfaces, or remove IQR candidates. All results are explicitly labeled synthetic.

## Phase 3 — Validation and academic deliverables

Phase 3 adds a claim validation record, a final academic report, a review of the ten legacy charts, and two annotated presentation copies of Phase 2 charts. Existing files under `Datasets/`, the twelve Phase 2 figures, the Phase 2 report, the master CSV, and application/database files are not modified by the Phase 3 scripts.

### Requirements

- Python 3.11 or newer.
- NumPy and Matplotlib, as used by `run_phase2_eda.py` and `prepare_phase3_figures.py`.
- No pandas, Seaborn, SciPy, or new dependency is required. The audit, Phase 3 validator, and figure input/output checks use the standard library; Matplotlib uses its installed backend to export PNGs.
- Versions used for this validation run: Python 3.11.15, NumPy 2.4.6, Matplotlib 3.11.2.

### Reproduction and validation sequence

Run these commands from the repository root in PowerShell. First locate the master file at the repository root and verify the path recorded in `outputs/dataset_audit.json`. The analysis scripts validate its audited SHA-256 before using it.

```powershell
python --version
Get-Item "Heat Shield Master Dataset(2).csv" | Select-Object FullName, Length
Get-FileHash "Heat Shield Master Dataset(2).csv" -Algorithm SHA256
python edadv/audit_dataset.py "Heat Shield Master Dataset(2).csv" --output edadv/outputs/phase3_audit_verification.json
python edadv/run_phase2_eda.py
python edadv/validate_phase3.py
python edadv/rebuild_compare_phase2.py
python edadv/prepare_phase3_figures.py
```

The expected source hash is `b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83`. The alternate audit output path above preserves the existing canonical Phase 1 audit JSON. On a clean checkout, Phase 2 writes the statistics, groups, correlations, manifest, twelve figures, and report to `outputs/`, `figures/`, and `reports/`. If those Phase 2 artifacts already exist, the runner stops before writing. Its `--overwrite` option explicitly replaces only those Phase 2 outputs; use it only when that regeneration is intended and the current files have been preserved as needed.

`validate_phase3.py` checks the source hash and shape, synthetic flag, the Phase 2 numerical claims, row/group totals, risk counts, date coverage, IQR flags, figure manifest and PNG dimensions. It writes `outputs/phase3_validation.json`. `prepare_phase3_figures.py` creates two annotated copies in `figures_phase3/`; it does not replace Phase 2 or legacy figures. The final narrative report is `reports/EDADV_Final_Report.md`; legacy chart dispositions are in `reports/legacy_chart_validation.md`.

`rebuild_compare_phase2.py` is an optional, stronger reproduction check. It copies the source, audit, and Phase 2 runner into a temporary directory, reruns the analysis there, and compares all 19 machine-readable tables, twelve PNG files, and the Phase 2 report byte-for-byte with the checked-in workspace outputs. The temporary project is removed when the command exits.

### Deliverables

- `outputs/phase3_audit_verification.json`: fresh full audit written without replacing the Phase 1 audit.
- `outputs/phase3_validation.json`: machine-readable cross-check results for Phase 1/2 summaries and figures.
- `reports/EDADV_Final_Report.md`: academic report with methodology, validated findings, limitations, figures, and reproduction steps.
- `reports/legacy_chart_validation.md`: claim-level review of the ten existing `Datasets/charts/` figures.
- `figures_phase3/03_station_level_lst_by_zone_annotated.png`: adds represented-station counts to the zone comparisons.
- `figures_phase3/12_risk_label_mix_by_zone_annotated.png`: adds record counts and an explicit source-label limitation.

The CSV remains synthetic academic simulation data, not verified real-world Solapur measurements. `heat_index_c`, `substrate`, and `status` remain absent from the master schema and are not derived from separate user submissions.
