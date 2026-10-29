import React from 'react';

export default function StatCard({
  title,
  value,
  unit = '',
  description,
  icon: Icon,
  trend,
  badgeText,
  badgeColor = 'text-[#059669] dark:text-[#10b981] bg-[#059669]/10 dark:bg-[#10b981]/15 border-[#059669]/20 dark:border-[#10b981]/30',
  accentColor = 'text-[#0071e3] dark:text-[#2997ff]'
}) {
  return (
    <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-6 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-3 group">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4] truncate">
          {title}
        </span>
        {Icon && (
          <div className="w-8 h-8 rounded-full bg-[#f5f5f7] dark:bg-[#22252b] flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.04] dark:border-white/[0.06] shrink-0 group-hover:scale-105 transition-transform">
            <Icon size={16} className={accentColor} />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="flex items-baseline gap-1.5 my-1">
        <span className="font-semibold text-3xl lg:text-4xl text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight tabular-nums">
          {value !== undefined && value !== null ? value : '—'}
        </span>
        {unit && (
          <span className="text-[14px] sm:text-[15px] font-normal text-[#6e6e73] dark:text-[#a5a9b4]">
            {unit}
          </span>
        )}
      </div>

      {/* Footer / Description / Trend Badge */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-black/[0.04] dark:border-white/[0.06] mt-auto">
        {description && (
          <span className="text-[12px] sm:text-[13px] text-[#6e6e73] dark:text-[#a5a9b4] truncate font-normal">
            {description}
          </span>
        )}

        {badgeText && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${badgeColor} shrink-0`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
