"""
HEATSHIELD — EDADV ASSIGNMENT 3 (Questions 1–25)
Requirements: pip install pandas numpy matplotlib seaborn
Place "Heat Shield Master Dataset.csv" beside this script, then run:
python heatshield_edadv_assignment3.py

The source dataset is a synthetic academic simulation.
"""

from pathlib import Path
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

pd.set_option("display.max_columns", None)
pd.set_option("display.width", 180)

DATA_FILE = Path(__file__).resolve().parent / "Heat Shield Master Dataset.csv"
if not DATA_FILE.exists():
    raise FileNotFoundError(
        f"CSV not found: {DATA_FILE}. Put 'Heat Shield Master Dataset.csv' "
        "in the same folder as this script or edit DATA_FILE."
    )

df = pd.read_csv(DATA_FILE)

required = [
    "record_id", "location_id", "observation_datetime", "season",
    "data_source_type", "location_name", "zone_type",
    "air_temperature_c", "relative_humidity_pct",
    "land_surface_temperature_c", "ndvi", "ndbi",
    "heat_risk_category", "cooling_infrastructure_type"
]
missing = [c for c in required if c not in df.columns]
if missing:
    raise KeyError(f"Required columns missing from CSV: {missing}")

print("\nDATASET LOADED:", DATA_FILE.name)

# ============================================================
# SECTION A — DATASET EXPLORATION
# ============================================================

# Q1 — First look
print("\nQ1 — SHAPE")
print(f"The dataset contains {df.shape[0]} rows and {df.shape[1]} columns.")
print("\nQ1 — COLUMNS")
print(df.columns.tolist())
print("\nQ1 — HEAD")
print(df.head(5))
print("\nQ1 — TAIL")
print(df.tail(4))
print("\nQ1 — RANDOM SAMPLE")
print(df.sample(min(5, len(df)), random_state=42))

# Q2 — Types, structure and statistics
print("\nQ2 — DATA TYPES")
print(df.dtypes)
print("\nQ2 — INFO")
df.info()
print("\nQ2 — NUMERIC DESCRIPTION")
print(df.describe())
print("\nQ2 — ALL-COLUMN DESCRIPTION")
print(df.describe(include="all"))

# Q3 — Column classification (written response)
print("\nQ3 — COLUMN CLASSIFICATION")
print("Identifiers: record_id, location_id")
print("Numerical: air_temperature_c, relative_humidity_pct, land_surface_temperature_c, ndvi, ndbi, latitude, longitude")
print("Binary: is_synthetic, cooling_infrastructure_present")
print("Categorical: season, zone_type, heat_risk_category, cooling_infrastructure_type, recommended_intervention")
print("An identifier's mean is not meaningful. A binary 0/1 mean can represent the proportion of records with value 1.")

# ============================================================
# SECTION B — DATA QUALITY ASSESSMENT
# ============================================================

# Q4 — Missing values
print("\nQ4 — MISSING COUNTS")
print(df.isnull().sum())
print("\nQ4 — MISSING PERCENTAGES")
print((df.isnull().mean() * 100).round(2))
print("\nQ4 — COLUMNS WITH MISSING VALUES")
print((df.isnull().mean() * 100).round(2).loc[lambda x: x > 0].sort_values(ascending=False))
print("\nQ4 — ROWS WITH ANY MISSING VALUE")
print(df.isnull().any(axis=1).sum())
print("\nQ4 — ROWS WHERE BOTH TEMPERATURE FIELDS ARE MISSING")
print(df[["air_temperature_c", "land_surface_temperature_c"]].isnull().all(axis=1).sum())

# Q5 — Categorical consistency
for col in ["season", "zone_type", "location_name", "data_source_type",
            "cooling_infrastructure_type", "heat_risk_category"]:
    print(f"\nQ5 — VALUE COUNTS: {col}")
    print(df[col].value_counts(dropna=False))
print("\nQ5 — UNIQUE SEASONS")
print(df["season"].unique().tolist())
print("\nQ5 — UNIQUE ZONES")
print(df["zone_type"].unique().tolist())
print("\nQ5 — UNIQUE RISK CATEGORIES")
print(df["heat_risk_category"].unique().tolist())

