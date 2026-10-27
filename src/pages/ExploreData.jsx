import React, { useEffect, useState } from 'react';
import EDADVResearchSection from '../components/edadv/EDADVResearchSection';
import { fetchMasterExploreRecords } from '../services/masterDataService';
import { useAuth } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const RECORD_FIELDS = [
  'record_id',
  'location_id',
  'zone_type',
  'observation_date',
  'air_temperature_c',
  'relative_humidity_pct',
  'land_surface_temperature_c',
  'heat_risk_category',
];
const RECORD_LABELS = {
  record_id: 'Record ID',
  location_id: 'Station ID',
  zone_type: 'Zone',
  observation_date: 'Observation date (UTC)',
  air_temperature_c: 'Air temperature (°C)',
  relative_humidity_pct: 'Relative humidity (%)',
  land_surface_temperature_c: 'Land surface temperature (°C)',
  heat_risk_category: 'Source risk label',
};

const ZONES = ['Residential', 'Commercial', 'Industrial', 'Road', 'Park', 'Educational', 'Transport', 'Waterbody', 'Open Land'];
const RISK_LABELS = ['Low', 'Moderate', 'High', 'Very High'];

function csvCell(value) {
  const text = String(value ?? '');
  const safeText = typeof value === 'string' && /^[\s]*[=+\-@]/.test(text)
    ? `'${text}`
    : text;
  return `"${safeText.replaceAll('"', '""')}"`;
}

