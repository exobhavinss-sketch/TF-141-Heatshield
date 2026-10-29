# HeatShield (TF-141) — EDADV Viva Defense & Oral Examination Guide

**Academic Track:** Exploratory Data Analysis & Data Visualization (EDADV)  
**Student Lead:** Aman Shaikh (`SCFU425013`)  
**Institution:** MIT Vishwaprayag University (MIT-VPU), Solapur, Maharashtra, India  
**Course Context:** B.Tech Semester III Capstone Project (FSD-1 + DBMS + EDADV)  
**Study Domain:** Urban Microclimate Telemetry, Surface Heat Island Dynamics & Cooling Prioritization  
**Target Geography:** Solapur Urban Agglomeration ($17.6120^\circ\text{N}$–$17.7220^\circ\text{N}$, $75.8360^\circ\text{E}$–$75.9620^\circ\text{E}$)  
**Audited Dataset:** `Heat Shield Master Dataset(2).csv` (SHA-256: `b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83`)

---

## 1. Problem Statement & Research Questions

### The Core Urban Challenge
Solapur experiences severe semi-arid heat stress with intense solar insolation and dense built environments. Urban surfaces absorb radiation and re-emit heat, creating localized thermal anomalies that exacerbate public discomfort and energy consumption.

### The Three Research Questions (RQs):
- **RQ1 (Morphological Thermal Disparity)**: How do Land Surface Temperature ($LST$) and Ambient Air Temperature ($T_{air}$) vary across Solapur's 9 standardized urban zones?
- **RQ2 (Biophysical Vegetative vs. Built-up Dynamics)**: What is the nature and strength of the empirical relationship between vegetative density (NDVI) vs. built-up intensity (NDBI) and localized thermal stress?
- **RQ3 (Multivariate Thermal Modeling)**: To what extent can environmental predictors (ambient temperature, humidity, insolation, wind, surface albedo, and spectral indices) statistically account for variations in Land Surface Temperature?

---

## 2. Dataset Schema, Size, Provenance & Synthetic Simulation Disclosure

### Verified Empirical Dataset Profile:
- **Total Records ($N$)**: Exactly **150,000 rows × 57 columns** (66,009,030 bytes / 62.95 MB).
- **Spatial Coverage**: 100 unique monitoring stations across 9 urban morphological zones.
- **Temporal Window**: 1 January 2021 to 31 December 2025.
- **SHA-256 Checksum**: `b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83`.

### Mandatory Viva Disclosure:
> *"Our master dataset is a calibrated synthetic academic simulation covering 2021–2025. While repository documentation notes WRF-Chem numerical atmospheric modeling and ERA5-Land reanalysis baselines, those claims have not been independently ground-truthed. We explicitly disclose that our records are not live physical readings from IMD or validated municipal sensor networks."*

---

## 3. Why Data Auditing Was Necessary

Before running statistical models or creating dashboards, a comprehensive pre-flight audit was executed via `edadv/audit_dataset.py`:
1. **Zero Missingness**: Confirmed 0 empty or null cells across all 8,550,000 data points.
2. **Literal 'None' Parsing Caveat**: Discovered that `cooling_infrastructure_type` contains the literal string `'None'` for 84,000 rows (locations lacking cooling infrastructure). In standard Pandas `read_csv()`, literal `'None'` is converted to `NaN` unless `keep_default_na=False` is explicitly set. Auditing prevented inadvertent data corruption.
3. **Identifier Uniqueness**: Confirmed 0 duplicate `record_id` entries and 0 duplicate `(location_id, observation_date)` pairs.
4. **Physical Thermodynamic Hierarchy**: Verified that $T_{min} \le T_{air} \le T_{max}$ holds true for 100% of the 150,000 records.

---

## 4. Descriptive Statistics & Visualizations

