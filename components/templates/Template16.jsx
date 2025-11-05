"use client";
import React, { useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Trash2, Plus, CopyPlus } from 'lucide-react';

// --- INITIAL RESUME DATA ---
const initialResumeData = {
  name: "HANSON JOHSON JR.",
  title: "UI/UX DESIGNER",
  contact: [
    { type: 'Email', value: 'hello@reallygreatsite.com' },
    { type: 'Phone', value: '123-456-7890' },
    { type: 'Address', value: '123 Anywhere St., Any City' },
  ],
  welcome: "WELCOME TO MY RESUME",
  profile: "Assists the department head in carrying out digital marketing companies works closely with the marketing head for digital promotions and others. My skills are excellent, and I have a strong commitment to research.",
  objective: "5+ years of experience as a Creative Director. A dynamic and strategic leader known for developing and executing inventive and creative brand-building experiences. Successful in devising and applying new ideas and innovation to build a client's company competitive advantage.",
  workExperience: [
    { yearRange: '2014 - 2016', details: 'Senior Graphic Designer\nBorcelle Studios', description: 'Post Graduated in Graphics Designing.\nAssists the department head in carrying out digital marketing companies works closely with promotions.' },
    { yearRange: '2014 - 2016', details: 'Junior Graphic Designer\nBorcelle Studios', description: 'Post Graduated in Graphics Designing.\nAssists the department head in carrying out digital marketing companies works closely with promotions.' },
    { yearRange: '2014 - 2016', details: 'Master Graphic Designer\nBorcelle Studios', description: 'Post Graduated in Graphics Designing.\nAssists the department head in carrying out digital marketing companies works closely with promotions.' },
  ],
  education: [
    { yearRange: '2005 - 2009', details: 'Bachelor Of Design\nFauget University' },
    { yearRange: '2005 - 2009', details: 'Master Of Design\nFauget University' },
  ],
  skills: [
    { name: 'Web Design', level: 90 },
    { name: 'Branding', level: 75 },
    { name: 'Photography', level: 85 },
    { name: 'Video Editing', level: 80 },
    { name: 'SEO', level: 95 },
    { name: 'Marketing', level: 88 },
  ],
  references: [
    { name: 'Harper Russo', title: 'Wardiere Inc.', phone: '123-456-7890' },
    { name: 'Francois Mercer', title: 'Wardiere Inc.', phone: '123-456-7890' },
  ],
};

// --- GENERIC EDITABLE COMPONENTS ---

/**
 * Text component that allows in-place editing, supporting multiline text via \n or <br/>
 */
const EditableText = ({ value, onUpdate, className, type = 'p', placeholder = '' }) => {
  const safeValue = value || ''; 
  const Tag = type;
  const displayValue = safeValue.replace(/\n/g, '<br/>');

  const handleBlur = (e) => {
    const text = e.target.innerHTML.replace(/<br\s*\/?>/gi, '\n').trim();
    const sanitizedText = text.replace(/&nbsp;/gi, ' ');
    onUpdate(sanitizedText);
  };

  return (
    <Tag
      className={`focus:outline-none focus:ring-1 focus:ring-gray-300 focus:bg-gray-50/50 rounded cursor-pointer ${className}`}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      dangerouslySetInnerHTML={{ __html: displayValue || placeholder }}
    />
  );
};

// --- ACTION BUTTONS (FINAL ICON-ONLY, GREY, AND ADJACENCY) ---

/**
 * Delete button: uses absolute positioning and shows only on parent group hover.
 * Grey color, positioned furthest right.
 */
const DeleteButton = ({ onClick }) => (
  <button 
    onClick={onClick} 
    className="absolute top-0 right-0 text-gray-500 bg-white rounded-full p-1 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 shadow-lg hover:text-red-700 z-10"
    aria-label="Delete item"
  >
    <Trash2 className="w-4 h-4" />
  </button>
);

