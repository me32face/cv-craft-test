import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Globe, Briefcase, GraduationCap, Plus, X } from 'lucide-react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';

export default function Template01() {
  const [profileImage, setProfileImage] = useState(null);
  const [pages, setPages] = useState([1]); // Track number of pages
  const { registerPDFFunction } = usePDF();

  // Use an array to hold a ref for EACH page
  const cvRefs = useRef([]);
  // Use a ref for the main container that has the "scale-[0.5]"
  const editorContainerRef = useRef(null);

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

  const addPage = () => {
    setPages([...pages, pages.length + 1]);
  };

  const deletePage = (pageIndex) => {
    if (pages.length > 1) {
      setPages(pages.filter((_, index) => index !== pageIndex));
    }
  };

  const downloadPDF = useCallback(async () => {
    const pageElements = cvRefs.current.filter(el => el);

    if (pageElements.length === 0) {
      console.error("No CV pages found to download.");
      return;
    }

    const parentContainer = editorContainerRef.current;
    if (!parentContainer) {
      console.error("Could not find parent scaling container.");
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let oldTransform, oldTransition;

    try {
      // Save old scale and set to normal
      oldTransform = parentContainer.style.transform;
      oldTransition = parentContainer.style.transition;
      parentContainer.style.transform = "scale(1)";
      parentContainer.style.transition = "none";
      await new Promise(resolve => setTimeout(resolve, 200));

      for (let i = 0; i < pageElements.length; i++) {
        const cvElement = pageElements[i];

        if (i > 0) {
          pdf.addPage();
        }

        const canvas = await html2canvas(cvElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
          logging: false,
          ignoreElements: (el) => el.tagName === "BUTTON"
        });

        const imgData = canvas.toDataURL("image/png");
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      }

      pdf.save("RICHARD_SANCHEZ_CV.pdf");

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      // Restore original scale
      parentContainer.style.transform = oldTransform;
      parentContainer.style.transition = oldTransition;
    }
  }, [pages]);

  // This component is defined inside Template01 so it can access 'profileImage'
  const CVPage = ({ isFirst }) => {
    const nodeRef = useRef(null);
    const profileRef = useRef(null);
    const contactRef = useRef(null);
    const skillsRef = useRef(null);
    const languagesRef = useRef(null);
    const referenceRef = useRef(null);
    const headerRef = useRef(null);
    const workExpRef = useRef(null);
    const educationRef = useRef(null);
    const job1Ref = useRef(null);
    const job2Ref = useRef(null);
    const job3Ref = useRef(null);
    const contactContentRef = useRef(null);
    const skillsContentRef = useRef(null);
    const languagesContentRef = useRef(null);
    const referenceContentRef = useRef(null);


    return (

      <div className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-visible flex">

        {/* Left Sidebar */}
        <div className="w-[35%] bg-gray-100 p-6">
          {isFirst && (
            <>
              {/* Profile Image */}
              <div className="mb-6">
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

              {/* Contact Section */}
              <div className="mb-6">
                <Draggable nodeRef={contactRef} >
                  <h3 ref={contactRef} className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Contact</h3>
                </Draggable>
                <Draggable nodeRef={contactContentRef} >
                  <div
                    ref={contactContentRef}
                    className="space-y-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace') {
                        const contactItems = e.currentTarget.querySelectorAll('div');
                        contactItems.forEach(item => {
                          const span = item.querySelector('span');
                          if (span && !span.textContent.trim()) {
                            item.remove();
                          }
                        });
                      }
                    }}
                  >
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
                </Draggable>
              </div>

              {/* Skills Section */}
              <div className="mb-6">
                <Draggable nodeRef={skillsRef} >
                  <h3 ref={skillsRef} className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Skills</h3>
                </Draggable>
                <Draggable nodeRef={skillsContentRef} >
                  <ul
                    ref={skillsContentRef}
                    className="space-y-1.5"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => {
                      const lis = e.currentTarget.querySelectorAll("li");
                      lis.forEach(li => {
                        if (!li.textContent.trim()) li.remove();
                      });
                    }}
                  >
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">Project Management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">Public Relations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">Teamwork</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">Time Management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">Leadership</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">Effective Communication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">Critical Thinking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">Digital Marketing</span>
                    </li>
                  </ul>
                </Draggable>
              </div>

              {/* Languages Section */}
              <div className="mb-6">
                <Draggable nodeRef={languagesRef}>
                  <h3 ref={languagesRef} className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Languages</h3>
                </Draggable>
                <Draggable nodeRef={languagesContentRef} >
                  <ul
                    ref={languagesContentRef}
                    className="space-y-1.5"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => {
                      const lis = e.currentTarget.querySelectorAll("li");
                      lis.forEach(li => {
                        if (!li.textContent.trim()) li.remove();
                      });
                    }}
                  >
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">English (Fluent)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">French (Fluent)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">German (Basic)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span className="text-xs text-gray-700">Spanish (Intermediate)</span>
                    </li>
                  </ul>
                </Draggable>
              </div>

              {/* Reference Section */}
              <div>
                <Draggable nodeRef={referenceRef} >
                  <h3 ref={referenceRef} className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Reference</h3>
                </Draggable>
                <Draggable nodeRef={referenceContentRef} >
                  <div ref={referenceContentRef} className="text-xs text-gray-700">
                    <p className="font-semibold mb-1" contentEditable suppressContentEditableWarning>Estelle Darcy</p>
                    <p className="text-gray-600 mb-1" contentEditable suppressContentEditableWarning>Wardiere Inc. / CTO</p>
                    <p className="text-gray-600" contentEditable suppressContentEditableWarning>Phone: 123-456-7890</p>
                    <p className="text-gray-600 break-all" contentEditable suppressContentEditableWarning>Email: hello@reallygreatsite.com</p>
                  </div>
                </Draggable>
              </div>
            </>
          )}
        </div>

        {/* Right Content */}
        <div className="w-[65%] bg-white">
          {/* Header with dark background - Only show on first page */}
          {isFirst && (
            <div className="bg-slate-700 text-white px-6 py-6">
              <h1 className="text-3xl font-bold mb-1" contentEditable suppressContentEditableWarning>RICHARD SANCHEZ</h1>
              <p className="text-sm uppercase tracking-widest" contentEditable suppressContentEditableWarning>Marketing Manager</p>
            </div>
          )}

          {isFirst && (
            <div className="px-6 py-5 pt-8">
              {/* Profile Section */}
              <div className="mb-5">
                <Draggable nodeRef={nodeRef}>
                  <div ref={nodeRef} className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">P</span>
                    </div>
                    <h2 contentEditable suppressContentEditableWarning className="text-sm font-bold text-gray-800 uppercase tracking-wide">Profile</h2>
                  </div>
                </Draggable>
                <div className="relative">
                  <Draggable nodeRef={nodeRef}>
                    <div ref={nodeRef} className="absolute left-3 top-0 w-0.5 h-full bg-gray-300"></div>
                  </Draggable>
                  <Draggable nodeRef={nodeRef}>
                    <div className="pl-8 ml-3">
                      <p className="text-xs text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam laboris.
                      </p>
                    </div>
                  </Draggable>
                </div>
              </div>

              {/* Work Experience Section */}
              <div className="pt-4">
                <Draggable nodeRef={workExpRef} >
                  <div ref={workExpRef} className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-3 h-3 text-white" />
                    </div>
                    <h2 contentEditable suppressContentEditableWarning className="text-sm font-bold text-gray-800 uppercase tracking-wide">Work Experience</h2>
                  </div>
                </Draggable>
                <div className="pl-8 border-l-2 border-gray-300 ml-3 space-y-4">
                  {/* Job 1 */}
                  <Draggable nodeRef={job1Ref} >
                    <div ref={job1Ref} className="">
                      <div className="flex justify-between items-start mt-4">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Borcelle Studio</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2030 - PRESENT</span>
                      </div>
                      <ul
                        className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => {
                          const lis = e.currentTarget.querySelectorAll("li");
                          lis.forEach(li => {
                            if (!li.textContent.trim()) li.remove();
                          });
                        }}
                      >
                        <li>Develop and execute comprehensive marketing strategies...</li>
                        <li>Lead, mentor, and manage the marketing team...</li>
                        <li>Monitor campaign performance...</li>
                      </ul>
                    </div>
                  </Draggable>

                  {/* Job 2 */}
                  <Draggable nodeRef={job2Ref} bounds={false}>
                    <div ref={job2Ref} className="">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Fauget Studio</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2025 - 2029</span>
                      </div>
                      <ul
                        className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => {
                          const lis = e.currentTarget.querySelectorAll("li");
                          lis.forEach(li => {
                            if (!li.textContent.trim()) li.remove();
                          });
                        }}
                      >
                        <li>Create and manage the marketing budget, ensuring efficient allocation of resources and maximizing ROI.</li>
                        <li>Oversee market research to identify emerging trends, customer needs, and competitive intelligence.</li>
                      </ul>
                    </div>
                  </Draggable>

                  {/* Job 3 */}
                  <Draggable nodeRef={job3Ref} bounds={false}>
                    <div ref={job3Ref} className="">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Studio Shodwe</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2024 - 2025</span>
                      </div>
                      <ul
                        className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) => {
                          const lis = e.currentTarget.querySelectorAll("li");
                          lis.forEach(li => {
                            if (!li.textContent.trim()) li.remove();
                          });
                        }}
                      >
                        <li>Develop and maintain strong relationships with partners, agencies, and vendors to support marketing initiatives.</li>
                        <li>Monitor and maintain brand consistency across all marketing channels and materials.</li>
                      </ul>
                    </div>
                  </Draggable>
                </div>
              </div>

              {/* Education Section */}
              <Draggable nodeRef={educationRef} bounds={false}>
                <div ref={educationRef} className='mt-8 ' >
                  <div className="flex items-center gap-2 mb-2 ">
                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-3 h-3 text-white" />
                    </div>
                    <h2 contentEditable suppressContentEditableWarning className="text-sm font-bold text-gray-800 uppercase tracking-wide">Education</h2>
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
              </Draggable>
            </div>
          )}
        </div>
      </div>

    );
  };

  // Register PDF function with context
  useEffect(() => {
    registerPDFFunction(downloadPDF);
  }, [downloadPDF, registerPDFFunction]);

  // Initialize refs array if needed
  if (cvRefs.current.length !== pages.length) {
    cvRefs.current = new Array(pages.length);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      <div
        // 5. Add the ref to the main scaled container
        ref={editorContainerRef}
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >

        {/* 6. Remove the single 'cvRef' from the wrapper div */}
        <div className="relative">
          {pages.map((page, index) => (
            <div
              key={page}
              className="mb-8 relative"
            >
              {index > 0 && (
                <button
                  onClick={() => deletePage(index)}
                  className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <div ref={el => cvRefs.current[index] = el}>
                <CVPage isFirst={index === 0} />
              </div>
            </div>
          ))}
        </div>

        <div className='w-full'>
          <h3
            onClick={addPage}
            className="flex items-center justify-center mt-0 text-md text-gray-800 text-2xl font-semibold border border-gray-600 px-4 py-4 w-full rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-8 h-8 text-gray-800" /> Add Page
          </h3>
        </div>
      </div>
    </div>
  );
}