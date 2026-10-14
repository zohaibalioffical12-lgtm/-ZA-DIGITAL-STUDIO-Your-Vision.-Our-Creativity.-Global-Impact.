import React, { useState } from 'react';
import { Sparkles, Copy, Check, RefreshCw, AlertCircle, Info, ArrowUpRight, Calendar } from 'lucide-react';
import { AiToolType } from '../server/gemini';

interface ToolConfig {
  id: AiToolType;
  title: string;
  description: string;
  inputLabel: string;
  placeholder: string;
  hasIndustry?: boolean;
  hasTone?: boolean;
  hasPlatform?: boolean;
}

export const AiToolsPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const tools: ToolConfig[] = [
    {
      id: 'business-description',
      title: 'Business Description Generator',
      description: 'Generate an executive overview, brand mission, and core value proposition.',
      inputLabel: 'Describe your business or venture idea',
      placeholder: 'e.g. Modern sustainable coffee brand sourcing organic beans with compostable packaging',
      hasIndustry: true,
      hasTone: true
    },
    {
      id: 'brand-names',
      title: 'Brand Name Idea Generator',
      description: 'Brainstorm 6 distinctive, memorable brand name concepts with taglines.',
      inputLabel: 'What is the core essence and product of the brand?',
      placeholder: 'e.g. High-performance electric urban bicycles with minimalist Scandinavian design',
      hasIndustry: true,
      hasTone: true
    },
    {
      id: 'social-caption',
      title: 'Social Media Caption Generator',
      description: 'Craft high-converting hooks, value-packed body copy, and hashtags.',
      inputLabel: 'What topic or product are you posting about?',
      placeholder: 'e.g. Announcing the launch of our new client portal for streamlined project tracking',
      hasPlatform: true,
      hasTone: true
    },
    {
      id: 'website-planner',
      title: 'Website Content Planner',
      description: 'Map out a conversion-focused sitemap, hero proposition, and key content sections.',
      inputLabel: 'What is the goal and audience of the website?',
      placeholder: 'e.g. Boutique immigration consultancy targeting international tech entrepreneurs',
      hasIndustry: true
    },
    {
      id: 'video-script',
      title: 'Promotional Video Script Generator',
      description: 'Write scene-by-scene commercial scripts with visual cues and voiceovers.',
      inputLabel: 'What are you promoting in the 30-second commercial?',
      placeholder: 'e.g. Mobile app that automates invoice reconciliation for independent freelancers',
      hasTone: true
    },
    {
      id: 'project-brief',
      title: 'Project Brief Generator',
      description: 'Create an agency-grade structured project brief with scope and milestones.',
      inputLabel: 'Summarize your project goals and required deliverables',
      placeholder: 'e.g. Complete rebranding and multi-page marketing website launch before Q4',
      hasIndustry: true,
      hasTone: true
    },
    {
      id: 'content-calendar',
      title: 'Content Calendar Generator',
      description: 'Develop a 4-week structured content calendar with daily post hooks and themes.',
      inputLabel: 'What product, service, or personal brand are you planning content for?',
      placeholder: 'e.g. B2B design agency positioning for high-end enterprise clients',
      hasIndustry: true,
      hasTone: true
    }
  ];

  const [activeToolId, setActiveToolId] = useState<AiToolType>('business-description');
  const [inputText, setInputText] = useState('');
  const [industry, setIndustry] = useState('Digital & Tech');
  const [tone, setTone] = useState('Modern & Professional');
  const [platform, setPlatform] = useState('Instagram & LinkedIn');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);
  const [modelUsed, setModelUsed] = useState<string | undefined>();
  const [serverNotice, setServerNotice] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeTool = tools.find((t) => t.id === activeToolId)!;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setErrorMsg('Please enter a description or prompt to generate content.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setServerNotice(null);
    setResult(null);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolType: activeToolId,
          prompt: inputText.trim(),
          industry,
          tone,
          platform
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate output');
      }

      setResult(data.result);
      setIsAiGenerated(Boolean(data.isAiGenerated));
      setModelUsed(data.modelUsed);
      if (data.notice) {
        setServerNotice(data.notice);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Generation request failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Studio AI Intelligence
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
          Interactive AI Tools Hub
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Explore our suite of 7 creative intelligence tools powered by Google Gemini. Generate business descriptions, brand names, social captions, sitemaps, video scripts, briefs, and content calendars in seconds.
        </p>
      </div>

      {/* Grid: Left column Tools Switcher, Right column Active Tool Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Tool Selector List */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block px-1 mb-2">
            Select Tool ({tools.length})
          </span>
          {tools.map((t) => {
            const isActive = t.id === activeToolId;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveToolId(t.id);
                  setResult(null);
                  setErrorMsg(null);
                  setServerNotice(null);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-yellow-400 dark:text-black border-zinc-900 dark:border-yellow-400 shadow-sm'
                    : 'bg-white dark:bg-zinc-900/60 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700'
                }`}
              >
                <div className="font-display text-sm font-bold">{t.title}</div>
                <div
                  className={`text-[11px] mt-1 line-clamp-2 ${
                    isActive ? 'text-zinc-300 dark:text-zinc-900' : 'text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {t.description}
                </div>
              </button>
            );
          })}

          <div className="mt-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-white">
              <Info className="w-4 h-4 text-yellow-500" />
              <span>Need custom automation?</span>
            </div>
            <p>
              We engineer bespoke AI pipelines and forms customized for your CRM and internal databases.
            </p>
            <button
              onClick={() => onNavigate('/start-project')}
              className="text-yellow-600 dark:text-yellow-400 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Start an AI Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Tool Form & Output Workspace */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-6">
              <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
                {activeTool.title}
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                {activeTool.description}
              </p>
            </div>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Main Prompt */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                  {activeTool.inputLabel} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={activeTool.placeholder}
                  className="w-full px-3.5 py-2.5 text-sm rounded-md bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              {/* Tool Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {activeTool.hasIndustry && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      Industry Focus
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    >
                      <option>Creative &amp; Design</option>
                      <option>Tech &amp; SaaS</option>
                      <option>E-Commerce &amp; Retail</option>
                      <option>Education &amp; Coaching</option>
                      <option>Architecture &amp; Real Estate</option>
                      <option>Health &amp; Wellness</option>
                    </select>
                  </div>
                )}

                {activeTool.hasTone && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      Tone of Voice
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    >
                      <option>Modern &amp; Authoritative</option>
                      <option>Creative &amp; Bold</option>
                      <option>Minimalist &amp; Elegant</option>
                      <option>Energetic &amp; Persuasive</option>
                      <option>Corporate &amp; Executive</option>
                    </select>
                  </div>
                )}

                {activeTool.hasPlatform && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1">
                      Primary Platform
                    </label>
                    <select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    >
                      <option>Instagram &amp; LinkedIn</option>
                      <option>Twitter / X &amp; Threads</option>
                      <option>YouTube &amp; TikTok</option>
                      <option>Email &amp; Direct Outreach</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all flex items-center gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-yellow-400"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating with Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate Output</span>
                    </>
                  )}
                </button>
                <span className="text-[11px] text-zinc-400">
                  Rate protected &middot; Powered by Gemini 3.8
                </span>
              </div>
            </form>

            {/* Error Message */}
            {errorMsg && (
              <div className="mt-6 p-4 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Fallback Notice if in template mode */}
            {serverNotice && (
              <div className="mt-6 p-4 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div>
                  <span className="font-bold block mb-0.5">Template Notice</span>
                  <span>{serverNotice}</span>
                </div>
              </div>
            )}

            {/* Generated Results Area */}
            {result && (
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                      Generated Result
                    </span>
                    {isAiGenerated ? (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded">
                        AI Verified ({modelUsed || 'Gemini 3.8'})
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 rounded">
                        Studio Structured Template
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Output</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
