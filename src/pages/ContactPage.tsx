import React, { useState, useEffect } from 'react';
import { Mail, MessageCircle, ExternalLink, Send, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { AgencySettings } from '../types';
import { initialSettings } from '../server/defaultData';

export const ContactPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<AgencySettings>(initialSettings);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [brand, setBrand] = useState('');
  const [message, setMessage] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }
    if (!privacyConsent) {
      setErrorMsg('Please consent to the privacy policy before sending.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: name.trim(),
          businessEmail: email.trim().toLowerCase(),
          brandName: brand.trim() || name.trim(),
          serviceId: 'direct-contact-message',
          serviceName: 'Direct Studio Message',
          projectDescription: message.trim(),
          budgetRangeUsd: 'Not Specified',
          desiredDeadline: 'General Inquiry',
          privacyConsent: true
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to deliver message.');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setBrand('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Direct Channels
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
          Contact ZA DIGITAL STUDIO
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Reach founder Zohaib Ali directly for project inquiries, partnerships, or consultation requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Contact Cards & Socials */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-5">
            <h2 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
              Direct Contact Details
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-zinc-400 block mb-1">Founder &amp; Creative Lead</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {settings.founderName}
                </span>
              </div>

              <div>
                <span className="text-zinc-400 block mb-1">Business Email</span>
                <a
                  href={`mailto:${settings.businessEmail}`}
                  className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{settings.businessEmail}</span>
                </a>
              </div>

              {settings.messagingLink && (
                <div>
                  <span className="text-zinc-400 block mb-1">Direct Messaging / Chat</span>
                  <a
                    href={settings.messagingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-4 h-4 shrink-0" />
                    <span>Launch Chat Conversation</span>
                  </a>
                </div>
              )}

              <div>
                <span className="text-zinc-400 block mb-1">Founder's Existing Portfolio</span>
                <a
                  href={settings.existingPortfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-zinc-900 dark:text-white hover:text-yellow-500 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="truncate">{settings.existingPortfolioUrl}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-3">
            <h3 className="font-display text-sm font-bold text-zinc-900 dark:text-white">
              Official Social Profiles
            </h3>
            <p className="text-xs text-zinc-500">
              Only verified profiles authorized by the studio founder:
            </p>
            <div className="flex flex-col space-y-2 text-xs">
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-700 dark:text-zinc-300 hover:text-yellow-500 flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                >
                  <span>LinkedIn Profile</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-700 dark:text-zinc-300 hover:text-yellow-500 flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                >
                  <span>Instagram @zadigitalstudio</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-700 dark:text-zinc-300 hover:text-yellow-500 flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                >
                  <span>Facebook Page</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              )}
              {settings.behanceUrl && (
                <a
                  href={settings.behanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-700 dark:text-zinc-300 hover:text-yellow-500 flex items-center justify-between p-2 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800"
                >
                  <span>Behance Design Portfolio</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Direct Message Form */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-zinc-900 dark:text-white mb-2">
            Send a Direct Message
          </h2>
          <p className="text-xs text-zinc-500 mb-6">
            For specific project quotes with defined budgets, you may also use our{' '}
            <button
              onClick={() => onNavigate('/start-project')}
              className="text-yellow-600 dark:text-yellow-400 underline font-semibold"
            >
              Start a Project form
            </button>
            .
          </p>

          {success ? (
            <div className="p-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
              <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-white">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Your message has been registered in our agency inbox. Zohaib Ali will reply to your email shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-2 px-4 py-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-700"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full px-3 py-2 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Business Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com"
                    className="w-full px-3 py-2 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Brand or Company Name
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Optional brand name"
                  className="w-full px-3 py-2 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Message / Inquiry <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can ZA DIGITAL STUDIO assist your brand?"
                  className="w-full px-3 py-2 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                />
              </div>

              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={privacyConsent}
                    onChange={(e) => setPrivacyConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400"
                  />
                  <span className="text-xs text-zinc-500 leading-relaxed">
                    I agree to the privacy policy and consent to email communication regarding this inquiry.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 rounded transition-all flex items-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Direct Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
