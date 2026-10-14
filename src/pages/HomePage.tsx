import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle2,
  ExternalLink,
  ChevronUp,
  Sparkles,
  Compass,
  FileCheck,
  Code2,
  Eye,
  Rocket
} from 'lucide-react';
import { PortfolioItem, ServiceItem, AgencySettings, TeamMember } from '../types';

interface HomePageProps {
  onNavigate: (path: string, serviceId?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [featuredProjects, setFeaturedProjects] = useState<PortfolioItem[]>([]);
  const [featuredServices, setFeaturedServices] = useState<ServiceItem[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [settings, setSettings] = useState<AgencySettings | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Load agency settings
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});

    // Load portfolio
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data) => {
        if (data.portfolio) {
          setFeaturedProjects(data.portfolio.slice(0, 3));
        }
      })
      .catch(() => {});

    // Load services
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        if (data.services) {
          // Select marquee services
          const topServices = data.services.filter(
            (s: ServiceItem) => s.featured || s.id === 'logo-brand-identity' || s.id === 'business-websites' || s.id === 'promotional-video-concepts'
          );
          setFeaturedServices(topServices.slice(0, 3));
        }
      })
      .catch(() => {});

    // Load team
    fetch('/api/team')
      .then((r) => r.json())
      .then((data) => {
        if (data.team) setTeamMembers(data.team);
      })
      .catch(() => {});

    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const heroHeadline = settings?.heroHeadline || 'Transform Your Ideas Into Digital Experiences.';
  const heroSubtext =
    settings?.heroSubtext ||
    'ZA DIGITAL STUDIO combines creative design, modern web development, and AI-assisted digital solutions to help businesses build their online presence.';
  const heroPrimaryBtn = settings?.heroButtonPrimary || 'Start Your Project';
  const heroSecondaryBtn = settings?.heroButtonSecondary || 'Explore Services';
  const heroTertiaryBtn = settings?.heroButtonTertiary || 'View Our Work';
  const heroImg = settings?.heroImage || '/src/assets/images/hero_digital_studio_1791906979659.jpg';
  const ctaHeadline = settings?.ctaHeadline || "Have an Idea? Let's Build It.";
  const ctaButton = settings?.ctaButtonText || 'Start Your Project';

  return (
    <div className="w-full">
      {/* ========================================================
          HERO SECTION (ULTRA PREMIUM)
          ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-24 md:py-28 border-b border-zinc-200 dark:border-zinc-900 bg-zinc-950 text-white">
        {/* Subtle geometric yellow gradient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-yellow-400/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-yellow-400">
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-sm" />
                <span>ZA DIGITAL STUDIO &middot; Founded by {settings?.founderName || 'Zohaib Ali'}</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.08] text-balance">
                {heroHeadline}
              </h1>

              <p className="text-base sm:text-lg text-zinc-300 max-w-xl leading-relaxed">
                {heroSubtext}
              </p>

              {/* Three Mandatory Hero Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onNavigate('/start-project')}
                  className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition-all rounded-md shadow-lg flex items-center gap-2 whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  <span>{heroPrimaryBtn}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('/services')}
                  className="px-5 py-3.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-colors rounded-md whitespace-nowrap shrink-0"
                >
                  {heroSecondaryBtn}
                </button>

                <button
                  onClick={() => onNavigate('/portfolio')}
                  className="px-5 py-3.5 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900/60 transition-colors rounded-md whitespace-nowrap shrink-0"
                >
                  {heroTertiaryBtn}
                </button>
              </div>

              {/* Founder Portfolio Callout */}
              <div className="pt-4 flex items-center gap-2 text-xs text-zinc-400 border-t border-zinc-900">
                <span>Existing Portfolio:</span>
                <a
                  href={settings?.existingPortfolioUrl || 'https://zohaib-ali-portfolio-digital-studio.ai.studio/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 font-medium inline-flex items-center gap-1"
                >
                  <span>zohaib-ali-portfolio-digital-studio.ai.studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Right Column: Hero Visual Studio Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-900 group">
                <img
                  src={heroImg}
                  alt="ZA DIGITAL STUDIO Workspace and Creative Design Laboratory"
                  referrerPolicy="no-referrer"
                  className="w-full h-[380px] lg:h-[450px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-zinc-950/85 backdrop-blur-md rounded-lg border border-zinc-800 text-xs">
                  <div className="flex items-center justify-between text-zinc-300">
                    <span className="font-semibold text-white">Creative Studio &amp; AI Laboratory</span>
                    <span className="text-yellow-400 font-mono text-[11px]">Global Standard</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">
                    Bespoke brand architecture, high-performance web development, and intelligent workflow automation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          FEATURED SERVICES
          ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
              Capabilities
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Featured Creative &amp; Technical Services
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/services')}
            className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white hover:text-yellow-500 dark:hover:text-yellow-400 inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <span>Explore All 17 Services</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredServices.map((service, idx) => (
            <div
              key={service.id}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-yellow-400/60 transition-all hover:shadow-xl group"
            >
              {service.image && (
                <div className="aspect-[16/10] bg-zinc-950 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-yellow-400 border border-zinc-800">
                    {service.categoryLabel}
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span className="font-mono">0{idx + 1}.</span>
                    <span className="font-mono">{service.turnaround}</span>
                  </div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-yellow-500 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-1.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-3 mb-6">
                    {service.deliverables.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">Starting Rate</span>
                    <span className="text-base font-bold text-zinc-900 dark:text-white font-mono tabular-nums">
                      ${service.startingPriceUsd} USD
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate('/start-project', service.id)}
                    className="px-3.5 py-1.5 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded transition-colors"
                  >
                    Inquire
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          SELECTED PORTFOLIO SHOWCASE
          ======================================================== */}
      <section className="py-20 bg-zinc-950 text-white border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-yellow-400 mb-2">
                Selected Work
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                Recent Projects &amp; Visual Systems
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                Clearly labeled concept prototypes and sample projects.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href={settings?.existingPortfolioUrl || 'https://zohaib-ali-portfolio-digital-studio.ai.studio/'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-yellow-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Live Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => onNavigate('/portfolio')}
                className="px-4 py-2 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded transition-colors"
              >
                View Full Gallery
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onNavigate('/portfolio')}
                className="group cursor-pointer bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-yellow-400/50 transition-all hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-zinc-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-[10px] font-mono text-yellow-400 border border-zinc-800 rounded">
                    {project.category}
                  </div>
                  {project.isSampleWork && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-zinc-900/90 text-[10px] text-zinc-300 border border-zinc-700 rounded">
                      Sample Showcase
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-display text-lg font-bold text-white group-hover:text-yellow-400 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tools.slice(0, 3).map((tool, i) => (
                      <span key={i} className="text-[10px] text-zinc-400 font-mono">
                        {tool} {i < 2 && '·'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          FOUNDER & TEAM SECTION (MAJOR PROMPT REQUIREMENT)
          ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
            Leadership &amp; Talent
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Founder &amp; Creative Direction
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            Meet the creative leadership behind ZA DIGITAL STUDIO.
          </p>
        </div>

        {/* Prominent Founder Card for Zohaib Ali */}
        <div className="p-8 sm:p-10 rounded-2xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 blur-[100px] pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-4">
              <div className="relative aspect-square rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-lg">
                <img
                  src={settings?.founderImage || '/src/assets/images/portfolio_branding_showcase_1791906979435.jpg'}
                  alt={settings?.founderName || 'Zohaib Ali'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-yellow-400 border border-zinc-800">
                  {settings?.founderTitle || 'Founder & Creative Director'}
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-yellow-400 tracking-wider">
                <span className="w-2 h-2 bg-yellow-400 rounded-sm" />
                <span>Studio Founder</span>
              </div>
              <h3 className="font-display text-3xl font-extrabold text-white">
                {settings?.founderName || 'Zohaib Ali'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {settings?.founderBio ||
                  'Zohaib Ali is the visionary founder and creative director of ZA DIGITAL STUDIO, dedicated to crafting bespoke brand identities, modern web applications, and AI creative workflows for forward-thinking international clients.'}
              </p>

              {settings?.founderPhilosophy && (
                <div className="p-3.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-300 italic">
                  &ldquo;{settings.founderPhilosophy}&rdquo;
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={settings?.existingPortfolioUrl || 'https://zohaib-ali-portfolio-digital-studio.ai.studio/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Explore Founder Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => onNavigate('/about')}
                  className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded border border-zinc-800 transition-colors"
                >
                  Read Full Profile &amp; Goals
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Published Team Members (if added by admin) */}
        {teamMembers.length > 1 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-6">
              Studio Team &amp; Specialists
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {teamMembers
                .filter((t) => !t.isFounder)
                .map((member) => (
                  <div
                    key={member.id}
                    className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-800">
                      <img
                        src={member.photograph}
                        alt={member.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-display text-sm font-bold text-zinc-900 dark:text-white truncate">
                        {member.name}
                      </h4>
                      <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium block truncate">
                        {member.jobTitle}
                      </span>
                      <span className="text-[11px] text-zinc-400 block truncate mt-0.5">
                        {member.department}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </section>

      {/* ========================================================
          HOW WE WORK (VISUAL 6-STEP PROCESS)
          ======================================================== */}
      <section className="py-20 bg-zinc-100 dark:bg-zinc-900/40 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
              Workflow Engine
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
              How We Work: From Concept to Global Launch
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
              A transparent, 6-phase collaborative methodology engineered for velocity and precision.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              {
                num: '01',
                title: 'Discover',
                desc: 'Auditing your objectives, competitors, and international audience.',
                icon: Compass
              },
              {
                num: '02',
                title: 'Plan',
                desc: 'Structuring scope, milestones, deliverables, and exact timelines.',
                icon: FileCheck
              },
              {
                num: '03',
                title: 'Design',
                desc: 'Crafting bespoke typography, vector systems, and UI architecture.',
                icon: Sparkles
              },
              {
                num: '04',
                title: 'Develop',
                desc: 'Clean full-stack implementation with responsive speed tests.',
                icon: Code2
              },
              {
                num: '05',
                title: 'Review',
                desc: 'Structured client feedback iterations and pixel-level polish.',
                icon: Eye
              },
              {
                num: '06',
                title: 'Deliver',
                desc: 'Production deployment, master source file transfer, and support.',
                icon: Rocket
              }
            ].map((step) => {
              const IconComp = step.icon;
              return (
                <div
                  key={step.num}
                  className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-yellow-500 dark:text-yellow-400">
                        {step.num}
                      </span>
                      <IconComp className="w-4 h-4 text-zinc-400" />
                    </div>
                    <h3 className="font-display text-sm font-bold text-zinc-900 dark:text-white mb-1.5">
                      {step.title}
                    </h3>
                    <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          WHY CHOOSE US
          ======================================================== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
            Studio Advantages
          </div>
          <h2 className="font-display text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Why Forward-Thinking Brands Choose Us
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
            <Sparkles className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
              Creative Thinking
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We reject off-the-shelf templates and generic AI cliches. Every visual asset is architected to command immediate authority.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
            <ShieldCheck className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
              Clear Communication &amp; Delivery
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Structured milestone tracking in our Client Portal. Direct collaboration with founder Zohaib Ali with zero bureaucratic layers.
            </p>
          </div>

          <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
            <Globe className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />
            <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
              International Client Focus
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Serving businesses across North America, Europe, UAE, and Asia with clean code, high speed, and accessible global design standards.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          FINAL CALL TO ACTION
          ======================================================== */}
      <section className="py-24 bg-zinc-950 text-white border-t border-zinc-900 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-400/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            {ctaHeadline}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Submit your project requirements. We will analyze your brief and respond with an exact quote and turnaround timeline.
          </p>
          <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => onNavigate('/start-project')}
              className="px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded-md transition-all shadow-xl flex items-center gap-2"
            >
              <span>{ctaButton}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-6 py-3.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-colors"
            >
              Contact Studio Directly
            </button>
          </div>
        </div>
      </section>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-yellow-400 text-black shadow-xl hover:bg-yellow-300 transition-all hover:-translate-y-1"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