| Variable | Parametric (Mean ± SD) | Non-Parametric (Median, IQR) | Physical Range (Min–Max) |
|---|---:|---:|---:|
| **Ambient Air Temperature ($T_{air}$)** | $34.28^\circ\text{C} \pm 5.62^\circ\text{C}$ | $34.15^\circ\text{C}$ (IQR: $8.94^\circ\text{C}$) | $19.35^\circ\text{C}$ to $46.81^\circ\text{C}$ |
| **Land Surface Temperature ($LST$)** | $35.89^\circ\text{C} \pm 6.96^\circ\text{C}$ | $35.54^\circ\text{C}$ (IQR: $9.51^\circ\text{C}$) | $17.06^\circ\text{C}$ to $55.35^\circ\text{C}$ |
| **Relative Humidity ($RH$)** | $48.55\% \pm 21.32\%$ | $42.90\%$ (IQR: $38.00\%$) | $14.80\%$ to $98.00\%$ |
| **Encoded UHI Intensity** | $3.27^\circ\text{C} \pm 2.66^\circ\text{C}$ | $2.81^\circ\text{C}$ (IQR: $4.02^\circ\text{C}$) | $0.00^\circ\text{C}$ to $9.80^\circ\text{C}$ |

### Visual Architecture:
- 12 publication-grade figures in `edadv/figures/` (300 DPI, minimum $1200\times600$ resolution).
- Figures 1–2: Density distributions and Tukey boxplots.
- Figures 3, 13: Zone thermal boxplots with station counts and ANOVA statistics.
- Figures 4–6: Bivariate hexbin scatter plots and correlation matrices.
- Figure 14: 4-panel regression diagnostic plots (Residuals vs. Fitted, Normal Q-Q, Scale-Location, Predicted vs. Observed).

---

## 5. Pearson versus Spearman Correlation

| Paired Variables ($N=150,000$) | Pearson Linear ($r$) | Spearman Rank ($\rho$) | Biophysical Interpretation |
|---|---:|---:|---|
| **$T_{air} \leftrightarrow LST$** | **$+0.936$** | **$+0.939$** | Strong positive coupling between surface skin temperature and canopy air layer. |
| **$T_{air} \leftrightarrow RH$** | **$-0.317$** | **$-0.405$** | Moderate negative association; warmer air holds more moisture before saturation, lowering relative humidity. |
| **$\text{NDVI} \leftrightarrow LST$** | **$-0.307$** | **$-0.250$** | Significant negative association; dense vegetation moderates surface thermal accumulation. |
| **$\text{NDBI} \leftrightarrow LST$** | **$+0.369$** | **$+0.335$** | Positive association; impervious built-up materials amplify radiant surface heating. |

**Key Defense Point**: Pearson $r$ evaluates strict linear relationships, while Spearman $\rho$ assesses monotonic relationships on rank-transformed data. Because Pearson and Spearman magnitudes closely agree across all pairs, the observed relationships are robust to non-linear monotonic warping.

---

## 6. What IQR Outlier Screening Does and Does Not Prove

### Screening Formula:
Tukey Fences: $\text{Lower} = Q_1 - 1.5\times\text{IQR}$, $\text{Upper} = Q_3 + 1.5\times\text{IQR}$.

### Screening Results on 150,000 Records:
- **Air Temperature**: **0 candidate outliers** ($Q_1=29.91^\circ\text{C}, Q_3=38.85^\circ\text{C}$, Fences: $16.50^\circ\text{C}$–$52.26^\circ\text{C}$).
- **Relative Humidity**: **0 candidate outliers** ($Q_1=29.30\%, Q_3=67.30\%$, Fences: $-27.70\%$–$124.30\%$).
- **Encoded UHI Intensity**: **0 candidate outliers** ($Q_1=1.04^\circ\text{C}, Q_3=5.06^\circ\text{C}$, Fences: $-4.99^\circ\text{C}$–$11.09^\circ\text{C}$).
- **Land Surface Temperature ($LST$)**: **17 candidate outliers** ($Q_1=30.96^\circ\text{C}, Q_3=40.47^\circ\text{C}$, Upper Fence: $54.73^\circ\text{C}$, flagged values: $54.74^\circ\text{C}$–$55.35^\circ\text{C}$).

