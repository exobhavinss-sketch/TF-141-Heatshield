import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Synchronizing microclimatic telemetry...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 w-full min-h-[220px] bg-[#fafafc] dark:bg-[#191b20] rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] text-center transition-colors">
      <div className="relative flex items-center justify-center mb-4">
        <Loader2 className="w-8 h-8 text-[#0071e3] dark:text-[#2997ff] animate-spin" />
      </div>
      <p className="text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium">
        {message}
      </p>
      <span className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] mt-1 font-mono">
        Querying database records & geospatial raster layers
      </span>
    </div>
  );
}
