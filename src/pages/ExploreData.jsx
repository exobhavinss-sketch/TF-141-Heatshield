import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { fetchMasterExploreRecords, getMasterDatasetMetadata } from '../services/masterDataService';

const INITIAL_FALLBACK_RECORD = {
  id: 'SOL-LOC-001',
  location_id: 'SOL-LOC-001',
  ward: 'Jule Solapur',
  wardSub: 'Sector 1 - D-Mart Enclave',
  zone: 'Residential',
  airTemp: 34.06,
  lstTemp: 35.64,
  rh: 32.5,
  risk: 'Moderate',
  timestamp: '2024-05-24 14:00',
  coords: '17.6325° N, 75.8940° E',
  solar: '912 W/m²',
  wind: '2.1 m/s NW',
  emissivity: '0.912 ε',
  canopy: '12.6%',
  cooling_priority_score: 42.6,
  recommended_intervention: 'Urban Green Infrastructure & Shade Enhancement',
  engine: 'WRF-Chem / TF-141 Calibrated',
  sha: 'e7f9a2b8...001'
};

export default function ExploreData() {
  const { user, isConfigured } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [minTemp, setMinTemp] = useState(15.0);
  const [maxTemp, setMaxTemp] = useState(50.0);
  const [records, setRecords] = useState([INITIAL_FALLBACK_RECORD]);
  const [selectedRecord, setSelectedRecord] = useState(INITIAL_FALLBACK_RECORD);
  const [totalCount, setTotalCount] = useState(100);
  const [totalPages, setTotalPages] = useState(5);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [loading, setLoading] = useState(false);
  const [isLiveDb, setIsLiveDb] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSavingAnalysis, setIsSavingAnalysis] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Fetch real records from Supabase 'heatshield_master' or verified master dataset
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      setLoading(true);
      try {
        const res = await fetchMasterExploreRecords({
          search,
          zone: selectedZone,
          risk: selectedRisk,
          minTemp,
          maxTemp,
          page,
          pageSize
        });
        if (!cancelled) {
          setRecords(res.records);
          setTotalCount(res.totalCount);
          setTotalPages(res.totalPages);
          setIsLiveDb(res.isLiveDb);
          if (res.records.length > 0) {
            setSelectedRecord(prev => res.records.find(r => r.id === prev?.id) || res.records[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load explore records:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadData();
    return () => { cancelled = true; };
  }, [search, selectedZone, selectedRisk, minTemp, maxTemp, page, pageSize]);

  const handleSaveAnalysis = async () => {
    if (!user || !isConfigured || !supabase) {
      alert('Please sign in with your research credentials to bookmark and persist analytical filter sets.');
      return;
    }

    const defaultTitle = `Solapur Query: ${selectedZone} (${selectedRisk}) [${minTemp}°C–${maxTemp}°C]`;
    const title = window.prompt('Enter a title for this saved analysis snapshot:', defaultTitle);
    if (!title || !title.trim()) return;

    setIsSavingAnalysis(true);
    try {
      const payload = {
        user_id: user.id,
        title: title.trim(),
        description: `Filtered by Zone: ${selectedZone}, Risk: ${selectedRisk}, Search: "${search}" (${totalCount} records)`,
        filters: {
          search,
          selectedZone,
          selectedRisk,
          minTemp,
          maxTemp,
        },
        analysis_data: {
          matchCount: totalCount,
          isLiveDb,
          savedAt: new Date().toISOString(),
        },
      };

      const { error } = await supabase.from('saved_analyses').insert([payload]);
      if (error) throw error;

      setSaveStatus('Analysis query saved to your account profile!');
      setTimeout(() => setSaveStatus(''), 4000);
    } catch (err) {
      console.error('Failed to save analysis:', err);
      alert(`Could not save analysis: ${err.message}`);
    } finally {
      setIsSavingAnalysis(false);
    }
  };

  const activeRecord = selectedRecord || records[0] || INITIAL_FALLBACK_RECORD;

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Fetch up to 2,000 filtered records for comprehensive export
      const exportRes = await fetchMasterExploreRecords({
        search,
        zone: selectedZone,
        risk: selectedRisk,
        minTemp,
        maxTemp,
        page: 1,
        pageSize: 2000
      });
      const exportList = exportRes.records || records;

      const csvHeader = "Record_ID,Location_ID,Location_Name,Zone_Classification,Air_Temp_C,Surface_LST_C,RH_Pct,Risk_Category,Elevation_M,Population_Density_Km2,Cooling_Priority_Score,Recommended_Intervention,Coordinates,Sim_Timestamp,Data_Provenance\n";
      const csvRows = exportList.map(r => 
        `"${r.id}","${r.location_id || r.id}","${r.ward} - ${r.wardSub}","${r.zone}",${r.airTemp},${r.lstTemp},${r.rh},"${r.risk}",${r.elevation_m || 460},${r.population_density || 15000},${r.cooling_priority_score || 45.0},"${r.recommended_intervention || 'Cooling Intervention'}","${r.coords}","${r.timestamp}","WRF-Chem / TF-141 Calibrated Simulation"`
      ).join("\n");
      
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `heatshield_master_dataset_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedZone('All');
    setSelectedRisk('All');
    setMinTemp(15.0);
    setMaxTemp(50.0);
    setPage(1);
  };

  const getRiskTagClass = (risk) => {
    const r = risk?.toLowerCase() || '';
    if (r.includes('extreme')) {
      return "bg-[#dc2626]/10 text-[#dc2626] font-medium text-[11px] px-2.5 py-0.5 rounded-[980px] inline-flex items-center gap-1";
    }
    if (r.includes('high')) {
      return "bg-[#ea580c]/10 text-[#ea580c] font-medium text-[11px] px-2.5 py-0.5 rounded-[980px] inline-flex items-center gap-1";
    }
    if (r.includes('moderate')) {
      return "bg-[#d97706]/10 text-[#d97706] font-medium text-[11px] px-2.5 py-0.5 rounded-[980px] inline-flex items-center gap-1";
    }
    return "bg-[#059669]/10 text-[#059669] font-medium text-[11px] px-2.5 py-0.5 rounded-[980px] inline-flex items-center gap-1";
  };

  const meanLst = (records.reduce((acc, r) => acc + (r.lstTemp || 35.8), 0) / (records.length || 1)).toFixed(1);

  return (
    <div className="flex flex-col w-full pb-20 bg-[#fafafc]">
      
      {/* Top Academic Context Ribbon */}
      <div className="w-full bg-[#f5f5f7]/80 backdrop-blur-md py-2.5 px-6 border-b border-black/[0.04]">
        <div className="max-w-[1340px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-[12px] text-[#86868b]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-[#1d1d1f] font-medium tracking-wide">CORPUS: SYNTH-SOLAPUR-150K</span>
            <span className="w-1 h-1 rounded-full bg-black/20"></span>
            <span className="text-[#0071e3] font-medium">INDEXED HIERARCHY v2.4</span>
            <span className="w-1 h-1 rounded-full bg-black/20"></span>
            <span className="font-mono">SEED: 0x9AF41B8</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] tracking-wider uppercase">
            <span>ERA5-LAND COMPLIANT REANALYSIS</span>
          </div>
        </div>
      </div>

      {/* Header & Executive Metrics */}
      <section className="w-full px-6 pt-10 pb-8">
        <div className="max-w-[1340px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-[12px] text-[#86868b] font-medium uppercase tracking-wider">
              <span className="text-[#0071e3]">Repository Ledger</span>
              <span>/</span>
              <span className="font-mono">TEL-150K-QUERY</span>
            </div>
            <h1 className="text-[36px] md:text-[44px] font-semibold tracking-[-0.025em] text-[#1d1d1f]">
              Data Explorer
            </h1>
            <p className="text-[16px] text-[#86868b] leading-relaxed">
              Query, filter, inspect, and export microclimate observations across Solapur's 150,000 environmental simulation records.
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white p-4 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.06] flex flex-col min-w-[150px]">
              <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider">Filtered Records</span>
              <span className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight tabular-nums mt-0.5">
                {totalCount.toLocaleString()}
              </span>
              <span className="text-[11px] text-[#0071e3] font-mono mt-0.5">
                {((totalCount / 150000) * 100).toFixed(2)}% of corpus
              </span>
            </div>

            <div className="bg-white p-4 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.06] flex flex-col min-w-[150px]">
              <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider">Repository Source</span>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`w-2 h-2 rounded-full ${isLiveDb ? 'bg-[#059669]' : 'bg-[#0071e3]'}`}></span>
                <span className="text-[14px] font-medium text-[#1d1d1f]">
                  {isLiveDb ? 'Supabase Live' : 'Verified Baseline'}
                </span>
              </div>
              <span className="text-[11px] text-[#86868b] font-mono mt-1">
                {isLiveDb ? 'heatshield_master' : '100 Station Grid'}
              </span>
            </div>

            <div className="bg-white p-4 rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.06] flex flex-col min-w-[150px]">
              <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider">Mean Surface LST</span>
              <span className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight tabular-nums mt-0.5">
                {meanLst}°C
              </span>
              <span className="text-[11px] text-[#86868b] mt-0.5">Solapur Microclimate</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Controls & Filters */}
      <section className="w-full px-6 pb-8">
        <div className="max-w-[1340px] mx-auto bg-white rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] border border-black/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            
            {/* Search Keyword */}
            <div className="lg:col-span-4 space-y-1.5">
              <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider flex items-center justify-between">
                <span>Query Parameter</span>
                <span className="font-mono text-[10px]">STN / WARD / COORD</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-[#86868b] text-[18px]">search</span>
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search station ID, ward name, coordinates..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] hover:bg-[#e8e8ed]/60 text-[#1d1d1f] text-[13px] rounded-[980px] border border-transparent focus:border-black/20 focus:bg-white focus:outline-none transition-all placeholder:text-[#86868b]" 
                  id="search-input"
                />
              </div>
            </div>

            {/* Zone Filter */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider">Urban Zone</label>
              <div className="relative">
                <select 
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full py-2.5 pl-4 pr-9 bg-[#f5f5f7] hover:bg-[#e8e8ed]/60 text-[#1d1d1f] text-[13px] rounded-[980px] border border-transparent focus:border-black/20 focus:bg-white focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  <option value="All">All Zones (9)</option>
                  <option value="Commercial">Commercial Dense</option>
                  <option value="Industrial">Industrial Core</option>
                  <option value="Residential">Residential Moderate</option>
                  <option value="Canopy">Canopy Park & Buffer</option>
                  <option value="Transit">Transit Corridor</option>
                  <option value="Riparian">Riparian / Lake Buffer</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-[#86868b] text-[18px]">expand_more</span>
              </div>
            </div>

            {/* Heat Risk Filter */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider">Risk Tier</label>
              <div className="relative">
                <select 
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full py-2.5 pl-4 pr-9 bg-[#f5f5f7] hover:bg-[#e8e8ed]/60 text-[#1d1d1f] text-[13px] rounded-[980px] border border-transparent focus:border-black/20 focus:bg-white focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  <option value="All">All Tiers</option>
                  <option value="Mitigated">Mitigated (&lt; 34°C)</option>
                  <option value="Moderate">Moderate (34–38°C)</option>
                  <option value="High">High (39–43°C)</option>
                  <option value="Extreme">Extreme (&gt; 43°C)</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-[#86868b] text-[18px]">expand_more</span>
              </div>
            </div>

            {/* Temporal Envelope Display */}
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider flex items-center justify-between">
                <span>Temporal Window</span>
                <span className="font-mono text-[10px] text-[#0071e3]">EPOCH</span>
              </label>
              <div className="flex items-center gap-1.5 py-2.5 px-3 bg-[#f5f5f7] rounded-[980px] text-[#1d1d1f] font-mono text-[11px] justify-center">
                <span className="material-symbols-outlined text-[15px] text-[#86868b]">calendar_today</span>
                <span>2021-01</span>
                <span className="text-[#86868b]">→</span>
                <span>2025-05</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="lg:col-span-2 flex flex-col sm:flex-row lg:flex-col gap-2 justify-end">
              <button 
                type="button"
                onClick={handleExportCSV}
                disabled={isExporting}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-all disabled:opacity-70"
              >
                <span className={`material-symbols-outlined text-[16px] ${isExporting ? 'animate-spin' : ''}`}>
                  {isExporting ? 'refresh' : 'download'}
                </span>
                <span className="whitespace-nowrap">
                  {isExporting ? 'Exporting...' : `Export CSV (${totalCount.toLocaleString()})`}
                </span>
              </button>
              
              <button 
                type="button"
                onClick={handleSaveAnalysis}
                disabled={isSavingAnalysis}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-[980px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-[12px] font-medium border border-black/[0.04] transition-all"
                title="Bookmark current query to your Supabase profile"
              >
                <span className="material-symbols-outlined text-[15px] text-[#0071e3]">bookmark_add</span>
                <span className="whitespace-nowrap">{isSavingAnalysis ? 'Saving...' : 'Save Query'}</span>
              </button>
            </div>
          </div>

          {saveStatus && (
            <div className="mt-3 p-3 rounded-[16px] bg-[#059669]/10 text-[#059669] text-[13px] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span className="font-medium">{saveStatus}</span>
            </div>
          )}

          {/* Thermal Range Slider */}
          <div className="mt-4 pt-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-t border-black/[0.04] text-[12px]">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-[#86868b] uppercase tracking-wider text-[11px]">Thermal Envelope:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#1d1d1f] bg-[#f5f5f7] px-2 py-0.5 rounded-[6px]">
                    {minTemp.toFixed(1)}°C
                  </span>
                  <input 
                    type="range"
                    min="25.0"
                    max="50.0"
                    step="0.5"
                    value={maxTemp}
                    onChange={(e) => setMaxTemp(parseFloat(e.target.value))}
                    className="w-32 h-1.5 accent-[#0071e3] cursor-pointer"
                  />
                  <span className="font-mono text-[#1d1d1f] bg-[#f5f5f7] px-2 py-0.5 rounded-[6px]">
                    {maxTemp.toFixed(1)}°C
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-[#86868b]">
                <span>Bounds:</span>
                <span className="px-2 py-0.5 rounded-[6px] bg-[#f5f5f7] text-[#1d1d1f] font-mono text-[11px]">
                  Diurnal Peak (12:00–16:00 IST)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={handleResetFilters}
                className="text-[#86868b] hover:text-[#1d1d1f] transition-colors flex items-center gap-1 text-[12px] font-medium"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Reset Filters</span>
              </button>
              <span className="text-black/10">|</span>
              <div className="flex items-center gap-1.5 text-[#86868b] font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
                <span>Index Cache (12ms)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace: Table + Right Inspector */}
      <section className="w-full px-6 pb-12">
        <div className="max-w-[1340px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Table Container (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            <div className="bg-white rounded-[28px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] overflow-hidden border border-black/[0.06]">
              
              {/* Table Toolbar Header */}
              <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.04]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[16px] font-semibold text-[#1d1d1f]">Spatial Telemetry Stream</span>
                  <span className="font-mono text-[11px] bg-[#f5f5f7] px-2 py-0.5 rounded-[6px] text-[#86868b]">BATCH #091-B</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#86868b]">Showing {totalCount.toLocaleString()} observations</span>
                </div>
              </div>

              {/* High-Precision Scientific Data Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left text-[13px] border-collapse min-w-[760px]">
                  <thead>
                    <tr className="bg-[#fafafc] border-b border-black/[0.04] text-[11px] font-semibold text-[#86868b] tracking-wider uppercase select-none">
                      <th className="py-3 px-4">Station ID</th>
                      <th className="py-3 px-4">Location / Ward</th>
                      <th className="py-3 px-4">Zone</th>
                      <th className="py-3 px-4 text-right">Air Temp</th>
                      <th className="py-3 px-4 text-right">LST</th>
                      <th className="py-3 px-4 text-right">RH</th>
                      <th className="py-3 px-4 text-center">Risk Tier</th>
                      <th className="py-3 px-4">Sim Timestamp</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/[0.03]">
                    {loading ? (
                      <tr>
                        <td colSpan="9" className="py-16 text-center text-[#86868b]">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <div className="w-7 h-7 border-2 border-black/10 border-t-[#0071e3] rounded-full animate-spin"></div>
                            <span className="text-[13px]">Querying master microclimate telemetry records...</span>
                          </div>
                        </td>
                      </tr>
                    ) : records.length === 0 ? (
                      <tr>
                        <td colSpan="9" className="py-16 text-center text-[#86868b]">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[32px] text-black/20">search_off</span>
                            <span className="text-[14px]">No observations match the current filter criteria.</span>
                            <button onClick={handleResetFilters} className="text-[#0071e3] hover:underline font-medium text-[13px] mt-1">
                              Reset Constraints
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      records.map((r) => {
                        const isSelected = activeRecord.id === r.id;
                        return (
                          <tr 
                            key={r.id}
                            onClick={() => setSelectedRecord(r)}
                            className={`h-[52px] transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-[#0071e3]/[0.05] border-l-2 border-l-[#0071e3]' 
                                : 'hover:bg-black/[0.015]'
                            }`}
                          >
                            <td className="py-2.5 px-4 whitespace-nowrap">
                              <span className="font-mono text-[12px] bg-[#f5f5f7] text-[#1d1d1f] px-2 py-0.5 rounded-[6px] font-medium inline-flex items-center gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${r.risk === 'Extreme' ? 'bg-[#dc2626]' : r.risk === 'High' ? 'bg-[#ea580c]' : 'bg-[#059669]'}`}></span>
                                {r.id}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 whitespace-nowrap">
                              <span className="font-medium text-[#1d1d1f] block">{r.ward}</span>
                              <span className="text-[11px] text-[#86868b]">{r.wardSub}</span>
                            </td>
                            <td className="py-2.5 px-4 whitespace-nowrap">
                              <span className="text-[12px] px-2 py-0.5 rounded-[6px] bg-[#f5f5f7] text-[#86868b] font-medium">
                                {r.zone}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-right whitespace-nowrap">
                              <span className="font-medium text-[#1d1d1f] tabular-nums">{Number(r.airTemp).toFixed(1)}°C</span>
                            </td>
                            <td className="py-2.5 px-4 text-right whitespace-nowrap">
                              <span className="font-semibold text-[#dc2626] tabular-nums">{Number(r.lstTemp).toFixed(1)}°C</span>
                            </td>
                            <td className="py-2.5 px-4 text-right whitespace-nowrap text-[#86868b] tabular-nums">
                              {r.rh}%
                            </td>
                            <td className="py-2.5 px-4 text-center whitespace-nowrap">
                              <span className={getRiskTagClass(r.risk)}>
                                {r.risk}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 whitespace-nowrap font-mono text-[11px] text-[#86868b]">
                              {r.timestamp}
                            </td>
                            <td className="py-2.5 px-4 text-right whitespace-nowrap">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedRecord(r); }}
                                className={`px-2.5 py-1 text-[12px] font-medium rounded-[980px] transition-colors inline-flex items-center gap-0.5 ${
                                  isSelected ? 'bg-[#0071e3] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                                }`}
                              >
                                <span>Inspect</span>
                                <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Pagination Bar */}
              <div className="px-6 py-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-black/[0.04] text-[13px]">
                <span className="text-[#86868b]">
                  Showing <span className="font-medium text-[#1d1d1f]">{totalCount === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)}</span> of <span className="font-medium text-[#1d1d1f]">{totalCount.toLocaleString()}</span> records
                </span>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                    className="w-8 h-8 rounded-[980px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] disabled:opacity-30 transition-colors flex items-center justify-center"
                    title="Previous page"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  
                  <span className="px-3 py-1 rounded-[980px] bg-[#f5f5f7] font-mono text-[12px] text-[#1d1d1f] font-medium">
                    {page} / {Math.max(1, totalPages)}
                  </span>

                  <button 
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                    className="w-8 h-8 rounded-[980px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] disabled:opacity-30 transition-colors flex items-center justify-center"
                    title="Next page"
                  >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Distribution Card */}
            <div className="bg-white p-6 rounded-[28px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col md:flex-row md:items-center justify-between gap-4 border border-black/[0.06]">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[12px] font-medium text-[#86868b] uppercase tracking-wider">
                  <span className="text-[#0071e3]">Distribution Analysis</span>
                  <span>•</span>
                  <span className="font-mono">Solapur UHI</span>
                </div>
                <p className="text-[13px] text-[#86868b] leading-relaxed">
                  Thermal clustering peaks at 14:30 IST along high albedo asphalt corridors with building height-to-street aspect ratios &lt; 0.6.
                </p>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <div className="flex flex-col items-end">
                  <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider">Peak Gradient</span>
                  <span className="text-[14px] font-semibold text-[#dc2626] tabular-nums">+8.4°C vs Rural</span>
                </div>
                <svg className="w-28 h-9 text-[#0071e3]" fill="none" viewBox="0 0 120 40">
                  <path d="M0 35 C20 33, 30 28, 45 22 C60 16, 75 4, 90 6 C105 8, 115 18, 120 20" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                  <path d="M0 35 C20 33, 30 28, 45 22 C60 16, 75 4, 90 6 C105 8, 115 18, 120 20 L120 40 L0 40 Z" fill="currentColor" fillOpacity="0.08"></path>
                  <circle className="fill-[#dc2626]" cx="90" cy="6" r="3"></circle>
                </svg>
              </div>
            </div>
          </div>

          {/* Right Inspection Drawer (4 Cols) */}
          <aside className="lg:col-span-4 flex flex-col space-y-6 sticky top-[72px]">
            <div className="bg-white rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-5 border border-black/[0.06]">
              
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-black/[0.04]">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0071e3] uppercase tracking-wider">
                    <span>Active Inspector</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeRecord.risk === 'Extreme' ? 'bg-[#dc2626]' : 'bg-[#059669]'}`}></span>
                  </div>
                  <h2 className="text-[24px] font-semibold text-[#1d1d1f] tracking-tight mt-1" id="drawer-station-id">
                    {activeRecord.id}
                  </h2>
                  <p className="text-[13px] text-[#86868b]" id="drawer-ward-name">
                    {activeRecord.ward} • {activeRecord.zone}
                  </p>
                </div>
                <span className={getRiskTagClass(activeRecord.risk)} id="drawer-risk-tag">
                  {activeRecord.risk} Risk
                </span>
              </div>

              {/* Spatial Mini-Map Tile */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider">Geo-Spatial Centroid</span>
                <div className="w-full h-32 bg-[#f5f5f7] rounded-[20px] relative overflow-hidden flex items-end p-3 border border-black/[0.04]">
                  <div className="absolute inset-0 bg-[#0071e3]/[0.03] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0071e3]/30 text-[40px]">location_city</span>
                  </div>
                  <div className="relative z-10 flex items-center justify-between w-full">
                    <span className="font-mono text-[11px] text-[#1d1d1f] font-medium">{activeRecord.coords}</span>
                    <span className="text-[10px] uppercase px-2 py-0.5 rounded-[980px] bg-white text-[#1d1d1f] font-semibold shadow-xs">0.25km² Grid</span>
                  </div>
                </div>
              </div>

              {/* Microclimate Telemetry Specs */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">Radiative & Flux Metrics</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#f5f5f7] p-3 rounded-[16px]">
                    <span className="text-[11px] text-[#86868b] uppercase block">Air Temp</span>
                    <span className="text-[18px] font-semibold text-[#1d1d1f] tabular-nums" id="drawer-air-temp">
                      {activeRecord.airTemp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="bg-[#f5f5f7] p-3 rounded-[16px]">
                    <span className="text-[11px] text-[#86868b] uppercase block">Surface (LST)</span>
                    <span className="text-[18px] font-semibold text-[#dc2626] tabular-nums" id="drawer-lst-temp">
                      {activeRecord.lstTemp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="bg-[#f5f5f7] p-3 rounded-[16px]">
                    <span className="text-[11px] text-[#86868b] uppercase block">Solar Irradiance</span>
                    <span className="text-[14px] font-medium text-[#1d1d1f]">{activeRecord.solar}</span>
                  </div>
                  <div className="bg-[#f5f5f7] p-3 rounded-[16px]">
                    <span className="text-[11px] text-[#86868b] uppercase block">Wind Vector</span>
                    <span className="text-[14px] font-medium text-[#1d1d1f]">{activeRecord.wind}</span>
                  </div>
                  <div className="bg-[#f5f5f7] p-3 rounded-[16px]">
                    <span className="text-[11px] text-[#86868b] uppercase block">Emissivity</span>
                    <span className="text-[14px] font-medium text-[#1d1d1f]">{activeRecord.emissivity}</span>
                  </div>
                  <div className="bg-[#f5f5f7] p-3 rounded-[16px]">
                    <span className="text-[11px] text-[#86868b] uppercase block">Canopy Cover</span>
                    <span className="text-[14px] font-medium text-[#dc2626]">{activeRecord.canopy}</span>
                  </div>
                </div>
              </div>

              {/* Simulation Metadata */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block">Simulation Provenance</span>
                <div className="p-3.5 bg-[#f5f5f7] rounded-[16px] font-mono text-[11px] space-y-1.5 text-[#86868b]">
                  <div className="flex items-center justify-between">
                    <span>Engine:</span>
                    <span className="text-[#1d1d1f] font-medium">{activeRecord.engine}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Boundary:</span>
                    <span className="text-[#1d1d1f] font-medium">ERA5-Land 0.1°</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Citation SHA:</span>
                    <span className="text-[#0071e3] font-medium hover:underline cursor-pointer">{activeRecord.sha}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Timestamp:</span>
                    <span className="text-[#1d1d1f] font-medium">{activeRecord.timestamp} IST</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <button 
                  onClick={handleExportCSV}
                  className="flex-1 py-2.5 px-3 rounded-[980px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-[12px] font-medium transition-colors text-center"
                >
                  Export Point
                </button>
                <button 
                  onClick={() => alert(`Station ${activeRecord.id} lineage: Calibrated via Solapur 100-station sensory grid, WRF-UCM canopy engine seed 2024.`)}
                  className="flex-1 py-2.5 px-3 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[12px] font-medium transition-colors text-center shadow-[0_2px_8px_rgba(0,113,227,0.25)]"
                >
                  Lineage Details
                </button>
              </div>
            </div>

            {/* Academic Notice Card */}
            <div className="p-5 bg-white rounded-[24px] text-[#86868b] space-y-1.5 border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <div className="flex items-center gap-1.5 text-[#0071e3] font-medium text-[12px]">
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span className="uppercase tracking-wider">TF-141 Research Notice</span>
              </div>
              <p className="text-[12px] leading-relaxed">
                All coordinates correspond to synthetic grid centroids calibrated against historical IMD Solapur meteorological observations (1990–2020) for urban microclimate simulation.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
