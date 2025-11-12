import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Circle, CopyPlus, Trash2, Globe } from 'lucide-react';
import Draggable from "react-draggable";

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


  const handleButtonClick = useCallback((e) => {
    e.stopPropagation();
    const button = e.target.closest('button');
    if (!button) return;

    const action = button.getAttribute('data-action');
    const listItem = button.closest('li');

    if (listItem) {
      if (action === 'duplicate') {
        const clone = listItem.cloneNode(true);
        listItem.parentNode.insertBefore(clone, listItem.nextSibling);
      } else if (action === 'delete') {
        listItem.remove();
      }
      return;
    }

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
              `<li class="text-sm flex items-start relative group text-white">
                  <span class="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>${skill.trim().replace(/^[•\-*]\s*/, '')}</span>
                  <div class="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" class="text-white rounded p-1 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                    <button data-action="delete" class="text-white rounded p-1 shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
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

              return `<div class="relative group">
                  <div class="flex justify-between items-start mt-4">
                    <div>
                      <h3 class="text-sm font-bold text-gray-50" contentEditable suppressContentEditableWarning>${company}</h3>
                      <p class="text-xs text-gray-50" contentEditable suppressContentEditableWarning>${position}</p>
                    </div>
                    <span class="text-xs text-gray-50 whitespace-nowrap" contentEditable suppressContentEditableWarning>${period}</span>
                  </div>
                  <ul class="list-disc list-outside ml-4 text-xs text-gray-50 space-y-0.5 mt-1">
                    ${duties.map(duty => `<li contentEditable suppressContentEditableWarning>${duty.trim()}</li>`).join('')}
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



  const CVPage = () => {
    const contactRef = useRef(null);
    const educationRef = useRef(null);
    const skillsRef = useRef(null);
    const languagesRef = useRef(null);
    const profileRef = useRef(null);
    const job1Ref = useRef(null);
    const job2Ref = useRef(null);
    const job3Ref = useRef(null);
    const ref1Ref = useRef(null);
    const ref2Ref = useRef(null);

    return (

      <div data-editor-container className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-hidden flex" onClick={handleButtonClick}>
<<<<<<< Updated upstream
        <div className="min-h-screen bg-gray-50   flex justify-center items-start">
          {/* <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl overflow-hidden"> */}
          {/* Left Sidebar */}
          <div data-cv-page className="w-1/3 h-[297mm] bg-slate-600 text-white p-7 pb-12 ">
            {/* Profile Image */}
            <div className="mb-10">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200"
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
=======
          <div className="min-h-screen bg-gray-50   flex justify-center items-start" onClick={handleButtonClick}>
        {/* <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl overflow-hidden"> */}
     {/* Left Sidebar */}
        <div data-cv-page className="w-1/3 bg-slate-600 text-white p-7 pb-12 ">
          {/* Profile Image */}
          <div className="mb-10">
            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200"
              onClick={() => document.getElementById('profileImageInput').click()}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  RS
                </div>
              )}
>>>>>>> Stashed changes
            </div>


            {/* Contact Section */}
            <div className="pb-8">
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
            <div className="pb-8">
              <h2 className="text-lg font-bold mb-4 pb-2  " contentEditable suppressContentEditableWarning>EDUCATION</h2>
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
            <div className="mb-6 section-container" data-section="skills">
              <div className="relative flex gap-2  group">
                <Draggable nodeRef={skillsRef}>
                  <h3 ref={skillsRef} className="text-xl font-bold text-white mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Skills</h3>
                </Draggable>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ">
                  <AISparkle className='mt-1' section="Skills" onGenerate={handleAIGenerate} />
                </div>
              </div>
              <ul className="space-y-1.5 text-white" onKeyDown={(e) => {
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
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Public Relations</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Teamwork</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Time Management</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Leadership</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Effective Communication</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Critical Thinking</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Digital Marketing</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
              </ul>
            </div>

            {/* Languages Section */}
            <div className="mb-6">
              <Draggable nodeRef={languagesRef}>
                <h3 ref={languagesRef} className="text-xl font-bold text-white mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Languages</h3>
              </Draggable>
              <ul className="space-y-1.5 text-white" onKeyDown={(e) => {
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
                  <span contentEditable suppressContentEditableWarning>English (Fluent)</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>French (Fluent)</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>German (Basic)</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-xs flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Spanish (Intermediate)</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-2/3 p-8 bg-gray-50">
            {/* Header */}
            <div className="pb-8 -ml-8 p-5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-400">
              <h1 className="text-4xl font-bold text-slate-800" contentEditable suppressContentEditableWarning>
                RICHARD <span className="font-light" contentEditable suppressContentEditableWarning>SANCHEZ</span>
              </h1>
              <p className="text-sm text-slate-600 tracking-wider mt-1" contentEditable suppressContentEditableWarning>MARKETING MANAGER</p>
              <div className="w-16 h-0.5 bg-slate-800 mt-2"></div>
            </div>

            {/* Profile Section */}
            <div className="mb-5 section-container relative group" data-section="profile">
              <div className="flex items-center gap-2 mb-2 relative">
                <h2
                  contentEditable
                  suppressContentEditableWarning
                  className="text-2xl font-bold text-gray-800 uppercase tracking-wide"
                >
                  Profile
                </h2>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <AISparkle section="Profile" onGenerate={handleAIGenerate} />
                </div>
              </div>

              {/* Make this section draggable */}
              <Draggable nodeRef={profileRef}>
                <div ref={profileRef} className="relative group">
                  <div>
                    <p
                      id="profile-text"
                      className="text-xs text-gray-700 leading-relaxed"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum
                      dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                      magna aliqua. Ut enim ad minim veniam laboris.
                    </p>
                  </div>

                  {/* Hover buttons */}
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button
                      data-action="duplicate"
                      className="text-gray-600 bg-white rounded p-1 shadow-md hover:scale-110 transition-transform"
                    >
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button
                      data-action="delete"
                      className="text-gray-600 bg-white rounded p-1 shadow-md hover:scale-110 transition-transform"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </Draggable>
            </div>

            {/* Work Experience Section */}
            <div className="pb-8">
              <h3 className="text-lg font-bold text-slate-800 mb-4" contentEditable suppressContentEditableWarning>WORK EXPERIENCE</h3>
              <div className="space-y-5">
                {/* Job 1 */}
                <Draggable nodeRef={job1Ref} >
                  <div ref={job1Ref} className="relative group">
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
                        <h3 className="text-ms font-bold text-gray-800" contentEditable suppressContentEditableWarning>Borcelle Studio</h3>
                        <p className="text-ms text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2030 - PRESENT</span>
                    </div>
                    <ul className="ml-4 text-sm text-gray-700 mt-1 space-y-1">
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
                </Draggable>

                {/* Job 2 */}
                <Draggable nodeRef={job2Ref} >
                  <div ref={job2Ref} className="relative group">
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
                        <h3 className="text-ms font-bold text-gray-800" contentEditable suppressContentEditableWarning>Borcelle Studio</h3>
                        <p className="text-ms text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2030 - PRESENT</span>
                    </div>
                    <ul className="ml-4 text-sm text-gray-700 mt-1 space-y-1">
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
                </Draggable>

                {/* Job 3 */}
                <Draggable nodeRef={job3Ref} >
                  <div ref={job3Ref} className="relative group">
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
                        <h3 className="text-ms font-bold text-gray-800" contentEditable suppressContentEditableWarning>Borcelle Studio</h3>
                        <p className="text-ms text-gray-600" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2030 - PRESENT</span>
                    </div>
                    <ul className="ml-4 text-sm text-gray-700 mt-1 space-y-1">
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