export default function ExploreData() {
  const { user, isConfigured } = useAuth();
  const [records, setRecords] = useState([]);
  const [query, setQuery] = useState('');
  const [zone, setZone] = useState('All');
  const [risk, setRisk] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [totalPages, setTotalPages] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setRecords([]);
    setTotal(null);
    setTotalPages(null);
    setHasMore(false);

    const timer = window.setTimeout(() => fetchMasterExploreRecords({
      search: query.trim(),
      zone,
      risk,
      page,
      pageSize: 20,
      allowLocalFallback: false,
    }).then(result => {
      if (!active) return;
      if (result.error) {
        setError(result.error);
        setTotal(0);
        setTotalPages(0);
        setSource('');
        return;
      }

      const pages = result.totalPages ?? null;
      if (result.countKnown && pages > 0 && page > pages) {
        setPage(pages);
        return;
      }
      if (result.countKnown && pages === 0 && page !== 1) {
        setPage(1);
        return;
      }

      setRecords(result.records || []);
      setTotal(result.countKnown ? (result.totalCount ?? 0) : null);
      setTotalPages(pages);
      setHasMore(Boolean(result.hasMore));
      setSource(result.isLiveDb ? 'Supabase heatshield_master · synthetic source records' : '');
    }).catch(() => {
      if (!active) return;
      setRecords([]);
      setTotal(0);
      setTotalPages(0);
      setHasMore(false);
      setSource('');
      setError({
        kind: 'network',
        message: 'Could not reach the configured Supabase service. Check the connection and retry.',
        code: 'NETWORK',
      });
    }).finally(() => {
      if (active) setLoading(false);
    }), query ? 250 : 0);

    return () => { active = false; window.clearTimeout(timer); };
  }, [query, zone, risk, page, retry]);

  const exportVisibleRows = () => {
    if (loading || records.length === 0) return;
    const csv = [
      RECORD_FIELDS.join(','),
      ...records.map(row => RECORD_FIELDS.map(field => csvCell(row[field])).join(',')),
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `heatshield_master_page_${page}.csv`;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const saveQuery = async () => {
    if (!user || !isConfigured || !isSupabaseConfigured() || !supabase) {
      setSaveStatus('Sign in with a configured account to save this query.');
      return;
    }

    setSaving(true);
    setSaveStatus('');
    try {
      const { error: saveError } = await supabase.from('saved_analyses').insert([{
        user_id: user.id,
        title: `Master query: ${zone} / ${risk}`,
        description: `Search ${query.trim() || '(none)'}; ${total === null ? 'count not calculated for paginated identifier search' : `${total} matching rows`}`,
        filters: { query: query.trim(), zone, risk, page },
        analysis_data: { matchCount: total, countKnown: total !== null, savedAt: new Date().toISOString() },
      }]);

      if (saveError) {
        const code = saveError.code ? ` (${saveError.code})` : '';
        setSaveStatus(`Could not save this query${code}. Check your sign-in and permissions, then retry.`);
      } else {
        setSaveStatus('Query saved to your account.');
      }
    } catch {
      setSaveStatus('Could not reach Supabase to save this query. Check the connection and retry.');
    } finally {
      setSaving(false);
    }
  };

  const pageCount = totalPages === null ? null : Math.max(1, totalPages);

  return (
    <main className="w-full bg-[#fafafc] min-h-screen pb-20">
      <header className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-xs uppercase tracking-wider text-[#6e6e73]">HeatShield · TF-141 · EDADV</p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">Explore the analysis</h1>
        <p className="text-sm text-[#6e6e73] mt-2">Precomputed results below summarize 150,000 synthetic academic simulation records. They are not verified real-world Solapur observations.</p>
      </header>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        <EDADVResearchSection />

        <section className="rounded-[24px] border border-black/[0.07] bg-white p-5 sm:p-6" aria-labelledby="master-records-heading">
          <h2 id="master-records-heading" className="text-lg font-semibold">Master records</h2>
          <p className="text-xs text-[#6e6e73] mt-1">Paginated query of the existing Supabase master table. These synthetic source records are separate from precomputed summaries and user-submitted heat readings.</p>

          <div className="flex flex-wrap gap-2 mt-3">
            <button onClick={exportVisibleRows} disabled={loading || records.length === 0} className="rounded-full bg-[#0071e3] text-white px-4 py-2 text-xs disabled:opacity-40">Export visible rows</button>
            <button onClick={saveQuery} disabled={saving} className="rounded-full border border-black/10 px-4 py-2 text-xs disabled:opacity-50">{saving ? 'Saving…' : 'Save query'}</button>
            {saveStatus && <span role="status" className="self-center text-xs text-[#6e6e73]">{saveStatus}</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <label className="sr-only" htmlFor="master-search">Search master records</label>
            <input id="master-search" value={query} onChange={event => { setQuery(event.target.value); setPage(1); }} placeholder="Search station ID or record ID prefix" className="border border-black/10 rounded-xl px-3 py-2 text-sm flex-1" />
            <label className="sr-only" htmlFor="zone-filter">Zone</label>
            <select id="zone-filter" value={zone} onChange={event => { setZone(event.target.value); setPage(1); }} className="border border-black/10 rounded-xl px-3 py-2 text-sm">
              <option>All</option>{ZONES.map(value => <option key={value}>{value}</option>)}
            </select>
            <label className="sr-only" htmlFor="risk-filter">Source risk label</label>
            <select id="risk-filter" value={risk} onChange={event => { setRisk(event.target.value); setPage(1); }} className="border border-black/10 rounded-xl px-3 py-2 text-sm">
              <option>All</option>{RISK_LABELS.map(value => <option key={value}>{value}</option>)}
            </select>
          </div>
          <p className="text-xs text-[#6e6e73] mt-2">Search uses station and record ID prefixes for indexed lookup. Risk options are source-encoded labels, not independently validated health-risk classes.</p>

          <p className="text-xs text-[#6e6e73] mt-3" aria-live="polite">
            {loading
              ? 'Loading master records…'
              : total === null
                ? `${records.length} rows on identifier-search page ${page}${hasMore ? ' · more results available' : ' · end of results'} · ${source || 'Supabase master table'}`
                : `${total.toLocaleString()} matching records · ${source || 'Supabase master table'}`}
          </p>

          {error && (
            <div className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900" role="alert">
              <p>{error.message}{error.code ? ` (${error.code})` : ''} Validated summary charts remain available above.</p>
              <button type="button" onClick={() => setRetry(value => value + 1)} className="mt-2 rounded-lg border border-amber-900/20 px-3 py-1.5 text-xs font-medium">Retry master query</button>
            </div>
          )}

          {!loading && !error && records.length === 0 && (
            <p className="py-8 text-sm text-[#6e6e73]" role="status">No master records match these filters.</p>
          )}

          {!loading && records.length > 0 && (
            <div className="overflow-x-auto mt-3">
              <table className="min-w-[900px] w-full text-xs text-left">
                <thead><tr>{RECORD_FIELDS.map(field => <th key={field} scope="col" className="p-2 border-b font-semibold">{RECORD_LABELS[field]}</th>)}</tr></thead>
                <tbody>{records.map(row => (
                  <tr key={row.record_id} className="border-b border-black/[0.05]">
                    {RECORD_FIELDS.map(field => <td key={field} className="p-2">{row[field] ?? '—'}</td>)}
                  </tr>
                ))}</tbody>
              </table>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button disabled={page <= 1 || loading} onClick={() => setPage(value => Math.max(1, value - 1))} className="px-3 py-2 rounded-lg border disabled:opacity-40">Previous</button>
            <span className="self-center text-xs" aria-live="polite">{pageCount === null ? `Page ${page} · identifier search` : `Page ${page} of ${pageCount}`}</span>
            <button disabled={loading || (pageCount !== null ? page >= pageCount : !hasMore)} onClick={() => setPage(value => pageCount === null ? value + 1 : Math.min(pageCount, value + 1))} className="px-3 py-2 rounded-lg border disabled:opacity-40">Next</button>
          </div>
        </section>
      </div>
    </main>
  );
}
