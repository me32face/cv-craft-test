import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Circle, CopyPlus, Trash2 } from 'lucide-react';

import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function Template04() {
  const [profileImage, setProfileImage] = useState(null);
  const [contentState, setContentState] = useState({});
  const [renderKey, setRenderKey] = useState(0);
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
            expertiseElement.innerHTML = skills.map(skill => {
              const cleanSkill = skill.replace(/["'`]/g, '');
              return `<li class="flex items-start gap-2 relative group">
                <span class="mr-2">•</span>
                <span contentEditable suppressContentEditableWarning>${cleanSkill}</span>
                <div class="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <button data-action="duplicate" class="text-white rounded p-1 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                  </button>
                  <button data-action="delete" class="text-white rounded p-1 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                  </button>
                </div>
              </li>`;
            }).join('');
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





  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto">
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div key={renderKey} ref={cvRef} data-cv-page className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-hidden flex" onClick={handleButtonClick}>
          {/* Left Sidebar - Dark Blue/Gray */}
          <div className="w-[33%] bg-slate-700 text-white p-8">
            {/* Profile Image */}
            <div className="mb-8">
              <div
                className="w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-white shadow-xl bg-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => document.getElementById('profileImageInput').click()}
              >
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img src={'/templateprofile/template02profile.webp'} alt="Profile" className="w-full h-full object-cover" />
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

            {/* Contact Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-500">Contact</h2>
                <div data-section-item className="space-y-3 relative group">
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
            </div>

            {/* Education Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-500">Education</h2>
                <div data-section-item className="space-y-4 relative group">
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
            </div>

            {/* Expertise Section */}
            <div className="mb-8 group" data-section="expertise">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold pb-2 border-b border-gray-500">Expertise</h2>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <AISparkle className='-mt-2 ml-1' section="Skills" onGenerate={handleAIGenerate} />
                </div>
              </div>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2 relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>UI/UX</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="flex items-start gap-2 relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Visual Design</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="flex items-start gap-2 relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Wireframes</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="flex items-start gap-2 relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Storyboards</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="flex items-start gap-2 relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>User Flows</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-white rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-white rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="flex items-start gap-2 relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Process Flows</span>
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

            {/* Language Section */}
            <div>
              <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-500">Language</h2>
                <div data-section-item className="space-y-2 text-xs relative group">
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
                <div data-section-item className="relative group">
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
            </div>

            {/* Experience Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">Experience</h2>
              <div className="space-y-6">
                {/* Job 1 */}
                  <div data-section-item className="flex gap-3 relative group">
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-gray-800">•</span>
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

                {/* Job 2 */}
                  <div data-section-item className="flex gap-3 relative group">
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-gray-800">•</span>
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

                {/* Job 3 */}
                  <div data-section-item className="flex gap-3 relative group">
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-gray-800">•</span>
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
              </div>
            </div>

            {/* Reference Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">Reference</h2>
              <div className="grid grid-cols-2 gap-6">
                {/* Reference 1 */}
                  <div data-section-item className="relative group">
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

                {/* Reference 2 */}
                  <div data-section-item className="relative group">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}