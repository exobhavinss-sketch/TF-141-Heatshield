---
name: HeatShield Research Engine
colors:
  surface: '#f6faf7'
  surface-dim: '#d6dbd7'
  surface-bright: '#f6faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f5f1'
  surface-container: '#eaefeb'
  surface-container-high: '#e5e9e5'
  surface-container-highest: '#dfe4e0'
  on-surface: '#181d1b'
  on-surface-variant: '#404945'
  inverse-surface: '#2c312f'
  inverse-on-surface: '#edf2ee'
  outline: '#707975'
  outline-variant: '#c0c8c4'
  surface-tint: '#366759'
  primary: '#00362a'
  on-primary: '#ffffff'
  primary-container: '#194d40'
  on-primary-container: '#89bdac'
  inverse-primary: '#9dd1c0'
  secondary: '#016a60'
  on-secondary: '#ffffff'
  secondary-container: '#9ff2e4'
  on-secondary-container: '#117166'
  tertiary: '#581900'
  on-tertiary: '#ffffff'
  tertiary-container: '#7d2800'
  on-tertiary-container: '#ff9770'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b9eedb'
  primary-fixed-dim: '#9dd1c0'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#1b4f42'
  secondary-fixed: '#9ff2e4'
  secondary-fixed-dim: '#84d5c8'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005048'
  tertiary-fixed: '#ffdbcf'
  tertiary-fixed-dim: '#ffb59b'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#812900'
  background: '#f6faf7'
  on-background: '#181d1b'
  surface-variant: '#dfe4e0'
typography:
  headline-xl:
    fontFamily: Manrope
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-code:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-metric:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: -0.01em
  caption-caps:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system establishes an authoritative, scientifically rigorous, and quiet aesthetic tailored for computational environmental research and microclimate urban planning. Drawing from the typographic severity of academic publishing, the disciplined micro-interactions of high-performance developer tools, and Apple’s layout restraint, the interface prioritizes spatial order, metric clarity, and evidentiary density.

The aesthetic fuses **Editorial Precision** with **Technical Minimalism**:
- **Temperament:** Analytical, quiet, exact, unsensational. Heat risks are presented as measured climatological data rather than alarmist alerts.
- **Visual Stance:** Ultra-flat surface architecture, hairline dividers, strict tabular grids, and surgical typographic contrast. No decorative gradients, skeuomorphic depth, or floating volumetric drop shadows.
- **Evidentiary Integrity:** Every metric, simulation model, and spatial envelope explicitly surfaces data source attributions, timestamp coordinates, and academic provenance tags.

## Colors

The palette is anchored in botanical deep greens, mineral neutrals, and thermal spectral accents that map directly to physical phenomena (vegetation cover, ambient cooling, and thermal stress).

### Surface & Base Tokens
- **Canvas Base:** `#F7F7F2` (Warm, non-glare alabaster paper ground)
- **Surface Layer (Cards, Data Panels):** `#FFFFFF` (Pure white for sharp figure-ground contrast)
- **Subtle Surface Tint:** `#F0F2EE` (Used for table headers, embedded code blocks, and inactive tabs)

### Text & Line Tokens
- **Ink Primary:** `#151A18` (Deep carbon charcoal with slight botanical undertone)
- **Ink Muted:** `#66716B` (Mid-tone slate green for metadata, secondary captions, and structural labels)
- **Border Structural:** `#E4E8E3` (Razor hairline stroke for structural boundaries)
- **Border Subtle:** `#EEF1EC` (Soft dividers inside lists and dense metric tables)

### Thermal & Analytic Accents
- **Primary Brand / Baseline:** `#194D40` (Deep forest emerald; interactive triggers, structural emphasis)
- **Primary Hover / Active:** `#12392F` (Compressed shade for pressed states)
- **Cooling / Mitigation Index:** `#398D82` (Mineral teal; denotes canopy interventions, water bodies, and cooling corridors)
- **Moderate Heat / Anomaly:** `#E76F40` (Dry terracotta orange; moderate surface temperature elevation)
- **Critical Thermal Stress:** `#C94A3D` (Controlled vermilion red; severe urban heat island exposure)

## Typography

The typographic hierarchy enforces clear cognitive delineation between narrative research, data display, and telemetry:
- **Headings (Manrope):** Set in medium-semibold weights with tight tracking (`-0.02em` to `-0.03em`) to mimic rigorous academic journal titling without sterile corporate genericism.
- **Body & Continuous Text (Inter):** High-clarity rendering optimized for long-form methodology reviews, environmental policy summaries, and context panels. Inter must be forced to use OpenType tabular numbers (`tnum`) across all analytics displays.
- **Machine & Coordinate Telemetry (JetBrains Mono):** Reserved for technical geolocations (`17.6599° N, 75.9064° E`), microclimate grid IDs, timestamp series, model confidence scores, and simulation metadata.
- **Letter Spacing:** All uppercase micro-headers (`caption-caps`) employ wide letter spacing (`+0.06em`) to ensure legibility when rendered at 10px.

## Layout & Spacing

The platform is constructed on a disciplined **12-column modular grid** bound by an intentional maximum container width of **1400px** (`87.5rem`), centering analytical operations in the viewport with balanced paper-margins.

