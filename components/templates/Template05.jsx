import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Circle, CopyPlus, Trash2, Globe } from 'lucide-react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function Template05() {
  const [profileImage, setProfileImage] = useState(null);
  const [contentState, setContentState] = useState({});
  const { registerPDFFunction } = usePDF();
  const { saveState } = useUndoRedo();

  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);
  const contactRef = useRef(null);
  const educationRef = useRef(null);
  const skillsRef = useRef(null);
  const languagesRef = useRef(null);
  const summaryRef = useRef(null);
  const job1Ref = useRef(null);
  const job2Ref = useRef(null);
  const job3Ref = useRef(null);
 const ref1Ref = useRef(null);
  const ref2Ref = useRef(null);

  const handleButtonClick = useCallback((e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const action = button.getAttribute('data-action');
    const section = button.closest('.relative.group');

    if (!section) return;

    if (action === 'duplicate') {
      const draggableParent = section.parentElement;
      if (draggableParent && draggableParent.classList.contains('react-draggable')) {
        const outerDraggable = draggableParent.parentElement;
        const clone = outerDraggable.cloneNode(true);
        outerDraggable.parentNode.insertBefore(clone, outerDraggable.nextSibling);
      } else {
        const clone = section.cloneNode(true);
        section.parentNode.insertBefore(clone, section.nextSibling);
      }
    } else if (action === 'delete') {
      const draggableParent = section.parentElement;
      if (draggableParent && draggableParent.classList.contains('react-draggable')) {
        draggableParent.parentElement.remove();
      } else {
        section.remove();
      }
    }
  }, []);

  const handleAIGenerate = async (section, keywords) => {
    if (!geminiService.genAI) {
      const apiKey = prompt('Please enter your Gemini API key:');
      if (!apiKey) return;
      geminiService.initialize(apiKey);
    }

    try {
      const generatedContent = await geminiService.generateContent(section, keywords);

      switch (section.toLowerCase()) {
        case 'summary':
          const summaryElement = document.getElementById('summary-text');
          if (summaryElement) {
            let cleanedContent = generatedContent
              .replace(/^#{1,6}\s+.+$/gm, '')
              .replace(/\*\*(.+?)\*\*/g, '$1')
              .replace(/\*(.+?)\*/g, '$1')
              .trim();
            const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim().length > 50);
            const actualSummary = paragraphs.find(p =>
              !p.toLowerCase().includes('here are') &&
              !p.toLowerCase().includes('of course') &&
              p.length > 100
            );
            summaryElement.textContent = actualSummary?.trim() || paragraphs[0]?.trim() || cleanedContent;
          }
          break;
        case 'expertise':
        case 'skills':
          const expertiseElement = document.querySelector('[data-section="expertise"] ul');
          if (expertiseElement) {
            const skills = generatedContent.split('\n').filter(skill => skill.trim());
            expertiseElement.innerHTML = skills.map(skill =>
              `<li class="flex items-center gap-2">
                <svg class="w-2 h-2 fill-white" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>
                <span>${skill.trim()}</span>
              </li>`
            ).join('');
          }
          break;
      }
    } catch (error) {
      alert('Failed to generate content. Please check your API key and try again.');
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        saveState({ profileImage, contentState });
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState({ profileImage, contentState });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [contentState, saveState]);

  useEffect(() => {
    const handleUndoRedo = (event) => {
      const { state } = event.detail;
      if (state) {
        setProfileImage(state.profileImage || null);
        setContentState(state.contentState || {});
      }
    };
    window.addEventListener('undoRedo', handleUndoRedo);
    return () => window.removeEventListener('undoRedo', handleUndoRedo);
  }, []);

  useEffect(() => {
    saveState({ profileImage: null, contentState: {} });
  }, []);

  const downloadPDF = useCallback(async () => {
    const cvElement = cvRef.current;
    if (!cvElement) return;

    const parentContainer = editorContainerRef.current;
    if (!parentContainer) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let oldTransform, oldTransition;

    try {
      oldTransform = parentContainer.style.transform;
      oldTransition = parentContainer.style.transition;
      parentContainer.style.transform = "scale(1)";
      parentContainer.style.transition = "none";
      await new Promise(resolve => setTimeout(resolve, 200));

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
      pdf.save("CV.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      parentContainer.style.transform = oldTransform;
      parentContainer.style.transition = oldTransition;
    }
  }, []);

  useEffect(() => {
    registerPDFFunction(downloadPDF);
  }, [downloadPDF, registerPDFFunction]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto">
      <div
        ref={editorContainerRef}
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef} className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-hidden flex" onClick={handleButtonClick}>
          {/* Left Sidebar */}
          <div className="w-1/3 bg-slate-600 text-white p-8">
            {/* Profile Image */}
            <div className="mb-8">
              <div
                className="w-40 h-40 mx-auto  overflow-hidden border-4 border-white shadow-xl bg-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => document.getElementById('profileImageInput').click()}
              >
                {/* {profileImage ? ( */}
                <img src={'/templateprofile/template02profile.webp'} alt="Profile" className="w-full h-full object-cover" />
                {/* ) : ( */}
                {/* <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div> */}
                {/* )} */}
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
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-600" contentEditable suppressContentEditableWarning>CONTACT</h2>
              <Draggable nodeRef={contactRef} >
                <div ref={contactRef} data-section-item className="space-y-3 text-xs">
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
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1.5 shadow-md">
                      <CopyPlus className="w-4 h-4" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1.5 shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Draggable>
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-600" contentEditable suppressContentEditableWarning>EDUCATION</h2>
              <Draggable nodeRef={educationRef} >
                <div ref={educationRef} data-section-item className="space-y-4 text-xs">
                  <div >
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
              </Draggable>
            </div>

            {/* Skills Section */}
            <div className="mb-8 group" data-section="skills">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold pb-2 border-b border-gray-500">SKILLS</h2>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <AISparkle className='-mt-2 ml-1' section="Skills" onGenerate={handleAIGenerate} />
                </div>
              </div>
              <Draggable nodeRef={skillsRef}>
                {/* The ref must be on the element Draggable actually moves */}
                <ul ref={skillsRef} data-section-item className="space-y-2 text-xs relative group">
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Project Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Public Relations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Teamwork</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Time Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Leadership</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Effective Communication</span>
                  </li>
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1.5 shadow-md">
                      <CopyPlus className="w-4 h-4" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1.5 shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </ul>
              </Draggable>
            </div>

            {/* Languages Section */}
            <div>
              <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-600" contentEditable suppressContentEditableWarning>LANGUAGES</h2>
              <Draggable nodeRef={languagesRef} >
                <div ref={languagesRef}>
                  <ul
                    className="space-y-1.5 text-xs text-gray-300 list-disc list-inside"
                    contentEditable suppressContentEditableWarning
                  >
                    <li>English </li>
                    <li>French </li>
                    <li>Chinese </li>
                    <li>Spanish </li>
                  </ul>
                  <div className="absolute -right-4 -top-12 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1.5 shadow-md">
                      <CopyPlus className="w-4 h-4" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1.5 shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Draggable>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-2/3 p-8 bg-gray-50">
            {/* Header */}
          <div className="mb-8 -ml-8 p-5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400">
              <h1 className="text-4xl font-bold text-slate-800" contentEditable suppressContentEditableWarning>
                RICHARD <span className="font-light" contentEditable suppressContentEditableWarning>SANCHEZ</span>
              </h1>
              <p className="text-sm text-slate-600 tracking-wider mt-1" contentEditable suppressContentEditableWarning>MARKETING MANAGER</p>
              <div className="w-16 h-0.5 bg-slate-800 mt-2"></div>
            </div>

            {/* Profile Section */}
            <div className="mb-8 group ">
              <div className='flex items-center  gap-2'>
                <h3 className="text-lg font-bold text-slate-800 mb-1" contentEditable suppressContentEditableWarning>
                  PROFILE
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <AISparkle className='mb-4' section="Summary" onGenerate={handleAIGenerate} />
                </div>
              </div>
              <Draggable nodeRef={summaryRef}>
                <div ref={summaryRef} data-section-item className="relative group">
                  <p id='summary-text' className="text-xs text-slate-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis
                    nostrud exercitation ullamco laboris. Lorem ipsum dolor sit amet, consectetur
                    adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua veniam quis nostrud exercitation. Ut enim ad minim veniam quis nostrud
                    exercitation ullamco.
                  </p>
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                      <CopyPlus className="w-4 h-4" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Draggable>
            </div>

            {/* Work Experience Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4" contentEditable suppressContentEditableWarning>WORK EXPERIENCE</h3>
              <div className="space-y-5">
                {/* Job 1 */}
                  <Draggable nodeRef={job1Ref}>
                <div ref={job1Ref} data-section-item className=" gap-3 relative group">
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
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                </div>
                </Draggable>

                {/* Job 2 */}
                <Draggable nodeRef={job2Ref}>
                <div ref={job2Ref} data-section-item className=" gap-3 relative group">
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
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                </div>
                </Draggable>

                {/* Job 3 */}
                <Draggable nodeRef={job3Ref}>
                  <div ref={job3Ref} data-section-item className=" relative group">
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
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                </div>
                </Draggable>
              </div>
            </div>

            {/* Reference Section */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4" contentEditable suppressContentEditableWarning>REFERENCE</h3>
              <div className="grid grid-cols-2 gap-6">
                {/* Reference 1 */}
               <Draggable nodeRef={ref1Ref}>
                  <div ref={ref1Ref} data-section-item className="relative group">
                   <h4 className="font-bold text-slate-800 text-sm mb-1" contentEditable suppressContentEditableWarning>Estelle Darcy</h4>
                  <p className="text-slate-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                  <div className="text-slate-600 space-y-0.5">
                    <p contentEditable suppressContentEditableWarning><span className="font-semibold" >Phone:</span> 123-456-7890</p>
                    <p contentEditable suppressContentEditableWarning><span className="font-semibold">Email:</span> hello@reallygreatsite.com</p>
                  </div>
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                </div>
                </Draggable>

                {/* Reference 2 */}
                <Draggable nodeRef={ref2Ref}>
                  <div ref={ref2Ref} data-section-item className="relative group">
                  <h4 className="font-bold text-slate-800 text-sm mb-1" contentEditable suppressContentEditableWarning>Harper Richard</h4>
                  <p className="text-slate-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                  <div className="text-slate-600 space-y-0.5">
                    <p contentEditable suppressContentEditableWarning><span className="font-semibold" >Phone:</span> 123-456-7890</p>
                    <p contentEditable suppressContentEditableWarning><span className="font-semibold" >Email:</span> hello@reallygreatsite.com</p>
                  </div>
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                </div>
                </Draggable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
