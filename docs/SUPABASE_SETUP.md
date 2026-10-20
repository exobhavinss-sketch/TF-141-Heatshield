# HeatShield — Supabase Backend Implementation & Setup Guide

**Project:** HeatShield — Urban Heat Exposure Analysis and Cooling Intelligence Platform  
**Team:** TF-141  
**Institution:** MIT Vishwaprayag University, Solapur, Maharashtra, India  

---

## 1. Overview & Architecture

HeatShield integrates a secure Supabase backend with PostgreSQL, Supabase Auth, Row Level Security (RLS), and database triggers while strictly separating:
1. **Academic Simulation Baseline (2021–2025):** 150,000 synthetic microclimate simulation observations and 100 station baselines for the Solapur study grid. These records remain static, peer-review reproducible, and read-only.
2. **User-Contributed Microclimate Observations (`heat_readings`):** Verified field readings submitted by authenticated users, with individual ownership, client-side sanity bounds, and status segregation (`pending`, `verified`, `rejected`).
3. **User Profile & Customization (`profiles`, `user_settings`):** Secure profile data with automated trigger creation on sign-up and personalized thermal unit/theme preferences.
4. **Saved Spatial Analyses (`saved_analyses`):** User-saved filter parameters and calculated results from Data Explorer.
5. **Inquiries & Communications (`contact_messages`):** Narrowly-scoped write-only inbox with server-side validation and anti-abuse safeguards.

---

## 2. Environment Variables

The browser application reads strictly two public configuration variables via `import.meta.env`:

```env
# Supabase Project URL (e.g. https://xyzcompany.supabase.co)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase Publishable / Anon Key (Safe for browser code)
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-or-anon-key
```

> [!CAUTION]
> **Zero Secrets in Browser Code:**
> Never add `SUPABASE_SERVICE_ROLE_KEY`, `POSTGRES_PASSWORD`, or SMTP credentials to any `.env` file or `VITE_*` variable. In Vite, all `VITE_*` variables are statically bundled and publicly readable in browser client JavaScript.

