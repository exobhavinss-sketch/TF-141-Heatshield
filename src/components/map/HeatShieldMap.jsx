import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import HeatMapMarkers from './HeatMapMarkers';
import HeatMapLegend from './HeatMapLegend';
import HeatMapControls from './HeatMapControls';
import HeatMapIntensityLayer from './HeatMapIntensityLayer';
import MapLoadingState from './MapLoadingState';
import MapErrorState from './MapErrorState';
import { Flame } from 'lucide-react';

// Solapur Municipal Center Coordinate
const SOLAPUR_DEFAULT_CENTER = [17.6599, 75.9064];
const INDIA_DEFAULT_CENTER = [22.5, 79.0];

/**
 * Controller component inside MapContainer to manage smooth view changes
 * and handle automatic container invalidation / resizing.
 */
function MapViewController({ center, zoom, containerRef }) {
  const map = useMap();

  // Smoothly pan and zoom when center or zoom coordinates update
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, zoom || map.getZoom(), {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [center, zoom, map]);

  // Robust container resize observer to prevent gray tile rendering bugs
  useEffect(() => {
    // Initial size invalidation
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener('resize', handleResize);

    let observer = null;
    if (containerRef?.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        map.invalidateSize();
      });
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, [map, containerRef]);

  return null;
}

/**
 * HeatShieldMap — Core Reusable Leaflet GIS Map Component
 */
