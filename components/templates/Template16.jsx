"use client";
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Trash2, Plus, CopyPlus } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

// --- ACTION BUTTONS ---

const DeleteButton = ({ onClick }) => (
  <button 
    onClick={onClick} 
    className="absolute top-0 right-0 text-gray-500 bg-white rounded-full p-1 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 shadow-lg hover:text-red-700 z-10"
    aria-label="Delete item"
  >
    <Trash2 className="w-3 h-3" />
  </button>
);

const DuplicateButton = ({ onClick }) => ( 
  <button 
    onClick={onClick} 
    className="absolute top-0 right-6 flex items-center text-gray-500 bg-white rounded-full p-1 opacity-0 transition-opacity duration-200 group-hover/item:opacity-100 shadow-lg hover:text-blue-700 z-10"
    aria-label="Duplicate item"
  >
    <CopyPlus className="w-3 h-3" />
  </button>
);

// --- REUSABLE SECTIONS ---

const SectionHeader = ({ title, className = 'text-base font-bold tracking-wider text-gray-800' }) => (
  <h2 className={`border-b border-gray-400 pb-1 mb-3 ${className}`}>
    {title}
  </h2>
);

// --- HEADER COMPONENT ---

const HeaderSection = ({ resume, onUpdate }) => (
  <header className="px-16 pt-16 pb-6 bg-red-100/60 border-b border-gray-300">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-xs font-semibold tracking-widest text-gray-600 mb-1">
          RESUME
        </h1>
        <EditableText
          value={resume.name}
          onUpdate={(val) => onUpdate('name', val)}
          className="text-2xl font-extrabold tracking-tight text-gray-800 uppercase"
          type="h2"
        />
        <EditableText
          value={resume.title}
          onUpdate={(val) => onUpdate('title', val)}
          className="text-base font-medium tracking-wide uppercase text-gray-600 mt-1"
          type="p"
        />
      </div>
      <div className="text-xs text-right space-y-1 mt-2">
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
  <div className="px-16 pt-3 pb-3">
    <h3 className="text-lg font-normal tracking-normal text-gray-800 border-b border-gray-400 pb-1 mb-4">
      <EditableText
        value={resume.welcome}
        onUpdate={(val) => onUpdate('welcome', val)}
        className="font-normal"
        type="span"
      />
    </h3>

    <div className="relative group p-1 -m-1">
        <h3 className="text-sm font-bold tracking-widest text-gray-800 mb-1 mt-3">
          PROFILE
        </h3>
        <EditableText
          type="div"
          value={resume.profile}
          onUpdate={(val) => onUpdate('profile', val)}
          className="text-xs text-gray-700 leading-relaxed text-justify mb-4"
        />
    </div>

    <div className="relative group p-1 -m-1">
        <h3 className="text-sm font-bold tracking-widest text-gray-800 mb-1 mt-3">
          CAREER OBJECTIVE
        </h3>
        <EditableText
          type="div"
          value={resume.objective}
          onUpdate={(val) => onUpdate('objective', val)}
          className="text-xs text-gray-700 leading-relaxed text-justify"
        />
    </div>
  </div>
);

// --- REUSABLE TIMELINE SECTION (Work and Education) ---

