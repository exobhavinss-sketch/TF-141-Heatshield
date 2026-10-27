# HeatShield EDADV Final Report

**Project:** HeatShield — Urban Heat Exposure Analysis and Cooling Intelligence Platform  
**Study area represented in the dataset:** Solapur, Maharashtra, India  
**Team:** TF-141  
**Component:** Exploratory Data Analysis and Data Visualization (EDADV)  
**Phase:** Results validation and academic deliverables  
**Data status:** Synthetic academic simulation; not verified real-world Solapur measurements  
**Analysis source:** `Heat Shield Master Dataset(2).csv` (SHA-256 `b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83`)

## Abstract

This report validates and summarizes a reproducible exploratory analysis of HeatShield’s master dataset. The audited CSV contains 150,000 records and 57 columns; all rows identify as synthetic simulation data. It represents 100 location records across 1,500 observed dates spanning 2021–2025. Core summaries, distributions, IQR screening, correlations, grouped temporal summaries, zone comparisons, source risk labels, and point locations were checked against machine-readable outputs. The analysis found 326 dates without records in the inclusive calendar span and no full 24-hour timestamp coverage. The reported numerical patterns describe the encoded simulation only. They do not establish measured weather, health risk, causal mechanisms, or cooling intervention effectiveness in Solapur.

## 1. Introduction and objectives

HeatShield is an academic project about urban heat exposure and cooling intelligence. This EDADV phase aims to document the actual master CSV, validate previously generated results, describe supported patterns without causal interpretation, review legacy chart claims, and provide a repeatable workflow for academic review. The scope excludes website integration, database changes, and edits to the original dataset.

## 2. Dataset description and provenance

The canonical master CSV is the root file `Heat Shield Master Dataset(2).csv`. Its recorded size is 66,009,030 bytes. The Phase 1 audit and Phase 2 summary record the same SHA-256 shown on the title page. The CSV has 150,000 rows and 57 columns: 41 numeric, 12 categorical/text, two date/time, and two boolean fields according to the audit.

All 150,000 rows have `data_source_type = Synthetic simulation` and `is_synthetic = True`. Project documentation attributes some modeling/calibration provenance to WRF-Chem, ERA5-Land, and historical IMD baselines. The repository materials inspected do not include a generator or calibration inputs sufficient to independently verify those claims. They are therefore repository-documented provenance, not independently verified data lineage. No results in this report are official IMD observations, live sensor records, or verified Solapur climate estimates.

The master schema includes `air_temperature_c`, `relative_humidity_pct`, `land_surface_temperature_c`, `urban_heat_island_intensity_c`, `ndvi`, `ndbi`, `zone_type`, `season`, `heat_risk_category`, `location_id`, latitude, longitude, and related indices. It does **not** contain `heat_index_c`, `substrate`, or `status`. These absent fields were not inferred from the separate user-submission workflow.

## 3. Data quality and preprocessing

The Phase 1 audit was rerun into `outputs/phase3_audit_verification.json`. It confirmed the master hash, 150,000 × 57 shape, zero exact duplicate rows, zero duplicate identifiers, zero duplicate `(location_id, observation_date)` pairs, 100 unique locations, and 1,500 records per location. No empty cells were reported by the audited source scan. Literal `None` in `cooling_infrastructure_type` is a source category meaning no infrastructure rather than a missing value.

The audit found no timestamp parse failures or date-component mismatches. Parsed timestamps are timezone-aware UTC. Coordinate bounds are 17.612–17.722° N and 75.836–75.962° E with 100 unique coordinate pairs, all within the project’s broad Solapur screening envelope. That envelope is not an independently verified municipal boundary. The audit found no configured physical-range violations for the checked thermal fields, humidity, or air-temperature minimum/maximum ordering; these broad plausibility checks cannot validate simulation realism.

Phase 2 uses all finite numeric values and retains source categories. Date gaps are represented as missing coverage, not as zero readings. No rows were removed, no dates interpolated, and no continuous spatial surface estimated. Tukey 1.5×IQR flags are review candidates only. `wind_direction_deg` is circular and should not be interpreted as an ordinary linear measurement. Source field definitions for risk, cooling, and derived indices remain incomplete.

## 4. Exploratory analysis methodology

