#!/usr/bin/env node

/**
 * ============================================================================
 * HEATSHIELD (TF-141) — MASTER CSV BATCH DATASET IMPORTER
 * Institution: MIT Vishwaprayag University, Solapur, Maharashtra, India
 * 
 * Secure, streaming, repeatable ETL batch loader for:
 * 'Heat Shield Master Dataset(2).csv' -> Supabase table 'heatshield_master'
 * 
 * Features:
 * - Streaming line-by-line CSV parser (zero memory spikes on 63MB+ CSVs)
 * - Strict schema validation (coordinates, temperature hierarchy, bounds)
 * - Idempotent upsert on stable primary key 'record_id' (repeatable, zero duplicates)
 * - Dry-run mode (--dry-run) for verification before database write
 * - Configurable batch size (--batch-size 500) and limit (--limit 1000)
 * - Detailed rejection log and execution metrics
 * - Service-role key loaded exclusively from local environment (never in client bundle)
 * ============================================================================
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Read local .env or .env.local if present (without overwriting existing process.env)
function loadLocalEnv() {
  const envCandidates = ['.env.local', '.env'];
  for (const file of envCandidates) {
    const fullPath = path.join(projectRoot, file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          val = val.replace(/^["']|["']$/g, '');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadLocalEnv();

// Parse CLI flags
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitIdx = args.indexOf('--limit');
const rowLimit = limitIdx !== -1 && args[limitIdx + 1] ? parseInt(args[limitIdx + 1], 10) : Infinity;
const batchIdx = args.indexOf('--batch-size');
const batchSize = batchIdx !== -1 && args[batchIdx + 1] ? parseInt(args[batchIdx + 1], 10) : 500;
const fileIdx = args.indexOf('--file');
const explicitFile = fileIdx !== -1 && args[fileIdx + 1] ? args[fileIdx + 1] : null;

// Locate CSV file
function resolveCsvFile() {
  if (explicitFile) {
    const candidate = path.isAbsolute(explicitFile) ? explicitFile : path.join(projectRoot, explicitFile);
    if (fs.existsSync(candidate)) return candidate;
  }
  const defaultPaths = [
    path.join(projectRoot, 'Heat Shield Master Dataset(2).csv'),
    path.join(projectRoot, 'Datasets', 'datasets', 'Heat Shield Master Dataset.csv'),
    path.join(projectRoot, 'Datasets', 'datasets', 'Heat Shield Master Dataset(2).csv')
  ];
  for (const p of defaultPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const csvFilePath = resolveCsvFile();
if (!csvFilePath) {
  console.error('❌ Error: Could not locate master CSV file. Checked default paths and --file argument.');
  process.exit(1);
}

// Credentials validation
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

console.log('='.repeat(78));
console.log('HEATSHIELD (TF-141) — MASTER CSV BATCH DATASET IMPORTER');
console.log('='.repeat(78));
console.log(`📁 Source CSV:        ${path.relative(projectRoot, csvFilePath)} (${(fs.statSync(csvFilePath).size / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`🎯 Mode:              ${isDryRun ? 'DRY RUN (Validation only, no DB writes)' : 'LIVE DATABASE UPSERT'}`);
console.log(`📦 Batch Size:        ${batchSize} rows/chunk`);
if (rowLimit !== Infinity) {
  console.log(`⚡ Row Limit:         ${rowLimit} rows`);
}

let supabase = null;
if (!isDryRun) {
  if (!supabaseUrl) {
    console.error('❌ Error: Supabase URL missing. Ensure VITE_SUPABASE_URL is set.');
    process.exit(1);
  }
  if (!serviceRoleKey) {
    console.error('❌ Error: Privileged SUPABASE_SERVICE_ROLE_KEY missing.');
    console.error('   Table public.heatshield_master is secured by Row Level Security (RLS).');
    console.error('   To insert records, provide the service-role key via environment variable:');
    console.error('   $env:SUPABASE_SERVICE_ROLE_KEY="your-service-role-key" (PowerShell) or');
    console.error('   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key node scripts/importMasterDataset.js');
    console.error('   Or run with --dry-run to validate the entire CSV locally.');
    process.exit(1);
  }
  supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
  console.log(`🔗 Target Database:   ${supabaseUrl}`);
}
console.log('='.repeat(78));

// Custom CSV line splitter handling quoted strings with commas
function parseCsvLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

// Type conversion and schema validation
function transformAndValidateRow(row, headers, lineNum) {
  const errors = [];
  const map = {};
  for (let i = 0; i < headers.length; i++) {
    map[headers[i]] = row[i] !== undefined ? row[i].trim() : '';
  }

  const recordId = map.record_id;
  if (!recordId) errors.push('Missing record_id');

  const locationId = map.location_id;
  if (!locationId) errors.push('Missing location_id');

  // Dates
  const obsDateTime = map.observation_datetime;
  if (!obsDateTime || isNaN(Date.parse(obsDateTime))) {
    errors.push(`Invalid observation_datetime: "${obsDateTime}"`);
  }

  const obsDate = map.observation_date;
  if (!obsDate || !/^\d{4}-\d{2}-\d{2}$/.test(obsDate)) {
    errors.push(`Invalid observation_date: "${obsDate}"`);
  }

  // Coordinates
  const lat = parseFloat(map.latitude);
  const lon = parseFloat(map.longitude);
  if (isNaN(lat) || lat < 17.4 || lat > 17.9) {
    errors.push(`Latitude out of Solapur range: ${lat}`);
  }
  if (isNaN(lon) || lon < 75.7 || lon > 76.2) {
    errors.push(`Longitude out of Solapur range: ${lon}`);
  }

  // Temperatures
  const airTemp = parseFloat(map.air_temperature_c);
  const maxAirTemp = parseFloat(map.max_air_temperature_c);
  const minAirTemp = parseFloat(map.min_air_temperature_c);
  const lst = parseFloat(map.land_surface_temperature_c);

  if (isNaN(airTemp) || airTemp < -10 || airTemp > 65) {
    errors.push(`Invalid air_temperature_c: ${airTemp}`);
  }
  if (isNaN(maxAirTemp) || isNaN(minAirTemp)) {
    errors.push('Missing max/min air temperature');
  } else if (minAirTemp > airTemp || airTemp > maxAirTemp) {
    errors.push(`Temperature hierarchy violated: min (${minAirTemp}) <= cur (${airTemp}) <= max (${maxAirTemp})`);
  }

  // Relative humidity
  const rh = parseFloat(map.relative_humidity_pct);
  if (isNaN(rh) || rh < 0 || rh > 100) {
    errors.push(`Invalid relative_humidity_pct: ${rh}`);
  }

  if (errors.length > 0) {
    return { valid: false, errors, lineNum, recordId };
  }

  return {
    valid: true,
    data: {
      record_id: recordId,
      location_id: locationId,
      observation_datetime: obsDateTime,
      observation_date: obsDate,
      year: parseInt(map.year, 10),
      month: parseInt(map.month, 10),
      day: parseInt(map.day, 10),
      season: map.season,
      data_source_type: map.data_source_type || 'Synthetic simulation',
      is_synthetic: map.is_synthetic === 'True' || map.is_synthetic === 'true' || map.is_synthetic === true,
      city: map.city || 'Solapur',
      state: map.state || 'Maharashtra',
      country: map.country || 'India',
      latitude: lat,
      longitude: lon,
      location_name: map.location_name,
      zone_type: map.zone_type,
      elevation_m: parseInt(map.elevation_m, 10),
      population_density_per_km2: parseInt(map.population_density_per_km2, 10),
      distance_to_green_space_m: parseInt(map.distance_to_green_space_m, 10),
      air_temperature_c: airTemp,
      max_air_temperature_c: maxAirTemp,
      min_air_temperature_c: minAirTemp,
      relative_humidity_pct: rh,
      wind_speed_mps: parseFloat(map.wind_speed_mps),
      wind_direction_deg: parseFloat(map.wind_direction_deg),
      solar_radiation_w_m2: parseFloat(map.solar_radiation_w_m2),
      precipitation_mm: parseFloat(map.precipitation_mm),
      cloud_cover_pct: parseFloat(map.cloud_cover_pct),
      atmospheric_pressure_hpa: parseFloat(map.atmospheric_pressure_hpa),
      land_surface_temperature_c: lst,
      surface_temperature_anomaly_c: parseFloat(map.surface_temperature_anomaly_c),
      ndvi: parseFloat(map.ndvi),
      ndbi: parseFloat(map.ndbi),
      ndwi: parseFloat(map.ndwi),
      vegetation_cover_pct: parseFloat(map.vegetation_cover_pct),
      impervious_surface_pct: parseFloat(map.impervious_surface_pct),
      building_density_index: parseFloat(map.building_density_index),
      road_density_km_per_km2: parseFloat(map.road_density_km_per_km2),
      tree_canopy_cover_pct: parseFloat(map.tree_canopy_cover_pct),
      shade_availability_pct: parseFloat(map.shade_availability_pct),
      surface_albedo: parseFloat(map.surface_albedo),
      distance_to_water_m: parseInt(map.distance_to_water_m, 10),
      pedestrian_activity_index: parseFloat(map.pedestrian_activity_index),
      traffic_intensity_index: parseFloat(map.traffic_intensity_index),
      built_up_intensity_index: parseFloat(map.built_up_intensity_index),
      heat_exposure_index: parseFloat(map.heat_exposure_index),
      vulnerable_population_index: parseFloat(map.vulnerable_population_index),
      cooling_infrastructure_present: map.cooling_infrastructure_present === 'True' || map.cooling_infrastructure_present === 'true' || map.cooling_infrastructure_present === true,
      cooling_infrastructure_type: map.cooling_infrastructure_type,
      urban_heat_island_intensity_c: parseFloat(map.urban_heat_island_intensity_c),
      heat_risk_category: map.heat_risk_category,
      shade_gap_index: parseFloat(map.shade_gap_index),
      green_cover_deficit_pct: parseFloat(map.green_cover_deficit_pct),
      cooling_priority_score: parseFloat(map.cooling_priority_score),
      recommended_intervention: map.recommended_intervention,
      estimated_cooling_potential_c: parseFloat(map.estimated_cooling_potential_c)
    }
  };
}

async function runImporter() {
  const startTime = Date.now();
  const fileStream = fs.createReadStream(csvFilePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let headers = null;
  let totalProcessed = 0;
  let totalValid = 0;
  let totalRejected = 0;
  let totalUploaded = 0;
  const rejectedSamples = [];
  let batch = [];

  for await (const line of rl) {
    if (!line.trim()) continue;
    if (!headers) {
      headers = parseCsvLine(line).map(h => h.trim());
      continue;
    }

    totalProcessed++;
    if (totalProcessed > rowLimit) break;

    const parsedValues = parseCsvLine(line);
    const result = transformAndValidateRow(parsedValues, headers, totalProcessed + 1);

    if (result.valid) {
      totalValid++;
      batch.push(result.data);
    } else {
      totalRejected++;
      if (rejectedSamples.length < 5) {
        rejectedSamples.push(result);
      }
    }

    if (batch.length >= batchSize) {
      if (!isDryRun) {
        const { error } = await supabase
          .from('heatshield_master')
          .upsert(batch, { onConflict: 'record_id' });
        if (error) {
          console.error(`\n❌ Upsert error at batch ending row ${totalProcessed}:`, error.message);
        } else {
          totalUploaded += batch.length;
        }
      }
      process.stdout.write(`\rProgress: ${totalProcessed.toLocaleString()} rows inspected | Valid: ${totalValid.toLocaleString()} | Uploaded: ${totalUploaded.toLocaleString()} | Rejected: ${totalRejected}`);
      batch = [];
    }
  }

  // Flush remaining batch
  if (batch.length > 0) {
    if (!isDryRun) {
      const { error } = await supabase
        .from('heatshield_master')
        .upsert(batch, { onConflict: 'record_id' });
      if (error) {
        console.error(`\n❌ Final batch upsert error:`, error.message);
      } else {
        totalUploaded += batch.length;
      }
    }
    batch = [];
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  const throughput = (totalProcessed / (durationSec || 1)).toFixed(0);

  console.log('\n\n' + '='.repeat(78));
  console.log('IMPORT EXECUTION REPORT');
  console.log('='.repeat(78));
  console.log(`⏱️ Duration:            ${durationSec}s (${throughput} rows/sec)`);
  console.log(`📄 Total Rows Read:     ${totalProcessed.toLocaleString()}`);
  console.log(`✅ Valid Records:       ${totalValid.toLocaleString()}`);
  console.log(`📤 Uploaded/Upserted:   ${isDryRun ? '0 (Dry run active)' : totalUploaded.toLocaleString()}`);
  console.log(`❌ Rejected Records:    ${totalRejected}`);

  if (rejectedSamples.length > 0) {
    console.log('\nSample Validation Errors:');
    rejectedSamples.forEach((rej, idx) => {
      console.log(`  [#${idx + 1}] Line ${rej.lineNum} (ID: ${rej.recordId}): ${rej.errors.join('; ')}`);
    });
  } else {
    console.log('✨ Data Quality: 100% compliant with TF-141 Solapur schema constraints.');
  }

  console.log('='.repeat(78));
}

runImporter().catch(err => {
  console.error('\n💥 Fatal Import Exception:', err);
  process.exit(1);
});
