import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  fetchDashboardSummary, 
  fetchAvailableDates 
} from '../services/heatmapService';
import { 
  MONTHLY_TRENDS, 
  ZONE_COMPARISON, 
  RECENT_TREND_SERIES 
} from '../data/dashboardData';

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState('May 2024 (Summer Peak Cycle)');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedMetric, setSelectedMetric] = useState('air_lst');
  const [confidenceInterval, setConfidenceInterval] = useState('p95');
  const [activeTab, setActiveTab] = useState('diurnal'); // 'diurnal' | 'longitudinal'
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const summ = await fetchDashboardSummary('2024-05-24', selectedZone);
        setSummary(summ);
      } catch (err) {
        console.error('Failed to load telemetry summary', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedZone]);

  const handleResetFilters = () => {
    setSelectedDate('May 2024 (Summer Peak Cycle)');
    setSelectedZone('all');
    setSelectedMetric('air_lst');
    setConfidenceInterval('p95');
  };

  const handleExportCSV = () => {
    const csvHeader = "Zone_Classification,Air_Temp_Mean_C,Surface_LST_Mean_C,NDVI_Mean,Cooling_Priority_Score,Total_Observations,Data_Provenance\n";
    const csvRows = ZONE_COMPARISON.map(z => 
      `"${z.zone}",${z.air_temperature},${z.land_surface_temp},${z.ndvi},${z.cooling_priority_score},${z.observations},"Calibrated WRF-Chem/ERA5-Land Solapur Simulation"`
    ).join("\n");

    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvHeader + csvRows);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `solapur_heat_analytics_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Exported Solapur master analytics ledger (150,000 observations) to CSV.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  const meanAir = summary?.meanAirTemp || 34.6;
  const peakAir = summary?.maxAirTemp || 43.8;
  const meanLst = summary?.meanLST || 46.2;
  const uhiAnomaly = summary?.uhiAnomalyMean > 0 
    ? `+${summary?.uhiAnomalyMean}` 
    : (summary?.uhiAnomalyMean || '+4.8');

  return (
    <div className="flex flex-col w-full bg-white pb-24">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 flex flex-col gap-10">
        
        {/* Page Header & Academic Coordinate Marker */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[#6e6e73]">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-[#86868b]">
                Spatial Analytical Module • TF-141
              </span>
              <span>•</span>
              <span className="font-mono text-[11px] text-[#0071e3]">
                17.6599° N · 75.9064° E
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-[#1d1d1f] tracking-tight">
              Heat Analytics
            </h1>
            <p className="text-[16px] text-[#6e6e73] max-w-2xl leading-relaxed">
              Explore diurnal temperature gradients, land-surface radiation anomalies, and microclimate mitigation vectors across the Solapur study area (2021–2025 synthetic dataset).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#f5f5f7] px-4 py-2 rounded-full border border-black/[0.04] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#059669] text-[18px]">verified</span>
              <div className="flex flex-col leading-none">
                <span className="text-[9px] uppercase tracking-wider text-[#86868b] font-medium">Model</span>
                <span className="font-mono text-[11px] text-[#1d1d1f] font-semibold mt-0.5">SYNTH-SOLAPUR-V2.4</span>
              </div>
            </div>

            <button 
              onClick={handleExportCSV}
              className="bg-[#0071e3] hover:bg-[#0076df] active:scale-[0.98] text-white px-5 h-[38px] rounded-full text-[13px] font-medium flex items-center gap-1.5 transition-all shadow-sm"
              id="exportLedgerBtn"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Scientific Filter Toolbar (Apple Card Container) */}
        <div className="bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
              
              {/* Filter 1: Range Picker */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">Observation Window</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#86868b] text-[16px] pointer-events-none">calendar_month</span>
                  <select 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium text-[13px] pl-9 pr-8 py-2.5 rounded-full appearance-none cursor-pointer focus:outline-none transition-colors border border-black/[0.04]"
                  >
                    <option value="May 2024 (Summer Peak Cycle)">May 2024 (Summer Peak Cycle)</option>
                    <option value="April 2024 (Pre-Monsoon Surge)">April 2024 (Pre-Monsoon Surge)</option>
                    <option value="June 2024 (Equatorial Transition)">June 2024 (Equatorial Transition)</option>
                    <option value="Multi-Year Aggregate (2021–2025)">Multi-Year Aggregate (2021–2025)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 text-[#86868b] text-[16px] pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Filter 2: Zone Dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">Spatial Partition</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#86868b] text-[16px] pointer-events-none">grid_view</span>
                  <select 
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium text-[13px] pl-9 pr-8 py-2.5 rounded-full appearance-none cursor-pointer focus:outline-none transition-colors border border-black/[0.04]" 
                    id="zoneFilter"
                  >
                    <option value="all">All 9 Urban Zones (Selected)</option>
                    <option value="midc">MIDC Industrial Corridor</option>
                    <option value="navi-peth">Navi Peth Dense Core</option>
                    <option value="bhavani-peth">Bhavani Peth High Density</option>
                    <option value="ashok-chowk">Ashok Chowk Commercial</option>
                    <option value="kegaon">Kegaon Semi-Arid Fringe</option>
                    <option value="siddheshwar">Siddheshwar Lake Oasis</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 text-[#86868b] text-[16px] pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Filter 3: Metric Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">Comparison Metric</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#86868b] text-[16px] pointer-events-none">thermostat</span>
                  <select 
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium text-[13px] pl-9 pr-8 py-2.5 rounded-full appearance-none cursor-pointer focus:outline-none transition-colors border border-black/[0.04]"
                  >
                    <option value="air_lst">Air Temp (°C) vs Surface Temp (LST)</option>
                    <option value="wbgt">Wet Bulb Globe Temperature (WBGT)</option>
                    <option value="heat_index">Thermal Heat Index (HI-NOAA)</option>
                    <option value="canopy_factor">Vegetation Canopy Dampening</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 text-[#86868b] text-[16px] pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Filter 4: Simulation Confidence */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">Confidence Interval</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3 text-[#86868b] text-[16px] pointer-events-none">tune</span>
                  <select 
                    value={confidenceInterval}
                    onChange={(e) => setConfidenceInterval(e.target.value)}
                    className="w-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] font-medium text-[13px] pl-9 pr-8 py-2.5 rounded-full appearance-none cursor-pointer focus:outline-none transition-colors border border-black/[0.04]"
                  >
                    <option value="p95">P95 Confidence Interval (σ = ±0.34)</option>
                    <option value="p99">P99 Strict Boundary (σ = ±0.48)</option>
                    <option value="p50">P50 Median Deterministic</option>
                    <option value="raw">Raw Station Telemetry Aggregate</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 text-[#86868b] text-[16px] pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <div className="flex items-end pt-2 lg:pt-0">
              <button 
                onClick={handleResetFilters}
                className="w-full lg:w-auto bg-[#f5f5f7] hover:bg-[#e8e8ed] active:scale-[0.98] text-[#1d1d1f] px-5 py-2.5 rounded-full text-[12px] uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5 transition-all border border-black/[0.04]" 
                id="resetFiltersBtn"
              >
                <span className="material-symbols-outlined text-[15px]">restart_alt</span>
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Apple-Grade KPI Cards (28px radius, tabular numbers) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* KPI 1: Mean Air */}
          <div className="bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">
                Mean Air Temperature
              </span>
              <span className="bg-[#059669]/10 text-[#059669] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                P95 μ
              </span>
            </div>
            <div className="flex flex-col my-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl lg:text-4xl font-semibold text-[#1d1d1f] tracking-tight tabular-nums">
                  {meanAir}
                </span>
                <span className="text-[15px] font-normal text-[#6e6e73]">°C</span>
              </div>
              <p className="text-[12px] text-[#6e6e73] mt-1">
                <span className="text-[#059669] font-medium">±0.4°C</span> variance vs baseline
              </p>
            </div>
            <div className="w-full bg-[#f5f5f7] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#059669] h-full rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* KPI 2: Peak Air */}
          <div className="bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">
                Peak Air Temperature
              </span>
              <span className="bg-[#dc2626]/10 text-[#dc2626] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                CRITICAL
              </span>
            </div>
            <div className="flex flex-col my-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl lg:text-4xl font-semibold text-[#dc2626] tracking-tight tabular-nums">
                  {peakAir}
                </span>
                <span className="text-[15px] font-normal text-[#6e6e73]">°C</span>
              </div>
              <p className="text-[12px] text-[#6e6e73] mt-1">
                Observed in MIDC Heavy Sector
              </p>
            </div>
            <div className="w-full bg-[#f5f5f7] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#dc2626] h-full rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
            </div>
          </div>

          {/* KPI 3: Mean LST */}
          <div className="bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">
                Land Surface Skin (LST)
              </span>
              <span className="bg-[#ea580c]/10 text-[#ea580c] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                THERMAL
              </span>
            </div>
            <div className="flex flex-col my-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl lg:text-4xl font-semibold text-[#1d1d1f] tracking-tight tabular-nums">
                  {meanLst}
                </span>
                <span className="text-[15px] font-normal text-[#6e6e73]">°C</span>
              </div>
              <p className="text-[12px] text-[#6e6e73] mt-1">
                Impervious asphalt radiative skin
              </p>
            </div>
            <div className="w-full bg-[#f5f5f7] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ea580c] h-full rounded-full transition-all duration-500" style={{ width: '78%' }}></div>
            </div>
          </div>

          {/* KPI 4: UHI Delta */}
          <div className="bg-white rounded-[28px] p-6 border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between gap-4">
            <div className="flex items-start justify-between">
              <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">
                Urban Heat Island Delta
              </span>
              <span className="bg-[#0071e3]/10 text-[#0071e3] px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold">
                UHI Δ
              </span>
            </div>
            <div className="flex flex-col my-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl lg:text-4xl font-semibold text-[#ea580c] tracking-tight tabular-nums">
                  {uhiAnomaly}
                </span>
                <span className="text-[15px] font-normal text-[#6e6e73]">°C</span>
              </div>
              <p className="text-[12px] text-[#6e6e73] mt-1">
                Urban core vs rural vegetative buffer
              </p>
            </div>
            <div className="w-full bg-[#f5f5f7] h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#ea580c] h-full rounded-full transition-all duration-500" style={{ width: '84%' }}></div>
            </div>
          </div>
        </div>

        {/* Tabbed Interactive Time Series Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Apple Segmented Control */}
            <div className="inline-flex p-1 rounded-full bg-[#f5f5f7] border border-black/[0.04]">
              <button
                type="button"
                onClick={() => setActiveTab('diurnal')}
                className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  activeTab === 'diurnal'
                    ? 'bg-white text-[#1d1d1f] shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Diurnal Microclimate Cycle (24h)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('longitudinal')}
                className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  activeTab === 'longitudinal'
                    ? 'bg-white text-[#1d1d1f] shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Longitudinal Multi-Day Progression (2024)
              </button>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-[#86868b]">
              <span>HOURLY SAMPLING: 60 MIN</span>
              <span>•</span>
              <span className="text-[#059669]">SIGMA: ±0.34°C</span>
            </div>
          </div>

          {activeTab === 'diurnal' ? (
            /* Diurnal Cycle Chart (Apple Card) */
            <div className="bg-white rounded-[28px] p-6 lg:p-8 border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-black/[0.06]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">
                    Diurnal Thermal Gradients
                  </span>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight mt-0.5">
                    Solapur Diurnal Microclimate Curves (00:00 – 24:00 IST)
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#6e6e73]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
                    Siddheshwar Lake Canopy
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#0071e3]"></span>
                    Residential West
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]"></span>
                    Navi Peth Commercial
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span>
                    MIDC Industrial Peak
                  </span>
                </div>
              </div>

              {/* Responsive SVG Diurnal Visualizer */}
              <div className="w-full overflow-x-auto">
                <div className="min-w-[700px]">
                  <svg className="w-full h-auto text-[#1d1d1f] font-mono select-none" viewBox="0 0 1000 370">
                    {/* Y-Axis Horizontal Grid Lines */}
                    <line className="text-black/[0.04]" stroke="currentColor" strokeWidth="1" x1="60" x2="940" y1="30" y2="30"></line>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="end" x="50" y="34">46°C</text>
                    <line className="text-black/[0.04]" stroke="currentColor" strokeWidth="1" x1="60" x2="940" y1="90" y2="90"></line>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="end" x="50" y="94">41°C</text>
                    <line className="text-black/[0.04]" stroke="currentColor" strokeWidth="1" x1="60" x2="940" y1="150" y2="150"></line>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="end" x="50" y="154">36°C</text>
                    <line className="text-black/[0.04]" stroke="currentColor" strokeWidth="1" x1="60" x2="940" y1="210" y2="210"></line>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="end" x="50" y="214">31°C</text>
                    <line className="text-black/[0.04]" stroke="currentColor" strokeWidth="1" x1="60" x2="940" y1="270" y2="270"></line>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="end" x="50" y="274">26°C</text>
                    <line className="text-black/[0.08]" stroke="currentColor" strokeWidth="1" x1="60" x2="940" y1="330" y2="330"></line>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="end" x="50" y="334">21°C</text>

                    {/* X-Axis Time Ticks */}
                    <text className="text-[11px] fill-[#86868b]" textAnchor="middle" x="60" y="352">00:00</text>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="middle" x="170" y="352">03:00</text>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="middle" x="280" y="352">06:00</text>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="middle" x="390" y="352">09:00</text>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="middle" x="500" y="352">12:00</text>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="middle" x="610" y="352">15:00</text>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="middle" x="720" y="352">18:00</text>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="middle" x="830" y="352">21:00</text>
                    <text className="text-[11px] fill-[#86868b]" textAnchor="middle" x="940" y="352">24:00</text>

                    {/* Thermal Curves */}
                    {/* 1. Lake Canopy (Green) */}
                    <path className="text-[#059669]" d="M 60,300 C 120,318 200,332 280,330 C 340,320 440,225 500,198 C 550,178 580,174 610,177 C 670,185 700,205 720,217 C 770,245 800,265 830,273 C 890,290 920,300 940,303" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                    
                    {/* 2. Residential West (Blue) */}
                    <path className="text-[#0071e3]" d="M 60,262 C 120,280 200,297 280,297 C 340,285 440,180 500,150 C 560,120 580,114 610,117 C 670,125 700,150 720,165 C 770,195 800,208 830,213 C 890,230 920,242 940,247" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                    
                    {/* 3. Navi Peth Commercial (Orange) */}
                    <path className="text-[#ea580c]" d="M 60,204 C 120,225 200,245 280,243 C 340,225 440,115 500,87 C 560,60 580,48 610,52 C 670,60 700,85 720,96 C 770,120 800,135 830,142 C 890,165 920,175 940,183" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                    
                    {/* 4. MIDC Industrial (Crimson) */}
                    <path className="text-[#dc2626]" d="M 60,183 C 120,205 200,235 280,234 C 340,210 440,90 500,63 C 560,35 580,28 610,33 C 670,45 700,65 720,75 C 770,100 800,112 830,120 C 890,145 920,155 940,162" fill="none" stroke="currentColor" strokeWidth="3"></path>

                    {/* Peak Point on MIDC */}
                    <circle className="text-[#dc2626]" cx="610" cy="33" fill="currentColor" r="5"></circle>
                    <circle className="text-[#dc2626] opacity-30" cx="610" cy="33" fill="none" stroke="currentColor" strokeWidth="2"></circle>

                    {/* Tooltip Anchor */}
                    <g transform="translate(625, 20)">
                      <rect className="text-[#1d1d1f] shadow-md" fill="currentColor" height="46" rx="8" width="160" x="0" y="0"></rect>
                      <text className="text-[10px] font-semibold fill-white uppercase" x="10" y="18">MIDC PEAK RECORD</text>
                      <text className="text-[12px] font-bold fill-[#ea580c]" x="10" y="34">43.8°C (14:30 IST)</text>
                      <text className="text-[9px] fill-[#86868b]" x="115" y="34">Δ +9.6°C</text>
                    </g>
                  </svg>
                </div>
              </div>

              {/* Diurnal Insights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-[13px] text-[#6e6e73]">
                <div className="bg-[#f5f5f7] rounded-2xl p-4 flex items-start gap-3 border border-black/[0.03]">
                  <span className="material-symbols-outlined text-[#ea580c] text-[20px] shrink-0">wb_sunny</span>
                  <div>
                    <span className="font-semibold text-[#1d1d1f] block mb-0.5">Solar Noon Surge (11:00–14:00)</span>
                    Asphalt and unshaded masonry in MIDC heat at 2.4× the rate of vegetated parcels.
                  </div>
                </div>
                <div className="bg-[#f5f5f7] rounded-2xl p-4 flex items-start gap-3 border border-black/[0.03]">
                  <span className="material-symbols-outlined text-[#0071e3] text-[20px] shrink-0">nightlight</span>
                  <div>
                    <span className="font-semibold text-[#1d1d1f] block mb-0.5">Thermal Retention Lag (19:00–23:00)</span>
                    Dense commercial fabric retains radiative heat into late twilight, delaying restorative cooling.
                  </div>
                </div>
                <div className="bg-[#f5f5f7] rounded-2xl p-4 flex items-start gap-3 border border-black/[0.03]">
                  <span className="material-symbols-outlined text-[#059669] text-[20px] shrink-0">park</span>
                  <div>
                    <span className="font-semibold text-[#1d1d1f] block mb-0.5">Canopy Oasis Efficiency</span>
                    Siddheshwar Lake vegetated zone exhibits rapid nocturnal cooling, dropping below 26°C by 23:00.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Longitudinal Time Series Chart */
            <div className="bg-white rounded-[28px] p-6 lg:p-8 border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/[0.06] pb-4">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">
                    Longitudinal Continuum • 2024 Cycle
                  </span>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight mt-0.5">
                    Daily Ambient Air &amp; Land Surface Skin (LST) Progression
                  </h3>
                </div>
                <span className="font-mono text-[11px] text-[#86868b]">
                  Daily Mean Telemetry (°C)
                </span>
              </div>

              <div className="h-[340px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={RECENT_TREND_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0071e3" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#0071e3" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="colorLST" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ea580c" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#ea580c" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#86868b" 
                      tick={{ fontSize: 11, fill: '#6e6e73' }} 
                      tickFormatter={(val) => (typeof val === 'string' ? val.slice(5) : val)} 
                    />
                    <YAxis 
                      stroke="#86868b" 
                      domain={[15, 52]} 
                      tick={{ fontSize: 11, fill: '#6e6e73' }} 
                      unit="°C"
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white/95 backdrop-blur-xl p-3.5 rounded-2xl border border-black/[0.08] shadow-xl text-xs font-mono">
                              <span className="font-semibold text-[#1d1d1f] block mb-1.5">{label}</span>
                              {payload.map((entry, index) => (
                                <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
                                  <span className="text-[#6e6e73]">{entry.name}:</span>
                                  <span className="font-bold text-[#1d1d1f] tabular-nums">{entry.value} °C</span>
                                </div>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }} 
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area
                      type="monotone"
                      dataKey="air_temp"
                      name="Mean Ambient Air (T_air)"
                      stroke="#0071e3"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAir)"
                    />
                    <Area
                      type="monotone"
                      dataKey="surface_temp"
                      name="Land Surface Temp (LST)"
                      stroke="#ea580c"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorLST)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                Noticeable thermal relaxation occurs during the late June monsoon onset, contrasting the pre-monsoon summer apex in April and May where radiative skin regularly exceeded 48°C.
              </p>
            </div>
          )}
        </div>

        {/* 2-Column Secondary Visualizations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Scatter Plot Card */}
          <div className="bg-white rounded-[28px] p-6 lg:p-8 border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">Cross-Correlation Model</span>
                <span className="font-mono text-[11px] text-[#0071e3] bg-[#0071e3]/10 px-2.5 py-0.5 rounded-full font-semibold">
                  R² = 0.884 • 100 SENSORS
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight mt-1 mb-1">
                Air Temp vs. Land Surface Temp (LST)
              </h3>
              <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                Thermal inertia across 100 stations. Impervious surface fraction drives non-linear surface warming.
              </p>
            </div>

            {/* Scatter SVG */}
            <div className="w-full bg-[#f5f5f7] rounded-2xl p-4 overflow-x-auto border border-black/[0.03]">
              <svg className="w-full h-auto text-[#1d1d1f] font-mono select-none min-w-[420px]" viewBox="0 0 500 280">
                <line className="text-black/[0.04]" stroke="currentColor" strokeDasharray="2 3" strokeWidth="1" x1="50" x2="480" y1="20" y2="20"></line>
                <text className="text-[10px] fill-[#86868b]" textAnchor="end" x="42" y="24">52°C</text>
                <line className="text-black/[0.04]" stroke="currentColor" strokeDasharray="2 3" strokeWidth="1" x1="50" x2="480" y1="80" y2="80"></line>
                <text className="text-[10px] fill-[#86868b]" textAnchor="end" x="42" y="84">44°C</text>
                <line className="text-black/[0.04]" stroke="currentColor" strokeDasharray="2 3" strokeWidth="1" x1="50" x2="480" y1="140" y2="140"></line>
                <text className="text-[10px] fill-[#86868b]" textAnchor="end" x="42" y="144">36°C</text>
                <line className="text-black/[0.04]" stroke="currentColor" strokeDasharray="2 3" strokeWidth="1" x1="50" x2="480" y1="200" y2="200"></line>
                <text className="text-[10px] fill-[#86868b]" textAnchor="end" x="42" y="204">28°C</text>
                <line className="text-black/[0.08]" stroke="currentColor" strokeWidth="1" x1="50" x2="480" y1="240" y2="240"></line>
                
                <text className="text-[10px] fill-[#86868b]" textAnchor="middle" x="60" y="258">28°C</text>
                <text className="text-[10px] fill-[#86868b]" textAnchor="middle" x="160" y="258">32°C</text>
                <text className="text-[10px] fill-[#86868b]" textAnchor="middle" x="260" y="258">36°C</text>
                <text className="text-[10px] fill-[#86868b]" textAnchor="middle" x="360" y="258">40°C</text>
                <text className="text-[10px] fill-[#86868b]" textAnchor="middle" x="460" y="258">44°C</text>
                <text className="text-[9px] fill-[#1d1d1f] font-semibold uppercase" textAnchor="middle" x="260" y="275">Ambient Air Temperature (T_air)</text>
                
                {/* Regression Line */}
                <line className="text-[#ea580c]" stroke="currentColor" strokeWidth="2" x1="70" x2="465" y1="215" y2="35"></line>
                
                {/* Scatter Points */}
                <circle className="text-[#059669] opacity-80" cx="85" cy="208" fill="currentColor" r="3.5"></circle>
                <circle className="text-[#059669] opacity-80" cx="110" cy="190" fill="currentColor" r="3.5"></circle>
                <circle className="text-[#059669] opacity-80" cx="140" cy="178" fill="currentColor" r="3.5"></circle>
                
                <circle className="text-[#0071e3] opacity-80" cx="185" cy="162" fill="currentColor" r="3.5"></circle>
                <circle className="text-[#0071e3] opacity-80" cx="220" cy="148" fill="currentColor" r="3.5"></circle>
                <circle className="text-[#0071e3] opacity-80" cx="255" cy="142" fill="currentColor" r="3.5"></circle>
                
                <circle className="text-[#ea580c] opacity-85" cx="288" cy="132" fill="currentColor" r="3.5"></circle>
                <circle className="text-[#ea580c] opacity-85" cx="320" cy="108" fill="currentColor" r="3.5"></circle>
                <circle className="text-[#ea580c] opacity-85" cx="360" cy="85" fill="currentColor" r="3.5"></circle>
                
                <circle className="text-[#dc2626] opacity-90" cx="410" cy="55" fill="currentColor" r="4"></circle>
                <circle className="text-[#dc2626] opacity-90" cx="445" cy="40" fill="currentColor" r="4.5"></circle>
                <circle className="text-[#dc2626] opacity-90" cx="455" cy="36" fill="currentColor" r="5"></circle>
                
                <text className="text-[11px] font-bold fill-[#1d1d1f]" x="65" y="45">LST = 1.28 × T_air - 6.42</text>
                <text className="text-[10px] fill-[#86868b]" x="65" y="60">Sensory variance: ±1.1°C</text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-[12px] text-[#6e6e73] pt-2 border-t border-black/[0.04]">
              <span>Formula: <span className="font-mono text-[#0071e3] font-medium">Landsat-8 TIRS Emissivity</span></span>
              <span className="font-mono text-[#059669] font-medium">Validation: RMSE 0.62</span>
            </div>
          </div>

          {/* Thermal Risk Distribution Card */}
          <div className="bg-white rounded-[28px] p-6 lg:p-8 border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">Exposure Burden</span>
                <span className="font-mono text-[11px] text-[#ea580c] bg-[#ea580c]/10 px-2.5 py-0.5 rounded-full font-semibold">
                  HOURLY EXPOSURE %
                </span>
              </div>
              <h3 className="text-xl font-semibold text-[#1d1d1f] tracking-tight mt-1 mb-1">
                Thermal Risk Distribution by Urban Zone
              </h3>
              <p className="text-[13px] text-[#6e6e73] leading-relaxed">
                Proportion of summer diurnal hours spent under Moderate, High, and Severe thermal stress across Solapur wards.
              </p>
            </div>

            {/* Stacked Horizontal Bar Visualization */}
            <div className="flex flex-col gap-3.5">
              {[
                { name: 'MIDC Industrial', severe: 54, high: 30, moderate: 16, note: '54% Severe' },
                { name: 'Navi Peth Commercial', severe: 42, high: 36, moderate: 22, note: '42% Severe' },
                { name: 'Ashok Chowk Transit', severe: 38, high: 36, moderate: 26, note: '38% Severe' },
                { name: 'Bhavani Peth High Density', severe: 28, high: 40, moderate: 32, note: '28% Severe' },
                { name: 'Siddheshwar Sanctuary', severe: 6, high: 26, moderate: 68, note: '6% Severe' },
              ].map((zone, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-medium text-[#1d1d1f]">{zone.name}</span>
                    <span className="text-[#ea580c] font-bold">{zone.note}</span>
                  </div>
                  <div className="w-full h-3.5 bg-[#f5f5f7] rounded-full flex overflow-hidden">
                    <div className="bg-[#059669] h-full" style={{ width: `${zone.moderate}%` }} title={`Moderate: ${zone.moderate}%`}></div>
                    <div className="bg-[#ea580c] h-full" style={{ width: `${zone.high}%` }} title={`High: ${zone.high}%`}></div>
                    <div className="bg-[#dc2626] h-full" style={{ width: `${zone.severe}%` }} title={`Severe: ${zone.severe}%`}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Risk Legend */}
            <div className="flex items-center justify-between pt-2 border-t border-black/[0.04] text-[12px] text-[#6e6e73]">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#059669]"></span>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c]"></span>
                  <span>High</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></span>
                  <span>Severe</span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-[#86868b]">720h Cycle</span>
            </div>
          </div>
        </div>

        {/* Academic Findings Card (#f5f5f7 surface) */}
        <div className="bg-[#f5f5f7] rounded-[28px] p-8 border border-black/[0.04] flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#0071e3] text-[22px]">science</span>
              <h3 className="text-lg font-semibold text-[#1d1d1f]">
                Key Climatological Findings &amp; Intervention Proofs
              </h3>
            </div>
            <span className="text-[11px] uppercase tracking-wider text-[#86868b] font-mono font-semibold">
              PEER-REVIEW MEMO • DRAFT 2.4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14px]">
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#ea580c] tabular-nums">3.6h</span>
                <span className="text-[11px] uppercase text-[#86868b] font-semibold">Thermal Lag</span>
              </div>
              <p className="text-[#6e6e73] text-[13px] leading-relaxed">
                High-density commercial clusters (Navi Peth &amp; Bhavani Peth) sustain sensible heat emissions past 22:30 IST, retaining temperatures over 34°C into late night.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#059669] tabular-nums">-3.4°C</span>
                <span className="text-[11px] uppercase text-[#86868b] font-semibold">Canopy Delta</span>
              </div>
              <p className="text-[#6e6e73] text-[13px] leading-relaxed">
                Tree canopy density &gt; 35% in residential wards directly truncates midday peak air temperatures by up to 3.4°C, verifying urban forestry as the highest-yield mitigation.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#0071e3] tabular-nums">0.72</span>
                <span className="text-[11px] uppercase text-[#86868b] font-semibold">Albedo Sensitivity</span>
              </div>
              <p className="text-[#6e6e73] text-[13px] leading-relaxed">
                Converting industrial roof albedo from 0.15 to 0.65 across MIDC reduces localized ambient surface heat generation by 6.2°C, limiting downwind convective heat transport.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between text-[12px] text-[#86868b] gap-2">
            <span>Synthesized via MIT Vishwaprayag Urban Climate Modeling Lab (TF-141 Research Group).</span>
            <div className="flex items-center gap-4 text-[#0071e3]">
              <button onClick={handleExportCSV} className="hover:underline cursor-pointer font-medium">Export CSV Ledger</button>
              <a href="/methodology#synthetic-engine" className="hover:underline font-medium">Model Equations Doc</a>
            </div>
          </div>
        </div>
      </div>

      {/* Apple-style Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1d1d1f]/95 text-white backdrop-blur-xl px-5 py-3 rounded-full shadow-2xl text-[13px] font-medium flex items-center gap-2.5 border border-white/[0.1] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="material-symbols-outlined text-[#059669] text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
