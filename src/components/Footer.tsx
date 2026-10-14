import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Mail, MessageCircle, ExternalLink } from 'lucide-react';
import { AgencySettings } from '../types';
import { initialSettings } from '../server/defaultData';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<AgencySettings>(initialSettings);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-zinc-950 text-zinc-300 border-t border-zinc-900 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-yellow-400 inline-block" />
              <span className="font-display text-lg font-bold tracking-tight text-white uppercase">
                {settings.brandName}
              </span>
            </div>
            <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
              {settings.tagline} International creative studio founded by {settings.founderName}, specializing in brand identity, high-speed web development, and AI-assisted digital solutions.
            </p>
            <div className="pt-2">
              <a
                href={settings.existingPortfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <span>View Founder's Portfolio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">Navigation</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={() => onNavigate('/services')} className="hover:text-white transition-colors">
                  Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/portfolio')} className="hover:text-white transition-colors">
                  Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/pricing')} className="hover:text-white transition-colors">
                  Pricing Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/ai-tools')} className="hover:text-white transition-colors">
                  AI Tools Hub
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  About the Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Client & Legal Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">Client Center</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li>
                <button onClick={() => onNavigate('/start-project')} className="hover:text-white transition-colors">
                  Start a Project
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/portal')} className="hover:text-white transition-colors">
                  Track Project Status
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Contact Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-white transition-colors">
                  Questions &amp; FAQ
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

          {/* Direct Contact & Socials */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-100">Direct Inquiries</h3>
            <div className="space-y-2 text-sm text-zinc-400">
              <a
                href={`mailto:${settings.businessEmail}`}
                className="flex items-center gap-2 hover:text-white transition-colors truncate"
              >
                <Mail className="w-4 h-4 text-yellow-400 shrink-0" />
                <span className="truncate">{settings.businessEmail}</span>
              </a>
              {settings.messagingLink && (
                <a
                  href={settings.messagingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Direct Messaging</span>
                </a>
              )}
            </div>

            <div className="pt-2">
              <span className="text-xs text-zinc-500 block mb-2">Connect:</span>
              <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
                {settings.linkedinUrl && (
                  <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    LinkedIn
                  </a>
                )}
                {settings.instagramUrl && (
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Instagram
                  </a>
                )}
                {settings.facebookUrl && (
                  <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Facebook
                  </a>
                )}
                {settings.behanceUrl && (
                  <a href={settings.behanceUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                    Behance
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            &copy; {currentYear} {settings.brandName}. All rights reserved. Founded by {settings.founderName}.
          </div>
          <div className="flex items-center gap-6">
            <span>&ldquo;{settings.tagline}&rdquo;</span>
            <span aria-hidden="true">&middot;</span>
            <button onClick={() => onNavigate('/admin')} className="hover:text-zinc-300 transition-colors">
              Owner Sign-In
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
