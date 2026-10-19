import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import IndianFlag from '../branding/IndianFlag';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: 'home' },
  { path: '/dashboard', label: 'Dashboard', icon: 'query_stats' },
  { path: '/heat-map', label: 'Heat Map', icon: 'map' },
  { path: '/explore-data', label: 'Explore Data', icon: 'dataset' },
  { path: '/methodology', label: 'Methodology', icon: 'science' },
  { path: '/team', label: 'Team & Project', icon: 'groups' },
  { path: '/submit-reading', label: 'Submit Reading', icon: 'edit_calendar' },
];

export default function Sidebar({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-surface-container-lowest shadow-2xl flex flex-col justify-between border-l border-outline-variant/40 p-space-md animate-in slide-in-from-right duration-200">
        <div className="flex flex-col space-y-space-md">
          {/* Header */}
          <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/30">
            <div className="flex items-center gap-space-xs">
              <img
                src="/branding/heatshield-icon.svg"
                alt="HeatShield logo"
                className="h-7 w-auto object-contain"
              />
              <span className="font-headline-md text-headline-md text-primary font-bold">
                HeatShield
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Academic Badge */}
          <div className="flex items-center gap-space-xs px-2.5 py-1 rounded-DEFAULT bg-surface-container text-on-surface text-[11px] font-label-code">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>SOLAPUR SIMULATION 2021–2025</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-space-sm px-space-md py-2.5 rounded-lg font-body-md text-body-md transition-colors ${
                    isActive
                      ? 'bg-primary-container text-on-primary font-medium shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`
                }
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer */}
        <div className="pt-space-md border-t border-outline-variant/30 flex flex-col space-y-space-xs">
          <div className="flex items-center gap-2 text-xs font-label-code text-on-surface-variant">
            <IndianFlag size="xs" />
            <span className="text-primary font-semibold">Made For Indians - Made By Indians</span>
          </div>
          <span className="font-caption-caps text-caption-caps text-outline uppercase">
            Team TF-141 · MIT Vishwaprayag University
          </span>
        </div>
      </div>
    </div>
  );
}
