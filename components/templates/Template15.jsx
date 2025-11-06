"use client";
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Link as LinkIcon, Briefcase, BookOpen, MessageCircle, Trash2, CopyPlus, Download } from 'lucide-react';

// Add these imports for PDF functionality
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- INITIAL RESUME DATA ---
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

// --- HELPER COMPONENTS ---
const SectionTitle = ({ title, icon: Icon }) => (
  <div className="mb-2">
    <h2 className="text-sm font-bold tracking-widest uppercase text-gray-800 flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-2 text-gray-700" />}
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

const EducationSection = ({ data, onUpdate, onDelete, onDuplicate }) => {
  return (
    <>
      <SectionTitle title="EDUCATION" icon={BookOpen} />
      <div className="space-y-4">
        {data.map((edu, index) => (
          <div key={index} className="text-xs group relative pr-16">
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
            <div className="absolute top-1 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DuplicateButton onClick={() => onDuplicate(index)} />
                <DeleteButton onClick={() => onDelete(index)} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

const SkillsSection = ({ data, onUpdate, onDelete, onDuplicate }) => (
  <>
    <SectionTitle title="SKILLS" icon={Briefcase} />
    <ul className="text-xs space-y-1 list-none p-0">
      {data.map((skill, index) => (
        <li key={index} className="flex items-start group relative pr-16">
          <span className="text-gray-800 mr-2 transform -translate-y-[1px]">•</span>
          <EditableText
            value={skill}
            onUpdate={(newValue) => onUpdate(index, newValue)}
            className="text-gray-700 flex-1"
          />
          <div className="absolute top-1 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <DuplicateButton onClick={() => onDuplicate(index)} isSmall={true} />
            <DeleteButton onClick={() => onDelete(index)} isSmall={true} />
          </div>
        </li>
      ))}
    </ul>
  </>
);

const LanguagesSection = ({ data, onUpdate, onDelete, onDuplicate }) => {
  return (
    <>
      <SectionTitle title="LANGUAGES" icon={MessageCircle} />
      <div className="text-xs space-y-1">
        {data.map((lang, index) => (
          <p key={index} className="text-gray-700 group relative pr-16">
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
            <div className="absolute top-1 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DuplicateButton onClick={() => onDuplicate(index)} />
                <DeleteButton onClick={() => onDelete(index)} />
            </div>
          </p>
        ))}
      </div>
    </>
  );
};

const ProfileSection = ({ data, onUpdate }) => {
    const MAX_LENGTH = 500;
    const currentLength = data.length;

    return (
        <div className="mb-6">
            <div className="flex justify-between items-end">
                <SectionTitle title="PROFILE" />
            </div>
            <EditableText
                type="div"
                value={data}
                onUpdate={onUpdate}
                className="text-sm text-gray-700 leading-relaxed text-justify"
            />
        </div>
    );
};

const ExperienceEntry = ({ entry, index, onUpdate, onDetailUpdate, onDetailDuplicate, onDetailDelete, onDelete, onDuplicate }) => {
  return (
    <div className="mb-4 group relative pr-16">
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
          <li key={detailIndex} className="flex items-start group/detail relative pr-16">
            <span className="text-gray-800 mr-2 transform translate-y-[1px]">•</span>
            <EditableText
              value={detail}
              onUpdate={(newValue) => onDetailUpdate(index, detailIndex, newValue)}
              className="text-gray-700 flex-1 leading-relaxed"
            />
            <div className="absolute top-0 right-0 flex space-x-1 opacity-0 group-hover/detail:opacity-100 transition-opacity">
                <DuplicateButton onClick={() => onDetailDuplicate(index, detailIndex)} isSmall={true} />
                <DeleteButton onClick={() => onDetailDelete(index, detailIndex)} isSmall={true} />
            </div>
          </li>
        ))}
      </ul>
      <div className="absolute -top-1 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <DuplicateButton onClick={() => onDuplicate(index)} isMain={true} />
        <DeleteButton onClick={() => onDelete(index)} isMain={true} />
      </div>
    </div>
  );
};

const ExperienceSection = ({ data, ...handlers }) => {
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
          onDetailDuplicate={handlers.onDetailDuplicate}
          onDetailDelete={handlers.onDetailDelete}
          onDelete={handlers.onDelete}
          onDuplicate={handlers.onDuplicate}
        />
      ))}
    </div>
  );
};

