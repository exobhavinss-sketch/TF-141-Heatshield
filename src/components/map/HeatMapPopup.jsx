import React from 'react';
import { 
  getHeatRiskBadge, 
  getZoneBadge, 
  calculateHeatRiskCategory 
} from '../../utils/temperatureColors';
import { Thermometer, Droplets, MapPin, Sparkles, Clock, Database, ShieldAlert } from 'lucide-react';

/**
 * Helper to display values or fallback to "Not available"
 */
function formatField(value, suffix = '') {
  if (value === null || value === undefined || value === '' || Number.isNaN(value)) {
    return 'Not available';
  }
  return `${value}${suffix}`;
}

/**
 * HeatMapPopup — Clean, academic inspection popup for Leaflet markers.
 * Strictly adheres to research data provenance and truthful representation.
 */
export default function HeatMapPopup({ data, properties }) {
  // Support both raw record and GeoJSON feature.properties
  const props = properties || data || {};

  const locationName = props.location_name || props.name || props.station_id || 'Solapur Monitoring Site';
  const stationCode = props.grid_id || props.location_id || props.station_id || 'STN-NODE';
  const zone = props.zone || props.zone_type || null;
  const state = props.state || 'Maharashtra';
  
  // Readings
  const airTemp = props.temperature_c ?? props.air_temperature_c ?? props.mean_air_temp;
  const surfaceTemp = props.surface_temp_c ?? props.land_surface_temp_c ?? props.mean_lst;
  const humidity = props.humidity_percent ?? props.relative_humidity_pct;
  const heatIndex = props.heat_index_c;
  
  // Categorization
  const riskCategory = props.risk_category || props.heat_risk_category || (airTemp !== undefined ? calculateHeatRiskCategory(airTemp) : null);
  const riskBadge = getHeatRiskBadge(riskCategory);
  const zoneBadgeClass = getZoneBadge(zone);

  // Intervention & Environmental
  const coolingPriority = props.cooling_priority_score;
  const intervention = props.recommended_intervention;
  const substrate = props.substrate;

  // Geographic metadata
  const lat = props.latitude ?? props.lat;
  const lng = props.longitude ?? props.lng;
  const elevation = props.elevation_m;

  // Temporal
  const recordedAt = props.recorded_at || props.observation_datetime || props.date;
  const formattedTime = recordedAt 
    ? new Date(recordedAt).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      })
    : 'Not available';

  // Provenance flag: distinguish live Supabase telemetry from synthetic academic simulation
  const isSynthetic = props.is_synthetic !== false && (props.is_live_backend !== true && !props.user_id);
  const sourceName = props.source || (props.user_id ? 'Supabase In-Situ Telemetry' : 'Solapur Microclimate Grid (TF-141)');

  return (
    <div className="p-3.5 flex flex-col gap-2.5 max-w-[290px] text-xs font-sans select-text">
      {/* Header & Station Badge */}
      <div className="flex flex-col border-b border-outline-variant/30 pb-2">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-primary uppercase tracking-wider font-semibold">
            {stationCode}
          </span>
          {riskCategory && (
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dot}`} />
              {riskCategory} Risk
            </span>
          )}
        </div>

        <h4 className="font-headline font-bold text-sm text-on-surface mt-1 leading-snug">
          {locationName}
        </h4>

        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {zone && (
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${zoneBadgeClass}`}>
              {zone}
            </span>
          )}
          {substrate && (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-surface-container text-on-surface-variant font-mono">
              {substrate}
            </span>
          )}
        </div>
      </div>

      {/* Primary Observations Grid */}
      <div className="grid grid-cols-2 gap-2 bg-surface-container-lowest/90 p-2.5 rounded-lg border border-outline-variant/30 shadow-sm">
        {/* Air Temp */}
        <div className="flex flex-col">
          <span className="text-[10px] text-outline uppercase font-mono flex items-center gap-1">
            <Thermometer size={11} className="text-primary" />
            Air Temp
          </span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="font-headline font-bold text-base text-primary">
              {formatField(airTemp, '°')}
            </span>
            {airTemp !== undefined && airTemp !== null && (
              <span className="text-[10px] text-on-surface-variant">C</span>
            )}
          </div>
        </div>

        {/* Surface LST */}
        <div className="flex flex-col">
          <span className="text-[10px] text-outline uppercase font-mono flex items-center gap-1">
            <Thermometer size={11} className="text-tertiary" />
            Surface LST
          </span>
          <div className="flex items-baseline gap-0.5 mt-0.5">
            <span className="font-headline font-bold text-base text-tertiary">
              {formatField(surfaceTemp, '°')}
            </span>
            {surfaceTemp !== undefined && surfaceTemp !== null && (
              <span className="text-[10px] text-on-surface-variant">C</span>
            )}
          </div>
        </div>

        {/* Humidity */}
        <div className="flex flex-col mt-1 pt-1.5 border-t border-outline-variant/20">
          <span className="text-[10px] text-outline uppercase font-mono flex items-center gap-1">
            <Droplets size={11} className="text-secondary" />
            Humidity
          </span>
          <span className="font-label-metric text-xs text-on-surface font-semibold mt-0.5">
            {formatField(humidity, '%')}
          </span>
        </div>

        {/* Heat Index / Cooling Score */}
        <div className="flex flex-col mt-1 pt-1.5 border-t border-outline-variant/20">
          <span className="text-[10px] text-outline uppercase font-mono flex items-center gap-1">
            <Sparkles size={11} className="text-secondary" />
            {coolingPriority !== undefined ? 'Cooling Score' : 'Heat Index'}
          </span>
          <span className="font-label-metric text-xs text-on-surface font-semibold mt-0.5">
            {coolingPriority !== undefined 
              ? formatField(coolingPriority, '/100')
              : formatField(heatIndex, '°C')}
          </span>
        </div>
      </div>

      {/* Intervention Recommendations if present */}
      {intervention && (
        <div className="flex flex-col gap-0.5 bg-surface-container/70 p-2 rounded border border-outline-variant/20">
          <span className="text-[10px] font-semibold text-secondary uppercase tracking-tight flex items-center gap-1">
            <Sparkles size={10} />
            Recommended Intervention
          </span>
          <p className="text-[11px] text-on-surface leading-tight mt-0.5">
            {intervention}
          </p>
        </div>
      )}

      {/* Coordinates and Timestamp */}
      <div className="flex flex-col gap-1 text-[10px] text-outline pt-1.5 border-t border-outline-variant/20 font-mono">
        {lat !== undefined && lng !== undefined && (
          <div className="flex items-center gap-1">
            <MapPin size={11} className="text-secondary shrink-0" />
            <span>{Number(lat).toFixed(4)}°N, {Number(lng).toFixed(4)}°E</span>
            {elevation && <span> · {elevation}m MSL</span>}
          </div>
        )}
        <div className="flex items-center gap-1 text-outline/90">
          <Clock size={11} className="shrink-0" />
          <span>Observed: {formattedTime}</span>
        </div>
      </div>

      {/* Strict Provenance & Simulation Labeling */}
      <div className={`p-1.5 rounded flex items-center gap-1.5 text-[9px] font-mono leading-tight ${
        isSynthetic 
          ? 'bg-surface-container text-on-surface-variant border border-outline-variant/30'
          : 'bg-primary/10 text-primary border border-primary/20'
      }`}>
        <Database size={10} className="shrink-0" />
        <div>
          <span className="font-semibold block">
            {isSynthetic ? 'Academic Simulation Data' : 'Live Supabase Observation'}
          </span>
          <span className="text-outline text-[8px]">
            {sourceName}
          </span>
        </div>
      </div>
    </div>
  );
}
