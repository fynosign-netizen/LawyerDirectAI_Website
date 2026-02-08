
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: "Are the lawyers on the platform licensed?",
    a: "Yes. Every lawyer on Lawyer Direct undergoes a rigorous vetting process. We verify their active license, standing with the state bar, and professional history before they can accept consultations."
  },
  {
    q: "How does the 3-minute free trial work?",
    a: "When you match with a lawyer, your chat starts immediately. The first 180 seconds are completely free. You can use this time to explain your situation and ensure the lawyer is a good fit. If you end the chat before the 3 minutes, you are never charged."
  },
  {
    q: "Is my data and conversation confidential?",
    a: "Absolutely. Our platform is built with enterprise-grade encryption. Conversations are protected by Attorney-Client privilege, and your data is never sold or shared with third parties."
  },
  {
    q: "Can the lawyer help me with a full court case?",
    a: "The $30 consultation is for initial advice and strategy. However, most lawyers on our platform are looking to build long-term relationships. If you need representation, you can hire them directly through the platform for follow-up work."
  }
];

// Added React.FC type to handle standard JSX attributes like 'key' correctly
const FAQItem: React.FC<{ q: string, a: string, i: number }> = ({ q, a, i }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${i}`}
        className="w-full py-6 flex items-center justify-between text-left hover:text-indigo-600 transition-colors"
      >
        <span className="text-lg font-bold text-slate-800">{q}</span>
        <div className={`p-2 rounded-full ${isOpen ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'} transition-all`}>
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p id={`faq-answer-${i}`} className="pb-8 text-slate-500 leading-relaxed max-w-3xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  return (
    <div className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Common Questions</h2>
          <p className="text-slate-500">Everything you need to know about our legal consultation platform.</p>
        </div>
        
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
          {FAQS.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} i={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
