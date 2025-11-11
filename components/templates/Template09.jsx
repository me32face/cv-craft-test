'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Circle, CopyPlus, Trash2, Globe, } from 'lucide-react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function Template09() {
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

      <div className="min-h-screen bg-gray-50  flex justify-center items-center" onClick={handleButtonClick}>
        <div className="w-[210mm]  bg-white shadow-2xl overflow-hidden ">
          {/* Header Section */}
          <div className="bg-blue-900 text-white p-7 relative">

            {/* Top Section: Image + Name */}
            <div className="flex items-center gap-8">

              {/* Profile Image */}
              <div className="relative">
                <div
                  className="w-44 h-48 rounded-2xl border-8 border-blue-100 bg-gray-300 overflow-hidden cursor-pointer hover:scale-105 transition"
                  onClick={() => document.getElementById('profileImageInput').click()}
                >
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-4xl font-bold text-gray-700">
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

              {/* Name + Title + Contact */}
              <div className="flex flex-col gap-4">

                {/* Name + Title */}
                <div>
                  <h1
                    className="text-4xl font-bold tracking-wide"
                    contentEditable
                    suppressContentEditableWarning
                  >
                    OLIVIA WILSON
                  </h1>

                  <p
                    className="text-lg text-blue-200"
                    contentEditable
                    suppressContentEditableWarning
                  >
                    Marketing Manager
                  </p>
                </div>

                {/* Contact Info */}
                <div>
                  <Draggable nodeRef={contactRef}>
                    <div
                      ref={contactRef}
                      data-section-item
                      className="grid grid-cols-2 gap-y-3 gap-x-6"
                    >
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span className="text-sm">+123-456-7890</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span className="text-sm">hello@reallygreatsite.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe size={16} />
                        <span className="text-sm">www.reallygreatsite.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="text-sm">123 Anywhere St., Any City</span>
                      </div>
                    </div>
                  </Draggable>
                </div>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="grid grid-cols-3 gap-8 p-8">
            {/* Left Column */}
            <div className=" space-y-8">
              {/*  Profile Section */}
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

              {/* Skills Section */}
              <div className="mb-6 section-container" data-section="skills">
                <div className="relative flex gap-2  group">
                  <Draggable nodeRef={skillsRef}>
                    <h2 ref={skillsRef} className="text-2xl font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Skills</h2>
                  </Draggable>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity ">
                    <AISparkle className='mt-1' section="Skills" onGenerate={handleAIGenerate} />
                  </div>
                </div>
                <ul className="space-y-1.5 text-gray-700" onKeyDown={(e) => {
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

              {/* Language Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4" contentEditable suppressContentEditableWarning>Language</h2>
                <Draggable nodeRef={languagesRef}>
                  <div ref={languagesRef} data-section-item className='relative group'>
                    <ul className="space-y-2">
                      <li className="text-sm text-gray-700 flex items-center gap-2" contentEditable suppressContentEditableWarning>
                        <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                        English
                      </li>
                      <li className="text-sm text-gray-700 flex items-center gap-2" contentEditable suppressContentEditableWarning>
                        <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                        Spain
                      </li>
                      <li className="text-sm text-gray-700 flex items-center gap-2" contentEditable suppressContentEditableWarning>
                        <span className="w-1.5 h-1.5 bg-gray-800 rounded-full"></span>
                        Arabic
                      </li>
                      <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-black rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-black rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </ul>
                  </div>
                </Draggable>
              </section>

              {/* Awards Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4" contentEditable suppressContentEditableWarning>Awards</h2>
                <Draggable nodeRef={ref1Ref}>
                  <div ref={ref1Ref} data-section-item className='relative group'>
                    <p className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>2019 | Salford & Co.</p>
                    <p className="text-sm text-gray-800 font-semibold" contentEditable suppressContentEditableWarning>The Best Employee of the Year</p>
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

              </section>
            </div>

            {/* Right Column */}
            <div className="col-span-2 space-y-8 ">
              {/* About Me Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4" contentEditable suppressContentEditableWarning>Experience</h2>

                <div className="space-y-6">
                  {/* Job 1 */}
                  <div className='group'>
                    <Draggable nodeRef={job1Ref}>
                      <div ref={job1Ref} data-section-item className='relative group' >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800" contentEditable suppressContentEditableWarning>Marketing Manager</h3>
                            <p className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>Acework Industries</p>
                          </div>
                          <span className="text-sm text-gray-500" contentEditable suppressContentEditableWarning>2020 - 2023</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec filus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque. Sed leo nisi, sollicitudin in arcu.
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

                  {/* Job 2 */}
                  <div className='group'>
                    <Draggable nodeRef={job2Ref}>
                      <div ref={job2Ref} data-section-item className='relative group'>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800" contentEditable suppressContentEditableWarning>Marketing Manager</h3>
                            <p className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>Salford & Co.</p>
                          </div>
                          <span className="text-sm text-gray-500" contentEditable suppressContentEditableWarning>2019 - 2020</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec filus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque. Sed leo nisi, sollicitudin in arcu.
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

                  {/* Job 3 */}
                  <div className='group'>
                    <Draggable nodeRef={job3Ref}>
                      <div ref={job3Ref} data-section-item className='relative group'>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-gray-800" contentEditable suppressContentEditableWarning>Marketing Manager</h3>
                            <p className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>Ginyard Commercial Co.</p>
                          </div>
                          <span className="text-sm text-gray-500" contentEditable suppressContentEditableWarning>2017 - 2019</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet sem nec filus egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque. Sed leo nisi, sollicitudin in arcu.
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
              </section>

              {/* Education Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4" contentEditable suppressContentEditableWarning>Education</h2>

                <div className="space-y-4 group">
                  <Draggable nodeRef={educationRef}>
                    <div ref={educationRef} data-section-item className='relative group'>
                      <div className="flex justify-between items-start pb-5">
                        <div>
                          <h3 className="font-bold text-gray-800" contentEditable suppressContentEditableWarning>Bachelor of Business Management</h3>
                          <p className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>Wardiere University</p>
                        </div>
                        <span className="text-sm text-gray-500" contentEditable suppressContentEditableWarning>2012-2016</span>
                      </div>

                      <div className="flex justify-between items-start ">
                        <div>
                          <h3 className="font-bold text-gray-800" contentEditable suppressContentEditableWarning>Bachelor of Business Management</h3>
                          <p className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>Wardiere University</p>
                        </div>
                        <span className="text-sm text-gray-500" contentEditable suppressContentEditableWarning>2016-2020</span>
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
              </section>

              {/* References Section */}
              <section>
                <h2 className="text-2xl font-bold text-gray-800 mb-4" contentEditable suppressContentEditableWarning>References</h2>
                <div className="grid grid-cols-2 gap-6 group">
                  <div>
                    <Draggable nodeRef={ref1Ref}>
                      <div ref={ref1Ref} data-section-item className='relative group'>
                        <h3 className="font-bold text-gray-800" contentEditable suppressContentEditableWarning>Harumi Kobayashi</h3>
                        <p className="text-sm text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                        <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning><strong>Phone:</strong> 123-456-7890</p>
                        <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning><strong>Email:</strong> hello@reallygreatsite.com</p>

                      </div>
                    </Draggable>
                  </div>
                  <div>
                    <Draggable nodeRef={ref2Ref}>
                      <div ref={ref2Ref}>
                        <h3 className="font-bold text-gray-800" contentEditable suppressContentEditableWarning>Harumi Kobayashi</h3>
                        <p className="text-sm text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                        <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning><strong>Phone:</strong> 123-456-7890</p>
                        <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning><strong>Email:</strong> hello@reallygreatsite.com</p>
                      </div>
                    </Draggable>
                  </div>
                </div>
              </section>
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
