'use client';
import React, { useState } from 'react';

export default function ProjectInput({ projects = [], setProjects }) {
  const [descFormat, setDescFormat] = useState('default');

  const addProject = () => {
    setProjects([...projects, { name: '', year: '', desc: '', descFormat: 'default', link: '' }]);
  };

  const updateProject = (index, field, value) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
  };

  const removeProject = (index) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  return (
    <div>
      {projects.map((project, index) => (
        <div key={index} className="border p-3 rounded mb-3">
          <div className="flex gap-2 mb-2">
            <input
              placeholder="Project Name"
              className="flex-1 border p-2 rounded"
              value={project.name || ''}
              onChange={(e) => updateProject(index, 'name', e.target.value)}
            />
            <input
              placeholder="Year"
              className="w-24 border p-2 rounded"
              value={project.year || ''}
              onChange={(e) => updateProject(index, 'year', e.target.value)}
            />
            <button
              className="px-3 py-2 bg-red-500 text-white rounded"
              onClick={() => removeProject(index)}
            >
              Remove
            </button>
          </div>

          <input
            placeholder="Live Link (optional)"
            className="w-full border p-2 rounded mb-2"
            value={project.link || ''}
            onChange={(e) => updateProject(index, 'link', e.target.value)}
          />

          <div className="flex gap-2 mb-2">
            <button
              onClick={() => updateProject(index, 'descFormat', 'default')}
              className={`px-2 py-1 rounded text-xs ${
                project.descFormat === 'default' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => updateProject(index, 'descFormat', 'bullet')}
              className={`px-2 py-1 rounded text-xs ${
                project.descFormat === 'bullet' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Bullet
            </button>
            <button
              onClick={() => updateProject(index, 'descFormat', 'number')}
              className={`px-2 py-1 rounded text-xs ${
                project.descFormat === 'number' ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              Number
            </button>
          </div>

          <textarea
            placeholder="Project Description"
            className="w-full border p-2 rounded"
            rows="3"
            value={project.desc || ''}
            onChange={(e) => updateProject(index, 'desc', e.target.value)}
          />
        </div>
      ))}

      <button
        onClick={addProject}
        className="w-full px-3 py-2 bg-blue-600 text-white rounded"
      >
        + Add Project
      </button>
    </div>
  );
}