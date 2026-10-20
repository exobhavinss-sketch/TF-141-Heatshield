import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * MapErrorState — Friendly, actionable error display for map data retrieval failures.
 */
export default function MapErrorState({ 
  error, 
  onRetry,
  message = 'Failed to load geospatial observation data.' 
}) {
  const errorMessage = typeof error === 'string' 
    ? error 
    : (error?.message || message);

  return (
    <div 
      className="absolute inset-0 z-[1100] flex flex-col items-center justify-center p-6 bg-surface-container-lowest/90 backdrop-blur-sm pointer-events-auto text-center"
      role="alert"
    >
      <div className="w-12 h-12 rounded-full bg-error-container/40 flex items-center justify-center mb-3 text-error">
        <AlertTriangle size={24} />
      </div>
      
      <h3 className="font-headline font-bold text-base text-on-surface mb-1">
        Geospatial Data Unavailable
      </h3>
      
      <p className="font-body-sm text-xs text-on-surface-variant max-w-md mb-4 leading-relaxed">
        {errorMessage}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-secondary"
        >
          <RotateCcw size={14} />
          <span>Retry Loading Telemetry</span>
        </button>
      )}

      <span className="text-[10px] text-outline font-mono mt-4">
        Check Supabase connectivity or fallback to verified simulation cache.
      </span>
    </div>
  );
}
