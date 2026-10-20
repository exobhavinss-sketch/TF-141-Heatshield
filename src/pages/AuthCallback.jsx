import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { mapAuthError } from '../utils/authErrors';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { user, refreshUserData } = useAuth();
  
  const [status, setStatus] = useState('processing'); // 'processing' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(3);

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
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const tokenHash = params.get('token_hash');
        const type = params.get('type');
        const next = params.get('next');
        const error = params.get('error');
        const errorDescription = params.get('error_description');

        // Check for error parameters returned from Supabase
        if (error) {
          throw new Error(errorDescription || error);
        }

        // 1. Token Hash Verification (OTP verification link)
        if (tokenHash) {
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type || 'signup',
          });

          if (verifyError) throw verifyError;

          if (type === 'recovery') {
            navigate('/reset-password', { replace: true });
            return;
          }

          if (data?.session || data?.user) {
            await refreshUserData();
            if (isMounted) setStatus('success');
            return;
          }
        }

        // 2. PKCE Authorization Code Exchange
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          
          if (type === 'recovery' || next === '/reset-password') {
            navigate('/reset-password', { replace: true });
            return;
          }

          if (data?.session) {
            await refreshUserData();
            if (isMounted) setStatus('success');
            return;
          }
        }

        // 3. Hash Fragment Token (Implicit Grant flow)
        const hash = window.location.hash;
        if (hash && (hash.includes('access_token') || hash.includes('type='))) {
          const hashParams = new URLSearchParams(hash.replace(/^#/, ''));
          const hashError = hashParams.get('error_description') || hashParams.get('error');
          const hashType = hashParams.get('type');

          if (hashError) {
            throw new Error(hashError);
          }

          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          if (hashType === 'recovery') {
            navigate('/reset-password', { replace: true });
            return;
          }

          if (session) {
            await refreshUserData();
            if (isMounted) setStatus('success');
            return;
          }
        }

        // 4. Fallback: check if session already established
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
          setErrorMessage(mapAuthError(err) || 'Verification link is invalid or has expired.');
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [refreshUserData, navigate]);

  // Automated redirect countdown upon successful verification
  useEffect(() => {
    if (status !== 'success') return;

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/profile', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status, navigate]);

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
            <p className="font-caption-caps text-caption-caps text-on-surface-variant">
              Redirecting to your research profile in <span className="font-semibold text-primary">{redirectCountdown}s</span>...
            </p>
            <div className="pt-space-xs flex justify-center gap-space-sm">
              <Link
                to="/profile"
                className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors font-semibold shadow-sm"
              >
                Go to Profile Now
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
              <Link
                to="/register"
                className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
