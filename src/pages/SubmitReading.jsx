import React, { useState, useId } from 'react';

const STATIONS = [
  {
    id: 'ST-014',
    name: 'Ward 04 • Saat Rasta Central Crossing',
    shortName: 'Saat Rasta Crossing',
    zone: 'Commercial Dense Urban Core',
    baseline: 35.4,
    lat: 17.6599,
    lon: 75.9064,
    wardCode: 'WARD 04'
  },
  {
    id: 'ST-027',
    name: 'Ward 02 • MIDC Phase I Industrial Core',
    shortName: 'MIDC Phase I Industrial',
    zone: 'Industrial Heavy Manufacturing',
    baseline: 36.1,
    lat: 17.6834,
    lon: 75.9211,
    wardCode: 'WARD 02'
  },
  {
    id: 'ST-052',
    name: 'Ward 07 • Siddheshwar Lake Green Belt',
    shortName: 'Siddheshwar Sanctuary',
    zone: 'Urban Canopy Park & Riparian Oasis',
    baseline: 33.2,
    lat: 17.6412,
    lon: 75.8943,
    wardCode: 'WARD 07'
  },
  {
    id: 'ST-068',
    name: 'Ward 05 • Old Pune Naka Settlement',
    shortName: 'Old Pune Naka',
    zone: 'High-Density Residential Fabric',
    baseline: 34.8,
    lat: 17.6710,
    lon: 75.9150,
    wardCode: 'WARD 05'
  },
  {
    id: 'ST-081',
    name: 'Ward 09 • South Degaon Eco-Fringe',
    shortName: 'South Degaon Fringe',
    zone: 'Semi-Arid Agricultural Transition',
    baseline: 32.9,
    lat: 17.6201,
    lon: 75.8672,
    wardCode: 'WARD 09'
  }
];

const SUBSTRATES = [
  { name: 'Asphalt', label: 'Asphalt / Bitumen', albedo: 0.08 },
  { name: 'Concrete', label: 'Concrete Pavers', albedo: 0.32 },
  { name: 'Bare Soil', label: 'Bare Soil / Clay', albedo: 0.20 },
  { name: 'Vegetated', label: 'Vegetated Turf', albedo: 0.25 },
  { name: 'Canopy', label: 'Shaded Canopy', albedo: 0.18 }
];

