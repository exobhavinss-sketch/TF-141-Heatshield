import React, { useMemo } from 'react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts';
import data from '../../data/edadvSummary.json';
import distributions from '../../../edadv/figures/01_temperature_humidity_distributions.png';
import airHumidity from '../../../edadv/figures/04_air_temperature_vs_humidity.png';
import lstIndices from '../../../edadv/figures/05_lst_vs_vegetation_indices.png';
import correlations from '../../../edadv/figures/06_core_correlation_matrix.png';

const colors = ['#0071e3', '#e87500', '#15966a', '#8957c5'];
const fmt = (v, digits = 2) => typeof v === 'number' ? v.toFixed(digits) : '—';
const chartBox = 'h-[300px] min-w-0 w-full';
const Card = ({ title, children, note }) => <section className="rounded-[24px] border border-black/[0.07] bg-white p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)]">
  <h2 className="text-lg font-semibold tracking-tight text-[#1d1d1f]">{title}</h2>{children}
  {note && <p className="mt-4 text-xs leading-relaxed text-[#6e6e73]">{note}</p>}
</section>;
const Disclosure = () => <p className="text-xs text-[#7a4e00] bg-[#fff8e6] border border-[#f2d58b] rounded-2xl px-4 py-3">All charts summarize synthetic academic simulation records. They are not verified Solapur weather measurements; associations are descriptive and do not establish causation.</p>;

