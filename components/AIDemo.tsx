
import React, { useState, useRef, useEffect } from 'react';
import { analyzeLegalQuery } from '../services/openai';
import { fetchMatchedLawyers, ApiLawyer } from '../services/api';
import { AnalysisResult, Lawyer, US_STATES, getStateAbbr, getStateName } from '../types';
import {
  Sparkles, Loader2, CheckCircle, ArrowRight, Star, Smartphone,
  Clock, Shield, Globe, AlertTriangle, RotateCcw, Mic, MicOff,
  MapPin, Search, ChevronDown, X, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIALS_COLORS = [
  'bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600',
  'bg-cyan-600', 'bg-violet-600', 'bg-teal-600', 'bg-blue-600',
  'bg-fuchsia-600', 'bg-slate-700',
];

// Map API response to display-friendly Lawyer type
const mapApiLawyer = (api: ApiLawyer, index: number): Lawyer => {
  const firstName = api.user.firstName || '';
  const lastName = api.user.lastName || '';
  const name = `${firstName} ${lastName}`.trim();
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const rate = api.consultationRate
    ? `$${(api.consultationRate / 100).toFixed(0)} / 20 min`
    : '$30 / 20 min';

  return {
    id: api.id,
    name: name || 'Attorney',
    initials: initials || '??',
    title: api.title || api.specializations?.[0] || 'Attorney',
    rating: api.rating || 0,
    reviews: api.totalReviews || 0,
    specialty: api.specializations?.[0] || 'General',
    yearsExperience: api.yearsExperience || 0,
    barNumber: api.barNumber.includes(api.licenseState) ? api.barNumber : `${api.licenseState}-${api.barNumber}`,
    consultationRate: rate,
    languages: api.languages?.length ? api.languages : ['English'],
    online: api.onlineStatus === 'online',
    onlineStatus: api.onlineStatus,
    profilePhoto: api.profilePhoto,
    verified: api.verificationStatus === 'VERIFIED',
  };
};

// Web Speech API types
interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
  resultIndex: number;
}

