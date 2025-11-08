"use client";
import React, { useState, useCallback, useRef } from 'react';

// --- Resume Data Structure ---
const initialResumeData = {
  name: 'Neil Tran',
  title: 'TEACHER',
  description: 'Dedicated educator seeking a teaching position at Lincoln Elementary School to inspire and support student success.',
  contact: {
    phone: '+1 234-567-8900',
    email: 'hello@reallygreatsite.com',
    address: '123 Anywhere St., Any City',
  },
  photoUrl: 'https://placehold.co/160x160/285F75/ffffff?text=Add+Photo',
  skills: [
    'Classroom Management',
    'Curriculum Development',
    'Differentiated Instruction',
    'Educational Technology',
    'Student Assessment',
    'Parent Communication',
  ],
  education: [
    { degree: 'M.Ed. in Curriculum and Instruction', institution: 'University of Illinois', year: '2015' },
    { degree: 'B.A. in Elementary Education', institution: 'University of Illinois', year: '2012' },
  ],
  experience: [
    { 
      title: 'Teacher', 
      company: 'Springfield Middle School', 
      duration: '2015–Present', 
      details: [
        'Taught 4th-grade students and created interactive lesson plans that met diverse learning needs.',
        'Implemented technology in the classroom to improve student engagement and understanding.',
      ]
    },
  ],
  certifications: [
    { name: 'Illinois Teaching Certification, Elementary Education', year: '2012' },
    { name: 'Google Certified Educator, Level 2', year: '22019' },
  ],
};

// --- Helper Components for Editable Fields ---

// Using inline SVGs for stability (visual equivalent of lucide-react CopyPlus)
const CopyPlusIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy-plus">
        <line x1="12" x2="12" y1="15" y2="21" />
        <line x1="15" x2="9" y1="18" y2="18" />
        <rect width="14" height="14" x="8" y="2" rx="2" ry="2" />
        <path d="M15 22H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h1" />
    </svg>
);

const TrashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash">
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