/**
 * Duplicate (Add) button: uses absolute positioning and shows only on parent group hover.
 * Uses CopyPlus icon and is positioned adjacent (left) to the Delete button.
 */
const DuplicateButton = ({ onClick }) => ( 
  <button 
    onClick={onClick} 
    // Positioned right-8 (32px) which is just left of the DeleteButton (right-0)
    className={`absolute top-0 right-8 flex items-center text-gray-500 bg-white rounded-full p-1 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 shadow-lg hover:text-blue-700 z-10`}
    aria-label="Duplicate item"
  >
    <CopyPlus className="w-4 h-4" />
  </button>
);

// --- REUSABLE SECTIONS ---

const SectionHeader = ({ title, className = 'text-lg font-bold tracking-wider text-gray-800' }) => (
  <h2 className={`border-b border-gray-400 pb-1 mb-4 ${className}`}>
    {title}
  </h2>
);

// --- HEADER COMPONENT ---

const HeaderSection = ({ resume, onUpdate }) => (
  <header className="px-14 pt-14 pb-8 bg-gray-100/50 border-b border-gray-300">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-xs font-semibold tracking-widest text-gray-600 mb-2">
          RESUME
        </h1>
        <EditableText
          value={resume.name}
          onUpdate={(val) => onUpdate('name', val)}
          className="text-3xl font-extrabold tracking-tight text-gray-800 uppercase"
          type="h2"
        />
        <EditableText
          value={resume.title}
          onUpdate={(val) => onUpdate('title', val)}
          className="text-lg font-medium tracking-wide uppercase text-gray-600 mt-1"
          type="p"
        />
      </div>
      <div className="text-xs text-right space-y-1 mt-4">
        {resume.contact.map((item, index) => (
          <div key={index} className="text-gray-600">
            <span className="font-semibold">{item.type[0]}</span>
            <EditableText
              value={item.value}
              onUpdate={(val) => onUpdate('contact', index, 'value', val)}
              className="inline ml-1"
            />
          </div>
        ))}
      </div>
    </div>
  </header>
);

// --- FULL WIDTH PROFILE/OBJECTIVE SECTION ---

const WelcomeAndProfile = ({ resume, onUpdate }) => (
  <div className="px-14 pt-4 pb-4">
    <h3 className="text-xl font-normal tracking-normal text-gray-800 border-b border-gray-400 pb-1 mb-6">
      <EditableText
        value={resume.welcome}
        onUpdate={(val) => onUpdate('welcome', val)}
        className="font-normal"
        type="span"
      />
    </h3>

    <div className="relative group p-1 -m-1">
        <h3 className="text-sm font-bold tracking-widest text-gray-800 mb-2 mt-4">
          PROFILE
        </h3>
        <EditableText
          type="div"
          value={resume.profile}
          onUpdate={(val) => onUpdate('profile', val)}
          className="text-sm text-gray-700 leading-relaxed text-justify mb-6"
        />
    </div>

    <div className="relative group p-1 -m-1">
        <h3 className="text-sm font-bold tracking-widest text-gray-800 mb-2 mt-4">
          CAREER OBJECTIVE
        </h3>
        <EditableText
          type="div"
          value={resume.objective}
          onUpdate={(val) => onUpdate('objective', val)}
          className="text-sm text-gray-700 leading-relaxed text-justify"
        />
    </div>
  </div>
);

// --- REUSABLE TIMELINE SECTION (Work and Education) ---

