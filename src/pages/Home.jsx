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
    <div className="flex flex-col w-full">
      {/* Subtle Spatial Grid Texture Layer & Hero Container */}
      <div className="relative w-full max-w-[1400px] mx-auto px-margin py-space-xl">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-center">
          {/* Left Column: Scientific Narrative */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-space-md z-10">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-DEFAULT bg-surface-container-high w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              <span className="font-label-code text-label-code text-on-surface uppercase">
                Solapur Microclimate Observatory · TF-141
              </span>
            </div>

            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight leading-none text-balance">
              Understanding urban heat. Designing cooler cities.
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-prose">
              Explore temperature patterns, analyze urban heat exposure, and understand cooling priorities through environmental data and spatial analysis in Solapur, Maharashtra.
            </p>

            {/* CTA Actions */}
            <div className="flex flex-wrap items-center gap-space-sm pt-space-xs">
              <Link
                to="/heat-map"
                className="inline-flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors shadow-sm"
              >
                <span>Explore Heat Map</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-space-xs px-space-md h-10 rounded-lg bg-surface-container-lowest text-on-surface font-body-md text-body-md hover:bg-surface-container transition-colors shadow-sm border border-outline-variant/40"
              >
                <span>Open Dashboard</span>
                <span className="material-symbols-outlined text-[16px]">query_stats</span>
              </Link>
            </div>

            {/* Telemetry Metadata Tag */}
            <div className="flex items-center gap-space-md pt-space-sm text-outline">
              <div className="flex items-center gap-1 font-label-code text-label-code">
                <span className="material-symbols-outlined text-[14px]">my_location</span>
                <span>17.6599° N, 75.9064° E</span>
              </div>
              <span className="text-surface-variant">•</span>
              <span className="font-label-code text-label-code">EPSG:4326 WGS84</span>
            </div>
          </div>

          {/* Right Column: GIS Simulation Viewport */}
          <div className="lg:col-span-7 relative">
            <div className="w-full rounded-xl bg-surface-container-lowest shadow-md overflow-hidden relative border border-outline-variant/40">
              {/* Viewport Header HUD */}
              <div className="flex items-center justify-between px-space-md py-space-xs bg-surface-container text-on-surface-variant border-b border-outline-variant/30">
                <div className="flex items-center gap-space-sm">
                  <span className="font-caption-caps text-caption-caps uppercase tracking-wider text-on-surface font-semibold">
                    SOLAPUR SYNTHETIC GIS MESH
                  </span>
                  <span className="font-label-code text-label-code text-primary bg-surface-container-lowest px-1.5 py-0.5 rounded-DEFAULT">
                    ACTIVE NODE 100/100
                  </span>
                </div>
                <div className="flex items-center gap-space-xs font-label-code text-label-code text-outline">
                  <span>SCAN RAD: 12.4km</span>
                  <span>•</span>
                  <span>RES: 50m</span>
                </div>
              </div>

              {/* Synthetic Spatial Thermal Layer Display */}
              <div className="relative w-full aspect-[16/10] bg-surface-container-high overflow-hidden select-none">
                {/* Simulated Heat Contour Map via Dynamic SVG */}
                <svg
                  className="absolute inset-0 w-full h-full object-cover"
                  preserveAspectRatio="none"
                  viewBox="0 0 700 450"
                >
                  <defs>
                    <radialGradient cx="75%" cy="35%" id="hero-high-heat-midc" r="40%">
                      <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.55" />
                      <stop offset="45%" stopColor="#ff9770" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#ff9770" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient cx="48%" cy="52%" id="hero-high-heat-bhavani" r="35%">
                      <stop offset="0%" stopColor="#7d2800" stopOpacity="0.6" />
                      <stop offset="50%" stopColor="#ff9770" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ff9770" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient cx="25%" cy="65%" id="hero-cool-canopy" r="38%">
                      <stop offset="0%" stopColor="#016a60" stopOpacity="0.55" />
                      <stop offset="60%" stopColor="#84d5c8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#84d5c8" stopOpacity="0" />
                    </radialGradient>
                    <pattern height="30" id="hero-grid-pattern" patternUnits="userSpaceOnUse" width="30">
                      <path
                        className="text-outline-variant/35"
                        d="M 30 0 L 0 0 0 30"
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
                    className="text-outline/40"
                    d="M 50 180 C 220 190, 360 210, 650 150"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    strokeWidth="1.8"
                  />
                  <path
                    className="text-outline/40"
                    d="M 350 40 C 370 190, 340 310, 360 420"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    className="text-outline/30"
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
                    stroke="#ba1a1a"
                    strokeDasharray="2 4"
                    strokeWidth="1"
                  />
                  <ellipse
                    cx="525"
                    cy="157"
                    fill="none"
                    opacity="0.4"
                    rx="140"
                    ry="90"
                    stroke="#ff9770"
                    strokeWidth="0.8"
                  />
                  <ellipse
                    cx="175"
                    cy="290"
                    fill="none"
                    opacity="0.7"
                    rx="110"
                    ry="75"
                    stroke="#016a60"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  {/* Central Crosshairs */}
                  <line className="text-primary" stroke="currentColor" strokeWidth="1.5" x1="335" x2="365" y1="225" y2="225" />
                  <line className="text-primary" stroke="currentColor" strokeWidth="1.5" x1="350" x2="350" y1="210" y2="240" />
                  <circle className="text-primary/70" cx="350" cy="225" fill="none" r="16" stroke="currentColor" strokeWidth="1" />
                </svg>

                {/* Interactive Geo-Telemetry Data Pins */}
                {/* Station 01: MIDC Industrial (Severe Heat) */}
                <div
                  className="absolute top-[28%] right-[22%] group cursor-pointer"
                  onClick={() => setActivePin('midc')}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-4 h-4 rounded-full bg-error animate-ping opacity-30"></span>
                    <span className="w-3 h-3 rounded-full bg-error border-2 border-surface-container-lowest"></span>
                  </div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-container-lowest px-2 py-1 rounded-DEFAULT shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105 border border-outline-variant/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                    <span className="font-caption-caps text-caption-caps text-on-surface font-semibold">MIDC SECTOR-2</span>
                    <span className="font-label-metric text-label-metric text-error">42.1°C</span>
                  </div>
                </div>

                {/* Station 02: Bhavani Peth (Dense Commercial) */}
                <div
                  className="absolute top-[48%] left-[46%] group cursor-pointer"
                  onClick={() => setActivePin('bhavani')}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container border-2 border-surface-container-lowest"></span>
                  </div>
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-container-lowest px-2 py-1 rounded-DEFAULT shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105 border border-outline-variant/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    <span className="font-caption-caps text-caption-caps text-on-surface font-semibold">BHAVANI PETH</span>
                    <span className="font-label-metric text-label-metric text-tertiary">39.6°C</span>
                  </div>
                </div>

                {/* Station 03: Civil Lines / Cantonment (Canopy Protected) */}
                <div
                  className="absolute bottom-[28%] left-[22%] group cursor-pointer"
                  onClick={() => setActivePin('civil')}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="absolute w-4 h-4 rounded-full bg-secondary animate-pulse opacity-40"></span>
                    <span className="w-3 h-3 rounded-full bg-secondary border-2 border-surface-container-lowest"></span>
                  </div>
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-surface-container-lowest px-2 py-1 rounded-DEFAULT shadow-md flex items-center gap-1.5 transition-transform group-hover:scale-105 border border-outline-variant/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    <span className="font-caption-caps text-caption-caps text-on-surface font-semibold">CIVIL LINES CANOPY</span>
                    <span className="font-label-metric text-label-metric text-secondary">28.4°C</span>
                  </div>
                </div>

                {/* Bottom Left Overlay: Live Dynamic Legend */}
                <div className="absolute bottom-3 left-3 bg-surface-container-lowest/90 backdrop-blur-sm p-space-sm rounded-DEFAULT shadow-sm max-w-xs space-y-1 border border-outline-variant/30">
                  <span className="font-caption-caps text-caption-caps uppercase text-outline block font-semibold">
                    Thermal Stratification
                  </span>
                  <div className="w-44 h-2 rounded-full bg-gradient-to-r from-secondary via-tertiary-container to-error"></div>
                  <div className="flex justify-between font-label-code text-label-code text-on-surface-variant pt-0.5">
                    <span>28.4°C (Park)</span>
                    <span>42.1°C (Asphalt)</span>
                  </div>
                </div>

                {/* Coordinate Hud Top-Right */}
                <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-1 rounded-DEFAULT shadow-sm font-label-code text-label-code text-on-surface flex items-center gap-2 border border-outline-variant/30">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  <span>SYNTH-SIM LST: 35.8°C AVG</span>
                </div>
              </div>

              {/* Quick Micro-Inspector Sub-Bar */}
              <div className="p-space-sm bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/30">
                <div className="flex items-center gap-space-md">
                  <div className="flex items-center gap-1.5">
                    <span className="font-caption-caps text-caption-caps uppercase text-outline">Thermal Inversion:</span>
                    <span className="font-label-metric text-label-metric text-on-surface">+13.7°C Gradient</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-caption-caps text-caption-caps uppercase text-outline">Canopy Offset:</span>
                    <span className="font-label-metric text-label-metric text-secondary">-4.2°C Cooling</span>
                  </div>
                </div>
                <Link
                  to="/heat-map"
                  className="font-label-code text-label-code text-primary flex items-center gap-1 hover:underline font-semibold"
                >
                  <span>Inspect Raw Polygon Mesh</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Research Metrics Bar (Restrained, high-density scientific stat blocks) */}
        <div className="mt-space-xl grid grid-cols-2 md:grid-cols-4 gap-gutter">
          {/* Metric 1 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/40">
            <span className="font-caption-caps text-caption-caps uppercase text-outline tracking-wider font-semibold">
              Spatial Observation Points
            </span>
            <div className="my-space-xs flex items-baseline gap-1">
              <span className="font-headline-xl text-headline-xl text-primary font-bold">150,000</span>
              <span className="font-headline-md text-headline-md text-primary">+</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Simulated Observations across synthetic multi-year climate layers (2021–2025).
            </p>
          </div>

          {/* Metric 2 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/40">
            <span className="font-caption-caps text-caption-caps uppercase text-outline tracking-wider font-semibold">
              Telemetry Sensors
            </span>
            <div className="my-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">100</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Modeled Monitoring Stations dynamically mapped across Solapur Municipal boundaries.
            </p>
          </div>

          {/* Metric 3 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/40">
            <span className="font-caption-caps text-caption-caps uppercase text-outline tracking-wider font-semibold">
              Morphology Categorization
            </span>
            <div className="my-space-xs">
              <span className="font-headline-xl text-headline-xl text-on-surface font-bold">9</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Distinct Urban Canopy Zone classifications according to LCZ surface schemas.
            </p>
          </div>

          {/* Metric 4 */}
          <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-col justify-between border border-outline-variant/40">
            <span className="font-caption-caps text-caption-caps uppercase text-outline tracking-wider font-semibold">
              Urban Heat Island (UHI)
            </span>
            <div className="my-space-xs flex items-baseline gap-1">
              <span className="font-headline-xl text-headline-xl text-tertiary-container font-bold">4.2°C</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Max observed Urban Heat Island thermal anomaly between dense core and fringe zones.
            </p>
          </div>
        </div>

        {/* Featured Deep-Dive Insight Section: Dual-Axis Correlation Chart */}
        <div className="mt-space-xl p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-md mb-space-md border-b border-outline-variant/20">
            <div className="space-y-space-xs max-w-2xl">
              <div className="flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                <span className="font-caption-caps text-caption-caps uppercase text-outline font-semibold">
                  EMPIRICAL MICROCLIMATE DISPERSION
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Urban Canopy vs. Surface Thermal Delta
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Dual-variable synthesis confirming inverse relationship: zones with Normalized Difference Vegetation Index (NDVI) &gt; 0.45 exhibit up to 3.8°C lower average surface thermal stress.
              </p>
            </div>
            {/* Metric Key */}
            <div className="flex items-center gap-space-lg mt-space-sm md:mt-0 font-label-code text-label-code">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="text-on-surface">NDVI Index (0.0 – 1.0)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                <span className="text-on-surface">LST Anomaly (°C above baseline)</span>
              </div>
            </div>
          </div>

          {/* Dual Axis Scientific Graph Visualization */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[720px] py-space-sm">
              <div className="relative h-64 w-full flex items-end justify-between px-space-md">
                {/* Background Horizontal Threshold Lines */}
                <div className="absolute inset-x-0 top-1/4 h-[1px] bg-outline-variant/30"></div>
                <div className="absolute inset-x-0 top-2/4 h-[1px] bg-outline-variant/30"></div>
                <div className="absolute inset-x-0 top-3/4 h-[1px] bg-outline-variant/30"></div>
                {/* Threshold indicator line for critical heat */}
                <div className="absolute inset-x-0 top-[30%] flex items-center justify-end px-2">
                  <span className="font-label-code text-label-code text-error bg-surface-container-lowest px-1.5 py-0.5 rounded-DEFAULT shadow-sm border border-error/30">
                    CRITICAL UHI THRESHOLD (+3.0°C)
                  </span>
                </div>

                {/* Zone Bars */}
                {[
                  { name: 'Bhavani Peth', ndvi: 18, lst: 84, delta: '+3.9°C', color: 'bg-tertiary-container' },
                  { name: 'Juma Peth', ndvi: 22, lst: 76, delta: '+3.6°C', color: 'bg-tertiary-container' },
                  { name: 'MIDC Ind.', ndvi: 12, lst: 92, delta: '+4.2°C', color: 'bg-error' },
                  { name: 'Rly Station', ndvi: 24, lst: 68, delta: '+3.1°C', color: 'bg-tertiary-container' },
                  { name: 'Ashok Chowk', ndvi: 31, lst: 52, delta: '+2.4°C', color: 'bg-tertiary' },
                  { name: 'Saat Rasta', ndvi: 48, lst: 38, delta: '+1.6°C', color: 'bg-on-tertiary-container' },
                  { name: 'Hotgi Fringe', ndvi: 56, lst: 25, delta: '+0.9°C', color: 'bg-on-tertiary-container' },
                  { name: 'Lake Environs', ndvi: 64, lst: 18, delta: '+0.4°C', color: 'bg-secondary-fixed-dim' },
                  { name: 'Civil Lines', ndvi: 82, lst: 10, delta: '-0.8°C', color: 'bg-secondary-fixed' },
                ].map((zone, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-space-xs flex-1 z-10 group cursor-pointer">
                    <div className="flex items-end gap-1.5 h-48 w-full justify-center">
                      <div
                        className="w-4 bg-secondary/80 rounded-t-DEFAULT hover:bg-secondary transition-all"
                        style={{ height: `${zone.ndvi}%` }}
                        title={`NDVI: 0.${zone.ndvi}`}
                      />
                      <div
                        className={`w-4 ${zone.color} rounded-t-DEFAULT hover:opacity-90 transition-all`}
                        style={{ height: `${zone.lst}%` }}
                        title={`LST Anomaly: ${zone.delta}`}
                      />
                    </div>
                    <span className="font-caption-caps text-caption-caps text-on-surface font-medium truncate max-w-[80px]">
                      {zone.name}
                    </span>
                    <span className={`font-label-code text-label-code ${zone.delta.includes('-') ? 'text-secondary font-semibold' : zone.delta.includes('4.') ? 'text-error font-semibold' : 'text-outline'}`}>
                      {zone.delta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Graph Analytical Footnote */}
          <div className="mt-space-md pt-space-sm bg-surface-container-low p-space-sm rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm text-on-surface-variant font-body-sm text-body-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">insights</span>
              <span>
                Pearson correlation coefficient r = -0.87 (p &lt; 0.001). Vegetation density exhibits exponential cooling capacity above 35% canopy threshold.
              </span>
            </div>
            <Link
              to="/explore-data"
              className="font-label-code text-label-code text-primary hover:underline whitespace-nowrap font-semibold"
            >
              Open Dataset Ledger →
            </Link>
          </div>
        </div>

        {/* Explore Platform Pathways (3 Editorial Cards) */}
        <div className="mt-space-xl">
          <div className="flex items-center justify-between mb-space-md">
            <div>
              <span className="font-caption-caps text-caption-caps uppercase text-outline font-semibold">
                RESEARCH ENGINE MODULES
              </span>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">
                Explore Analytical Capabilities
              </h3>
            </div>
            <span className="font-label-code text-label-code text-outline hidden md:inline">
              SYSTEM CAPABILITIES · TF-141
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Card 1 */}
            <Link
              to="/dashboard"
              className="group block p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all border border-outline-variant/40 hover:border-primary/40"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors mb-space-md">
                <span className="material-symbols-outlined text-[22px]">show_chart</span>
              </div>
              <span className="font-caption-caps text-caption-caps uppercase text-outline font-semibold">
                TEMPORAL ANALYSIS
              </span>
              <h4 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors my-1">
                Analyze Heat Patterns
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                Inspect time-series telemetry, diurnal fluctuations, seasonal variances, and thermal stress probability curves across Solapur's wards.
              </p>
              <div className="flex items-center gap-1 font-label-code text-label-code text-primary font-semibold">
                <span>Launch Dashboard</span>
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>

            {/* Card 2 */}
            <Link
              to="/heat-map"
              className="group block p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all border border-outline-variant/40 hover:border-primary/40"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors mb-space-md">
                <span className="material-symbols-outlined text-[22px]">map</span>
              </div>
              <span className="font-caption-caps text-caption-caps uppercase text-outline font-semibold">
                SPATIAL ENVELOPE
              </span>
              <h4 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors my-1">
                Explore Geographic Data
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                High-resolution GIS heat map combining Solapur microclimate boundary layers, regional Maharashtra vectors, and all-India climate comparison metrics.
              </p>
              <div className="flex items-center gap-1 font-label-code text-label-code text-primary font-semibold">
                <span>Open Spatial GIS View</span>
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>

            {/* Card 3 */}
            <Link
              to="/methodology"
              className="group block p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all border border-outline-variant/40 hover:border-primary/40"
            >
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-container group-hover:text-on-primary transition-colors mb-space-md">
                <span className="material-symbols-outlined text-[22px]">park</span>
              </div>
              <span className="font-caption-caps text-caption-caps uppercase text-outline font-semibold">
                INTERVENTION ENGINE
              </span>
              <h4 className="font-headline-md text-headline-md text-on-surface group-hover:text-primary transition-colors my-1">
                Understand Cooling Priorities
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant mb-space-md">
                Evaluate simulated urban intervention packages including albedo roof retrofitting, urban tree canopy corridors, and permeable surface expansion.
              </p>
              <div className="flex items-center gap-1 font-label-code text-label-code text-primary font-semibold">
                <span>Review Interventions</span>
                <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Academic Provenance & Integrity Statement */}
        <div className="mt-space-xl p-space-lg rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
            <div className="space-y-space-xs max-w-3xl">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span className="font-caption-caps text-caption-caps uppercase text-primary font-bold">
                  Academic Provenance &amp; Simulation Scope
                </span>
              </div>
              <h4 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Team TF-141 · MIT Vishwaprayag University Research Initiative
              </h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                HeatShield is developed as an academic modeling and computational urban climatology framework. All sensor points, ward boundaries, and temperature records represent synthetic simulated approximations (2021–2025) designed to test urban planning mitigation scenarios, predictive cool corridor routing, and climate adaptation methods.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-space-xs shrink-0 font-label-code text-label-code">
              <span className="px-space-sm py-1 rounded-DEFAULT bg-surface-container text-on-surface border border-outline-variant/30 text-center font-medium">
                MODEL ARCHITECTURE: TF-UHI-v2.4
              </span>
              <Link
                to="/methodology"
                className="px-space-sm py-1 rounded-DEFAULT bg-surface-container-highest text-primary hover:underline text-center font-semibold"
              >
                Read Scientific Methodology →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
