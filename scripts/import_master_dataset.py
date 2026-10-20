#!/usr/bin/env python3
"""
============================================================================
HEATSHIELD (TF-141) — PYTHON MASTER CSV BATCH DATASET IMPORTER
Institution: MIT Vishwaprayag University, Solapur, Maharashtra, India

Secure streaming batch loader for:
'Heat Shield Master Dataset(2).csv' -> Supabase table 'heatshield_master'
============================================================================
"""

import os
import sys
import csv
import json
import time
import argparse
import urllib.request
import urllib.error

# Ensure clean UTF-8 console output on Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def load_env_files():
    for f in ['.env.local', '.env']:
        env_path = os.path.join(PROJECT_ROOT, f)
        if os.path.exists(env_path):
            with open(env_path, 'r', encoding='utf-8') as fh:
                for line in fh:
                    line = line.strip()
                    if not line or line.startswith('#'): continue
                    if '=' in line:
                        k, v = line.split('=', 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k not in os.environ:
                            os.environ[k] = v

load_env_files()

def parse_arguments():
    parser = argparse.ArgumentParser(description="HeatShield Master Dataset Importer")
    parser.add_argument('--dry-run', action='store_true', help="Validate records without writing to database")
    parser.add_argument('--limit', type=int, default=None, help="Maximum number of rows to process")
    parser.add_argument('--batch-size', type=int, default=500, help="Number of rows per upload batch")
    parser.add_argument('--file', type=str, default=None, help="Path to master dataset CSV")
    return parser.parse_args()

def locate_csv(explicit_path):
    if explicit_path:
        p = explicit_path if os.path.isabs(explicit_path) else os.path.join(PROJECT_ROOT, explicit_path)
        if os.path.exists(p): return p
    candidates = [
        os.path.join(PROJECT_ROOT, 'Heat Shield Master Dataset(2).csv'),
        os.path.join(PROJECT_ROOT, 'Datasets', 'datasets', 'Heat Shield Master Dataset.csv'),
        os.path.join(PROJECT_ROOT, 'Datasets', 'datasets', 'Heat Shield Master Dataset(2).csv')
    ]
    for c in candidates:
        if os.path.exists(c): return c
    return None

def validate_row(row, line_no):
    errors = []
    rec_id = row.get('record_id')
    if not rec_id: errors.append('Missing record_id')

    try:
        lat = float(row['latitude'])
        lon = float(row['longitude'])
        if not (17.4 <= lat <= 17.9): errors.append(f'Lat out of Solapur range: {lat}')
        if not (75.7 <= lon <= 76.2): errors.append(f'Lon out of Solapur range: {lon}')
    except Exception as e:
        errors.append(f'Invalid coordinates: {e}')

    try:
        air = float(row['air_temperature_c'])
        max_air = float(row['max_air_temperature_c'])
        min_air = float(row['min_air_temperature_c'])
        if not (min_air <= air <= max_air):
            errors.append(f'Temp hierarchy violated: {min_air} <= {air} <= {max_air}')
    except Exception as e:
        errors.append(f'Invalid air temps: {e}')

    try:
        rh = float(row['relative_humidity_pct'])
        if not (0 <= rh <= 100): errors.append(f'Invalid RH: {rh}')
    except Exception as e:
        errors.append(f'Invalid RH: {e}')

    if errors:
        return False, errors
    return True, None

def transform_row(row):
    return {
        'record_id': row['record_id'],
        'location_id': row['location_id'],
        'observation_datetime': row['observation_datetime'],
        'observation_date': row['observation_date'],
        'year': int(row['year']),
        'month': int(row['month']),
        'day': int(row['day']),
        'season': row['season'],
        'data_source_type': row.get('data_source_type', 'Synthetic simulation'),
        'is_synthetic': row.get('is_synthetic', 'True') in ['True', 'true', True],
        'city': row.get('city', 'Solapur'),
        'state': row.get('state', 'Maharashtra'),
        'country': row.get('country', 'India'),
        'latitude': float(row['latitude']),
        'longitude': float(row['longitude']),
        'location_name': row['location_name'],
        'zone_type': row['zone_type'],
        'elevation_m': int(row['elevation_m']),
        'population_density_per_km2': int(row['population_density_per_km2']),
        'distance_to_green_space_m': int(row['distance_to_green_space_m']),
        'air_temperature_c': float(row['air_temperature_c']),
        'max_air_temperature_c': float(row['max_air_temperature_c']),
        'min_air_temperature_c': float(row['min_air_temperature_c']),
        'relative_humidity_pct': float(row['relative_humidity_pct']),
        'wind_speed_mps': float(row['wind_speed_mps']),
        'wind_direction_deg': float(row['wind_direction_deg']),
        'solar_radiation_w_m2': float(row['solar_radiation_w_m2']),
        'precipitation_mm': float(row['precipitation_mm']),
        'cloud_cover_pct': float(row['cloud_cover_pct']),
        'atmospheric_pressure_hpa': float(row['atmospheric_pressure_hpa']),
        'land_surface_temperature_c': float(row['land_surface_temperature_c']),
        'surface_temperature_anomaly_c': float(row['surface_temperature_anomaly_c']),
        'ndvi': float(row['ndvi']),
        'ndbi': float(row['ndbi']),
        'ndwi': float(row['ndwi']),
        'vegetation_cover_pct': float(row['vegetation_cover_pct']),
        'impervious_surface_pct': float(row['impervious_surface_pct']),
        'building_density_index': float(row['building_density_index']),
        'road_density_km_per_km2': float(row['road_density_km_per_km2']),
        'tree_canopy_cover_pct': float(row['tree_canopy_cover_pct']),
        'shade_availability_pct': float(row['shade_availability_pct']),
        'surface_albedo': float(row['surface_albedo']),
        'distance_to_water_m': int(row['distance_to_water_m']),
        'pedestrian_activity_index': float(row['pedestrian_activity_index']),
        'traffic_intensity_index': float(row['traffic_intensity_index']),
        'built_up_intensity_index': float(row['built_up_intensity_index']),
        'heat_exposure_index': float(row['heat_exposure_index']),
        'vulnerable_population_index': float(row['vulnerable_population_index']),
        'cooling_infrastructure_present': row.get('cooling_infrastructure_present') in ['True', 'true', True],
        'cooling_infrastructure_type': row['cooling_infrastructure_type'],
        'urban_heat_island_intensity_c': float(row['urban_heat_island_intensity_c']),
        'heat_risk_category': row['heat_risk_category'],
        'shade_gap_index': float(row['shade_gap_index']),
        'green_cover_deficit_pct': float(row['green_cover_deficit_pct']),
        'cooling_priority_score': float(row['cooling_priority_score']),
        'recommended_intervention': row['recommended_intervention'],
        'estimated_cooling_potential_c': float(row['estimated_cooling_potential_c'])
    }

def upload_batch_rest(supabase_url, service_key, batch):
    url = f"{supabase_url.rstrip('/')}/rest/v1/heatshield_master"
    headers = {
        'apikey': service_key,
        'Authorization': f'Bearer {service_key}',
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates'
    }
    req = urllib.request.Request(url, data=json.dumps(batch).encode('utf-8'), headers=headers, method='POST')
    with urllib.request.urlopen(req) as resp:
        return resp.status in (200, 201)

def main():
    args = parse_arguments()
    csv_path = locate_csv(args.file)
    if not csv_path:
        print("❌ Master CSV not found.")
        sys.exit(1)

    supabase_url = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL')
    service_key = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

    print("=" * 78)
    print("HEATSHIELD (TF-141) — PYTHON MASTER CSV IMPORTER")
    print("=" * 78)
    print(f"📁 CSV File:   {csv_path} ({os.path.getsize(csv_path)/(1024*1024):.2f} MB)")
    print(f"🎯 Mode:       {'DRY RUN (Validation only)' if args.dry_run else 'LIVE DATABASE UPSERT'}")
    print(f"📦 Batch Size: {args.batch_size}")
    if args.limit: print(f"⚡ Limit:      {args.limit} rows")

    if not args.dry_run:
        if not supabase_url or not service_key:
            print("❌ Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required for live uploads.")
            print("   Set SUPABASE_SERVICE_ROLE_KEY in your local environment, or use --dry-run.")
            sys.exit(1)
        print(f"🔗 Database:   {supabase_url}")
    print("=" * 78)

    start_time = time.time()
    total_read = 0
    total_valid = 0
    total_rejected = 0
    total_uploaded = 0
    batch = []

    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            total_read += 1
            if args.limit and total_read > args.limit:
                break

            valid, errs = validate_row(row, total_read + 1)
            if valid:
                total_valid += 1
                batch.append(transform_row(row))
            else:
                total_rejected += 1

            if len(batch) >= args.batch_size:
                if not args.dry_run:
                    upload_batch_rest(supabase_url, service_key, batch)
                    total_uploaded += len(batch)
                sys.stdout.write(f"\rRead: {total_read:,} | Valid: {total_valid:,} | Uploaded: {total_uploaded:,} | Rejected: {total_rejected}")
                sys.stdout.flush()
                batch = []

        if batch:
            if not args.dry_run:
                upload_batch_rest(supabase_url, service_key, batch)
                total_uploaded += len(batch)
            batch = []

    elapsed = time.time() - start_time
    print(f"\n\nDone! Processed {total_read:,} rows in {elapsed:.2f}s ({total_read/elapsed:.0f} rows/s).")
    print(f"Valid: {total_valid:,} | Uploaded: {total_uploaded:,} | Rejected: {total_rejected}")

if __name__ == '__main__':
    main()
