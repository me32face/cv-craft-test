"use client";
import React, { useState, useCallback } from 'react';
import { Mail, Phone, MapPin, Link as LinkIcon, Briefcase, BookOpen, MessageCircle, Trash2, Plus } from 'lucide-react';

// --- INITIAL RESUME DATA (Now the initial state) ---
const initialResumeData = {
  name: "RICHARD SANCHEZ",
  title: "MARKETING MANAGER",
  contact: [
    { type: 'Phone', field: 'value', value: '+1-234-567-8900', icon: Phone },
    { type: 'Email', field: 'value', value: 'hello@reallygreatsite.com', icon: Mail },
    { type: 'Address', field: 'value', value: '123 Anywhere St., Any City', icon: MapPin },
    { type: 'Website', field: 'value', value: 'www.reallygreatsite.com', icon: LinkIcon }
  ],
  profile: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Ut enim ad minim veniam, quis nostrud exercitation.",
  education: [
    { years: '2029 - 2030', degree: 'Master of Business Management', institution: 'WARDIERE UNIVERSITY', gpa: null },
    { years: '2025 - 2029', degree: 'Bachelor of Business', institution: 'WARDIERE UNIVERSITY', gpa: 'GPA: 3.8 / 4.0' },
  ],
  skills: [
    'Project Management', 'Public Relations', 'Teamwork', 'Time Management',
    'Leadership', 'Effective Communication', 'Critical Thinking',
  ],
  languages: [
    { lang: 'English', proficiency: 'Fluent' },
    { lang: 'French', proficiency: 'Fluent' },
    { lang: 'German', proficiency: 'Basics' },
    { lang: 'Spanish', proficiency: 'Intermediate' },
  ],
  workExperience: [
    {
      title: 'Marketing Manager & Specialist', company: 'Borcelle Studio', years: '2030 - PRESENT',
      details: [
        'Develop and execute comprehensive marketing strategies and campaigns that align with the company\'s goals and objectives.',
        'Lead, mentor, and manage a high-performing marketing team, fostering a collaborative and results-driven work environment.',
        'Monitor brand consistency across marketing channels and materials.'
      ]
    },
    {
      title: 'Marketing Manager & Specialist', company: 'Fauget Studio', years: '2026 - 2029',
      details: [
        'Create and manage the marketing budget, ensuring efficient allocation of resources and optimizing ROI.',
        'Oversee market research to identify emerging trends, customer needs, and competitor strategies.',
        'Monitor brand consistency across marketing channels and materials.'
      ]
    },
  ],
  references: [
    { name: 'Estelle Darcy', title: 'Wardiere Inc. / CTO', phone: '123-456-7890', email: 'hello@reallygreatsite.com' },
    { name: 'Harper Richard', title: 'Wardiere Inc. / CEO', phone: '123-456-7890', email: 'hello@reallygreatsite.com' },
  ]
};

// --- GENERIC EDITABLE COMPONENTS ---

/**
 * Text component that allows in-place editing.
 * @param {string} value - The current text value.
 * @param {function} onUpdate - Callback function (newValue) => void.
 * @param {string} className - Tailwind classes for styling.
 * @param {string} type - 'p' for paragraph (default) or 'h1', 'h2', etc.
 */
const EditableText = ({ value, onUpdate, className, type = 'p' }) => {
  const Tag = type;
  return (
    <Tag
      className={`focus:outline-none focus:ring-1 focus:ring-blue-400 focus:bg-blue-50/50 rounded cursor-pointer ${className}`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onUpdate(e.target.innerText.trim())}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
};

// --- HELPER COMPONENTS (REFACTORED) ---

const SectionTitle = ({ title, icon: Icon }) => (
  <div className="mb-2">
    <h2 className="text-sm font-bold tracking-widest uppercase text-gray-800 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-700 hidden sm:inline" />}
      {title}
    </h2>
    <hr className="border-t-2 border-gray-400 mt-1" />
  </div>
);

const ContactSection = ({ data, onUpdate }) => (
  <>
    <SectionTitle title="CONTACT" icon={Phone} />
    <div className="text-xs space-y-2">
      {data.map((item, index) => (
        <div key={index} className="flex items-start">
          <item.icon className="w-3.5 h-3.5 mr-3 mt-1 text-gray-600 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-gray-700 font-semibold">{item.type}: </span>
            <EditableText
              value={item.value}
              onUpdate={(newValue) => onUpdate(index, 'value', newValue)}
              className="inline text-gray-600"
            />
          </div>
        </div>
      ))}
    </div>
  </>
);

