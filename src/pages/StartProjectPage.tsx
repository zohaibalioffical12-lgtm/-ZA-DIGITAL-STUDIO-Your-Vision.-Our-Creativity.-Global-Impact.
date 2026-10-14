import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Copy, Check, ExternalLink } from 'lucide-react';
import { ServiceItem } from '../types';

interface StartProjectPageProps {
  initialServiceId?: string;
  onNavigate: (path: string) => void;
}

export const StartProjectPage: React.FC<StartProjectPageProps> = ({ initialServiceId, onNavigate }) => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
  const [clientName, setClientName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [brandName, setBrandName] = useState('');
  const [country, setCountry] = useState('United States');
  const [serviceId, setServiceId] = useState(initialServiceId || 'logo-brand-identity');
  const [projectDescription, setProjectDescription] = useState('');
  const [budgetRangeUsd, setBudgetRangeUsd] = useState('$500 - $1,500');
  const [desiredDeadline, setDesiredDeadline] = useState('2 to 4 weeks');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState(''); // Spam honeypot trap

  // Submission States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedInquiry, setSubmittedInquiry] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then((data) => {
        if (data.services) setServices(data.services);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (initialServiceId) {
      setServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  // Validation functions
  const validateStep1 = () => {
    if (!clientName.trim()) {
      setErrorMsg('Please provide your full client or representative name.');
      return false;
    }
    if (!businessEmail.trim() || !businessEmail.includes('@') || !businessEmail.includes('.')) {
      setErrorMsg('Please provide a valid business email address for proposal delivery.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const validateStep2 = () => {
    if (!projectDescription.trim() || projectDescription.trim().length < 15) {
      setErrorMsg('Please describe your project scope in at least 15 characters.');
      return false;
    }
    setErrorMsg(null);
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot spam trap
    if (honeypot) {
      console.warn('Bot submission blocked');
      return;
    }

    if (!privacyConsent) {
      setErrorMsg('You must agree to the privacy policy before submitting your inquiry.');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    const selectedServiceObj = services.find((s) => s.id === serviceId);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: clientName.trim(),
          businessEmail: businessEmail.trim().toLowerCase(),
          brandName: (brandName || clientName).trim(),
          country: country.trim(),
          serviceId,
          serviceName: selectedServiceObj ? selectedServiceObj.title : serviceId,
          budgetRangeUsd,
          desiredDeadline,
          projectDescription: projectDescription.trim(),
          referenceLinks: referenceLinks.trim(),
          privacyConsent: true
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry to server.');
      }

      setSubmittedInquiry(data.inquiry);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyId = () => {
    if (!submittedInquiry?.id) return;
    navigator.clipboard.writeText(submittedInquiry.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="w-full py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Project Intake
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3">
          Start a Project with ZA DIGITAL STUDIO
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Provide your specifications below. We will analyze your project brief and reply with scope details and turnaround timeline within 24 hours.
        </p>
      </div>

      {submittedInquiry ? (
        /* ========================================================
           SUCCESS STATE (Only rendered when server actually responds 201)
           ======================================================== */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 sm:p-10 shadow-lg text-center space-y-6">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-zinc-900 dark:text-white">
              Project Brief Registered Successfully!
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
              Thank you, <span className="font-semibold text-zinc-900 dark:text-white">{submittedInquiry.clientName}</span>. Your brief has been securely routed into our agency management system.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 max-w-md mx-auto text-left space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
              <span className="text-zinc-400">Inquiry Tracking ID:</span>
              <div className="flex items-center gap-1.5 font-mono font-bold text-zinc-900 dark:text-white">
                <span>{submittedInquiry.id}</span>
                <button
                  onClick={handleCopyId}
                  className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded"
                  title="Copy Tracking ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                </button>
              </div>
            </div>

            <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
              <div><strong>Service:</strong> {submittedInquiry.serviceName}</div>
              <div><strong>Estimated Budget:</strong> {submittedInquiry.budgetRangeUsd}</div>
              <div><strong>Email:</strong> {submittedInquiry.businessEmail}</div>
              <div><strong>Initial Status:</strong> <span className="text-yellow-600 dark:text-yellow-400 font-semibold uppercase text-[10px]">New Review</span></div>
            </div>
          </div>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <button
              onClick={() => onNavigate('/portal')}
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded-md transition-colors"
            >
              Track Status in Client Portal
            </button>
            <button
              onClick={() => {
                setSubmittedInquiry(null);
                setCurrentStep(1);
              }}
              className="px-5 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        /* ========================================================
           MULTI-STEP FORM
           ======================================================== */
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 sm:p-10 shadow-sm">
          {/* Step Progress Indicator (Clean Editorial Style) */}
          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-5 mb-8 text-xs font-mono">
            {[
              { num: 1, label: 'Contact Details' },
              { num: 2, label: 'Scope & Service' },
              { num: 3, label: 'Budget & Timeline' }
            ].map((step) => (
              <div
                key={step.num}
                className={`flex items-center gap-2 ${
                  currentStep === step.num
                    ? 'text-yellow-500 dark:text-yellow-400 font-bold'
                    : currentStep > step.num
                    ? 'text-emerald-500 font-semibold'
                    : 'text-zinc-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px]">
                  {currentStep > step.num ? '✓' : step.num}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </div>
            ))}
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-400 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot Spam Protection (Invisible to humans) */}
            <div className="hidden" aria-hidden="true">
              <input
                type="text"
                name="website_trap"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>

            {/* STEP 1: Contact Details */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Your Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Alex Henderson"
                      className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Business Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={businessEmail}
                      onChange={(e) => setBusinessEmail(e.target.value)}
                      placeholder="e.g. alex@company.com"
                      className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Brand or Business Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Henderson Design Studio"
                      className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Country of Operation
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United Kingdom, USA, UAE..."
                      className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded transition-all flex items-center gap-2"
                  >
                    <span>Continue to Project Scope</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Scope & Service */}
            {currentStep === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Select Required Service <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.categoryLabel} &mdash; {s.title} (${s.startingPriceUsd}+)
                      </option>
                    ))}
                    <option value="custom-project">Custom Multi-Service Package</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Project Description &amp; Goals <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="Describe your current challenge, target audience, preferred visual direction, and what success looks like for this project."
                    className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Reference Links or Current Website (Optional)
                  </label>
                  <input
                    type="text"
                    value={referenceLinks}
                    onChange={(e) => setReferenceLinks(e.target.value)}
                    placeholder="e.g. https://mywebsite.com, https://figma.com/file/..."
                    className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    &larr; Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 rounded transition-all flex items-center gap-2"
                  >
                    <span>Continue to Budget &amp; Timeline</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Budget, Timeline & Consent */}
            {currentStep === 3 && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Estimated Budget Range (USD)
                    </label>
                    <select
                      value={budgetRangeUsd}
                      onChange={(e) => setBudgetRangeUsd(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option>&lt; $500 USD (Starter Items)</option>
                      <option>$500 - $1,500 USD</option>
                      <option>$1,500 - $3,000 USD</option>
                      <option>$3,000 - $6,000 USD</option>
                      <option>$6,000+ USD (Enterprise)</option>
                      <option>Open / Need Exact Quote</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                      Desired Deadline / Launch Window
                    </label>
                    <select
                      value={desiredDeadline}
                      onChange={(e) => setDesiredDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    >
                      <option>Urgent (Within 1 week &middot; Expedited)</option>
                      <option>2 to 4 weeks</option>
                      <option>1 to 2 months</option>
                      <option>Flexible / Quality-First</option>
                    </select>
                  </div>
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      checked={privacyConsent}
                      onChange={(e) => setPrivacyConsent(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-yellow-500 rounded focus:ring-yellow-400"
                    />
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      I consent to the collection and processing of my project details in accordance with ZA DIGITAL STUDIO&rsquo;s{' '}
                      <button
                        type="button"
                        onClick={() => onNavigate('/privacy')}
                        className="text-yellow-600 dark:text-yellow-400 underline"
                      >
                        Privacy Policy
                      </button>
                      . I understand this will create a project record in the studio management system.
                    </span>
                  </label>
                </div>

                <div className="pt-4 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  >
                    &larr; Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !privacyConsent}
                    className="px-7 py-3 text-xs font-bold uppercase tracking-wider text-black bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-all shadow-md flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-yellow-400"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Registering Brief in Backend...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Project Brief</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
