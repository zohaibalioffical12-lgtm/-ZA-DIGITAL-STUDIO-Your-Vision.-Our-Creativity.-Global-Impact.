import React, { useEffect, useState } from 'react';
import { Check, X, ArrowUpRight, HelpCircle, ShieldAlert } from 'lucide-react';
import { PricingPackage } from '../types';

interface PricingPageProps {
  onNavigate: (path: string, serviceId?: string) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pricing')
      .then((r) => r.json())
      .then((data) => {
        if (data.pricing) setPackages(data.pricing);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="w-full py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Transparent Rates
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
          Structured Packages &amp; Pricing
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Every project is scoped with unambiguous inclusion and exclusion boundaries. Prices are displayed in USD as configurable baseline packages until project specifications are finalized.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading pricing packages...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg) => {
            const isPopular = pkg.popular;
            return (
              <div
                key={pkg.id}
                className={`bg-white dark:bg-zinc-900 border rounded-lg p-6 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'border-yellow-400 dark:border-yellow-400/80 shadow-lg ring-1 ring-yellow-400/50'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-yellow-400 text-black text-[11px] font-bold uppercase tracking-wider rounded">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 min-h-[32px]">
                      {pkg.subtitle}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="py-4 border-y border-zinc-100 dark:border-zinc-800 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-extrabold text-zinc-900 dark:text-white tabular-nums">
                        ${pkg.priceUsd}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">
                        {pkg.isCustomQuote ? 'USD / Starting' : 'USD'}
                      </span>
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1">
                      Turnaround: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{pkg.turnaroundDays}</span>
                    </div>
                  </div>

                  {/* Inclusions */}
                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-2">
                      What is Included:
                    </span>
                    {pkg.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Exclusions */}
                  {pkg.excludes && pkg.excludes.length > 0 && (
                    <div className="space-y-2 mb-6 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                        Exclusions:
                      </span>
                      {pkg.excludes.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                          <X className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Inquiry CTA */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => onNavigate('/start-project', pkg.id)}
                    className={`w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-sm'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-800 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span>Inquire for {pkg.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment & Contract Integrity Notice */}
      <div className="mt-16 p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
            <h4 className="font-bold text-zinc-900 dark:text-white text-sm">
              Payment &amp; Engagement Policy
            </h4>
            <p>
              In adherence to our strict accuracy requirements, online card checkout is not claimed on this website without a direct verified invoice agreement. All project engagements begin with a mutual scope review, milestone timeline confirmation, and formal invoice billing via approved international business transfer (Wise, Bank Wire, or verified business invoice).
            </p>
            <p>
              Display rates are configurable example baseline estimates and may be adjusted based on customized deliverables, urgent expedited turnarounds, or third-party API licensing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
