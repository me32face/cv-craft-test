"use client";
import React, { useState, useEffect, useRef } from "react";
import { Trash2, Sparkles } from "lucide-react";


const debounce = (fn, delay = 120) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export default function SkillsInput({ skills = [], setSkills, onClose, onNext }) {
  const normalized = Array.isArray(skills) ? skills : [];

  const detectFormat = () => {
    if (!normalized.length) return "bullet";

    const f = normalized[0];
    if (typeof f === "string") return "bullet";
    if (f.proficiency !== undefined) return "percentage";
    if (f.category !== undefined && Array.isArray(f.skills)) return "category";

    return "bullet";
  };

  const [format, setFormat] = useState(detectFormat);
  const [localSkills, setLocalSkills] = useState(normalized);
  const [newSkillText, setNewSkillText] = useState("");



  useEffect(() => {
    const t = setTimeout(() => {
      setSkills(localSkills); // safe, debounced
    }, 120);

    return () => clearTimeout(t);
  }, [localSkills]);


  useEffect(() => {
    const parent = JSON.stringify(normalized);
    const child = JSON.stringify(localSkills);

    if (parent !== child) setLocalSkills(normalized);
  }, [skills]);


  const switchFormat = (next) => {
    if (next === format) return;

    let converted = [];

    if (next === "bullet") {
      converted = localSkills.map((s) => (typeof s === "string" ? s : s.name || ""));
    }

    if (next === "percentage") {
      converted = localSkills.map((s) => {
        if (typeof s === "string") return { name: s, proficiency: 60 };
        if (s.proficiency !== undefined) return s;
        return { name: s.name || "Skill", proficiency: 60 };
      });
    }

    if (next === "category") {
      converted = localSkills.map((s) => {
        if (typeof s === "string") {
          return { category: s, skills: ["New Skill"], __collapsed: false };
        }
        return {
          category: s.category || s.name || "Category",
          skills: s.skills || [s.name || "Skill"],
          __collapsed: false,
        };
      });
    }

    setFormat(next);
    setLocalSkills(converted);
  };


  const updateBullet = (i, value) => {
    const updated = [...localSkills];
    updated[i] = value;
    setLocalSkills(updated);
  };

  const updateSkillObject = (i, field, value) => {
    const updated = [...localSkills];
    updated[i] = { ...updated[i], [field]: value };
    setLocalSkills(updated);
  };

  const removeSkill = (i) => {
    setLocalSkills(localSkills.filter((_, x) => x !== i));
  };

  const addSkill = () => {
    if (!newSkillText.trim()) return;

    let updated;

    if (format === "percentage") {
      updated = [...localSkills, { name: newSkillText, proficiency: 60 }];
    } else if (format === "category") {
      // Parse "Frontend:react,angular" format
      if (newSkillText.includes(":")) {
        const [category, skillsStr] = newSkillText.split(":");
        const skills = skillsStr.split(",").map(s => s.trim()).filter(s => s);
        updated = [
          ...localSkills,
          { category: category.trim(), skills: skills.length ? skills : ["New Skill"], __collapsed: false },
        ];
      } else {
        updated = [
          ...localSkills,
          { category: newSkillText, skills: ["New Skill"], __collapsed: false },
        ];
      }
    } else {
      updated = [...localSkills, newSkillText];
    }

    setLocalSkills(updated);
    setNewSkillText("");
  };


  const formatPill = (key, label) => (
    <button
      onClick={() => switchFormat(key)}
      className={`px-3 py-1 rounded-full text-sm font-medium transition 
        ${format === key ? "bg-[#634BC9] text-white" : "bg-gray-100 text-gray-700"}
      `}
    >
      {label}
    </button>
  );


  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-2xl font-semibold text-[#634BC9]">Skills</h3>
          <p className="text-sm text-gray-500 mt-1">
            List your technical and professional skills.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {formatPill("bullet", "Bullet")}
          {formatPill("percentage", "Percentage")}
          {formatPill("category", "Categories")}
        </div>
      </div>

      {/* ---------------- SKILL LIST ---------------- */}
      <div className="space-y-3 mb-6 border-b border-gray-300 pb-8">
        {/* BULLET */}
        {format === "bullet" &&
          localSkills.map((s, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
              <div className="w-2 h-2 bg-[#634BC9] rounded-full ml-1" />

              <input
                className="flex-1 bg-transparent outline-none text-gray-800"
                value={s}
                onChange={(e) => updateBullet(idx, e.target.value)}
              />

              <button onClick={() => removeSkill(idx)}>
                <Trash2 size={16} className="text-red-500" />
              </button>
            </div>
          ))}

        {/* PERCENTAGE */}
        {format === "percentage" &&
          localSkills.map((skill, idx) => (
            <div key={idx} className="p-3 rounded-xl border bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <input
                  className="flex-1 text-gray-800 px-3 py-2 rounded-lg border"
                  value={skill.name}
                  onChange={(e) => updateSkillObject(idx, "name", e.target.value)}
                />

                <button onClick={() => removeSkill(idx)}>
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-12 text-right">
                  {skill.proficiency}%
                </span>

                <input
                  type="range"
                  min="0"
                  max="100"
                  defaultValue={skill.proficiency}
                  onChange={debounce((e) => {
                    updateSkillObject(idx, "proficiency", parseInt(e.target.value));
                  }, 50)}
                  className="flex-1"
                />
              </div>
            </div>
          ))}

        {/* CATEGORY */}
        {format === "category" &&
          localSkills.map((group, gIdx) => {
            const isCollapsed = group.__collapsed ?? false;

            return (
              <div key={gIdx} className="p-4 rounded-xl border bg-white shadow-sm">
                {/* CATEGORY HEADER */}
                <div className="flex items-center justify-between">
                  <input
                    className="flex-1 text-gray-800 px-3 py-2 rounded-lg border font-semibold"
                    value={group.category}
                    onChange={(e) =>
                      updateSkillObject(gIdx, "category", e.target.value)
                    }
                  />

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const updated = [...localSkills];
                        updated[gIdx].__collapsed = !isCollapsed;
                        setLocalSkills(updated);
                      }}
                      className="text-gray-600"
                    >
                      {isCollapsed ? "▼" : "▲"}
                    </button>

                    <button onClick={() => removeSkill(gIdx)}>
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* CATEGORY CONTENT */}
                {!isCollapsed && (
                  <div className="mt-3 space-y-2">
                    {group.skills?.map((skill, sIdx) => (
                      <div
                        key={sIdx}
                        className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg"
                      >
                        <input
                          className="flex-1 bg-transparent outline-none"
                          value={skill}
                          onChange={(e) => {
                            const updated = [...localSkills];
                            updated[gIdx].skills[sIdx] = e.target.value;
                            setLocalSkills(updated);
                          }}
                        />

                        <button
                          onClick={() => {
                            const updated = [...localSkills];
                            updated[gIdx].skills = updated[gIdx].skills.filter(
                              (_, i) => i !== sIdx
                            );
                            setLocalSkills(updated);
                          }}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        const updated = [...localSkills];
                        updated[gIdx].skills.push("New Skill");
                        setLocalSkills(updated);
                      }}
                      className="text-[#634BC9] text-sm mt-2"
                    >
                      + Add Skill
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* ADD NEW SKILL FIELD */}
      <div className="flex gap-3 mb-4">
        <input
          className="flex-1 px-4 py-2 rounded-full border 
             focus:border-purple-600 focus:ring-2 focus:ring-purple-300 
             outline-none transition"
          placeholder="Add a new skill..."
          value={newSkillText}
          onChange={(e) => setNewSkillText(e.target.value)}
        />

        <button
          onClick={addSkill}
          className="px-4 py-2 bg-[#634BC9] text-white rounded-full"
        >
          Add
        </button>
      </div>

      <div className="flex items-center justify-between my-4">
          {/* <label className="block text-sm  text-gray-500">Please enter to quickly add skills</label> */}

          {/* AI Generate Button */}
          <button
            className="flex items-center gap-1 px-3 py-1 rounded-full 
                 bg-gradient-to-r from-purple-400 to-purple-200 
                 text-[#634BC9] font-medium text-sm shadow-sm 
                 hover:opacity-90  transition"
          >
            <Sparkles size={14}/> 
            Generate Using AI
          </button>
        </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-4  text-sm">

        {/* Left Buttons */}
        <div className="flex gap-3 ">
          <button
            className="px-2 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-2 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition"
          >
            Save Changes
          </button>
        </div>

        {/* Right Button */}
        <button
          className="px-2 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition"
          onClick={onNext}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
