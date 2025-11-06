import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Globe, CopyPlus, Trash2 } from 'lucide-react';
import Draggable from "react-draggable";
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function Template14() {
  const [profileImage, setProfileImage] = useState(null);
  const [contentState, setContentState] = useState({});
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
      console.log('Generated content:', generatedContent);
    } catch (error) {
      alert('Failed to generate content. Please check your API key and try again.');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState({ profileImage, contentState });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [contentState, profileImage, saveState]);

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
    return (
      <div className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-visible" onClick={handleButtonClick} style={{WebkitFontSmoothing: 'antialiased', textRendering: 'geometricPrecision', imageRendering: 'crisp-edges', padding: '20mm'}}>
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-1" contentEditable suppressContentEditableWarning>DEEPAL SURVE</h1>
            <p className="text-gray-600" contentEditable suppressContentEditableWarning>Office Manager</p>
          </div>
          <div className="text-right text-sm">
            <p className="mb-1" contentEditable suppressContentEditableWarning>+123-456-7890</p>
            <p className="mb-1" contentEditable suppressContentEditableWarning>123 Anywhere St., Any City</p>
            <p contentEditable suppressContentEditableWarning>hello@reallygreatstite.com</p>
          </div>
        </div>

        {/* About Me */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2" contentEditable suppressContentEditableWarning>ABOUT ME</h2>
          <div className="h-0.5 bg-gray-800 w-24 mb-3"></div>
          <p className="text-sm text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore 
            magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea 
            commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
            pariatur.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-5 gap-8">
          {/* Left Column */}
          <div className="col-span-2">
            {/* Education */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2" contentEditable suppressContentEditableWarning>EDUCATION</h2>
              <div className="h-0.5 bg-gray-800 w-24 mb-4"></div>
              
              <div className="mb-4 relative group">
                <h3 className="font-bold text-sm" contentEditable suppressContentEditableWarning>BORCELLE UNIVERSITY</h3>
                <p className="text-xs text-gray-600 mb-1" contentEditable suppressContentEditableWarning>Lorem ipsum dolor</p>
                <p className="text-xs text-gray-500" contentEditable suppressContentEditableWarning>2024 - 2027</p>
                <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                    <CopyPlus className="w-4 h-4" />
                  </button>
                  <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4 relative group">
                <h3 className="font-bold text-sm" contentEditable suppressContentEditableWarning>RIMBERIO UNIVERSITY</h3>
                <p className="text-xs text-gray-600 mb-1" contentEditable suppressContentEditableWarning>Lorem ipsum dolor</p>
                <p className="text-xs text-gray-500" contentEditable suppressContentEditableWarning>2021 - 2024</p>
                <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                    <CopyPlus className="w-4 h-4" />
                  </button>
                  <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4 relative group">
                <h3 className="font-bold text-sm" contentEditable suppressContentEditableWarning>RIMBERIO UNIVERSITY</h3>
                <p className="text-xs text-gray-600 mb-1" contentEditable suppressContentEditableWarning>Lorem ipsum dolor</p>
                <p className="text-xs text-gray-500" contentEditable suppressContentEditableWarning>2018 - 2021</p>
                <div className="absolute -right-4 -top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                  <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                    <CopyPlus className="w-4 h-4" />
                  </button>
                  <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2" contentEditable suppressContentEditableWarning>SKILL</h2>
              <div className="h-0.5 bg-gray-800 w-24 mb-4"></div>
              <ul className="space-y-2">
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Administrative Efficiency</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Team Coordination</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Office Organization</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Task Prioritization</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Budget Management</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Schedule Planning</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Conflict Resolution</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Vendor Relations</span>
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

            {/* Language */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2" contentEditable suppressContentEditableWarning>LANGUAGE</h2>
              <div className="h-0.5 bg-gray-800 w-24 mb-4"></div>
              <ul className="space-y-2">
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>Hindi</span>
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md">
                      <CopyPlus className="w-3 h-3" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </li>
                <li className="text-sm flex items-start relative group">
                  <span className="mr-2">•</span>
                  <span contentEditable suppressContentEditableWarning>English</span>
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

          {/* Right Column */}
          <div className="col-span-3">
            {/* Work Experience */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2" contentEditable suppressContentEditableWarning>WORK EXPERIENCE</h2>
              <div className="h-0.5 bg-gray-800 w-24 mb-4"></div>

              <div className="mb-6 relative group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm" contentEditable suppressContentEditableWarning>ALDENAR & PARTNERS</h3>
                  <span className="text-xs font-semibold" contentEditable suppressContentEditableWarning>2024-NOW</span>
                </div>
                <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Office Manager</p>
                <p className="text-xs text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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

              <div className="mb-6 relative group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm" contentEditable suppressContentEditableWarning>THYNK UNLIMITED</h3>
                  <span className="text-xs font-semibold" contentEditable suppressContentEditableWarning>2019-2023</span>
                </div>
                <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Office Manager</p>
                <p className="text-xs text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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

              <div className="mb-6 relative group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm" contentEditable suppressContentEditableWarning>WARDIERE INC.</h3>
                  <span className="text-xs font-semibold" contentEditable suppressContentEditableWarning>2018-2019</span>
                </div>
                <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Office Manager</p>
                <p className="text-xs text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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

              <div className="mb-6 relative group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm" contentEditable suppressContentEditableWarning>TIMMERMAN INDUSTRIES</h3>
                  <span className="text-xs font-semibold" contentEditable suppressContentEditableWarning>2017-2018</span>
                </div>
                <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Office Manager</p>
                <p className="text-xs text-gray-700 leading-relaxed" contentEditable suppressContentEditableWarning>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
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

            {/* Reference */}
            <div>
              <h2 className="text-xl font-bold mb-2" contentEditable suppressContentEditableWarning>REFERENCE</h2>
              <div className="h-0.5 bg-gray-800 w-24 mb-4"></div>

              <div className="grid grid-cols-2 gap-6">
                <div className="relative group">
                  <h3 className="font-bold text-sm mb-1" contentEditable suppressContentEditableWarning>Alexander Aronowitz</h3>
                  <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Rimberio University</p>
                  <div className="flex items-center mb-1">
                    <Phone className="w-3 h-3 mr-2" />
                    <span className="text-xs" contentEditable suppressContentEditableWarning>+123-456-7890</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-3 h-3 mr-2" />
                    <span className="text-xs" contentEditable suppressContentEditableWarning>www.reallygreatstite.com</span>
                  </div>
                  <div className="absolute -right-4 -top-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md">
                      <CopyPlus className="w-4 h-4" />
                    </button>
                    <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="relative group">
                  <h3 className="font-bold text-sm mb-1" contentEditable suppressContentEditableWarning>Korina Villanueva</h3>
                  <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>Rimberio University</p>
                  <div className="flex items-center mb-1">
                    <Phone className="w-3 h-3 mr-2" />
                    <span className="text-xs" contentEditable suppressContentEditableWarning>+123-456-7890</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-3 h-3 mr-2" />
                    <span className="text-xs" contentEditable suppressContentEditableWarning>www.reallygreatstite.com</span>
                  </div>
                  <div className="absolute -right-4 -top-6 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
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
                  