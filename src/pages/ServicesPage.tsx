import React, { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Search,
  Sparkles,
  Shield,
  X,
  RefreshCw
} from 'lucide-react';
import { ServiceItem } from '../types';

interface ServicesPageProps {
  onNavigate: (path: string, serviceId?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        if (data.services) setServices(data.services);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'branding', label: 'Branding & Design' },
    { id: 'web', label: 'Web Development' },
    { id: 'ai-content', label: 'AI Content Creation' },
    { id: 'career', label: 'Digital Career Services' },
    { id: 'automation', label: 'AI & Automation' }
  ];

  const filtered = services.filter((s) => {
    const matchesCat = activeCategory === 'all' || s.category === activeCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="w-full py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Studio Capabilities
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
          Services &amp; Creative Deliverables
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
          From full brand identity systems and modern responsive web engineering to AI video scripting and automated lead workflows. Every service is governed by clear deliverables, turnaround schedules, and revision allowances.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-zinc-900 text-yellow-400 dark:bg-yellow-400 dark:text-black shadow-sm'
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deliverables & services..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-24 text-zinc-500 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-yellow-400" />
          <span>Loading studio services...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          No services match your active filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((service) => {
            const isComingSoon = service.status === 'coming-soon';
            return (
              <div
                key={service.id}
                className={`bg-white dark:bg-zinc-900 border ${
                  isComingSoon
                    ? 'border-dashed border-zinc-300 dark:border-zinc-800 opacity-90'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-yellow-400/60'
                } rounded-xl overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl group`}
              >
                {/* Visual Image Header */}
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
                    {isComingSoon && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-amber-500/90 text-black font-bold text-[10px] uppercase">
                        Coming Soon
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title & Description */}
                    <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-yellow-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Deliverables List */}
                    <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-800/80 pt-4 mb-6">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                        Included Deliverables:
                      </span>
                      {service.deliverables.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 mt-0.5 shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Meta & Action */}
                  <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-zinc-400 flex items-center gap-1 mb-0.5 text-[11px]">
                          <Clock className="w-3 h-3" /> Turnaround
                        </span>
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                          {service.turnaround}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-400 flex items-center gap-1 mb-0.5 text-[11px]">
                          <DollarSign className="w-3 h-3" /> Starting Rate
                        </span>
                        <span className="font-bold text-zinc-900 dark:text-white font-mono tabular-nums">
                          ${service.startingPriceUsd} {service.currency || 'USD'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedServiceModal(service)}
                        className="flex-1 py-2 text-xs font-semibold rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                      >
                        View Full Details
                      </button>
                      <button
                        onClick={() => onNavigate('/start-project', service.id)}
                        className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 ${
                          isComingSoon
                            ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                            : 'bg-yellow-400 hover:bg-yellow-300 text-black'
                        }`}
                      >
                        <span>{isComingSoon ? 'Inquire Early' : 'Inquire'}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-2xl w-full p-6 sm:p-8 text-zinc-900 dark:text-white shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedServiceModal(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {selectedServiceModal.image && (
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden bg-zinc-950">
                <img
                  src={selectedServiceModal.image}
                  alt={selectedServiceModal.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div>
              <span className="text-xs font-mono uppercase text-yellow-600 dark:text-yellow-400 block mb-1">
                {selectedServiceModal.categoryLabel}
              </span>
              <h2 className="font-display text-2xl font-bold">
                {selectedServiceModal.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 mt-2 leading-relaxed">
                {selectedServiceModal.description}
              </p>
            </div>

            {/* Scope & Terms */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-zinc-400 block mb-0.5">Starting Rate:</span>
                <span className="font-mono font-bold text-sm text-zinc-900 dark:text-white">
                  ${selectedServiceModal.startingPriceUsd} USD
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block mb-0.5">Turnaround:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">
                  {selectedServiceModal.turnaround}
                </span>
              </div>
              <div>
                <span className="text-zinc-400 block mb-0.5">Availability:</span>
                <span className="font-semibold capitalize text-yellow-600 dark:text-yellow-400">
                  {selectedServiceModal.status}
                </span>
              </div>
            </div>

            {/* Revision Policy */}
            {selectedServiceModal.revisionPolicy && (
              <div className="p-3.5 rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-xs space-y-1">
                <span className="font-bold text-yellow-600 dark:text-yellow-400 block">
                  Revision Allowance Policy:
                </span>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {selectedServiceModal.revisionPolicy}
                </p>
              </div>
            )}

            {/* Complete Deliverables */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                All Included Deliverables:
              </h4>
              <div className="space-y-2">
                {selectedServiceModal.deliverables.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300">
                    <CheckCircle2 className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="px-4 py-2 text-xs font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const id = selectedServiceModal.id;
                  setSelectedServiceModal(null);
                  onNavigate('/start-project', id);
                }}
                className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded"
              >
                Inquire For This Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
