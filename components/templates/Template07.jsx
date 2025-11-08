'use client';
import React, { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export default function Template07() {
  const [profileImage, setProfileImage] = useState(null);
  const [name, setName] = useState("OLIVIA WILSON");
  const [title, setTitle] = useState("MARKETING MANAGER");
  const [about, setAbout] = useState(
    "A marketing manager is responsible for leading the marketing efforts for a business, service, or product. They estimate market demand and lead a marketing team to develop and implement creative and unique strategies to drive customer interest through multiple media channels."
  );
  const [phone, setPhone] = useState("+123-456-7890");
  const [email, setEmail] = useState("hello@reallygreatsite.com");
  const [web, setWeb] = useState("hello@reallygreatsite.com");

  const uniqueId = () => Math.random().toString(36).substr(2, 9);

  const [experience, setExperience] = useState([
    { id: uniqueId(), company: "Inqoude Company", role: "Senior Marketing Manager" },
    { id: uniqueId(), company: "Fradel and Spies", role: "Project Manager" },
  ]);

  const [education, setEducation] = useState([
    { id: uniqueId(), degree: "Bachelor of Marketing", duration: "2012 - 2014" },
    { id: uniqueId(), degree: "Bachelor Degree of Marketing and Business", duration: "yyyy - yyyy" },
  ]);

  const [skills, setSkills] = useState([
    { id: uniqueId(), name: "Communication", level: 85 },
    { id: uniqueId(), name: "Sales", level: 80 },
    { id: uniqueId(), name: "Negotiation", level: 75 },
    { id: uniqueId(), name: "Analytical Skills", level: 90 },
    { id: uniqueId(), name: "Creative Thinking", level: 85 },
  ]);

  // ---- Helper functions ----
  const addExperience = () => {
    setExperience(prev => [...prev, { id: uniqueId(), company: "New Company", role: "Position" }]);
  };
  const removeExperience = (id) => setExperience(prev => prev.filter(x => x.id !== id));
  const updateExperience = (id, field, val) => {
    setExperience(prev => prev.map(x => x.id === id ? { ...x, [field]: val } : x));
  };

  const addEducation = () => {
    setEducation(prev => [...prev, { id: uniqueId(), degree: "New Degree", duration: "yyyy - yyyy" }]);
  };
  const removeEducation = (id) => setEducation(prev => prev.filter(x => x.id !== id));
  const updateEducation = (id, field, val) => {
    setEducation(prev => prev.map(x => x.id === id ? { ...x, [field]: val } : x));
  };

  const addSkill = () => {
    setSkills(prev => [...prev, { id: uniqueId(), name: "New Skill", level: 60 }]);
  };
  const removeSkill = (id) => setSkills(prev => prev.filter(s => s.id !== id));
  const updateSkillName = (id, val) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, name: val } : s));
  };
  const updateSkillLevel = (id, val) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, level: val } : s));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfileImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10">
      <div className="w-[900px] bg-white shadow-2xl flex" style={{ height: "1250px" }}>
        {/* LEFT SIDE */}
        <div className="w-1/3 bg-gray-200 p-8 flex flex-col items-center">
          {/* Profile */}
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
            <input
              type="file"
              id="uploadImg"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>

          {/* About Me */}
          <div className="w-full mb-8">
            <h2 className="text-lg font-bold text-gray-700 border-b border-gray-400 tracking-widest">
              ABOUT ME
            </h2>
            <textarea
              className="mt-4 w-full bg-transparent text-[11px] text-gray-700 resize-none focus:outline-none overflow-hidden"
              rows={8}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          {/* Contact */}
          <div className="w-full my-10">
            <h2 className="text-lg font-bold text-gray-700 border-b border-gray-400 pb-1 tracking-widest">
              CONTACT
            </h2>
            <div className="mt-3 text-[11px] text-gray-700 space-y-3">
              <div>
                <p className="text-gray-500 font-semibold text-[10px]">PHONE</p>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
              <div>
                <p className="text-gray-500 font-semibold text-[10px]">E-MAIL</p>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
              <div>
                <p className="text-gray-500 font-semibold text-[10px]">WEB</p>
                <input
                  value={web}
                  onChange={(e) => setWeb(e.target.value)}
                  className="bg-transparent w-full focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-2/3 px-10 py-10">
          {/* Header */}
          <div className="my-10">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-4xl font-bold text-gray-900 focus:outline-none"
            />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block text-lg text-gray-800 tracking-[1px] focus:outline-none"
            />
            <div className="border-t-2 border-gray-400 mt-4 mb-10 w-20"></div>
          </div>

          {/* Experience */}
          <div className="my-20">
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
                    <input
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      className="font-semibold text-[12px] text-gray-800 focus:outline-none w-full"
                    />
                    <input
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                      className="block text-[11px] text-gray-600 focus:outline-none w-full"
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
          <div className="mb-12">
            <div className="flex justify-between items-center mb-2">
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
                  <div className="w-1 bg-gray-800 mr-3 mt-2 h-10"></div>
                  <div className="flex justify-between w-full">
                    <input
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      className="font-semibold text-[12px] text-gray-800 focus:outline-none flex-1 mt-2"
                    />
                    <input
                      value={edu.duration}
                      onChange={(e) => updateEducation(edu.id, "duration", e.target.value)}
                      className="text-[11px] text-gray-600 text-right focus:outline-none w-24"
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
            <div className="flex justify-between items-center mt-6">
              <h2 className="text-lg font-bold text-gray-700 border-b border-gray-400 pb-1 tracking-widest">
                SKILL
              </h2>
              <button onClick={addSkill} className="text-blue-500 hover:text-blue-700 my-4">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {skills.map((s) => (
                <div key={s.id} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <input
                      value={s.name}
                      onChange={(e) => updateSkillName(s.id, e.target.value)}
                      className="text-[11px] text-gray-800 focus:outline-none flex-1"
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={s.level}
                      onChange={(e) => updateSkillLevel(s.id, parseInt(e.target.value) || 0)}
                      className="w-10 text-[10px] text-gray-700 border-b border-gray-400 bg-transparent focus:outline-none text-right ml-2"
                    />
                    <button
                      onClick={() => removeSkill(s.id)}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="relative bg-gray-300 h-1.5 rounded-full">
                    <div
                      className="bg-gray-800 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${s.level}%` }}
                    ></div>
                    <span
                      className="absolute -top-4 text-[10px] text-gray-600"
                      style={{
                        left: `${Math.min(s.level, 95)}%`,
                        transform: "translateX(-50%)",
                      }}
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
    </div>
  );
}
