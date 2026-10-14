import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export const FaqPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'Project Process & Turnaround',
      question: 'How quickly does ZA DIGITAL STUDIO start on new projects?',
      answer: 'Once your project brief is submitted and the milestone scope is mutually agreed upon, work commences within 1–2 business days. Baseline turnarounds range from 3–5 business days for design kits to 10–14 business days for custom web development.'
    },
    {
      category: 'Deliverables & Intellectual Property',
      question: 'Do I own the full copyright and source files upon completion?',
      answer: 'Yes. Upon final invoice settlement, 100% of intellectual property and commercial copyright for the finalized brand assets, vector master files (SVG, EPS, AI), and website source code are fully transferred to the client.'
    },
    {
      category: 'Revision Allowance',
      question: 'How are revision rounds managed?',
      answer: 'Each scoped package specifies dedicated revision allowance rounds (typically 1–2 structured revision rounds for Starter packages, with continuous feedback milestones on Custom projects). Additional revision loops outside agreed scope are billed at our standard transparent hourly rate.'
    },
    {
      category: 'AI Usage & Human Craftsmanship',
      question: 'How does ZA DIGITAL STUDIO utilize AI in creative work?',
      answer: 'We believe in AI as a precision accelerator for human creativity—not as a substitute for design craft. We use AI models to explore initial moodboard concepts, generate script variations, and automate technical data routing. Every visual layout, vector logo, and frontend codebase is architected, refined, and audited directly by human engineers and designers led by Zohaib Ali.'
    },
    {
      category: 'Billing & International Currency',
      question: 'What currencies and payment methods do you accept?',
      answer: 'Our standard quotes are calculated in USD ($). We accommodate international clients worldwide via verified bank transfers, Wise, or formal electronic business invoices. Card payments are supported via secure invoice links upon project agreement.'
    },
    {
      category: 'Web Tech Stack',
      question: 'What web frameworks and technologies do you build with?',
      answer: 'We specialize in modern high-performance web engineering using React, TypeScript, Tailwind CSS, Vite, and Node.js / Express. We prioritize sub-second load times, mobile accessibility, and clean semantic SEO.'
    }
  ];

  return (
    <div className="w-full py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Knowledge Base
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Clear answers about our methodology, deliverables, turnaround estimates, and intellectual property.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none"
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-yellow-600 dark:text-yellow-400 block mb-1">
                    {faq.category}
                  </span>
                  <span className="font-display text-base font-bold text-zinc-900 dark:text-white">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-yellow-500' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 p-6 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-center space-y-3">
        <div className="font-display text-base font-bold text-zinc-900 dark:text-white">
          Have a question not answered here?
        </div>
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          Contact founder Zohaib Ali directly or start your project brief today.
        </p>
        <div className="pt-1 flex justify-center gap-3">
          <button
            onClick={() => onNavigate('/contact')}
            className="px-4 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-100"
          >
            Contact Studio
          </button>
          <button
            onClick={() => onNavigate('/start-project')}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded"
          >
            Start a Project
          </button>
        </div>
      </div>
    </div>
  );
};