# Q6 — Duplicates
print("\nQ6 — EXACT DUPLICATE COUNT")
print(df.duplicated().sum())
print("\nQ6 — DUPLICATE ROWS")
print(df[df.duplicated(keep=False)].sort_values("record_id").head(10))
temp = df.drop_duplicates()
print("\nQ6 — TEMP SHAPE")
print(temp.shape)
print("\nQ6 — DUPLICATE RECORD IDS")
print(temp["record_id"].duplicated().sum())
print("\nQ6 — ROWS WITH DUPLICATE RECORD IDS")
print(temp[temp["record_id"].duplicated(keep=False)].sort_values("record_id"))
print("\nQ6 — DUPLICATE LOCATION/TIMESTAMP PAIRS")
print(temp.duplicated(subset=["location_id", "observation_datetime"]).sum())

# ============================================================
# SECTION C — DATA CLEANING AND PREPROCESSING
# ============================================================

# Q7 — Standardise names and text whitespace
df_clean = df.copy()
df_clean = df_clean.rename(str.lower, axis="columns")
df_clean.columns = df_clean.columns.str.strip()
for col in df_clean.select_dtypes(include=["object"]).columns:
    df_clean[col] = df_clean[col].str.strip()
print("\nQ7 — STANDARDISED COLUMNS")
print(df_clean.columns.tolist())

# Q8 — Remove exact duplicates and reset index
print("\nQ8 — SHAPE BEFORE")
print(df_clean.shape)
df_clean = df_clean.drop_duplicates()
df_clean = df_clean.reset_index(drop=True)
print("\nQ8 — SHAPE AFTER")
print(df_clean.shape)

# Q9 — Numerical missing values (fills only actual NaNs)
print("\nQ9 — AIR TEMPERATURE MISSING BEFORE")
print(df_clean["air_temperature_c"].isnull().sum())
print("\nQ9 — AIR TEMPERATURE MEDIAN")
print(df_clean["air_temperature_c"].median())
df_clean["air_temperature_c"] = df_clean["air_temperature_c"].fillna(df_clean["air_temperature_c"].median())
print("\nQ9 — SURFACE TEMPERATURE MISSING BEFORE")
print(df_clean["land_surface_temperature_c"].isnull().sum())
df_clean["land_surface_temperature_c"] = df_clean["land_surface_temperature_c"].fillna(df_clean["land_surface_temperature_c"].median())

# Q10 — Categorical missing values (fills only actual NaNs)
print("\nQ10 — SEASON MISSING BEFORE")
print(df_clean["season"].isnull().sum())
if not df_clean["season"].mode().empty:
    df_clean["season"] = df_clean["season"].fillna(df_clean["season"].mode()[0])
print("\nQ10 — ZONE MISSING BEFORE")
print(df_clean["zone_type"].isnull().sum())
if not df_clean["zone_type"].mode().empty:
    df_clean["zone_type"] = df_clean["zone_type"].fillna(df_clean["zone_type"].mode()[0])

# Q11 — Inspect placeholder categories; do not overwrite literal None category
print("\nQ11 — COOLING INFRASTRUCTURE CATEGORIES")
print(df_clean["cooling_infrastructure_type"].value_counts(dropna=False))
print("\nQ11 — DATA SOURCE CATEGORIES")
print(df_clean["data_source_type"].value_counts(dropna=False))
print("\nQ11 — LITERAL UNKNOWN DATA SOURCE COUNT")
print((df_clean["data_source_type"].astype(str).str.strip().str.lower() == "unknown").sum())
print("Note: literal 'None' in cooling_infrastructure_type may be a valid category; do not automatically convert it to NaN.")

# Q12 — Verify and export cleaned data
print("\nQ12 — MISSING VALUES AFTER CLEANING")
print(df_clean.isnull().sum())
print("\nQ12 — CLEANED SHAPE")
print(df_clean.shape)
print("\nQ12 — CLEANED DATA TYPES")
print(df_clean.dtypes)
df_clean["record_id"] = df_clean["record_id"].astype(str)
CLEAN_FILE = Path(__file__).resolve().parent / "heatshield_clean.csv"
df_clean.to_csv(CLEAN_FILE, index=False)
df_check = pd.read_csv(CLEAN_FILE)
print("\nQ12 — EXPORT CHECK")
print("Cleaned shape:", df_clean.shape)
print("Reloaded shape:", df_check.shape)
print("Saved:", CLEAN_FILE.name)