const EducationSection = ({ data, onUpdate, onDelete, onAdd }) => {
  const newEducation = { years: 'YYYY - YYYY', degree: 'New Degree', institution: 'New University', gpa: null };
  return (
    <>
      <SectionTitle title="EDUCATION" icon={BookOpen} />
      <div className="space-y-4">
        {data.map((edu, index) => (
          <div key={index} className="text-xs group relative pr-8">
            <EditableText
              value={edu.years}
              onUpdate={(newValue) => onUpdate(index, 'years', newValue)}
              className="font-bold text-gray-800"
            />
            <EditableText
              value={edu.institution}
              onUpdate={(newValue) => onUpdate(index, 'institution', newValue)}
              className="text-gray-800 font-semibold"
            />
            <EditableText
              value={edu.degree}
              onUpdate={(newValue) => onUpdate(index, 'degree', newValue)}
              className="text-gray-700"
            />
            <EditableText
              value={edu.gpa || "GPA: x.x / x.x"}
              onUpdate={(newValue) => onUpdate(index, 'gpa', newValue)}
              className="text-gray-600 mt-0.5"
            />
            <DeleteButton onClick={() => onDelete(index)} />
          </div>
        ))}
        <AddButton onClick={() => onAdd(newEducation)} label="Add Education" />
      </div>
    </>
  );
};

const SkillsSection = ({ data, onUpdate, onDelete, onAdd }) => (
  <>
    <SectionTitle title="SKILLS" icon={Briefcase} />
    <ul className="text-xs space-y-1 list-none p-0">
      {data.map((skill, index) => (
        <li key={index} className="flex items-start group relative pr-8">
          <span className="text-gray-800 mr-2 transform -translate-y-[1px]">•</span>
          <EditableText
            value={skill}
            onUpdate={(newValue) => onUpdate(index, newValue)}
            className="text-gray-700 flex-1"
          />
          <DeleteButton onClick={() => onDelete(index)} />
        </li>
      ))}
    </ul>
    <AddButton onClick={() => onAdd('New Skill')} label="Add Skill" />
  </>
);

const LanguagesSection = ({ data, onUpdate, onDelete, onAdd }) => {
  const newLang = { lang: 'New Language', proficiency: 'Proficiency' };
  return (
    <>
      <SectionTitle title="LANGUAGES" icon={MessageCircle} />
      <div className="text-xs space-y-1">
        {data.map((lang, index) => (
          <p key={index} className="text-gray-700 group relative pr-8">
            <EditableText
              value={lang.lang}
              onUpdate={(newValue) => onUpdate(index, 'lang', newValue)}
              className="font-semibold inline"
            />
            {' '}
            (<EditableText
              value={lang.proficiency}
              onUpdate={(newValue) => onUpdate(index, 'proficiency', newValue)}
              className="inline"
            />)
            <DeleteButton onClick={() => onDelete(index)} />
          </p>
        ))}
        <AddButton onClick={() => onAdd(newLang)} label="Add Language" />
      </div>
    </>
  );
};

const ProfileSection = ({ data, onUpdate }) => {
    // Add these two lines to calculate current length and limit
    const MAX_LENGTH = 500;
    const currentLength = data.length;
    
    return (
        <div className="mb-6">
            {/* Display character count next to the title */}
            <div className="flex justify-between items-end">
                <SectionTitle title="PROFILE" />
                {/* <span className={`text-xs font-semibold ${currentLength > MAX_LENGTH ? 'text-red-600' : 'text-gray-500'}`}>
                    {currentLength}/{MAX_LENGTH}
                </span> */}
            </div>

            <EditableText
                type="div"
                value={data}
                onUpdate={onUpdate}
                // Ensure to keep the profile text visually readable and expansive
                className="text-sm text-gray-700 leading-relaxed text-justify"
            />
        </div>
    );
};

const ExperienceEntry = ({ entry, index, onUpdate, onDetailUpdate, onDetailAdd, onDetailDelete, onDelete }) => {
  return (
    <div className="mb-4 group relative pr-8">
      <div className="flex justify-between items-start text-sm">
        <EditableText
          value={entry.company}
          onUpdate={(newValue) => onUpdate(index, 'company', newValue)}
          className="font-bold text-gray-800"
          type="h3"
        />
        <EditableText
          value={entry.years}
          onUpdate={(newValue) => onUpdate(index, 'years', newValue)}
          className="text-xs font-bold text-gray-600 whitespace-nowrap"
        />
      </div>
      <EditableText
        value={entry.title}
        onUpdate={(newValue) => onUpdate(index, 'title', newValue)}
        className="text-sm italic text-gray-700 font-semibold mt-0.5 mb-1"
      />

      <ul className="text-xs list-none p-0 ml-1 space-y-1">
        {entry.details.map((detail, detailIndex) => (
          <li key={detailIndex} className="flex items-start group/detail relative pr-8">
            <span className="text-gray-800 mr-2 transform translate-y-[1px]">•</span>
            <EditableText
              value={detail}
              onUpdate={(newValue) => onDetailUpdate(index, detailIndex, newValue)}
              className="text-gray-700 flex-1 leading-relaxed"
            />
            <DeleteButton onClick={() => onDetailDelete(index, detailIndex)} isSmall={true} />
          </li>
        ))}
        <AddButton onClick={() => onDetailAdd(index)} label="Add Detail" isSmall={true} />
      </ul>
      <DeleteButton onClick={() => onDelete(index)} isMain={true} />
    </div>
  );
};

