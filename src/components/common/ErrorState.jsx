import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorState({ 
  title = 'Telemetry Ingest Error',
  message = 'An error occurred while communicating with the data source.',
  onRetry
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 w-full bg-[#fef2f2]/60 rounded-[28px] border border-[#dc2626]/20 text-center">
      <div className="w-12 h-12 rounded-full bg-white border border-[#dc2626]/20 flex items-center justify-center text-[#dc2626] mb-4 shadow-sm">
        <AlertTriangle size={22} />
      </div>
      <h3 className="text-[17px] font-semibold text-[#dc2626] tracking-tight">
        {title}
      </h3>
      <p className="text-[13px] text-[#6e6e73] max-w-md mt-1.5 mb-5 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#f5f5f7] active:scale-[0.98] text-[13px] font-medium text-[#1d1d1f] border border-black/[0.08] shadow-sm transition-all"
        >
          <RotateCcw size={14} />
          <span>Retry Operation</span>
        </button>
      )}
    </div>
  );
}
