"use client";
import React, { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { geminiService } from "./gemini";
import Toast from "../../Toast";

export default function ExperienceInput({ experiences = [], setExperiences, onClose, onNext }) {
  const [openIndex, setOpenIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  const emptyExp = {
    role: "",
    company: "",
    location: "",
    start: "",
    end: "",
    current: false,
    desc: "",
    descFormat: "default",
    reference: "",
  };

  const addExperience = () => {
    const updated = [...experiences, { ...emptyExp }];
    setExperiences(updated);
    setOpenIndex(updated.length - 1);
  };

  const updateField = (i, field, value) => {
    const list = [...experiences];
    list[i] = { ...list[i], [field]: value };
    setExperiences(list);
  };

  const removeExperience = (i) => {
    const filtered = experiences.filter((_, idx) => idx !== i);
    setExperiences(filtered);
    if (openIndex === i) setOpenIndex(null);
  };

  const toggleOpen = (i) => setOpenIndex(openIndex === i ? null : i);

  const formatResponse = (text, format) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l);
    
    // Helper function to remove all existing bullets, numbers, and dashes
    const cleanLine = (line) => {
      return line.replace(/^[•\-*]+\s*/, '').replace(/^\d+\.\s*/, '').trim();
    };
    
    if (format === "default") {
      return lines.map(cleanLine).join('. ').replace(/\.\s*\./g, '.');
    }
    
    if (format === "bullet") {
      return lines.map(l => `• ${cleanLine(l)}`).join('\n');
    }
    
    if (format === "number") {
      return lines.map((l, i) => `${i + 1}. ${cleanLine(l)}`).join('\n');
    }
    
    return text;
  };

  const handleGenerateAI = async (index) => {
    const exp = experiences[index];
    if (!exp.role || exp.role.trim() === "") {
      setToast("Please enter a position title first");
      return;
    }

    setIsGenerating(true);
    try {
      const keywords = `${exp.role} at ${exp.company || 'company'}`;
      const response = await geminiService.generateContent("work experience", keywords);
      const formattedResponse = formatResponse(response, exp.descFormat || "default");
      updateField(index, "desc", formattedResponse);
      setToast("Professional summary generated successfully!");
    } catch (error) {
      console.error("AI generation error:", error);
      setToast("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div className="w-full space-y-6">

      {/* Empty View First Time */}
      {experiences.length === 0 && (
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-2xl font-semibold text-[#634BC9]">Work Experience</h3>
            <p className="text-sm text-gray-500 mt-1">
              Detail your work history and professional achievements
            </p>
          </div>

          <div className="flex flex-col items-center text-center mt-10 mb-10">
            <p className="text-gray-600 text-sm pb-10">
              No experience added yet. Add your first entry below.
            </p>

            <button
              onClick={addExperience}
              className="flex items-center gap-2 border border-[#634BC9] text-[#634BC9] px-10 py-2 rounded-xl font-medium hover:bg-purple-50 transition"
            >
              <span className="text-xl">+</span> Add Experience
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
      )}

      {/* List Mode */}
      {experiences.length > 0 && (
        <div className="space-y-6">
          {experiences.map((exp, i) => {
            const isOpen = openIndex === i;

            return (
              <div key={i} className="border-2 border-gray-300 rounded-2xl bg-white shadow-sm">

                {/* Collapsed */}
                {!isOpen && (
                  <div
                    onClick={() => toggleOpen(i)}
                    className="p-5 flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold">{exp.role || "Job Title"}</p>
                      <p className="text-sm text-gray-600">{exp.company || "Company Name"}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <ChevronDown className="text-xl" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExperience(i);
                        }}
                        className="text-gray-500 hover:text-red-500 text-xl"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* Expanded */}
                {isOpen && (
                  <div className="p-6 relative">

                    <button
                      onClick={() => removeExperience(i)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                    >
                      ×
                    </button>

                    <div
                      onClick={() => toggleOpen(i)}
                      className="absolute top-3 left-3 text-gray-500 text-xl cursor-pointer"
                    >
                      <ChevronDown className="rotate-180" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <label className="font-medium">Position Title</label>
                        <input
                          className="mt-1 w-full p-3 rounded-xl border"
                          value={exp.role ?? ""}
                          onChange={(e) => updateField(i, "role", e.target.value)}
                          placeholder="Senior Software Engineer"
                        />
                      </div>

                      <div>
                        <label className="font-medium">Company</label>
                        <input
                          className="mt-1 w-full p-3 rounded-xl border"
                          value={exp.company ?? ""}
                          onChange={(e) => updateField(i, "company", e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>

                      <div>
                        <label className="font-medium">Location</label>
                        <input
                          className="mt-1 w-full p-3 rounded-xl border"
                          value={exp.location ?? ""}
                          onChange={(e) => updateField(i, "location", e.target.value)}
                          placeholder="City / Country"
                        />
                      </div>

                      <div>
                        <label className="font-medium">Start Year</label>
                        <input
                          type="number"
                          className="mt-1 w-full p-3 rounded-xl border"
                          value={exp.start ?? ""}
                          onChange={(e) => updateField(i, "start", e.target.value)}
                          placeholder="2020"
                        />
                      </div>

                      {!exp.current && (
                        <div>
                          <label className="font-medium">End Year</label>
                          <input
                            type="number"
                            className="mt-1 w-full p-3 rounded-xl border"
                            value={exp.end ?? ""}
                            onChange={(e) => updateField(i, "end", e.target.value)}
                            placeholder="2023"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-3">
                      <input
                        type="checkbox"
                        checked={exp.current ?? false}
                        onChange={(e) => updateField(i, "current", e.target.checked)}
                      />
                      <span>I currently work here</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      {["default", "bullet", "number"].map((format) => (
                        <button
                          key={format}
                          onClick={() => updateField(i, "descFormat", format)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            exp.descFormat === format
                              ? "bg-[#634BC9] text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          {format.charAt(0).toUpperCase() + format.slice(1)}
                        </button>
                      ))}
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-sm font-semibold">Professional Summary</label>

                        {/* AI Generate Button */}
                        <button
                          onClick={() => handleGenerateAI(i)}
                          disabled={isGenerating}
                          className="flex items-center gap-1 px-3 py-1 rounded-full 
                                    bg-gradient-to-r from-purple-400 to-purple-200 
                                    text-[#634BC9] font-medium text-sm shadow-sm 
                                    hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <Sparkles size={14} />
                          {isGenerating ? "Generating..." : "Generate Using AI"}
                        </button>
                      </div>
                      <textarea
                        className="mt-1 w-full p-3 rounded-xl border"
                        rows={4}
                        value={exp.desc ?? ""}
                        onChange={(e) => updateField(i, "desc", e.target.value)}
                        placeholder="Describe your roles and responsibilities"
                      />
                    </div>

                    <div className="mt-4">
                      <label className="font-medium">Reference (optional)</label>
                      <textarea
                        className="mt-1 w-full p-3 rounded-xl border"
                        rows={2}
                        value={exp.reference ?? ""}
                        onChange={(e) => updateField(i, "reference", e.target.value)}
                        placeholder="Any reference details"
                      />
                    </div>

                  </div>
                )}
              </div>
            );
          })}

          {/* Add Button */}
          <button
            onClick={addExperience}
            className="w-full border-2 border-[#634BC9] text-[#634BC9] py-3 rounded-2xl text-lg font-medium hover:bg-[#634BC9] hover:text-white transition"
          >
            + Add Experience
          </button>

          {/* Footer */}
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
      )}

    </div>
    </>
  );
}