# ============================================================
# SECTION D — CORE PANDAS OPERATIONS
# ============================================================

# Q13 — loc and iloc
cols = ["air_temperature_c", "relative_humidity_pct", "land_surface_temperature_c"]
print("\nQ13 — LOC")
print(df_clean.loc[10:14, cols])
print("\nQ13 — ILOC")
positions = df_clean.columns.get_indexer(cols)
print(df_clean.iloc[10:15, positions])

# Q14 — Filtering
high_temperature = df_clean[df_clean["air_temperature_c"] >= 40]
print("\nQ14 — HIGH TEMPERATURE RECORDS")
print(high_temperature.head(5))
print("\nQ14 — HIGH TEMPERATURE COUNT")
print(len(high_temperature))
print("\nQ14 — HIGH TEMPERATURE PERCENTAGE")
print(len(high_temperature) / len(df_clean) * 100)
high_humidity = df_clean[df_clean["relative_humidity_pct"] >= 60]
print("\nQ14 — HIGH HUMIDITY RECORDS")
print(high_humidity.head(5))

# Q15 — Sorting
print("\nQ15 — SORTED BY SURFACE TEMPERATURE")
print(df_clean.sort_values("land_surface_temperature_c", ascending=False).head(5))
print("\nQ15 — FIVE HOTTEST RECORDS")
print(df_clean.sort_values("land_surface_temperature_c", ascending=False)[
    ["location_name", "zone_type", "air_temperature_c", "land_surface_temperature_c", "ndvi"]
].head(5))

# Q16 — New derived columns (exploratory thresholds)
df_clean["temperature_band"] = np.where(
    df_clean["air_temperature_c"] >= 40, "High",
    np.where(df_clean["air_temperature_c"] >= 35, "Moderate", "Lower")
)
df_clean["vegetation_band"] = np.where(
    df_clean["ndvi"] >= 0.4, "High Vegetation",
    np.where(df_clean["ndvi"] >= 0.2, "Moderate Vegetation", "Low Vegetation")
)
df_clean["high_surface_temp"] = np.where(df_clean["land_surface_temperature_c"] >= 40, 1, 0)
print("\nQ16 — NEW COLUMNS")
print(df_clean[["air_temperature_c", "temperature_band", "ndvi", "vegetation_band",
                "land_surface_temperature_c", "high_surface_temp"]].head(10))

# ============================================================
# SECTION E — STATISTICAL ANALYSIS
# ============================================================

# Q17 — Descriptive statistics
stat_cols = ["air_temperature_c", "relative_humidity_pct", "land_surface_temperature_c"]
print("\nQ17 — MEAN")
print(df_clean[stat_cols].mean())
print("\nQ17 — MEDIAN")
print(df_clean[stat_cols].median())
print("\nQ17 — MINIMUM")
print(df_clean[stat_cols].min())
print("\nQ17 — MAXIMUM")
print(df_clean[stat_cols].max())
print("\nQ17 — STANDARD DEVIATION")
print(df_clean[stat_cols].std())
print("\nQ17 — COMBINED SUMMARY")
print(df_clean[stat_cols].agg(["mean", "median", "min", "max", "std"]).round(2))
print("\nQ17 — AIR TEMPERATURE MODE")
print(df_clean["air_temperature_c"].mode())
print("\nQ17 — RELATIVE SPREAD")
print((df_clean[stat_cols].std() / df_clean[stat_cols].mean()).round(3))

# Q18 — IQR outlier detection
Q1 = df_clean["land_surface_temperature_c"].quantile(0.25)
Q3 = df_clean["land_surface_temperature_c"].quantile(0.75)
IQR = Q3 - Q1
lower_limit = Q1 - 1.5 * IQR
upper_limit = Q3 + 1.5 * IQR
print("\nQ18 — IQR LIMITS")
print("Q1:", Q1, "Q3:", Q3, "IQR:", IQR)
print("Lower limit:", lower_limit, "Upper limit:", upper_limit)
outliers = df_clean[
    (df_clean["land_surface_temperature_c"] < lower_limit)
    | (df_clean["land_surface_temperature_c"] > upper_limit)
]
print("\nQ18 — OUTLIER COUNT")
print(len(outliers))
print("\nQ18 — OUTLIER RECORDS")
print(outliers[["record_id", "location_name", "land_surface_temperature_c", "air_temperature_c"]].head(10))
print("\nQ18 — FIVE HIGHEST SURFACE TEMPERATURE RECORDS")
print(df_clean.nlargest(5, "land_surface_temperature_c"))

