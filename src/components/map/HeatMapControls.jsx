import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Focus, 
  Search, 
  Filter, 
  Thermometer,
  Layers
} from 'lucide-react';

export default function HeatMapControls({
  domain = 'solapur',
  onDomainChange,
  selectedLayer = 'air_temp',
  onLayerChange,
  riskFilter = 'all',
  onRiskFilterChange,
  searchQuery = '',
  onSearchChange,
  onResetView,
  onZoomIn,
  onZoomOut,
  isFullscreen = false,
  onToggleFullscreen,
  locationsCount = 0,
  showSearch = true,
  showRiskFilter = true
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isSolapur = domain === 'solapur';

  return (
    <div className="flex flex-col gap-2 pointer-events-none select-none">
      {/* Top Floating Glass HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white/90 dark:bg-[#161617]/90 backdrop-blur-xl p-2 rounded-2xl border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.06)] pointer-events-auto">
        
        {/* Territory Switcher (Pill Style) */}
        {onDomainChange && (
          <div className="flex items-center gap-1 bg-[#f5f5f7] dark:bg-black/30 p-1 rounded-full border border-black/[0.04]">
            <button
              type="button"
              onClick={() => onDomainChange('solapur')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                isSolapur
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Focus size={13} className={isSolapur ? 'text-[#0071e3]' : 'text-[#86868b]'} />
              <span>Solapur Grid</span>
              {isSolapur && locationsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#0071e3] text-white font-mono">
                  {locationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDomainChange('india')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                !isSolapur
                  ? 'bg-white text-[#1d1d1f] shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Compass size={13} className={!isSolapur ? 'text-[#0071e3]' : 'text-[#86868b]'} />
              <span>Pan-India</span>
            </button>
          </div>
        )}

        {/* Layer Selector */}
        {onLayerChange && (
          <div className="hidden sm:flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-full border border-black/[0.04]">
            <button
              type="button"
              onClick={() => onLayerChange('air_temp')}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                selectedLayer === 'air_temp'
                  ? 'bg-white text-[#1d1d1f] font-semibold shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              Air Temp
            </button>

            <button
              type="button"
              onClick={() => onLayerChange('surface_lst')}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                selectedLayer === 'surface_lst'
                  ? 'bg-white text-[#1d1d1f] font-semibold shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              Surface LST
            </button>

            <button
              type="button"
              onClick={() => onLayerChange('risk')}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                selectedLayer === 'risk'
                  ? 'bg-white text-[#1d1d1f] font-semibold shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              Risk Tiers
            </button>

            <button
              type="button"
              onClick={() => onLayerChange('cooling_score')}
              className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                selectedLayer === 'cooling_score'
                  ? 'bg-white text-[#1d1d1f] font-semibold shadow-sm'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              Cooling Priority
            </button>
          </div>
        )}

        {/* Search & Actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          {showSearch && onSearchChange && (
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#f5f5f7] rounded-full px-2.5 py-1 border border-black/[0.08] animate-in fade-in duration-150">
                  <Search size={13} className="text-[#86868b] mr-1.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search ward or station..."
                    className="bg-transparent text-xs text-[#1d1d1f] placeholder:text-[#86868b] outline-none w-32 sm:w-44"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-[#86868b] hover:text-[#1d1d1f] text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#6e6e73] hover:text-[#1d1d1f] flex items-center justify-center transition-colors"
                  title="Search stations"
                  aria-label="Search stations"
                >
                  <Search size={14} />
                </button>
              )}
            </div>
          )}

          {/* Zoom & View Controls */}
          <div className="flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-full border border-black/[0.04]">
            {onZoomIn && (
              <button
                type="button"
                onClick={onZoomIn}
                className="w-7 h-7 rounded-full bg-white hover:bg-[#fafafc] text-[#1d1d1f] flex items-center justify-center shadow-xs transition-colors"
                title="Zoom in"
                aria-label="Zoom in"
              >
                <Plus size={14} />
              </button>
            )}

            {onZoomOut && (
              <button
                type="button"
                onClick={onZoomOut}
                className="w-7 h-7 rounded-full bg-white hover:bg-[#fafafc] text-[#1d1d1f] flex items-center justify-center shadow-xs transition-colors"
                title="Zoom out"
                aria-label="Zoom out"
              >
                <Minus size={14} />
              </button>
            )}

            {onResetView && (
              <button
                type="button"
                onClick={onResetView}
                className="w-7 h-7 rounded-full bg-white hover:bg-[#fafafc] text-[#1d1d1f] flex items-center justify-center shadow-xs transition-colors"
                title="Reset map view"
                aria-label="Reset map view"
              >
                <RotateCcw size={13} />
              </button>
            )}

            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="w-7 h-7 rounded-full bg-white hover:bg-[#fafafc] text-[#1d1d1f] flex items-center justify-center shadow-xs transition-colors"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen map"}
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen map"}
              >
                {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
