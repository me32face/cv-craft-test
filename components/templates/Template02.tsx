import React from 'react';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';

export default function Template02() {
   return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 flex justify-center items-start">
      <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl overflow-hidden">
        <div className="p-8 flex flex-col">
          {/* Header */}
          <div className="text-center mb-6 pb-6 border-b border-gray-300 relative">
            {/* Large decorative initial */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-[120px] font-serif text-gray-200 leading-none" style={{ fontFamily: 'Georgia, serif' }}>
              O
            </div>
            <div className="relative z-10 pt-8">
              <h1 className="text-4xl font-light tracking-widest text-gray-800 mb-1" contentEditable suppressContentEditableWarning>
                OLIVIA WILSON
              </h1>
              <p className="text-xs tracking-widest text-gray-600 uppercase" contentEditable suppressContentEditableWarning>
                Marketing Manager
              </p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="flex gap-6 flex-1">
            {/* Left Column */}
            <div className="w-[38%] space-y-6">
              {/* Contact */}
              <div>
                <h2 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">Contact</h2>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Phone className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>+123-456-7890</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-700 break-all" contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>123 Anywhere St., Any City</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                    <span className="text-xs text-gray-700 break-all" contentEditable suppressContentEditableWarning>www.reallygreatsite.com</span>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">Education</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5" contentEditable suppressContentEditableWarning>2029 - 2030</p>
                    <p className="text-xs font-semibold text-gray-800" contentEditable suppressContentEditableWarning>BORCELLE UNIVERSITY</p>
                    <p className="text-xs text-gray-700 mt-1" contentEditable suppressContentEditableWarning>Master of Business Management</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-0.5" contentEditable suppressContentEditableWarning>2025 - 2029</p>
                    <p className="text-xs font-semibold text-gray-800" contentEditable suppressContentEditableWarning>BORCELLE UNIVERSITY</p>
                    <p className="text-xs text-gray-700 mt-1" contentEditable suppressContentEditableWarning>Bachelor of Business Management</p>
                    <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>GPA: 3.8 / 4.0</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">Skills</h2>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Project Management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Public Relations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Teamwork</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Time Management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Leadership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Effective Communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Critical Thinking</span>
                  </li>
                </ul>
              </div>

              {/* Languages */}
              <div>
                <h2 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">Languages</h2>
                <ul className="space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>English: Fluent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>French: Fluent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>German: Basics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Spanish: Intermediate</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-[62%] space-y-5">
              {/* Profile Summary */}
              <div>
                <h2 className="text-xs font-bold text-gray-800 mb-2 uppercase tracking-wider">Profile Summary</h2>
                <p className="text-xs text-gray-700 leading-relaxed text-justify" contentEditable suppressContentEditableWarning>
                  Dynamic marketing professional with a proven track record in developing and executing successful marketing strategies. I am seeking a challenging role where I can contribute my skills in strategic planning, team leadership, and creative problem-solving to achieve business objectives.
                </p>
              </div>

              {/* Work Experience */}
              <div>
                <h2 className="text-xs font-bold text-gray-800 mb-3 uppercase tracking-wider">Work Experience</h2>
                
                <div className="space-y-4">
                  {/* Job 1 */}
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Borcelle Studio</h3>
                        <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap" contentEditable suppressContentEditableWarning>2030 - PRESENT</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1">
                      <li contentEditable suppressContentEditableWarning>Led the development and implementation of comprehensive marketing strategies that resulted in a 20% increase in brand visibility and a 15% growth in sales within the first year.</li>
                      <li contentEditable suppressContentEditableWarning>Successfully launched and managed multiple cross-channel campaigns, utilizing digital marketing, social media, and traditional advertising, resulting in improved customer acquisition and retention rates.</li>
                    </ul>
                  </div>

                  {/* Job 2 */}
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Fauget Studio</h3>
                        <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap" contentEditable suppressContentEditableWarning>2025 - 2029</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1">
                      <li contentEditable suppressContentEditableWarning>Conducted market research to identify emerging trends and consumer preferences, providing valuable insights for product development and positioning.</li>
                      <li contentEditable suppressContentEditableWarning>Oversaw the creation of engaging content for various platforms, collaborating with internal and external agencies to ensure brand consistency and relevance.</li>
                    </ul>
                  </div>

                  {/* Job 3 */}
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Studio Shodwe</h3>
                        <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-xs text-gray-600 whitespace-nowrap" contentEditable suppressContentEditableWarning>2024 - 2025</span>
                    </div>
                    <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1">
                      <li contentEditable suppressContentEditableWarning>Developed and executed targeted marketing campaigns, resulting in a 25% increase in lead generation.</li>
                      <li contentEditable suppressContentEditableWarning>Implemented SEO strategies to improve website traffic by 30%, enhancing online visibility and positioning the company.</li>
                      <li contentEditable suppressContentEditableWarning>Collaborated with sales teams to create effective sales collateral, presentations, and promotional materials.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
