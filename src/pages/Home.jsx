import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDatasetMetadata } from '../services/heatmapService';
import IndianFlag from '../components/branding/IndianFlag';

export default function Home() {
  const [metadata, setMetadata] = useState(null);
  const [activePin, setActivePin] = useState(null);

  useEffect(() => {
    fetchDatasetMetadata().then((data) => setMetadata(data));
  }, []);

  return (
    <div className="flex flex-col w-full bg-white dark:bg-[#101114] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200">
      {/* Hero Section Container */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Scientific Narrative & Editorial Hero */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 z-10">
            {/* Eyebrow Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f5f5f7] dark:bg-[#22252b] border border-black/[0.04] dark:border-white/[0.08] w-fit">
              <span className="w-2 h-2 rounded-full bg-[#059669] dark:bg-[#10b981]"></span>
              <span className="font-mono text-[11px] text-[#6e6e73] dark:text-[#a5a9b4] uppercase tracking-wider font-medium">
                Solapur Microclimate Observatory • TF-141
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight leading-[1.1] text-balance">
              Understanding urban heat. Designing cooler cities.
            </h1>

            {/* Subheading */}
            <p className="text-[17px] text-[#6e6e73] dark:text-[#a5a9b4] leading-[1.5] max-w-prose">
              Explore Land Surface Temperature anomalies, evaluate vegetative cooling priorities, and investigate spatial heat exposure vectors across Solapur, Maharashtra.
            </p>

            {/* Pill Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/heat-map"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0071e3] hover:bg-[#0076df] dark:bg-[#2997ff] dark:hover:bg-[#58a6ff] active:scale-[0.98] text-white font-medium text-[15px] transition-all shadow-sm"
              >
                <span>Explore Heat Map</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#f5f5f7] dark:bg-[#22252b] hover:bg-[#e8e8ed] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] font-medium text-[15px] transition-all shadow-sm"
              >
                <span>Open Dashboard</span>
                <span className="material-symbols-outlined text-[18px] text-[#6e6e73] dark:text-[#a5a9b4]">query_stats</span>
              </Link>
            </div>

            {/* Telemetry Geolocation Coordinate Tag */}
            <div className="flex items-center gap-3 pt-2 text-[#86868b] dark:text-[#7a7f8d] font-mono text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">my_location</span>
                <span>17.6599° N, 75.9064° E</span>
              </div>
              <span>•</span>
              <span>EPSG:4326 WGS84</span>
              <span>•</span>
              <span className="text-[#059669] dark:text-[#10b981] font-medium">100 Stations</span>
            </div>
          </div>

          {/* Right Column: GIS Spatial Telemetry Preview Window */}
          <div className="lg:col-span-7 relative">
            <div className="w-full rounded-[28px] bg-white dark:bg-[#191b20] shadow-[0_8px_32px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden relative border border-black/[0.08] dark:border-white/[0.08]">
              {/* Viewport Header HUD */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#fafafc] dark:bg-[#22252b] text-[#6e6e73] dark:text-[#a5a9b4] border-b border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold">
                    SOLAPUR SPATIAL MESH
                  </span>
                  <span className="font-mono text-[10px] text-[#0071e3] dark:text-[#2997ff] bg-[#0071e3]/10 dark:bg-[#2997ff]/15 px-2 py-0.5 rounded-full font-medium">
                    100 / 100 SITES ACTIVE
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-[#86868b] dark:text-[#7a7f8d]">
                  <span>RAD: 12.4km</span>
                  <span>•</span>
                  <span>RES: 50m</span>
                </div>
              </div>

              {/* Synthetic Spatial Thermal Layer Display */}
              <div className="relative w-full aspect-[16/10] bg-[#f5f5f7] dark:bg-[#101114] overflow-hidden select-none">
                {/* Simulated Heat Contour Vector Overlay */}
                <svg
                  className="absolute inset-0 w-full h-full object-cover"
                  preserveAspectRatio="none"
                  viewBox="0 0 700 450"
                >
                  <defs>
                    <radialGradient cx="75%" cy="35%" id="hero-high-heat-midc" r="40%">
                      <stop offset="0%" stopColor="#dc2626" stopOpacity="0.6" />
                      <stop offset="45%" stopColor="#ea580c" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient cx="48%" cy="52%" id="hero-high-heat-bhavani" r="35%">
                      <stop offset="0%" stopColor="#d97706" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#ea580c" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient cx="25%" cy="65%" id="hero-cool-canopy" r="38%">
                      <stop offset="0%" stopColor="#059669" stopOpacity="0.6" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                    </radialGradient>
                    <pattern height="28" id="hero-grid-pattern" patternUnits="userSpaceOnUse" width="28">
                      <path
                        className="text-black/[0.04] dark:text-white/[0.04]"
                        d="M 28 0 L 0 0 0 28"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.75"
                      />
                    </pattern>
                  </defs>
                  {/* Grid */}
                  <rect fill="url(#hero-grid-pattern)" height="100%" width="100%" />
                  {/* Heat Fields */}
                  <rect fill="url(#hero-high-heat-midc)" height="100%" width="100%" />
                  <rect fill="url(#hero-high-heat-bhavani)" height="100%" width="100%" />
                  <rect fill="url(#hero-cool-canopy)" height="100%" width="100%" />
                  {/* Vector Arterial Streets */}
                  <path
                    className="text-black/[0.12] dark:text-white/[0.12]"
                    d="M 50 180 C 220 190, 360 210, 650 150"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    strokeWidth="1.8"
                  />
                  <path
                    className="text-black/[0.12] dark:text-white/[0.12]"
                    d="M 350 40 C 370 190, 340 310, 360 420"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    className="text-black/[0.08] dark:text-white/[0.08]"
                    d="M 120 400 C 280 320, 480 260, 680 380"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  {/* Contour Elevation Lines */}
                  <ellipse
                    cx="525"
                    cy="157"
                    fill="none"
                    opacity="0.6"
                    rx="90"
                    ry="60"
                    stroke="#dc2626"
                    strokeDasharray="2 4"
                    strokeWidth="1"
                  />
                  <ellipse
                    cx="175"
                    cy="290"
                    fill="none"
                    opacity="0.7"
                    rx="110"
                    ry="75"
                    stroke="#059669"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  {/* Central Coordinate Crosshairs */}
                  <line className="text-[#1d1d1f]/40 dark:text-[#f5f5f7]/40" stroke="currentColor" strokeWidth="1.5" x1="335" x2="365" y1="225" y2="225" />
                  <line className="text-[#1d1d1f]/40 dark:text-[#f5f5f7]/40" stroke="currentColor" strokeWidth="1.5" x1="350" x2="350" y1="210" y2="240" />
                  <circle className="text-[#1d1d1f]/30 dark:text-[#f5f5f7]/30" cx="350" cy="225" fill="none" r="16" stroke="currentColor" strokeWidth="1" />
                </svg>

                {/* Interactive Data Pins with Apple-style Tooltips */}
                {/* Station 01: MIDC Industrial */}
                <div
                  className="absolute top-[28%] right-[22%] group cursor-pointer"
                  onClick={() => setActivePin('midc')}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-4 h-4 rounded-full bg-[#dc2626] animate-ping opacity-30"></span>
                    <span className="w-3 h-3 rounded-full bg-[#dc2626] border-2 border-white dark:border-[#191b20] shadow-sm"></span>
                  </div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 dark:bg-[#191b20]/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-2 transition-transform group-hover:scale-105 border border-black/[0.08] dark:border-white/[0.1]">
                    <span className="w-2 h-2 rounded-full bg-[#dc2626]"></span>
                    <span className="text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold">MIDC SECTOR-2</span>
                    <span className="font-mono text-[11px] text-[#dc2626] font-semibold tabular-nums">42.1°C</span>
                  </div>
                </div>

                {/* Station 02: Bhavani Peth */}
                <div
                  className="absolute top-[48%] left-[46%] group cursor-pointer"
                  onClick={() => setActivePin('bhavani')}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="w-3 h-3 rounded-full bg-[#ea580c] border-2 border-white dark:border-[#191b20] shadow-sm"></span>
                  </div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 dark:bg-[#191b20]/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-2 transition-transform group-hover:scale-105 border border-black/[0.08] dark:border-white/[0.1]">
                    <span className="w-2 h-2 rounded-full bg-[#ea580c]"></span>
                    <span className="text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold">BHAVANI PETH</span>
                    <span className="font-mono text-[11px] text-[#ea580c] font-semibold tabular-nums">39.6°C</span>
                  </div>
                </div>

                {/* Station 03: Civil Lines Canopy */}
                <div
                  className="absolute bottom-[28%] left-[22%] group cursor-pointer"
                  onClick={() => setActivePin('civil')}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-4 h-4 rounded-full bg-[#059669] animate-pulse opacity-40"></span>
                    <span className="w-3 h-3 rounded-full bg-[#059669] border-2 border-white dark:border-[#191b20] shadow-sm"></span>
                  </div>
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/95 dark:bg-[#191b20]/95 backdrop-blur-md px-3 py-1 rounded-full shadow-md flex items-center gap-2 transition-transform group-hover:scale-105 border border-black/[0.08] dark:border-white/[0.1]">
                    <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
                    <span className="text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold">CIVIL LINES CANOPY</span>
                    <span className="font-mono text-[11px] text-[#059669] font-semibold tabular-nums">28.4°C</span>
                  </div>
                </div>

                {/* Bottom Left Overlay: Floating Thermal Legend */}
                <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-[#191b20]/90 backdrop-blur-md px-3 py-2 rounded-2xl shadow-sm max-w-xs space-y-1.5 border border-black/[0.06] dark:border-white/[0.08]">
                  <span className="text-[10px] uppercase text-[#86868b] dark:text-[#a5a9b4] block font-semibold tracking-wider">
                    Thermal Stratification
                  </span>
                  <div className="w-40 h-2 rounded-full bg-gradient-to-r from-[#059669] via-[#ea580c] to-[#dc2626]"></div>
                  <div className="flex justify-between font-mono text-[10px] text-[#6e6e73] dark:text-[#a5a9b4]">
                    <span>28.4°C (Cool)</span>
                    <span>42.1°C (Heat)</span>
                  </div>
                </div>

                {/* Coordinate HUD Top-Right */}
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#191b20]/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm font-mono text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7] flex items-center gap-2 border border-black/[0.06] dark:border-white/[0.08]">
                  <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
                  <span>SIM LST: 35.8°C MEAN</span>
                </div>
              </div>

              {/* Quick Micro-Inspector Sub-Bar */}
              <div className="px-5 py-3 bg-[#fafafc] dark:bg-[#22252b] flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                <div className="flex items-center gap-5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#86868b] dark:text-[#a5a9b4]">Thermal Inversion:</span>
                    <span className="font-mono font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">+13.7°C Gradient</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#86868b] dark:text-[#a5a9b4]">Canopy Offset:</span>
                    <span className="font-mono font-semibold text-[#059669] dark:text-[#10b981] tabular-nums">-4.2°C Cooling</span>
                  </div>
                </div>
                <Link
                  to="/heat-map"
                  className="text-xs text-[#0071e3] dark:text-[#2997ff] hover:underline flex items-center gap-1 font-medium"
                >
                  <span>Launch Spatial Interactive GIS</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Apple-Grade Metric Cards */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-[28px] bg-[#f5f5f7] dark:bg-[#191b20] border border-black/[0.04] dark:border-white/[0.08] flex flex-col justify-between gap-4 transition-colors">
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] tracking-wider font-semibold">
              Spatial Observations
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl lg:text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight tabular-nums">150,000</span>
              <span className="text-lg text-[#0071e3] dark:text-[#2997ff] font-semibold">+</span>
            </div>
            <p className="text-[13px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed">
              Synthesized microclimate observations across multi-year temporal cycles (2021–2025).
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-[#f5f5f7] dark:bg-[#191b20] border border-black/[0.04] dark:border-white/[0.08] flex flex-col justify-between gap-4 transition-colors">
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] tracking-wider font-semibold">
              Monitored Stations
            </span>
            <div className="my-1">
              <span className="text-3xl lg:text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight tabular-nums">100</span>
            </div>
            <p className="text-[13px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed">
              Spatial sensor coordinates distributed across high-density residential and industrial wards.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-[#f5f5f7] dark:bg-[#191b20] border border-black/[0.04] dark:border-white/[0.08] flex flex-col justify-between gap-4 transition-colors">
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] tracking-wider font-semibold">
              Morphology Zones
            </span>
            <div className="my-1">
              <span className="text-3xl lg:text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight tabular-nums">9</span>
            </div>
            <p className="text-[13px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed">
              Local Climate Zone (LCZ) surface classification layers mapped according to Stewart &amp; Oke protocols.
            </p>
          </div>

          <div className="p-6 rounded-[28px] bg-[#f5f5f7] dark:bg-[#191b20] border border-black/[0.04] dark:border-white/[0.08] flex flex-col justify-between gap-4 transition-colors">
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] tracking-wider font-semibold">
              Urban Heat Island (UHI)
            </span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl lg:text-4xl font-semibold text-[#ea580c] tracking-tight tabular-nums">+4.2°C</span>
            </div>
            <p className="text-[13px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed">
              Peak observed diurnal thermal anomaly between the asphalt core and peri-urban boundary.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Insight Section: Apple Alternating Gray Surface */}
      <section className="w-full bg-[#f5f5f7] dark:bg-[#161617] py-16 lg:py-24 border-y border-black/[0.04] dark:border-white/[0.08] transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-[28px] bg-white dark:bg-[#191b20] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-black/[0.06] dark:border-white/[0.08] gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0071e3] dark:bg-[#2997ff]"></span>
                  <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] font-semibold tracking-wider">
                    EMPIRICAL MICROCLIMATE DISPERSION
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                  Urban Canopy vs. Surface Thermal Delta
                </h2>
                <p className="text-[15px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed">
                  Dual-variable analysis demonstrating the inverse relationship: wards with vegetative cover (NDVI &gt; 0.45) experience an average 3.8°C lower Land Surface Temperature.
                </p>
              </div>

              {/* Metric Key */}
              <div className="flex items-center gap-6 font-mono text-[11px] text-[#6e6e73] dark:text-[#a5a9b4] shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#059669]"></span>
                  <span>NDVI Vegetation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ea580c]"></span>
                  <span>LST Anomaly (°C)</span>
                </div>
              </div>
            </div>

            {/* Dual Axis Scientific Visualizer */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[720px] py-4">
                <div className="relative h-64 w-full flex items-end justify-between px-6">
                  {/* Subtle Threshold Grid Lines */}
                  <div className="absolute inset-x-0 top-1/4 h-[1px] bg-black/[0.04] dark:bg-white/[0.06]"></div>
                  <div className="absolute inset-x-0 top-2/4 h-[1px] bg-black/[0.04] dark:bg-white/[0.06]"></div>
                  <div className="absolute inset-x-0 top-3/4 h-[1px] bg-black/[0.04] dark:bg-white/[0.06]"></div>
                  
                  {/* Critical Indicator */}
                  <div className="absolute inset-x-0 top-[28%] flex items-center justify-end px-4">
                    <span className="font-mono text-[10px] text-[#dc2626] dark:text-[#ef4444] bg-[#fef2f2] dark:bg-[#7f1d1d]/30 px-2.5 py-1 rounded-full border border-[#dc2626]/20 dark:border-[#ef4444]/30 font-medium">
                      CRITICAL UHI THRESHOLD (+3.0°C)
                    </span>
                  </div>

                  {/* Zone Bars */}
                  {[
                    { name: 'Bhavani Peth', ndvi: 18, lst: 84, delta: '+3.9°C', color: 'bg-[#ea580c]' },
                    { name: 'Juma Peth', ndvi: 22, lst: 76, delta: '+3.6°C', color: 'bg-[#ea580c]' },
                    { name: 'MIDC Ind.', ndvi: 12, lst: 92, delta: '+4.2°C', color: 'bg-[#dc2626]' },
                    { name: 'Rly Station', ndvi: 24, lst: 68, delta: '+3.1°C', color: 'bg-[#ea580c]' },
                    { name: 'Ashok Chowk', ndvi: 31, lst: 52, delta: '+2.4°C', color: 'bg-[#d97706]' },
                    { name: 'Saat Rasta', ndvi: 48, lst: 38, delta: '+1.6°C', color: 'bg-[#d97706]' },
                    { name: 'Hotgi Fringe', ndvi: 56, lst: 25, delta: '+0.9°C', color: 'bg-[#059669]' },
                    { name: 'Lake Environs', ndvi: 64, lst: 18, delta: '+0.4°C', color: 'bg-[#059669]' },
                    { name: 'Civil Lines', ndvi: 82, lst: 10, delta: '-0.8°C', color: 'bg-[#059669]' },
                  ].map((zone, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2 flex-1 z-10 group cursor-pointer">
                      <div className="flex items-end gap-1.5 h-48 w-full justify-center">
                        <div
                          className="w-3.5 bg-[#059669]/80 rounded-t-md hover:bg-[#059669] transition-all"
                          style={{ height: `${zone.ndvi}%` }}
                          title={`NDVI: 0.${zone.ndvi}`}
                        />
                        <div
                          className={`w-3.5 ${zone.color} rounded-t-md hover:opacity-90 transition-all`}
                          style={{ height: `${zone.lst}%` }}
                          title={`LST Anomaly: ${zone.delta}`}
                        />
                      </div>
                      <span className="text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium truncate max-w-[85px]">
                        {zone.name}
                      </span>
                      <span className={`font-mono text-[10px] tabular-nums ${
                        zone.delta.includes('-') ? 'text-[#059669] dark:text-[#10b981] font-semibold' : zone.delta.includes('4.') ? 'text-[#dc2626] dark:text-[#ef4444] font-semibold' : 'text-[#86868b] dark:text-[#a5a9b4]'
                      }`}>
                        {zone.delta}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footnote */}
            <div className="mt-6 pt-4 bg-[#f5f5f7] dark:bg-[#22252b] p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[13px] transition-colors">
              <div className="flex items-center gap-2 text-[#6e6e73] dark:text-[#a5a9b4]">
                <span className="material-symbols-outlined text-[#0071e3] dark:text-[#2997ff] text-[18px]">insights</span>
                <span>
                  Pearson correlation coefficient <strong>r = -0.87</strong> (p &lt; 0.001). Vegetation canopy exhibits exponential cooling capacity above a 35% threshold.
                </span>
              </div>
              <Link
                to="/explore-data"
                className="text-[#0071e3] dark:text-[#2997ff] hover:underline font-medium shrink-0"
              >
                Inspect Full Dataset →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pathway Cards Section */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] font-semibold tracking-wider">
              PLATFORM CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight mt-1">
              Explore Research Capabilities
            </h2>
          </div>
          <span className="font-mono text-[11px] text-[#86868b] dark:text-[#7a7f8d] hidden md:inline">
            TF-141 ARCHITECTURE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Pathway 1 */}
          <Link
            to="/dashboard"
            className="group block p-8 rounded-[28px] bg-white dark:bg-[#191b20] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#22252b] flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:bg-[#0071e3] dark:group-hover:bg-[#2997ff] group-hover:text-white transition-colors mb-6">
              <span className="material-symbols-outlined text-[24px]">show_chart</span>
            </div>
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] font-semibold tracking-wider">
              TEMPORAL ANALYSIS
            </span>
            <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0071e3] dark:group-hover:text-[#2997ff] transition-colors mt-1 mb-2">
              Analyze Heat Patterns
            </h3>
            <p className="text-[14px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed mb-6">
              Inspect time-series telemetry, diurnal curves, and thermal stress probability across Solapur's wards.
            </p>
            <div className="flex items-center gap-1.5 text-[14px] text-[#0071e3] dark:text-[#2997ff] font-medium">
              <span>Launch Dashboard</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>

          {/* Pathway 2 */}
          <Link
            to="/heat-map"
            className="group block p-8 rounded-[28px] bg-white dark:bg-[#191b20] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#22252b] flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:bg-[#0071e3] dark:group-hover:bg-[#2997ff] group-hover:text-white transition-colors mb-6">
              <span className="material-symbols-outlined text-[24px]">map</span>
            </div>
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] font-semibold tracking-wider">
              SPATIAL GIS
            </span>
            <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0071e3] dark:group-hover:text-[#2997ff] transition-colors mt-1 mb-2">
              Explore Geographic Data
            </h3>
            <p className="text-[14px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed mb-6">
              High-resolution GIS heat map combining Solapur boundary layers, raster overlays, and pan-India climate comparison metrics.
            </p>
            <div className="flex items-center gap-1.5 text-[14px] text-[#0071e3] dark:text-[#2997ff] font-medium">
              <span>Open Spatial GIS View</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>

          {/* Pathway 3 */}
          <Link
            to="/methodology"
            className="group block p-8 rounded-[28px] bg-white dark:bg-[#191b20] border border-black/[0.06] dark:border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.07)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#f5f5f7] dark:bg-[#22252b] flex items-center justify-center text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:bg-[#0071e3] dark:group-hover:bg-[#2997ff] group-hover:text-white transition-colors mb-6">
              <span className="material-symbols-outlined text-[24px]">science</span>
            </div>
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] font-semibold tracking-wider">
              METHODOLOGY &amp; SCIENCE
            </span>
            <h3 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] group-hover:text-[#0071e3] dark:group-hover:text-[#2997ff] transition-colors mt-1 mb-2">
              Review Scientific Architecture
            </h3>
            <p className="text-[14px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed mb-6">
              Explore the WRF-Chem atmospheric modeling methods, synthetic data generation algorithms, and peer-reviewed citations.
            </p>
            <div className="flex items-center gap-1.5 text-[14px] text-[#0071e3] dark:text-[#2997ff] font-medium">
              <span>Read Methodology</span>
              <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </div>
          </Link>
        </div>

        {/* Academic Provenance Card */}
        <div className="mt-16 p-8 rounded-[28px] bg-[#f5f5f7] dark:bg-[#191b20] border border-black/[0.04] dark:border-white/[0.08] transition-colors">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#059669] dark:text-[#10b981] text-[18px]">verified</span>
                <span className="text-[11px] uppercase text-[#059669] dark:text-[#10b981] font-bold tracking-wider">
                  Academic Provenance &amp; Simulation Scope
                </span>
              </div>
              <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Team TF-141 · MIT Vishwaprayag University Research Initiative
              </h3>
              <p className="text-[14px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed">
                HeatShield is developed as an academic modeling and computational urban climatology framework. All sensor points, ward boundaries, and temperature records represent synthetic simulated approximations (2021–2025) designed to test urban planning mitigation scenarios, predictive cool corridor routing, and climate adaptation methods.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 font-mono text-[11px]">
              <span className="px-3 py-1.5 rounded-full bg-white dark:bg-[#22252b] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.06] dark:border-white/[0.08] text-center font-medium shadow-xs">
                MODEL: TF-UHI-v2.4
              </span>
              <Link
                to="/methodology"
                className="px-4 py-2 rounded-full bg-[#0071e3] dark:bg-[#2997ff] text-white hover:bg-[#0076df] dark:hover:bg-[#58a6ff] text-center font-medium transition-colors shadow-sm"
              >
                Read Methodology →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
