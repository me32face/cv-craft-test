"use client";
import React, { useState,useRef } from "react";
import { Sparkles } from "lucide-react";
import { geminiService } from "./gemini";
import Toast from "../../Toast";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CalendarDays } from "lucide-react";
import dayjs from "dayjs";

export default function PersonalInfo({ data, update, onClose, onNext, onSave }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
const [openDOB, setOpenDOB] = useState(false);
const dobRef = useRef(null);

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
          onKeyDown={(e)=>{
            if (/[0-9]/.test(e.key)) {
            e.preventDefault(); 
           }
          }}
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
          onKeyDown={(e)=>{
            if (/[0-9]/.test(e.key)) {
            e.preventDefault(); 
           }
          }}
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
            type="email"
            className={`w-full border p-3 rounded-xl outline-none ${
              errors.email ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#634BC9] focus:ring-1 focus:ring-[#634BC9]"
            }`}
            defaultValue=""
            onChange={(e) => {
              const value = e.target.value;
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (value && !emailRegex.test(value)) {
                setErrors(prev => ({ ...prev, email: "Invalid email format" }));
              } else {
                setErrors(prev => ({ ...prev, email: "" }));
              }
              update("email", value);
            }}
            placeholder={data.email || "yourmail@example.com"}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Phone</label>
          <input
            type="tel"
            className={`w-full border p-3 rounded-xl outline-none ${
              errors.phone ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500" : "border-gray-300 focus:border-[#634BC9] focus:ring-1 focus:ring-[#634BC9]"
            }`}
            defaultValue=""
            onChange={(e) => {
              const value = e.target.value;
              const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
              if (value && !phoneRegex.test(value)) {
                setErrors(prev => ({ ...prev, phone: "Invalid phone format" }));
              } else {
                setErrors(prev => ({ ...prev, phone: "" }));
              }
              update("phone", value);
            }}
            placeholder={data.phone || "+91 1234567890"}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {data?.dob && (
  <div className="flex items-start gap-2">
    <span
      className="text-xs text-gray-700"
      contentEditable
      suppressContentEditableWarning
    >
      {data.dob}
    </span>
  </div>
)}


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

       {/* DOB */}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
  <div>
    <label className="block text-sm font-semibold mb-1">
      Date of Birth
    </label>

    <div
      ref={dobRef}  
      className="w-full p-3 rounded-xl border flex items-center justify-between cursor-pointer"
      onClick={() => setOpenDOB(true)}
    >
      <span>
        {data?.dob
          ? dayjs(data.dob, "DD-MM-YYYY").format("DD-MM-YYYY")

          : "Select your date of birth"}
      </span>

      <CalendarDays
        size={20}
        className="text-gray-500 hover:text-black"
        onClick={(e) => {
          e.stopPropagation();
          setOpenDOB(true);
        }}
      />
    </div>

 <div className="flex items-center gap-2 mt-2">
  <input
    type="checkbox"
    checked={!!data?.dob}
    onChange={(e) => {
      if (!e.target.checked) {
        update("dob", ""); // remove DOB
      }
    }}
    className="w-4 h-4 cursor-pointer accent-[#634BC9]"
  />
  <label className="text-sm font-semibold cursor-pointer">Show Date of Birth</label>
</div>
   <DatePicker
  open={openDOB}
  onClose={() => setOpenDOB(false)}
  views={["year", "month", "day"]}
  value={data?.dob ? dayjs(data.dob, "DD-MM-YYYY") : null}
  maxDate={dayjs()}
  onChange={(date) => {
    if (!date) return;

    if (date.date() !== null) {
      update("dob", date.format("DD-MM-YYYY"));
      setOpenDOB(false);
    }
  }}
  slotProps={{
    textField: { style: { display: "none" } },
    popper: { anchorEl: dobRef.current },
  }}
/>



  </div>
</LocalizationProvider>

      {/* Summary */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-semibold">Professional Summary</label>

          {/* AI Generate Button */}
          <button
            onClick={handleGenerateAI}
            disabled={isGenerating}
            className="group relative flex items-center gap-2 px-4 py-2 rounded-full 
                 bg-gradient-to-r from-[#7C3AED] via-[#A78BFA] to-[#7C3AED] bg-[length:200%_100%]
                 font-semibold text-sm text-white shadow-lg shadow-purple-300/50
                 hover:shadow-xl hover:shadow-purple-400/60 hover:scale-105
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                 transition-all duration-300 ease-out
                 animate-gradient"
          >
            <Sparkles 
              size={16} 
              className="animate-sparkle group-hover:animate-sparkle-fast"
            /> 
            <span>{isGenerating ? "Generating..." : "Generate with AI"}</span>
          </button>
        </div>

        <textarea
          className="w-full border border-gray-300 focus:border-[#634BC9] 
               focus:ring-1 focus:ring-[#634BC9] p-3 outline-none 
               rounded-xl"
          rows="5"
          value={data.summary || ""}
          onChange={(e) => update("summary", e.target.value)}
          placeholder="✨ Click 'Generate with AI' to create a professional summary tailored to your title, or write your own..."
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
