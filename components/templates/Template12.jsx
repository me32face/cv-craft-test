'use client'
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { ZoomOut, ZoomIn, CopyPlus, Trash2, Repeat2 } from 'lucide-react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';




export default function Template12() {
  // ZoomControlsComponent
  const [scale, setScale] = useState(1);
  const minScale = 0.25;
  const maxScale = 3;
  const step = 0.1;
  const contentRef = useRef(null);

  const [profileImage, setProfileImage] = useState(null);
  const [contentState, setContentState] = useState({});
  const { registerPDFFunction } = usePDF();
  const { saveState } = useUndoRedo();

  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);
  const imageRef = useRef(null);



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

      // Update the appropriate section based on the section type
      switch (section.toLowerCase()) {
        case 'profile':
        case 'summary':
          const profileElement = document.getElementById('profile-text');
          if (profileElement) {
            // Clean the generated content
            let cleanedContent = generatedContent
              // Remove markdown headers (###, ##, #)
              .replace(/^#{1,6}\s+.+$/gm, '')
              // Remove markdown bold (**text**)
              .replace(/\*\*(.+?)\*\*/g, '$1')
              // Remove markdown italic (*text*)
              .replace(/\*(.+?)\*/g, '$1')
              .trim();

            // Split into paragraphs
            const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim().length > 50);

            // Skip introductory paragraphs (like "Of course. Here are...")
            // Find the first paragraph that doesn't contain phrases like "here are", "options", "choose"
            const actualSummary = paragraphs.find(p =>
              !p.toLowerCase().includes('here are') &&
              !p.toLowerCase().includes('of course') &&
              !p.toLowerCase().includes('choose the option') &&
              !p.toLowerCase().includes('pro-tip') &&
              p.length > 100 // Ensure it's substantial
            );

            const finalContent = actualSummary?.trim() || paragraphs[0]?.trim() || cleanedContent;

            profileElement.textContent = finalContent;
          } else {
            console.error('Profile element not found');
          }
          break;
        case 'skills':
          const skillsElement = document.querySelector('[data-section="skills"] ul');
          if (skillsElement) {
            const skills = generatedContent.split('\n').filter(skill => skill.trim());
            skillsElement.innerHTML = skills.map(skill =>
              `<li class="text-xs flex items-start relative group text-gray-700">
                <span class="mr-2">•</span>
                <span contentEditable suppressContentEditableWarning>${skill.trim()}</span>
                <div class="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <button data-action="duplicate" class="text-gray-600 rounded p-1 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </button>
                  <button data-action="delete" class="text-gray-600 rounded p-1 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </li>`
            ).join('');
          }
          break;
        case 'work experience':
          const workExpElement = document.querySelector('[data-section="work-experience"] .space-y-4');
          if (workExpElement) {
            const experiences = generatedContent.split('---').filter(exp => exp.trim());
            workExpElement.innerHTML = experiences.map(exp => {
              const lines = exp.trim().split('\n').filter(line => line.trim());
              const company = lines[0] || 'Company Name';
              const position = lines[1] || 'Position';
              const period = lines[2] || '2020 - Present';
              const duties = lines.slice(3).filter(duty => duty.trim());

              return `<div>
                <div class="flex justify-between items-start mt-4">
                  <div>
                    <h3 class="text-sm font-bold text-gray-800">${company}</h3>
                    <p class="text-xs text-gray-600">${position}</p>
                  </div>
                  <span class="text-xs text-gray-500 whitespace-nowrap">${period}</span>
                </div>
                <ul class="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1">
                  ${duties.map(duty => `<li>${duty.trim()}</li>`).join('')}
                </ul>
              </div>`;
            }).join('');
          }
          break;
        default:
          console.log('Generated content:', generatedContent);
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


  // ZoomControlsComponent

 

  const CVPage = () => {


    return (

      <>
        <div className="w-[210mm] min-h-[297mm]  bg-white shadow-2xl overflow-visible flex" onClick={handleButtonClick} style={{
          WebkitFontSmoothing: 'antialiased', textRendering: 'geometricPrecision', imageRendering: 'crisp-edges',
          transform: `scale(${scale})`, transformOrigin: "center center"
        }}>
          <div className="max-w-4xl mx-auto bg-white shadow-2xl relative overflow-hidden">
            {/* Decorative Dots - Top Left */}
            <div className="absolute top-4 left-4 grid grid-cols-6 gap-2">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#a680c9] rounded-full"></div>
              ))}
            </div>

            {/* Decorative Dots - Bottom Right */}
            <div className="absolute bottom-4 right-4 grid grid-cols-6 gap-2">
              {[...Array(24)].map((_, i) => (
                <div key={i} className="w-3 h-3 bg-[#a680c9] rounded-full"></div>
              ))}
            </div>

            {/* Header Section */}
            <div className="grid grid-cols-3 gap-5">
              {/* Left - Yellow Section with Name */}
              <div className="col-span-1 pt-20 pl-24 flex items-center">
                <div>
                  <h1 className="text-5xl font-bold text-gray-800 leading-tight" contentEditable suppressContentEditableWarning>Andry</h1>
                  <h1 className="text-4xl font-bold text-gray-800 leading-tight" contentEditable suppressContentEditableWarning>Gordon</h1>
                </div>
              </div>

              {/* Right - White Section with Contact Info and Photo */}
              <div className="col-span-2 p-8 flex justify-between items-start">
                <div className="space-y-2 text-sm text-gray-700 pt-20 pl-5">
                  <div className="flex items-center gap-3">
                    <span contentEditable suppressContentEditableWarning className="tracking-wide">
                      PHONE: 12 4567 8910
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span contentEditable suppressContentEditableWarning className="tracking-wide">
                      E-MAIL: HELLO@REALLYGREATSITE.COM
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span contentEditable suppressContentEditableWarning className="tracking-wide">
                      SOCIAL PROFILE: @REALLYGREATSITE
                    </span>
                  </div>
                </div>


                {/* Profile Photo */}
                <div className="relative">
                  <div className="w-36 h-36 rounded-2xl  border-8 border-[#dec9f1] bg-gray-300 overflow-hidden cursor-pointer"
                    onClick={() => document.getElementById('profileImageInput').click()}>
                    <img ref={imageRef} src={profileImage || '/api/placeholder/160/160'} alt="Profile" className="w-full h-full object-cover" />
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
              <div className="col-span-1 bg-[#dec9f1] p-8 space-y-8">
                {/* Contact */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2" contentEditable suppressContentEditableWarning>
                    CONTACT
                  </h3>
                  <div
                    className="space-y-2 relative group"
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
                      {/* <Phone className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" /> */}
                      <span
                        className="text-xs text-gray-700"
                        contentEditable
                        suppressContentEditableWarning
                      >+123-456-7890</span>
                    </div>
                    <div className="flex items-start gap-2">
                      {/* <Mail className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" /> */}
                      <span
                        className="text-xs text-gray-700 break-all"
                        contentEditable
                        suppressContentEditableWarning

                      >hello@reallygreatsite.com</span>
                    </div>
                    <div className="flex items-start gap-2">
                      {/* <MapPin className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" /> */}
                      <span
                        className="text-xs text-gray-700"
                        contentEditable
                        suppressContentEditableWarning
                      >123 Anywhere St., Any City</span>
                    </div>
                    <div className="flex items-start gap-2">
                      {/* <Globe className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" /> */}
                      <span
                        className="text-xs text-gray-700 break-all"
                        contentEditable
                        suppressContentEditableWarning
                      >www.reallygreatsite.com</span>
                    </div>
                    <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

                {/* Skills */}
                <div className="mb-6 section-container" data-section="skills">
                  <div className="relative flex gap-2  group">
                    <h3 className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Skills</h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ">
                      <AISparkle className='mt-1' section="Skills" onGenerate={handleAIGenerate} />
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-gray-900" onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      const lis = e.currentTarget.querySelectorAll('li');
                      lis.forEach(li => {
                        const span = li.querySelector('span[contenteditable]');
                        if (span && !span.textContent.trim()) {
                          li.remove();
                        }
                      });
                    }
                  }}>
                    <li className="text-xs flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Project Management</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-xs flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Public Relations</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-xs flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Teamwork</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-xs flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Time Management</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-xs flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Leadership</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-xs flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Effective Communication</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-xs flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Critical Thinking</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-xs flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Digital Marketing</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Languages</h2>
                  <ul className="space-y-1.5 text-gray-900" onKeyDown={(e) => {
                    if (e.key === 'Backspace') {
                      const lis = e.currentTarget.querySelectorAll('li');
                      lis.forEach(li => {
                        const span = li.querySelector('span[contenteditable]');
                        if (span && !span.textContent.trim()) {
                          li.remove();
                        }
                      });
                    }
                  }}>
                    <li className="text-sm flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>English (Fluent)</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-sm flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>French (Fluent)</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-sm flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>German (Basic)</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                    <li className="text-sm flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Spanish (Intermediate)</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                          <CopyPlus className="w-3 h-3" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="col-span-2 p-8 space-y-8">
                {/* Profile */}
                <div className="mb-5 section-container group" data-section="profile">
                  <div className="flex items-center gap-2 mb-2 relative">

                    <h2 contentEditable suppressContentEditableWarning className="text-xl font-bold text-gray-800 uppercase tracking-wide">Profile</h2>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity  ">
                      <AISparkle section="Profile" onGenerate={handleAIGenerate} />
                    </div>
                  </div>
                  <div className="relative">
                    <div className=" ml-3">
                      <p id="profile-text" className="text-xs text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam laboris.
                      </p>
                    </div>
                  </div>
                </div>



                {/* Work Experience */}
                <div className="pt-4 section-container" data-section="work-experience">
                  <div className="flex items-center gap-2 mb-2 relative">

                    <h2 contentEditable suppressContentEditableWarning className="text-xl font-bold text-gray-800 uppercase tracking-wide">Work Experience</h2>
                    {/* <AISparkle section="Work Experience" onGenerate={handleAIGenerate} /> */}
                  </div>
                  <div className=" ml-3 space-y-4">
                    {/* Job 1 */}
                    <div className="relative group">
                      <div className="absolute right-28 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-start mt-4">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Borcelle Studio</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2030 - PRESENT</span>
                      </div>
                      <ul className="ml-4 text-xs text-gray-700 mt-1 space-y-1">
                        <li className="flex items-start relative group">
                          <span className="mr-2">•</span>
                          <span contentEditable suppressContentEditableWarning>Develop and execute comprehensive marketing strategies...</span>
                          <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                              <CopyPlus className="w-3 h-3" />
                            </button>
                            <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                        <li className="flex items-start relative group">
                          <span className="mr-2">•</span>
                          <span contentEditable suppressContentEditableWarning>Lead, mentor, and manage the marketing team...</span>
                          <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                              <CopyPlus className="w-3 h-3" />
                            </button>
                            <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                        <li className="flex items-start relative group">
                          <span className="mr-2">•</span>
                          <span contentEditable suppressContentEditableWarning>Monitor campaign performance...</span>
                          <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                              <CopyPlus className="w-3 h-3" />
                            </button>
                            <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Job 2 */}
                    <div className="relative group">
                      <div className="absolute right-28 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Fauget Studio</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2025 - 2029</span>
                      </div>
                      <ul className="ml-4 text-xs text-gray-700 mt-1 space-y-1">
                        <li className="flex items-start relative group">
                          <span className="mr-2">•</span>
                          <span contentEditable suppressContentEditableWarning>Create and manage the marketing budget, ensuring efficient allocation of resources and maximizing ROI.</span>
                          <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                              <CopyPlus className="w-3 h-3" />
                            </button>
                            <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                        <li className="flex items-start relative group">
                          <span className="mr-2">•</span>
                          <span contentEditable suppressContentEditableWarning>Oversee market research to identify emerging trends,<br /> customer needs, and competitive intelligence.</span>
                          <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                              <CopyPlus className="w-3 h-3" />
                            </button>
                            <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>

                    {/* Job 3 */}
                    <div className="relative group">
                      <div className="absolute right-28 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>Studio Shodwe</h3>
                          <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2024 - 2025</span>
                      </div>
                      <ul className="ml-4 text-xs text-gray-700 mt-1 space-y-1">
                        <li className="flex items-start relative group">
                          <span className="mr-2">•</span>
                          <span contentEditable suppressContentEditableWarning>Develop and maintain strong relationships with partners, agencies, and vendors to support marketing initiatives.</span>
                          <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                              <CopyPlus className="w-3 h-3" />
                            </button>
                            <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                        <li className="flex items-start relative group">
                          <span className="mr-2">•</span>
                          <span contentEditable suppressContentEditableWarning>Monitor and maintain brand consistency across all marketing channels and materials.</span>
                          <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                              <CopyPlus className="w-3 h-3" />
                            </button>
                            <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Education */}
                <div className=''>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2" contentEditable suppressContentEditableWarning>
                    EDUCATION
                  </h3>
                  <div data-section-item className='relative group' >
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const memoizedCVPage = useMemo(() => <CVPage />, []);

  useEffect(() => {
    if (imageRef.current && profileImage) {
      imageRef.current.src = profileImage;
    }
  }, [profileImage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef} data-cv-page>
          {memoizedCVPage}
        </div>
      </div>
    </div>

  );
}


