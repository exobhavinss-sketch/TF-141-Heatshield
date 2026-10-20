import React from 'react';
import HeatShieldMap from './HeatShieldMap';

/**
 * HeatMap — Backward-compatible wrapper component for HeatShieldMap.
 * Supports legacy props (geoData, region, activeDate) as well as modern HeatShieldMap props.
 */
export default function HeatMap({
  geoData,
  region = 'india',
  onRegionChange,
  activeDate,
  selectedLayer = 'air_temp',
  onLayerChange,
  isLoading = false,
  error = null,
  onRetry,
  selectedLocationId,
  onSelectLocation,
  markers,
  ...restProps
}) {
  // Support both GeoJSON FeatureCollection and flat markers array
  const effectiveMarkers = markers || (geoData?.features ? geoData.features : (Array.isArray(geoData) ? geoData : []));

  return (
    <HeatShieldMap
      domain={region}
      onDomainChange={onRegionChange}
      markers={effectiveMarkers}
      selectedLayer={selectedLayer}
      onLayerChange={onLayerChange}
      isLoading={isLoading}
      error={error}
      onRetry={onRetry}
      activeDate={activeDate}
      selectedLocationId={selectedLocationId}
      onSelectLocation={onSelectLocation}
      provenanceLabel={geoData?.properties?.source}
      {...restProps}
    />
  );
}

export { default as HeatShieldMap } from './HeatShieldMap';
export { default as HeatMapMarkers } from './HeatMapMarkers';
export { default as HeatMapPopup } from './HeatMapPopup';
export { default as HeatMapLegend } from './HeatMapLegend';
export { default as HeatMapControls } from './HeatMapControls';
export { default as HeatMapIntensityLayer } from './HeatMapIntensityLayer';
export { default as MapLoadingState } from './MapLoadingState';
export { default as MapErrorState } from './MapErrorState';
