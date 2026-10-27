/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "F:/MIT VishwaPrayag University/3 - Semester/FSD - DBMS - EDADV Combined Project - TF-141/index.html",
    "F:/MIT VishwaPrayag University/3 - Semester/FSD - DBMS - EDADV Combined Project - TF-141/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // --- Apple-Inspired Neutral Foundation ---
        "apple-canvas": "#ffffff",
        "apple-subtle": "#fafafc",
        "apple-gray": "#f5f5f7",
        "apple-gray-dark": "#e8e8ed",
        "apple-dark": "#161617",
        "apple-dark-card": "#1d1d1f",
        "apple-text": "#1d1d1f",
        "apple-secondary": "#6e6e73",
        "apple-tertiary": "#86868b",
        "apple-quaternary": "#aeaeb2",
        "apple-blue": "#0071e3",
        "apple-blue-hover": "#0076df",
        "apple-blue-active": "#0062c4",
        "apple-border": "rgba(0, 0, 0, 0.08)",
        "apple-border-subtle": "rgba(0, 0, 0, 0.04)",

        // --- Scientifically Calibrated Heat Risk Palette ---
        "thermal-safe": "#059669",
        "thermal-safe-bg": "#ecfdf5",
        "thermal-moderate": "#d97706",
        "thermal-moderate-bg": "#fffbeb",
        "thermal-severe": "#ea580c",
        "thermal-severe-bg": "#fff7ed",
        "thermal-critical": "#dc2626",
        "thermal-critical-bg": "#fef2f2",
        "thermal-indigo": "#2563eb",
        "thermal-indigo-bg": "#eff6ff",

        // --- Backward-Compatible Existing Tokens (Preserving Existing Styles) ---
        "tertiary-fixed": "#ffdbcf",
        "primary-fixed": "#b9eedb",
        "tertiary": "#581900",
        "surface-dim": "#d6dbd7",
        "surface-container": "#f5f5f7",
        "inverse-surface": "#2c312f",
        "on-secondary-fixed": "#00201c",
        "on-primary": "#ffffff",
        "on-error": "#ffffff",
        "outline-variant": "#d2d2d7",
        "primary-container": "#0071e3",
        "on-secondary": "#ffffff",
        "on-surface": "#1d1d1f",
        "on-tertiary-container": "#ff9770",
        "on-primary-fixed-variant": "#1b4f42",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        "surface": "#ffffff",
        "on-secondary-fixed-variant": "#005048",
        "tertiary-container": "#7d2800",
        "surface-variant": "#e8e8ed",
        "error": "#dc2626",
        "on-background": "#1d1d1f",
        "on-primary-container": "#ffffff",
        "inverse-primary": "#9dd1c0",
        "inverse-on-surface": "#edf2ee",
        "secondary-fixed-dim": "#84d5c8",
        "secondary": "#059669",
        "surface-container-lowest": "#ffffff",
        "on-secondary-container": "#059669",
        "secondary-container": "#ecfdf5",
        "surface-container-highest": "#e8e8ed",
        "primary": "#1d1d1f",
        "surface-bright": "#ffffff",
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed": "#380d00",
        "tertiary-fixed-dim": "#ffb59b",
        "background": "#ffffff",
        "outline": "#86868b",
        "on-primary-fixed": "#002019",
        "primary-fixed-dim": "#9dd1c0",
        "surface-tint": "#0071e3",
        "surface-container-low": "#fafafc",
        "on-surface-variant": "#6e6e73",
        "on-tertiary-fixed-variant": "#812900",
        "secondary-fixed": "#9ff2e4",
        "surface-container-high": "#ebebed"
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "card": "1.75rem", // 28px (Apple card standard)
        "modal": "1.25rem", // 20px
        "pill": "980px", // Apple pill button
        full: "9999px"
      },
      spacing: {
        "gutter": "1.5rem",
        "gutter-mobile": "1rem",
        "margin": "2rem",
        "margin-mobile": "1rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "section-desktop": "7.5rem", // 120px (Apple section vertical padding)
        "section-tablet": "5rem",     // 80px
        "section-mobile": "3.5rem"    // 56px
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
        headline: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "Segoe UI", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "Menlo", "Consolas", "monospace"],
        "headline-xl": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "label-code": ["JetBrains Mono", "monospace"],
        "label-metric": ["JetBrains Mono", "monospace"],
        "caption-caps": ["Inter", "sans-serif"]
      },
      fontSize: {
        // Apple-grade fluid type scale
        "display-hero": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.08", letterSpacing: "-0.025em", fontWeight: "600" }],
        "display-title": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.12", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-h2": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.18", letterSpacing: "-0.015em", fontWeight: "600" }],
        "display-h3": ["clamp(1.25rem, 2vw, 1.75rem)", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
        "subhead-apple": ["1.25rem", { lineHeight: "1.4", letterSpacing: "0.005em", fontWeight: "400" }],
        "body-apple": ["1.0625rem", { lineHeight: "1.5", letterSpacing: "-0.011em", fontWeight: "400" }], // 17px on 25px
        
        // Backward-compatible sizes
        "headline-xl": ["36px", { lineHeight: "44px", letterSpacing: "-0.03em", fontWeight: "600" }],
        "headline-lg": ["26px", { lineHeight: "32px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["18px", { lineHeight: "24px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "headline-xl-mobile": ["28px", { lineHeight: "34px", letterSpacing: "-0.025em", fontWeight: "600" }],
        "headline-lg-mobile": ["22px", { lineHeight: "28px", letterSpacing: "-0.015em", fontWeight: "600" }],
        "body-lg": ["15px", { lineHeight: "24px", fontWeight: "400" }],
        "body-md": ["13px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "18px", fontWeight: "400" }],
        "label-code": ["11px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
        "label-metric": ["13px", { lineHeight: "18px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "caption-caps": ["11px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "600" }]
      },
      boxShadow: {
        "apple-sm": "0 2px 8px rgba(0, 0, 0, 0.04)",
        "apple-card": "0 4px 24px rgba(0, 0, 0, 0.04)",
        "apple-hover": "0 12px 32px rgba(0, 0, 0, 0.08)",
        "apple-modal": "0 24px 64px rgba(0, 0, 0, 0.12)",
        "apple-glow": "0 0 20px rgba(0, 113, 227, 0.25)"
      }
    },
  },
  plugins: [],
}