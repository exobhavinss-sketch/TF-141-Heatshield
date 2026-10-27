import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import IndianFlag from '../branding/IndianFlag';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { path: '/', label: 'Overview' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/heat-map', label: 'Heat Map' },
  { path: '/explore-data', label: 'Explore Data' },
  { path: '/methodology', label: 'Methodology' },
  { path: '/team', label: 'Team & Project' },
];

export default function Navbar({ onOpenMobileMenu }) {
  const { user, profile } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#161617]/85 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08] transition-colors">
      <div className="h-[52px] w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Brand Emblem & Minimal Title */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0" aria-label="HeatShield Home">
          <img
            alt="HeatShield Emblem"
            className="h-6 sm:h-7 w-auto object-contain transition-transform group-hover:scale-105 shrink-0"
            src="/branding/heatshield-icon.svg"
          />
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-[15px] sm:text-[16px] text-[#1d1d1f] tracking-tight">
              HeatShield
            </span>
            <span className="hidden sm:inline-block text-[11px] text-[#86868b] font-medium tracking-normal">
              Solapur TF-141
            </span>
          </div>
        </Link>

        {/* Center: Apple-style Minimal Navigation */}
        <nav className="hidden xl:flex items-center gap-6 h-full shrink-0" aria-label="Main Navigation">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `text-[13px] font-medium transition-colors tracking-normal relative py-1 ${
                  isActive
                    ? 'text-[#0071e3] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#0071e3] after:rounded-full'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Academic Simulation Pill, Flag, Action Button & Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Academic Simulation Pill */}
          <div className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.04] text-[#6e6e73] shrink-0 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] shrink-0"></span>
            <span className="font-mono text-[10px] uppercase tracking-wider font-medium">
              Simulation 2021–2025
            </span>
          </div>

          {/* Indian Identity Pill */}
          <div
            className="hidden 2xl:inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/[0.02] border border-black/[0.04] text-[11px] text-[#6e6e73] cursor-default shrink-0 select-none"
            title="Made For Indians - Made By Indians"
          >
            <IndianFlag size="xs" />
            <span className="font-medium text-[11px]">Solapur, MH</span>
          </div>

          {/* Submit Reading CTA (Apple Pill Style) */}
          <Link
            to="/submit-reading"
            className="inline-flex items-center justify-center px-3.5 h-[32px] rounded-full bg-[#0071e3] hover:bg-[#0076df] active:scale-[0.98] text-white font-medium text-[12px] sm:text-[13px] transition-all shadow-sm shrink-0 whitespace-nowrap"
          >
            Submit Reading
          </Link>

          {/* User Profile Avatar */}
          <Link
            to={user ? "/profile" : "/login"}
            className="w-[32px] h-[32px] rounded-full bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] border border-black/[0.08] flex items-center justify-center transition-all shrink-0 hover:ring-2 hover:ring-[#0071e3]/30"
            title={user ? `Profile: ${profile?.full_name || user.email}` : "Sign In to HeatShield"}
            aria-label="User Account"
          >
            {user && profile?.full_name ? (
              <span className="text-[12px] font-semibold text-[#1d1d1f]">
                {profile.full_name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <span className="material-symbols-outlined text-[18px] text-[#6e6e73]">person</span>
            )}
          </Link>

          {/* Mobile Hamburger Trigger */}
          <button
            onClick={onOpenMobileMenu}
            className="xl:hidden p-1.5 rounded-full text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-black/[0.04] transition-colors shrink-0 flex items-center justify-center"
            aria-label="Open Navigation Menu"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
