import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { AboutPage } from './pages/AboutPage';
import { PricingPage } from './pages/PricingPage';
import { AiToolsPage } from './pages/AiToolsPage';
import { StartProjectPage } from './pages/StartProjectPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminPage } from './pages/AdminPage';
import { CustomerPortalPage } from './pages/CustomerPortalPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });
  const [selectedServiceForProject, setSelectedServiceForProject] = useState<string | undefined>();

  // Sync state with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string, serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceForProject(serviceId);
    }
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPath) {
      case '/':
        return <HomePage onNavigate={navigateTo} />;
      case '/services':
        return <ServicesPage onNavigate={navigateTo} />;
      case '/portfolio':
        return <PortfolioPage onNavigate={navigateTo} />;
      case '/about':
        return <AboutPage onNavigate={navigateTo} />;
      case '/pricing':
        return <PricingPage onNavigate={navigateTo} />;
      case '/ai-tools':
        return <AiToolsPage onNavigate={navigateTo} />;
      case '/start-project':
        return <StartProjectPage initialServiceId={selectedServiceForProject} onNavigate={navigateTo} />;
      case '/contact':
        return <ContactPage onNavigate={navigateTo} />;
      case '/faq':
        return <FaqPage onNavigate={navigateTo} />;
      case '/privacy':
        return <PrivacyPage />;
      case '/terms':
        return <TermsPage />;
      case '/admin':
        return <AdminPage onNavigate={navigateTo} />;
      case '/portal':
        return <CustomerPortalPage onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
          <Navbar currentPath={currentPath} onNavigate={navigateTo} />
          <main className="flex-1 flex flex-col items-center w-full">
            {renderCurrentPage()}
          </main>
          <Footer onNavigate={navigateTo} />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
