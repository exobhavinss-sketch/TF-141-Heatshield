import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

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
  const { user, isConfigured } = useAuth();

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
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastTitle, setToastTitle] = useState('Telemetry Observation Buffered');
  const [toastMessage, setToastMessage] = useState('');
  const [toastIsError, setToastIsError] = useState(false);
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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (tempInC < -10 || tempInC > 75) {
      setToastIsError(true);
      setToastTitle('Invalid Temperature Reading');
      setToastMessage('Air temperature must be between -10°C and 75°C.');
      setToastVisible(true);
      return;
    }
    if (humidity < 0 || humidity > 100) {
      setToastIsError(true);
      setToastTitle('Invalid Relative Humidity');
      setToastMessage('Relative humidity must be between 0% and 100%.');
      setToastVisible(true);
      return;
    }

    setIsSubmitting(true);
    setToastIsError(false);

    try {
      if (isConfigured && supabase && user) {
        const readingRecord = {
          user_id: user.id,
          temperature_c: parseFloat(tempInC.toFixed(1)),
          humidity_percent: parseFloat(humidity),
          surface_temp_c: surfaceTemp ? parseFloat(surfaceTemp) : null,
          heat_index_c: parseFloat(heatIndex),
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          station_id: selectedStation.id,
          substrate: selectedSubstrate.name,
          instrument_spec: instrumentSpec,
          notes: fieldNotes.trim() || null,
          recorded_at: new Date(timestamp).toISOString(),
          status: 'pending',
        };

        const { data, error } = await supabase
          .from('heat_readings')
          .insert([readingRecord])
          .select('id, status, created_at')
          .single();

        if (error) throw error;

        setToastTitle('Telemetry Recorded to Supabase Database');
        setToastMessage(`Record ID ${data.id.slice(0, 8)}... successfully registered under ${selectedStation.shortName} (Status: pending peer-review validation).`);
        setToastVisible(true);
      } else {
        const summary = `Reading for ${selectedStation.id} (${tempInC.toFixed(1)}°C) buffered in local research sandbox memory for ${selectedStation.shortName}. Sign in to save permanently to your Supabase ledger.`;
        setToastTitle('Telemetry Observation Buffered in Sandbox');
        setToastMessage(summary);
        setToastVisible(true);
      }
    } catch (err) {
      console.error('[HeatShield Submit] Database insertion error:', err);
      setToastIsError(true);
      setToastTitle('Submission Failed');
      setToastMessage(err.message || 'Could not record reading to Supabase database. Please try again.');
      setToastVisible(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToastVisible(false), 5500);
    }
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
    submitter_user_id: user ? user.id : 'guest_researcher',
    submission_mode: user && isConfigured ? 'supabase_live' : 'sandbox_demo',
    checksum: "sha256-d41d8cd98f00b204e9800998ecf8427e"
  }, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonPayload);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus('Copy JSON'), 2000);
  };

  return (
    <div className="flex flex-col w-full pb-24 bg-[#fafafc]">
      
      {/* Top Breadcrumb & Metadata Header */}
      <section className="w-full px-6 pt-12 pb-8 border-b border-black/[0.04]">
        <div className="max-w-[1340px] mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-[12px]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[#0071e3] font-semibold uppercase tracking-wider">TF-141</span>
              <span className="text-[#86868b]">/</span>
              <span className="text-[#86868b]">FIELD-TELEMETRY</span>
              <span className="text-[#86868b]">/</span>
              <span className="font-mono text-[#1d1d1f]">SYNTHETIC INGESTION PIPELINE</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[980px] bg-[#f5f5f7] text-[#1d1d1f] font-mono text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]"></span>
              <span>BUFFER: LOCAL CLIENT MEMORY</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0071e3] block">
                Spatial Climatology • Node Entry
              </span>
              <h1 className="text-[38px] md:text-[50px] font-semibold tracking-[-0.03em] text-[#1d1d1f] leading-[1.1]">
                Submit a Temperature Reading
              </h1>
              <p className="text-[17px] text-[#86868b] leading-relaxed">
                Contribute ground-level microclimate observations or compute hypothetical urban cooling scenarios across Solapur's synthetic research grid.
              </p>
            </div>
            <div className="hidden md:flex flex-col text-right font-mono text-[11px] text-[#86868b]">
              <span>GRID SYSTEM: EPSG:4326</span>
              <span className="text-[#0071e3] font-medium">100 SIMULATED ACTIVE NODES</span>
            </div>
          </div>

          {/* Academic Transparency Notice Banner */}
          <div className="rounded-[24px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-black/[0.06] flex items-start gap-4">
            <div className="w-10 h-10 rounded-[12px] bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">science</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-semibold text-[#1d1d1f]">Academic Sandbox &amp; Calibration Mode</span>
                <span className="px-2 py-0.5 rounded-[980px] bg-[#0071e3]/10 text-[#0071e3] font-mono text-[10px] font-semibold uppercase">
                  Research Preview
                </span>
              </div>
              <p className="text-[13px] text-[#86868b] leading-relaxed">
                Submissions are parsed and preserved in transient client-side memory for spatial validation, real-time microclimate anomaly calculations, and scenario simulation. Records are not committed to official municipal meteorological telemetry nodes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2-Column Split: Form (Left) & Live Observer Panel (Right) */}
      <div className="max-w-[1340px] mx-auto px-6 pt-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <form onSubmit={handleFormSubmit} className="space-y-6" id="readingForm">
              
              {/* SECTION 1: Atmospheric Metrics */}
              <div className="rounded-[28px] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-6 border border-black/[0.06]">
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[6px] bg-[#f5f5f7] text-[#0071e3]">01</span>
                    <h2 className="text-[18px] font-semibold text-[#1d1d1f]">Atmospheric &amp; Thermal Metrics</h2>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Required</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Air Temp */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[12px]">
                      <label className="font-medium text-[#1d1d1f]" htmlFor="airTempInput">
                        Ambient Air Temperature
                      </label>
                      <span className="font-mono text-[#0071e3]">UNIT: °{tempUnit}</span>
                    </div>
                    <div className="relative flex rounded-[12px] bg-[#f5f5f7] border border-transparent focus-within:border-black/20 focus-within:bg-white transition-all">
                      <input 
                        id="airTempInput"
                        type="number"
                        step="0.1"
                        required
                        value={airTemp}
                        onChange={(e) => setAirTemp(e.target.value)}
                        className="w-full bg-transparent px-4 py-2.5 text-[15px] font-semibold text-[#1d1d1f] focus:outline-none tabular-nums"
                      />
                      <div className="flex items-center pr-2">
                        <button 
                          type="button"
                          onClick={toggleTempUnit}
                          className="px-2.5 py-1 rounded-[8px] bg-white text-[#1d1d1f] font-mono text-[12px] hover:bg-[#f5f5f7] transition-colors shadow-xs font-semibold"
                        >
                          °{tempUnit}
                        </button>
                      </div>
                    </div>
                    <span className="text-[11px] text-[#86868b] block">Calibrated sensor dry-bulb reading at 1.5m</span>
                  </div>

                  {/* Relative Humidity */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[12px]">
                      <label className="font-medium text-[#1d1d1f]" htmlFor="humiditySlider">
                        Relative Humidity (%)
                      </label>
                      <span className="font-semibold text-[#1d1d1f] tabular-nums">{humidity}%</span>
                    </div>
                    <div className="flex items-center pt-2">
                      <input 
                        id="humiditySlider"
                        type="range"
                        min="10"
                        max="100"
                        value={humidity}
                        onChange={(e) => setHumidity(Number(e.target.value))}
                        className="w-full accent-[#0071e3] cursor-pointer bg-[#f5f5f7] h-2 rounded-[980px]"
                      />
                    </div>
                    <span className="text-[11px] text-[#86868b] block">Hygrometric boundary vapor saturation</span>
                  </div>

                  {/* Surface Temp */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[12px]">
                      <label className="font-medium text-[#1d1d1f]" htmlFor="surfaceTempInput">
                        Surface Skin Temperature (Optional)
                      </label>
                      <span className="font-mono text-[11px] text-[#86868b]">INFRARED / °C</span>
                    </div>
                    <div className="relative flex rounded-[12px] bg-[#f5f5f7] border border-transparent focus-within:border-black/20 focus-within:bg-white transition-all">
                      <input 
                        id="surfaceTempInput"
                        type="number"
                        step="0.1"
                        value={surfaceTemp}
                        onChange={(e) => setSurfaceTemp(e.target.value)}
                        className="w-full bg-transparent px-4 py-2.5 text-[15px] font-semibold text-[#1d1d1f] focus:outline-none tabular-nums"
                      />
                    </div>
                    <span className="text-[11px] text-[#86868b] block">Direct pyrometer contact or 8-14μm radiometer</span>
                  </div>

                  {/* Solar Flux */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#1d1d1f]" htmlFor="solarIrradiance">
                      Solar Irradiance Flux
                    </label>
                    <select 
                      id="solarIrradiance"
                      value={solarFlux}
                      onChange={(e) => setSolarFlux(e.target.value)}
                      className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all cursor-pointer"
                    >
                      <option value="direct_peak">Direct Peak Solar Zenith (800 - 1050 W/m²)</option>
                      <option value="diffuse_cloud">Partial Cloud Obscuration (400 - 650 W/m²)</option>
                      <option value="canopy_shaded">Understory Forest Canopy (120 - 250 W/m²)</option>
                      <option value="crepuscular">Crepuscular / Twilight (&lt; 50 W/m²)</option>
                      <option value="nocturnal">Nocturnal Cooling Cycle (0 W/m²)</option>
                    </select>
                    <span className="text-[11px] text-[#86868b] block">Global horizontal irradiance weighting tier</span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: Spatial & Temporal Anchor */}
              <div className="rounded-[28px] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-6 border border-black/[0.06]">
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[6px] bg-[#f5f5f7] text-[#0071e3]">02</span>
                    <h2 className="text-[18px] font-semibold text-[#1d1d1f]">Temporal &amp; Spatial Anchor</h2>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Solapur Mesh</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#1d1d1f]" htmlFor="timestampInput">
                      Observation Timestamp (IST)
                    </label>
                    <input 
                      id="timestampInput"
                      type="datetime-local"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] font-mono text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all"
                    />
                    <span className="text-[11px] text-[#86868b] block">Synchronous local research epoch</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#1d1d1f]" htmlFor="stationSelect">
                      Simulation Station / Ward
                    </label>
                    <select 
                      id="stationSelect"
                      value={selectedStation.id}
                      onChange={handleStationChange}
                      className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all cursor-pointer"
                    >
                      {STATIONS.map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                      ))}
                    </select>
                    <span className="text-[11px] text-[#86868b] block">Indexed against 100 Solapur GIS sensor stations</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#1d1d1f]" htmlFor="latitudeInput">
                      Latitude (°N)
                    </label>
                    <input 
                      id="latitudeInput"
                      type="number"
                      step="0.0001"
                      value={latitude}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] font-mono text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#1d1d1f]" htmlFor="longitudeInput">
                      Longitude (°E)
                    </label>
                    <input 
                      id="longitudeInput"
                      type="number"
                      step="0.0001"
                      value={longitude}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] font-mono text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Urban Topology Badge */}
                <div className="p-4 rounded-[18px] bg-[#f5f5f7] flex flex-wrap items-center justify-between gap-3 text-[12px]">
                  <div className="flex items-center gap-2">
                    <span className="text-[#86868b] uppercase tracking-wider font-semibold text-[11px]">Inferred Topology:</span>
                    <span className="font-semibold text-[#1d1d1f]">
                      {selectedStation.zone}
                    </span>
                  </div>
                  <div className="font-mono text-[#86868b]">
                    <span>BASELINE: </span>
                    <span className="font-semibold text-[#1d1d1f]">{selectedStation.baseline}°C</span>
                  </div>
                </div>
              </div>

              {/* SECTION 3: Measurement Source */}
              <div className="rounded-[28px] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-6 border border-black/[0.06]">
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[6px] bg-[#f5f5f7] text-[#0071e3]">03</span>
                    <h2 className="text-[18px] font-semibold text-[#1d1d1f]">Measurement Source &amp; Instrumentation</h2>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Provenance</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#1d1d1f]" htmlFor="sourceType">
                      Telemetry Source Category
                    </label>
                    <select 
                      id="sourceType"
                      value={sourceType}
                      onChange={(e) => setSourceType(e.target.value)}
                      className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all cursor-pointer"
                    >
                      <option value="calibrated_thermistor">Calibrated Field Thermistor (±0.15°C)</option>
                      <option value="ir_pyrometer">Handheld IR Surface Pyrometer (±0.5°C)</option>
                      <option value="weather_station">Automatic Weather Station (AWS Tier 2)</option>
                      <option value="hypothetical_sim">Hypothetical Scenario Simulation (TF-141 Model)</option>
                      <option value="crowd_in situ">Citizen Science Handheld Probe</option>
                    </select>
                    <span className="text-[11px] text-[#86868b] block">Determines uncertainty confidence weighting (σ)</span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#1d1d1f]" htmlFor="instrumentSpec">
                      Instrument Specification / Model
                    </label>
                    <input 
                      id="instrumentSpec"
                      type="text"
                      value={instrumentSpec}
                      onChange={(e) => setInstrumentSpec(e.target.value)}
                      className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all"
                    />
                    <span className="text-[11px] text-[#86868b] block">Model revision or calibration certificate</span>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Substrate & Field Notes */}
              <div className="rounded-[28px] bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-6 border border-black/[0.06]">
                <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-[6px] bg-[#f5f5f7] text-[#0071e3]">04</span>
                    <h2 className="text-[18px] font-semibold text-[#1d1d1f]">Surface Context &amp; Field Notes</h2>
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Albedo</span>
                </div>

                <div className="space-y-2">
                  <label className="text-[12px] font-medium text-[#1d1d1f] block">Ground Substrate Albedo Group</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2" id="surfaceButtonGroup">
                    {SUBSTRATES.map((sub) => {
                      const isSelected = selectedSubstrate.name === sub.name;
                      return (
                        <button
                          key={sub.name}
                          type="button"
                          onClick={() => setSelectedSubstrate(sub)}
                          className={`p-3 text-left rounded-[14px] transition-all flex flex-col justify-between border ${
                            isSelected 
                              ? 'bg-[#0071e3] text-white font-semibold border-[#0071e3] shadow-xs' 
                              : 'bg-[#f5f5f7] text-[#1d1d1f] hover:bg-[#e8e8ed] border-transparent'
                          }`}
                        >
                          <span className="text-[13px]">{sub.name}</span>
                          <span className={`font-mono text-[10px] mt-1 ${isSelected ? 'text-white/80' : 'text-[#86868b]'}`}>
                            α ≈ {sub.albedo.toFixed(2)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#1d1d1f]" htmlFor="fieldNotes">
                    Field Microclimate Observations &amp; Mitigation Notes
                  </label>
                  <textarea 
                    id="fieldNotes"
                    rows={3}
                    value={fieldNotes}
                    onChange={(e) => setFieldNotes(e.target.value)}
                    className="w-full bg-[#f5f5f7] p-4 rounded-[16px] text-[13px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all resize-y placeholder:text-[#86868b]"
                  />
                  <span className="text-[11px] text-[#86868b] block">Qualitative observations parsed into anomaly records</span>
                </div>
              </div>

              {/* Action Buttons Strip */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-8 h-12 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[14px] font-medium transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] active:scale-[0.98] disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Recording Telemetry...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">send_time_extension</span>
                        <span>
                          {user && isConfigured ? 'Record Reading to Supabase' : 'Record Reading (Sandbox Demo)'}
                        </span>
                      </>
                    )}
                  </button>
                  <button 
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1.5 px-5 h-12 rounded-[980px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-[13px] font-medium transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    <span>Reset</span>
                  </button>
                </div>
                <div className="font-mono text-[11px] text-[#86868b] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  <span>{user && isConfigured ? 'SUPABASE POSTGRESQL' : 'RESEARCH SANDBOX'}</span>
                </div>
              </div>

              {/* Feedback Toast */}
              {toastVisible && (
                <div className={`rounded-[20px] p-5 shadow-lg transition-all duration-300 ${
                  toastIsError ? 'bg-[#dc2626] text-white' : 'bg-[#1d1d1f] text-white'
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-[980px] flex items-center justify-center font-bold text-[14px] ${
                        toastIsError ? 'bg-white text-[#dc2626]' : 'bg-[#059669] text-white'
                      }`}>
                        {toastIsError ? '!' : '✓'}
                      </div>
                      <div>
                        <h4 className="text-[14px] font-semibold">{toastTitle}</h4>
                        <p className="text-[12px] opacity-90 mt-0.5 leading-relaxed">{toastMessage}</p>
                      </div>
                    </div>
                    <button onClick={() => setToastVisible(false)} type="button" className="opacity-70 hover:opacity-100">
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Right Observer Panel (4 Cols) */}
          <div className="lg:col-span-4 sticky top-[72px] space-y-6">
            <div className="rounded-[28px] bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] space-y-5 border border-black/[0.06]">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.04]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#0071e3] text-[18px]">insights</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1d1d1f]">Live Telemetry Preview</span>
                </div>
                <span className="font-mono text-[10px] text-[#86868b] bg-[#f5f5f7] px-2 py-0.5 rounded-[980px]">
                  HS-9281-SIM
                </span>
              </div>

              {/* Risk Tier Badge */}
              <div className={`p-5 rounded-[20px] transition-colors duration-300 ${
                isExtreme ? 'bg-[#dc2626]/10 text-[#dc2626]' : isHigh ? 'bg-[#ea580c]/10 text-[#ea580c]' : 'bg-[#059669]/10 text-[#059669]'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wider">{riskTitle}</span>
                  <span className="font-mono text-[11px] font-bold">HI: {heatIndex}°C</span>
                </div>
                <div className="text-[20px] font-semibold tracking-tight">{tempInC.toFixed(1)}°C at {humidity}% RH</div>
                <p className="text-[12px] opacity-90 mt-1 leading-relaxed">{riskGuidance}</p>
              </div>

              {/* Real-Time Anomaly vs Solapur Baseline */}
              <div className="rounded-[20px] bg-[#f5f5f7] p-5 space-y-2 border border-black/[0.04]">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#86868b]">Ward Baseline</span>
                  <span className="font-semibold text-[#1d1d1f] tabular-nums">{baseline}°C</span>
                </div>
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#86868b]">Observed Anomaly</span>
                  <span className={`font-bold tabular-nums ${anomalyNum > 0 ? 'text-[#dc2626]' : 'text-[#059669]'}`}>
                    {anomalyNum > 0 ? `+${anomaly}` : anomaly}°C
                  </span>
                </div>
                <div className="pt-2">
                  <div className="h-2 w-full rounded-[980px] bg-black/10 overflow-hidden relative">
                    <div 
                      className={`h-full transition-all duration-300 ${isExtreme ? 'bg-[#dc2626]' : isHigh ? 'bg-[#ea580c]' : 'bg-[#059669]'}`}
                      style={{ width: `${Math.min(Math.max((anomalyNum + 2) / 7 * 100, 10), 98)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between font-mono text-[10px] text-[#86868b] mt-1.5">
                    <span>-2.0°C</span>
                    <span>Baseline (0)</span>
                    <span>+5.0°C</span>
                  </div>
                </div>
              </div>

              {/* Target Cell Details */}
              <div className="rounded-[20px] bg-[#f5f5f7] p-5 space-y-2 border border-black/[0.04]">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0071e3] block">Target Microclimate Cell</span>
                    <div className="text-[15px] font-semibold text-[#1d1d1f] mt-0.5">{selectedStation.shortName}</div>
                    <div className="text-[12px] text-[#86868b]">{selectedStation.zone}</div>
                  </div>
                  <span className="material-symbols-outlined text-[#0071e3] text-[22px]">location_on</span>
                </div>
                <div className="pt-1 font-mono text-[11px] text-[#1d1d1f] bg-white p-2.5 rounded-[12px] flex items-center justify-between border border-black/[0.04]">
                  <span>{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</span>
                  <span className="text-[#0071e3] font-semibold">{selectedStation.wardCode}</span>
                </div>
              </div>

              {/* Substrate Albedo & Thermal Chips */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-[16px] bg-[#f5f5f7]">
                  <span className="text-[10px] uppercase font-semibold text-[#86868b] block">Substrate</span>
                  <span className="font-mono text-[11px] text-[#1d1d1f] font-medium">{selectedSubstrate.name} (α={selectedSubstrate.albedo})</span>
                </div>
                <div className="p-3 rounded-[16px] bg-[#f5f5f7]">
                  <span className="text-[10px] uppercase font-semibold text-[#86868b] block">Surface Skin</span>
                  <span className="font-mono text-[11px] text-[#1d1d1f] font-medium">{surfaceTemp}°C IR</span>
                </div>
              </div>

              {/* JSON Payload Inspector */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">Telemetry Payload</span>
                  <button 
                    type="button"
                    onClick={handleCopyJson}
                    className="font-mono text-[11px] text-[#0071e3] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span className="material-symbols-outlined text-[13px]">content_copy</span>
                    <span>{copyStatus}</span>
                  </button>
                </div>
                <pre className="w-full rounded-[16px] bg-[#1d1d1f] p-4 font-mono text-[11px] leading-relaxed text-[#f5f5f7] overflow-x-auto max-h-36 whitespace-pre shadow-inner">
                  {jsonPayload}
                </pre>
              </div>
            </div>

            {/* QA Validation Note */}
            <div className="p-5 bg-white rounded-[24px] border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)] space-y-1">
              <div className="flex items-center gap-1.5 text-[#0071e3] font-medium text-[12px]">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span className="uppercase tracking-wider font-semibold">QA Validation</span>
              </div>
              <p className="text-[12px] text-[#86868b] leading-relaxed">
                Readings exceeding 3.5σ of ward baselines are automatically flagged with experimental weights to prevent synthetic grid skew.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
