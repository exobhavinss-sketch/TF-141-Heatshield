import React from 'react';

export default function Methodology() {
  const bibtex = `@article{tf141_heatshield_2024,
  title   = {HeatShield: Microclimatic Canopy Simulation & Diurnal Urban Heat Island Analysis in Solapur},
  author  = {Bagwan, Furqan and Shaikh, Aman and Shankur, Bhavin},
  journal = {MIT Vishwaprayag University Academic Research Initiative},
  year    = {2024},
  volume  = {2},
  number  = {4},
  doi     = {10.1145/TF141.2024.SOLAPUR}
}`;

  return (
    <div className="flex flex-col w-full pb-space-xl">
      
      {/* Top Ambient Gradient Anchor */}
      <div className="relative w-full overflow-hidden bg-surface-container-low pt-space-xl pb-space-lg border-b border-outline-variant/30">
        <div className="max-w-[1400px] mx-auto px-margin">
          
          {/* Section Breadcrumb / Version Header */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
            <div className="inline-flex items-center gap-space-xs bg-surface-container-highest px-space-sm py-1 rounded-DEFAULT">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span className="font-label-code text-label-code text-on-surface uppercase tracking-wider">
                RESEARCH SPECIFICATION • VERSION 2.4
              </span>
            </div>
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-code text-label-code">
              <span>PEER-REVIEW COMPLIANT</span>
              <span className="text-outline">•</span>
              <span>DOI: 10.1145/TF141.2024.SOLAPUR</span>
            </div>
          </div>

          {/* Main Headline Block */}
          <div className="max-w-4xl space-y-space-sm">
            <h1 className="font-headline-xl text-headline-xl text-primary font-semibold tracking-tight">
              Methodology &amp; Simulation Architecture
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Detailed technical documentation of urban canopy modeling, synthetic microclimate generation, and heat vulnerability indices for Solapur, Maharashtra.
            </p>
          </div>

          {/* Metadata Ledger Strip */}
          <div className="mt-space-lg pt-space-md bg-surface-container-lowest rounded-xl p-space-md shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-gutter border border-outline-variant/30">
            <div className="space-y-space-xs">
              <span className="font-caption-caps text-caption-caps uppercase text-outline block">Research Consortium</span>
              <span className="font-headline-md text-headline-md text-on-surface font-semibold">Team TF-141</span>
            </div>
            <div className="space-y-space-xs">
              <span className="font-caption-caps text-caption-caps uppercase text-outline block">Academic Seat</span>
              <span className="font-body-md text-body-md text-on-surface font-medium">MIT Vishwaprayag Univ.</span>
            </div>
            <div className="space-y-space-xs">
              <span className="font-caption-caps text-caption-caps uppercase text-outline block">Chronological Window</span>
              <span className="font-label-metric text-label-metric text-secondary font-bold">2021 – 2025 Synthetic</span>
            </div>
            <div className="space-y-space-xs">
              <span className="font-caption-caps text-caption-caps uppercase text-outline block">Document Revision</span>
              <span className="font-label-code text-label-code text-on-surface">May 2024 (v2.4.1)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Technical Body Container */}
      <div className="max-w-[1400px] mx-auto px-margin py-space-xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          
          {/* Left Column: Sticky Table of Contents & Quick Metrics */}
          <aside className="lg:col-span-3 space-y-space-lg">
            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm sticky top-28 space-y-space-md border border-outline-variant/30">
              <div className="flex items-center justify-between pb-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-lg">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface tracking-wider font-semibold">
                  Specifications Index
                </span>
                <span className="font-label-code text-label-code text-outline">6 SECTIONS</span>
              </div>
              <nav className="flex flex-col space-y-1 font-body-sm text-body-sm text-on-surface-variant">
                <a className="p-space-xs rounded hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-between" href="#overview">
                  <span>01. Project Motivation</span>
                  <span className="font-label-code text-label-code text-outline">BSh</span>
                </a>
                <a className="p-space-xs rounded hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-between" href="#study-area">
                  <span>02. Study Morphologies</span>
                  <span className="font-label-code text-label-code text-outline">9 LCZs</span>
                </a>
                <a className="p-space-xs rounded hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-between" href="#synthetic-engine">
                  <span>03. WRF-Canopy Engine</span>
                  <span className="font-label-code text-label-code text-outline">150k pts</span>
                </a>
                <a className="p-space-xs rounded hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-between" href="#thermal-indices">
                  <span>04. Vulnerability Indices</span>
                  <span className="font-label-code text-label-code text-outline">WBGT/NDVI</span>
                </a>
                <a className="p-space-xs rounded hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-between" href="#architecture">
                  <span>05. Open Tech Pipeline</span>
                  <span className="font-label-code text-label-code text-outline">React/Geo</span>
                </a>
                <a className="p-space-xs rounded hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-between" href="#provenance">
                  <span>06. Citation &amp; Authors</span>
                  <span className="font-label-code text-label-code text-outline">BibTeX</span>
                </a>
              </nav>

              {/* Compact Sensor Distribution Gauge Card */}
              <div className="bg-surface-container rounded-lg p-space-sm space-y-space-xs">
                <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant block font-semibold">
                  Mesh Topology
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="font-headline-md text-headline-md text-primary font-bold">100 Nodes</span>
                  <span className="font-label-code text-label-code text-secondary font-medium">Δh 462m mean</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Solapur Municipal boundary (148.4 km²) stratified via Local Climate Zones.
                </p>
              </div>
            </div>
          </aside>

          {/* Center & Right: In-depth Technical Documentation */}
          <article className="lg:col-span-9 space-y-space-xl">
            
            {/* SECTION 1: Project Overview & Scientific Motivation */}
            <section className="space-y-space-md" id="overview">
              <div className="flex items-center gap-space-sm">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-code text-label-code flex items-center justify-center font-bold">01</span>
                <h2 className="font-headline-lg text-headline-lg text-primary font-semibold">Project Overview &amp; Scientific Motivation</h2>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-outline-variant/30">
                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed max-w-prose">
                  The semi-arid Deccan plateau represents one of South Asia's most climatologically vulnerable interior land expanses. Solapur, situated at <span className="font-label-code text-label-code text-primary bg-surface-container px-1 py-0.5 rounded font-semibold">17.6599° N, 75.9064° E</span>, experiences an extreme hot semi-arid climate (Köppen classification <em className="font-semibold text-primary">BSh</em>). Escalating pre-monsoon summer ambient temperatures consistently breach <span className="font-label-metric text-label-metric text-tertiary-container font-semibold">44.5°C</span> during April and May, amplified by intense solar insolation and deficient green canopy mitigation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs">
                    <span className="material-symbols-outlined text-tertiary-container">thermostat</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Thermal Inertia Trapping</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      High thermal mass basalt construction and asphalt fractions retain day-cycle solar energy, causing night-time cooling stalls of 4.2°C above surrounding rural peri-urban buffers.
                    </p>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs">
                    <span className="material-symbols-outlined text-secondary">water_drop</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Vapor-Pressure Deficit</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Pre-monsoon atmospheric moisture surges combine with persistent thermal plumes, driving wet-bulb temperatures into elevated human physiological stress categories.
                    </p>
                  </div>
                </div>

                {/* Visual Graphic: Climate Elevation Profile & Insolation Sparkline */}
                <div className="bg-surface-container rounded-lg p-space-md space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant font-semibold">
                      Solapur Climatological Baseline • 10-Year Diurnal Trend
                    </span>
                    <span className="font-label-code text-label-code text-primary font-semibold">BSh ZONE PROFILE</span>
                  </div>
                  <svg className="w-full h-24 text-secondary stroke-current fill-none" viewBox="0 0 760 120">
                    <path d="M0,90 Q70,75 140,82 T280,45 T420,20 T560,35 T700,75 T760,65" strokeLinecap="round" strokeWidth="2.5"></path>
                    <path className="fill-secondary/10" d="M0,90 Q70,75 140,82 T280,45 T420,20 T560,35 T700,75 T760,65 L760,120 L0,120 Z" strokeWidth="0"></path>
                    <circle className="fill-tertiary-container" cx="420" cy="20" r="4" strokeWidth="0"></circle>
                    <text className="font-label-code text-label-code fill-on-surface font-semibold" fontSize="10" x="428" y="24">May Peak: 44.8°C</text>
                    <circle className="fill-primary" cx="140" cy="82" r="3" strokeWidth="0"></circle>
                    <text className="font-label-code text-label-code fill-on-surface-variant" fontSize="9" x="145" y="86">Jan Min: 16.2°C</text>
                  </svg>
                  <div className="flex justify-between font-label-code text-label-code text-outline pt-1">
                    <span>JAN</span><span>MAR</span><span>MAY (CRITICAL)</span><span>JUL (MONSOON)</span><span>SEP</span><span>NOV</span><span>DEC</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: Study Area & Geographic Characterization */}
            <section className="space-y-space-md" id="study-area">
              <div className="flex items-center gap-space-sm">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-code text-label-code flex items-center justify-center font-bold">02</span>
                <h2 className="font-headline-lg text-headline-lg text-primary font-semibold">Study Area &amp; Geographic Characterization</h2>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg border border-outline-variant/30">
                <p className="font-body-md text-body-md text-on-surface leading-relaxed max-w-prose">
                  The research framework stratifies 100 computationally modeled virtual monitoring stations across Solapur’s administrative limits. The sampling strategy aligns with Stewart &amp; Oke’s Local Climate Zone (LCZ) taxonomy across 9 distinct urban fabric morphologies:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {/* Morph Zone 1 */}
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-code text-label-code font-bold">
                        LCZ 2 • Compact Midrise
                      </span>
                      <span className="font-label-code text-label-code text-tertiary-container font-semibold">42 Nodes</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Core Commercial Fabric</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Bhavani Peth, Mangalwar Peth, and Guruwar Peth. Characterized by high building aspect ratios (&gt;1.5 H/W), canyon radiative trapping, zero setback curbs, and impermeable paving &gt;88%.
                    </p>
                    <div className="pt-space-xs text-outline font-label-code text-label-code">
                      Sky View Factor (SVF): 0.28 – 0.41
                    </div>
                  </div>

                  {/* Morph Zone 2 */}
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-code text-label-code font-bold">
                        LCZ 8 • Large Low-Rise
                      </span>
                      <span className="font-label-code text-label-code text-secondary font-semibold">28 Nodes</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Industrial Agglomeration</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      MIDC Chhatrapati Sambhaji Nagar Road and Akkalkot Road Textile Industrial Corridors. Galvanized iron roofing, vast low-albedo hardscape, and waste heat exhaust signatures.
                    </p>
                    <div className="pt-space-xs text-outline font-label-code text-label-code">
                      Impervious Surface: 92.4% mean
                    </div>
                  </div>

                  {/* Morph Zone 3 */}
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="px-space-xs py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-code text-label-code font-bold">
                        LCZ 9/D • Sparsely Built
                      </span>
                      <span className="font-label-code text-label-code text-primary font-semibold">30 Nodes</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Peri-Urban Transition</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      Kegaon University Campus, Degaon, and Hipparga Lake agricultural edges. Mixed scrublands, permeable clay soils, seasonal biomass, representing rural reference boundary baselines.
                    </p>
                    <div className="pt-space-xs text-outline font-label-code text-label-code">
                      Vegetation Cover: 34% – 61%
                    </div>
                  </div>
                </div>

                {/* Solapur Spatial Map / Morphological Visual Element */}
                <div className="bg-surface-container rounded-xl overflow-hidden shadow-sm border border-outline-variant/30">
                  <div className="w-full h-64 bg-surface-container-high relative flex flex-col justify-end p-space-md text-on-primary">
                    <div className="bg-surface-container-lowest/95 backdrop-blur-sm p-space-sm rounded-lg max-w-md text-on-surface space-y-space-xs border border-outline-variant/30">
                      <span className="font-caption-caps text-caption-caps uppercase text-secondary block font-semibold">
                        GIS Bounding Coordinate Polygon
                      </span>
                      <p className="font-label-code text-label-code text-on-surface">
                        Bounding Box: [17.6212°N, 75.8450°E] to [17.7120°N, 75.9625°E] • Elevation: 458m – 483m MSL
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: Synthetic Data Generation & Simulation Models */}
            <section className="space-y-space-md" id="synthetic-engine">
              <div className="flex items-center gap-space-sm">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-code text-label-code flex items-center justify-center font-bold">03</span>
                <h2 className="font-headline-lg text-headline-lg text-primary font-semibold">Synthetic Data Generation &amp; Simulation Models</h2>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg border border-outline-variant/30">
                
                {/* MANDATORY SCIENTIFIC TRANSPARENCY CALLOUT */}
                <div className="bg-surface-container-high rounded-xl p-space-md shadow-sm space-y-space-xs border-l-4 border-l-primary-container">
                  <div className="flex items-center gap-space-sm text-primary">
                    <span className="material-symbols-outlined text-[20px]">science</span>
                    <span className="font-caption-caps text-caption-caps uppercase tracking-wider font-semibold">
                      Academic Simulation Notice • Epistemic Integrity
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface leading-relaxed">
                    All <strong>150,000 microclimate observations</strong> within the HeatShield database are computationally generated using calibrated <strong>Weather Research and Forecasting (WRF)</strong> urban canopy parameterizations paired with semi-empirical thermal inertia models. They represent synthetic computational simulations for urban planning research, comparative policy intervention simulations, and algorithmic resilience benchmarking—not real-time physical telemetry.
                  </p>
                </div>

                {/* Mathematical Formulation Module */}
                <div className="space-y-space-sm">
                  <span className="font-caption-caps text-caption-caps uppercase text-outline tracking-wider block font-semibold">
                    Mathematical Modeling Formulations
                  </span>
                  <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-md">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-xs">
                      <div>
                        <span className="font-headline-md text-headline-md text-primary font-semibold">Urban Heat Island (UHI) Intensity Formulation</span>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Calculated at 15-minute discrete time-steps across all 100 spatial grid cells.</p>
                      </div>
                      <span className="font-label-code text-label-code px-space-sm py-1 rounded bg-surface-container-highest text-on-surface font-semibold">Eq. (1.4a)</span>
                    </div>

                    {/* Equation Display Box */}
                    <div className="bg-surface-container-lowest rounded-lg p-space-md flex flex-col items-center justify-center text-center space-y-space-xs border border-outline-variant/30">
                      <div className="font-label-metric text-[18px] text-primary font-bold tracking-wide py-2">
                        ΔT<sub>UHI</sub>(t, i) = T<sub>urban_canopy</sub>(t, i) − T<sub>rural_reference</sub>(t)
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
                        Where <span className="font-label-code text-label-code text-on-surface">T<sub>urban_canopy</sub>(t, i)</span> represents the simulated 2m air temperature at station node <span className="font-label-code text-label-code">i</span>, parameterized by local anthropogenic heat flux (<span className="font-label-code text-label-code">Q<sub>F</sub></span>), surface albedo (α), and sky view factor (<span className="font-label-code text-label-code">ψ<sub>sky</sub></span>); and <span className="font-label-code text-label-code">T<sub>rural_reference</sub></span> denotes the baseline peri-urban ambient temperature at Kegaon station.
                      </p>
                    </div>

                    {/* Subsidiary Equation: Energy Balance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
                      <div className="bg-surface-container rounded-lg p-space-sm space-y-space-xs">
                        <span className="font-caption-caps text-caption-caps uppercase text-outline font-semibold">Surface Energy Budget</span>
                        <div className="font-label-code text-label-code text-primary font-bold">R<sub>n</sub> + Q<sub>F</sub> = H + λE + G</div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Solves net radiation (<span className="font-label-code text-label-code">R<sub>n</sub></span>), sensible heat (<span className="font-label-code text-label-code">H</span>), latent heat (<span className="font-label-code text-label-code">λE</span>), and subsurface heat storage (<span className="font-label-code text-label-code">G</span>).</p>
                      </div>
                      <div className="bg-surface-container rounded-lg p-space-sm space-y-space-xs">
                        <span className="font-caption-caps text-caption-caps uppercase text-outline font-semibold">Cooling Tree Mitigation Factor</span>
                        <div className="font-label-code text-label-code text-secondary font-bold">ΔT<sub>canopy</sub> = −(κ × NDVI<sub>eff</sub> + β × SVF<sub>reduction</sub>)</div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Empirical attenuation constant calibrated to neem (Azadirachta indica) and banyan roadside canopies.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: Urban Heat Indicators & Risk Thresholds */}
            <section className="space-y-space-md" id="thermal-indices">
              <div className="flex items-center gap-space-sm">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-code text-label-code flex items-center justify-center font-bold">04</span>
                <h2 className="font-headline-lg text-headline-lg text-primary font-semibold">Urban Heat Indicators &amp; Risk Thresholds</h2>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-outline-variant/30">
                <p className="font-body-md text-body-md text-on-surface leading-relaxed max-w-prose">
                  The monitoring pipeline maps thermal strain using three standardized bioclimatic and remote-sensing indices. The metrics cross-reference physiological stress markers defined by ISO 7243 and IMD heat action directives.
                </p>

                {/* Scientific Ledger Table */}
                <div className="overflow-x-auto rounded-xl bg-surface-container-low shadow-sm border border-outline-variant/30">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead>
                      <tr className="bg-surface-container text-on-surface font-caption-caps text-caption-caps uppercase">
                        <th className="py-space-sm px-space-md font-semibold">Indicator Metric</th>
                        <th className="py-space-sm px-space-md font-semibold">Sensor / Simulation Source</th>
                        <th className="py-space-sm px-space-md font-semibold">Nominal Normal</th>
                        <th className="py-space-sm px-space-md font-semibold">Moderate Risk</th>
                        <th className="py-space-sm px-space-md font-semibold">Extreme Thermal Stress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container">
                      <tr className="hover:bg-surface-container/60 transition-colors">
                        <td className="py-3 px-space-md font-medium text-on-surface">
                          <div className="font-headline-md text-[14px] font-semibold">WBGT Index</div>
                          <span className="font-caption-caps text-caption-caps text-outline uppercase">Wet-Bulb Globe Temp</span>
                        </td>
                        <td className="py-3 px-space-md font-label-code text-label-code text-on-surface-variant">
                          Liljegren approximation algorithm
                        </td>
                        <td className="py-3 px-space-md font-label-metric text-label-metric text-secondary font-bold">
                          &lt; 28.0 °C
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="inline-block px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-metric text-label-metric font-semibold">
                            28.0 – 31.9 °C
                          </span>
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="inline-block px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-metric text-label-metric font-semibold">
                            ≥ 32.0 °C
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container/60 transition-colors">
                        <td className="py-3 px-space-md font-medium text-on-surface">
                          <div className="font-headline-md text-[14px] font-semibold">LST Radiance</div>
                          <span className="font-caption-caps text-caption-caps text-outline uppercase">Land Surface Temp</span>
                        </td>
                        <td className="py-3 px-space-md font-label-code text-label-code text-on-surface-variant">
                          Landsat 8/9 TIRS (Band 10) split-window
                        </td>
                        <td className="py-3 px-space-md font-label-metric text-label-metric text-secondary font-bold">
                          &lt; 38.5 °C
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="inline-block px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-metric text-label-metric font-semibold">
                            38.5 – 43.0 °C
                          </span>
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="inline-block px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-metric text-label-metric font-semibold">
                            &gt; 43.0 °C
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container/60 transition-colors">
                        <td className="py-3 px-space-md font-medium text-on-surface">
                          <div className="font-headline-md text-[14px] font-semibold">NDVI Green Fraction</div>
                          <span className="font-caption-caps text-caption-caps text-outline uppercase">Normalized Veg. Index</span>
                        </td>
                        <td className="py-3 px-space-md font-label-code text-label-code text-on-surface-variant">
                          Sentinel-2 MSI Red/NIR Ortho (10m)
                        </td>
                        <td className="py-3 px-space-md font-label-metric text-label-metric text-secondary font-bold">
                          &gt; 0.40 (High)
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="inline-block px-space-xs py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-metric text-label-metric font-semibold">
                            0.20 – 0.40
                          </span>
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="inline-block px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-metric text-label-metric font-semibold">
                            &lt; 0.20 (Critical Sparse)
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-surface-container/60 transition-colors">
                        <td className="py-3 px-space-md font-medium text-on-surface">
                          <div className="font-headline-md text-[14px] font-semibold">Diurnal Cooling Delta</div>
                          <span className="font-caption-caps text-caption-caps text-outline uppercase">Night Decay Rate (ΔT<sub>decay</sub>)</span>
                        </td>
                        <td className="py-3 px-space-md font-label-code text-label-code text-on-surface-variant">
                          Newtonian cooling relaxation fits
                        </td>
                        <td className="py-3 px-space-md font-label-metric text-label-metric text-secondary font-bold">
                          &gt; 1.8 °C/hr
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="inline-block px-space-xs py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-metric text-label-metric font-semibold">
                            1.0 – 1.8 °C/hr
                          </span>
                        </td>
                        <td className="py-3 px-space-md">
                          <span className="inline-block px-space-xs py-0.5 rounded bg-error-container text-on-error-container font-label-metric text-label-metric font-semibold">
                            &lt; 1.0 °C/hr (Stagnant)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex items-start gap-space-sm text-on-surface-variant font-body-sm text-body-sm pt-space-xs">
                  <span className="material-symbols-outlined text-[16px] text-secondary mt-0.5">info</span>
                  <p>
                    Extreme thermal stress represents criteria where sustained outdoor labour warrants mandatory hydration interventions and localized cool-corridor access according to the Solapur District Disaster Management Authority (DDMA) protocols.
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 5: Technical Stack & Open Source Architecture */}
            <section className="space-y-space-md" id="architecture">
              <div className="flex items-center gap-space-sm">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-code text-label-code flex items-center justify-center font-bold">05</span>
                <h2 className="font-headline-lg text-headline-lg text-primary font-semibold">Technical Stack &amp; Open Source Architecture</h2>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-lg border border-outline-variant/30">
                <p className="font-body-md text-body-md text-on-surface leading-relaxed max-w-prose">
                  The system operates as a modular decoupled pipeline constructed strictly on open scientific toolchains. The repository maintains complete determinism and reproducibility for peer researchers.
                </p>

                {/* Technical Pipeline Architecture Flow Diagram */}
                <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm space-y-space-md">
                  <span className="font-caption-caps text-caption-caps uppercase text-outline tracking-wider block font-semibold">
                    End-to-End Computational Pipeline
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-space-sm relative">
                    {/* Step 1 */}
                    <div className="bg-surface-container-lowest rounded-xl p-space-md space-y-space-xs shadow-sm flex flex-col justify-between border border-outline-variant/20">
                      <div className="space-y-space-xs">
                        <div className="w-7 h-7 rounded bg-primary-container text-on-primary flex items-center justify-center font-label-code text-label-code font-semibold">01</div>
                        <span className="font-caption-caps text-caption-caps uppercase text-secondary font-bold">Data Ingest &amp; Sim</span>
                        <h4 className="font-headline-md text-[15px] text-on-surface font-semibold">WRF Simulation Core</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Calibrated diurnal boundary models, solar elevation ephemeris, albedo coefficients.</p>
                      </div>
                      <div className="pt-space-sm font-label-code text-label-code text-outline border-t border-outline-variant/20">
                        Python • NumPy • Pandas
                      </div>
                    </div>
                    {/* Step 2 */}
                    <div className="bg-surface-container-lowest rounded-xl p-space-md space-y-space-xs shadow-sm flex flex-col justify-between border border-outline-variant/20">
                      <div className="space-y-space-xs">
                        <div className="w-7 h-7 rounded bg-primary-container text-on-primary flex items-center justify-center font-label-code text-label-code font-semibold">02</div>
                        <span className="font-caption-caps text-caption-caps uppercase text-secondary font-bold">Spatial Projection</span>
                        <h4 className="font-headline-md text-[15px] text-on-surface font-semibold">GIS Vector Aggregator</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Solapur ward topologies, administrative boundaries, and raster interpolation.</p>
                      </div>
                      <div className="pt-space-sm font-label-code text-label-code text-outline border-t border-outline-variant/20">
                        Leaflet • GeoJSON • GDAL
                      </div>
                    </div>
                    {/* Step 3 */}
                    <div className="bg-surface-container-lowest rounded-xl p-space-md space-y-space-xs shadow-sm flex flex-col justify-between border border-outline-variant/20">
                      <div className="space-y-space-xs">
                        <div className="w-7 h-7 rounded bg-primary-container text-on-primary flex items-center justify-center font-label-code text-label-code font-semibold">03</div>
                        <span className="font-caption-caps text-caption-caps uppercase text-secondary font-bold">Analytical Client</span>
                        <h4 className="font-headline-md text-[15px] text-on-surface font-semibold">Interactive Interface</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Sub-second parametric querying, diurnal scrubbers, and heat mitigation testbenches.</p>
                      </div>
                      <div className="pt-space-sm font-label-code text-label-code text-outline border-t border-outline-variant/20">
                        React • Vite • Tailwind
                      </div>
                    </div>
                    {/* Step 4 */}
                    <div className="bg-surface-container-lowest rounded-xl p-space-md space-y-space-xs shadow-sm flex flex-col justify-between border border-outline-variant/20">
                      <div className="space-y-space-xs">
                        <div className="w-7 h-7 rounded bg-primary-container text-on-primary flex items-center justify-center font-label-code text-label-code font-semibold">04</div>
                        <span className="font-caption-caps text-caption-caps uppercase text-secondary font-bold">Decision Support</span>
                        <h4 className="font-headline-md text-[15px] text-on-surface font-semibold">Cooling Engine</h4>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">Spatial prioritization, cool roof albedo optimization, and canopy expansion ROI models.</p>
                      </div>
                      <div className="pt-space-sm font-label-code text-label-code text-outline border-t border-outline-variant/20">
                        TF-141 Micro-Sim Engine
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: Citation & Authors */}
            <section className="space-y-space-md" id="provenance">
              <div className="flex items-center gap-space-sm">
                <span className="w-6 h-6 rounded-full bg-primary text-on-primary font-label-code text-label-code flex items-center justify-center font-bold">06</span>
                <h2 className="font-headline-lg text-headline-lg text-primary font-semibold">Citation &amp; Academic Provenance</h2>
              </div>
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm space-y-space-md border border-outline-variant/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-primary font-semibold mb-1">Research Group TF-141</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                      Department of Computer Science &amp; Engineering<br />
                      MIT Vishwaprayag University, Solapur, Maharashtra, India
                    </p>
                    <div className="mt-3 space-y-1 font-body-sm text-body-sm">
                      <p><strong className="text-on-surface">Furqan Bagwan</strong> — Geospatial Modeling &amp; Architecture</p>
                      <p><strong className="text-on-surface">Aman Shaikh</strong> — Database Systems &amp; Ingestion Engine</p>
                      <p><strong className="text-on-surface">Bhavin Shankur</strong> — Computational UI/UX &amp; Microclimate Analytics</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between pb-1">
                      <span className="font-caption-caps text-caption-caps uppercase text-outline font-semibold">BibTeX Citation</span>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(bibtex);
                          alert('BibTeX citation copied to clipboard!');
                        }}
                        className="font-label-code text-[11px] text-secondary hover:underline"
                      >
                        Copy Citation
                      </button>
                    </div>
                    <pre className="bg-surface-container-low p-space-sm rounded-lg font-label-code text-[11px] text-on-surface overflow-x-auto leading-relaxed border border-outline-variant/20">
                      {bibtex}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

          </article>
        </div>
      </div>
    </div>
  );
}
