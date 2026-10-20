import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
  const { resetPasswordForEmail, isConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setErrorMsg(err.message || 'Unable to send password recovery email. Please verify the address.');
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
            <span>ACCOUNT SECURITY · TF-141</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Enter your email to receive a secure recovery link
          </p>
        </div>

        {submitted ? (
          <div className="rounded-xl bg-surface-container p-space-md border border-secondary/30 space-y-space-sm text-center">
            <span className="material-symbols-outlined text-[36px] text-secondary block mx-auto">mark_email_read</span>
            <h3 className="font-headline-md text-headline-md font-semibold text-primary">
              Recovery Link Dispatched
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              If an account exists for <strong className="text-on-surface">{email}</strong>, a password reset link has been dispatched. Please inspect your inbox and spam folder.
            </p>
            <div className="pt-space-sm">
              <Link
                to="/login"
                className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors inline-block font-semibold"
              >
                Return to Sign In
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
                <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="resetEmail">
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
                  className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !isConfigured}
                className="w-full h-11 rounded-lg bg-primary-container text-on-primary font-headline-md text-body-md font-semibold hover:bg-primary transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
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

            <div className="pt-space-xs border-t border-outline-variant/20 text-center font-body-sm text-xs text-on-surface-variant">
              <span>Remembered your password? </span>
              <Link to="/login" className="text-secondary font-semibold hover:text-primary transition-colors underline">
                Back to Sign In
              </Link>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
