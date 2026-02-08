
import React from 'react';
import { UserCheck, Clock, CreditCard, Layout, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const FEATURE_DATA = [
  {
    icon: <Clock className="w-6 h-6 text-indigo-400" />,
    title: "Instant Access",
    desc: "Real lawyers available 24/7. No waiting weeks for an appointment."
  },
  {
    icon: <Layout className="w-6 h-6 text-violet-400" />,
    title: "No Intake Friction",
    desc: "Forget 10-page forms. Just tell us your issue in plain English."
  },
  {
    icon: <Users className="w-6 h-6 text-emerald-400" />,
    title: "Smart AI Matching",
    desc: "Our AI identifies the exact jurisdiction and legal specialty needed."
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Risk-Free Trial",
    desc: "First 3 minutes of every session are free. Test the chemistry."
  },
  {
    icon: <CreditCard className="w-6 h-6 text-rose-400" />,
    title: "$30 Flat Pricing",
    desc: "Transparent, one-time fee for initial consultation. No hidden bills."
  },
  {
    icon: <UserCheck className="w-6 h-6 text-sky-400" />,
    title: "Verified Pros",
    desc: "Every lawyer is vetted for license, standing, and expertise."
  }
];

const Features: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, rotateX: -20 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="bg-slate-900 py-32 perspective-1000 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">Why Lawyer Direct?</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Built for Modern Legal Needs</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            We've removed every barrier between you and the expert legal advice you deserve.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 preserve-3d"
        >
          {FEATURE_DATA.map((feat, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              whileHover={{ 
                scale: 1.03, 
                rotateY: 5, 
                rotateX: 5,
                translateZ: 20,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
              className="bg-slate-800/50 border border-slate-700 p-10 rounded-3xl hover:bg-slate-800 transition-all group preserve-3d cursor-default"
            >
              <motion.div 
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="mb-6 bg-slate-900 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
              >
                {feat.icon}
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-4">{feat.title}</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Features;
