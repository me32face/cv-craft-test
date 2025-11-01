"use client";
import { Star } from 'lucide-react';

const BuildSection = () => {
  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes gradientMove {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.8s ease-out;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 3s ease infinite;
        }
      `}</style>
      
      <section className="w-full bg-[#EDF2FD] py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 mt-15 ">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
            
            {/* Left Content */}
            <div className="w-full lg:w-[800px] text-center lg:text-left space-y-6 animate-fade-in-up px-4 lg:px-6">
              {/* Rating Badge */}
              <div className="inline-flex items-center bg-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-sm border cursor-pointer border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-4 sm:mb-6">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-[#28c260] fill-[#09b348] mr-2 animate-pulse" />
                <span className="text-gray-500 text-sm sm:text-base font-semibold">
                  Rated 4.9/5 by 10,000+ users
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#342D4C] leading-tight mb-4">
                Build Your Resume{" "}
                <span 
                  className="animate-gradient"
                  style={{
                    background: 'linear-gradient(to top, #7741EE, #516DF3)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  Effortlessly
                </span>{" "}
                with AI
              </h1>

              {/* Subtext */}
              <p className="text-gray-500 text-base sm:text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 sm:mb-10 ">
                Create a job-winning CV in minutes — smart, professional, and
                ATS-friendly. Join over 1M+ job seekers who landed their dream roles.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-8 sm:mb-10">
                <button 
                  className="w-full sm:w-auto group relative text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
                  style={{
                    background: 'linear-gradient(to right, #4D72F4, #7444EE)'
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Building 
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: 'linear-gradient(to right, #7444EE, #4D72F4)'
                    }}
                  ></div>
                </button>
                
                <button className="w-full sm:w-auto border-2 border-purple-400 text-purple-600 bg-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold hover:bg-purple-50 hover:border-purple-600 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-xl cursor-pointer">
                  Try Demo
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-row items-center justify-center lg:justify-start gap-8 sm:gap-10 pt-4">
                <div className="text-center lg:text-left ">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#342D4C]">
                    1M+
                  </h3>
                  <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base mt-1">
                    Resumes Created
                  </p>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#342D4C]">
                    15M+
                  </h3>
                  <p className="text-gray-600 font-medium text-xs sm:text-sm md:text-base mt-1">
                    Interviews Landed
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full lg:w-auto flex justify-center lg:justify-end animate-fade-in-right mt-8 lg:mt-0">
              <div className="relative w-full max-w-[400px] sm:max-w-[500px] lg:max-w-[800px]">
                
                {/* Image container */}
                <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                  <img
                    src="/mainlogo.png"
                    alt="Resume AI Illustration"
                    className="w-full h-auto object-contain drop-shadow-2xl rounded-2xl sm:rounded-3xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BuildSection;