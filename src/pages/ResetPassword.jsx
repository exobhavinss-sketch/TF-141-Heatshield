import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabaseClient';

export default function ResetPassword() {
  const { updatePassword, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (session) {
      setHasValidSession(true);
      setCheckingSession(false);
    } else if (supabase) {
      supabase.auth.getSession().then(({ data: { session: s } }) => {
        setHasValidSession(Boolean(s));
        setCheckingSession(false);
      });
    } else {
      setCheckingSession(false);
    }
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both inputs.');
      return;
    }

    setSubmitting(true);
    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 3000);
    } catch (err) {
      console.error('[HeatShield Password Reset] Error:', err);
      setErrorMsg(err.message || 'Unable to update password. Your recovery link may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || checkingSession) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-16">
        <div className="w-8 h-8 border-2 border-black/10 border-t-[#0071e3] rounded-full animate-spin mb-3"></div>
        <span className="font-mono text-[11px] text-[#86868b] uppercase tracking-wider">
          Validating Password Recovery Token...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center py-16 px-6 bg-[#fafafc]">
      <div className="w-full max-w-[440px] bg-white rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-black/[0.06] space-y-6">
        
        {/* Header */}
        <div className="space-y-2 text-center pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[980px] bg-black/[0.04] text-[#1d1d1f] text-[11px] font-mono tracking-wider uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
            <span>CREDENTIAL RECOVERY · TF-141</span>
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
            Set New Password
          </h1>
          <p className="text-[13px] text-[#86868b]">
            Create a secure new password for your HeatShield account
          </p>
        </div>

        {success ? (
          <div className="rounded-[20px] bg-[#f5f5f7] p-6 space-y-4 text-center border border-black/[0.04]">
            <div className="w-12 h-12 rounded-[980px] bg-[#059669]/10 text-[#059669] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold text-[#1d1d1f]">
                Password Updated Successfully
              </h3>
              <p className="text-[13px] text-[#86868b] leading-relaxed">
                Your credentials have been securely updated. Redirecting to sign in...
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-[980px] bg-[#0071e3] text-white text-[13px] font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:bg-[#0077ed] transition-colors inline-block"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        ) : !hasValidSession ? (
          <div className="rounded-[20px] bg-[#f5f5f7] p-6 space-y-4 text-center border border-black/[0.04]">
            <div className="w-12 h-12 rounded-[980px] bg-[#dc2626]/10 text-[#dc2626] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">link_off</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold text-[#1d1d1f]">
                Invalid or Expired Link
              </h3>
              <p className="text-[13px] text-[#86868b] leading-relaxed">
                This password recovery link has either expired or already been utilized. Please request a new recovery link.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/forgot-password"
                className="px-5 py-2.5 rounded-[980px] bg-[#0071e3] text-white text-[13px] font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:bg-[#0077ed] transition-colors inline-block"
              >
                Request New Link
              </Link>
            </div>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="rounded-[16px] bg-[#dc2626]/10 text-[#dc2626] p-3.5 text-[12px] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">error</span>
                <div className="flex-1 leading-relaxed font-medium">{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="confirmNewPassword">
                  Confirm New Password
                </label>
                <input
                  id="confirmNewPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[14px] font-medium transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Updating Credentials...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">key</span>
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
}
