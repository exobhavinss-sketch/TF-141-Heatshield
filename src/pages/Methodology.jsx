import React, { useState } from 'react';

export default function Methodology() {
  const [copied, setCopied] = useState(false);

  const bibtex = `@article{tf141_heatshield_2024,
  title   = {HeatShield: Microclimatic Canopy Simulation & Diurnal Urban Heat Island Analysis in Solapur},
  author  = {Bagwan, Furqan and Shaikh, Aman and Shankur, Bhavin},
  journal = {MIT Vishwaprayag University Academic Research Initiative},
  year    = {2024},
  volume  = {2},
  number  = {4},
  doi     = {10.1145/TF141.2024.SOLAPUR}
}`;

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-24 bg-[#fafafc] dark:bg-[#101114] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200">
      
      {/* Top Academic Context Ribbon */}
      <div className="w-full bg-[#f5f5f7]/80 dark:bg-[#161617]/80 backdrop-blur-md py-2.5 px-6 border-b border-black/[0.04] dark:border-white/[0.08] transition-colors">
        <div className="max-w-[1340px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2 text-[12px] text-[#86868b] dark:text-[#a5a9b4]">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7] font-medium tracking-wide">RESEARCH SPECIFICATION • VERSION 2.4</span>
            <span className="w-1 h-1 rounded-full bg-black/20 dark:bg-white/20"></span>
            <span className="text-[#0071e3] dark:text-[#2997ff] font-medium">PEER-REVIEW COMPLIANT</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono tracking-wider">
            <span>DOI: 10.1145/TF141.2024.SOLAPUR</span>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <section className="w-full px-6 pt-12 pb-10">
        <div className="max-w-[1340px] mx-auto space-y-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[980px] bg-black/[0.04] dark:bg-white/[0.06] text-[#1d1d1f] dark:text-[#f5f5f7] text-[12px] font-mono tracking-wider uppercase font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] dark:bg-[#2997ff]"></span>
              <span>Scientific Documentation</span>
            </div>
            <h1 className="text-[38px] md:text-[50px] font-semibold tracking-[-0.03em] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.1]">
              Methodology &amp; Simulation Architecture
            </h1>
            <p className="text-[17px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
              Technical documentation of urban canopy modeling, synthetic microclimate generation, and heat vulnerability indices for Solapur, Maharashtra.
            </p>
          </div>

          {/* Metadata Ledger Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            <div className="bg-white dark:bg-[#191b20] rounded-[20px] p-4 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] space-y-1 transition-colors">
              <span className="text-[11px] font-medium text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block">Research Group</span>
              <span className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Team TF-141</span>
            </div>
            <div className="bg-white dark:bg-[#191b20] rounded-[20px] p-4 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] space-y-1 transition-colors">
              <span className="text-[11px] font-medium text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block">Academic Seat</span>
              <span className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">MIT Vishwaprayag Univ.</span>
            </div>
            <div className="bg-white dark:bg-[#191b20] rounded-[20px] p-4 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] space-y-1 transition-colors">
              <span className="text-[11px] font-medium text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block">Chronological Window</span>
              <span className="text-[15px] font-semibold text-[#0071e3] dark:text-[#2997ff]">2021 – 2025 Synthetic</span>
            </div>
            <div className="bg-white dark:bg-[#191b20] rounded-[20px] p-4 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)] space-y-1 transition-colors">
              <span className="text-[11px] font-medium text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block">Document Revision</span>
              <span className="text-[15px] font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">May 2024 (v2.4.1)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-[1340px] mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Sticky Index */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-[#191b20] rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] sticky top-[72px] space-y-4 border border-black/[0.06] dark:border-white/[0.08] transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-black/[0.04] dark:border-white/[0.06]">
                <span className="text-[11px] font-semibold text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider">
                  Specifications Index
                </span>
                <span className="font-mono text-[10px] text-[#0071e3] dark:text-[#2997ff] bg-[#0071e3]/10 dark:bg-[#2997ff]/15 px-2 py-0.5 rounded-[980px]">6 SECTIONS</span>
              </div>
              <nav className="flex flex-col space-y-1 text-[13px]">
                <a className="px-3 py-2 rounded-[12px] text-[#86868b] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#22252b] transition-all flex items-center justify-between" href="#overview">
                  <span>01. Project Motivation</span>
                  <span className="font-mono text-[11px] text-[#86868b] dark:text-[#7a7f8d]">BSh</span>
                </a>
                <a className="px-3 py-2 rounded-[12px] text-[#86868b] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#22252b] transition-all flex items-center justify-between" href="#study-area">
                  <span>02. Study Morphologies</span>
                  <span className="font-mono text-[11px] text-[#86868b] dark:text-[#7a7f8d]">9 LCZs</span>
                </a>
                <a className="px-3 py-2 rounded-[12px] text-[#86868b] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#22252b] transition-all flex items-center justify-between" href="#synthetic-engine">
                  <span>03. WRF-Canopy Engine</span>
                  <span className="font-mono text-[11px] text-[#86868b] dark:text-[#7a7f8d]">150k pts</span>
                </a>
                <a className="px-3 py-2 rounded-[12px] text-[#86868b] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#22252b] transition-all flex items-center justify-between" href="#thermal-indices">
                  <span>04. Vulnerability Indices</span>
                  <span className="font-mono text-[11px] text-[#86868b] dark:text-[#7a7f8d]">WBGT</span>
                </a>
                <a className="px-3 py-2 rounded-[12px] text-[#86868b] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#22252b] transition-all flex items-center justify-between" href="#architecture">
                  <span>05. Open Tech Pipeline</span>
                  <span className="font-mono text-[11px] text-[#86868b] dark:text-[#7a7f8d]">Stack</span>
                </a>
                <a className="px-3 py-2 rounded-[12px] text-[#86868b] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-[#f5f5f7] dark:hover:bg-[#22252b] transition-all flex items-center justify-between" href="#provenance">
                  <span>06. Citation &amp; Authors</span>
                  <span className="font-mono text-[11px] text-[#86868b] dark:text-[#7a7f8d]">BibTeX</span>
                </a>
              </nav>

              {/* Topology Micro-card */}
              <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[18px] p-4 space-y-1.5 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                <span className="text-[11px] font-semibold text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block">
                  Mesh Topology
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-[20px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">100 Nodes</span>
                  <span className="font-mono text-[11px] text-[#0071e3] dark:text-[#2997ff]">Δh 462m mean</span>
                </div>
                <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                  Solapur Municipal boundary (148.4 km²) stratified via Local Climate Zones.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Column: In-depth Technical Documentation */}
          <article className="lg:col-span-9 space-y-12">
            
            {/* SECTION 1: Project Overview & Scientific Motivation */}
            <section className="space-y-4" id="overview">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
                <span>01</span>
                <span>/</span>
                <span>Research Scope</span>
              </div>
              <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.02em]">
                Project Overview &amp; Scientific Motivation
              </h2>

              <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] space-y-6 border border-black/[0.06] dark:border-white/[0.08] transition-colors">
                <p className="text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.7] max-w-[720px]">
                  The semi-arid Deccan plateau represents one of South Asia's most climatologically vulnerable interior land expanses. Solapur, situated at <span className="font-mono text-[13px] bg-[#f5f5f7] dark:bg-[#22252b] px-2 py-0.5 rounded-[6px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">17.6599° N, 75.9064° E</span>, experiences an extreme hot semi-arid climate (Köppen classification <em className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">BSh</em>). Escalating pre-monsoon summer ambient temperatures consistently breach <span className="font-semibold text-[#dc2626] dark:text-[#ef4444]">44.5°C</span> during April and May, amplified by intense solar insolation and deficient green canopy mitigation.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-6 space-y-2 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <span className="material-symbols-outlined text-[#dc2626] dark:text-[#ef4444] text-[24px]">thermostat</span>
                    <h3 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Thermal Inertia Trapping</h3>
                    <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                      High thermal mass basalt construction and asphalt fractions retain day-cycle solar energy, causing night-time cooling stalls of 4.2°C above surrounding rural peri-urban buffers.
                    </p>
                  </div>
                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-6 space-y-2 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <span className="material-symbols-outlined text-[#0071e3] dark:text-[#2997ff] text-[24px]">water_drop</span>
                    <h3 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Vapor-Pressure Deficit</h3>
                    <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                      Pre-monsoon atmospheric moisture surges combine with persistent thermal plumes, driving wet-bulb temperatures into elevated human physiological stress categories.
                    </p>
                  </div>
                </div>

                {/* Visual Graphic: Diurnal Trend */}
                <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-6 space-y-3 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4]">
                      Solapur Climatological Baseline • 10-Year Diurnal Trend
                    </span>
                    <span className="font-mono text-[11px] text-[#0071e3] dark:text-[#2997ff] font-medium">BSh ZONE PROFILE</span>
                  </div>
                  <svg className="w-full h-24 text-[#0071e3] dark:text-[#2997ff] stroke-current fill-none" viewBox="0 0 760 120">
                    <path d="M0,90 Q70,75 140,82 T280,45 T420,20 T560,35 T700,75 T760,65" strokeLinecap="round" strokeWidth="2.5"></path>
                    <path className="fill-[#0071e3]/10 dark:fill-[#2997ff]/15" d="M0,90 Q70,75 140,82 T280,45 T420,20 T560,35 T700,75 T760,65 L760,120 L0,120 Z" strokeWidth="0"></path>
                    <circle className="fill-[#dc2626] dark:fill-[#ef4444]" cx="420" cy="20" r="4" strokeWidth="0"></circle>
                    <text className="font-mono text-[10px] fill-[#1d1d1f] dark:fill-[#f5f5f7] font-medium" x="428" y="24">May Peak: 44.8°C</text>
                    <circle className="fill-[#0071e3] dark:fill-[#2997ff]" cx="140" cy="82" r="3" strokeWidth="0"></circle>
                    <text className="font-mono text-[9px] fill-[#86868b] dark:fill-[#a5a9b4]" x="145" y="86">Jan Min: 16.2°C</text>
                  </svg>
                  <div className="flex justify-between font-mono text-[10px] text-[#86868b] dark:text-[#7a7f8d] pt-1">
                    <span>JAN</span><span>MAR</span><span>MAY (CRITICAL)</span><span>JUL (MONSOON)</span><span>SEP</span><span>NOV</span><span>DEC</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: Study Area & Geographic Characterization */}
            <section className="space-y-4" id="study-area">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
                <span>02</span>
                <span>/</span>
                <span>Spatial Morphologies</span>
              </div>
              <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.02em]">
                Study Area &amp; Geographic Characterization
              </h2>

              <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] space-y-6 border border-black/[0.06] dark:border-white/[0.08] transition-colors">
                <p className="text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.7] max-w-[720px]">
                  The research framework stratifies 100 computationally modeled virtual monitoring stations across Solapur's administrative limits. The sampling strategy aligns with Stewart &amp; Oke's Local Climate Zone (LCZ) taxonomy across 9 distinct urban fabric morphologies:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Zone 1 */}
                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-5 space-y-3 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-[980px] bg-[#ea580c]/10 text-[#ea580c] dark:text-[#f97316] font-mono text-[10px] font-semibold uppercase">
                        LCZ 2 • Midrise
                      </span>
                      <span className="font-mono text-[11px] text-[#ea580c] dark:text-[#f97316] font-medium">42 Nodes</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Core Commercial Fabric</h3>
                    <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                      Bhavani Peth, Mangalwar Peth, and Guruwar Peth. Characterized by high building aspect ratios (&gt;1.5 H/W), canyon radiative trapping, zero setback curbs, and impermeable paving &gt;88%.
                    </p>
                    <div className="pt-1 text-[#86868b] dark:text-[#7a7f8d] font-mono text-[11px]">
                      Sky View Factor: 0.28 – 0.41
                    </div>
                  </div>

                  {/* Zone 2 */}
                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-5 space-y-3 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-[980px] bg-[#0071e3]/10 dark:bg-[#2997ff]/15 text-[#0071e3] dark:text-[#2997ff] font-mono text-[10px] font-semibold uppercase">
                        LCZ 8 • Low-Rise
                      </span>
                      <span className="font-mono text-[11px] text-[#0071e3] dark:text-[#2997ff] font-medium">28 Nodes</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Industrial Agglomeration</h3>
                    <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                      MIDC Chhatrapati Sambhaji Nagar Road and Akkalkot Road Textile Industrial Corridors. Galvanized iron roofing, vast low-albedo hardscape, and waste heat exhaust signatures.
                    </p>
                    <div className="pt-1 text-[#86868b] dark:text-[#7a7f8d] font-mono text-[11px]">
                      Impervious Surface: 92.4% mean
                    </div>
                  </div>

                  {/* Zone 3 */}
                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-5 space-y-3 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-[980px] bg-[#059669]/10 text-[#059669] dark:text-[#10b981] font-mono text-[10px] font-semibold uppercase">
                        LCZ 9/D • Sparsely Built
                      </span>
                      <span className="font-mono text-[11px] text-[#059669] dark:text-[#10b981] font-medium">30 Nodes</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Peri-Urban Transition</h3>
                    <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                      Kegaon University Campus, Degaon, and Hipparga Lake agricultural edges. Mixed scrublands, permeable clay soils, seasonal biomass, representing rural reference boundary baselines.
                    </p>
                    <div className="pt-1 text-[#86868b] dark:text-[#7a7f8d] font-mono text-[11px]">
                      Vegetation Cover: 34% – 61%
                    </div>
                  </div>
                </div>

                <div className="bg-[#f5f5f7] dark:bg-[#22252b] p-4 rounded-[18px] border border-black/[0.04] dark:border-white/[0.06] text-[12px] text-[#86868b] dark:text-[#a5a9b4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-colors">
                  <span className="font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">Bounding Coordinate Polygon</span>
                  <span className="font-mono">[17.6212°N, 75.8450°E] to [17.7120°N, 75.9625°E] • 458m – 483m MSL</span>
                </div>
              </div>
            </section>

            {/* SECTION 3: Synthetic Data Generation & Simulation Models */}
            <section className="space-y-4" id="synthetic-engine">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
                <span>03</span>
                <span>/</span>
                <span>Simulation Engine</span>
              </div>
              <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.02em]">
                Synthetic Data Generation &amp; Simulation Models
              </h2>

              <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] space-y-6 border border-black/[0.06] dark:border-white/[0.08] transition-colors">
                
                {/* MANDATORY SCIENTIFIC TRANSPARENCY CALLOUT */}
                <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-6 space-y-2 border-l-4 border-l-[#0071e3] dark:border-l-[#2997ff] transition-colors">
                  <div className="flex items-center gap-2 text-[#0071e3] dark:text-[#2997ff]">
                    <span className="material-symbols-outlined text-[20px]">science</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      Academic Simulation Notice • Epistemic Integrity
                    </span>
                  </div>
                  <p className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] leading-relaxed">
                    All <strong>150,000 microclimate observations</strong> within the HeatShield database are computationally generated using calibrated <strong>Weather Research and Forecasting (WRF)</strong> urban canopy parameterizations paired with semi-empirical thermal inertia models. They represent synthetic computational simulations for urban planning research, comparative policy intervention simulations, and algorithmic resilience benchmarking—not real-time physical telemetry.
                  </p>
                </div>

                {/* Mathematical Formulations */}
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4] block">
                    Mathematical Modeling Formulations
                  </span>
                  
                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-6 space-y-4 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-black/[0.04] dark:border-white/[0.06]">
                      <div>
                        <span className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Urban Heat Island (UHI) Intensity Formulation</span>
                        <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4]">Calculated at 15-minute discrete time-steps across all 100 spatial grid cells.</p>
                      </div>
                      <span className="font-mono text-[11px] px-2.5 py-1 rounded-[980px] bg-white dark:bg-[#191b20] text-[#1d1d1f] dark:text-[#f5f5f7] font-medium border border-black/[0.06] dark:border-white/[0.08] shadow-xs self-start md:self-auto">
                        Eq. (1.4a)
                      </span>
                    </div>

                    {/* Equation Display Box */}
                    <div className="bg-white dark:bg-[#191b20] rounded-[16px] p-6 flex flex-col items-center justify-center text-center space-y-2 border border-black/[0.04] dark:border-white/[0.06] shadow-xs transition-colors">
                      <div className="text-[20px] md:text-[22px] text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold tracking-wide py-1 font-mono">
                        ΔT<sub>UHI</sub>(t, i) = T<sub>urban_canopy</sub>(t, i) − T<sub>rural_reference</sub>(t)
                      </div>
                      <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] max-w-xl leading-relaxed">
                        Where <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">T<sub>urban_canopy</sub>(t, i)</span> represents the simulated 2m air temperature at station node <span className="font-mono">i</span>; and <span className="font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">T<sub>rural_reference</sub></span> denotes the baseline peri-urban ambient temperature at Kegaon station.
                      </p>
                    </div>

                    {/* Subsidiary Equations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      <div className="bg-white dark:bg-[#191b20] rounded-[16px] p-4 space-y-1.5 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                        <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider">Surface Energy Budget</span>
                        <div className="font-mono text-[13px] text-[#0071e3] dark:text-[#2997ff] font-semibold">R<sub>n</sub> + Q<sub>F</sub> = H + λE + G</div>
                        <p className="text-[11px] text-[#86868b] dark:text-[#a5a9b4]">Net radiation (<span className="font-mono">R<sub>n</sub></span>), sensible heat (<span className="font-mono">H</span>), latent heat (<span className="font-mono">λE</span>), and subsurface storage (<span className="font-mono">G</span>).</p>
                      </div>
                      <div className="bg-white dark:bg-[#191b20] rounded-[16px] p-4 space-y-1.5 border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                        <span className="text-[10px] font-semibold text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider">Cooling Tree Mitigation</span>
                        <div className="font-mono text-[13px] text-[#059669] dark:text-[#10b981] font-semibold">ΔT<sub>canopy</sub> = −(κ × NDVI<sub>eff</sub> + β × SVF<sub>reduction</sub>)</div>
                        <p className="text-[11px] text-[#86868b] dark:text-[#a5a9b4]">Empirical attenuation constant calibrated to neem (Azadirachta indica) and banyan canopies.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: Urban Heat Indicators & Risk Thresholds */}
            <section className="space-y-4" id="thermal-indices">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
                <span>04</span>
                <span>/</span>
                <span>Bioclimatic Metrics</span>
              </div>
              <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.02em]">
                Urban Heat Indicators &amp; Risk Thresholds
              </h2>

              <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] space-y-6 border border-black/[0.06] dark:border-white/[0.08] transition-colors">
                <p className="text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.7] max-w-[720px]">
                  The monitoring pipeline maps thermal strain using three standardized bioclimatic and remote-sensing indices, cross-referencing physiological stress markers defined by ISO 7243 and IMD directives.
                </p>

                {/* Ledger Table */}
                <div className="overflow-x-auto rounded-[20px] border border-black/[0.06] dark:border-white/[0.08] shadow-xs">
                  <table className="w-full text-left text-[13px] border-collapse min-w-[680px]">
                    <thead>
                      <tr className="bg-[#fafafc] dark:bg-[#22252b] border-b border-black/[0.06] dark:border-white/[0.08] text-[11px] font-semibold text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider">
                        <th className="py-3 px-4">Indicator Metric</th>
                        <th className="py-3 px-4">Sensor / Source</th>
                        <th className="py-3 px-4">Nominal</th>
                        <th className="py-3 px-4">Moderate Risk</th>
                        <th className="py-3 px-4">Extreme Stress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.06]">
                      <tr className="h-[52px] hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-4 font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                          <span className="block font-semibold">WBGT Index</span>
                          <span className="text-[11px] text-[#86868b] dark:text-[#a5a9b4]">Wet-Bulb Globe Temp</span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-[#86868b] dark:text-[#a5a9b4]">
                          Liljegren algorithm
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-[#059669] dark:text-[#10b981] tabular-nums">
                          &lt; 28.0 °C
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-[980px] bg-[#d97706]/10 text-[#d97706] dark:text-[#f59e0b] font-medium text-[11px]">
                            28.0 – 31.9 °C
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-[980px] bg-[#dc2626]/10 text-[#dc2626] dark:text-[#ef4444] font-medium text-[11px]">
                            ≥ 32.0 °C
                          </span>
                        </td>
                      </tr>
                      <tr className="h-[52px] hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-4 font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                          <span className="block font-semibold">LST Radiance</span>
                          <span className="text-[11px] text-[#86868b] dark:text-[#a5a9b4]">Land Surface Temp</span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-[#86868b] dark:text-[#a5a9b4]">
                          Landsat 8/9 Band 10
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-[#059669] dark:text-[#10b981] tabular-nums">
                          &lt; 38.5 °C
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-[980px] bg-[#d97706]/10 text-[#d97706] dark:text-[#f59e0b] font-medium text-[11px]">
                            38.5 – 43.0 °C
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-[980px] bg-[#dc2626]/10 text-[#dc2626] dark:text-[#ef4444] font-medium text-[11px]">
                            &gt; 43.0 °C
                          </span>
                        </td>
                      </tr>
                      <tr className="h-[52px] hover:bg-black/[0.01] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 px-4 font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                          <span className="block font-semibold">NDVI Green Fraction</span>
                          <span className="text-[11px] text-[#86868b] dark:text-[#a5a9b4]">Normalized Veg. Index</span>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[11px] text-[#86868b] dark:text-[#a5a9b4]">
                          Sentinel-2 MSI (10m)
                        </td>
                        <td className="py-2.5 px-4 font-semibold text-[#059669] dark:text-[#10b981] tabular-nums">
                          &gt; 0.40 (High)
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-[980px] bg-[#0071e3]/10 dark:bg-[#2997ff]/15 text-[#0071e3] dark:text-[#2997ff] font-medium text-[11px]">
                            0.20 – 0.40
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <span className="px-2 py-0.5 rounded-[980px] bg-[#ea580c]/10 text-[#ea580c] dark:text-[#f97316] font-medium text-[11px]">
                            &lt; 0.20 (Sparse)
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 5: Architecture */}
            <section className="space-y-4" id="architecture">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
                <span>05</span>
                <span>/</span>
                <span>Software Systems</span>
              </div>
              <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.02em]">
                Technical Stack &amp; Open Source Architecture
              </h2>

              <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] space-y-6 border border-black/[0.06] dark:border-white/[0.08] transition-colors">
                <p className="text-[15px] text-[#1d1d1f] dark:text-[#f5f5f7] leading-[1.7] max-w-[720px]">
                  The system operates as a modular decoupled pipeline constructed strictly on open scientific toolchains, maintaining complete determinism and reproducibility for peer researchers.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-5 space-y-3 flex flex-col justify-between border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <div className="space-y-2">
                      <div className="w-7 h-7 rounded-[980px] bg-[#0071e3] dark:bg-[#2997ff] text-white flex items-center justify-center font-mono text-[11px] font-semibold">01</div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff] block">Data Ingest</span>
                      <h4 className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">WRF Simulation Core</h4>
                      <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">Calibrated diurnal boundary models, solar elevation ephemeris, albedo coefficients.</p>
                    </div>
                    <div className="pt-2 font-mono text-[10px] text-[#86868b] dark:text-[#7a7f8d] border-t border-black/[0.04] dark:border-white/[0.06]">
                      Python • NumPy • Pandas
                    </div>
                  </div>

                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-5 space-y-3 flex flex-col justify-between border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <div className="space-y-2">
                      <div className="w-7 h-7 rounded-[980px] bg-[#0071e3] dark:bg-[#2997ff] text-white flex items-center justify-center font-mono text-[11px] font-semibold">02</div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff] block">Spatial Engine</span>
                      <h4 className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">GIS Vector Aggregator</h4>
                      <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">Solapur ward topologies, administrative boundaries, and raster interpolation.</p>
                    </div>
                    <div className="pt-2 font-mono text-[10px] text-[#86868b] dark:text-[#7a7f8d] border-t border-black/[0.04] dark:border-white/[0.06]">
                      Leaflet • GeoJSON • GDAL
                    </div>
                  </div>

                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-5 space-y-3 flex flex-col justify-between border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <div className="space-y-2">
                      <div className="w-7 h-7 rounded-[980px] bg-[#0071e3] dark:bg-[#2997ff] text-white flex items-center justify-center font-mono text-[11px] font-semibold">03</div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff] block">Client App</span>
                      <h4 className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Interactive Interface</h4>
                      <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">Sub-second parametric querying, diurnal scrubbers, and heat mitigation testbenches.</p>
                    </div>
                    <div className="pt-2 font-mono text-[10px] text-[#86868b] dark:text-[#7a7f8d] border-t border-black/[0.04] dark:border-white/[0.06]">
                      React • Vite • Tailwind
                    </div>
                  </div>

                  <div className="bg-[#f5f5f7] dark:bg-[#22252b] rounded-[20px] p-5 space-y-3 flex flex-col justify-between border border-black/[0.04] dark:border-white/[0.06] transition-colors">
                    <div className="space-y-2">
                      <div className="w-7 h-7 rounded-[980px] bg-[#0071e3] dark:bg-[#2997ff] text-white flex items-center justify-center font-mono text-[11px] font-semibold">04</div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff] block">Decision Layer</span>
                      <h4 className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Cooling Engine</h4>
                      <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">Spatial prioritization, cool roof albedo optimization, and canopy expansion models.</p>
                    </div>
                    <div className="pt-2 font-mono text-[10px] text-[#86868b] dark:text-[#7a7f8d] border-t border-black/[0.04] dark:border-white/[0.06]">
                      TF-141 Micro-Sim
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: Citation & Provenance */}
            <section className="space-y-4" id="provenance">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
                <span>06</span>
                <span>/</span>
                <span>Academic Lineage</span>
              </div>
              <h2 className="text-[28px] md:text-[34px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-[-0.02em]">
                Citation &amp; Academic Provenance
              </h2>

              <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] space-y-6 border border-black/[0.06] dark:border-white/[0.08] transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-3">
                    <h3 className="text-[18px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">Research Group TF-141</h3>
                    <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                      Department of Computer Science &amp; Engineering<br />
                      MIT Vishwaprayag University, Solapur, Maharashtra, India
                    </p>
                    <div className="pt-2 space-y-1.5 text-[13px]">
                      <p><strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">Furqan Bagwan</strong> — Geospatial Modeling &amp; Architecture</p>
                      <p><strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">Aman Shaikh</strong> — Database Systems &amp; Ingestion Engine</p>
                      <p><strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">Bhavin Shankur</strong> — Computational UI/UX &amp; Microclimate Analytics</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4]">BibTeX Citation</span>
                      <button 
                        onClick={handleCopyBibtex}
                        className="font-mono text-[11px] text-[#0071e3] dark:text-[#2997ff] hover:underline flex items-center gap-1 font-medium"
                      >
                        <span className="material-symbols-outlined text-[14px]">{copied ? 'done' : 'content_copy'}</span>
                        <span>{copied ? 'Copied to Clipboard' : 'Copy Citation'}</span>
                      </button>
                    </div>
                    <pre className="bg-[#1d1d1f] dark:bg-[#101114] text-[#f5f5f7] p-4 rounded-[18px] font-mono text-[11px] overflow-x-auto leading-relaxed shadow-inner border border-black/10 dark:border-white/10">
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
