"use client";
import React from "react";

export default function CertificatesModal({ certificates = [], setCertificates }) {
  const add = () => setCertificates([...(certificates || []), { name: "", issuer: "", year: "" }]);
  const update = (i, field, value) => {
    const arr = [...(certificates || [])];
    arr[i] = { ...arr[i], [field]: value };
    setCertificates(arr);
  };
  const remove = (i) => setCertificates(certificates.filter((_, idx) => idx !== i));

  return (
    <div>
      {(certificates || []).map((cert, i) => (
        <div key={i} className="border p-3 rounded mb-3">
          <input 
            className="w-full border p-2 rounded mb-2" 
            placeholder="Certificate Name"
            value={cert.name || ""} 
            onChange={(e) => update(i, "name", e.target.value)} 
          />
          <input 
            className="w-full border p-2 rounded mb-2" 
            placeholder="Issuing Organization"
            value={cert.issuer || ""} 
            onChange={(e) => update(i, "issuer", e.target.value)} 
          />
          <div className="flex gap-2">
            <input 
              className="flex-1 border p-2 rounded" 
              placeholder="Year"
              value={cert.year || ""} 
              onChange={(e) => update(i, "year", e.target.value)} 
            />
            <button onClick={() => remove(i)} className="px-3 py-2 bg-red-500 text-white rounded">Delete</button>
          </div>
        </div>
      ))}

      <button onClick={add} className="mt-2 px-3 py-2 bg-blue-600 text-white rounded">+ Add Certificate</button>
    </div>
  );
}
