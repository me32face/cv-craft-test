"use client";
import React, { useState, useRef, useEffect } from "react";
import { Copy, Trash2, Mail, Phone, MapPin, Upload } from "lucide-react";
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

// --- Resume Data Structure ---
const initialResumeData = {
  name: 'ABHIRAMI M',
  title: 'SENIOR EDUCATOR',
  summary: 'Transforms education with extensive experience in technology automation. Guidelines for fostering inclusive learning environments and implementing innovative technology methodologies to maximize student potential and achievement.',
  contact: {
    phone: '+1 (234) 567-8900',
    email: 'neil.tran@email.com',
    location: 'Chicago, IL',
  },
  photoUrl: 'https://placehold.co/200x200/6366F1/ffffff?text=PROFILE',
  coreCompetencies: [
    'Curriculum Development',
    'Classroom Management',
    'Student Assessment',
    'Educational Technology',
    'Differentiated Instruction',
    'Parent Communication',
    'Lesson Planning',
    'Student Engagement'
  ],
  education: [
    { 
      id: 1, 
      degree: 'Master of Education', 
      major: 'Curriculum & Instruction',
      institution: 'University of Illinois Urbana-Champaign',
      year: '2015',
      highlights: ['GPA: 3.9/4.0', 'Graduated Summa Cum Laude']
    },
    { 
      id: 2, 
      degree: 'Bachelor of Arts', 
      major: 'Elementary Education',
      institution: 'University of Illinois Chicago',
      year: '2012',
      highlights: ['Dean\'s List All Semesters', 'Student Teaching Award']
    },
  ],
  experience: [
    { 
      id: 1,
      position: 'Lead Teacher - 4th Grade', 
      institution: 'Springfield Elementary School',
      period: '2018 - Present',
      achievements: [
        'Implemented project-based learning curriculum resulting in 25% improvement in student engagement scores',
        'Mentored 3 new teachers through district induction program',
        'Integrated technology tools increasing digital literacy by 40% across grade level'
      ]
    },
    { 
      id: 2,
      position: 'Elementary Teacher', 
      institution: 'Lincoln Community School',
      period: '2015 - 2018',
      achievements: [
        'Developed differentiated reading program that improved reading levels by 1.5 grades on average',
        'Collaborated with special education team to create inclusive classroom environment',
        'Organized annual science fair with 200+ participant increase over 3 years'
      ]
    },
  ],
  certifications: [
    { id: 1, name: 'Illinois Professional Educator License', year: '2012', credential: 'K-9 Elementary Education' },
    { id: 2, name: 'Google Certified Educator', year: '2019', credential: 'Level 2' },
    { id: 3, name: 'Trauma-Informed Teaching', year: '2020', credential: 'Advanced Certification' },
  ],
  professionalDevelopment: [
    'STEM Integration Workshop Series (2023)',
    'Culturally Responsive Teaching Institute (2022)',
    'Social-Emotional Learning Conference (2021)'
  ]
};