# ============================================================
# SECTION F — EXPLORATORY DATA ANALYSIS AND INSIGHTS
# ============================================================

# Q19 — Frequency distributions
print("\nQ19 — ZONE COUNTS")
print(df_clean["zone_type"].value_counts())
print("\nQ19 — ZONE PERCENTAGES")
print((df_clean["zone_type"].value_counts(normalize=True) * 100).round(2))
print("\nQ19 — SEASON COUNTS")
print(df_clean["season"].value_counts())
print("\nQ19 — SEASON PERCENTAGES")
print((df_clean["season"].value_counts(normalize=True) * 100).round(2))
print("\nQ19 — RISK CATEGORY COUNTS")
print(df_clean["heat_risk_category"].value_counts())
print("\nQ19 — RISK CATEGORY PERCENTAGES")
print((df_clean["heat_risk_category"].value_counts(normalize=True) * 100).round(2))
df_clean["heat_risk_category"].value_counts().plot(kind="bar", title="Heat Risk Category Distribution")
plt.xlabel("Heat Risk Category")
plt.ylabel("Number of Records")
plt.tight_layout()
plt.show()

# Q20 — Compare environmental measurements by zone
print("\nQ20 — AVERAGE AIR TEMPERATURE BY ZONE")
print(df_clean.groupby("zone_type")["air_temperature_c"].mean().sort_values(ascending=False))
print("\nQ20 — AVERAGE SURFACE TEMPERATURE BY ZONE")
print(df_clean.groupby("zone_type")["land_surface_temperature_c"].mean().sort_values(ascending=False))
print("\nQ20 — AVERAGE HUMIDITY BY ZONE")
print(df_clean.groupby("zone_type")["relative_humidity_pct"].mean().sort_values(ascending=False))
print("\nQ20 — COMBINED ZONE COMPARISON")
print(df_clean.groupby("zone_type")[[
    "air_temperature_c", "land_surface_temperature_c", "relative_humidity_pct"
]].agg(["mean", "median", "std"]).round(2))

# Q21 — Compare temperature across seasons and zones
print("\nQ21 — AVERAGE AIR TEMPERATURE BY SEASON")
print(df_clean.groupby("season")["air_temperature_c"].mean().sort_values(ascending=False))
print("\nQ21 — AVERAGE SURFACE TEMPERATURE BY SEASON")
print(df_clean.groupby("season")["land_surface_temperature_c"].mean().sort_values(ascending=False))
print("\nQ21 — AVERAGE AIR TEMPERATURE BY ZONE AND SEASON")
print(df_clean.groupby(["zone_type", "season"])["air_temperature_c"].mean().round(2))
print("\nQ21 — COUNTS BY ZONE AND SEASON")
print(df_clean.groupby(["zone_type", "season"]).size().unstack(fill_value=0))
season_zone = df_clean.pivot_table(index="zone_type", columns="season",
                                   values="air_temperature_c", aggfunc="mean")
sns.heatmap(season_zone, annot=True, cmap="coolwarm", fmt=".1f")
plt.title("Average Air Temperature by Zone and Season")
plt.tight_layout()
plt.show()

# Q22 — Relationship between NDVI and surface temperature
corr_cols = ["ndvi", "land_surface_temperature_c", "air_temperature_c", "relative_humidity_pct"]
print("\nQ22 — CORRELATION MATRIX")
print(df_clean[corr_cols].corr())
print("\nQ22 — AVERAGE SURFACE TEMPERATURE BY ZONE")
print(df_clean.groupby("zone_type")["land_surface_temperature_c"].mean())
print("\nQ22 — AVERAGE NDVI BY ZONE")
print(df_clean.groupby("zone_type")["ndvi"].mean())
print("\nQ22 — NDVI AND SURFACE TEMPERATURE BY ZONE")
print(df_clean.groupby("zone_type")[["ndvi", "land_surface_temperature_c"]].mean().round(2))
sample = df_clean.sample(min(5000, len(df_clean)), random_state=42)
sns.scatterplot(data=sample, x="ndvi", y="land_surface_temperature_c", hue="zone_type")
plt.title("NDVI vs Land Surface Temperature")
plt.tight_layout()
plt.show()

