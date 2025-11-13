import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Phone, Mail, MapPin, Globe, Briefcase, User, GraduationCap, CopyPlus, Trash2, Award } from 'lucide-react';
import Draggable from "react-draggable";
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function ProfessionalATSTemplate() {
  const [profileImage, setProfileImage] = useState(null);
  const [contentState, setContentState] = useState({});
  const { saveState } = useUndoRedo();

  const cvRef = useRef(null); // points to the A4 element
  const editorContainerRef = useRef(null); // wrapper we scale
  const [scale, setScale] = useState(0.85); // initial friendly scale

  // Refs for draggable elements
  const contactRef = useRef(null);
  const skillsRef = useRef(null);
  const languagesRef = useRef(null);
  const certificateRef = useRef(null);
  const workExpRef = useRef(null);
  const educationRef = useRef(null);
  const profileRef = useRef(null);
  const job1Ref = useRef(null);
  const job2Ref = useRef(null);

  // Image upload (same)
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        saveState({ profileImage, contentState });
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Duplicate/delete click handler (unchanged, but slightly tolerant selectors)
  const handleButtonClick = useCallback((e) => {
    const button = e.target.closest('button');
    if (!button) return;

    const action = button.getAttribute('data-action');
    // try several parent selectors to find a sensible 'section' to duplicate/delete
    const section =
      button.closest('.relative.group') ||
      button.closest('.group') ||
      button.closest('.contact-item') ||
      button.closest('.skill-item') ||
      button.closest('.edu-item') ||
      button.closest('.cert-item');

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

  // AI generate stub (kept same)
  const handleAIGenerate = async (section, keywords) => {
    if (!geminiService.genAI) {
      const apiKey = prompt('Please enter your Gemini API key:');
      if (!apiKey) return;
      geminiService.initialize(apiKey);
    }

    try {
      const generatedContent = await geminiService.generateContent(section, keywords);
      // simplified handling - kept similar to your implementation
      if (section.toLowerCase().includes('profile')) {
        const el = document.getElementById('profile-text');
        if (el) el.textContent = generatedContent.replace(/\s+/g, ' ').slice(0, 600);
      } else if (section.toLowerCase().includes('skills')) {
        const skillsElement = document.querySelector('[data-section="skills"] ul');
        if (skillsElement) {
          const skills = generatedContent.split('\n').filter(s => s.trim());
          skillsElement.innerHTML = skills.map(skill => `
            <li class="text-sm flex items-start relative group skill-item bg-blue-50 px-3 py-2 rounded">
              <span class="mr-2">•</span>
              <span contentEditable suppressContentEditableWarning>${skill.trim()}</span>
              <div class="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 flex gap-1 z-10">
                <button data-action="duplicate" class="text-gray-600 rounded p-1 bg-white">D</button>
                <button data-action="delete" class="text-gray-600 rounded p-1 bg-white">X</button>
              </div>
            </li>
          `).join('');
        }
      }
    } catch (err) {
      alert('AI generation failed.');
    }
  };

  // save state debounce (same)
  useEffect(() => {
    const t = setTimeout(() => saveState({ profileImage, contentState }), 800);
    return () => clearTimeout(t);
  }, [profileImage, contentState, saveState]);

  // undo/redo listener (same)
  useEffect(() => {
    const handler = (ev) => {
      const state = ev.detail?.state;
      if (state) {
        setProfileImage(state.profileImage || null);
        setContentState(state.contentState || {});
      }
    };
    window.addEventListener('undoRedo', handler);
    return () => window.removeEventListener('undoRedo', handler);
  }, []);

  useEffect(() => {
    saveState({ profileImage: null, contentState: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // === Auto-fit scaling logic ===
  useEffect(() => {
    if (!cvRef.current || !editorContainerRef.current) return;

    let raf = null;
    let resizeTimer = null;

    const computeScale = () => {
      const cvRect = cvRef.current.getBoundingClientRect();
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

      // We want page to occupy up to 92% of viewport (leave some UI padding)
      const availableW = vw * 0.92;
      const availableH = vh * 0.92;

      const scaleW = availableW / cvRect.width;
      const scaleH = availableH / cvRect.height;

      let newScale = Math.min(scaleW, scaleH);
      // clamp scale so it's not tiny or huge
      newScale = Math.max(0.5, Math.min(newScale, 0.5));
      setScale(prev => {
        // prevent useless state updates
        if (Math.abs(prev - newScale) < 0.005) return prev;
        return newScale;
      });
    };

    const onResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(computeScale);
      }, 120);
    };

    computeScale();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [cvRef, editorContainerRef]);

  // The CV content (certifications placed below education)
  const CVPage = () => {
    return (
      <div
        ref={cvRef}
        className="w-[210mm] h-[297mm] bg-white shadow-lg overflow-hidden box-border"
        onClick={handleButtonClick}
        style={{
          WebkitFontSmoothing: 'antialiased',
          textRendering: 'geometricPrecision',
          imageRendering: 'crisp-edges',
          boxSizing: 'border-box'
        }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-5">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <Draggable nodeRef={profileRef}>
                <div ref={profileRef} className="relative group">
                  <h1 className="text-2xl font-bold mb-1 truncate pt-3 pb-2" contentEditable suppressContentEditableWarning>
                    RICHARD SANCHEZ
                  </h1>
                  <p className="text-sm font-light truncate pt-1 pb-2" contentEditable suppressContentEditableWarning>
                    Senior Marketing Manager
                  </p>
                </div>
              </Draggable>
            </div>

            <div className="flex-shrink-0 text-right">
              <div
                className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow cursor-pointer"
                onClick={() => document.getElementById('profileImageInput').click()}
              >
                <img src={profileImage || '/templateprofile/template01profile.jpg'} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <input id="profileImageInput" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex" style={{ height: 'calc(297mm - 64px)' }}>
          {/* Left column */}
          <div className="w-[34%] bg-gray-50 p-5 overflow-hidden box-border">
            <div className="mb-4 contact-item relative group">
              <Draggable nodeRef={contactRef}>
                <h3 ref={contactRef} className="text-sm font-semibold text-blue-800 mb-2 pb-2 uppercase tracking-wide border-b border-blue-200" contentEditable suppressContentEditableWarning>
                  Contact
                </h3>
              </Draggable>

              <div className="space-y-2 text-xs text-gray-700 mt-4">
                <div className="flex items-center gap-2 relative">
                  <Phone className="w-3 h-3 text-blue-600" />
                  <span contentEditable suppressContentEditableWarning className='pb-4'>+123-456-7890</span>
                  <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative">
                  <Mail className="w-3 h-3 text-blue-600" />
                  <span className="break-all pb-4" contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                  <div className="absolute right-0 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span contentEditable suppressContentEditableWarning className='pb-4'>123 Anywhere St., Any City</span>
                  <div className="absolute right-0 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="flex items-center gap-2 relative">
                  <Globe className="w-3 h-3 text-blue-600" />
                  <span className="break-all pb-4" contentEditable suppressContentEditableWarning>www.reallygreatsite.com</span>
                  <div className="absolute right-0 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
        
            {/* Profile */}
            <div className="mb-4 section-container group relative">
              <div className="flex items-center gap-2 mb-2 pt-3 ">
                <User className="w-4 h-4 text-blue-600 "/>
                <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wide mb-4" contentEditable suppressContentEditableWarning>Profile</h4>
                <div className="ml-auto opacity-0 group-hover:opacity-100 ">
                  <AISparkle section="Profile" onGenerate={handleAIGenerate} />
                </div>
              </div>
              <p id="profile-text" className="text-xs text-gray-700 pt-1 leading-tight bg-white p-3 rounded border border-gray-200 pb-4" contentEditable suppressContentEditableWarning>
                Results-driven Marketing Manager with 8+ years of experience developing and executing successful marketing strategies. Proven track record in driving brand growth and leading high-performing teams.
              </p>
              <div className="absolute right-0 -top-2 opacity-0 group-hover:opacity-100 flex gap-1">
                <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4 section-container" data-section="skills">
              <Draggable nodeRef={skillsRef}>
                <div ref={skillsRef} className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <h4 className="text-sm font-semibold text-blue-800 mb-4 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Skills</h4>
                  <div className="ml-auto opacity-0 group-hover:opacity-100">
                    <AISparkle section="Skills" onGenerate={handleAIGenerate} />
                  </div>
                </div>
              </Draggable>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center justify-between gap-2 bg-white p-2 rounded border-gray-200 skill-item group">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 pb-3.5">•</span>
                    <span contentEditable suppressContentEditableWarning className='pb-3.5'>Strategic Marketing Planning</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </li>
                <li className="flex items-center justify-between gap-2 bg-white p-2 rounded border border-gray-200 skill-item group">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 pb-3.5">•</span>
                    <span contentEditable suppressContentEditableWarning className='pb-3.5'>Digital Marketing & SEO</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </li>
                <li className="flex items-center justify-between gap-2 bg-white p-2 rounded border border-gray-200 skill-item group">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 pb-3.5">•</span>
                    <span contentEditable suppressContentEditableWarning className='pb-3.5'>Team Leadership</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </li>
              </ul>
            </div>

            {/* Languages */}
            <div className="mb-2">
              <Draggable nodeRef={languagesRef}>
                <h4 ref={languagesRef} className="text-sm font-semibold text-blue-800 mb-4 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Languages</h4>
              </Draggable>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200 lang-item group relative">
                  <span contentEditable suppressContentEditableWarning className='pb-4'>English</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 pb-4" contentEditable suppressContentEditableWarning>Native</span>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white p-2 rounded border border-gray-200 lang-item group relative">
                  <span contentEditable suppressContentEditableWarning className='pb-4'>Spanish</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 pb-4" contentEditable suppressContentEditableWarning>Fluent</span>
                    <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="w-[66%] p-5 overflow-hidden box-border">
            <div className="mb-4">
              <Draggable nodeRef={workExpRef}>
                <div ref={workExpRef} className="flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-800 uppercase tracking-wide mb-4" contentEditable suppressContentEditableWarning>Professional Experience</h3>
                </div>
              </Draggable>

              <div className="space-y-4">
                {/* Job 1 */}
                <Draggable nodeRef={job1Ref}>
                  <div ref={job1Ref} className="relative group bg-white p-4 rounded border border-gray-200 pb-7">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Borcelle Studio</h4>
                        <p className="text-sm text-blue-600" contentEditable suppressContentEditableWarning>Senior Marketing Manager</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-blue-50 px-2 py-0.5 rounded-full pb-4 mt-4" contentEditable suppressContentEditableWarning>2030 - Present</span>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start"><span className="mr-2 text-blue-600">•</span><span contentEditable suppressContentEditableWarning>Develop and execute marketing strategies that increased brand awareness by 45%.</span></li>
                      <li className="flex items-start"><span className="mr-2 text-blue-600">•</span><span contentEditable suppressContentEditableWarning>Lead and mentor a team of 12 marketing professionals.</span></li>
                      <li className="flex items-start"><span className="mr-2 text-blue-600">•</span><span contentEditable suppressContentEditableWarning>Manage annual marketing budget of $2.5M achieving strong ROI.</span></li>
                    </ul>
                    <div className="absolute right-2 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </Draggable>

                {/* Job 2 */}
                <Draggable nodeRef={job2Ref}>
                  <div ref={job2Ref} className="relative group bg-white p-4 rounded border border-gray-200 pb-7">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="text-base font-semibold text-gray-800" contentEditable suppressContentEditableWarning>Fauget Studio</h4>
                        <p className="text-sm text-blue-600" contentEditable suppressContentEditableWarning>Marketing Manager</p>
                      </div>
                      <span className="text-xs text-gray-500 bg-blue-50 px-2 py-0.5 rounded-full pb-3.5 mt-4" contentEditable suppressContentEditableWarning>2025 - 2029</span>
                    </div>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start"><span className="mr-2 text-blue-600">•</span><span contentEditable suppressContentEditableWarning>Implemented data-driven marketing campaigns generating major revenue lifts.</span></li>
                      <li className="flex items-start"><span className="mr-2 text-blue-600">•</span><span contentEditable suppressContentEditableWarning>Improved website traffic and conversion rates through focused strategies.</span></li>
                    </ul>
                    <div className="absolute right-2 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </Draggable>
              </div>
            </div>

            {/* Education first, Certifications below it (single column) */}
            <div className="space-y-3">
              <Draggable nodeRef={educationRef}>
                <h4 ref={educationRef} className="text-sm font-semibold text-gray-800 mb-1 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Education</h4>
              </Draggable>

              <div className="space-y-2 text-sm">
                <div className="bg-white p-3 rounded border border-gray-200 edu-item group relative pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold" contentEditable suppressContentEditableWarning>Master of Business Administration (MBA)</p>
                      <p className="text-xs text-blue-600" contentEditable suppressContentEditableWarning>Wardiere University</p>
                    </div>
                    <span className="text-xs text-gray-500" contentEditable suppressContentEditableWarning>2029 - 2031</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1" contentEditable suppressContentEditableWarning>GPA: 3.8/4.0</p>
                  <div className="absolute right-2 top-8 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-gray-200 edu-item group relative pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold" contentEditable suppressContentEditableWarning>Bachelor of Business Management</p>
                      <p className="text-xs text-blue-600" contentEditable suppressContentEditableWarning>Wardiere University</p>
                    </div>
                    <span className="text-xs text-gray-500" contentEditable suppressContentEditableWarning>2025 - 2029</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1" contentEditable suppressContentEditableWarning>GPA: 3.9/4.0</p>
                  <div className="absolute right-2 top-8 opacity-0 group-hover:opacity-100 flex gap-1">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>

              {/* --- Certifications BELOW Education --- */}
              <div className="pt-3">
                <Draggable nodeRef={certificateRef}>
                  <h4 ref={certificateRef} className="text-sm font-semibold text-gray-800 mb-1 uppercase tracking-wide" contentEditable suppressContentEditableWarning>Certifications</h4>
                </Draggable>

                <div className="space-y-2 text-sm pt-4">
                  <div className="bg-white p-3 rounded border border-gray-200 cert-item group relative pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold" contentEditable suppressContentEditableWarning>Google Analytics Professional</p>
                        <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Google Certification Program</p>
                      </div>
                      <span className="text-xs text-blue-600" contentEditable suppressContentEditableWarning>2028</span>
                    </div>
                    <div className="absolute right-2 top-8 opacity-0 group-hover:opacity-100 flex gap-1">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded border border-gray-200 cert-item group relative pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold" contentEditable suppressContentEditableWarning>Project Management Professional (PMP)</p>
                        <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>Project Management Institute</p>
                      </div>
                      <span className="text-xs text-blue-600" contentEditable suppressContentEditableWarning>2027</span>
                    </div>
                    <div className="absolute right-2 top-8 opacity-0 group-hover:opacity-100 flex gap-1">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 bg-white"><CopyPlus className="w-4 h-4" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 bg-white"><Trash2 className="w-4 h-4" /></button>
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
        // apply dynamic scale to this wrapper so whole A4 fits into viewport
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          transition: 'transform 180ms ease',
          display: 'flex',
          justifyContent: 'center',
          width: '100%'
        }}
        className="flex flex-col items-center origin-top pt-8"
      >
        <div ref={cvRef} data-cv-page>
          <CVPage />
        </div>
      </div>
    </div>
  );
}