import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mapAuthError } from '../utils/authErrors';

export default function ForgotPassword() {
  const { resetPasswordForEmail, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPasswordForEmail(email.trim());
      setSubmitted(true);
    } catch (err) {
      console.error('[HeatShield Password Reset] Error:', err);
      setErrorMsg(mapAuthError(err) || 'Unable to send password recovery email. Please verify the address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 flex items-center justify-center py-16 px-6 bg-[#fafafc] dark:bg-[#101114] text-[#1d1d1f] dark:text-[#f5f5f7]">
      <div className="w-full max-w-[440px] bg-white dark:bg-[#191b20] rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/[0.06] dark:border-white/10 space-y-6">
        
        {/* Header */}
        <div className="space-y-2 text-center pb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[980px] bg-black/[0.04] dark:bg-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] text-[11px] font-mono tracking-wider uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
            <span>ACCOUNT RECOVERY · TF-141</span>
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7]">
            Reset Password
          </h1>
          <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4]">
            Enter your email to receive a secure recovery link
          </p>
        </div>

        {submitted ? (
          <div className="rounded-[20px] bg-[#f5f5f7] dark:bg-[#22252b] p-6 space-y-4 text-center border border-black/[0.04] dark:border-white/10">
            <div className="w-12 h-12 rounded-[980px] bg-[#059669]/10 text-[#059669] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">
                Recovery Link Dispatched
              </h3>
              <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">
                If an account exists for <strong className="text-[#1d1d1f] dark:text-[#f5f5f7]">{email}</strong>, a password reset link has been dispatched. Please inspect your inbox and spam folder.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-[980px] bg-[#0071e3] text-white text-[13px] font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:bg-[#0077ed] transition-colors inline-block"
              >
                Return to Sign In
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
                <label className="text-[12px] font-medium text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block" htmlFor="resetEmail">
                  Account Email Address
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="researcher@mitvpu.ac.in"
                  className="w-full h-11 bg-[#f5f5f7] dark:bg-[#22252b] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:bg-white dark:focus:bg-[#22252b] focus:border-black/20 dark:focus:border-[#2997ff] border border-transparent dark:border-white/10 transition-all placeholder:text-[#86868b] dark:placeholder:text-[#6e6e73]"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full h-11 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[14px] font-medium transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Sending Recovery Link...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
                    <span>Send Reset Email</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-black/[0.04] dark:border-white/10 text-center text-[13px] text-[#86868b] dark:text-[#a5a9b4]">
              <span>Remembered your password? </span>
              <Link to="/login" className="text-[#0071e3] font-medium hover:underline">
                Back to Sign In
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
