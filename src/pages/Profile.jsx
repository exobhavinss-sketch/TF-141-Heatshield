import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function Profile() {
  const { user, profile, settings, signOut, updateProfile, updateSettings } = useAuth();
  const navigate = useNavigate();

  // Profile Form state
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  // Settings state
  const [units, setUnits] = useState(settings?.units || 'celsius');
  const [theme, setTheme] = useState(settings?.theme || 'system');
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
    <div className="w-full flex-1 py-space-xl px-margin">
      <div className="max-w-[1200px] mx-auto space-y-space-xl">
        
        {/* Top Header Card */}
        <div className="bg-surface-container-lowest rounded-xl p-space-lg md:p-space-xl shadow-md border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary text-2xl font-bold font-headline shadow-inner flex-shrink-0">
              {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-space-xs">
                <h1 className="font-headline-lg text-headline-lg text-primary font-semibold">
                  {profile?.full_name || 'HeatShield Researcher'}
                </h1>
                <span className="font-label-code text-[11px] px-2 py-0.5 rounded-DEFAULT bg-surface-container text-on-surface font-semibold uppercase">
                  {profile?.role || 'RESEARCHER'}
                </span>
                {isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 font-label-code text-[11px] px-2 py-0.5 rounded-DEFAULT bg-secondary-container text-on-secondary-container font-semibold">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    <span>VERIFIED</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-label-code text-[11px] px-2 py-0.5 rounded-DEFAULT bg-error-container text-on-error-container font-semibold">
                    <span className="material-symbols-outlined text-[13px]">warning</span>
                    <span>UNCONFIRMED EMAIL</span>
                  </span>
                )}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant font-mono">
                {user?.email}
              </p>
              <p className="font-caption-caps text-caption-caps text-outline uppercase">
                {profile?.affiliation || 'MIT Vishwaprayag University'} · Solapur Research Grid
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm self-start md:self-auto">
            <Link
              to="/submit-reading"
              className="inline-flex items-center gap-1 px-space-md py-2.5 rounded-lg bg-primary-container text-on-primary font-body-md text-body-md hover:bg-primary transition-colors shadow-sm font-semibold"
            >
              <span className="material-symbols-outlined text-[18px]">add_location_alt</span>
              <span>Submit Reading</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 px-space-md py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Two-Column Layout: Left = Account Settings / Right = Research Ledgers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          
          {/* Left Column: Profile & Settings Panels */}
          <div className="lg:col-span-5 space-y-space-md">
            
            {/* Profile Edit Panel */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                  <h2 className="font-headline-md text-headline-md">Profile Information</h2>
                </div>
              </div>

              {profileMessage && (
                <div className="p-space-sm rounded-lg bg-surface-container text-primary font-body-sm text-xs">
                  {profileMessage}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-space-sm">
                <div className="space-y-space-xs">
                  <label className="font-body-sm text-xs font-semibold text-on-surface block" htmlFor="profName">
                    Display Name
                  </label>
                  <input
                    id="profName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-container-low px-space-md py-2 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                  />
                </div>

                <div className="space-y-space-xs">
                  <span className="font-body-sm text-xs font-semibold text-on-surface block">
                    Institutional Email (Read Only)
                  </span>
                  <div className="w-full bg-surface-container px-space-md py-2 rounded-lg font-mono text-xs text-on-surface-variant">
                    {user?.email}
                  </div>
                </div>

                <div className="pt-space-xs flex justify-end">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-body-sm text-xs hover:bg-primary transition-colors font-semibold disabled:opacity-60"
                  >
                    {profileSaving ? 'Saving...' : 'Update Profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* Research Preferences Panel */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
                <div className="flex items-center gap-2 text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  <h2 className="font-headline-md text-headline-md">Analytical Preferences</h2>
                </div>
              </div>

              {settingsMessage && (
                <div className="p-space-sm rounded-lg bg-surface-container text-secondary font-body-sm text-xs">
                  {settingsMessage}
                </div>
              )}

              <form onSubmit={handleSettingsSubmit} className="space-y-space-sm">
                <div className="space-y-space-xs">
                  <label className="font-body-sm text-xs font-semibold text-on-surface block" htmlFor="prefUnits">
                    Temperature Measurement Scale
                  </label>
                  <select
                    id="prefUnits"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full bg-surface-container-low px-space-md py-2 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                  >
                    <option value="celsius">Celsius (°C) — Standard Academic Metric</option>
                    <option value="fahrenheit">Fahrenheit (°F)</option>
                  </select>
                </div>

                <div className="space-y-space-xs">
                  <label className="font-body-sm text-xs font-semibold text-on-surface block" htmlFor="prefTheme">
                    Interface Theme Mode
                  </label>
                  <select
                    id="prefTheme"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full bg-surface-container-low px-space-md py-2 rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container border border-outline-variant/30"
                  >
                    <option value="system">System Default</option>
                    <option value="light">Light Mode (Clean Academic)</option>
                    <option value="dark">Dark Mode (High Contrast)</option>
                  </select>
                </div>

                <div className="pt-space-xs flex justify-end">
                  <button
                    type="submit"
                    disabled={settingsSaving}
                    className="px-space-md py-2 rounded-lg bg-secondary text-on-secondary font-body-sm text-xs hover:bg-secondary-fixed-variant transition-colors font-semibold disabled:opacity-60"
                  >
                    {settingsSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Column: User's Readings & Saved Analyses */}
          <div className="lg:col-span-7 space-y-space-md">
            
            {/* My Readings Ledger */}
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
                <div className="flex items-center gap-2 text-primary font-semibold">
                  <span className="material-symbols-outlined text-[20px]">sensors</span>
                  <h2 className="font-headline-md text-headline-md">My In-Situ Field Readings</h2>
                </div>
                <span className="font-label-code text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  {readings.length} Submitted
                </span>
              </div>

              {readingsLoading ? (
                <div className="py-space-lg text-center font-label-code text-xs text-on-surface-variant">
                  Loading telemetry records...
                </div>
              ) : readingsError ? (
                <div className="p-space-sm bg-error-container text-on-error-container rounded-lg text-xs">
                  {readingsError}
                </div>
              ) : readings.length === 0 ? (
                <div className="py-space-lg text-center space-y-space-xs">
                  <span className="material-symbols-outlined text-[36px] text-outline block">history_edu</span>
                  <p className="font-body-md text-body-md text-on-surface font-semibold">No readings submitted yet</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mx-auto">
                    Record your first in-situ Solapur urban microclimate observation to view telemetry ledger records here.
                  </p>
                  <div className="pt-space-xs">
                    <Link
                      to="/submit-reading"
                      className="inline-block px-space-md py-2 rounded-lg bg-primary-container text-on-primary font-body-sm text-xs font-semibold hover:bg-primary transition-colors"
                    >
                      Open Submit Reading Interface
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-space-xs max-h-80 overflow-y-auto pr-1">
                  {readings.map((r) => (
                    <div
                      key={r.id}
                      className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs hover:bg-surface-container transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-space-xs">
                          <span className="font-headline-md text-headline-md font-bold text-primary">
                            {Number(r.temperature_c).toFixed(1)}°C
                          </span>
                          {r.humidity_percent && (
                            <span className="font-label-code text-xs text-on-surface-variant">
                              · {r.humidity_percent}% RH
                            </span>
                          )}
                          <span className={`font-label-code text-[10px] uppercase px-1.5 py-0.5 rounded ${
                            r.status === 'verified'
                              ? 'bg-secondary-container text-on-secondary-container font-semibold'
                              : 'bg-surface-container-high text-on-surface-variant font-medium'
                          }`}>
                            {r.status}
                          </span>
                        </div>
                        <div className="font-body-sm text-xs text-on-surface-variant flex flex-wrap items-center gap-2">
                          <span>Station: {r.station_id || 'Custom Coordinate'}</span>
                          <span>·</span>
                          <span>{new Date(r.recorded_at).toLocaleDateString()} {new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {r.notes && (
                          <p className="font-body-sm text-xs text-on-surface line-clamp-1 italic">
                            "{r.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {r.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteReading(r.id)}
                            className="text-error hover:text-on-error-container p-1 rounded hover:bg-error-container transition-colors text-xs flex items-center gap-1"
                            title="Withdraw pending reading"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
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
            <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
              <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
                <div className="flex items-center gap-2 text-secondary font-semibold">
                  <span className="material-symbols-outlined text-[20px]">bookmark</span>
                  <h2 className="font-headline-md text-headline-md">My Saved Analyses</h2>
                </div>
                <span className="font-label-code text-xs text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                  {analyses.length} Saved
                </span>
              </div>

              {analysesLoading ? (
                <div className="py-space-sm text-center font-label-code text-xs text-on-surface-variant">
                  Loading saved query snapshots...
                </div>
              ) : analyses.length === 0 ? (
                <div className="py-space-md text-center space-y-1 text-on-surface-variant">
                  <p className="font-body-md text-body-md text-on-surface font-semibold">No saved analyses yet</p>
                  <p className="font-body-sm text-body-sm text-xs">
                    You can bookmark custom filter configurations and analytical snapshots from the Analytics Dashboard or Data Explorer.
                  </p>
                </div>
              ) : (
                <div className="space-y-space-xs max-h-60 overflow-y-auto pr-1">
                  {analyses.map((a) => (
                    <div
                      key={a.id}
                      className="p-space-sm rounded-lg bg-surface-container-low border border-outline-variant/20 flex items-center justify-between gap-space-sm"
                    >
                      <div className="space-y-0.5">
                        <h4 className="font-headline-md text-body-md font-semibold text-primary">{a.title}</h4>
                        {a.description && (
                          <p className="font-body-sm text-xs text-on-surface-variant">{a.description}</p>
                        )}
                        <span className="font-label-code text-[10px] text-outline block">
                          Saved: {new Date(a.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAnalysis(a.id)}
                        className="text-outline hover:text-error p-1 rounded transition-colors"
                        title="Delete saved analysis"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
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
