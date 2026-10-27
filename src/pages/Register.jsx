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
  const [resendStatusType, setResendStatusType] = useState('info');

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
    if (loading) return;

    setErrorMsg('');

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

      if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setErrorMsg('An account with this email address already exists. Please sign in instead, or request a password reset if you forgot your credentials.');
        return;
      }

      const requiresConfirmation = !data?.session;
      setSuccessInfo({
        email: email.trim(),
        requiresConfirmation,
      });
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
    <div className="w-full flex-1 flex items-center justify-center py-16 px-6 bg-[#fafafc]">
      <div className="w-full max-w-[460px] bg-white rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-black/[0.06] space-y-6">
        
        {/* Header */}
        <div className="space-y-2 text-center pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[980px] bg-black/[0.04] text-[#1d1d1f] text-[11px] font-mono tracking-wider uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
            <span>RESEARCHER REGISTRATION · TF-141</span>
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
            Create Research Account
          </h1>
          <p className="text-[13px] text-[#86868b]">
            Join the HeatShield microclimate telemetry network
          </p>
        </div>

        {/* Connection Status */}
        {!isConfigured ? (
          <div className="rounded-[16px] bg-[#f5f5f7] p-3.5 border border-black/[0.04] text-[12px] text-[#86868b] leading-relaxed">
            <div className="flex items-center gap-1.5 text-[#ea580c] font-medium mb-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Backend Connection Pending</span>
            </div>
            Configure Supabase in <code className="font-mono text-[#1d1d1f]">.env</code> to connect live authentication.
          </div>
        ) : (
          <div className="rounded-[16px] bg-[#059669]/10 p-3 text-[12px] text-[#059669] flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              <span>Supabase Live Ready</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider">Connected</span>
          </div>
        )}

        {/* Success Message / Instructions */}
        {successInfo ? (
          <div className="rounded-[20px] bg-[#f5f5f7] p-6 space-y-4 border border-black/[0.04]">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-[980px] bg-[#059669]/10 text-[#059669] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">mark_email_read</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-[16px] font-semibold text-[#1d1d1f]">
                  {successInfo.requiresConfirmation ? 'Verify Your Email Address' : 'Account Ready'}
                </h3>
                <p className="text-[13px] text-[#86868b] leading-relaxed">
                  {successInfo.requiresConfirmation ? (
                    <>
                      We have dispatched a verification link to <strong className="text-[#1d1d1f]">{successInfo.email}</strong>. 
                      Please check your inbox and click the link to verify your research credentials before signing in.
                    </>
                  ) : (
                    <>
                      Your account for <strong className="text-[#1d1d1f]">{successInfo.email}</strong> has been initialized successfully.
                    </>
                  )}
                </p>
              </div>
            </div>

            {successInfo.requiresConfirmation && (
              <div className="pt-2 border-t border-black/[0.04] space-y-2">
                <div className="flex items-center justify-between text-[12px] text-[#86868b]">
                  <span>Didn't receive the email?</span>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || resendLoading}
                    className="font-medium text-[#0071e3] hover:underline disabled:opacity-50 disabled:no-underline inline-flex items-center gap-1"
                  >
                    {resendLoading ? (
                      <>
                        <div className="w-3 h-3 border-2 border-[#0071e3]/20 border-t-[#0071e3] rounded-full animate-spin"></div>
                        <span>Dispatching...</span>
                      </>
                    ) : resendCooldown > 0 ? (
                      <span>Resend in {resendCooldown}s</span>
                    ) : (
                      <span>Resend Email</span>
                    )}
                  </button>
                </div>

                {resendStatusMsg && (
                  <div className={`p-2.5 rounded-[10px] text-[12px] ${
                    resendStatusType === 'success' 
                      ? 'bg-[#059669]/10 text-[#059669]' 
                      : 'bg-[#dc2626]/10 text-[#dc2626]'
                  }`}>
                    {resendStatusMsg}
                  </div>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-[980px] bg-[#0071e3] text-white text-[13px] font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:bg-[#0077ed] transition-colors"
              >
                Proceed to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Error Alert Box */}
            {errorMsg && (
              <div className="rounded-[16px] bg-[#dc2626]/10 text-[#dc2626] p-3.5 text-[12px] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">error</span>
                <div className="flex-1 leading-relaxed font-medium">{errorMsg}</div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="regFullName">
                  Full Name &amp; Title
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
                  className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b] disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="regEmail">
                  Institutional Email
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
                  className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b] disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="regPassword">
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
                    placeholder="Min 8 chars"
                    className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b] disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="regConfirmPassword">
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
                    className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b] disabled:opacity-60"
                  />
                </div>
              </div>

              <p className="text-[11px] text-[#86868b] pt-1">
                By registering, you acknowledge that in-situ field telemetry will be subject to peer-review validation.
              </p>

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full h-11 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[14px] font-medium transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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
            <div className="pt-3 border-t border-black/[0.04] text-center text-[13px] text-[#86868b]">
              <span>Already registered with HeatShield? </span>
              <Link to="/login" className="text-[#0071e3] font-medium hover:underline">
                Sign in here
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
