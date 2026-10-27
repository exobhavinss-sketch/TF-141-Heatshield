"""Read-only validation of Phase 1/2 outputs for the HeatShield EDADV report."""

from __future__ import annotations

import csv
import hashlib
import json
import math
import struct
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
EDADV = ROOT / "edadv"
OUT = EDADV / "outputs"
EXPECTED_HASH = "b9e73ed10d0dc7c824063e7f1b868a95b11a435758f2ed940d63aa30f45e1b83"


def read_csv(name: str) -> list[dict[str, str]]:
    with (OUT / name).open("r", encoding="utf-8-sig", newline="") as stream:
        return list(csv.DictReader(stream))


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as stream:
        header = stream.read(24)
    if header[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError(f"Not a PNG: {path}")
    return struct.unpack(">II", header[16:24])


def main() -> None:
    checks: list[dict[str, object]] = []

    def record(name: str, ok: bool, detail: str) -> None:
        checks.append({"check": name, "passed": bool(ok), "detail": detail})

    audit_path = OUT / "dataset_audit.json"
    summary_path = OUT / "phase2_summary.json"
    manifest_path = OUT / "phase2_figure_manifest.json"
    audit = json.loads(audit_path.read_text(encoding="utf-8"))
    summary = json.loads(summary_path.read_text(encoding="utf-8"))
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    source = ROOT / audit["source"]["path"]
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    record("master_hash", digest == EXPECTED_HASH == summary["source_sha256"], digest)
    record("dataset_shape", audit["shape"]["rows"] == summary["row_count"] == 150000
           and audit["shape"]["columns"] == summary["column_count"] == 57,
           f"{summary['row_count']} rows x {summary['column_count']} columns")
    record("synthetic_disclosure", summary["all_synthetic"] is True
           and "not verified live" in summary["provenance"], summary["provenance"])
    verification_path = OUT / "phase3_audit_verification.json"
    verification_ok = verification_path.is_file()
    if verification_ok:
        audit_rerun = json.loads(verification_path.read_text(encoding="utf-8"))
        verification_ok = audit_rerun["source"]["sha256"] == audit["source"]["sha256"]
        verification_ok &= audit_rerun["shape"] == audit["shape"]
        verification_ok &= audit_rerun["duplicates"] == audit["duplicates"]
        verification_ok &= audit_rerun["time"] == audit["time"]
        verification_ok &= audit_rerun["geography"] == audit["geography"]
        verification_ok &= audit_rerun["quality_checks"] == audit["quality_checks"]
    record("rerun_audit_consistency", verification_ok, "fresh full audit matches canonical shape, duplicate, time, geography, and range checks")

    stats = {r["column"]: r for r in read_csv("descriptive_statistics.csv")}
    report_text = (EDADV / "reports" / "phase2_eda_report.md").read_text(encoding="utf-8")
    key_stats = {
        "air_temperature_c": (34.28, 5.62, 34.15, 19.35, 46.81),
        "relative_humidity_pct": (48.55, 21.32, 42.90, 14.80, 98.00),
        "land_surface_temperature_c": (35.89, 6.96, 35.54, 17.06, 55.35),
        "urban_heat_island_intensity_c": (3.27, 2.66, 2.81, 0.00, 9.80),
    }
    stats_ok = len(stats) == 41
    for column, expected in key_stats.items():
        row = stats[column]
        actual = tuple(round(float(row[k]), 2) for k in ("mean", "sample_stddev", "median", "min", "max"))
        stats_ok &= int(row["n"]) == 150000 and actual == expected
        stats_ok &= f"{expected[0]:.2f}" in report_text
    record("numeric_summary_claims", stats_ok, "41 numeric columns; four report rows cross-checked against CSV")

    pairs = {frozenset((r["variable_1"], r["variable_2"])): r for r in read_csv("correlation_pairs.csv")}
    corr_claims = {
        ("air_temperature_c", "relative_humidity_pct"): -0.317,
        ("air_temperature_c", "land_surface_temperature_c"): 0.936,
        ("ndvi", "land_surface_temperature_c"): -0.307,
        ("ndbi", "land_surface_temperature_c"): 0.369,
    }
    corr_ok = True
    for pair, expected in corr_claims.items():
        row = pairs[frozenset(pair)]
        corr_ok &= int(row["n_paired"]) == 150000 and round(float(row["pearson_r"]), 3) == expected
        corr_ok &= f"{expected:.3f}" in report_text
    record("correlation_claims_and_n", corr_ok, "4 Pearson claims and paired n cross-checked; all use row-level dependent records")

    station = read_csv("station_aggregates.csv")
    zones = read_csv("zone_station_comparison.csv")
    risk = read_csv("risk_category_by_zone.csv")
    coverage = read_csv("temporal_coverage.csv")
    iqr = {r["column"]: r for r in read_csv("iqr_outlier_screen.csv")}
    monthly = read_csv("monthly_station_summary.csv")
    annual = read_csv("annual_station_summary.csv")
    zone_totals = summary["zone_observation_counts"]
    zone_summary_ok = len(station) == 100 and len({r["zone_type"] for r in station}) == 9
    zone_summary_ok &= sum(int(v) for v in zone_totals.values()) == 150000
    zone_summary_ok &= all(int(r["observation_count"]) == 1500 for r in station)
    record("station_zone_totals", zone_summary_ok, "100 station rows x 1,500 records; 9 zones; zone counts sum to 150,000")
    risk_totals: dict[str, int] = {}
    for row in risk:
        risk_totals[row["heat_risk_category"]] = risk_totals.get(row["heat_risk_category"], 0) + int(row["count"])
    risk_ok = risk_totals == summary["risk_category_counts"] and sum(risk_totals.values()) == 150000
    risk_ok &= all(sum(int(r["count"]) for r in risk if r["zone_type"] == zone) == int(total)
                   for zone, total in zone_totals.items())
    record("risk_and_zone_totals", risk_ok, f"risk totals={risk_totals}; risk-by-zone sums match zone totals")
    dates = [r for r in coverage if r["observed"].lower() == "true"]
    missing_dates = sum(r["observed"].lower() != "true" for r in coverage)
    date_ok = len(dates) == summary["unique_observed_dates"] == 1500
    date_ok &= missing_dates == summary["dates_without_observations"] == 326
    date_ok &= all(int(r["record_count"]) == 100 and int(r["station_count"]) == 100 for r in dates)
    record("temporal_coverage", date_ok, f"{len(dates)} observed dates; {missing_dates} unobserved calendar dates; gaps retained")
    iqr_expected = {"air_temperature_c": 0, "relative_humidity_pct": 0,
                    "land_surface_temperature_c": 17, "urban_heat_island_intensity_c": 0}
    iqr_ok = all(int(iqr[k]["candidate_count"]) == value for k, value in iqr_expected.items())
    iqr_ok &= "Tukey 1.5" in report_text and "no records were removed" in report_text
    record("iqr_screen", iqr_ok, f"core-variable flags={iqr_expected}; candidates only")
    group_ok = len([r for r in monthly if r["variable"] in ("air_temperature_c", "land_surface_temperature_c")]) == 24
    group_ok &= len([r for r in annual if r["variable"] in ("air_temperature_c", "land_surface_temperature_c")]) == 10
    group_ok &= len(zones) == 45 and all(int(r["station_count"]) > 0 for r in zones)
    record("grouped_summaries", group_ok, "monthly 24 variable-month rows, annual 10 variable-year rows, zone 45 variable-zone rows")

    zone_claims = {(r["variable"], r["zone_type"]): round(float(r["mean_of_station_means"]), 2) for r in zones}
    monthly_claims = {(int(r["month_number"]), r["variable"]): round(float(r["mean_of_station_means"]), 2) for r in monthly}
    annual_values = {}
    for variable in ("air_temperature_c", "land_surface_temperature_c"):
        vals = [float(r["mean_of_station_means"]) for r in annual if r["variable"] == variable]
        annual_values[variable] = (round(min(vals), 2), round(max(vals), 2))
    highrisk = [r for r in risk if r["heat_risk_category"] == "Very High"]
    top_vh = max(highrisk, key=lambda r: float(r["percent_within_zone"]))
    supported_fragments = [
        "2021-01-01 08:00 UTC", "2025-12-31 12:47 UTC",
        f"{monthly_claims[(5, 'air_temperature_c')]:.2f} °C", f"{monthly_claims[(10, 'air_temperature_c')]:.2f} °C",
        f"{monthly_claims[(5, 'land_surface_temperature_c')]:.2f} °C", f"{monthly_claims[(10, 'land_surface_temperature_c')]:.2f} °C",
        f"{annual_values['air_temperature_c'][0]:.2f}–{annual_values['air_temperature_c'][1]:.2f} °C",
        f"{annual_values['land_surface_temperature_c'][0]:.2f}–{annual_values['land_surface_temperature_c'][1]:.2f} °C",
        f"{zone_claims[('air_temperature_c', 'Industrial')]:.2f} °C", f"{zone_claims[('air_temperature_c', 'Waterbody')]:.2f} °C",
        f"{zone_claims[('land_surface_temperature_c', 'Industrial')]:.2f} °C", f"{zone_claims[('land_surface_temperature_c', 'Waterbody')]:.2f} °C",
        f"{float(top_vh['percent_within_zone']):.1f}%",
        "77,145", "37,548", "21,737", "13,570", "51,118", "34.1%",
        "17.612–17.722° N", "75.836–75.962° E",
    ]
    final_report_text = (EDADV / "reports" / "EDADV_Final_Report.md").read_text(encoding="utf-8")
    missing_report_claims = [fragment for fragment in supported_fragments if fragment not in final_report_text]
    report_claims_ok = not missing_report_claims
    record("final_report_claims", report_claims_ok,
           f"{len(supported_fragments) - len(missing_report_claims)}/{len(supported_fragments)} temporal, zone, risk, and spatial claim fragments match outputs; missing={missing_report_claims}")

    figures = manifest["figures"]
    figure_ok = len(figures) == 12
    figure_details = []
    for entry in figures:
        path = EDADV / "figures" / entry["file"]
        size = png_size(path)
        disclosed = "synthetic academic simulation data" in entry["source"].lower()
        figure_ok &= path.is_file() and size[0] >= 1200 and size[1] >= 600 and disclosed
        figure_details.append({"file": entry["file"], "width": size[0], "height": size[1], "source_disclosed": disclosed})
    supplemental = ["03_station_level_lst_by_zone_annotated.png", "12_risk_label_mix_by_zone_annotated.png"]
    for name in supplemental:
        path = EDADV / "figures_phase3" / name
        size = png_size(path)
        figure_ok &= path.is_file() and size[0] >= 1200 and size[1] >= 600
        figure_details.append({"file": f"figures_phase3/{name}", "width": size[0], "height": size[1], "source_disclosed": True})
    record("figure_manifest_and_resolution", figure_ok, f"12 manifest figures and 2 annotated copies; all >=1200x600 px; provenance documented")
    missing_fields_ok = not summary["heat_index_c_available"] and not summary["substrate_available"] and not summary["status_available"]
    record("unsupported_fields_absent", missing_fields_ok, "heat_index_c, substrate, and status are unavailable")

    result = {
        "status": "passed" if all(bool(c["passed"]) for c in checks) else "failed",
        "source": audit["source"],
        "checks": checks,
        "figure_dimensions": figure_details,
        "notes": [
            "The audit validates internal consistency of source-derived outputs, not environmental truth.",
            "Correlation n is paired row count; station/date repetitions are dependent.",
            "Legacy chart review is documented separately in reports/legacy_chart_validation.md.",
        ],
    }
    output = OUT / "phase3_validation.json"
    output.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"status": result["status"], "checks": checks, "output": str(output.relative_to(ROOT))}, indent=2))
    if result["status"] != "passed":
        raise SystemExit(1)


if __name__ == "__main__":
    main()
