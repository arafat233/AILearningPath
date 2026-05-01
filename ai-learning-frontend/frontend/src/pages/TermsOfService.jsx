export default function TermsOfService() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div>
        <h1 className="text-[28px] font-bold text-[var(--label)] tracking-tight">Terms of Service</h1>
        <p className="text-[13px] text-apple-gray mt-0.5">Last updated: May 2026</p>
      </div>

      <Section title="1. Acceptance of Terms">
        By creating an account and using AILearn ("the Service"), you agree to be bound by these Terms
        of Service. If you do not agree, please do not use the Service.
      </Section>

      <Section title="2. Description of Service">
        AILearn provides an AI-powered exam preparation platform for CBSE Class 10 students. Features
        include adaptive practice questions, AI explanations, a study planner, live competitions, and
        personalised analytics.
      </Section>

      <Section title="3. Eligibility">
        The Service is intended for students aged 13 and above. Users under 18 should use the Service
        with parental consent. By registering, you confirm you meet these requirements.
      </Section>

      <Section title="4. User Accounts">
        <ul className="list-disc list-inside space-y-1 text-[13px] text-[var(--label2)]">
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
          <li>You must provide accurate information during registration.</li>
          <li>You must notify us immediately of any unauthorised use of your account.</li>
          <li>Each person may only maintain one account.</li>
        </ul>
      </Section>

      <Section title="5. Subscriptions and Payments">
        AILearn offers free and paid subscription tiers. Paid plans are billed monthly.
        All payments are processed securely via Razorpay. Subscription fees are non-refundable
        except where required by applicable law or in cases of demonstrated service failure.
        Plan details are available on the Pricing page.
      </Section>

      <Section title="6. Acceptable Use">
        You agree not to:
        <ul className="list-disc list-inside space-y-1 text-[13px] text-[var(--label2)] mt-2">
          <li>Share your account credentials with others.</li>
          <li>Attempt to reverse-engineer, scrape, or copy platform content.</li>
          <li>Use the Service for any unlawful purpose.</li>
          <li>Submit false or misleading information.</li>
          <li>Attempt to circumvent AI usage limits.</li>
        </ul>
      </Section>

      <Section title="7. Intellectual Property">
        All content on the platform — including questions, AI explanations, lessons, and curricula
        — is the intellectual property of AILearn or its licensors. You may not reproduce or
        distribute this content without express written permission.
      </Section>

      <Section title="8. Privacy">
        Your use of the Service is subject to our{" "}
        <a href="/privacy" className="text-apple-blue hover:underline">Privacy Policy</a>,
        which is incorporated by reference into these Terms.
      </Section>

      <Section title="9. Disclaimers">
        The Service is provided "as is" without warranties of any kind. AILearn does not guarantee
        specific academic outcomes. AI-generated explanations are for educational purposes and should
        not replace teacher guidance.
      </Section>

      <Section title="10. Limitation of Liability">
        To the fullest extent permitted by law, AILearn's total liability for any claim arising from
        use of the Service shall not exceed the amount paid by you in the 12 months preceding the claim.
      </Section>

      <Section title="11. Governing Law">
        These Terms are governed by the laws of India. Any disputes shall be subject to the
        jurisdiction of courts in Mumbai, Maharashtra.
      </Section>

      <Section title="12. Changes to Terms">
        We may update these Terms from time to time. Continued use of the Service after changes
        are posted constitutes acceptance of the updated Terms. Material changes will be notified
        via email.
      </Section>

      <Section title="13. Contact">
        For questions about these Terms, contact us at{" "}
        <a href="mailto:legal@ailearn.app" className="text-apple-blue hover:underline">legal@ailearn.app</a>.
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
