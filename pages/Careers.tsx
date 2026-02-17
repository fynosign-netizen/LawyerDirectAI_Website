
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase, MapPin, Clock, DollarSign, ArrowRight, ArrowLeft,
  Search, X, Send, CheckCircle, ChevronDown, Users, Sparkles,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface CareerPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  description: string;
  requirements: string;
  salaryMin: number | null;
  salaryMax: number | null;
  createdAt: string;
}

const TYPE_LABELS: Record<string, string> = {
  FULL_TIME: 'Full-time',
  PART_TIME: 'Part-time',
  CONTRACT: 'Contract',
  INTERNSHIP: 'Internship',
  REMOTE: 'Remote',
};

const TYPE_COLORS: Record<string, string> = {
  FULL_TIME: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  PART_TIME: 'bg-violet-50 text-violet-700 border-violet-200',
  CONTRACT: 'bg-amber-50 text-amber-700 border-amber-200',
  INTERNSHIP: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  REMOTE: 'bg-sky-50 text-sky-700 border-sky-200',
};

const DEPARTMENT_COLORS: Record<string, string> = {
  Engineering: 'from-indigo-500 to-violet-500',
  Product: 'from-violet-500 to-purple-500',
  Design: 'from-rose-500 to-pink-500',
  Marketing: 'from-amber-500 to-orange-500',
  Sales: 'from-emerald-500 to-teal-500',
  Legal: 'from-blue-500 to-indigo-500',
  Operations: 'from-slate-500 to-gray-500',
  'Customer Support': 'from-cyan-500 to-sky-500',
  Finance: 'from-green-500 to-emerald-500',
  'Human Resources': 'from-pink-500 to-rose-500',
};

