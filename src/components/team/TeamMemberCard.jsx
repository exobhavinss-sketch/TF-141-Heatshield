import React from 'react';
import HoverTransition from './HoverTransition';
import { cn } from '../../lib/utils';

/**
 * Interactive team-member card built on the Componentry Hover Transition
 * design (wipe effect, bottom direction, Apple easing).
 *
 * Default state: member name + PRN only.
 * Hover / tap / keyboard activation: reveals the member's role and their
 * individual project contributions.
 *
 * Both content layers live in the same grid cell (inside HoverTransition),
 * so the card height is driven by the tallest layer — card dimensions never
 * change on hover and all cards in the grid keep equal heights.
 */
export default function TeamMemberCard({ member }) {
  const defaultView = (
    <div className="relative flex h-full flex-col items-center justify-center p-8 text-center">
      <h3 className="text-[24px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
        {member.name}
      </h3>
      <span className="mt-4 inline-flex w-fit rounded-[980px] bg-[#f5f5f7] px-4 py-1.5 font-mono text-[12px] font-medium text-[#1d1d1f] dark:bg-[#22252b] dark:text-[#f5f5f7]">
        {member.prn}
      </span>
      <p className="absolute bottom-7 left-0 right-0 text-center text-[10px] font-medium uppercase tracking-[0.14em] text-[#aeaeb2] dark:text-[#6e6e73]">
        Hover or tap — view contributions
      </p>
    </div>
  );

  const hoverView = (
    <div className="flex h-full flex-col p-8">
      <h3 className="text-[20px] font-semibold tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
        {member.name}
      </h3>
      <span className="mt-2 inline-flex w-fit rounded-[980px] bg-[#f5f5f7] px-3 py-1 font-mono text-[11px] font-medium text-[#1d1d1f] dark:bg-[#22252b] dark:text-[#f5f5f7]">
        {member.prn}
      </span>

      <div className="mt-6">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">
          Role
        </span>
        <p className="mt-1.5 text-[15px] font-medium leading-snug text-[#1d1d1f] dark:text-[#f5f5f7]">
          {member.role}
        </p>
      </div>

      <div className="mt-5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#86868b] dark:text-[#7a7f8d]">
          Work
        </span>
        <ul className="mt-3 space-y-2.5">
          {member.contributions.map((contribution) => (
            <li key={contribution} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[8px] h-px w-2.5 shrink-0 rounded-full bg-[color:var(--accent)]"
              />
              <span className="text-[13px] leading-relaxed text-[#6e6e73] dark:text-[#a5a9b4]">
                {contribution}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <HoverTransition
      effect="wipe"
      direction="bottom"
      duration={0.6}
      maxTilt={2.4}
      glare
      overlayClassName="rounded-[28px] bg-white dark:bg-[#191b20]"
      className={cn(
        'h-full min-h-[300px] overflow-hidden rounded-[28px] border border-black/[0.06] dark:border-white/[0.08]',
        'bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:bg-[#191b20] dark:shadow-[0_2px_16px_rgba(0,0,0,0.3)]',
        'transition-shadow duration-300',
        'hover:shadow-[0_8px_28px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_28px_rgba(0,0,0,0.45)]',
        '[--accent:var(--accent-l)] dark:[--accent:var(--accent-d)]',
        'focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafc]',
        'dark:focus-visible:ring-[#2997ff] dark:focus-visible:ring-offset-[#101114]'
      )}
      style={{
        '--accent-l': member.accentLight,
        '--accent-d': member.accentDark,
      }}
      defaultComponent={defaultView}
      hoverComponent={hoverView}
    />
  );
}
