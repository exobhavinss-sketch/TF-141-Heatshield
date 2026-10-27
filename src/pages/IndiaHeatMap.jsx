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
  const [domain, setDomain] = useState('solapur');
  const [activeLayer, setActiveLayer] = useState('lst');
  const [viewMode, setViewMode] = useState('map');
  const [timeStep, setTimeStep] = useState(14);
  const [selectedStationId, setSelectedStationId] = useState(14);
  const [panelOpen, setPanelOpen] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [cursorCoords, setCursorCoords] = useState("17.6715° N, 75.9104° E");
  
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
    <div className="flex flex-col w-full relative bg-white">
      {/* Interactive GIS Control Deck & Map Canvas Container */}
      <div className="relative w-full h-[calc(100vh-52px)] min-h-[640px] overflow-hidden flex flex-col bg-[#f5f5f7] select-none">
        
        {/* Top Floating Apple Glass HUD Bar */}
        <div className="absolute top-4 left-4 right-4 z-30 pointer-events-none flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white/90 backdrop-blur-xl p-2.5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] pointer-events-auto border border-black/[0.08]">
            
            {/* Territory Switcher (Pill Style) */}
            <div className="flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-full border border-black/[0.04]">
              <button 
                onClick={() => setDomain('solapur')}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
                  domain === 'solapur' 
                    ? 'text-[#1d1d1f] bg-white shadow-sm' 
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
                id="viewSolapurBtn"
              >
                <span className={`w-2 h-2 rounded-full ${domain === 'solapur' ? 'bg-[#0071e3]' : 'bg-[#86868b]'}`}></span>
                <span>Solapur High-Res (100 Nodes)</span>
              </button>
              
              <button 
                onClick={() => setDomain('india')}
                className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all flex items-center gap-1.5 ${
                  domain === 'india' 
                    ? 'text-[#1d1d1f] bg-white shadow-sm' 
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
                id="viewIndiaBtn"
              >
                <span className={`w-2 h-2 rounded-full ${domain === 'india' ? 'bg-[#0071e3]' : 'bg-[#86868b]'}`}></span>
                <span>Pan-India Reanalysis</span>
              </button>
            </div>

            {/* View Mode Switcher: Leaflet GIS vs Vector Schematic */}
            <div className="flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-full border border-black/[0.04]">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === 'map'
                    ? 'text-[#1d1d1f] bg-white font-semibold shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
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
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all flex items-center gap-1.5 ${
                  viewMode === 'schematic'
                    ? 'text-[#1d1d1f] bg-white font-semibold shadow-sm'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
                title="Switch to Vector Microclimate Model"
                id="viewSchematicBtn"
              >
                <span className="material-symbols-outlined text-[15px]">hub</span>
                <span>Vector Model</span>
              </button>
            </div>

            {/* Center: Layer Toggles */}
            <div className="hidden xl:flex items-center gap-1 bg-[#f5f5f7] p-1 rounded-full border border-black/[0.04]">
              <button 
                onClick={() => setActiveLayer('lst')}
                className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all ${
                  activeLayer === 'lst' 
                    ? 'text-white bg-[#0071e3] shadow-sm' 
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                LST Skin
              </button>
              <button 
                onClick={() => setActiveLayer('air')}
                className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all ${
                  activeLayer === 'air' 
                    ? 'text-white bg-[#0071e3] shadow-sm' 
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Air 2m
              </button>
              <button 
                onClick={() => setActiveLayer('ndvi')}
                className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all ${
                  activeLayer === 'ndvi' 
                    ? 'text-white bg-[#059669] shadow-sm' 
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Canopy (NDVI)
              </button>
              <button 
                onClick={() => setActiveLayer('hvi')}
                className={`px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all ${
                  activeLayer === 'hvi' 
                    ? 'text-white bg-[#ea580c] shadow-sm' 
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`}
              >
                Risk (HVI)
              </button>
            </div>

            {/* Temporal Scrubber Control */}
            <div className="flex items-center gap-3 px-3.5 py-1.5 bg-[#f5f5f7] rounded-full border border-black/[0.04]">
              <span className="material-symbols-outlined text-[#0071e3] text-[18px]">schedule</span>
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] uppercase tracking-wider text-[#86868b] font-semibold">Hour</span>
                  <span className="font-mono text-[10px] text-[#1d1d1f] font-semibold" id="timeLabel">
                    {getTimeLabel(Number(timeStep))}
                  </span>
                </div>
                <input 
                  className="w-32 sm:w-40 h-1 bg-black/[0.1] rounded-full appearance-none cursor-pointer accent-[#0071e3]" 
                  id="timeScrubber" 
                  max="23" 
                  min="0" 
                  type="range" 
                  value={timeStep}
                  onChange={(e) => setTimeStep(e.target.value)}
                />
              </div>
            </div>

            {/* Right: Camera Reset & Panel Toggle */}
            <div className="flex items-center gap-1.5">
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#f5f5f7] rounded-full text-[11px] font-mono text-[#6e6e73]">
                <span className="material-symbols-outlined text-[#86868b] text-[15px]">explore</span>
                <span id="cursorCoords">{cursorCoords}</span>
              </div>
              <button 
                onClick={() => { setZoomLevel(1); setSelectedStationId(14); }}
                className="w-8 h-8 rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] flex items-center justify-center transition-colors" 
                title="Reset Camera View"
              >
                <span className="material-symbols-outlined text-[17px]">restart_alt</span>
              </button>
              <button 
                onClick={() => setPanelOpen(!panelOpen)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  panelOpen ? 'bg-[#0071e3] text-white' : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed]'
                }`}
                title="Toggle Station Inspector"
              >
                <span className="material-symbols-outlined text-[17px]">view_sidebar</span>
              </button>
            </div>
          </div>

          {/* Provenance Micro-Banner */}
          <div className="self-start inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#6e6e73] shadow-xs pointer-events-auto border border-black/[0.06]">
            <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#1d1d1f] font-medium">
              Domain: WRF-Chem Urban Canopy Model • Grid Seed: 2024.05.18-IST
            </span>
          </div>
        </div>

        {/* Main Map Cartographic Surface */}
        <div 
          className="relative w-full h-full flex-1 overflow-hidden bg-[#f5f5f7]" 
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
                <radialGradient cx="50%" cy="50%" id="heatCoreBhavani" r="50%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.75"></stop>
                  <stop offset="35%" stopColor="#ea580c" stopOpacity="0.55"></stop>
                  <stop offset="70%" stopColor="#ffdbcf" stopOpacity="0.30"></stop>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                </radialGradient>
                <radialGradient cx="45%" cy="45%" id="heatCoreOldCity" r="55%">
                  <stop offset="0%" stopColor="#ea580c" stopOpacity="0.8"></stop>
                  <stop offset="40%" stopColor="#dc2626" stopOpacity="0.5"></stop>
                  <stop offset="75%" stopColor="#ffb59b" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                </radialGradient>
                <radialGradient cx="50%" cy="50%" id="heatCoreMIDC" r="50%">
                  <stop offset="0%" stopColor="#dc2626" stopOpacity="0.85"></stop>
                  <stop offset="30%" stopColor="#ea580c" stopOpacity="0.6"></stop>
                  <stop offset="70%" stopColor="#f0f5f1" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                </radialGradient>
                <radialGradient cx="50%" cy="50%" id="lakeCooling" r="50%">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.85"></stop>
                  <stop offset="50%" stopColor="#10b981" stopOpacity="0.45"></stop>
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0"></stop>
                </radialGradient>
                <pattern height="40" id="urbanGridPattern" patternUnits="userSpaceOnUse" width="40">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d2d2d7" strokeOpacity="0.4" strokeWidth="0.5"></path>
                </pattern>
              </defs>

              <rect fill="url(#urbanGridPattern)" height="100%" width="100%"></rect>
              <path d="M 380,180 Q 580,120 840,160 T 1240,240 Q 1380,420 1310,640 T 1080,820 Q 820,890 540,780 T 320,560 Q 260,340 380,180 Z" fill="#ffffff" fillOpacity="0.8" stroke="#d2d2d7" strokeDasharray="4,4" strokeWidth="1.5"></path>

              {/* Highways */}
              <path d="M 120,410 C 450,430 750,470 1480,510" fill="none" opacity="0.9" stroke="#ffffff" strokeLinecap="round" strokeWidth="8"></path>
              <path d="M 120,410 C 450,430 750,470 1480,510" fill="none" opacity="0.4" stroke="#86868b" strokeLinecap="round" strokeWidth="2.5"></path>

              {/* Water */}
              <g id="waterBodyGroup">
                <path d="M 740,430 C 770,410 820,430 835,465 C 840,490 810,530 770,520 C 735,510 720,460 740,430 Z" fill="#059669" stroke="#059669" strokeWidth="1.5"></path>
                <ellipse cx="780" cy="470" fill="url(#lakeCooling)" rx="130" ry="110"></ellipse>
                <text className="text-[11px] fill-[#059669] font-semibold pointer-events-none" x="745" y="475">SIDDHESHWAR LAKE (27.4°C)</text>
              </g>

              {/* Thermal Islands */}
              <g className="transition-opacity duration-300" id="thermalIslands">
                <circle cx="820" cy="510" fill="url(#heatCoreBhavani)" r="190"></circle>
                <circle cx="710" cy="410" fill="url(#heatCoreOldCity)" r="160"></circle>
                <circle cx="1120" cy="580" fill="url(#heatCoreMIDC)" r="230"></circle>
              </g>

              {/* Interactive Station Nodes */}
              <g id="stationNodes">
                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(14); setPanelOpen(true); }}
                  transform="translate(820, 510)"
                >
                  <circle className="fill-[#dc2626]/20 animate-ping" r="22"></circle>
                  <circle className="fill-white stroke-[#dc2626]" r="12" strokeWidth="3"></circle>
                  <circle className="fill-[#dc2626]" r="5"></circle>
                  <rect className="fill-white/95 shadow-md stroke-black/[0.08]" height="28" rx="14" strokeWidth="1" width="145" x="18" y="-14"></rect>
                  <text className="font-mono text-[11px] fill-[#1d1d1f] font-semibold" x="28" y="4">#014 Bhavani Peth</text>
                  <text className="font-mono text-[11px] fill-[#dc2626] font-bold" x="126" y="4">41.8°</text>
                </g>

                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(28); setPanelOpen(true); }}
                  transform="translate(680, 430)"
                >
                  <circle className="fill-white stroke-[#ea580c] hover:scale-125 transition-transform" r="9" strokeWidth="2.5"></circle>
                  <circle className="fill-[#ea580c]" r="4"></circle>
                  <rect className="fill-white/95 stroke-black/[0.08]" height="24" rx="12" strokeWidth="1" width="130" x="14" y="-12"></rect>
                  <text className="font-mono text-[10px] fill-[#1d1d1f]" x="22" y="4">#028 Old Solapur</text>
                  <text className="font-mono text-[10px] fill-[#ea580c] font-bold" x="112" y="4">39.4°</text>
                </g>

                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(73); setPanelOpen(true); }}
                  transform="translate(430, 360)"
                >
                  <circle className="fill-white stroke-[#059669] hover:scale-125 transition-transform" r="9" strokeWidth="2.5"></circle>
                  <circle className="fill-[#059669]" r="4"></circle>
                  <rect className="fill-white/95 stroke-black/[0.08]" height="24" rx="12" strokeWidth="1" width="112" x="14" y="-12"></rect>
                  <text className="font-mono text-[10px] fill-[#1d1d1f]" x="22" y="4">#073 Kegaon</text>
                  <text className="font-mono text-[10px] fill-[#059669] font-bold" x="95" y="4">33.2°</text>
                </g>

                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(89); setPanelOpen(true); }}
                  transform="translate(1120, 560)"
                >
                  <circle className="fill-white stroke-[#dc2626] hover:scale-125 transition-transform" r="9" strokeWidth="2.5"></circle>
                  <circle className="fill-[#dc2626]" r="4"></circle>
                  <rect className="fill-white/95 stroke-black/[0.08]" height="24" rx="12" strokeWidth="1" width="124" x="14" y="-12"></rect>
                  <text className="font-mono text-[10px] fill-[#1d1d1f]" x="22" y="4">#089 MIDC Ind.</text>
                  <text className="font-mono text-[10px] fill-[#dc2626] font-bold" x="108" y="4">42.6°</text>
                </g>

                <g 
                  className="cursor-pointer group" 
                  onClick={() => { setSelectedStationId(52); setPanelOpen(true); }}
                  transform="translate(360, 520)"
                >
                  <circle className="fill-white stroke-[#059669] hover:scale-125 transition-transform" r="9" strokeWidth="2.5"></circle>
                  <circle className="fill-[#059669]" r="4"></circle>
                  <rect className="fill-white/95 stroke-black/[0.08]" height="24" rx="12" strokeWidth="1" width="138" x="14" y="-12"></rect>
                  <text className="font-mono text-[10px] fill-[#1d1d1f]" x="22" y="4">#052 PAH Solapur</text>
                  <text className="font-mono text-[10px] fill-[#059669] font-bold" x="122" y="4">31.7°</text>
                </g>
              </g>
            </svg>
          )}
        </div>

        {/* Right-Hand Station Telemetry Inspector (Apple Frosted Sheet) */}
        <aside 
          className={`absolute top-0 right-0 bottom-0 w-full sm:w-[380px] bg-white/95 backdrop-blur-2xl z-30 shadow-2xl flex flex-col transition-transform duration-300 border-l border-black/[0.08] overflow-y-auto ${
            panelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          id="telemetryPanel"
        >
          {/* Panel Header */}
          <div className="p-5 bg-[#fafafc] flex items-center justify-between border-b border-black/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#dc2626] animate-pulse"></span>
              <span className="font-mono text-[12px] uppercase tracking-wider text-[#dc2626] font-semibold" id="panelStationCode">
                {station.code}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-black/[0.04] text-[#6e6e73] text-[10px] uppercase font-mono font-medium">
                Sim Node
              </span>
            </div>
            <button 
              onClick={() => setPanelOpen(false)}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors" 
              title="Close Panel"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Quick Select Stations Bar */}
          <div className="px-5 py-3 bg-[#f5f5f7] border-b border-black/[0.04] flex items-center gap-1.5 overflow-x-auto">
            <span className="text-[10px] uppercase text-[#86868b] font-semibold mr-1 shrink-0">Nodes:</span>
            {[14, 28, 73, 89, 52].map(stId => (
              <button
                key={stId}
                onClick={() => setSelectedStationId(stId)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono shrink-0 transition-all ${
                  selectedStationId === stId 
                    ? 'bg-[#0071e3] text-white font-semibold shadow-xs' 
                    : 'bg-white text-[#6e6e73] hover:text-[#1d1d1f] border border-black/[0.06]'
                }`}
              >
                #{stId}
              </button>
            ))}
          </div>

          {/* Core Station Telemetry */}
          <div className="p-6 flex flex-col gap-6 flex-1">
            
            {/* Identity & Geographic Classification */}
            <div>
              <h2 className="text-xl font-semibold text-[#1d1d1f] tracking-tight mb-1" id="stationTitle">
                {station.title}
              </h2>
              <p className="text-[13px] text-[#6e6e73] leading-relaxed" id="stationSubtype">
                {station.subtype}
              </p>
              <div className="mt-2 flex items-center gap-3 font-mono text-[11px] text-[#86868b]">
                <span id="stationCoords">{station.coords}</span>
                <span>•</span>
                <span id="stationElev">{station.elev}</span>
              </div>
            </div>

            {/* Big Metric Callout (Apple Card Treatment) */}
            <div className="p-5 rounded-[22px] bg-[#f5f5f7] flex items-center justify-between border border-black/[0.04]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#86868b] block mb-1 font-semibold">
                  Modeled 2m Air Temperature
                </span>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-semibold text-[#1d1d1f] tracking-tight tabular-nums" id="stationTemp">
                    {station.temp}
                  </span>
                  <span className="text-lg font-normal text-[#6e6e73]">°C</span>
                </div>
                <div className="inline-flex items-center gap-1 mt-1 font-mono text-[11px] text-[#ea580c] font-medium">
                  <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
                  <span id="stationAnomaly">{station.anomaly}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-xs border border-black/[0.06]">
                <span className="material-symbols-outlined text-[#ea580c] text-[24px]">local_fire_department</span>
              </div>
            </div>

            {/* Morphological Surface Drivers */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase text-[#86868b] tracking-wider font-semibold">
                Morphological Surface Drivers
              </span>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-[#f5f5f7] flex flex-col border border-black/[0.03]">
                  <span className="text-[10px] text-[#86868b] uppercase font-semibold">Canopy</span>
                  <span className="text-[15px] font-semibold text-[#1d1d1f] tabular-nums mt-0.5" id="stationCanopy">
                    {station.canopy}
                  </span>
                  <span className="text-[10px] text-[#dc2626] font-medium mt-0.5">
                    {station.canopyStatus}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#f5f5f7] flex flex-col border border-black/[0.03]">
                  <span className="text-[10px] text-[#86868b] uppercase font-semibold">Impervious</span>
                  <span className="text-[15px] font-semibold text-[#1d1d1f] tabular-nums mt-0.5" id="stationImpervious">
                    {station.impervious}
                  </span>
                  <span className="text-[10px] text-[#dc2626] font-medium mt-0.5">
                    {station.imperviousStatus}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-[#f5f5f7] flex flex-col border border-black/[0.03]">
                  <span className="text-[10px] text-[#86868b] uppercase font-semibold">Albedo</span>
                  <span className="text-[15px] font-semibold text-[#1d1d1f] tabular-nums mt-0.5" id="stationAlbedo">
                    {station.albedo}
                  </span>
                  <span className="text-[10px] text-[#86868b] mt-0.5 truncate">
                    {station.albedoType}
                  </span>
                </div>
              </div>
            </div>

            {/* 24-Hour Diurnal Sparkline */}
            <div className="p-5 rounded-[22px] bg-[#f5f5f7] flex flex-col gap-2 border border-black/[0.04]">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase text-[#86868b] font-semibold tracking-wider">
                  24h Diurnal Heat Profile
                </span>
                <span className="font-mono text-[11px] text-[#0071e3] font-semibold">
                  {station.peak}
                </span>
              </div>
              
              <div className="w-full h-24 pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 320 80">
                  <defs>
                    <linearGradient id="sparkGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ea580c" stopOpacity="0.3"></stop>
                      <stop offset="100%" stopColor="#ea580c" stopOpacity="0"></stop>
                    </linearGradient>
                  </defs>
                  <line stroke="rgba(0,0,0,0.1)" strokeDasharray="3,3" strokeWidth="1" x1="0" x2="320" y1="45" y2="45"></line>
                  <text className="text-[9px] fill-[#86868b] font-mono" x="5" y="42">35°C THRESHOLD</text>
                  
                  <path d={station.sparklineFill} fill="url(#sparkGradient)"></path>
                  <path d={station.sparklineD} fill="none" stroke="#ea580c" strokeLinecap="round" strokeWidth="2.5"></path>
                  <circle cx={station.peakCx} cy={station.peakCy} fill="#ea580c" r="4" stroke="#ffffff" strokeWidth="2"></circle>
                </svg>
              </div>
              <div className="flex justify-between items-center font-mono text-[10px] text-[#86868b] pt-1">
                <span>00:00 (28.4°)</span>
                <span>06:00 (26.9°)</span>
                <span>12:00 (39.5°)</span>
                <span className="text-[#dc2626] font-semibold">15:00 (41.8°)</span>
                <span>21:00 (34.2°)</span>
              </div>
            </div>

            {/* Recommended Intervention */}
            <div className="space-y-2">
              <span className="text-[11px] uppercase text-[#86868b] tracking-wider font-semibold">
                Targeted Mitigation Strategy
              </span>
              <div className="p-4 rounded-[20px] bg-[#0071e3]/5 border border-[#0071e3]/15 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#0071e3] text-[20px] mt-0.5 shrink-0">park</span>
                <div>
                  <p className="text-[13px] font-semibold text-[#1d1d1f]">
                    {station.interventionTitle}
                  </p>
                  <p className="text-[12px] text-[#6e6e73] leading-relaxed mt-1">
                    {station.interventionDesc}
                  </p>
                </div>
              </div>
            </div>

            {/* Provenance Footer */}
            <div className="mt-auto pt-3 border-t border-black/[0.06] text-[#86868b]">
              <div className="flex items-center justify-between font-mono text-[10px]">
                <span>DOMAIN: D03_SOLAPUR</span>
                <span>SEED: wrf-v2.4-2024</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Bottom Sources Bar */}
      <div className="w-full bg-[#f5f5f7] px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.06] text-xs text-[#6e6e73]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#1d1d1f]">Sources:</span>
          <span>Solapur Municipal Boundary (SMC GIS) • NASA Landsat-8/9 OLI/TIRS • 100-Grid Solapur Simulation (2021–2025)</span>
        </div>
        <Link 
          to="/explore-data"
          className="text-[#0071e3] hover:underline flex items-center gap-1 font-medium" 
        >
          <span>Open Raw Dataset Records</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}
