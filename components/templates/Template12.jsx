'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Smile, User, Circle, Briefcase, GraduationCap, Code, Heart, Globe, CopyPlus, Trash2 } from 'lucide-react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';




export default function Template12() {



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
        <div className="max-w-4xl mx-auto bg-white shadow-2xl relative overflow-hidden">
          {/* Decorative Dots - Top Left */}
          <div className="absolute top-4 left-4 grid grid-cols-6 gap-2">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            ))}
          </div>

          {/* Decorative Dots - Bottom Right */}
          <div className="absolute bottom-4 right-4 grid grid-cols-6 gap-2">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            ))}
          </div>

          {/* Header Section */}
          <div className="grid grid-cols-3 gap-5">
            {/* Left - Yellow Section with Name */}
            <div className="col-span-1 pt-20 pl-40 flex items-center">
              <div>
                <h1 className="text-4xl font-bold text-gray-800 leading-tight" contentEditable suppressContentEditableWarning>Andry</h1>
                <h1 className="text-4xl font-bold text-gray-800 leading-tight" contentEditable suppressContentEditableWarning>Gordon</h1>
              </div>
            </div>

            {/* Right - White Section with Contact Info and Photo */}
            <div className="col-span-2 p-8 flex justify-between items-start">
              <div className="space-y-2 text-sm text-gray-700 pt-20 pl-5">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <span contentEditable suppressContentEditableWarning className="tracking-wide">
                    PHONE: 12 4567 8910
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span contentEditable suppressContentEditableWarning className="tracking-wide">
                    E-MAIL: HELLO@REALLYGREATSITE.COM
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-600">@</span>
                  <span contentEditable suppressContentEditableWarning className="tracking-wide">
                    SOCIAL PROFILE: @REALLYGREATSITE
                  </span>
                </div>
              </div>


              {/* Profile Photo */}
              <div className="relative">
                <div className="w-36 h-36 rounded-2xl  border-8 border-blue-100 bg-gray-300 overflow-hidden"
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
          <div className="grid grid-cols-3 gap-0 p-10">
            {/* Left Sidebar - Yellow */}
            <div className="col-span-1 bg-yellow-400 p-8 space-y-8">
              {/* Contact */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2" contentEditable suppressContentEditableWarning>
                  CONTACT
                </h3>
                <Draggable nodeRef={contactRef} >
                  <div ref={contactRef} data-section-item className="space-y-3 text-sm text-gray-800 relative group">
                    <div>
                      <p contentEditable suppressContentEditableWarning className="font-md">Suite 54328, USA</p>
                      <p contentEditable suppressContentEditableWarning>Chicago, Yoda street 42</p>
                    </div>
                    <div>
                      <p contentEditable suppressContentEditableWarning className="font-md">Social1: @ANDYGDR</p>
                      <p contentEditable suppressContentEditableWarning className="font-md">Social3: @A.G</p>
                    </div>
                    <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-black rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-black rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Draggable>
              </div>

              {/* Skills */}
              <div className="group">
                <div className="flex items-center gap-2 mb-4">
                  <h2 className="text-xl font-bold pb-2 tracking-wide">SKILLS</h2>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <AISparkle
                      className="-mt-1 ml-1"
                      section="Skills"
                      onGenerate={handleAIGenerate}
                    />
                  </div>
                </div>

                <Draggable nodeRef={skillsRef}>
                  <ul
                    ref={skillsRef}
                    data-section-item
                    className="list-disc list-inside space-y-2 text-xs relative group pb-6"
                  >
                    <li contentEditable suppressContentEditableWarning>Project Management</li>
                    <li contentEditable suppressContentEditableWarning>Public Relations</li>
                    <li contentEditable suppressContentEditableWarning>Teamwork</li>
                    <li contentEditable suppressContentEditableWarning>Time Management</li>
                    <li contentEditable suppressContentEditableWarning>Leadership</li>
                    <li contentEditable suppressContentEditableWarning>Effective Communication</li>

                    <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button
                        data-action="duplicate"
                        className="text-black rounded p-1.5 shadow-md bg-white"
                      >
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button
                        data-action="delete"
                        className="text-black rounded p-1.5 shadow-md bg-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </ul>
                </Draggable>
              </div>

              {/* Languages */}
              <div >
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  LANGUAGE
                </h3>
                <Draggable nodeRef={languagesRef}>
                  <div ref={languagesRef} data-section-item className="space-y-4 text-sm text-gray-800 relative group">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold" contentEditable suppressContentEditableWarning>
                        English
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold" contentEditable suppressContentEditableWarning>
                        Germany
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="font-semibold" contentEditable suppressContentEditableWarning>
                        French
                      </span>
                    </div>
                    <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-black rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-black rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Draggable>
              </div>


            </div>

            {/* Right Content Area */}
            <div className="col-span-2 p-8 space-y-8">
              {/* Profile */}
              <div className='group'>
                <div className='flex items-center  gap-2'>
                  <h3 className="text-xl font-bold text-slate-700 mb-3  pb-2" contentEditable suppressContentEditableWarning>
                    PROFILE
                  </h3>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <AISparkle className='mb-4' section="Summary" onGenerate={handleAIGenerate} />
                  </div>
                </div>
                <Draggable nodeRef={summaryRef}>
                  <div ref={summaryRef} data-section-item className='relative group'>
                    <p className="text-sm text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning  >
                      I can implement original solutions even for everyday tasks. I like when my result.The financial and technical framework is not able to stop me, because of the implementation of the task.
                    </p>
                    <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-black rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-black rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Draggable>
              </div>



              {/* Work Experience */}
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
                  <Draggable nodeRef={job2Ref}>
                    <div ref={job2Ref} data-section-item className=" gap-3 relative group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm" contentEditable suppressContentEditableWarning>Borcelle Studio</h4>
                          <p className="text-xs text-slate-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>2028 | Present</span>
                      </div>
                      <ul className="text-xs text-slate-700 space-y-1 ml-4 list-disc" contentEditable suppressContentEditableWarning>
                        <li>Develop and execute comprehensive marketing strategies and campaigns to increase brand awareness and engagement.</li>
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
                  <Draggable nodeRef={job3Ref}>
                    <div ref={job3Ref} data-section-item className=" gap-3 relative group">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm" contentEditable suppressContentEditableWarning>Borcelle Studio</h4>
                          <p className="text-xs text-slate-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-slate-500 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>2028 | Present</span>
                      </div>
                      <ul className="text-xs text-slate-700 space-y-1 ml-4 list-disc" contentEditable suppressContentEditableWarning>
                        <li>Develop and execute comprehensive marketing strategies and campaigns to increase brand awareness and engagement.</li>
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
                </div>
              </div>
              {/* Education */}
              <div className=''>
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2" contentEditable suppressContentEditableWarning>
                  EDUCATION
                </h3>
                <Draggable nodeRef={educationRef}>
                  <div ref={educationRef} data-section-item className='relative group' >
                    <p className="text-sm text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                      School of Innovation and Creative Thinking.HFCA.Communication and strategy. Advertising (advertising specialist)
                    </p>
                    <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-black rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-black rounded p-1.5 shadow-md">
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


