import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function handleAuthCallback() {
      if (!isSupabaseConfigured() || !supabase) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage('Supabase is not configured. Please check your environment variables.');
        }
        return;
      }

      try {
        // 1. Check for authorization code in search parameters (PKCE flow)
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        if (error) {
          throw new Error(errorDescription || error);
        }

        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          
          if (data?.session) {
            await refreshUserData();
            if (isMounted) setStatus('success');
            return;
          }
        }

        // 2. Check for hash fragment token (Implicit flow)
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          if (session) {
            await refreshUserData();
            if (isMounted) setStatus('success');
            return;
          }
        }

        // 3. Fallback: check if session already established
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await refreshUserData();
          if (isMounted) setStatus('success');
          return;
        }

        throw new Error('No valid authentication token or verification code found in this callback.');
      } catch (err) {
        console.error('[HeatShield Auth Callback] Error:', err);
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err.message || 'Verification link is invalid or has expired.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [refreshUserData]);

  return (
    <div className="w-full flex-1 flex items-center justify-center py-space-xl px-margin">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 text-center space-y-space-md">
        
        {status === 'processing' && (
          <div className="space-y-space-md py-space-md">
            <div className="w-12 h-12 border-3 border-primary border-t-secondary rounded-full animate-spin mx-auto"></div>
            <h2 className="font-headline-md text-headline-md font-semibold text-primary">
              Verifying Institutional Credentials
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Confirming your security token with the HeatShield authentication service...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-space-md py-space-sm">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">check_circle</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-semibold text-primary">
              Email Verified Successfully
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Your HeatShield research account is now active and verified. You may proceed to in-situ telemetry reporting or analytical modeling.
            </p>
            <div className="pt-space-xs flex justify-center gap-space-sm">
              <Link
                to="/profile"
                className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors font-semibold shadow-sm"
              >
                Go to Profile
              </Link>
              <Link
                to="/submit-reading"
                className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md transition-colors"
              >
                Submit Reading
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-space-md py-space-sm">
            <div className="w-12 h-12 rounded-full bg-error-container text-on-error-container flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[28px]">error</span>
            </div>
            <h2 className="font-headline-md text-headline-md font-semibold text-primary">
              Verification Problem
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              {errorMessage || 'The verification link may have expired or is malformed.'}
            </p>
            <div className="pt-space-xs flex justify-center gap-space-sm">
              <Link
                to="/login"
                className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors font-semibold shadow-sm"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
