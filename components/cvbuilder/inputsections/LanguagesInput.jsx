'use client';
import React from "react";
import { Globe, Trash2, Plus, ChevronDown } from "lucide-react";

// Global utility function for rendering language formats
export const renderLanguage = (lang, index, styles = {}) => {
  const langObj = typeof lang === 'string' ? { name: lang, displayFormat: "simple" } : lang;
  const { name, displayFormat, proficiency, level } = langObj;

  return (
    <div key={index} className={styles.container || "mb-2"}>
      <div className={styles.header || "flex justify-between items-center"}>
        <span className={styles.name || "text-sm"}>{name}</span>
        {displayFormat === "level" && level && <span className={styles.level || "text-xs opacity-70"}>{level}</span>}
        {displayFormat === "percentage" && proficiency && <span className={styles.percentage || "text-xs opacity-70"}>{proficiency}%</span>}
      </div>
      {displayFormat === "percentage" && proficiency && (
        <div className={styles.barContainer || "w-full bg-white/20 rounded-full h-1 mt-2"}>
          <div
            className={styles.bar || "bg-white h-1 rounded-full transition-all"}
            style={{ width: `${proficiency}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

const LANGUAGE_OPTIONS = [
  "English", "Hindi", "Tamil", "Malayalam", "Kannada",
  "Arabic", "Telugu", "French", "German", "Spanish", "Chinese"
];

const PROFICIENCY_LEVELS = [
  "Beginner", "Intermediate", "Advanced", "Fluent", "Native"
];

export default function LanguagesInput({ languages = [], setLanguages, onClose, onNext }) {
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
    <div className="max-w-3xl mx-auto ">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-2xl font-bold text-[#634BC9]">Languages</h2>
        </div>
        <p className="text-gray-600 text-sm ">List languages you speak and your proficiency level</p>
      </div>

      <div className="space-y-4">
        {languages.length === 0 && (
          <div className="  border-b border-gray-200 p-8 text-center">
            {/* <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
            </div> */}
            <p className="text-gray-500 text-sm">No languages added yet. Add your first language below.</p>
          </div>

        )}

        {languages.map((lang, index) => {
          const langObj = typeof lang === "string" ? { name: lang, displayFormat: "simple" } : lang;

          return (
            <div
              key={index}
              className="overflow-hidden transition-all border-b border-gray-300"
            >
              <div className="p-5 flex items-center gap-4 flex-wrap">
                {/* Language Selector */}
                <div className="flex-1 min-w-[150px]">
                  {/* <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                    Language
                  </label> */}
                  <div className="relative">
                    <select
                      value={langObj.name || ""}
                      onChange={(e) => updateLanguage(index, "name", e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Language</option>
                      {LANGUAGE_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Display Format */}
                <div className="flex-1 min-w-[150px]">
                  {/* <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                    Display Format
                  </label> */}
                  <div className="relative">
                    <select
                      value={langObj.displayFormat || "simple"}
                      onChange={(e) => updateLanguage(index, "displayFormat", e.target.value)}
                      className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="simple">Normal</option>
                      <option value="percentage">Percentage</option>
                      <option value="level">Levels</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Proficiency / Level */}
                {langObj.displayFormat === "percentage" && (
                  <div className="flex-1 min-w-[200px]">
                    {/* <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                      Proficiency (%)
                    </label> */}
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={langObj.proficiency || 50}
                      onChange={(e) => updateLanguage(index, "proficiency", parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      style={{
                        background: `linear-gradient(to right, #2563eb 0%, #2563eb ${langObj.proficiency || 50}%, #d1d5db ${langObj.proficiency || 50}%, #d1d5db 100%)`,
                      }}
                    />
                    <span className="w-12 text-right text-sm font-semibold text-gray-700">
                      {langObj.proficiency || 50}%
                    </span>
                  </div>
                )}

                {langObj.displayFormat === "level" && (
                  <div className="flex-1 min-w-[150px]">
                    {/* <label className="text-xs font-semibold text-gray-700 mb-1.5 block uppercase tracking-wide">
                      Proficiency Level
                    </label> */}
                    <div className="relative">
                      <select
                        value={langObj.level || "Intermediate"}
                        onChange={(e) => updateLanguage(index, "level", e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {PROFICIENCY_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => removeLanguage(index)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 font-medium"
                >
                  <Trash2 className="w-4 h-7" />
                </button>
              </div>
            </div>
          );
        })}


        <div className="flex justify-center mt-4">
          <button
            onClick={addLanguage}
            className="px-4 py-2 bg-[#634BC9] text-white hover:bg-[#553fb2] rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
          >
            <Plus className="w-5 h-5" />
            Add New Language
          </button>
        </div>

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
            // onClick={onSave}
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
    </div>
  );
}