export default function EDADVResearchSection({ compact = false }) {
  const monthly = useMemo(() => {
    const byMonth = new Map();
    for (const row of data.monthly) {
      const entry = byMonth.get(row.month_number) || { month: new Date(2000, row.month_number - 1).toLocaleString('en', { month: 'short' }) };
      if (row.variable === 'air_temperature_c') entry.air = row.mean_of_station_means;
      if (row.variable === 'land_surface_temperature_c') entry.lst = row.mean_of_station_means;
      byMonth.set(row.month_number, entry);
    }
    return [...byMonth.values()];
  }, []);
  const annual = useMemo(() => {
    const byYear = new Map();
    for (const row of data.annual) {
      const entry = byYear.get(row.year) || { year: String(row.year) };
      if (row.variable === 'air_temperature_c') entry.air = row.mean_of_station_means;
      if (row.variable === 'land_surface_temperature_c') entry.lst = row.mean_of_station_means;
      byYear.set(row.year, entry);
    }
    return [...byYear.values()];
  }, []);
  const zoneData = useMemo(() => {
    const byZone = new Map();
    for (const row of data.zones) {
      if (!['air_temperature_c', 'land_surface_temperature_c'].includes(row.variable)) continue;
      const entry = byZone.get(row.zone_type) || { zone: row.zone_type };
      entry[row.variable === 'air_temperature_c' ? 'air' : 'lst'] = row.mean_of_station_means;
      byZone.set(row.zone_type, entry);
    }
    return [...byZone.values()];
  }, []);
  const stats = Object.fromEntries(data.statistics.map(row => [row.column, row]));
  const corrKeys = new Set([
    ['air_temperature_c','relative_humidity_pct'], ['air_temperature_c','land_surface_temperature_c'],
    ['ndvi','land_surface_temperature_c'], ['ndbi','land_surface_temperature_c']
  ].map(pair=>pair.sort().join('|')));
  const corrPairs = data.correlations.filter(row => corrKeys.has([row.variable_1,row.variable_2].sort().join('|')));
  const riskTotal = Object.values(data.metadata.risk_category_counts).reduce((a, b) => a + b, 0);
  const peakMonth = monthly.reduce((best, item) => !best || item.air > best.air ? item : best, null);
  const figures = [
    [distributions, 'Temperature and humidity distributions'],
    [airHumidity, 'Air temperature versus relative humidity'],
    [lstIndices, 'LST relationships with NDVI and NDBI'],
    [correlations, 'Pearson correlation matrix']
  ];
  return <div className="flex flex-col gap-6">
    <Disclosure />
    <Card title="Research dataset overview" note={<><span>Master CSV hash: </span><span className="break-all">{data.metadata.source_sha256}</span><span>. WRF-Chem, ERA5-Land, and IMD provenance statements are repository documented and have not been independently verified.</span></>}>
      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[[data.metadata.row_count.toLocaleString(), 'synthetic records'], [data.metadata.station_count, 'represented locations'], [data.metadata.unique_observed_dates.toLocaleString(), 'observed dates'], [`${data.metadata.dates_without_observations}`, 'calendar dates without records']].map(([value, label]) => <div key={label} className="rounded-2xl bg-[#f5f5f7] p-4"><strong className="block text-2xl text-[#1d1d1f]">{value}</strong><span className="text-xs text-[#6e6e73]">{label}</span></div>)}
      </div>
      <div className="mt-3 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[[stats.air_temperature_c, 'Mean air temperature', '°C'], [stats.relative_humidity_pct, 'Mean relative humidity', '%'], [stats.land_surface_temperature_c, 'Mean land surface temperature', '°C'], [stats.urban_heat_island_intensity_c, 'Mean encoded UHI intensity', '°C']].map(([s,label,unit])=><div key={label} className="rounded-2xl border border-black/[0.06] p-4"><strong className="block text-xl">{fmt(s?.mean)} {unit}</strong><span className="text-xs text-[#6e6e73]">{label}</span></div>)}
      </div>
      <p className="mt-4 text-sm text-[#6e6e73]">Coverage: {data.metadata.date_range_utc[0].slice(0,10)} to {data.metadata.date_range_utc[1].slice(0,10)} (timestamps UTC). {data.metadata.calendar_days_inclusive} calendar dates in span; no gap dates were filled. Source records include {data.metadata.unique_timestamp_hours} UTC hour bins, so full diurnal analysis is unsupported.</p>
      <p className="mt-2 text-sm text-[#6e6e73]">Descriptive finding: {peakMonth?.month} has the highest monthly mean air temperature across the station-mean summaries ({fmt(peakMonth?.air)} °C). This is a pattern in the synthetic dataset only.</p>
    </Card>
    {!compact && <>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Core variable summaries" note="Mean ± sample SD; units follow the audited field names. Values describe pooled synthetic records.">
          <div className="overflow-x-auto mt-4"><table className="w-full text-sm"><thead><tr className="text-left text-xs text-[#6e6e73]"><th className="py-2">Variable</th><th>Mean ± SD</th><th>Range</th></tr></thead><tbody>{Object.entries(stats).map(([key, s])=><tr key={key} className="border-t border-black/[0.06]"><th className="text-left font-medium py-2">{key.replaceAll('_',' ')}</th><td>{fmt(s.mean)} ± {fmt(s.sample_stddev)}</td><td>{fmt(s.min)}–{fmt(s.max)}</td></tr>)}</tbody></table></div>
        </Card>
        <Card title="IQR outlier screening" note="1.5×IQR flags are candidates for inspection, not evidence of invalidity. No observations were removed.">
          <ul className="mt-4 divide-y divide-black/[0.06]">{data.outliers.filter(r=>['air_temperature_c','relative_humidity_pct','land_surface_temperature_c','urban_heat_island_intensity_c'].includes(r.column)).map(r=><li key={r.column} className="py-3 flex justify-between gap-3 text-sm"><span>{r.column.replaceAll('_',' ')}</span><strong>{Number(r.candidate_count).toLocaleString()} / {Number(r.n).toLocaleString()} flags ({fmt(r.candidate_percent)}%)</strong></li>)}</ul>
        </Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">{figures.map(([src, title])=><Card key={src} title={title}><img className="mt-4 w-full h-auto rounded-xl" src={src} alt={`${title}; analysis of synthetic academic simulation data`} loading="lazy" /></Card>)}</div>
      <Card title="Selected associations" note="Pearson and Spearman coefficients use the paired row count shown. Repeated records across location and date are dependent; coefficients describe the simulation and do not show cause or effect.">
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mt-4">{corrPairs.map(r=><div key={`${r.variable_1}-${r.variable_2}`} className="rounded-2xl bg-[#f5f5f7] p-4"><div className="text-xs text-[#6e6e73]">{r.variable_1.replaceAll('_',' ')} ↔ {r.variable_2.replaceAll('_',' ')}</div><div className="mt-2 text-sm">Pearson <b>{fmt(r.pearson_r,3)}</b> · Spearman <b>{fmt(r.spearman_rho,3)}</b></div><div className="text-xs text-[#6e6e73] mt-1">n = {Number(r.n_paired).toLocaleString()} paired rows</div></div>)}</div>
      </Card>
      <div className="grid xl:grid-cols-2 gap-6">
        <Card title="Monthly station-mean patterns" note="Each monthly value is the mean of station means. Shading/season interpretations are not inferred; source season labels are undocumented."><div className={chartBox}><ResponsiveContainer width="100%" height="100%"><LineChart data={monthly} margin={{top:12,right:12,left:0,bottom:4}}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis unit=" °C" width={58}/><Tooltip formatter={(v)=>[`${fmt(v)} °C`]}/><Legend/><Line type="monotone" dataKey="air" name="Air temperature" stroke={colors[0]} strokeWidth={2} dot={false}/><Line type="monotone" dataKey="lst" name="Land surface temperature" stroke={colors[1]} strokeWidth={2} dot={false}/></LineChart></ResponsiveContainer></div></Card>
        <Card title="Annual station-mean patterns" note="Station summaries, not daily or continuous climate estimates; the represented synthetic schedule is sparse."><div className={chartBox}><ResponsiveContainer width="100%" height="100%"><LineChart data={annual} margin={{top:12,right:12,left:0,bottom:4}}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="year"/><YAxis unit=" °C" width={58}/><Tooltip formatter={(v)=>[`${fmt(v)} °C`]}/><Legend/><Line type="monotone" dataKey="air" name="Air temperature" stroke={colors[0]} strokeWidth={2} dot/><Line type="monotone" dataKey="lst" name="Land surface temperature" stroke={colors[1]} strokeWidth={2} dot/></LineChart></ResponsiveContainer></div></Card>
      </div>
      <Card title="Zone comparison: represented station means" note={`Bars show means across represented station means (station counts by zone: ${zoneData.map(z=>`${z.zone} ${data.metadata.zone_station_counts[z.zone]}`).join('; ')}), not all locations across each zone. These synthetic groups do not establish zone-wide conditions.`}><div className="h-[360px] w-full mt-4"><ResponsiveContainer width="100%" height="100%"><BarChart data={zoneData} margin={{top:8,right:12,left:0,bottom:62}}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="zone" angle={-25} textAnchor="end" interval={0} height={72} tick={{fontSize:11}}/><YAxis unit=" °C"/><Tooltip formatter={(v)=>[`${fmt(v)} °C`]}/><Legend/><Bar dataKey="air" name="Air temperature" fill={colors[0]} radius={[4,4,0,0]}/><Bar dataKey="lst" name="LST" fill={colors[1]} radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></div></Card>
      <Card title="Source-encoded heat-risk labels" note="These are labels stored in the CSV, not independently validated health-risk classes; thresholds and provenance definitions are unavailable."><div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">{Object.entries(data.metadata.risk_category_counts).map(([label,count])=><div key={label} className="rounded-2xl bg-[#f5f5f7] p-4"><strong className="text-xl">{Number(count).toLocaleString()}</strong><p className="text-sm">{label}</p><span className="text-xs text-[#6e6e73]">{(count/riskTotal*100).toFixed(1)}% of records</span></div>)}</div></Card>
    </>}
  </div>;
}
