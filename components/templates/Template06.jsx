import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function Template06() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <div className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-hidden p-12">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gray-800" contentEditable suppressContentEditableWarning>IVIYA </span>
              <span className="text-orange-500" contentEditable suppressContentEditableWarning>SCHWAIGER</span>
            </h1>
            <p className="text-lg font-semibold text-gray-800" contentEditable suppressContentEditableWarning>
              Mechanical Engineering
            </p>
          </div>
          
          <div className="text-right text-xs text-gray-700 space-y-1">
            <div className="flex items-center justify-end gap-2">
              <MapPin className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning>123 Anywhere St., Any City, ST 12345</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Phone className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning>123-456-7890</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Mail className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning>hello@reallygreatsite</span>
            </div>
          </div>
        </div>

        {/* Orange divider line */}
        <div className="w-[50%] h-1 bg-orange-500 mb-6 ml-auto"></div>

        {/* Profile Summary */}
        <div className="mb-6">
          <p className="text-xs text-gray-700 leading-relaxed text-justify" contentEditable suppressContentEditableWarning>
            Dedicated and detail-oriented Mechanical Engineer with 5+ years of experience in designing, analyzing, and optimizing mechanical systems for diverse applications. Skilled in modeling, thermal and structural analysis, and cross-functional team leadership. Committed to continuous improvement, efficient problem-solving, and delivering projects on schedule.
          </p>
        </div>

        {/* Work Experience Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-orange-500 mb-3 uppercase tracking-wide">Work Experience</h2>
          
          {/* Job 1 */}
          <div className="mb-4">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                    Senior Mechanical Engineer | Think Unlimited
                  </h3>
                  <span className="text-xs text-gray-600 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>
                    Jan 2022 – Present
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 mt-2">
                  <li contentEditable suppressContentEditableWarning>
                    Led the design and implementation of advanced mechanical systems for multiple projects, improving system efficiency by 18%.
                  </li>
                  <li contentEditable suppressContentEditableWarning>
                    Supervised and mentored a team of junior engineers, fostering skills development and technical growth.
                  </li>
                  <li contentEditable suppressContentEditableWarning>
                    Coordinated product testing, troubleshooting, and implemented quality control measures to ensure compliance with industry standards.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Job 2 */}
          <div className="mb-4">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                    Mechanical Project Engineer | Borcelle Company
                  </h3>
                  <span className="text-xs text-gray-600 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>
                    Jul 2019 – Dec 2021
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 mt-2">
                  <li contentEditable suppressContentEditableWarning>
                    Managed projects from concept to completion, focusing on manufacturability and durability.
                  </li>
                  <li contentEditable suppressContentEditableWarning>
                    Conducted root cause analysis for mechanical failures and implemented corrective actions.
                  </li>
                  <li contentEditable suppressContentEditableWarning>
                    Collaborated with cross-functional teams to resolve technical challenges and optimize designs.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-orange-500 mb-3 uppercase tracking-wide">Skills</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Hard Skills */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Hard Skills</h3>
              <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>3D Modeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Finite Element Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Thermal System Design & Simulation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Mechanical Component Design & Assembly</span>
                </li>
              </ul>
            </div>

            {/* Technical Skills */}
            <div>
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Technical Skills</h3>
              <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Root Cause Analysis & Troubleshooting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Project Management & Scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Design Optimization & Value Engineering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Quality Control & Assurance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-orange-500 mb-3 uppercase tracking-wide">Education</h2>
          
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                Bachelor of Mechanical Engineering
              </h3>
              <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>
                University of Anowari | Thermodynamics, Machine Design, Fluid Mechanics
              </p>
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap" contentEditable suppressContentEditableWarning>
              2015 – 2019
            </span>
          </div>
        </div>

        {/* Language Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-orange-500 mb-1 uppercase tracking-wide">Language</h2>
          
          <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning> English</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Malayalam</span>
                </li>
              </ul>
        </div>

        {/* Other Section */}
        <div>
          <h2 className="text-base font-bold text-orange-500 mb-3 uppercase tracking-wide">Other</h2>
          
          <div className="grid grid-cols-2 gap-6 text-xs text-gray-700">
            <div>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span><span className="font-semibold">Certified:</span> <span contentEditable suppressContentEditableWarning>Professional Engineer</span></span>
                </li>
                {/* <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span><span className="font-semibold">Languages:</span> <span contentEditable suppressContentEditableWarning>English, Mandarin</span></span>
                </li> */}
              </ul>
            </div>
            <div>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Member of Mechanical Engineering Association</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Member of Mechanical Engineering Association</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}