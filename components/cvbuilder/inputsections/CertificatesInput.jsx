"use client";
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function CertificatesModal({ certificates = [], setCertificates, onClose, onNext }) {
  const [openIndex, setOpenIndex] = useState(null);

  const add = () => {
    // Add an empty certificate to the array
    const newCertificates = [...(certificates || []), { name: "", issuer: "", year: "" }];
    setCertificates(newCertificates);
    // Open the newly added certificate
    setOpenIndex(newCertificates.length - 1);
  };

  const update = (i, field, value) => {
    const arr = [...(certificates || [])];
    arr[i] = { ...arr[i], [field]: value };
    setCertificates(arr);
  };

  const remove = (i) => {
    const arr = certificates.filter((_, idx) => idx !== i);
    setCertificates(arr);
    if (openIndex === i) setOpenIndex(null);
  };

  const toggleOpen = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div className="w-full space-y-6">
      {(certificates || []).map((cert, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index} className="border-2 border-gray-300 rounded-2xl bg-white shadow-sm">
            {/* COLLAPSED */}
            {!isOpen && (
              <div
                onClick={() => toggleOpen(index)}
                className="p-5 flex justify-between items-center cursor-pointer"
              >
                <div>
                  <p className="font-semibold">{cert.name || "Certificate Name"}</p>
                  <p className="text-sm text-gray-600">{cert.issuer || "Issuing Organization"}</p>
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

            {/* EXPANDED */}
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
                    <label className="font-medium">Certificate Name</label>
                    <input
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={cert.name ?? ""}
                      onChange={(e) => update(index, "name", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="font-medium">Issuing Organization</label>
                    <input
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={cert.issuer ?? ""}
                      onChange={(e) => update(index, "issuer", e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="font-medium">Year</label>
                    <input
                      type="text"
                      className="mt-1 w-full p-3 rounded-xl border"
                      value={cert.year ?? ""}
                      onChange={(e) => update(index, "year", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* ADD BUTTON */}
      <button
        onClick={add}
        className="w-full border-2 border-[#634BC9] text-[#634BC9] py-3 rounded-2xl text-lg font-medium hover:bg-[#634BC9] hover:text-white transition"
      >
        + Add Certificate
      </button>

      {/* Footer Buttons */}
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
