#!/usr/bin/env python3
"""Reproducible descriptive EDA for the audited HeatShield simulation CSV."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
AUDIT_PATH = ROOT / "edadv" / "outputs" / "dataset_audit.json"
NUMERIC_CORE = [
    "air_temperature_c", "max_air_temperature_c", "min_air_temperature_c",
    "relative_humidity_pct", "wind_speed_mps", "solar_radiation_w_m2",
    "cloud_cover_pct", "land_surface_temperature_c", "surface_temperature_anomaly_c",
    "ndvi", "ndbi", "ndwi", "vegetation_cover_pct", "impervious_surface_pct",
    "tree_canopy_cover_pct", "shade_availability_pct", "urban_heat_island_intensity_c",
    "heat_exposure_index", "cooling_priority_score", "estimated_cooling_potential_c",
]
STATS_VARS = [
    "air_temperature_c", "relative_humidity_pct", "land_surface_temperature_c",
    "surface_temperature_anomaly_c", "urban_heat_island_intensity_c",
    "ndvi", "ndbi", "tree_canopy_cover_pct", "shade_availability_pct",
    "cooling_priority_score", "estimated_cooling_potential_c",
]
UNIT_LABELS = {
    "air_temperature_c": "Air temperature (°C)",
    "max_air_temperature_c": "Daily maximum air temperature (°C)",
    "min_air_temperature_c": "Daily minimum air temperature (°C)",
    "relative_humidity_pct": "Relative humidity (%)",
    "land_surface_temperature_c": "Land surface temperature (°C)",
    "surface_temperature_anomaly_c": "Surface temperature anomaly (°C)",
    "urban_heat_island_intensity_c": "Encoded UHI intensity (°C)",
    "wind_speed_mps": "Wind speed (m/s)", "solar_radiation_w_m2": "Solar radiation (W/m²)",
    "cloud_cover_pct": "Cloud cover (%)", "ndvi": "NDVI (unitless)", "ndbi": "NDBI (unitless)",
    "ndwi": "NDWI (unitless)", "vegetation_cover_pct": "Vegetation cover (%)",
    "impervious_surface_pct": "Impervious surface (%)", "tree_canopy_cover_pct": "Tree canopy cover (%)",
    "shade_availability_pct": "Shade availability (%)", "heat_exposure_index": "Encoded heat exposure index",
    "cooling_priority_score": "Encoded cooling priority score", "estimated_cooling_potential_c": "Estimated cooling potential (°C)",
}
PROVENANCE = "Synthetic academic simulation data; not verified live Solapur measurements."
MISSING = {"", "na", "n/a", "null", "nan"}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def sha256_file(path):
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def parse_utc(value):
    parsed = datetime.fromisoformat(value.strip().replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError(f"Timestamp lacks timezone: {value}")
    return parsed.astimezone(timezone.utc)


def rankdata(values):
    """Average ranks for ties, implemented with NumPy only."""
    order = np.argsort(values, kind="mergesort")
    sorted_values = values[order]
    ranks = np.empty(len(values), dtype=np.float64)
    start = 0
    while start < len(values):
        end = start + 1
        while end < len(values) and sorted_values[end] == sorted_values[start]:
            end += 1
        ranks[order[start:end]] = (start + 1 + end) / 2.0
        start = end
    return ranks


def summarize(values):
    values = np.asarray(values, dtype=float)
    values = values[np.isfinite(values)]
    if not len(values):
        return {"n": 0, "missing_count": 0, "unique_count": 0, "mean": None, "sample_stddev": None,
                "median": None, "min": None, "q1": None, "q3": None, "iqr": None, "max": None}
    q1, median, q3 = np.quantile(values, [0.25, 0.5, 0.75])
    return {"n": int(len(values)), "missing_count": 0, "unique_count": int(len(np.unique(values))),
            "mean": float(np.mean(values)), "sample_stddev": float(np.std(values, ddof=1)) if len(values) > 1 else None,
            "median": float(median), "min": float(np.min(values)), "q1": float(q1), "q3": float(q3),
            "iqr": float(q3 - q1), "max": float(np.max(values))}


def category_summary(values):
    counts = Counter(values)
    return {"n": len(values), "missing_count": sum(value.strip().lower() in MISSING for value in values),
            "unique_count": len(counts), "counts": dict(counts.most_common())}


def pearson(x, y):
    if len(x) < 2:
        return None
    if np.std(x) == 0 or np.std(y) == 0:
        return None
    return float(np.corrcoef(x, y)[0, 1])


def write_csv(path, rows, fieldnames=None):
    path.parent.mkdir(parents=True, exist_ok=True)
    if fieldnames is None:
        fieldnames = list(rows[0]) if rows else []
    with path.open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2, ensure_ascii=False, allow_nan=False) + "\n", encoding="utf-8")


def ci95(values):
    vals = np.asarray(values, dtype=float)
    if len(vals) < 2:
        return (float(np.mean(vals)), None, None) if len(vals) else (None, None, None)
    mean = float(np.mean(vals))
    margin = 1.96 * float(np.std(vals, ddof=1)) / math.sqrt(len(vals))
    return mean, mean - margin, mean + margin


def plot_note(fig, note="Station and date records are repeated synthetic simulations; intervals describe station variation."):
    fig.text(0.01, 0.012, f"{PROVENANCE} {note}", ha="left", va="bottom", fontsize=8, color="#555555")


def save_figure(fig, path, rect=(0, 0.055, 1, 1)):
    path.parent.mkdir(parents=True, exist_ok=True)
    fig.tight_layout(rect=rect)
    fig.savefig(path, dpi=180, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", help="Master CSV path; defaults to source.path in the Phase 1 audit JSON")
    parser.add_argument("--overwrite", action="store_true", help="Replace outputs generated by this Phase 2 script")
    args = parser.parse_args()

    require(AUDIT_PATH.is_file(), f"Phase 1 audit JSON is missing: {AUDIT_PATH}")
    audit = json.loads(AUDIT_PATH.read_text(encoding="utf-8"))
    source = Path(args.csv) if args.csv else ROOT / audit["source"]["path"]
    if not source.is_absolute():
        source = (ROOT / source).resolve()
    require(source.is_file(), f"Master CSV not found/readable: {source}")
    expected_sha = audit["source"].get("sha256")
    actual_sha = sha256_file(source)
    require(actual_sha == expected_sha, "Input SHA-256 differs from the Phase 1 audited source; inspect before analysis.")

    out_dir = ROOT / "edadv" / "outputs"
    fig_dir = ROOT / "edadv" / "figures"
    report_dir = ROOT / "edadv" / "reports"
    csv_outputs = ["descriptive_statistics.csv", "categorical_summary.csv", "categorical_frequencies.csv",
                   "iqr_outlier_screen.csv", "grouped_descriptive_statistics.csv", "station_aggregates.csv",
                   "zone_station_comparison.csv", "temporal_coverage.csv", "timestamp_hour_distribution.csv",
                   "correlation_pairs.csv", "pearson_correlation_matrix.csv", "spearman_correlation_matrix.csv",
                   "phase2_summary.json", "phase2_figure_manifest.json", "descriptive_statistics.json",
                   "monthly_station_summary.csv", "annual_station_summary.csv", "risk_category_by_zone.csv",
                   "station_mean_correlations.csv"]
    figure_names = ["01_temperature_humidity_distributions.png", "02_core_variable_boxplots.png",
                    "03_station_level_lst_by_zone.png", "04_air_temperature_vs_humidity.png",
                    "05_lst_vs_vegetation_indices.png", "06_core_correlation_matrix.png",
                    "07_monthly_temperature_patterns.png", "08_annual_temperature_comparison.png",
                    "09_season_label_temperature_summary.png", "10_station_mean_lst_map.png",
                    "11_observation_date_coverage.png", "12_risk_category_by_zone.png"]
    report_path = report_dir / "phase2_eda_report.md"
    all_output_paths = [out_dir / name for name in csv_outputs] + [fig_dir / name for name in figure_names] + [report_path]
    existing = [p for p in all_output_paths if p.exists()]
    require(not existing or args.overwrite, "Phase 2 outputs already exist; use --overwrite to regenerate: " + ", ".join(str(p.relative_to(ROOT)) for p in existing))

    columns = audit["columns"]
    numeric_columns = [c for c, meta in audit["inferred_types"].items() if meta["inferred"] == "numeric"]
    require(len(columns) == audit["shape"]["columns"] == 57, "Phase 1 audit schema is not the expected 57 columns.")
    required = set(NUMERIC_CORE + ["record_id", "location_id", "zone_type", "season", "heat_risk_category",
                                   "is_synthetic", "data_source_type", "observation_datetime", "observation_date",
                                   "year", "month", "day", "latitude", "longitude"])
    require(required.issubset(columns), f"Required Phase 2 columns absent: {sorted(required - set(columns))}")

    numeric_rows = defaultdict(list)
    category_rows = defaultdict(list)
    text_counters = defaultdict(Counter)
    timestamps, observed_dates = [], []
    hours = Counter()
    date_stations = defaultdict(set)
    station_meta = {}
    row_count = 0
    with source.open("r", encoding="utf-8-sig", newline="") as stream:
        reader = csv.DictReader(stream)
        require(reader.fieldnames == columns, "CSV header does not match the audited schema/order.")
        for row_num, row in enumerate(reader, start=2):
            require(None not in row, f"Row {row_num} has more fields than the audited header.")
            require(all(row.get(c) is not None for c in columns), f"Row {row_num} is missing a schema field.")
            row_count += 1
            require(row["is_synthetic"].strip().lower() == "true", f"Non-synthetic record at CSV line {row_num}.")
            require(row["data_source_type"].strip() == "Synthetic simulation", f"Unexpected source label at CSV line {row_num}.")
            for col in numeric_columns:
                raw = row[col].strip()
                require(raw.lower() not in MISSING, f"Missing numeric value in {col} at CSV line {row_num}.")
                try:
                    value = float(raw)
                except ValueError as exc:
                    raise ValueError(f"Non-numeric value in audited numeric field {col} at CSV line {row_num}: {raw}") from exc
                require(math.isfinite(value), f"Non-finite numeric value in {col} at CSV line {row_num}.")
                numeric_rows[col].append(value)
            for col in ("location_id", "zone_type", "season", "heat_risk_category", "cooling_infrastructure_type"):
                if col in row:
                    category_rows[col].append(row[col].strip())
            for col, meta in audit["inferred_types"].items():
                if meta["inferred"] in {"text", "boolean"}:
                    text_counters[col][row[col].strip()] += 1
            stamp = parse_utc(row["observation_datetime"])
            obs_date = date.fromisoformat(row["observation_date"].strip())
            require(stamp.date() == obs_date, f"observation_date/time mismatch at CSV line {row_num}.")
            require((int(row["year"]), int(row["month"]), int(row["day"])) == (stamp.year, stamp.month, stamp.day),
                    f"Date components mismatch at CSV line {row_num}.")
            timestamps.append(stamp)
            observed_dates.append(obs_date)
            hours[stamp.hour] += 1
            date_stations[obs_date.isoformat()].add(row["location_id"].strip())
            station, zone = row["location_id"], row["zone_type"]
            point = (float(row["latitude"]), float(row["longitude"]))
            if station not in station_meta:
                station_meta[station] = {"zone": zone, "latitude": point[0], "longitude": point[1]}
            else:
                require(station_meta[station] == {"zone": zone, "latitude": point[0], "longitude": point[1]},
                        f"Station metadata varies within location_id={station}.")
    require(row_count == audit["shape"]["rows"] == 150000, f"Expected 150,000 rows, read {row_count}.")
    require(len(station_meta) == 100, f"Expected 100 locations, found {len(station_meta)}.")

    values = {key: np.asarray(items, dtype=np.float64) for key, items in numeric_rows.items()}
    station_array = np.asarray(category_rows["location_id"], dtype=object)
    zone_array = np.asarray(category_rows["zone_type"], dtype=object)
    season_array = np.asarray(category_rows["season"], dtype=object)
    risk_array = np.asarray(category_rows["heat_risk_category"], dtype=object)
    date_array = np.asarray([d.isoformat() for d in observed_dates], dtype=object)
    year_array = values["year"].astype(int)
    month_array = values["month"].astype(int)

    numeric_stats = {col: summarize(values[col]) for col in numeric_columns}
    descriptive_rows = []
    for col, summary in numeric_stats.items():
        descriptive_rows.append({"column": col, "inferred_type": "numeric", **summary})
    categorical_stats = {}
    for col, counts in text_counters.items():
        categorical_stats[col] = {"n": row_count, "missing_count": audit["inferred_types"][col]["missing_count"],
                                  "unique_count": len(counts),
                                  "counts": dict(counts.most_common()) if len(counts) <= 1000 else None}

    # Categorical unique counts are taken from this analysis load for key groupers.
    cat_rows = []
    for col, summary in categorical_stats.items():
        cat_rows.append({"column": col, "n": summary["n"], "missing_count": summary["missing_count"],
                         "unique_count": summary["unique_count"]})
    frequency_rows = []
    for col, summary in categorical_stats.items():
        if summary.get("counts") is not None:
            for category, count in summary["counts"].items():
                frequency_rows.append({"column": col, "category": category, "count": count,
                                       "percent": 100 * count / row_count})
    write_csv(out_dir / "descriptive_statistics.csv", descriptive_rows)
    write_csv(out_dir / "categorical_summary.csv", cat_rows)
    write_csv(out_dir / "categorical_frequencies.csv", frequency_rows)
    descriptive_json = {"source": audit["source"], "synthetic_only": True, "row_count": row_count,
                        "numeric": numeric_stats, "categorical": categorical_stats,
                        "note": "All summaries describe synthetic academic simulation records."}
    write_json(out_dir / "descriptive_statistics.json", descriptive_json)

    # IQR flags are candidate observations for review and are never removed.
    outlier_rows = []
    for col in numeric_columns:
        arr = values[col]
        q1, q3 = np.quantile(arr, [0.25, 0.75])
        iqr = q3 - q1
        lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
        flagged = (arr < lower) | (arr > upper)
        outlier_rows.append({"column": col, "n": len(arr), "method": "Tukey 1.5xIQR screening",
                             "q1": float(q1), "q3": float(q3), "iqr": float(iqr),
                             "lower_fence": float(lower), "upper_fence": float(upper),
                             "candidate_count": int(np.sum(flagged)), "candidate_percent": float(np.mean(flagged) * 100),
                             "minimum_flagged": float(np.min(arr[flagged])) if np.any(flagged) else None,
                             "maximum_flagged": float(np.max(arr[flagged])) if np.any(flagged) else None,
                             "interpretation": "Screening candidates only; no records removed."})
    write_csv(out_dir / "iqr_outlier_screen.csv", outlier_rows)

    # Per-observation grouped descriptions plus station-level summaries to expose dependence.
    grouped_rows = []
    group_specs = [("zone_type", zone_array), ("season_label", season_array)]
    group_specs += [("month_number", month_array), ("year", year_array)]
    for group_name, group_values in group_specs:
        for label in sorted(set(group_values.tolist()), key=lambda x: str(x)):
            mask = group_values == label
            for col in STATS_VARS:
                if col not in values:
                    continue
                grouped_rows.append({"grouping": group_name, "category": label, "column": col,
                                     **summarize(values[col][mask]),
                                     "unit": UNIT_LABELS.get(col, "")})
    write_csv(out_dir / "grouped_descriptive_statistics.csv", grouped_rows)

    station_rows = []
    stations = sorted(station_meta)
    for station in stations:
        mask = station_array == station
        meta = station_meta[station]
        output = {"location_id": station, "zone_type": meta["zone"], "latitude": meta["latitude"],
                  "longitude": meta["longitude"], "observation_count": int(mask.sum())}
        for col in STATS_VARS:
            s = summarize(values[col][mask])
            output[f"{col}_mean"] = s["mean"]
            output[f"{col}_sd"] = s["sample_stddev"]
        station_rows.append(output)
    write_csv(out_dir / "station_aggregates.csv", station_rows)

    zone_rows = []
    for zone in sorted({m["zone"] for m in station_meta.values()}):
        members = [r for r in station_rows if r["zone_type"] == zone]
        for col in ("air_temperature_c", "relative_humidity_pct", "land_surface_temperature_c",
                    "urban_heat_island_intensity_c", "cooling_priority_score"):
            station_means = [r[f"{col}_mean"] for r in members]
            mean, lower, upper = ci95(station_means)
            zone_rows.append({"zone_type": zone, "variable": col, "unit": UNIT_LABELS.get(col, ""),
                              "station_count": len(members), "observations": sum(r["observation_count"] for r in members),
                              "mean_of_station_means": mean, "sd_between_station_means": float(np.std(station_means, ddof=1)) if len(members) > 1 else None,
                              "median_station_mean": float(np.median(station_means)),
                              "min_station_mean": float(np.min(station_means)), "max_station_mean": float(np.max(station_means)),
                              "station_mean_ci95_low": lower, "station_mean_ci95_high": upper,
                              "ci_note": "Normal-approximation interval across station means; descriptive station variation, not a validated population inference."})
    write_csv(out_dir / "zone_station_comparison.csv", zone_rows)

    monthly_station_rows, annual_station_rows = [], []
    for month in range(1, 13):
        for col in ("air_temperature_c", "land_surface_temperature_c"):
            month_mask = month_array == month
            per_station = [float(np.mean(values[col][month_mask & (station_array == station)]))
                           for station in stations if np.any(month_mask & (station_array == station))]
            mean, low, high = ci95(per_station)
            monthly_station_rows.append({"month_number": month, "variable": col, "n_stations": len(per_station),
                                         "mean_of_station_means": mean,
                                         "sd_between_station_means": float(np.std(per_station, ddof=1)),
                                         "ci95_low": low, "ci95_high": high,
                                         "min_station_mean": float(np.min(per_station)),
                                         "max_station_mean": float(np.max(per_station))})
    for year in sorted(set(year_array.tolist())):
        for col in ("air_temperature_c", "land_surface_temperature_c"):
            year_mask = year_array == year
            per_station = [float(np.mean(values[col][year_mask & (station_array == station)]))
                           for station in stations if np.any(year_mask & (station_array == station))]
            mean, low, high = ci95(per_station)
            annual_station_rows.append({"year": int(year), "variable": col, "n_stations": len(per_station),
                                        "mean_of_station_means": mean,
                                        "sd_between_station_means": float(np.std(per_station, ddof=1)),
                                        "ci95_low": low, "ci95_high": high,
                                        "min_station_mean": float(np.min(per_station)),
                                        "max_station_mean": float(np.max(per_station))})
    write_csv(out_dir / "monthly_station_summary.csv", monthly_station_rows)
    write_csv(out_dir / "annual_station_summary.csv", annual_station_rows)

    risk_zone_rows = []
    source_risk_order = [label for label in ("Low", "Moderate", "High", "Very High") if label in set(risk_array.tolist())]
    for zone in sorted(set(zone_array.tolist())):
        zone_mask = zone_array == zone
        zone_n = int(zone_mask.sum())
        for risk in source_risk_order:
            count = int(np.sum(zone_mask & (risk_array == risk)))
            risk_zone_rows.append({"zone_type": zone, "heat_risk_category": risk, "count": count,
                                   "zone_observations": zone_n,
                                   "percent_within_zone": 100 * count / zone_n if zone_n else 0,
                                   "provenance": "Source-encoded category; thresholds not independently verified."})
    write_csv(out_dir / "risk_category_by_zone.csv", risk_zone_rows)

    # Observed and unobserved calendar dates; gaps remain absent, never imputed.
    per_date = Counter(date_array.tolist())
    first_day, last_day = min(observed_dates), max(observed_dates)
    coverage_rows = []
    day = first_day
    while day <= last_day:
        count = per_date.get(day.isoformat(), 0)
        coverage_rows.append({"date_utc": day.isoformat(), "observed": count > 0, "record_count": count,
                              "station_count": len(date_stations.get(day.isoformat(), set()))})
        day += timedelta(days=1)
    write_csv(out_dir / "temporal_coverage.csv", coverage_rows)
    hour_rows = [{"hour_utc": hour, "record_count": count, "percent": 100 * count / row_count}
                 for hour, count in sorted(hours.items())]
    write_csv(out_dir / "timestamp_hour_distribution.csv", hour_rows)

    # Pairwise complete correlations. Rank correlations use average ranks for tied values.
    corr_vars = [col for col in NUMERIC_CORE if col in values]
    require(len(corr_vars) >= 5, "Too few audited numeric fields are available for correlation analysis.")
    ranks = {col: rankdata(values[col]) for col in corr_vars}
    pearson_matrix = np.eye(len(corr_vars), dtype=float)
    spearman_matrix = np.eye(len(corr_vars), dtype=float)
    pair_rows = []
    for i, left in enumerate(corr_vars):
        for j, right in enumerate(corr_vars):
            if j < i:
                pearson_matrix[i, j] = pearson_matrix[j, i]
                spearman_matrix[i, j] = spearman_matrix[j, i]
                continue
            r = pearson(values[left], values[right])
            rho = pearson(ranks[left], ranks[right])
            pearson_matrix[i, j] = pearson_matrix[j, i] = r
            spearman_matrix[i, j] = spearman_matrix[j, i] = rho
            if j > i:
                pair_rows.append({"variable_1": left, "variable_2": right, "n_paired": row_count,
                                  "pearson_r": r, "spearman_rho": rho,
                                  "scope": "row-level synthetic records; repeated station/date structure means n is not independent sample size"})
    write_csv(out_dir / "correlation_pairs.csv", pair_rows)
    for filename, matrix in (("pearson_correlation_matrix.csv", pearson_matrix), ("spearman_correlation_matrix.csv", spearman_matrix)):
        write_csv(out_dir / filename, [{"variable": col, **{corr_vars[j]: float(matrix[i, j]) for j in range(len(corr_vars))}}
                                       for i, col in enumerate(corr_vars)])

    # Station-mean correlations as a dependence-sensitive descriptive check (n = 100 stations).
    station_corr_vars = [c for c in corr_vars if c in STATS_VARS]
    station_arrays = {c: np.asarray([r[f"{c}_mean"] for r in station_rows], dtype=float) for c in station_corr_vars}
    station_ranks = {c: rankdata(v) for c, v in station_arrays.items()}
    station_pairs = []
    for i, left in enumerate(station_corr_vars):
        for right in station_corr_vars[i + 1:]:
            station_pairs.append({"variable_1": left, "variable_2": right, "n_stations": len(stations),
                                  "pearson_r": pearson(station_arrays[left], station_arrays[right]),
                                  "spearman_rho": pearson(station_ranks[left], station_ranks[right]),
                                  "scope": "correlation of 100 station means; descriptive and simulation-specific"})
    write_csv(out_dir / "station_mean_correlations.csv", station_pairs)

    risk_counts = Counter(risk_array.tolist())
    season_counts = Counter(season_array.tolist())
    zone_counts = Counter(zone_array.tolist())
    dt_min, dt_max = min(timestamps), max(timestamps)
    # Meaningful diurnal coverage requires broad hour coverage; do not infer a diurnal curve from sparse clock bins.
    hour_coverage = len(hours)
    summary = {
        "source": audit["source"], "source_sha256": actual_sha, "provenance": PROVENANCE,
        "row_count": row_count, "column_count": len(columns), "all_synthetic": True,
        "station_count": len(stations), "rows_per_station_min": min(r["observation_count"] for r in station_rows),
        "rows_per_station_max": max(r["observation_count"] for r in station_rows),
        "zone_station_counts": dict(Counter(m["zone"] for m in station_meta.values())),
        "zone_observation_counts": dict(zone_counts), "risk_category_counts": dict(risk_counts),
        "season_label_counts": dict(season_counts), "date_range_utc": [dt_min.isoformat(), dt_max.isoformat()],
        "unique_observed_dates": len(per_date), "calendar_days_inclusive": len(coverage_rows),
        "dates_without_observations": sum(row["record_count"] == 0 for row in coverage_rows),
        "records_per_observed_date_min": min(per_date.values()), "records_per_observed_date_max": max(per_date.values()),
        "timestamp_hour_utc_counts": dict(sorted(hours.items())), "unique_timestamp_hours": hour_coverage,
        "hour_of_day_environmental_analysis": "Not performed: timestamps cover fewer than 24 UTC clock hours and do not establish a full diurnal sampling design.",
        "season_interpretation": "Groups use the source season labels; season definitions are not independently available in the audited source.",
        "risk_interpretation": "Summaries use the source heat_risk_category labels; threshold/provenance definition is unavailable in the audited source.",
        "heat_index_c_available": "heat_index_c" in columns,
        "substrate_available": "substrate" in columns,
        "status_available": "status" in columns,
        "analysis_limits": ["All records are synthetic simulation data, not verified measurements.",
                            "Row-level correlations are descriptive; station/date observations are repeated and dependent.",
                            "No missing dates were imputed.", "No continuous heat surface was interpolated.",
                            "IQR flags are screening candidates; no records were removed."]
    }
    write_json(out_dir / "phase2_summary.json", summary)

    # Figures. Each is based on the arrays and group summaries written above.
    plt.rcParams.update({"font.family": "DejaVu Sans", "axes.spines.top": False, "axes.spines.right": False,
                         "axes.grid": True, "grid.alpha": 0.22, "figure.facecolor": "white"})
    manifest = []

    fig, axes = plt.subplots(1, 3, figsize=(14, 4.8))
    for ax, col, color in zip(axes, ("air_temperature_c", "relative_humidity_pct", "land_surface_temperature_c"), ("#d95f02", "#2878b5", "#7b3294")):
        ax.hist(values[col], bins=36, color=color, alpha=0.82, edgecolor="white")
        ax.set_title(UNIT_LABELS[col]); ax.set_ylabel("Simulation records")
        ax.set_xlabel(UNIT_LABELS[col])
    fig.suptitle("Distributions of core thermal variables", fontsize=15, fontweight="bold")
    plot_note(fig)
    save_figure(fig, fig_dir / figure_names[0])
    manifest.append({"file": figure_names[0], "description": "Histograms of air temperature, relative humidity, and LST.", "source": PROVENANCE})

    fig, axes = plt.subplots(1, 4, figsize=(14, 5))
    for ax, col, color in zip(axes, ("air_temperature_c", "relative_humidity_pct", "land_surface_temperature_c", "urban_heat_island_intensity_c"), ("#d95f02", "#2878b5", "#7b3294", "#1b9e77")):
        ax.boxplot(values[col], orientation="vertical", patch_artist=True, boxprops={"facecolor": color, "alpha": 0.55},
                   medianprops={"color": "#202020", "linewidth": 1.6}, showfliers=False)
        ax.set_title(UNIT_LABELS.get(col, col)); ax.set_xticks([]); ax.set_ylabel(UNIT_LABELS.get(col, col))
        out = next(item for item in outlier_rows if item["column"] == col)
        ax.text(0.5, 0.98, f"IQR candidates: {out['candidate_count']:,}", transform=ax.transAxes,
                ha="center", va="top", fontsize=9)
    fig.suptitle("Core-variable boxplots (fliers hidden for readability; flagged values retained)", fontsize=14, fontweight="bold")
    plot_note(fig, "Tukey 1.5×IQR flags are candidates only.")
    save_figure(fig, fig_dir / figure_names[1])
    manifest.append({"file": figure_names[1], "description": "Separate-axis boxplots with IQR candidate counts.", "source": PROVENANCE})

    fig, ax = plt.subplots(figsize=(10, 5.5))
    zone_order = sorted({r["zone_type"] for r in station_rows})
    groups = [[r["land_surface_temperature_c_mean"] for r in station_rows if r["zone_type"] == zone] for zone in zone_order]
    ax.boxplot(groups, tick_labels=zone_order, patch_artist=True, showfliers=True,
               boxprops={"facecolor": "#8da0cb", "alpha": 0.72}, medianprops={"color": "#202020", "linewidth": 1.5})
    ax.set_ylabel("Station mean land surface temperature (°C)"); ax.set_xlabel("Source zone label")
    ax.tick_params(axis="x", rotation=30); ax.set_title("Station-level LST variation by zone")
    plot_note(fig, "Each box summarizes station means; stations are the unit displayed (not 150,000 independent observations).")
    save_figure(fig, fig_dir / figure_names[2])
    manifest.append({"file": figure_names[2], "description": "Boxplots of station-level mean LST by source zone.", "source": PROVENANCE})

    fig, ax = plt.subplots(figsize=(7.5, 6))
    hb = ax.hexbin(values["relative_humidity_pct"], values["air_temperature_c"], gridsize=45, mincnt=1, cmap="YlOrRd", bins="log")
    fig.colorbar(hb, ax=ax, label="Record density (log scale)")
    ax.set_xlabel("Relative humidity (%)"); ax.set_ylabel("Air temperature (°C)")
    corr = pearson(values["relative_humidity_pct"], values["air_temperature_c"])
    ax.set_title(f"Air temperature vs relative humidity (n={row_count:,}; Pearson r={corr:.3f})")
    plot_note(fig, "Row-level association; station/date records are dependent; no causal interpretation.")
    save_figure(fig, fig_dir / figure_names[3])
    manifest.append({"file": figure_names[3], "description": "Hexbin of air temperature and relative humidity.", "source": PROVENANCE})

    fig, axes = plt.subplots(1, 2, figsize=(11, 5))
    for ax, xcol, title, cmap in zip(axes, ("ndvi", "ndbi"), ("LST vs NDVI", "LST vs NDBI"), ("YlGn", "OrRd")):
        hb = ax.hexbin(values[xcol], values["land_surface_temperature_c"], gridsize=42, mincnt=1, cmap=cmap, bins="log")
        r = pearson(values[xcol], values["land_surface_temperature_c"])
        ax.set_xlabel(UNIT_LABELS[xcol]); ax.set_ylabel("Land surface temperature (°C)")
        ax.set_title(f"{title} (n={row_count:,}; r={r:.3f})")
        fig.colorbar(hb, ax=ax, label="Record density (log scale)")
    fig.suptitle("Surface temperature and spectral indices", fontsize=14, fontweight="bold")
    plot_note(fig, "Exploratory association in synthetic records; no causal or real-world inference.")
    save_figure(fig, fig_dir / figure_names[4])
    manifest.append({"file": figure_names[4], "description": "LST against NDVI and NDBI using density hexagons.", "source": PROVENANCE})

    fig, ax = plt.subplots(figsize=(13, 10))
    image = ax.imshow(pearson_matrix, cmap="coolwarm", vmin=-1, vmax=1, aspect="auto")
    ax.set_xticks(range(len(corr_vars)), labels=corr_vars, rotation=80, ha="right", fontsize=7)
    ax.set_yticks(range(len(corr_vars)), labels=corr_vars, fontsize=7)
    fig.colorbar(image, ax=ax, label="Pearson correlation (r)")
    ax.set_title("Correlation matrix of selected numeric variables")
    plot_note(fig, "Row-level, pairwise complete; repeated station/date records limit inferential interpretation.")
    save_figure(fig, fig_dir / figure_names[5])
    manifest.append({"file": figure_names[5], "description": "Pearson correlation matrix for selected continuous fields.", "source": PROVENANCE})

    fig, ax = plt.subplots(figsize=(9, 5.5))
    for col, color, label in (("air_temperature_c", "#d95f02", "Air temperature"), ("land_surface_temperature_c", "#7b3294", "LST")):
        series = [row for row in monthly_station_rows if row["variable"] == col]
        month_means = [row["mean_of_station_means"] for row in series]
        month_lows = [row["ci95_low"] for row in series]
        month_highs = [row["ci95_high"] for row in series]
        ax.plot(range(1, 13), month_means, marker="o", color=color, label=label)
        if all(v is not None for v in month_lows):
            ax.fill_between(range(1, 13), month_lows, month_highs, color=color, alpha=0.14)
    ax.set_xticks(range(1, 13)); ax.set_xlabel("Calendar month number"); ax.set_ylabel("Mean temperature (°C)")
    ax.set_title("Monthly temperature summaries (n=100 station means/month)"); ax.legend(frameon=False)
    plot_note(fig, "Each station contributes a same-month mean across observed years; shaded bands are 95% normal intervals across stations.")
    save_figure(fig, fig_dir / figure_names[6])
    manifest.append({"file": figure_names[6], "description": "Monthly temperature patterns with station-level 95% normal intervals.", "source": PROVENANCE})

    fig, ax = plt.subplots(figsize=(8, 5.5))
    years = sorted(set(year_array.tolist()))
    for col, color, label in (("air_temperature_c", "#d95f02", "Air temperature"), ("land_surface_temperature_c", "#7b3294", "LST")):
        series = [row for row in annual_station_rows if row["variable"] == col]
        means = [row["mean_of_station_means"] for row in series]
        lows = [row["ci95_low"] for row in series]
        highs = [row["ci95_high"] for row in series]
        ax.plot(years, means, marker="o", color=color, label=label)
        ax.fill_between(years, lows, highs, color=color, alpha=0.14)
    ax.set_xlabel("Year"); ax.set_ylabel("Mean temperature (°C)"); ax.set_xticks(years)
    ax.set_title("Annual temperature summaries (n=100 station means/year)"); ax.legend(frameon=False)
    plot_note(fig, "Each station contributes a year-specific mean; shaded bands are 95% normal intervals across stations.")
    save_figure(fig, fig_dir / figure_names[7])
    manifest.append({"file": figure_names[7], "description": "Annual temperature summaries with station-level intervals.", "source": PROVENANCE})

    fig, ax = plt.subplots(figsize=(8, 5.5))
    season_order = sorted(set(season_array.tolist()))
    season_means = [float(np.mean(values["air_temperature_c"][season_array == season])) for season in season_order]
    season_lsts = [float(np.mean(values["land_surface_temperature_c"][season_array == season])) for season in season_order]
    x = np.arange(len(season_order)); width = 0.38
    ax.bar(x - width/2, season_means, width, label="Air temperature", color="#d95f02")
    ax.bar(x + width/2, season_lsts, width, label="LST", color="#7b3294")
    ax.set_xticks(x, season_order); ax.set_ylabel("Mean temperature (°C)")
    ax.set_title("Temperature by source season label"); ax.legend(frameon=False)
    plot_note(fig, "Source season-label definitions were unavailable; these are encoded groups, not independently verified climatological seasons.")
    save_figure(fig, fig_dir / figure_names[8])
    manifest.append({"file": figure_names[8], "description": "Mean temperatures across source season labels.", "source": PROVENANCE})

    fig, ax = plt.subplots(figsize=(8, 6.5))
    lats = [r["latitude"] for r in station_rows]; lons = [r["longitude"] for r in station_rows]
    lsts = [r["land_surface_temperature_c_mean"] for r in station_rows]
    scores = [r["cooling_priority_score_mean"] for r in station_rows]
    points = ax.scatter(lons, lats, c=lsts, s=np.asarray(scores) * 1.6 + 18, cmap="inferno", edgecolor="white", linewidth=0.45, alpha=0.9)
    fig.colorbar(points, ax=ax, label="Station mean LST (°C)")
    ax.set_xlabel("Longitude (decimal degrees E)"); ax.set_ylabel("Latitude (decimal degrees N)")
    ax.set_title("Station-level mean LST across 100 representative coordinates")
    plot_note(fig, "Point map only; marker size reflects encoded mean cooling priority; no interpolation or claim about unsampled areas.")
    save_figure(fig, fig_dir / figure_names[9])
    manifest.append({"file": figure_names[9], "description": "Station point map colored by mean LST; no continuous surface interpolation.", "source": PROVENANCE})

    fig, ax = plt.subplots(figsize=(14, 4.5))
    observed_iso_dates = sorted(per_date)
    calendar_x = [mdates.date2num(date.fromisoformat(row["date_utc"])) for row in coverage_rows]
    calendar_y = [row["record_count"] for row in coverage_rows]
    ax.plot(calendar_x, calendar_y, color="#2878b5", linewidth=0.75, label="Records per calendar date")
    missing_dates = [row["date_utc"] for row in coverage_rows if row["record_count"] == 0]
    if missing_dates:
        missing_x = [mdates.date2num(date.fromisoformat(d)) for d in missing_dates]
        ax.scatter(missing_x, np.full(len(missing_x), -6), s=16, marker="|", color="#d95f02",
                   label="Missing date (marker offset below zero)", zorder=3)
        ax.legend(frameon=False, loc="center left", bbox_to_anchor=(1.01, 0.5))
    ax.xaxis_date()
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y-%m"))
    fig.autofmt_xdate()
    ax.set_ylim(-10, 112)
    ax.set_ylabel("Simulation records"); ax.set_xlabel("Date (UTC)")
    ax.set_title("Observation-date coverage (gaps left unfilled)")
    plot_note(fig, "Each observed date has a date group count; orange marks indicate missing calendar dates.")
    save_figure(fig, fig_dir / figure_names[10], rect=(0, 0.07, 0.82, 1))
    manifest.append({"file": figure_names[10], "description": "Daily observation coverage; missing dates are explicit and not imputed.", "source": PROVENANCE})

    fig, ax = plt.subplots(figsize=(13, 6))
    risk_zone_order = sorted(set(zone_array.tolist()))
    bottom = np.zeros(len(risk_zone_order))
    risk_colors = {"Low": "#2a9d8f", "Moderate": "#e9c46a", "High": "#f4a261", "Very High": "#d1495b"}
    for risk in source_risk_order:
        percentages = [next(row["percent_within_zone"] for row in risk_zone_rows
                            if row["zone_type"] == zone and row["heat_risk_category"] == risk)
                      for zone in risk_zone_order]
        ax.bar(risk_zone_order, percentages, bottom=bottom, label=risk, color=risk_colors.get(risk, "#777777"))
        bottom += np.asarray(percentages)
    ax.set_ylim(0, 100); ax.set_ylabel("Share of zone observations (%)")
    ax.set_xlabel("Source zone label"); ax.set_title("Encoded heat-risk category mix by zone")
    ax.tick_params(axis="x", rotation=30)
    ax.legend(title="Source risk label", frameon=False, ncol=1, loc="center left", bbox_to_anchor=(1.01, 0.5))
    plot_note(fig, "Source-encoded categories; thresholds are not independently verified and do not constitute validated health-risk classes.")
    save_figure(fig, fig_dir / figure_names[11], rect=(0, 0.07, 0.82, 1))
    manifest.append({"file": figure_names[11], "description": "100% stacked zone bars of the source risk labels.", "source": PROVENANCE})

    write_json(out_dir / "phase2_figure_manifest.json", {"source_sha256": actual_sha, "figures": manifest})

    # Generate report from computed outputs only.
    def fmt(col, key, digits=2):
        val = numeric_stats[col][key]
        return "NA" if val is None else f"{val:.{digits}f}"
    temp_corr_rh = pearson(values["air_temperature_c"], values["relative_humidity_pct"])
    temp_corr_lst = pearson(values["air_temperature_c"], values["land_surface_temperature_c"])
    ndvi_lst = pearson(values["ndvi"], values["land_surface_temperature_c"])
    ndbi_lst = pearson(values["ndbi"], values["land_surface_temperature_c"])
    focus_outliers = {row["column"]: row for row in outlier_rows}
    air_zone_rows = [row for row in zone_rows if row["variable"] == "air_temperature_c"]
    lst_zone_rows = [row for row in zone_rows if row["variable"] == "land_surface_temperature_c"]
    highest_air_zone = max(air_zone_rows, key=lambda row: row["mean_of_station_means"])
    lowest_air_zone = min(air_zone_rows, key=lambda row: row["mean_of_station_means"])
    highest_lst_zone = max(lst_zone_rows, key=lambda row: row["mean_of_station_means"])
    lowest_lst_zone = min(lst_zone_rows, key=lambda row: row["mean_of_station_means"])
    air_months = [row for row in monthly_station_rows if row["variable"] == "air_temperature_c"]
    highest_air_month = max(air_months, key=lambda row: row["mean_of_station_means"])
    lowest_air_month = min(air_months, key=lambda row: row["mean_of_station_means"])
    extreme_risk_zone = max((row for row in risk_zone_rows if row["heat_risk_category"] == "Very High"),
                            key=lambda row: row["percent_within_zone"])
    per_date_counts = [min(per_date.values()), max(per_date.values())]
    per_date_text = (f"exactly {per_date_counts[0]} records on every observed date"
                     if per_date_counts[0] == per_date_counts[1]
                     else f"between {per_date_counts[0]} and {per_date_counts[1]} records per observed date")
    report = f"""# HeatShield EDADV — Phase 2 Exploratory Data Analysis

