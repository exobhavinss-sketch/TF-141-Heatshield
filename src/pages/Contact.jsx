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
    <div className="w-full flex-1 py-16 px-6 bg-[#fafafc]">
      <div className="max-w-[720px] mx-auto space-y-8">
        
        {/* Academic Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[980px] bg-black/[0.04] text-[#1d1d1f] text-[12px] font-mono tracking-wider uppercase font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]"></span>
            <span>RESEARCH COMMUNICATIONS · TF-141</span>
          </div>
          <h1 className="text-[36px] md:text-[44px] font-semibold tracking-[-0.025em] text-[#1d1d1f]">
            Contact Research Initiative
          </h1>
          <p className="text-[15px] text-[#86868b] max-w-lg mx-auto leading-relaxed">
            Submit academic inquiries, telemetry feedback, or collaborative research notes to the HeatShield project team at MIT Vishwaprayag University.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-black/[0.06] space-y-6">
          
          {submitted ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-14 h-14 rounded-[980px] bg-[#059669]/10 text-[#059669] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              <div className="space-y-1.5">
                <h3 className="text-[22px] font-semibold text-[#1d1d1f] tracking-tight">
                  Inquiry Logged in Review Queue
                </h3>
                <p className="text-[14px] text-[#86868b] leading-relaxed max-w-md mx-auto">
                  Your message has been stored in the HeatShield administrative review database.
                </p>
              </div>
              
              <div className="bg-[#f5f5f7] p-4 rounded-[18px] text-[12px] text-[#86868b] max-w-md mx-auto leading-relaxed border border-black/[0.04]">
                Note: In this academic simulation environment, messages are stored directly in PostgreSQL for review. Automated outbound email dispatch is not enabled.
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setSubject('');
                    setMessage('');
                  }}
                  className="px-5 py-2.5 rounded-[980px] bg-[#f5f5f7] hover:bg-[#e8e8ed] text-[#1d1d1f] text-[13px] font-medium transition-colors"
                >
                  Send Another Inquiry
                </button>
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-medium transition-colors shadow-[0_2px_8px_rgba(0,113,227,0.25)]"
                >
                  Return to Overview
                </Link>
              </div>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="rounded-[16px] bg-[#dc2626]/10 text-[#dc2626] p-4 text-[13px] flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] flex-shrink-0 mt-0.5">error</span>
                  <div className="flex-1 leading-relaxed font-medium">{errorMsg}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="contactName">
                      Your Full Name
                    </label>
                    <input
                      id="contactName"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Dr. A. Sharma"
                      className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="contactEmail">
                      Email Address
                    </label>
                    <input
                      id="contactEmail"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="researcher@institution.edu"
                      className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="contactSubject">
                    Inquiry Subject
                  </label>
                  <input
                    id="contactSubject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Data verification inquiry for Ward 04 Saat Rasta"
                    className="w-full h-11 bg-[#f5f5f7] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all placeholder:text-[#86868b]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#86868b] uppercase tracking-wider block" htmlFor="contactMessage">
                    Detailed Message
                  </label>
                  <textarea
                    id="contactMessage"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details about your academic inquiry or urban heat feedback..."
                    className="w-full bg-[#f5f5f7] p-4 rounded-[16px] text-[14px] text-[#1d1d1f] focus:outline-none focus:bg-white focus:border-black/20 border border-transparent transition-all resize-y placeholder:text-[#86868b]"
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <span className="text-[11px] text-[#86868b] font-mono">
                    Protected by Supabase PostgreSQL RLS
                  </span>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 h-11 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-medium transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>Logging Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">send</span>
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
