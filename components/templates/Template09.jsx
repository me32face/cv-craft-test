'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Circle, CopyPlus, Trash2, Globe } from 'lucide-react';
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
        <div ref={cvRef} className="max-w-4xl mx-auto bg-white shadow-lg" onClick={handleButtonClick}>
          {/* Header Section */}
          <div className="bg-blue-900 text-white p-10 relative">
            <div className="flex items-center gap-8">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-44 h-48 rounded-2xl  border-8 border-blue-100 bg-gray-300 overflow-hidden"
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

              {/* Name and Title */}
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2" contentEditable suppressContentEditableWarning>OLIVIA WILSON</h1>
                <p className="text-lg text-blue-200" contentEditable suppressContentEditableWarning>Marketing Manager</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6 ml-40 group">
              <Draggable nodeRef={contactRef}>
                <div ref={contactRef} data-section-item className="grid grid-cols-2 gap-4 relative group">
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

          {/* Main Content */}
          <div className="grid grid-cols-3 gap-8 p-8">
            {/* Left Column */}
            <div className="col-span-2 space-y-8">
              {/* Experience Section */}
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

            {/* Right Column */}
            <div className="space-y-8 ">
              {/* About Me Section */}
              <section>
                <div className='group' data-section="skills">
                  <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold pb-2 ">About Me</h2>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <AISparkle className='-mt-2 ml-1' section="Skills" onGenerate={handleAIGenerate} />
                </div>
              </div>
                


                <Draggable nodeRef={summaryRef}>
                  <div ref={summaryRef} data-section-item className='relative group'>
                    <p
                      className="text-sm text-gray-600 leading-relaxed"
                      contentEditable
                      suppressContentEditableWarning
                    >
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sit amet
                      sem nec filus egestas accumsan. In enim nunc, tincidunt ut quam eget,
                      luctus sollicitudin neque. Sed leo nisi, semper ac hendrerit a,
                      sollicitudin in arcu.
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
              </section>

              {/* Skills Section */}
              <section className="mb-8 group" data-section="skills">
                <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold pb-2 ">SKILLS</h2>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <AISparkle className='-mt-2 ml-1' section="Skills" onGenerate={handleAIGenerate} />
                </div>
              </div>
                <Draggable nodeRef={skillsRef}>
                  {/* The ref must be on the element Draggable actually moves */}
                  <ul ref={skillsRef} data-section-item className="space-y-2 text-xs relative group">
                    <li className="flex items-center gap-2">
                      <Circle className="w-2 h-2 fill-white" />
                      <span contentEditable suppressContentEditableWarning>Project Management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Circle className="w-2 h-2 fill-white" />
                      <span contentEditable suppressContentEditableWarning>Public Relations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Circle className="w-2 h-2 fill-white" />
                      <span contentEditable suppressContentEditableWarning>Teamwork</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Circle className="w-2 h-2 fill-white" />
                      <span contentEditable suppressContentEditableWarning>Time Management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Circle className="w-2 h-2 fill-white" />
                      <span contentEditable suppressContentEditableWarning>Leadership</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Circle className="w-2 h-2 fill-white" />
                      <span contentEditable suppressContentEditableWarning>Effective Communication</span>
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
                </Draggable>
              </section>
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
          </div>
        </div>
      </div>
    </div>
  );
}

