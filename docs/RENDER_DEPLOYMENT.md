# Deploying HeatShield to Render (render.com)

**Project:** HeatShield — Urban Heat Exposure Analysis and Cooling Intelligence Platform  
**Team:** TF-141  
**Affiliation:** MIT Vishwaprayag University, Solapur  

This guide provides instructions to deploy the HeatShield platform to **Render** as a high-performance, globally-cached Single-Page Application (SPA) with automated branch deployments.

---

## 1. Automated Blueprint Deployment (Recommended)

HeatShield includes a root-level [`render.yaml`](file:///f:/MIT%20VishwaPrayag%20University/3%20-%20Semester/FSD%20-%20DBMS%20-%20EDADV%20Combined%20Project%20-%20TF-141/render.yaml) Infrastructure-as-Code blueprint.

### Step 1: Connect Your Repository
1. Log in to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Blueprint**.
3. Select and connect your repository: `exobhavinss-sketch/TF-141-Heatshield`.
4. Render will parse `render.yaml` and discover the `heatshield-tf141` static site service.

### Step 2: Supply Supabase Environment Variables
In the Blueprint configuration screen, supply your public Supabase credentials:
- `VITE_SUPABASE_URL`: Your Supabase Project URL (`https://<project-ref>.supabase.co`)
- `VITE_SUPABASE_PUBLISHABLE_KEY`: Your Supabase Publishable / Anon public key

*(Leave secrets like database passwords or service-role keys out of Render environment variables; Vite apps run purely client-side).*

### Step 3: Click "Apply"
Render will:
1. Install Node.js 20.x
2. Execute the optimized build: `npm run build`
3. Publish `./dist` to Render's global CDN
4. Apply the SPA rewrite rule (`/*` → `/index.html`)
5. Serve immutable 1-year cache headers for all static asset chunks in `/assets/*`

---

## 2. Manual Static Site Deployment (Alternative)

If you prefer setting up the static site manually through the Render Dashboard:

1. In Render Dashboard, click **New +** → **Static Site**.
2. Connect your Git repository.
3. Configure the following build settings:
   - **Name:** `heatshield-tf141`
   - **Branch:** `main`
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
4. Expand **Advanced** and add **Environment Variables**:
   - `VITE_SUPABASE_URL` = `https://<your-project-ref>.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `<your-publishable-or-anon-key>`
   - `NODE_VERSION` = `20.18.0`
5. In **Redirects / Rewrites** tab:
   - Click **Add Rule**
   - **Type:** `Rewrite`
   - **Source Path:** `/*`
   - **Destination:** `/index.html`
6. Click **Create Static Site**.

---

## 3. Update Supabase Auth Redirects for Render

Once Render assigns your site URL (e.g., `https://heatshield-tf141.onrender.com`):

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication** → **URL Configuration**.
2. Set **Site URL** to:
   ```text
   https://heatshield-tf141.onrender.com
   ```
3. Add the following to **Redirect URLs**:
   ```text
   https://heatshield-tf141.onrender.com/**
   https://heatshield-tf141.onrender.com/auth/callback
   https://heatshield-tf141.onrender.com/reset-password
   ```
4. Click **Save**.

---

## 4. Build Performance Optimizations Included

The application build has been specifically tuned for Render deployments:

| Metric | Before Optimization | After Optimization | Improvement |
|---|---|---|---|
| **Initial Bundle Size** | 1,306 kB (single chunk) | **28.18 kB** entry + lazy chunks | **97.8% reduction** |
| **Vendor Code-Splitting** | Monolithic bundle | 4 isolated chunks (`framework`, `charts`, `maps`, `supabase`) | Granular caching |
| **Page Loading** | All pages loaded upfront | `React.lazy` on-demand streaming | Instant initial paint |
| **Build Time** | ~25.2s | **~5.8s** | **77% faster** builds |
| **HTTP Caching** | Default browser heuristic | `max-age=31536000, immutable` | Instant repeat visits |
