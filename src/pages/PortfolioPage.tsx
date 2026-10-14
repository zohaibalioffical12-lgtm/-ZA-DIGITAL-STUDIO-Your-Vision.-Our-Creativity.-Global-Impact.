import React, { useEffect, useState } from 'react';
import { ExternalLink, X, ArrowUpRight, CheckCircle2, Layers, Sparkles } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioPageProps {
  onNavigate: (path: string, serviceId?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<PortfolioItem | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then((data) => {
        if (data.portfolio) setProjects(data.portfolio);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const categories = ['All', 'Branding', 'Graphic Design', 'Websites', 'AI Content', 'UI/UX', 'Automation'];

  const filtered = selectedCategory === 'All'
    ? projects
    : projects.filter((p) => p.category === selectedCategory);

  const handleOpenProject = (project: PortfolioItem) => {
    setActiveModalProject(project);
    setActiveGalleryIndex(0);
  };

  const modalImages = activeModalProject
    ? Array.from(new Set([activeModalProject.image, ...(activeModalProject.galleryImages || [])])).filter(Boolean)
    : [];

  return (
    <div className="w-full py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with Featured Portfolio Link */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <div className="max-w-2xl">
          <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
            Design &amp; Engineering Gallery
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Curated Portfolio &amp; Case Studies
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
            Explore our visual systems, responsive platforms, and AI-assisted creative executions. Every project below is clearly labeled with its objective, tools used, and final deliverables.
          </p>
        </div>

        {/* Prominent Featured Link to Zohaib Ali's Existing Portfolio */}
        <div className="p-5 rounded-lg bg-yellow-400/10 dark:bg-yellow-400/5 border border-yellow-400/30 max-w-md shrink-0">
          <div className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-1">
            Founder Portfolio Showcase
          </div>
          <p className="text-xs text-zinc-700 dark:text-zinc-300 mb-3">
            Review Zohaib Ali&rsquo;s live digital studio portfolio and design history:
          </p>
          <a
            href="https://zohaib-ali-portfolio-digital-studio.ai.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 rounded transition-colors"
          >
            <span>Open zohaib-ali-portfolio-digital-studio.ai.studio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedCategory === cat
                ? 'bg-zinc-900 text-yellow-400 dark:bg-yellow-400 dark:text-black shadow-sm'
                : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Portfolio Grid */}
      {loading ? (
        <div className="text-center py-20 text-zinc-500">Loading portfolio works...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          No projects currently found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <div
              key={project.id}
              onClick={() => handleOpenProject(project)}
              className="group cursor-pointer bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden flex flex-col justify-between hover:border-yellow-400/60 transition-all hover:shadow-xl"
            >
              {/* Media Thumbnail */}
              <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-[11px] font-mono text-yellow-400 border border-zinc-800 rounded">
                  {project.category}
                </div>
                {project.isSampleWork && (
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-zinc-900/90 text-[10px] text-zinc-300 border border-zinc-700 rounded">
                    Sample Showcase
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display text-xl font-bold text-zinc-900 dark:text-white group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-4 line-clamp-3">
                    {project.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.tools.map((tool, i) => (
                      <span key={i} className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                        {tool} {i < project.tools.length - 1 && '·'}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-900 dark:text-white">
                    <span className="group-hover:text-yellow-500 dark:group-hover:text-yellow-400 transition-colors">
                      View Project Case Study
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-yellow-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Study Detail Modal */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Close button */}
            <button
              onClick={() => setActiveModalProject(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black text-white rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image & Gallery Slider */}
            <div className="relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden">
              <img
                src={modalImages[activeGalleryIndex] || activeModalProject.image}
                alt={`${activeModalProject.title} - View ${activeGalleryIndex + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-4 left-4 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-xs font-mono text-yellow-400 border border-zinc-800 rounded">
                {activeModalProject.category}
              </div>
              {modalImages.length > 1 && (
                <div className="absolute top-4 right-16 px-2.5 py-1 bg-black/80 backdrop-blur-sm text-[11px] font-mono text-zinc-300 border border-zinc-800 rounded">
                  {activeGalleryIndex + 1} / {modalImages.length}
                </div>
              )}
              {activeModalProject.isSampleWork && (
                <div className="absolute bottom-4 left-4 px-2.5 py-1 bg-zinc-900/90 text-xs text-zinc-300 border border-zinc-700 rounded">
                  Sample Demonstration &middot; Studio Concept Work
                </div>
              )}

              {/* Multi-image thumbnail strip */}
              {modalImages.length > 1 && (
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 p-1 bg-black/70 backdrop-blur-md rounded-md border border-zinc-800">
                  {modalImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveGalleryIndex(i)}
                      className={`w-9 h-6 rounded overflow-hidden border transition-all ${
                        activeGalleryIndex === i
                          ? 'border-yellow-400 scale-105'
                          : 'border-zinc-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Content */}
            <div className="p-8 space-y-6">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                  {activeModalProject.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {activeModalProject.description}
                </p>
              </div>

              {/* Project Objective */}
              <div className="p-4 rounded-md bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400 mb-1.5">
                  Project Objective
                </h4>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {activeModalProject.objective}
                </p>
              </div>

              {/* Tools Used */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  Tools &amp; Technologies
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.tools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 text-xs font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Final Deliverables */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Final Deliverables
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeModalProject.deliverables.map((deliv, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                      <CheckCircle2 className="w-4 h-4 text-yellow-500 dark:text-yellow-400 shrink-0" />
                      <span>{deliv}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
                {activeModalProject.demoUrl && (
                  <a
                    href={activeModalProject.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white hover:text-yellow-500 transition-colors"
                  >
                    <span>View Live Prototype</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => {
                    setActiveModalProject(null);
                    onNavigate('/start-project');
                  }}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded transition-colors"
                >
                  Start Similar Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
