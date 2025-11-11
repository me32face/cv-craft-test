'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, CopyPlus, Trash2, Globe } from 'lucide-react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function Template08() {

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



  const CVPage = () => {
    const profileRef = useRef(null);
    const expertiseRef = useRef(null);
    const contactRef = useRef(null);
    const skillsRef = useRef(null);
    const educationRef = useRef(null);
    const languageRef = useRef(null);
    const job1Ref = useRef(null);
    const job2Ref = useRef(null);
    const job3Ref = useRef(null);
    const ref1Ref = useRef(null);
    const ref2Ref = useRef(null);

    return (
 <div className="min-h-screen bg-gray-50  flex justify-center items-center" onClick={handleButtonClick}>
        <div className="w-[210mm]  bg-white shadow-2xl overflow-hidden relative">
                 <div className="flex min-h-screen ">
          {/* Left Sidebar - Beige */}
          <div className="w-2/5 bg-amber-50 p-10">
            {/* Name Header */}

            <div className="mb-10 ">
              <h1 className="text-4xl font-bold text-amber-900 leading-tight" contentEditable suppressContentEditableWarning>
                RICHARD <br /><span className="font-semibold pl-14" contentEditable suppressContentEditableWarning>SUJITH</span>
              </h1>
              <p className="text-sm text-amber-800 mt-2 tracking-wide" contentEditable suppressContentEditableWarning>Data Analyst</p>
            </div>

            {/* Contact Section */}
            <div className="mb-10 group space-y-3 text-xs text-amber-900" >
              <h2 className="text-xl font-bold mb-4 pb-2">Contact</h2>
              <Draggable nodeRef={contactRef}>
                <div ref={contactRef} data-section-item className="space-y-3 relative group" >
                  <div className="flex items-start gap-2">
                    <Phone size={14} className="mt-0.5 flex-shrink-0 text-amber-900" />
                    <span contentEditable suppressContentEditableWarning>+123 - 456 - 7890</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail size={14} className="mt-0.5 flex-shrink-0 text-amber-900" />
                    <span contentEditable suppressContentEditableWarning className="break-all">hello@reallygreatsite.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0 text-amber-900" />
                    <span contentEditable suppressContentEditableWarning>123 Anywhere St., Any City</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Globe size={14} className="mt-0.5 flex-shrink-0 text-amber-900" />
                    <span contentEditable suppressContentEditableWarning className="break-all">www.reallygreatsite.com</span>
                  </div>
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-amber-900 rounded p-1.5 shadow-md">
                      <CopyPlus className="w-4 h-4" />
                    </button>
                    <button data-action="delete" className="text-amber-900 rounded p-1.5 shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Draggable>
            </div>

            {/* Skills Section */}
            <div className="mb-6 section-container" data-section="skills">
                <div className="relative flex gap-2  group">
                  <Draggable nodeRef={skillsRef}>
                    <h2 ref={skillsRef} className="text-2xl font-bold text-amber-900 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Skills</h2>
                  </Draggable>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity ">
                    <AISparkle className='mt-1' section="Skills" onGenerate={handleAIGenerate} />
                  </div>
                </div>
                <ul className="space-y-1.5 text-amber-900" onKeyDown={(e) => {
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
                      <button data-action="duplicate" className="text-amber-900 rounded p-1 shadow-md">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="text-amber-900 rounded p-1 shadow-md">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                  <li className="text-xs flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Public Relations</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-amber-900 rounded p-1 shadow-md">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="text-amber-900 rounded p-1 shadow-md">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                  <li className="text-xs flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Teamwork</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-amber-900 rounded p-1 shadow-md">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="text-amber-900 rounded p-1 shadow-md">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                  <li className="text-xs flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Time Management</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-amber-900 rounded p-1 shadow-md">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="text-amber-900 rounded p-1 shadow-md">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                  <li className="text-xs flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Leadership</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-amber-900 rounded p-1 shadow-md">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="text-amber-900 rounded p-1 shadow-md">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                  <li className="text-xs flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Effective Communication</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-amber-900 rounded p-1 shadow-md">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="text-amber-900 rounded p-1 shadow-md">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                  <li className="text-xs flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Critical Thinking</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-amber-900 rounded p-1 shadow-md">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="text-amber-900 rounded p-1 shadow-md">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                  <li className="text-xs flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Digital Marketing</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-amber-900 rounded p-1 shadow-md">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="text-amber-900 rounded p-1 shadow-md">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                </ul>
              </div>

            {/* Language Section */}
            <div className="mb-10">
              <h3 className="text-lg font-bold text-amber-900 mb-4 tracking-wide" contentEditable suppressContentEditableWarning>LANGUAGE</h3>
              <Draggable nodeRef={languageRef}>
                <ul
                  ref={languageRef}
                  data-section-item
                  className="relative list-disc list-inside marker:text-amber-700 space-y-2 text-xs text-amber-900 group "
                  contentEditable
                  suppressContentEditableWarning
                >
                  <li>Hindi</li>
                  <li>Marathi</li>
                  <li>English</li>

                  {/* hover buttons */}
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-amber-700 rounded p-1.5 shadow-md">
                      <CopyPlus className="w-4 h-4" />
                    </button>
                    <button data-action="delete" className="text-amber-700 rounded p-1.5 shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </ul>
              </Draggable>
            </div>

            {/* education Section */}
            <div>
              <h3 className="text-lg font-bold text-amber-900 mb-4 tracking-wide"
                contentEditable suppressContentEditableWarning>EDUCATION</h3>
              <Draggable nodeRef={educationRef}>
                <ul ref={educationRef} data-section-item className="list-disc list-inside marker:text-amber-700 space-y-3 text-xs text-amber-900 group relative"
                  contentEditable suppressContentEditableWarning >
                  <li>
                    <p className="font-semibold">Innovation in Data</p>
                    <p className="ml-4 mt-1">Analytics Award</p>
                    <p className="ml-4 text-amber-700">(2023)</p>
                  </li>

                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-amber-700 rounded p-1.5 shadow-md">
                      <CopyPlus className="w-4 h-4" />
                    </button>
                    <button data-action="delete" className="text-amber-700 rounded p-1.5 shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </ul>
              </Draggable>
            </div>
          </div>

          {/* Right Content - Light Beige/Cream */}
          <div className="w-3/5 bg-stone-100 p-10">
            {/* About Me Section */}
            <div className="mb-5 section-container relative group" data-section="profile">
                <div className="flex items-center gap-2 mb-2 relative">
                  <h2
                    contentEditable
                    suppressContentEditableWarning
                    className="text-2xl font-bold text-amber-900 uppercase tracking-wide"
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
                        className="text-xs text-amber-900 leading-relaxed"
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
                        className="text-amber-700 bg-white rounded p-1 shadow-md hover:scale-110 transition-transform"
                      >
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button
                        data-action="delete"
                        className="text-amber-700 bg-white rounded p-1 shadow-md hover:scale-110 transition-transform"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </Draggable>
              </div>

            {/* Education Section */}
            <div className='bg-amber-50 p-5'>
              <div className="mb-8 ">
                <h3 className="text-lg font-bold text-amber-900 mb-3 tracking-wide" contentEditable suppressContentEditableWarning> EXPERIENCE</h3>
                <div className="w-full h-px bg-amber-900 mb-4"></div>

                <div className="space-y-4 ">
                  {/* Education 1 */}
                  <Draggable nodeRef={job1Ref} >
                    <div ref={job1Ref} data-section-item className='relative group '>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-amber-900 text-sm" contentEditable suppressContentEditableWarning>Master of IT Management</h4>
                        <span className="text-xs text-amber-800" contentEditable suppressContentEditableWarning>2021 - 2023</span>
                      </div>
                      <p className="text-xs text-amber-800 italic mb-1" contentEditable suppressContentEditableWarning>Wardiere University</p>
                      <p className="text-xs text-amber-900 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute
                        irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla. Hendrerit id quam augis, facilisis sollicitudin metus.
                      </p>
                      <div className="absolute -right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-amber-700 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-amber-700 rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Draggable  >


                  {/* Education 2 */}
                  <Draggable nodeRef={job2Ref}>
                    <div ref={job2Ref} data-section-item className='relative group '>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-amber-900 text-sm" contentEditable suppressContentEditableWarning>Bachelor of IT Management</h4>
                        <span className="text-xs text-amber-800" contentEditable suppressContentEditableWarning>2016 - 2020</span>
                      </div>
                      <p className="text-xs text-amber-800 italic mb-1" contentEditable suppressContentEditableWarning>Wardiere University</p>
                      <p className="text-xs text-amber-900 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute
                        irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla. Hendrerit id quam augis, facilisis sollicitudin metus.
                      </p>
                      <div className="absolute -right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-amber-700 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-amber-700 rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Draggable>

                  {/* Education 3 */}
                  <Draggable nodeRef={job3Ref}>
                    <div ref={job3Ref} data-section-item className='relative group '>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-amber-900 text-sm" contentEditable suppressContentEditableWarning>Master Of Science</h4>
                        <span className="text-xs text-amber-800" contentEditable suppressContentEditableWarning>2012 - 2016</span>
                      </div>
                      <p className="text-xs text-amber-800 italic mb-1" contentEditable suppressContentEditableWarning>Wardiere University</p>
                      <p className="text-xs text-amber-900 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute
                        irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla. Hendrerit id quam augis, facilisis sollicitudin metus.
                      </p>
                      <div className="absolute -right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-amber-700 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-amber-700 rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Draggable>
                </div>
              </div>

              {/* Experience Section */}
              <div className="mb-8  relative group  ">
                <h3 className="text-lg font-bold text-amber-900 mb-3 tracking-wide" contentEditable suppressContentEditableWarning>EDUCATION</h3>
                <div className="w-full h-px bg-amber-900 mb-4"></div>
                <Draggable nodeRef={expertiseRef}>
                  <div ref={expertiseRef} data-section-item>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h4 className="font-bold text-amber-900 text-sm" contentEditable suppressContentEditableWarning>Data Analyst</h4>
                        <p className="text-xs text-amber-800 italic" contentEditable suppressContentEditableWarning>Wardiere Inc.</p>
                      </div>
                      <span className="text-xs text-amber-800 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>2020 - 2025</span>
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed mt-2" contentEditable suppressContentEditableWarning>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                      eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                      minim veniam quis nostrud. Exercitation ullamco laboris nisi. Duis aute
                      irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                      fugiat nulla pariatur.
                    </p>
                    <div className="absolute -right-2 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-amber-700 rounded p-1.5 shadow-md">
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button data-action="delete" className="text-amber-700 rounded p-1.5 shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Draggable>
              </div>

              {/* References Section */}
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-3 tracking-wide" contentEditable suppressContentEditableWarning>REFERENCES</h3>
                <div className="w-full h-px bg-amber-900 mb-4"></div>

                <div className="grid grid-cols-2 gap-6 ">
                  {/* Reference 1 */}
                  <Draggable nodeRef={ref1Ref}>
                    <div ref={ref1Ref} data-section-item className="text-xs relative group" contentEditable suppressContentEditableWarning>
                      <h4 className="font-bold text-amber-900 text-sm mb-1">Fatma Hasan</h4>
                      <p className="text-amber-800 mb-2">Wardiere Inc. / CTO</p>
                      <div className="text-amber-900 space-y-0.5">
                        <p><span className="font-semibold">Phone:</span><br />+31 - 456 - 7890</p>
                        <p><span className="font-semibold">Email:</span> hello@reallygreatsite.com</p>
                      </div>
                      <div className="absolute -right-4 -top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-amber-700 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-amber-700 rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Draggable>

                  {/* Reference 2 */}
                  <Draggable nodeRef={ref2Ref}>
                    <div ref={ref2Ref} data-section-item className="text-xs relative group" contentEditable suppressContentEditableWarning>
                      <h4 className="font-bold text-amber-900 text-sm mb-1">Ronan Olandiwar</h4>
                      <p className="text-amber-800 mb-2">Wardiere Inc. / CEO</p>
                      <div className="text-amber-900 space-y-0.5">
                        <p><span className="font-semibold">Phone:</span><br /> +123 - 456 - 7890</p>
                        <p><span className="font-semibold">Email:</span> hello@reallygreatsite.com</p>
                      </div><div className="absolute -right-4 -top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-amber-700 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-amber-700 rounded p-1.5 shadow-md">
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