'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, User, Circle, Briefcase, GraduationCap, Code, Heart, Globe, CopyPlus, Trash2 } from 'lucide-react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';



export default function Template10() {
  const [profileImage, setProfileImage] = useState(null);
  const [contentState, setContentState] = useState({});
  const { registerPDFFunction } = usePDF();
  const { saveState } = useUndoRedo();

  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);



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


  const CVPage = () => {

    const contactRef = useRef(null);
    const educationRef = useRef(null);
    const skillsRef = useRef(null);
    const languagesRef = useRef(null);
    const summaryRef = useRef(null);
    const job1Ref = useRef(null);
    const job2Ref = useRef(null);
    const job3Ref = useRef(null);
    const ref1Ref = useRef(null);

    return (

      <div className="w-[210mm]  bg-white shadow-2xl overflow-visible flex" onClick={handleButtonClick} style={{ WebkitFontSmoothing: 'antialiased', textRendering: 'geometricPrecision', imageRendering: 'crisp-edges' }}>
        <div className="max-w-4xl mx-auto bg-white shadow-2xl">
          {/* Header Section */}
          <div className="relative bg-gradient-to-tr from-slate-400 via-slate-500 to-slate-600 text-white">
            {/* Decorative Diagonal Elements */}
            <div className="absolute top-0 right-0 w-96 h-full bg-slate-700 opacity-30" style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
            <div className="absolute top-0 right-0 w-80 h-full bg-slate-800 opacity-20" style={{ clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 10% 100%)' }}></div>

            <div className="relative z-10 p-5 ml-12 pt-5 flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2" contentEditable suppressContentEditableWarning>SAHIB KHAN</h1>
                <p className="text-lg text-white/90" contentEditable suppressContentEditableWarning>Graphic Designer</p>
              </div>

              {/* Profile Picture */}
              <div className="relative">
                <div className="w-36 h-36 rounded-full  border-8 border-blue-100 bg-gray-300 overflow-hidden"
                  onClick={() => document.getElementById('profileImageInput').click()}>
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
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
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-0">
            {/* Left Sidebar */}
            <div className="col-span-1 bg-gradient-to-bl from-slate-400 to-slate-600 text-white p-6 space-y-6">
              {/* Contact */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold mb-3 border-b-2 border-white/30 pb-2" contentEditable suppressContentEditableWarning>
                  Contact
                </h3>
                <Draggable nodeRef={contactRef} >
                  <div ref={contactRef} data-section-item className="space-y-3 text-xs relative group">
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
                    <div className="absolute -right-4 -top-5 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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

              {/* Personal Skills */}
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

              <div className='group'>
                <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-600" contentEditable suppressContentEditableWarning> EDUCATION</h2>
                <Draggable nodeRef={educationRef} >
                  <div ref={educationRef} data-section-item className="space-y-4 text-xs relative group">
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

              {/* Languages */}
              <div>
                <h2 className="text-lg font-bold mb-4 pb-2 border-b border-slate-600" contentEditable suppressContentEditableWarning>LANGUAGES</h2>
                <Draggable nodeRef={languagesRef} >
                  <div ref={languagesRef} data-section-item className='relative group'>
                    <ul
                      className="space-y-1.5 text-xs text-white list-disc list-inside"
                      contentEditable suppressContentEditableWarning
                    >
                      <li>English </li>
                      <li>French </li>
                      <li>Chinese </li>
                      <li>Spanish </li>
                    </ul>
                    <div className="absolute -right-4 -top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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

            {/* Right Content Area */}
            <div className="col-span-2 p-8 space-y-6  ">
              {/* Career Objective */}
              <div className='group'>
                <div className='flex items-center  gap-2'>
                  <h3 className="text-xl font-bold text-slate-700 mb-3 border-b-2 border-slate-300 pb-2" contentEditable suppressContentEditableWarning>
                    PROFILE
                  </h3>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <AISparkle className='mb-4' section="Summary" onGenerate={handleAIGenerate} />
                  </div>
                </div>
                <Draggable nodeRef={summaryRef}>
                  <div ref={summaryRef} data-section-item className="relative group">
                    <p id='summary-text' className="text-xs text-slate-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                      I am an ambitious and eager to learning graphic designer. I am seeking a position where I can develop existing design skills, learn new techniques and contribute positively to future and gain valuable professional experience.
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

              {/* Experience */}
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-700 mb-3 border-b-2 border-slate-300 pb-2" contentEditable suppressContentEditableWarning>
                  Experience
                </h3>
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
                      <div className="absolute right-0 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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
                      <div className="absolute right-0 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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
                      <div className="absolute right-0 top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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

              {/* Technical Skills */}
              <div>
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-700 mb-3 border-b-2 border-slate-300 pb-2" contentEditable suppressContentEditableWarning>
                  Technical Skills
                </h3>
                <Draggable nodeRef={ref1Ref}>
                  <ul ref={ref1Ref} data-section-item className="grid grid-cols-2 gap-2 text-sm relative group">
                    <li className="flex items-center gap-2" >
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      <p contentEditable suppressContentEditableWarning>Photoshop</p>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      <p contentEditable suppressContentEditableWarning>Illustrator</p>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      <p contentEditable suppressContentEditableWarning>Premiere Pro</p>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      <p contentEditable suppressContentEditableWarning>Email Communication</p>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      <p contentEditable suppressContentEditableWarning>MS Office</p>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      <p contentEditable suppressContentEditableWarning>WordPress</p>
                    </li>
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </ul>
                </Draggable>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef} data-cv-page>
          <CVPage />
        </div>
      </div>
    </div>
  );
}

