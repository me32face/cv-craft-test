"use client";
import React from "react";

export default function ExperienceModal({ experiences = [], setExperiences }) {
  const add = () => setExperiences([...(experiences || []), { role: "", company: "", year: "", desc: "", descFormat: "paragraph" }]);
  const updateField = (i, k, v) => {
    const arr = [...(experiences || [])]; arr[i] = { ...arr[i], [k]: v }; setExperiences(arr);
  };
  const remove = (i) => setExperiences(experiences.filter((_, idx) => idx !== i));

  return (
    <div>
      {(experiences || []).map((exp, i) => (
        <div key={i} className="border rounded p-3 mb-3">
          <input placeholder="Role" className="w-full border p-2 rounded mb-2" value={exp.role || ""} onChange={(e)=>updateField(i,"role",e.target.value)} />
          <input placeholder="Company" className="w-full border p-2 rounded mb-2" value={exp.company || ""} onChange={(e)=>updateField(i,"company",e.target.value)} />
          <input placeholder="Year" className="w-full border p-2 rounded mb-2" value={exp.year || ""} onChange={(e)=>updateField(i,"year",e.target.value)} />
          <textarea placeholder="Description" className="w-full border p-2 rounded mb-2" rows="3" value={exp.desc || ""} onChange={(e)=>updateField(i,"desc",e.target.value)} />
          <select className="w-full border p-2 rounded mb-2" value={exp.descFormat || "paragraph"} onChange={(e)=>updateField(i,"descFormat",e.target.value)}>
            <option value="paragraph">Paragraph</option>
            <option value="bullet">• Bullet Points</option>
            <option value="number">1. Numbered List</option>
          </select>
          <div className="flex justify-end">
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>remove(i)}>Remove</button>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <button onClick={add} className="px-3 py-1 bg-blue-600 text-white rounded">+ Add Experience</button>
      </div>
    </div>
  );
}