const TimelineSection = ({ title, data, onUpdate, onDelete, onAdd, isEducation = false, isFullWidth = false }) => {
  // Logic to determine what default data to add (which will be duplicated from the current item)
  const getNewDefaults = (item) => {
    if (isEducation) {
      return item ? { ...item } : { yearRange: 'YYYY - YYYY', details: 'New Degree\nNew University' };
    } else {
      return item ? { ...item } : { yearRange: 'YYYY - YYYY', details: 'New Role\nNew Company', description: 'Key achievement or responsibility.' };
    }
  }
  
  const detailWidthClass = isFullWidth ? "w-1/3" : "w-full sm:w-1/2";
  const descriptionWidthClass = isFullWidth ? "w-2/3" : "w-full sm:w-1/2";
  const layoutClass = isFullWidth ? "flex-row" : "flex-col sm:flex-row"; 

  return (
    <div className="mt-8 relative group">
      <SectionHeader title={title} />
      <div className="space-y-4 pb-2"> 
        {data.map((item, index) => (
          // Individual item wrapper for action buttons
          <div key={index} className="flex relative group/item p-2 -m-2"> 
            
            {/* Timeline Line/Circle */}
            <div className="absolute top-2 left-0 w-3 h-3 bg-white border border-gray-500 rounded-full z-10" />
            <div className="absolute top-4 left-[5px] w-px h-full bg-gray-400 z-0" style={{ height: item.description !== undefined ? 'calc(100% - 20px)' : 'calc(100% - 10px)' }}></div>
            
            <div className={`ml-5 flex ${layoutClass} w-full items-start`}>
              
              <div className={`pr-4 space-y-0.5 ${detailWidthClass}`}>
                <EditableText
                  value={item.yearRange}
                  onUpdate={(val) => onUpdate(index, 'yearRange', val)}
                  className="text-sm font-bold text-gray-800"
                />
                <EditableText
                  value={item.details}
                  onUpdate={(val) => onUpdate(index, 'details', val)}
                  className="text-sm text-gray-700 leading-snug"
                />
              </div>

              {item.description !== undefined && (
                <div className={`mt-2 sm:mt-0 text-sm text-gray-600 ${descriptionWidthClass}`}>
                  <EditableText
                    value={item.description}
                    onUpdate={(val) => onUpdate(index, 'description', val)}
                    className="leading-relaxed"
                  />
                </div>
              )}
            </div>
            {/* DELETE button (right-0) */}
            <DeleteButton onClick={() => onDelete(index)} />
            {/* DUPLICATE button (right-8) - Duplicates the current item */}
            <DuplicateButton onClick={() => onAdd(getNewDefaults(item))} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Skills Section ---

const SkillsSection = ({ data, onUpdate, onDelete, onAdd }) => {
  // Logic to determine what default data to add (which will be duplicated from the current item)
  const getNewDefaults = (item) => {
    return item ? { ...item } : { name: 'New Skill', level: 50 };
  }

  const sanitizeLevel = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return 50; 
    return Math.min(100, Math.max(0, num));
  };

  return (
    <div className="mt-8 relative group"> 
      <SectionHeader title="MY SKILLS" />
      <div className="space-y-3 pb-2"> 
        {data.map((skill, index) => (
          <div key={index} className="text-sm group/item relative p-2 -m-2"> 
            <div className="flex justify-between items-center mb-1">
                <EditableText
                    value={skill.name}
                    onUpdate={(val) => onUpdate(index, 'name', val)}
                    className="font-medium text-gray-700"
                />
                <EditableText
                    value={String(skill.level)}
                    onUpdate={(val) => onUpdate(index, 'level', sanitizeLevel(val))}
                    className="text-xs font-semibold text-gray-500 w-8 text-right"
                    type="span"
                />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-gray-700 h-1.5 rounded-full"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
            {/* DELETE button (right-0) */}
            <DeleteButton onClick={() => onDelete(index)} />
            {/* DUPLICATE button (right-8) - Duplicates the current item */}
            <DuplicateButton onClick={() => onAdd(getNewDefaults(skill))} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- References Section ---

const ReferencesSection = ({ data, onUpdate, onDelete, onAdd }) => {
  // Logic to determine what default data to add (which will be duplicated from the current item)
  const getNewDefaults = (item) => {
    return item ? { ...item } : { name: 'New Referent', title: 'Title / Company', phone: '000-000-0000' };
  }
  return (
    <div className="mt-8 relative group">
      <SectionHeader title="REFERENCE" />
      <div className="flex flex-wrap text-sm space-y-4 pb-2"> 
        {data.map((ref, index) => (
          <div key={index} className="w-full group/item relative p-2 -m-2">
            <EditableText
              value={ref.name}
              onUpdate={(val) => onUpdate(index, 'name', val)}
              className="font-bold text-gray-800"
            />
            <EditableText
              value={ref.title}
              onUpdate={(val) => onUpdate(index, 'title', val)}
              className="text-gray-600"
            />
            <EditableText
              value={ref.phone}
              onUpdate={(val) => onUpdate(index, 'phone', val)}
              className="text-gray-600"
            />
            {/* DELETE button (right-0) */}
            <DeleteButton onClick={() => onDelete(index)} />
            {/* DUPLICATE button (right-8) - Duplicates the current item */}
            <DuplicateButton onClick={() => onAdd(getNewDefaults(ref))} />
          </div>
        ))}
      </div>
    </div>
  );
};


// --- MAIN APP COMPONENT ---

const App = () => {
  const [resume, setResume] = useState(initialResumeData);

  const handleTopLevelUpdate = useCallback((key, newValue) => {
    setResume(prev => ({ ...prev, [key]: newValue }));
  }, []);

  const handleStructuredListUpdate = useCallback((listKey, index, field, newValue) => {
    setResume(prev => {
      const updatedList = prev[listKey].map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item
      );
      return { ...prev, [listKey]: updatedList };
    });
  }, []);
  
  const handleAddItem = useCallback((listKey, newItem) => {
    setResume(prev => ({
      ...prev,
      [listKey]: [...prev[listKey], newItem],
    }));
  }, []);

  const handleDeleteItem = useCallback((listKey, index) => {
    setResume(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));
  }, []);


  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-serif">
      {/* A4 Size: w-210mm x h-297mm (approx 8.27in x 11.69in)
        We use Tailwind's arbitrary value support for precise sizing.
      */}
      <div className="w-[210mm] max-w-[210mm] mx-auto bg-white shadow-2xl min-h-[297mm] rounded-lg border border-gray-300 overflow-hidden">
        
        <HeaderSection 
          resume={resume} 
          onUpdate={(key, index, field, val) => {
            if (key === 'contact') {
              handleStructuredListUpdate('contact', index, field, val);
            } else {
              handleTopLevelUpdate(key, val);
            }
          }}
        />
        
        <WelcomeAndProfile
          resume={resume}
          onUpdate={handleTopLevelUpdate}
        />
        
        <div className="px-14 pt-0 pb-4">
          <TimelineSection
            title="WORK EXPERIENCE"
            data={resume.workExperience}
            isFullWidth={true}
            onUpdate={(index, field, val) => handleStructuredListUpdate('workExperience', index, field, val)}
            onDelete={(index) => handleDeleteItem('workExperience', index)}
            onAdd={(newItem) => handleAddItem('workExperience', newItem)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 px-14 pt-0 pb-14 gap-x-8">

          <div className="md:col-span-1 space-y-4">
            <TimelineSection
              title="EDUCATION"
              data={resume.education}
              isEducation={true}
              onUpdate={(index, field, val) => handleStructuredListUpdate('education', index, field, val)}
              onDelete={(index) => handleDeleteItem('education', index)}
              onAdd={(newItem) => handleAddItem('education', newItem)}
            />
          </div>

          <div className="md:col-span-1 space-y-4">
            <SkillsSection
              data={resume.skills}
              onUpdate={(index, field, val) => handleStructuredListUpdate('skills', index, field, val)}
              onDelete={(index) => handleDeleteItem('skills', index)}
              onAdd={(newItem) => handleAddItem('skills', newItem)}
            />
          </div>

          <div className="md:col-span-1 space-y-4">
            <ReferencesSection
              data={resume.references}
              onUpdate={(index, field, val) => handleStructuredListUpdate('references', index, field, val)}
              onDelete={(index) => handleDeleteItem('references', index)}
              onAdd={(newItem) => handleAddItem('references', newItem)}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;