const formatSalary = (min: number | null, max: number | null) => {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const Careers: React.FC = () => {
  const [postings, setPostings] = useState<CareerPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [selectedPosting, setSelectedPosting] = useState<CareerPosting | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Application form state
  const [appForm, setAppForm] = useState({
    fullName: '', email: '', phone: '', linkedInUrl: '', coverLetter: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/careers`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setPostings(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const departments = [...new Set(postings.map(p => p.department))].sort();
  const types = [...new Set(postings.map(p => p.employmentType))].sort();

  const filteredPostings = postings.filter(p => {
    const matchSearch = !searchTerm ||
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = !departmentFilter || p.department === departmentFilter;
    const matchType = !typeFilter || p.employmentType === typeFilter;
    return matchSearch && matchDept && matchType;
  });

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPosting || !appForm.fullName.trim() || !appForm.email.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/careers/${selectedPosting.id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appForm),
      });
      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setShowApplicationForm(false);
          setSubmitted(false);
          setAppForm({ fullName: '', email: '', phone: '', linkedInUrl: '', coverLetter: '' });
        }, 3000);
      }
    } catch {}
    setSubmitting(false);
  };

  const openApplication = (posting: CareerPosting) => {
    setSelectedPosting(posting);
    setShowApplicationForm(true);
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative bg-white pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [0, 40, 0], y: [0, -20, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-br from-indigo-100/50 via-violet-100/40 to-transparent rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], x: [0, -30, 0] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute -bottom-[15%] -left-[10%] w-[60%] h-[60%] bg-gradient-to-tr from-blue-50/50 via-indigo-50/40 to-transparent rounded-full blur-[100px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 100, damping: 20 }}
              className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-100 shadow-sm"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              We're Hiring
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
              Build the Future of{' '}
              <motion.span
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: '100% 50%' }}
                transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto]"
                style={{ WebkitBackgroundClip: 'text' }}
              >
                Legal Tech
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Join Lawyer Direct and help us democratize access to legal services.
              We're looking for passionate people who want to make a real difference.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-6 text-sm text-slate-500"
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span>Remote-friendly</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Competitive pay</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-indigo-500" />
                <span>Great benefits</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-50 border-y border-slate-100 py-6 px-6 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search positions by title, department, or location..."
                className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all shadow-sm"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="py-3 px-4 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all shadow-sm flex-1 md:flex-none"
              >
                <option value="">All Departments</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="py-3 px-4 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all shadow-sm flex-1 md:flex-none"
              >
                <option value="">All Types</option>
                {types.map(t => <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>)}
              </select>
            </div>
          </div>
          {filteredPostings.length > 0 && (
            <p className="text-sm text-slate-500 mt-3">{filteredPostings.length} open position{filteredPostings.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      {/* Job Listings */}
      <main className="flex-grow bg-slate-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
          ) : filteredPostings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                {postings.length === 0 ? 'No open positions right now' : 'No matches found'}
              </h3>
              <p className="text-slate-500 max-w-md mx-auto">
                {postings.length === 0
                  ? "We don't have any open positions at the moment, but check back soon. We're always growing!"
                  : 'Try adjusting your search or filters to find what you\'re looking for.'}
              </p>
              {(searchTerm || departmentFilter || typeFilter) && (
                <button
                  onClick={() => { setSearchTerm(''); setDepartmentFilter(''); setTypeFilter(''); }}
                  className="mt-6 text-indigo-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              {/* Selected posting detail view */}
              <AnimatePresence mode="wait">
                {selectedPosting && !showApplicationForm ? (
                  <motion.div
                    key="detail"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-8"
                  >
                    <button
                      onClick={() => setSelectedPosting(null)}
                      className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back to all positions
                    </button>

                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                      {/* Header */}
                      <div className={`bg-gradient-to-r ${DEPARTMENT_COLORS[selectedPosting.department] || 'from-indigo-500 to-violet-500'} p-8 md:p-12`}>
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                          <div>
                            <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full mb-3 backdrop-blur-sm">
                              {selectedPosting.department}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{selectedPosting.title}</h2>
                            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{selectedPosting.location}</span>
                              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{TYPE_LABELS[selectedPosting.employmentType]}</span>
                              {formatSalary(selectedPosting.salaryMin, selectedPosting.salaryMax) && (
                                <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" />{formatSalary(selectedPosting.salaryMin, selectedPosting.salaryMax)}</span>
                              )}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openApplication(selectedPosting)}
                            className="px-8 py-3.5 bg-white text-indigo-600 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0"
                          >
                            Apply Now <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 space-y-8">
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">About the Role</h3>
                            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedPosting.description}</div>
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Requirements</h3>
                            <div className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedPosting.requirements}</div>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                            <h4 className="text-sm font-bold text-slate-800 mb-4">Position Details</h4>
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                                  <Briefcase className="w-4 h-4 text-indigo-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400">Department</p>
                                  <p className="text-sm font-semibold text-slate-800">{selectedPosting.department}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
                                  <MapPin className="w-4 h-4 text-violet-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400">Location</p>
                                  <p className="text-sm font-semibold text-slate-800">{selectedPosting.location}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                                  <Clock className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                  <p className="text-xs text-slate-400">Type</p>
                                  <p className="text-sm font-semibold text-slate-800">{TYPE_LABELS[selectedPosting.employmentType]}</p>
                                </div>
                              </div>
                              {formatSalary(selectedPosting.salaryMin, selectedPosting.salaryMax) && (
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                                    <DollarSign className="w-4 h-4 text-emerald-600" />
                                  </div>
                                  <div>
                                    <p className="text-xs text-slate-400">Salary Range</p>
                                    <p className="text-sm font-semibold text-slate-800">{formatSalary(selectedPosting.salaryMin, selectedPosting.salaryMax)}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-xs text-slate-400 text-center">
                            Posted {formatDate(selectedPosting.createdAt)}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => openApplication(selectedPosting)}
                            className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                          >
                            Apply for this Role <ArrowRight className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : !showApplicationForm ? (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    {filteredPostings.map((posting, idx) => (
                      <motion.div
                        key={posting.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -2, boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)' }}
                        onClick={() => setSelectedPosting(posting)}
                        className="bg-white rounded-2xl border border-slate-200 p-6 cursor-pointer transition-all group"
                      >
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${DEPARTMENT_COLORS[posting.department] || 'from-indigo-500 to-violet-500'} flex items-center justify-center shrink-0 shadow-sm`}>
                            <Briefcase className="w-5 h-5 text-white" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{posting.title}</h3>
                              <span className={`hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${TYPE_COLORS[posting.employmentType] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                {TYPE_LABELS[posting.employmentType]}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" />{posting.department}</span>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{posting.location}</span>
                              {formatSalary(posting.salaryMin, posting.salaryMax) && (
                                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{formatSalary(posting.salaryMin, posting.salaryMax)}</span>
                              )}
                              <span className="text-slate-400">{formatDate(posting.createdAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.stopPropagation(); openApplication(posting); }}
                              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm"
                            >
                              Apply
                            </motion.button>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </>
          )}
        </div>
      </main>

      {/* Application Modal */}
      <AnimatePresence>
        {showApplicationForm && selectedPosting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !submitting && setShowApplicationForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            >
              {submitted ? (
                <div className="p-12 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
                  <p className="text-slate-500">Thank you for your interest. We'll review your application and get back to you soon.</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-slate-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">Apply for this Role</h3>
                        <p className="text-sm text-slate-500 mt-1">{selectedPosting.title} &middot; {selectedPosting.department}</p>
                      </div>
                      <button
                        onClick={() => setShowApplicationForm(false)}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleApply} className="p-6 space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={appForm.fullName}
                        onChange={(e) => setAppForm({ ...appForm, fullName: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={appForm.email}
                        onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                      <input
                        type="tel"
                        value={appForm.phone}
                        onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">LinkedIn Profile</label>
                      <input
                        type="url"
                        value={appForm.linkedInUrl}
                        onChange={(e) => setAppForm({ ...appForm, linkedInUrl: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
                        placeholder="https://linkedin.com/in/johndoe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Cover Letter</label>
                      <textarea
                        value={appForm.coverLetter}
                        onChange={(e) => setAppForm({ ...appForm, coverLetter: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all resize-y"
                        placeholder="Tell us why you'd be a great fit..."
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={submitting || !appForm.fullName.trim() || !appForm.email.trim()}
                      className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          Submit Application <Send className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default Careers;