export default function HeatShieldMap({
  center,
  zoom,
  domain = 'solapur',
  onDomainChange,
  markers = [],
  selectedLayer = 'air_temp',
  onLayerChange,
  selectedLocationId = null,
  onSelectLocation,
  isLoading = false,
  error = null,
  onRetry,
  height = '100%',
  className = '',
  showControls = true,
  showLegend = true,
  showIntensityToggle = true,
  tileProvider = 'osm', // 'osm' | 'cartoDark'
  activeDate,
  provenanceLabel,
  children
}) {
  const containerRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [showIntensity, setShowIntensity] = useState(false);

  const isSolapur = domain === 'solapur';
  const effectiveCenter = center || (isSolapur ? SOLAPUR_DEFAULT_CENTER : INDIA_DEFAULT_CENTER);
  const effectiveZoom = zoom || (isSolapur ? 13 : 5);

  // Filter markers by search query if specified
  const filteredMarkers = React.useMemo(() => {
    if (!Array.isArray(markers)) return [];
    if (!searchQuery || !searchQuery.trim()) return markers;

    const q = searchQuery.toLowerCase().trim();
    return markers.filter((item) => {
      const props = item.properties || item;
      const name = props.location_name || props.name || '';
      const code = props.grid_id || props.location_id || props.station_id || '';
      const zone = props.zone || props.zone_type || '';
      return (
        name.toLowerCase().includes(q) ||
        code.toLowerCase().includes(q) ||
        zone.toLowerCase().includes(q)
      );
    });
  }, [markers, searchQuery]);

  const handleResetView = () => {
    if (onDomainChange) {
      onDomainChange(domain);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-[#f5f5f7] dark:bg-[#101114] transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-[2000] rounded-none border-none h-screen'
          : `rounded-[28px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] ${className}`
      }`}
      style={!isFullscreen ? { height, minHeight: '480px' } : undefined}
    >
      {/* Top Map HUD Controls */}
      {showControls && (
        <div className="absolute top-3 left-3 right-3 z-[1000] pointer-events-none">
          <HeatMapControls
            domain={domain}
            onDomainChange={onDomainChange}
            selectedLayer={selectedLayer}
            onLayerChange={onLayerChange}
            riskFilter={riskFilter}
            onRiskFilterChange={setRiskFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onResetView={handleResetView}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            locationsCount={filteredMarkers.length}
          />
        </div>
      )}

      {/* Optional Heat Intensity Diffusion Layer Toggle */}
      {showIntensityToggle && (
        <div className="absolute top-16 right-3 z-[1000] pointer-events-auto">
          <button
            type="button"
            onClick={() => setShowIntensity(!showIntensity)}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 backdrop-blur-xl border shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all ${
              showIntensity
                ? 'bg-[#ea580c] text-white border-transparent'
                : 'bg-white/90 dark:bg-[#191b20]/90 text-[#6e6e73] dark:text-[#a5a9b4] border-black/[0.08] dark:border-white/[0.1] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
            }`}
            title="Toggle Interpolated Thermal Diffusion Plumes"
          >
            <Flame size={13} className={showIntensity ? 'text-white animate-pulse' : 'text-[#86868b] dark:text-[#a5a9b4]'} />
            <span className="hidden sm:inline">Thermal Intensity</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              showIntensity ? 'bg-white/20 text-white' : 'bg-black/[0.04] dark:bg-white/[0.08] text-[#1d1d1f] dark:text-[#f5f5f7]'
            }`}>
              {showIntensity ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>
      )}

      {/* Leaflet Map Stage */}
      <MapContainer
        center={effectiveCenter}
        zoom={effectiveZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full z-0"
      >
        <MapViewController
          center={effectiveCenter}
          zoom={effectiveZoom}
          containerRef={containerRef}
        />

        {/* Tile Provider Layer */}
        {tileProvider === 'osm' ? (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            subdomains="abcd"
            maxZoom={19}
          />
        )}

        {/* Optional Heat Intensity Thermal Diffusion */}
        {showIntensity && (
          <HeatMapIntensityLayer
            items={filteredMarkers}
            enabled={showIntensity}
            intensityField={selectedLayer === 'surface_lst' ? 'surface_temp_c' : 'temperature_c'}
          />
        )}

        {/* Point Observation Markers */}
        <HeatMapMarkers
          items={filteredMarkers}
          selectedLayer={selectedLayer}
          selectedLocationId={selectedLocationId}
          onSelectLocation={onSelectLocation}
          riskFilter={riskFilter}
          isSolapur={isSolapur}
        />

        {/* Consumer custom child layers */}
        {children}
      </MapContainer>

      {/* Floating Scientific Legend */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[1000] pointer-events-auto">
          <HeatMapLegend selectedLayer={selectedLayer} />
        </div>
      )}

      {/* Bottom Provenance and Context Bar (Apple Frosted Pill) */}
      <div className="absolute bottom-4 right-4 z-[1000] hidden md:flex items-center gap-2.5 bg-white/90 dark:bg-[#191b20]/90 backdrop-blur-xl px-3.5 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-[11px] text-[#6e6e73] dark:text-[#a5a9b4] pointer-events-auto shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
        <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
          {provenanceLabel || (isSolapur ? 'Solapur 100 Stationary Sites (TF-141)' : 'NASA POWER / 0.5° Grid Reanalysis')}
        </span>
        <span className="text-[#86868b] dark:text-[#7a7f8d] font-mono">
          {activeDate || '2024-04-15'}
        </span>
      </div>

      {/* Thermal Diffusion Layer Disclaimer Banner */}
      {showIntensity && (
        <div className="absolute top-16 left-3 z-[1000] pointer-events-none">
          <div className="bg-white/90 dark:bg-[#191b20]/90 backdrop-blur-md px-3 py-1 rounded-full border border-black/[0.08] dark:border-white/[0.1] text-[11px] text-[#6e6e73] dark:text-[#a5a9b4] shadow-sm">
            <span className="font-semibold text-[#ea580c]">Note:</span> Interpolated thermal plume decay around stations; discrete point observations.
          </div>
        </div>
      )}

      {/* Empty State Warning */}
      {!isLoading && !error && filteredMarkers.length === 0 && (
        <div className="absolute inset-0 z-[1050] flex flex-col items-center justify-center p-6 bg-white/90 dark:bg-[#191b20]/90 backdrop-blur-md pointer-events-auto text-center">
          <div className="w-12 h-12 rounded-full bg-[#f5f5f7] dark:bg-[#22252b] border border-black/[0.06] dark:border-white/[0.08] flex items-center justify-center mb-3 text-[#86868b] dark:text-[#a5a9b4]">
            <Flame size={20} />
          </div>
          <h4 className="font-semibold text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7]">
            No Matching Telemetry Sites Found
          </h4>
          <p className="text-[13px] text-[#6e6e73] dark:text-[#a5a9b4] mt-1 max-w-xs leading-relaxed">
            {searchQuery 
              ? `No stations match "${searchQuery}". Clear your search query to view all stations.`
              : 'No observation records match the selected risk category filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setRiskFilter('all');
            }}
            className="mt-4 px-4 py-2 rounded-full bg-[#0071e3] dark:bg-[#2997ff] text-white text-[13px] font-medium hover:bg-[#0076df] dark:hover:bg-[#58a6ff] transition-colors shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && <MapLoadingState />}

      {/* Error Overlay */}
      {error && <MapErrorState error={error} onRetry={onRetry} />}
    </div>
  );
}
