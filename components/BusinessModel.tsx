
import React from 'react';
import { DollarSign, TrendingUp, Briefcase } from 'lucide-react';

const BusinessModel: React.FC = () => {
  return (
    <div className="bg-indigo-600 py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <p className="text-indigo-200 font-bold uppercase tracking-widest text-sm mb-4">Sustainable Growth</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              A Win-Win for <br /> Clients and Lawyers
            </h2>
            <p className="text-indigo-100 text-lg mb-10 leading-relaxed">
              We focus on transparency. Users get affordable access to legal professionals, 
              and lawyers get a steady stream of high-intent clients without the marketing overhead.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-xl mt-1">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Entry Point Revenue</h4>
                  <p className="text-indigo-200">A flat $30 fee for the initial 20-minute consultation after the trial.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-xl mt-1">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Long-term Upsells</h4>
                  <p className="text-indigo-200">Lawyers can offer deeper services (Contracts, Filings, etc.) ranging from $150 to $500+.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-xl mt-1">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-1">Scalable Commission</h4>
                  <p className="text-indigo-200">Platform retains a commission on all transactions, aligning our success with our lawyers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
                <div className="bg-emerald-50 text-emerald-700 text-xs font-black px-4 py-1 rounded-full uppercase">Current Rates</div>
            </div>
            <h4 className="text-3xl font-black text-slate-800 mb-8 mt-4">Consultation Fee</h4>
            <div className="flex items-baseline mb-8">
                <span className="text-6xl font-black text-indigo-600">$30</span>
                <span className="text-slate-400 text-lg ml-2">/ 20 mins</span>
            </div>
            <ul className="space-y-4 mb-10">
                <li className="flex items-center text-slate-600 font-medium">
                    <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    First 3 Minutes Free
                </li>
                <li className="flex items-center text-slate-600 font-medium">
                    <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    No Subscription Required
                </li>
                <li className="flex items-center text-slate-600 font-medium">
                    <svg className="w-5 h-5 text-indigo-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Verified State-Specific Lawyers
                </li>
            </ul>
            <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                Join Waitlist for Lawyers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessModel;
