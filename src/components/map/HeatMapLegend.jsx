import React, { useState } from 'react';
import { DEFAULT_THRESHOLDS, MISSING_DATA_COLOR } from '../../utils/temperatureColors';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

const RISK_TIERS = [
  { label: 'Low Risk', name: '< 30°C', color: '#10b981', desc: 'Baseline microclimate comfort' },
  { label: 'Moderate Risk', name: '30°C – 35°C', color: '#facc15', desc: 'Mild urban thermal stress' },
  { label: 'High Risk', name: '35°C – 40°C', color: '#f97316', desc: 'Elevated urban heat island' },
  { label: 'Very High Risk', name: '≥ 40°C', color: '#ef4444', desc: 'Severe thermal exposure pocket' },
];

const COOLING_TIERS = [
  { label: 'Priority 1 (Critical)', name: 'Score > 65', color: '#ef4444', desc: 'Urgent cool-roof / canopy intervention' },
  { label: 'Priority 2 (High)', name: 'Score 45–65', color: '#f97316', desc: 'Pocket parks / reflective pavers' },
  { label: 'Priority 3 (Moderate)', name: 'Score 25–45', color: '#facc15', desc: 'Routine street greening' },
  { label: 'Priority 4 (Low)', name: 'Score < 25', color: '#10b981', desc: 'Existing canopy / water buffer' },
];

export default function HeatMapLegend({ 
  selectedLayer = 'air_temp',
  activeRange = null,
  onSelectRange = null,
  collapsible = true 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isCoolingLayer = selectedLayer === 'cooling_score';
  const isRiskLayer = selectedLayer === 'risk';

  return (
    <div className="bg-surface-container-low/95 backdrop-blur-md rounded-xl border border-outline-variant/40 shadow-lg text-xs max-w-xs transition-all pointer-events-auto">
      {/* Header with Collapse Toggle */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer select-none border-b border-outline-variant/30"
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-1.5">
          <Layers size={13} className="text-secondary" />
          <span className="font-headline font-semibold text-on-surface uppercase text-[11px] tracking-wider">
            {isCoolingLayer 
              ? 'Cooling Priority Index' 
              : (isRiskLayer ? 'Heat Risk Classification' : 'Observation Scale')}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span className="font-mono text-[10px] text-outline">
            {isCoolingLayer ? '0–100' : (isRiskLayer ? 'Tiers' : '°C')}
          </span>
          {collapsible && (
            <button 
              type="button" 
              className="text-outline hover:text-on-surface transition-colors p-0.5"
              aria-label={isCollapsed ? "Expand legend" : "Collapse legend"}
            >
              {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-3 pt-2">
          {/* Tiers List */}
          <div className="flex flex-col gap-1.5">
            {isCoolingLayer && (
              COOLING_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center justify-between gap-2 py-0.5 px-1 rounded hover:bg-surface-container cursor-default transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-sm shadow-sm shrink-0 border border-black/20"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="font-medium text-on-surface text-xs">
                      {tier.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    {tier.name}
                  </span>
                </div>
              ))
            )}

            {isRiskLayer && (
              RISK_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center justify-between gap-2 py-0.5 px-1 rounded hover:bg-surface-container cursor-default transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-sm shadow-sm shrink-0 border border-black/20"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="font-medium text-on-surface text-xs">
                      {tier.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    {tier.name}
                  </span>
                </div>
              ))
            )}

            {!isCoolingLayer && !isRiskLayer && (
              DEFAULT_THRESHOLDS.map((tier) => (
                <div
                  key={tier.label}
                  onClick={() => onSelectRange && onSelectRange(tier)}
                  className={`flex items-center justify-between gap-2 py-0.5 px-1 rounded hover:bg-surface-container transition-colors ${
                    onSelectRange ? 'cursor-pointer' : 'cursor-default'
                  } ${activeRange === tier.label ? 'bg-surface-container ring-1 ring-secondary' : ''}`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3.5 h-3.5 rounded-sm shadow-sm shrink-0 border border-black/20"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="font-medium text-on-surface text-xs">
                      {tier.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant font-mono">
                    {tier.name}
                  </span>
                </div>
              ))
            )}

            {/* Missing Data indicator */}
            <div className="flex items-center justify-between gap-2 py-0.5 px-1 rounded hover:bg-surface-container cursor-default border-t border-outline-variant/20 pt-1.5 mt-0.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-sm shrink-0 border border-black/20"
                  style={{ backgroundColor: MISSING_DATA_COLOR }}
                />
                <span className="font-medium text-outline text-xs">
                  Missing / No Data
                </span>
              </div>
              <span className="text-[10px] text-outline italic font-mono">
                Unrecorded
              </span>
            </div>
          </div>

          <div className="mt-2.5 pt-2 border-t border-outline-variant/30 text-[10px] text-outline leading-tight font-sans">
            Solapur Urban Heat Exposure Analysis (TF-141) • Academic Research Tiers.
          </div>
        </div>
      )}
    </div>
  );
}
