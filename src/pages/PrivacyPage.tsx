import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="w-full py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Legal &amp; Compliance
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-zinc-500">
          Effective Date: October 2026 &middot; ZA DIGITAL STUDIO
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 space-y-8 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            1. Overview &amp; Commitment
          </h2>
          <p>
            ZA DIGITAL STUDIO, founded by Zohaib Ali (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), respects your privacy and is dedicated to protecting the personal data of all clients and website visitors. This Privacy Policy details how we collect, store, and utilize information submitted through our website and project intake forms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            2. Information We Collect
          </h2>
          <p>
            We collect information provided directly by you when submitting a project brief, inquiry, or contact message, including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-600 dark:text-zinc-400">
            <li>Full Name and contact details</li>
            <li>Business Email address and business/brand name</li>
            <li>Country of operation</li>
            <li>Project requirements, scope descriptions, budget ranges, and reference materials</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            3. Purpose of Processing
          </h2>
          <p>
            The collected information is utilized solely to:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-600 dark:text-zinc-400">
            <li>Analyze your requirements and prepare project proposals and estimates</li>
            <li>Communicate project milestones and deliver client updates</li>
            <li>Enable authorized clients to track project status within the Client Portal</li>
            <li>Maintain audit and communication history for active service agreements</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            4. Data Retention &amp; Third Parties
          </h2>
          <p>
            We never sell, rent, or trade your personal data to data brokers or advertising third parties. Your data is stored on secure servers and retained only as long as necessary to fulfill project requirements and maintain administrative records.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            5. Your Rights &amp; Contact
          </h2>
          <p>
            Under international privacy standards (including GDPR and CCPA where applicable), you have the right to request access to, correction of, or deletion of your project records at any time. For privacy inquiries, please contact:
          </p>
          <p className="font-mono text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
            Email: zohaibalioffical12@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};
