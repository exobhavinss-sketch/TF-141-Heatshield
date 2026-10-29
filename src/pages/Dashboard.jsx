import React, { useEffect, useState } from 'react';
import EDADVResearchSection from '../components/edadv/EDADVResearchSection';
import { fetchDashboardSummary } from '../services/heatmapService';

export default function Dashboard() {
  const [date, setDate] = useState('2024-05-24');
  const [zone, setZone] = useState('all');
  const [liveSummary, setLiveSummary] = useState(null);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveStatus, setLiveStatus] = useState('loading');

  useEffect(() => {
    let active = true;
    setLiveSummary(null);
    setLiveLoading(true);
    fetchDashboardSummary(date, zone).then(result => {
      if (!active) return;
      if (result?.is_live_backend === true) {
        setLiveSummary(result);
        setLiveStatus('live');
      } else {
        setLiveStatus(result?.availability || 'unavailable');
      }
    })
      .catch(() => { if (active) setLiveStatus('unavailable'); })
      .finally(() => { if (active) setLiveLoading(false); });
    return () => { active = false; };
  }, [date, zone]);

  return (
    <main className="w-full bg-[#fafafc] dark:bg-[#101114] text-[#1d1d1f] dark:text-[#f5f5f7] min-h-screen pb-20 transition-colors duration-200">
      <header className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-xs uppercase tracking-wider text-[#6e6e73] dark:text-[#a5a9b4]">HeatShield · TF-141 · Solapur, Maharashtra</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-2">Heat analytics overview</h1>
        <p className="text-sm text-[#6e6e73] dark:text-[#a5a9b4] mt-2">Validated descriptive summaries for 1 January 2021–31 December 2025. Synthetic academic simulation data; not verified weather measurements.</p>
      </header>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <section className="rounded-[24px] border border-black/[0.07] dark:border-white/[0.08] bg-white dark:bg-[#191b20] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-colors duration-200">
          <h2 className="font-semibold text-lg text-[#1d1d1f] dark:text-[#f5f5f7]">Live backend summary</h2>
          <p className="text-xs text-[#6e6e73] dark:text-[#a5a9b4] mt-1">Separate from the precomputed synthetic research dataset. Values appear only when the configured API identifies its response as live.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <label className="text-xs text-[#6e6e73] dark:text-[#a5a9b4] flex items-center">
              Date
              <input
                type="date"
                value={date}
                onChange={e=>setDate(e.target.value)}
                className="ml-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#22252b] px-3 py-2 text-sm text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
            </label>
            <label className="text-xs text-[#6e6e73] dark:text-[#a5a9b4] flex items-center">
              Zone
              <select
                value={zone}
                onChange={e=>setZone(e.target.value)}
                className="ml-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#22252b] px-3 py-2 text-sm text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              >
                <option value="all">All</option>
                {['Residential','Commercial','Industrial','Road','Park','Educational','Transport','Waterbody','Open Land'].map(v=><option key={v} value={v.toLowerCase()}>{v}</option>)}
              </select>
            </label>
          </div>
          {liveLoading && <p className="mt-3 text-sm text-[#6e6e73] dark:text-[#a5a9b4]" aria-live="polite">Checking the configured live API…</p>}
          {!liveLoading && !liveSummary && liveStatus === 'not_configured' && <p className="mt-3 text-sm text-[#6e6e73] dark:text-[#a5a9b4]" role="status">No live API is configured in this environment. Research summaries below are precomputed synthetic analysis and are separate from live readings.</p>}
          {!liveLoading && !liveSummary && liveStatus === 'invalid_response' && <p className="mt-3 text-sm text-[#6e6e73] dark:text-[#a5a9b4]" role="status">The configured API did not return a recognized live summary for {date}; no live values are shown.</p>}
          {!liveLoading && !liveSummary && liveStatus === 'unavailable' && <p className="mt-3 text-sm text-[#6e6e73] dark:text-[#a5a9b4]" role="status">The configured API is unavailable for {date}. No offline fixture values are shown as live data.</p>}
          {liveSummary && (
            <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[['Mean air temperature',liveSummary.meanAirTemp,'°C'],['Maximum air temperature',liveSummary.maxAirTemp,'°C'],['Mean LST',liveSummary.meanLST,'°C'],['Records in response',liveSummary.validRecordsCount,'']].map(([label,val,unit])=>(
                <div key={label} className="rounded-2xl bg-[#f5f5f7] dark:bg-[#22252b] p-4 transition-colors">
                  <strong className="text-xl text-[#1d1d1f] dark:text-[#f5f5f7]">{val ?? '—'} {unit}</strong>
                  <p className="text-xs text-[#6e6e73] dark:text-[#a5a9b4]">{label} · {date}</p>
                </div>
              ))}
            </div>
          )}
        </section>
        <EDADVResearchSection compact />
      </div>
    </main>
  );
}
