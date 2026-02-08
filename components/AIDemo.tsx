
import React, { useState } from 'react';
import { analyzeLegalQuery } from '../services/gemini';
import { AnalysisResult, Lawyer } from '../types';
import { Sparkles, Loader2, CheckCircle, ArrowRight, Star, Smartphone, Clock, Shield, Globe, AlertTriangle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LAWYERS: Lawyer[] = [
  {
    id: '1', name: 'Rebecca Thompson, Esq.', initials: 'RT', title: 'Senior Partner',
    rating: 4.9, reviews: 347, specialty: 'Family Law', yearsExperience: 18,
    barNumber: 'NY-284719', responseTime: 'Under 2 min', consultationRate: '$30 / 20 min',
    languages: ['English', 'Spanish'], online: true,
  },
  {
    id: '2', name: 'David Kim, J.D.', initials: 'DK', title: 'Managing Attorney',
    rating: 4.8, reviews: 512, specialty: 'Contract Law', yearsExperience: 14,
    barNumber: 'CA-310482', responseTime: 'Under 5 min', consultationRate: '$30 / 20 min',
    languages: ['English', 'Korean'], online: true,
  },
  {
    id: '3', name: 'Maria Gonzalez, Esq.', initials: 'MG', title: 'Immigration Counsel',
    rating: 4.9, reviews: 631, specialty: 'Immigration', yearsExperience: 12,
    barNumber: 'TX-198254', responseTime: 'Under 3 min', consultationRate: '$30 / 20 min',
    languages: ['English', 'Spanish', 'Portuguese'], online: true,
  },
  {
    id: '4', name: 'James Okafor, J.D.', initials: 'JO', title: 'Criminal Defense Attorney',
    rating: 4.7, reviews: 289, specialty: 'Criminal Defense', yearsExperience: 21,
    barNumber: 'IL-402917', responseTime: 'Under 1 min', consultationRate: '$30 / 20 min',
    languages: ['English'], online: true,
  },
  {
    id: '5', name: 'Catherine Moreau, Esq.', initials: 'CM', title: 'Real Estate Counsel',
    rating: 4.8, reviews: 195, specialty: 'Real Estate', yearsExperience: 9,
    barNumber: 'FL-557013', responseTime: 'Under 4 min', consultationRate: '$30 / 20 min',
    languages: ['English', 'French'], online: true,
  },
  {
    id: '6', name: 'Andrew Patel, J.D.', initials: 'AP', title: 'Employment Law Partner',
    rating: 4.9, reviews: 418, specialty: 'Employment Law', yearsExperience: 16,
    barNumber: 'WA-623841', responseTime: 'Under 2 min', consultationRate: '$30 / 20 min',
    languages: ['English', 'Hindi'], online: true,
  },
  {
    id: '7', name: 'Lisa Chen, Esq.', initials: 'LC', title: 'IP Litigation Attorney',
    rating: 4.8, reviews: 173, specialty: 'Intellectual Property', yearsExperience: 11,
    barNumber: 'CA-448290', responseTime: 'Under 3 min', consultationRate: '$30 / 20 min',
    languages: ['English', 'Mandarin'], online: false,
  },
  {
    id: '8', name: 'Robert Sinclair, J.D.', initials: 'RS', title: 'Personal Injury Partner',
    rating: 4.7, reviews: 562, specialty: 'Personal Injury', yearsExperience: 23,
    barNumber: 'OH-175632', responseTime: 'Under 5 min', consultationRate: '$30 / 20 min',
    languages: ['English'], online: true,
  },
  {
    id: '9', name: 'Priya Sharma, Esq.', initials: 'PS', title: 'Estate Planning Attorney',
    rating: 4.9, reviews: 241, specialty: 'Estate Planning', yearsExperience: 10,
    barNumber: 'NJ-339184', responseTime: 'Under 2 min', consultationRate: '$30 / 20 min',
    languages: ['English', 'Hindi', 'Punjabi'], online: true,
  },
  {
    id: '10', name: 'Daniel Wright, J.D.', initials: 'DW', title: 'General Practice Attorney',
    rating: 4.6, reviews: 408, specialty: 'General Inquiry', yearsExperience: 19,
    barNumber: 'PA-281047', responseTime: 'Under 3 min', consultationRate: '$30 / 20 min',
    languages: ['English'], online: true,
  },
];

const INITIALS_COLORS = [
  'bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600',
  'bg-cyan-600', 'bg-violet-600', 'bg-teal-600', 'bg-blue-600',
  'bg-fuchsia-600', 'bg-slate-700',
];

const AIDemo: React.FC = () => {
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [matchedLawyers, setMatchedLawyers] = useState<Lawyer[]>([]);
  const [error, setError] = useState(false);

  const isNotRecognized = result?.category === 'Not Recognized';

  const handleAnalysis = async () => {
    if (!query.trim()) return;
    setAnalyzing(true);
    setError(false);
    try {
      const analysis = await analyzeLegalQuery(query);
      setResult(analysis);

      if (analysis.category === 'Not Recognized') {
        setMatchedLawyers([]);
        return;
      }

      const categoryLower = analysis.category.toLowerCase();
      const exact = LAWYERS.filter(l =>
        l.specialty.toLowerCase().includes(categoryLower) ||
        categoryLower.includes(l.specialty.toLowerCase())
      );
      const onlineFirst = [...exact].sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));
      setMatchedLawyers(onlineFirst.length > 0 ? onlineFirst.slice(0, 3) : LAWYERS.filter(l => l.online).slice(0, 2));
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setAnalyzing(false);
    }
  };

  const resetDemo = () => {
    setResult(null);
    setQuery('');
    setError(false);
    setMatchedLawyers([]);
  };

  return (
    <div className="max-w-5xl mx-auto perspective-1000">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
          <Sparkles className="w-4 h-4" />
          <span>Live AI Demo</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">See How It Works</h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Describe your situation in plain language. Our AI identifies the legal category, jurisdiction, and urgency — then matches you with a qualified attorney in seconds.
        </p>
      </motion.div>

      <motion.div
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 preserve-3d"
      >
        <AnimatePresence mode="wait">
          {!result && !error ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8 md:p-14"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest">Describe your legal issue</label>
                  <div className="flex items-center space-x-1.5 text-emerald-600 text-xs font-semibold">
                    <Shield className="w-3.5 h-3.5" />
                    <span>Confidential & Encrypted</span>
                  </div>
                </div>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Example: My landlord in New York is refusing to return my $2,400 security deposit after I moved out three weeks ago. The apartment was left in good condition and I have photos to prove it..."
                  className="w-full h-48 p-8 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-lg text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Try: landlord disputes, custody questions, contract reviews, immigration status, workplace issues
                  </p>
                  <p className="text-xs text-slate-400">{query.length > 0 ? `${query.length} characters` : ''}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.01, translateY: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAnalysis}
                  disabled={analyzing || !query.trim()}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-3 shadow-xl shadow-indigo-100"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Analyzing Your Case...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      <span>Find My Lawyer</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-8 md:p-14 text-center"
            >
              <div className="max-w-md mx-auto space-y-6">
                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-rose-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Something went wrong</h3>
                <p className="text-slate-500">We couldn't process your request right now. Please check your connection and try again.</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetDemo}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </motion.button>
              </div>
            </motion.div>
          ) : isNotRecognized ? (
            <motion.div
              key="not-recognized"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-8 md:p-14 text-center"
            >
              <div className="max-w-lg mx-auto space-y-6">
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-8 h-8 text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">We couldn't identify a legal issue</h3>
                <p className="text-slate-500 leading-relaxed">
                  {result?.shortSummary || "Please describe your situation in a few sentences so our AI can accurately identify your legal needs and match you with the right attorney."}
                </p>
                <div className="bg-slate-50 rounded-2xl p-5 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Try something like:</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li>"My employer in California hasn't paid my overtime for the past 3 months"</li>
                    <li>"I need help with a custody arrangement in Toronto"</li>
                    <li>"I received an eviction notice in Texas and I don't know what to do"</li>
                  </ul>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetDemo}
                  className="inline-flex items-center space-x-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Try Again</span>
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-8 md:p-14"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-8 border-b border-slate-100 gap-4">
                <div>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "auto" }}
                    className="flex items-center space-x-2 text-emerald-600 font-bold text-sm uppercase tracking-widest mb-2 overflow-hidden whitespace-nowrap bg-emerald-50 px-3 py-1 rounded-full w-fit"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Analysis Complete</span>
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">Your case has been assessed.</h3>
                </div>
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={resetDemo}
                  className="text-slate-400 hover:text-indigo-600 font-bold text-sm flex items-center space-x-2 transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
                >
                  <span>New Query</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* AI Summary */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8"
              >
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">AI Summary</p>
                <p className="text-slate-700 text-base leading-relaxed">{result!.shortSummary}</p>
              </motion.div>

              {/* Analysis Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {[
                  { label: "Legal Category", val: result!.category, color: "text-slate-900" },
                  { label: "Jurisdiction", val: result!.state, color: "text-slate-900" },
                  {
                    label: "Urgency Level",
                    val: result!.urgency,
                    color: result!.urgency === 'High' ? 'text-rose-600' : result!.urgency === 'Medium' ? 'text-amber-600' : 'text-emerald-600',
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className="bg-slate-50 p-6 rounded-2xl border border-slate-100"
                  >
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1 tracking-widest">{item.label}</p>
                    <p className={`text-xl font-black ${item.color}`}>{item.val}</p>
                  </motion.div>
                ))}
              </div>

              {/* Matched Lawyers */}
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-lg">
                    Available Attorneys ({matchedLawyers.length})
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">Sorted by availability</p>
                </div>
                <div className="space-y-4">
                  {matchedLawyers.map((lawyer, i) => (
                    <motion.div
                      key={lawyer.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + (i * 0.1) }}
                      whileHover={{ scale: 1.01, translateY: -2 }}
                      className="flex flex-col md:flex-row md:items-center p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-200 hover:shadow-xl transition-all cursor-pointer group gap-5"
                    >
                      {/* Avatar with initials */}
                      <div className="flex items-center space-x-4 flex-shrink-0">
                        <div className={`w-14 h-14 ${INITIALS_COLORS[parseInt(lawyer.id) - 1] || 'bg-indigo-600'} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                          {lawyer.initials}
                        </div>
                        <div className="md:hidden">
                          <div className="flex items-center space-x-2">
                            <p className="font-bold text-slate-900">{lawyer.name}</p>
                            {lawyer.online && (
                              <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                            )}
                          </div>
                          <p className="text-sm text-slate-500">{lawyer.title}</p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-grow min-w-0">
                        <div className="hidden md:flex items-center space-x-2 mb-1">
                          <p className="font-bold text-slate-900">{lawyer.name}</p>
                          {lawyer.online && (
                            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                          )}
                        </div>
                        <p className="hidden md:block text-sm text-slate-500 font-medium mb-2">{lawyer.title} &middot; {lawyer.yearsExperience} yrs experience &middot; Bar #{lawyer.barNumber}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center space-x-1">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span className="font-bold text-slate-700">{lawyer.rating}</span>
                            <span>({lawyer.reviews} reviews)</span>
                          </span>
                          <span className="hidden sm:inline text-slate-200">|</span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{lawyer.responseTime}</span>
                          </span>
                          <span className="hidden sm:inline text-slate-200">|</span>
                          <span className="flex items-center space-x-1">
                            <Globe className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{lawyer.languages.join(', ')}</span>
                          </span>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex flex-col items-end flex-shrink-0 space-y-1.5">
                        <span className="text-sm font-bold text-slate-900">{lawyer.consultationRate}</span>
                        <span className="text-xs text-indigo-600 font-semibold group-hover:underline">Start Consultation &rarr;</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 flex flex-col items-center">
                  <p className="text-center text-slate-400 text-sm mb-6 font-medium">
                    First 3 minutes are free &middot; Average response time: <span className="text-indigo-600 font-bold">under 2 minutes</span>
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -4, boxShadow: "0 20px 25px -5px rgb(79 70 229 / 0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    className="px-14 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center space-x-3 group"
                  >
                    <Smartphone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>Download the App</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AIDemo;
