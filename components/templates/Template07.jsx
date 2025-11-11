'use client';
import React, { useState, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import AISparkle from "../AISparkle";
import { useAIGeneration } from "../../lib/useAIGeneration";




const CVPage = ({
  profileImage,
  name,
  title,
  about,
  phone,
  email,
  web,
  experience,
  education,
  skills,
  setName,
  setTitle,
  setAbout,
  setPhone,
  setEmail,
  setWeb,
  updateExperience,
  removeExperience,
  addExperience,
  updateEducation,
  removeEducation,
  addEducation,
  updateSkillName,
  updateSkillLevel,
  removeSkill,
  addSkill,
  handleImageUpload,
  handleAIGenerateWithUpdate,
  languages,
  setLanguages,
}) => {
  return (
    <div
      data-cv-page
      className="bg-white flex"
      style={{
        width: "210mm", // A4 width in mm
        height: "297mm", // A4 height in mm
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* LEFT SIDE */}
      <div className="w-1/3 bg-gray-200 p-8 flex flex-col items-center">
        {/* Profile Image */}
        <div
          onClick={() => document.getElementById("uploadImg")?.click()}
          className="relative w-56 h-56 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md cursor-pointer"
        >
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="object-cover w-full h-full" />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-600 text-xs bg-gray-400">
              Upload Photo
            </div>
          )}
          <input type="file" id="uploadImg" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>

        {/* About Me */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-700 border-b border-gray-400 pb-1 tracking-widest">
              ABOUT ME
            </h2>
            <AISparkle section="profile" onGenerate={handleAIGenerateWithUpdate} />

          </div>
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setAbout(e.currentTarget.textContent)}
            className="mt-4 w-full bg-transparent text-[11px] text-gray-700 min-h-[150px] focus:outline-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: about }}
          />
        </div>

        {/* Contact */}
        <div className="w-full ">
          <h2 className="text-lg font-bold text-gray-700 border-b border-gray-400 pb-1 tracking-widest">
            CONTACT
          </h2>
          <div className="mt-3 text-[11px] text-gray-700 space-y-3">
            <div>
              <p className="text-gray-500 font-semibold text-[10px]">PHONE</p>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setPhone(e.currentTarget.textContent)}
                className="bg-transparent w-full focus:outline-none"
                dangerouslySetInnerHTML={{ __html: phone }}
              />
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-[10px]">E-MAIL</p>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setEmail(e.currentTarget.textContent)}
                className="bg-transparent w-full focus:outline-none"
                dangerouslySetInnerHTML={{ __html: email }}
              />
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-[12px]">Place</p>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setWeb(e.currentTarget.textContent)}
                className="bg-transparent w-full focus:outline-none"
                dangerouslySetInnerHTML={{ __html: web }}
              />
            </div>
          </div>
        </div>

        <div className="w-full my-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-700 border-b border-gray-400 pb-1 tracking-widest">
              LANGUAGES
            </h2>
            <button
              onClick={() => setLanguages((prev) => [...prev, "New Language"])}
              className="text-gray-500 text-xs hover:text-gray-700"
            >
              +
            </button>
          </div>
          <ul className="mt-4 text-[11px] text-gray-700 space-y-2">
            {languages.map((lang, index) => (
              <li key={index} className="flex items-center justify-between">
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newLang = e.currentTarget.textContent;
                    setLanguages((prev) =>
                      prev.map((l, i) => (i === index ? newLang : l))
                    );
                  }}
                  className="bg-transparent focus:outline-none flex-1"
                >
                  {lang}
                </div>
                <button
                  onClick={() =>
                    setLanguages((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-gray-500 hover:text-red-600 text-xs ml-2"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-2/3 px-10 py-10">
        {/* Header */}
        <div className="my-10">
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setName(e.currentTarget.textContent)}
            className="text-5xl font-bold text-gray-900 max-w-[400px] break-words focus:outline-none mb-3"
            dangerouslySetInnerHTML={{ __html: name }}
          />
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setTitle(e.currentTarget.textContent)}
            className="block text-lg text-gray-800 tracking-[1px] focus:outline-none"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <div className="border-t-2 border-gray-400 mt-4  w-20"></div>
        </div>

        {/* Experience */}
        <div className="mt-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700 border-b border-gray-400 pb-1 tracking-widest">
              EXPERIENCE
            </h2>
            <button onClick={addExperience} className="text-blue-500 hover:text-blue-700">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id} className="flex items-start group">
                <div className="w-1 bg-gray-800 mr-3 mt-1 h-10"></div>
                <div className="flex-1">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateExperience(exp.id, "company", e.currentTarget.textContent)}
                    className="font-semibold text-[12px] text-gray-800 focus:outline-none w-full"
                    dangerouslySetInnerHTML={{ __html: exp.company }}
                  />
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateExperience(exp.id, "role", e.currentTarget.textContent)}
                    className="block text-[11px] text-gray-600 focus:outline-none w-full"
                    dangerouslySetInnerHTML={{ __html: exp.role }}
                  />
                </div>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-lg font-bold text-gray-700 border-b border-gray-400 pb-1 tracking-widest">
              EDUCATION
            </h2>
            <button onClick={addEducation} className="text-blue-500 hover:text-blue-700">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex items-start group">
                <div className="w-1 bg-gray-800 mr-3 mt-1 h-10"></div>
                <div className="flex-1">
                  {/* Main heading — Degree */}
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateEducation(edu.id, "degree", e.currentTarget.textContent)}
                    className="font-semibold text-[12px] text-gray-800 focus:outline-none w-full"
                    dangerouslySetInnerHTML={{ __html: edu.degree }}
                  />

                  {/* Sub heading — Institution */}
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateEducation(edu.id, "institution", e.currentTarget.textContent)}
                    className="block text-[11px] text-gray-600 focus:outline-none w-full"
                    dangerouslySetInnerHTML={{ __html: edu.institution }}
                  />

                  {/* Additional dummy subcontent — description or grade */}
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateEducation(edu.id, "details", e.currentTarget.textContent)}
                    className="text-[10px] text-gray-500 mt-1 focus:outline-none w-full"
                    dangerouslySetInnerHTML={{ __html: edu.details || "Graduated with First Class, specialized in Marketing & Business." }}
                  />
                </div>

                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <div className="flex justify-between items-center ">
            <h2 className="text-lg font-bold text-gray-700 border-b border-gray-400 pb-1 tracking-widest mt-5">
              SKILL
            </h2>
            <button onClick={addSkill} className="text-blue-500 hover:text-blue-700 my-4">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 mt-3">
            {skills.map((s) => (
              <div key={s.id} className="group">
                <div className="flex justify-between items-center mb-2">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateSkillName(s.id, e.currentTarget.textContent)}
                    className="text-[11px] text-gray-800 focus:outline-none flex-1"
                    dangerouslySetInnerHTML={{ __html: s.name }}
                  />
                  <button
                    onClick={() => removeSkill(s.id)}
                    className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition ml-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Skill Bar */}
                <div
                  className="relative bg-gray-300 h-2 rounded-full cursor-pointer group transition-all duration-200"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const newLevel = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                    updateSkillLevel(s.id, Math.min(Math.max(newLevel, 0), 100));
                  }}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const newLevel = Math.round(((e.clientX - rect.left) / rect.width) * 100);
                      updateSkillLevel(s.id, Math.min(Math.max(newLevel, 0), 100));
                    }
                  }}
                >
                  <div
                    className="bg-gray-800 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${s.level}%` }}
                  ></div>
                  <span
                    className="absolute -top-5 text-[10px] text-gray-700 font-semibold select-none"
                    style={{ left: `${s.level}%`, transform: "translateX(-50%)" }}
                  >
                    {s.level}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Template07() {
  const { handleAIGenerate } = useAIGeneration();
  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);

  const cleanGeneratedContent = (text) => {
    if (!text) return '';

    // Remove markdown headers (### ...)
    let cleaned = text.replace(/^#+\s+/gm, '');

    // Remove "Option 1", "Option 2", etc.
    cleaned = cleaned.replace(/Option \d+[:.]?\s*/g, '');

    // Remove any brackets like [] or ()
    cleaned = cleaned.replace(/\[.*?\]|\(.*?\)/g, '');

    // Remove extra line breaks and trim
    cleaned = cleaned
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join(' ');

    return cleaned;
  };


  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("OLIVIA WILSON");
  const [title, setTitle] = useState("MARKETING MANAGER");
  const [about, setAbout] = useState(
    "A marketing manager is responsible for leading the marketing efforts for a business, service, or product. They estimate market demand and lead a marketing team to develop and implement creative and unique strategies to drive customer interest through multiple media channels."
  );
  const [phone, setPhone] = useState("+123-456-7890");
  const [email, setEmail] = useState("hello@reallygreatsite.com");
  const [web, setWeb] = useState("Newyork, USA");
  const [languages, setLanguages] = useState(["Malayalam", "English", "Hindi"]);


  const uniqueId = () => Math.random().toString(36).substr(2, 9);

  const handleAIGenerateWithUpdate = async (section, keywords) => {
    const generated = await handleAIGenerate(section, keywords);
    if (!generated) return;

    const cleaned = cleanGeneratedContent(generated);

    switch (section.toLowerCase()) {
      case 'profile':
      case 'summary':
        setAbout(cleaned);
        break;

      case 'skills':
        // Split AI output into lines and create new skills array
        const skillsFromAI = cleaned
          .split('\n')
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0)
          .map((skill) => ({ id: Math.random().toString(36).substr(2, 9), name: skill, level: 60 }));

        if (skillsFromAI.length > 0) setSkills(skillsFromAI);
        break;

      case 'work experience':
        // Split AI output by entries (--- or double line breaks)
        const experiencesFromAI = cleaned
          .split('---')
          .map((exp) => exp.trim())
          .filter((exp) => exp.length > 0)
          .map((exp) => {
            const lines = exp.split('\n').map((l) => l.trim()).filter(Boolean);
            return {
              id: Math.random().toString(36).substr(2, 9),
              company: lines[0] || 'Company Name',
              role: lines[1] || 'Position',
            };
          });

        if (experiencesFromAI.length > 0) setExperience(experiencesFromAI);
        break;

      default:
        console.log('AI generated content for section:', section, cleaned);
    }
  };


  const [experience, setExperience] = useState([
    { id: uniqueId(), company: "Inqoude Company", role: "Senior Marketing Manager" },
    { id: uniqueId(), company: "Fradel and Spies", role: "Project Manager" },
  ]);

  const [education, setEducation] = useState([
    { id: uniqueId(), degree: "Bachelor of Marketing", institution: "St. Thomas College, Thrissur", details: "Graduated with Distinction, 2024" },
    { id: uniqueId(), degree: "Higher Secondary Education", institution: "St. Joseph’s HSS", details: "Major in Commerce, 2019 - 2021" },
  ]);

  const [skills, setSkills] = useState([
    { id: uniqueId(), name: "Communication", level: 85 },
    { id: uniqueId(), name: "Sales", level: 80 },
    { id: uniqueId(), name: "Negotiation", level: 75 },
    { id: uniqueId(), name: "Analytical Skills", level: 90 },
    { id: uniqueId(), name: "Creative Thinking", level: 85 },
  ]);

  // --- Helpers ---
  const addExperience = () => setExperience(prev => [...prev, { id: uniqueId(), company: "New Company", role: "Position" }]);
  const removeExperience = (id) => setExperience(prev => prev.filter(x => x.id !== id));
  const updateExperience = (id, field, val) => setExperience(prev => prev.map(x => x.id === id ? { ...x, [field]: val } : x));

  const addEducation = () => setEducation(prev => [...prev, { id: uniqueId(), degree: "New Degree", institution: "Institution Name", details: "Details / Year Range", },]);
  const removeEducation = (id) => setEducation(prev => prev.filter(x => x.id !== id));
  const updateEducation = (id, field, val) => setEducation(prev => prev.map(x => (x.id === id ? { ...x, [field]: val } : x)));


  const addSkill = () => setSkills(prev => [...prev, { id: uniqueId(), name: "New Skill", level: 60 }]);
  const removeSkill = (id) => setSkills(prev => prev.filter(s => s.id !== id));
  const updateSkillName = (id, val) => setSkills(prev => prev.map(s => s.id === id ? { ...s, name: val } : s));
  const updateSkillLevel = (id, val) => setSkills(prev => prev.map(s => s.id === id ? { ...s, level: val } : s));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef}>
          <CVPage
            profileImage={profileImage}
            name={name}
            title={title}
            about={about}
            phone={phone}
            email={email}
            web={web}
            experience={experience}
            education={education}
            skills={skills}
            setName={setName}
            setTitle={setTitle}
            setAbout={setAbout}
            setPhone={setPhone}
            setEmail={setEmail}
            setWeb={setWeb}
            updateExperience={updateExperience}
            removeExperience={removeExperience}
            addExperience={addExperience}
            updateEducation={updateEducation}
            removeEducation={removeEducation}
            addEducation={addEducation}
            updateSkillName={updateSkillName}
            updateSkillLevel={updateSkillLevel}
            removeSkill={removeSkill}
            addSkill={addSkill}
            handleImageUpload={handleImageUpload}
            handleAIGenerateWithUpdate={handleAIGenerateWithUpdate}
            languages={languages}
            setLanguages={setLanguages}
          />
        </div>
      </div>
    </div>
  );
}