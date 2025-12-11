"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function MaritalStatusInput({ maritalStatus, setMaritalStatus, onClose, onNext }) {
  const [open, setOpen] = useState(true);

  const STATUS_OPTIONS = [
    "Single",
    "Married",
    "Divorced",
    "Widowed",
    "Separated",
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#634BC9]">Marital Status</h2>
      </div>

      {/* SELECT FIELD */}
      <div className="border-2 border-gray-300 rounded-2xl bg-white shadow-sm p-6 relative">
        <label className="font-medium block mb-2">Select Status</label>
        <div className="relative">
          <select
            className="w-full p-3 rounded-xl border cursor-pointer bg-white"
            value={maritalStatus || ""}
            onChange={(e) => setMaritalStatus(e.target.value)}
          >
            <option value="">Choose status</option>
            {STATUS_OPTIONS.map((sts, i) => (
              <option key={i} value={sts}>{sts}</option>
            ))}
          </select>
          {/* <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" /> */}
        </div>
      </div>

      {/* FOOTER BUTTONS */}
      <div className="flex items-center justify-between pt-4 text-sm">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-2 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={onNext}
            className="px-2 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