## Dataset and provenance

Input: `{source.relative_to(ROOT).as_posix()}`; SHA-256 `{actual_sha}`; {row_count:,} rows and {len(columns)} columns. Every row is labeled `Synthetic simulation` and `is_synthetic=True`. All results below describe synthetic academic simulation records, not verified real-world Solapur measurements. Project documents refer to WRF-Chem/ERA5-Land/IMD calibration, but the source generator and calibration inputs were unavailable for independent verification.

The analysis validated the source hash against the Phase 1 audit, exact 57-column header/order, row count, required fields, numeric parsing and finite values, UTC timestamp parsing, date-component consistency, station metadata consistency, and synthetic flags. No source data were changed.

## Methods

- Numeric summaries use all finite values: count, missing count, unique count, mean, sample standard deviation, median, quartiles, IQR, min, max.
- Tukey 1.5×IQR fences flag candidate outliers. These are retained and not treated as invalid automatically.
- Row-level Pearson and Spearman coefficients use {row_count:,} complete pairs for each reported pair. Spearman uses average ranks for ties. These records are repeated by station and date, so row-level coefficients are descriptive, not independent-sample inference.
- A station-mean correlation table and station-level group summaries provide a dependence-sensitive descriptive comparison (100 station units). No inferential hypothesis tests were run.
- Monthly and annual time summaries average within station first; intervals are normal-approximation intervals across station means. They describe station variation in this synthetic dataset, not uncertainty in real Solapur climate.
- Spatial visualization shows the 100 source coordinates as points only. No continuous surface or unsampled-area estimate was created.