# Q23 — Independent investigation: vegetation groups vs surface temperature
df_clean["ndvi_group"] = pd.cut(
    df_clean["ndvi"], bins=[-1, 0.2, 0.4, 1],
    labels=["Low", "Moderate", "High"]
)
print("\nQ23 — AVERAGE SURFACE TEMPERATURE BY NDVI GROUP")
print(df_clean.groupby("ndvi_group", observed=False)["land_surface_temperature_c"].mean().round(2))
print("\nQ23 — AVERAGE AIR TEMPERATURE BY NDVI GROUP")
print(df_clean.groupby("ndvi_group", observed=False)["air_temperature_c"].mean().round(2))
print("\nQ23 — COUNTS BY NDVI GROUP")
print(df_clean["ndvi_group"].value_counts())
sns.boxplot(data=df_clean, x="ndvi_group", y="land_surface_temperature_c")
plt.title("Vegetation Group vs Land Surface Temperature")
plt.xlabel("NDVI Group")
plt.ylabel("Land Surface Temperature (°C)")
plt.tight_layout()
plt.show()

# ============================================================
# SECTION G — INTERPRETATION AND CONCLUSION
# ============================================================

# Q24 — Evaluate statements using data evidence
print("\nQ24 — ZONES RANKED BY HIGHEST AVERAGE SURFACE TEMPERATURE")
print(df_clean.groupby("zone_type")["land_surface_temperature_c"].mean().sort_values(ascending=False))
print("\nQ24 — ZONES RANKED BY LOWEST AVERAGE SURFACE TEMPERATURE")
print(df_clean.groupby("zone_type")["land_surface_temperature_c"].mean().sort_values())
print("\nQ24 — NDVI/SURFACE TEMPERATURE CORRELATION")
print(df_clean["ndvi"].corr(df_clean["land_surface_temperature_c"]))
print("\nQ24 — NDBI/SURFACE TEMPERATURE CORRELATION")
print(df_clean["ndbi"].corr(df_clean["land_surface_temperature_c"]))
print("\nQ24 — AVERAGE SURFACE TEMPERATURE BY RISK CATEGORY")
print(df_clean.groupby("heat_risk_category")["land_surface_temperature_c"].mean().sort_values(ascending=False))

# Q25 — Final summary outputs for a city planner
print("\nQ25 — FINAL SUMMARY STATISTICS")
print(df_clean[[
    "air_temperature_c", "relative_humidity_pct", "land_surface_temperature_c", "ndvi", "ndbi"
]].describe().round(2))
print("\nQ25 — ZONE-LEVEL FINDINGS")
print(df_clean.groupby("zone_type")[[
    "air_temperature_c", "land_surface_temperature_c", "ndvi"
]].mean().round(2))
print("\nQ25 — SEASONAL FINDINGS")
print(df_clean.groupby("season")[[
    "air_temperature_c", "land_surface_temperature_c", "relative_humidity_pct"
]].mean().round(2))
print("\nQ25 — HEAT RISK CATEGORY COUNTS")
print(df_clean["heat_risk_category"].value_counts())
print(
    "\nCONCLUSION GUIDANCE: Write 150–250 words. Include at least three "
    "numerical findings, two limitations, and one next step. State clearly "
    "that this is a synthetic academic simulation, not verified real-world "
    "Solapur measurements. Correlation does not prove causation."
)

# ============================================================
# FINAL VERIFICATION AND EXPORT
# ============================================================

print("\nFINAL DATASET SHAPE")
print(df_clean.shape)
print("\nFINAL TOTAL MISSING VALUES")
print(df_clean.isnull().sum().sum())

FINAL_FILE = Path(__file__).resolve().parent / "HeatShield_EDADV_Assignment3_Final.csv"
df_clean.to_csv(FINAL_FILE, index=False)

print("\nFINAL DATASET — FIRST TEN ROWS")
print(df_clean.head(10))
print("\nAssignment 3 completed.")
print("Final processed CSV saved as:", FINAL_FILE.name)
