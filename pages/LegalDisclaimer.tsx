
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

const LegalDisclaimer: React.FC = () => {
  useEffect(() => {
    document.title = 'Legal Disclaimer | Lawyer Direct';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Legal disclaimer for Lawyer Direct. We are a matching platform, not a law firm. Read our full terms regarding AI matching, attorney verification, and limitation of liability.');
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
            <Scale className="w-7 h-7 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Legal Disclaimer</h1>
          <p className="text-slate-400 text-lg">Last updated: February 7, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 md:p-16 space-y-10">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Not a Law Firm</h2>
              <p className="text-slate-600 leading-relaxed">
                Lawyer Direct Inc. ("Lawyer Direct," "we," "us," or "our") is a technology platform that connects users with licensed legal professionals. Lawyer Direct is <strong>not a law firm</strong>, does not provide legal advice, and does not engage in the practice of law. Any information provided on or through our platform, including AI-generated summaries and categorizations, is for informational and matching purposes only and should not be construed as legal advice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">No Attorney-Client Relationship</h2>
              <p className="text-slate-600 leading-relaxed">
                Use of the Lawyer Direct platform does not create an attorney-client relationship between you and Lawyer Direct. An attorney-client relationship is only established when you enter into a formal engagement with a lawyer found through our platform, subject to that lawyer's own terms and conditions. All engagements are between you and the individual attorney directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">AI-Powered Matching</h2>
              <p className="text-slate-600 leading-relaxed">
                Our platform utilizes artificial intelligence to analyze your legal inquiry and match you with relevant attorneys. While we strive for accuracy, AI-generated categorizations (including legal category, jurisdiction identification, and urgency level) are automated assessments and may not be fully accurate. These outputs are provided as a convenience and do not constitute legal analysis or advice. You should always verify any information with a qualified attorney.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Attorney Verification</h2>
              <p className="text-slate-600 leading-relaxed">
                Lawyer Direct takes reasonable steps to verify that attorneys listed on our platform hold valid licenses in their respective jurisdictions. However, we do not guarantee the quality, accuracy, or outcome of any legal services provided by attorneys on our platform. Users are encouraged to independently verify an attorney's credentials, standing, and suitability for their specific legal needs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">No Guarantee of Results</h2>
              <p className="text-slate-600 leading-relaxed">
                Lawyer Direct makes no warranties or representations regarding the outcome of any legal matter. Legal outcomes depend on many factors beyond our control, including the facts of your case, applicable law, and the actions of courts and opposing parties. Past performance or reviews of any attorney on our platform are not indicative of future results.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Jurisdictional Limitations</h2>
              <p className="text-slate-600 leading-relaxed">
                Lawyers on our platform are licensed in specific jurisdictions within the United States and Canada. It is the user's responsibility to ensure that the attorney they engage is licensed to practice in the relevant jurisdiction. Lawyer Direct does not guarantee that a matched attorney is authorized to practice in your jurisdiction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                To the fullest extent permitted by applicable law, Lawyer Direct and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or goodwill, arising from or related to your use of the platform, any services provided by attorneys on the platform, or any reliance on information provided through the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Links and Services</h2>
              <p className="text-slate-600 leading-relaxed">
                Our platform may contain links to third-party websites or services that are not owned or controlled by Lawyer Direct. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that Lawyer Direct shall not be responsible or liable for any damage or loss caused by or in connection with the use of any such content, goods, or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Modifications</h2>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to modify this disclaimer at any time. Changes will be effective immediately upon posting to our platform. Your continued use of Lawyer Direct after any changes constitutes acceptance of the updated disclaimer.
              </p>
            </section>

            <section className="border-t border-slate-100 pt-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about this Legal Disclaimer, please contact us at{' '}
                <a href="mailto:legal@lawyerdirect.com" className="text-indigo-600 font-semibold hover:underline">legal@lawyerdirect.com</a>.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalDisclaimer;