// --- Main Application Component ---
const App = () => {
  const [data, setData] = useState(initialResumeData);
  const [scale, setScale] = useState(1);
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const cvRef = useRef(null);

  // ADD AI GENERATION FUNCTION
  const handleAIGenerate = async (section, keywords) => {
    if (!geminiService.genAI) {
      const apiKey = prompt('Please enter your Gemini API key:');
      if (!apiKey) return;
      geminiService.initialize(apiKey);
    }

    try {
      const generatedContent = await geminiService.generateContent(section, keywords);

      // Update the appropriate section based on the section type
      switch (section.toLowerCase()) {
        case 'professional summary':
        case 'summary':
          const summaryElement = document.querySelector('[data-section="professional-summary"] .text-justify');
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
              !p.toLowerCase().includes('choose the option') &&
              !p.toLowerCase().includes('pro-tip') &&
              p.length > 100
            );

            const finalContent = actualSummary?.trim() || paragraphs[0]?.trim() || cleanedContent;
            summaryElement.textContent = finalContent;
            handleEdit('summary', finalContent);
          }
          break;

        case 'core competencies':
        case 'skills':
          const skills = generatedContent.split('\n').filter(skill => skill.trim());
          const newSkills = skills.slice(0, 8); // Limit to 8 skills
          setData(prev => ({
            ...prev,
            coreCompetencies: newSkills.map(skill => skill.trim())
          }));
          break;

        case 'professional development':
          const items = generatedContent.split('\n').map(item => item.trim()).filter(item => item).slice(0, 5);
          setData(prev => ({
            ...prev,
            professionalDevelopment: items
          }));
          break;

        case 'education':
          const educations = generatedContent.split('---').filter(edu => edu.trim());
          const newEducation = educations.slice(0, 2).map((edu, index) => {
            const lines = edu.trim().split('\n').filter(line => line.trim());
            const degree = lines[0] || 'Degree';
            const major = lines[1] || 'Major/Concentration';
            const institution = lines[2] || 'Institution';
            const year = lines[3] || 'Year';
            const highlights = lines.slice(4).filter(highlight => highlight.trim()).slice(0, 2);

            return {
              id: Date.now() + index,
              degree,
              major,
              institution,
              year,
              highlights
            };
          });

          setData(prev => ({
            ...prev,
            education: newEducation
          }));
          break;

        default:
          console.log('Generated content:', generatedContent);
      }
    } catch (error) {
      alert('Failed to generate content. Please check your API key and try again.');
    }
  };

  // Auto-scale to fit screen
  useEffect(() => {
    let timeoutId;
    
    const updateScale = () => {
      const container = containerRef.current;
      if (!container) return;

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const a4Width = 210 * 3.78;
      const a4Height = 297 * 3.78;
      
      const widthScale = (screenWidth - 80) / a4Width;
      const heightScale = (screenHeight - 80) / a4Height;
      
      const newScale = Math.min(widthScale, heightScale, 1);
      setScale(Math.max(newScale, 0.4));
    };

    const debouncedUpdateScale = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateScale, 100);
    };

    updateScale();
    window.addEventListener('resize', debouncedUpdateScale);
    
    return () => {
      window.removeEventListener('resize', debouncedUpdateScale);
      clearTimeout(timeoutId);
    };
  }, []);

  // Fixed handleEdit function
  const handleEdit = (path, value) => {
    setData((prev) => {
      const keys = path.split(".");
      
      // Handle simple top-level properties
      if (keys.length === 1) {
        return {
          ...prev,
          [keys[0]]: value
        };
      }
      
      // Handle nested objects (like contact)
      if (keys.length === 2 && keys[0] === 'contact') {
        return {
          ...prev,
          contact: {
            ...prev.contact,
            [keys[1]]: value
          }
        };
      }
      
      // Handle array items (like coreCompetencies.0, professionalDevelopment.1, etc.)
      if (keys.length === 2 && Array.isArray(prev[keys[0]])) {
        const arrayName = keys[0];
        const index = parseInt(keys[1], 10);
        
        if (!isNaN(index) && index >= 0 && index < prev[arrayName].length) {
          const newArray = [...prev[arrayName]];
          newArray[index] = value;
          return {
            ...prev,
            [arrayName]: newArray
          };
        }
      }
      
      // Handle nested objects in arrays (like education.0.degree, experience.1.position, etc.)
      if (keys.length === 3 && Array.isArray(prev[keys[0]])) {
        const arrayName = keys[0];
        const index = parseInt(keys[1], 10);
        const fieldName = keys[2];
        
        if (!isNaN(index) && index >= 0 && index < prev[arrayName].length) {
          const newArray = [...prev[arrayName]];
          newArray[index] = {
            ...newArray[index],
            [fieldName]: value
          };
          return {
            ...prev,
            [arrayName]: newArray
          };
        }
      }
      
      // Handle deeply nested arrays (like education.0.highlights.1, experience.1.achievements.0, etc.)
      if (keys.length === 4 && Array.isArray(prev[keys[0]])) {
        const arrayName = keys[0];
        const index = parseInt(keys[1], 10);
        const subArrayName = keys[2];
        const subIndex = parseInt(keys[3], 10);
        
        if (!isNaN(index) && index >= 0 && index < prev[arrayName].length &&
            !isNaN(subIndex) && prev[arrayName][index] && 
            Array.isArray(prev[arrayName][index][subArrayName]) &&
            subIndex >= 0 && subIndex < prev[arrayName][index][subArrayName].length) {
          
          const newArray = [...prev[arrayName]];
          const newSubArray = [...newArray[index][subArrayName]];
          newSubArray[subIndex] = value;
          
          newArray[index] = {
            ...newArray[index],
            [subArrayName]: newSubArray
          };
          
          return {
            ...prev,
            [arrayName]: newArray
          };
        }
      }
      
      console.warn('Invalid edit path:', path);
      return prev;
    });
  };

  const duplicateItem = (section, index) => {
    setData((prev) => {
      if (!prev[section] || !Array.isArray(prev[section]) || 
          isNaN(index) || 
          index < 0 || 
          index >= prev[section].length) {
        console.warn('Invalid duplicate operation:', { section, index });
        return prev;
      }
      
      const newArr = [...prev[section]];
      const newItem = JSON.parse(JSON.stringify(newArr[index]));
      newItem.id = Date.now();
      newArr.splice(index + 1, 0, newItem);
      return { ...prev, [section]: newArr };
    });
  };

  const deleteItem = (section, index) => {
    setData((prev) => {
      if (!prev[section] || !Array.isArray(prev[section]) || 
          prev[section].length <= 1 ||
          isNaN(index) || 
          index < 0 || 
          index >= prev[section].length) {
        console.warn('Invalid delete operation:', { section, index });
        return prev;
      }
      
      const newArr = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: newArr };
    });
  };

  // Image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, etc.)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setData(prev => ({
        ...prev,
        photoUrl: reader.result
      }));
    };
    reader.onerror = () => {
      alert('Error reading file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Section header component with AI integration
  const SectionHeader = ({ title, icon: Icon, className = "", onGenerate }) => (
    <div className={`flex flex-col items-start mb-2 ${className} group relative`} data-section={title.toLowerCase().replace(/\s/g, '-')}>
      {onGenerate && (
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1">
          <AISparkle section={title} onGenerate={onGenerate} />
        </div>
      )}
      <div className="flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-blue-600 flex-shrink-0" />}
        <h2 className="text-base font-bold text-gray-800 uppercase tracking-wide border-b border-blue-600 pb-1">
          {title}
        </h2>
      </div>
    </div>
  );

  // Safe array access for mapping
  const safeMap = (array, callback) => {
    if (!array || !Array.isArray(array)) {
      return [];
    }
    return array.map(callback);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 overflow-auto p-4">
      <div 
        ref={containerRef}
        data-editor-container
        className="flex flex-col items-center transition-transform duration-300 ease-in-out"
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: 'center top'
        }}
      >
        {/* Main Resume Container - A4 Size - NO SCROLL */}
        <div 
          ref={cvRef}
          data-cv-page
          className="bg-white shadow-2xl rounded-lg border border-gray-200"
          style={{
            width: '210mm',
            height: '297mm',
            maxWidth: '100%',
            maxHeight: '100%',
            overflow: 'hidden'
          }}
        >
          <div className="h-full flex">
            
            {/* Left Sidebar - Professional Info */}
            <div className="w-2/5 bg-gradient-to-b from-blue-400 to-indigo-600 text-white p-10 flex flex-col">
              
              {/* Profile Section - Compact */}
              <div className="text-center mb-4">
                <div 
                  className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-2 cursor-pointer relative group"
                  onClick={triggerFileInput}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && triggerFileInput()}
                  aria-label="Upload profile photo"
                >
                  <img 
                    src={data.photoUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/200x200/6366F1/ffffff?text=PROFILE+IMAGE';
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                
                <h1
                  className="text-lg font-bold mb-1 text-center uppercase tracking-wide"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit('name', e.target.textContent || data.name)}
                >
                  {data.name}
                </h1>
                <h2
                  className="text-xs text-blue-200 font-medium text-center"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit('title', e.target.textContent || data.title)}
                >
                  {data.title}
                </h2>
              </div>

              {/* Contact Information - Compact */}
              <div className="mb-4">
                <SectionHeader title="Contact" icon={Mail} className="!text-white !border-blue-300" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2 group">
                    <Phone className="w-3 h-3 text-blue-300 flex-shrink-0" />
                    <span
                      className="text-xs flex-1"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleEdit('contact.phone', e.target.textContent || data.contact.phone)}
                    >
                      {data.contact.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <Mail className="w-3 h-3 text-blue-300 flex-shrink-0" />
                    <span
                      className="text-xs flex-1"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleEdit('contact.email', e.target.textContent || data.contact.email)}
                    >
                      {data.contact.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 group">
                    <MapPin className="w-3 h-3 text-blue-300 flex-shrink-0" />
                    <span
                      className="text-xs flex-1"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleEdit('contact.location', e.target.textContent || data.contact.location)}
                    >
                      {data.contact.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Core Competencies - Compact with AI */}
              <div className="mb-4" data-section="core-competencies">
                <SectionHeader 
                  title="Core Competencies" 
                  icon={null} 
                  className="!text-white !border-blue-300" 
                  onGenerate={handleAIGenerate}
                />
                <div className="space-y-1">
                  {safeMap(data.coreCompetencies, (skill, index) => (
                    <div key={index} className="group flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
                        <span
                          className="text-xs flex-1"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleEdit(`coreCompetencies.${index}`, e.target.textContent || skill)}
                        >
                          {skill}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => duplicateItem('coreCompetencies', index)} 
                          className="text-blue-300 hover:text-white p-0.5 transition-colors"
                          title="Duplicate skill"
                          aria-label={`Duplicate ${skill}`}
                        >
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          onClick={() => deleteItem('coreCompetencies', index)} 
                          className="text-blue-300 hover:text-red-300 p-0.5 transition-colors"
                          title="Remove skill"
                          aria-label={`Remove ${skill}`}
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Development - Compact */}
              <div className="flex-1">
                <SectionHeader title="Professional Development" icon={null} className="!text-white !border-blue-300" />
                <div className="space-y-1">
                  {safeMap(data.professionalDevelopment, (item, index) => (
                    <div key={index} className="group flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-blue-300 rounded-full flex-shrink-0"></div>
                        <span
                          className="text-xs flex-1"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleEdit(`professionalDevelopment.${index}`, e.target.textContent || item)}
                        >
                          {item}
                        </span>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button 
                          onClick={() => duplicateItem('professionalDevelopment', index)} 
                          className="text-blue-300 hover:text-white p-0.5 transition-colors"
                          title="Duplicate item"
                          aria-label={`Duplicate ${item}`}
                        >
                          <Copy className="w-2.5 h-2.5" />
                        </button>
                        <button 
                          onClick={() => deleteItem('professionalDevelopment', index)} 
                          className="text-blue-300 hover:text-red-300 p-0.5 transition-colors"
                          title="Remove item"
                          aria-label={`Remove ${item}`}
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Content - Compact layout to fit in A4 */}
            <div className="flex-1 p-4 bg-white overflow-hidden">
              
              {/* Professional Summary - Fixed with AI */}
              <div className="mb-4" data-section="professional-summary">
                <SectionHeader title="Professional Summary" icon={null} onGenerate={handleAIGenerate} />
                <div
                  className="text-gray-700 leading-relaxed text-justify text-xs min-h-[60px] mt-1"
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => handleEdit('summary', e.target.textContent || data.summary)}
                >
                  {data.summary}
                </div>
              </div>

              {/* Education - Compact with AI */}
              <div className="mb-4" data-section="education">
                <SectionHeader title="Education"/>
                <div className="space-y-3">
                  {safeMap(data.education, (edu, index) => (
                    <div key={edu.id} className="group relative">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <h3
                            className="font-bold text-gray-900 text-sm mb-0.5"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleEdit(`education.${index}.degree`, e.target.textContent || edu.degree)}
                          >
                            {edu.degree}
                          </h3>
                          <span
                            className="text-blue-600 font-medium text-xs mb-0.5"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleEdit(`education.${index}.major`, e.target.textContent || edu.major)}
                          >
                            {edu.major}
                          </span>
                          <span
                            className="text-gray-700 text-xs mb-0.5"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleEdit(`education.${index}.institution`, e.target.textContent || edu.institution)}
                          >
                            {edu.institution}
                          </span>
                        </div>
                        <span
                          className="text-xs text-gray-500 bg-blue-50 px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleEdit(`education.${index}.year`, e.target.textContent || edu.year)}
                        >
                          {edu.year}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        {safeMap(edu.highlights, (highlight, hIndex) => (
                          <div key={hIndex} className="flex items-center gap-1 group/highlight">
                            <div className="w-1 h-1 bg-blue-400 rounded-full flex-shrink-0"></div>
                            <span
                              className="text-xs text-gray-600 flex-1"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleEdit(`education.${index}.highlights.${hIndex}`, e.target.textContent || highlight)}
                            >
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        <button 
                          onClick={() => duplicateItem('education', index)} 
                          className="text-gray-400 hover:text-blue-600 p-0.5 transition-colors"
                          title="Duplicate education entry"
                          aria-label={`Duplicate ${edu.degree}`}
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => deleteItem('education', index)} 
                          className="text-gray-400 hover:text-red-600 p-0.5 transition-colors"
                          title="Remove education entry"
                          aria-label={`Remove ${edu.degree}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional Experience - Compact with AI */}
              <div className="mb-4" data-section="professional-experience">
                <SectionHeader title="Professional Experience"/>
                <div className="space-y-3">
                  {safeMap(data.experience, (exp, index) => (
                    <div key={exp.id} className="group relative">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex-1">
                          <h3
                            className="font-bold text-gray-900 text-sm mb-0.5"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleEdit(`experience.${index}.position`, e.target.textContent || exp.position)}
                          >
                            {exp.position}
                          </h3>
                          <span
                            className="text-blue-600 font-medium text-xs mb-0.5"
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) => handleEdit(`experience.${index}.institution`, e.target.textContent || exp.institution)}
                          >
                            {exp.institution}
                          </span>
                        </div>
                        <span
                          className="text-xs text-gray-500 bg-blue-50 px-1.5 py-0.5 rounded font-medium flex-shrink-0"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleEdit(`experience.${index}.period`, e.target.textContent || exp.period)}
                        >
                          {exp.period}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {safeMap(exp.achievements, (achievement, aIndex) => (
                          <div key={aIndex} className="flex items-start gap-2 group/achievement">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
                            <div
                              className="text-gray-700 text-xs flex-1 leading-relaxed"
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) => handleEdit(`experience.${index}.achievements.${aIndex}`, e.target.textContent || achievement)}
                            >
                              {achievement}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                        <button 
                          onClick={() => duplicateItem('experience', index)} 
                          className="text-gray-400 hover:text-blue-600 p-0.5 transition-colors"
                          title="Duplicate experience entry"
                          aria-label={`Duplicate ${exp.position}`}
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={() => deleteItem('experience', index)} 
                          className="text-gray-400 hover:text-red-600 p-0.5 transition-colors"
                          title="Remove experience entry"
                          aria-label={`Remove ${exp.position}`}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications - Compact */}
              <div>
                <SectionHeader title="Certifications & Licenses" icon={null} />
                <div className="grid grid-cols-1 gap-1">
                  {safeMap(data.certifications, (cert, index) => (
                    <div key={cert.id} className="group flex items-center justify-between">
                      <div className="flex-1">
                        <span
                          className="font-medium text-gray-900 text-xs"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleEdit(`certifications.${index}.name`, e.target.textContent || cert.name)}
                        >
                          {cert.name}
                        </span>
                        <span
                          className="text-xs text-gray-600"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleEdit(`certifications.${index}.credential`, e.target.textContent || cert.credential)}
                        >
                          {cert.credential}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs text-gray-500 bg-blue-50 px-1.5 py-0.5 rounded flex-shrink-0"
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => handleEdit(`certifications.${index}.year`, e.target.textContent || cert.year)}
                        >
                          {cert.year}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => duplicateItem('certifications', index)} 
                            className="text-gray-400 hover:text-blue-600 p-0.5 transition-colors"
                            title="Duplicate certification"
                            aria-label={`Duplicate ${cert.name}`}
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => deleteItem('certifications', index)} 
                            className="text-gray-400 hover:text-red-600 p-0.5 transition-colors"
                            title="Remove certification"
                            aria-label={`Remove ${cert.name}`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-3 text-center text-xs text-gray-600 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1">
          💡 <strong>Perfect Fit:</strong> All content fits within A4 page • Click any text to edit
        </div>
      </div>
    </div>
  );
};

export default App;