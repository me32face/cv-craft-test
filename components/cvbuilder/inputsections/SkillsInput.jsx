"use client";
import React, { useState } from "react";

export default function SkillsInput({ skills = [], setSkills }) {
  // Determine initial format based on existing data to avoid hydration mismatch
  const getInitialFormat = () => {
    if (!skills || skills.length === 0) return "bullet";
    const firstSkill = skills[0];
    if (typeof firstSkill === 'string') return "bullet";
    if (firstSkill.proficiency !== undefined) return "percentage";
    if (firstSkill.category && firstSkill.items) return "category";
    return "bullet";
  };
  
  const [displayFormat, setDisplayFormat] = useState(getInitialFormat);

  const addSkill = () => {
    const newSkill = displayFormat === "percentage" 
      ? { name: "", proficiency: 50 }
      : displayFormat === "category"
      ? { category: "", items: [""] }
      : "";
    setSkills([...skills, newSkill]);
  };

  const updateSkill = (index, field, value) => {
    const updated = [...skills];
    if (displayFormat === "bullet" && typeof updated[index] !== 'string') {
      updated[index] = value;
    } else if (displayFormat !== "bullet" && typeof updated[index] === 'string') {
      updated[index] = displayFormat === "percentage" 
        ? { name: updated[index], proficiency: 50 }
        : { category: updated[index], items: [""] };
    }
    
    if (typeof updated[index] === 'string') {
      updated[index] = value;
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setSkills(updated);
  };

  const addCategoryItem = (skillIndex) => {
    const updated = [...skills];
    updated[skillIndex].items.push("");
    setSkills(updated);
  };

  const updateCategoryItem = (skillIndex, itemIndex, value) => {
    const updated = [...skills];
    updated[skillIndex].items[itemIndex] = value;
    setSkills(updated);
  };

  const removeCategoryItem = (skillIndex, itemIndex) => {
    const updated = [...skills];
    updated[skillIndex].items = updated[skillIndex].items.filter((_, i) => i !== itemIndex);
    setSkills(updated);
  };

  const removeSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const switchFormat = (newFormat) => {
    setDisplayFormat(newFormat);
    const converted = skills.map(skill => {
      if (typeof skill === 'string') {
        return newFormat === "percentage" 
          ? { name: skill, proficiency: 70 }
          : newFormat === "category"
          ? { category: "General", items: [skill] }
          : skill;
      }
      if (newFormat === "bullet") {
        return skill.name || skill.category || "";
      }
      if (newFormat === "percentage" && skill.category) {
        return { name: skill.category, proficiency: 70 };
      }
      if (newFormat === "category" && skill.name) {
        return { category: "General", items: [skill.name] };
      }
      return skill;
    });
    setSkills(converted);
  };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button
          onClick={() => switchFormat("bullet")}
          className={`px-3 py-1 rounded text-sm ${
            displayFormat === "bullet" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Bullet Points
        </button>
        <button
          onClick={() => switchFormat("percentage")}
          className={`px-3 py-1 rounded text-sm ${
            displayFormat === "percentage" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Percentage
        </button>
        <button
          onClick={() => switchFormat("category")}
          className={`px-3 py-1 rounded text-sm ${
            displayFormat === "category" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Categories
        </button>
      </div>

      {skills.map((skill, index) => {
        if (displayFormat === "bullet") {
          return (
            <div key={index} className="flex gap-2 mb-2">
              <input
                placeholder="Skill"
                className="flex-1 border p-2 rounded"
                value={typeof skill === 'string' ? skill : skill.name || ""}
                onChange={(e) => updateSkill(index, "name", e.target.value)}
              />
              <button
                className="px-3 py-1 bg-red-500 text-white rounded"
                onClick={() => removeSkill(index)}
              >
                Remove
              </button>
            </div>
          );
        }

        if (displayFormat === "percentage") {
          const skillObj = typeof skill === 'string' ? { name: skill, proficiency: 70 } : skill;
          return (
            <div key={index} className="border p-3 rounded mb-2">
              <div className="flex gap-2 mb-2">
                <input
                  placeholder="Skill Name"
                  className="flex-1 border p-2 rounded"
                  value={skillObj.name || ""}
                  onChange={(e) => updateSkill(index, "name", e.target.value)}
                />
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => removeSkill(index)}
                >
                  Remove
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-12">{skillObj.proficiency || 50}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skillObj.proficiency || 50}
                  onChange={(e) => updateSkill(index, "proficiency", parseInt(e.target.value))}
                  className="flex-1"
                />
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${skillObj.proficiency || 50}%` }}
                ></div>
              </div>
            </div>
          );
        }

        if (displayFormat === "category") {
          const skillObj = typeof skill === 'string' ? { category: "General", items: [skill] } : skill;
          return (
            <div key={index} className="border p-3 rounded mb-2">
              <div className="flex gap-2 mb-2">
                <input
                  placeholder="Category (e.g., Frontend, Backend)"
                  className="flex-1 border p-2 rounded font-medium"
                  value={skillObj.category || ""}
                  onChange={(e) => updateSkill(index, "category", e.target.value)}
                />
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => removeSkill(index)}
                >
                  Remove
                </button>
              </div>
              {(skillObj.items || []).map((item, itemIndex) => (
                <div key={itemIndex} className="flex gap-2 mb-1 ml-4">
                  <input
                    placeholder="Skill item (e.g., React, Angular)"
                    className="flex-1 border p-1 rounded text-sm"
                    value={item}
                    onChange={(e) => updateCategoryItem(index, itemIndex, e.target.value)}
                  />
                  <button
                    className="px-2 py-1 bg-red-400 text-white rounded text-xs"
                    onClick={() => removeCategoryItem(index, itemIndex)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                className="ml-4 px-2 py-1 bg-green-500 text-white rounded text-xs"
                onClick={() => addCategoryItem(index)}
              >
                + Add Item
              </button>
            </div>
          );
        }
      })}

      <button
        onClick={addSkill}
        className="px-3 py-1 bg-blue-600 text-white rounded"
      >
        + Add {displayFormat === "category" ? "Category" : "Skill"}
      </button>
    </div>
  );
}
