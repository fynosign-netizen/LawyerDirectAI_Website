
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "David Chen",
    role: "Startup Founder",
    text: "I needed a quick review of a partnership agreement on a Sunday night. I was matched with a contract lawyer in 30 seconds and got exactly what I needed.",
    rating: 5,
    avatar: "https://picsum.photos/seed/david/100"
  },
  {
    name: "Sarah Miller",
    role: "Homeowner",
    text: "The 3-minute free trial is a game changer. I could tell immediately that the lawyer understood my property dispute before I committed to the $30 session.",
    rating: 5,
    avatar: "https://picsum.photos/seed/sarah2/100"
  },
  {
    name: "Marcus Thorne",
    role: "Freelancer",
    text: "As someone who deals with late payments constantly, having affordable legal advice a text away gives me incredible peace of mind.",
    rating: 5,
    avatar: "https://picsum.photos/seed/marcus/100"
  }
];

const Testimonials: React.FC = () => {
  return (
    <div className="py-24 px-6 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4">Real Impact</p>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900">What Our Users Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 relative"
            >
              <div className="absolute top-8 right-8 text-indigo-100">
                <Quote className="w-12 h-12" />
              </div>
              <div className="flex items-center space-x-1 mb-6">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 text-amber-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-600 italic mb-8 relative z-10">"{t.text}"</p>
              <div className="flex items-center">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4 border-2 border-slate-50" />
                <div>
                  <h4 className="font-bold text-slate-800">{t.name}</h4>
                  <p className="text-xs text-slate-400 uppercase tracking-wider">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
