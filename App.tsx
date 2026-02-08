
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import AIDemo from './components/AIDemo';
import BusinessModel from './components/BusinessModel';
import LegalCategories from './components/LegalCategories';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import LawyerCTA from './components/LawyerCTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AppDownload from './components/AppDownload';
import Pricing from './components/Pricing';
import LegalDisclaimer from './pages/LegalDisclaimer';
import PrivacyPolicy from './pages/PrivacyPolicy';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <section id="hero">
          <Hero />
        </section>
        
        <section id="vision" className="bg-white py-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-800">The Vision</h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Lawyer Direct makes legal help as immediate and accessible as messaging a professional, 
              removing barriers that stop people from getting timely legal advice. Inspired by the 
              efficiency of medical on-demand services, we are redefining legal intake for the modern world.
            </p>
          </div>
        </section>

        <section id="demo" className="bg-slate-50 py-24 px-6 border-y border-slate-100">
          <AIDemo />
        </section>

        <section id="app-download">
          <AppDownload />
        </section>

        <section id="categories">
          <LegalCategories />
        </section>

        <section id="features">
          <Features />
        </section>

        <section id="how-it-works">
          <HowItWorks />
        </section>

        <section id="testimonials">
          <Testimonials />
        </section>

        <section id="pricing">
          <Pricing />
        </section>

        <section id="business-model">
          <BusinessModel />
        </section>

        <section id="faq">
          <FAQ />
        </section>

        <section id="lawyer-cta">
          <LawyerCTA />
        </section>

        <section id="contact">
          <Contact />
        </section>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/legal-disclaimer" element={<LegalDisclaimer />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
};

export default App;
