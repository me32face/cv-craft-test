"use client";

import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AIContent() {
  const router = useRouter();

  const handleApplyThis = () => {
    router.push('/templates/template01');
  };

  const handleGenerateMore = () => {
    router.push('/templates/template01');
  };

  return (
    <div id='about' className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-10 sm:py-12 md:py-16 lg:py-16 xl:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#6D6D6D] mb-4">
            AI That Writes for You
          </h1>
          <p className="text-lg sm:text-xl text-[#757575] max-w-3xl mx-auto ">
            Our AI assistant helps you craft compelling content that gets noticed
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-32 items-start  ">
          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 lg:pt-12 lg:mt-16 ">
            <h2 className="text-xl font-semibold text-[#6D6D6D] mb-6">
              Your input
            </h2>

            <div className="space-y-6 pb-8 lg:pb-32">
              {/* Position Input */}
              <div>
                <div className="w-full px-5 py-4 rounded-2xl  bg-[#FAFAFA] focus:ring-2 text-[#6D6D6D] ">
                  <span className='font-semibold'>Position:</span> Marketing Manger
                </div>
              </div>
              {/* Experience Input */}
              <div>
                <div className="w-full px-5 py-4 rounded-2xl  bg-[#FAFAFA] focus:ring-2 text-gray-500 ">
                  <span className='font-semibold'>Experience:</span> Led team of 5
                </div>
              </div>
              <div>
                <div className="w-full px-5 py-4 rounded-2xl  bg-[#FAFAFA] focus:ring-2 text-gray-500 ">
                  <span className='font-semibold'>Achievement:</span>  Inreased sales
                </div>
              </div>
            </div>
          </div>

          {/* Generated Content Section */}
          <div className="rounded-2xl space-y-8">
            {/* First Card */}
            <div className="bg-[#F3F9F9] rounded-2xl shadow-xs p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                <h2 className="text-xl font-semibold bg-gradient-to-r from-[#4B74F4] to-[#7642EE] bg-clip-text text-transparent">
                  AI Generated Content</h2>
              </div>

              <div className="w-full max-w-3xl mx-auto bg-[#FFFFFF] rounded-xl  border border-gray-100 p-6 sm:p-8 transition-all ">
                <h3 className="text-lg sm:text-xl font-semibold text-[#5E5E5E] mb-2">
                  Marketing Manager
                </h3>
                <p className="text-[#606060] text-sm sm:text-base leading-relaxed">
                 A Full Stack Developer is a professional who works on both the front-end
                  and back-end of a web application. They are responsible for designing user
                   interfaces, developing server-side logic, managing databases, and integrating 
                   all parts of an application into a complete system.
                </p>
              </div>
              <div className="flex items-center justify-center gap-4 pt-4">
                <button onClick={handleApplyThis} className="bg-gradient-to-r from-[#4B74F4] to-[#7642EE] text-white w-72 px-4 py-2 rounded-3xl hover:from-blue-600 hover:to-purple-600 transition cursor-pointer">
                  Apply This
                </button>
                <button onClick={handleGenerateMore} className="bg-white text-black border border-gray-300 w-72 px-4 py-2 rounded-3xl hover:bg-gray-100 transition cursor-pointer">
                  Genetrate More
                </button>
              </div>
            </div>

            {/* Second Card */}
            <div className="bg-[#F3F9F9] rounded-2xl shadow-xs p-5 sm:pl-5">
              <div className=" pt-8">
                <h3 className="text-lg font-semibold text-[#5E5E5E] mb-4">
                  AI Features Include:
                </h3>
                <ul className="space-y-2">
                  {[
                    'Auto-generate achievements and responsibilities',
                    'Optimize for ATS (Applicant Tracking Systems)',
                    'Improve grammar and writing style',
                    'Tailor content to specific job descriptions',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[#606060]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div >
        </div>
      </div>
    </div>
  );
}