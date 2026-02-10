
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, ArrowRight, TrendingUp, Users, Star, DollarSign } from 'lucide-react';

const LawyerCTA: React.FC = () => {
  return (
    <div className="bg-slate-900 py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[3rem] p-12 md:p-24 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6 backdrop-blur-sm">
              <Briefcase className="w-4 h-4 mr-2" />
              For Legal Professionals
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Grow Your Practice <br className="hidden md:block" /> with Qualified Leads
            </h2>
            <p className="text-indigo-100 text-lg mb-8">
              Join 500+ licensed lawyers who are already using Lawyer Direct to build their digital presence 
              and connect with clients instantly. Set your own hours and get paid automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2"
                >
                  <span>Join the Network</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <button className="px-8 py-4 bg-indigo-500/20 text-white border border-indigo-400/30 rounded-xl font-bold text-lg hover:bg-indigo-500/30 transition-all">
                Learn More
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block relative perspective-1000">
             <motion.div
               animate={{ rotateY: [3, -3, 3], rotateX: [2, -2, 2] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
               className="bg-white rounded-3xl p-8 shadow-2xl preserve-3d w-80"
             >
                <div className="flex items-center justify-between mb-6">
                  <p className="text-sm font-bold text-slate-800">Your Dashboard</p>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Live</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3.5">
                    <DollarSign className="w-4 h-4 text-indigo-500 mb-1.5" />
                    <p className="text-lg font-black text-slate-900">$4,280</p>
                    <p className="text-xs text-slate-400">This month</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5">
                    <Users className="w-4 h-4 text-violet-500 mb-1.5" />
                    <p className="text-lg font-black text-slate-900">38</p>
                    <p className="text-xs text-slate-400">Clients</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5">
                    <Star className="w-4 h-4 text-amber-500 mb-1.5" />
                    <p className="text-lg font-black text-slate-900">4.9</p>
                    <p className="text-xs text-slate-400">Rating</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3.5">
                    <TrendingUp className="w-4 h-4 text-emerald-500 mb-1.5" />
                    <p className="text-lg font-black text-slate-900">+27%</p>
                    <p className="text-xs text-slate-400">Growth</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-indigo-50 rounded-xl px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">JM</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">New consultation</p>
                        <p className="text-xs text-slate-400">Family Law &middot; Just now</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">AK</div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Session completed</p>
                        <p className="text-xs text-slate-400">Contract Law &middot; 12m ago</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">+$30</span>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg">
                    <Briefcase className="w-6 h-6" />
                </div>
             </motion.div>
          </div>
        </div>
      </div>
      
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[120px]"></div>
      </div>
    </div>
  );
};

export default LawyerCTA;
