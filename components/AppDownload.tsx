
import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, CheckCircle, Shield, Zap } from 'lucide-react';

const AppDownload: React.FC = () => {
  return (
    <div className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-20 relative overflow-hidden flex flex-col lg:flex-row items-center gap-16 shadow-2xl">
          
          <div className="relative z-10 lg:w-1/2">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-6">Mobile First Experience</p>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">Your Personal Lawyer, <br /> Right in Your Pocket.</h2>
              
              <div className="space-y-6 mb-10">
                {[
                  { icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, text: "Instant matching & push notification alerts" },
                  { icon: <Shield className="w-5 h-5 text-indigo-400" />, text: "Secure, encrypted end-to-end messaging" },
                  { icon: <Zap className="w-5 h-5 text-amber-400" />, text: "One-tap video consultations" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="bg-white/5 p-2 rounded-lg">{item.icon}</div>
                    <span className="text-slate-300 text-lg">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a href="#" className="w-full sm:w-auto hover:scale-105 transition-transform">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-14" />
                </a>
                <a href="#" className="w-full sm:w-auto hover:scale-105 transition-transform">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-14" />
                </a>
              </div>
            </motion.div>
          </div>

          <div className="lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, y: 100, rotate: 5 }}
              whileInView={{ opacity: 1, y: 0, rotate: -10 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10"
            >
              <div className="bg-slate-800 rounded-[3rem] p-4 border-8 border-slate-700 shadow-2xl max-w-[320px] mx-auto">
                <div className="bg-white rounded-[2.5rem] overflow-hidden aspect-[9/19] relative">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-12 h-2 bg-slate-100 rounded-full"></div>
                      <div className="w-4 h-4 bg-indigo-100 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      <div className="h-40 bg-slate-50 rounded-2xl animate-pulse"></div>
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                      <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-100 rounded w-4/6"></div>
                      <div className="h-12 bg-indigo-600 rounded-xl w-full mt-8"></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Background elements for phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -z-0"></div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppDownload;
