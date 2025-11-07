'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, User, Briefcase, GraduationCap, Code, Heart, Globe, CopyPlus, Trash2 } from 'lucide-react';
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
  const contactRef = useRef(null);
  const educationRef = useRef(null);
  const skillsRef = useRef(null);
  const languagesRef = useRef(null);
  const summaryRef = useRef(null);
  const job1Ref = useRef(null);
  const job2Ref = useRef(null);
  const job3Ref = useRef(null);
  const ref1Ref = useRef(null);
  const ref2Ref = useRef(null);


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
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24">
        <div ref={cvRef} className="min-h-screen bg-gray-100 p-8" onClick={handleButtonClick}>
          <div className="max-w-4xl mx-auto bg-white shadow-2xl">
            {/* Header Section */}
            <div className="relative bg-gradient-to-tr from-slate-400 via-slate-500 to-slate-600 text-white">
              {/* Decorative Diagonal Elements */}
              <div className="absolute top-0 right-0 w-96 h-full bg-slate-700 opacity-30" style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}></div>
              <div className="absolute top-0 right-0 w-80 h-full bg-slate-800 opacity-20" style={{ clipPath: 'polygon(40% 0, 100% 0, 100% 100%, 10% 100%)' }}></div>

              <div className="relative z-10 p-5 ml-12 pt-5 flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold mb-2"contentEditable suppressContentEditableWarning>SAHIB KHAN</h1>
                  <p className="text-lg text-white/90"contentEditable suppressContentEditableWarning>Graphic Designer</p>
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
              <div className="col-span-1 bg-gradient-to-b from-slate-400 to-slate-600 text-white p-6 space-y-6">
                {/* Contact */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold mb-3 border-b-2 border-white/30 pb-2" contentEditable suppressContentEditableWarning>
                    Contact
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Phone className="w-4 h-4 mt-1 flex-shrink-0" />
                      <p contentEditable suppressContentEditableWarning>+92-3457099825</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                      <p contentEditable suppressContentEditableWarning>sahib@gmail.com</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Globe className="w-4 h-4 mt-1 flex-shrink-0" />
                      <p contentEditable suppressContentEditableWarning>linkedin.com/sahib-khan</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                      <p contentEditable suppressContentEditableWarning>Dera Ismail Khan, KPK, Pakistan</p>
                    </div>
                  </div>
                </div>

                {/* Personal Skills */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold mb-3 border-b-2 border-white/30 pb-2">
                    <User className="w-5 h-5" />
                    Personal Skills
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Communication
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Teamwork
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Adaptability
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Problem-solving
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Time Management
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Organizational Skills
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Creativity
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Emotional Intelligence
                    </li>
                  </ul>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold mb-3 border-b-2 border-white/30 pb-2">
                    <Globe className="w-5 h-5" />
                    Languages
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Urdu
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Pashto
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      English
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      French
                    </li>
                  </ul>
                </div>

                {/* Hobbies */}
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-bold mb-3 border-b-2 border-white/30 pb-2">
                    <Heart className="w-5 h-5" />
                    Hobbies
                  </h3>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Traveling
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Photography
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Music
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                      Reading
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="col-span-2 p-8 space-y-6">
                {/* Career Objective */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-slate-700 mb-3 border-b-2 border-slate-300 pb-2">
                    <Briefcase className="w-5 h-5" />
                    Career Objective
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    I am an ambitious and eager to learning graphic designer. I am seeking a position where I can develop existing design skills, learn new techniques and contribute positively to future and gain valuable professional experience.
                  </p>
                </div>

                {/* Education */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-slate-700 mb-3 border-b-2 border-slate-300 pb-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-gray-800 text-sm">Bachelor of Technology (Graphic Honors)</p>
                        <p className="text-sm text-gray-600">May 2023</p>
                      </div>
                      <p className="text-sm text-gray-600">Gomal University Dera Ismail Khan</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-gray-800 text-sm">Higher Secondary Education (12th Grade)</p>
                        <p className="text-sm text-gray-600">May 2018</p>
                      </div>
                      <p className="text-sm text-gray-600">Dera Ismail Khan</p>
                    </div>

                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-gray-800 text-sm">Secondary Education (10th Grade)</p>
                        <p className="text-sm text-gray-600">May 2016</p>
                      </div>
                      <p className="text-sm text-gray-600">Iqbal Hussain Qadha Zada, Dera Ismail Khan</p>
                    </div>
                  </div>
                </div>

                {/* Technical Skills */}
                <div>
                  <h3 className="flex items-center gap-2 text-xl font-bold text-slate-700 mb-3 border-b-2 border-slate-300 pb-2">
                    <Code className="w-5 h-5" />
                    Technical Skills
                  </h3>
                  <ul className="grid grid-cols-2 gap-2 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      Photoshop
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      Illustrator
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      Premiere Pro
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      Email Communication
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      MS Office
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-slate-600 rounded-full"></span>
                      WordPress
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