The implementation in `run_phase2_eda.py` exports descriptive tables, group summaries, paired correlation tables, matrices, figures, and a phase report. Numeric summaries include count, missing count, unique count, mean, sample standard deviation, median, quartiles, IQR, minimum, and maximum. Tukey screening uses Q1 − 1.5×IQR and Q3 + 1.5×IQR fences.

Pearson and Spearman coefficients are descriptive row-level associations. Spearman ranks use average ranks for ties. Each reported row-level pair has 150,000 complete pairs; this is a paired record count and not an independent sample size because observations repeat by location and date. Grouped zone, monthly, and annual comparisons use location summaries where available. Monthly/annual confidence bands are normal-approximation intervals across the 100 station means; they describe represented station variation in the simulation, not uncertainty about the city. No inferential hypothesis tests were run.

## 5. Descriptive statistics

| Variable | n | Mean | Sample SD | Median | Q1 | Q3 | Min | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Air temperature (°C) | 150,000 | 34.28 | 5.62 | 34.15 | 29.91 | 38.85 | 19.35 | 46.81 |
| Relative humidity (%) | 150,000 | 48.55 | 21.32 | 42.90 | 29.30 | 67.30 | 14.80 | 98.00 |
| Land surface temperature (°C) | 150,000 | 35.89 | 6.96 | 35.54 | 30.96 | 40.47 | 17.06 | 55.35 |
| Encoded UHI intensity (°C) | 150,000 | 3.27 | 2.66 | 2.81 | 1.04 | 5.06 | 0.00 | 9.80 |

All 41 numeric-column summaries are in `outputs/descriptive_statistics.csv` and `.json`. Categorical counts and percentages are in `outputs/categorical_frequencies.csv` and `outputs/categorical_summary.csv`.

## 6. Distribution and outlier analysis

The Phase 2 histograms show the record distributions for air temperature, relative humidity, and LST; boxplots show four core variables on separate axes. The IQR screen flagged 0 air-temperature values, 0 humidity values, 17 LST values, and 0 encoded UHI-intensity values. These flags do not establish invalidity. All records remain in the outputs. The full screening table for numeric columns is `outputs/iqr_outlier_screen.csv`.

**Figure 1** displays the three core record distributions. **Figure 2** displays core-variable boxplots and their candidate counts. Histograms count synthetic records; neither figure estimates a population distribution of observed Solapur conditions.

## 7. Correlation and relationship analysis

| Pair | Pearson r | Spearman ρ | Paired records |
|---|---:|---:|---:|
| Air temperature — relative humidity | −0.317 | −0.405 | 150,000 |
| Air temperature — LST | 0.936 | 0.939 | 150,000 |
| NDVI — LST | −0.307 | −0.250 | 150,000 |
| NDBI — LST | 0.369 | 0.335 | 150,000 |

These coefficients describe associations among synthetic records. They do not show that one variable causes another, nor do they independently validate environmental mechanisms. Index variables may be mathematically related to other encoded variables through the unknown generation process. The complete 190-pair table, Pearson/Spearman matrices, and station-mean correlations are in `outputs/correlation_pairs.csv`, `outputs/pearson_correlation_matrix.csv`, `outputs/spearman_correlation_matrix.csv`, and `outputs/station_mean_correlations.csv`.

**Figure 4** shows the air-temperature/humidity density pattern; **Figure 5** shows LST against NDVI and NDBI; **Figure 6** shows the selected-variable Pearson matrix. The density colors represent binned record counts. None of these visuals supports causal or real-world claims.

## 8. Temporal analysis

The timestamp range is 2021-01-01 08:00 UTC through 2025-12-31 12:47 UTC. The inclusive calendar span has 1,826 dates, of which 1,500 contain observations and 326 do not. Each observed date has exactly 100 records. Missing dates remain explicit and were not filled. Timestamps occupy ten distinct UTC hour bins (08:00 through 20:00); no complete 24-hour sampling design is present, so no diurnal curve was interpreted.

Across location means, source month 5 has the highest mean air temperature (40.80 °C) and month 10 the lowest (26.86 °C). For LST, month 5 is highest (43.58 °C) and month 10 lowest (28.12 °C). Annual mean-of-location summaries range from 34.22–34.35 °C for air temperature and 35.85–35.98 °C for LST over 2021–2025; these small differences are descriptive and do not establish a trend. The source season labels are available, but their definitions are not independently documented, so they are not treated as validated climatological seasons.

