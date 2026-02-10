
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <div className="relative bg-white pt-24 pb-32 overflow-hidden perspective-1000">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[80%] h-[80%] bg-gradient-to-br from-indigo-100/40 via-violet-100/40 to-transparent rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[80%] h-[80%] bg-gradient-to-tr from-blue-50/40 via-indigo-50/40 to-transparent rounded-full blur-[100px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center preserve-3d"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 20 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-8 border border-indigo-100 shadow-sm"
          >
            <Zap className="w-4 h-4 mr-2" />
            Legal Help, Faster Than Ever
          </motion.div>
          
          <h1 className="text-5xl md:text-8xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
            Qualified Legal Advice <br />
            <motion.span 
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: "100% 50%" }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-[length:200%_auto] pb-2"
              style={{ WebkitBackgroundClip: 'text' }}
            >
              On-Demand.
            </motion.span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Skip the intake forms and waiting rooms. Describe your problem, 
            get matched by AI, and chat with a lawyer instantly. 
            <span className="font-semibold text-slate-900"> First 3 minutes free.</span>
          </motion.p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05, y: -4, boxShadow: "0 20px 25px -5px rgb(79 70 229 / 0.2)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-100"
              >
                Start Free Trial
              </motion.button>
            </Link>
            <motion.button 
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all shadow-sm"
            >
              Watch How it Works
            </motion.button>
          </div>

          {/* Store Links */}
          <div className="flex items-center justify-center space-x-6 mb-20 opacity-80 hover:opacity-100 transition-opacity">
            <a href="#" className="hover:scale-105 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-12" />
            </a>
            <a href="#" className="hover:scale-105 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-12" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto border-t border-slate-100 pt-16">
            {[
              { icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />, title: "Verified Lawyers", subtitle: "Fully vetted professionals", color: "bg-emerald-50" },
              { icon: <MessageSquare className="w-6 h-6 text-amber-600" />, title: "Instant Chat", subtitle: "No scheduling required", color: "bg-amber-50" },
              { icon: <Zap className="w-6 h-6 text-indigo-600" />, title: "$30 Flat Fee", subtitle: "Transparent consultation", color: "bg-indigo-50" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                whileHover={{ y: -5 }}
                className="flex items-center justify-center space-x-4 p-4 rounded-2xl hover:bg-slate-50/50 transition-colors cursor-default"
              >
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  {item.icon}
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-lg leading-tight">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.subtitle}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
