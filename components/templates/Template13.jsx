import React, { useState, useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Plus, X, Edit2, Check } from 'lucide-react';
import { useUndoRedo } from '../../contexts/UndoRedoContext';

export default function Template13() {
  const { saveState } = useUndoRedo();
  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);
  const [skills, setSkills] = useState([
    { id: 1, name: 'Amazing Skill Here', level: 85 },
    { id: 2, name: 'Amazing Skill Here', level: 75 },
    { id: 3, name: 'Amazing Skill Here', level: 65 },
    { id: 4, name: 'Amazing Skill Here', level: 55 }
  ]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [editName, setEditName] = useState('');
  const [editLevel, setEditLevel] = useState(50);

  const [education, setEducation] = useState([
    { id: 1, degree: 'Your Degree Name Here', school: 'Really Good University', years: '2013-2015', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, degree: 'Your Degree Name Here', school: 'Really Good University', years: '2011-2013', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
  ]);
  const [editingEducation, setEditingEducation] = useState(null);
  const [editEducation, setEditEducation] = useState({});

  const [references, setReferences] = useState([
    { id: 1, name: 'Reference Name', company: 'Company Name', phone: '+123-456-7890', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
    { id: 2, name: 'Reference Name', company: 'Company Name', phone: '+123-456-7890', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }
  ]);
  const [editingReference, setEditingReference] = useState(null);
  const [editReference, setEditReference] = useState({});

  const [experiences, setExperiences] = useState([
    { 
      id: 1, 
      company: 'Really Great Company', 
      position: 'Senior Graphic Designer', 
      years: '2019-2022',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet sollicitudin nulla. Duis fermentum dapibus nec ullamcorper.',
      points: [
        'Phasellus tristique pulvinar rutrum. Duis tellus erat, consequat vitae consetetur et, mollis eget enim.',
        'Aenean molestie massa rutro, at eleifend nisl dignissim hendrerit. Nam fermentum sodales orci. Morbi lacinia eleifend tincidunt.'
      ]
    },
    { 
      id: 2, 
      company: 'Really Great Company', 
      position: 'Graphic Designer', 
      years: '2017-2019',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet sollicitudin nulla. Duis fermentum dapibus nec ullamcorper.',
      points: [
        'Phasellus tristique pulvinar rutrum. Duis tellus erat, consequat vitae consetetur et, mollis eget enim.',
        'Aenean molestie massa rutro, at eleifend nisl dignissim hendrerit. Nam fermentum sodales orci. Morbi lacinia eleifend tincidunt.'
      ]
    },
    { 
      id: 3, 
      company: 'Really Great Company', 
      position: 'Junior Graphic Designer', 
      years: '2015-2017',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet sollicitudin nulla. Duis fermentum dapibus nec ullamcorper.',
      points: [
        'Phasellus tristique pulvinar rutrum. Duis tellus erat, consequat vitae consetetur et, mollis eget enim.'
      ]
    }
  ]);
  const [editingExperience, setEditingExperience] = useState(null);
  const [editExperience, setEditExperience] = useState({});

  // Skills functions
  const addSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: 'New Skill',
      level: 50
    };
    setSkills([...skills, newSkill]);
  };

  const deleteSkill = (id) => {
    setSkills(skills.filter(skill => skill.id !== id));
  };

  const startEditSkill = (skill) => {
    setEditingSkill(skill.id);
    setEditName(skill.name);
    setEditLevel(skill.level);
  };

  const saveEditSkill = (id) => {
    setSkills(skills.map(skill => 
      skill.id === id ? { ...skill, name: editName, level: editLevel } : skill
    ));
    setEditingSkill(null);
  };

  const cancelEditSkill = () => {
    setEditingSkill(null);
    setEditName('');
    setEditLevel(50);
  };

  // Education functions
  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      degree: 'New Degree',
      school: 'University Name',
      years: '2020-2022',
      description: 'Description here'
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

  // Reference functions
  const addReference = () => {
    const newRef = {
      id: Date.now(),
      name: 'Reference Name',
      company: 'Company Name',
      phone: '+123-456-7890',
      description: 'Description here'
    };
    setReferences([...references, newRef]);
  };

  const deleteReference = (id) => {
    setReferences(references.filter(ref => ref.id !== id));
  };

  const startEditReference = (ref) => {
    setEditingReference(ref.id);
    setEditReference(ref);
  };

  const saveEditReference = (id) => {
    setReferences(references.map(ref => 
      ref.id === id ? editReference : ref
    ));
    setEditingReference(null);
  };

  const cancelEditReference = () => {
    setEditingReference(null);
    setEditReference({});
  };

  // Experience functions
  const addExperience = () => {
    const newExp = {
      id: Date.now(),
      company: 'Company Name',
      position: 'Position Title',
      years: '2020-2022',
      description: 'Job description here',
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveState({ skills, education, references, experiences });
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [skills, education, references, experiences, saveState]);

  useEffect(() => {
    const handleUndoRedo = (event) => {
      const { state } = event.detail;
      if (state) {
        setSkills(state.skills || []);
        setEducation(state.education || []);
        setReferences(state.references || []);
        setExperiences(state.experiences || []);
      }
    };
    window.addEventListener('undoRedo', handleUndoRedo);
    return () => window.removeEventListener('undoRedo', handleUndoRedo);
  }, []);

  useEffect(() => {
    saveState({ skills, education, references, experiences });
  }, []);

  const CVPage = () => (
    <div className="bg-white shadow-2xl" style={{ width: '210mm', minHeight: '297mm' }}>
        {/* Header Section */}
        <div className="flex">
          {/* Left Column - Contact Info */}
          <div className="w-1/3 bg-gray-100 pt-16 pl-8">
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gray-600 mt-1" />
                <span className="text-sm text-gray-700">hello@reallygreatsite.com</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-600 mt-1" />
                <span className="text-sm text-gray-700">+123-456-7890</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-600 mt-1" />
                <span className="text-sm text-gray-700">123 Anywhere St., Any City</span>
              </div>
            </div>
          </div>

          {/* Right Column - Name */}
          <div className="w-2/3 p-8 pb-0">
            <h1 className="text-4xl font-light text-gray-800 mb-2">Jonathan Patterson</h1>
            <p className="text-sm tracking-widest text-gray-600">GRAPHIC DESIGNER</p>
          </div>
        </div>

        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-1/3 bg-gray-100 p-8 pt-0">
            {/* Education */}
            <section className="mb-8 group">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold tracking-wider text-gray-800">EDUCATION</h2>
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
                    <div className="space-y-2 p-2 bg-white rounded">
                      <input
                        type="text"
                        value={editEducation.degree}
                        onChange={(e) => setEditEducation({...editEducation, degree: e.target.value})}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Degree name"
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
                      <textarea
                        value={editEducation.description}
                        onChange={(e) => setEditEducation({...editEducation, description: e.target.value})}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Description"
                        rows="2"
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
                      <h3 className="font-semibold text-gray-800 text-sm mb-1 pr-14">{edu.degree}</h3>
                      <p className="text-xs text-gray-600 mb-2">{edu.school} : {edu.years}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {edu.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </section>

            {/* Skills */}
            <section className="mb-8 group">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold tracking-wider text-gray-800">SKILLS</h2>
                <button
                  onClick={addSkill}
                  className="p-1 hover:bg-gray-200 rounded transition-all opacity-0 group-hover:opacity-100"
                  title="Add skill"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {skills.map((skill) => (
                <div key={skill.id} className="mb-3 group/skill">
                  {editingSkill === skill.id ? (
                    <div className="space-y-2 p-2 bg-white rounded">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Skill name"
                      />
                      <div className="space-y-1">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={editLevel}
                          onChange={(e) => setEditLevel(Number(e.target.value))}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 text-center">{editLevel}%</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEditSkill(skill.id)}
                          className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={cancelEditSkill}
                          className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-700">{skill.name}</p>
                        <div className="flex gap-1 opacity-0 group-hover/skill:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEditSkill(skill)}
                            className="p-1 hover:bg-white rounded"
                            title="Edit skill"
                          >
                            <Edit2 className="w-3 h-3 text-gray-600" />
                          </button>
                          <button
                            onClick={() => deleteSkill(skill.id)}
                            className="p-1 hover:bg-red-100 rounded"
                            title="Delete skill"
                          >
                            <X className="w-3 h-3 text-red-600" />
                          </button>
                        </div>
                      </div>
                      <div className="w-full bg-gray-300 h-2 rounded">
                        <div 
                          className="bg-gray-700 h-2 rounded transition-all duration-300" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </section>

            {/* References */}
            <section className="group">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-bold tracking-wider text-gray-800">REFERENCES</h2>
                <button
                  onClick={addReference}
                  className="p-1 hover:bg-gray-200 rounded transition-all opacity-0 group-hover:opacity-100"
                  title="Add reference"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              
              {references.map((ref, index) => (
                <div key={ref.id} className={`${index > 0 ? 'mt-4' : ''} group/ref relative`}>
                  {editingReference === ref.id ? (
                    <div className="space-y-2 p-2 bg-white rounded">
                      <input
                        type="text"
                        value={editReference.name}
                        onChange={(e) => setEditReference({...editReference, name: e.target.value})}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Reference name"
                      />
                      <input
                        type="text"
                        value={editReference.company}
                        onChange={(e) => setEditReference({...editReference, company: e.target.value})}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Company name"
                      />
                      <input
                        type="text"
                        value={editReference.phone}
                        onChange={(e) => setEditReference({...editReference, phone: e.target.value})}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Phone"
                      />
                      <textarea
                        value={editReference.description}
                        onChange={(e) => setEditReference({...editReference, description: e.target.value})}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Description"
                        rows="2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveEditReference(ref.id)}
                          className="flex-1 px-2 py-1 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 flex items-center justify-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={cancelEditReference}
                          className="flex-1 px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover/ref:opacity-100 transition-opacity">
                        <button
                          onClick={() => startEditReference(ref)}
                          className="p-1 hover:bg-white rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-3 h-3 text-gray-600" />
                        </button>
                        <button
                          onClick={() => deleteReference(ref.id)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                      <h3 className="font-semibold text-gray-800 text-sm mb-1 pr-14">{ref.name}</h3>
                      <p className="text-xs text-gray-600 mb-1">{ref.company}</p>
                      <p className="text-xs text-gray-600 mb-2">Phone : {ref.phone}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {ref.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </section>
          </div>

          {/* Main Content */}
          <div className="w-2/3 p-8 pt-0">
            {/* Profile */}
            <section className="mb-8">
              <h2 className="text-sm font-bold tracking-wider text-gray-800 mb-3 border-b border-gray-300 pb-2">PROFILE</h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet sollicitudin nulla. Duis fermentum dapibus nec ullamcorper. Quisque molestae et orci vitae scelerisque. Aliquam volutpat malesuada purus, vitae accumsan ante. Phasellus tristique pulvinar rutrum. Duis tellus erat, consequat vitae consetetur adipiscing sed enim. Aenean molestie massa rutro, at eleifend nisl dignissim hendrerit.
              </p>
            </section>

            {/* Experience */}
            <section className="group">
              <div className="flex justify-between items-center mb-3 border-b border-gray-300 pb-2">
                <h2 className="text-sm font-bold tracking-wider text-gray-800">EXPERIENCE</h2>
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
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={editExperience.company}
                          onChange={(e) => setEditExperience({...editExperience, company: e.target.value})}
                          className="text-xs px-2 py-1 border border-gray-300 rounded"
                          placeholder="Company name"
                        />
                        <input
                          type="text"
                          value={editExperience.years}
                          onChange={(e) => setEditExperience({...editExperience, years: e.target.value})}
                          className="text-xs px-2 py-1 border border-gray-300 rounded"
                          placeholder="Years"
                        />
                      </div>
                      <input
                        type="text"
                        value={editExperience.position}
                        onChange={(e) => setEditExperience({...editExperience, position: e.target.value})}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Position"
                      />
                      <textarea
                        value={editExperience.description}
                        onChange={(e) => setEditExperience({...editExperience, description: e.target.value})}
                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                        placeholder="Description"
                        rows="2"
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
                      <div className="flex justify-between items-start mb-2 pr-20">
                        <h3 className="font-semibold text-gray-800 text-sm">{exp.company}</h3>
                        <span className="text-xs text-gray-600">{exp.years}</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">{exp.position}</p>
                      <p className="text-xs text-gray-600 leading-relaxed mb-2">
                        {exp.description}
                      </p>
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                        {exp.points.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
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
}