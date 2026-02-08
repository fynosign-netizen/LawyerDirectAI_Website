
import React, { useState } from 'react';
import { Check, Sparkles, Building2, User, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const PLANS = [
  {
    name: 'Pay Per Session',
    icon: <User className="w-5 h-5" />,
    description: 'For individuals with a one-time legal question or issue.',
    price: '$30',
    period: '/ 20-min session',
    highlight: false,
    badge: null,
    features: [
      'First 3 minutes free',
      'AI-powered lawyer matching',
      'Verified, state-licensed attorneys',
      'End-to-end encrypted chat',
      'Session summary & notes emailed',
      'No commitment or subscription',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'bg-slate-900 text-white hover:bg-slate-800',
  },
  {
    name: 'Priority Plan',
    icon: <Zap className="w-5 h-5" />,
    description: 'For individuals or families who need ongoing legal guidance.',
    price: '$79',
    period: '/ month',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Everything in Pay Per Session',
      '4 sessions included per month',
      'Priority queue — under 60s wait',
      'Dedicated attorney matching',
      'Document review (up to 10 pages)',
      'Unlimited follow-up messages',
      'Monthly legal health check-in',
    ],
    cta: 'Start 7-Day Free Trial',
    ctaStyle: 'bg-indigo-600 text-white hover:bg-indigo-700',
  },
  {
    name: 'Business',
    icon: <Building2 className="w-5 h-5" />,
    description: 'For startups and businesses needing reliable legal counsel.',
    price: '$249',
    period: '/ month',
    highlight: false,
    badge: null,
    features: [
      'Everything in Priority Plan',
      'Unlimited sessions for your team',
      'Up to 5 team member seats',
      'Contract drafting & review',
      'Compliance advisory support',
      'Dedicated account manager',
      'Custom SLA & billing',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'bg-slate-900 text-white hover:bg-slate-800',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 20 } },
};

const Pricing: React.FC = () => {
  const [annual, setAnnual] = useState(false);

  const getPrice = (plan: typeof PLANS[number]) => {
    if (plan.name === 'Pay Per Session') return plan.price;
    if (!annual) return plan.price;
    const monthly = parseInt(plan.price.replace('$', ''));
    const discounted = Math.round(monthly * 0.8);
    return `$${discounted}`;
  };

  return (
    <div className="bg-white py-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-indigo-600 font-bold uppercase tracking-widest text-sm mb-4">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Simple, Transparent Pricing</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg mb-10">
            No hidden fees. No surprise bills. Choose the plan that fits your needs — upgrade, downgrade, or cancel anytime.
          </p>

          {/* Billing toggle */}
          <div className="inline-flex items-center bg-slate-100 rounded-full p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                !annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center space-x-2 ${
                annual ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>Annual</span>
              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">Save 20%</span>
            </button>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        >
          {PLANS.map((plan, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              whileHover={{ translateY: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
              className={`relative rounded-3xl p-8 md:p-10 transition-all ${
                plan.highlight
                  ? 'bg-slate-900 text-white border-2 border-slate-800 shadow-2xl lg:scale-105'
                  : 'bg-slate-50 border border-slate-200 shadow-lg'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-indigo-600 text-white text-xs font-bold px-5 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg shadow-indigo-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{plan.badge}</span>
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="mb-8">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${
                  plan.highlight ? 'bg-white/10 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {plan.icon}
                </div>
                <h4 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-slate-900'}`}>
                  {plan.name}
                </h4>
                <p className={`text-sm leading-relaxed ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {plan.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline">
                  <motion.span
                    key={`${plan.name}-${annual}`}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-5xl font-black ${plan.highlight ? 'text-white' : 'text-slate-900'}`}
                  >
                    {getPrice(plan)}
                  </motion.span>
                  <span className={`text-base ml-2 ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {plan.period}
                  </span>
                </div>
                {annual && plan.name !== 'Pay Per Session' && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-emerald-500 text-sm font-semibold mt-2"
                  >
                    Billed annually &middot; Save ${Math.round(parseInt(plan.price.replace('$', '')) * 12 * 0.2)}/yr
                  </motion.p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </div>
                    <span className={`text-sm font-medium ${plan.highlight ? 'text-slate-300' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-bold text-base transition-all shadow-lg ${plan.ctaStyle} ${
                  plan.highlight ? 'shadow-indigo-900/30' : 'shadow-slate-200'
                }`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-slate-400 text-sm">
            All plans include end-to-end encryption &middot; Cancel anytime &middot; No setup fees &middot; SOC 2 compliant
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;
