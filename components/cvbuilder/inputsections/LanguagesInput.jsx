'use client';
import React from "react";

const LANGUAGE_OPTIONS = [
  "English",
  "Hindi",
  "Tamil",
  "Malayalam",
  "Kannada",
  "Arabic",
  "Telugu",
  "French",
  "German"
];

export default function LanguagesInput({ languages, setLanguages }) {
  const toggleLanguage = (lang) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter((x) => x !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Languages</label>

      <div className="grid grid-cols-2 gap-2">
        {LANGUAGE_OPTIONS.map((lang) => (
          <button
            key={lang}
            onClick={() => toggleLanguage(lang)}
            className={`border p-2 rounded ${
              languages.includes(lang)
                ? "bg-blue-600 text-white"
                : "bg-white text-black"
            }`}
          >
            {lang}
          </button>
        ))}
      </div>
    </div>
  );
}
