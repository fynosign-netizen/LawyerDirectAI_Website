
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  useEffect(() => {
    document.title = 'Privacy Policy | Lawyer Direct';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Privacy Policy for Lawyer Direct. Learn how we collect, use, and protect your personal data, legal inquiry information, and AI processing practices.');
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src="assets/logo.png" alt="LawyerDirect Logo" className="h-10 w-auto" />
            <span className="text-xl font-bold tracking-tight text-slate-800">Lawyer<span className="text-indigo-600">Direct</span></span>
          </Link>
          <Link to="/" className="flex items-center space-x-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-slate-900 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 bg-indigo-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shield className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400 text-lg">Last updated: February 7, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 md:p-16 space-y-10">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
              <p className="text-slate-600 leading-relaxed">
                Lawyer Direct Inc. ("Lawyer Direct," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and related services (collectively, the "Platform"). By using the Platform, you consent to the practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed mb-4">We collect the following types of information:</p>
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">Personal Information</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Name, email address, phone number, and billing information that you voluntarily provide when creating an account, initiating a consultation, or contacting us.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">Legal Inquiry Data</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">The legal questions, descriptions, and related information you submit through our AI matching system. This data is processed to identify the appropriate legal category, jurisdiction, and urgency for matching purposes.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">Usage Data</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Device information, IP address, browser type, pages visited, session duration, and interactions with our Platform collected automatically through cookies and similar technologies.</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-2">Communication Data</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Messages exchanged between you and attorneys through our Platform, session recordings (if applicable), and any feedback or reviews you provide.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
              <ul className="space-y-3">
                {[
                  'To match you with qualified legal professionals based on your inquiry',
                  'To process payments and manage your account',
                  'To improve and personalize your experience on our Platform',
                  'To communicate with you about your account, sessions, and updates',
                  'To analyze usage patterns and improve our AI matching algorithms',
                  'To detect, prevent, and address fraud, security issues, and technical problems',
                  'To comply with legal obligations and enforce our terms of service',
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-slate-600">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">AI Processing</h2>
              <p className="text-slate-600 leading-relaxed">
                Our Platform uses third-party artificial intelligence services (including Google Gemini) to analyze your legal inquiries. When you submit a query, the text of your inquiry is sent to these AI services for processing. We do not send your personal identification information (name, email, phone) to AI providers — only the content of your legal question. AI-generated outputs (category, jurisdiction, urgency, summary) are used solely for matching purposes and are not stored by the AI provider beyond the processing session.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Sharing and Disclosure</h2>
              <p className="text-slate-600 leading-relaxed mb-4">We may share your information with:</p>
              <ul className="space-y-3">
                {[
                  { title: 'Attorneys:', desc: 'Matched lawyers receive relevant details about your inquiry to provide legal services.' },
                  { title: 'Service Providers:', desc: 'Third-party vendors who assist with payment processing, hosting, analytics, and AI processing.' },
                  { title: 'Legal Compliance:', desc: 'When required by law, regulation, legal process, or governmental request.' },
                  { title: 'Business Transfers:', desc: 'In connection with a merger, acquisition, or sale of assets, your data may be transferred.' },
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-3 text-slate-600">
                    <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-2.5 flex-shrink-0"></div>
                    <span><strong className="text-slate-800">{item.title}</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
              <p className="text-slate-600 leading-relaxed mt-4">
                We do <strong>not</strong> sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
              <p className="text-slate-600 leading-relaxed">
                We implement industry-standard security measures to protect your personal information, including encryption in transit (TLS/SSL) and at rest, access controls, and regular security audits. All communications between you and attorneys on our Platform are end-to-end encrypted. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention</h2>
              <p className="text-slate-600 leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to provide you services. We may also retain and use your information to comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account and associated data at any time by contacting us.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Depending on your jurisdiction, you may have the following rights regarding your personal data:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Access your personal data',
                  'Correct inaccurate data',
                  'Request deletion of your data',
                  'Object to data processing',
                  'Data portability',
                  'Withdraw consent',
                ].map((right, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 border border-slate-100">
                    {right}
                  </div>
                ))}
              </div>
              <p className="text-slate-600 leading-relaxed mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:privacy@lawyerdirect.com" className="text-indigo-600 font-semibold hover:underline">privacy@lawyerdirect.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
              <p className="text-slate-600 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookie preferences through your browser settings. Disabling cookies may limit certain functionality of our Platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
              <p className="text-slate-600 leading-relaxed">
                Our Platform is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that a child under 18 has provided us with personal information, we will take steps to delete such information promptly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Policy</h2>
              <p className="text-slate-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically for any changes.
              </p>
            </section>

            <section className="border-t border-slate-100 pt-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions or concerns about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-4 space-y-1 text-sm text-slate-600">
                <p className="font-bold text-slate-800">Lawyer Direct Inc.</p>
                <p>Email: <a href="mailto:privacy@lawyerdirect.com" className="text-indigo-600 font-semibold hover:underline">privacy@lawyerdirect.com</a></p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
