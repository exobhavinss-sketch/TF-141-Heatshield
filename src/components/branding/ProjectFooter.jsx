import React from 'react';
import { Link } from 'react-router-dom';
import IndianFlag from './IndianFlag';

export default function ProjectFooter({ className = '' }) {
  return (
    <footer className={`w-full bg-[#f5f5f7] dark:bg-[#161617] border-t border-black/[0.06] dark:border-white/[0.08] pt-14 pb-12 text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200 ${className}`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Identity & Watermark */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img
                alt="HeatShield Emblem"
                className="h-6 w-auto object-contain"
                src="/branding/heatshield-icon.svg"
              />
              <span className="text-[17px] text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold tracking-tight">
                HeatShield
              </span>
            </div>
            <p className="text-[13px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed max-w-sm">
              Urban microclimate heat exposure analysis, spatial thermal modeling, and cooling intervention planning engine for Solapur, Maharashtra.
            </p>
            <p className="text-[11px] text-[#86868b] dark:text-[#7a7f8d] uppercase tracking-wider font-mono">
              MIT Vishwaprayag University • Solapur, MH
            </p>
            {/* Required Identity & Watermark */}
            <div className="inline-flex items-center gap-2 pt-1 font-mono text-[11px] text-[#1d1d1f] dark:text-[#f5f5f7]">
              <IndianFlag size="xs" />
              <span className="font-semibold">Made For Indians - Made By Indians</span>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] tracking-wider block font-semibold">
              Platform Navigation
            </span>
            <ul className="space-y-2 text-[13px]">
              <li>
                <Link to="/" className="text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors block">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors block">
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link to="/heat-map" className="text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors block">
                  India Heat Map
                </Link>
              </li>
              <li>
                <Link to="/explore-data" className="text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors block">
                  Data Explorer
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors block">
                  Methodology & Science
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors block">
                  Team & Project
                </Link>
              </li>
              <li>
                <Link to="/submit-reading" className="text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors block">
                  Submit Reading
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors block">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Research & Provenance */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] tracking-wider block font-semibold">
              Research & Provenance
            </span>
            <ul className="space-y-2 text-[13px] text-[#6e6e73] dark:text-[#a5a9b4]">
              <li>Solapur Synthetic Dataset (150,000 pts)</li>
              <li>100 Simulated Sensory Grid Nodes</li>
              <li>Microclimate Thermal Indices (WBGT & LST)</li>
              <li>Urban Tree Canopy Mitigation Models</li>
              <li>Vector GIS WGS84 GeoJSON Spatial Layers</li>
            </ul>
          </div>

          {/* Column 4: Academic Consortium */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase text-[#86868b] dark:text-[#a5a9b4] tracking-wider block font-semibold">
              Academic Course Work
            </span>
            <div className="text-[13px] text-[#6e6e73] dark:text-[#a5a9b4] space-y-1.5 leading-relaxed">
              <p>Combined Academic Term Project (TF-141)</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[10px] font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">FSD-1</span>
                <span className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[10px] font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">DBMS</span>
                <span className="px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] text-[10px] font-mono text-[#1d1d1f] dark:text-[#f5f5f7]">EDA &amp; DV</span>
              </div>
              <p className="pt-2 text-[11px] text-[#86868b] dark:text-[#7a7f8d]">
                Furqan Bagwan • Aman Shaikh • Bhavin Shankur
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Attribution */}
        <div className="pt-8 border-t border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#86868b] dark:text-[#7a7f8d]">
          <div>
            © {new Date().getFullYear()} HeatShield Research Consortium. Academic simulation research under Apache 2.0.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/methodology" className="hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors">
              Methodology
            </Link>
            <Link to="/team" className="hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors">
              Team TF-141
            </Link>
            <Link to="/contact" className="hover:text-[#0071e3] dark:hover:text-[#2997ff] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
