import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchHeatmapGeoJSON, 
  fetchAvailableDates 
} from '../services/heatmapService';
import HeatMap, { HeatShieldMap } from '../components/map/HeatMap';

const STATIONS = {
  14: {
    code: "STATION #014",
    title: "Bhavani Peth",
    subtype: "Dense Commercial Wholesale Corridor • Core Urban Heat Island",
    coords: "17.6715° N, 75.9104° E",
    elev: "Elev: 458m",
    temp: "41.8",
    anomaly: "+3.9°C anomaly vs. rural baseline",
    canopy: "6.2%",
    canopyStatus: "Deficit",
    impervious: "88.4%",
    imperviousStatus: "Critical",
    albedo: "0.12",
    albedoType: "Asphalt",
    peak: "Peak: 14:00 (42.1°)",
    sparklineD: "M 0,65 Q 40,68 80,60 T 160,35 Q 200,10 220,15 T 280,45 L 320,58",
    sparklineFill: "M 0,65 Q 40,68 80,60 T 160,35 Q 200,10 220,15 T 280,45 L 320,58 L 320,80 L 0,80 Z",
    peakCx: "210",
    peakCy: "12",
    interventionTitle: "Pocket Micro-Forestry & Cool Roofs",
    interventionDesc: "Increasing albedo from 0.12 to 0.40 on warehouse corrugated iron sheets models an estimated 1.8°C reduction in local air temp."
  },
  28: {
    code: "STATION #028",
    title: "Old Solapur City",
    subtype: "High-density Residential Heritage Precinct • Narrow Street Canyons",
    coords: "17.6620° N, 75.9010° E",
    elev: "Elev: 462m",
    temp: "39.4",
    anomaly: "+2.7°C anomaly vs. rural baseline",
    canopy: "9.4%",
    canopyStatus: "Deficit",
    impervious: "81.2%",
    imperviousStatus: "High",
    albedo: "0.15",
    albedoType: "Masonry",
    peak: "Peak: 14:30 (39.8°)",
    sparklineD: "M 0,68 Q 40,70 80,64 T 160,42 Q 200,18 220,20 T 280,48 L 320,62",
    sparklineFill: "M 0,68 Q 40,70 80,64 T 160,42 Q 200,18 220,20 T 280,48 L 320,62 L 320,80 L 0,80 Z",
    peakCx: "215",
    peakCy: "18",
    interventionTitle: "Canyon Shading & Permeable Pavers",
    interventionDesc: "Vertical fabric canopies and retrofitting stone alleys with permeable drainage cuts surface heat emission by 2.2°C."
  },
  73: {
    code: "STATION #073",
    title: "Kegaon Boundary",
    subtype: "Peri-urban Agro-corridor & Transitional Open Plain",
    coords: "17.7012° N, 75.8611° E",
    elev: "Elev: 471m",
    temp: "33.2",
    anomaly: "-0.8°C anomaly vs. urban core",
    canopy: "24.8%",
    canopyStatus: "Moderate",
    impervious: "32.6%",
    imperviousStatus: "Normal",
    albedo: "0.22",
    albedoType: "Soil/Agri",
    peak: "Peak: 13:30 (34.0°)",
    sparklineD: "M 0,72 Q 40,74 80,68 T 160,52 Q 200,32 220,35 T 280,56 L 320,68",
    sparklineFill: "M 0,72 Q 40,74 80,68 T 160,52 Q 200,32 220,35 T 280,56 L 320,68 L 320,80 L 0,80 Z",
    peakCx: "205",
    peakCy: "32",
    interventionTitle: "Agro-forestry Shelterbelts",
    interventionDesc: "Preserving seasonal vegetation bands prevents warm advection downwind toward western suburban wards."
  },
  89: {
    code: "STATION #089",
    title: "Chhattrapati Sambhaji MIDC",
    subtype: "Heavy Fabrications & Metal Stamping Industrial Park",
    coords: "17.6890° N, 75.9420° E",
    elev: "Elev: 452m",
    temp: "42.6",
    anomaly: "+4.7°C anomaly vs. rural baseline",
    canopy: "3.8%",
    canopyStatus: "Severe",
    impervious: "94.2%",
    imperviousStatus: "Critical",
    albedo: "0.09",
    albedoType: "Industrial Bitumen",
    peak: "Peak: 14:15 (43.2°)",
    sparklineD: "M 0,62 Q 40,64 80,55 T 160,28 Q 200,6 220,8 T 280,38 L 320,52",
    sparklineFill: "M 0,62 Q 40,64 80,55 T 160,28 Q 200,6 220,8 T 280,38 L 320,52 L 320,80 L 0,80 Z",
    peakCx: "212",
    peakCy: "7",
    interventionTitle: "Solar Reflective Coating & Bio-Swales",
    interventionDesc: "Mandating solar reflective index (SRI > 78) across expansive factory roofs reduces localized thermal air warming by 3.6°C."
  },
  52: {
    code: "STATION #052",
    title: "PAH Solapur University",
    subtype: "Academic Arboretum & Extensive Tree Sanctuary",
    coords: "17.6380° N, 75.8790° E",
    elev: "Elev: 466m",
    temp: "31.7",
    anomaly: "-2.3°C cool-island mitigation",
    canopy: "46.2%",
    canopyStatus: "Optimal",
    impervious: "21.4%",
    imperviousStatus: "Low",
    albedo: "0.26",
    albedoType: "Canopy Leaf",
    peak: "Peak: 13:00 (32.4°)",
    sparklineD: "M 0,76 Q 40,78 80,72 T 160,58 Q 200,42 220,44 T 280,62 L 320,72",
    sparklineFill: "M 0,76 Q 40,78 80,72 T 160,58 Q 200,42 220,44 T 280,62 L 320,72 L 320,80 L 0,80 Z",
    peakCx: "208",
    peakCy: "42",
    interventionTitle: "Cool Sanctuary Protection",
    interventionDesc: "Designate as municipal biodiversity heat buffer; benchmark canopy evapotranspiration for Solapur urban renewal master plan."
  }
};

