import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Synchronizing microclimatic telemetry...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full min-h-[220px] bg-[#fafafc] rounded-[28px] border border-black/[0.06] text-center">
      <div className="relative flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 text-[#0071e3] animate-spin" />
      </div>
      <p className="text-[15px] text-[#1d1d1f] font-medium">
        {message}
      </p>
      <span className="text-[12px] text-[#86868b] mt-1 font-mono">
        Querying database records & geospatial raster layers
      </span>
    </div>
  );
}
