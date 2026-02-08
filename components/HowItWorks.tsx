
import React from 'react';
import { motion } from 'framer-motion';

const STEPS = [
  {
    num: "01",
    title: "Describe Issue",
    desc: "Simply type what's happening. No legal jargon required."
  },
  {
    num: "02",
    title: "AI Analysis",
    desc: "Our engine detects your state and legal category instantly."
  },
  {
    num: "03",
    title: "Real-time Match",
    desc: "See a list of licensed lawyers who are online right now."
  },
  {
    num: "04",
    title: "3-Min Free Chat",
    desc: "Start a trial chat. If it's a fit, pay $30 to continue."
  }
];

const HowItWorks: React.FC = () => {
  return (
    <div className="py-32 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8"
        >
          <div className="max-w-2xl">
            <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4">The Process</p>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">From Legal Question to Expert Advice in 60 Seconds</h2>
          </div>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block"
          >
             <div className="bg-indigo-50 px-6 py-3 rounded-full text-indigo-700 font-bold flex items-center shadow-sm">
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse mr-3"></span>
                1,240 Lawyers Online Now
             </div>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.5 }}
            className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-slate-100 -z-0 origin-left"
          />
          
          {STEPS.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + (idx * 0.15) }}
              className="relative z-10 group"
            >
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20, 
                  delay: 0.4 + (idx * 0.15) 
                }}
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-16 h-16 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center text-2xl font-black text-slate-200 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all mb-8 mx-auto md:mx-0 shadow-xl shadow-slate-50 cursor-default"
              >
                {step.num}
              </motion.div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
