import React from 'react';
import { Star, ArrowRight, Zap } from 'lucide-react';

export default function DreamJob() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[#7049EF] to-[#516DF3] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8 py-12">
        {/* Badge */}
        <div className="flex justify-center animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-[#5D5FF1] border border-white/30 rounded-full px-6 py-3 text-white shadow-lg hover:bg-white/10 transition-all duration-300">
            <Star className="w-5 h-5 fill-white" />
            <span className="text-sm font-medium">Join 1M+ successful job seekers</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="space-y-4 animate-slideUp">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight px-4">
            Your Dream Job Starts with
            <br />
            <span className="text-white">a Great Resume</span>
          </h1>
          
          <p className="text-lg md:text-lg text-white/90 max-w-2xl mx-auto px-1">
            Build your professional CV now with AI in minutes. No credit card required to start.
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center animate-fadeIn">
          <button className="group bg-white text-[#342D4C] font-semibold px-8 py-4 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2">
            <span>Build My Resume Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/90 pt-4 animate-fadeIn">
          <div className="flex items-center gap-2 brounded-full px-6 py-2">
            <div className="flex items-center gap-1">
              <div className="w-8 h-8 bg-white/20 rounded-full"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full -ml-3"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full -ml-3"></div>
            </div>
            <span className="font-medium">10,000+ this week</span>
          </div>
          
          <div className="hidden sm:block text-white/40">━━━</div>
          
          <div className="flex items-center gap-2  rounded-full px-6 py-2">
            <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />
            <span className="font-medium">Average time: 12 minutes</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}