import React from 'react';
import { 
  getHeatRiskBadge, 
  getZoneBadge, 
  calculateHeatRiskCategory 
} from '../../utils/temperatureColors';
import { Thermometer, Droplets, Sparkles } from 'lucide-react';

function formatField(value, suffix = '') {
  if (value === null || value === undefined || value === '' || Number.isNaN(value)) {
    return 'Not available';
  }
  return `${value}${suffix}`;
}

export default function HeatMapPopup({ data, properties }) {
  const props = properties || data || {};

  if (props.is_edadv_summary) {
    const rows = [
      ['Air temperature mean', props.air_temperature_c_mean, ' °C'],
      ['Relative humidity mean', props.relative_humidity_pct_mean, ' %'],
      ['Land surface temperature mean', props.land_surface_temperature_c_mean, ' °C'],
      ['NDVI mean', props.ndvi_mean, ''],
      ['NDBI mean', props.ndbi_mean, ''],
    ];
    return (
      <div className="p-4 flex flex-col gap-2 max-w-[280px] text-xs font-sans select-text text-[#1d1d1f] dark:text-[#f5f5f7]">
        <span className="font-mono text-[10px] text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">{props.location_id}</span>
        <strong className="text-sm text-[#1d1d1f] dark:text-[#f5f5f7]">{props.zone_type} · station summary</strong>
        <p className="text-[10px] text-amber-800 dark:text-amber-300">Synthetic academic simulation mean; not a verified sensor reading.</p>
        {rows.map(([label, value, unit]) => (
          <div key={label} className="flex justify-between gap-3 text-[#6e6e73] dark:text-[#a5a9b4]">
            <span>{label}</span>
            <b className="text-[#1d1d1f] dark:text-[#f5f5f7]">{formatField(value, unit)}</b>
          </div>
        ))}
        <div className="flex justify-between gap-3 text-[#6e6e73] dark:text-[#a5a9b4]">
          <span>Observations summarized</span>
          <b className="text-[#1d1d1f] dark:text-[#f5f5f7]">{formatField(props.observation_count)}</b>
        </div>
        <div className="text-[10px] text-[#86868b] dark:text-[#7a7f8d] font-mono">{Number(props.latitude).toFixed(4)}° N, {Number(props.longitude).toFixed(4)}° E</div>
      </div>
    );
  }

  const locationName = props.location_name || props.name || props.station_id || 'Solapur Monitoring Site';
  const stationCode = props.grid_id || props.location_id || props.station_id || 'STN-NODE';
  const zone = props.zone || props.zone_type || null;
  
  // Readings
  const airTemp = props.temperature_c ?? props.air_temperature_c ?? props.mean_air_temp;
  const surfaceTemp = props.surface_temp_c ?? props.land_surface_temp_c ?? props.mean_lst;
  const humidity = props.humidity_percent ?? props.relative_humidity_pct;
  
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

  // Provenance flag
  const isSynthetic = props.is_synthetic !== false && (props.is_live_backend !== true && !props.user_id);

  return (
    <div className="p-4 flex flex-col gap-3 max-w-[300px] text-xs font-sans select-text text-[#1d1d1f] dark:text-[#f5f5f7]">
      {/* Header & Station Badge */}
      <div className="flex flex-col border-b border-black/[0.06] dark:border-white/[0.08] pb-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider font-semibold">
            {stationCode}
          </span>
          {riskCategory && (
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${riskBadge.dot}`} />
              {riskCategory}
            </span>
          )}
        </div>

        <h4 className="font-semibold text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] mt-1 tracking-tight leading-snug">
          {locationName}
        </h4>

        <div className="flex flex-wrap items-center gap-1.5 mt-2">
          {zone && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${zoneBadgeClass}`}>
              {zone}
            </span>
          )}
          {substrate && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/[0.04] dark:bg-white/[0.08] text-[#6e6e73] dark:text-[#a5a9b4] font-mono">
              {substrate}
            </span>
          )}
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 bg-[#f5f5f7] dark:bg-[#22252b] p-2.5 rounded-xl border border-black/[0.03] dark:border-white/[0.06]">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4] font-medium flex items-center gap-1">
            <Thermometer size={11} className="text-[#0071e3] dark:text-[#2997ff]" />
            Air Temp
          </span>
          <span className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums mt-0.5">
            {formatField(airTemp, '°C')}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4] font-medium">
            Surface LST
          </span>
          <span className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums mt-0.5">
            {formatField(surfaceTemp, '°C')}
          </span>
        </div>

        {humidity !== undefined && (
          <div className="flex flex-col pt-1 border-t border-black/[0.04] dark:border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4] font-medium flex items-center gap-1">
              <Droplets size={11} className="text-[#059669] dark:text-[#10b981]" />
              Humidity
            </span>
            <span className="text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums mt-0.5">
              {formatField(humidity, '%')}
            </span>
          </div>
        )}

        {coolingPriority !== undefined && (
          <div className="flex flex-col pt-1 border-t border-black/[0.04] dark:border-white/[0.06]">
            <span className="text-[10px] uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4] font-medium">
              Cooling Score
            </span>
            <span className="text-[13px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums mt-0.5">
              {formatField(coolingPriority, '/100')}
            </span>
          </div>
        )}
      </div>

      {/* Recommended Intervention */}
      {intervention && (
        <div className="flex items-start gap-1.5 p-2 rounded-xl bg-[#0071e3]/5 dark:bg-[#2997ff]/10 border border-[#0071e3]/15 dark:border-[#2997ff]/25 text-[#0071e3] dark:text-[#2997ff]">
          <Sparkles size={13} className="shrink-0 mt-0.5" />
          <span className="text-[11px] leading-tight font-medium">
            {intervention}
          </span>
        </div>
      )}

      {/* Geospatial Coordinates & Truthful Attribution */}
      <div className="flex items-center justify-between text-[10px] text-[#86868b] dark:text-[#7a7f8d] font-mono pt-1 border-t border-black/[0.04] dark:border-white/[0.06]">
        <span>
          {lat !== undefined && lng !== undefined ? `${Number(lat).toFixed(4)}°, ${Number(lng).toFixed(4)}°` : 'Solapur, MH'}
        </span>
        <span>
          {isSynthetic ? 'Academic Sim' : 'Live Data'}
        </span>
      </div>
    </div>
  );
}