**Figure 7** shows month summaries averaged within location, with intervals across location means. **Figure 8** shows the corresponding annual summaries. **Figure 9** compares the source season labels. **Figure 11** marks observed and unobserved dates without interpolation. Exact monthly, annual, hour, and date coverage values are in the corresponding files under `outputs/`.

## 9. Zone and station comparisons

There are 100 locations across nine source zones. Each location contributes 1,500 records. Air-temperature zone means range from 32.60 °C for Waterbody to 35.19 °C for Industrial; LST means range from 29.48 °C for Waterbody to 38.47 °C for Industrial. These are means of represented location means. Unequal zone station counts (4–28) matter when comparing zones, and no causal interpretation is warranted.

`outputs/zone_station_comparison.csv` contains location counts, observation counts, mean and spread among location means, ranges, and descriptive intervals. `outputs/station_aggregates.csv` contains the individual location aggregates. **Figure 3** displays station-level LST distributions by zone; the annotated presentation copy adds the station count to each zone label.

## 10. Spatial analysis

**Figure 10** plots 100 distinct source coordinates and station mean LST. Coordinates are representative simulation locations per project documentation; this analysis does not verify them as physical sensor locations. The figure shows points only. No heat surface or values for unsampled areas were estimated. Coordinate bounds and uniqueness are recorded in the audit JSON.

## 11. Heat-risk label analysis and limitations

The master contains the source field `heat_risk_category`. Encoded counts are: Moderate 77,145; High 37,548; Low 21,737; Very High 13,570. High plus Very High account for 51,118 records (34.1%). Industrial has the largest within-zone Very High share at 16.4%. The repository did not provide verifiable thresholds, a validation procedure, or an independently supported health-risk classification. These are therefore source-encoded labels, not validated heat-risk categories. No illustrative external thresholds were applied.

**Figure 12** shows the label composition by zone. Its annotated copy adds per-zone record counts. Underlying exact counts and shares are in `outputs/risk_category_by_zone.csv`.

## 12. Key findings

1. The source and Phase 2 summary agree on a 150,000-record, 57-column synthetic dataset with 100 locations and 1,500 observations per location.
2. Coverage is incomplete: 326 of 1,826 calendar dates are unobserved; the source timestamps cover ten UTC hour bins.
3. Row-level air temperature and LST have a strong positive association (Pearson r = 0.936), while air temperature and relative humidity have a moderate negative association (r = −0.317). These are synthetic-data associations with repeated-record dependence.
4. The station-mean summaries identify Industrial as the highest and Waterbody as the lowest represented zone mean for both air temperature and LST. This describes those encoded groups and does not establish zone-wide conditions.
5. The IQR rule flags 17 LST records among the four core measures reviewed; the analysis retains these candidates.
6. The encoded risk and cooling fields can be summarized, but definitions and external validation are unavailable. They should not be used as measured exposure or proven intervention efficacy.

## 13. Conclusion

The existing Phase 2 outputs are internally consistent on the audited source hash, schema size, core descriptive statistics, reported correlations and paired counts, station and zone totals, risk totals, temporal coverage, and IQR candidate counts. Review of all twelve Phase 2 figures found clear units and provenance notes; two supplemental copies add sample counts to the zone boxplot and risk mix. Legacy charts include several numerically supported summaries, while some titles and annotations overstate causal, climatological, or operational meaning. The results are suitable as an exploratory analysis of synthetic academic simulation data when their provenance and limitations remain explicit.

## 14. Limitations and future work

- Synthetic records cannot establish actual Solapur weather, heat exposure, health outcomes, or intervention effectiveness.
- WRF-Chem, ERA5-Land, and IMD provenance claims are documented by the repository but were not independently verified from generator inputs or source observations.
- The source does not explain risk thresholds, season assignment, or formulas for several indices and priority scores.
- Repeated observations by location and date make row counts unsuitable as independent sample sizes for inferential tests. No inferential tests were run.
- Sparse dates and partial UTC-hour coverage limit temporal interpretation; no gap imputation was performed.
- Coordinates are a screening-box-valid point set, not a verified municipal boundary or verified sensor network.
- The source lacks `heat_index_c`, `substrate`, and `status`; analyses requiring those fields are out of scope.
- Legacy chart review outcomes and necessary corrections are detailed in `legacy_chart_validation.md`.

