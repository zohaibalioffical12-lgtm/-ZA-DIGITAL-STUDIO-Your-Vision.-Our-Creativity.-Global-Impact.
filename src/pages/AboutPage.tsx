import React, { useEffect, useState } from 'react';
import { ExternalLink, CheckCircle2, Globe, Shield, Sparkles, User, Briefcase, Mail } from 'lucide-react';
import { AgencySettings, TeamMember } from '../types';

export const AboutPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>('All');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => {
        if (data.team) setTeam(data.team);
      })
      .catch(() => {});
  }, []);

  const founderName = settings?.founderName || 'Zohaib Ali';
  const founderTitle = settings?.founderTitle || 'Founder & Creative Director';
  const founderImg = settings?.founderImage || '/src/assets/images/founder_zohaib_ali_1791996673369.jpg';
  const founderBio =
    settings?.founderBio ||
    'Zohaib Ali is the visionary founder and creative director of ZA DIGITAL STUDIO. With an international background spanning high-end brand architecture, full-stack digital development, and generative AI workflows, Zohaib leads client projects with uncompromising standards of aesthetic precision and technical performance.';
  const founderPhilosophy =
    settings?.founderPhilosophy ||
    'We believe exceptional digital products are born at the intersection of artisanal design taste and intelligent engineering. Technology must elevate human creativity, not replace it.';
  const founderGoals =
    settings?.founderGoals ||
    'To empower visionary entrepreneurs, growing brands, and creators across global markets with digital platforms that command authority and drive measurable impact.';
  const founderSkills = settings?.founderSkills || [
    'Brand Architecture & Visual Systems',
    'Modern Full-Stack Web Development',
    'AI Integration & Generative Workflows',
    'UI/UX & Interactive Design',
    'Strategic Creative Direction'
  ];

  const nonFounderTeam = team.filter((t) => !t.isFounder);
  const departments = ['All', 'Leadership', 'Design', 'Engineering', 'AI & Automation', 'Management'];
  const filteredTeam =
    selectedDept === 'All' ? nonFounderTeam : nonFounderTeam.filter((t) => t.department === selectedDept);

  return (
    <div className="w-full py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Studio Origin &amp; Philosophy
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-6">
          Crafting Digital Authority for Ambitious Brands Worldwide.
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <strong>ZA DIGITAL STUDIO</strong> was founded by <strong>{founderName}</strong> to unite bespoke visual design, high-performance web engineering, and intelligent AI-assisted creative workflows.
        </p>
      </div>

      {/* ========================================================
          FOUNDER PROFILE & PERSONAL BRANDING (SECTION 3)
          ======================================================== */}
      <div className="mb-20 bg-zinc-950 text-white rounded-2xl p-8 sm:p-12 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
          {/* Large Founder Photograph */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl">
              <img
                src={founderImg}
                alt={founderName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 p-3 bg-zinc-950/90 backdrop-blur-md rounded-lg border border-zinc-800 text-xs">
                <span className="font-display font-bold text-white block text-sm">{founderName}</span>
                <span className="text-yellow-400 font-mono text-[11px] block">{founderTitle}</span>
              </div>
            </div>
          </div>

          {/* Founder Bio, Philosophy & Goals */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-yellow-400 tracking-wider">
              <span className="w-2.5 h-2.5 bg-yellow-400 rounded-sm" />
              <span>Studio Founder Profile</span>
            </div>

            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              {founderName}
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
              <p>{founderBio}</p>
            </div>

            {/* Creative Philosophy */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 block">
                Creative Philosophy:
              </span>
              <p className="text-xs text-zinc-300 italic leading-relaxed">
                &ldquo;{founderPhilosophy}&rdquo;
              </p>
            </div>

            {/* Professional Goals */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-400 block">
                Studio Mission &amp; Goals:
              </span>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {founderGoals}
              </p>
            </div>

            {/* Skills & Expertise */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
                Core Skills &amp; Domain Expertise:
              </span>
              <div className="flex flex-wrap gap-2">
                {founderSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-mono rounded bg-zinc-900 text-zinc-200 border border-zinc-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions & Portfolio Link */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={settings?.existingPortfolioUrl || 'https://zohaib-ali-portfolio-digital-studio.ai.studio/'}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded transition-colors inline-flex items-center gap-2"
              >
                <span>View Founder's Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded transition-colors"
                >
                  LinkedIn Profile
                </a>
              )}

              <button
                onClick={() => onNavigate('/start-project')}
                className="px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded transition-colors"
              >
                Start a Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PUBLISHED TEAM MEMBERS (SECTION 7)
          ======================================================== */}
      {nonFounderTeam.length > 0 && (
        <div className="mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
                Our People
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Specialists &amp; Collaborators
              </h2>
            </div>

            {/* Department filters */}
            <div className="flex flex-wrap gap-1.5">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                    selectedDept === dept
                      ? 'bg-zinc-900 text-yellow-400 dark:bg-yellow-400 dark:text-black'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeam.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-700">
                    <img
                      src={member.photograph}
                      alt={member.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-zinc-900 dark:text-white">
                      {member.name}
                    </h3>
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium block">
                      {member.jobTitle}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono block mt-0.5">
                      {member.department}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {member.biography}
                </p>

                {member.skills && member.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    {member.skills.map((skill, i) => (
                      <span key={i} className="text-[10px] font-mono text-zinc-500">
                        {skill} {i < member.skills.length - 1 && '·'}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Studio Workspace Showcase */}
      <div className="mb-20 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-950 text-white grid grid-cols-1 lg:grid-cols-12 shadow-xl">
        <div className="lg:col-span-7 relative min-h-[300px] lg:min-h-[380px]">
          <img
            src="/src/assets/images/about_studio_interior_1791996705527.jpg"
            alt="ZA DIGITAL STUDIO Workspace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-zinc-950" />
        </div>
        <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-center space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-yellow-400">
            Work Environment &amp; Standards
          </div>
          <h3 className="font-display text-2xl font-bold text-white">
            Where Vision Meets Digital Execution
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Our studio workspace is purpose-built for focus, creative iteration, and rapid technical delivery. From typographic exploration to production code testing across real hardware displays, every project is crafted with intense attention to detail.
          </p>
          <div className="pt-2 flex items-center gap-6 text-xs text-zinc-400">
            <div>
              <span className="font-bold text-white block">100% Remote-Ready</span>
              <span className="text-[11px]">Collaborating across all time zones</span>
            </div>
            <div>
              <span className="font-bold text-white block">Direct Founder Oversight</span>
              <span className="text-[11px]">Zohaib Ali on every key deliverable</span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Audiences We Serve */}
      <div className="p-8 sm:p-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <h3 className="font-display text-2xl font-bold text-zinc-900 dark:text-white mb-6">
          Who We Serve Worldwide
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-zinc-600 dark:text-zinc-400">
          <div>
            <span className="font-bold text-zinc-900 dark:text-white block mb-1">
              Startups &amp; Founders
            </span>
            Rapid brand launch kits, investor pitch decks, and authoritative conversion funnels.
          </div>
          <div>
            <span className="font-bold text-zinc-900 dark:text-white block mb-1">
              Online Stores &amp; Retailers
            </span>
            Distinctive visual identity, product photography styling, and responsive boutique e-commerce platforms.
          </div>
          <div>
            <span className="font-bold text-zinc-900 dark:text-white block mb-1">
              Educational Businesses
            </span>
            Course platforms, student portals, clear instructional design, and enrollment inquiry funnels.
          </div>
          <div>
            <span className="font-bold text-zinc-900 dark:text-white block mb-1">
              Digital Content Creators
            </span>
            YouTube channel branding, high-CTR thumbnail templates, media kits, and vertical short-form video scripts.
          </div>
        </div>
      </div>
    </div>
  );
};