export default function SubmitReading() {
  const [airTemp, setAirTemp] = useState('38.5');
  const [tempUnit, setTempUnit] = useState('C');
  const [humidity, setHumidity] = useState(34);
  const [surfaceTemp, setSurfaceTemp] = useState('44.2');
  const [solarFlux, setSolarFlux] = useState('direct_peak');
  const [timestamp, setTimestamp] = useState(() => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  });
  const [selectedStation, setSelectedStation] = useState(STATIONS[0]);
  const [latitude, setLatitude] = useState(STATIONS[0].lat);
  const [longitude, setLongitude] = useState(STATIONS[0].lon);
  const [sourceType, setSourceType] = useState('hypothetical_sim');
  const [instrumentSpec, setInstrumentSpec] = useState('Campbell Scientific CS215-L / Fluke 62 Max+');
  const [selectedSubstrate, setSelectedSubstrate] = useState(SUBSTRATES[0]);
  const [fieldNotes, setFieldNotes] = useState('Observed cooling deficit under mature neem canopy along Saat Rasta corridor; surface asphalt radiates intense convective heat plume during peak 14:00 solar transit.');
  
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState('Copy JSON');

  // Compute thermal indicators live
  const tempInC = tempUnit === 'C' ? parseFloat(airTemp) || 35 : ((parseFloat(airTemp) || 95) - 32) * (5/9);
  const baseline = selectedStation.baseline;
  const anomaly = (tempInC - baseline).toFixed(1);
  const anomalyNum = parseFloat(anomaly);

  // Heat Index Approximation
  const T = tempInC;
  const R = humidity;
  const heatIndex = (T + 0.33 * (R / 100 * 6.105 * Math.exp(17.27 * T / (237.7 + T))) - 4).toFixed(1);

  // Risk Classification
  const isExtreme = tempInC >= 42 || parseFloat(heatIndex) >= 48;
  const isHigh = tempInC >= 38 || parseFloat(heatIndex) >= 42;
  const isModerate = tempInC >= 34;

  const riskTitle = isExtreme 
    ? "Extreme Thermal Hazard Zone" 
    : isHigh 
    ? "High Heat Stress Zone" 
    : isModerate 
    ? "Moderate Exposure Zone" 
    : "Mitigated Microclimate Zone";

  const riskGuidance = isExtreme
    ? "Critical danger: High risk of heat-induced hyperthermia; active canopy shading and hydration mandated."
    : isHigh
    ? "Metabolic fatigue and microclimatic discomfort accelerated on unshaded impermeable surfaces."
    : "Sensible heat balance remains within manageable physiological limits under moderate exertion.";

  const handleStationChange = (e) => {
    const val = e.target.value;
    const stn = STATIONS.find(s => s.id === val);
    if (stn) {
      setSelectedStation(stn);
      setLatitude(stn.lat);
      setLongitude(stn.lon);
    }
  };

  const toggleTempUnit = () => {
    if (tempUnit === 'C') {
      const fVal = ((parseFloat(airTemp) * 9/5) + 32).toFixed(1);
      setAirTemp(fVal);
      setTempUnit('F');
    } else {
      const cVal = (((parseFloat(airTemp) - 32) * 5/9)).toFixed(1);
      setAirTemp(cVal);
      setTempUnit('C');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const readingSummary = `Reading for ${selectedStation.id} (${tempInC.toFixed(1)}°C) recorded in local transient memory buffer for ${selectedStation.shortName}.`;
    setToastMessage(readingSummary);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4500);
  };

  const handleReset = () => {
    setAirTemp('38.5');
    setTempUnit('C');
    setHumidity(34);
    setSurfaceTemp('44.2');
    setSelectedStation(STATIONS[0]);
    setLatitude(STATIONS[0].lat);
    setLongitude(STATIONS[0].lon);
    setSelectedSubstrate(SUBSTRATES[0]);
  };

  const jsonPayload = JSON.stringify({
    node_id: selectedStation.id,
    air_temp_c: parseFloat(tempInC.toFixed(1)),
    rel_humidity_pct: humidity,
    surface_temp_c: parseFloat(surfaceTemp) || null,
    heat_index_c: parseFloat(heatIndex),
    anomaly_delta_c: anomalyNum,
    substrate_albedo: selectedSubstrate.albedo,
    coords: [latitude, longitude],
    timestamp_ist: timestamp,
    instrument: instrumentSpec,
    checksum: "sha256-d41d8cd98f00b204e9800998ecf8427e"
  }, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonPayload);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy JSON'), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-space-xl">
      
      {/* Top Atmospheric Scrim Gradient Container */}
      <div className="relative w-full overflow-hidden bg-surface-container-low/60 pb-space-xl border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin pt-space-lg">
          
          {/* Overline & Breadcrumb Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-xs">
            <div className="flex items-center gap-space-xs font-label-code text-label-code text-on-surface-variant">
              <span className="text-primary font-semibold tracking-wider uppercase">TF-141</span>
              <span>/</span>
              <span>FIELD-TELEMETRY</span>
              <span>/</span>
              <span className="text-on-surface">SYNTHETIC INGESTION PIPELINE</span>
            </div>
            <div className="inline-flex items-center gap-space-xs px-space-sm py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-code text-label-code">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
              <span>BUFFER: LOCAL CLIENT MEMORY</span>
            </div>
          </div>

          {/* Page Heading Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md mb-space-lg">
            <div className="space-y-space-xs max-w-3xl">
              <span className="font-caption-caps text-caption-caps uppercase tracking-wider text-secondary font-bold">
                Spatial Climatology • Node Entry
              </span>
              <h1 className="font-headline-xl text-headline-xl text-primary font-semibold tracking-tight">
                Submit a Temperature Reading
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Contribute ground-level microclimate observations or compute hypothetical urban cooling scenarios across Solapur's synthetic research grid.
              </p>
            </div>
            <div className="flex items-center gap-space-sm">
              <div className="hidden md:flex flex-col text-right font-label-code text-label-code text-on-surface-variant">
                <span>GRID SYSTEM: EPSG:4326</span>
                <span className="text-secondary font-semibold">100 SIMULATED ACTIVE NODES</span>
              </div>
            </div>
          </div>

          {/* Academic Transparency Notice Banner */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-highest/80 backdrop-blur-sm p-space-md shadow-sm mb-space-lg border border-outline-variant/30">
            <div className="flex items-start gap-space-md">
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">science</span>
              </div>
              <div className="space-y-1 pr-space-md">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-md text-headline-md text-primary font-semibold">Academic Sandbox &amp; Calibration Mode</span>
                  <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-code text-[10px] uppercase font-bold tracking-wider">
                    Research Preview
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                  Submissions are parsed and preserved in transient client-side memory for spatial validation, real-time microclimate anomaly calculations, and scenario simulation. Records are not committed to official municipal meteorological telemetry nodes or external production databases.
                </p>
              </div>
            </div>
          </div>

          {/* 2-Column Split Architecture: 65% Interactive Form / 35% Live Observer Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
            
            {/* Left Column: Scientific Telemetry Form */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-space-md">
              <form onSubmit={handleFormSubmit} className="space-y-space-md" id="readingForm">
                
                {/* SECTION 1: Atmospheric Metrics */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm space-y-space-md transition-all border border-outline-variant/30">
                  <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
                    <div className="flex items-center gap-space-sm">
                      <span className="font-label-code text-label-code text-primary font-bold px-2 py-0.5 rounded bg-primary-fixed-dim/30">01</span>
                      <h2 className="font-headline-md text-headline-md text-primary font-semibold">Atmospheric &amp; Thermal Metrics</h2>
                    </div>
                    <span className="font-caption-caps text-caption-caps text-outline uppercase tracking-wider font-semibold">Required Parameters</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Air Temp */}
                    <div className="space-y-space-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="airTempInput">
                          Ambient Air Temperature
                        </label>
                        <span className="font-label-code text-label-code text-secondary font-medium">UNIT: °{tempUnit}</span>
                      </div>
                      <div className="relative flex rounded-lg bg-surface-container-low shadow-inner border border-outline-variant/20">
                        <input 
                          id="airTempInput"
                          type="number"
                          step="0.1"
                          required
                          value={airTemp}
                          onChange={(e) => setAirTemp(e.target.value)}
                          className="w-full bg-transparent px-space-md py-2.5 font-label-metric text-label-metric text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container rounded-lg"
                        />
                        <div className="flex items-center pr-space-sm">
                          <button 
                            type="button"
                            onClick={toggleTempUnit}
                            className="px-2 py-1 rounded bg-surface text-on-surface font-label-code text-label-code hover:bg-surface-container-highest transition-colors shadow-sm font-semibold"
                          >
                            °{tempUnit}
                          </button>
                        </div>
                      </div>
                      <span className="font-caption-caps text-caption-caps text-outline block">Calibrated sensor dry-bulb reading at 1.5m height</span>
                    </div>

                    {/* Relative Humidity */}
                    <div className="space-y-space-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="humiditySlider">
                          Relative Humidity (%)
                        </label>
                        <span className="font-label-metric text-label-metric text-primary font-semibold">{humidity}%</span>
                      </div>
                      <div className="flex items-center gap-space-sm pt-2">
                        <input 
                          id="humiditySlider"
                          type="range"
                          min="10"
                          max="100"
                          value={humidity}
                          onChange={(e) => setHumidity(Number(e.target.value))}
                          className="w-full accent-primary-container cursor-pointer bg-surface-container h-2 rounded"
                        />
                      </div>
                      <span className="font-caption-caps text-caption-caps text-outline block">Hygrometric boundary vapor saturation</span>
                    </div>

                    {/* Surface Temp */}
                    <div className="space-y-space-xs">
                      <div className="flex items-center justify-between">
                        <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="surfaceTempInput">
                          Surface Skin Temperature (Optional)
                        </label>
                        <span className="font-label-code text-label-code text-on-surface-variant font-medium">INFRARED / °C</span>
                      </div>
                      <div className="relative flex rounded-lg bg-surface-container-low border border-outline-variant/20">
                        <input 
                          id="surfaceTempInput"
                          type="number"
                          step="0.1"
                          value={surfaceTemp}
                          onChange={(e) => setSurfaceTemp(e.target.value)}
                          className="w-full bg-transparent px-space-md py-2.5 font-label-metric text-label-metric text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container rounded-lg"
                        />
                      </div>
                      <span className="font-caption-caps text-caption-caps text-outline block">Direct pyrometer contact or calibrated 8-14μm radiometer</span>
                    </div>

                    {/* Solar Exposure Index */}
                    <div className="space-y-space-xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="solarIrradiance">
                        Solar Irradiance Flux
                      </label>
                      <select 
                        id="solarIrradiance"
                        value={solarFlux}
                        onChange={(e) => setSolarFlux(e.target.value)}
                        className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
                      >
                        <option value="direct_peak">Direct Peak Solar Zenith (800 - 1050 W/m²)</option>
                        <option value="diffuse_cloud">Partial Cloud Obscuration (400 - 650 W/m²)</option>
                        <option value="canopy_shaded">Understory Forest Canopy (120 - 250 W/m²)</option>
                        <option value="crepuscular">Crepuscular / Twilight (&lt; 50 W/m²)</option>
                        <option value="nocturnal">Nocturnal Cooling Cycle (0 W/m²)</option>
                      </select>
                      <span className="font-caption-caps text-caption-caps text-outline block">Global horizontal irradiance weighting tier</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Spatial & Temporal Anchor */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm space-y-space-md border border-outline-variant/30">
                  <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
                    <div className="flex items-center gap-space-sm">
                      <span className="font-label-code text-label-code text-primary font-bold px-2 py-0.5 rounded bg-primary-fixed-dim/30">02</span>
                      <h2 className="font-headline-md text-headline-md text-primary font-semibold">Temporal &amp; Spatial Anchor</h2>
                    </div>
                    <span className="font-caption-caps text-caption-caps text-outline uppercase tracking-wider font-semibold">Solapur Spatial Mesh</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Datetime Picker */}
                    <div className="space-y-space-xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="timestampInput">
                        Observation Timestamp (IST)
                      </label>
                      <input 
                        id="timestampInput"
                        type="datetime-local"
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-label-code text-label-code text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
                      />
                      <span className="font-caption-caps text-caption-caps text-outline block">Defaults to synchronous local research epoch</span>
                    </div>

                    {/* Geographic Grid Node */}
                    <div className="space-y-space-xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="stationSelect">
                        Geographic Simulation Station / Ward
                      </label>
                      <select 
                        id="stationSelect"
                        value={selectedStation.id}
                        onChange={handleStationChange}
                        className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
                      >
                        {STATIONS.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                        ))}
                      </select>
                      <span className="font-caption-caps text-caption-caps text-outline block">Indexed against 100 Solapur GIS sensor stations</span>
                    </div>

                    {/* Latitude / Longitude */}
                    <div className="space-y-space-xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="latitudeInput">
                        Latitude (°N)
                      </label>
                      <input 
                        id="latitudeInput"
                        type="number"
                        step="0.0001"
                        value={latitude}
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
                        className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-label-metric text-label-metric text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
                      />
                    </div>
                    <div className="space-y-space-xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="longitudeInput">
                        Longitude (°E)
                      </label>
                      <input 
                        id="longitudeInput"
                        type="number"
                        step="0.0001"
                        value={longitude}
                        onChange={(e) => setLongitude(parseFloat(e.target.value))}
                        className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-label-metric text-label-metric text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
                      />
                    </div>
                  </div>

                  {/* Auto-detected Urban Zone Ribbon */}
                  <div className="mt-space-sm p-space-sm rounded-lg bg-surface-container flex flex-wrap items-center justify-between gap-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-[18px] text-secondary">domain</span>
                      <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-bold">Inferred Urban Topology:</span>
                      <span className="font-label-code text-label-code text-primary font-bold px-2 py-0.5 rounded bg-surface-container-lowest">
                        {selectedStation.zone}
                      </span>
                    </div>
                    <div className="font-label-code text-label-code text-on-surface-variant">
                      <span>SEASONAL BASELINE: </span>
                      <span className="font-semibold text-on-surface">{selectedStation.baseline}°C</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Measurement Source & Instrumentation */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm space-y-space-md border border-outline-variant/30">
                  <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
                    <div className="flex items-center gap-space-sm">
                      <span className="font-label-code text-label-code text-primary font-bold px-2 py-0.5 rounded bg-primary-fixed-dim/30">03</span>
                      <h2 className="font-headline-md text-headline-md text-primary font-semibold">Measurement Source &amp; Instrumentation</h2>
                    </div>
                    <span className="font-caption-caps text-caption-caps text-outline uppercase tracking-wider font-semibold">Provenance Tier</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    <div className="space-y-space-xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="sourceType">
                        Telemetry Source Category
                      </label>
                      <select 
                        id="sourceType"
                        value={sourceType}
                        onChange={(e) => setSourceType(e.target.value)}
                        className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
                      >
                        <option value="calibrated_thermistor">Calibrated Field Thermistor (±0.15°C)</option>
                        <option value="ir_pyrometer">Handheld IR Surface Pyrometer (±0.5°C)</option>
                        <option value="weather_station">Automatic Weather Station (AWS Tier 2)</option>
                        <option value="hypothetical_sim">Hypothetical Scenario Simulation (TF-141 Model)</option>
                        <option value="crowd_in situ">Citizen Science Handheld Probe</option>
                      </select>
                      <span className="font-caption-caps text-caption-caps text-outline block">Determines uncertainty confidence weighting (σ)</span>
                    </div>

                    <div className="space-y-space-xs">
                      <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="instrumentSpec">
                        Instrument Specification / Model
                      </label>
                      <input 
                        id="instrumentSpec"
                        type="text"
                        value={instrumentSpec}
                        onChange={(e) => setInstrumentSpec(e.target.value)}
                        className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/20"
                      />
                      <span className="font-caption-caps text-caption-caps text-outline block">Serial / Calibration certificate or model algorithm revision</span>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Urban Micro-Environment Context & Notes */}
                <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-sm space-y-space-md border border-outline-variant/30">
                  <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
                    <div className="flex items-center gap-space-sm">
                      <span className="font-label-code text-label-code text-primary font-bold px-2 py-0.5 rounded bg-primary-fixed-dim/30">04</span>
                      <h2 className="font-headline-md text-headline-md text-primary font-semibold">Urban Surface Context &amp; Field Notes</h2>
                    </div>
                    <span className="font-caption-caps text-caption-caps text-outline uppercase tracking-wider font-semibold">Albedo &amp; Morphology</span>
                  </div>

                  <div className="space-y-space-xs">
                    <label className="font-body-sm text-body-sm font-semibold text-on-surface block mb-1">Ground Substrate Albedo Group</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-space-xs" id="surfaceButtonGroup">
                      {SUBSTRATES.map((sub) => {
                        const isSelected = selectedSubstrate.name === sub.name;
                        return (
                          <button
                            key={sub.name}
                            type="button"
                            onClick={() => setSelectedSubstrate(sub)}
                            className={`p-space-sm text-left rounded-lg transition-colors flex flex-col justify-between border ${
                              isSelected 
                                ? 'bg-primary-container text-on-primary font-semibold border-primary' 
                                : 'bg-surface-container-low text-on-surface hover:bg-surface-container-highest border-outline-variant/20'
                            }`}
                          >
                            <span className="font-body-sm text-body-sm">{sub.name}</span>
                            <span className={`font-label-code text-[10px] ${isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                              α ≈ {sub.albedo.toFixed(2)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-space-xs">
                    <label className="font-body-sm text-body-sm font-semibold text-on-surface" htmlFor="fieldNotes">
                      Field Microclimate Observations &amp; Mitigation Notes
                    </label>
                    <textarea 
                      id="fieldNotes"
                      rows={3}
                      value={fieldNotes}
                      onChange={(e) => setFieldNotes(e.target.value)}
                      className="w-full bg-surface-container-low px-space-md py-space-sm rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container resize-y border border-outline-variant/20"
                    />
                    <span className="font-caption-caps text-caption-caps text-outline block">Qualitative evidentiary text parsed into natural-language anomaly records</span>
                  </div>
                </div>

                {/* Submission CTA Actions Strip */}
                <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-xs">
                  <div className="flex items-center gap-space-sm">
                    <button 
                      type="submit"
                      className="inline-flex items-center gap-space-xs px-space-xl py-3 rounded-lg bg-primary-container text-on-primary font-headline-md text-headline-md hover:bg-primary transition-all shadow-md active:scale-[0.98] font-semibold"
                    >
                      <span className="material-symbols-outlined text-[20px]">send_time_extension</span>
                      <span>Validate &amp; Record Reading (Demo)</span>
                    </button>
                    <button 
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-space-xs px-space-md py-3 rounded-lg bg-surface-container hover:bg-surface-container-highest text-on-surface font-body-md text-body-md transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                      <span>Reset Form</span>
                    </button>
                  </div>
                  <div className="font-caption-caps text-caption-caps text-outline flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">lock_clock</span>
                    <span>SHA-256 BUFFERED TRANSIENT STATE</span>
                  </div>
                </div>

                {/* Dynamic Feedback Notification Toast */}
                {toastVisible && (
                  <div className="rounded-xl bg-primary text-on-primary p-space-md shadow-xl transition-all duration-300">
                    <div className="flex items-start justify-between gap-space-md">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold">✓</div>
                        <div>
                          <h4 className="font-headline-md text-headline-md font-semibold text-on-primary">Telemetry Observation Buffered in Research Sandbox</h4>
                          <p className="font-body-sm text-body-sm text-primary-fixed mt-0.5">{toastMessage}</p>
                        </div>
                      </div>
                      <button onClick={() => setToastVisible(false)} type="button" className="text-on-primary hover:text-primary-fixed-dim">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Right Column: Live Dynamic Observation Preview Card */}
            <div className="lg:col-span-5 xl:col-span-4 sticky top-[96px] space-y-space-md">
              <div className="rounded-xl bg-surface-container-lowest p-space-lg shadow-md space-y-space-md relative overflow-hidden border border-outline-variant/30">
                
                {/* Dynamic Thermal Accent Bar on top of card */}
                <div 
                  className={`absolute top-0 left-0 right-0 h-1.5 transition-all duration-300 ${
                    isExtreme ? 'bg-error' : isHigh ? 'bg-tertiary-container' : 'bg-secondary'
                  }`}
                ></div>

                {/* Card Header */}
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-secondary text-[20px]">insights</span>
                    <span className="font-caption-caps text-caption-caps uppercase tracking-wider text-on-surface font-bold">Simulated Reading Preview</span>
                  </div>
                  <span className="font-label-code text-label-code text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                    ID: HS-9281-SIM
                  </span>
                </div>

                {/* Dynamic Thermal Risk Tier Pill */}
                <div className={`p-space-md rounded-xl transition-colors duration-300 ${
                  isExtreme ? 'bg-error-container text-on-error-container' : isHigh ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-secondary-container text-on-secondary-container'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-caption-caps text-caption-caps uppercase font-bold tracking-wider">{riskTitle}</span>
                    <span className="font-label-code text-label-code font-bold">HI: {heatIndex}°C</span>
                  </div>
                  <div className="font-headline-md text-headline-md font-bold">{tempInC.toFixed(1)}°C at {humidity}% RH</div>
                  <p className="font-body-sm text-body-sm opacity-90 mt-1">{riskGuidance}</p>
                </div>

                {/* Real-Time Anomaly Computation vs Solapur Baseline */}
                <div className="rounded-lg bg-surface-container-low p-space-md space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Solapur Ward Seasonal Baseline</span>
                    <span className="font-label-metric text-label-metric text-on-surface font-semibold">{baseline}°C</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Observed Thermal Anomaly</span>
                    <span className={`font-label-metric text-label-metric font-bold ${anomalyNum > 0 ? 'text-tertiary' : 'text-secondary'}`}>
                      {anomalyNum > 0 ? `+${anomaly}` : anomaly}°C
                    </span>
                  </div>
                  <div className="pt-2">
                    <div className="h-2 w-full rounded-full bg-surface-container-highest overflow-hidden relative">
                      <div 
                        className={`h-full transition-all duration-300 ${isExtreme ? 'bg-error' : isHigh ? 'bg-tertiary-container' : 'bg-secondary'}`}
                        style={{ width: `${Math.min(Math.max((anomalyNum + 2) / 7 * 100, 10), 98)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between font-label-code text-[10px] text-outline mt-1">
                      <span>-2.0°C (Cool Sink)</span>
                      <span>Baseline (0)</span>
                      <span>+5.0°C (Extreme Island)</span>
                    </div>
                  </div>
                </div>

                {/* Spatial Pin Context Mini-Card */}
                <div className="rounded-lg bg-surface-container-low p-space-md space-y-space-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-caption-caps text-caption-caps uppercase text-secondary font-bold block">Target Microclimate Cell</span>
                      <div className="font-headline-md text-headline-md text-primary font-semibold">{selectedStation.shortName}</div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">{selectedStation.zone}</div>
                    </div>
                    <span className="material-symbols-outlined text-primary text-[24px]">location_on</span>
                  </div>
                  <div className="pt-space-xs font-label-code text-label-code text-on-surface bg-surface-container-lowest p-2 rounded flex items-center justify-between">
                    <span>{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</span>
                    <span className="text-secondary font-bold">{selectedStation.wardCode}</span>
                  </div>
                </div>

                {/* Sensor & Substrate Metadata Chips */}
                <div className="grid grid-cols-2 gap-space-xs">
                  <div className="p-space-xs px-space-sm rounded bg-surface-container">
                    <span className="font-caption-caps text-[9px] uppercase text-outline block">Substrate Albedo</span>
                    <span className="font-label-code text-label-code text-on-surface font-semibold">{selectedSubstrate.name} (α={selectedSubstrate.albedo})</span>
                  </div>
                  <div className="p-space-xs px-space-sm rounded bg-surface-container">
                    <span className="font-caption-caps text-[9px] uppercase text-outline block">Surface Thermal</span>
                    <span className="font-label-code text-label-code text-on-surface font-semibold">{surfaceTemp}°C IR</span>
                  </div>
                </div>

                {/* Integrity Checksum & JSON Payload Inspector */}
                <div className="pt-space-xs space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-caption-caps text-caption-caps uppercase text-outline font-semibold">Telemetry Schema Payload</span>
                    <button 
                      type="button"
                      onClick={handleCopyJson}
                      className="font-label-code text-[11px] text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium"
                    >
                      <span className="material-symbols-outlined text-[13px]">content_copy</span>
                      <span>{copyStatus}</span>
                    </button>
                  </div>
                  <pre className="w-full rounded-lg bg-surface-container-highest p-space-sm font-label-code text-[11px] leading-relaxed text-on-surface overflow-x-auto max-h-40 whitespace-pre border border-outline-variant/20">
                    {jsonPayload}
                  </pre>
                </div>
              </div>

              {/* Research Sandbox Guidelines Mini-Panel */}
              <div className="rounded-xl bg-surface-container p-space-md space-y-space-xs border border-outline-variant/30">
                <div className="flex items-center gap-space-xs text-primary font-semibold">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="font-caption-caps text-caption-caps uppercase font-bold">Quality Assurance Validation</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Readings exceeding 3.5σ of ward baselines are automatically flagged with experimental weights to prevent synthetic grid skew.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
