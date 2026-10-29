# HeatShield EDADV — Academic Analytics, Modeling & Visualization Package

**Project:** HeatShield — Urban Heat Exposure Analysis and Cooling Intelligence Platform<br/>
**Academic Institution:** MIT Vishwaprayag University (MIT-VPU), Solapur, Maharashtra, India<br/>
**Academic Track:** EDADV (Exploratory Data Analysis and Data Visualization)<br/>
**Student Lead:** Aman Shaikh (`SCFU425013`)<br/>
**Team Identifier:** TF-141<br/>
**Study Domain:** Urban Microclimate Telemetry, Biophysical Cooling Dynamics & Surface Thermal Disparities<br/>
**Target Geography:** Solapur Urban Agglomeration ($17.6120^\circ\text{N}$–$17.7220^\circ\text{N}$, $75.8360^\circ\text{E}$–$75.9620^\circ\text{E}$)<br/>
**Master Dataset:** `Heat Shield Master Dataset(2).csv` (SHA-256: `b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83`)

---

## 1. Package Overview & Structure

The `edadv/` package contains the complete, reproducible data science workflow for Project HeatShield:
- **Phase 1**: Pre-flight data quality audit & boundary checks (`audit_dataset.py`).
- **Phase 2**: Comprehensive exploratory data analysis, distribution profiling, Tukey IQR outlier screening, and correlation matrices (`run_phase2_eda.py`).
- **Phase 3**: Automated 14-point validation harness (`validate_phase3.py`) and byte-for-byte reproducibility runner (`rebuild_compare_phase2.py`).
- **Phase 4**: Econometric & inferential hypothesis testing: One-Way ANOVA, Welch's ANOVA, Kruskal-Wallis across 9 urban zones, and multivariate OLS regression with HC3 robust standard errors (`statistical_inference.py`).
- **Phase 5**: Interactive academic Jupyter Notebook (`notebooks/heatshield_eda.ipynb`) and viva defense preparation materials.
- **Frontend Bridge**: Web summary exporter generating precomputed scientific JSON fixtures for the React single-page application (`export_web_summary.py` $\rightarrow$ `src/data/edadvSummary.json`).

### Directory Layout
```
edadv/
├── README.md                                 # Package guide and execution documentation (this file)
├── requirements.txt                          # Formally declared Python dependencies
├── audit_dataset.py                          # Phase 1: Zero-dependency stdlib dataset auditor
├── run_phase2_eda.py                         # Phase 2: Core descriptive EDA & figure generation
├── validate_phase3.py                        # Phase 3: 14-point automated assertion validator
├── rebuild_compare_phase2.py                 # Phase 3: Byte-for-byte reproduction test runner
├── prepare_phase3_figures.py                 # Phase 3: Annotated presentation figure generator
├── statistical_inference.py                  # Phase 4: ANOVA, Kruskal-Wallis & OLS regression engine
├── export_web_summary.py                     # Data Bridge: Exports summary JSON to React frontend
│
├── notebooks/                                # Interactive Jupyter Notebooks
│   └── heatshield_eda.ipynb                  # 21-section interactive EDA & modeling notebook
│
├── outputs/                                  # Machine-readable analytical outputs (CSV & JSON)
│   ├── dataset_audit.json                    # Full structural profile of all 57 columns
│   ├── descriptive_statistics.csv / .json    # 41 numeric column parametric/non-parametric metrics
│   ├── correlation_pairs.csv                 # 190 pairwise Pearson & Spearman correlation rows
│   ├── pearson_correlation_matrix.csv        # Core 20x20 linear correlation matrix
│   ├── spearman_correlation_matrix.csv       # Core 20x20 rank correlation matrix
│   ├── station_aggregates.csv                # Longitudinal aggregates across 100 stations
│   ├── zone_station_comparison.csv           # Comparative metrics across 9 urban zones
│   ├── temporal_coverage.csv                 # Day-by-day observation coverage across 1,826 days
│   ├── iqr_outlier_screen.csv                # Tukey 1.5x IQR outlier candidates
│   ├── phase2_summary.json                   # Consolidated Phase 2 metadata & key statistics
│   ├── phase3_validation.json                # Phase 3 validation assertion results (14/14 PASS)
│   └── statistical_inference.json            # Machine-readable ANOVA, Kruskal-Wallis & OLS results
│
├── figures/                                  # 14 publication-quality analytical figures (300 DPI)
│   ├── 01_temperature_humidity_distributions.png
│   ├── 02_core_variable_boxplots.png
│   ├── 03_station_level_lst_by_zone.png
│   ├── 04_air_temperature_vs_humidity.png
│   ├── 05_lst_vs_vegetation_indices.png
│   ├── 06_core_correlation_matrix.png
│   ├── 07_monthly_temperature_patterns.png
│   ├── 08_annual_temperature_comparison.png
│   ├── 09_season_label_temperature_summary.png
│   ├── 10_station_mean_lst_map.png
│   ├── 11_observation_date_coverage.png
│   ├── 12_risk_category_by_zone.png
│   ├── 13_inferential_zone_comparisons.png   # Inferential ANOVA & Kruskal-Wallis zone distributions
│   └── 14_lst_multivariate_regression_diagnostics.png # 4-panel OLS residual diagnostic plots
│
├── figures_phase3/                           # Annotated presentation figures
│   ├── 03_station_level_lst_by_zone_annotated.png
│   └── 12_risk_label_mix_by_zone_annotated.png
│
└── reports/                                  # Comprehensive academic reports & defense guides
    ├── EDADV_Final_Report.md                 # Primary Phase 3 academic deliverables report
    ├── phase2_eda_report.md                  # Detailed Phase 2 empirical findings report
    ├── legacy_chart_validation.md            # Claim-level audit of the 10 legacy Datasets/charts
    ├── statistical_inference_report.md       # Full econometric & inferential hypothesis report
    ├── EDADV_Viva_Preparation.md             # Complete oral exam defense guide for Aman Shaikh
    └── EDADV_Remediation_Final_Report.md     # Final requirement-to-deliverable verification audit
```

