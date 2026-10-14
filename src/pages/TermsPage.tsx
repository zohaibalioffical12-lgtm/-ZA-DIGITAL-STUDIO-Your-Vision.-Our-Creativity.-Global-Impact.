import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="w-full py-12 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-10">
        <div className="text-xs font-bold uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
          Legal &amp; Compliance
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-3">
          Terms of Service
        </h1>
        <p className="text-xs text-zinc-500">
          Last Updated: October 2026 &middot; ZA DIGITAL STUDIO
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-8 space-y-8 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            1. Agreement to Terms
          </h2>
          <p>
            By accessing this website, submitting a project brief, or engaging services provided by ZA DIGITAL STUDIO (&ldquo;Agency&rdquo;, founded by Zohaib Ali), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please do not use the services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            2. Scope &amp; Deliverables
          </h2>
          <p>
            Each creative, web development, or AI consulting engagement is governed by an agreed written brief or project proposal detailing specific deliverables, turnaround milestones, and fees. Work commences upon initial milestone approval. Requests outside the documented scope will be quoted separately.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            3. Intellectual Property Rights
          </h2>
          <p>
            Upon receipt of 100% of agreed fees for a completed project, the Agency assigns all copyright, title, and ownership of the final approved deliverables (such as customized vector logos, website code, and approved graphics) to the client. The Agency retains the right to display completed works in its portfolio and case studies unless a written Non-Disclosure Agreement (NDA) specifies otherwise.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            4. Revision Policies &amp; Turnaround
          </h2>
          <p>
            Package deliverables include specified revision rounds. Revisions constitute adjustments within the initial brief criteria. Fundamental changes in business direction, concept changes post-sign-off, or additional requests will be scoped and billed accordingly. Turnaround estimates depend on timely client feedback.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            5. Limitation of Liability
          </h2>
          <p>
            ZA DIGITAL STUDIO provides its services with high professional standards. However, the Agency is not liable for indirect, punitive, or consequential damages resulting from third-party hosting downtime, API changes, or client misuse of delivered materials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base font-bold text-zinc-900 dark:text-white">
            6. Governing Jurisdiction &amp; Inquiries
          </h2>
          <p>
            For any contractual questions or inquiries regarding these Terms of Service, please reach out to Zohaib Ali at:
          </p>
          <p className="font-mono text-xs text-yellow-600 dark:text-yellow-400 font-semibold">
            zohaibalioffical12@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
};
