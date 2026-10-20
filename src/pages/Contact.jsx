import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function Contact() {
  const { user, profile } = useAuth();

  const [name, setName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (name.trim().length < 2) {
      setErrorMsg('Please enter a valid name (minimum 2 characters).');
      return;
    }
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (subject.trim().length < 3) {
      setErrorMsg('Subject must be at least 3 characters long.');
      return;
    }
    if (message.trim().length < 10) {
      setErrorMsg('Message must be at least 10 characters long.');
      return;
    }

    if (!isSupabaseConfigured() || !supabase) {
      setErrorMsg('The backend database is not configured yet. Please configure Supabase in your environment.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        user_id: user ? user.id : null,
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
        status: 'new',
      };

      const { error } = await supabase.from('contact_messages').insert([payload]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('[HeatShield Contact] Submission error:', err);
      setErrorMsg(err.message || 'Failed to submit message to the research inbox. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex-1 py-space-xl px-margin">
      <div className="max-w-[760px] mx-auto space-y-space-lg">
        
        {/* Academic Header */}
        <div className="space-y-space-xs text-center">
          <div className="inline-flex items-center gap-space-xs px-2.5 py-1 rounded-DEFAULT bg-surface-container text-on-surface text-label-code font-label-code">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
            <span>RESEARCH COMMUNICATIONS · TF-141</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-primary font-semibold tracking-tight">
            Contact Research Initiative
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
            Submit academic inquiries, telemetry feedback, or collaborative research notes to the HeatShield project team at MIT Vishwaprayag University.
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 space-y-space-md">
          
          {submitted ? (
            <div className="py-space-lg text-center space-y-space-md">
              <div className="w-14 h-14 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h3 className="font-headline-md text-headline-md font-semibold text-primary">
                Inquiry Logged in Review Queue
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed max-w-md mx-auto">
                Your message has been stored in the HeatShield administrative review database.
              </p>
              <div className="bg-surface-container p-space-sm rounded-lg text-xs font-body-sm text-outline max-w-md mx-auto">
                Note: In this academic simulation environment, messages are stored directly in PostgreSQL for review. Automated outbound email dispatch is not enabled.
              </div>
              <div className="pt-space-xs flex justify-center gap-space-sm">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-sm text-body-sm transition-colors"
                >
                  Send Another Inquiry
                </button>
                <Link
                  to="/"
                  className="px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-sm text-body-sm hover:bg-primary transition-colors font-semibold"
                >
                  Return to Overview
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="space-y-space-xs">
                    <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="contactName">
                      Your Full Name
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. A. Sharma"
                      className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                    />
                  </div>

                  <div className="space-y-space-xs">
                    <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="contactEmail">
                      Email Address
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="researcher@institution.edu"
                      className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                    />
                  </div>
                </div>

                <div className="space-y-space-xs">
                  <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="contactSubject">
                    Inquiry Subject
                  </label>
                  <input
                    id="contactSubject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Data verification inquiry for Ward 04 Saat Rasta"
                    className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                  />
                </div>

                <div className="space-y-space-xs">
                  <label className="font-body-sm text-body-sm font-semibold text-on-surface block" htmlFor="contactMessage">
                    Detailed Message
                  </label>
                  <textarea
                    id="contactMessage"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your academic inquiry or urban heat feedback..."
                    className="w-full bg-surface-container-low px-space-md py-2.5 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30 resize-y"
                  />
                </div>

                <div className="flex items-center justify-between pt-space-xs">
                  <span className="font-caption-caps text-caption-caps text-outline">
                    Protected by Supabase PostgreSQL Row Level Security
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-space-xl h-11 rounded-lg bg-primary-container text-on-primary font-headline-md text-body-md font-semibold hover:bg-primary transition-colors shadow-sm disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                        <span>Logging Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
