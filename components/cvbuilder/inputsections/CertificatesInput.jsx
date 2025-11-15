"use client";
import React from "react";

export default function CertificatesModal({ certificates = [], setCertificates }) {
  const add = () => setCertificates([...(certificates || []), ""]);
  const update = (i, v) => { const arr = [...(certificates || [])]; arr[i] = v; setCertificates(arr); };
  const remove = (i) => setCertificates(certificates.filter((_, idx) => idx !== i));

  return (
    <div>
      {(certificates || []).map((c, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <input className="flex-1 border p-2 rounded" value={c} onChange={(e)=>update(i,e.target.value)} />
          <button onClick={()=>remove(i)} className="px-2 py-1 bg-red-500 text-white rounded">X</button>
        </div>
      ))}

      <button onClick={add} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">+ Add Certificate</button>
    </div>
  );
}
