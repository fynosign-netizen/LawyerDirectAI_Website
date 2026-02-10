
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollTo = (id: string) => {
    if (!isHome) {
      window.location.href = '/#/';
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  const navLinks = [
    { label: 'AI Match', id: 'demo' },
    { label: 'Services', id: 'categories' },
    { label: 'Benefits', id: 'features' },
    { label: 'How it Works', id: 'how-it-works' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 cursor-pointer" onClick={() => setMobileOpen(false)}>
          <img src="/logo.png" alt="LawyerDirect Logo" className="h-10 w-auto" />
          <span className="text-xl font-bold tracking-tight text-slate-800">Lawyer<span className="text-indigo-600">Direct</span></span>
        </Link>

        <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <button key={link.id} onClick={() => scrollTo(link.id)} className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              {link.label}
            </button>
          ))}
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="md:hidden p-2 text-slate-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 pb-6 pt-4 space-y-1">
          {navLinks.map(link => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-colors"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-3">
            <Link
              to="/register"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center bg-indigo-600 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
