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
    // Check if recovery session is active (either from session state or hash fragment)
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
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-space-xl">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-space-sm"></div>
        <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
          Validating Password Recovery Token...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center py-space-xl px-margin">
      <div className="w-full max-w-[460px] bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 space-y-space-md">
        
        {/* Academic Header */}
        <div className="space-y-space-xs text-center border-b border-outline-variant/20 pb-space-sm">
          <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-DEFAULT bg-surface-container text-on-surface text-label-code font-label-code">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>CREDENTIAL RECOVERY · TF-141</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-semibold tracking-tight">
            Set New Password
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Create a secure new password for your HeatShield account
          </p>
        </div>

        {success ? (
          <div className="rounded-xl bg-surface-container p-space-md border border-secondary/30 space-y-space-sm text-center">
            <span className="material-symbols-outlined text-[36px] text-secondary block mx-auto">task_alt</span>
            <h3 className="font-headline-md text-headline-md font-semibold text-primary">
              Password Updated Successfully
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Your credentials have been securely updated. Redirecting to sign in...
            </p>
            <div className="pt-space-sm">
              <Link
                to="/login"
                className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors inline-block font-semibold"
              >
                Sign In Now
              </Link>
            </div>
          </div>
        ) : !hasValidSession ? (
          <div className="rounded-xl bg-surface-container p-space-md border border-error/30 space-y-space-sm text-center">
            <span className="material-symbols-outlined text-[36px] text-error block mx-auto">link_off</span>
            <h3 className="font-headline-md text-headline-md font-semibold text-primary">
              Invalid or Expired Link
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              This password recovery link has either expired or already been utilized. Please request a new recovery link.
            </p>
            <div className="pt-space-sm">
              <Link
                to="/forgot-password"
                className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors inline-block font-semibold"
              >
                Request New Link
              </Link>
            </div>
          </div>
        ) : (
          <>
            {errorMsg && (
              <div className="rounded-lg bg-error-container text-on-error-container p-space-sm border border-error/30 text-body-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-error flex-shrink-0 mt-0.5">error</span>
                <div className="flex-1 text-xs leading-relaxed">{errorMsg}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-space-md">
              <div className="space-y-space-xs">
                <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="newPassword">
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
                  className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                />
              </div>

              <div className="space-y-space-xs">
                <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="confirmNewPassword">
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
                  className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-11 rounded-lg bg-primary-container text-on-primary font-headline-md text-body-md font-semibold hover:bg-primary transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
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