**Viva Question**: *"Did you delete the 17 LST outliers?"*  
**Model Answer**: *"No. Outlier screening identifies statistical candidates for scientific inspection; it does not prove data corruption. All 17 flagged records occurred during simulated May pre-monsoon heatwaves in Industrial zones where high NDBI and low albedo naturally generate peak skin temperatures up to $55.35^\circ\text{C}$. Deleting them would artificially censor legitimate extreme events."*

---

## 7. Why ANOVA and Kruskal–Wallis Were Selected

To evaluate whether urban morphological zones exhibit significant microclimate differences, both parametric and non-parametric omnibus tests were applied:
1. **One-Way ANOVA**: Evaluates equality of group means across the 9 zones ($F$-test).
2. **Levene's Test for Homoscedasticity**: Tested whether group variances are equal.
   - Result: $W = 214.25, p < 0.001$. Rejecting homoscedasticity violates standard ANOVA assumptions!
3. **Welch's ANOVA**: Used as the heteroscedasticity-robust parametric alternative ($F_{Welch} = 2,829.41, p < 0.001$).
4. **Kruskal–Wallis $H$-Test**: Non-parametric rank-based test making no assumptions about normality or equal variances ($H = 18,866.46, p < 0.001$).

Both parametric and rank tests decisively reject the null hypothesis of thermal uniformity across zones.

---

## 8. Null and Alternative Hypotheses (ANOVA & Regression)

### Zone LST Omnibus Test:
- $H_0$: $\mu_{Residential} = \mu_{Commercial} = \mu_{Industrial} = \mu_{Road} = \mu_{Park} = \mu_{Educational} = \mu_{Transport} = \mu_{Waterbody} = \mu_{OpenLand}$
- $H_1$: At least one zone mean differs significantly from the others.
- **Outcome**: $F(8, 149991) = 2,895.32, p < 0.001 \implies$ **Reject $H_0$**.

### Post-Hoc Pairwise Testing:
- Tukey's HSD test with Family-Wise Error Rate (FWER) control at $\alpha = 0.05$ demonstrates that **Industrial** has the highest mean LST ($38.47^\circ\text{C}$), while **Waterbody** has the lowest ($29.48^\circ\text{C}$), a mean disparity of **$8.99^\circ\text{C}$**.

---

## 9. How to Interpret p-Values Without Overstating Their Meaning

**Crucial Examiner Trap**: *"Your p-value is 0.000. Does that mean your results are 100% true in Solapur?"*  
**Model Answer**:  
*"No. A p-value of $p < 0.001$ only indicates that, under the null hypothesis of equal zone means, the probability of observing our test statistic by random sampling alone is virtually zero. However, with $N = 150,000$, even minuscule differences become statistically significant. Therefore, p-values must always be evaluated alongside effect size and study design. The p-value does not prove real-world accuracy or causality."*

---

## 10. Why Effect Sizes and Confidence Intervals Matter

- **Eta-Squared ($\eta^2$)**: For LST across zones, $\eta^2 = \frac{SS_{between}}{SS_{total}} = 0.1337$.
  - This indicates that **$13.4\%$** of the total variance in LST is explained by macro-zone typology alone.
- **Omega-Squared ($\omega^2$)**: $\omega^2 = 0.1336$ (unbiased population estimator).
- **Kruskal-Wallis Epsilon-Squared ($\epsilon^2$)**: $\epsilon^2 = 0.1258$.
- **Confidence Intervals**: 95% CIs for regression coefficients provide the bounded range of expected parameter values rather than a point estimate.

---

## 11. What OLS Regression Estimates & Its Assumptions

### Model Specification:
$$\text{LST}_i = \beta_0 + \beta_1 T_{air,i} + \beta_2 RH_i + \beta_3 \text{Solar}_i + \beta_4 \text{Wind}_i + \beta_5 \text{NDVI}_i + \beta_6 \text{NDBI}_i + \beta_7 \text{Albedo}_i + \epsilon_i$$