const EditableInput = ({ value, onChange, className = '', placeholder = '' }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full bg-transparent border-none focus:ring-0 outline-none ${className}`}
    placeholder={placeholder}
  />
);

const EditableTextarea = ({ value, onChange, className = '', placeholder = '' }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`w-full bg-transparent border-none focus:ring-0 outline-none resize-none ${className}`}
    placeholder={placeholder}
    rows={Math.max(2, Math.ceil(value.length / 50))} // Adjust height based on content
  />
);

const EditableHeader = ({ value, onChange, tag: Tag = 'h1', className = '' }) => (
  <Tag className={`font-extrabold ${className}`}>
    <EditableInput value={value} onChange={onChange} className="text-inherit border-none p-0" />
  </Tag>
);


// --- Main Application Component ---

const App = () => {
  const [data, setData] = useState(initialResumeData);
  const fileInputRef = useRef(null); // Reference for the hidden file input

  // Function to handle image file upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Sets the photoUrl to the base64 data URL
        updateField('photoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // General update function for top-level fields
  const updateField = useCallback((field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Update function for contact fields
  const updateContact = useCallback((field, value) => {
    setData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  }, []);

  // --- Core Array Manipulation Functions ---

  // For simple arrays (Skills)
  const updateArrayItem = useCallback((arrayName, index, value) => {
    setData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = value;
      return { ...prev, [arrayName]: newArray };
    });
  }, []);

  const removeArrayItem = useCallback((arrayName, index) => {
    setData(prev => ({ ...prev, [arrayName]: prev[arrayName].filter((_, i) => i !== index) }));
  }, []);

  const duplicateArrayItem = useCallback((arrayName, index) => {
    setData(prev => {
      const newArray = [...prev[arrayName]];
      // Insert a duplicate right after the original item
      newArray.splice(index + 1, 0, newArray[index]);
      return { ...prev, [arrayName]: newArray };
    });
  }, []);

  const addNewArrayItem = useCallback((arrayName, defaultValue) => {
      setData(prev => ({ ...prev, [arrayName]: [...prev[arrayName], defaultValue] }));
  }, []);


  // For nested object arrays (Education, Experience, Certifications)
  const updateNestedArrayItem = useCallback((arrayName, index, field, value) => {
    setData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  }, []);

  const duplicateEducationEntry = useCallback((index) => {
    setData(prev => {
      const newEducation = [...prev.education];
      const duplicatedItem = { ...newEducation[index] };
      newEducation.splice(index + 1, 0, duplicatedItem);
      return { ...prev, education: newEducation };
    });
  }, []);
  
  const duplicateCertificationEntry = useCallback((index) => {
    setData(prev => {
      const newCerts = [...prev.certifications];
      const duplicatedItem = { ...newCerts[index] };
      newCerts.splice(index + 1, 0, duplicatedItem);
      return { ...prev, certifications: newCerts };
    });
  }, []);


  const duplicateExperienceEntry = useCallback((index) => {
    setData(prev => {
      const newExperience = [...prev.experience];
      // Deep copy details array to avoid shared reference
      const duplicatedItem = { 
        ...newExperience[index], 
        details: [...newExperience[index].details] 
      };
      newExperience.splice(index + 1, 0, duplicatedItem);
      return { ...prev, experience: newExperience };
    });
  }, []);
  
  // For Experience details array
  const updateExperienceDetail = useCallback((expIndex, detailIndex, value) => {
    setData(prev => {
      const newExperience = [...prev.experience];
      const newDetails = [...newExperience[expIndex].details];
      newDetails[detailIndex] = value;
      newExperience[expIndex] = { ...newExperience[expIndex], details: newDetails };
      return { ...prev, experience: newExperience };
    });
  }, []);

  const addNewExperienceDetail = useCallback((expIndex) => {
    setData(prev => {
      const newExperience = [...prev.experience];
      newExperience[expIndex].details.push('New responsibility or achievement.');
      return { ...prev, experience: newExperience };
    });
  }, []);

  const removeExperienceDetail = useCallback((expIndex, detailIndex) => {
    setData(prev => {
      const newExperience = [...prev.experience];
      newExperience[expIndex].details = newExperience[expIndex].details.filter((_, i) => i !== detailIndex);
      return { ...prev, experience: newExperience };
    });
  }, []);
  
  const duplicateExperienceDetail = useCallback((expIndex, detailIndex) => {
    setData(prev => {
      const newExperience = [...prev.experience];
      const newDetails = [...newExperience[expIndex].details];
      const duplicatedItem = newDetails[detailIndex];
      newDetails.splice(detailIndex + 1, 0, duplicatedItem);
      newExperience[expIndex] = { ...newExperience[expIndex], details: newDetails };
      return { ...prev, experience: newExperience };
    });
  }, []);


  const SectionHeader = ({ title }) => (
    <div className="bg-cyan-600 px-4 py-2 mt-6 mb-2 print:bg-cyan-600">
      <h2 className="text-xl font-semibold text-white print:text-white">
        <EditableInput value={title} onChange={(val) => { /* Update via custom logic if necessary */ }} className="text-white border-none p-0 focus:border-none print:text-white" />
      </h2>
    </div>
  );

  // Function to handle clicking the photo area to open the file dialog
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    // A4 paper size container with proper scaling
    <div className="min-h-screen flex items-center justify-center bg-gray-200 overflow-auto cursor-pointer print:bg-white print:overflow-visible print:scale-100">
      <div
        data-editor-container
        className="flex flex-col items-center scale-[0.55] origin-top transition-transform duration-500 pt-16 print:scale-100 print:pt-0 print:items-start"
      >
        <div data-cv-page className="w-[210mm] h-[297mm] bg-white shadow-2xl rounded-lg border border-gray-300 overflow-hidden print:shadow-none print:border-0 print:rounded-none">
          <div className="w-full h-full md:flex">
            
            {/* --- Left Column (Sidebar) --- */}
            <div className="md:w-1/3 bg-[#0E7490] text-white p-6 relative flex flex-col items-center md:items-stretch print:bg-[#0E7490]">
              
              {/* Photo Section */}
              <div 
                className="w-40 h-40 rounded-full overflow-hidden mb-6 relative z-10 border-4 border-white shadow-lg cursor-pointer group print:border-4 print:border-white"
                onClick={triggerFileInput} // Trigger file selection on click
              >
                <img 
                  src={data.photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-70 print:opacity-100" 
                  onError={(e) => e.target.src = 'https://placehold.co/160x160/285F75/ffffff?text=Photo+Error'}
                />
                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Overlay text for file selection - Hidden during print */}
                <div className="absolute inset-0 flex items-center justify-center text-xs text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 print:hidden">
                    Click to Upload Photo
                </div>

                {/* Editable URL field (still available but hidden unless explicitly edited) */}
                <EditableInput 
                  value={data.photoUrl} 
                  onChange={(val) => updateField('photoUrl', val)} 
                  // Hide this input as the click handler replaces it, but keep it in case the user wants to paste a URL directly
                  className="hidden"
                  placeholder="Paste Image URL"
                />
              </div>

              {/* Contact Section */}
              <div className="mb-8 w-full">
                <h2 className="text-2xl font-bold mb-3 pb-1 print:text-white">Contact</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 print:text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.744 4.466a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.06-.54l4.466.744a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                    <EditableInput value={data.contact.phone} onChange={(val) => updateContact('phone', val)} placeholder="Phone Number" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 print:text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                    <EditableInput value={data.contact.email} onChange={(val) => updateContact('email', val)} placeholder="Email Address" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 print:text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/></svg>
                    <EditableTextarea value={data.contact.address} onChange={(val) => updateContact('address', val)} className="p-0 border-none" rows="1" placeholder="Address" />
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="w-full">
                <h2 className="text-2xl font-bold mb-3 pb-1 print:text-white">Skills</h2>
                <ul className="space-y-2 text-sm">
                  {data.skills.map((skill, index) => (
                    <li key={index} className="flex items-center group">
                      <span className="mr-2 text-cyan-400 print:text-cyan-400">•</span>
                      <EditableInput 
                        value={skill} 
                        onChange={(val) => updateArrayItem('skills', index, val)} 
                        className="p-0" 
                        placeholder="Enter Skill"
                      />
                      {/* Edit controls - hidden during print */}
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                        <button 
                          onClick={() => duplicateArrayItem('skills', index)} 
                          className="text-cyan-300 hover:text-cyan-100 text-xs"
                          title="Duplicate Skill"
                        >
                          <CopyPlusIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => removeArrayItem('skills', index)} 
                          className="text-red-300 hover:text-red-500 text-xs"
                          title="Remove Skill"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                  {/* Add New Button for empty state - hidden during print */}
                  {data.skills.length === 0 && (
                    <div className="flex justify-center mt-4 print:hidden">
                        <button 
                            onClick={() => addNewArrayItem('skills', 'New Skill')} 
                            className="text-cyan-300 hover:text-cyan-100 p-2 border border-cyan-300 rounded-full transition-colors"
                            title="Add New Skill"
                        >
                            <CopyPlusIcon className="w-6 h-6" />
                        </button>
                    </div>
                  )}
                </ul>
              </div>
            </div>

            {/* --- Right Column (Content) --- */}
            <div className="md:w-2/3 bg-[#0C4A6E] text-white p-6 print:bg-[#0C4A6E]">
              
              {/* Header */}
              <EditableHeader 
                value={data.name} 
                onChange={(val) => updateField('name', val)} 
                tag="h1" 
                className="text-5xl uppercase mb-2 print:text-white" 
              />
              <div className="bg-cyan-600 px-4 py-2 mb-6 inline-block print:bg-cyan-600">
                <h2 className="text-xl font-medium uppercase tracking-widest">
                  <EditableInput 
                    value={data.title} 
                    onChange={(val) => updateField('title', val)} 
                    className="text-white border-none p-0 focus:border-none print:text-white" 
                  />
                </h2>
              </div>

              {/* Description */}
              <SectionHeader title="Description" />
              <EditableTextarea 
                value={data.description} 
                onChange={(val) => updateField('description', val)} 
                className="text-base text-gray-200 border-none p-0 print:text-gray-200"
                placeholder="Professional Summary"
              />

              {/* Education */}
              <SectionHeader title="Education" />
              {data.education.map((edu, index) => (
                <div key={index} className="mb-4 group">
                  <div className="flex justify-between items-start">
                      <EditableInput
                        value={edu.degree}
                        onChange={(val) => updateNestedArrayItem('education', index, 'degree', val)}
                        className="text-lg font-semibold border-none w-full"
                        placeholder="Degree/Major"
                      />
                      {/* Edit controls - hidden during print */}
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                          <button 
                            onClick={() => duplicateEducationEntry(index)} 
                            className="text-cyan-300 hover:text-cyan-100 text-xs"
                            title="Duplicate Entry"
                          >
                              <CopyPlusIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeArrayItem('education', index)} 
                            className="text-red-300 hover:text-red-500 text-xs"
                            title="Remove Entry"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                      </div>
                  </div>
                  <div className="flex justify-between items-start text-sm mt-1">
                    <EditableInput
                      value={edu.institution}
                      onChange={(val) => updateNestedArrayItem('education', index, 'institution', val)}
                      className="font-light w-2/3 p-0 border-none"
                      placeholder="Institution Name"
                    />
                    <EditableInput
                      value={edu.year}
                      onChange={(val) => updateNestedArrayItem('education', index, 'year', val)}
                      className="text-right w-1/3 p-0 border-none"
                      placeholder="Year"
                    />
                  </div>
                </div>
              ))}
              {/* Add New Button for empty state - hidden during print */}
              {data.education.length === 0 && (
                <div className="flex justify-center mt-4 print:hidden">
                    <button 
                        onClick={() => addNewArrayItem('education', { degree: 'New Degree', institution: 'University', year: 'Year' })} 
                        className="text-cyan-300 hover:text-cyan-100 p-2 border border-cyan-300 rounded-full transition-colors"
                        title="Add New Education Entry"
                    >
                        <CopyPlusIcon className="w-6 h-6" />
                    </button>
                </div>
              )}


              {/* Experience */}
              <SectionHeader title="Experience" />
              {data.experience.map((exp, expIndex) => (
                <div key={expIndex} className="mb-6 border-b border-white/20 pb-4 last:border-b-0 group print:border-white/20">
                  
                  <div className="flex justify-between items-start">
                    <EditableInput
                      value={exp.title}
                      onChange={(val) => updateNestedArrayItem('experience', expIndex, 'title', val)}
                      className="text-lg font-semibold w-full"
                      placeholder="Job Title"
                    />
                    {/* Edit controls - hidden during print */}
                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                      <button 
                        onClick={() => duplicateExperienceEntry(expIndex)} 
                        className="text-cyan-300 hover:text-cyan-100 text-xs"
                        title="Duplicate Job"
                      >
                        <CopyPlusIcon className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => removeArrayItem('experience', expIndex)} 
                        className="text-red-300 hover:text-red-500 text-xs"
                        title="Remove Job"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-start text-sm mt-1">
                    <EditableInput
                      value={exp.company}
                      onChange={(val) => updateNestedArrayItem('experience', expIndex, 'company', val)}
                      className="font-light w-2/3 p-0 border-none"
                      placeholder="Company Name"
                    />
                    <EditableInput
                      value={exp.duration}
                      onChange={(val) => updateNestedArrayItem('experience', expIndex, 'duration', val)}
                      className="text-right w-1/3 p-0 border-none"
                      placeholder="Duration (e.g., 2015-Present)"
                    />
                  </div>

                  {/* Experience Details (Bullet Points) */}
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-200 print:text-gray-200">
                    {exp.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start group/detail">
                        <span className="mr-2 mt-1 text-xs">•</span>
                        <EditableTextarea
                          value={detail}
                          onChange={(val) => updateExperienceDetail(expIndex, detailIndex, val)}
                          className="p-0 border-none w-full"
                          rows="1"
                          placeholder="Detail point"
                        />
                        {/* Edit controls - hidden during print */}
                        <div className="flex space-x-2 opacity-0 group-hover/detail:opacity-100 transition-opacity mt-1 print:hidden">
                          <button 
                            onClick={() => duplicateExperienceDetail(expIndex, detailIndex)} 
                            className="text-cyan-300 hover:text-cyan-100 text-xs"
                            title="Duplicate Detail"
                          >
                            <CopyPlusIcon className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => removeExperienceDetail(expIndex, detailIndex)} 
                            className="text-red-300 hover:text-red-500 text-xs"
                            title="Remove Detail"
                          >
                            <TrashIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  {/* Add New Detail Button for empty state - hidden during print */}
                  {exp.details.length === 0 && (
                    <button 
                        onClick={() => addNewExperienceDetail(expIndex)} 
                        className="mt-2 text-xs text-cyan-300 hover:text-cyan-100 border border-cyan-300/50 px-1 py-0.5 rounded transition-colors print:hidden"
                    >
                        + Add Initial Detail
                    </button>
                  )}
                </div>
              ))}
              {/* Add New Button for empty state - hidden during print */}
              {data.experience.length === 0 && (
                <div className="flex justify-center mt-4 print:hidden">
                    <button 
                        onClick={() => addNewArrayItem('experience', { title: 'New Job Title', company: 'Company Name', duration: 'Start-End', details: ['Key achievement or responsibility.'] })} 
                        className="text-cyan-300 hover:text-cyan-100 p-2 border border-cyan-300 rounded-full transition-colors"
                        title="Add New Experience Entry"
                    >
                        <CopyPlusIcon className="w-6 h-6" />
                    </button>
                </div>
              )}


              {/* Certifications */}
              <SectionHeader title="Certifications" />
              <ul className="space-y-2 text-sm pl-4">
                {data.certifications.map((cert, index) => (
                  <li key={index} className="mb-4 group">
                    <div className="flex justify-between items-start">
                      <EditableInput
                          value={cert.name}
                          onChange={(val) => updateNestedArrayItem('certifications', index, 'name', val)}
                          className="text-lg font-semibold border-none w-full"
                          placeholder="Certification Name"
                      />
                      {/* Edit controls - hidden during print */}
                      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                          <button 
                            onClick={() => duplicateCertificationEntry(index)} 
                            className="text-cyan-300 hover:text-cyan-100 text-xs"
                            title="Duplicate Entry"
                          >
                              <CopyPlusIcon className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => removeArrayItem('certifications', index)} 
                            className="text-red-300 hover:text-red-500 text-xs"
                            title="Remove Entry"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-start text-sm mt-1">
                      <span className="mr-2 text-cyan-400 print:text-cyan-400">•</span>
                      <EditableInput
                        value={cert.year}
                        onChange={(val) => updateNestedArrayItem('certifications', index, 'year', val)}
                        className="font-light w-full p-0 border-none"
                        placeholder="Issuing Organization, Year"
                      />
                    </div>
                  </li>
                ))}
                {/* Add New Button for empty state - hidden during print */}
                {data.certifications.length === 0 && (
                  <div className="flex justify-center mt-4 print:hidden">
                      <button 
                        onClick={() => addNewArrayItem('certifications', { name: 'New Certification Name', year: 'Year' })} 
                        className="text-cyan-300 hover:text-cyan-100 p-2 border border-cyan-300 rounded-full transition-colors"
                        title="Add New Certification"
                      >
                        <CopyPlusIcon className="w-6 h-6" />
                      </button>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:scale-100 {
            transform: scale(1) !important;
          }
          .print\\:pt-0 {
            padding-top: 0 !important;
          }
          .print\\:items-start {
            align-items: flex-start !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          .print\\:border-0 {
            border: 0 !important;
          }
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:overflow-visible {
            overflow: visible !important;
          }
        }
      `}</style>
    </div>
  );
};

export default App;