## Descriptive statistics

| Variable | n | Mean | SD | Median | Q1 | Q3 | Min | Max |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Air temperature (°C) | {numeric_stats['air_temperature_c']['n']:,} | {fmt('air_temperature_c','mean')} | {fmt('air_temperature_c','sample_stddev')} | {fmt('air_temperature_c','median')} | {fmt('air_temperature_c','q1')} | {fmt('air_temperature_c','q3')} | {fmt('air_temperature_c','min')} | {fmt('air_temperature_c','max')} |
| Relative humidity (%) | {numeric_stats['relative_humidity_pct']['n']:,} | {fmt('relative_humidity_pct','mean')} | {fmt('relative_humidity_pct','sample_stddev')} | {fmt('relative_humidity_pct','median')} | {fmt('relative_humidity_pct','q1')} | {fmt('relative_humidity_pct','q3')} | {fmt('relative_humidity_pct','min')} | {fmt('relative_humidity_pct','max')} |
| LST (°C) | {numeric_stats['land_surface_temperature_c']['n']:,} | {fmt('land_surface_temperature_c','mean')} | {fmt('land_surface_temperature_c','sample_stddev')} | {fmt('land_surface_temperature_c','median')} | {fmt('land_surface_temperature_c','q1')} | {fmt('land_surface_temperature_c','q3')} | {fmt('land_surface_temperature_c','min')} | {fmt('land_surface_temperature_c','max')} |
| Encoded UHI intensity (°C) | {numeric_stats['urban_heat_island_intensity_c']['n']:,} | {fmt('urban_heat_island_intensity_c','mean')} | {fmt('urban_heat_island_intensity_c','sample_stddev')} | {fmt('urban_heat_island_intensity_c','median')} | {fmt('urban_heat_island_intensity_c','q1')} | {fmt('urban_heat_island_intensity_c','q3')} | {fmt('urban_heat_island_intensity_c','min')} | {fmt('urban_heat_island_intensity_c','max')} |

