"use client";
import React, { useEffect, useState } from "react";
import { templatesList } from "../TemplateList";


export default function TemplateSelector({
  open,
  selectedTemplate,
  onClose,
  onSelectTemplate,
}) {
  const [visible, setVisible] = useState(open);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setClosing(false);
    } else {
      setClosing(true);
      setTimeout(() => {
        setVisible(false);
      }, 300);
    }
  }, [open]);
 

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* PANEL */}
      <div
  className={`w-[550px] bg-white h-full px-5 py-4 overflow-y-auto transform transition-transform duration-300 
    ${open ? "translate-x-0" : closing ? "-translate-x-[550px]" : "translate-x-[550px]"}
  `}
>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#634BC9]">Select Template</h2>
          <button
            onClick={onClose}
            className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-300"
            aria-label="Close"
          >
            ✕
          </button>
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

      {/* BACKDROP */}
      <div
        className={`flex-1 bg-black/50 transition-opacity duration-300 ${
          closing ? "opacity-0" : "opacity-100"
        }`}
        onClick={onClose}
      ></div>
    </div>
  );
}
