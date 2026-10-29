import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

const THEME_STORAGE_KEY = 'heatshield-theme';
const VALID_THEMES = ['light', 'dark', 'system'];

const ThemeContext = createContext({
  theme: 'system',
  resolvedTheme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
  isDark: false,
});

/**
 * Reads the persisted theme safely from localStorage.
 * Falls back to 'system' if localStorage is unavailable or corrupt.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'system';
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored && VALID_THEMES.includes(stored)) {
      return stored;
    }
  } catch (err) {
    console.warn('[HeatShield Theme] Could not access localStorage:', err);
  }
  return 'system';
}

/**
 * Checks system OS preference for dark mode.
 */
function getSystemPreference() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme);
  const [systemPreference, setSystemPreference] = useState(getSystemPreference);

  // Synchronize with OS prefers-color-scheme changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    // Support both modern addEventListener and legacy addListener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.removeListener) {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Compute resolvedTheme ('light' | 'dark')
  const resolvedTheme = useMemo(() => {
    if (theme === 'system') return systemPreference;
    return theme;
  }, [theme, systemPreference]);

  // Apply 'dark' class to document.documentElement and update meta theme-color
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const isDark = resolvedTheme === 'dark';

    if (isDark) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }

    // Update <meta name="theme-color"> for mobile browser chrome
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', isDark ? '#101114' : '#fafafc');
    }
  }, [resolvedTheme]);

  // Explicitly update theme and persist in localStorage
  const setTheme = useCallback((newTheme) => {
    if (!VALID_THEMES.includes(newTheme)) return;
    setThemeState(newTheme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (err) {
      console.warn('[HeatShield Theme] Could not persist theme:', err);
    }
  }, []);

  // Toggle helper: cycles light -> dark -> system -> light
  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      let next;
      if (current === 'light') next = 'dark';
      else if (current === 'dark') next = 'system';
      else next = 'light';

      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch (err) {
        console.warn('[HeatShield Theme] Could not persist theme:', err);
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
  }), [theme, resolvedTheme, setTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