Future work should document or recover the synthetic generator, source definitions, risk-label thresholds, and index formulas. Any comparison with measured local data should be performed as a separately sourced and audited analysis. Inference should use a design that accounts for station/date dependence and report effect sizes and uncertainty, not p-values alone.

## 15. Reproducibility instructions

From the repository root in PowerShell, with Python 3.11 or newer and NumPy and Matplotlib installed:

The environment used for this validation had Python 3.11.15, NumPy 2.4.6, and Matplotlib 3.11.2.

```powershell
python edadv/audit_dataset.py "Heat Shield Master Dataset(2).csv" --output edadv/outputs/dataset_audit.json
python edadv/run_phase2_eda.py
python edadv/validate_phase3.py
python edadv/rebuild_compare_phase2.py
python edadv/prepare_phase3_figures.py
```

The audit command above writes the canonical audit path; to preserve a current audit, choose a new `--output` path such as `edadv/outputs/phase3_audit_verification.json`. The Phase 2 runner refuses to replace existing Phase 2 outputs unless `--overwrite` is passed. Use that option only when intentionally regenerating those files. `validate_phase3.py` checks the current audit and Phase 2 outputs and writes `outputs/phase3_validation.json`. `prepare_phase3_figures.py` writes annotated copies to `figures_phase3/` and leaves the original Phase 2 and legacy charts unchanged. The analysis uses NumPy and Matplotlib; the audit and validator use the Python standard library. No dependency was added for this phase.

`rebuild_compare_phase2.py` reruns Phase 2 in a temporary project and byte-compares all 19 machine-readable outputs, twelve figures, and the generated Phase 2 report against the current workspace. It removes its temporary files on exit.

## 16. Figure list

1. `figures/01_temperature_humidity_distributions.png` — record distributions for air temperature, relative humidity, and LST.
2. `figures/02_core_variable_boxplots.png` — core-variable boxplots and Tukey candidate counts.
3. `figures/03_station_level_lst_by_zone.png` — location-mean LST variation by source zone.
4. `figures/04_air_temperature_vs_humidity.png` — binned joint record density and Pearson coefficient.
5. `figures/05_lst_vs_vegetation_indices.png` — binned LST/NDVI and LST/NDBI associations.
6. `figures/06_core_correlation_matrix.png` — selected-variable Pearson correlation matrix.
7. `figures/07_monthly_temperature_patterns.png` — monthly location-mean patterns.
8. `figures/08_annual_temperature_comparison.png` — annual location-mean summaries.
9. `figures/09_season_label_temperature_summary.png` — grouping by source season label.
10. `figures/10_station_mean_lst_map.png` — point map of location-mean LST.
11. `figures/11_observation_date_coverage.png` — observed dates and date gaps.
12. `figures/12_risk_category_by_zone.png` — source-encoded risk-label composition by zone.

Presentation copies with per-zone sample counts: `figures_phase3/03_station_level_lst_by_zone_annotated.png` and `figures_phase3/12_risk_label_mix_by_zone_annotated.png`. Each figure’s caption identifies synthetic provenance and describes the plotted summary without a causal claim.

## 17. References and project records

No external source is cited because the inspected repository did not include verifiable source observations, generator code, or calibration datasets. The records used to reproduce this report are:

- HeatShield master CSV: `Heat Shield Master Dataset(2).csv`.
- Phase 1 audit: `outputs/dataset_audit.json` and `audit_dataset.py`.
- Phase 2 analysis: `run_phase2_eda.py`, `outputs/phase2_summary.json`, `outputs/phase2_figure_manifest.json`, and the CSV summaries under `outputs/`.
- Phase 3 validation: `validate_phase3.py` and `outputs/phase3_validation.json`.
- Legacy chart review: `legacy_chart_validation.md` and the unchanged images under `../Datasets/charts/`.

## 18. Planned academic submission outputs

The reproducible package consists of the audited source reference/hash, the Phase 1 audit, Phase 2 script and machine-readable outputs, twelve Phase 2 figures, two annotated presentation copies, the Phase 3 validation record, this report, the legacy-chart review, and the reproduction guide in `edadv/README.md`. All deliverables retain the synthetic-data disclosure and do not integrate results into the website or database.
