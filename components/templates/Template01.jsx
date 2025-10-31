import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Globe, Briefcase, GraduationCap, Download, Plus } from 'lucide-react';
import Header from '../TemplateHeader/Header';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Draggable from "react-draggable";

export default function Template01() {
  const [profileImage, setProfileImage] = useState(null);
  const cvRef = useRef(null);
  const nodeRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

const downloadPDF = async () => {
  if (!cvRef.current) return;

  const cvElement = cvRef.current;
  const parentContainer = cvElement.parentElement;

  try {
    // 🔹 Save the old scale class (to restore later)
    const oldTransform = parentContainer.style.transform;
    const oldTransition = parentContainer.style.transition;

    // 🔹 Temporarily remove scaling (to capture full-resolution)
    parentContainer.style.transform = "scale(1)";
    parentContainer.style.transition = "none";

    // Wait a moment for layout to update
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 🔹 Capture the unscaled element
    const canvas = await html2canvas(cvElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      ignoreElements: (el) => el.tagName === "BUTTON"
    });

    // Restore original scale
    parentContainer.style.transform = oldTransform;
    parentContainer.style.transition = oldTransition;

    // 🔹 Convert to image and add to PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 0;

    pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
    pdf.save("RICHARD_SANCHEZ_CV.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try again.");
  }
};

  return (
    // <div className='h-screen flex flex-col overflow-auto'>
    <>
      {/* <Header /> */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer ">
        <div className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-40">
          <button
          onClick={downloadPDF}
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
          <div
            ref={cvRef}
            className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-hidden flex"
          >
            {/* Left Sidebar */}
            <div className="w-[35%] bg-gray-100 p-6">
              {/* Profile Image */}
               <Draggable nodeRef={nodeRef}>
              <div ref={nodeRef} className="mb-6">
                <div
                  className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => document.getElementById('profileImageInput').click()}
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white text-3xl font-bold">
                      RS
                    </div>
                  )}
                </div>
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              </Draggable>
              {/* Contact Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Contact</h3>
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

              {/* Skills Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Skills</h3>
                <ul className="space-y-1.5">
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
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Digital Marketing</span>
                  </li>
                </ul>
              </div>

              {/* Languages Section */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Languages</h3>
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>English (Fluent)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>French (Fluent)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>German (Basic)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Spanish (Intermediate)</span>
                  </li>
                </ul>
              </div>

              {/* Reference Section */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">Reference</h3>
                <div className="text-xs text-gray-700">
                  <p className="font-semibold mb-1" contentEditable suppressContentEditableWarning>Estelle Darcy</p>
                  <p className="text-gray-600 mb-1" contentEditable suppressContentEditableWarning>Wardiere Inc. / CTO</p>
                  <p className="text-gray-600" contentEditable suppressContentEditableWarning>Phone: 123-456-7890</p>
                  <p className="text-gray-600 break-all" contentEditable suppressContentEditableWarning>Email: hello@reallygreatsite.com</p>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-[65%] bg-white">
              {/* Header with dark background */}
              <Draggable nodeRef={nodeRef}>
                <div ref={nodeRef} className="bg-slate-700 text-white px-6 py-6">
                  <h1 className="text-3xl font-bold mb-1" contentEditable suppressContentEditableWarning>RICHARD SANCHEZ</h1>
                  <p className="text-sm uppercase tracking-widest" contentEditable suppressContentEditableWarning>Marketing Manager</p>
                </div>
              </Draggable>
              <div className="px-6 py-5 pt-8">
                {/* Profile Section */}
                <div className="mb-5">
                  <Draggable nodeRef={nodeRef}>
                  <div ref={nodeRef} className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Profile</h2>
                  </div>
                  </Draggable>
                  <div className="pl-8 border-l-2 border-gray-300 ml-3">
                    <p className="text-xs text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam laboris.
                    </p>
                  </div>
                </div>

                {/* Work Experience Section */}
                <div className=" pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-3 h-3 text-white" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Work Experience</h2>
                  </div>

                  <div className="pl-8 border-l-2 border-gray-300 ml-3 space-y-4">
                    {/* Job 1 */}
                    <div>
                      <div className="flex justify-between items-start mt-4">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Borcelle Studio</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2030 - PRESENT</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1">
                        <li contentEditable suppressContentEditableWarning>Develop and execute comprehensive marketing strategies and campaigns that align with the company's goals and objectives.</li>
                        <li contentEditable suppressContentEditableWarning>Lead, mentor, and manage the marketing team, fostering a collaborative and results-driven work environment.</li>
                        <li contentEditable suppressContentEditableWarning>Monitor campaign performance, track KPIs, and provide actionable insights to optimize marketing efforts and maximize ROI.</li>
                      </ul>
                    </div>

                    {/* Job 2 */}
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Fauget Studio</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2025 - 2029</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1">
                        <li contentEditable suppressContentEditableWarning>Create and manage the marketing budget, ensuring efficient allocation of resources and maximizing ROI.</li>
                        <li contentEditable suppressContentEditableWarning>Oversee market research to identify emerging trends, customer needs, and competitive intelligence.</li>
                      </ul>
                    </div>

                    {/* Job 3 */}
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Studio Shodwe</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2024 - 2025</span>
                      </div>
                      <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1">
                        <li contentEditable suppressContentEditableWarning>Develop and maintain strong relationships with partners, agencies, and vendors to support marketing initiatives.</li>
                        <li contentEditable suppressContentEditableWarning>Monitor and maintain brand consistency across all marketing channels and materials.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Education Section */}
                <div className='mt-8'>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-3 h-3 text-white" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Education</h2>
                  </div>

                  <div className="pl-8 border-l-2 border-gray-300 ml-3 space-y-3">
                    {/* Degree 1 */}
                    <div>
                      <div className="flex justify-between items-start mb-0.5">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Master of Business Management</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>School of business | Wardiere University</p>
                          <p className="text-xs text-gray-500" contentEditable suppressContentEditableWarning>GPA: 3.8 / 4.0</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2029 - 2031</span>
                      </div>
                    </div>

                    {/* Degree 2 */}
                    <div>
                      <div className="flex justify-between items-start mb-0.5">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Bachelor of Business Management</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>School of business | Wardiere University</p>
                          <p className="text-xs text-gray-500" contentEditable suppressContentEditableWarning>GPA: 3.9 / 4.0</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2025 - 2029</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full'>
           <h3 className="flex items-center justify-center mt-8 text-md text-gray-800 text-2xl font-semibold border-2 border-gray-600 px-4 py-4 w-full rounded-xl">
         <Plus className="w-8 h-8 text-gray-800" /> Add Page 
        </h3>
        </div>
        </div>
      </div>

    </>
  );
}
