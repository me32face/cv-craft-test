'use client';
import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";

export default function ProjectInput({ projects = [], setProjects, onClose }) {
  const [openIndex, setOpenIndex] = useState(null);

  const addProject = () => {
    const updated = [
      ...projects,
      { name: '', year: '', desc: '', descFormat: 'default', link: '' }
    ];
    setProjects(updated);
    setOpenIndex(updated.length - 1); // open newly added
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const removeProject = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    setProjects(updated);
    if (openIndex === index) setOpenIndex(null);
  };

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full space-y-6">
      {projects.map((project, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="border-2 border-gray-300 rounded-2xl bg-white shadow-sm"
          >
            {/* COLLAPSED VIEW */}
            {!isOpen && (
              <div
                onClick={() => toggle(index)}
                className="p-5 flex justify-between items-center cursor-pointer"
              >
                <div>
                  <p className="font-semibold">
                    {project.name || "Untitled Project"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {project.year || "Year not specified"}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <ChevronDown className="text-xl text-gray-500" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeProject(index);
                    }}
                    className="text-gray-500 hover:text-red-500 text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* EXPANDED VIEW */}
            {isOpen && (
              <div className="p-6 relative">
                {/* Remove button */}
                <button
                  onClick={() => removeProject(index)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>

                {/* Collapse button */}
                <div
                  onClick={() => toggle(index)}
                  className="absolute top-3 right-9 text-gray-500 text-xl cursor-pointer"
                >
                  <ChevronDown className="rotate-180" />
                </div>

                {/* Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Project Name */}
                  <div>
                    <label className="font-medium">Project Name</label>
                    <input
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={project.name ?? ""}
                      onChange={(e) =>
                        updateProject(index, "name", e.target.value)
                      }
                    />
                  </div>

                  {/* Year */}
                  <div>
                    <label className="font-medium">Year</label>
                    <input
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={project.year ?? ""}
                      onChange={(e) =>
                        updateProject(index, "year", e.target.value)
                      }
                    />
                  </div>

                  {/* Live Link */}
                  <div className="col-span-2">
                    <label className="font-medium">Live Link (optional)</label>
                    <input
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={project.link ?? ""}
                      onChange={(e) =>
                        updateProject(index, "link", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* Description Format Buttons */}
                <div className="flex gap-2 mt-4">
                  {["default", "bullet", "number"].map((format) => (
                    <button
                      key={format}
                      onClick={() =>
                        updateProject(index, "descFormat", format)
                      }
                      className={`px-3 py-1 rounded text-xs font-medium ${project.descFormat === format
                          ? "bg-[#634BC9] text-white"
                          : "bg-gray-200"
                        }`}
                    >
                      {format.charAt(0).toUpperCase() + format.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Description */}
                <div className="mt-4">
                  <label className="font-medium">Project Description</label>
                  <textarea
                    className="mt-1 w-full p-3 rounded-xl border"
                    rows={4}
                    value={project.desc ?? ""}
                    onChange={(e) =>
                      updateProject(index, "desc", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Heading */}
      <div className="mb-4">
        <h3 className="text-2xl font-semibold text-[#634BC9]">Projects</h3>
        <p className="text-sm text-gray-500 mt-1">
          Add details about your personal or professional projects
        </p>
      </div>

      {/* Add Button */}
      <button
        onClick={addProject}
        className="w-full border-2 border-[#634BC9] text-[#634BC9] py-2 rounded-2xl text-md font-medium hover:bg-[#634BC9] hover:text-white transition"
      >
        + Add Project
      </button>

      {/* Footer */}
      <div className="flex justify-start pt-4">
        <button
          onClick={onClose}
          className="px-4 py-1 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
