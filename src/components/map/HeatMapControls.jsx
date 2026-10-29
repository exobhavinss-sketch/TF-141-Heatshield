import React, { useState } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Compass, 
  Focus, 
  Search
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
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white/95 dark:bg-[#191b20]/95 backdrop-blur-xl p-2 rounded-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)] pointer-events-auto transition-colors">
        
        {/* Territory Switcher (Pill Style) */}
        {onDomainChange && (
          <div className="flex items-center gap-1 bg-[#f5f5f7] dark:bg-[#22252b] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
            <button
              type="button"
              onClick={() => onDomainChange('solapur')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                isSolapur
                  ? 'bg-white dark:bg-[#191b20] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm'
                  : 'text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
              }`}
            >
              <Focus size={13} className={isSolapur ? 'text-[#0071e3] dark:text-[#2997ff]' : 'text-[#86868b] dark:text-[#a5a9b4]'} />
              <span>Solapur Grid</span>
              {isSolapur && locationsCount > 0 && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#0071e3] dark:bg-[#2997ff] text-white font-mono">
                  {locationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDomainChange('india')}
              className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all ${
                !isSolapur
                  ? 'bg-white dark:bg-[#191b20] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm'
                  : 'text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
              }`}
            >
              <Compass size={13} className={!isSolapur ? 'text-[#0071e3] dark:text-[#2997ff]' : 'text-[#86868b] dark:text-[#a5a9b4]'} />
              <span>Pan-India</span>
            </button>
          </div>
        )}

        {/* Layer Selector */}
        {onLayerChange && (
          <div className="hidden sm:flex items-center gap-1 bg-[#f5f5f7] dark:bg-[#22252b] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
            {[
              { id: 'air_temp', label: 'Air Temp' },
              { id: 'surface_lst', label: 'Surface LST' },
              { id: 'risk', label: 'Risk Tiers' },
              { id: 'cooling_score', label: 'Cooling Priority' },
            ].map((layer) => (
              <button
                key={layer.id}
                type="button"
                onClick={() => onLayerChange(layer.id)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                  selectedLayer === layer.id
                    ? 'bg-white dark:bg-[#191b20] text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold shadow-sm'
                    : 'text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>
        )}

        {/* Search & Actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          {showSearch && onSearchChange && (
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-[#f5f5f7] dark:bg-[#22252b] rounded-full px-2.5 py-1 border border-black/[0.08] dark:border-white/[0.1] animate-in fade-in duration-150">
                  <Search size={13} className="text-[#86868b] dark:text-[#a5a9b4] mr-1.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search ward or station..."
                    className="bg-transparent text-xs text-[#1d1d1f] dark:text-[#f5f5f7] placeholder:text-[#86868b] dark:placeholder:text-[#a5a9b4] outline-none w-32 sm:w-44"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      onSearchChange('');
                    }}
                    className="text-[#86868b] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-[#22252b] hover:bg-[#e8e8ed] dark:hover:bg-[#2e323b] text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] flex items-center justify-center transition-colors"
                  title="Search stations"
                  aria-label="Search stations"
                >
                  <Search size={14} />
                </button>
              )}
            </div>
          )}

          {/* Zoom & View Controls */}
          <div className="flex items-center gap-1 bg-[#f5f5f7] dark:bg-[#22252b] p-1 rounded-full border border-black/[0.04] dark:border-white/[0.06]">
            {onZoomIn && (
              <button
                type="button"
                onClick={onZoomIn}
                className="w-7 h-7 rounded-full bg-white dark:bg-[#191b20] hover:bg-[#fafafc] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center shadow-xs transition-colors"
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
                className="w-7 h-7 rounded-full bg-white dark:bg-[#191b20] hover:bg-[#fafafc] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center shadow-xs transition-colors"
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
                className="w-7 h-7 rounded-full bg-white dark:bg-[#191b20] hover:bg-[#fafafc] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center shadow-xs transition-colors"
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
                className="w-7 h-7 rounded-full bg-white dark:bg-[#191b20] hover:bg-[#fafafc] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center justify-center shadow-xs transition-colors"
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
