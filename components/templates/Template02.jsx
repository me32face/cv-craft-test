import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Globe, Briefcase, CopyPlus, Trash2, GraduationCap } from 'lucide-react';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';
import Draggable from "react-draggable";
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';
import html2canvas from 'html2canvas';

export default function Template02() {

  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);
  const { registerPDFFunction } = usePDF();

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

  const handleSimpleListCleanup = (e) => {
    const lis = e.currentTarget.querySelectorAll('li');
    lis.forEach(li => {
      if (!li.textContent.trim()) li.remove();
    });
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
  const downloadPDF = useCallback(async () => {
    const cvElement = cvRef.current;

    if (!cvElement) {
      console.error("No CV page found to download.");
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

      pdf.save("RICHARD_SANCHEZ_CV.pdf");

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      // Restore original scale
      parentContainer.style.transform = oldTransform;
      parentContainer.style.transition = oldTransition;
    }
  }, []);

  const CVPage = () => {
    const skillsRef = useRef(null);
    const skillsContentRef = useRef(null);
    const workExpRef = useRef(null);
    const workExpSrtRef = useRef(null);
    const contactRef = useRef(null);
    const job1Ref = useRef(null);
    const job2Ref = useRef(null);
    const job3Ref = useRef(null);
    const languagesRef = useRef(null);
    const profileRef = useRef(null)
    const educationsRef = useRef(null);
    const contactContentRef = useRef(null);
    const languagesContentRef = useRef(null);
    const profileContentRef = useRef(null);


    return (
      <div className="min-h-screen bg-gray-50   flex justify-center items-start" onClick={handleButtonClick}>
        <div className="w-[210mm] min-h-[297mm] bg-white shadow-2xl overflow-hidden">
          <div className="p-8 flex flex-col">
            {/* Header */}
            <div className="text-center mb-6 pb-6 border-b border-gray-300 relative">
              {/* Large decorative initial */}

              <div className="relative z-10 pt-8">
                <h1 className="text-4xl font-light tracking-widest text-gray-800 mb-1" contentEditable suppressContentEditableWarning>
                  OLIVIA WILSON
                </h1>
                <p className="text-xs tracking-widest text-gray-600 uppercase" contentEditable suppressContentEditableWarning>
                  Marketing Manager
                </p>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="flex gap-6 flex-1">
              {/* Left Column */}
              <div className="w-[38%] space-y-6">
                {/* Contact */}
                <div className="mb-6">
                  <Draggable nodeRef={contactRef} >
                    <h3 ref={contactRef} className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Contact</h3>
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
                      <div className="flex items-start gap-2">
                        <Globe className="w-3 h-3 text-gray-600 mt-0.5 flex-shrink-0" />
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
                  </Draggable>
                </div>

                {/* Education Section */}
                <Draggable nodeRef={educationsRef} bounds={false}>
                  <div ref={educationsRef} className='mt-8 ' >
                    <div className="flex items-center gap-2 mb-2 ">
                      <h2 contentEditable suppressContentEditableWarning className="text-sm font-bold text-gray-800 uppercase tracking-wide">Education</h2>
                    </div>

                    <div className=" space-y-3">
                      {/* Degree 1 */}
                      <div className="relative group">
                        <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex justify-between items-start mb-0.5">
                          <div>
                            <h3 className="text-sm  text-gray-800" contentEditable suppressContentEditableWarning>Master of Business Management</h3>
                            <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>School of business | Wardiere University</p>
                            <p className="text-xs text-gray-500" contentEditable suppressContentEditableWarning>GPA: 3.8 / 4.0</p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning>2029 - 2031</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </Draggable>
                {/* Skills */}
                <div className="mb-6 section-container group" data-section="skills">
                  <Draggable nodeRef={skillsRef} >
                    <div className="flex items-center  gap-2 mb-2 relative">
                      <h2 ref={skillsRef} contentEditable suppressContentEditableWarning className="text-sm font-bold text-gray-800 uppercase tracking-wide">Skills</h2>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <AISparkle className='mt-1' section="Skills" onGenerate={handleAIGenerate} />
                      </div>            
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

                {/* Languages */}
                <div className="mb-6">
                  <Draggable nodeRef={languagesRef}>
                    <h3 ref={languagesRef} className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Languages</h3>
                  </Draggable>
                  <Draggable nodeRef={languagesContentRef} >
                    <ul
                      ref={languagesContentRef}
                      className="space-y-1.5 relative group"
                      contentEditable
                      suppressContentEditableWarning
                      onKeyDown={handleBulletListEnter}
                      onInput={handleBulletListCleanup}
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
                      <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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

              {/* Right Column */}
              <div className="w-[62%] space-y-5">
                {/* Profile Summary */}
                <div className="mb-5 section-container group" data-section="profile">

                  <Draggable nodeRef={profileRef}>
                    <div className="flex items-center  gap-2 mb-2 relative">
                      <h2 ref={profileRef} contentEditable suppressContentEditableWarning className="text-sm font-bold text-gray-800 uppercase tracking-wide">Profile</h2>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <AISparkle className='mt-1' section="Skills" onGenerate={handleAIGenerate} />
                      </div>            
                    </div>
                  </Draggable>

                  <Draggable nodeRef={profileContentRef}>
                    <div ref={profileContentRef} className="relative group">
                      <div>
                        <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p
                          className="text-xs text-gray-700 leading-relaxed text-justify"
                          contentEditable
                          suppressContentEditableWarning
                        >
                          Dynamic marketing professional with a proven track record in
                          developing and executing successful marketing strategies. I am
                          seeking a challenging role where I can contribute my skills in
                          strategic planning, team leadership, and creative problem-solving
                          to achieve business objectives.
                        </p>
                      </div>
                    </div>
                  </Draggable>
                </div>


                {/* Work Experience */}
                <div className="pt-4 section-container" data-section="work-experience">
                  <Draggable nodeRef={workExpRef} >
                    <div ref={workExpRef} className="flex items-center gap-2 mb-2 relative">
                      <h2 contentEditable suppressContentEditableWarning className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Work Experience</h2>
                      {/* <AISparkle section="Work Experience" onGenerate={handleAIGenerate} /> */}
                    </div>
                  </Draggable>
                  <Draggable nodeRef={workExpSrtRef}>
                    <div
                      ref={workExpSrtRef}
                      className="flex justify-between items-start gap-2 relative"
                    >
                      <div className="flex flex-col mb-1">
                        <h3
                          contentEditable
                          suppressContentEditableWarning
                          className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wider"
                        >
                          Borcelle Studio
                        </h3>

                        <p className="text-sm">Marketing Manager & Specialist</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning > 2029 - 2031 </span>
                    </div>
                  </Draggable>


                  <div className=" space-y-4">
                    {/* Job 1 */}
                    <Draggable nodeRef={job1Ref} >
                      <div ref={job1Ref} className="relative group">
                        <ul
                          className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1"
                          contentEditable
                          suppressContentEditableWarning
                          onKeyDown={handleSimpleListEnter}
                          onInput={handleSimpleListCleanup}
                        >
                          <li>Led the development and implementation of comprehensive marketing strategies that resulted in a 20% increase in brand visibility and a 15% growth in sales within the first year.</li>
                          <li>Successfully launched and managed multiple cross-channel campaigns, utilizing digital marketing, social media, and traditional advertising, resulting in improved customer acquisition and retention rates.</li>
                        </ul>
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

                    {/* Job 2 */}
                    <Draggable nodeRef={workExpSrtRef}>
                      <div
                        ref={workExpSrtRef}
                        className="flex justify-between items-start gap-2 relative"
                      >
                        <div className="flex flex-col mb-1">
                          <h3 contentEditable suppressContentEditableWarning className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wider">
                            Fauget Studio
                          </h3>
                          <p className="text-sm">Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning > 2029 - 2031 </span>
                      </div>
                    </Draggable>
                    <Draggable nodeRef={job2Ref} bounds={false}>
                      <div ref={job2Ref} className="relative group">
                        <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <ul
                          className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1"
                          contentEditable
                          suppressContentEditableWarning
                          onKeyDown={handleSimpleListEnter}
                          onInput={handleSimpleListCleanup}
                        >
                          <li>Conducted market research to identify emerging trends and consumer preferences, providing valuable insights for product development and positioning.</li>
                          <li>Oversaw the creation of engaging content for various platforms, collaborating with internal and external agencies to ensure brand consistency and relevance.</li>
                        </ul>
                      </div>
                    </Draggable>

                    <Draggable nodeRef={workExpSrtRef}>
                      <div
                        ref={workExpSrtRef}
                        className="flex justify-between items-start gap-2 relative"
                      >
                        <div className="flex flex-col mb-1">
                          <h3
                            contentEditable suppressContentEditableWarning className="text-xs font-bold text-gray-800 mb-1 uppercase tracking-wider">
                            Studio Shodwe
                          </h3>
                          <p className="text-sm">Marketing Manager & Specialist</p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap" contentEditable suppressContentEditableWarning > 2029 - 2031 </span>
                      </div>
                    </Draggable>


                    {/* Job 3 */}
                    <Draggable nodeRef={job3Ref} bounds={false}>
                      <div ref={job3Ref} className="relative group">
                        <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                          <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                            <CopyPlus className="w-4 h-4" />
                          </button>
                          <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <ul
                          className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-0.5 mt-1"
                          contentEditable
                          suppressContentEditableWarning
                          onKeyDown={handleSimpleListEnter}
                          onInput={handleSimpleListCleanup}
                        >
                          <li>Developed and executed targeted marketing campaigns, resulting in a 25% increase in lead generation.</li>
                          <li>Implemented SEO strategies to improve website traffic by 30%, enhancing online visibility and positioning the company.</li>
                          <li>Collaborated with sales teams to create effective sales collateral, presentations, and promotional materials.</li>
                        </ul>
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
  }; // Register PDF function with context
  useEffect(() => {
    registerPDFFunction(downloadPDF);
  }, [downloadPDF, registerPDFFunction]);

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
