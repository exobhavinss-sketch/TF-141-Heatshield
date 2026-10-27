#!/usr/bin/env python3
"""Read-only, dependency-free audit for the HeatShield master CSV."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import math
import statistics
from collections import Counter, defaultdict
from datetime import date, datetime
from pathlib import Path

# Literal "None" is a documented category in cooling_infrastructure_type.
MISSING_TOKENS = {"", "na", "n/a", "null", "nan"}
SOLAPUR_ENVELOPE = {"latitude": (17.4, 17.9), "longitude": (75.7, 76.2)}
PHYSICAL_RANGES = {
    "air_temperature_c": (-10.0, 60.0),
    "max_air_temperature_c": (-10.0, 65.0),
    "min_air_temperature_c": (-20.0, 60.0),
    "relative_humidity_pct": (0.0, 100.0),
    "land_surface_temperature_c": (-10.0, 80.0),
    "surface_temp_c": (-10.0, 95.0),
    "heat_index_c": (-20.0, 80.0),
}
TIME_COLUMNS = {"observation_datetime", "recorded_at", "timestamp", "datetime"}


def parse_number(value: str):
    try:
        number = float(value)
        return number if math.isfinite(number) else None
    except (TypeError, ValueError):
        return None


def parse_datetime(value: str):
    candidate = value.strip()
    if not candidate:
        return None
    try:
        return datetime.fromisoformat(candidate.replace("Z", "+00:00"))
    except ValueError:
        try:
            return datetime.combine(date.fromisoformat(candidate), datetime.min.time())
        except ValueError:
            return None


def quantile(sorted_values, fraction):
    if not sorted_values:
        return None
    position = (len(sorted_values) - 1) * fraction
    lower = math.floor(position)
    upper = math.ceil(position)
    if lower == upper:
        return sorted_values[lower]
    return sorted_values[lower] * (upper - position) + sorted_values[upper] * (position - lower)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv_path", nargs="?", default="Heat Shield Master Dataset(2).csv")
    parser.add_argument("--output", default="edadv/outputs/dataset_audit.json")
    args = parser.parse_args()

    source = Path(args.csv_path)
    if not source.is_file():
        raise SystemExit(f"CSV not found: {source}")

    byte_hash = hashlib.sha256()
    with source.open("rb") as raw:
        for block in iter(lambda: raw.read(1024 * 1024), b""):
            byte_hash.update(block)

    with source.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        columns = reader.fieldnames or []
        if not columns:
            raise SystemExit("CSV has no header row")
        missing = Counter()
        numeric_values = defaultdict(list)
        type_counts = defaultdict(Counter)
        category_counts = defaultdict(Counter)
        exact_hashes = set()
        ids = Counter()
        stations = Counter()
        station_dates = Counter()
        date_counts = Counter()
        parse_failures = Counter()
        invalid_ranges = Counter()
        invalid_coordinates = 0
        outside_solapur = 0
        temp_hierarchy_violations = 0
        date_field_mismatches = Counter()
        row_count = 0
        min_timestamp = max_timestamp = None
        latitudes, longitudes = [], []

        for row in reader:
            row_count += 1
            normalized = []
            row_numbers = {}
            for column in columns:
                value = (row.get(column) or "").strip()
                normalized.append(value)
                if value.lower() in MISSING_TOKENS:
                    missing[column] += 1
                    type_counts[column]["missing"] += 1
                    continue
                number = parse_number(value)
                if number is not None:
                    numeric_values[column].append(number)
                    row_numbers[column] = number
                    type_counts[column]["numeric"] += 1
                elif column in TIME_COLUMNS or column.endswith(("_datetime", "_date", "_at")):
                    parsed = parse_datetime(value)
                    type_counts[column]["datetime" if parsed else "unparsed_datetime"] += 1
                    if not parsed:
                        parse_failures[column] += 1
                    elif column in TIME_COLUMNS:
                        min_timestamp = parsed if min_timestamp is None else min(min_timestamp, parsed)
                        max_timestamp = parsed if max_timestamp is None else max(max_timestamp, parsed)
                        date_counts[parsed.date().isoformat()] += 1
                        if row.get("observation_date") and row["observation_date"].strip() != parsed.date().isoformat():
                            date_field_mismatches["observation_date_vs_timestamp"] += 1
                        for field, expected in (("year", parsed.year), ("month", parsed.month), ("day", parsed.day)):
                            if row.get(field) and row[field].strip().isdigit() and int(row[field]) != expected:
                                date_field_mismatches[f"{field}_vs_timestamp"] += 1
                elif value.lower() in {"true", "false", "yes", "no", "0", "1"}:
                    type_counts[column]["boolean"] += 1
                    category_counts[column][value] += 1
                else:
                    type_counts[column]["text"] += 1
                    category_counts[column][value] += 1

            exact_hashes.add(hashlib.sha256("\x1f".join(normalized).encode("utf-8")).digest())
            for id_column in ("record_id", "id"):
                if id_column in row and row[id_column]:
                    ids[row[id_column].strip()] += 1
                    break
            station_column = next((c for c in ("location_id", "station_id") if c in row), None)
            if station_column and row.get(station_column):
                stations[row[station_column].strip()] += 1
                observed_date = row.get("observation_date") or row.get("recorded_at", "")
                if observed_date:
                    station_dates[(row[station_column].strip(), observed_date.strip())] += 1

            for column, bounds in PHYSICAL_RANGES.items():
                if column in row_numbers and not bounds[0] <= row_numbers[column] <= bounds[1]:
                    invalid_ranges[column] += 1
            if "latitude" in row_numbers and "longitude" in row_numbers:
                lat, lon = row_numbers["latitude"], row_numbers["longitude"]
                latitudes.append(lat)
                longitudes.append(lon)
                if not -90 <= lat <= 90 or not -180 <= lon <= 180:
                    invalid_coordinates += 1
                if not (17.4 <= lat <= 17.9 and 75.7 <= lon <= 76.2):
                    outside_solapur += 1
            if all(c in row_numbers for c in ("min_air_temperature_c", "air_temperature_c", "max_air_temperature_c")):
                if not row_numbers["min_air_temperature_c"] <= row_numbers["air_temperature_c"] <= row_numbers["max_air_temperature_c"]:
                    temp_hierarchy_violations += 1

    duplicate_rows = row_count - len(exact_hashes)
    duplicate_ids = {key: count for key, count in ids.items() if count > 1}
    numeric_summary = {}
    for column, values in numeric_values.items():
        ordered = sorted(values)
        numeric_summary[column] = {
            "count": len(values),
            "mean": statistics.fmean(values),
            "sample_stddev": statistics.stdev(values) if len(values) > 1 else None,
            "min": ordered[0], "q1": quantile(ordered, 0.25),
            "median": quantile(ordered, 0.5), "q3": quantile(ordered, 0.75),
            "max": ordered[-1],
        }

    inferred_types = {}
    for column in columns:
        counts = type_counts[column]
        present = sum(value for kind, value in counts.items() if kind != "missing")
        dominant = max((kind for kind in counts if kind != "missing"), key=lambda kind: counts[kind], default="unknown")
        inferred_types[column] = {
            "inferred": dominant,
            "numeric_parse_rate": round(counts["numeric"] / present, 6) if present else None,
            "missing_count": missing[column],
            "missing_pct": round(missing[column] * 100 / row_count, 6) if row_count else 0,
        }

    categorical = {}
    for column, counts in category_counts.items():
        if column in {"location_id", "station_id", "zone_type", "cooling_infrastructure_type", "substrate", "status", "heat_risk_category", "season", "data_source_type", "is_synthetic", "recommended_intervention", "cooling_infrastructure_present"}:
            categorical[column] = {"unique": len(counts), "counts": dict(counts.most_common())}

    unique_dates = sorted(date_counts)
    gaps = [(date.fromisoformat(right) - date.fromisoformat(left)).days for left, right in zip(unique_dates, unique_dates[1:])]
    expected_calendar_days = ((max_timestamp.date() - min_timestamp.date()).days + 1) if min_timestamp and max_timestamp else None
    report = {
        "source": {"path": str(source), "filename": source.name, "size_bytes": source.stat().st_size,
                   "sha256": byte_hash.hexdigest(), "encoding": "UTF-8 (BOM tolerated)", "delimiter": "comma"},
        "shape": {"rows": row_count, "columns": len(columns)},
        "columns": columns,
        "inferred_types": inferred_types,
        "numeric_summary": numeric_summary,
        "duplicates": {"exact_duplicate_rows": duplicate_rows, "duplicate_identifier_count": len(duplicate_ids),
                        "duplicate_identifiers_sample": dict(list(duplicate_ids.items())[:20]),
                        "duplicate_station_date_pairs": sum(count > 1 for count in station_dates.values()),
                        "unique_station_date_pairs": len(station_dates)},
        "time": {"minimum": min_timestamp.isoformat() if min_timestamp else None,
                 "maximum": max_timestamp.isoformat() if max_timestamp else None,
                 "date_parse_failures": dict(parse_failures),
                 "unique_dates": len(date_counts), "rows_per_date_min": min(date_counts.values()) if date_counts else None,
                 "rows_per_date_max": max(date_counts.values()) if date_counts else None,
                 "calendar_days_inclusive": expected_calendar_days,
                 "dates_without_observations": expected_calendar_days - len(date_counts) if expected_calendar_days is not None else None,
                 "largest_gap_between_observed_dates_days": max(gaps) if gaps else None,
                 "date_component_mismatches": dict(date_field_mismatches)},
        "geography": {"valid_coordinate_rows": row_count - invalid_coordinates,
                      "invalid_coordinate_rows": invalid_coordinates, "outside_solapur_envelope_rows": outside_solapur,
                      "solapur_envelope": SOLAPUR_ENVELOPE,
                      "latitude_min": min(latitudes) if latitudes else None, "latitude_max": max(latitudes) if latitudes else None,
                      "longitude_min": min(longitudes) if longitudes else None, "longitude_max": max(longitudes) if longitudes else None,
                      "unique_coordinate_pairs": len(set(zip(latitudes, longitudes)))},
        "quality_checks": {"out_of_range_values": dict(invalid_ranges),
                           "air_temperature_hierarchy_violations": temp_hierarchy_violations},
        "categorical_distributions": categorical,
        "requested_fields_absent": [name for name in ("substrate", "status", "heat_index_c") if name not in columns],
        "notes": ["A field absent from the source CSV is reported as unavailable, not inferred.",
                  "Solapur envelope is a broad screening box, not an official municipal boundary."],
    }
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps({"source": report["source"], "shape": report["shape"],
                      "duplicates": report["duplicates"], "time": report["time"],
                      "geography": report["geography"], "quality_checks": report["quality_checks"],
                      "missing_columns": report["requested_fields_absent"], "output": str(output)}, indent=2))


if __name__ == "__main__":
    main()
