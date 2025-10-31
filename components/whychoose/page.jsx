"use client";
import { CheckCircle, Zap, FileText, Globe } from 'lucide-react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: CheckCircle,
      title: "ATS Optimization",
      description: "All templates are designed to pass Applicant Tracking Systems, ensuring your resume reaches human eyes.",
      bgColor: "bg-[#F5FAFB]"
    },
    {
      icon: Zap,
      title: "AI-Powered Suggestions",
      description: "Get intelligent recommendations for content, formatting, and keywords tailored to your industry.",
      bgColor: "bg-[#F5FAFB]"
    },
    {
      icon: FileText,
      title: "Export to PDF & Word",
      description: "Download your resume in multiple formats, fully editable and ready for any application.",
      bgColor: "bg-[#F5FAFB]"
    },
    {
      icon: Globe,
      title: "One-Click LinkedIn Integration",
      description: "Import your LinkedIn profile data instantly and save hours of manual data entry.",
      bgColor: "bg-[#F5FAFB]"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#F9F9FB] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      {/* Max-width container for 4K screens */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#342D4C] mb-4">
            Why Choose Us
          </h1>
          <p className="text-base sm:text-lg text-[#9D9D9D] max-w-2xl mx-auto">
            Everything you need to create a standout resume
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-[#FFFFFF] rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 sm:p-8 lg:p-10"
              >
                {/* Icon */}
                <div className={`${feature.bgColor} w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-5 sm:mb-6`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#4B74F4] animate-pulse" strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-[#342D4C] mb-3 sm:mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#9D9D9D] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}