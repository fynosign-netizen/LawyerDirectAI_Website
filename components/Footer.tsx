
import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Twitter, Linkedin, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 py-20 px-6 border-t border-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <img src="/logo.png" alt="LawyerDirect Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold tracking-tight text-white">Lawyer<span className="text-indigo-500">Direct</span></span>
            </div>
            <p className="max-w-sm mb-8 leading-relaxed">
              Democratizing legal access through AI-driven matching and on-demand professional consultations.
              The future of law is instant. Available on iOS and Android.
            </p>
            <div className="flex space-x-6 mb-8">
              <a href="#" aria-label="Follow us on Twitter"><Twitter className="w-6 h-6 hover:text-white transition-colors" /></a>
              <a href="#" aria-label="Follow us on LinkedIn"><Linkedin className="w-6 h-6 hover:text-white transition-colors" /></a>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-10" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Product</h4>
            <ul className="space-y-4 text-sm">
              <li onClick={() => scrollTo('demo')} className="hover:text-white transition-colors cursor-pointer">Find a Lawyer</li>
              <li onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors cursor-pointer">How it Works</li>
              <li onClick={() => scrollTo('lawyer-cta')} className="hover:text-white transition-colors cursor-pointer">For Lawyers</li>
              <li onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors cursor-pointer">Pricing</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm">
              <li onClick={() => scrollTo('vision')} className="hover:text-white transition-colors cursor-pointer">Vision</li>
              <li onClick={() => scrollTo('contact')} className="hover:text-white transition-colors cursor-pointer">About Us</li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/legal-disclaimer" className="hover:text-white transition-colors">Legal Disclaimer</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2024 Lawyer Direct Inc. All rights reserved.</p>
          <p>Lawyer Direct is a matching platform, not a law firm. We do not provide legal advice ourselves.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
