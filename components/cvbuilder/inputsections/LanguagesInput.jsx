'use client';
import React from "react";

const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Tamil", "Malayalam", "Kannada", 
  "Arabic", "Telugu", "French", "German", "Spanish", "Chinese"
];

const PROFICIENCY_LEVELS = [
  "Beginner", "Intermediate", "Advanced", "Fluent", "Native"
];

export default function LanguagesInput({ languages = [], setLanguages }) {
  const addLanguage = () => {
    setLanguages([...languages, { name: "", displayFormat: "simple" }]);
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...languages];
    if (typeof updated[index] === 'string') {
      updated[index] = { name: updated[index], displayFormat: "simple" };
    }
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
  };

  const removeLanguage = (index) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-4">
      {languages.map((lang, index) => {
        const langObj = typeof lang === 'string' ? { name: lang, displayFormat: "simple" } : lang;
        
        return (
          <div key={index} className="border p-3 rounded mb-2">
            <div className="flex gap-2 mb-2">
              <select
                value={langObj.name || ""}
                onChange={(e) => updateLanguage(index, "name", e.target.value)}
                className="flex-1 border p-2 rounded"
              >
                <option value="">Select Language</option>
                {LANGUAGE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <button
                onClick={() => removeLanguage(index)}
                className="px-3 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>

            <div className="mb-2">
              <label className="text-sm font-medium mb-1 block">Display Format:</label>
              <select
                value={langObj.displayFormat || "simple"}
                onChange={(e) => updateLanguage(index, "displayFormat", e.target.value)}
                className="w-full border p-2 rounded"
              >
                <option value="simple">Simple (Name only)</option>
                <option value="percentage">Percentage</option>
                <option value="level">Text Level</option>
              </select>
            </div>

            {langObj.displayFormat === "percentage" && (
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm w-12">{langObj.proficiency || 50}%</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={langObj.proficiency || 50}
                    onChange={(e) => updateLanguage(index, "proficiency", parseInt(e.target.value))}
                    className="flex-1"
                  />
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${langObj.proficiency || 50}%` }}
                  ></div>
                </div>
              </div>
            )}

            {langObj.displayFormat === "level" && (
              <select
                value={langObj.level || "Intermediate"}
                onChange={(e) => updateLanguage(index, "level", e.target.value)}
                className="w-full border p-2 rounded"
              >
                {PROFICIENCY_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            )}
          </div>
        );
      })}

      <button
        onClick={addLanguage}
        className="w-full mt-2 px-3 py-2 bg-blue-600 text-white rounded"
      >
        + Add Language
      </button>
    </div>
  );
}