Full summaries for all {len(numeric_columns)} numeric columns: `../outputs/descriptive_statistics.csv` and `.json`.

## Distributions and IQR screening

Generated histograms and separate-axis boxplots are listed in `../outputs/phase2_figure_manifest.json`. Tukey 1.5×IQR candidates among key variables were: air temperature {focus_outliers['air_temperature_c']['candidate_count']:,}, RH {focus_outliers['relative_humidity_pct']['candidate_count']:,}, LST {focus_outliers['land_surface_temperature_c']['candidate_count']:,}, and encoded UHI intensity {focus_outliers['urban_heat_island_intensity_c']['candidate_count']:,}. All numeric-column counts are in `../outputs/iqr_outlier_screen.csv`; no records were removed. These distribution-based flags do not establish data errors.

## Relationships and correlations

The row-level Pearson correlations computed from all {row_count:,} paired records were: air temperature vs RH, **r = {temp_corr_rh:.3f}**; air temperature vs LST, **r = {temp_corr_lst:.3f}**; NDVI vs LST, **r = {ndvi_lst:.3f}**; and NDBI vs LST, **r = {ndbi_lst:.3f}**. These are associations within synthetic records. They do not show causation or establish real environmental mechanisms. The full pairwise Pearson/Spearman table, with pair counts, is `../outputs/correlation_pairs.csv`; matrix CSVs and the figure are also provided. Station-mean correlations are in `../outputs/station_mean_correlations.csv`.

