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
      className={`relative w-full overflow-hidden border border-outline-variant/30 bg-surface-container-lowest transition-all ${
        isFullscreen
          ? 'fixed inset-0 z-[2000] rounded-none border-none h-screen'
          : `rounded-xl ${className}`
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
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md border shadow-md transition-all ${
              showIntensity
                ? 'bg-tertiary-container text-on-tertiary-container border-tertiary/40'
                : 'bg-surface-container-low/95 text-on-surface-variant border-outline-variant/40 hover:text-on-surface'
            }`}
            title="Toggle Interpolated Thermal Diffusion Plumes"
          >
            <Flame size={13} className={showIntensity ? 'text-tertiary-fixed animate-pulse' : 'text-outline'} />
            <span className="hidden sm:inline">Thermal Intensity</span>
            <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
              showIntensity ? 'bg-tertiary text-on-tertiary' : 'bg-surface-container'
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

      {/* Bottom Provenance and Context Bar */}
      <div className="absolute bottom-4 right-4 z-[1000] hidden md:flex items-center gap-2 bg-surface-container-low/95 backdrop-blur px-3 py-1.5 rounded-lg border border-outline-variant/30 text-[11px] text-on-surface-variant pointer-events-auto shadow-md">
        <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
        <span className="font-medium text-on-surface">
          {provenanceLabel || (isSolapur ? 'Solapur 100 Stationary Sites (TF-141)' : 'NASA POWER / 0.5° Grid Reanalysis')}
        </span>
        <span className="text-outline font-mono">
          {activeDate || '2024-04-15'}
        </span>
      </div>

      {/* Thermal Diffusion Layer Disclaimer Banner */}
      {showIntensity && (
        <div className="absolute top-16 left-3 z-[1000] pointer-events-none">
          <div className="bg-surface-container-lowest/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-tertiary-container/40 text-[10px] text-on-surface-variant shadow-sm">
            <span className="font-semibold text-tertiary">Note:</span> Interpolated thermal plume decay around stations; discrete point observations.
          </div>
        </div>
      )}

      {/* Empty State Warning */}
      {!isLoading && !error && filteredMarkers.length === 0 && (
        <div className="absolute inset-0 z-[1050] flex flex-col items-center justify-center p-6 bg-surface-container-lowest/85 backdrop-blur-sm pointer-events-auto text-center">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center mb-2 text-outline">
            <Flame size={20} />
          </div>
          <h4 className="font-headline font-semibold text-sm text-on-surface">
            No Matching Telemetry Sites Found
          </h4>
          <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
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
            className="mt-3 px-3 py-1.5 rounded-lg bg-surface-container text-xs font-medium text-primary hover:bg-surface-variant transition-colors"
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
