"use client";

import React from 'react';
import { FileText, Sparkles, Download } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      id: 1,
      icon: FileText,
      title: 'Enter Details',
      description: 'Fill your personal and career info with our intuitive form',
    },
    {
      id: 2,
      icon: Sparkles,
      title: 'Let AI Assist',
      description: 'Smart suggestions for phrases and formatting to make you stand out',
    },
    {
      id: 3,
      icon: Download,
      title: 'Download or Share',
      description: 'Export in PDF or online link format, ready for applications',
    },
  ];

  return (
    <section className="w-full bg-linear-to-b from-gray-50 to-white border-t-8 border-t-[#BFB3F6] py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#6D6D6D] mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-[#6D6D6D]">
            Three simple steps to create your perfect resume
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-start text-start py-8 sm:py-10 px-6 sm:px-8 rounded-2xl bg-[#F3FAFF] transition-transform duration-300 hover:scale-105"
            >
              {/* Icon Container */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-[#4C73F4] to-[#7743EE] rounded-2xl shadow-lg flex items-center justify-center mb-5 sm:mb-6 transform transition-all duration-300 hover:shadow-xl">
                <step.icon className="w-6 h-6 sm:w-7 text-white sm:h-7" strokeWidth={2} />
              </div>

              {/* Step Number */}
              <p className="text-xs sm:text-sm font-semibold text-[#6D6D6D] uppercase tracking-wider mb-2 sm:mb-3">
                Step {step.id}
              </p>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl lg:text-2xl font-bold text-[#342E4C] mb-3 sm:mb-4">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm sm:text-base font-semibold text-[#6D6D6D] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}