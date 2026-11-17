/**
 * System Architecture data — single source of truth for the /system-architecture
 * page. EVERY entry below is grounded in the actual repository:
 *
 *  - Backend     → src/services/*.js (supabaseClient, masterDataService,
 *                  heatmapService) + src/context/AuthContext.jsx. There is NO
 *                  custom Node/Express server — Supabase BaaS is the backend.
 *  - Database    → supabase/migrations/20261020000001_heatshield_backend.sql and
 *                  20261020000002_heatshield_master.sql (6 tables, full RLS).
 *  - API         → Supabase auto-REST (PostgREST) + GoTrue. The Express-style
 *                  REST surface in heatmapService.js (VITE_API_BASE_URL) is an
 *                  OPTIONAL stub with local fallbacks — labelled "Planned".
 *  - EDA         → edadv/*.py pipeline (numpy, pandas, scipy, matplotlib,
 *                  seaborn) producing edadv/figures/* and src/data/edadvSummary.json.
 *  - ETL         → scripts/importMasterDataset.js / .py (service-role batch import).
 *  - Dataset     → "Heat Shield Master Dataset(2).csv": 150,000 rows × 57 columns,
 *                  100 stations, 1,500 dates, 2021–2025, synthetic (verified in
 *                  src/data/edadvSummary.json metadata).
 *
 * Do not add technologies or services that are not present in the project.
 */

/* ------------------------------------------------------------------ */
/* Interactive circuit-board layers                                    */
/* ------------------------------------------------------------------ */