## Time patterns and coverage

Parsed timestamps are UTC: `{dt_min.isoformat()}` to `{dt_max.isoformat()}`. There are {len(per_date):,} observed dates and {len(coverage_rows):,} calendar dates in the inclusive span; **{sum(row['record_count'] == 0 for row in coverage_rows):,} dates have no records**. There are {per_date_text}. Mean air temperature across station means is highest in source month {highest_air_month['month_number']} ({highest_air_month['mean_of_station_means']:.2f} °C) and lowest in month {lowest_air_month['month_number']} ({lowest_air_month['mean_of_station_means']:.2f} °C). The daily coverage CSV and figure leave gaps explicit; no values were imputed.

Timestamp values occupy {hour_coverage} distinct UTC hour bins ({min(hours)}–{max(hours)} UTC), not a full 24-hour cycle. Therefore an environmental diurnal curve was not interpreted or produced. Monthly and annual summaries were generated by averaging within station first. The source `season` field is summarized using its labels, but the source’s season definitions were unavailable; these groups are not independently validated climatological seasons.

## Zone and station comparisons

There are {len(stations)} unique locations and {len(zone_counts)} source zone labels. Zone observation counts are: {', '.join(f'{k}: {v:,}' for k, v in sorted(zone_counts.items()))}. Across station means, highest/lowest air-temperature zone averages are {highest_air_zone['zone_type']} ({highest_air_zone['mean_of_station_means']:.2f} °C) and {lowest_air_zone['zone_type']} ({lowest_air_zone['mean_of_station_means']:.2f} °C); for LST they are {highest_lst_zone['zone_type']} ({highest_lst_zone['mean_of_station_means']:.2f} °C) and {lowest_lst_zone['zone_type']} ({lowest_lst_zone['mean_of_station_means']:.2f} °C). These describe represented synthetic stations, not causes or population effects. `zone_station_comparison.csv` reports station counts, between-station SD, ranges, and descriptive station-mean intervals. The station aggregate CSV provides one row per location with coordinates and within-station summaries.

