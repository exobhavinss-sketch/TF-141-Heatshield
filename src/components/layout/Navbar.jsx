import React, { useState } from 'react';
import { useLocation, Link, NavLink } from 'react-router-dom';
import IndianFlag from '../branding/IndianFlag';

const NAV_LINKS = [
  { path: '/', label: 'Overview' },
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/heat-map', label: 'Heat Map' },
  { path: '/explore-data', label: 'Explore Data' },
  { path: '/methodology', label: 'Methodology' },
  { path: '/team', label: 'Team & Project' },
];

export default function Navbar({ onOpenMobileMenu }) {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/95 backdrop-blur-md border-b border-outline-variant/40">
      <div className="h-[76px] max-w-[1400px] mx-auto px-margin flex items-center justify-between gap-gutter">
        {/* Left: Brand Emblem & Title */}
        <Link to="/" className="flex items-center gap-space-md group">
          <img
            alt="HeatShield Emblem"
            className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            src="/branding/heatshield-icon.svg"
          />
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary tracking-tight">
              HeatShield
            </span>
            <span className="font-caption-caps text-caption-caps uppercase text-on-surface-variant">
              TF-141 / MIT Vishwaprayag University
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-space-lg h-full">
          {NAV_LINKS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                isActive
                  ? 'h-full flex items-center transition-colors text-primary border-b-2 border-primary-container font-medium'
                  : 'h-full flex items-center font-body-md text-body-md text-on-surface-variant hover:text-on-surface border-b-2 border-transparent transition-colors'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Academic Simulation Badge, Flag & CTAs */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          {/* Academic Simulation Pill */}
          <div className="hidden md:flex items-center gap-space-xs px-space-sm py-1 rounded-DEFAULT bg-surface-container border border-outline-variant/50 text-on-surface">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span className="font-label-code text-label-code text-on-surface uppercase">
              ACADEMIC SIMULATION • 2021-2025
            </span>
          </div>

          {/* Indian Identity Pill */}
          <div
            className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-DEFAULT bg-surface-container-high/60 border border-outline-variant/30 text-[10px] font-label-code text-primary cursor-default"
            title="Made For Indians - Made By Indians"
          >
            <IndianFlag size="xs" />
            <span className="font-semibold">Made For Indians</span>
          </div>

          {/* Submit Reading CTA Button */}
          <Link
            to="/submit-reading"
            className="inline-flex items-center justify-center px-space-md h-9 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors shadow-sm"
          >
            Submit Reading
          </Link>

          {/* User Avatar */}
          <Link
            to="/team"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary font-label-code text-xs font-semibold shrink-0 hover:ring-2 hover:ring-primary-container transition-all"
            title="TF-141 Team: Furqan B., Aman S., Bhavin S."
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={onOpenMobileMenu}
            className="lg:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Open Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
