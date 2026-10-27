import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers } from 'lucide-react';

const RISK_TIERS = [
  { label: 'Low visual tier', name: '< 30°C', color: '#10b981' },
  { label: 'Moderate visual tier', name: '30°C – 35°C', color: '#facc15' },
  { label: 'High visual tier', name: '35°C – 40°C', color: '#f97316' },
  { label: 'Very high visual tier', name: '≥ 40°C', color: '#ef4444' },
];

const COOLING_TIERS = [
  { label: 'Higher displayed score', name: 'Score > 65', color: '#dc2626' },
  { label: 'Displayed score', name: 'Score 45–65', color: '#ea580c' },
  { label: 'Displayed score', name: 'Score 25–45', color: '#d97706' },
  { label: 'Lower displayed score', name: 'Score < 25', color: '#059669' },
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
    <div className="bg-white/90 dark:bg-[#161617]/90 backdrop-blur-xl rounded-[20px] border border-black/[0.08] shadow-[0_8px_24px_rgba(0,0,0,0.06)] text-xs max-w-xs transition-all pointer-events-auto overflow-hidden">
      {/* Header with Collapse Toggle */}
      <div 
        className="flex items-center justify-between p-3.5 cursor-pointer select-none border-b border-black/[0.05]"
        onClick={() => collapsible && setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Layers size={14} className="text-[#0071e3]" />
          <span className="font-semibold text-[#1d1d1f] text-[12px] tracking-tight">
            {isCoolingLayer 
              ? 'Cooling Priority Index' 
              : (isRiskLayer ? 'Heat Risk Classification' : 'Temperature display bands')}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[10px] text-[#86868b]">
            {isCoolingLayer ? '0–100' : (isRiskLayer ? 'Tiers' : '°C')}
          </span>
          {collapsible && (
            <button 
              type="button" 
              className="text-[#86868b] hover:text-[#1d1d1f] transition-colors p-0.5"
              aria-label={isCollapsed ? "Expand legend" : "Collapse legend"}
            >
              {isCollapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-3.5 pt-2.5">
          {/* Tiers List */}
          <div className="flex flex-col gap-1.5">
            {isCoolingLayer && <p className="text-[10px] leading-snug text-[#6e6e73]">Application score bands only; not validated municipal priorities or measured intervention effects.</p>}
            {isCoolingLayer && (
              COOLING_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center justify-between gap-2 py-1 px-1.5 rounded-lg hover:bg-black/[0.03] cursor-default transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="font-medium text-[#1d1d1f] text-[12px]">
                      {tier.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#86868b] font-mono">
                    {tier.name}
                  </span>
                </div>
              ))
            )}

            {isRiskLayer && (
              <>
              <p className="text-[10px] leading-snug text-[#6e6e73]">Application-derived temperature buckets; not source-encoded master labels, validated health-risk classes, or official warnings.</p>
              {RISK_TIERS.map((tier) => (
                <div
                  key={tier.label}
                  className="flex items-center justify-between gap-2 py-1 px-1.5 rounded-lg hover:bg-black/[0.03] cursor-default transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span className="font-medium text-[#1d1d1f] text-[12px]">
                      {tier.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#86868b] font-mono">
                    {tier.name}
                  </span>
                </div>
              ))}
              </>
            )}

            {!isCoolingLayer && !isRiskLayer && (
              <div className="flex flex-col gap-2 pt-1">
                <div className="h-2.5 w-full rounded-full bg-gradient-to-r from-[#059669] via-[#d97706] to-[#dc2626] shadow-xs" />
                <div className="flex justify-between items-center text-[10px] font-mono text-[#86868b]">
                  <span>&lt; 15°C</span>
                  <span>30°C</span>
                  <span>35°C+</span>
                </div>
                <p className="text-[10px] leading-snug text-[#6e6e73]">Color bands are visual guides only; they are not validated health-risk categories or official warnings.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
