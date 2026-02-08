
import React from 'react';
import { motion } from 'framer-motion';
import { Home, Users, Briefcase, Globe, Gavel, ShieldAlert } from 'lucide-react';

const CATEGORIES = [
  { icon: <Users />, title: "Family Law", desc: "Divorce, custody, and estate planning." },
  { icon: <Briefcase />, title: "Business & Contract", desc: "Formation, agreements, and disputes." },
  { icon: <Globe />, title: "Immigration", desc: "Visas, residency, and citizenship help." },
  { icon: <Home />, title: "Real Estate", desc: "Leases, closings, and tenant rights." },
  { icon: <ShieldAlert />, title: "Criminal Defense", desc: "Immediate counsel for urgent matters." },
  { icon: <Gavel />, title: "Personal Injury", desc: "Accidents, liability, and settlements." }
];

const LegalCategories: React.FC = () => {
  return (
    <div className="py-24 px-6 bg-white perspective-1000">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Any Issue, Any Time</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our platform supports a wide array of legal specialties across North America.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, i) => (
            <motion.div 
              key={i}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 5,
                translateZ: 30,
                boxShadow: "0 20px 40px rgba(0,0,0,0.08)"
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all preserve-3d group cursor-default"
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 mb-6 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">{cat.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegalCategories;
