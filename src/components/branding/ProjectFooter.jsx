import React from 'react';
import { Link } from 'react-router-dom';
import IndianFlag from './IndianFlag';

export default function ProjectFooter({ className = '' }) {
  return (
    <footer className={`w-full bg-surface-container-low border-t border-outline-variant/40 pt-space-xl pb-space-lg text-on-surface ${className}`}>
      <div className="max-w-[1400px] mx-auto px-margin">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
          {/* Column 1: Identity & Watermark */}
          <div className="space-y-space-sm">
            <div className="flex items-center gap-space-sm">
              <img
                alt="HeatShield Emblem"
                className="h-6 w-auto object-contain"
                src="/branding/heatshield-icon.svg"
              />
              <span className="font-headline-md text-headline-md text-primary font-bold">
                HeatShield
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Urban microclimate heat risk analysis, spatial thermal sensing models, and cooling intervention planning engine for climate resilience.
            </p>
            <p className="font-caption-caps text-caption-caps text-outline uppercase">
              MIT Vishwaprayag University • Solapur, Maharashtra
            </p>
            {/* Required Identity & Watermark */}
            <div className="inline-flex items-center gap-2 pt-1 font-mono text-[11px] text-primary">
              <IndianFlag size="xs" />
              <span className="font-semibold">Made For Indians - Made By Indians</span>
            </div>
          </div>

          {/* Column 2: Platform Navigation */}
          <div className="space-y-space-sm">
            <span className="font-caption-caps text-caption-caps uppercase text-on-surface tracking-wider block font-semibold">
              Platform Navigation
            </span>
            <ul className="space-y-space-xs font-body-sm text-body-sm">
              <li>
                <Link to="/" className="text-on-surface-variant hover:text-on-surface transition-colors block">
                  Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-on-surface-variant hover:text-on-surface transition-colors block">
                  Analytics Dashboard
                </Link>
              </li>
              <li>
                <Link to="/heat-map" className="text-on-surface-variant hover:text-on-surface transition-colors block">
                  India Heat Map
                </Link>
              </li>
              <li>
                <Link to="/explore-data" className="text-on-surface-variant hover:text-on-surface transition-colors block">
                  Data Explorer
                </Link>
              </li>
              <li>
                <Link to="/methodology" className="text-on-surface-variant hover:text-on-surface transition-colors block">
                  Methodology
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-on-surface-variant hover:text-on-surface transition-colors block">
                  Team & Project
                </Link>
              </li>
              <li>
                <Link to="/submit-reading" className="text-on-surface-variant hover:text-on-surface transition-colors block">
                  Submit Reading
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-on-surface-variant hover:text-on-surface transition-colors block">
                  Contact & Inquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Research & Provenance */}
          <div className="space-y-space-sm">
            <span className="font-caption-caps text-caption-caps uppercase text-on-surface tracking-wider block font-semibold">
              Research & Provenance
            </span>
            <ul className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <li>Solapur Synthetic Dataset (150k pts)</li>
              <li>100 Sim Sensory Grid Nodes</li>
              <li>Microclimate Thermal Indices</li>
              <li>Urban Tree Canopy Mitigation Models</li>
              <li>Vector GIS Boundary Layers</li>
            </ul>
          </div>

          {/* Column 4: Project & Repository */}
          <div className="space-y-space-sm">
            <span className="font-caption-caps text-caption-caps uppercase text-on-surface tracking-wider block font-semibold">
              Project & Repository
            </span>
            <div className="space-y-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <p>Academic Research Initiative TF-141</p>
              <a
                className="inline-flex items-center gap-space-xs text-primary font-label-code text-label-code hover:underline"
                href="https://github.com/exobhavinss-sketch/TF-141-Heatshield"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>GitHub / TF-141-Heatshield</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
              <p className="text-on-surface">Team: Furqan B., Aman S., Bhavin S.</p>
              <p className="font-body-sm text-body-sm text-outline">Peer-review draft v2.4 · Open Science</p>
            </div>
          </div>
        </div>

        {/* Bottom Integrity Notice & Copyright */}
        <div className="pt-space-md border-t border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-4xl">
            Notice: Solapur microclimate dataset consists of synthetic academic simulation models (2021–2025) for research and urban planning methodologies, not official meteorological measurements.
          </p>
          <span className="font-caption-caps text-caption-caps text-outline uppercase whitespace-nowrap">
            © 2021–2025 MIT Vishwaprayag University
          </span>
        </div>
      </div>
    </footer>
  );
}
