import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireVerifiedEmail = false }) {
  const { user, loading, isConfigured } = useAuth();
  const location = useLocation();

  // 1. Session determination loading state
  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center py-space-xl">
        <div className="w-10 h-10 border-3 border-primary-container border-t-secondary rounded-full animate-spin mb-space-md"></div>
        <span className="font-label-code text-label-code text-on-surface-variant uppercase tracking-wider">
          Verifying Research Credentials...
        </span>
      </div>
    );
  }

  // 2. Unconfigured Supabase environment friendly guidance
  if (!isConfigured) {
    return (
      <div className="max-w-[700px] mx-auto px-margin py-space-xl">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md border border-outline-variant/40 space-y-space-md">
          <div className="flex items-center gap-space-sm text-tertiary">
            <span className="material-symbols-outlined text-[24px]">cloud_off</span>
            <h2 className="font-headline-md text-headline-md font-semibold text-primary">
              Supabase Backend Connection Pending
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            This protected research route requires an active connection to your Supabase project. To authenticate, submit in-situ telemetry readings, or manage your personal research profile, configure your environment variables:
          </p>
          <div className="bg-surface-container-high rounded-lg p-space-md font-label-code text-xs space-y-1 text-on-surface">
            <div><span className="text-secondary font-bold">VITE_SUPABASE_URL</span>=https://your-project.supabase.co</div>
            <div><span className="text-secondary font-bold">VITE_SUPABASE_PUBLISHABLE_KEY</span>=your-public-key</div>
          </div>
          <div className="pt-space-xs flex items-center justify-between">
            <span className="font-caption-caps text-caption-caps text-outline uppercase">
              See .env.example &amp; supabase/migrations/
            </span>
            <Link
              to="/"
              className="px-space-md py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors"
            >
              Return to Overview
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Unauthenticated redirect to login with destination memory
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Require verified email check if specified
  if (requireVerifiedEmail && !user.email_confirmed_at) {
    return (
      <div className="max-w-[650px] mx-auto px-margin py-space-xl">
        <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md border border-outline-variant/40 space-y-space-md">
          <div className="flex items-center gap-space-sm text-tertiary">
            <span className="material-symbols-outlined text-[24px]">mark_email_unread</span>
            <h2 className="font-headline-md text-headline-md font-semibold text-primary">
              Email Verification Required
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            Your HeatShield account (<strong className="text-on-surface">{user.email}</strong>) has not completed email verification. Please check your inbox for the confirmation link sent during registration.
          </p>
          <div className="flex items-center gap-space-sm pt-space-xs">
            <Link
              to="/profile"
              className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors"
            >
              Open Account Profile
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
