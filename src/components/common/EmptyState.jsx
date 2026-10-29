import React from 'react';
import { FilterX } from 'lucide-react';

export default function EmptyState({
  title = 'No Telemetry Records Found',
  message = 'No observations match the selected filters or date window.',
  onReset
}) {
  return (
    <div className="flex flex-col items-center justify-center p-10 w-full bg-[#fafafc] dark:bg-[#191b20] rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] text-center transition-colors">
      <div className="w-12 h-12 rounded-full bg-white dark:bg-[#22252b] border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center text-[#86868b] dark:text-[#a5a9b4] mb-4 shadow-sm">
        <FilterX size={20} />
      </div>
      <h3 className="text-[17px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
        {title}
      </h3>
      <p className="text-[13px] text-[#6e6e73] dark:text-[#a5a9b4] max-w-md mt-1.5 mb-5 leading-relaxed">
        {message}
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#22252b] hover:bg-[#f5f5f7] dark:hover:bg-[#2e323b] active:scale-[0.98] text-[13px] font-medium text-[#0071e3] dark:text-[#2997ff] border border-black/[0.08] dark:border-white/[0.1] shadow-sm transition-all"
        >
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );
}
