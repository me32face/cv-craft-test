"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, CopyPlus, Trash2, } from 'lucide-react';
import Draggable from "react-draggable";
import AISparkle from '../AISparkle';
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import { usePDF } from '../../contexts/PDFContext';
import jsPDF from 'jspdf';
import { geminiService } from '../../lib/gemini';
import html2canvas from 'html2canvas';


export default function Template03() {
  const [profileImage, setProfileImage] = useState(null);
  const { saveState } = useUndoRedo();
  const [contentState, setContentState] = useState({});
  const { registerPDFFunction } = usePDF();

  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);

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
  const handleBulletListEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selection = window.getSelection();
      let currentLi = selection.anchorNode;

      while (currentLi && currentLi.tagName !== 'LI') {
        currentLi = currentLi.parentElement;
      }

      if (currentLi) {
        const newLi = document.createElement('li');
        newLi.className = 'flex items-start gap-2';
        newLi.innerHTML = '<span class="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span><span class="text-xs text-gray-700">\u200B</span>';
        currentLi.parentNode.insertBefore(newLi, currentLi.nextSibling);

        const textSpan = newLi.querySelector('.text-xs');
        const range = document.createRange();
        range.setStart(textSpan.firstChild, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };

  const handleBulletListCleanup = (e) => {
    const lis = e.currentTarget.querySelectorAll('li');
    lis.forEach(li => {
      if (!li.textContent.trim()) li.remove();
    });
  };

  const handleSimpleListEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const selection = window.getSelection();
      let currentLi = selection.anchorNode;

      while (currentLi && currentLi.tagName !== 'LI') {
        currentLi = currentLi.parentElement;
      }

      if (currentLi) {
        const newLi = document.createElement('li');
        newLi.textContent = '\u200B';
        currentLi.parentNode.insertBefore(newLi, currentLi.nextSibling);

        const range = document.createRange();
        range.setStart(newLi.firstChild, 1);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  };



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


  // Save state with debounce for content changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState({ profileImage, contentState });
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [contentState, profileImage, saveState]);

  // Handle undo/redo events from Header
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

  // Save initial state only once
  useEffect(() => {
    saveState({ profileImage: null, contentState: {} });
  }, []);




  const CVPage = () => {

    return (
      <div className="min-h-screen bg-gray-50  flex justify-center items-center" onClick={handleButtonClick}>
        <div className="w-[210mm] h-[297mm]   bg-white shadow-2xl overflow-hidden relative">
          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-[35%] bg-white relative">
              {/* Blue diagonal corner */}
              {/* SVG fallback for PDF */}
              <svg
                className="absolute top-0 left-0 w-full h-52"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                <polygon
                  points="0,0 100,0 50,100 0,100"
                  className="fill-blue-500"
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-52  clip-diagonal"></div>

              <div className="relative z-10 p-8">
                {/* Profile Image */}
                <div className="mb-6">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200"
                    onClick={() => document.getElementById('profileImageInput').click()}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-300 flex items-center justify-center">
                        UPLOAD IMG
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

                {/* Name */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-semibold text-blue-500 mb-1" contentEditable suppressContentEditableWarning>
                    Lorna
                  </h1>
                  <h1 className="text-4xl font-semibold text-blue-500 mb-3" contentEditable suppressContentEditableWarning>
                    Alvarado
                  </h1>
                  <p className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>
                    Marketing Manager
                  </p>
                </div>

                {/* Contact Section */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Contact</h3>
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

                {/* About Me Section */}
                <div className="mb-5 section-container relative group" data-section="profile">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <h2
                      contentEditable
                      suppressContentEditableWarning
                      className="text-xl font-bold text-gray-800 uppercase tracking-wide"
                    >
                      Profile
                    </h2>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <AISparkle section="Profile" onGenerate={handleAIGenerate} />
                    </div>
                  </div>

                  <div className="relative group">
                    <div className="w-64">
                      <p
                        id="profile-text"
                        className="text-sm text-gray-700 leading-relaxed"
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
                </div>
                {/* Skills Section */}
                <div className="mb-6 section-container" data-section="skills">
                  <div className="relative flex gap-2  group">
                      <h3  className="text-xl font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Skills</h3>
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
              </div>
            </div>

            {/* Right Content */}
            <div className="w-[65%] bg-white p-8 overflow-y-auto">
              {/* Education Section */}
              <div className="mb-8">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <h2  className="text-xl font-bold text-gray-800  uppercase tracking-wide" contentEditable suppressContentEditableWarning>Education</h2>
                  </div>

                <div className="space-y-4">
                  {/* Education 1 */}
                    <div
                      className="flex gap-3 group relative  mb-3"
                    >
                      {/* buttons */}
                      <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* dot */}
                      <div className="flex-shrink-0">
                        <span className="text-3xl  text-blue-500">•</span>
                      </div>

                      {/* content */}
                      <div>
                        <div className="flex justify-between items-start mb-1">

                          <div>
                            <h3
                              className="text-sm font-semibold text-gray-800"
                              contentEditable
                              suppressContentEditableWarning
                            >
                              Bachelor of Business Management
                            </h3>
                            <p
                              className="text-xs text-gray-600"
                              contentEditable
                              suppressContentEditableWarning
                            >
                              Borcelle University
                            </p>
                          </div>

                          <span
                            className="text-xs text-gray-500 whitespace-nowrap"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            2018 - 2022
                          </span>
                        </div>

                        <p
                          className="text-xs text-gray-600 leading-relaxed"
                          contentEditable
                          suppressContentEditableWarning
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et
                          ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget,
                          luctus sollicitudin neque. Sed leo nisl, semper ac hendrerit a
                          sollicitudin in arcu.
                        </p>
                      </div>
                    </div>

                  {/* Education 2 */}
                    <div
                      className="flex gap-3 group relative  mb-3"
                    >
                      {/* buttons */}
                      <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                          <CopyPlus className="w-4 h-4" />
                        </button>
                        <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* dot */}
                      <div className="flex-shrink-0">
                        <span className="text-3xl  text-blue-500">•</span>
                      </div>

                      {/* content */}
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h3
                              className="text-sm font-semibold text-gray-800"
                              contentEditable
                              suppressContentEditableWarning
                            >
                              Bachelor of Business Management
                            </h3>
                            <p
                              className="text-xs text-gray-600"
                              contentEditable
                              suppressContentEditableWarning
                            >
                              Borcelle University
                            </p>
                          </div>

                          <span
                            className="text-xs text-gray-500 whitespace-nowrap"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            2018 - 2020
                          </span>
                        </div>

                        <p
                          className="text-xs text-gray-600 leading-relaxed"
                          contentEditable
                          suppressContentEditableWarning
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et
                          ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget,
                          luctus sollicitudin neque. Sed leo nisl, semper ac hendrerit a
                          sollicitudin in arcu.
                        </p>
                      </div>
                    </div>
                </div>
              </div>

              {/* Experience Section */}
              <div className="mb-8">
                <div className='border-b-2 border-gray-300'>
                    <div className="flex items-center  relative">
                      <h2  className="text-xl font-bold text-gray-700 mb-2 pb-2  flex items-center gap-2">
                        Experience
                      </h2>
                    </div>
                </div>
                <div className="space-y-4">
                  {/* Job 1 */}

                  <div className="relative group">
                      <div
                        className="flex gap-3 relative bg-white rounded-md p-2"
                      >
                        <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 🔵 dot */}
                        <div className="flex-shrink-0 relative">
                          <span className="text-3xl  text-blue-500">•</span>
                        </div>

                        {/* 📄 content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3
                                className="text-sm font-semibold text-gray-800"
                                contentEditable
                                suppressContentEditableWarning
                              >
                                Marketing Manager
                              </h3>
                              <p
                                className="text-xs text-gray-600 italic"
                                contentEditable
                                suppressContentEditableWarning
                              >
                                Anowaal Industries
                              </p>
                            </div>
                            <span
                              className="text-xs text-gray-500 whitespace-nowrap"
                              contentEditable
                              suppressContentEditableWarning
                            >
                              2018 - 2020
                            </span>
                          </div>
                          <p
                            className="text-xs text-gray-600 leading-relaxed"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et
                            ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget,
                            luctus sollicitudin neque.
                          </p>
                        </div>
                      </div>
                  </div>

                  {/* Job 2 */}

                  <div className="relative group">
                      <div
                        className="flex gap-3 relative bg-white rounded-md p-2"
                      >
                        <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 🔵 dot */}
                        <div className="flex-shrink-0 relative">
                          <span className="text-3xl  text-blue-500">•</span>
                        </div>

                        {/* 📄 content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3
                                className="text-sm font-semibold text-gray-800"
                                contentEditable
                                suppressContentEditableWarning
                              >
                                Marketing Manager
                              </h3>
                              <p
                                className="text-xs text-gray-600 italic"
                                contentEditable
                                suppressContentEditableWarning
                              >
                                Anowaal Industries
                              </p>
                            </div>
                            <span
                              className="text-xs text-gray-500 whitespace-nowrap"
                              contentEditable
                              suppressContentEditableWarning
                            >
                              2018 - 2020
                            </span>
                          </div>
                          <p
                            className="text-xs text-gray-600 leading-relaxed"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et
                            ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget,
                            luctus sollicitudin neque.
                          </p>
                        </div>
                      </div>
                  </div>

                  {/* Job 3 */}
                  <div className="relative group">
                      <div
                        className="flex gap-3 relative bg-white rounded-md p-2"
                      >
                        <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 🔵 dot */}
                        <div className="flex-shrink-0 relative">
                          <span className="text-3xl  text-blue-500">•</span>
                        </div>

                        {/* 📄 content */}
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3
                                className="text-sm font-semibold text-gray-800"
                                contentEditable
                                suppressContentEditableWarning
                              >
                                Marketing Manager
                              </h3>
                              <p
                                className="text-xs text-gray-600 italic"
                                contentEditable
                                suppressContentEditableWarning
                              >
                                Anowaal Industries
                              </p>
                            </div>
                            <span
                              className="text-xs text-gray-500 whitespace-nowrap"
                              contentEditable
                              suppressContentEditableWarning
                            >
                              2018 - 2020
                            </span>
                          </div>
                          <p
                            className="text-xs text-gray-600 leading-relaxed"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et
                            ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget,
                            luctus sollicitudin neque.
                          </p>
                        </div>
                      </div>
                  </div>

                  {/* Job 4 */}
                  <div className="relative group">
                      <div
                        className="flex gap-3 relative bg-white rounded-md p-2"
                      >
                        <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex-shrink-0 relative">
                          <span className="text-3xl  text-blue-500">•</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              <h3
                                className="text-sm font-semibold text-gray-800"
                                contentEditable
                                suppressContentEditableWarning
                              >
                                Marketing Manager
                              </h3>
                              <p
                                className="text-xs text-gray-600 italic"
                                contentEditable
                                suppressContentEditableWarning
                              >
                                Anowaal Industries
                              </p>
                            </div>
                            <span
                              className="text-xs text-gray-500 whitespace-nowrap"
                              contentEditable
                              suppressContentEditableWarning
                            >
                              2018 - 2020
                            </span>
                          </div>
                          <p
                            className="text-xs text-gray-600 leading-relaxed"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et
                            ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget,
                            luctus sollicitudin neque.
                          </p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>

              {/* References Section */}
              <div>

                <div className='border-b-2 border-gray-300'>
                    <div className="flex items-center  relative">
                      <h2  className="text-xl font-bold text-gray-700 mb-2 pb-2  flex items-center gap-2">
                        References
                      </h2>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Reference 1 */}
                  <div className="relative group">
                      <div
                        className="relative bg-white rounded-md p-3 shadow-sm"
                      ><div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <h3
                            className="text-sm font-semibold text-gray-800 mb-0.5"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Harumi Kobayashi
                          </h3>
                          <p
                            className="text-xs text-gray-600 mb-2"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Wardiere Inc. / CEO
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold">Phone:</span>{" "}
                            <span contentEditable suppressContentEditableWarning>
                              123-456-7890
                            </span>
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold">Email:</span>{" "}
                            <span contentEditable suppressContentEditableWarning>
                              hello@reallygreatsite.com
                            </span>
                          </p>
                        </div>
                      </div>
                  </div>

                  {/* Reference 2 */}
                  <div className="relative group">
                      <div
                        className="relative bg-white rounded-md p-3 shadow-sm"
                      ><div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div>
                          <h3
                            className="text-sm font-semibold text-gray-800 mb-0.5"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Bailey Dupont
                          </h3>
                          <p
                            className="text-xs text-gray-600 mb-2"
                            contentEditable
                            suppressContentEditableWarning
                          >
                            Wardiere Inc. / CEO
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold">Phone:</span>{" "}
                            <span contentEditable suppressContentEditableWarning>
                              123-456-7890
                            </span>
                          </p>
                          <p className="text-xs text-gray-600">
                            <span className="font-semibold">Email:</span>{" "}
                            <span contentEditable suppressContentEditableWarning>
                              hello@reallygreatsite.com
                            </span>
                          </p>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
