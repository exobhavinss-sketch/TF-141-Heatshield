import React from 'react';
import TeamMemberCard from './TeamMemberCard';
import { TEAM_SECTION, teamMembers } from './teamData';
import { cn } from '../../lib/utils';

/**
 * "The People Behind the Project" — reusable interactive team section.
 *
 * Single source of truth for member data (teamData.js) and card behaviour
 * (TeamMemberCard + HoverTransition). Import and drop this component on any
 * page that should present the team; do not duplicate member information.
 *
 * Layout: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop).
 */
export default function TeamMemberCards({ className }) {
  return (
    <section className={cn('w-full px-6 py-16', className)}>
      <div className="mx-auto max-w-[1340px] space-y-10">
        {/* Section heading */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-[#0071e3] dark:text-[#2997ff]">
              {TEAM_SECTION.eyebrow}
            </span>
            <h2 className="text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f] dark:text-[#f5f5f7] md:text-[34px]">
              {TEAM_SECTION.title}
            </h2>
          </div>
          <p className="max-w-md text-[14px] leading-relaxed text-[#86868b] dark:text-[#a5a9b4]">
            {TEAM_SECTION.description}
          </p>
        </div>

        {/* Member cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
