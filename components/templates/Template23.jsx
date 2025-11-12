import { useState, useCallback, useRef, useEffect } from 'react';
import { CopyPlus, Trash2 } from 'lucide-react';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function Template23() {
  const [profileImage, setProfileImage] = useState(null);
  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
        case 'profile':
        case 'summary':
          const profileElement = document.getElementById('profile-text');
          if (profileElement) {
            let cleanedContent = generatedContent
              .replace(/^#{1,6}\s+.+$/gm, '')
              .replace(/\*\*(.+?)\*\*/g, '$1')
              .replace(/\*(.+?)\*/g, '$1')
              .trim();

            const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim().length > 50);
            const actualSummary = paragraphs.find(p =>
              !p.toLowerCase().includes('here are') &&
              !p.toLowerCase().includes('of course') &&
              !p.toLowerCase().includes('choose the option') &&
              !p.toLowerCase().includes('pro-tip') &&
              p.length > 100
            );

            const finalContent = actualSummary?.trim() || paragraphs[0]?.trim() || cleanedContent;
            profileElement.textContent = finalContent;
          }
          break;
        case 'skills':
          const skillsElement = document.querySelector('[data-section="skills"] ul');
          if (skillsElement) {
            const skills = generatedContent.split('\n')
              .map(skill => skill.replace(/^[•\-*]\s*/, '').trim())
              .filter(skill => skill.length > 0);
            skillsElement.innerHTML = skills.map(skill =>
              `<li class="relative group" contentEditable suppressContentEditableWarning>${skill}<div class="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10"><button data-action="duplicate" class="text-gray-600 rounded p-1 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button><button data-action="delete" class="text-gray-600 rounded p-1 shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg></button></div></li>`
            ).join('');
          }
          break;
      }
    } catch (error) {
      alert('Failed to generate content. Please check your API key and try again.');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.template23Refs = {
        cvRef,
        editorContainerRef
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.template23Refs;
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef} data-cv-page>
          <div className="w-[210mm] h-[297mm] bg-white shadow-lg flex" onClick={handleButtonClick} style={{WebkitFontSmoothing: 'antialiased', textRendering: 'geometricPrecision', imageRendering: 'crisp-edges'}}>
          {/* Left Sidebar */}
          <div className="w-1/3 bg-gray-300 p-8 pt-12 relative">
            {/* Profile Image */}
            <div 
              className="absolute left-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => document.getElementById('profileImageInput').click()}
            >
              <img src={profileImage || '/templateprofile/template23profile.jpeg'} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <input
              id="profileImageInput"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <div className="mt-48">
              {/* Contact Section */}
              <div className="mb-8">
                <h3 className="text-teal-700 font-bold text-sm mb-4 tracking-wider" contentEditable suppressContentEditableWarning>CONTACT</h3>
                <div className="space-y-3 text-xs text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="text-teal-700">📞</span>
                    <span contentEditable suppressContentEditableWarning>123-456-7890</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-700">✉️</span>
                    <span className="break-all" contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-teal-700">📍</span>
                    <span contentEditable suppressContentEditableWarning>123 Anywhere St., Any City</span>
                  </div>
                </div>
              </div>

              {/* Education Section */}
              <div className="mb-8">
                <h3 className="text-teal-700 font-bold text-sm mb-4 tracking-wider" contentEditable suppressContentEditableWarning>EDUCATION</h3>

                <div className="mb-4 relative group">
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                  </div>
                  <p className="text-xs font-bold text-gray-800" contentEditable suppressContentEditableWarning>2028 - 2030</p>
                  <p className="text-xs font-bold text-gray-800 mb-2" contentEditable suppressContentEditableWarning>WARDIERE UNIVERSITY</p>
                  <ul className="text-xs text-gray-700 ml-4">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Master of Business Management</span>
                    </li>
                  </ul>
                </div>

                <div className="relative group">
                  <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                  </div>
                  <p className="text-xs font-bold text-gray-800" contentEditable suppressContentEditableWarning>2024 - 2028</p>
                  <p className="text-xs font-bold text-gray-800 mb-2" contentEditable suppressContentEditableWarning>WARDIERE UNIVERSITY</p>
                  <ul className="text-xs text-gray-700 ml-4">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Bachelor of Business Management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>GPA: 3.8 / 4.0</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mb-8 section-container" data-section="skills">
                <div className="relative flex gap-2 group">
                  <h3 className="text-teal-700 font-bold text-sm mb-4 tracking-wider" contentEditable suppressContentEditableWarning>SKILLS</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <AISparkle className='mt-1' section="Skills" onGenerate={handleAIGenerate} />
                  </div>
                </div>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Project Management</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Public Relations</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Teamwork</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Time Management</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Leadership</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Effective Communication</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>Critical Thinking</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Languages Section */}
              <div>
                <h3 className="text-teal-700 font-bold text-sm mb-4 tracking-wider" contentEditable suppressContentEditableWarning>LANGUAGES</h3>
                <ul className="text-xs text-gray-700 space-y-1">
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning><span className="font-bold">English</span> (Fluent)</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning><span className="font-bold">French</span> (Fluent)</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning><span className="font-bold">Mandarin</span> (Fluent)</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                  <li className="flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning><span className="font-bold">Spanish</span> (Intermediate)</span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="w-2/3 p-8 pt-24 relative">
            {/* Header */}
            <div className="mb-8">
              <div className="absolute top-0 right-0 left-0 bg-teal-700 text-white py-12 px-8 ">
                <h1 className="text-2xl font-bold tracking-wide" contentEditable suppressContentEditableWarning>LORNA ALVARADO</h1>
                <p className="text-xs tracking-widest" contentEditable suppressContentEditableWarning>MARKETING MANAGER</p>
              </div>
            </div>


            <div className="mt-20">
              {/* Profile Section */}
              <div className="mb-6 section-container group" data-section="profile">
                <div className="flex items-center gap-2 mb-2 relative">
                  <h3 className="text-teal-700 font-bold text-sm tracking-wider" contentEditable suppressContentEditableWarning>PROFILE</h3>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <AISparkle section="Profile" onGenerate={handleAIGenerate} />
                  </div>
                </div>
                <p id="profile-text" className="text-xs text-gray-700 leading-relaxed text-justify" contentEditable suppressContentEditableWarning>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>

              {/* Work Experience Section */}
              <div className="mb-6">
                <h3 className="text-teal-700 font-bold text-sm mb-3 tracking-wider" contentEditable suppressContentEditableWarning>WORK EXPERIENCE</h3>

                {/* Borcelle Studio */}
                <div className="mb-4 relative group">
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-gray-800" contentEditable suppressContentEditableWarning>Borcelle Studio</p>
                      <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                    </div>
                    <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>2030 - PRESENT</p>
                  </div>
                  <ul className="text-xs text-gray-700 ml-4 space-y-1">
                    <li className="flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Develop and execute comprehensive marketing strategies and campaigns that align with the company's goals and objectives.</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </li>
                    <li className="flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Lead, mentor, and manage the marketing, marketing team fostering a collaborative and results-driven work environment.</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </li>
                    <li className="flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Manage budgets and allocate resources effectively.</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Fauget Studio */}
                <div className="mb-4 relative group">
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-gray-800" contentEditable suppressContentEditableWarning>Fauget Studio</p>
                      <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                    </div>
                    <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>2025 - 2029</p>
                  </div>
                  <ul className="text-xs text-gray-700 ml-4 space-y-1">
                    <li className="flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Create and manage the marketing budget, ensuring the efficient allocation of resources and optimizing ROI.</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </li>
                    <li className="flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Oversee market research to identify emerging trends, customer needs, and competitive strategies.</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </li>
                    <li className="flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Monitor and analyze the consistency across all marketing channels.</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Studio Shodwe */}
                <div className="relative group">
                  <div className="absolute -right-4 -top-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md"><CopyPlus className="w-4 h-4" /></button>
                    <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs font-bold text-gray-800" contentEditable suppressContentEditableWarning>Studio Shodwe</p>
                      <p className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>Marketing Manager & Specialist</p>
                    </div>
                    <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>2024 - 2025</p>
                  </div>
                  <ul className="text-xs text-gray-700 ml-4 space-y-1">
                    <li className="flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Develop and execute comprehensive marketing strategies and campaigns that align with the company's goals and objectives.</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </li>
                    <li className="flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Lead, mentor, and manage the marketing team and collaborate with other departments to ensure a cohesive brand message.</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </li>
                    <li className="flex items-start relative group">
                      <span className="mr-2">•</span>
                      <span contentEditable suppressContentEditableWarning>Fostering a collaborative and results-driven work environment.</span>
                      <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                        <button data-action="duplicate" className="text-gray-600 rounded p-1 shadow-md"><CopyPlus className="w-3 h-3" /></button>
                        <button data-action="delete" className="text-gray-600 rounded p-1 shadow-md"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Projects Section */}
              <div>
                <h3 className="text-teal-700 font-bold text-sm mb-3 tracking-wider" contentEditable suppressContentEditableWarning>PROJECTS</h3>
                <div className="space-y-3">
                  {/* Project 1 */}
                  <div className="relative group">
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md"><CopyPlus className="w-4 h-4" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <p className="text-xs font-bold text-gray-800" contentEditable suppressContentEditableWarning>E-Commerce Platform Redesign</p>
                    <p className="text-xs text-gray-700 mt-3" contentEditable suppressContentEditableWarning>Led a complete redesign of the company's e-commerce platform, resulting in a 40% increase in conversion rates and improved user experience.</p>
                  </div>
                  {/* Project 2 */}
                  <div className="relative group">
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md"><CopyPlus className="w-4 h-4" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <p className="text-xs font-bold text-gray-800" contentEditable suppressContentEditableWarning>Social Media Campaign Launch</p>
                    <p className="text-xs text-gray-700 mt-3" contentEditable suppressContentEditableWarning>Developed and executed a multi-channel social media campaign that increased brand awareness by 60% and generated 10,000+ new leads.</p>
                  </div>
                   <div className="relative group">
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md"><CopyPlus className="w-4 h-4" /></button>
                      <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <p className="text-xs font-bold text-gray-800" contentEditable suppressContentEditableWarning>E-Commerce Platform Redesign</p>
                    <p className="text-xs text-gray-700 mt-3" contentEditable suppressContentEditableWarning>Developed and executed a multi-channel social media campaign that increased brand awareness by 60% and generated 10,000+ new leads.</p>
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
}