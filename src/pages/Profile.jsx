import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function Profile() {
  const { user, profile, settings, signOut, updateProfile, updateSettings } = useAuth();
  const { theme: appTheme, setTheme: setAppTheme } = useTheme();
  const navigate = useNavigate();

  // Profile Form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Settings state
  const [units, setUnits] = useState(settings?.units || 'celsius');
  const [theme, setTheme] = useState(appTheme || settings?.theme || 'system');
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState('');

  // My Readings state
  const [readings, setReadings] = useState([]);
  const [readingsLoading, setReadingsLoading] = useState(true);
  const [readingsError, setReadingsError] = useState('');

  // My Saved Analyses state
  const [analyses, setAnalyses] = useState([]);
  const [analysesLoading, setAnalysesLoading] = useState(true);

  // Sync profile & settings when loaded
  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
    if (settings?.units) setUnits(settings.units);
    if (settings?.theme) setTheme(settings.theme);
  }, [profile, settings]);

  useEffect(() => {
    if (appTheme) setTheme(appTheme);
  }, [appTheme]);

  // Fetch user's own readings
  const fetchMyReadings = useCallback(async () => {
    if (!supabase || !user) return;
    setReadingsLoading(true);
    setReadingsError('');

    try {
      const { data, error } = await supabase
        .from('heat_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });

      if (error) throw error;
      setReadings(data || []);
    } catch (err) {
      console.error('[HeatShield Profile] Fetch readings error:', err);
      setReadingsError('Failed to load your submission history.');
    } finally {
      setReadingsLoading(false);
    }
  }, [user]);

  // Fetch user's saved analyses
  const fetchMyAnalyses = useCallback(async () => {
    if (!supabase || !user) return;
    setAnalysesLoading(true);

    try {
      const { data, error } = await supabase
        .from('saved_analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnalyses(data || []);
    } catch (err) {
      console.error('[HeatShield Profile] Fetch analyses error:', err);
    } finally {
      setAnalysesLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchMyReadings();
      fetchMyAnalyses();
    }
  }, [user, fetchMyReadings, fetchMyAnalyses]);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileSaving(true);

    try {
      await updateProfile({ full_name: fullName.trim() });
      setProfileMessage('Profile details updated successfully.');
      setTimeout(() => setProfileMessage(''), 3500);
    } catch (err) {
      setProfileMessage(`Error: ${err.message}`);
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Settings Update
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsMessage('');
    setSettingsSaving(true);

    try {
      await updateSettings({ units, theme });
      setAppTheme(theme);
      setSettingsMessage('Preferences saved.');
      setTimeout(() => setSettingsMessage(''), 3500);
    } catch (err) {
      setSettingsMessage(`Error: ${err.message}`);
    } finally {
      setSettingsSaving(false);
    }
  };

  // Handle Deleting a reading
  const handleDeleteReading = async (readingId) => {
    if (!window.confirm('Are you sure you wish to withdraw this pending reading?')) return;

    try {
      const { error } = await supabase
        .from('heat_readings')
        .delete()
        .eq('id', readingId)
        .eq('user_id', user.id);

      if (error) throw error;
      setReadings(prev => prev.filter(r => r.id !== readingId));
    } catch (err) {
      alert(`Could not delete reading: ${err.message}`);
    }
  };

  // Handle Deleting an analysis
  const handleDeleteAnalysis = async (analysisId) => {
    if (!window.confirm('Delete this saved analysis snapshot?')) return;

    try {
      const { error } = await supabase
        .from('saved_analyses')
        .delete()
        .eq('id', analysisId)
        .eq('user_id', user.id);

      if (error) throw error;
      setAnalyses(prev => prev.filter(a => a.id !== analysisId));
    } catch (err) {
      alert(`Could not delete analysis: ${err.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const isEmailVerified = Boolean(user?.email_confirmed_at);

  return (
    <div className="w-full flex-1 py-12 px-6 bg-[#fafafc] dark:bg-[#101114] text-[#1d1d1f] dark:text-[#f5f5f7]">
      <div className="max-w-[1240px] mx-auto space-y-8">
        
        {/* Top Header Card */}
        <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-8 md:p-10 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/[0.06] dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[980px] bg-[#1d1d1f] dark:bg-[#22252b] border border-black/10 dark:border-white/10 flex items-center justify-center text-white dark:text-[#f5f5f7] text-2xl font-semibold shadow-xs flex-shrink-0">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[24px] md:text-[28px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">
                  {profile?.full_name || 'HeatShield Researcher'}
                </h1>
                <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-[980px] bg-[#f5f5f7] dark:bg-[#22252b] border border-black/5 dark:border-white/10 text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold uppercase">
                  {profile?.role || 'RESEARCHER'}
                </span>
                {isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-[980px] bg-[#059669]/10 text-[#059669] font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>VERIFIED</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] px-2.5 py-0.5 rounded-[980px] bg-[#dc2626]/10 text-[#dc2626] font-semibold">
                    <span className="material-symbols-outlined text-[13px]">warning</span>
                    <span>UNCONFIRMED</span>
                  </span>
                )}
              </div>
              <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4] font-mono">
                {user?.email}
              </p>
              <p className="text-[11px] text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider">
                {profile?.affiliation || 'MIT Vishwaprayag University'} • Solapur Research Grid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <Link
              to="/submit-reading"
              className="inline-flex items-center gap-1.5 px-5 h-11 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[13px] font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add_location_alt</span>
              <span>Submit Reading</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-4 h-11 rounded-[980px] bg-[#f5f5f7] dark:bg-[#22252b] hover:bg-[#e8e8ed] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/5 dark:border-white/10 text-[13px] font-medium transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Profile Edit Panel */}
            <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/[0.06] dark:border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/10 pb-3">
                <div className="flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold text-[15px]">
                  <span className="material-symbols-outlined text-[18px] text-[#0071e3]">person</span>
                  <h2>Profile Information</h2>
                </div>
              </div>

              {profileMessage && (
                <div className="p-3 rounded-[12px] bg-[#059669]/10 text-[#059669] text-[12px] font-medium">
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block" htmlFor="profName">
                    Display Name
                  </label>
                  <input
                    id="profName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-11 bg-[#f5f5f7] dark:bg-[#22252b] px-4 rounded-[12px] text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:bg-white dark:focus:bg-[#22252b] focus:border-black/20 dark:focus:border-[#2997ff] border border-transparent dark:border-white/10 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[12px] font-medium text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block">
                    Institutional Email (Read Only)
                  </span>
                  <div className="w-full h-11 bg-[#f5f5f7] dark:bg-[#22252b] px-4 rounded-[12px] font-mono text-[13px] text-[#86868b] dark:text-[#a5a9b4] border border-transparent dark:border-white/10 flex items-center">
                    {user?.email}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-5 py-2 rounded-[980px] bg-[#0071e3] hover:bg-[#0077ed] text-white text-[12px] font-medium transition-all shadow-[0_2px_8px_rgba(0,113,227,0.25)] disabled:opacity-60"
                  >
                    {profileSaving ? 'Saving...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* Analytical Preferences Panel */}
            <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/[0.06] dark:border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/10 pb-3">
                <div className="flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold text-[15px]">
                  <span className="material-symbols-outlined text-[18px] text-[#0071e3]">tune</span>
                  <h2>Analytical Preferences</h2>
                </div>
              </div>

              {settingsMessage && (
                <div className="p-3 rounded-[12px] bg-[#059669]/10 text-[#059669] text-[12px] font-medium">
                  {settingsMessage}
                </div>
              )}

              <form onSubmit={handleSettingsSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block" htmlFor="prefUnits">
                    Temperature Scale
                  </label>
                  <select
                    id="prefUnits"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full h-11 bg-[#f5f5f7] dark:bg-[#22252b] px-4 rounded-[12px] text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:bg-white dark:focus:bg-[#22252b] focus:border-black/20 dark:focus:border-[#2997ff] border border-transparent dark:border-white/10 transition-all cursor-pointer"
                  >
                    <option value="celsius" className="dark:bg-[#191b20]">Celsius (°C) — Standard Academic Metric</option>
                    <option value="fahrenheit" className="dark:bg-[#191b20]">Fahrenheit (°F)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-medium text-[#86868b] dark:text-[#a5a9b4] uppercase tracking-wider block" htmlFor="prefTheme">
                    Interface Theme Mode
                  </label>
                  <select
                    id="prefTheme"
                    value={theme}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTheme(val);
                      setAppTheme(val);
                    }}
                    className="w-full h-11 bg-[#f5f5f7] dark:bg-[#22252b] px-4 rounded-[12px] text-[13px] text-[#1d1d1f] dark:text-[#f5f5f7] focus:outline-none focus:bg-white dark:focus:bg-[#22252b] focus:border-black/20 dark:focus:border-[#2997ff] border border-transparent dark:border-white/10 transition-all cursor-pointer"
                  >
                    <option value="system" className="dark:bg-[#191b20]">System Default</option>
                    <option value="light" className="dark:bg-[#191b20]">Light Mode (Clean Academic)</option>
                    <option value="dark" className="dark:bg-[#191b20]">Dark Mode (High Contrast)</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="px-5 py-2 rounded-[980px] bg-[#f5f5f7] dark:bg-[#22252b] hover:bg-[#e8e8ed] dark:hover:bg-[#2e323b] text-[#1d1d1f] dark:text-[#f5f5f7] border border-black/5 dark:border-white/10 text-[12px] font-medium transition-colors disabled:opacity-60"
                  >
                    {settingsSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* My Readings Ledger */}
            <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/[0.06] dark:border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/10 pb-3">
                <div className="flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold text-[15px]">
                  <span className="material-symbols-outlined text-[18px] text-[#0071e3]">sensors</span>
                  <h2>My In-Situ Field Readings</h2>
                </div>
                <span className="font-mono text-[11px] text-[#86868b] dark:text-[#a5a9b4] bg-[#f5f5f7] dark:bg-[#22252b] border border-black/5 dark:border-white/10 px-2.5 py-0.5 rounded-[980px]">
                  {readings.length} Submitted
                </span>
              </div>

              {readingsLoading ? (
                <div className="py-8 text-center text-[13px] text-[#86868b] dark:text-[#a5a9b4]">
                  Loading telemetry records...
                </div>
              ) : readingsError ? (
                <div className="p-3 bg-[#dc2626]/10 text-[#dc2626] rounded-[12px] text-[12px]">
                  {readingsError}
                </div>
              ) : readings.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <span className="material-symbols-outlined text-[36px] text-black/20 dark:text-white/20 block">history_edu</span>
                  <p className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold">No readings submitted yet</p>
                  <p className="text-[13px] text-[#86868b] dark:text-[#a5a9b4] max-w-sm mx-auto">
                    Record your first in-situ Solapur urban microclimate observation to view telemetry ledger records here.
                  </p>
                  <div className="pt-2">
                    <Link
                      to="/submit-reading"
                      className="inline-block px-5 py-2 rounded-[980px] bg-[#0071e3] text-white text-[12px] font-medium shadow-[0_2px_8px_rgba(0,113,227,0.25)] hover:bg-[#0077ed] transition-colors"
                    >
                      Open Submit Reading
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {readings.map((r) => (
                    <div
                      key={r.id}
                      className="p-3.5 rounded-[16px] bg-[#f5f5f7] dark:bg-[#22252b] border border-black/[0.03] dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#e8e8ed]/60 dark:hover:bg-[#2e323b] transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tabular-nums">
                            {Number(r.temperature_c).toFixed(1)}°C
                          </span>
                          {r.humidity_percent && (
                            <span className="font-mono text-[11px] text-[#86868b] dark:text-[#a5a9b4]">
                              • {r.humidity_percent}% RH
                            </span>
                          )}
                          <span className={`font-mono text-[10px] uppercase px-2 py-0.5 rounded-[980px] ${
                            r.status === 'verified'
                              ? 'bg-[#059669]/10 text-[#059669] font-medium'
                              : 'bg-black/5 dark:bg-white/10 text-[#86868b] dark:text-[#a5a9b4]'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#86868b] dark:text-[#a5a9b4] flex flex-wrap items-center gap-2">
                          <span>Station: {r.station_id || 'Custom Coordinate'}</span>
                          <span>•</span>
                          <span>{new Date(r.recorded_at).toLocaleDateString()} {new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {r.notes && (
                          <p className="text-[12px] text-[#1d1d1f] dark:text-[#f5f5f7] line-clamp-1 italic">
                            "{r.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {r.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReading(r.id)}
                            className="text-[#dc2626] hover:bg-[#dc2626]/10 px-2.5 py-1 rounded-[980px] transition-colors text-[11px] font-medium flex items-center gap-1"
                            title="Withdraw pending reading"
                          >
                            <span className="material-symbols-outlined text-[14px]">delete</span>
                            <span>Withdraw</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Saved Analyses */}
            <div className="bg-white dark:bg-[#191b20] rounded-[28px] p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-none border border-black/[0.06] dark:border-white/10 space-y-5">
              <div className="flex items-center justify-between border-b border-black/[0.04] dark:border-white/10 pb-3">
                <div className="flex items-center gap-2 text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold text-[15px]">
                  <span className="material-symbols-outlined text-[18px] text-[#0071e3]">bookmark</span>
                  <h2>My Saved Analyses</h2>
                </div>
                <span className="font-mono text-[11px] text-[#86868b] dark:text-[#a5a9b4] bg-[#f5f5f7] dark:bg-[#22252b] border border-black/5 dark:border-white/10 px-2.5 py-0.5 rounded-[980px]">
                  {analyses.length} Saved
                </span>
              </div>

              {analysesLoading ? (
                <div className="py-6 text-center text-[13px] text-[#86868b] dark:text-[#a5a9b4]">
                  Loading saved query snapshots...
                </div>
              ) : analyses.length === 0 ? (
                <div className="py-6 text-center space-y-1 text-[#86868b] dark:text-[#a5a9b4]">
                  <p className="text-[14px] text-[#1d1d1f] dark:text-[#f5f5f7] font-semibold">No saved analyses yet</p>
                  <p className="text-[12px]">
                    Bookmark custom filter configurations and analytical snapshots from Data Explorer.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {analyses.map((a) => (
                    <div
                      key={a.id}
                      className="p-3.5 rounded-[16px] bg-[#f5f5f7] dark:bg-[#22252b] border border-black/[0.03] dark:border-white/10 flex items-center justify-between gap-3 hover:bg-[#e8e8ed]/60 dark:hover:bg-[#2e323b] transition-colors"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{a.title}</h4>
                        {a.description && (
                          <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4]">{a.description}</p>
                        )}
                        <span className="font-mono text-[10px] text-[#86868b] dark:text-[#a5a9b4] block">
                          Saved: {new Date(a.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnalysis(a.id)}
                        className="text-[#86868b] dark:text-[#a5a9b4] hover:text-[#dc2626] p-1.5 rounded-[980px] hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                        title="Delete saved analysis"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