/**
 * Resolves full telemetry card data for any station id dynamically.
 * Preserves curated stations #014, #028, #073, #089, #052 while extending
 * to support all 100 Solapur stations and live Supabase in-situ records.
 */
function getStationTelemetry(selectedId, features) {
  if (STATIONS[selectedId]) return STATIONS[selectedId];

  const cleanId = String(selectedId).toUpperCase();
  for (const key of Object.keys(STATIONS)) {
    if (cleanId.includes(key) || String(key) === cleanId) {
      return STATIONS[key];
    }
  }

  const feature = features?.find(f => {
    const p = f.properties || f;
    const fId = String(p.grid_id || p.location_id || p.station_id || p.id || '').toUpperCase();
    return fId === cleanId || cleanId.includes(fId);
  });

  const p = feature?.properties || feature;
  if (!p) return STATIONS[14];

  const temp = p.temperature_c ?? p.mean_air_temp ?? 34.2;
  const anomalyNum = (temp - 32.5).toFixed(1);
  const anomalySign = Number(anomalyNum) >= 0 ? `+${anomalyNum}` : `${anomalyNum}`;
  const canopyPct = p.ndvi !== undefined && p.ndvi !== null 
    ? `${Math.max(Number(p.ndvi) * 100, 2.5).toFixed(1)}%` 
    : '8.4%';

  return {
    code: p.grid_id || p.location_id || p.station_id || `STATION #${selectedId}`,
    title: p.location_name || p.name || `Station ${selectedId}`,
    subtype: `${p.zone || 'Urban'} Microclimate Node • Solapur High-Res Grid`,
    coords: `${Number(p.latitude || p.lat || 17.6599).toFixed(4)}° N, ${Number(p.longitude || p.lng || 75.9064).toFixed(4)}° E`,
    elev: `Elev: ${p.elevation_m || 460}m`,
    temp: String(Number(temp).toFixed(1)),
    anomaly: `${anomalySign}°C anomaly vs. baseline`,
    canopy: canopyPct,
    canopyStatus: Number(p.ndvi || 0) < 0.05 ? 'Deficit' : 'Moderate',
    impervious: p.cooling_infra ? '64.0%' : '86.2%',
    imperviousStatus: p.cooling_infra ? 'Moderate' : 'Critical',
    albedo: '0.14',
    albedoType: p.zone || 'Pavement',
    peak: `Peak: 14:15 (${(temp + 1.2).toFixed(1)}°)`,
    sparklineD: "M 0,65 Q 40,68 80,60 T 160,35 Q 200,10 220,15 T 280,45 L 320,58",
    sparklineFill: "M 0,65 Q 40,68 80,60 T 160,35 Q 200,10 220,15 T 280,45 L 320,58 L 320,80 L 0,80 Z",
    peakCx: "210",
    peakCy: "12",
    interventionTitle: p.recommended_intervention || 'Urban Greening & Reflective Cool Roofs',
    interventionDesc: `Targeted microclimate intervention models an estimated ${Math.min(Math.max((temp - 30) * 0.35, 0.8), 2.8).toFixed(1)}°C reduction in local air temperature.`
  };
}