export const architectureNodes = [
  {
    id: 'dataset',
    num: '01',
    title: 'Environmental Dataset',
    subtitle: 'Synthetic CSV · 150k rows',
    status: 'implemented',
    x: 150,
    y: 470,
    w: 200,
    detail: {
      name: 'Environmental Data Layer',
      tech: ['CSV (source of truth)', 'Companion CSVs: Interventions, Surface Observations, Weather Data, Locations'],
      purpose:
        'Provides the environmental and land-cover information used by HeatShield for academic analysis. This is the starting point of the entire data pipeline.',
      responsibilities: [
        'Holds the master simulation: 150,000 records × 57 attributes',
        'Covers 100 simulated monitoring locations across 9 urban zones of Solapur',
        'Contains 1,500 observation dates spanning 2021–2025',
        'Records air/land-surface temperature, humidity, NDVI/NDBI/NDWI, morphology, cooling infrastructure and heat-risk categories',
      ],
      inputs: ['Computationally simulated academic model (generated offline)'],
      outputs: ['"Heat Shield Master Dataset(2).csv" — 57-column source file consumed by the EDA pipeline and the ETL importer'],
      connections: ['Data Processing & EDA (reads the CSV)', 'Database (via batch ETL import)'],
      status: 'Implemented — synthetic academic simulation data; not verified real-world measurements.',
    },
  },
  {
    id: 'eda',
    num: '02',
    title: 'Data Processing & EDA',
    subtitle: 'Python · Pandas · NumPy',
    status: 'implemented',
    x: 450,
    y: 470,
    w: 214,
    detail: {
      name: 'Data Processing Layer',
      tech: ['Python', 'pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'Jupyter notebooks'],
      purpose:
        'Environmental data is explored, inspected, and prepared for meaningful analysis. Reproducible Python scripts in the edadv/ directory audit, analyse, and export the research artefacts.',
      responsibilities: [
        'pandas — loading, inspecting, cleaning, filtering and manipulating the dataset',
        'NumPy — numerical operations and statistical calculations',
        'Exploratory Data Analysis — distributions, outliers (IQR screen), and relationships between environmental variables (190 correlation pairs)',
        'Statistical inference — one-way / Welch ANOVA, Kruskal-Wallis, Tukey HSD, OLS regression predicting LST (HC3), VIF, Durbin-Watson',
        'Data Visualization — 14 Matplotlib/Seaborn figures: temperature distributions, correlation matrix, monthly/annual patterns, station LST map, risk by zone',
        'export_web_summary.py — validates the audit (SHA-256, row count) and writes src/data/edadvSummary.json for the website',
      ],
      inputs: ['"Heat Shield Master Dataset(2).csv" from the Environmental Data Layer'],
      outputs: [
        'edadv/figures/*.png — 14 annotated research figures (bundled into the site)',
        'src/data/edadvSummary.json — validated aggregate summary bundled at build time',
        'Cleaned dataset handed to the batch ETL importer',
      ],
      connections: ['Environmental Dataset (source)', 'Database (batch ETL import)', 'Visualization & Dashboard (bundled artefacts)'],
      status: 'Implemented — run offline; results are bundled, not fetched at runtime.',
    },
  },
  {
    id: 'db',
    num: '03',
    title: 'Database',
    subtitle: 'Supabase Postgres · 6 tables',
    status: 'implemented',
    x: 210,
    y: 190,
    w: 190,
    detail: {
      name: 'Database Management',
      tech: ['PostgreSQL (Supabase)', 'SQL migrations', 'Row Level Security', 'DB triggers & indexes'],
      purpose:
        'Stores and organises the structured information used by the HeatShield application. Defined entirely by SQL migrations under supabase/migrations/ with Row Level Security on every table.',
      responsibilities: [
        'heatshield_master — 150,000-row master environmental dataset; public SELECT via RLS, writes only through the service-role ETL script',
        'heat_readings — community field readings submitted by researchers (status: pending → verified; the browser can never mark verified)',
        'profiles — user identity rows auto-created by the handle_new_user() trigger on sign-up',
        'user_settings — per-user theme, units and JSONB preferences',
        'saved_analyses — saved explorer queries with JSONB filters (256 KB payload constraints)',
        'contact_messages — contact-form inbox; insert-only for clients, readable only via service role',
      ],
      inputs: ['ETL import of the master CSV', 'PostgREST queries from the API layer', 'Authenticated inserts (readings, analyses, messages)'],
      outputs: ['Rows served to the API layer under RLS policies'],
      connections: ['Data Processing & EDA (offline import)', 'API Layer (PostgREST queries)'],
      status: 'Implemented — 6 tables live, RLS policies + grants verified in migrations.',
    },
  },
  {
    id: 'api',
    num: '04',
    title: 'API Layer',
    subtitle: 'PostgREST · GoTrue',
    status: 'implemented',
    x: 460,
    y: 190,
    detail: {
      name: 'Communication Layer',
      tech: ['PostgREST (auto-REST over Postgres)', 'GoTrue (Supabase Auth)', 'Supabase JS SDK over HTTPS'],
      purpose:
        'The communication layer enables the frontend, backend services, and database to exchange information. HeatShield uses Supabase\'s auto-generated REST API — there is no hand-written REST server.',
      responsibilities: [
        'PostgREST exposes every table as secure HTTPS endpoints (/rest/v1/...) — filters like eq/ilike/gte/range in the service modules map directly to URL queries',
        'GoTrue handles sign-up, sign-in, password reset and session tokens (/auth/v1/...)',
        'RLS policies are the request guard: every query is evaluated against the caller\'s role (anon vs authenticated)',
        'Retrieval path: Database → PostgREST → SDK → service modules → React pages',
        'Submission path: React forms → SDK → PostgREST INSERT → RLS validation → Database',
      ],
      inputs: ['HTTPS requests from the client-side service modules'],
      outputs: ['JSON row data, auth sessions, and insert acknowledgements'],
      connections: ['Database (SQL under the hood)', 'Backend services (Supabase JS SDK)', 'Frontend (HTTPS)'],
      status: 'Implemented — plus an OPTIONAL Express-style REST stub (VITE_API_BASE_URL: /health, /heatmap/*, /dashboard/summary) that is configured but never deployed: Planned / Future Work.',
    },
  },
  {
    id: 'backend',
    num: '05',
    title: 'Backend & Logic',
    subtitle: 'Supabase BaaS · no server',
    status: 'implemented',
    x: 705,
    y: 190,
    w: 190,
    detail: {
      name: 'Backend and Application Logic',
      tech: ['@supabase/supabase-js (client SDK)', 'Service modules: masterDataService, heatmapService, supabaseClient', 'AuthContext (session & profile state)', 'RLS + triggers as server-side logic'],
      purpose:
        'The backend manages application logic, processes requests, and communicates with the database and frontend. HeatShield deliberately runs on Supabase BaaS: logic lives in typed service modules, hardened Postgres triggers, and Row Level Security — not in a custom Node server.',
      responsibilities: [
        'masterDataService — population checks, station queries, filtered/range-paginated explorer queries against heatshield_master (with fixture fallback)',
        'heatmapService — merges heat_readings + heatshield_master + local fixtures into GeoJSON for the map',
        'AuthContext — sign-up, sign-in, password reset, session listener, profile/settings updates (column-level GRANTs limit what a user may write)',
        'Database side: handle_new_user() trigger auto-creates profiles + user_settings; updated_at triggers; RLS enforces status = pending on submitted readings',
      ],
      inputs: ['Query/filter calls from React pages'],
      outputs: ['Structured data and auth state returned to the frontend'],
      connections: ['Frontend (calls the service modules)', 'API Layer (SDK → PostgREST / GoTrue)', 'Database (through the API)'],
      status: 'Implemented as Supabase BaaS + client service modules. A standalone Express server is not part of the codebase.',
    },
  },
  {
    id: 'frontend',
    num: '06',
    title: 'Frontend',
    subtitle: 'React 18 · Vite · 14 routes',
    status: 'implemented',
    x: 960,
    y: 190,
    detail: {
      name: 'User Interface and Visualization',
      tech: ['React 18', 'Vite 5', 'React Router 6', 'Tailwind CSS 3', 'Framer Motion (this page)'],
      purpose:
        'The frontend presents environmental information in a structured and understandable format — a lazy-loaded, code-split React single-page application.',
      responsibilities: [
        'Home — platform overview with GIS-style hero and key metrics',
        'Dashboard — heat analytics overview for the Solapur network',
        'Explore Data — filtered, paginated, searchable master-dataset explorer with CSV export and saved analyses',
        'India Heat Map — Leaflet geographic heat surface fed by heatmapService',
        'Methodology — research specification with EDA figures and the interactive archive shelf',
        'Submit Reading (protected) — field-reading form inserting into heat_readings',
        'Team, Contact, Login/Register/Profile — project, contact and GoTrue-authenticated account flows',
      ],
      inputs: ['JSON data from the API layer via the service modules', 'Bundled EDA artefacts (edadvSummary.json, figure PNGs)'],
      outputs: ['Rendered pages, charts and maps; form submissions back to the API'],
      connections: ['Backend services (query construction)', 'API Layer (HTTPS)', 'Visualization & Dashboard (embedding)'],
      status: 'Implemented — every page lazy-loaded behind a Suspense boundary.',
    },
  },
  {
    id: 'viz',
    num: '07',
    title: 'Visualization',
    subtitle: 'Recharts · Leaflet · three.js',
    status: 'implemented',
    x: 960,
    y: 470,
    detail: {
      name: 'Visualization and Dashboard',
      tech: ['Recharts (charts)', 'Leaflet + react-leaflet (map)', 'three.js + @react-three/fiber (3D archive shelf)'],
      purpose:
        'Turns processed environmental information into interpretable visuals: charts, geographic heat surfaces, and the interactive research archive.',
      responsibilities: [
        'Recharts renders the NDVI/LST delta, monthly trends, zone comparisons and EDA summary charts',
        'Leaflet renders the India/Solapur heat map with station markers and thermal legend',
        'three.js powers the Methodology page\'s 3D research archive shelf',
        'Static GIS hero visual on the Home page (SVG heat contours + station pins)',
      ],
      inputs: ['edadvSummary.json + bundled figures (offline research artefacts)', 'Live rows fetched by the frontend services'],
      outputs: ['Interactive charts, maps and 3D views for the user'],
      connections: ['Data Processing & EDA (bundled artefacts)', 'Frontend (embedded within pages)'],
      status: 'Implemented.',
    },
  },
];

export const architectureConnections = [
  { from: 'dataset', to: 'eda', label: 'Python EDA pipeline', mode: 'offline', animated: true },
  { from: 'eda', to: 'db', label: 'Batch ETL import · service_role', mode: 'offline', animated: true },
  { from: 'eda', to: 'viz', label: 'Bundled JSON + figures', mode: 'offline', animated: true },
  { from: 'db', to: 'api', label: 'SQL via PostgREST', mode: 'live', bidirectional: true },
  { from: 'api', to: 'backend', label: 'supabase-js over HTTPS', mode: 'live', bidirectional: true },
  { from: 'backend', to: 'frontend', label: 'Service modules → pages', mode: 'live', bidirectional: true },
  { from: 'frontend', to: 'viz', label: 'Embeds charts & maps', mode: 'live', animated: true },
];

/* ------------------------------------------------------------------ */
/* "How HeatShield Works" — conceptual flow (adjusted to the real      */
/* implementation: EDA runs offline, then results split into a bundled */
/* web summary and a service-role ETL import into Supabase)            */
/* ------------------------------------------------------------------ */

export const flowSteps = [
  {
    id: 'flow-dataset',
    title: 'Environmental Dataset',
    tech: 'Synthetic simulation CSV',
    detail: '150,000 records × 57 attributes for 100 simulated Solapur stations, 2021–2025.',
  },
  {
    id: 'flow-load',
    title: 'Data Loading',
    tech: 'Python · pandas',
    detail: 'EDA scripts load and audit the CSV (SHA-256 provenance check, row-count guard).',
  },
  {
    id: 'flow-clean',
    title: 'Cleaning & Preprocessing',
    tech: 'pandas · NumPy',
    detail: 'Inspection, filtering and preparation of the 57 environmental attributes.',
  },
  {
    id: 'flow-eda',
    title: 'Exploratory Data Analysis',
    tech: 'NumPy · SciPy · Matplotlib',
    detail: 'Distributions, correlations, ANOVA/OLS inference and 14 research figures.',
  },
  {
    id: 'flow-branch',
    title: 'Export & Batch ETL Import',
    tech: 'export_web_summary.py · importMasterDataset.js',
    detail: 'Outputs split two ways: a validated web summary bundled into the site, and a service-role import of all 150,000 rows into Supabase.',
  },
  {
    id: 'flow-db',
    title: 'Database Storage',
    tech: 'Supabase Postgres + RLS',
    detail: 'heatshield_master (public read) and the five application tables under Row Level Security.',
  },
  {
    id: 'flow-api',
    title: 'API Communication',
    tech: 'PostgREST · GoTrue · supabase-js',
    detail: 'HTTPS queries filtered, paginated and authenticated; sessions issued by GoTrue.',
  },
  {
    id: 'flow-frontend',
    title: 'Frontend Dashboard',
    tech: 'React 18 service modules',
    detail: 'masterDataService / heatmapService map responses into page-ready structures (with fixture fallbacks).',
  },
  {
    id: 'flow-user',
    title: 'User Interaction & Visualization',
    tech: 'Recharts · Leaflet · three.js',
    detail: 'Dashboards, heat maps, the data explorer, EDA figures and the 3D research archive.',
  },
];

/* ------------------------------------------------------------------ */
/* Technology stack — only what the repository actually uses           */
/* ------------------------------------------------------------------ */

export const techStack = [
  {
    category: 'Frontend',
    items: [
      { name: 'React 18', purpose: 'UI framework — every page is a lazy-loaded component' },
      { name: 'Vite 5', purpose: 'Dev server and production bundler with manual vendor chunks' },
      { name: 'React Router 6', purpose: 'Client-side routing across 14 routes incl. protected ones' },
      { name: 'Tailwind CSS 3', purpose: 'Utility-first styling and the dark-mode design system' },
      { name: 'Framer Motion', purpose: 'Circuit-board and micro-interaction animation (this page, team cards)' },
      { name: 'clsx + tailwind-merge', purpose: 'Conditional class composition helper' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Supabase JS SDK', purpose: 'Client-side backend access — queries, auth and storage' },
      { name: 'Service modules', purpose: 'masterDataService, heatmapService, supabaseClient — all data logic' },
      { name: 'GoTrue Auth', purpose: 'Email/password sign-up, sign-in, reset flows, sessions' },
      { name: 'Row Level Security', purpose: 'Server-enforced access rules on every table' },
      { name: 'Express REST API', purpose: 'Planned — optional stub via VITE_API_BASE_URL with local fallbacks; not deployed', planned: true },
    ],
  },
  {
    category: 'Database',
    items: [
      { name: 'PostgreSQL (Supabase)', purpose: 'Managed relational database hosting the 6 application tables' },
      { name: 'SQL migrations', purpose: 'Versioned schema + RLS policies, triggers and indexes' },
      { name: 'heatshield_master', purpose: '150,000-row environmental dataset, public read' },
      { name: 'heat_readings', purpose: 'User-submitted field readings with pending→verified moderation' },
      { name: 'profiles / user_settings', purpose: 'Auto-created user identity and per-user preferences' },
      { name: 'saved_analyses / contact_messages', purpose: 'Saved explorer queries and contact-form inbox' },
    ],
  },
  {
    category: 'Data Analysis',
    items: [
      { name: 'Python', purpose: 'Language of the entire edadv/ research pipeline' },
      { name: 'pandas', purpose: 'Loading, cleaning, filtering and reshaping the master CSV' },
      { name: 'NumPy', purpose: 'Numerical and statistical computation' },
      { name: 'SciPy', purpose: 'ANOVA, Kruskal-Wallis, Tukey HSD, OLS inference, normality tests' },
      { name: 'Matplotlib + Seaborn', purpose: 'The 14 published EDA figures' },
      { name: 'Jupyter', purpose: 'Reproducible analysis notebooks' },
    ],
  },
  {
    category: 'Development & Deployment',
    items: [
      { name: 'Git / GitHub', purpose: 'Version control for the whole project' },
      { name: 'ETL scripts', purpose: 'scripts/importMasterDataset.js / .py — service-role batch import' },
      { name: 'Supabase migrations', purpose: 'Applied schema and security policies' },
      { name: 'Netlify / Vercel / Render', purpose: 'Static hosting configs for the built dist/ SPA' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* About / disclosure copy (Phase 8 content)                           */
/* ------------------------------------------------------------------ */

export const aboutInfo = {
  projectName: 'HeatShield — Urban Heat Exposure Analysis and Cooling Intelligence Platform',
  teamName: 'TF-141',
  studyArea: 'Solapur, Maharashtra, India',
  tracks: [
    'Database Management Systems (DBMS)',
    'Exploratory Data Analysis and Data Visualization (EDADV)',
    'Full Stack Development (FSD-1)',
  ],
  purpose:
    'HeatShield is an academic platform designed to explore urban heat exposure patterns using environmental and land-cover information. The project brings together data analysis, database management, and web application development to demonstrate how environmental information can be organised, analysed, and presented.',
  disclosure:
    'Academic Simulation Disclosure — The dataset and associated environmental values are based on a computationally simulated academic model. They are not verified real-world measurements from government agencies or physical sensors.',
};
