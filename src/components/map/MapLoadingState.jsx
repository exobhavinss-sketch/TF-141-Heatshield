import React from 'react';

/**
 * MapLoadingState — Accessible, branded loading overlay for Leaflet maps.
 * Matches HeatShield's emerald/teal academic design tokens.
 */
export default function MapLoadingState({ message = 'Loading geospatial telemetry...' }) {
  return (
    <div 
      className="absolute inset-0 z-[1100] flex flex-col items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm pointer-events-auto"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex items-center justify-center mb-3">
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-secondary animate-spin" />
        <div className="absolute w-3 h-3 rounded-full bg-secondary animate-pulse" />
      </div>
      <p className="font-label-code text-xs uppercase tracking-wider text-on-surface font-semibold">
        {message}
      </p>
      <span className="text-[11px] text-outline font-mono mt-1">
        Solapur Microclimate Grid • TF-141
      </span>
    </div>
  );
}
