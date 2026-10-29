import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { mapAuthError } from '../utils/authErrors';

export default function AuthCallback() {
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('processing');
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

        if (error) {
          throw new Error(errorDescription || error);
        }

        // 1. Token Hash Verification
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

          if (data?.session) {
            if (isMounted) setStatus('success');
            return;
          }
          if (data?.user) {
            navigate('/login', { replace: true });
            return;
          }
        }

        // 2. The Supabase client processes PKCE codes during initialization.
        // Read that session here instead of exchanging the same code twice.
        if (code) {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          if (type === 'recovery' || next === '/reset-password') {
            navigate('/reset-password', { replace: true });
            return;
          }

          if (session) {
            if (isMounted) setStatus('success');
            return;
          }
        }

        // 3. Hash Fragment Token
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
            if (isMounted) setStatus('success');
            return;
          }
        }

        // 4. Fallback check
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          if (isMounted) setStatus('success');
          return;
        }

        throw new Error('No valid authentication token or verification code found in this callback.');
      } catch (err) {
        const safeMessage = mapAuthError(err) || 'Verification link is invalid or has expired.';
        console.warn('[HeatShield Auth Callback]', safeMessage);
        if (isMounted) {
          setStatus('error');
          setErrorMessage(safeMessage);
        }
      } finally {
        // Remove callback parameters and tokens from the visible/history URL.
        if (window.location.search || window.location.hash) {
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }

    handleAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

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
    <div className="w-full flex-1 flex items-center justify-center py-16 px-6 bg-[#fafafc] dark:bg-[#101114] text-[#1d1d1f] dark:text-[#f5f5f7]">
      <div className="w-full max-w-[460px] bg-white dark:bg-[#191b20] rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/[0.06] dark:border-white/10 text-center space-y-6">
        
        {status === 'processing' && (
          <div className="space-y-4 py-6">
            <div className="w-10 h-10 border-2 border-black/10 dark:border-white/10 border-t-[#0071e3] rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <h2 className="text-[20px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Verifying Credentials
              </h2>
              <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4]">
                Confirming your security token with the HeatShield authentication service...
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4 py-4">
            <div className="w-12 h-12 rounded-[980px] bg-[#059669]/10 text-[#059669] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">check_circle</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Email Verified Successfully
              </h2>
              <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                Your HeatShield research account is now active and verified.
              </p>
            </div>
            <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4]">
              Redirecting to your research profile in <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">{redirectCountdown}s</span>...
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <Link
                to="/profile"
                className="px-5 py-2.5 rounded-[980px] bg-[#0071e3] text-white text-[13px] font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:bg-[#0077ed] transition-colors"
              >
                Go to Profile
              </Link>
              <Link
                to="/submit-reading"
                className="px-5 py-2.5 rounded-[980px] bg-[#f5f5f7] dark:bg-[#22252b] hover:bg-[#e8e8ed] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] text-[13px] font-medium transition-colors border border-black/5 dark:border-white/10"
              >
                Submit Reading
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4 py-4">
            <div className="w-12 h-12 rounded-[980px] bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">error</span>
            </div>
            <div className="space-y-1">
              <h2 className="text-[22px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Verification Problem
              </h2>
              <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                {errorMessage || 'The verification link may have expired or is malformed.'}
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-2">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-[980px] bg-[#0071e3] text-white text-[13px] font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:bg-[#0077ed] transition-colors"
              >
                Return to Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-[980px] bg-[#f5f5f7] dark:bg-[#22252b] hover:bg-[#e8e8ed] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] text-[13px] font-medium transition-colors border border-black/5 dark:border-white/10"
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
