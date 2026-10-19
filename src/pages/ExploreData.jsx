import React, { useState, useEffect } from 'react';
import { fetchExploreRecords } from '../services/heatmapService';

const SAMPLE_RECORDS = [
  {
    id: 'SLP-014',
    ward: 'Bhavani Peth',
    wardSub: 'Ward 14 (Old City Core)',
    zone: 'Commercial Dense',
    airTemp: 42.4,
    lstTemp: 49.8,
    rh: 28,
    risk: 'Extreme',
    timestamp: '2024-05-18 14:00',
    coords: '17.6599° N, 75.9064° E',
    solar: '912 W/m²',
    wind: '2.1 m/s NW',
    emissivity: '0.912 ε',
    canopy: '4.2% (Deficit)',
    engine: 'WRF-UCM v4.3',
    sha: 'e7f9a2b8...c14'
  },
  {
    id: 'SLP-028',
    ward: 'Ashok Chowk',
    wardSub: 'Junction Corridor North',
    zone: 'Transit Corridor',
    airTemp: 39.8,
    lstTemp: 45.1,
    rh: 31,
    risk: 'High',
    timestamp: '2024-05-18 14:00',
    coords: '17.6680° N, 75.9120° E',
    solar: '890 W/m²',
    wind: '2.4 m/s NW',
    emissivity: '0.908 ε',
    canopy: '7.8% (Deficit)',
    engine: 'WRF-UCM v4.3',
    sha: 'a4b8c190...f72'
  },
  {
    id: 'SLP-089',
    ward: 'MIDC Phase II',
    wardSub: 'Fabrication Quad 4',
    zone: 'Industrial Core',
    airTemp: 44.1,
    lstTemp: 53.2,
    rh: 22,
    risk: 'Extreme',
    timestamp: '2024-05-18 14:00',
    coords: '17.6890° N, 75.9420° E',
    solar: '945 W/m²',
    wind: '1.8 m/s W',
    emissivity: '0.885 ε',
    canopy: '3.1% (Critical)',
    engine: 'WRF-UCM v4.3',
    sha: 'c9d2e144...81b'
  },
  {
    id: 'SLP-042',
    ward: 'Saat Rasta',
    wardSub: 'Radial Hub Sector B',
    zone: 'Commercial Mixed',
    airTemp: 38.6,
    lstTemp: 43.7,
    rh: 34,
    risk: 'Moderate',
    timestamp: '2024-05-18 14:00',
    coords: '17.6640° N, 75.9080° E',
    solar: '860 W/m²',
    wind: '2.2 m/s NW',
    emissivity: '0.920 ε',
    canopy: '12.4% (Moderate)',
    engine: 'WRF-UCM v4.3',
    sha: 'd11a77e0...409'
  },
  {
    id: 'SLP-105',
    ward: 'Kegaon',
    wardSub: 'MIT Vishwaprayag Arb Net',
    zone: 'Canopy Park',
    airTemp: 33.9,
    lstTemp: 36.2,
    rh: 46,
    risk: 'Mitigated',
    timestamp: '2024-05-18 14:00',
    coords: '17.7012° N, 75.8611° E',
    solar: '780 W/m²',
    wind: '3.1 m/s W',
    emissivity: '0.965 ε',
    canopy: '44.8% (Optimal)',
    engine: 'WRF-UCM v4.3',
    sha: 'f482a101...99c'
  },
  {
    id: 'SLP-063',
    ward: 'Navi Peth',
    wardSub: 'Market Spine East',
    zone: 'Commercial Dense',
    airTemp: 41.8,
    lstTemp: 48.9,
    rh: 29,
    risk: 'Extreme',
    timestamp: '2024-05-18 14:00',
    coords: '17.6655° N, 75.9042° E',
    solar: '905 W/m²',
    wind: '1.9 m/s NW',
    emissivity: '0.910 ε',
    canopy: '5.4% (Deficit)',
    engine: 'WRF-UCM v4.3',
    sha: 'b8214f77...e3a'
  },
  {
    id: 'SLP-077',
    ward: 'Jule Solapur',
    wardSub: 'Block C Suburban',
    zone: 'Residential Moderate',
    airTemp: 36.7,
    lstTemp: 40.4,
    rh: 38,
    risk: 'Moderate',
    timestamp: '2024-05-18 14:00',
    coords: '17.6480° N, 75.8920° E',
    solar: '840 W/m²',
    wind: '2.6 m/s W',
    emissivity: '0.932 ε',
    canopy: '22.1% (Good)',
    engine: 'WRF-UCM v4.3',
    sha: '33e198a2...771'
  },
  {
    id: 'SLP-112',
    ward: 'Sambhaji Lake',
    wardSub: 'Riparian Heat Sink',
    zone: 'Riparian / Park',
    airTemp: 32.5,
    lstTemp: 34.8,
    rh: 58,
    risk: 'Mitigated',
    timestamp: '2024-05-18 14:00',
    coords: '17.6520° N, 75.9180° E',
    solar: '740 W/m²',
    wind: '2.8 m/s WNW',
    emissivity: '0.980 ε',
    canopy: '52.4% (Optimal)',
    engine: 'WRF-UCM v4.3',
    sha: '8910cd4a...012'
  }
];

