import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Circle, CopyPlus, Trash2 } from 'lucide-react';
import Draggable from "react-draggable";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { usePDF } from '../../contexts/PDFContext';
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function Template04() {
  const [profileImage, setProfileImage] = useState(null);
  const [contentState, setContentState] = useState({});
  const { registerPDFFunction } = usePDF();
  const { saveState } = useUndoRedo();

  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);
  const summaryRef = useRef(null);
  const expertiseRef = useRef(null);
  const contactRef = useRef(null);
  const educationRef = useRef(null);
  const languageRef = useRef(null);
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
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef} className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-hidden flex" onClick={handleButtonClick}>
          {/* Left Sidebar - Dark Blue/Gray */}
          <div className="w-[33%] bg-slate-700 text-white p-8">
            {/* Profile Image */}
            <div className="mb-8">
              <div
                className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => document.getElementById('profileImageInput').click()}
              >
                {/* {profileImage ? ( */}
                <img src={'/templateprofile/template02profile.webp'} alt="Profile" className="w-full h-full object-cover" />
                {/* ) : ( */}
                {/* <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400"></div> */}
                {/* )} */}
              </div>
              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Contact Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-500">Contact</h2>
              <Draggable nodeRef={contactRef}>
                <div ref={contactRef} data-section-item className="space-y-3 relative group">
                  <div>
                    <h3 className="text-xs font-bold mb-1">Phone</h3>
                    <p className="text-xs" contentEditable suppressContentEditableWarning>123-456-7890</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold mb-1">Email</h3>
                    <p className="text-xs break-all" contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold mb-1">Address</h3>
                    <p className="text-xs" contentEditable suppressContentEditableWarning>123 Anywhere St., Any City</p>
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
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-500">Education</h2>
              <Draggable nodeRef={educationRef}>
                <div ref={educationRef} data-section-item className="space-y-4 relative group">
                  <div>
                    <p className="text-xs font-bold mb-1" contentEditable suppressContentEditableWarning>2020 - 2023</p>
                    <p className="text-xs mb-2" contentEditable suppressContentEditableWarning>
                      Bachelor of Business Management
                    </p>
                    <p className="text-xs text-gray-400" contentEditable suppressContentEditableWarning>Borcelle University</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1" contentEditable suppressContentEditableWarning>2017 - 2020</p>
                    <p className="text-xs mb-2" contentEditable suppressContentEditableWarning>
                      Bachelor of Business Management
                    </p>
                    <p className="text-xs text-gray-400" contentEditable suppressContentEditableWarning>Borcelle University</p>
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

            {/* Expertise Section */}
            <div className="mb-8 group" data-section="expertise">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold pb-2 border-b border-gray-500">Expertise</h2>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <AISparkle className='-mt-2 ml-1' section="Skills" onGenerate={handleAIGenerate} />
                </div>
              </div>
              <Draggable nodeRef={expertiseRef}>
                <ul ref={expertiseRef} data-section-item className="space-y-2 text-xs relative group">
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>UI/UX</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Visual Design</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Wireframes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Storyboards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>User Flows</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Circle className="w-2 h-2 fill-white" />
                    <span contentEditable suppressContentEditableWarning>Process Flows</span>
                  </li>
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1.5 shadow-md">
                      <CopyPlus className="w-4 h-4" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1.5 shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </ul>
              </Draggable>
            </div>

            {/* Language Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-500">Language</h2>
              <Draggable nodeRef={languageRef}>
                <div ref={languageRef} data-section-item className="space-y-2 text-xs relative group">
                  <p contentEditable suppressContentEditableWarning>English</p>
                  <p contentEditable suppressContentEditableWarning>Spanish</p>
                  <div className="absolute -right-4 -top-12 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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
          </div>

          {/* Right Content - White */}
          <div className="w-[65%] bg-white p-8">
            {/* Header */}
            <div className="mb-8 group">
              <h1 className="text-4xl font-bold text-gray-800 mb-2" contentEditable suppressContentEditableWarning>
                Mariana Anderson
              </h1>
              <div className='flex items-center  gap-2'>
                <p className="text-lg text-gray-600 mb-4" contentEditable suppressContentEditableWarning>
                  Marketing Manager
                </p>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <AISparkle className='mb-4' section="Summary" onGenerate={handleAIGenerate} />
                </div>

              </div>
              <Draggable nodeRef={summaryRef}>
                <div ref={summaryRef} data-section-item className="relative group">
                  <p id="summary-text" className="text-xs text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et amet varius nec, rhon pharetra leo. Etiam nec molestie magna. Cras, molestie libero leo, Bibendum
                  </p>

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

            {/* Experience Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">Experience</h2>
              <div className="space-y-6">
                {/* Job 1 */}
                <Draggable nodeRef={job1Ref}>
                  <div ref={job1Ref} data-section-item className="flex gap-3 relative group">
                    <div className="flex-shrink-0 mt-1">
                      <Circle className="w-3 h-3 fill-gray-800" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>2022 - 2025</p>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                            Ginyard International Co | 123 Anywhere St., Any City
                          </h3>
                          <p className="text-sm font-semibold text-gray-700" contentEditable suppressContentEditableWarning>
                            Inside Sales Representative
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet. Donec hendrerit libero eget est hendrerit, nec facilisis metus pharetra. Nam ornare nulla vel leo euismod, eu placerat dolor vulputate. Nullam eu justo dolor. Praesent facilisis metus sed orci rhoncus, nec facilisis dolor. Praesent facilisis est sed orci rhoncus, nec viverra dolor vulputate.
                      </p>
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

                {/* Job 2 */}
                <Draggable nodeRef={job2Ref}>
                  <div ref={job2Ref} data-section-item className="flex gap-3 relative group">
                    <div className="flex-shrink-0 mt-1">
                      <Circle className="w-3 h-3 fill-gray-800" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>2020 - 2022</p>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                            Ginyard International Co | 123 Anywhere St., Any City
                          </h3>
                          <p className="text-sm font-semibold text-gray-700" contentEditable suppressContentEditableWarning>
                            Inside Sales Representative
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet. Donec hendrerit libero eget est hendrerit, nec facilisis metus pharetra. Nam ornare nulla vel leo euismod, eu placerat dolor vulputate. Nullam eu justo dolor. Praesent facilisis metus sed orci rhoncus, nec facilisis dolor. Praesent facilisis est sed orci rhoncus, nec viverra dolor vulputate.
                      </p>
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

                {/* Job 3 */}
                <Draggable nodeRef={job3Ref}>
                  <div ref={job3Ref} data-section-item className="flex gap-3 relative group">
                    <div className="flex-shrink-0 mt-1">
                      <Circle className="w-3 h-3 fill-gray-800" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>2018 - 2020</p>
                          <h3 className="text-sm font-bold text-gray-800" contentEditable suppressContentEditableWarning>
                            Ginyard International Co | 123 Anywhere St., Any City
                          </h3>
                          <p className="text-sm font-semibold text-gray-700" contentEditable suppressContentEditableWarning>
                            Inside Sales Representative
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pharetra in lorem at laoreet. Donec hendrerit libero eget est hendrerit, nec facilisis metus pharetra. Nam ornare nulla vel leo euismod, eu placerat dolor vulputate. Nullam eu justo dolor. Praesent facilisis metus sed orci rhoncus, nec facilisis dolor. Praesent facilisis est sed orci rhoncus, nec viverra dolor vulputate.
                      </p>
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

            {/* Reference Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">Reference</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Reference 1 */}
                <Draggable nodeRef={ref1Ref}>
                  <div ref={ref1Ref} data-section-item className="relative group">
                    <h3 className="text-sm font-bold text-gray-800 mb-1" contentEditable suppressContentEditableWarning>Harumi Kobayashi</h3>
                    <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        <span className="font-semibold">Phone:</span> <span contentEditable suppressContentEditableWarning>123-456-7890</span>
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span> <span contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                      </p>
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

                {/* Reference 2 */}
                <Draggable nodeRef={ref2Ref}>
                  <div ref={ref2Ref} data-section-item className="relative group">
                    <h3 className="text-sm font-bold text-gray-800 mb-1" contentEditable suppressContentEditableWarning>Bailey Dupont</h3>
                    <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Wardiere Inc. / CEO</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        <span className="font-semibold">Phone:</span> <span contentEditable suppressContentEditableWarning>123-456-7890</span>
                      </p>
                      <p>
                        <span className="font-semibold">Email:</span> <span contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                      </p>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}