### Goodness of Fit:
- **$R^2 = 0.9618$**: The 7 environmental predictors account for **$96.18\%$** of the variance in simulated LST.
- **Adjusted $R^2 = 0.9618$**: Adjusted for 7 degrees of freedom.
- **Root Mean Squared Error (RMSE)**: **$1.359^\circ\text{C}$**.
- **Mean Absolute Error (MAE)**: **$1.074^\circ\text{C}$**.

### Parameter Estimates (with HC3 Heteroscedasticity-Robust Standard Errors):
- Intercept ($\beta_0$): $-3.6712^\circ\text{C}$ ($t = -67.24, p < 0.001$)
- Air Temperature ($\beta_1$): $+0.9981$ ($t = 1113.84, p < 0.001$) $\implies$ $+1^\circ\text{C}$ air temp $\approx +1^\circ\text{C}$ LST.
- Built-Up Index NDBI ($\beta_6$): **$+7.3738$** ($t = 186.12, p < 0.001$) $\implies$ Dominant surface heating driver.
- Vegetation Index NDVI ($\beta_5$): **$+2.3135$** (In bivariate correlation, NDVI is $-0.307$; when controlling for air temperature and NDBI simultaneously, its partial coefficient shifts due to covariance with albedo and humidity).
- Solar Radiation ($\beta_3$): $+0.0059$ ($t = 104.91, p < 0.001$).
- Relative Humidity ($\beta_2$): $-0.0049$ ($t = -19.46, p < 0.001$).

---

## 12. Multicollinearity & Residual Diagnostics

1. **Variance Inflation Factor (VIF)**:
   - Evaluated for all 7 predictors.
   - Highest observed VIF was **$1.46$** (NDBI) and **$1.38$** (Air Temp).
   - Because all VIF values are well below the conservative threshold of $5.0$, multicollinearity is negligible and does not destabilize coefficient standard errors.
2. **Residual Normality**:
   - Jarque-Bera test on residuals: $JB = 3,412.8, p < 0.001$. Residuals exhibit slight kurtosis at the extreme heatwave tails, which is why HC3 robust standard errors were computed.
3. **Durbin-Watson Autocorrelation**:
   - $DW = 1.86$ (Close to $2.0$, indicating low first-order serial correlation in the pooled ordering).

---

## 13. Why Repeated Station Observations Violate Independence Assumptions

**Crucial Statistical Insight**:
The dataset contains 150,000 rows, but they are generated from **100 unique monitoring stations** observed across 1,500 dates.
- Observations from the same station across consecutive dates are spatially and temporally autocorrelated.
- Treating all 150,000 rows as completely independent ($i.i.d.$) artificially shrinks standard errors and inflates $t$-statistics.

**Our Mitigation (Station-Level Sensitivity Analysis)**:
We aggregated the data into longitudinal station means ($N=100$ independent physical sites) and re-estimated the OLS model:
- **Station-Level Model $R^2$**: **$0.9830$** ($98.3\%$ variance explained across the 100 sites).
- **Station-Level Air Temp Coef**: $+1.1843$.
- **Station-Level NDBI Coef**: $+9.1456$.
- **Conclusion**: The biophysical associations remain rock-solid across both pooled ($N=150,000$) and site-aggregated ($N=100$) scales.

---

## 14. Why Statistical Significance Does Not Prove Causation

- A regression coefficient of $+7.37$ for NDBI means that in the simulation, areas with higher built-up indices exhibit higher surface temperatures.
- It does **not** prove that paving a lawn will immediately raise localized surface temperature by $7.37^\circ\text{C}$, because microclimate dynamics involve advection, localized shading, wind corridors, and soil moisture that cannot be captured by observational regression alone.

---

## 15. Why the Dataset Cannot Establish Real-World Solapur Heat Conditions

1. **Simulation Bounds**: The records are model outputs, not verified field measurements.
2. **Unvalidated Derived Risk Labels**: The dataset contains `heat_risk_category` (*Low, Moderate, High, Very High*). The exact classification cutoffs and public health calibrations are not documented in code; they are source-encoded descriptive categories, not certified clinical health risks.
3. **No Sensor Calibration**: Coordinates represent representative simulation points within Solapur's bounding box ($17.612^\circ$–$17.722^\circ\text{N}$), not physical Stevenson screens or calibrated weather stations.

