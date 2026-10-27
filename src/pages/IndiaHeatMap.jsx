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
  return <main className="w-full bg-[#fafafc] min-h-screen pb-12">
    <header className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-xs uppercase tracking-wider text-[#6e6e73]">HeatShield · Spatial view</p>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">India Heat Map</h1>
      <p className="text-sm text-[#6e6e73] mt-2">Solapur markers show station-level synthetic means at the source coordinates. Points represent the sampled locations only; no values are interpolated for unsampled areas.</p>
      <div className="flex flex-wrap items-center gap-3 mt-5">
        <div className="inline-flex rounded-full bg-[#f0f0f2] p-1" aria-label="Map region">
          {['solapur','india'].map(value=><button key={value} onClick={()=>setDomain(value)} aria-pressed={domain===value} className={`px-4 py-2 rounded-full text-sm capitalize ${domain===value?'bg-white shadow font-medium':'text-[#6e6e73]'}`}>{value}</button>)}
        </div>
        <label className="sr-only" htmlFor="map-layer">Map variable</label>
        <select id="map-layer" value={layer} onChange={e=>setLayer(e.target.value)} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
          <option value="surface_lst">Land surface temperature (°C)</option><option value="air_temp">Air temperature (°C)</option>
        </select>
        {domain==='solapur' && <><label className="sr-only" htmlFor="station-search">Filter stations by ID or zone</label><input id="station-search" value={stationSearch} onChange={e=>setStationSearch(e.target.value)} placeholder="Filter station ID or zone" className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm"/><span className="text-xs text-[#6e6e73]">Showing {markers.length} of {stationMarkers.length} locations</span></>}
        {domain==='solapur' && <span className="text-xs text-[#6e6e73]">100 represented locations · 1,500 records per location · {research.metadata.source_sha256.slice(0,12)}…</span>}
      </div>
    </header>
    {domain==='solapur' && <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-3"><p className="text-xs rounded-xl bg-[#fff8e6] border border-[#f2d58b] text-[#7a4e00] px-4 py-3">Synthetic academic simulation data; not verified live Solapur measurements. Coordinates are not independently verified sensor sites or a municipal boundary. Marker summaries are not measurements from a selected date.</p></div>}
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <HeatShieldMap domain={domain} onDomainChange={setDomain} markers={markers} selectedLayer={layer} onLayerChange={setLayer} showControls={domain==='india'} showLegend={true} showIntensityToggle={false} height="72vh" className="min-h-[520px]" isLoading={loading} error={error} onRetry={()=>{if(domain==='india')setIndiaData(null);}} provenanceLabel={domain==='solapur'?'Synthetic academic simulation station means':'Existing India-wide map feed'} activeDate={domain==='solapur'?'All source records: 2021-01-01 to 2025-12-31 (station means)':'Requested map date: 2024-04-15 (source/status varies)'} />
    </div>
  </main>;
}
