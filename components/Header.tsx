
import React from 'react';
import { Scale } from 'lucide-react';

const Header: React.FC = () => {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <img src="assets/logo.png" alt="LawyerDirect Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold tracking-tight text-slate-800">Lawyer<span className="text-indigo-600">Direct</span></span>
        </div>

        <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-8">
          <button onClick={() => scrollTo('demo')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">AI Match</button>
          <button onClick={() => scrollTo('categories')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Services</button>
          <button onClick={() => scrollTo('features')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Benefits</button>
          <button onClick={() => scrollTo('how-it-works')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">How it Works</button>
          <button onClick={() => scrollTo('faq')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">FAQ</button>
          <button onClick={() => scrollTo('contact')} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Contact</button>
          <button className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
            Get Started
          </button>
        </nav>

        <button aria-label="Open menu" className="md:hidden p-2 text-slate-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