A sample template is provided in [`.env.example`](file:///f:/MIT%20VishwaPrayag%20University/3%20-%20Semester/FSD%20-%20DBMS%20-%20EDADV%20Combined%20Project%20-%20TF-141/.env.example).

---

## 3. Step-by-Step Remote Supabase Setup

### Step 3.1: Create a Supabase Project
1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **New Project**.
3. Choose your organization, assign a project name (e.g., `heatshield-tf141`), set a secure database password, and select the nearest cloud region (e.g., `ap-south-1` Mumbai for Indian deployments).
4. Wait for provisioning to complete (~1-2 minutes).

### Step 3.2: Retrieve API Credentials
1. In your project dashboard, navigate to **Project Settings** → **API**.
2. Copy the **Project URL** and assign it to `VITE_SUPABASE_URL`.
3. Copy the **anon public / publishable** key and assign it to `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Create a local `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   Paste your values into `.env`.

### Step 3.3: Deploy Database Migrations

You can apply the complete database schema and security policies using either the **Supabase Dashboard SQL Editor** or the **Supabase CLI**.

#### Option A: Via Dashboard SQL Editor (Recommended for Quick Setup)
1. In the Supabase Dashboard, click **SQL Editor** on the left navigation bar.
2. Click **New query**.
3. Open the migration file: [`supabase/migrations/20261020000001_heatshield_backend.sql`](file:///f:/MIT%20VishwaPrayag%20University/3%20-%20Semester/FSD%20-%20DBMS%20-%20EDADV%20Combined%20Project%20-%20TF-141/supabase/migrations/20261020000001_heatshield_backend.sql).
4. Copy the entire file content, paste it into the SQL Editor, and click **Run**.
5. Verify the output displays `Success. No rows returned`.

#### Option B: Via Supabase CLI
```bash
# Log in to your Supabase account
npx supabase login

# Link your local workspace to the remote project
npx supabase link --project-ref your-project-ref

# Push migrations to the remote database
npx supabase db push
```

---

## 4. Supabase Dashboard Authentication Configuration

In the Supabase Dashboard, go to **Authentication**:

### 4.1 URL Configuration
Under **Authentication** → **URL Configuration**:
- **Site URL:**
  - Local development: `http://localhost:5173`
  - Production: `https://your-production-domain.com` (or Vercel / Netlify domain)
- **Redirect URLs (Allow List):** Add the following paths:
  - `http://localhost:5173/**`
  - `http://localhost:5173/auth/callback`
  - `http://localhost:5173/reset-password`
  - `https://your-production-domain.com/**`
  - `https://your-production-domain.com/auth/callback`
  - `https://your-production-domain.com/reset-password`

### 4.2 Email Auth Providers & Confirmation
Under **Authentication** → **Providers** → **Email**:
- Enable **Email provider**: `ON`
- Enable **Confirm email**: `ON` (recommended for production academic integrity; when developing locally, can temporarily be set to OFF if testing without mail servers).
- Secure email change: `ON`

### 4.3 Email Templates (Optional Customization)
Under **Authentication** → **Email Templates**:
- **Confirm signup:**
  ```html
  <h2>Confirm your HeatShield Account (Team TF-141)</h2>
  <p>Follow this link to verify your email address:</p>
  <p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=signup">Verify Email</a></p>
  ```
- **Reset Password:**
  ```html
  <h2>Reset your HeatShield Password</h2>
  <p>Click below to choose a new password:</p>
  <p><a href="{{ .SiteURL }}/reset-password?token_hash={{ .TokenHash }}&type=recovery">Reset Password</a></p>
  ```

---

## 5. Database Schema & Access Control Matrix

| Table | Primary Key | References | RLS Select | RLS Insert | RLS Update | RLS Delete |
|---|---|---|---|---|---|---|
| `profiles` | `id UUID` | `auth.users(id)` | Own only (`auth.uid() = id`) | Trigger only | Own only | Never (CASCADE via Auth) |
| `user_settings` | `user_id UUID` | `auth.users(id)` | Own only (`auth.uid() = user_id`) | Own only | Own only | Own only |
| `heat_readings` | `id UUID` | `auth.users(id)` | Own only (`auth.uid() = user_id`) | Own only (`status = 'pending'`) | Own only (`status = 'pending'`) | Own only |
| `saved_analyses` | `id UUID` | `auth.users(id)` | Own only (`auth.uid() = user_id`) | Own only | Own only | Own only |
| `contact_messages` | `id UUID` | `auth.users(id)` (optional) | None (`anon`/`auth` revoked) | Valid payload | None (`anon`/`auth` revoked) | None (`anon`/`auth` revoked) |

### Key Security Safeguards
1. **User Identity Non-Tampering:** `heat_readings` and `saved_analyses` check `auth.uid() = user_id` on INSERT and UPDATE. No client can inject another user's UUID.
2. **Status Privilege Escalation Prevention:** In `heat_readings`, the INSERT and UPDATE policies strictly mandate `status = 'pending'`. A regular user cannot self-verify their reading (`status = 'verified'`).
3. **Contact Inbox Confidentiality:** `contact_messages` has table privileges revoked for SELECT, UPDATE, and DELETE from both `anon` and `authenticated`. Inquiries are strictly write-only from the client and can only be read by authorized personnel via the Supabase Dashboard or protected Edge Functions.
4. **Trigger-Driven Profile Provisioning:** The PostgreSQL function `public.handle_new_user()` runs with `SECURITY DEFINER` on `auth.users` creation, safely extracting `raw_user_meta_data->>'full_name'` and initializing `user_settings` with defaults without relying on client-side inserts.

---

## 6. Frontend Routing & Route Protection

The frontend integrates standard React Router v6 guards:
- **Public Routes:**
  - `/` (Overview)
  - `/dashboard` (Public Academic Microclimate Analytics & Simulation)
  - `/heat-map` (Solapur Spatial Grid & Interpolation)
  - `/explore-data` (Sensor Explorer & Ward Filtering)
  - `/methodology` (Peer-review Academic Methodology)
  - `/team` (Team TF-141 Roster & University Affiliation)
  - `/contact` (Feedback & Institutional Inquiries)
  - `/login`, `/register`, `/forgot-password`, `/reset-password`, `/auth/callback`
- **Protected User Routes (`<ProtectedRoute>`):**
  - `/submit-reading` (Requires authenticated user to anchor field reading to `auth.uid()`)
  - `/profile` (Personal profile management, thermal preferences, personal readings ledger)
  - `/settings` (Preferences, units: Celsius/Fahrenheit, theme: system/dark/light)

---

## 7. Verification & Testing

### 7.1 Verify Build
```bash
npm run build
```
Confirms all components, hooks, Tailwind classes, and routes compile cleanly into production bundles.

### 7.2 Local Development Test
```bash
npm run dev
```
1. Visit `http://localhost:5173`.
2. Notice the diagnostics banner indicating whether Supabase is configured or in Offline Sandbox mode.
3. Test Registration at `/register`. Check your terminal or Supabase Auth logs for the confirmation email.
4. Test Logging in at `/login`. Verify the navbar avatar displays your user initial and links to `/profile`.
5. Navigate to `/submit-reading`. Submit a sample microclimate reading (e.g. 38.5°C, 35% humidity) and verify it appears in your personal ledger on `/profile`.
6. Navigate to `/explore-data`. Click "Bookmark Analysis" to test saving query parameters to `saved_analyses`.
7. Navigate to `/contact`. Submit a message and verify feedback appears without revealing other messages.

---

## 8. Deployment Checklist (Vercel / Netlify / Render)

When deploying to Vercel, Netlify, or Render:
1. Set Environment Variables in the project settings:
   - `VITE_SUPABASE_URL` = your Supabase Project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase Publishable / Anon Key
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Configure Single-Page Application (SPA) redirects:
   - For Netlify: Verify `public/_redirects` contains `/* /index.html 200`
   - For Vercel: Verify `vercel.json` rewrites all requests to `/index.html`
5. Update Supabase **Redirect URLs** with your production domain (e.g., `https://heatshield-solapur.vercel.app/auth/callback`).