export default function IndiaHeatMap() {
  const [domain, setDomain] = useState('solapur'); // 'solapur' | 'india'
  const [activeLayer, setActiveLayer] = useState('lst'); // 'lst' | 'air' | 'ndvi' | 'hvi'
  const [viewMode, setViewMode] = useState('map'); // 'map' (Leaflet GIS) | 'schematic' (SVG)
  const [timeStep, setTimeStep] = useState(14);
  const [selectedStationId, setSelectedStationId] = useState(14);
  const [panelOpen, setPanelOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cursorCoords, setCursorCoords] = useState("17.6715° N, 75.9104° E");
  
  // Real data state
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchHeatmapGeoJSON('2024-04-15', domain);
        setGeoData(data);
      } catch (err) {
        console.error("Failed to load map GeoJSON", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [domain]);

  const station = getStationTelemetry(selectedStationId, geoData?.features);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width);
    const yPct = ((e.clientY - rect.top) / rect.height);
    
    // Convert to Solapur coordinate bounding box
    const lat = (17.7200 - yPct * 0.1100).toFixed(4);
    const lon = (75.8400 + xPct * 0.1400).toFixed(4);
    setCursorCoords(`${lat}° N, ${lon}° E`);
  };

  const getTimeLabel = (h) => {
    const pad = h < 10 ? `0${h}` : `${h}`;
    if (h === 14) return "14:30 IST (Diurnal Peak)";
    if (h >= 11 && h <= 15) return `${pad}:00 IST (Solar Max)`;
    if (h >= 18 && h <= 23) return `${pad}:00 IST (Twilight Lag)`;
    if (h >= 0 && h <= 5) return `${pad}:00 IST (Nocturnal Min)`;
    return `${pad}:00 IST`;
  };

  return (
    <div className="flex flex-col w-full relative">
      {/* Interactive GIS Control Deck & Map Canvas Container */}
      <div className="relative w-full h-[calc(100vh-76px)] min-h-[640px] overflow-hidden flex flex-col bg-surface-container-low select-none">
        
        {/* Top Floating GIS HUD Bar */}
        <div className="absolute top-space-md left-space-md right-space-md z-30 pointer-events-none flex flex-col gap-space-xs">
          <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest/95 backdrop-blur-md p-space-sm rounded-xl shadow-md pointer-events-auto border border-outline-variant/30">
            
            {/* Left: Territory Switcher */}
            <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
              <button 
                onClick={() => setDomain('solapur')}
                className={`px-space-sm py-1.5 rounded-DEFAULT font-label-code text-label-code transition-all shadow-sm flex items-center gap-1.5 ${
                  domain === 'solapur' 
                    ? 'text-on-primary bg-primary-container font-semibold' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                id="viewSolapurBtn"
              >
                <span className={`w-2 h-2 rounded-full ${domain === 'solapur' ? 'bg-secondary-fixed' : 'bg-outline-variant'}`}></span>
                <span>Solapur High-Res (100 Nodes)</span>
              </button>
              
              <button 
                onClick={() => setDomain('india')}
                className={`px-space-sm py-1.5 rounded-DEFAULT font-label-code text-label-code transition-all flex items-center gap-1.5 ${
                  domain === 'india' 
                    ? 'text-on-primary bg-primary-container font-semibold' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                id="viewIndiaBtn"
              >
                <span className={`w-2 h-2 rounded-full ${domain === 'india' ? 'bg-secondary-fixed' : 'bg-outline-variant'}`}></span>
                <span>Pan-India Reanalysis</span>
              </button>
            </div>

            {/* View Mode Switcher: Leaflet GIS vs Vector Schematic */}
            <div className="flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-space-sm py-1.5 rounded-DEFAULT font-label-code text-label-code transition-all flex items-center gap-1.5 ${
                  viewMode === 'map'
                    ? 'text-on-primary bg-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Switch to Interactive Leaflet Map"
                id="viewLeafletMapBtn"
              >
                <span className="material-symbols-outlined text-[15px]">map</span>
                <span>Leaflet GIS</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('schematic')}
                className={`px-space-sm py-1.5 rounded-DEFAULT font-label-code text-label-code transition-all flex items-center gap-1.5 ${
                  viewMode === 'schematic'
                    ? 'text-on-primary bg-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Switch to Vector Microclimate Model"
                id="viewSchematicBtn"
              >
                <span className="material-symbols-outlined text-[15px]">hub</span>
                <span>Vector Model</span>
              </button>
            </div>

            {/* Center: Layer Toggles */}
            <div className="hidden xl:flex items-center gap-space-xs bg-surface-container-low p-1 rounded-lg">
              <button 
                onClick={() => setActiveLayer('lst')}
                className={`layer-pill px-space-sm py-1 rounded-DEFAULT font-caption-caps text-caption-caps uppercase tracking-wider transition-colors ${
                  activeLayer === 'lst' 
                    ? 'text-on-primary bg-primary font-bold shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Surface Temp (LST)
              </button>
              <button 
                onClick={() => setActiveLayer('air')}
                className={`layer-pill px-space-sm py-1 rounded-DEFAULT font-caption-caps text-caption-caps uppercase tracking-wider transition-colors ${
                  activeLayer === 'air' 
                    ? 'text-on-primary bg-primary font-bold shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Air 2m Temp
              </button>
              <button 
                onClick={() => setActiveLayer('ndvi')}
                className={`layer-pill px-space-sm py-1 rounded-DEFAULT font-caption-caps text-caption-caps uppercase tracking-wider transition-colors ${
                  activeLayer === 'ndvi' 
                    ? 'text-on-primary bg-primary font-bold shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Canopy (NDVI)
              </button>
              <button 
                onClick={() => setActiveLayer('hvi')}
                className={`layer-pill px-space-sm py-1 rounded-DEFAULT font-caption-caps text-caption-caps uppercase tracking-wider transition-colors ${
                  activeLayer === 'hvi' 
                    ? 'text-on-primary bg-primary font-bold shadow-sm' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Vulnerability (HVI)
              </button>
            </div>

            {/* Center-Right: Temporal Control Scrub */}
            <div className="flex items-center gap-space-sm px-space-sm py-1 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-secondary text-[18px]">schedule</span>
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-space-sm">
                  <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">Temporal Step</span>
                  <span className="font-label-code text-label-code text-primary font-semibold" id="timeLabel">
                    {getTimeLabel(Number(timeStep))}
                  </span>
                </div>
                <input 
                  className="w-36 sm:w-44 h-1 bg-surface-variant rounded-lg appearance-none cursor-pointer accent-secondary" 
                  id="timeScrubber" 
                  max="23" 
                  min="0" 
                  type="range" 
                  value={timeStep}
                  onChange={(e) => setTimeStep(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Actions & Coords Locator */}
            <div className="flex items-center gap-space-xs">
              <div className="hidden md:flex items-center gap-space-xs px-space-sm py-1 bg-surface-container rounded-DEFAULT">
                <span className="material-symbols-outlined text-outline text-[16px]">explore</span>
                <span className="font-label-code text-label-code text-on-surface" id="cursorCoords">
                  {cursorCoords}
                </span>
              </div>
              <button 
                onClick={() => { setZoomLevel(1); setSelectedStationId(14); }}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface transition-colors flex items-center justify-center" 
                title="Reset Camera View"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
              <button 
                onClick={() => setPanelOpen(!panelOpen)}
                className="p-2 rounded-lg bg-surface-container hover:bg-surface-variant text-on-surface transition-colors flex items-center justify-center" 
                title="Toggle Inspector"
              >
                <span className="material-symbols-outlined text-[18px]">view_sidebar</span>
              </button>
            </div>
          </div>

          {/* Provenance Micro-Banner Floating */}
          <div className="self-start inline-flex items-center gap-space-xs px-space-sm py-1 rounded-DEFAULT bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface-variant shadow-sm pointer-events-auto border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span className="font-label-code text-label-code uppercase tracking-tight text-on-surface">
              Model Domain: WRF-Chem Urban Canopy Microscale • Sim. Grid Seed: 2024.05.18-IST
            </span>
          </div>
        </div>

        {/* Main Dynamic GIS Cartographic Surface */}
        <div 
          className="relative w-full h-full flex-1 overflow-hidden bg-surface-container-high" 
          id="mapViewport"
          onMouseMove={handleMouseMove}
        >
          {viewMode === 'map' ? (
            /* Interactive Leaflet GIS Map Stage */
            <div className="w-full h-full relative">
              <HeatShieldMap
                domain={domain}
                onDomainChange={setDomain}
                markers={geoData?.features || []}
                selectedLayer={
                  activeLayer === 'lst'
                    ? 'surface_lst'
                    : activeLayer === 'air'
                    ? 'air_temp'
                    : activeLayer === 'hvi'
                    ? 'risk'
                    : 'cooling_score'
                }
                onLayerChange={(layer) => {
                  if (layer === 'surface_lst') setActiveLayer('lst');
                  else if (layer === 'air_temp') setActiveLayer('air');
                  else if (layer === 'risk') setActiveLayer('hvi');
                  else setActiveLayer('ndvi');
                }}
                selectedLocationId={selectedStationId}
                onSelectLocation={(loc) => {
                  const id = loc.grid_id || loc.location_id || loc.id;
                  setSelectedStationId(id);
                  setPanelOpen(true);
                  const lat = loc.latitude ?? loc.lat;
                  const lng = loc.longitude ?? loc.lng;
                  if (lat !== undefined && lng !== undefined) {
                    setCursorCoords(`${Number(lat).toFixed(4)}° N, ${Number(lng).toFixed(4)}° E`);
                  }
                }}
                isLoading={loading}
                activeDate="2024-04-15"
                provenanceLabel={geoData?.properties?.source}
                className="w-full h-full border-none rounded-none"
                height="100%"
                showControls={false}
                showLegend={true}
                showIntensityToggle={true}
              />
            </div>
          ) : (
            /* Solapur High-Res Cartographic Vector Engine */
            <svg 
              className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing" 
              id="cartoCanvas" 
              preserveAspectRatio="xMidYMid slice" 
              viewBox="0 0 1600 950"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Thermal Heat Plume Gradients */}
                <radialGradient cx="50%" cy="50%" id="heatCoreBhavani" r="50%">
                  <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.75"></stop>
                  <stop offset="35%" stopColor="#ff9770" stopOpacity="0.55"></stop>
                  <stop offset="70%" stopColor="#ffdbcf" stopOpacity="0.30"></stop>
                  <stop offset="100%" stopColor="#ffdad6" stopOpacity="0"></stop>
                </radialGradient>
                <radialGradient cx="45%" cy="45%" id="heatCoreOldCity" r="55%">
                  <stop offset="0%" stopColor="#7d2800" stopOpacity="0.8"></stop>
                  <stop offset="40%" stopColor="#ba1a1a" stopOpacity="0.5"></stop>
                  <stop offset="75%" stopColor="#ffb59b" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#f6faf7" stopOpacity="0"></stop>
                </radialGradient>
                <radialGradient cx="50%" cy="50%" id="heatCoreMIDC" r="50%">
                  <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.85"></stop>
                  <stop offset="30%" stopColor="#ff9770" stopOpacity="0.6"></stop>
                  <stop offset="70%" stopColor="#f0f5f1" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#f6faf7" stopOpacity="0"></stop>
                </radialGradient>
                
                {/* Water Cooling Gradient */}
                <radialGradient cx="50%" cy="50%" id="lakeCooling" r="50%">
                  <stop offset="0%" stopColor="#9ff2e4" stopOpacity="0.85"></stop>
                  <stop offset="50%" stopColor="#016a60" stopOpacity="0.45"></stop>
                  <stop offset="100%" stopColor="#00362a" stopOpacity="0"></stop>
                </radialGradient>
                
                <pattern height="40" id="urbanGridPattern" patternUnits="userSpaceOnUse" width="40">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#c0c8c4" strokeOpacity="0.4" strokeWidth="0.5"></path>
                </pattern>
              </defs>

              {/* Base GIS Coordinate Grid Mesh */}
              <rect fill="url(#urbanGridPattern)" height="100%" width="100%"></rect>

              {/* Topographic / Zonal Contours (Solapur Municipality Outline) */}
              <path d="M 380,180 Q 580,120 840,160 T 1240,240 Q 1380,420 1310,640 T 1080,820 Q 820,890 540,780 T 320,560 Q 260,340 380,180 Z" fill="#eaefeb" fillOpacity="0.6" stroke="#c0c8c4" strokeDasharray="4,4" strokeWidth="1.5"></path>

              {/* Major Highway Corridors */}
              {/* NH 65 Pune-Solapur-Hyderabad */}
              <path d="M 120,410 C 450,430 750,470 1480,510" fill="none" opacity="0.9" stroke="#ffffff" strokeLinecap="round" strokeWidth="8"></path>
              <path d="M 120,410 C 450,430 750,470 1480,510" fill="none" opacity="0.6" stroke="#707975" strokeLinecap="round" strokeWidth="3"></path>

              {/* NH 52 Bijapur-Solapur Bypass */}
              <path d="M 720,110 C 760,390 810,680 890,920" fill="none" opacity="0.9" stroke="#ffffff" strokeLinecap="round" strokeWidth="7"></path>
              <path d="M 720,110 C 760,390 810,680 890,920" fill="none" opacity="0.6" stroke="#707975" strokeLinecap="round" strokeWidth="2.5"></path>

              {/* Siddheshwar Lake & Water Bodies */}
              <g id="waterBodyGroup">
                <path d="M 740,430 C 770,410 820,430 835,465 C 840,490 810,530 770,520 C 735,510 720,460 740,430 Z" fill="#84d5c8" stroke="#016a60" strokeWidth="1.5"></path>
                <ellipse cx="780" cy="470" fill="url(#lakeCooling)" rx="130" ry="110"></ellipse>
                <text className="font-caption-caps text-[11px] fill-on-secondary-fixed tracking-wider font-semibold pointer-events-none" x="745" y="475">SIDDHESHWAR LAKE (27.4°C)</text>
              </g>

              {/* Thermal Plumes / UHI Heat Pockets */}
              <g className="transition-opacity duration-300" id="thermalIslands">
                <circle cx="820" cy="510" fill="url(#heatCoreBhavani)" r="190"></circle>
                <circle cx="710" cy="410" fill="url(#heatCoreOldCity)" r="160"></circle>
                <circle cx="1120" cy="580" fill="url(#heatCoreMIDC)" r="230"></circle>
                <circle cx="480" cy="380" fill="url(#heatCoreBhavani)" opacity="0.75" r="140"></circle>
              </g>

              {/* Heat Contour Isotherms */}
              <path d="M 640,320 C 760,310 930,360 980,480 C 1020,570 940,680 820,690 C 710,700 620,580 610,470 Z" fill="none" opacity="0.6" stroke="#ba1a1a" strokeDasharray="2,3" strokeWidth="1.5"></path>
              <path d="M 580,260 C 780,240 1020,310 1070,490 C 1110,630 990,750 790,750 C 630,750 520,600 510,440 Z" fill="none" opacity="0.4" stroke="#7d2800" strokeWidth="1"></path>

              {/* Sensor Station Markers (Interactive Nodes) */}
              <g id="stationNodes">
                
                {/* Station 014 - Bhavani Peth */}
                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(14); setPanelOpen(true); }}
                  transform="translate(820, 510)"
                >
                  <circle className="fill-error/20 animate-ping" r="22"></circle>
                  <circle className="fill-surface-container-lowest stroke-error" r="12" strokeWidth="3"></circle>
                  <circle className="fill-error" r="5"></circle>
                  <rect className="fill-surface-container-lowest/95 shadow-sm stroke-outline-variant/40" height="28" rx="4" strokeWidth="1" width="138" x="18" y="-14"></rect>
                  <text className="font-label-code text-[11px] fill-on-surface font-semibold" x="26" y="4">#014 Bhavani Peth</text>
                  <text className="font-label-code text-[11px] fill-error font-bold" x="122" y="4">41.8°</text>
                </g>

                {/* Station 028 - Old Solapur */}
                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(28); setPanelOpen(true); }}
                  transform="translate(680, 430)"
                >
                  <circle className="fill-surface-container-lowest stroke-tertiary-container hover:scale-125 transition-transform" r="9" strokeWidth="2.5"></circle>
                  <circle className="fill-tertiary-container" r="4"></circle>
                  <rect className="fill-surface-container-lowest/90 stroke-outline-variant/30" height="24" rx="4" strokeWidth="1" width="124" x="14" y="-12"></rect>
                  <text className="font-label-code text-[10px] fill-on-surface" x="20" y="4">#028 Old Solapur</text>
                  <text className="font-label-code text-[10px] fill-tertiary font-bold" x="108" y="4">39.4°</text>
                </g>

                {/* Station 073 - Kegaon Rural Boundary */}
                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(73); setPanelOpen(true); }}
                  transform="translate(430, 360)"
                >
                  <circle className="fill-surface-container-lowest stroke-secondary hover:scale-125 transition-transform" r="9" strokeWidth="2.5"></circle>
                  <circle className="fill-secondary" r="4"></circle>
                  <rect className="fill-surface-container-lowest/90 stroke-outline-variant/30" height="24" rx="4" strokeWidth="1" width="105" x="14" y="-12"></rect>
                  <text className="font-label-code text-[10px] fill-on-surface" x="20" y="4">#073 Kegaon</text>
                  <text className="font-label-code text-[10px] fill-secondary font-bold" x="90" y="4">33.2°</text>
                </g>

                {/* Station 089 - Chhattrapati Sambhaji MIDC */}
                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(89); setPanelOpen(true); }}
                  transform="translate(1120, 560)"
                >
                  <circle className="fill-surface-container-lowest stroke-error hover:scale-125 transition-transform" r="9" strokeWidth="2.5"></circle>
                  <circle className="fill-error" r="4"></circle>
                  <rect className="fill-surface-container-lowest/90 stroke-outline-variant/30" height="24" rx="4" strokeWidth="1" width="118" x="14" y="-12"></rect>
                  <text className="font-label-code text-[10px] fill-on-surface" x="20" y="4">#089 MIDC Ind.</text>
                  <text className="font-label-code text-[10px] fill-error font-bold" x="102" y="4">42.6°</text>
                </g>

                {/* Station 052 - Solapur University Campus (Cool Island) */}
                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(52); setPanelOpen(true); }}
                  transform="translate(360, 520)"
                >
                  <circle className="fill-surface-container-lowest stroke-primary hover:scale-125 transition-transform" r="9" strokeWidth="2.5"></circle>
                  <circle className="fill-primary" r="4"></circle>
                  <rect className="fill-surface-container-lowest/90 stroke-outline-variant/30" height="24" rx="4" strokeWidth="1" width="132" x="14" y="-12"></rect>
                  <text className="font-label-code text-[10px] fill-on-surface" x="20" y="4">#052 PAH Solapur Uni</text>
                  <text className="font-label-code text-[10px] fill-primary font-bold" x="118" y="4">31.7°</text>
                </g>
              </g>
            </svg>
          )}

          {viewMode === 'schematic' && (
            <>
              {/* Cartographic Floating Map Tools (Zoom/Compass) */}
              <div className="absolute bottom-space-lg right-space-md xl:right-[410px] z-20 flex flex-col gap-1.5 shadow-md rounded-lg overflow-hidden bg-surface-container-lowest border border-outline-variant/30">
                <button 
                  onClick={() => setZoomLevel(Math.min(zoomLevel * 1.2, 2.5))}
                  className="p-2.5 hover:bg-surface-container transition-colors text-on-surface flex items-center justify-center"
                  title="Zoom In"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                </button>
                <div className="h-[1px] w-full bg-outline-variant/30"></div>
                <button 
                  onClick={() => setZoomLevel(Math.max(zoomLevel * 0.8, 0.75))}
                  className="p-2.5 hover:bg-surface-container transition-colors text-on-surface flex items-center justify-center"
                  title="Zoom Out"
                >
                  <span className="material-symbols-outlined text-[18px]">remove</span>
                </button>
                <div className="h-[1px] w-full bg-outline-variant/30"></div>
                <button 
                  onClick={() => setZoomLevel(1)}
                  className="p-2.5 hover:bg-surface-container transition-colors text-on-surface flex items-center justify-center" 
                  title="Re-center Solapur"
                >
                  <span className="material-symbols-outlined text-[18px]">near_me</span>
                </button>
              </div>

              {/* Bottom-Left: Sequential Thermal Scale / Scientific Color Ramp Legend */}
              <div className="absolute bottom-space-md left-space-md z-20 max-w-sm w-full bg-surface-container-lowest/95 backdrop-blur-md p-space-md rounded-xl shadow-md border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-xs">
                  <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-semibold">
                    Microclimate Thermal Scale (2m Air Temp)
                  </span>
                  <span className="font-label-code text-label-code text-primary font-bold">Unit: °C</span>
                </div>
                
                {/* Multi-stop Continuous Color Bar */}
                <div className="w-full h-3 rounded-DEFAULT overflow-hidden relative" style={{ background: 'linear-gradient(to right, #016a60 0%, #366759 20%, #9dd1c0 38%, #ffb59b 55%, #ff9770 70%, #ba1a1a 85%, #581900 100%)' }}>
                  <div className="absolute top-0 bottom-0 w-1 bg-surface-container-lowest shadow-sm" id="legendThumb" style={{ left: '78%' }}></div>
                </div>
                
                {/* Scale Numerical Markings */}
                <div className="flex justify-between items-center mt-1.5 font-label-code text-label-code text-on-surface-variant">
                  <span>&lt;28°</span>
                  <span>30°</span>
                  <span>34°</span>
                  <span>38°</span>
                  <span>41°</span>
                  <span className="text-error font-semibold">44°C+</span>
                </div>
                
                <div className="grid grid-cols-3 gap-space-xs pt-space-xs mt-space-xs text-[10px] text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    <span>Canopy Cool &lt;30°</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-tertiary-fixed-dim"></span>
                    <span>UHI Stress 34-38°</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-error"></span>
                    <span>Severe Peak &gt;41°</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right-Hand Station Telemetry Inspector (380px Desktop Slide-in) */}
        <aside 
          className={`absolute top-0 right-0 bottom-0 w-full sm:w-[380px] bg-surface-container-lowest/95 backdrop-blur-md z-30 shadow-xl flex flex-col transition-transform duration-300 border-l border-outline-variant/30 overflow-y-auto ${
            panelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          id="telemetryPanel"
        >
          {/* Panel Header */}
          <div className="p-space-md bg-surface-container-low flex items-center justify-between border-b border-outline-variant/20">
            <div className="flex items-center gap-space-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse"></span>
              <span className="font-label-code text-label-code uppercase tracking-wider text-error font-semibold" id="panelStationCode">
                {station.code}
              </span>
              <span className="px-1.5 py-0.5 rounded-DEFAULT bg-surface-container text-on-surface-variant font-caption-caps text-caption-caps uppercase">
                Sim Node
              </span>
            </div>
            <button 
              onClick={() => setPanelOpen(false)}
              className="p-1 rounded-DEFAULT hover:bg-surface-variant text-on-surface-variant hover:text-on-surface transition-colors" 
              title="Close Panel"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Core Station Telemetry */}
          <div className="p-space-md flex flex-col gap-space-md flex-1">
            
            {/* Identity & Geographic Classification */}
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-semibold mb-0.5" id="stationTitle">
                {station.title}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant" id="stationSubtype">
                {station.subtype}
              </p>
              <div className="mt-space-xs flex items-center gap-space-sm font-label-code text-label-code text-on-surface-variant">
                <span id="stationCoords">{station.coords}</span>
                <span>•</span>
                <span id="stationElev">{station.elev}</span>
              </div>
            </div>

            {/* Big Metric Callout */}
            <div className="p-space-md rounded-xl bg-error-container/30 flex items-center justify-between border border-error-container/40">
              <div>
                <span className="font-caption-caps text-caption-caps uppercase tracking-wider text-on-surface-variant block mb-1">
                  Modeled 2m Air Temperature
                </span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-headline-xl text-headline-xl font-bold text-on-surface" id="stationTemp">
                    {station.temp}
                  </span>
                  <span className="font-headline-md text-headline-md text-on-surface">°C</span>
                </div>
                <div className="inline-flex items-center gap-1 mt-1 font-label-code text-label-code text-error font-medium">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  <span id="stationAnomaly">{station.anomaly}</span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-error text-[28px]">local_fire_department</span>
              </div>
            </div>

            {/* Microclimate Spatial Surface Indicators */}
            <div className="space-y-space-xs">
              <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant tracking-wider font-semibold">
                Morphological Surface Drivers
              </span>
              <div className="grid grid-cols-3 gap-space-xs">
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-caption-caps text-caption-caps text-on-surface-variant">Canopy</span>
                  <span className="font-label-metric text-label-metric text-on-surface font-semibold mt-1" id="stationCanopy">
                    {station.canopy}
                  </span>
                  <span className="font-caption-caps text-[9px] text-error font-medium">
                    {station.canopyStatus}
                  </span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-caption-caps text-caption-caps text-on-surface-variant">Impervious</span>
                  <span className="font-label-metric text-label-metric text-on-surface font-semibold mt-1" id="stationImpervious">
                    {station.impervious}
                  </span>
                  <span className="font-caption-caps text-[9px] text-error font-medium">
                    {station.imperviousStatus}
                  </span>
                </div>
                <div className="p-space-sm rounded-lg bg-surface-container-low flex flex-col">
                  <span className="font-caption-caps text-caption-caps text-on-surface-variant">Albedo</span>
                  <span className="font-label-metric text-label-metric text-on-surface font-semibold mt-1" id="stationAlbedo">
                    {station.albedo}
                  </span>
                  <span className="font-caption-caps text-[9px] text-on-surface-variant">
                    {station.albedoType}
                  </span>
                </div>
              </div>
            </div>

            {/* 24-Hour Diurnal Sparkline Visualization */}
            <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-semibold">
                  24h Diurnal Heat Profile (IST)
                </span>
                <span className="font-label-code text-label-code text-primary">
                  {station.peak}
                </span>
              </div>
              
              {/* Inline SVG Diurnal Sparkline */}
              <div className="w-full h-24 pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 80">
                  <defs>
                    <linearGradient id="sparkGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ba1a1a" stopOpacity="0.35"></stop>
                      <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  {/* Threshold guideline 35°C */}
                  <line stroke="#c0c8c4" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="320" y1="45" y2="45"></line>
                  <text className="font-caption-caps text-[9px] fill-outline" x="5" y="42">35°C HEAT THRESHOLD</text>
                  
                  {/* Filled curve */}
                  <path d={station.sparklineFill} fill="url(#sparkGradient)"></path>
                  {/* Stroke curve */}
                  <path d={station.sparklineD} fill="none" stroke="#ba1a1a" strokeLinecap="round" strokeWidth="2.5"></path>
                  {/* Peak indicator point */}
                  <circle cx={station.peakCx} cy={station.peakCy} fill="#ba1a1a" r="4" stroke="#ffffff" strokeWidth="2"></circle>
                </svg>
              </div>
              <div className="flex justify-between items-center font-label-code text-[10px] text-on-surface-variant pt-1">
                <span>00:00 (28.4°)</span>
                <span>06:00 (26.9°)</span>
                <span>12:00 (39.5°)</span>
                <span className="text-error font-semibold">15:00 (41.8°)</span>
                <span>21:00 (34.2°)</span>
              </div>
            </div>

            {/* Intervention Recommendations Based on Model */}
            <div className="space-y-space-xs">
              <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant tracking-wider font-semibold">
                Engine Recommended Intervention
              </span>
              <div className="p-space-sm rounded-lg bg-surface-container flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">park</span>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface font-semibold">
                    {station.interventionTitle}
                  </p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant leading-relaxed">
                    {station.interventionDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Provenance Footer */}
            <div className="mt-auto pt-space-sm bg-surface-container-low p-space-sm rounded-lg text-on-surface-variant">
              <div className="flex items-center justify-between font-label-code text-[10px]">
                <span>WRF DOMAIN: D03_SOLAPUR</span>
                <span>SEED: wrf-v2.4-2024</span>
              </div>
              <p className="font-caption-caps text-[9px] text-outline mt-1 leading-normal">
                Simulated synthetic telemetry generated for urban planning research. Peer-review release TF-141 / MIT Vishwaprayag University.
              </p>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Informational Analytical Strip (Non-intrusive) */}
      <div className="w-full bg-surface-container-low p-space-md flex flex-wrap items-center justify-between gap-space-md border-t border-outline-variant/30">
        <div className="flex items-center gap-space-md">
          <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-bold tracking-wider">
            Cartographic Sources:
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Solapur Municipal Boundary (SMC GIS 2023) • NASA Landsat-8/9 OLI/TIRS Synthetic Calibrations • Solapur 100-Grid Academic WRF Simulation (2021–2025)
          </span>
        </div>
        <div className="flex items-center gap-space-sm">
          <Link 
            to="/explore-data"
            className="font-label-code text-label-code text-primary hover:underline flex items-center gap-1 font-medium" 
          >
            <span>Open Raw CSV Datasets</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