---

## 2. Environment Setup & Python Dependencies

The Python environment is formally declared in [`requirements.txt`](requirements.txt). It is tested and compatible with **Python 3.10 through 3.14** (verified on Python 3.11.15 and 3.14.6).

### Virtual Environment Setup (Windows PowerShell):
```powershell
# 1. Create isolated virtual environment
python -m venv venv

# 2. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 3. Upgrade pip and install pinned dependencies
python -m pip install --upgrade pip
pip install -r edadv/requirements.txt
```

---

## 3. Execution & Reproduction Pipeline

All scripts must be executed from the **repository root**:

### Step 1: Pre-flight Dataset Audit
```powershell
python edadv/audit_dataset.py "Heat Shield Master Dataset(2).csv" --output edadv/outputs/dataset_audit.json
```
- Validates the master CSV SHA-256 (`b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83`).
- Confirms 150,000 rows × 57 columns, zero missing values, zero duplicate IDs, and coordinate bounds ($17.6120^\circ$–$17.7220^\circ\text{N}$, $75.8360^\circ$–$75.9620^\circ\text{E}$).

### Step 2: Exploratory Data Analysis & Figure Generation
```powershell
python edadv/run_phase2_eda.py --overwrite
```
- Generates 19 machine-readable summary tables in `edadv/outputs/`.
- Exports 12 publication-grade figures in `edadv/figures/` (Figures 01 to 12).
- Produces `edadv/reports/phase2_eda_report.md`.

### Step 3: Run Validation & Integrity Suite
```powershell
python edadv/validate_phase3.py
```
- Executes 14 automated assertion checks verifying numeric means, correlations, temporal totals, and figure manifests.
- Returns clean exit code `0` (`"status": "passed"`).

### Step 4: Run Inferential Hypothesis Testing & Econometric Modeling
```powershell
python edadv/statistical_inference.py
```
- Performs One-Way ANOVA, Welch's ANOVA, and Kruskal-Wallis across the 9 urban zones for LST and Air Temperature.
- Fits a 7-parameter multivariate OLS regression predicting LST with classical and HC3 robust standard errors.
- Calculates Variance Inflation Factors (VIF) and residual diagnostics (Durbin-Watson, Jarque-Bera).
- Generates Figures 13 & 14, `outputs/statistical_inference.json`, and `reports/statistical_inference_report.md`.

### Step 5: Launch the Interactive Jupyter Notebook
```powershell
jupyter notebook edadv/notebooks/heatshield_eda.ipynb
```
- Interactive 21-section notebook for classroom presentations and viva demonstrations.

### Step 6: Synchronize Web Dashboard Fixtures
```powershell
python edadv/export_web_summary.py
```
- Synchronizes the React dashboard fixture at `src/data/edadvSummary.json` from the verified dataset.

---

## 4. Academic Boundaries & Provenance Disclosures

> [!WARNING]
> **Mandatory Simulation Notice:**
> - All 150,000 observation records represent **calibrated synthetic academic simulation data** for Solapur (2021–2025 across 100 monitoring sites).
> - Lineage claims referencing WRF-Chem and ERA5-Land are repository-documented baselines that have not been independently ground-truthed.
> - The records are **not** live physical readings from IMD or validated hospital heat-stroke admissions.
> - Source risk categories (*Low, Moderate, High, Very High*) are descriptive dataset labels, not certified clinical health classifications.
> - Statistical significance ($p < 0.001$) and high regression fit ($R^2 = 0.9618$) reflect mathematically structured simulation rules; they do **not** prove real-world causal mechanisms.

---

## 5. Website Integration vs. Academic-Only Outputs

| Artifact | Primary Audience | Integration Status |
|---|---|---|
| [`src/data/edadvSummary.json`](../src/data/edadvSummary.json) | **Public Web Application** | Active; compiled into Vite bundle; powers `/dashboard`, `/explore-data`, and `/heat-map`. |
| [`edadv/figures/`](figures/) (14 Figures) | **Research Report & Viva** | Academic submission figures; displayed in publication documentation. |
| [`edadv/notebooks/heatshield_eda.ipynb`](notebooks/heatshield_eda.ipynb) | **University Evaluators** | Interactive demonstration notebook for external viva examination. |
| [`edadv/outputs/statistical_inference.json`](outputs/statistical_inference.json) | **Econometric Reviewers** | Machine-readable inferential test statistics and HC3 parameters. |
| [`edadv/reports/EDADV_Viva_Preparation.md`](reports/EDADV_Viva_Preparation.md) | **Student Team (Aman Shaikh)** | Oral defense cheat sheet and viva questions guide. |
