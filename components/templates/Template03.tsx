import React from 'react';
import { Phone, Mail, MapPin, User, GraduationCap, Briefcase, Award, Settings } from 'lucide-react';

export default function Template03() {
  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <div className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-hidden relative">
        <style dangerouslySetInnerHTML={{
          __html: `
            .clip-diagonal {
              clip-path: polygon(0 0, 100% 0, 60% 100%, 0 100%);
            }
          `
        }} />
        
        <div className="flex h-full">
          {/* Left Sidebar */}
          <div className="w-[35%] bg-white relative">
            {/* Blue diagonal corner */}
            <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-400 to-blue-500 clip-diagonal"></div>
            
            <div className="relative z-10 p-8">
              {/* Profile Image */}
              <div className="mb-6">
                <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200">
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                    <User size={60} className="text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="text-center mb-8">
                <h1 className="text-4xl font-light text-blue-500 mb-1" contentEditable suppressContentEditableWarning>
                  Lorna
                </h1>
                <h1 className="text-4xl font-light text-blue-500 mb-3" contentEditable suppressContentEditableWarning>
                  Alvarado
                </h1>
                <p className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>
                  Marketing Manager
                </p>
              </div>

              {/* Contact Section */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Contact
                </h2>
                <div className="space-y-3 text-xs text-gray-600">
                  <div className="flex items-start gap-2">
                    <Phone className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span contentEditable suppressContentEditableWarning>+123-456-7890</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span className="break-all" contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-500" />
                    <span contentEditable suppressContentEditableWarning>123 Anywhere St., Any City, ST 12345</span>
                  </div>
                </div>
              </div>

              {/* About Me Section */}
              <div className="mb-8">
                <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  About Me
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed text-justify" contentEditable suppressContentEditableWarning>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>

              {/* Skills Section */}
              <div>
                <h2 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Skills
                </h2>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span contentEditable suppressContentEditableWarning>Management Skills</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span contentEditable suppressContentEditableWarning>Creativity</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span contentEditable suppressContentEditableWarning>Digital Marketing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span contentEditable suppressContentEditableWarning>Negotiation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span contentEditable suppressContentEditableWarning>Critical Thinking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span contentEditable suppressContentEditableWarning>Leadership</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-[65%] bg-white p-8 overflow-y-auto">
            {/* Education Section */}
            <div className="mb-8">
              <h2 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-gray-600" />
                Education
              </h2>
              <div className="space-y-4">
                {/* Education 1 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Bachelor of Business Management</h3>
                        <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Borcelle University</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2018 - 2020</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque. Sed leo nisl, semper ac hendrerit a sollicitudin in arcu.
                    </p>
                  </div>
                </div>

                {/* Education 2 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Bachelor of Business Management</h3>
                        <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Borcelle University</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2020 - 2021</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque. Sed leo nisl, semper ac hendrerit a sollicitudin in arcu.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Experience Section */}
            <div className="mb-8">
              <h2 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-600" />
                Experience
              </h2>
              <div className="space-y-4">
                {/* Job 1 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Product Design Manager</h3>
                        <p className="text-xs text-gray-600 italic" contentEditable suppressContentEditableWarning>Anowaal Industries</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2018 - 2020</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.
                    </p>
                  </div>
                </div>

                {/* Job 2 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Marketing Manager</h3>
                        <p className="text-xs text-gray-600 italic" contentEditable suppressContentEditableWarning>Anowaal Industries</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2018 - 2020</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.
                    </p>
                  </div>
                </div>

                {/* Job 3 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Marketing Manager</h3>
                        <p className="text-xs text-gray-600 italic" contentEditable suppressContentEditableWarning>Anowaal Industries</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2017 - 2018</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.
                    </p>
                  </div>
                </div>

                {/* Job 4 */}
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Marketing Manager</h3>
                        <p className="text-xs text-gray-600 italic" contentEditable suppressContentEditableWarning>Anowaal Industries</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2016 - 2017</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* References Section */}
            <div>
              <h2 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                <Award className="w-5 h-5 text-gray-600" />
                References
              </h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Reference 1 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-0.5" contentEditable suppressContentEditableWarning>Harumi Kobayashi</h3>
                  <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Phone:</span> <span contentEditable suppressContentEditableWarning>123-456-7890</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Email:</span> <span contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                  </p>
                </div>

                {/* Reference 2 */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-0.5" contentEditable suppressContentEditableWarning>Bailey Dupont</h3>
                  <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Phone:</span> <span contentEditable suppressContentEditableWarning>123-456-7890</span>
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold">Email:</span> <span contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
