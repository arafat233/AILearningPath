export default function PrivacyPolicy() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Privacy Policy</h1>
        <p className="text-[13px] text-apple-gray mt-0.5">Last updated: May 2026</p>
      </div>

      <Section title="1. Introduction">
        Stellar ("we", "us", "our") is committed to protecting the privacy of our users. This Privacy
        Policy explains how we collect, use, and safeguard your personal information when you use
        the Stellar platform.
      </Section>

      <Section title="2. Information We Collect">
        <ul className="list-disc list-inside space-y-1 text-[13px] text-[var(--label2)]">
          <li><strong>Account data</strong>: name, email address, grade, subject preferences.</li>
          <li><strong>Learning data</strong>: practice attempts, accuracy, time spent, weak topics.</li>
          <li><strong>Usage data</strong>: pages visited, features used, session duration.</li>
          <li><strong>Payment data</strong>: Razorpay transaction IDs (we do not store card details).</li>
          <li><strong>Communications</strong>: doubt questions and AI interactions.</li>
        </ul>
      </Section>

      <Section title="3. How We Use Your Information">
        <ul className="list-disc list-inside space-y-1 text-[13px] text-[var(--label2)]">
          <li>Personalise practice sessions and study recommendations.</li>
          <li>Provide AI explanations tailored to your mistake patterns.</li>
          <li>Send transactional emails (welcome, receipt, password reset).</li>
          <li>Allow parents/teachers linked to your account to view your progress.</li>
          <li>Improve the platform through aggregated, anonymised analytics.</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </Section>

      <Section title="4. Data Sharing">
        We do not sell your personal data. We share data only:
        <ul className="list-disc list-inside space-y-1 text-[13px] text-[var(--label2)] mt-2">
          <li>With service providers (Razorpay for payments, email delivery providers) under strict confidentiality.</li>
          <li>With parents or teachers you have explicitly linked to your account.</li>
          <li>When required by law or to protect the safety of our users.</li>
        </ul>
      </Section>

      <Section title="5. Data Retention">
        We retain your account and learning data for as long as your account is active. You may
        delete your account at any time from Settings → Danger Zone. Upon deletion, all personal
        data including attempts, doubt threads, and error memory is permanently removed within 30 days.
      </Section>

      <Section title="6. Cookies and Tracking">
        We use HTTP-only cookies for authentication (access token, refresh token). We do not use
        third-party tracking cookies or advertising networks. Session cookies are cleared on logout.
      </Section>

      <Section title="7. Children's Privacy (COPPA / PDPB)">
        The Service is intended for users aged 13 and above. Users under 18 should obtain parental
        consent before registering. We do not knowingly collect data from children under 13. If you
        believe a child under 13 has registered, please contact us and we will delete the account.
      </Section>

      <Section title="8. Security">
        We use industry-standard security measures including bcrypt password hashing, JWT with short
        expiry, refresh token rotation with family tracking, HTTPS enforcement, and MongoDB access
        controls. No system is 100% secure; please report security issues to security@ailearn.app.
      </Section>

      <Section title="9. Your Rights (under PDPB / GDPR)">
        <ul className="list-disc list-inside space-y-1 text-[13px] text-[var(--label2)]">
          <li><strong>Access</strong>: Request a copy of your personal data.</li>
          <li><strong>Correction</strong>: Update your data via Settings.</li>
          <li><strong>Deletion</strong>: Delete your account and all data from Settings.</li>
          <li><strong>Portability</strong>: Request an export of your learning data.</li>
        </ul>
        To exercise these rights, email{" "}
        <a href="mailto:privacy@ailearn.app" className="text-apple-blue hover:underline">privacy@ailearn.app</a>.
      </Section>

      <Section title="10. Changes to This Policy">
        We may update this Privacy Policy periodically. Material changes will be communicated via
        email. Continued use of the Service after changes take effect constitutes acceptance.
      </Section>

      <Section title="11. Contact">
        For privacy-related queries, contact:{" "}
        <a href="mailto:privacy@ailearn.app" className="text-apple-blue hover:underline">privacy@ailearn.app</a>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="card p-5 space-y-2">
      <h2 className="text-[15px] font-semibold text-[var(--label)]">{title}</h2>
      <p className="text-[13px] text-[var(--label2)] leading-relaxed">{children}</p>
    </div>
  );
}
