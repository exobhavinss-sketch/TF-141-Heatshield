/**
 * HeatShield (TF-141) — Auth Redirect URL Resolver
 * 
 * Determines the correct canonical redirect URL for Supabase Auth flows
 * (email verification callback, password recovery).
 * 
 * Rules:
 * 1. Environment variable override (VITE_AUTH_REDIRECT_URL or VITE_SITE_URL) if specified.
 * 2. Local development: Preserves local developer origin (http://localhost:3000) when running on localhost.
 * 3. Any deployed environment: Uses the current browser origin so Netlify
 *    production and deploy-preview links return to the same site.
 * 
 * Configure the active production and local origins in the Supabase Auth URL
 * allow-list. Do not hard-code one hosting provider's domain here.
 */

export const PRODUCTION_ORIGIN = 'https://heatshield-tf141.onrender.com';
export const LOCAL_DEFAULT_ORIGIN = 'http://localhost:3000';

/**
 * Returns the canonical redirect URL for auth actions.
 * @param {'/auth/callback' | '/reset-password' | string} path
 * @returns {string} Fully qualified redirect URL
 */
export function getAuthRedirectUrl(path = '/auth/callback') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // 1. Explicit override via environment variables (e.g. CI/CD or preview staging)
  const envUrl = import.meta.env.VITE_AUTH_REDIRECT_URL || import.meta.env.VITE_SITE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    return `${envUrl.trim().replace(/\/+$/, '')}${normalizedPath}`;
  }

  // 2. Client-side browser checks
  if (typeof window !== 'undefined' && window.location) {
    const { hostname, origin } = window.location;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';

    // In local development, preserve current localhost origin (e.g. http://localhost:3000)
    if (isLocalhost) {
      return `${origin}${normalizedPath}`;
    }

    // On Netlify, Render, and deploy previews, return to the host initiating
    // the auth flow. The Supabase URL allow-list remains the security boundary.
    return `${origin}${normalizedPath}`;
  }

  // 3. Default production deployed origin
  return `${PRODUCTION_ORIGIN}${normalizedPath}`;
}
