"""Export a compact, validated EDADV summary for the HeatShield frontend."""
from __future__ import annotations

import csv
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "edadv" / "outputs"
DEST = ROOT / "src" / "data" / "edadvSummary.json"


def read_csv(name: str) -> list[dict[str, object]]:
    with (OUT / name).open(encoding="utf-8-sig", newline="") as stream:
        rows = list(csv.DictReader(stream))
    for row in rows:
        for key, value in tuple(row.items()):
            if value is None or value == "":
                row[key] = None
                continue
            try:
                row[key] = float(value)
                if row[key].is_integer():
                    row[key] = int(row[key])
            except (ValueError, AttributeError):
                pass
    return rows


def main() -> None:
    summary = json.loads((OUT / "phase2_summary.json").read_text(encoding="utf-8"))
    validation = json.loads((OUT / "phase3_validation.json").read_text(encoding="utf-8"))
    if validation.get("status") != "passed":
        raise SystemExit("Phase 3 validation must pass before frontend export.")
    if not summary.get("all_synthetic") or summary.get("row_count") != 150000:
        raise SystemExit("Unexpected source shape or provenance; refusing export.")
    source_path = ROOT / summary["source"]["path"]
    if not source_path.is_file():
        raise SystemExit(f"Master CSV not found: {summary['source']['path']}")
    actual_hash = hashlib.sha256(source_path.read_bytes()).hexdigest()
    validated_hash = validation.get("source", {}).get("sha256")
    if actual_hash != summary.get("source_sha256") or actual_hash != validated_hash:
        raise SystemExit("Phase 2 and Phase 3 source hashes differ; refusing export.")
    stats = read_csv("descriptive_statistics.csv")
    keep = {"air_temperature_c", "relative_humidity_pct", "land_surface_temperature_c",
            "urban_heat_island_intensity_c", "ndvi", "ndbi"}
    payload = {
        "metadata": {key: summary[key] for key in (
            "source", "source_sha256", "provenance", "row_count", "column_count",
            "all_synthetic", "station_count", "rows_per_station_min", "rows_per_station_max",
            "zone_station_counts", "zone_observation_counts", "risk_category_counts",
            "date_range_utc", "unique_observed_dates", "calendar_days_inclusive",
            "dates_without_observations", "unique_timestamp_hours", "hour_of_day_environmental_analysis",
            "season_interpretation", "risk_interpretation", "analysis_limits",
            "heat_index_c_available", "substrate_available", "status_available")},
        "statistics": [r for r in stats if r["column"] in keep],
        "outliers": read_csv("iqr_outlier_screen.csv"),
        "correlations": read_csv("correlation_pairs.csv"),
        "monthly": read_csv("monthly_station_summary.csv"),
        "annual": read_csv("annual_station_summary.csv"),
        "zones": read_csv("zone_station_comparison.csv"),
        "stations": read_csv("station_aggregates.csv"),
        "riskByZone": read_csv("risk_category_by_zone.csv"),
    }
    DEST.parent.mkdir(parents=True, exist_ok=True)
    DEST.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Wrote {DEST.relative_to(ROOT)} ({DEST.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
