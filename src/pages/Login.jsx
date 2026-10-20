import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signIn, user, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/profile';

  // If already logged in, redirect away
  if (user) {
    navigate(redirectPath, { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your institutional email and password.');
      return;
    }

    setLoading(true);
    try {
      await signIn({ email, password });
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error('[HeatShield Login] Error:', err);
      // Clean, user-friendly message
      if (err.message?.includes('Invalid login credentials')) {
        setErrorMsg('Invalid email or password. Please verify your credentials or reset your password.');
      } else if (err.message?.includes('Email not confirmed')) {
        setErrorMsg('Your email address has not been confirmed. Please check your inbox for the verification link.');
      } else {
        setErrorMsg(err.message || 'Unable to sign in. Please verify your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-space-xl px-margin">
      <div className="w-full max-w-[460px] bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 space-y-space-md">
        
        {/* Academic Header */}
        <div className="space-y-space-xs text-center border-b border-outline-variant/20 pb-space-sm">
          <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-DEFAULT bg-surface-container text-on-surface text-label-code font-label-code">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>RESEARCHER PORTAL · TF-141</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-semibold tracking-tight">
            Sign In to HeatShield
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            MIT Vishwaprayag University Microclimate Intelligence
          </p>
        </div>

        {/* Configuration Notice if Supabase keys not set */}
        {!isConfigured && (
          <div className="rounded-lg bg-surface-container p-space-sm border border-outline-variant/40 text-xs font-body-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5 text-secondary font-semibold mb-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Backend Connection Pending</span>
            </div>
            Configure <code className="text-primary font-mono font-semibold">VITE_SUPABASE_URL</code> in your <code className="font-mono">.env</code> to connect live authentication.
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="rounded-lg bg-error-container text-on-error-container p-space-sm border border-error/30 text-body-sm flex items-start gap-2">
            <span className="material-symbols-outlined text-[18px] text-error flex-shrink-0 mt-0.5">error</span>
            <div className="flex-1 text-xs leading-relaxed">{errorMsg}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-space-md">
          <div className="space-y-space-xs">
            <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="loginEmail">
              Institutional or Research Email
            </label>
            <input
              id="loginEmail"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@mitvpu.ac.in"
              className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
            />
          </div>

          <div className="space-y-space-xs">
            <div className="flex items-center justify-between">
              <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="loginPassword">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="font-body-sm text-xs text-secondary hover:text-primary transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="loginPassword"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-lg bg-primary-container text-on-primary font-headline-md text-body-md font-semibold hover:bg-primary transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock_open</span>
                <span>Sign In to Platform</span>
              </>
            )}
          </button>
        </form>

        {/* Footer / Links */}
        <div className="pt-space-xs border-t border-outline-variant/20 text-center font-body-sm text-xs text-on-surface-variant">
          <span>Don't have a research account? </span>
          <Link to="/register" className="text-secondary font-semibold hover:text-primary transition-colors underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}
