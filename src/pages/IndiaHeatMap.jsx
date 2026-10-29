import React, { useEffect, useMemo, useState } from 'react';
import { HeatShieldMap } from '../components/map/HeatMap';
import { fetchHeatmapGeoJSON } from '../services/heatmapService';
import research from '../data/edadvSummary.json';

export default function IndiaHeatMap() {
  const [domain, setDomain] = useState('solapur');
  const [layer, setLayer] = useState('surface_lst');
  const [stationSearch, setStationSearch] = useState('');
  const [indiaData, setIndiaData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stationMarkers = useMemo(() => research.stations.map(s => ({
    ...s,
    location_name: s.location_id,
    grid_id: s.location_id,
    is_edadv_summary: true,
    is_synthetic: true,
  })), []);

  useEffect(() => {
    if (domain !== 'india') return;
    let alive = true;
    setLoading(true); setError(null);
    fetchHeatmapGeoJSON('2024-04-15', 'india')
      .then(result => { if (alive) setIndiaData(result); })
      .catch(err => { if (alive) setError(err.message || 'India map data is unavailable.'); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [domain]);

  const markers = domain === 'solapur'
    ? stationMarkers.filter(s => `${s.location_id} ${s.zone_type}`.toLowerCase().includes(stationSearch.toLowerCase()))
    : (indiaData?.features || []);

  return (
    <main className="w-full bg-[#fafafc] dark:bg-[#101114] text-[#1d1d1f] dark:text-[#f5f5f7] min-h-screen pb-12 transition-colors duration-200">
      <header className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-xs uppercase tracking-wider text-[#6e6e73] dark:text-[#a5a9b4]">HeatShield · Spatial view</p>
        <h1 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7] mt-2">India Heat Map</h1>
        <p className="text-sm text-[#6e6e73] dark:text-[#a5a9b4] mt-2">Solapur markers show station-level synthetic means at the source coordinates. Points represent the sampled locations only; no values are interpolated for unsampled areas.</p>
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <div className="inline-flex rounded-full bg-[#f0f0f2] dark:bg-[#22252b] border border-black/[0.04] dark:border-white/[0.08] p-1" aria-label="Map region">
            {['solapur','india'].map(value=>(
              <button
                key={value}
                onClick={()=>setDomain(value)}
                aria-pressed={domain===value}
                className={`px-4 py-2 rounded-full text-sm capitalize transition-all ${
                  domain===value
                    ? 'bg-white dark:bg-[#191b20] text-[#1d1d1f] dark:text-[#f5f5f7] shadow font-medium'
                    : 'text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <label className="sr-only" htmlFor="map-layer">Map variable</label>
          <select
            id="map-layer"
            value={layer}
            onChange={e=>setLayer(e.target.value)}
            className="rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#22252b] text-[#1d1d1f] dark:text-[#f5f5f7] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
          >
            <option value="surface_lst">Land surface temperature (°C)</option>
            <option value="air_temp">Air temperature (°C)</option>
          </select>
          {domain==='solapur' && (
            <>
              <label className="sr-only" htmlFor="station-search">Filter stations by ID or zone</label>
              <input
                id="station-search"
                value={stationSearch}
                onChange={e=>setStationSearch(e.target.value)}
                placeholder="Filter station ID or zone"
                className="rounded-full border border-black/10 dark:border-white/10 bg-white dark:bg-[#22252b] text-[#1d1d1f] dark:text-[#f5f5f7] placeholder-[#86868b] dark:placeholder-[#7a7f8d] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0071e3]"
              />
              <span className="text-xs text-[#6e6e73] dark:text-[#a5a9b4]">Showing {markers.length} of {stationMarkers.length} locations</span>
            </>
          )}
          {domain==='solapur' && <span className="text-xs text-[#6e6e73] dark:text-[#a5a9b4]">100 represented locations · 1,500 records per location · {research.metadata.source_sha256.slice(0,12)}…</span>}
        </div>
      </header>
      {domain==='solapur' && (
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-3">
          <p className="text-xs rounded-xl bg-[#fff8e6] dark:bg-[#78350f]/20 border border-[#f2d58b] dark:border-[#b45309]/40 text-[#7a4e00] dark:text-[#fbbf24] px-4 py-3">
            Synthetic academic simulation data; not verified live Solapur measurements. Coordinates are not independently verified sensor sites or a municipal boundary. Marker summaries are not measurements from a selected date.
          </p>
        </div>
      )}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <HeatShieldMap
          domain={domain}
          onDomainChange={setDomain}
          markers={markers}
          selectedLayer={layer}
          onLayerChange={setLayer}
          showControls={domain==='india'}
          showLegend={true}
          showIntensityToggle={false}
          height="72vh"
          className="min-h-[520px]"
          isLoading={loading}
          error={error}
          onRetry={()=>{if(domain==='india')setIndiaData(null);}}
          provenanceLabel={domain==='solapur'?'Synthetic academic simulation station means':'Existing India-wide map feed'}
          activeDate={domain==='solapur'?'All source records: 2021-01-01 to 2025-12-31 (station means)':'Requested map date: 2024-04-15 (source/status varies)'}
        />
      </div>
    </main>
  );
}
