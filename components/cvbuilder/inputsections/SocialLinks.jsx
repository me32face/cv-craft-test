"use client";
import React, { useState } from "react";

export default function SocialLinks({ data, setSocialLinks, onClose, onNext }) {
  // Ensure data is always an array
  const links = Array.isArray(data) ? data : [];

  const [newLink, setNewLink] = useState("");
  const [message, setMessage] = useState("");

  const validUrl = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

  const handleAdd = () => {
    const trimmed = newLink.trim();

    if (!trimmed) {
      setMessage("Please enter a valid URL before adding.");
      return;
    }

    let formatted = trimmed;
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = "https://" + formatted;
    }

    if (!validUrl.test(formatted)) {
      setMessage("Invalid URL format. Please enter a valid link.");
      return;
    }

    if (links.includes(formatted)) {
      setMessage("This link is already added.");
      return;
    }

    setSocialLinks([...links, formatted]);
    setNewLink("");
    setMessage("✅ Link added successfully!");
    setTimeout(() => setMessage(""), 2000);
  };

  const handleRemove = (index) => {
    const updated = links.filter((_, i) => i !== index);
    setSocialLinks(updated);
  };

  const detectPlatform = (url) => {
    const lower = url.toLowerCase();
    if (lower.includes("linkedin")) return "LinkedIn";
    if (lower.includes("github")) return "GitHub";
    if (lower.includes("twitter") || lower.includes("x.com")) return "Twitter / X";
    if (lower.includes("behance")) return "Behance";
    if (lower.includes("dribbble")) return "Dribbble";
    if (lower.includes("portfolio") || lower.includes(".me") || lower.includes(".dev"))
      return "Portfolio";
    return "Other";
  };

  return (
    <div className=" mx-auto bg-white  space-y-5 ">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-purple-700">Social Links</h2>
        <p className="text-gray-500 text-sm">
          Add links to your professional profiles and portfolio.
        </p>
      </div>

      {/* Display existing links */}
      {links.length === 0 ? (
        <p className="text-center text-gray-400 text-sm   border-b border-indigo-200 py-8 rounded">
          No social link added yet. Add your first link below.
        </p>
      ) : (
        <div className="space-y-2">
          {links.map((link, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-gray-50 p-2 rounded  hover:shadow-sm transition"
            >
              <div>
                <p className="text-sm font-medium text-gray-700 truncate max-w-[220px]">
                  {link}
                </p>
                <p className="text-xs text-gray-500">
                  {detectPlatform(link)}
                </p>
              </div>
              <button
                onClick={() => handleRemove(i)}
                className="text-xs text-red-500 font-medium hover:underline"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Section */}
      <div className="space-y-2">
        <label className="text-sm  text-gray-700">
          Add New Link <span className="text-red-500">*</span>
        </label>

        <div className="flex space-x-3">
          <input
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-8 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
           +Add
          </button>
        </div>

        {message && (
          <p
            className={`text-xs ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between items-center pt-4 text-sm">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
        >
          Cancel
        </button>

        <div className="flex space-x-2">
          <button className="px-4 py-2 rounded-md bg-purple-100 text-purple-700 hover:bg-purple-200 transition">
            Save Changes
          </button>

          <button
            onClick={onNext}
            className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition flex items-center gap-1"
          >
            <span>Next →</span>
            
          </button>
        </div>
      </div>
    </div>
  );
}
