'use client';
import React, { useState } from 'react';
import { ChevronDown, List, ListOrdered, AlignLeft } from "lucide-react";

export default function ProjectInput({ projects = [], setProjects, onClose }) {
  const [openIndex, setOpenIndex] = useState(null);

  const addProject = () => {
    const updated = [
      ...projects,
      { name: '', year: '', desc: '', descFormat: 'default', link: '', linkLabel: '', useCustomLabel: false }


    ];
    setProjects(updated);
    setOpenIndex(updated.length - 1); // open newly added
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const formatText = (text, format) => {
    if (!text) return text;
    const lines = text.split('\n');

    if (format === 'bullet') {
      return lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        const cleaned = trimmed.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '');
        return `• ${cleaned}`;
      }).join('\n');
    }

    if (format === 'number') {
      let count = 0;
      return lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        count++;
        const cleaned = trimmed.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '');
        return `${count}. ${cleaned}`;
      }).join('\n');
    }

    return lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      return trimmed.replace(/^[•\-*]\s*/, '').replace(/^\d+\.\s*/, '');
    }).join('\n');
  };

  const handleDescriptionChange = (index, value) => {
    const format = projects[index].descFormat || 'default';
    const prevValue = projects[index].desc || '';

    // Auto-format when Enter is pressed in bullet/number mode
    if (format === 'bullet' || format === 'number') {
      const prevLines = prevValue.split('\n').length;
      const newLines = value.split('\n').length;

      // If new line was added (Enter pressed)
      if (newLines > prevLines) {
        const formatted = formatText(value, format);
        updateProject(index, 'desc', formatted);
        return;
      }
    }

    updateProject(index, 'desc', value);
  };

  const handleFormatChange = (index, newFormat) => {
    const currentDesc = projects[index].desc || '';
    const formatted = currentDesc ? formatText(currentDesc, newFormat) : '';
    const updated = [...projects];
    updated[index] = { ...updated[index], descFormat: newFormat, desc: formatted };
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
                  {project.link && (
                    <p className="text-xs text-blue-600">
                      {project.useCustomLabel ? project.linkLabel : project.link}
                    </p>
                  )}
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
                    <label className="font-medium mt-3 block">Live Link (optional)</label>
                    <input
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={project.link ?? ""}
                      placeholder="https://project.com"
                      onChange={(e) => updateProject(index, "link", e.target.value)}
                    />

                    <label className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        checked={project.useCustomLabel || false}
                        onChange={() => updateProject(index, "useCustomLabel", !project.useCustomLabel)}
                      />
                      <span className="text-sm">Use custom name instead of URL</span>
                    </label>

                    {project.useCustomLabel && (
                      <>
                        <label className="font-medium mt-2 block">Custom Link Name</label>
                        <input
                          className="mt-1 w-full p-3 rounded-xl border"
                          placeholder="Live / Demo / View / Repo"
                          value={project.linkLabel ?? ""}
                          onChange={(e) => updateProject(index, "linkLabel", e.target.value)}
                        />
                      </>
                    )}


                  </div>
                </div>

                {/* Description */}
                <div className="mt-4">
                  <label className="font-medium">Project Description</label>
                  <div className="relative">
                    <div className="flex gap-1 mb-2 border-b pb-2">
                      <button
                        type="button"
                        onClick={() => handleFormatChange(index, "default")}
                        className={`p-2 rounded ${(project.descFormat || "default") === "default" ? "bg-[#634BC9] text-white hover:bg-[#553fb2]" : "hover:bg-gray-100"
                          }`}
                        title="Default"
                      >
                        <AlignLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatChange(index, "bullet")}
                        className={`p-2 rounded ${(project.descFormat || "default") === "bullet" ? "bg-[#634BC9] text-white hover:bg-[#553fb2]" : "hover:bg-gray-100"
                          }`}
                        title="Bullet List"
                      >
                        <List size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleFormatChange(index, "number")}
                        className={`p-2 rounded ${(project.descFormat || "default") === "number" ? "bg-[#634BC9] text-white hover:bg-[#553fb2]" : "hover:bg-gray-100"
                          }`}
                        title="Numbered List"
                      >
                        <ListOrdered size={18} />
                      </button>
                    </div>
                    <textarea
                      className="w-full p-3 rounded-xl border"
                      rows={4}
                      value={project.desc ?? ""}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    />
                  </div>
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
      <div className="w-full flex items-center justify-between pt-4 text-sm ">

        {/* Left Button */}
        <div className="flex justify-start">
          <button
            className="px-3 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>

        {/* Right Button */}
        <button
          className="px-3 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition justify-end"
          onClick={onClose}
        >
          Finish
        </button>
      </div>
    </div>
  );
}
