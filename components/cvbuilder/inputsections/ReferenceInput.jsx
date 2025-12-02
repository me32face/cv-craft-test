"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ReferenceInput({ references = [], setReferences, onClose, onNext }) {
  const [openIndex, setOpenIndex] = useState(null);
  const [errors, setErrors] = useState({});

  const add = () => {
    const newReferences = [...(references || []), { name: "", title: "", company: "", phone: "", email: "" }];
    setReferences(newReferences);
    setOpenIndex(newReferences.length - 1);
  };

  const update = (i, field, value) => {
    const arr = [...(references || [])];
    arr[i] = { ...arr[i], [field]: value };
    setReferences(arr);

    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, [`email_${i}`]: "Invalid email format" }));
      } else {
        setErrors(prev => ({ ...prev, [`email_${i}`]: "" }));
      }
    }

    if (field === "phone") {
      const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
      if (value && !phoneRegex.test(value)) {
        setErrors(prev => ({ ...prev, [`phone_${i}`]: "Invalid phone format" }));
      } else {
        setErrors(prev => ({ ...prev, [`phone_${i}`]: "" }));
      }
    }
  };

  const remove = (i) => {
    const arr = references.filter((_, idx) => idx !== i);
    setReferences(arr);
    if (openIndex === i) setOpenIndex(null);
  };

  const toggleOpen = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="w-full space-y-6">
      {(references || []).map((ref, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="border-2 border-gray-300 rounded-2xl bg-white shadow-sm">
            {!isOpen && (
              <div
                onClick={() => toggleOpen(index)}
                className="p-5 flex justify-between items-center cursor-pointer"
              >
                <div>
                  <p className="font-semibold">{ref.name || "Reference Name"}</p>
                  <p className="text-sm text-gray-600">{ref.title || "Job Title"}</p>
                </div>

                <div className="flex items-center gap-3">
                  <ChevronDown className="text-xl" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(index);
                    }}
                    className="text-gray-500 hover:text-red-500 text-xl"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {isOpen && (
              <div className="p-6 relative">
                <button
                  onClick={() => remove(index)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                >
                  ×
                </button>

                <div
                  onClick={() => toggleOpen(index)}
                  className="absolute top-3 left-3 text-gray-500 text-xl cursor-pointer"
                >
                  <ChevronDown className="rotate-180" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="font-medium">Full Name</label>
                    <input
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={ref.name ?? ""}
                      onChange={(e) => update(index, "name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="font-medium">Job Title</label>
                    <input
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={ref.title ?? ""}
                      onChange={(e) => update(index, "title", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="font-medium">Company</label>
                    <input
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={ref.company ?? ""}
                      onChange={(e) => update(index, "company", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="font-medium">Phone</label>
                    <input
                      type="tel"
                      className={`mt-1 w-full p-3 rounded-xl border ${
                        errors[`phone_${index}`] ? "border-red-500" : ""
                      }`}
                      value={ref.phone ?? ""}
                      onChange={(e) => update(index, "phone", e.target.value)}
                    />
                    {errors[`phone_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`phone_${index}`]}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-medium">Email</label>
                    <input
                      type="email"
                      className={`mt-1 w-full p-3 rounded-xl border ${
                        errors[`email_${index}`] ? "border-red-500" : ""
                      }`}
                      value={ref.email ?? ""}
                      onChange={(e) => update(index, "email", e.target.value)}
                    />
                    {errors[`email_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`email_${index}`]}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      <button
        onClick={add}
        className="w-full border-2 border-[#634BC9] text-[#634BC9] py-3 rounded-2xl text-lg font-medium hover:bg-[#634BC9] hover:text-white transition"
      >
        + Add Reference
      </button>

      <div className="flex items-center justify-between pt-4 text-sm">
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="px-2 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button className="px-2 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition">
            Save Changes
          </button>
        </div>

        <button
          onClick={onNext}
          className="px-2 py-2 rounded-xl bg-[#634BC9] text-white hover:bg-[#553fb2] transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