const AIDemo: React.FC = () => {
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [matchedLawyers, setMatchedLawyers] = useState<Lawyer[]>([]);
  const [error, setError] = useState(false);
  const [fetchingLawyers, setFetchingLawyers] = useState(false);

  // State picker
  const [needsState, setNeedsState] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [stateSearch, setStateSearch] = useState('');
  const [confirmedState, setConfirmedState] = useState<string | null>(null);

  // Voice input
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const isNotRecognized = result?.category === 'Not Recognized';

  // Check for Web Speech API support
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
        const result = event.results[i];
        if (result[0]) {
          const transcript = result[0].transcript;
          if ((result as any).isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
      }

      if (finalTranscript) {
        setQuery(prev => prev + (prev ? ' ' : '') + finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Fetch lawyers from real API
  const loadLawyers = async (category: string, stateAbbr: string | null) => {
    setFetchingLawyers(true);
    try {
      // Try exact specialization + state match first
      let apiLawyers = await fetchMatchedLawyers({
        specialization: category,
        state: stateAbbr || undefined,
        available: true,
        limit: 5,
      });

      // Fallback: just state match if no specialization match
      if (apiLawyers.length === 0 && stateAbbr) {
        apiLawyers = await fetchMatchedLawyers({
          state: stateAbbr,
          available: true,
          limit: 5,
        });
      }

      // Fallback: just specialization match if still nothing
      if (apiLawyers.length === 0) {
        apiLawyers = await fetchMatchedLawyers({
          specialization: category,
          available: true,
          limit: 5,
        });
      }

      // Final fallback: any available lawyers
      if (apiLawyers.length === 0) {
        apiLawyers = await fetchMatchedLawyers({
          available: true,
          limit: 5,
        });
      }

      const mapped = apiLawyers.map((l, i) => mapApiLawyer(l, i));
      // Sort online first
      mapped.sort((a, b) => (b.online ? 1 : 0) - (a.online ? 1 : 0));
      setMatchedLawyers(mapped);
    } catch (err) {
      console.error('Failed to fetch lawyers from API:', err);
      setMatchedLawyers([]);
    } finally {
      setFetchingLawyers(false);
    }
  };

  const handleAnalysis = async () => {
    if (!query.trim()) return;
    if (isListening) stopListening();
    setAnalyzing(true);
    setError(false);
    setNeedsState(false);
    setSelectedState(null);
    setConfirmedState(null);
    setShowStatePicker(false);

    try {
      const analysis = await analyzeLegalQuery(query);
      setResult(analysis);

      if (analysis.category === 'Not Recognized') {
        setMatchedLawyers([]);
        return;
      }

      // Check if we have a usable state
      const stateAbbr = getStateAbbr(analysis.state);

      if (!stateAbbr) {
        // No state detected — ask the user
        setNeedsState(true);
        setShowStatePicker(true);
        return;
      }

      setConfirmedState(stateAbbr);
      await loadLawyers(analysis.category, stateAbbr);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setAnalyzing(false);
    }
  };

  // When user confirms a state from the picker
  const handleStateConfirm = async (stateAbbr: string) => {
    setSelectedState(stateAbbr);
    setConfirmedState(stateAbbr);
    setShowStatePicker(false);
    setNeedsState(false);

    // Update the result display
    if (result) {
      setResult({ ...result, state: getStateName(stateAbbr) });
    }

    await loadLawyers(result?.category || '', stateAbbr);
  };

  const resetDemo = () => {
    setResult(null);
    setQuery('');
    setError(false);
    setMatchedLawyers([]);
    setNeedsState(false);
    setShowStatePicker(false);
    setSelectedState(null);
    setConfirmedState(null);
    setStateSearch('');
    if (isListening) stopListening();
  };

  const filteredStates = US_STATES.filter(s =>
    s.label.toLowerCase().includes(stateSearch.toLowerCase()) ||
    s.value.toLowerCase().includes(stateSearch.toLowerCase())
  );

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
            /* ── INPUT PHASE ── */
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

                {/* Textarea with voice button */}
                <div className="relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Example: My landlord in New York is refusing to return my $2,400 security deposit after I moved out three weeks ago. The apartment was left in good condition and I have photos to prove it..."
                    className="w-full h-48 p-8 pr-16 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-lg text-slate-800 placeholder:text-slate-400 resize-none leading-relaxed"
                  />

                  {/* Voice input button */}
                  {speechSupported && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleVoice}
                      className={`absolute top-4 right-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md ${
                        isListening
                          ? 'bg-rose-500 text-white shadow-rose-200 animate-pulse'
                          : 'bg-white text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200'
                      }`}
                      title={isListening ? 'Stop recording' : 'Speak your legal issue'}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </motion.button>
                  )}
                </div>

                {/* Voice indicator */}
                <AnimatePresence>
                  {isListening && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-3 bg-rose-50 border border-rose-100 rounded-2xl px-5 py-3"
                    >
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-4 bg-rose-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]"></div>
                        <div className="w-1.5 h-6 bg-rose-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.2s]"></div>
                        <div className="w-1.5 h-3 bg-rose-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.4s]"></div>
                        <div className="w-1.5 h-5 bg-rose-500 rounded-full animate-[pulse_0.8s_ease-in-out_infinite_0.6s]"></div>
                      </div>
                      <span className="text-sm font-semibold text-rose-600">Listening... Speak your legal issue clearly</span>
                      <button
                        onClick={stopListening}
                        className="ml-auto text-rose-400 hover:text-rose-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <p className="text-xs text-slate-400">
                      Try: landlord disputes, custody questions, contract reviews, immigration status, workplace issues
                    </p>
                    {speechSupported && !isListening && (
                      <span className="text-xs text-indigo-400 font-medium hidden sm:inline">
                        or click <Mic className="w-3 h-3 inline" /> to speak
                      </span>
                    )}
                  </div>
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
            /* ── ERROR ── */
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
            /* ── NOT RECOGNIZED ── */
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
          ) : showStatePicker ? (
            /* ── STATE PICKER ── */
            <motion.div
              key="state-picker"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-8 md:p-14"
            >
              <div className="max-w-lg mx-auto space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Which state are you in?</h3>
                  <p className="text-slate-500 text-sm">
                    We couldn't detect your state from the description. Select your state so we can match you with licensed attorneys in your jurisdiction.
                  </p>
                </div>

                {/* AI Summary preview */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Issue Identified</span>
                  </div>
                  <p className="text-slate-700 text-sm">{result!.shortSummary}</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full">{result!.category}</span>
                    <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full">{result!.urgency} urgency</span>
                  </div>
                </div>

                {/* Search box */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    placeholder="Search states..."
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-sm text-slate-800 placeholder:text-slate-400"
                  />
                </div>

                {/* States grid */}
                <div className="max-h-64 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-2">
                  <div className="grid grid-cols-2 gap-1.5">
                    {filteredStates.map((state) => (
                      <button
                        key={state.value}
                        onClick={() => setSelectedState(state.value)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedState === state.value
                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                            : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100'
                        }`}
                      >
                        <span>{state.label}</span>
                        <span className={`text-xs ${selectedState === state.value ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {state.value}
                        </span>
                      </button>
                    ))}
                  </div>
                  {filteredStates.length === 0 && (
                    <p className="text-center text-slate-400 text-sm py-8">No states found for "{stateSearch}"</p>
                  )}
                </div>

                {/* Confirm */}
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetDemo}
                    className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold rounded-xl transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: selectedState ? 1.02 : 1 }}
                    whileTap={{ scale: selectedState ? 0.98 : 1 }}
                    onClick={() => selectedState && handleStateConfirm(selectedState)}
                    disabled={!selectedState}
                    className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-100"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>{selectedState ? `Continue with ${getStateName(selectedState)}` : 'Select a state'}</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* ── RESULTS ── */
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
                  { label: "Jurisdiction", val: confirmedState ? `${result!.state} (${confirmedState})` : result!.state, color: "text-slate-900" },
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

                {fetchingLawyers ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <p className="text-slate-500 font-medium">Finding attorneys in your area...</p>
                  </div>
                ) : matchedLawyers.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100"
                  >
                    <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium mb-1">No attorneys available right now</p>
                    <p className="text-slate-400 text-sm">Try downloading the app for broader availability and instant notifications.</p>
                  </motion.div>
                ) : (
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
                        {/* Avatar */}
                        <div className="flex items-center space-x-4 flex-shrink-0">
                          {lawyer.profilePhoto ? (
                            <img
                              src={lawyer.profilePhoto}
                              alt={lawyer.name}
                              className="w-14 h-14 rounded-2xl object-cover shadow-md"
                            />
                          ) : (
                            <div className={`w-14 h-14 ${INITIALS_COLORS[i % INITIALS_COLORS.length]} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                              {lawyer.initials}
                            </div>
                          )}
                          <div className="md:hidden">
                            <div className="flex items-center space-x-2">
                              <p className="font-bold text-slate-900">{lawyer.name}</p>
                              {lawyer.online && (
                                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                              )}
                              {lawyer.verified && (
                                <CheckCircle className="w-4 h-4 text-blue-500" />
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
                            {lawyer.verified && (
                              <CheckCircle className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                          <p className="hidden md:block text-sm text-slate-500 font-medium mb-2">
                            {lawyer.title} &middot; {lawyer.yearsExperience} yrs experience &middot; Bar #{lawyer.barNumber}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center space-x-1">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="font-bold text-slate-700">{lawyer.rating.toFixed(1)}</span>
                              <span>({lawyer.reviews} reviews)</span>
                            </span>
                            <span className="hidden sm:inline text-slate-200">|</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-indigo-400" />
                              <span>{lawyer.online ? 'Available now' : 'Offline'}</span>
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
                )}

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