const TimelineSection = ({ title, data, onUpdate, onDelete, onAdd, isEducation = false, isFullWidth = false }) => {
  const getNewDefaults = (item) => {
    if (isEducation) {
      return item ? { ...item } : { yearRange: 'YYYY - YYYY', details: 'New Degree\nNew University' };
    } else {
      return item ? { ...item } : { yearRange: 'YYYY - YYYY', details: 'New Role\nNew Company', description: 'Key achievement or responsibility.' };
    }
  }
  
  const detailWidthClass = isFullWidth ? "w-1/3" : "w-full";
  const descriptionWidthClass = isFullWidth ? "w-2/3" : "w-full";
  const layoutClass = isFullWidth ? "flex-row" : "flex-col"; 

  return (
    <div className="mt-6 relative group">
      <SectionHeader title={title} />
      <div className="space-y-3 pb-1"> 
        {data.map((item, index) => (
          <div key={index} className="flex relative group/item p-1 -m-1"> 
            
            {/* Timeline Line/Circle */}
            <div className="absolute top-1 left-0 w-2 h-2 bg-white border border-gray-500 rounded-full z-10" />
            <div className="absolute top-3 left-[3px] w-px h-full bg-gray-400 z-0" style={{ height: item.description !== undefined ? 'calc(100% - 16px)' : 'calc(100% - 8px)' }}></div>
            
            <div className={`ml-4 flex ${layoutClass} w-full items-start`}>
              
              <div className={`pr-3 space-y-0.5 ${detailWidthClass}`}>
                <EditableText
                  value={item.yearRange}
                  onUpdate={(val) => onUpdate(index, 'yearRange', val)}
                  className="text-xs font-bold text-gray-800"
                />
                <EditableText
                  value={item.details}
                  onUpdate={(val) => onUpdate(index, 'details', val)}
                  className="text-xs text-gray-700 leading-snug"
                />
              </div>

              {item.description !== undefined && (
                <div className={`mt-1 text-xs text-gray-600 ${descriptionWidthClass}`}>
                  <EditableText
                    value={item.description}
                    onUpdate={(val) => onUpdate(index, 'description', val)}
                    className="leading-relaxed"
                  />
                </div>
              )}
            </div>
            <DeleteButton onClick={() => onDelete(index)} />
            <DuplicateButton onClick={() => onAdd(getNewDefaults(item))} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Skills Section ---

const SkillsSection = ({ data, onUpdate, onDelete, onAdd }) => {
  const getNewDefaults = (item) => {
    return item ? { ...item } : { name: 'New Skill', level: 50 };
  }

  const sanitizeLevel = (val) => {
    const num = parseInt(val, 10);
    if (isNaN(num)) return 50; 
    return Math.min(100, Math.max(0, num));
  };

  return (
    <div className="mt-6 relative group"> 
      <SectionHeader title="MY SKILLS" />
      <div className="space-y-2 pb-1"> 
        {data.map((skill, index) => (
          <div key={index} className="text-xs group/item relative p-1 -m-1"> 
            <div className="flex justify-between items-center mb-0.5">
                <EditableText
                    value={skill.name}
                    onUpdate={(val) => onUpdate(index, 'name', val)}
                    className="font-medium text-gray-700"
                />
                <EditableText
                    value={String(skill.level)}
                    onUpdate={(val) => onUpdate(index, 'level', sanitizeLevel(val))}
                    className="text-xs font-semibold text-gray-500 w-6 text-right"
                    type="span"
                />
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-gray-700 h-1 rounded-full"
                style={{ width: `${skill.level}%` }}
              ></div>
            </div>
            <DeleteButton onClick={() => onDelete(index)} />
            <DuplicateButton onClick={() => onAdd(getNewDefaults(skill))} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- References Section ---

const ReferencesSection = ({ data, onUpdate, onDelete, onAdd }) => {
  const getNewDefaults = (item) => {
    return item ? { ...item } : { name: 'New Referent', title: 'Title / Company', phone: '000-000-0000' };
  }
  return (
    <div className="mt-6 relative group">
      <SectionHeader title="REFERENCE" />
      <div className="flex flex-wrap text-xs space-y-2 pb-1"> 
        {data.map((ref, index) => (
          <div key={index} className="w-full group/item relative p-1 -m-1">
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
            <DeleteButton onClick={() => onDelete(index)} />
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

  // Register PDF function with global context (if available)
  useEffect(() => {
    // If you have a global PDF context, register the function here
    // Example: registerPDFFunction(downloadPDF);
    
    // For now, we'll make it available globally for testing
    if (typeof window !== 'undefined') {
      window.downloadResumePDF = downloadPDF;
    }
  }, [downloadPDF]);

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

  // CV Page Component
  const CVPage = () => (
    <div className="w-[210mm] h-[297mm] bg-white shadow-2xl rounded-lg border border-gray-300 overflow-hidden">
      
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
      
      <div className="px-16 pt-0 pb-3">
        <TimelineSection
          title="WORK EXPERIENCE"
          data={resume.workExperience}
          isFullWidth={true}
          onUpdate={(index, field, val) => handleStructuredListUpdate('workExperience', index, field, val)}
          onDelete={(index) => handleDeleteItem('workExperience', index)}
          onAdd={(newItem) => handleAddItem('workExperience', newItem)}
        />
      </div>

      <div className="grid grid-cols-3 px-16 pt-0 pb-8 gap-x-4">
        <div className="col-span-1 space-y-3">
          <TimelineSection
            title="EDUCATION"
            data={resume.education}
            isEducation={true}
            onUpdate={(index, field, val) => handleStructuredListUpdate('education', index, field, val)}
            onDelete={(index) => handleDeleteItem('education', index)}
            onAdd={(newItem) => handleAddItem('education', newItem)}
          />
        </div>

        <div className="col-span-1 space-y-3">
          <SkillsSection
            data={resume.skills}
            onUpdate={(index, field, val) => handleStructuredListUpdate('skills', index, field, val)}
            onDelete={(index) => handleDeleteItem('skills', index)}
            onAdd={(newItem) => handleAddItem('skills', newItem)}
          />
        </div>

        <div className="col-span-1 space-y-3">
          <ReferencesSection
            data={resume.references}
            onUpdate={(index, field, val) => handleStructuredListUpdate('references', index, field, val)}
            onDelete={(index) => handleDeleteItem('references', index)}
            onAdd={(newItem) => handleAddItem('references', newItem)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      {/* Loading overlay for PDF generation */}
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