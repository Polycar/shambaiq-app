import Link from "next/link";
import { Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | ShambaIQ",
  description: "How ShambaIQ collects, uses, and protects your personal and farm data. We never sell your data — it is used only to improve your farming recommendations.",
  alternates: { canonical: "https://shambaiq.com/privacy" },
  openGraph: { title: "Privacy Policy | ShambaIQ", description: "How ShambaIQ collects, uses, and protects your personal and farm data.", url: "https://shambaiq.com/privacy" },
  twitter: { card: "summary", title: "Privacy Policy | ShambaIQ", description: "How ShambaIQ handles your personal and farm data." },
};

const EFFECTIVE_DATE = "28 May 2026";
const CONTACT_EMAIL = "info@shambaiq.com";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-lg font-bold text-forest-700 mb-3 pb-2 border-b border-cream-300">{title}</h2>
      <div className="text-sm text-soil-600 leading-relaxed space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream-100">
      {/* Header */}
      <div className="bg-gradient-to-br from-forest-800 to-forest-700 text-white py-12 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Shield size={28} className="text-gold-400" />
          <h1 className="font-display text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-cream-300 text-sm">Effective date: {EFFECTIVE_DATE}</p>
        <p className="text-cream-400 text-xs mt-1">Governed by the Kenya Data Protection Act, 2019</p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-cream-300 px-6 sm:px-10 py-8">

          <p className="text-sm text-soil-600 leading-relaxed mb-8">
            ShambaIQ ("we", "us", "our") is operated by Polycar Limited, registered in Kenya. We are a data controller
            under the Kenya Data Protection Act, 2019 (DPA 2019). This policy explains what personal data we collect,
            why we collect it, and your rights over it. We have written it in plain language — no legalese.
          </p>

          <Section title="1. What data we collect">
            <p><strong>Account information:</strong> Your phone number and, optionally, your name and email address when you register.</p>
            <p><strong>Farm data:</strong> Your county, the crops you grow, farm size, and soil analysis results (pH, nitrogen, phosphorus, potassium levels, health scores).</p>
            <p><strong>Diagnosis history:</strong> Photos you upload to Plant Doctor and the AI-generated diagnosis results. Photos are processed by Google Gemini AI and are not stored on our servers after analysis.</p>
            <p><strong>Chat history:</strong> Conversations with Shamba Mshauri (Ask Agronomist) are stored in your browser session only. They are not saved to our servers.</p>
            <p><strong>Usage data:</strong> Pages visited, features used, and general device information (browser type, screen size). We do not use third-party advertising trackers.</p>
            <p><strong>Session cookies:</strong> A single session cookie (<code className="bg-cream-100 px-1 rounded text-xs font-mono">shambaiq_session</code>) keeps you logged in. It contains your name and a secure token — not your password.</p>
          </Section>

          <Section title="2. Why we collect it">
            <p><strong>To provide the service:</strong> Soil reports, fertilizer recommendations, and AI diagnosis require your county and crop data to be accurate and locally relevant.</p>
            <p><strong>To personalise your experience:</strong> Your farm profile lets Ask Agronomist answer questions without you having to repeat your location and crop every time.</p>
            <p><strong>To improve the platform:</strong> Aggregated, anonymous usage data helps us understand which features are most useful. We never sell individual data.</p>
            <p><strong>To contact you:</strong> We may send important service updates by SMS to your registered number. We will not send marketing messages without your explicit consent.</p>
          </Section>

          <Section title="3. How we use AI">
            <p>
              ShambaIQ uses Google Gemini AI to power Plant Doctor and Ask Agronomist. When you submit a photo or chat
              message, it is sent to Google's API for processing. Google's use of this data is governed by their
              privacy policy. We send only the minimum data needed — we do not send your phone number or personal
              identifiers to the AI.
            </p>
            <p>
              Soil analysis recommendations are generated using satellite data and agronomic models — no personal data
              is shared with satellite data providers.
            </p>
          </Section>

          <Section title="4. Who we share data with">
            <p>We do <strong>not</strong> sell your personal data to anyone.</p>
            <p>We may share data with:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Google (Gemini AI):</strong> For AI diagnosis and chat processing.</li>
              <li><strong>Railway:</strong> Our cloud hosting provider, where your data is stored on servers in the European Union.</li>
              <li><strong>Law enforcement:</strong> Only if required by a valid court order under Kenyan law.</li>
            </ul>
          </Section>

          <Section title="5. How long we keep your data">
            <p>Your account and farm data are kept for as long as your account is active. Soil reports and diagnosis history are kept indefinitely so you can track your farm's progress over time.</p>
            <p>If you delete your account, all your personal data is permanently deleted within 30 days.</p>
          </Section>

          <Section title="6. Your rights under the Data Protection Act, 2019">
            <p>As a data subject under the DPA 2019, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Access:</strong> Request a copy of all personal data we hold about you.</li>
              <li><strong>Correction:</strong> Ask us to correct inaccurate data.</li>
              <li><strong>Erasure:</strong> Ask us to delete your account and all associated data.</li>
              <li><strong>Objection:</strong> Object to how we use your data.</li>
              <li><strong>Portability:</strong> Request your farm data in a machine-readable format (CSV).</li>
            </ul>
            <p>
              To exercise any of these rights, email us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-forest-600 font-medium hover:underline">{CONTACT_EMAIL}</a>.
              We will respond within 21 days as required by the DPA 2019.
            </p>
          </Section>

          <Section title="7. Data security">
            <p>
              All data is transmitted over HTTPS. Passwords are never stored — we use phone-number-based OTP
              authentication. Your session token is cryptographically signed. Farm data is stored in a secured
              PostgreSQL database with access controls and regular backups.
            </p>
            <p>
              If we become aware of a data breach that affects your personal data, we will notify you and the
              Office of the Data Protection Commissioner (ODPC) within 72 hours, as required by the DPA 2019.
            </p>
          </Section>

          <Section title="8. Children">
            <p>
              ShambaIQ is intended for adult farmers. We do not knowingly collect data from anyone under 18.
              If you believe a child has registered, please contact us and we will delete the account immediately.
            </p>
          </Section>

          <Section title="9. Changes to this policy">
            <p>
              We may update this policy as the platform grows. We will notify registered users by SMS or email
              before any material changes take effect. The effective date at the top of this page will always
              show the latest version.
            </p>
          </Section>

          <Section title="10. Contact & complaints">
            <p>
              For privacy questions or data requests, contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-forest-600 font-medium hover:underline">{CONTACT_EMAIL}</a>.
            </p>
            <p>
              If you are not satisfied with our response, you have the right to lodge a complaint with the{" "}
              <strong>Office of the Data Protection Commissioner (ODPC)</strong> at{" "}
              <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer" className="text-forest-600 font-medium hover:underline">www.odpc.go.ke</a>.
            </p>
          </Section>

          <div className="border-t border-cream-200 pt-6 mt-6 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
            <Link href="/terms" className="text-sm text-forest-600 font-semibold hover:text-forest-800 transition-colors">
              Read our terms of service →
            </Link>
            <Link href="/" className="text-sm text-soil-500 hover:text-soil-600 transition-colors">
              ← Back to ShambaIQ
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
