import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle component supporting:
 * 1. variant="icon" (default for Navbar) - compact dropdown or direct cycle
 * 2. variant="segmented" - 3-button pill for Sidebar, Profile, or Settings
 */
export default function ThemeToggle({ variant = 'icon', className = '' }) {
  const { theme, resolvedTheme, setTheme, toggleTheme, isDark } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [menuOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  const options = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'system', label: 'System', icon: Monitor },
  ];

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.08] ${className}`}
        role="group"
        aria-label="Theme mode selector"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isActive = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                isActive
                  ? 'bg-white dark:bg-[#22252b] text-[#1d1d1f] dark:text-[#f5f5f7] shadow-sm font-semibold'
                  : 'text-[#6e6e73] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7]'
              }`}
              aria-pressed={isActive}
              title={`Switch to ${opt.label} theme`}
            >
              <Icon size={14} className={isActive ? 'text-[#0071e3] dark:text-[#388bfd]' : 'text-current'} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Default "icon" variant: compact button with popover menu
  const ActiveIcon = theme === 'system' ? Monitor : isDark ? Moon : Sun;
  const currentLabel = theme === 'system' ? `System (${resolvedTheme})` : theme === 'dark' ? 'Dark' : 'Light';

  return (
    <div className={`relative inline-block ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-[32px] h-[32px] rounded-full bg-[#f5f5f7] dark:bg-[#22252b] hover:bg-[#e8e8ed] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/[0.08] dark:border-white/[0.1] flex items-center justify-center transition-all shrink-0 hover:ring-2 hover:ring-[#0071e3]/30"
        title={`Current theme: ${currentLabel}. Click to change.`}
        aria-label={`Current theme: ${currentLabel}. Click to open theme options.`}
        aria-expanded={menuOpen}
        aria-haspopup="true"
      >
        <ActiveIcon size={16} className="text-[#6e6e73] dark:text-[#a5a9b4] transition-colors" />
      </button>

      {/* Popover Dropdown Menu */}
      {menuOpen && (
        <div
          className="absolute right-0 mt-2 w-44 rounded-2xl bg-white/95 dark:bg-[#191b20]/95 backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.1] shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="px-2.5 py-1.5 text-[10px] uppercase font-mono tracking-wider text-[#86868b] dark:text-[#7a7f8d]">
            Theme Preference
          </div>
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setTheme(opt.id);
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-[13px] transition-colors ${
                  isSelected
                    ? 'bg-[#0071e3]/10 dark:bg-[#388bfd]/15 text-[#0071e3] dark:text-[#388bfd] font-semibold'
                    : 'text-[#1d1d1f] dark:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={15} className={isSelected ? 'text-[#0071e3] dark:text-[#388bfd]' : 'text-[#6e6e73] dark:text-[#a5a9b4]'} />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check size={14} className="text-[#0071e3] dark:text-[#388bfd]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
