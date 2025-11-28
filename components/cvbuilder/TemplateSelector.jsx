"use client";

import React from "react";
import { templatesList } from "../TemplateList";

export default function TemplateSelector({
  open,
  selectedTemplate,
  onClose,
  onSelectTemplate,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex">
      <div className="w-[550px] bg-white h-full animate-slideLeft px-5 py-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#634BC9]">Select Template</h2>
          <button onClick={onClose} className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {templatesList.map((template) => (
            <div
              key={template.id}
              className="cursor-pointer mx-auto hover:scale-[1.02] transition"
              onClick={() => onSelectTemplate(template.id)}
            >
              <img
                src={template.image}
                alt={template.name}
                className="w-[210px] h-[297px] object-contain shadow-md rounded-sm border border-gray-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = template.image.replace(".jpg", ".png");
                }}
                
              />
              <p className="mt-2 text-center text-md font-semibold text-gray-700">
  {template.name}
</p>

<p className="text-center text-xs text-gray-500 capitalize">
  {template.category}
</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-black/50" onClick={onClose}></div>
    </div>
  );
}
