"use client";
import React, { useState } from "react";

export default function SocialLinks({ data, setSocialLinks, onClose, onNext }) {
  // Ensure data is always an array
  const links = Array.isArray(data) ? data : [];

  const [newLink, setNewLink] = useState("");
  const [message, setMessage] = useState("");
const [newLabel, setNewLabel] = useState("");
const [useIconOption, setUseIconOption] = useState(false);
  const validUrl = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

  const [editIndex, setEditIndex] = useState(null);
const [editedUrl, setEditedUrl] = useState("");
const [editedLabel, setEditedLabel] = useState("");

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

  if (links.some(l => l.url === formatted)) {
    setMessage("This link is already added.");
    return;
  }
setSocialLinks([
  ...links,
  {
    url: formatted,
    label: newLabel || detectPlatform(formatted),
    useIcon: useIconOption   
  }
]);

  setNewLink("");
  setNewLabel("");
  setMessage("Link added successfully!");
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
        <h2 className="text-xl font-semibold text-[#634BC9]">Social Links</h2>
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
  <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded">

    {editIndex === i ? (
      <>
        <div className="flex flex-col w-full">
          <input
            className="border p-2 rounded mb-2"
            value={editedLabel}
            onChange={(e) => setEditedLabel(e.target.value)}
          />
          <input
            className="border p-2 rounded"
            value={editedUrl}
            onChange={(e) => setEditedUrl(e.target.value)}
          />

          <label className="text-xs text-gray-600 flex items-center gap-1 mt-2">
        <input
          type="checkbox"
          checked={links[i].useIcon || false}
          onChange={() => {
            const updated = [...links];
            updated[i].useIcon = !updated[i].useIcon;
            setSocialLinks(updated);
          }}
        />
        Show icon
      </label>
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="text-xs text-green-600"
            onClick={() => {
              const updated = [...links];
              updated[i].label = editedLabel;
              updated[i].url = editedUrl;
              setSocialLinks(updated);
              setEditIndex(null);
            }}
          >
            Save
          </button>

          <button
            className="text-xs text-gray-500"
            onClick={() => setEditIndex(null)}
          >
            Cancel
          </button>
        </div>
      </>
    ) : (
      <>
        <div>
          <p className="text-sm font-medium text-gray-700 truncate max-w-[220px]">
            {link.label}
          </p>
          <p className="text-xs text-gray-500">
            {detectPlatform(link.url)}
          </p>

          <label className="text-xs text-gray-600 flex items-center gap-1 mt-1">
            <input
              type="checkbox"
              checked={link.useIcon || false}
              onChange={() => {
                const updated = [...links];
                updated[i].useIcon = !updated[i].useIcon;
                setSocialLinks(updated);
              }}
            />
            Show icon
          </label>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              setEditIndex(i);
              setEditedLabel(link.label);
              setEditedUrl(link.url);
            }}
            className="text-xs text-blue-500 hover:underline"
          >
            Edit
          </button>

          <button
            onClick={() => handleRemove(i)}
            className="text-xs text-red-500 hover:underline"
          >
            Remove
          </button>
        </div>
      </>
    )}
  </div>
))}


        </div>
      )}

      {/* Input Section */}
     <div className="flex space-x-3">
  <input
    type="text"
    placeholder="Display Name (e.g. LinkedIn)"
    className="w-1/3 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
    value={newLabel}
    onChange={(e) => setNewLabel(e.target.value)}
  />

  <input
    type="url"
    placeholder="https://your-link.com/profile"
    className="w-2/3 border border-gray-300 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-400 outline-none"
    value={newLink}
    onChange={(e) => setNewLink(e.target.value)}
  />


<div className="flex items-center gap-2 mt-2">
  <input
    type="checkbox"
    checked={useIconOption}
    onChange={() => setUseIconOption(!useIconOption)}
  />
  <label className="text-xs text-gray-600">Show icon</label>
</div>
 
  <button
    type="button"
    onClick={handleAdd}
    className="px-8 py-2 bg-[#634BC9] text-white hover:bg-[#553fb2] transition rounded-xl"
  >
    +Add
  </button>
</div>


      {/* Footer Buttons */}
      <div className="flex items-center justify-between pt-4 text-sm">
        <div className="flex gap-3">
          <button onClick={onClose} className="px-2 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition">
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