const ReferencesSection = ({ data, onUpdate, onDelete, onDuplicate }) => {
  return (
    <div>
      <SectionTitle title="REFERENCES" />
      <div className="flex justify-between text-xs mt-3">
        {data.map((ref, index) => (
          <div key={index} className="w-1/2 mb-4 group relative pr-16">
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
            <div className="absolute top-1 right-0 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <DuplicateButton onClick={() => onDuplicate(index)} />
                <DeleteButton onClick={() => onDelete(index)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- ACTION BUTTONS ---
const DuplicateButton = ({ onClick, isSmall = false, isMain = false }) => (
  <button
    onClick={onClick}
    title="Duplicate Item"
    className={`text-gray-500 hover:text-gray-700 p-1 rounded-full`}
  >
    <CopyPlus className={isSmall ? 'w-3 h-3' : 'w-4 h-4'} />
  </button>
);

const DeleteButton = ({ onClick, isSmall = false, isMain = false }) => (
  <button
    onClick={onClick}
    title="Delete Item"
    className={`text-red-500 hover:text-red-700 p-1 rounded-full`}
  >
    <Trash2 className={isSmall ? 'w-3 h-3' : 'w-4 h-4'} />
  </button>
);

// --- PDF DOWNLOAD BUTTON ---
const DownloadPDFButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="fixed top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50 transition-colors"
    title="Download as PDF"
  >
    <Download className="w-4 h-4" />
    Download PDF
  </button>
);

// --- MAIN APP COMPONENT ---
const App = () => {
  const [resume, setResume] = useState(initialResumeData);
  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // PDF Download Function
  const downloadPDF = useCallback(async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    const cvElement = cvRef.current;

    if (!cvElement) {
      console.error("No CV page found to download.");
      setIsGeneratingPDF(false);
      return;
    }

    const parentContainer = editorContainerRef.current;
    if (!parentContainer) {
      console.error("Could not find parent scaling container.");
      setIsGeneratingPDF(false);
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let oldTransform, oldTransition;

    try {
      // Save old scale and set to normal
      oldTransform = parentContainer.style.transform;
      oldTransition = parentContainer.style.transition;
      parentContainer.style.transform = "scale(1)";
      parentContainer.style.transition = "none";
      
      // Wait for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        ignoreElements: (el) => {
          // Hide interactive elements for PDF
          return el.tagName === "BUTTON" || 
                 el.classList.contains('group-hover:opacity-100') ||
                 el.classList.contains('opacity-0');
        }
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Use the resume name for the filename
      const fileName = `${resume.name.replace(/\s+/g, '_')}_Resume.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      // Restore original scale
      parentContainer.style.transform = oldTransform;
      parentContainer.style.transition = oldTransition;
      setIsGeneratingPDF(false);
    }
  }, [isGeneratingPDF, resume.name]);

  const handleTopLevelUpdate = useCallback((key, newValue) => {
      const MAX_PROFILE_LENGTH = 500; 
      if (key === 'profile' && newValue.length > MAX_PROFILE_LENGTH) {
          newValue = newValue.substring(0, MAX_PROFILE_LENGTH);
      }
      setResume(prev => ({ ...prev, [key]: newValue }));
  }, []);

  const handleListItemUpdate = useCallback((listKey, index, field, newValue) => {
    setResume(prev => {
      const updatedList = prev[listKey].map((item, i) =>
        i === index ? { ...item, [field]: newValue } : item
      );
      return { ...prev, [listKey]: updatedList };
    });
  }, []);

  const handleSimpleListUpdate = useCallback((index, newValue) => {
    setResume(prev => {
      const updatedList = prev.skills.map((item, i) =>
        i === index ? newValue : item
      );
      return { ...prev, skills: updatedList };
    });
  }, []);

  const handleDeleteItem = useCallback((listKey, index) => {
    setResume(prev => ({
      ...prev,
      [listKey]: prev[listKey].filter((_, i) => i !== index),
    }));
  }, []);
  
  const handleDuplicateItem = useCallback((listKey, index) => {
    setResume(prev => {
        const itemToDuplicate = JSON.parse(JSON.stringify(prev[listKey][index]));
        const updatedList = [
            ...prev[listKey].slice(0, index + 1),
            itemToDuplicate,
            ...prev[listKey].slice(index + 1)
        ];
        return { ...prev, [listKey]: updatedList };
    });
  }, []);

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

  const handleDetailDuplicate = useCallback((expIndex, detailIndex) => {
    setResume(prev => {
      const updatedExperience = prev.workExperience.map((exp, i) => {
        if (i === expIndex) {
            const detailToDuplicate = exp.details[detailIndex];
            const updatedDetails = [
                ...exp.details.slice(0, detailIndex + 1),
                detailToDuplicate,
                ...exp.details.slice(detailIndex + 1)
            ];
            return { ...exp, details: updatedDetails };
        }
        return exp;
      });
      return { ...prev, workExperience: updatedExperience };
    });
  }, []);

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

  // CV Page Component
  const CVPage = () => (
    <div className="w-[210mm] h-[297mm] bg-white shadow-2xl rounded-lg border border-gray-300 p-12 mx-auto">
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
      <div className="grid grid-cols-3 gap-6 pt-2">
        {/* Left Column */}
        <div className="col-span-1 space-y-6">
          <ContactSection
            data={resume.contact}
            onUpdate={(index, field, val) => handleListItemUpdate('contact', index, field, val)}
          />
          <EducationSection
            data={resume.education}
            onUpdate={(index, field, val) => handleListItemUpdate('education', index, field, val)}
            onDelete={(index) => handleDeleteItem('education', index)}
            onDuplicate={(index) => handleDuplicateItem('education', index)}
          />
          <SkillsSection
            data={resume.skills}
            onUpdate={handleSimpleListUpdate}
            onDelete={(index) => handleDeleteItem('skills', index)}
            onDuplicate={(index) => handleDuplicateItem('skills', index)}
          />
          <LanguagesSection
            data={resume.languages}
            onUpdate={(index, field, val) => handleListItemUpdate('languages', index, field, val)}
            onDelete={(index) => handleDeleteItem('languages', index)}
            onDuplicate={(index) => handleDuplicateItem('languages', index)}
          />
        </div>

        {/* Right Column */}
        <div className="col-span-2 relative pl-6 border-l border-gray-300 space-y-6">
          <ProfileSection
            data={resume.profile}
            onUpdate={(val) => handleTopLevelUpdate('profile', val)}
          />
          <ExperienceSection
            data={resume.workExperience}
            onUpdate={(index, field, val) => handleListItemUpdate('workExperience', index, field, val)}
            onDetailUpdate={handleDetailUpdate}
            onDetailDuplicate={handleDetailDuplicate}
            onDetailDelete={handleDetailDelete}
            onDelete={(index) => handleDeleteItem('workExperience', index)}
            onDuplicate={(index) => handleDuplicateItem('workExperience', index)}
          />
          <ReferencesSection
            data={resume.references}
            onUpdate={(index, field, val) => handleListItemUpdate('references', index, field, val)}
            onDelete={(index) => handleDeleteItem('references', index)}
            onDuplicate={(index) => handleDuplicateItem('references', index)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      {/* PDF Download Button */}
      <DownloadPDFButton onClick={downloadPDF} />
      
      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Generating PDF...</span>
          </div>
        </div>
      )}

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
};

export default App;