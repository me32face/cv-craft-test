"use client";
import React from "react";

export default function EducationModal({ education = [], setEducation }) {
  const add = () => setEducation([...(education || []), { course: "", school: "", year: "" }]);
  const updateField = (i, k, v) => {
    const arr = [...(education || [])]; arr[i] = { ...arr[i], [k]: v }; setEducation(arr);
  };
  const remove = (i) => setEducation(education.filter((_, idx) => idx !== i));

  return (
    <div>
      {(education || []).map((ed, i) => (
        <div key={i} className="border rounded p-3 mb-3">
          <input placeholder="Course" className="w-full border p-2 rounded mb-2" value={ed.course || ""} onChange={(e)=>updateField(i,"course",e.target.value)} />
          <input placeholder="School" className="w-full border p-2 rounded mb-2" value={ed.school || ""} onChange={(e)=>updateField(i,"school",e.target.value)} />
          <input placeholder="Year" className="w-full border p-2 rounded mb-2" value={ed.year || ""} onChange={(e)=>updateField(i,"year",e.target.value)} />
          <div className="flex justify-end">
            <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>remove(i)}>Remove</button>
          </div>
        </div>
      ))}

      <div className="flex gap-2">
        <button onClick={add} className="px-3 py-1 bg-blue-600 text-white rounded">+ Add Education</button>
      </div>
    </div>
  );
}
