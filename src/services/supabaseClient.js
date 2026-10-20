/**
 * HeatShield (TF-141) — Supabase Client Service
 * Centralized, singleton client initialization and runtime validation.
 * 
 * Non-negotiable security:
 * - Only public/publishable keys are read from import.meta.env.
 * - Never import or expose service-role keys or database passwords.
 */

import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// Clean and sanitize string inputs (strip quotes and whitespace)
const cleanString = (val) => {
  if (typeof val !== 'string') return '';
  return val.trim().replace(/^["']|["']$/g, '').trim();
};

const supabaseUrl = cleanString(rawUrl);
const supabaseKey = cleanString(rawKey);

/**
 * Validates whether valid Supabase configuration is present in the environment.
 */
export function isSupabaseConfigured() {
  const isValidUrl = Boolean(
    supabaseUrl && 
    (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) && 
    !supabaseUrl.includes('your-project-id') &&
    !supabaseUrl.includes('your-project-ref')
  );
  const isValidKey = Boolean(
    supabaseKey && 
    supabaseKey.length > 20 && 
    !supabaseKey.includes('your-supabase-publishable') &&
    !supabaseKey.includes('your-public-key')
  );

  return Boolean(isValidUrl && isValidKey);
}

/**
 * Returns configuration diagnostics for friendly user guidance.
 */
export function getSupabaseConfigStatus() {
  const configured = isSupabaseConfigured();
  return {
    configured,
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabaseKey),
    urlMasked: supabaseUrl ? `${supabaseUrl.slice(0, 14)}...` : null,
    keyType: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY 
      ? 'publishable' 
      : (import.meta.env.VITE_SUPABASE_ANON_KEY ? 'anon_fallback' : 'none'),
  };
}

let client = null;

if (isSupabaseConfigured()) {
  try {
    client = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'heatshield-auth-token',
      },
    });
  } catch (error) {
    console.error('[HeatShield Supabase] Client initialization failed:', error);
  }
} else {
  // Helpful developer guidance in console during initial setup
  if (import.meta.env.DEV) {
    console.info(
      '%c[HeatShield Supabase]%c Backend not connected yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env to activate authentication and live reading telemetry.',
      'color: #016a60; font-weight: bold;',
      'color: inherit;'
    );
  }
}

export const supabase = client;
export default supabase;
