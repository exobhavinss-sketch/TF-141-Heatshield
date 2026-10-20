import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mapAuthError } from '../utils/authErrors';

export default function Register() {
  const { signUp, resendVerificationEmail, user, isConfigured } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState(null);

  // Resend verification state with cooldown
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendStatusMsg, setResendStatusMsg] = useState('');
  const [resendStatusType, setResendStatusType] = useState('info'); // 'info' | 'error' | 'success'

  // Manage resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (user) {
    navigate('/profile', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // Strict guard against duplicate rapid submissions

    setErrorMsg('');

    // Validations
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name for your academic profile.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please provide a valid research or institutional email.');
      return;
    }
    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long for research account security.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both entries.');
      return;
    }

    setLoading(true);
    try {
      const data = await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
      });

      // Supabase user enumeration protection: if user already registered, identities array is empty
      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setErrorMsg('An account with this email address already exists. Please sign in instead, or request a password reset if you forgot your credentials.');
        return;
      }

      // Check whether user requires confirmation
      const requiresConfirmation = !data?.session;
      setSuccessInfo({
        email: email.trim(),
        requiresConfirmation,
      });
      // Start initial 60s cooldown for resend
      setResendCooldown(60);
    } catch (err) {
      console.error('[HeatShield Registration] Error:', err);
      setErrorMsg(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resendLoading || !successInfo?.email) return;

    setResendLoading(true);
    setResendStatusMsg('');

    try {
      await resendVerificationEmail(successInfo.email);
      setResendStatusType('success');
      setResendStatusMsg('A fresh verification link has been dispatched to your email.');
      setResendCooldown(60);
    } catch (err) {
      console.error('[HeatShield Resend Verification] Error:', err);
      setResendStatusType('error');
      setResendStatusMsg(mapAuthError(err));
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-space-xl px-margin">
      <div className="w-full max-w-[480px] bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 space-y-space-md">
        
        {/* Academic Header */}
        <div className="space-y-space-xs text-center border-b border-outline-variant/20 pb-space-sm">
          <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-DEFAULT bg-surface-container text-on-surface text-label-code font-label-code">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>RESEARCHER REGISTRATION · TF-141</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-semibold tracking-tight">
            Create Research Account
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Join the HeatShield microclimate telemetry and urban analysis network
          </p>
        </div>

        {/* Connection Status: Confirmed Live Badge vs Pending Guidance */}
        {!isConfigured ? (
          <div className="rounded-lg bg-surface-container p-space-sm border border-outline-variant/40 text-xs font-body-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5 text-secondary font-semibold mb-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Backend Connection Pending</span>
            </div>
            Configure <code className="text-primary font-mono font-semibold">VITE_SUPABASE_URL</code> and <code className="text-primary font-mono font-semibold">VITE_SUPABASE_PUBLISHABLE_KEY</code> in your <code className="font-mono">.env</code> to connect live authentication. If you just added or updated <code className="font-mono">.env</code>, restart the Vite dev server (<code className="font-mono">npm run dev</code>) so Vite can reload the environment variables.
          </div>
        ) : (
          <div className="rounded-lg bg-surface-container-low p-2.5 border border-secondary/30 text-xs font-body-sm text-on-surface-variant flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-secondary font-medium">
              <span className="w-2 h-2 rounded-full bg-secondary"></span>
              <span>Supabase Live Authentication Ready</span>
            </div>
            <span className="font-label-code text-[10px] text-outline uppercase tracking-wider">Connected</span>
          </div>
        )}

        {/* Success Message / Email Confirmation Instructions */}
        {successInfo ? (
          <div className="rounded-xl bg-surface-container p-space-md border border-secondary/30 space-y-space-md">
            <div className="flex items-start gap-space-sm text-secondary">
              <span className="material-symbols-outlined text-[28px] text-secondary">mark_email_read</span>
              <div>
                <h3 className="font-headline-md text-headline-md font-semibold text-primary">
                  {successInfo.requiresConfirmation ? 'Verify Your Email Address' : 'Account Ready'}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  {successInfo.requiresConfirmation ? (
                    <>
                      We have dispatched a verification link to <strong className="text-on-surface">{successInfo.email}</strong>. 
                      Please check your inbox (and spam folder) and click the link to verify your research credentials before signing in.
                    </>
                  ) : (
                    <>
                      Your account for <strong className="text-on-surface">{successInfo.email}</strong> has been initialized successfully. You may proceed to sign in.
                    </>
                  )}
                </p>
              </div>
            </div>

            {successInfo.requiresConfirmation && (
              <>
                <div className="p-space-sm bg-surface-container-lowest rounded-lg border border-outline-variant/30 text-xs font-body-sm text-on-surface-variant space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-primary">
                    <span className="material-symbols-outlined text-[15px]">security</span>
                    <span>Verification &amp; Security Note</span>
                  </div>
                  <p>Unverified accounts remain pending and cannot submit in-situ telemetry readings until confirmed.</p>
                </div>

                {/* Resend Verification Section with Cooldown */}
                <div className="pt-space-xs border-t border-outline-variant/20 space-y-space-xs">
                  <div className="flex items-center justify-between text-xs font-body-sm text-on-surface-variant">
                    <span>Did not receive the verification email?</span>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendCooldown > 0 || resendLoading}
                      className="font-semibold text-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                    >
                      {resendLoading ? (
                        <>
                          <span className="w-3 h-3 border-2 border-secondary border-t-transparent rounded-full animate-spin"></span>
                          <span>Dispatching...</span>
                        </>
                      ) : resendCooldown > 0 ? (
                        <span>Resend in {resendCooldown}s</span>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[14px]">send</span>
                          <span>Resend Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  {resendStatusMsg && (
                    <div className={`p-2 rounded text-xs ${
                      resendStatusType === 'success' 
                        ? 'bg-secondary-container text-on-secondary-container border border-secondary/30' 
                        : 'bg-error-container text-on-error-container border border-error/30'
                    }`}>
                      {resendStatusMsg}
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="pt-space-xs flex justify-end gap-space-sm">
              <Link
                to="/login"
                className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors font-medium shadow-sm inline-block"
              >
                Proceed to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error Alert Box */}
            {errorMsg && (
              <div className="rounded-lg bg-error-container text-on-error-container p-space-sm border border-error/30 text-body-sm flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-error flex-shrink-0 mt-0.5">error</span>
                <div className="flex-1 text-xs leading-relaxed">{errorMsg}</div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-space-sm">
              <div className="space-y-space-xs">
                <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="regFullName">
                  Full Name &amp; Academic Title
                </label>
                <input
                  id="regFullName"
                  type="text"
                  autoComplete="name"
                  required
                  disabled={loading}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Prof. / Dr. / Researcher Name"
                  className="w-full bg-surface-container-low px-space-md py-2 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30 disabled:opacity-60"
                />
              </div>

              <div className="space-y-space-xs">
                <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="regEmail">
                  Institutional / Research Email
                </label>
                <input
                  id="regEmail"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@mitvpu.ac.in"
                  className="w-full bg-surface-container-low px-space-md py-2 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30 disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                <div className="space-y-space-xs">
                  <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="regPassword">
                    Password
                  </label>
                  <input
                    id="regPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-surface-container-low px-space-md py-2 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-space-xs">
                  <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="regConfirmPassword">
                    Confirm Password
                  </label>
                  <input
                    id="regConfirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    disabled={loading}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-surface-container-low px-space-md py-2 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30 disabled:opacity-60"
                  />
                </div>
              </div>

              <p className="font-caption-caps text-caption-caps text-outline pt-1">
                By registering, you acknowledge that in-situ field telemetry will be subject to peer-review validation.
              </p>

              <button
                type="submit"
                disabled={loading || !isConfigured}
                aria-disabled={loading || !isConfigured}
                className="w-full h-11 rounded-lg bg-primary-container text-on-primary font-headline-md text-body-md font-semibold hover:bg-primary transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-space-sm"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                    <span>Creating Profile...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                    <span>Register Account</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer / Links */}
            <div className="pt-space-xs border-t border-outline-variant/20 text-center font-body-sm text-xs text-on-surface-variant">
              <span>Already registered with HeatShield? </span>
              <Link to="/login" className="text-secondary font-semibold hover:text-primary transition-colors underline">
                Sign in here
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
