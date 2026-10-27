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
    <div className="w-full flex-1 flex items-center justify-center py-16 px-6 bg-[#fafafc]">
      <div className="w-full max-w-[440px] bg-white rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-black/[0.06] space-y-6">
        
        {/* Header */}
        <div className="space-y-2 text-center pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[980px] bg-black/[0.04] text-[#1d1d1f] text-[11px] font-mono tracking-wider uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
            <span>RESEARCHER PORTAL · TF-141</span>
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
            Sign In to HeatShield
          </h1>
          <p className="text-[13px] text-[#86868b]">
            MIT Vishwaprayag University Microclimate Intelligence
          </p>
        </div>

        {/* Connection Status */}
        {!isConfigured ? (
          <div className="rounded-[16px] bg-[#f5f5f7] p-3.5 border border-black/[0.04] text-[12px] text-[#86868b] leading-relaxed">
            <div className="flex items-center gap-1.5 text-[#ea580c] font-medium mb-1">
              <span className="material-symbols-outlined text-[16px]">info</span>
              <span>Backend Connection Pending</span>
            </div>
            Configure <code className="text-[#1d1d1f] font-mono font-medium">VITE_SUPABASE_URL</code> and <code className="text-[#1d1d1f] font-mono font-medium">VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code className="font-mono">.env</code> to connect live authentication.
          </div>
        ) : (
          <div className="rounded-[16px] bg-[#059669]/10 p-3 text-[12px] text-[#059669] flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
              <span>Supabase client configured</span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-wider">Reachability checked on sign-in</span>
          </div>
        )}

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="rounded-[16px] bg-[#dc2626]/10 text-[#dc2626] p-3.5 text-[12px] flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] flex-shrink-0 mt-0.5">error</span>
            <div className="flex-1 leading-relaxed font-medium">{errorMsg}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="loginEmail">
              Institutional Email
            </label>
            <input
              id="loginEmail"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="researcher@mitvpu.ac.in"
              className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b]"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[12px]">
              <label className="font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="loginPassword">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[#0071e3] hover:underline"
              >
                Forgot?
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
              className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[14px] font-medium transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
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
        <div className="pt-3 border-t border-black/[0.04] text-center text-[13px] text-[#86868b]">
          <span>Don't have a research account? </span>
          <Link to="/register" className="text-[#0071e3] font-medium hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}
