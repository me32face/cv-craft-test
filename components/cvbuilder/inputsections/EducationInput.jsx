"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function EducationInput({
  education = [],
  setEducation,
  onClose,
  onNext,
}) {
  const [openIndex, setOpenIndex] = useState(null);

  // Always ensure education is an array
  const educations = Array.isArray(education) ? education : [];

  const emptyEdu = {
    degree: "",
    school: "",
    field: "",
    start: "",
    end: "",
    current: false,
    description: "",
  };

  const addEducation = () => {
    const updated = [...educations, { ...emptyEdu }];
    setEducation(updated);
    setOpenIndex(updated.length - 1);
  };

  const updateField = (index, field, value) => {
    const updated = [...educations];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
  };

  const removeEducation = (index) => {
    const updated = educations.filter((_, i) => i !== index);
    setEducation(updated);

    if (updated.length === 0) {
      setOpenIndex(null);
    } else if (openIndex === index) {
      setOpenIndex(null);
    }
  };

  const toggleOpen = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-6">
      {/* EMPTY STATE */}
      {educations.length === 0 && (
        <div className="flex flex-col justify-between h-full">
          <div>
            <h3 className="text-2xl font-semibold text-[#634BC9]">Education</h3>
            <p className="text-sm text-gray-500 mt-1">
              Add your educational background and qualifications
            </p>
          </div>

          <div className="flex flex-col items-center text-center mt-10 mb-10">
            <p className="text-gray-600 text-sm pb-10">
              No education added yet. Add your first entry below.
            </p>

            <button
              onClick={addEducation}
              className="flex items-center gap-2 border border-[#634BC9] text-[#634BC9] px-10 py-2 rounded-xl font-medium hover:bg-purple-50 transition"
            >
              <span className="text-xl">+</span> Add Education
            </button>
          </div>

          <div className="flex justify-between items-center pt-4 text-sm">
            <button className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition">
              Cancel
            </button>

            <div className="flex space-x-2">
              <button className="px-4 py-2 rounded-md bg-purple-100 text-[#634BC9] hover:bg-purple-200 transition">
                Save Changes
              </button>

              <button className="px-4 py-2 rounded-md bg-[#634BC9] text-white transition">
                Next →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIST MODE */}
      {educations.length > 0 && (
        <div className="space-y-6">
          {educations.map((edu, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border-2 border-gray-300 rounded-2xl bg-white shadow-sm"
              >
                {/* COLLAPSED */}
                {!isOpen && (
                  <div
                    onClick={() => toggleOpen(index)}
                    className="p-5 flex justify-between items-center cursor-pointer"
                  >
                    <div>
                      <p className="font-semibold">
                        {edu.degree || "Untitled Degree"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {edu.school || "Institution Name"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <ChevronDown className="text-xl" />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEducation(index);
                        }}
                        className="text-gray-500 hover:text-red-500 text-xl"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* EXPANDED */}
                {isOpen && (
                  <div className="p-6 relative">
                    <button
                      onClick={() => removeEducation(index)}
                      className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                    >
                      ×
                    </button>

                    <div
                      onClick={() => toggleOpen(index)}
                      className="absolute top-3 left-3 text-gray-500 text-xl cursor-pointer"
                    >
                      <ChevronDown className="rotate-180" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div>
                        <label className="font-medium">Course / Degree</label>
                        <input
                          className="mt-1 w-full p-3 rounded-xl border"
                          value={edu.degree ?? ""}
                          onChange={(e) =>
                            updateField(index, "degree", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="font-medium">School / Institution</label>
                        <input
                          className="mt-1 w-full p-3 rounded-xl border"
                          value={edu.school ?? ""}
                          onChange={(e) =>
                            updateField(index, "school", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="font-medium">Field of Study</label>
                        <input
                          className="mt-1 w-full p-3 rounded-xl border"
                          value={edu.field ?? ""}
                          onChange={(e) =>
                            updateField(index, "field", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex items-center gap-3 mt-6">
                        <input
                          type="checkbox"
                          checked={edu.current ?? false}
                          onChange={(e) =>
                            updateField(index, "current", e.target.checked)
                          }
                        />
                        <span>Currently Enrolled</span>
                      </div>

                      <div>
                        <label className="font-medium">Start Date</label>
                        <input
                          type="date"
                          className="mt-1 w-full p-3 rounded-xl border"
                          value={edu.start ?? ""}
                          onChange={(e) =>
                            updateField(index, "start", e.target.value)
                          }
                        />
                      </div>

                      {!edu.current && (
                        <div>
                          <label className="font-medium">End Date</label>
                          <input
                            type="date"
                            className="mt-1 w-full p-3 rounded-xl border"
                            value={edu.end ?? ""}
                            onChange={(e) =>
                              updateField(index, "end", e.target.value)
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <label className="font-medium">Description</label>
                      <textarea
                        className="mt-1 w-full p-3 rounded-xl border"
                        rows={4}
                        value={edu.description ?? ""}
                        onChange={(e) =>
                          updateField(index, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* ADD BUTTON */}
          <button
            onClick={addEducation}
            className="w-full border-2 border-[#634BC9] text-[#634BC9] py-3 rounded-2xl text-lg font-medium hover:bg-[#634BC9] hover:text-white transition"
          >
            + Add Education
          </button>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between pt-4 text-sm">
            <div className="flex gap-3">
              <button onClick={onClose} className="px-2 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition">
                Cancel
              </button>
              <button className="px-2 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition">
                Save Changes
              </button>
            </div>

            <button
              onClick={onNext}
              className="px-2 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
