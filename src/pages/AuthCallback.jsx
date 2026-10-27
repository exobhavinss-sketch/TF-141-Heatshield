import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { mapAuthError } from '../utils/authErrors';

export default function AuthCallback() {
  const navigate = useNavigate();
  const { refreshUserData } = useAuth();
  
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
            await refreshUserData();
            if (isMounted) setStatus('success');
            return;
          }
        }

        // 4. Fallback check
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
    <div className="w-full flex-1 flex items-center justify-center py-16 px-6 bg-[#fafafc]">
      <div className="w-full max-w-[460px] bg-white rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-black/[0.06] text-center space-y-6">
        
        {status === 'processing' && (
          <div className="space-y-4 py-6">
            <div className="w-10 h-10 border-2 border-black/10 border-t-[#0071e3] rounded-full animate-spin mx-auto"></div>
            <div className="space-y-1">
              <h2 className="text-[20px] font-semibold text-[#1d1d1f]">
                Verifying Credentials
              </h2>
              <p className="text-[13px] text-[#86868b]">
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
              <h2 className="text-[22px] font-semibold text-[#1d1d1f]">
                Email Verified Successfully
              </h2>
              <p className="text-[13px] text-[#86868b] leading-relaxed">
                Your HeatShield research account is now active and verified.
              </p>
            </div>
            <p className="text-[12px] text-[#86868b]">
              Redirecting to your research profile in <span className="font-semibold text-[#1d1d1f] tabular-nums">{redirectCountdown}s</span>...
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
                className="px-5 py-2.5 rounded-[980px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-[13px] font-medium transition-colors"
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
              <h2 className="text-[22px] font-semibold text-[#1d1d1f]">
                Verification Problem
              </h2>
              <p className="text-[13px] text-[#86868b] leading-relaxed">
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
                className="px-5 py-2.5 rounded-[980px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-[13px] font-medium transition-colors"
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
