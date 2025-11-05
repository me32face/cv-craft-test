import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Phone, Mail, CopyPlus, Trash2 } from 'lucide-react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function Template06() {
  const [profileImage, setProfileImage] = useState(null);
  const [contentState, setContentState] = useState({});
  const [renderKey, setRenderKey] = useState(0);
  const { registerPDFFunction } = usePDF();
  const { saveState } = useUndoRedo();

  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);
  const profileRef = useRef(null);
  const hardSkillsRef = useRef(null);
  const techSkillsRef = useRef(null);
  const edu1Ref = useRef(null);
  const edu2Ref = useRef(null);
  const langRef = useRef(null);
  const certRef = useRef(null);

  const handleButtonClick = useCallback((e) => {
    const button = e.target.closest('button');
    if (!button) return;
    const action = button.getAttribute('data-action');
    const section = button.closest('.relative.group');
    if (!section) return;
    if (action === 'duplicate') {
      const clone = section.cloneNode(true);
      section.parentNode.insertBefore(clone, section.nextSibling);
    } else if (action === 'delete') {
      section.remove();
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
        case 'profile':
          const summaryElement = document.getElementById('profile-text');
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
        case 'skills':
          const hardSkillsList = document.querySelector('.hard-skills-list');
          const techSkillsList = document.querySelector('.tech-skills-list');
          if (hardSkillsList && techSkillsList) {
            let cleanedContent = generatedContent
              .replace(/^#{1,6}\s+.+$/gm, '')
              .replace(/\*\*(.+?)\*\*/g, '$1')
              .replace(/\*(.+?)\*/g, '$1')
              .replace(/^[-•*]\s*/gm, '')
              .replace(/^\d+\.\s*/gm, '')
              .trim();
            const skills = cleanedContent.split('\n')
              .map(s => s.trim())
              .filter(s => s && !s.toLowerCase().includes('here') && !s.toLowerCase().includes('of course') && s.length < 100);
            const half = Math.ceil(skills.length / 2);
            const hardSkills = skills.slice(0, half);
            const techSkills = skills.slice(half);
            hardSkillsList.innerHTML = hardSkills.map(skill => {
              const cleanSkill = skill.replace(/["'`]/g, '');
              return `<li class="flex items-start gap-2">
                <span class="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                <span contentEditable suppressContentEditableWarning>${cleanSkill}</span>
              </li>`;
            }).join('');
            techSkillsList.innerHTML = techSkills.map(skill => {
              const cleanSkill = skill.replace(/["'`]/g, '');
              return `<li class="flex items-start gap-2">
                <span class="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                <span contentEditable suppressContentEditableWarning>${cleanSkill}</span>
              </li>`;
            }).join('');
          }
          break;
      }
    } catch (error) {
      alert('Failed to generate content. Please check your API key and try again.');
    }
  };

  useEffect(() => {
    const cvElement = cvRef.current;
    if (!cvElement) return;
    let timeoutId;
    const handleInput = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        saveState({ profileImage, html: cvElement.innerHTML });
      }, 1000);
    };
    cvElement.addEventListener('input', handleInput);
    return () => {
      cvElement.removeEventListener('input', handleInput);
      clearTimeout(timeoutId);
    };
  }, [profileImage, saveState]);

  useEffect(() => {
    const handleUndoRedo = (event) => {
      const { state } = event.detail;
      if (state) {
        if (state.profileImage !== undefined) {
          setProfileImage(state.profileImage);
        }
        if (state.html && cvRef.current) {
          cvRef.current.innerHTML = state.html;
          setRenderKey(prev => prev + 1);
        }
      }
    };
    window.addEventListener('undoRedo', handleUndoRedo);
    return () => window.removeEventListener('undoRedo', handleUndoRedo);
  }, []);

  useEffect(() => {
    if (cvRef.current) {
      saveState({ profileImage: null, html: cvRef.current.innerHTML });
    }
  }, [saveState]);

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
        <div key={renderKey} ref={cvRef} className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-hidden p-12" onClick={handleButtonClick}>
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-gray-800" contentEditable suppressContentEditableWarning>IVIYA </span>
              <span className="text-orange-500" contentEditable suppressContentEditableWarning>SCHWAIGER</span>
            </h1>
            <p className="text-lg font-semibold text-gray-800" contentEditable suppressContentEditableWarning>
              Mechanical Engineering
            </p>
          </div>
          
          <div className="text-right text-xs text-gray-700 space-y-1">
            <div className="flex items-center justify-end gap-2">
              <MapPin className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning>123 Anywhere St., Any City, ST 12345</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Phone className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning>123-456-7890</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Mail className="w-3 h-3" />
              <span contentEditable suppressContentEditableWarning>hello@reallygreatsite</span>
            </div>
          </div>
        </div>

        {/* Orange divider line */}
        <div className="w-[50%] h-1 bg-orange-500 mb-6 ml-auto"></div>

        {/* Profile Summary */}
        <Draggable nodeRef={profileRef}>
        <div ref={profileRef} className="mb-6 relative group">
          <div className="flex items-center gap-2 mb-2">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <AISparkle section="Profile" onGenerate={handleAIGenerate} />
            </div>
          </div>
          <p id="profile-text" className="text-xs text-gray-700 leading-relaxed text-justify" contentEditable suppressContentEditableWarning>
            Dedicated and detail-oriented Mechanical Engineer with 5+ years of experience in designing, analyzing, and optimizing mechanical systems for diverse applications. Skilled in modeling, thermal and structural analysis, and cross-functional team leadership. Committed to continuous improvement, efficient problem-solving, and delivering projects on schedule.
          </p>
          <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
            <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
              <CopyPlus className="w-4 h-4" />
            </button>
            <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        </Draggable>

        {/* Work Experience Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-orange-500 mb-3 uppercase tracking-wide">Work Experience</h2>
          
          {/* Job 1 */}
          <div className="mb-4 relative group">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                    Senior Mechanical Engineer | Think Unlimited
                  </h3>
                  <span className="text-xs text-gray-600 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>
                    Jan 2022 – Present
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 mt-2">
                  <li contentEditable suppressContentEditableWarning>
                    Led the design and implementation of advanced mechanical systems for multiple projects, improving system efficiency by 18%.
                  </li>
                  <li contentEditable suppressContentEditableWarning>
                    Supervised and mentored a team of junior engineers, fostering skills development and technical growth.
                  </li>
                  <li contentEditable suppressContentEditableWarning>
                    Coordinated product testing, troubleshooting, and implemented quality control measures to ensure compliance with industry standards.
                  </li>
                </ul>
              </div>
            </div>
            <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
              <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                <CopyPlus className="w-4 h-4" />
              </button>
              <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Job 2 */}
          <div className="mb-4 relative group">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-gray-800 rounded-full mt-1.5 flex-shrink-0"></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                    Mechanical Project Engineer | Borcelle Company
                  </h3>
                  <span className="text-xs text-gray-600 whitespace-nowrap ml-4" contentEditable suppressContentEditableWarning>
                    Jul 2019 – Dec 2021
                  </span>
                </div>
                <ul className="list-disc list-inside text-xs text-gray-700 space-y-1 mt-2">
                  <li contentEditable suppressContentEditableWarning>
                    Managed projects from concept to completion, focusing on manufacturability and durability.
                  </li>
                  <li contentEditable suppressContentEditableWarning>
                    Conducted root cause analysis for mechanical failures and implemented corrective actions.
                  </li>
                  <li contentEditable suppressContentEditableWarning>
                    Collaborated with cross-functional teams to resolve technical challenges and optimize designs.
                  </li>
                </ul>
              </div>
            </div>
            <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
              <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                <CopyPlus className="w-4 h-4" />
              </button>
              <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-6 group">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold text-orange-500 uppercase tracking-wide">Skills</h2>
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <AISparkle section="Skills" onGenerate={handleAIGenerate} />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Hard Skills */}
            <Draggable nodeRef={hardSkillsRef} cancel="[contentEditable]">
            <div ref={hardSkillsRef} className="relative group cursor-move">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Hard Skills</h3>
              <ul className="hard-skills-list space-y-1 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>3D Modeling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Finite Element Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Thermal System Design & Simulation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Mechanical Component Design & Assembly</span>
                </li>
              </ul>
              <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                  <CopyPlus className="w-4 h-4" />
                </button>
                <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            </Draggable>

            {/* Technical Skills */}
            <Draggable nodeRef={techSkillsRef} cancel="[contentEditable]">
            <div ref={techSkillsRef} className="relative group cursor-move">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Technical Skills</h3>
              <ul className="tech-skills-list space-y-1 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Root Cause Analysis & Troubleshooting</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Project Management & Scheduling</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Design Optimization & Value Engineering</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Quality Control & Assurance</span>
                </li>
              </ul>
              <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                  <CopyPlus className="w-4 h-4" />
                </button>
                <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            </Draggable>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-orange-500 mb-3 uppercase tracking-wide">Education</h2>
          
          <Draggable nodeRef={edu1Ref}>
          <div ref={edu1Ref} className="flex justify-between items-start relative group">
            <div>
              <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                Bachelor of Mechanical Engineering
              </h3>
              <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>
                University of Anowari | Thermodynamics, Machine Design, Fluid Mechanics
              </p>
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap" contentEditable suppressContentEditableWarning>
              2015 – 2019
            </span>
            <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
              <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                <CopyPlus className="w-4 h-4" />
              </button>
              <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          </Draggable>
          <Draggable nodeRef={edu2Ref}>
          <div ref={edu2Ref} className="flex justify-between items-start mt-4 relative group">
            <div>
              <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                Bachelor of Mechanical Engineering
              </h3>
              <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>
                University of Anowari | Thermodynamics, Machine Design, Fluid Mechanics
              </p>
            </div>
            <span className="text-xs text-gray-600 whitespace-nowrap" contentEditable suppressContentEditableWarning>
              2015 – 2019
            </span>
            <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
              <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                <CopyPlus className="w-4 h-4" />
              </button>
              <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          </Draggable>
        </div>
        

        {/* Other Section */}
        <div>
          <h2 className="text-base font-bold text-orange-500 mb-3 uppercase tracking-wide">Other</h2>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Language */}
            <Draggable nodeRef={langRef}>
            <div ref={langRef} className="relative group">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Language</h3>
              <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>English</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Malayalam</span>
                </li>
              </ul>
              <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                  <CopyPlus className="w-4 h-4" />
                </button>
                <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            </Draggable>

            {/* Certifications & Memberships */}
            <Draggable nodeRef={certRef}>
            <div ref={certRef} className="relative group">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Certifications & Memberships</h3>
              <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span><span className="font-semibold">Certified:</span> <span contentEditable suppressContentEditableWarning>Professional Engineer</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1 h-1 bg-gray-700 rounded-full mt-1.5 flex-shrink-0"></span>
                  <span contentEditable suppressContentEditableWarning>Member of Mechanical Engineering Association</span>
                </li>
              </ul>
              <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
                  <CopyPlus className="w-4 h-4" />
                </button>
                <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white">
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