export default function ExploreData() {
  const [search, setSearch] = useState('Solapur');
  const [selectedZone, setSelectedZone] = useState('All');
  const [selectedRisk, setSelectedRisk] = useState('All');
  const [minTemp, setMinTemp] = useState(30.0);
  const [maxTemp, setMaxTemp] = useState(48.0);
  const [selectedRecord, setSelectedRecord] = useState(SAMPLE_RECORDS[0]);
  const [isExporting, setIsExporting] = useState(false);
  const [page, setPage] = useState(1);

  // Filter records
  const filteredRecords = SAMPLE_RECORDS.filter((rec) => {
    const matchSearch = search.trim() === '' || 
      rec.id.toLowerCase().includes(search.toLowerCase()) ||
      rec.ward.toLowerCase().includes(search.toLowerCase()) ||
      rec.wardSub.toLowerCase().includes(search.toLowerCase()) ||
      rec.zone.toLowerCase().includes(search.toLowerCase());

    const matchZone = selectedZone === 'All' || rec.zone.toLowerCase().includes(selectedZone.toLowerCase());
    const matchRisk = selectedRisk === 'All' || rec.risk.toLowerCase().includes(selectedRisk.toLowerCase());
    const matchTemp = rec.airTemp >= minTemp && rec.airTemp <= maxTemp;

    return matchSearch && matchZone && matchRisk && matchTemp;
  });

  const activeRecord = selectedRecord || filteredRecords[0] || SAMPLE_RECORDS[0];

  const handleExportCSV = () => {
    setIsExporting(true);
    setTimeout(() => {
      const csvHeader = "Station_ID,Ward_Name,Sub_District,Zone_Classification,Air_Temp_C,Surface_LST_C,RH_Pct,Risk_Tier,Sim_Timestamp,Coordinates\n";
      const csvRows = filteredRecords.map(r => 
        `"${r.id}","${r.ward}","${r.wardSub}","${r.zone}",${r.airTemp},${r.lstTemp},${r.rh},"${r.risk}","${r.timestamp}","${r.coords}"`
      ).join("\n");
      
      const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `heatshield_telemetry_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
    }, 800);
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedZone('All');
    setSelectedRisk('All');
    setMinTemp(30.0);
    setMaxTemp(48.0);
    setPage(1);
  };

  const getRiskTagClass = (risk) => {
    const r = risk?.toLowerCase() || '';
    if (r.includes('extreme') || r.includes('high')) {
      return "px-2 py-0.5 rounded font-caption-caps text-caption-caps uppercase tracking-wide bg-error-container text-on-error-container font-semibold";
    }
    if (r.includes('moderate')) {
      return "px-2 py-0.5 rounded font-caption-caps text-caption-caps uppercase tracking-wide bg-surface-container-high text-on-surface-variant font-semibold";
    }
    return "px-2 py-0.5 rounded font-caption-caps text-caption-caps uppercase tracking-wide bg-primary-fixed text-on-primary-fixed-variant font-semibold";
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      
      {/* Top Academic Context Ribbon */}
      <div className="w-full bg-surface-container-low py-space-sm px-margin border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
              CORPUS: SYNTH-SOLAPUR-150K
            </span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span className="font-label-code text-label-code text-secondary font-medium">
              INDEXED HIERARCHY v2.4
            </span>
            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
            <span className="font-label-code text-label-code text-on-surface-variant">
              SEED: 0x9AF41B8
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="font-caption-caps text-caption-caps text-on-surface-variant uppercase">
              SYNCHRONIZATION: COMPLIANT WITH ERA5-LAND INTERPOLATION
            </span>
          </div>
        </div>
      </div>

      {/* Header & Executive Stats Strip */}
      <section className="w-full bg-surface px-margin pt-space-lg pb-space-md">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
          <div className="space-y-space-xs max-w-2xl">
            <div className="flex items-center gap-space-xs">
              <span className="font-caption-caps text-caption-caps uppercase text-secondary font-semibold tracking-wider">Repository Ledger</span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-code text-label-code text-on-surface-variant">TEL-150K-QUERY</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-semibold tracking-tight">Data Explorer</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Search, filter, inspect, and export the 150,000 environmental simulation records behind HeatShield.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center gap-space-sm">
            <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col min-w-[130px] border border-outline-variant/30">
              <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Filtered Subset</span>
              <span className="font-label-metric text-label-metric text-primary font-bold text-base mt-0.5" id="filtered-counter">
                {filteredRecords.length.toLocaleString()}
              </span>
              <span className="font-label-code text-[10px] text-secondary">
                {((filteredRecords.length / 150000) * 100).toFixed(2)}% of corpus
              </span>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col min-w-[130px] border border-outline-variant/30">
              <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Mean LST (Filtered)</span>
              <span className="font-label-metric text-label-metric text-tertiary-container font-bold text-base mt-0.5">
                42.8°C
              </span>
              <span className="font-label-code text-[10px] text-on-surface-variant">σ = ±2.3°C</span>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-lg shadow-sm flex flex-col min-w-[130px] border border-outline-variant/30">
              <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">High-Risk Canopy</span>
              <span className="font-label-metric text-label-metric text-error font-bold text-base mt-0.5">
                64.2%
              </span>
              <span className="font-label-code text-[10px] text-error">Critical threshold</span>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Controls & Search Surface */}
      <section className="w-full bg-surface px-margin pb-space-lg">
        <div className="max-w-[1400px] mx-auto bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-md items-end">
            
            {/* Search Keyword Input */}
            <div className="lg:col-span-4 space-y-1">
              <label className="font-caption-caps text-caption-caps uppercase text-on-surface-variant flex items-center justify-between">
                <span>Query Parameter</span>
                <span className="font-label-code text-on-surface-variant">STN / WARD / COORD</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">search</span>
                <input 
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by station ID, ward name, or coordinate..."
                  className="w-full pl-9 pr-3 py-2 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-container" 
                  id="search-input"
                />
              </div>
            </div>

            {/* Zone Multi-Filter */}
            <div className="lg:col-span-2 space-y-1">
              <label className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Urban Zone</label>
              <div className="relative">
                <select 
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full py-2 pl-3 pr-8 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-container appearance-none cursor-pointer"
                >
                  <option value="All">All Zones (9 categories)</option>
                  <option value="Commercial">Commercial Dense</option>
                  <option value="Industrial">Industrial Core</option>
                  <option value="Residential">Residential Moderate</option>
                  <option value="Canopy">Canopy Park & Buffer</option>
                  <option value="Transit">Transit Corridor</option>
                  <option value="Riparian">Riparian / Lake Buffer</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-on-surface-variant text-[18px]">expand_more</span>
              </div>
            </div>

            {/* Heat Risk Filter */}
            <div className="lg:col-span-2 space-y-1">
              <label className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Heat-Risk Tier</label>
              <div className="relative">
                <select 
                  value={selectedRisk}
                  onChange={(e) => setSelectedRisk(e.target.value)}
                  className="w-full py-2 pl-3 pr-8 bg-surface-container-low text-on-surface font-body-sm text-body-sm rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-container appearance-none cursor-pointer"
                >
                  <option value="All">All Risk Tiers (All)</option>
                  <option value="Mitigated">Mitigated (&lt; 34°C)</option>
                  <option value="Moderate">Moderate (34–38°C)</option>
                  <option value="High">High (39–43°C)</option>
                  <option value="Extreme">Extreme (&gt; 43°C)</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 top-2.5 pointer-events-none text-on-surface-variant text-[18px]">expand_more</span>
              </div>
            </div>

            {/* Date Range Slider / Date Selector */}
            <div className="lg:col-span-2 space-y-1">
              <label className="font-caption-caps text-caption-caps uppercase text-on-surface-variant flex items-center justify-between">
                <span>Temporal Envelope</span>
                <span className="font-label-code text-secondary font-medium">SIM-EPOCH</span>
              </label>
              <div className="flex items-center gap-1.5 py-1.5 px-2 bg-surface-container-low rounded-lg text-on-surface font-label-code text-label-code">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">calendar_today</span>
                <span>2021-01-01</span>
                <span className="text-outline-variant">→</span>
                <span>2025-05-31</span>
              </div>
            </div>

            {/* Export Action CTA */}
            <div className="lg:col-span-2 flex items-center justify-end">
              <button 
                type="button"
                onClick={handleExportCSV}
                disabled={isExporting}
                className="w-full inline-flex items-center justify-center gap-space-xs py-2 px-space-md rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-all duration-150 shadow-sm disabled:opacity-70"
              >
                <span className={`material-symbols-outlined text-[18px] ${isExporting ? 'animate-spin' : ''}`}>
                  {isExporting ? 'refresh' : 'download'}
                </span>
                <span className="font-medium whitespace-nowrap">
                  {isExporting ? 'Exporting...' : `Export CSV (${filteredRecords.length})`}
                </span>
              </button>
            </div>
          </div>

          {/* Advanced Metric Range & Tag Sliders Row */}
          <div className="mt-space-md pt-space-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md bg-surface-container-low/60 p-space-sm rounded-lg">
            <div className="flex flex-wrap items-center gap-space-md">
              <div className="flex items-center gap-space-sm">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Thermal Envelope:</span>
                <div className="flex items-center gap-2">
                  <span className="font-label-code text-label-code text-on-surface bg-surface-container px-2 py-0.5 rounded">
                    {minTemp.toFixed(1)}°C
                  </span>
                  <input 
                    type="range"
                    min="25.0"
                    max="50.0"
                    step="0.5"
                    value={maxTemp}
                    onChange={(e) => setMaxTemp(parseFloat(e.target.value))}
                    className="w-28 sm:w-36 h-1.5 accent-primary cursor-pointer"
                  />
                  <span className="font-label-code text-label-code text-on-surface bg-surface-container px-2 py-0.5 rounded">
                    {maxTemp.toFixed(1)}°C
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-space-xs">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Preserve Bounds:</span>
                <span className="px-2 py-0.5 rounded bg-surface text-secondary font-label-code text-label-code">
                  Diurnal Peak (12:00-16:00 IST)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm">
              <button 
                type="button"
                onClick={handleResetFilters}
                className="font-caption-caps text-caption-caps uppercase text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                <span>Reset Constraints</span>
              </button>
              <span className="text-outline-variant">|</span>
              <div className="flex items-center gap-1 text-on-surface-variant font-label-code text-label-code">
                <span className="w-2 h-2 rounded-full bg-secondary"></span>
                <span>Live Index Cache (12ms)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace: Data Ledger + Active Detail Drawer Preview */}
      <section className="w-full px-margin pb-space-xl">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
          
          {/* Primary Data Ledger (8 Columns on desktop) */}
          <div className="lg:col-span-8 flex flex-col space-y-space-md">
            
            {/* Table Frame Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden border border-outline-variant/30">
              
              {/* Table Toolbar Header */}
              <div className="p-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm bg-surface-container-lowest border-b border-outline-variant/20">
                <div className="flex items-center gap-space-sm">
                  <span className="font-headline-md text-headline-md text-on-surface font-semibold">Spatial Telemetry Stream</span>
                  <span className="font-label-code text-label-code bg-surface-container px-2 py-0.5 rounded text-on-surface-variant">BATCH #091-B</span>
                </div>
                <div className="flex items-center gap-space-xs">
                  <button className="px-2.5 py-1 text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container rounded font-label-code text-label-code flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-[15px]">filter_list</span>
                    <span>Column Projection</span>
                  </button>
                  <button className="px-2.5 py-1 text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container rounded font-label-code text-label-code flex items-center gap-1 transition-colors">
                    <span className="material-symbols-outlined text-[15px]">view_column</span>
                    <span>Density: Compact</span>
                  </button>
                </div>
              </div>

              {/* High-Density Scientific Data Table */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left font-body-md text-body-md border-collapse min-w-[760px]">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-caption-caps text-caption-caps uppercase tracking-wider select-none">
                      <th className="py-3 px-3 font-semibold">Station ID</th>
                      <th className="py-3 px-3 font-semibold">Location / Ward</th>
                      <th className="py-3 px-3 font-semibold">Zone Classification</th>
                      <th className="py-3 px-3 font-semibold text-right">Air Temp</th>
                      <th className="py-3 px-3 font-semibold text-right">Surface (LST)</th>
                      <th className="py-3 px-3 font-semibold text-right">RH (%)</th>
                      <th className="py-3 px-3 font-semibold text-center">Risk Tier</th>
                      <th className="py-3 px-3 font-semibold">Sim Timestamp</th>
                      <th className="py-3 px-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low">
                    {filteredRecords.map((r) => {
                      const isSelected = activeRecord.id === r.id;
                      return (
                        <tr 
                          key={r.id}
                          onClick={() => setSelectedRecord(r)}
                          className={`cursor-pointer transition-colors ${
                            isSelected 
                              ? 'bg-primary-fixed/20 hover:bg-primary-fixed/30' 
                              : 'hover:bg-surface-container-low/70'
                          }`}
                        >
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-label-code text-label-code bg-surface-container text-primary px-2 py-0.5 rounded font-semibold inline-flex items-center gap-1">
                              <span className={`w-1.5 h-1.5 rounded-full ${r.risk === 'Extreme' ? 'bg-error' : r.risk === 'High' ? 'bg-on-tertiary-container' : 'bg-secondary'}`}></span>
                              {r.id}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-medium text-on-surface">
                            {r.ward}
                            <span className="block font-caption-caps text-caption-caps text-on-surface-variant">{r.wardSub}</span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="font-caption-caps text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                              {r.zone}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="inline-flex items-center justify-end gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${r.airTemp >= 42 ? 'bg-error' : r.airTemp >= 38 ? 'bg-on-tertiary-container' : 'bg-secondary'}`}></span>
                              <span className="font-label-metric text-label-metric font-semibold text-tertiary">{r.airTemp.toFixed(1)}°C</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-label-metric text-label-metric font-bold text-tertiary-container">
                            {r.lstTemp.toFixed(1)}°C
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-label-metric text-label-metric text-on-surface-variant">
                            {r.rh}%
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className={getRiskTagClass(r.risk)}>
                              {r.risk}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap font-label-code text-label-code text-on-surface-variant">
                            {r.timestamp}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <button 
                              onClick={(e) => { e.stopPropagation(); setSelectedRecord(r); }}
                              className={`px-2 py-1 font-caption-caps text-caption-caps uppercase rounded transition-colors inline-flex items-center gap-0.5 ${
                                isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface hover:bg-surface-variant'
                              }`}
                            >
                              <span>Inspect</span>
                              <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Bottom Table Pagination Bar */}
              <div className="p-space-md bg-surface-container-lowest flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-t border-outline-variant/20">
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Showing <span className="font-semibold text-on-surface">1–{filteredRecords.length}</span> of <span className="font-semibold text-on-surface">{filteredRecords.length}</span> matching simulation observations (150,000 total in repository)
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container disabled:opacity-40 transition-colors" disabled>
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                  </button>
                  <button className="px-2.5 py-1 rounded bg-primary-container text-on-primary font-label-code text-label-code font-semibold">1</button>
                  <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface font-label-code text-label-code hover:bg-surface-container transition-colors">2</button>
                  <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface font-label-code text-label-code hover:bg-surface-container transition-colors">3</button>
                  <span className="px-1 text-on-surface-variant font-label-code text-label-code">...</span>
                  <button className="px-2.5 py-1 rounded bg-surface-container-low text-on-surface font-label-code text-label-code hover:bg-surface-container transition-colors">124</button>
                  <button className="p-1 rounded bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Analytical Sparkline / Micro Distribution Card */}
            <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-outline-variant/30">
              <div className="space-y-1">
                <div className="flex items-center gap-space-xs">
                  <span className="font-caption-caps text-caption-caps uppercase text-secondary font-semibold">Distribution Analysis</span>
                  <span className="text-outline-variant">•</span>
                  <span className="font-label-code text-label-code text-on-surface-variant">Solapur Urban Heat Islands (UHI)</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Thermal clustering peaks at 14:30 IST along high albedo asphalt corridors with building height-to-street aspect ratios &lt; 0.6.
                </p>
              </div>
              
              {/* Micro Sparkline SVG */}
              <div className="flex items-center gap-space-md shrink-0">
                <div className="flex flex-col items-end">
                  <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Peak Gradient</span>
                  <span className="font-label-metric text-label-metric text-tertiary-container font-semibold">+8.4°C vs Rural</span>
                </div>
                <svg className="w-32 h-10 text-primary-container" fill="none" viewBox="0 0 120 40">
                  <path d="M0 35 C20 33, 30 28, 45 22 C60 16, 75 4, 90 6 C105 8, 115 18, 120 20" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
                  <path d="M0 35 C20 33, 30 28, 45 22 C60 16, 75 4, 90 6 C105 8, 115 18, 120 20 L120 40 L0 40 Z" fill="currentColor" fillOpacity="0.08"></path>
                  <circle className="fill-error" cx="90" cy="6" r="3"></circle>
                </svg>
              </div>
            </div>
          </div>

          {/* Detail Inspection Drawer (Active Preview State: 4 Columns) */}
          <aside className="lg:col-span-4 flex flex-col space-y-space-md sticky top-[92px]">
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm space-y-space-md border border-outline-variant/30">
              
              {/* Drawer Header */}
              <div className="flex items-start justify-between gap-space-sm pb-space-sm border-b border-outline-variant/20">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="font-caption-caps text-caption-caps uppercase text-secondary font-semibold">Active Inspector</span>
                    <span className={`w-1.5 h-1.5 rounded-full ${activeRecord.risk === 'Extreme' ? 'bg-error' : 'bg-secondary'}`}></span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-primary font-semibold mt-0.5" id="drawer-station-id">
                    {activeRecord.id}
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant" id="drawer-ward-name">
                    {activeRecord.ward} • {activeRecord.zone}
                  </p>
                </div>
                <span className={getRiskTagClass(activeRecord.risk)} id="drawer-risk-tag">
                  {activeRecord.risk} Risk
                </span>
              </div>

              {/* Spatial Mini-Map Tile */}
              <div className="space-y-1">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Geo-Spatial Footprint</span>
                <div className="w-full h-36 bg-surface-container-high rounded-lg shadow-sm relative overflow-hidden flex items-end p-space-sm">
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[36px] opacity-70">location_city</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-space-sm">
                    <div className="flex items-center justify-between w-full">
                      <span className="font-label-code text-[10px] text-surface font-medium">{activeRecord.coords}</span>
                      <span className="font-caption-caps text-[9px] uppercase px-1.5 py-0.5 rounded bg-surface/90 text-primary font-semibold">Grid 0.25km²</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Microclimate Telemetry Spec Ledger */}
              <div className="space-y-space-xs">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant block">Radiative &amp; Flux Metrics</span>
                <div className="grid grid-cols-2 gap-space-xs">
                  <div className="bg-surface-container-low p-2 rounded">
                    <span className="font-caption-caps text-caption-caps text-on-surface-variant uppercase block">Air Temp</span>
                    <span className="font-label-metric text-label-metric font-bold text-tertiary" id="drawer-air-temp">
                      {activeRecord.airTemp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-2 rounded">
                    <span className="font-caption-caps text-caption-caps text-on-surface-variant uppercase block">Surface (LST)</span>
                    <span className="font-label-metric text-label-metric font-bold text-tertiary-container" id="drawer-lst-temp">
                      {activeRecord.lstTemp.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="bg-surface-container-low p-2 rounded">
                    <span className="font-caption-caps text-caption-caps text-on-surface-variant uppercase block">Solar Irradiance</span>
                    <span className="font-label-metric text-label-metric font-medium text-on-surface">{activeRecord.solar}</span>
                  </div>
                  <div className="bg-surface-container-low p-2 rounded">
                    <span className="font-caption-caps text-caption-caps text-on-surface-variant uppercase block">Wind Vector</span>
                    <span className="font-label-metric text-label-metric font-medium text-on-surface">{activeRecord.wind}</span>
                  </div>
                  <div className="bg-surface-container-low p-2 rounded">
                    <span className="font-caption-caps text-caption-caps text-on-surface-variant uppercase block">Surface Emissivity</span>
                    <span className="font-label-metric text-label-metric font-medium text-on-surface">{activeRecord.emissivity}</span>
                  </div>
                  <div className="bg-surface-container-low p-2 rounded">
                    <span className="font-caption-caps text-caption-caps text-on-surface-variant uppercase block">Canopy Cover</span>
                    <span className="font-label-metric text-label-metric font-medium text-error">{activeRecord.canopy}</span>
                  </div>
                </div>
              </div>

              {/* Scientific Provenance & Run Metadata */}
              <div className="space-y-space-xs pt-space-xs">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant block">Simulation Run Metadata</span>
                <div className="p-space-sm bg-surface-container-low rounded font-label-code text-[11px] space-y-1 text-on-surface-variant">
                  <div className="flex items-center justify-between">
                    <span>Model Engine:</span>
                    <span className="text-on-surface font-medium">{activeRecord.engine}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Boundary Layer:</span>
                    <span className="text-on-surface font-medium">ERA5-Land 0.1°</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Citation SHA:</span>
                    <span className="text-primary font-medium hover:underline cursor-pointer">{activeRecord.sha}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Run Timestamp:</span>
                    <span className="text-on-surface font-medium">{activeRecord.timestamp} IST</span>
                  </div>
                </div>
              </div>

              {/* Drawer Action Options */}
              <div className="flex items-center gap-space-xs pt-space-xs">
                <button 
                  onClick={handleExportCSV}
                  className="flex-1 py-2 px-space-sm rounded bg-surface-container-high hover:bg-surface-variant text-on-surface font-body-sm text-body-sm transition-colors text-center font-medium"
                >
                  Raw NetCDF Point
                </button>
                <button 
                  onClick={() => alert(`Station ${activeRecord.id} lineage: Calibrated via Solapur 100-station sensory grid, WRF-UCM canopy engine seed 2024.`)}
                  className="flex-1 py-2 px-space-sm rounded bg-primary-container text-on-primary hover:bg-primary font-body-sm text-body-sm transition-colors text-center font-medium"
                >
                  Simulation Lineage
                </button>
              </div>
            </div>

            {/* Academic Provenance Info Card */}
            <div className="p-space-md bg-surface-container-low rounded-xl text-on-surface-variant space-y-space-xs border border-outline-variant/30">
              <div className="flex items-center gap-space-xs text-primary font-medium">
                <span className="material-symbols-outlined text-[16px]">school</span>
                <span className="font-caption-caps text-caption-caps uppercase">TF-141 Research Notice</span>
              </div>
              <p className="font-body-sm text-body-sm">
                All coordinates correspond to synthetic grid centroids calibrated against historical IMD Solapur meteorological observations (1990–2020) for spatial heat resilience evaluation.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
