/**
 * HeatShield (TF-141) — Auth Redirect URL Resolver
 * 
 * Determines the correct canonical redirect URL for Supabase Auth flows
 * (email verification callback, password recovery).
 * 
 * Rules:
 * 1. Environment variable override (VITE_AUTH_REDIRECT_URL or VITE_SITE_URL) if specified.
 * 2. Local development: Preserves local developer origin (http://localhost:3000) when running on localhost.
 * 3. Production: Uses the verified production deployed origin (https://heatshield-tf141.onrender.com).
 * 
 * Verified Supabase Allowed Redirect URLs in production:
 * - https://heatshield-tf141.onrender.com/auth/callback
 * - https://heatshield-tf141.onrender.com/reset-password
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

    // In production browser, if on the primary Render domain, use window.location.origin
    if (origin.includes('heatshield-tf141.onrender.com')) {
      return `${origin}${normalizedPath}`;
    }
  }

  // 3. Default production deployed origin
  return `${PRODUCTION_ORIGIN}${normalizedPath}`;
}