const ExperienceSection = ({ data, ...handlers }) => {
  const newExp = {
    title: 'New Position Title',
    company: 'New Company Name',
    years: 'YYYY - YYYY',
    details: ['Responsible for new initiative.']
  };
  return (
    <div className="mb-6">
      <SectionTitle title="WORK EXPERIENCE" />
      {data.map((entry, index) => (
        <ExperienceEntry
          key={index}
          entry={entry}
          index={index}
          onUpdate={handlers.onUpdate}
          onDetailUpdate={handlers.onDetailUpdate}
          onDetailAdd={handlers.onDetailAdd}
          onDetailDelete={handlers.onDetailDelete}
          onDelete={handlers.onDelete}
        />
      ))}
      <AddButton onClick={() => handlers.onAdd(newExp)} label="Add Experience" />
    </div>
  );
};

const ReferencesSection = ({ data, onUpdate, onDelete, onAdd }) => {
  const newRef = { name: 'New Referent', title: 'Title / Company', phone: '000-000-0000', email: 'email@example.com' };
  return (
    <div>
      <SectionTitle title="REFERENCES" />
      <div className="flex flex-wrap justify-between text-xs mt-3">
        {data.map((ref, index) => (
          <div key={index} className="w-full sm:w-1/2 mb-4 group relative pr-8">
            <EditableText
              value={ref.name}
              onUpdate={(newValue) => onUpdate(index, 'name', newValue)}
              className="font-bold text-gray-800"
            />
            <EditableText
              value={ref.title}
              onUpdate={(newValue) => onUpdate(index, 'title', newValue)}
              className="text-gray-700"
            />
            <p className="text-gray-700">Phone: <EditableText value={ref.phone} onUpdate={(newValue) => onUpdate(index, 'phone', newValue)} className="inline" /></p>
            <p className="text-gray-700">Email: <EditableText value={ref.email} onUpdate={(newValue) => onUpdate(index, 'email', newValue)} className="inline" /></p>
            <DeleteButton onClick={() => onDelete(index)} />
          </div>
        ))}
      </div>
      <AddButton onClick={() => onAdd(newRef)} label="Add Reference" />
    </div>
  );
};

// --- ACTION BUTTONS ---
const DeleteButton = ({ onClick, isSmall = false, isMain = false }) => (
  <button
    onClick={onClick}
    title="Delete Item"
    className={`absolute text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full ${isSmall ? 'top-1 right-0' : (isMain ? '-top-2 right-0' : 'top-1 right-0')}`}
  >
    <Trash2 className={isSmall ? 'w-3 h-3' : 'w-4 h-4'} />
  </button>
);

const AddButton = ({ onClick, label, isSmall = false }) => (
  <button
    onClick={onClick}
    className={`flex items-center text-blue-600 hover:text-blue-800 transition-colors mt-2 ${isSmall ? 'text-xs' : 'text-sm font-semibold'}`}
  >
    <Plus className={`mr-1 ${isSmall ? 'w-3 h-3' : 'w-4 h-4'}`} />
    {label}
  </button>
);


// --- MAIN APP COMPONENT ---

