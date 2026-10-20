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
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/40">
      <div className="h-[76px] w-full max-w-[1600px] mx-auto px-2.5 sm:px-4 xl:px-3 2xl:px-8 flex items-center justify-between gap-1.5 lg:gap-2.5 xl:gap-2.5 2xl:gap-6">
        {/* Left: Brand Emblem & Title */}
        <Link to="/" className="flex items-center gap-2 2xl:gap-3 group shrink-0">
          <img
            alt="HeatShield Emblem"
            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105 shrink-0"
            src="/branding/heatshield-icon.svg"
          />
          <div className="flex flex-col whitespace-nowrap">
            <span className="font-headline-md text-[16px] 2xl:text-headline-md text-primary tracking-tight leading-tight">
              HeatShield
            </span>
            <span className="hidden sm:inline-block text-[9px] 2xl:text-caption-caps uppercase text-on-surface-variant tracking-tight 2xl:tracking-wider leading-tight whitespace-nowrap font-medium">
              TF-141 / MIT Vishwaprayag University
            </span>
            <span className="sm:hidden font-caption-caps text-[9px] uppercase text-on-surface-variant tracking-wider leading-tight whitespace-nowrap">
              TF-141
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-2.5 h-full shrink-0">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `h-full flex items-center px-1.5 2xl:px-2.5 py-1 whitespace-nowrap text-[12px] 2xl:text-body-md font-medium border-b-2 transition-colors shrink-0 ${
                  isActive
                    ? 'text-primary border-primary-container font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface border-transparent hover:border-outline-variant/40'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Academic Simulation Badge, Flag, CTAs & Avatar */}
        <div className="flex items-center gap-1.5 xl:gap-2 2xl:gap-3 shrink-0">
          {/* Academic Simulation Pill */}
          <div className="hidden md:inline-flex items-center gap-1.5 px-2 2xl:px-2.5 py-1 rounded-DEFAULT bg-surface-container border border-outline-variant/50 text-on-surface shrink-0 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></span>
            <span className="font-label-code text-[9.5px] 2xl:text-[11px] leading-none text-on-surface uppercase tracking-normal 2xl:tracking-wider whitespace-nowrap">
              ACADEMIC SIMULATION • 2021–2025
            </span>
          </div>

          {/* Indian Identity Pill */}
          <div
            className="hidden xl:inline-flex items-center gap-1.5 px-1.5 2xl:px-2 py-1 rounded-DEFAULT bg-surface-container-high/60 border border-outline-variant/30 text-[9.5px] 2xl:text-[11px] font-label-code text-primary cursor-default shrink-0 whitespace-nowrap"
            title="Made For Indians - Made By Indians"
          >
            <IndianFlag size="xs" />
            <span className="font-semibold whitespace-nowrap leading-none">Made For Indians</span>
          </div>

          {/* Submit Reading CTA Button */}
          <Link
            to="/submit-reading"
            className="inline-flex items-center justify-center px-2.5 2xl:px-3.5 h-8 2xl:h-9 rounded-lg bg-primary-container text-on-primary font-body-md text-[11.5px] 2xl:text-body-md font-medium hover:bg-primary transition-colors shadow-sm shrink-0 whitespace-nowrap"
          >
            Submit Reading
          </Link>

          {/* User Avatar */}
          <Link
            to={user ? "/profile" : "/login"}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-code text-xs font-semibold shrink-0 hover:ring-2 hover:ring-primary-container transition-all"
            title={user ? `Profile: ${profile?.full_name || user.email}` : "Sign In to HeatShield"}
          >
            {user && profile?.full_name ? (
              <span className="text-[11px] font-bold">{profile.full_name.charAt(0).toUpperCase()}</span>
            ) : (
              <span className="material-symbols-outlined text-[18px]">person</span>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={onOpenMobileMenu}
            className="xl:hidden p-1.5 sm:p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors shrink-0 flex items-center justify-center"
            aria-label="Open Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
