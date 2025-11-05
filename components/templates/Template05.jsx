import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import Draggable from "react-draggable";

export default function Template05() {

  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);

  const CVPage = () => {
    const contactRef = useRef(null);
    const contactContentRef = useRef(null);
    return (

      <div className='min-h-screen p-6 bg-gray-50 flex items-start justify-center'>
        <div className="max-w-4xl mx-auto bg-white shadow-xl">
          <div className="flex">
            {/* Left Sidebar */}
            <div className="w-1/3 bg-slate-800 text-white p-8">
              {/* Profile Image */}
              <div className="mb-8">
                <div className="w-32 h-32 bg-white rounded-full mx-auto overflow-hidden border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Contact Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-slate-600" contentEditable suppressContentEditableWarning>CONTACT</h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5 flex-shrink-0" />
                    <span contentEditable suppressContentEditableWarning>+123-456-7890</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="break-all" contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe size={14} className="mt-0.5 flex-shrink-0" />
                    <span className="break-all" contentEditable suppressContentEditableWarning>www.reallygreatsite.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                    <span contentEditable suppressContentEditableWarning>123 Anywhere St., Any City</span>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-slate-600" contentEditable suppressContentEditableWarning>EDUCATION</h3>
                <div className="space-y-4 text-xs">
                  <div>
                    <p className="text-gray-400 mb-1" contentEditable suppressContentEditableWarning>2019 - 2020</p>
                    <p className="font-bold text-sm" contentEditable suppressContentEditableWarning>WARDIERE UNIVERSITY</p>
                    <p className="text-gray-300 mt-1" contentEditable suppressContentEditableWarning>Master's Degree in Business Management</p>
                    <p className="text-gray-400 mt-1" contentEditable suppressContentEditableWarning>GPA: 3.8 / 4.0</p>
                  </div>
                  <div>
                    <p className="text-gray-400 mb-1" contentEditable suppressContentEditableWarning>2015 - 2019</p>
                    <p className="font-bold text-sm" contentEditable suppressContentEditableWarning>WARDIERE UNIVERSITY</p>
                    <p className="text-gray-300 mt-1" contentEditable suppressContentEditableWarning>Bachelor's Degree in Business Management</p>
                    <p className="text-gray-400 mt-1" contentEditable suppressContentEditableWarning>GPA: 3.8 / 4.0</p>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-slate-600" contentEditable suppressContentEditableWarning>SKILLS</h3>
                <ul className="space-y-1.5 text-xs text-gray-300" contentEditable suppressContentEditableWarning>
                  <li>• Project Management</li>
                  <li>• Public Relations</li>
                  <li>• Teamwork</li>
                  <li>• Time Management</li>
                  <li>• Leadership</li>
                  <li>• Effective Communication</li>
                </ul>
              </div>

              {/* Languages Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 pb-2 border-b border-slate-600" contentEditable suppressContentEditableWarning>LANGUAGES</h3>
                <ul className="space-y-1.5 text-xs text-gray-300" contentEditable suppressContentEditableWarning>
                  <li>• English (Fluent)</li>
                  <li>• French (Fluent)</li>
                  <li>• Chinese (Basic)</li>
                  <li>• Spanish (Intermediate)</li>
                </ul>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-2/3 p-8 bg-gray-50">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-slate-800" contentEditable suppressContentEditableWarning>
                  RICHARD <span className="font-light" contentEditable suppressContentEditableWarning>SANCHEZ</span>
                </h1>
                <p className="text-sm text-slate-600 tracking-wider mt-1" contentEditable suppressContentEditableWarning>MARKETING MANAGER</p>
                <div className="w-16 h-0.5 bg-slate-800 mt-2"></div>
              </div>

              {/* Profile Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-3" contentEditable suppressContentEditableWarning>PROFILE</h3>
                <p className="text-xs text-slate-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis
                  nostrud exercitation ullamco laboris. Lorem ipsum dolor sit amet, consectetur
                  adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua veniam quis nostrud exercitation. Ut enim ad minim veniam quis nostrud
                  exercitation ullamco.
                </p>
              </div>

              {/* Work Experience Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-800 mb-4" contentEditable suppressContentEditableWarning>WORK EXPERIENCE</h3>

                <div className="space-y-5">
                  {/* Job 1 */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm" contentEditable suppressContentEditableWarning>Borcelle Studio</h4>
                        <p className="text-xs text-slate-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>2028 | Present</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 ml-4 list-disc" contentEditable suppressContentEditableWarning>
                      <li>Develop and execute comprehensive marketing strategies and campaigns to increase brand awareness and engagement.</li>
                      <li>Lead, mentor and manage a high-performing marketing team, fostering a collaborative and innovative work environment.</li>
                      <li>Analyze market trends, customer insights and competitor strategies.</li>
                    </ul>
                  </div>

                  {/* Job 2 */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm" contentEditable suppressContentEditableWarning>Tangen Studio</h4>
                        <p className="text-xs text-slate-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>2025 | 2028</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 ml-4 list-disc" contentEditable suppressContentEditableWarning>
                      <li>Create and manage the marketing budget, ensuring efficient allocation of resources to maximize ROI and achieve business objectives.</li>
                      <li>Collaborate with internal teams and external partners to drive brand consistency across marketing channels and materials.</li>
                    </ul>
                  </div>

                  {/* Job 3 */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm" contentEditable suppressContentEditableWarning>Studio Shodwe</h4>
                        <p className="text-xs text-slate-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>2023 | 2025</span>
                    </div>
                    <ul className="text-xs text-slate-700 space-y-1 ml-4 list-disc" contentEditable suppressContentEditableWarning>
                      <li>Conduct market research and competitive analysis, systems, agencies, and vendors to support marketing initiatives.</li>
                      <li>Monitor and measure brand performance, analyzing key metrics to optimize strategy, tactics and engagement.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Reference Section */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4" contentEditable suppressContentEditableWarning>REFERENCE</h3>
                <div className="grid grid-cols-2 gap-6">
                  {/* Reference 1 */}
                  <div className="text-xs">
                    <h4 className="font-bold text-slate-800 text-sm mb-1" contentEditable suppressContentEditableWarning>Estelle Darcy</h4>
                    <p className="text-slate-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                    <div className="text-slate-600 space-y-0.5">
                      <p contentEditable suppressContentEditableWarning><span className="font-semibold" >Phone:</span> 123-456-7890</p>
                      <p contentEditable suppressContentEditableWarning><span className="font-semibold">Email:</span> hello@reallygreatsite.com</p>
                    </div>
                  </div>

                  {/* Reference 2 */}
                  <div className="text-xs">
                    <h4 className="font-bold text-slate-800 text-sm mb-1" contentEditable suppressContentEditableWarning>Harper Richard</h4>
                    <p className="text-slate-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                    <div className="text-slate-600 space-y-0.5">
                      <p contentEditable suppressContentEditableWarning><span className="font-semibold" >Phone:</span> 123-456-7890</p>
                      <p contentEditable suppressContentEditableWarning><span className="font-semibold" >Email:</span> hello@reallygreatsite.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      <div
        ref={editorContainerRef}
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef}>
          <CVPage />
        </div>
      </div>
    </div>
  );
}