const App = () => {
  const [resume, setResume] = useState(initialResumeData);

  // --- STATE UPDATE HANDLERS (for top-level fields: name, title, profile) ---
  const handleTopLevelUpdate = useCallback((key, newValue) => {
      // Define the maximum length for the 'profile' field
      const MAX_PROFILE_LENGTH = 500; 

      if (key === 'profile' && newValue.length > MAX_PROFILE_LENGTH) {
          // Truncate the value if it exceeds the limit
          newValue = newValue.substring(0, MAX_PROFILE_LENGTH);
      }
      
      setResume(prev => ({ ...prev, [key]: newValue }));
  }, []);

  // --- ARRAY ITEM UPDATE HANDLERS (for structured lists: contact, education, languages, references, workExperience) ---
  const handleListItemUpdate = useCallback((listKey, index, field, newValue) => {
    setResume(prev => {
      const updatedList = prev[listKey].map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item
      );
      return { ...prev, [listKey]: updatedList };
    });
  }, []);

  // --- ARRAY ITEM UPDATE HANDLERS (for simple string lists: skills) ---
  const handleSimpleListUpdate = useCallback((index, newValue) => {
    setResume(prev => {
      const updatedList = prev.skills.map((item, i) =>
        i === index ? newValue : item
      );
      return { ...prev, skills: updatedList };
    });
  }, []);

  // --- ARRAY ITEM ADD/DELETE HANDLERS ---
  const handleAddItem = useCallback((listKey, newItem) => {
    setResume(prev => ({
      ...prev,
      [listKey]: [...prev[listKey], newItem],
    }));
  }, []);

  // --- ARRAY ITEM ADD/DELETE HANDLERS ---
  const handleDeleteItem = useCallback((listKey, index) => {
    setResume(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));
  }, []);

  // --- SPECIAL HANDLERS FOR WORK EXPERIENCE DETAILS (Nested Array) ---

  // Update a single bullet point in an experience entry
  const handleDetailUpdate = useCallback((expIndex, detailIndex, newValue) => {
    setResume(prev => {
      const updatedExperience = prev.workExperience.map((exp, i) => {
        if (i === expIndex) {
          const updatedDetails = exp.details.map((detail, j) => j === detailIndex ? newValue : detail);
          return { ...exp, details: updatedDetails };
        }
        return exp;
      });
      return { ...prev, workExperience: updatedExperience };
    });
  }, []);

  // Add a new bullet point to an experience entry
  const handleDetailAdd = useCallback((expIndex) => {
    setResume(prev => {
      const updatedExperience = prev.workExperience.map((exp, i) => {
        if (i === expIndex) {
          return { ...exp, details: [...exp.details, 'New responsibility or achievement.'] };
        }
        return exp;
      });
      return { ...prev, workExperience: updatedExperience };
    });
  }, []);

  // Delete a bullet point from an experience entry
  const handleDetailDelete = useCallback((expIndex, detailIndex) => {
    setResume(prev => {
      const updatedExperience = prev.workExperience.map((exp, i) => {
        if (i === expIndex) {
          const updatedDetails = exp.details.filter((_, j) => j !== detailIndex);
          return { ...exp, details: updatedDetails };
        }
        return exp;
      });
      return { ...prev, workExperience: updatedExperience };
    });
  }, []);


  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-inter">
      {/* Optimized for A4 size (210mm x 297mm) */}
      <div className="p-12 mx-auto bg-white shadow-2xl rounded-lg border border-gray-300"
           style={{ width: '210mm', minHeight: '297mm' }}>

        {/* --- HEADER --- */}
        <header className="mb-6 pb-2 border-b border-gray-400">
          <EditableText
            value={resume.name}
            onUpdate={(val) => handleTopLevelUpdate('name', val)}
            className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase"
            type="h1"
          />
          <EditableText
            value={resume.title}
            onUpdate={(val) => handleTopLevelUpdate('title', val)}
            className="text-lg font-medium tracking-widest uppercase text-gray-700 mt-1"
            type="p"
          />
        </header>

        {/* --- MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

          {/* Left Column (Contact, Education, Skills, Languages) */}
          <div className="md:col-span-1 space-y-6 order-2 md:order-1">
            <ContactSection
              data={resume.contact}
              onUpdate={(index, field, val) => handleListItemUpdate('contact', index, field, val)}
            />
            <EducationSection
              data={resume.education}
              onUpdate={(index, field, val) => handleListItemUpdate('education', index, field, val)}
              onDelete={(index) => handleDeleteItem('education', index)}
              onAdd={(newItem) => handleAddItem('education', newItem)}
            />
            <SkillsSection
              data={resume.skills}
              onUpdate={handleSimpleListUpdate}
              onDelete={(index) => handleDeleteItem('skills', index)}
              onAdd={(newItem) => handleAddItem('skills', newItem)}
            />
            <LanguagesSection
              data={resume.languages}
              onUpdate={(index, field, val) => handleListItemUpdate('languages', index, field, val)}
              onDelete={(index) => handleDeleteItem('languages', index)}
              onAdd={(newItem) => handleAddItem('languages', newItem)}
            />
          </div>

          {/* Right Column (Profile, Experience, References) */}
          <div className="md:col-span-2 relative md:pl-6 md:border-l md:border-gray-300 space-y-6 order-1 md:order-2">
            <ProfileSection
              data={resume.profile}
              onUpdate={(val) => handleTopLevelUpdate('profile', val)}
            />
            <ExperienceSection
              data={resume.workExperience}
              onUpdate={(index, field, val) => handleListItemUpdate('workExperience', index, field, val)}
              onDetailUpdate={handleDetailUpdate}
              onDetailAdd={handleDetailAdd}
              onDetailDelete={handleDetailDelete}
              onDelete={(index) => handleDeleteItem('workExperience', index)}
              onAdd={(newItem) => handleAddItem('workExperience', newItem)}
            />
            <ReferencesSection
              data={resume.references}
              onUpdate={(index, field, val) => handleListItemUpdate('references', index, field, val)}
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