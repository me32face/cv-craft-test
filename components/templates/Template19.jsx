"use client";
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, CopyPlus, Trash2, Upload } from 'lucide-react';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

// --- Data Structure ---
const initialData = {
  personal: {
    name: 'ISABEL MERCADO',
    title: 'CREATIVE DESIGNER',
    photoUrl: null, 
  },
  profile: 'Assists the department head in carrying out digital marketing companies works closely with the marketing head for digital promotions and others.',
  contact: [
    { id: crypto.randomUUID(), type: 'phone', icon: Phone, value: '+1-234-567-8900' },
    { id: crypto.randomUUID(), type: 'email', icon: Mail, value: 'Hello@reallygreatsite.com' },
    { id: crypto.randomUUID(), type: 'address', icon: MapPin, value: '123 Anywhere St., Any City' },
  ],
  skills: [
    { id: crypto.randomUUID(), name: 'Project Management', level: 5 },
    { id: crypto.randomUUID(), name: 'Problem Solving', level: 4 },
    { id: crypto.randomUUID(), name: 'Creativity', level: 5 },
    { id: crypto.randomUUID(), name: 'Leadership', level: 3 },
    { id: crypto.randomUUID(), name: 'Team Management', level: 4 },
  ],
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Really Great Company',
      role: 'Art Director',
      period: 'Oct 2020 - Present',
      details: ['Comes up with unique graphic designs for clients.', 'Works closely with the copywriting team.'],
    },
    {
      id: crypto.randomUUID(),
      company: 'Really Great Company',
      role: 'Project Manager',
      period: 'Sep 2019 - Aug 2020',
      details: ['Edited editorial photos for clients and magazines.', 'Organization of files.'],
    },
  ],
  education: [
    { id: crypto.randomUUID(), year: '2011', institution: 'Really Great University', degree: 'Bachelor of Arts in Multimedia Arts, 2012' },
    { id: crypto.randomUUID(), year: '2008', institution: 'Really Great School', degree: 'High School Graduate Diploma, 2009' },
  ],
};

// --- FIXED Reusable Editable Text Component ---
const EditableText = React.forwardRef(({ 
  tag: Tag = 'div', 
  children, 
  className = '', 
  onSave, 
  placeholder = '',
  autoResize = false,
  ...props 
}, ref) => {
  const [content, setContent] = useState(children);
  const internalRef = useRef(null);
  const actualRef = ref || internalRef;

  // Update content when children prop changes
  useEffect(() => {
    setContent(children);
  }, [children]);

  const handleInput = (e) => {
    const newContent = e.currentTarget.textContent || '';
    setContent(newContent);
    
    // Auto-resize logic
    if (autoResize && actualRef.current) {
      const element = actualRef.current;
      element.style.height = 'auto';
      element.style.height = element.scrollHeight + 'px';
    }
  };

  const handleBlur = (e) => {
    const newContent = e.currentTarget.textContent || '';
    if (newContent !== children) {
      onSave(newContent);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && Tag !== 'p' && Tag !== 'div') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const handleFocus = (e) => {
    // Select all text on focus for better UX
    const range = document.createRange();
    range.selectNodeContents(e.currentTarget);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  };

  return (
    <Tag
      ref={actualRef}
      contentEditable={true}
      suppressContentEditableWarning={true}
      onInput={handleInput}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      className={`${className} focus:outline-none focus:ring-1 focus:ring-blue-300 rounded block cursor-text transition-all duration-100 editable-text`}
      {...props}
    >
      {content}
    </Tag>
  );
});
EditableText.displayName = 'EditableText';

// --- Item Actions Component ---
const ItemActions = ({ onDuplicate, onDelete }) => (
  <div className="absolute top-0 -right-7 flex space-x-1 p-1 text-gray-500 opacity-0 group-hover:opacity-100 transition duration-150">
    <button onClick={onDuplicate} className="hover:text-black" aria-label="Duplicate item">
      <CopyPlus size={14} />
    </button>
    <button onClick={onDelete} className="hover:text-red-600" aria-label="Delete item">
      <Trash2 size={14} />
    </button>
  </div>
);

// --- Section Header Component with AI ---
const SectionHeader = ({ title, onGenerate, onTitleChange }) => (
  <div className="relative group flex items-center gap-2">
    <EditableText
      tag="h2"
      onSave={onTitleChange}
      className="text-xl font-bold uppercase tracking-widest text-gray-800 pt-4 pb-1 border-b-2 border-gray-800 mb-3 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1"
    >
      {title}
    </EditableText>
    {onGenerate && (
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <AISparkle section={title} onGenerate={onGenerate} />
      </div>
    )}
  </div>
);

// --- Photo Uploader Component ---
const PhotoUploader = ({ photoUrl, onPhotoChange }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-3 pt-2 flex flex-col items-center">
      <div 
        className="w-28 h-28 mx-auto rounded-full overflow-hidden border-3 border-gray-300 shadow-md mb-3 relative group cursor-pointer"
        onClick={handleClick}
      >
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-600 font-bold text-xs">
            Upload Photo
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-medium text-center p-2">
          Click to Change
        </div>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="hidden" 
        />
      </div>
    </div>
  );
};