---

## 16. Temporal Gaps & The Daytime-Only Limitation

- **Calendar Coverage**: Out of 1,826 days in 2021–2025, exactly **1,500 dates have records** and **326 dates have zero records** (maximum gap is 2 consecutive days). We explicitly preserved these gaps without fabricating or interpolating missing days.
- **Hour Distribution**: All records fall between **08:00 and 20:00 UTC** (10 discrete daytime hour bins).
- **Viva Defense Point**: *"Why didn't you plot a 24-hour diurnal curve?"*  
  *"Because nocturnal hours (21:00 to 07:00 UTC) are completely absent from the dataset. Urban Heat Island intensity typically peaks 3 to 5 hours after sunset due to thermal inertia. Attempting to fit a diurnal curve without night data would be unscientific and misleading."*

---

## 17. Reproducibility & Dependency Management

- **Python Requirements**: Formally specified in `edadv/requirements.txt` (`numpy`, `pandas`, `scipy`, `matplotlib`, `seaborn`, `nbformat`, `jupyter`).
- **Interactive Jupyter Notebook**: Fully reproducible at `edadv/notebooks/heatshield_eda.ipynb` (21 structured sections).
- **Automated Validation Suite**: `edadv/validate_phase3.py` verifies 14 statistical, integrity, and figure assertions with a clean exit code `0`.
- **Zero-Dependency Core**: The initial audit (`edadv/audit_dataset.py`) runs on standard library Python without installing external packages.

---

## 18. Anticipated Viva Questions & Model Answers

### Q1: "Why did you build an automated validation script instead of just running EDA in pandas?"
> **Answer**: *"Academic reproducibility requires verifiable proof that published figures and text claims match the raw data. Our `validate_phase3.py` runs 14 automated assertion checks verifying the SHA-256 hash, zero-null invariant, numeric means, correlation coefficients, zone totals, and figure resolutions. If any row is tampered with, the validation suite fails immediately."*

### Q2: "Which zone in Solapur requires urgent municipal cooling intervention based on your analysis?"
> **Answer**: *"Our morphological analysis ranks Industrial zones as experiencing the highest thermal stress (mean LST $38.47^\circ\text{C}$), followed by Commercial corridors ($37.12^\circ\text{C}$) and Road arteries ($36.85^\circ\text{C}$). High and Very High risk categories account for $34.1\%$ of all records and concentrate heavily in these zones due to high NDBI ($r = +0.369$) and severe tree canopy deficits."*

### Q3: "What is the difference between air temperature and land surface temperature?"
> **Answer**: *"Air temperature ($T_{air}$) measures the kinetic thermal energy of atmospheric gases at $1.5$–$2.0$ meters above ground (measured in Stevenson screens). Land Surface Temperature ($LST$) measures the radiant skin temperature of the surface (measured by thermal infrared remote sensing like Landsat/MODIS). In our dataset, $LST$ has a much wider distribution ($\mu = 35.89^\circ\text{C}$, peak $55.35^\circ\text{C}$) than $T_{air}$ ($\mu = 34.28^\circ\text{C}$, peak $46.81^\circ\text{C}$) due to direct solar absorption by pavement and roofs."*

### Q4: "How does your EDADV work integrate with the team's DBMS and Frontend deliverables?"
> **Answer**: *"Our analysis directly feeds the other two tracks:
> 1. For Bhavin's DBMS track, our audit confirmed the 57-column schema and provided the basis for the 3NF normalization into 6 relational entities.
> 2. For Furqan's Frontend track, our script `export_web_summary.py` compiles the validated station aggregates, correlation pairs, and monthly curves into `src/data/edadvSummary.json`, ensuring the React dashboard displays verified scientific summaries without hardcoding."*

---
*Prepared for Team TF-141 — Aman Shaikh (EDADV Lead), MIT Vishwaprayag University.*
