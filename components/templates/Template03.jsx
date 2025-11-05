"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, User, GraduationCap, Briefcase, Award, Settings, Copy, Trash2, } from 'lucide-react';
import Draggable from "react-draggable";
import AISparkle from '../AISparkle';

export default function Template03() {

  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);

  const handleBulletListEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newLi = document.createElement('li');
      newLi.className = 'flex items-start gap-2';
      newLi.innerHTML = '<span class="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span><span class="text-xs text-gray-700"></span>';
      e.currentTarget.appendChild(newLi);
      const textSpan = newLi.querySelector('.text-xs');
      textSpan?.focus();
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
      const newLi = document.createElement('li');
      newLi.textContent = '';
      e.currentTarget.appendChild(newLi);
      newLi.focus();
    }
  };

  const handleSimpleListCleanup = (e) => {
    const lis = e.currentTarget.querySelectorAll('li');
    lis.forEach(li => {
      if (!li.textContent.trim()) li.remove();
    });
  };

  const duplicateSection = (e, ref) => {
    e.stopPropagation();
    const element = ref.current;
    if (element) {
      const clone = element.cloneNode(true);
      element.parentNode.insertBefore(clone, element.nextSibling);
    }
  };

  const deleteSection = (e, ref) => {
    e.stopPropagation();
    const element = ref.current;
    if (element) {
      element.remove();
    }
  };
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
              `<li class="flex items-start gap-2">
                 <span class="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                 <span class="text-xs text-gray-700">${skill.trim()}</span>
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

    const contactRef = useRef(null);
    const contactContentRef = useRef(null);
    const aboutRef = useRef(null);
    const aboutContentRef = useRef(null);
    const skillsRef = useRef(null);
    const skillsContentRef = useRef(null);
    const educationRef = useRef(null);
    const educationContentRef = useRef(null);
    const experienceRef = useRef(null);
    const experienceContentRef = useRef(null);

    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-hidden relative">
          <style dangerouslySetInnerHTML={{
            __html: `
            .clip-diagonal {
              clip-path: polygon(0 0, 100% 0, 60% 100%, 0 100%);
            }
          `
          }} />

          <div className="flex h-full">
            {/* Left Sidebar */}
            <div className="w-[35%] bg-white relative">
              {/* Blue diagonal corner */}
              <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-blue-400 to-blue-500 clip-diagonal"></div>

              <div className="relative z-10 p-8">
                {/* Profile Image */}
                <div className="mb-6">
                  <div className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-200">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <User size={60} className="text-gray-600" />
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div className="text-center mb-8">
                  <h1 className="text-4xl font-light text-blue-500 mb-1" contentEditable suppressContentEditableWarning>
                    Lorna
                  </h1>
                  <h1 className="text-4xl font-light text-blue-500 mb-3" contentEditable suppressContentEditableWarning>
                    Alvarado
                  </h1>
                  <p className="text-sm text-gray-600" contentEditable suppressContentEditableWarning>
                    Marketing Manager
                  </p>
                </div>

                {/* Contact Section */}
                <div className="mb-8">
                  <Draggable nodeRef={contactRef} >
                    <h2 ref={contactRef} className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Contact</h2>
                  </Draggable>
                  <Draggable nodeRef={contactContentRef} >
                    <div
                      ref={contactContentRef}
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
                        <Phone className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span
                          className="text-xs text-gray-700"
                          contentEditable
                          suppressContentEditableWarning
                        >+123-456-7890</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Mail className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span
                          className="text-xs text-gray-700 break-all"
                          contentEditable
                          suppressContentEditableWarning

                        >hello@reallygreatsite.com</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
                        <span
                          className="text-xs text-gray-700"
                          contentEditable
                          suppressContentEditableWarning
                        >123 Anywhere St., Any City</span>
                      </div>

                      <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const element = e.currentTarget.parentElement.parentElement;
                            const clone = element.cloneNode(true);
                            element.parentNode.insertBefore(clone, element.nextSibling);
                          }}
                          className="text-gray-600 rounded p-1.5 shadow-md"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => deleteSection(e, contactContentRef)}
                          className="text-gray-600 rounded p-1.5 shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Draggable>
                </div>

                {/* About Me Section */}
                <div className="mb-8 section-container group" data-section="profile">
                  <Draggable nodeRef={aboutRef} >
                    <div className="flex items-center  relative">
                      <h2 ref={aboutRef} className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        About Me
                      </h2>
                      <AISparkle section="Profile" onGenerate={handleAIGenerate} />
                    </div>
                  </Draggable>
                  <Draggable nodeRef={aboutContentRef}>
                    <div ref={aboutContentRef} className="relative group">
                      <div>
                        <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const element = e.currentTarget.parentElement.parentElement;
                              const clone = element.cloneNode(true);
                              element.parentNode.insertBefore(clone, element.nextSibling);
                            }}
                            className="text-gray-600 rounded p-1.5 shadow-md"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => deleteSection(e, aboutContentRef)}
                            className="text-gray-600 rounded p-1.5 shadow-md"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed text-justify" contentEditable suppressContentEditableWarning>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      </div>
                    </div>
                  </Draggable>
                </div>

                {/* Skills Section */}
                <div className="mb-6 section-container" data-section="skills">
                  <Draggable nodeRef={skillsRef} >
                    <div className="flex items-center  relative">
                      <h2 ref={skillsRef} className="text-sm font-bold text-gray-700  flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Skills
                      </h2>
                      <AISparkle section="skills" onGenerate={handleAIGenerate} className='lg:ml-32' />
                    </div>
                  </Draggable>

                  <Draggable nodeRef={skillsContentRef} >
                    <ul
                      ref={skillsContentRef}
                      className="space-y-1.5 relative group"
                      contentEditable
                      suppressContentEditableWarning
                      onKeyDown={handleBulletListEnter}
                      onInput={handleBulletListCleanup}
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
                      <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const element = e.currentTarget.parentElement.parentElement;
                            const clone = element.cloneNode(true);
                            element.parentNode.insertBefore(clone, element.nextSibling);
                          }}
                          className="text-gray-600 rounded p-1.5 shadow-md"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => deleteSection(e, skillsContentRef)}
                          className="text-gray-600 rounded p-1.5 shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </ul>
                  </Draggable>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="w-[65%] bg-white p-8 overflow-y-auto">
              {/* Education Section */}
              <div className="mb-8">
                <Draggable nodeRef={educationRef}>
                  <div className="flex items-center gap-2 mb-2 relative">
                    <h2 ref={educationRef} className="text-sm font-bold text-gray-800  uppercase tracking-wide" contentEditable suppressContentEditableWarning>Education</h2>
                    <GraduationCap className="w-5 h-5 text-gray-600" />
                  </div>
                </Draggable>

                <div className="space-y-4">
                  {/* Education 1 */}
                  <Draggable nodeRef={educationContentRef}>
                    <div
                      ref={educationContentRef}
                      className="flex gap-3 group relative  mb-3"
                    >
                      {/* buttons */}
                      <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const element = e.currentTarget.parentElement.parentElement;
                            const clone = element.cloneNode(true);
                            element.parentNode.insertBefore(clone, element.nextSibling);
                          }}
                          className="text-gray-600 rounded p-1.5 shadow-md"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => deleteSection(e, educationContentRef)}
                          className="text-gray-600 rounded p-1.5 shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* dot */}
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
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
                  </Draggable>

                  {/* Education 2 */}
                   <Draggable nodeRef={educationContentRef}>
                    <div
                      ref={educationContentRef}
                      className="flex gap-3 group relative  mb-3"
                    >
                      {/* buttons */}
                      <div className="absolute -right-0 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const element = e.currentTarget.parentElement.parentElement;
                            const clone = element.cloneNode(true);
                            element.parentNode.insertBefore(clone, element.nextSibling);
                          }}
                          className="text-gray-600 rounded p-1.5 shadow-md"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => deleteSection(e, educationContentRef)}
                          className="text-gray-600 rounded p-1.5 shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* dot */}
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
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
                  </Draggable>
                </div>
              </div>

              {/* Experience Section */}
              <div className="mb-8">
                <h2 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  Experience
                </h2>
                <Draggable nodeRef={educationRef}>
                  <div className="flex items-center gap-2 mb-2 relative">
                    <h2 ref={educationRef} className="text-sm font-bold text-gray-800  uppercase tracking-wide" contentEditable suppressContentEditableWarning>Education</h2>
                    <GraduationCap className="w-5 h-5 text-gray-600" />
                  </div>
                </Draggable>
                <div className="space-y-4">
                  {/* Job 1 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Product Design Manager</h3>
                          <p className="text-xs text-gray-600 italic" contentEditable suppressContentEditableWarning>Anowaal Industries</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2018 - 2020</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.
                      </p>
                    </div>
                  </div>

                  {/* Job 2 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Marketing Manager</h3>
                          <p className="text-xs text-gray-600 italic" contentEditable suppressContentEditableWarning>Anowaal Industries</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2018 - 2020</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.
                      </p>
                    </div>
                  </div>

                  {/* Job 3 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Marketing Manager</h3>
                          <p className="text-xs text-gray-600 italic" contentEditable suppressContentEditableWarning>Anowaal Industries</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2017 - 2018</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.
                      </p>
                    </div>
                  </div>

                  {/* Job 4 */}
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Marketing Manager</h3>
                          <p className="text-xs text-gray-600 italic" contentEditable suppressContentEditableWarning>Anowaal Industries</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2016 - 2017</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et ipsum nunc egestas accumsan. In enim nunc, tincidunt ut quam eget, luctus sollicitudin neque.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* References Section */}
              <div>
                <h2 className="text-base font-bold text-gray-700 mb-4 pb-2 border-b-2 border-gray-300 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gray-600" />
                  References
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  {/* Reference 1 */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5" contentEditable suppressContentEditableWarning>Harumi Kobayashi</h3>
                    <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Phone:</span> <span contentEditable suppressContentEditableWarning>123-456-7890</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Email:</span> <span contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                    </p>
                  </div>

                  {/* Reference 2 */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-0.5" contentEditable suppressContentEditableWarning>Bailey Dupont</h3>
                    <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Phone:</span> <span contentEditable suppressContentEditableWarning>123-456-7890</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Email:</span> <span contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                    </p>
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
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef}>
          <CVPage />
        </div>
      </div>
    </div>
  );
}