// --- Resume Component (Main App) ---
const App = () => {
  const [resume, setResume] = useState(initialData);
  const [sectionTitles, setSectionTitles] = useState({
    CONTACT: 'CONTACT',
    'MY SKILLS': 'MY SKILLS',
    PROFILE: 'PROFILE',
    EXPERIENCE: 'EXPERIENCE',
    EDUCATION: 'EDUCATION'
  });
  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);

  // Force re-render when content changes to fix layout issues
  const [contentVersion, setContentVersion] = useState(0);

  const forceUpdate = useCallback(() => {
    setContentVersion(prev => prev + 1);
  }, []);

  // AI GENERATION FUNCTION
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
          let cleanedContent = generatedContent
            .replace(/^#{1,6}\s+.+$/gm, '')
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .trim();

          const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim().length > 50);
          const actualProfile = paragraphs.find(p =>
            !p.toLowerCase().includes('here are') &&
            !p.toLowerCase().includes('of course') &&
            !p.toLowerCase().includes('choose the option') &&
            !p.toLowerCase().includes('pro-tip') &&
            p.length > 100
          );

          const finalContent = actualProfile?.trim() || paragraphs[0]?.trim() || cleanedContent;
          
          setResume(prev => ({
            ...prev,
            profile: finalContent
          }));
          break;

        case 'my skills':
        case 'skills':
          const skills = generatedContent.split('\n').filter(skill => skill.trim());
          const newSkills = skills.slice(0, 8).map((skill, index) => ({
            id: crypto.randomUUID(),
            name: skill.trim(),
            level: Math.floor(Math.random() * 5) + 1
          }));
          
          setResume(prev => ({
            ...prev,
            skills: newSkills
          }));
          break;

        default:
          console.log('Generated content:', generatedContent);
      }
      
      // Force update to fix layout
      setTimeout(forceUpdate, 100);
    } catch (error) {
      alert('Failed to generate content. Please check your API key and try again.');
    }
  };

  // General updater for simple object properties
  const updateGeneralField = useCallback((key, value) => {
    setResume(prev => ({
      ...prev,
      [key]: value,
    }));
    forceUpdate();
  }, [forceUpdate]);

  // Handler for section title changes
  const handleSectionTitleChange = useCallback((section, newTitle) => {
    setSectionTitles(prev => ({
      ...prev,
      [section]: newTitle
    }));
    forceUpdate();
  }, [forceUpdate]);

  // Handler for photo change
  const handlePhotoChange = useCallback((newPhotoUrl) => {
    setResume(prev => ({
      ...prev,
      personal: { ...prev.personal, photoUrl: newPhotoUrl }
    }));
  }, []);

  // Updater for nested array items
  const updateListItem = useCallback((section, id, field, value) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
    forceUpdate();
  }, [forceUpdate]);

  // Action Handler: Duplicate an item
  const handleDuplicate = useCallback((section, item) => {
    const newItem = { ...item, id: crypto.randomUUID() };
    setResume(prev => {
      const array = prev[section];
      const index = array.findIndex(i => i.id === item.id);
      return {
        ...prev,
        [section]: [...array.slice(0, index + 1), newItem, ...array.slice(index + 1)],
      };
    });
    setTimeout(forceUpdate, 50);
  }, [forceUpdate]);

  // Action Handler: Delete an item
  const handleDelete = useCallback((section, id) => {
    setResume(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id),
    }));
    setTimeout(forceUpdate, 50);
  }, [forceUpdate]);

  // Fix layout on window resize
  useEffect(() => {
    const handleResize = () => {
      forceUpdate();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [forceUpdate]);

  // --- Enhanced Components for specific sections ---

  const ContactItem = useMemo(() => ({ item }) => {
    const Icon = item.icon || Mail;
    return (
      <div className="flex items-start group relative py-1 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors px-2">
        <Icon size={12} className="text-gray-600 mr-2 mt-0.5 flex-shrink-0" />
        <EditableText
          tag="span"
          onSave={(value) => updateListItem('contact', item.id, 'value', value)}
          className="text-m flex-grow text-gray-700 min-w-[120px]"
          placeholder={item.type === 'phone' ? 'Phone number' : item.type === 'email' ? 'Email address' : 'Contact information'}
        >
          {item.value}
        </EditableText>
        <ItemActions
          onDuplicate={() => handleDuplicate('contact', item)}
          onDelete={() => handleDelete('contact', item.id)}
        />
      </div>
    );
  }, [updateListItem, handleDuplicate, handleDelete]);

  const SkillItem = useMemo(() => ({ item }) => {
    const handleLevelClick = (newLevel) => {
      updateListItem('skills', item.id, 'level', newLevel);
    };

    return (
      <div className="group relative py-0.5 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors px-2">
        <EditableText
          tag="p"
          onSave={(value) => updateListItem('skills', item.id, 'name', value)}
          className="text-lg font-semibold mb-0.5 text-gray-800 min-w-[100px]"
          placeholder="Skill name"
        >
          {item.name}
        </EditableText>
        <div className="flex space-x-0.5">
          {[...Array(5)].map((_, i) => (
            <button
              key={i}
              onClick={() => handleLevelClick(i + 1)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-150 cursor-pointer ${i < item.level ? 'bg-gray-800' : 'bg-gray-300'}`}
              aria-label={`Set skill level to ${i + 1} for ${item.name}`}
            />
          ))}
        </div>
        <ItemActions
          onDuplicate={() => handleDuplicate('skills', item)}
          onDelete={() => handleDelete('skills', item.id)}
        />
      </div>
    );
  }, [updateListItem, handleDuplicate, handleDelete]);

  const ExperienceItem = useMemo(() => ({ item }) => (
    <div className="group relative py-2 border-b border-gray-200 last:border-b-0 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors px-2"> 
      <EditableText
        tag="h4"
        onSave={(value) => updateListItem('experience', item.id, 'company', value)}
        className="font-bold text-sm text-gray-800 min-w-[100px]"
        placeholder="Company name"
      >
        {item.company}
      </EditableText>
      <EditableText
        tag="p"
        onSave={(value) => updateListItem('experience', item.id, 'role', value)}
        className="text-lg font-semibold text-gray-700 mt-0.5 min-w-[100px]"
        placeholder="Job title"
      >
        {item.role}
      </EditableText>
      <EditableText
        tag="p"
        onSave={(value) => updateListItem('experience', item.id, 'period', value)}
        className="text-lg italic text-gray-500 mb-1 min-w-[100px]"
        placeholder="Employment period"
      >
        {item.period}
      </EditableText>
      <div className="mt-1">
        <EditableText
          tag="div"
          onSave={(value) => {
            const details = value.split('\n').filter(detail => detail.trim());
            updateListItem('experience', item.id, 'details', details);
          }}
          className="text-m space-y-0.5 min-w-[150px] min-h-[40px]"
          placeholder="• Enter job responsibilities&#10;• One per line"
        >
          {Array.isArray(item.details) ? item.details.map((detail, index) => (
            <div key={index} className="text-gray-700">
              • {detail}
            </div>
          )) : null}
        </EditableText>
      </div>
      <ItemActions
        onDuplicate={() => handleDuplicate('experience', item)}
        onDelete={() => handleDelete('experience', item.id)}
      />
    </div>
  ), [updateListItem, handleDuplicate, handleDelete]);

  const EducationItem = useMemo(() => ({ item }) => (
    <div className="group relative py-1 border-b border-gray-200 last:border-b-0 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors px-2">
      <div className="flex justify-between items-start gap-2">
        <EditableText
          tag="h4"
          onSave={(value) => updateListItem('education', item.id, 'institution', value)}
          className="font-bold text-lg flex-grow text-gray-800 min-w-[100px]"
          placeholder="Institution name"
        >
          {item.institution}
        </EditableText>
        <EditableText
          tag="span"
          onSave={(value) => updateListItem('education', item.id, 'year', value)}
          className="text-m font-bold flex-shrink-0 text-gray-800 min-w-[40px] text-right"
          placeholder="Year"
        >
          {item.year}
        </EditableText>
      </div>
      <EditableText
        tag="p"
        onSave={(value) => updateListItem('education', item.id, 'degree', value)}
        className="text-m text-gray-600 italic min-w-[150px] mt-1"
        placeholder="Degree or qualification"
      >
        {item.degree}
      </EditableText>
      <ItemActions
        onDuplicate={() => handleDuplicate('education', item)}
        onDelete={() => handleDelete('education', item.id)}
      />
    </div>
  ), [updateListItem, handleDuplicate, handleDelete]);

  // CV Page Component
  const CVPage = () => (
    <div 
      key={contentVersion}
      className="w-[210mm] h-[297mm] bg-white shadow-2xl rounded-lg border border-gray-300 overflow-hidden"
    >
      <div className="grid grid-cols-3 h-full">
        {/* LEFT COLUMN (Sidebar) */}
        <div className="col-span-1 bg-gray-50 p-6 border-r border-gray-200 h-full overflow-hidden">
          <PhotoUploader 
            photoUrl={resume.personal.photoUrl} 
            onPhotoChange={handlePhotoChange}
          />
          
          <div className="pt-1">
            <SectionHeader 
              title={sectionTitles.CONTACT} 
              onTitleChange={(value) => handleSectionTitleChange('CONTACT', value)}
            />
            <div className="mt-2 space-y-1">
              {resume.contact.map(item => <ContactItem key={item.id} item={item} />)}
            </div>
          </div>
          
          <div className="pt-1">
            <SectionHeader 
              title={sectionTitles['MY SKILLS']} 
              onGenerate={handleAIGenerate}
              onTitleChange={(value) => handleSectionTitleChange('MY SKILLS', value)}
            />
            <div className="mt-2 space-y-2">
              {resume.skills.map(item => <SkillItem key={item.id} item={item} />)}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Content) */}
        <div className="col-span-2 p-6 h-full overflow-hidden">
          <div className="mb-4">
            <EditableText
              tag="h1"
              onSave={(value) => updateGeneralField('personal', { ...resume.personal, name: value })}
              className="text-3xl font-extrabold tracking-wider text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-300 rounded px-1 min-w-[200px]"
              placeholder="Your full name"
            >
              {resume.personal.name}
            </EditableText>
            <EditableText
              tag="p"
              onSave={(value) => updateGeneralField('personal', { ...resume.personal, title: value })}
              className="inline-block px-2 py-0.5 mt-1 text-lg font-medium uppercase tracking-wider bg-gray-200 rounded-full text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-300 min-w-[150px]"
              placeholder="Your professional title"
            >
              {resume.personal.title}
            </EditableText>
          </div>

          <div data-section="profile">
            <SectionHeader 
              title={sectionTitles.PROFILE} 
              onGenerate={handleAIGenerate}
              onTitleChange={(value) => handleSectionTitleChange('PROFILE', value)}
            />
            <div className="mt-2">
              <EditableText
                tag="p"
                onSave={(value) => updateGeneralField('profile', value)}
                className="text-gray-700 text-m leading-relaxed min-h-[80px] border border-transparent hover:border-gray-200 rounded p-2 transition-colors w-full"
                placeholder="Enter your professional profile summary..."
                autoResize={true}
              >
                {resume.profile}
              </EditableText>
            </div>
          </div>

          <SectionHeader 
            title={sectionTitles.EXPERIENCE} 
            onTitleChange={(value) => handleSectionTitleChange('EXPERIENCE', value)}
          />
          <div className="mt-2 space-y-2">
            {resume.experience.map(item => <ExperienceItem key={item.id} item={item} />)}
          </div>

          <SectionHeader 
            title={sectionTitles.EDUCATION} 
            onTitleChange={(value) => handleSectionTitleChange('EDUCATION', value)}
          />
          <div className="mt-2 space-y-2">
            {resume.education.map(item => <EducationItem key={item.id} item={item} />)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 overflow-auto cursor-pointer">
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.55] origin-top transition-transform duration-500 pt-16"
      >
        <div ref={cvRef} data-cv-page>
          <CVPage />
        </div>
      </div>
    </div>
  );
};

export default App;