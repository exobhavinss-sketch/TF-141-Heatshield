"""Regenerate Phase 2 in an isolated temporary project and compare artifacts."""

from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
TABLES = [
    "descriptive_statistics.csv", "categorical_summary.csv", "categorical_frequencies.csv",
    "iqr_outlier_screen.csv", "grouped_descriptive_statistics.csv", "station_aggregates.csv",
    "zone_station_comparison.csv", "temporal_coverage.csv", "timestamp_hour_distribution.csv",
    "correlation_pairs.csv", "pearson_correlation_matrix.csv", "spearman_correlation_matrix.csv",
    "phase2_summary.json", "phase2_figure_manifest.json", "descriptive_statistics.json",
    "monthly_station_summary.csv", "annual_station_summary.csv", "risk_category_by_zone.csv",
    "station_mean_correlations.csv",
]
FIGURES = [
    "01_temperature_humidity_distributions.png", "02_core_variable_boxplots.png",
    "03_station_level_lst_by_zone.png", "04_air_temperature_vs_humidity.png",
    "05_lst_vs_vegetation_indices.png", "06_core_correlation_matrix.png",
    "07_monthly_temperature_patterns.png", "08_annual_temperature_comparison.png",
    "09_season_label_temperature_summary.png", "10_station_mean_lst_map.png",
    "11_observation_date_coverage.png", "12_risk_category_by_zone.png",
]


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> None:
    source = ROOT / "Heat Shield Master Dataset(2).csv"
    if not source.is_file():
        raise SystemExit(f"Master CSV missing: {source}")
    with tempfile.TemporaryDirectory(prefix="heatshield_phase3_rebuild_") as temporary:
        isolated = Path(temporary)
        isolated_edadv = isolated / "edadv"
        (isolated_edadv / "outputs").mkdir(parents=True)
        (isolated_edadv / "reports").mkdir()
        (isolated_edadv / "figures").mkdir()
        shutil.copy2(source, isolated / source.name)
        shutil.copy2(ROOT / "edadv" / "outputs" / "dataset_audit.json", isolated_edadv / "outputs" / "dataset_audit.json")
        shutil.copy2(ROOT / "edadv" / "run_phase2_eda.py", isolated_edadv / "run_phase2_eda.py")
        run = subprocess.run([sys.executable, str(isolated_edadv / "run_phase2_eda.py")],
                             cwd=isolated, capture_output=True, text=True)
        if run.returncode:
            print(run.stdout[-4000:])
            print(run.stderr[-4000:])
            raise SystemExit(f"Isolated Phase 2 run failed ({run.returncode}).")

        table_mismatches = [name for name in TABLES if sha256(ROOT / "edadv" / "outputs" / name)
                            != sha256(isolated_edadv / "outputs" / name)]
        figure_mismatches = [name for name in FIGURES if sha256(ROOT / "edadv" / "figures" / name)
                             != sha256(isolated_edadv / "figures" / name)]
        report_match = sha256(ROOT / "edadv" / "reports" / "phase2_eda_report.md") == sha256(
            isolated_edadv / "reports" / "phase2_eda_report.md")
        result = {
            "status": "passed" if not table_mismatches and not figure_mismatches and report_match else "mismatch",
            "source_sha256": sha256(source),
            "tables_compared": len(TABLES),
            "table_mismatches": table_mismatches,
            "figures_compared": len(FIGURES),
            "figure_byte_mismatches": figure_mismatches,
            "phase2_report_byte_identical": report_match,
            "temporary_project_cleaned": True,
        }
        print(json.dumps(result, indent=2))
        if result["status"] != "passed":
            raise SystemExit(1)


if __name__ == "__main__":
    main()
