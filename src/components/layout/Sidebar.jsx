import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import IndianFlag from '../branding/IndianFlag';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();
  if (!isOpen) return null;

  const navItems = [
    { path: '/', label: 'Overview', icon: 'home' },
    { path: '/dashboard', label: 'Analytics Dashboard', icon: 'query_stats' },
    { path: '/heat-map', label: 'India Heat Map', icon: 'map' },
    { path: '/explore-data', label: 'Data Explorer', icon: 'dataset' },
    { path: '/methodology', label: 'Methodology & Science', icon: 'science' },
    { path: '/team', label: 'Team & Project', icon: 'groups' },
    { path: '/submit-reading', label: 'Submit Reading', icon: 'edit_calendar' },
    { path: '/contact', label: 'Contact & Inquiries', icon: 'mail' },
    {
      path: user ? '/profile' : '/login',
      label: user ? 'Researcher Profile' : 'Sign In / Register',
      icon: user ? 'account_circle' : 'login',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      {/* Dimmed Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Frosted Glass Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white/95 dark:bg-[#161617]/95 backdrop-blur-2xl shadow-2xl flex flex-col justify-between border-l border-black/[0.06] p-6 animate-in slide-in-from-right duration-250">
        <div className="flex flex-col space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.06]">
            <div className="flex items-center gap-2.5">
              <img
                src="/branding/heatshield-icon.svg"
                alt="HeatShield logo"
                className="h-6 w-auto object-contain"
              />
              <span className="font-semibold text-[16px] text-[#1d1d1f] tracking-tight">
                HeatShield
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Academic Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/[0.03] text-[#6e6e73] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] shrink-0"></span>
            <span className="uppercase tracking-wider">Simulation • 2021–2025</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] font-medium transition-all ${
                    isActive
                      ? 'bg-[#0071e3] text-white font-semibold shadow-sm'
                      : 'text-[#6e6e73] hover:bg-black/[0.03] hover:text-[#1d1d1f]'
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
        <div className="pt-4 border-t border-black/[0.06] flex flex-col space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#6e6e73]">
            <IndianFlag size="xs" />
            <span className="text-[#1d1d1f] font-semibold">Made For Indians - Made By Indians</span>
          </div>
          <span className="text-[11px] text-[#86868b] uppercase tracking-wider">
            Team TF-141 · MIT Vishwaprayag University
          </span>
        </div>
      </div>
    </div>
  );
}
