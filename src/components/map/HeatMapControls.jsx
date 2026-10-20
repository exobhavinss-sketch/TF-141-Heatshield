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
      {/* Top HUD Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-surface-container-low/95 backdrop-blur-md p-1.5 rounded-xl border border-outline-variant/40 shadow-md pointer-events-auto">
        
        {/* Territory / Domain Switcher */}
        {onDomainChange && (
          <div className="flex items-center gap-1 bg-surface-container-high/60 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onDomainChange('solapur')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSolapur
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <Focus size={13} className={isSolapur ? 'text-secondary-fixed' : 'text-outline'} />
              <span>Solapur High-Res</span>
              {isSolapur && locationsCount > 0 && (
                <span className="text-[10px] px-1 py-0.2 rounded bg-primary text-on-primary">
                  {locationsCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => onDomainChange('india')}
              className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                !isSolapur
                  ? 'bg-primary-container text-on-primary-container shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <Compass size={13} className={!isSolapur ? 'text-secondary-fixed' : 'text-outline'} />
              <span>Pan-India Grid</span>
            </button>
          </div>
        )}

        {/* Layer Selector */}
        {onLayerChange && (
          <div className="hidden sm:flex items-center gap-1 bg-surface-container-high/60 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onLayerChange('air_temp')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedLayer === 'air_temp'
                  ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Air Temp
            </button>

            <button
              type="button"
              onClick={() => onLayerChange('surface_lst')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedLayer === 'surface_lst'
                  ? 'bg-surface-container-lowest text-tertiary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Surface LST
            </button>

            {isSolapur && (
              <button
                type="button"
                onClick={() => onLayerChange('cooling_score')}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  selectedLayer === 'cooling_score'
                    ? 'bg-surface-container-lowest text-secondary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Cooling Priority
              </button>
            )}

            <button
              type="button"
              onClick={() => onLayerChange('risk')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedLayer === 'risk'
                  ? 'bg-surface-container-lowest text-error font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Risk Tiers
            </button>
          </div>
        )}

        {/* Filter and Search Section */}
        <div className="flex items-center gap-1.5">
          {/* Risk Filter Dropdown */}
          {showRiskFilter && onRiskFilterChange && (
            <div className="flex items-center gap-1 bg-surface-container-high/60 px-2 py-1 rounded-lg text-xs">
              <Filter size={12} className="text-outline" />
              <select
                value={riskFilter}
                onChange={(e) => onRiskFilterChange(e.target.value)}
                className="bg-transparent text-xs text-on-surface font-medium focus:outline-none cursor-pointer"
                aria-label="Filter markers by heat-risk category"
              >
                <option value="all">All Risk Levels</option>
                <option value="low">Low Risk (&lt;30°)</option>
                <option value="moderate">Moderate (30-35°)</option>
                <option value="high">High (35-40°)</option>
                <option value="very high">Very High (≥40°)</option>
              </select>
            </div>
          )}

          {/* Quick Location Search */}
          {showSearch && onSearchChange && (
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-surface-container-lowest border border-outline-variant/40 rounded-lg px-2 py-1 shadow-sm">
                  <Search size={12} className="text-outline mr-1.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search station or ward..."
                    className="w-32 sm:w-44 text-xs bg-transparent focus:outline-none text-on-surface"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onSearchChange('');
                      setIsSearchOpen(false);
                    }}
                    className="text-outline hover:text-on-surface text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 rounded-lg bg-surface-container-high/60 hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Search Stations"
                >
                  <Search size={14} />
                </button>
              )}
            </div>
          )}

          {/* Reset Camera View */}
          {onResetView && (
            <button
              type="button"
              onClick={onResetView}
              title="Reset Map View"
              className="p-1.5 rounded-lg bg-surface-container-high/60 hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
            >
              <RotateCcw size={14} />
            </button>
          )}

          {/* Fullscreen Toggle */}
          {onToggleFullscreen && (
            <button
              type="button"
              onClick={onToggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-1.5 rounded-lg bg-surface-container-high/60 hover:bg-surface-container text-on-surface-variant hover:text-primary transition-colors"
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Floating Zoom Buttons (Bottom or side) */}
      {(onZoomIn || onZoomOut) && (
        <div className="self-end flex flex-col gap-1 bg-surface-container-low/95 backdrop-blur-md p-1 rounded-lg border border-outline-variant/40 shadow-md pointer-events-auto">
          {onZoomIn && (
            <button
              type="button"
              onClick={onZoomIn}
              className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <Plus size={15} />
            </button>
          )}
          {onZoomOut && (
            <button
              type="button"
              onClick={onZoomOut}
              className="p-1.5 rounded hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <Minus size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
