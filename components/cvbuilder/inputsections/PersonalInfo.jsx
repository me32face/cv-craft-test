"use client";
import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { geminiService } from "./gemini";
import Toast from "../../Toast";

export default function PersonalInfo({ data, update, onClose, onNext, onSave }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  const handleGenerateAI = async () => {
    const title = data.title;
    if (!title || title.trim() === "") {
      setToast("Please enter a professional title first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await geminiService.generateContent("summary", title);
      update("summary", response);
      setToast("Ai generated successfully!");
    } catch (error) {
      console.error("AI generation error:", error);
      setToast("Failed to generate summary. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div className="space-y-5">

      {/* SECTION TITLE */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-[#634BC9]">Personal Details</h2>
          <p className="text-sm text-gray-500">
            Add your basic information. Required fields are marked with an asterisk (*).
          </p>
        </div>
      </div>

      {/* Full Name */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Full Name<span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border border-gray-300 focus:border-[#634BC9] focus:ring-1 focus:ring-[#634BC9] p-3 rounded-xl outline-none"
          defaultValue=""
          onChange={(e) => update("name", e.target.value)}
          placeholder={data.name || "Santhosh John"}
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-1">Professional Title</label>
        <input
          className="w-full border border-gray-300 focus:border-[#634BC9] focus:ring-1 focus:ring-[#634BC9] p-3 rounded-xl outline-none"
          defaultValue=""
          onChange={(e) => update("title", e.target.value)}
          placeholder={data.title || "Software Engineer"}
        />
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1">
            Email<span className="text-red-500">*</span>
          </label>
          <input
            className="w-full border border-gray-300 focus:border-[#634BC9] focus:ring-1 focus:ring-[#634BC9] p-3 rounded-xl outline-none"
            defaultValue=""
            onChange={(e) => update("email", e.target.value)}
            placeholder={data.email || "yourmail@example.com"}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Phone</label>
          <input
            className="w-full border border-gray-300 focus:border-[#634BC9] focus:ring-1 focus:ring-[#634BC9] p-3 rounded-xl outline-none"
            defaultValue=""
            onChange={(e) => update("phone", e.target.value)}
            placeholder={data.phone || "+91 1234567890"}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold mb-1">
          Location<span className="text-red-500">*</span>
        </label>
        <input
          className="w-full border border-gray-300 focus:border-[#634BC9] focus:ring-1 focus:ring-[#634BC9] p-3 rounded-xl outline-none"
          defaultValue=""
          onChange={(e) => update("address", e.target.value)}
          placeholder={data.address || "Kadaventhra Kochi"}
        />
      </div>

      {/* Summary */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-semibold">Professional Summary</label>

          {/* AI Generate Button */}
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="flex items-center gap-1 px-3 py-1 rounded-full 
                 bg-gradient-to-r from-purple-400 to-purple-200 
                 font-medium text-sm shadow-sm 
                 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Sparkles 
              size={15} 
              className=""
              style={{
                animation: 'spin 3s linear infinite, zoom 2s ease-in-out infinite'
              }}
            /> 
            <span className="text-[#7247EF]">{isGenerating ? "Generating..." : "Generate Using AI"}</span>
          </button>
        </div>

        <textarea
          className="w-full border border-gray-300 focus:border-[#634BC9] 
               focus:ring-1 focus:ring-[#634BC9] p-3 outline-none 
               rounded-xl"
          rows="5"
          value={data.summary || ""}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="A brief description of your professional background and key strengths..."
        />
      </div>


      {/* --- FOOTER BUTTONS --- */}
      <div className="flex items-center justify-between pt-4  text-sm">

        {/* Left Buttons */}
        <div className="flex gap-3 ">
          <button
            className="px-2 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-2 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition"
            onClick={onSave}
          >
            Save Changes
          </button>
        </div>

        {/* Right Button */}
        <button
          className="px-2 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition"
          onClick={onNext}
        >
          Next →
        </button>
      </div>
    </div>
    </>
  );
}
