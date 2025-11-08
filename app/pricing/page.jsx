'use client';

import Navbar from '../../components/navbar/page.jsx';
import React, { useState } from 'react';
import { Check, Crown } from 'lucide-react';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState('free');
  
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#f7f9fc] via-blue-50 to-purple-50 ">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 pt-20 md:pt-28">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
              Build a strikingly powerful
            </h1>
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              resume approved by recruiters
            </h1>
            <a href="/#template" className="inline-block bg-gradient-to-r from-[#4F8DF9] to-[#8A3FFC] hover:opacity-90 text-white font-semibold px-6 md:px-7 py-3 md:py-4 rounded-2xl shadow-lg transition-all mb-6 md:mb-8">
              Build My Resume Now
            </a>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 max-w-5xl mx-auto">
            <div
              onClick={() => setSelectedPlan('free')}
              className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 cursor-pointer transition-all duration-500 flex flex-col w-full max-w-sm md:max-w-none ${selectedPlan === 'free' ? 'md:w-[380px] border-[#8A3FFC] md:scale-105 shadow-2xl' : 'md:w-[320px] border-gray-200 md:opacity-75 md:hover:opacity-90'}`}
            >
              <div className="mb-4 h-8">
                <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Free Plan
                </span>
              </div>

              <div className="mb-5 h-20">
                <div className="flex items-baseline mb-2">
                  <span className={`font-bold text-gray-800 transition-all duration-500 ${selectedPlan === 'free' ? 'text-5xl' : 'text-4xl'}`}>₹0</span>
                </div>
                <p className="text-sm text-gray-500">Valid for 7 days</p>
              </div>

              <div className={`space-y-3 mb-5 flex-1 transition-all duration-500 ${selectedPlan === 'free' ? 'text-base' : 'text-sm'}`}>
                <div className="flex items-start gap-3">
                  <Check className={`text-gray-400 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'free' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700">All resume templates</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-gray-400 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'free' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700"><span className="font-semibold">Basic</span> resume sections</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-gray-400 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'free' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700">cv-craft branding</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-gray-400 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'free' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700">Maximum 12 section items</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-gray-400 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'free' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700">Access to <span className="font-semibold">all</span> design tools</span>
                </div>
              </div>

              <button className={`w-full py-2 border-2 font-semibold rounded-lg transition-all duration-500 mt-auto  ${selectedPlan === 'free' ? ' text-white bg-gradient-to-r from-[#4F8DF9] to-[#8A3FFC] hover:bg-blue-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
               <a href="/#template">Build My Resume</a> 
              </button>
            </div>

            <div
              onClick={() => setSelectedPlan('pro')}
              className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 relative cursor-pointer transition-all duration-500 flex flex-col w-full max-w-sm md:max-w-none ${selectedPlan === 'pro' ? 'md:w-[400px] border-[#8A3FFC] md:scale-105 shadow-2xl' : 'md:w-[320px] border-gray-200 md:opacity-75 md:hover:opacity-90'}`}
            >
              <div className={`absolute left-4 md:left-6 bg-purple-100 rounded-full px-3 md:px-4 py-1 md:py-2 flex items-center gap-2 shadow-md transition-all duration-500 ${selectedPlan === 'pro' ? '-top-3 md:-top-4' : '-top-2 md:-top-3 text-sm md:text-xs'}`}>
                <Crown className={`text-[#8A3FFC] fill-[#8A3FFC] transition-all duration-500 ${selectedPlan === 'pro' ? 'w-4 h-4' : 'w-3 h-3'}`} />
                <span className={`font-semibold text-gray-700 transition-all duration-500 ${selectedPlan === 'pro' ? 'text-xs' : 'text-[10px]'}`}>PRO QUARTERLY PLAN</span>
              </div>

              <div className={`absolute right-4 md:right-6 bg-gradient-to-r from-[#4F8DF9] to-[#8A3FFC] rounded-full px-2 md:px-3 py-1 shadow-md transition-all duration-500 ${selectedPlan === 'pro' ? '-top-3 md:-top-4' : '-top-2 md:-top-2 text-sm md:text-xs'}`}>
                <span className={`font-semibold text-white transition-all duration-500 text-[8px] md:text-xs ${selectedPlan === 'pro' ? 'md:text-xs' : 'md:text-[10px]'}`}>
                  <span className="line-through">₹2662</span> - SAVE 25.38%
                </span>
              </div>

              <div className="mt-4 mb-4 h-20">
                <div className="flex items-baseline mb-2">
                  <span className={`font-bold text-gray-800 transition-all duration-500 ${selectedPlan === 'pro' ? 'text-5xl' : 'text-4xl'}`}>₹663</span>
                  <span className={`font-semibold text-gray-600 transition-all duration-500 ${selectedPlan === 'pro' ? 'text-2xl' : 'text-xl'}`}>.33</span>
                  <span className="text-gray-500 ml-1">/mo</span>
                </div>
                <p className="text-sm text-gray-500">₹1990 billed every 3 months</p>
              </div>

              <div className="flex gap-1 md:gap-2 mb-6 border-b border-gray-200 h-12">
                <button className={`py-2 text-gray-600 hover:text-gray-800 transition-all duration-500 ${selectedPlan === 'pro' ? 'px-4 text-sm' : 'px-2 text-xs'}`}>
                  Pro Monthly
                </button>
                <button className={`py-2 font-semibold text-gray-800 border-b-2 border-[#8A3FFC] transition-all duration-500 ${selectedPlan === 'pro' ? 'px-4 text-sm' : 'px-2 text-xs'}`}>
                  Pro Quarterly
                </button>
                <button className={`py-2 text-gray-600 hover:text-gray-800 transition-all duration-500 ${selectedPlan === 'pro' ? 'px-4 text-sm' : 'px-2 text-xs'}`}>
                  Pro Semi-Annual
                </button>
              </div>

              <div className={`space-y-3 mb-8 flex-1 transition-all duration-500 ${selectedPlan === 'pro' ? 'text-base' : 'text-sm'}`}>

                <div className="flex items-start gap-3">
                  <Check className={`text-green-500 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'pro' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700"><span className="font-semibold">All</span> resume templates</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-green-500 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'pro' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700">Real-time content suggestions</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-green-500 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'pro' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700"> Applicant Tracking System (<span className="font-semibold">ATS </span>)</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-green-500 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'pro' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700">Pro resume sections</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-green-500 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'pro' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700">No branding</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-green-500 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'pro' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700">Unlimited section items</span>
                </div>
                <div className="flex items-start gap-3">
                  <Check className={`text-green-500 flex-shrink-0 mt-0.5 transition-all duration-500 ${selectedPlan === 'pro' ? 'w-5 h-5' : 'w-4 h-4'}`} />
                  <span className="text-gray-700">Thousands of design options</span>
                </div>
              </div>

              <button
                disabled
                className="w-full py-3 font-semibold rounded-lg transition-colors mt-auto bg-gray-300 text-gray-500 cursor-not-allowed"
              >
                Coming Soon
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}