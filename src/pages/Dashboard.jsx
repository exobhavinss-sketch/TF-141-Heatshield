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
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Zone,Air_Temp_Mean_C,Air_Temp_Max_C,Surface_LST_Mean_C,UHI_Anomaly_C,Exposure_Severe_Pct\n"
      + "MIDC Industrial Corridor,36.8,43.8,49.2,+5.4,54\n"
      + "Navi Peth Commercial Core,35.9,42.5,47.8,+4.8,42\n"
      + "Ashok Chowk Transit,35.2,41.4,46.1,+4.1,38\n"
      + "Bhavani Peth High Density,34.8,41.8,45.4,+3.8,28\n"
      + "Siddheshwar Lake & Forest,29.4,34.2,33.8,-1.2,6\n"
      + "Kegaon Semi-Arid Fringe,31.2,36.5,36.2,-0.4,12\n";
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `solapur_heat_analytics_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastMessage('Exported Solapur synthetic microclimate dataset (May 2024 cycle, 100 stations) to CSV format.');
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Values falling back smoothly to verified Stitch baseline values if backend unavailable
  const meanAir = summary?.meanAirTemp || 34.6;
  const peakAir = summary?.maxAirTemp || 43.8;
  const meanLst = summary?.meanLST || 46.2;
  const uhiAnomaly = summary?.uhiAnomalyMean > 0 
    ? `+${summary?.uhiAnomalyMean}` 
    : (summary?.uhiAnomalyMean || '+4.8');

  return (
    <div className="flex flex-col w-full pb-space-xl">
      <div className="max-w-[1400px] w-full mx-auto px-margin py-space-xl flex flex-col gap-space-xl">
        
        {/* Page Header & Academic Coordinate Marker */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-sm text-secondary">
              <span className="font-caption-caps text-caption-caps uppercase tracking-wider">Spatial Analytical Module · TF-141</span>
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-label-code text-label-code text-on-surface-variant">GRID LAT: 17.6599° N · LON: 75.9064° E</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary font-semibold">Heat Analytics</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Explore diurnal temperature gradients, land-surface radiation anomalies, and microclimate mitigation vectors across the Solapur study area (2021–2025 academic synthetic dataset).
            </p>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="bg-surface-container px-space-md py-space-xs rounded-lg flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
              <div className="flex flex-col">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Baseline Model</span>
                <span className="font-label-code text-label-code text-primary font-semibold">SYNTH-SOLAPUR-V2.4</span>
              </div>
            </div>
            <button 
              onClick={handleExportCSV}
              className="bg-surface-container-high hover:bg-surface-dim text-on-surface px-space-md h-9 rounded-lg font-body-md text-body-md flex items-center gap-space-xs transition-colors shadow-sm"
              id="exportLedgerBtn"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>CSV Ledger</span>
            </button>
          </div>
        </div>

        {/* Scientific Filter Toolbar */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md flex-1">
              
              {/* Filter 1: Range Picker */}
              <div className="flex flex-col gap-1">
                <label className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Observation Window</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[16px] pointer-events-none">calendar_month</span>
                  <select 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-label-code text-label-code pl-8 pr-7 py-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:bg-surface-container"
                  >
                    <option value="May 2024 (Summer Peak Cycle)">May 2024 (Summer Peak Cycle)</option>
                    <option value="April 2024 (Pre-Monsoon Surge)">April 2024 (Pre-Monsoon Surge)</option>
                    <option value="June 2024 (Equatorial Transition)">June 2024 (Equatorial Transition)</option>
                    <option value="Multi-Year Aggregate (2021–2025)">Multi-Year Aggregate (2021–2025)</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 text-on-surface-variant text-[16px] pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Filter 2: Zone Dropdown */}
              <div className="flex flex-col gap-1">
                <label className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Spatial Partition</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[16px] pointer-events-none">grid_view</span>
                  <select 
                    value={selectedZone}
                    onChange={(e) => setSelectedZone(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-label-code text-label-code pl-8 pr-7 py-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:bg-surface-container" 
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
                  <span className="material-symbols-outlined absolute right-2 text-on-surface-variant text-[16px] pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Filter 3: Metric Selector */}
              <div className="flex flex-col gap-1">
                <label className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Primary Metric Comparison</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[16px] pointer-events-none">thermostat</span>
                  <select 
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-label-code text-label-code pl-8 pr-7 py-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:bg-surface-container"
                  >
                    <option value="air_lst">Air Temp (°C) vs Surface Temp (LST)</option>
                    <option value="wbgt">Wet Bulb Globe Temperature (WBGT)</option>
                    <option value="heat_index">Thermal Heat Index (HI-NOAA)</option>
                    <option value="canopy_factor">Vegetation Canopy Dampening Factor</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 text-on-surface-variant text-[16px] pointer-events-none">expand_more</span>
                </div>
              </div>

              {/* Filter 4: Simulation Confidence */}
              <div className="flex flex-col gap-1">
                <label className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Confidence Interval</label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-on-surface-variant text-[16px] pointer-events-none">tune</span>
                  <select 
                    value={confidenceInterval}
                    onChange={(e) => setConfidenceInterval(e.target.value)}
                    className="w-full bg-surface-container-low text-on-surface font-label-code text-label-code pl-8 pr-7 py-1.5 rounded-lg appearance-none cursor-pointer focus:outline-none focus:bg-surface-container"
                  >
                    <option value="p95">P95 Confidence Interval (σ = ±0.34)</option>
                    <option value="p99">P99 Strict Boundary (σ = ±0.48)</option>
                    <option value="p50">P50 Median Deterministic</option>
                    <option value="raw">Raw Station Telemetry Aggregate</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-2 text-on-surface-variant text-[16px] pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>

            <div className="flex items-end pt-2 lg:pt-0">
              <button 
                onClick={handleResetFilters}
                className="w-full lg:w-auto bg-surface-container-high hover:bg-surface-dim text-on-surface px-space-md py-2 rounded-lg font-caption-caps text-caption-caps uppercase tracking-wider flex items-center justify-center gap-space-xs transition-colors" 
                id="resetFiltersBtn"
              >
                <span className="material-symbols-outlined text-[14px]">restart_alt</span>
                <span>Reset Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimalist Scientific KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          
          {/* KPI 1: Mean Air */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-sm relative overflow-hidden group border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-semibold">Mean Air Temperature</span>
              <span className="bg-secondary-fixed text-on-secondary-fixed px-1.5 py-0.5 rounded text-caption-caps font-label-code font-bold">P95 μ</span>
            </div>
            <div className="py-space-md flex flex-col">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">{meanAir}</span>
                <span className="font-label-metric text-label-metric text-on-surface-variant">°C</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
                <span className="text-tertiary font-medium">±0.4°C</span> variance vs 5-yr baseline
              </p>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* KPI 2: Peak Air */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-sm relative overflow-hidden group border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-semibold">Peak Air Temperature</span>
              <span className="bg-tertiary-fixed text-on-tertiary-fixed px-1.5 py-0.5 rounded text-caption-caps font-label-code font-bold">EXTREME</span>
            </div>
            <div className="py-space-md flex flex-col">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-tertiary font-bold tracking-tight">{peakAir}</span>
                <span className="font-label-metric text-label-metric text-on-surface-variant">°C</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 truncate" title="Recorded at MIDC Zone Station #42, May 18">
                MIDC Station #42 · May 18 (14:30)
              </p>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: '92%' }}></div>
            </div>
          </div>

          {/* KPI 3: Mean Surface LST */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-sm relative overflow-hidden group border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-semibold">Mean Land Surface Temp (LST)</span>
              <span className="bg-surface-container text-on-surface-variant px-1.5 py-0.5 rounded text-caption-caps font-label-code font-medium">TIRS-2 MODEL</span>
            </div>
            <div className="py-space-md flex flex-col">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">{meanLst}</span>
                <span className="font-label-metric text-label-metric text-on-surface-variant">°C</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Thermal infrared radiation synthetic profile
              </p>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full transition-all duration-500" style={{ width: '84%' }}></div>
            </div>
          </div>

          {/* KPI 4: UHI Anomaly */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg flex flex-col justify-between shadow-sm relative overflow-hidden group border border-outline-variant/30">
            <div className="flex items-start justify-between">
              <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-semibold">Urban Heat Anomaly</span>
              <span className="bg-error-container text-on-error-container px-1.5 py-0.5 rounded text-caption-caps font-label-code font-bold">UHI DELTA</span>
            </div>
            <div className="py-space-md flex flex-col">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-xl text-headline-xl text-tertiary font-bold tracking-tight">{uhiAnomaly}</span>
                <span className="font-label-metric text-label-metric text-on-surface-variant">°C</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Dense commercial center vs rural boundary
              </p>
            </div>
            <div className="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle: Diurnal Microscale vs. Longitudinal 2024 Progression */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 pb-2">
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => setActiveTab('diurnal')}
              className={`px-3 py-1.5 rounded-lg font-caption-caps text-caption-caps uppercase tracking-wider transition-colors ${
                activeTab === 'diurnal' 
                  ? 'bg-primary-container text-on-primary font-bold shadow-sm' 
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              24h Diurnal Dynamics (Stitch Master)
            </button>
            <button
              onClick={() => setActiveTab('longitudinal')}
              className={`px-3 py-1.5 rounded-lg font-caption-caps text-caption-caps uppercase tracking-wider transition-colors ${
                activeTab === 'longitudinal' 
                  ? 'bg-primary-container text-on-primary font-bold shadow-sm' 
                  : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Annual Longitudinal Series (2024)
            </button>
          </div>
          <span className="font-label-code text-label-code text-on-surface-variant hidden sm:inline">
            SIM-GRID RESOLUTION: 0.25 KM²
          </span>
        </div>

        {/* Dominant Primary Visualization: Diurnal Cycle & Thermal Inertia */}
        {activeTab === 'diurnal' ? (
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm">
              <div>
                <div className="flex items-center gap-space-xs text-primary-container">
                  <span className="font-caption-caps text-caption-caps uppercase tracking-wider">Temporal Profile · 24-Hour Diurnal Dynamics</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-primary font-semibold">Diurnal Temperature Cycle &amp; Thermal Inertia</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Comparing diurnal heating cycles and twilight cooling lag across distinct Solapur urban surface typologies. Note the nocturnal heat trapping after 20:00.
                </p>
              </div>
              
              {/* Legend and Threshold Switch */}
              <div className="flex flex-wrap items-center gap-space-md pt-2 md:pt-0">
                <div className="flex flex-wrap items-center gap-space-sm font-label-code text-label-code">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-tertiary rounded-full"></span>
                    <span className="text-on-surface">MIDC Industrial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-tertiary-container rounded-full"></span>
                    <span className="text-on-surface">Navi Peth Commercial</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-secondary rounded-full"></span>
                    <span className="text-on-surface">Residential West</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-1 bg-primary rounded-full"></span>
                    <span className="text-on-surface">Siddheshwar Canopy</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scientific SVG Line Chart */}
            <div className="w-full relative bg-surface-container-low rounded-lg p-space-md overflow-x-auto">
              <div className="min-w-[700px] w-full">
                <svg className="w-full h-auto text-on-surface select-none font-label-code" style={{ overflow: 'visible' }} viewBox="0 0 1000 380">
                  {/* Heat Hazard Band (>40C) */}
                  <rect className="text-tertiary-fixed opacity-30" fill="currentColor" height="60" width="880" x="60" y="30"></rect>
                  <text className="text-[10px] fill-tertiary font-semibold uppercase tracking-wider" x="68" y="46">Thermal Hazard Zone (&gt;40°C)</text>
                  
                  {/* Horizontal Y-Gridlines */}
                  <line className="text-outline-variant/40" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="60" x2="940" y1="30" y2="30"></line>
                  <text className="text-[11px] fill-on-surface-variant font-label-code" textAnchor="end" x="52" y="34">44°C</text>
                  <line className="text-tertiary/40" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1.5" x1="60" x2="940" y1="90" y2="90"></line>
                  <text className="text-[11px] fill-tertiary font-label-code font-bold" textAnchor="end" x="52" y="94">40°C</text>
                  <line className="text-outline-variant/40" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="60" x2="940" y1="150" y2="150"></line>
                  <text className="text-[11px] fill-on-surface-variant font-label-code" textAnchor="end" x="52" y="154">36°C</text>
                  <line className="text-outline-variant/40" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="60" x2="940" y1="210" y2="210"></line>
                  <text className="text-[11px] fill-on-surface-variant font-label-code" textAnchor="end" x="52" y="214">32°C</text>
                  <line className="text-outline-variant/40" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="60" x2="940" y1="270" y2="270"></line>
                  <text className="text-[11px] fill-on-surface-variant font-label-code" textAnchor="end" x="52" y="274">28°C</text>
                  <line className="text-outline-variant/40" stroke="currentColor" strokeWidth="1" x1="60" x2="940" y1="330" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant font-label-code" textAnchor="end" x="52" y="334">24°C</text>
                  
                  {/* Twilight cooling lag highlight zone (18:00 to 24:00) */}
                  <rect className="text-surface-container-highest opacity-40" fill="currentColor" height="300" width="220" x="720" y="30"></rect>
                  <text className="text-[10px] fill-on-surface-variant font-caption-caps uppercase" x="730" y="295">Twilight Cooling Deficit</text>
                  <text className="text-[10px] fill-on-surface-variant font-label-code" x="730" y="310">Lag: +3.6h trapped radiation</text>
                  
                  {/* Vertical X-Gridlines & Hours */}
                  <line className="text-outline-variant/30" stroke="currentColor" strokeWidth="1" x1="60" x2="60" y1="30" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant" textAnchor="middle" x="60" y="352">00:00</text>
                  <line className="text-outline-variant/20" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="170" x2="170" y1="30" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant" textAnchor="middle" x="170" y="352">03:00</text>
                  <line className="text-outline-variant/30" stroke="currentColor" strokeWidth="1" x1="280" x2="280" y1="30" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant" textAnchor="middle" x="280" y="352">06:00</text>
                  <line className="text-outline-variant/20" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="390" x2="390" y1="30" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant" textAnchor="middle" x="390" y="352">09:00</text>
                  <line className="text-outline-variant/30" stroke="currentColor" strokeWidth="1" x1="500" x2="500" y1="30" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant" textAnchor="middle" x="500" y="352">12:00</text>
                  <line className="text-outline-variant/20" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="610" x2="610" y1="30" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant" textAnchor="middle" x="610" y="352">15:00</text>
                  <line className="text-outline-variant/30" stroke="currentColor" strokeWidth="1" x1="720" x2="720" y1="30" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant" textAnchor="middle" x="720" y="352">18:00</text>
                  <line className="text-outline-variant/20" stroke="currentColor" strokeDasharray="2 4" strokeWidth="1" x1="830" x2="830" y1="30" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant" textAnchor="middle" x="830" y="352">21:00</text>
                  <line className="text-outline-variant/30" stroke="currentColor" strokeWidth="1" x1="940" x2="940" y1="30" y2="330"></line>
                  <text className="text-[11px] fill-on-surface-variant" textAnchor="middle" x="940" y="352">24:00</text>

                  {/* CURVES */}
                  {/* 1. High Canopy / Siddheshwar Lake Oasis (Primary / Dark Green) */}
                  <path className="text-primary" d="M 60,300 C 120,318 200,332 280,330 C 340,320 440,225 500,198 C 550,178 580,174 610,177 C 670,185 700,205 720,217 C 770,245 800,265 830,273 C 890,290 920,300 940,303" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                  {/* 2. Residential West (Secondary / Teal) */}
                  <path className="text-secondary" d="M 60,262 C 120,280 200,297 280,297 C 340,285 440,180 500,150 C 560,120 580,114 610,117 C 670,125 700,150 720,165 C 770,195 800,208 830,213 C 890,230 920,242 940,247" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                  {/* 3. Navi Peth Dense Commercial (Orange-Red / Tertiary-Container) */}
                  <path className="text-tertiary-container" d="M 60,204 C 120,225 200,245 280,243 C 340,225 440,115 500,87 C 560,60 580,48 610,52 C 670,60 700,85 720,96 C 770,120 800,135 830,142 C 890,165 920,175 940,183" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                  {/* 4. MIDC Industrial Corridor (Deep Brick / Tertiary) */}
                  <path className="text-tertiary" d="M 60,183 C 120,205 200,235 280,234 C 340,210 440,90 500,63 C 560,35 580,28 610,33 C 670,45 700,65 720,75 C 770,100 800,112 830,120 C 890,145 920,155 940,162" fill="none" stroke="currentColor" strokeWidth="3"></path>

                  {/* Peak Indicator Point at 14:30 / 15:00 on MIDC */}
                  <circle className="text-tertiary" cx="610" cy="33" fill="currentColor" r="5"></circle>
                  <circle className="text-tertiary opacity-40" cx="610" cy="33" fill="none" stroke="currentColor" strokeWidth="1.5"></circle>

                  {/* Tooltip Anchor Simulation Box */}
                  <g transform="translate(625, 20)">
                    <rect className="text-surface-container-highest shadow-md" fill="currentColor" height="48" rx="4" width="160" x="0" y="0"></rect>
                    <text className="text-[10px] font-semibold fill-on-surface uppercase font-caption-caps" x="8" y="18">MIDC PEAK RECORD</text>
                    <text className="text-[12px] font-bold fill-tertiary font-label-code" x="8" y="34">43.8°C (14:30 IST)</text>
                    <text className="text-[9px] fill-on-surface-variant font-label-code" x="110" y="34">Δ +9.6°C</text>
                  </g>

                  {/* Twilight Delta Annotation */}
                  <g transform="translate(760, 105)">
                    <rect className="text-surface-container-lowest" fill="currentColor" height="42" rx="4" width="150" x="0" y="0"></rect>
                    <text className="text-[10px] font-semibold fill-on-surface uppercase font-caption-caps" x="8" y="16">Twilight Canopy Relief</text>
                    <text className="text-[11px] font-bold fill-primary font-label-code" x="8" y="32">Canopy is 8.1°C cooler</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Diurnal Insight Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm pt-space-xs text-body-sm font-body-sm text-on-surface-variant">
              <div className="bg-surface-container rounded-lg p-space-sm flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-tertiary text-[18px]">wb_sunny</span>
                <div>
                  <span className="font-medium text-on-surface block">Solar Noon Surge (11:00–14:00)</span>
                  Asphalt and unshaded masonry in MIDC heat at 2.4× the rate of vegetated parcels.
                </div>
              </div>
              <div className="bg-surface-container rounded-lg p-space-sm flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[18px]">nightlight</span>
                <div>
                  <span className="font-medium text-on-surface block">Thermal Retention Lag (19:00–23:00)</span>
                  Dense commercial fabric retains radiative heat into late twilight, delaying restorative sleep temps.
                </div>
              </div>
              <div className="bg-surface-container rounded-lg p-space-sm flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">park</span>
                <div>
                  <span className="font-medium text-on-surface block">Canopy Oasis Efficiency</span>
                  Siddheshwar Lake vegetated zone exhibits rapid nocturnal cooling, dropping below 26°C by 23:00.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Longitudinal Time Series Progression (2024 Daily Observations) */
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
              <div>
                <span className="font-caption-caps text-caption-caps uppercase tracking-wider text-primary font-semibold">
                  Longitudinal Continuum // 2024 Cycle
                </span>
                <h3 className="font-headline-lg text-headline-lg text-primary font-semibold">
                  Daily Ambient Air & Land Surface Skin (LST) Progression
                </h3>
              </div>
              <span className="font-label-code text-label-code text-on-surface-variant">
                Daily Mean Telemetry (°C)
              </span>
            </div>

            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={RECENT_TREND_SERIES} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAir" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#89bdac" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#89bdac" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorLST" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ff9770" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ff9770" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dfe4e0" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="#707975" 
                    tick={{ fontSize: 11, fill: '#404945' }} 
                    tickFormatter={(val) => (typeof val === 'string' ? val.slice(5) : val)} 
                  />
                  <YAxis 
                    stroke="#707975" 
                    domain={[15, 52]} 
                    tick={{ fontSize: 11, fill: '#404945' }} 
                    unit="°C"
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/40 shadow-xl text-xs font-label-code">
                            <span className="font-semibold text-primary block mb-1">{label}</span>
                            {payload.map((entry, index) => (
                              <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
                                <span className="text-on-surface-variant">{entry.name}:</span>
                                <span className="font-bold text-on-surface">{entry.value} °C</span>
                              </div>
                            ))}
                          </div>
                        );
                      }
                      return null;
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area
                    type="monotone"
                    dataKey="air_temp"
                    name="Mean Ambient Air (T_air)"
                    stroke="#016a60"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAir)"
                  />
                  <Area
                    type="monotone"
                    dataKey="surface_temp"
                    name="Land Surface Temp (LST)"
                    stroke="#7d2800"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorLST)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Noticeable thermal relaxation occurs during the late June monsoon onset, contrasting the pre-monsoon summer apex in April and May where radiative skin regularly exceeded 48°C.
            </p>
          </div>
        )}

        {/* Secondary Analytical Visualizations: 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          
          {/* Chart Left: Air Temp vs Land Surface Temp (LST) Scatter & Regression */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Cross-Correlation Model</span>
                <span className="font-label-code text-label-code bg-surface-container text-on-surface px-1.5 py-0.5 rounded">R² = 0.884 · 100 SENSORS</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary font-semibold mt-1">Air Temp vs. Land Surface Temp (LST)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Thermal inertia across 100 simulation grid stations in Solapur. Impervious surface fraction drives non-linear surface warming.
              </p>
            </div>

            {/* Scatter Plot SVG */}
            <div className="w-full bg-surface-container-low rounded-lg p-space-md overflow-x-auto">
              <svg className="w-full h-auto text-on-surface font-label-code select-none min-w-[420px]" style={{ overflow: 'visible' }} viewBox="0 0 500 280">
                {/* Gridlines */}
                <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 3" strokeWidth="1" x1="50" x2="480" y1="20" y2="20"></line>
                <text className="text-[10px] fill-on-surface-variant" textAnchor="end" x="42" y="24">52°C</text>
                <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 3" strokeWidth="1" x1="50" x2="480" y1="80" y2="80"></line>
                <text className="text-[10px] fill-on-surface-variant" textAnchor="end" x="42" y="84">44°C</text>
                <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 3" strokeWidth="1" x1="50" x2="480" y1="140" y2="140"></line>
                <text className="text-[10px] fill-on-surface-variant" textAnchor="end" x="42" y="144">36°C</text>
                <line className="text-outline-variant/30" stroke="currentColor" strokeDasharray="2 3" strokeWidth="1" x1="50" x2="480" y1="200" y2="200"></line>
                <text className="text-[10px] fill-on-surface-variant" textAnchor="end" x="42" y="204">28°C</text>
                <line className="text-outline-variant/50" stroke="currentColor" strokeWidth="1" x1="50" x2="480" y1="240" y2="240"></line>
                
                {/* X Axis ticks (Air Temp 28C - 44C) */}
                <text className="text-[10px] fill-on-surface-variant" textAnchor="middle" x="60" y="258">28°C</text>
                <text className="text-[10px] fill-on-surface-variant" textAnchor="middle" x="160" y="258">32°C</text>
                <text className="text-[10px] fill-on-surface-variant" textAnchor="middle" x="260" y="258">36°C</text>
                <text className="text-[10px] fill-on-surface-variant" textAnchor="middle" x="360" y="258">40°C</text>
                <text className="text-[10px] fill-on-surface-variant" textAnchor="middle" x="460" y="258">44°C</text>
                <text className="text-[9px] fill-on-surface font-caption-caps uppercase" textAnchor="middle" x="260" y="275">Ambient Air Temperature (T_air)</text>
                
                {/* Regression Line */}
                <line className="text-tertiary-container" stroke="currentColor" strokeWidth="2" x1="70" x2="465" y1="215" y2="35"></line>
                
                {/* Scatter Points Simulated Grid (100 Stations grouped by zone) */}
                {/* High Vegetated (Green cluster lower left) */}
                <circle className="text-primary opacity-80" cx="85" cy="208" fill="currentColor" r="3"></circle>
                <circle className="text-primary opacity-80" cx="95" cy="195" fill="currentColor" r="3"></circle>
                <circle className="text-primary opacity-80" cx="110" cy="190" fill="currentColor" r="3.5"></circle>
                <circle className="text-primary opacity-80" cx="120" cy="205" fill="currentColor" r="3"></circle>
                <circle className="text-primary opacity-80" cx="125" cy="182" fill="currentColor" r="3"></circle>
                <circle className="text-primary opacity-80" cx="140" cy="178" fill="currentColor" r="3"></circle>
                <circle className="text-primary opacity-80" cx="150" cy="185" fill="currentColor" r="3.5"></circle>
                
                {/* Suburban/Residential (Teal cluster mid-left) */}
                <circle className="text-secondary opacity-75" cx="170" cy="170" fill="currentColor" r="3"></circle>
                <circle className="text-secondary opacity-75" cx="185" cy="162" fill="currentColor" r="3.5"></circle>
                <circle className="text-secondary opacity-75" cx="195" cy="175" fill="currentColor" r="3"></circle>
                <circle className="text-secondary opacity-75" cx="210" cy="155" fill="currentColor" r="3"></circle>
                <circle className="text-secondary opacity-75" cx="220" cy="148" fill="currentColor" r="3.5"></circle>
                <circle className="text-secondary opacity-75" cx="235" cy="152" fill="currentColor" r="3"></circle>
                <circle className="text-secondary opacity-75" cx="245" cy="138" fill="currentColor" r="3"></circle>
                <circle className="text-secondary opacity-75" cx="255" cy="142" fill="currentColor" r="3.5"></circle>
                
                {/* Commercial Core (Orange-Red cluster mid-right) */}
                <circle className="text-tertiary-container opacity-85" cx="275" cy="125" fill="currentColor" r="3.5"></circle>
                <circle className="text-tertiary-container opacity-85" cx="288" cy="132" fill="currentColor" r="3"></circle>
                <circle className="text-tertiary-container opacity-85" cx="305" cy="115" fill="currentColor" r="3"></circle>
                <circle className="text-tertiary-container opacity-85" cx="320" cy="108" fill="currentColor" r="3.5"></circle>
                <circle className="text-tertiary-container opacity-85" cx="330" cy="98" fill="currentColor" r="3"></circle>
                <circle className="text-tertiary-container opacity-85" cx="345" cy="105" fill="currentColor" r="3"></circle>
                <circle className="text-tertiary-container opacity-85" cx="360" cy="85" fill="currentColor" r="3.5"></circle>
                
                {/* MIDC Industrial (Deep Red cluster top-right) */}
                <circle className="text-tertiary opacity-90" cx="380" cy="78" fill="currentColor" r="3.5"></circle>
                <circle className="text-tertiary opacity-90" cx="395" cy="65" fill="currentColor" r="3"></circle>
                <circle className="text-tertiary opacity-90" cx="410" cy="55" fill="currentColor" r="4"></circle>
                <circle className="text-tertiary opacity-90" cx="420" cy="62" fill="currentColor" r="3"></circle>
                <circle className="text-tertiary opacity-90" cx="435" cy="45" fill="currentColor" r="3.5"></circle>
                <circle className="text-tertiary opacity-90" cx="445" cy="40" fill="currentColor" r="4"></circle>
                <circle className="text-tertiary opacity-90" cx="455" cy="36" fill="currentColor" r="4.5"></circle>
                
                {/* Regression Formula Label */}
                <text className="text-[11px] font-bold fill-primary font-label-code" x="65" y="45">LST = 1.28 × T_air - 6.42</text>
                <text className="text-[10px] fill-on-surface-variant font-label-code" x="65" y="60">Sensory variance: ±1.1°C</text>
              </svg>
            </div>

            <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant pt-2 border-t border-outline-variant/30">
              <span>Formula: <span className="font-label-code text-primary font-medium">Landsat-8 TIRS Emissivity Model</span></span>
              <span className="font-label-code text-secondary font-medium">Validation: RMSE 0.62</span>
            </div>
          </div>

          {/* Chart Right: Thermal Risk Distribution by Urban Zone */}
          <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between gap-space-md border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Exposure Burden</span>
                <span className="font-label-code text-label-code bg-surface-container text-on-surface px-1.5 py-0.5 rounded">HOURLY EXPOSURE %</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary font-semibold mt-1">Thermal Risk Distribution by Urban Zone</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Proportion of summer diurnal hours spent under Moderate (&lt;36°C), High (36–40°C), and Severe (&gt;40°C) thermal stress categories across Solapur wards.
              </p>
            </div>

            {/* Stacked Horizontal Bar Visualization */}
            <div className="flex flex-col gap-space-sm pt-space-xs">
              
              {/* Zone 1: MIDC Corridor */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-code text-label-code">
                  <span className="font-medium text-on-surface">MIDC Industrial</span>
                  <span className="text-tertiary font-bold">54% Severe</span>
                </div>
                <div className="w-full h-5 bg-surface-container rounded flex overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '16%' }} title="Moderate: 16%"></div>
                  <div className="bg-tertiary-container h-full" style={{ width: '30%' }} title="High: 30%"></div>
                  <div className="bg-tertiary h-full" style={{ width: '54%' }} title="Severe: 54%"></div>
                </div>
              </div>

              {/* Zone 2: Navi Peth Core */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-code text-label-code">
                  <span className="font-medium text-on-surface">Navi Peth Commercial</span>
                  <span className="text-tertiary font-bold">42% Severe</span>
                </div>
                <div className="w-full h-5 bg-surface-container rounded flex overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '22%' }} title="Moderate: 22%"></div>
                  <div className="bg-tertiary-container h-full" style={{ width: '36%' }} title="High: 36%"></div>
                  <div className="bg-tertiary h-full" style={{ width: '42%' }} title="Severe: 42%"></div>
                </div>
              </div>

              {/* Zone 3: Ashok Chowk */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-code text-label-code">
                  <span className="font-medium text-on-surface">Ashok Chowk Transit</span>
                  <span className="text-tertiary font-bold">38% Severe</span>
                </div>
                <div className="w-full h-5 bg-surface-container rounded flex overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '26%' }} title="Moderate: 26%"></div>
                  <div className="bg-tertiary-container h-full" style={{ width: '36%' }} title="High: 36%"></div>
                  <div className="bg-tertiary h-full" style={{ width: '38%' }} title="Severe: 38%"></div>
                </div>
              </div>

              {/* Zone 4: Bhavani Peth */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-code text-label-code">
                  <span className="font-medium text-on-surface">Bhavani Peth High Density</span>
                  <span className="text-on-surface font-semibold">28% Severe</span>
                </div>
                <div className="w-full h-5 bg-surface-container rounded flex overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '32%' }} title="Moderate: 32%"></div>
                  <div className="bg-tertiary-container h-full" style={{ width: '40%' }} title="High: 40%"></div>
                  <div className="bg-tertiary h-full" style={{ width: '28%' }} title="Severe: 28%"></div>
                </div>
              </div>

              {/* Zone 5: Siddheshwar Sanctuary */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-label-code text-label-code">
                  <span className="font-medium text-on-surface">Siddheshwar Lake &amp; Forest</span>
                  <span className="text-secondary font-bold">6% Severe</span>
                </div>
                <div className="w-full h-5 bg-surface-container rounded flex overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '68%' }} title="Moderate: 68%"></div>
                  <div className="bg-tertiary-container h-full" style={{ width: '26%' }} title="High: 26%"></div>
                  <div className="bg-tertiary h-full" style={{ width: '6%' }} title="Severe: 6%"></div>
                </div>
              </div>
            </div>

            {/* Risk Legend */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 text-body-sm font-body-sm">
              <div className="flex items-center gap-space-md">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-secondary"></span>
                  <span className="font-label-code text-label-code text-on-surface-variant">Moderate (&lt;36°C)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-tertiary-container"></span>
                  <span className="font-label-code text-label-code text-on-surface-variant">High (36–40°C)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-tertiary"></span>
                  <span className="font-label-code text-label-code text-on-surface-variant">Severe (&gt;40°C)</span>
                </div>
              </div>
              <span className="font-label-code text-label-code text-on-surface-variant">Sample: 720h Cycle</span>
            </div>
          </div>
        </div>

        {/* Analytical Insights & Scientific Notes Drawer */}
        <div className="bg-surface-container rounded-xl p-space-lg flex flex-col gap-space-md border-l-4 border-l-primary-container">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-space-sm">
              <span className="material-symbols-outlined text-primary-container text-[20px]">science</span>
              <h3 className="font-headline-md text-headline-md text-primary font-semibold">Key Climatological Findings &amp; Intervention Proofs</h3>
            </div>
            <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded font-medium">
              PEER-REVIEW MEMO · DRAFT 2.4
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter text-body-md font-body-md text-on-surface">
            <div className="space-y-1">
              <div className="flex items-center gap-1 font-headline-md text-headline-md text-tertiary font-bold">
                <span>3.6h</span>
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-medium">Thermal Lag</span>
              </div>
              <p className="text-on-surface-variant text-body-sm font-body-sm">
                High-density paved commercial clusters (Navi Peth &amp; Bhavani Peth) exhibit a pronounced 3.6-hour delayed sensible heat emission into the boundary layer, sustaining temperatures over 34°C past 22:30 IST.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 font-headline-md text-headline-md text-primary font-bold">
                <span>-3.4°C</span>
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-medium">Tree Canopy Delta</span>
              </div>
              <p className="text-on-surface-variant text-body-sm font-body-sm">
                Urban tree canopy density exceeding 35% in residential sectors directly truncates midday peak air temperatures by up to 3.4°C, verifying urban forestry as the highest ROI microclimate mitigation strategy.
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1 font-headline-md text-headline-md text-secondary font-bold">
                <span>0.72</span>
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-medium">Albedo Sensitivity</span>
              </div>
              <p className="text-on-surface-variant text-body-sm font-body-sm">
                Simulation modeling confirms converting flat industrial roof albedo from 0.15 to 0.65 across MIDC reduces localized ambient surface heat generation by 6.2°C, limiting downwind convective heat transport.
              </p>
            </div>
          </div>

          <div className="pt-space-xs border-t border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between text-body-sm font-body-sm text-on-surface-variant gap-2">
            <p>Synthesized via MIT Vishwaprayag Urban Climate Modeling Lab (TF-141 Research Group).</p>
            <div className="flex items-center gap-space-md font-label-code text-label-code">
              <span onClick={handleExportCSV} className="hover:text-primary cursor-pointer underline">Download Raw Simulation NetCDF</span>
              <a href="/methodology#synthetic-engine" className="hover:text-primary cursor-pointer underline">Model Equations Doc</a>
            </div>
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl shadow-2xl font-body-sm text-body-sm flex items-center gap-2 border border-primary-container">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
