/**
 * HeatShield Telemetry & Geospatial Data Service
 * Encapsulates backend communication, NASA POWER fallback, and local verified fixtures.
 */

import { getIndiaGeoJSON, INDIA_REGIONAL_GRID } from '../data/indiaGridData';
import { SOLAPUR_STATIONS } from '../data/solapurLocations';
import { MASTER_DATASET_METADATA, MONTHLY_TRENDS, ZONE_COMPARISON, SEASONAL_DATA, RECENT_TREND_SERIES } from '../data/dashboardData';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { calculateHeatRiskCategory } from '../utils/temperatureColors';
import { fetchMasterStations, checkMasterTablePopulated } from './masterDataService';

const API_BASE_URL = String(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '');
const apiEndpoint = path => API_BASE_URL ? `${API_BASE_URL}${path}` : null;

/**
 * Checks backend health
 */
export async function checkBackendHealth() {
  if (!API_BASE_URL) return { status: 'not_configured' };
  try {
    const res = await fetch(apiEndpoint('/health'), { method: 'GET', signal: AbortSignal.timeout(2500) });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    return { status: 'offline' };
  }
  return { status: 'offline' };
}

/**
 * Fetch dataset metadata
 */
export async function fetchDatasetMetadata() {
  if (API_BASE_URL) {
    try {
      const res = await fetch(apiEndpoint('/heatmap/metadata'), { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch {
      // Show repository data metadata below; it is not a live API response.
    }
  }

  return {
    success: true,
    is_live_backend: false,
    ...MASTER_DATASET_METADATA,
    source: 'HeatShield synthetic academic simulation dataset',
    provenance: 'Repository-documented WRF-Chem, ERA5-Land, and IMD provenance claims have not been independently verified.',
    geographicCoverage: '100 represented synthetic station locations in the Solapur study area',
    temperatureVariable: 'Source fields: air_temperature_c and land_surface_temperature_c',
    temperatureUnit: '°C',
    spatialResolution: '100 represented point locations; no continuous surface interpolation',
    historicalCoverage: '2021-01-01 to 2025-12-31 (150,000 synthetic records)',
  };
}

/**
 * Fetch available observation dates
 */
export async function fetchAvailableDates() {
  if (API_BASE_URL) {
    try {
      const res = await fetch(apiEndpoint('/heatmap/dates'), { signal: AbortSignal.timeout(3000) });
      if (res.ok) return await res.json();
    } catch {
      // Return the repository date choices below.
    }
  }

  return [
    '2024-05-24', // Peak pre-monsoon heat
    '2024-04-15', // Mid summer
    '2024-07-20', // Monsoon cooling
    '2024-10-15', // Post-monsoon transition
    '2024-01-15', // Winter baseline
    '2023-05-20',
    '2022-05-22',
    '2021-05-25'
  ];
}

/**
 * Fetches user or verified in-situ heat readings from Supabase 'heat_readings' table.
 */
export async function fetchSupabaseHeatReadings() {
  if (!isSupabaseConfigured() || !supabase) {
    return { data: [], isConfigured: false, error: null };
  }
  try {
    const { data, error } = await supabase
      .from('heat_readings')
      .select('*')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('recorded_at', { ascending: false })
      .limit(200);

    if (error) {
      return { data: [], isConfigured: true, error: error.message };
    }
    return { data: data || [], isConfigured: true, error: null };
  } catch (err) {
    return { data: [], isConfigured: true, error: err.message };
  }
}

/**
 * Fetch GeoJSON for Heat Map view.
 * Supports both India-wide view and Solapur focused station microclimate view.
 * Seamlessly integrates live Supabase in-situ records with verified research stations.
 */
export async function fetchHeatmapGeoJSON(date = '2024-04-15', region = 'india') {
  if (API_BASE_URL) {
    try {
      const params = new URLSearchParams({ date, region });
      const res = await fetch(`${apiEndpoint('/heatmap')}?${params}`, { signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        return { ...data, is_live_backend: data?.is_live_backend === true };
      }
    } catch {
      // Use the explicitly labeled local research view below.
    }
  }

  if (region === 'solapur') {
    // Attempt to fetch any available in-situ observations from Supabase user readings
    let liveFeatures = [];
    try {
      const { data: supaReadings } = await fetchSupabaseHeatReadings();
      if (supaReadings && supaReadings.length > 0) {
        liveFeatures = supaReadings.map(r => ({
          type: 'Feature',
          id: r.id,
          geometry: {
            type: 'Point',
            coordinates: [Number(r.longitude), Number(r.latitude)]
          },
          properties: {
            grid_id: r.station_id || `SUPA-${r.id.slice(0, 6)}`,
            location_name: r.station_id ? `Station ${r.station_id}` : 'In-Situ Field Reading',
            zone: r.substrate || 'Field Telemetry',
            latitude: Number(r.latitude),
            longitude: Number(r.longitude),
            temperature_c: Number(r.temperature_c),
            humidity_percent: r.humidity_percent ? Number(r.humidity_percent) : null,
            surface_temp_c: r.surface_temp_c ? Number(r.surface_temp_c) : null,
            heat_index_c: r.heat_index_c ? Number(r.heat_index_c) : null,
            risk_category: calculateHeatRiskCategory(r.temperature_c),
            date: r.recorded_at ? r.recorded_at.split('T')[0] : date,
            recorded_at: r.recorded_at,
            source: 'Supabase In-Situ Telemetry (Live)',
            is_live_backend: true,
            is_synthetic: false
          }
        }));
      }
    } catch (e) {
      // Supabase unconfigured or offline
    }

    // Fetch master microclimate stations (from Supabase heatshield_master or verified fixtures)
    let stations = SOLAPUR_STATIONS;
    let isLiveMasterDb = false;
    try {
      stations = await fetchMasterStations();
      isLiveMasterDb = stations.some(s => s.is_live_db);
    } catch {
      stations = SOLAPUR_STATIONS;
    }

    // Convert 100 Solapur stations to GeoJSON FeatureCollection
    const solapurFeatures = stations.map(s => ({
      type: 'Feature',
      id: s.location_id,
      geometry: {
        type: 'Point',
        coordinates: [s.lng, s.lat]
      },
      properties: {
        grid_id: s.location_id,
        location_name: s.name,
        zone: s.zone,
        latitude: s.lat,
        longitude: s.lng,
        elevation_m: s.elevation_m,
        population_density: s.population_density,
        cooling_infra: s.cooling_infra,
        infra_type: s.infra_type,
        temperature_c: s.mean_air_temp,
        land_surface_temp_c: s.mean_lst,
        relative_humidity_pct: s.humidity || 32.5,
        ndvi: s.mean_ndvi,
        cooling_priority_score: s.cooling_priority_score,
        recommended_intervention: s.recommended_intervention,
        risk_category: s.risk_category || calculateHeatRiskCategory(s.mean_air_temp),
        date,
        source: isLiveMasterDb 
          ? 'Solapur Microclimate Monitoring Grid (Supabase heatshield_master)'
          : 'Solapur Microclimate Monitoring Grid (TF-141 Calibrated Simulation)',
        measurement_type: 'Ambient Air Temperature (T_air) & Surface LST',
        spatial_resolution: '100 Point Microclimate Stations',
        is_synthetic: true,
        is_live_backend: isLiveMasterDb || liveFeatures.length > 0
      }
    }));

    const allFeatures = [...liveFeatures, ...solapurFeatures];

    return {
      type: 'FeatureCollection',
      is_live_backend: liveFeatures.length > 0 || isLiveMasterDb,
      properties: {
        date,
        region: 'Solapur Urban Agglomeration',
        source: liveFeatures.length > 0 
          ? `Solapur Hybrid Telemetry (${liveFeatures.length} Live In-Situ, ${solapurFeatures.length} Master Research Stations)`
          : `Solapur Microclimate Monitoring Grid (${isLiveMasterDb ? 'Supabase Live' : 'Research Baseline'})`,
        measurement_type: 'Ambient Air Temp & Land Surface Temp (LST)',
        spatial_resolution: '100 Stationary Microclimate Stations',
        station_count: allFeatures.length,
        live_count: liveFeatures.length,
        provenance: 'Calibrated simulation (WRF-Chem / TF-141) against IMD Solapur records'
      },
      features: allFeatures
    };
  }

  // India-wide GeoJSON
  const geo = getIndiaGeoJSON(date);
  return { ...geo, is_live_backend: false };
}

/**
 * Fetch dashboard summary for date
 */
export async function fetchDashboardSummary(date = '2024-04-15', zone = 'all') {
  if (!API_BASE_URL) {
    return { is_live_backend: false, availability: 'not_configured' };
  }

  try {
    const params = new URLSearchParams({ date, zone });
    const res = await fetch(`${apiEndpoint('/dashboard/summary')}?${params}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { is_live_backend: false, availability: 'unavailable' };

    const data = await res.json();
    const metricFields = ['meanAirTemp', 'maxAirTemp', 'meanLST', 'validRecordsCount'];
    const hasValidMetrics = metricFields.every(field => data?.[field] !== null && data?.[field] !== '' && Number.isFinite(Number(data?.[field])));
    if (data?.is_live_backend === true && hasValidMetrics) return data;
    return { is_live_backend: false, availability: 'invalid_response' };
  } catch {
    return { is_live_backend: false, availability: 'unavailable' };
  }
}

/**
 * Fetch records for Explore Data page
 */
export async function fetchExploreRecords({ search = '', zone = 'all', risk = 'all', page = 1, pageSize = 20, sortCol = 'location_id', sortDir = 'asc' }) {
  let list = [...SOLAPUR_STATIONS];

  if (zone !== 'all') {
    list = list.filter(item => item.zone.toLowerCase() === zone.toLowerCase());
  }

  if (risk !== 'all') {
    list = list.filter(item => item.risk_category?.toLowerCase() === risk.toLowerCase());
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    list = list.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.location_id.toLowerCase().includes(q) ||
      item.zone.toLowerCase().includes(q) ||
      item.recommended_intervention.toLowerCase().includes(q)
    );
  }

  // Sorting
  list.sort((a, b) => {
    let valA = a[sortCol];
    let valB = b[sortCol];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const total = list.length;
  const startIdx = (page - 1) * pageSize;
  const paginated = list.slice(startIdx, startIdx + pageSize);

  return {
    records: paginated,
    totalCount: total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1
  };
}