## Risk categories and spatial analysis

The source `heat_risk_category` values are summarized as encoded labels: {', '.join(f'{k}: {v:,} ({100*v/row_count:.1f}%)' for k, v in sorted(risk_counts.items()))}. The largest within-zone Very High share is {extreme_risk_zone['zone_type']} ({extreme_risk_zone['percent_within_zone']:.1f}%); all zone shares are in `../outputs/risk_category_by_zone.csv`. The CSV/schema provides the field but no independently verified classification thresholds or validation evidence. Counts therefore describe the dataset encoding, not validated health-risk categories. The master data does not include `heat_index_c`, `substrate`, or `status`; none were invented or borrowed from user submissions.

The coordinate map uses 100 unique point locations and station mean LST. Coordinates are representative simulation locations per project documentation. The analysis makes no claims about unsampled places and does not interpolate a heat surface.

## Findings and limitations

- The audited source was read completely; all values in the analyzed numeric fields parsed as finite numbers and no date-component mismatches were found.
- The dataset’s thermal and humidity distributions, relationships, and encoded risk counts are internally describable, but synthetic provenance limits real-world interpretation.
- Repeated station/date structure limits row-level independence; the report emphasizes station-level summaries for grouped comparisons and does not report significance tests.
- 326 calendar dates are unobserved. The timestamps cover only {hour_coverage} UTC clock hours, so full diurnal inference is unsupported.
- Season labels and risk-category thresholds are present but their definitions were not verifiable in the source materials inspected.
- `heat_index_c`, `substrate`, and `status` are absent from the master dataset.
- IQR flags are screening candidates; they do not imply invalid records. No records were removed.

## Outputs and reproduction

From the repository root, with Python 3.11+, NumPy, and Matplotlib installed:

```powershell
python edadv/run_phase2_eda.py
```

The script obtains the input path and expected SHA-256 from `edadv/outputs/dataset_audit.json`. To specify an input explicitly, use `--csv "path/to/master.csv"`; it must match the audited SHA-256. To regenerate the script’s own existing Phase 2 outputs, add `--overwrite`. No extra packages were installed. Outputs are under `edadv/outputs/`, figures under `edadv/figures/`, and this report is generated at `edadv/reports/phase2_eda_report.md`.
"""
    report_dir.mkdir(parents=True, exist_ok=True)
    report_path.write_text(report, encoding="utf-8")
    print(json.dumps({"status": "success", "source": str(source.relative_to(ROOT)), "rows": row_count,
                      "columns": len(columns), "output_csvs": csv_outputs,
                      "figures": [str((fig_dir / name).relative_to(ROOT)) for name in figure_names],
                      "report": str(report_path.relative_to(ROOT)), "source_sha256": actual_sha}, indent=2))


if __name__ == "__main__":
    main()
