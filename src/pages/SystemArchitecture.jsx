import React, { useCallback, useEffect, useState } from 'react';
import CircuitBoard from '../components/sections/CircuitBoard';
import {
  architectureNodes,
  architectureConnections,
  flowSteps,
  techStack,
  aboutInfo,
} from '../data/architectureData';
import { teamMembers } from '../components/team/teamData';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const statusStyles = {
  implemented: {
    dot: 'bg-[#0071e3] dark:bg-[#2997ff]',
    chip: 'bg-[#0071e3]/10 dark:bg-[#2997ff]/15 text-[#0071e3] dark:text-[#2997ff]',
    label: 'Implemented',
  },
  planned: {
    dot: 'bg-[#b45309] dark:bg-[#f59e0b]',
    chip: 'bg-[#b45309]/10 dark:bg-[#f59e0b]/15 text-[#b45309] dark:text-[#f59e0b]',
    label: 'Planned',
  },
};

function useIsNarrow(maxWidth = 879) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setNarrow(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, [maxWidth]);
  return narrow;
}

/* ------------------------------------------------------------------ */
/* Detail panel (opens when a circuit node is selected)                */
/* ------------------------------------------------------------------ */

function DetailPanel({ node, onClose }) {
  useEffect(() => {
    if (!node) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [node, onClose]);

  if (!node) return null;
  const detail = node.detail;
  const status = statusStyles[node.status];

  return (
    <div
      role="dialog"
      aria-label={`${detail.name} details`}
      className="fixed z-50 inset-x-4 bottom-4 lg:inset-x-auto lg:right-6 lg:top-24 lg:bottom-auto lg:w-[420px] max-h-[70vh] lg:max-h-[calc(100vh-8rem)] overflow-y-auto rounded-[24px] border border-black/[0.08] dark:border-white/[0.1] bg-white/97 dark:bg-[#191b20]/97 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.18)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.55)] p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-[11px] font-semibold text-[#0071e3] dark:text-[#2997ff]">
            {node.num}
          </span>
          <h3 className="text-[18px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
            {detail.name}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details panel"
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[#86868b] dark:text-[#a5a9b4] hover:text-[#1d1d1f] dark:hover:text-[#f5f5f7] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[980px] text-[10px] font-semibold uppercase tracking-wider ${status.chip}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
        {detail.tech.map((tech) => (
          <span
            key={tech}
            className="px-2 py-0.5 rounded-[980px] bg-black/[0.04] dark:bg-white/[0.06] font-mono text-[10px] text-[#6e6e73] dark:text-[#a5a9b4]"
          >
            {tech}
          </span>
        ))}
      </div>

      <div className="mt-5 space-y-4 text-[13px] leading-relaxed">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0071e3] dark:text-[#2997ff]">Purpose</span>
          <p className="mt-1 text-[#1d1d1f] dark:text-[#f5f5f7]">{detail.purpose}</p>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] dark:text-[#7a7f8d]">Responsibilities</span>
          <ul className="mt-1.5 space-y-1.5">
            {detail.responsibilities.map((item) => (
              <li key={item} className="flex gap-2 text-[#6e6e73] dark:text-[#a5a9b4]">
                <span aria-hidden="true" className="mt-[7px] h-px w-2 shrink-0 rounded-full bg-[#0071e3] dark:bg-[#2997ff]" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] dark:text-[#7a7f8d]">Inputs</span>
            <ul className="mt-1.5 space-y-1 text-[#6e6e73] dark:text-[#a5a9b4]">
              {detail.inputs.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] dark:text-[#7a7f8d]">Outputs</span>
            <ul className="mt-1.5 space-y-1 text-[#6e6e73] dark:text-[#a5a9b4]">
              {detail.outputs.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] dark:text-[#7a7f8d]">Connected components</span>
          <p className="mt-1 text-[#6e6e73] dark:text-[#a5a9b4]">{detail.connections.join(' · ')}</p>
        </div>

        <p className="border-t border-black/[0.06] dark:border-white/[0.08] pt-3 text-[12px] text-[#86868b] dark:text-[#a5a9b4]">
          <span className="font-semibold uppercase tracking-wider">Status: </span>
          {detail.status}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile simplified vertical flow                                     */
/* ------------------------------------------------------------------ */

function VerticalFlow({ onSelect }) {
  return (
    <ol className="relative mx-auto max-w-[440px]">
      <span
        aria-hidden="true"
        className="absolute left-[22px] top-6 bottom-6 w-px border-l-2 border-dashed border-[#0071e3]/25 dark:border-[#2997ff]/25"
      />
      {architectureNodes.map((node, index) => (
        <li key={node.id} className="relative pl-14 pb-5 last:pb-0">
          {index < architectureNodes.length - 1 && (
            <span
              aria-hidden="true"
              className="absolute left-[16px] top-[52px] w-3 h-3 rounded-full border-2 border-[#0071e3]/40 dark:border-[#2997ff]/40 motion-safe:animate-pulse"
            />
          )}
          <button
            type="button"
            onClick={() => onSelect(node.id)}
            className="w-full text-left rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#191b20] px-4 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)] transition-shadow hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.45)] outline-none focus-visible:ring-2 focus-visible:ring-[#0071e3] dark:focus-visible:ring-[#2997ff]"
          >
            <span className="flex items-center gap-2.5">
              <span className="font-mono text-[10px] font-semibold text-[#0071e3] dark:text-[#2997ff]">{node.num}</span>
              <span className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{node.title}</span>
              <span className={`ml-auto w-2 h-2 rounded-full ${statusStyles[node.status].dot}`} aria-label={statusStyles[node.status].label} />
            </span>
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4]">
              {node.subtitle}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* "How HeatShield Works" flow stepper                                 */
/* ------------------------------------------------------------------ */

function FlowStepper() {
  return (
    <ol className="relative mx-auto max-w-[640px]">
      <span
        aria-hidden="true"
        className="absolute left-[19px] top-4 bottom-4 w-px bg-gradient-to-b from-[#0071e3]/40 via-[#0071e3]/20 to-[#0071e3]/40 dark:from-[#2997ff]/40 dark:via-[#2997ff]/20 dark:to-[#2997ff]/40"
      />
      {flowSteps.map((step, index) => (
        <li key={step.id} className="relative pl-12 pb-6 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute left-0 top-0.5 flex h-10 w-10 items-center justify-center rounded-[12px] border-2 border-[#0071e3] dark:border-[#2997ff] bg-white dark:bg-[#191b20] font-mono text-[11px] font-semibold text-[#0071e3] dark:text-[#2997ff] shadow-[0_2px_10px_rgba(0,0,0,0.05)]"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="rounded-[18px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#191b20] px-4 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
              <span className="text-[14px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{step.title}</span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">{step.tech}</span>
            </div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[#86868b] dark:text-[#a5a9b4]">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const LEDGER = [
  { label: 'Architecture Layers', value: '7' },
  { label: 'Database Tables', value: '6' },
  { label: 'Master Records', value: '150,000' },
  { label: 'EDA Figures', value: '14' },
];

export default function SystemArchitecture() {
  const [activeId, setActiveId] = useState(null);
  const isNarrow = useIsNarrow();

  const activeNode = activeId ? architectureNodes.find((n) => n.id === activeId) : null;
  const toggleNode = useCallback((id) => {
    setActiveId((current) => (current === id ? null : id));
  }, []);

  return (
    <div className="flex flex-col w-full pb-24 bg-[#fafafc] dark:bg-[#101114] text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-200">
      {/* Context ribbon */}
      <div className="w-full bg-[#f5f5f7]/80 dark:bg-[#161617]/80 backdrop-blur-md py-2.5 px-6 border-b border-black/[0.04] dark:border-white/[0.06]">
        <div className="max-w-[1340px] mx-auto flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4]">
          <span>System Architecture • TF-141 • Solapur</span>
          <span className="hidden sm:block">Supabase Postgres · React 18 · Python EDA</span>
        </div>
      </div>

      {/* Hero */}
      <section className="px-6 pt-12 pb-10">
        <div className="max-w-[1340px] mx-auto space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[980px] bg-black/[0.04] dark:bg-white/[0.06] text-[12px] font-mono tracking-wider uppercase text-[#6e6e73] dark:text-[#a5a9b4]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3] dark:bg-[#2997ff]" />
            Inside HeatShield — How Data, Intelligence, and Technology Work Together
          </div>
          <h1 className="text-[38px] md:text-[50px] font-semibold tracking-[-0.03em] leading-[1.1] max-w-[880px]">
            Inside the HeatShield System
          </h1>
          <p className="text-[17px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed max-w-[760px]">
            Explore how HeatShield connects environmental data, backend processing, database management,
            and frontend visualization to transform complex information into an understandable urban heat
            intelligence platform.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {LEDGER.map((item) => (
              <div
                key={item.label}
                className="bg-white dark:bg-[#191b20] rounded-[20px] p-4 border border-black/[0.06] dark:border-white/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
              >
                <div className="font-mono text-[22px] font-semibold text-[#0071e3] dark:text-[#2997ff]">{item.value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4]">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive circuit-board architecture */}
      <section className="px-6 py-10" id="explorer">
        <div className="max-w-[1340px] mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
              <span>01</span><span>/</span><span>Architecture Explorer</span>
            </div>
            <h2 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.02em]">
              The Connected System
            </h2>
            <p className="text-[14px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed max-w-[720px]">
              Seven layers, wired the way the codebase actually works. Select any node to open its
              details — its connections stay lit while unrelated paths dim.
            </p>
          </div>

          <div className="rounded-[28px] overflow-hidden border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#191b20] shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]">
            {isNarrow ? (
              <div className="p-6">
                <VerticalFlow onSelect={toggleNode} />
              </div>
            ) : (
              <>
                <CircuitBoard
                  nodes={architectureNodes}
                  connections={architectureConnections}
                  activeId={activeId}
                  onNodeClick={toggleNode}
                  width={1180}
                  height={640}
                />
                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 border-t border-black/[0.04] dark:border-white/[0.06] font-mono text-[10px] uppercase tracking-wider text-[#86868b] dark:text-[#a5a9b4]">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0071e3] dark:bg-[#2997ff]" /> Implemented layer
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#b45309] dark:bg-[#f59e0b]" /> Planned / optional
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true" className="w-5 h-px bg-[#0071e3] dark:bg-[#2997ff]" /> Live runtime path
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-[#86868b] dark:border-[#a5a9b4]" /> Offline / build-time path
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How HeatShield Works */}
      <section className="px-6 py-10 bg-[#f5f5f7]/60 dark:bg-[#141519]/60 border-y border-black/[0.04] dark:border-white/[0.06]" id="data-flow">
        <div className="max-w-[1340px] mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
              <span>02</span><span>/</span><span>Data Journey</span>
            </div>
            <h2 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.02em]">
              How HeatShield Works
            </h2>
            <p className="text-[14px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed max-w-[720px]">
              The complete journey of a data point — from the simulated environmental model to the
              charts, maps, and dashboards you interact with. After EDA, the flow splits the way the
              codebase actually does: bundled research artefacts go straight into the site, while the
              full dataset is imported into Supabase for live querying.
            </p>
          </div>
          <FlowStepper />
        </div>
      </section>

      {/* Technology stack */}
      <section className="px-6 py-10" id="tech">
        <div className="max-w-[1340px] mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
              <span>03</span><span>/</span><span>Stack</span>
            </div>
            <h2 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.02em]">
              Technology Behind HeatShield
            </h2>
            <p className="text-[14px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed max-w-[720px]">
              Every technology listed here is present in the repository — nothing decorative.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {techStack.map((group) => (
              <div
                key={group.category}
                className="rounded-[24px] border border-black/[0.07] dark:border-white/[0.08] bg-white dark:bg-[#191b20] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.025)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
              >
                <h3 className="text-[15px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{group.category}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
                    <li key={item.name}>
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[13px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{item.name}</span>
                        {item.planned && (
                          <span className="shrink-0 px-2 py-0.5 rounded-[980px] bg-[#b45309]/10 dark:bg-[#f59e0b]/15 font-mono text-[9px] uppercase tracking-wider text-[#b45309] dark:text-[#f59e0b]">
                            Planned
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">{item.purpose}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About + disclosure */}
      <section className="px-6 py-10 bg-[#f5f5f7]/60 dark:bg-[#141519]/60 border-y border-black/[0.04] dark:border-white/[0.06]" id="about">
        <div className="max-w-[1340px] mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
              <span>04</span><span>/</span><span>Project Overview</span>
            </div>
            <h2 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.02em]">
              About HeatShield
            </h2>
          </div>

          <div className="rounded-[28px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#191b20] p-6 md:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)] space-y-5">
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] dark:text-[#7a7f8d]">Project</dt>
                <dd className="mt-1 text-[#1d1d1f] dark:text-[#f5f5f7]">{aboutInfo.projectName}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] dark:text-[#7a7f8d]">Team</dt>
                <dd className="mt-1 text-[#1d1d1f] dark:text-[#f5f5f7]">{aboutInfo.teamName}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] dark:text-[#7a7f8d]">Study Area</dt>
                <dd className="mt-1 text-[#1d1d1f] dark:text-[#f5f5f7]">{aboutInfo.studyArea}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] dark:text-[#7a7f8d]">Project Tracks</dt>
                <dd className="mt-1 text-[#1d1d1f] dark:text-[#f5f5f7]">{aboutInfo.tracks.join(' · ')}</dd>
              </div>
            </dl>
            <p className="text-[14px] text-[#6e6e73] dark:text-[#a5a9b4] leading-relaxed max-w-[820px]">
              {aboutInfo.purpose}
            </p>
            <div className="text-xs text-[#7a4e00] dark:text-[#fbbf24] bg-[#fff8e6] dark:bg-[#78350f]/20 border border-[#f2d58b] dark:border-[#78350f]/40 rounded-2xl px-4 py-3 leading-relaxed">
              {aboutInfo.disclosure}
            </div>
          </div>
        </div>
      </section>

      {/* Built by Team TF-141 — reuses the Team page's single source of truth */}
      <section className="px-6 py-10" id="team">
        <div className="max-w-[1340px] mx-auto space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-[#0071e3] dark:text-[#2997ff] uppercase tracking-wider">
              <span>05</span><span>/</span><span>Team</span>
            </div>
            <h2 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.02em]">
              Built by Team TF-141
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="rounded-[24px] border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#191b20] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.3)]"
              >
                <h3 className="text-[16px] font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{member.name}</h3>
                <span className="mt-2 inline-flex w-fit rounded-[980px] bg-[#f5f5f7] dark:bg-[#22252b] px-3 py-1 font-mono text-[11px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7]">
                  {member.prn}
                </span>
                <p className="mt-3 text-[12.5px] text-[#86868b] dark:text-[#a5a9b4] leading-relaxed">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DetailPanel node={activeNode} onClose={() => setActiveId(null)} />
    </div>
  );
}