### Grid Rhythm & Spatial Discipline
- **Base Spatial Unit:** 8px core grid, with 4px half-steps used exclusively for inline badge padding and compact table cells.
- **Grid Layout (Desktop ≥ 1024px):** 12 columns with `1.25rem` (20px) gutters and `2rem` (32px) exterior frame margins. Heavy computational monitors allow split views: a fixed 4-column parameter pane (or map viewport) paired with an 8-column data ledger.
- **Grid Layout (Tablet 768px - 1023px):** 8 columns with `1rem` (16px) gutters, collapsing dense parameter controls into drawer sheets.
- **Grid Layout (Mobile < 768px):** 4 columns with `0.75rem` (12px) gutters and `1rem` (16px) canvas edge padding. Telemetry displays reflow from horizontal summary strips into vertical stacked keys.
- **Content Max-Widths:** Prosaic methodology documentation is constrained to 68ch (`max-w-prose`) to preserve scientific reading comprehension.

## Elevation & Depth

Visual hierarchy is maintained without synthetic drop shadows or blurred z-axis elevations. The platform operates on a **Planar Contrast & Hairline** paradigm:
- **Zero Heavy Shadows:** Shadows are omitted entirely in default workspaces. Floating elements, modals, or contextual telemetry popovers utilize a whisper-thin ambient diffusion: `0 4px 20px -2px rgba(21, 26, 24, 0.05)`, paired with a strict `#E4E8E3` outer border.
- **Structural Tiering (Tonal Planes):**
  - Level 0 (Base Canvas): `#F7F7F2`
  - Level 1 (Workspaces, Simulation Cards, Maps): `#FFFFFF` bounded by a 1px solid stroke of `#E4E8E3`.
  - Level 2 (Embedded Inspectors, Data Sub-shelves): `#F0F2EE` bounded by `#E4E8E3`.
- **Dividers & Delimiters:** Hairline borders (1px) define all horizontal and vertical column tracks, ensuring a blueprint-like schematic appearance.

## Shapes

The design language uses **Soft Minimal Radii (Option 1)** to maintain technical precision while eliminating clinical harshness:
- **Base Components (Inputs, Buttons, Badges):** `4px` (`0.25rem`) radius.
- **Containers & Data Cards (`rounded-lg`):** `8px` (`0.5rem`) radius.
- **Panels & Dialog Overlays (`rounded-xl`):** `12px` (`0.75rem`) radius.
- **Micro-Indicators & Status Dots:** Pure circles (`9999px`) for environmental sensors and thermal status points.

## Components

### 1. Navigation Header & Provenance Banner
- **Primary Bar:** Height `52px`, flat `#FFFFFF`, border-bottom `1px solid #E4E8E3`.
- **Academic Status Badge:** Embedded pill-capsule within the navbar. Monospaced typography (`label-code`), `#151A18` text on `#F0F2EE` background with an active emerald pulse indicator (`#194D40`). Format: `SIMULATED ACADEMIC DATASET · SOLAPUR 2021-2025`.

### 2. Buttons & Interactivity
- **Primary:** Solid `#194D40` background, pure `#FFFFFF` label, 4px border radius. Hover: `#12392F`. No drop shadow. Height: 36px (compact scientific tool ergonomics).
- **Secondary / Outline:** Background `#FFFFFF`, border `1px solid #E4E8E3`, text `#151A18`. Hover: background `#F7F7F2`, border `#66716B`.
- **Text / Inline:** Neutral `#66716B` transitioning to `#151A18` on hover with a crisp bottom underline.

### 3. Simulation & Analysis Cards
- **Structure:** Background `#FFFFFF`, 8px corner radius, perimeter border `1px solid #E4E8E3`.
- **Card Header:** Subdivided by a `1px solid #EEF1EC` bottom line. Contains title (`headline-md`), category badge (`caption-caps`), and sensor ID (`label-code`).
- **Internal Padding:** `1.25rem` (20px) uniform.

### 4. Chips, Status Tags & Thermal Indicators
- **Scientific Tag:** `#F0F2EE` background, `#151A18` text, border `1px solid #E4E8E3`, font `label-code`.
- **Thermal Level Chips:**
  - *Mitigated / Cool:* Text `#194D40`, background `#EAF3F1`, border `#398D82`/30.
  - *Moderate Heat:* Text `#9E4320`, background `#FCF0EB`, border `#E76F40`/30.
  - *Extreme Thermal Stress:* Text `#8A2E24`, background `#F9ECEB`, border `#C94A3D`/30.

### 5. Form Elements & Parameter Selectors
- **Input Fields & Numeric Spinners:** Pure white background, `1px solid #E4E8E3` border, 4px radius. Focus state shifts border to `#194D40` with an unblurred `0 0 0 1px #194D40` ring. Numbers rendered in JetBrains Mono.
- **Checkboxes & Radios:** Sharp, compact 14px boxes. Checked state `#194D40` fill with 1.5px white checkmark.

### 6. Data Tables & Spatial Ledger
- **Header Cells:** Background `#F7F7F2`, `caption-caps` font, uppercase, tracking `+0.06em`, border-bottom `1px solid #E4E8E3`.
- **Data Cells:** Height 40px, font `body-md` (Inter) with numeric data aligned right in `label-metric` (JetBrains Mono). Alternating rows remain plain white; hover state highlights row with `#F7F7F2`.