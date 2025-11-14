import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Edit2, Check } from 'lucide-react';
import { useUndoRedo } from '../../contexts/UndoRedoContext';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

export default function Template11() {
  const { saveState } = useUndoRedo();
  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);
  const [skills, setSkills] = useState([
    'Web Design',
    'Design Thinking',
    'Wireframe Creation',
    'Front End Coding',
    'Backend Tech',
    'Problem-Solving',
    'Computer Literacy',
    'Project Management Tools',
    'Strong Communication'
  ]);
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [editSkillValue, setEditSkillValue] = useState('');

  const [languages, setLanguages] = useState([
    { id: 1, name: 'English', proficiency: 'Native' },
    { id: 2, name: 'Spanish', proficiency: 'Fluent' },
    { id: 3, name: 'French', proficiency: 'Intermediate' }
  ]);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [editLanguage, setEditLanguage] = useState({});

  const [education, setEducation] = useState([
    { id: 1, degree: 'SECOND SCHOOL', school: 'Really Great School', years: '2010 - 2014' },
    { id: 2, degree: 'BACHELOR OF TECHNOLOGY', school: 'Really Great University', years: '2014 - 2018' }
  ]);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editEducation, setEditEducation] = useState({});

  const [experiences, setExperiences] = useState([
    { 
      id: 1, 
      position: 'SENIOR WEB DEVELOPER', 
      company: 'Really Great Company',
      years: '2018 - Present',
      points: [
        'Database administration and website design',
        'Built the logic for a streamlined ad-serving platform that scaled',
        'Educational institutions and online classroom management'
      ]
    },
    { 
      id: 2, 
      position: 'WEB CONTENT MANAGER', 
      company: 'Really Great Company',
      years: '2014 - 2018',
      points: [
        'Database administration and website design',
        'Built the logic for a streamlined ad-serving platform that scaled',
        'Educational institutions and online classroom management'
      ]
    },
    { 
      id: 3, 
      position: 'ANALYSIS CONTENT', 
      company: 'Really Great Company',
      years: '2010 - 2014',
      points: [
        'Database administration and website design',
        'Built the logic for a streamlined ad-serving platform that scaled',
        'Educational institutions and online classroom management'
      ]
    }
  ]);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editExperience, setEditExperience] = useState({});

  const [projects, setProjects] = useState([
    { 
      id: 1, 
      name: 'E-Commerce Platform', 
      description: 'Built a full-stack e-commerce platform using React and Node.js',
      technologies: 'React, Node.js, MongoDB, Stripe',
      link: 'github.com/project'
    },
    { 
      id: 2, 
      name: 'Portfolio Website', 
      description: 'Designed and developed a responsive portfolio website',
      technologies: 'HTML, CSS, JavaScript, Tailwind',
      link: 'example.com'
    }
  ]);
  const [editingProject, setEditingProject] = useState(null);
  const [editProject, setEditProject] = useState({});

  // Section order states
  const [leftSections, setLeftSections] = useState(['contact', 'education', 'skills', 'languages']);
  const [rightSections, setRightSections] = useState(['summary', 'experience', 'projects']);
  
  // Drag state
  const [draggedSection, setDraggedSection] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);

  // Skills functions
  const addSkill = () => {
    setSkills([...skills, 'New Skill']);
  };

  const deleteSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const startEditSkill = (index) => {
    setEditingSkillIndex(index);
    setEditSkillValue(skills[index]);
  };

  const saveEditSkill = () => {
    const newSkills = [...skills];
    newSkills[editingSkillIndex] = editSkillValue;
    setSkills(newSkills);
    setEditingSkillIndex(null);
  };

  const cancelEditSkill = () => {
    setEditingSkillIndex(null);
    setEditSkillValue('');
  };

  // Language functions
  const addLanguage = () => {
    const newLang = {
      id: Date.now(),
      name: 'New Language',
      proficiency: 'Beginner'
    };
    setLanguages([...languages, newLang]);
  };

  const deleteLanguage = (id) => {
    setLanguages(languages.filter(lang => lang.id !== id));
  };

  const startEditLanguage = (lang) => {
    setEditingLanguage(lang.id);
    setEditLanguage(lang);
  };

  const saveEditLanguage = (id) => {
    setLanguages(languages.map(lang => 
      lang.id === id ? editLanguage : lang
    ));
    setEditingLanguage(null);
  };

  const cancelEditLanguage = () => {
    setEditingLanguage(null);
    setEditLanguage({});
  };

  // Education functions
  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: 'NEW DEGREE',
      school: 'University Name',
      years: '2020 - 2022'
    };
    setEducation([...education, newEdu]);
  };

  const deleteEducation = (id) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  const startEditEducation = (edu) => {
    setEditingEducation(edu.id);
    setEditEducation(edu);
  };

  const saveEditEducation = (id) => {
    setEducation(education.map(edu => 
      edu.id === id ? editEducation : edu
    ));
    setEditingEducation(null);
  };

  const cancelEditEducation = () => {
    setEditingEducation(null);
    setEditEducation({});
  };

  // Experience functions
  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      position: 'POSITION TITLE',
      company: 'Company Name',
      years: '2020 - 2022',
      points: ['Achievement or responsibility']
    };
    setExperiences([...experiences, newExp]);
  };

  const deleteExperience = (id) => {
    setExperiences(experiences.filter(exp => exp.id !== id));
  };

  const startEditExperience = (exp) => {
    setEditingExperience(exp.id);
    setEditExperience(exp);
  };

  const saveEditExperience = (id) => {
    setExperiences(experiences.map(exp => 
      exp.id === id ? editExperience : exp
    ));
    setEditingExperience(null);
  };

  const cancelEditExperience = () => {
    setEditingExperience(null);
    setEditExperience({});
  };

  const updateExperiencePoint = (index, value) => {
    const newPoints = [...editExperience.points];
    newPoints[index] = value;
    setEditExperience({ ...editExperience, points: newPoints });
  };

  const addExperiencePoint = () => {
    setEditExperience({ 
      ...editExperience, 
      points: [...editExperience.points, 'New point'] 
    });
  };

  const removeExperiencePoint = (index) => {
    const newPoints = editExperience.points.filter((_, i) => i !== index);
    setEditExperience({ ...editExperience, points: newPoints });
  };

  // Project functions
  const addProject = () => {
    const newProj = {
      id: Date.now(),
      name: 'New Project',
      description: 'Project description',
      technologies: 'Tech stack',
      link: 'project-link.com'
    };
    setProjects([...projects, newProj]);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  const startEditProject = (proj) => {
    setEditingProject(proj.id);
    setEditProject(proj);
  };

  const saveEditProject = (id) => {
    setProjects(projects.map(proj => 
      proj.id === id ? editProject : proj
    ));
    setEditingProject(null);
  };

  const cancelEditProject = () => {
    setEditingProject(null);
    setEditProject({});
  };

  // Drag and drop functions
  const handleDragStart = (e, section, from) => {
    setDraggedSection(section);
    setDraggedFrom(from);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetSection, targetColumn) => {
    e.preventDefault();
    
    if (!draggedSection || draggedSection === targetSection) return;

    const sourceArray = draggedFrom === 'left' ? [...leftSections] : [...rightSections];
    const targetArray = targetColumn === 'left' ? [...leftSections] : [...rightSections];
    
    const sourceIndex = sourceArray.indexOf(draggedSection);
    sourceArray.splice(sourceIndex, 1);
    
    const targetIndex = targetArray.indexOf(targetSection);
    targetArray.splice(targetIndex, 0, draggedSection);
    
    if (draggedFrom === 'left' && targetColumn === 'left') {
      setLeftSections(targetArray);
    } else if (draggedFrom === 'right' && targetColumn === 'right') {
      setRightSections(targetArray);
    } else if (draggedFrom === 'left' && targetColumn === 'right') {
      setLeftSections(sourceArray);
      setRightSections(targetArray);
    } else if (draggedFrom === 'right' && targetColumn === 'left') {
      setRightSections(sourceArray);
      setLeftSections(targetArray);
    }
    
    setDraggedSection(null);
    setDraggedFrom(null);
  };

  const handleDragEnd = () => {
    setDraggedSection(null);
    setDraggedFrom(null);
  };

  const handleAIGenerate = async (section, keywords) => {
    if (!geminiService.genAI) {
      const apiKey = prompt('Please enter your Gemini API key:');
      if (!apiKey) return;
      geminiService.initialize(apiKey);
    }

    try {
      const generatedContent = await geminiService.generateContent(section, keywords);

      switch (section.toLowerCase()) {
        case 'skills':
          const skillsList = generatedContent.split('\n').filter(skill => skill.trim());
          setSkills(skillsList.map(skill => skill.replace(/^[•\-*]\s*/, '').trim()));
          break;
        case 'summary':
        case 'profile':
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
          const summaryElement = document.querySelector('[data-section="summary"] p');
          if (summaryElement) {
            summaryElement.textContent = finalContent;
          }
          break;
        default:
          console.log('Generated content:', generatedContent);
      }
    } catch (error) {
      alert('Failed to generate content. Please check your API key and try again.');
    }
  };

  // Render section content
  const renderSection = (sectionType, column) => {
    switch(sectionType) {
      case 'contact':
        return (
          <section 
            className="mb-8"
            draggable
            onDragStart={(e) => handleDragStart(e, 'contact', column)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'contact', column)}
            onDragEnd={handleDragEnd}
          >
            <div className="mb-4 cursor-pointer">
              <h2 className="text-ms font-bold tracking-widest text-gray-700">CONTACT</h2>
            </div>
            <div className="space-y-3 text-xs text-gray-600">
              <div>
                <span contentEditable suppressContentEditableWarning>123-456-7890</span>
              </div>
              <div>
                <span contentEditable suppressContentEditableWarning>hello@reallygreatsite.com</span>
              </div>
              <div>
                <span contentEditable suppressContentEditableWarning>123 Anywhere St., Any City</span>
              </div>
            </div>
          </section>
        );

      case 'education':
        return (
          <section 
            className="mb-8 group"
            draggable
            onDragStart={(e) => handleDragStart(e, 'education', column)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'education', column)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-between items-center mb-4 cursor-pointer">
              <div>
                <h2 className="text-ms font-bold tracking-widest text-gray-700">EDUCATION</h2>
              </div>
              <button
                onClick={addEducation}
                className="p-1 hover:bg-gray-200 rounded transition-all opacity-0 group-hover:opacity-100"
                title="Add education"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {education.map((edu, index) => (
              <div key={edu.id} className={`${index > 0 ? 'mt-4' : ''} group/edu relative`}>
                {editingEducation === edu.id ? (
                  <div className="space-y-2 p-2 bg-white rounded border border-gray-300">
                    <input
                      type="text"
                      value={editEducation.degree}
                      onChange={(e) => setEditEducation({...editEducation, degree: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded uppercase"
                      placeholder="DEGREE NAME"
                    />
                    <input
                      type="text"
                      value={editEducation.school}
                      onChange={(e) => setEditEducation({...editEducation, school: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      placeholder="School name"
                    />
                    <input
                      type="text"
                      value={editEducation.years}
                      onChange={(e) => setEditEducation({...editEducation, years: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      placeholder="Years"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditEducation(edu.id)}
                        className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={cancelEditEducation}
                        className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover/edu:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditEducation(edu)}
                        className="p-1 hover:bg-white rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                    <h3 className="text-xs font-bold text-gray-800 mb-1 pr-14" contentEditable suppressContentEditableWarning>{edu.degree}</h3>
                    <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>{edu.school}</p>
                    <p className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>{edu.years}</p>
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      case 'skills':
        return (
          <section 
            className="mb-8 group relative z-50"
            draggable
            onDragStart={(e) => handleDragStart(e, 'skills', column)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'skills', column)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-between items-center mb-4 cursor-pointer">
              <div className="flex items-center gap-2">
                <h2 className="text-ms font-bold tracking-widest text-gray-700">SKILLS</h2>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <AISparkle section="Skills" onGenerate={handleAIGenerate} />
                </div>
              </div>
              <button
                onClick={addSkill}
                className="p-1 hover:bg-gray-200 rounded transition-all opacity-0 group-hover:opacity-100"
                title="Add skill"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            <div className="space-y-2">
              {skills.map((skill, index) => (
                <div key={index} className="group/skill relative">
                  {editingSkillIndex === index ? (
                    <div className="flex gap-2 p-2 bg-white rounded border border-gray-300">
                      <input
                        type="text"
                        value={editSkillValue}
                        onChange={(e) => setEditSkillValue(e.target.value)}
                        className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Skill name"
                      />
                      <button
                        onClick={saveEditSkill}
                        className="px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                      <button
                        onClick={cancelEditSkill}
                        className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-700" contentEditable suppressContentEditableWarning>{skill}</span>
                      <div className="flex gap-1 opacity-0 group-hover/skill:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditSkill(index)}
                          className="p-1 hover:bg-white rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteSkill(index)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'languages':
        return (
          <section 
            className="mb-8 group"
            draggable
            onDragStart={(e) => handleDragStart(e, 'languages', column)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'languages', column)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-between items-center mb-4 cursor-pointer">
              <div>
                <h2 className="text-ms font-bold tracking-widest text-gray-700">LANGUAGES</h2>
              </div>
              <button
                onClick={addLanguage}
                className="p-1 hover:bg-gray-200 rounded transition-all opacity-0 group-hover:opacity-100"
                title="Add language"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {languages.map((lang, index) => (
              <div key={lang.id} className={`${index > 0 ? 'mt-3' : ''} group/lang relative`}>
                {editingLanguage === lang.id ? (
                  <div className="space-y-2 p-2 bg-white rounded border border-gray-300">
                    <input
                      type="text"
                      value={editLanguage.name}
                      onChange={(e) => setEditLanguage({...editLanguage, name: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      placeholder="Language name"
                    />
                    <select
                      value={editLanguage.proficiency}
                      onChange={(e) => setEditLanguage({...editLanguage, proficiency: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                    >
                      <option value="Native">Native</option>
                      <option value="Fluent">Fluent</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Beginner">Beginner</option>
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEditLanguage(lang.id)}
                        className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={cancelEditLanguage}
                        className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover/lang:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEditLanguage(lang)}
                        className="p-1 hover:bg-white rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => deleteLanguage(lang.id)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                    <div className="flex justify-between items-center pr-14">
                      <span className="text-xs font-semibold text-gray-800" contentEditable suppressContentEditableWarning>{lang.name}</span>
                      <span className="text-xs text-gray-600" contentEditable suppressContentEditableWarning>{lang.proficiency}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      case 'summary':
        return (
          <section 
            className="mb-8 group relative z-50"
            draggable
            onDragStart={(e) => handleDragStart(e, 'summary', column)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'summary', column)}
            onDragEnd={handleDragEnd}
            data-section="summary"
          >
            <div className="mb-3 cursor-pointer flex items-center gap-2">
              <h2 className="text-ms font-bold tracking-widest text-gray-700">SUMMARY</h2>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <AISparkle section="Summary" onGenerate={handleAIGenerate} />
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed" contentEditable suppressContentEditableWarning>
              I am a qualified and professional web developer with five years of experience in database administration and website design. Strong creative and analytical skills. Team player with an eye for detail.
            </p>
          </section>
        );

      case 'experience':
        return (
          <section 
            className="mb-8 group"
            draggable
            onDragStart={(e) => handleDragStart(e, 'experience', column)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'experience', column)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-between items-center mb-4 cursor-pointer">
              <div>
                <h2 className="text-ms font-bold tracking-widest text-gray-700">EXPERIENCE</h2>
              </div>
              <button
                onClick={addExperience}
                className="p-1 hover:bg-gray-200 rounded transition-all opacity-0 group-hover:opacity-100"
                title="Add experience"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {experiences.map((exp, index) => (
              <div key={exp.id} className={`${index > 0 ? 'mt-6' : ''} group/exp relative`}>
                {editingExperience === exp.id ? (
                  <div className="space-y-2 p-3 bg-gray-50 rounded border border-gray-200">
                    <input
                      type="text"
                      value={editExperience.position}
                      onChange={(e) => setEditExperience({...editExperience, position: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded uppercase font-bold"
                      placeholder="POSITION TITLE"
                    />
                    <input
                      type="text"
                      value={editExperience.company}
                      onChange={(e) => setEditExperience({...editExperience, company: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      placeholder="Company name"
                    />
                    <input
                      type="text"
                      value={editExperience.years}
                      onChange={(e) => setEditExperience({...editExperience, years: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      placeholder="Years"
                    />
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-xs font-semibold text-gray-700">Key Points:</label>
                        <button
                          onClick={addExperiencePoint}
                          className="p-1 hover:bg-gray-200 rounded"
                          title="Add point"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                      {editExperience.points?.map((point, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input
                            type="text"
                            value={point}
                            onChange={(e) => updateExperiencePoint(idx, e.target.value)}
                            className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded"
                            placeholder="Achievement or responsibility"
                          />
                          <button
                            onClick={() => removeExperiencePoint(idx)}
                            className="p-1 hover:bg-red-100 rounded"
                            title="Remove point"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => saveEditExperience(exp.id)}
                        className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={cancelEditExperience}
                        className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover/exp:opacity-100 transition-opacity bg-white rounded p-1">
                      <button
                        onClick={() => startEditExperience(exp)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                    <h3 className="text-xs font-bold text-gray-800 mb-1 pr-14" contentEditable suppressContentEditableWarning>{exp.position}</h3>
                    <p className="text-xs text-gray-600 mb-1" contentEditable suppressContentEditableWarning>{exp.company}</p>
                    <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>{exp.years}</p>
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                      {exp.points.map((point, idx) => (
                        <li key={idx} contentEditable suppressContentEditableWarning>{point}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      case 'projects':
        return (
          <section 
            className="mb-8 group"
            draggable
            onDragStart={(e) => handleDragStart(e, 'projects', column)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'projects', column)}
            onDragEnd={handleDragEnd}
          >
            <div className="flex justify-between items-center mb-4 cursor-pointer">
              <div>
                <h2 className="text-ms font-bold tracking-widest text-gray-700">PROJECTS</h2>
              </div>
              <button
                onClick={addProject}
                className="p-1 hover:bg-gray-200 rounded transition-all opacity-0 group-hover:opacity-100"
                title="Add project"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            
            {projects.map((proj, index) => (
              <div key={proj.id} className={`${index > 0 ? 'mt-6' : ''} group/proj relative`}>
                {editingProject === proj.id ? (
                  <div className="space-y-2 p-3 bg-gray-50 rounded border border-gray-200">
                    <input
                      type="text"
                      value={editProject.name}
                      onChange={(e) => setEditProject({...editProject, name: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded font-bold"
                      placeholder="Project Name"
                    />
                    <textarea
                      value={editProject.description}
                      onChange={(e) => setEditProject({...editProject, description: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      placeholder="Project description"
                      rows="2"
                    />
                    <input
                      type="text"
                      value={editProject.technologies}
                      onChange={(e) => setEditProject({...editProject, technologies: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      placeholder="Technologies used"
                    />
                    <input
                      type="text"
                      value={editProject.link}
                      onChange={(e) => setEditProject({...editProject, link: e.target.value})}
                      className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                      placeholder="Project link"
                    />
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => saveEditProject(proj.id)}
                        className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 flex items-center justify-center gap-1"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={cancelEditProject}
                        className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover/proj:opacity-100 transition-opacity bg-white rounded p-1">
                      <button
                        onClick={() => startEditProject(proj)}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="Delete"
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </button>
                    </div>
                    <h3 className="text-xs font-bold text-gray-800 mb-1 pr-14" contentEditable suppressContentEditableWarning>{proj.name}</h3>
                    <p className="text-xs text-gray-600 mb-2" contentEditable suppressContentEditableWarning>{proj.description}</p>
                    <p className="text-xs text-gray-600 mb-1">
                      <span className="font-semibold">Technologies:</span> <span contentEditable suppressContentEditableWarning>{proj.technologies}</span>
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Link:</span> <span contentEditable suppressContentEditableWarning>{proj.link}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </section>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const handleUndoRedo = (event) => {
      const { state } = event.detail;
      if (state) {
        setSkills(state.skills || skills);
        setLanguages(state.languages || languages);
        setEducation(state.education || education);
        setExperiences(state.experiences || experiences);
        setProjects(state.projects || projects);
        setLeftSections(state.leftSections || leftSections);
        setRightSections(state.rightSections || rightSections);
      }
    };
    window.addEventListener('undoRedo', handleUndoRedo);
    return () => window.removeEventListener('undoRedo', handleUndoRedo);
  }, []);

  useEffect(() => {
    saveState({ skills, languages, education, experiences, projects, leftSections, rightSections });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState({ skills, languages, education, experiences, projects, leftSections, rightSections });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [skills, languages, education, experiences, projects, leftSections, rightSections, saveState]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto">
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef} data-cv-page className="bg-white shadow-2xl relative" style={{ width: '210mm', height: '297mm' }}>
        {/* Large background initials */}
        {/* <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-pink-100 font-bold opacity-40 pointer-events-none" style={{ fontSize: '120px', lineHeight: '1' }}>
          SA
        </div> */}

        {/* Header */}
        <div className="relative z-10 text-center pt-12 pb-8">
          <h1 className="text-3xl font-bold tracking-wider text-gray-800 mb-2" contentEditable suppressContentEditableWarning>SARAH AMELIA</h1>
          <p className="text-xs tracking-widest text-gray-600" contentEditable suppressContentEditableWarning>WEB DEVELOPER</p>
        </div>

        {/* Main Content */}
        <div className="flex relative z-10 h-full">
          {/* Left Column */}
          <div className="w-2/5 bg-pink-50 p-8 pt-5" style={{ maxHeight: 'calc(290mm - 120px)' }}>
            {leftSections.map((section) => renderSection(section, 'left'))}
          </div>

          {/* Right Column */}
          <div className="w-3/5 p-8 pt-5" style={{ maxHeight: 'calc(297mm - 120px)' }}>
            {rightSections.map((section) => renderSection(section, 'right'))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}