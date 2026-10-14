import React, { useState, useEffect } from 'react';
import { Sun, Moon, Menu, X, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, customerUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>('/src/assets/images/agency_logo_brandmark_1791996688384.jpg');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings?.websiteLogo) setLogoUrl(data.settings.websiteLogo);
      })
      .catch(() => {});

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Services', path: '/services' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'AI Tools', path: '/ai-tools' },
    { label: 'About', path: '/about' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? 'bg-zinc-950/90 dark:bg-zinc-950/90 bg-white/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/80 shadow-sm'
          : 'bg-zinc-950 dark:bg-zinc-950 bg-white border-b border-zinc-200 dark:border-zinc-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark & emblem */}
        <button
          onClick={() => handleLinkClick('/')}
          className="flex items-center gap-2.5 text-left group focus:outline-none whitespace-nowrap shrink-0"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="ZA DIGITAL STUDIO Logo"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded object-cover shadow-sm ring-1 ring-yellow-400/40"
              onError={() => setLogoUrl('')}
            />
          ) : (
            <span className="w-2.5 h-6 bg-yellow-400 group-hover:bg-yellow-300 transition-colors inline-block" />
          )}
          <span className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-white uppercase">
            ZA DIGITAL STUDIO
          </span>
        </button>

        {/* Zone 2: 4–5 single-line clean text links with subtle hover underlines */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleLinkClick(item.path)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
                  isActive
                    ? 'text-yellow-500 dark:text-yellow-400 font-semibold border-b-2 border-yellow-400'
                    : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action + Theme Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-md focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-zinc-700" />}
          </button>

          {/* User state badge if authenticated */}
          {isAdmin && (
            <button
              onClick={() => handleLinkClick('/admin')}
              className="hidden lg:inline-flex items-center text-xs font-semibold text-red-500 dark:text-red-400 hover:underline px-2 py-1 whitespace-nowrap shrink-0"
            >
              Admin Mode
            </button>
          )}

          {customerUser && !isAdmin && (
            <button
              onClick={() => handleLinkClick('/portal')}
              className="hidden lg:inline-flex items-center text-xs font-semibold text-yellow-500 dark:text-yellow-400 hover:underline px-2 py-1 whitespace-nowrap shrink-0"
            >
              Portal Active
            </button>
          )}

          {/* Single Primary CTA */}
          <button
            onClick={() => handleLinkClick('/start-project')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 active:scale-95 transition-all shadow-sm rounded-md whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-yellow-400"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-zinc-950 dark:bg-zinc-950 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => handleLinkClick(item.path)}
                className={`text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  currentPath === item.path
                    ? 'bg-yellow-400/10 text-yellow-500 dark:text-yellow-400 font-semibold'
                    : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleLinkClick('/contact')}
              className={`text-left px-3 py-2 text-sm font-medium rounded-md ${
                currentPath === '/contact'
                  ? 'bg-yellow-400/10 text-yellow-500 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              Contact
            </button>
            <button
              onClick={() => handleLinkClick('/faq')}
              className={`text-left px-3 py-2 text-sm font-medium rounded-md ${
                currentPath === '/faq'
                  ? 'bg-yellow-400/10 text-yellow-500 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              FAQ
            </button>
            <button
              onClick={() => handleLinkClick('/portal')}
              className={`text-left px-3 py-2 text-sm font-medium rounded-md ${
                currentPath === '/portal'
                  ? 'bg-yellow-400/10 text-yellow-500 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              Client Project Portal
            </button>
            <button
              onClick={() => handleLinkClick('/admin')}
              className={`text-left px-3 py-2 text-sm font-medium rounded-md ${
                currentPath === '/admin'
                  ? 'bg-yellow-400/10 text-yellow-500 font-semibold'
                  : 'text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              Studio Admin
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleLinkClick('/start-project')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded-md shadow-sm"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
