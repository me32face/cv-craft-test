// Template20.jsx
"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Phone,
  Mail,
  MapPin,
  CopyPlus,
  Trash2,
  Monitor,
  Upload,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import AISparkle from "../AISparkle";
import { geminiService } from "../../lib/gemini";

/**
 * Converted Template20 -> Template22-style functionality (Option A)
 * - Keeps visual layout / classes identical
 * - Replaces complex react-dnd & slider logic with DOM contentEditable + clone/remove
 * - Autosave (debounced) to localStorage + basic snapshots for undo/redo
 * - AI writes to DOM elements directly
 */

const SNAPSHOT_KEY = "template20_snapshots_v1";
const AUTOSAVE_KEY = "template20_autosave_v1";

export default function Template20() {
  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);
  const [profileImage, setProfileImage] = useState(null);
  const snapshotsRef = useRef([]);
  const saveTimeoutRef = useRef(null);

  // --- Helpers: snapshots / autosave (basic) ---
  const pushSnapshot = useCallback(
    (data) => {
      try {
        const snaps = snapshotsRef.current || [];
        snaps.push(data);
        // keep last 50
        if (snaps.length > 50) snaps.splice(0, snaps.length - 50);
        snapshotsRef.current = snaps;
        localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(snaps));
      } catch (e) {
        console.error("snapshot error", e);
      }
    },
    [snapshotsRef]
  );

  const saveCurrentState = useCallback(() => {
    if (!cvRef.current) return;
    const html = cvRef.current.innerHTML;
    const data = { html, profileImage };
    // debounced already when called; push snapshot and persist autosave
    pushSnapshot(data);
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
  }, [profileImage, pushSnapshot]);

  // restore autosave on mount
  // useEffect(() => {
  //   try {
  //     const saved = localStorage.getItem(AUTOSAVE_KEY);
  //     if (saved && cvRef.current) {
  //       const { html, profileImage: img } = JSON.parse(saved);
  //       if (html) cvRef.current.innerHTML = html;
  //       if (img) setProfileImage(img);
  //     }
  //     const snaps = localStorage.getItem(SNAPSHOT_KEY);
  //     if (snaps) snapshotsRef.current = JSON.parse(snaps) || [];
  //   } catch (e) {
  //     console.error("restore error", e);
  //   }
  // }, []);

  // provide a listener for custom undoRedo events (compatible with Template22 usage)
  useEffect(() => {
    const handleExternalUndoRedo = (event) => {
      const { state } = event.detail || {};
      if (!state) return;
      if (state.profileImage !== undefined)
        setProfileImage(state.profileImage || null);
      if (state.contentState?.html && cvRef.current) {
        cvRef.current.innerHTML = state.contentState.html;
      }
    };
    window.addEventListener("undoRedo", handleExternalUndoRedo);
    return () => window.removeEventListener("undoRedo", handleExternalUndoRedo);
  }, []);

  // ---------- Image upload (simple) ----------
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setProfileImage(url);
    // immediate save
    setTimeout(() => saveCurrentState(), 300);
  };

  // ---------- Duplicate / Delete: event delegation ----------
  const handleButtonClick = useCallback(
    (e) => {
      const button = e.target.closest("button");
      if (!button) return;
      const action = button.getAttribute("data-action");
      const section =
        button.closest(".relative.group") ||
        button.closest("[data-section-item]") ||
        button.closest("[data-section]");

      if (!section) return;
      try {
        if (action === "duplicate") {
          const clone = section.cloneNode(true);
          // clear id attributes in the clone to avoid duplicate ids
          clone
            .querySelectorAll("[id]")
            .forEach((el) => el.removeAttribute("id"));
          section.parentNode.insertBefore(clone, section.nextSibling);
        } else if (action === "delete") {
          // if only one item remains in a repeating container, prefer to clear text rather than remove
          const parent = section.parentElement;
          const siblings = parent
            ? Array.from(parent.children).filter(
                (c) =>
                  c.matches && c.matches(".relative.group, [data-section-item]")
              )
            : [];
          if (siblings.length <= 1) {
            // attempt to clear text nodes inside rather than removing
            section
              .querySelectorAll("[contentEditable]")
              .forEach((el) => (el.textContent = ""));
          } else {
            section.remove();
          }
        }
      } catch (err) {
        console.error("duplicate/delete error", err);
      } finally {
        // save new snapshot after mutation
        setTimeout(() => saveCurrentState(), 200);
      }
    },
    [saveCurrentState]
  );

  useEffect(() => {
    const el = cvRef.current;
    if (!el) return;
    el.addEventListener("click", handleButtonClick);
    return () => el.removeEventListener("click", handleButtonClick);
  }, [handleButtonClick]);

  // ---------- AI generation (writes directly into DOM) ----------
  const handleAIGenerate = async (section, keywords) => {
    if (!geminiService.genAI) {
      const apiKey = prompt("Please enter your Gemini API key:");
      if (!apiKey) return;
      geminiService.initialize(apiKey);
    }

    try {
      // Get raw content
      const aiText = await geminiService.generateContent(section, keywords);
      if (!aiText) return;

      const raw = String(aiText).trim();
      const sec = section.toLowerCase();

      // ---------------- PROFILE ----------------
      if (sec.includes("profile") || sec.includes("summary")) {
        const el = cvRef.current.querySelector("#profile-text");
        if (el) {
          // Insert raw without formatting
          el.textContent = raw;
        }
      }

      // ---------------- SKILLS ----------------
      else if (sec.includes("skills")) {
        const list = cvRef.current.querySelector("#skills-list");
        if (list) {
          // Split lines but do NOT overclean, just trim
          const items = raw
            .split(/\r?\n|,|;|•|-/)
            .map((x) => x.trim())
            .filter((x) => x.length > 0);

          // If the AI returns a single line, make one item
          if (items.length === 0) {
            items.push(raw);
          }

          list.innerHTML = items
            .map(
              (l) => `
            <li class="text-sm relative group flex items-baseline gap-2 leading-snug">
              <span>•</span>
              <span contentEditable suppressContentEditableWarning>${l}</span>
              <div class="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button data-action="duplicate" class="text-gray-600 rounded p-1 shadow-md"><svg ... /></button>
                <button data-action="delete" class="text-gray-600 rounded p-1 shadow-md"><svg ... /></button>
              </div>
            </li>`
            )
            .join("");
        }
      }

      // ---------------- GENERAL EXPERIENCE ----------------
      else if (sec.includes("experience") || sec.includes("work")) {
        const list = cvRef.current.querySelector("#exp-list");
        if (list) {
          const items = raw
            .split(/\r?\n|•|-|;/)
            .map((x) => x.trim())
            .filter((x) => x.length > 0);

          list.innerHTML = items
            .map(
              (it) =>
                `<li contentEditable suppressContentEditableWarning>${it}</li>`
            )
            .join("");
        }
      }

      // ---------------- LANGUAGES ----------------
      else if (sec.includes("language")) {
        const list = cvRef.current.querySelector("#lang-list");
        if (list) {
          const items = raw
            .split(/\r?\n|,|;|•|-/)
            .map((x) => x.trim())
            .filter((x) => x.length > 0);

          list.innerHTML = items
            .map(
              (l) => `
            <li class="relative group" contentEditable suppressContentEditableWarning>${l}
              <div class="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                <button data-action="duplicate" class="p-1"><svg ... /></button>
                <button data-action="delete" class="p-1"><svg ... /></button>
              </div>
            </li>`
            )
            .join("");
        }
      }

      saveCurrentState();
    } catch (err) {
      console.error("AI ERROR:", err);
      alert("AI generation failed.");
    }
  };

  // ---------- Autosave on input (debounced) ----------
  useEffect(() => {
    const el = cvRef.current;
    if (!el) return;
    let tid = null;
    const onInput = () => {
      clearTimeout(tid);
      tid = setTimeout(() => {
        saveCurrentState();
      }, 700);
    };
    el.addEventListener("input", onInput);
    return () => {
      el.removeEventListener("input", onInput);
      clearTimeout(tid);
    };
  }, [saveCurrentState]);

  // initial snapshot push on mount (if empty)
  useEffect(() => {
    if (!cvRef.current) return;
    const html = cvRef.current.innerHTML;
    pushSnapshot({ html, profileImage });
  }, [pushSnapshot, profileImage]);

  // ---------- Render (keeps original Template20 layout visually) ----------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 overflow-auto">
      <div id="ai-sparkle-portal"></div>

      <div
        ref={editorContainerRef}
        data-editor-container
        style={{ transform: "scale(0.52)", transformOrigin: "top" }}
        className="transition-transform duration-500"
      >
        <div ref={cvRef} data-cv-page>
          {/* Use your original CVPage structure but with contentEditable fields and ids used by AI/save logic */}
          <div
            style={{
              width: "210mm",
              height: "297mm",
              boxSizing: "border-box",
              background: "#fff",
              borderRadius: 6,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
            className="cv-a4-page"
          >
            <style>{`
              @page { size: A4; margin: 12mm; }
              @media print {
                html, body { height: 100%; }
                .cv-a4-page { box-shadow: none !important; border: none !important; width: auto !important; height: auto !important; }
              }
            `}</style>

            {/* Header kept visually identical */}
            <header className="flex items-center p-6 border-b border-gray-200 ">
              {/* simple image upload - visually similar */}
              <div className="relative group">
                <div
                  className="w-28 h-28 mr-6 flex-shrink-0 cursor-pointer relative"
                  onClick={() =>
                    document.getElementById("template20_profile_input").click()
                  }
                >
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                      <Monitor className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </div>
                <input
                  id="template20_profile_input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="flex-grow">
                <h1
                  contentEditable
                  suppressContentEditableWarning
                  className="text-4xl font-extrabold tracking-wide text-black mb-1"
                >
                  DANIEL GALLEGO
                </h1>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  className="text-lg tracking-wide text-black"
                >
                  DEVELOPER
                </p>
              </div>
            </header>

            {/* Profile & Contact (visuals preserved) */}
            <div
              className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200 border-b border-gray-200 "
              style={{ flex: "0 0 auto" }}
            >
              <div
                className="p-6 md:col-span-2 bg-gray-50 relative group"
                data-section="profile"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold tracking-wide border-b-2 border-black">
                    Profile
                  </h2>

                  <div className="cursor-pointer">
                    <AISparkle
                      section="profile"
                      onGenerate={handleAIGenerate}
                    />
                  </div>
                </div>

                <p
                  id="profile-text"
                  contentEditable
                  suppressContentEditableWarning
                  className="text-base leading-relaxed text-black"
                >
                  Experienced mobile developer with strong frontend skills and
                  team leadership experience.
                </p>
              </div>

              <div className="p-6">
                <h2 className="text-lg font-bold tracking-wide mb-3 border-b-2 border-black pb-1">
                  Contact
                </h2>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start space-x-2">
                    <Phone className="w-4 h-4 text-black mt-1 flex-shrink-0" />
                    <span contentEditable suppressContentEditableWarning>
                      +123-456-7890
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 text-black mt-1 flex-shrink-0" />
                    <span contentEditable suppressContentEditableWarning>
                      hello@reallygreatsite.com
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-black mt-1 flex-shrink-0" />
                    <span contentEditable suppressContentEditableWarning>
                      123 Anywhere St., Any City, St 12345
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Work / Education — turned into contentEditable lists with duplicate/delete */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200 border-b border-gray-200"
              style={{ overflow: "visible" }}
            >
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <Briefcase className="w-5 h-5 text-black mr-2" />
                  <h2 className="text-xl font-bold tracking-wide border-b-2 border-black pb-1">
                    Work Experience
                  </h2>
                </div>

                   {/* work experiences  */}
                <div className="space-y-3">
                  <div
                    className="relative group p-3 bg-white rounded border border-gray-200 mb-3"
                    data-section-item
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          className="text-sm font-bold text-black"
                        >
                          Tech Solutions Inc.
                        </div>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                        >
                          2022 - Present
                        </div>
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="text-sm text-blue-600 font-medium"
                      >
                        Senior Developer
                      </div>
                      <ul
                        id="exp-list"
                        contentEditable
                        suppressContentEditableWarning
                        className="list-disc pl-6 space-y-1 text-sm text-gray-700"
                      >
                        <li>Led development team</li>
                        <li>Designed core app architecture</li>
                      </ul>
                    </div>

                    <div className="absolute p-1 flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm shadow-md z-10 top-0 right-0 space-x-1 rounded-bl-lg">
                      <button
                        data-action="duplicate"
                        title="Duplicate"
                        className="text-gray-600 hover:text-blue-600 p-0.5 rounded-full"
                      >
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button
                        data-action="delete"
                        title="Delete"
                        className="text-gray-600 hover:text-red-600 p-0.5 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
{/* work2 */}
                <div className="space-y-3">
                 <div
  className="relative group p-3 bg-white rounded border border-gray-200 mb-3"
  data-section-item
>
  <div className="space-y-2">
    <div className="flex justify-between items-start">
      <div
        contentEditable
        suppressContentEditableWarning
        className="text-sm font-bold text-black"
      >
        NovaTech Digital Solutions
      </div>

      <div
        contentEditable
        suppressContentEditableWarning
        className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
      >
        2020 - 2022
      </div>
    </div>

    <div
      contentEditable
      suppressContentEditableWarning
      className="text-sm text-blue-600 font-medium"
    >
      Frontend Developer
    </div>

    <ul
      contentEditable
      suppressContentEditableWarning
      className="list-disc pl-6 space-y-1 text-sm text-gray-700"
    >
      <li>Developed reusable React components to improve UI consistency</li>
      <li>Optimized page speed, achieving a 40% faster load time</li>
      <li>Collaborated with designers and backend teams to enhance UX</li>
    </ul>
  </div>

  <div className="absolute p-1 flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm shadow-md z-10 top-0 right-0 space-x-1 rounded-bl-lg">
    <button
      data-action="duplicate"
      title="Duplicate"
      className="text-gray-600 hover:text-blue-600 p-0.5 rounded-full"
    >
      <CopyPlus className="w-4 h-4" />
    </button>

    <button
      data-action="delete"
      title="Delete"
      className="text-gray-600 hover:text-red-600 p-0.5 rounded-full"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  </div>
</div>

                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center mb-3">
                  <GraduationCap className="w-5 h-5 text-black mr-2" />
                  <h2 className="text-xl font-bold tracking-wide border-b-2 border-black pb-1">
                    Education
                  </h2>
                </div>

                <div className="space-y-3">
                  <div
                    className="relative group p-3 bg-white rounded border border-gray-200 mb-3"
                    data-section-item
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          className="text-sm font-bold text-black"
                        >
                          Master of Computer Science
                        </div>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                        >
                          2018 - 2020
                        </div>
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="text-sm text-blue-600 font-medium"
                      >
                        State University
                      </div>
                      <ul
                        contentEditable
                        suppressContentEditableWarning
                        className="list-disc pl-6 space-y-1 text-sm text-gray-700"
                      >
                        <li>GPA: 3.8/4.0</li>
                      </ul>
                    </div>

                    <div className="absolute p-1 flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm shadow-md z-10 top-0 right-0 space-x-1 rounded-bl-lg">
                      <button
                        data-action="duplicate"
                        title="Duplicate"
                        className="text-gray-600 hover:text-blue-600 p-0.5 rounded-full"
                      >
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button
                        data-action="delete"
                        title="Delete"
                        className="text-gray-600 hover:text-red-600 p-0.5 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              <div className="space-y-3">
                  <div
                    className="relative group p-3 bg-white rounded border border-gray-200 mb-3"
                    data-section-item
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          className="text-sm font-bold text-black"
                        >
                          Master of Computer Science
                        </div>
                        <div
                          contentEditable
                          suppressContentEditableWarning
                          className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                        >
                          2018 - 2020
                        </div>
                      </div>
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        className="text-sm text-blue-600 font-medium"
                      >
                        State University
                      </div>
                      <ul
                        contentEditable
                        suppressContentEditableWarning
                        className="list-disc pl-6 space-y-1 text-sm text-gray-700"
                      >
                        <li>GPA: 3.8/4.0</li>
                      </ul>
                    </div>

                    <div className="absolute p-1 flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm shadow-md z-10 top-0 right-0 space-x-1 rounded-bl-lg">
                      <button
                        data-action="duplicate"
                        title="Duplicate"
                        className="text-gray-600 hover:text-blue-600 p-0.5 rounded-full"
                      >
                        <CopyPlus className="w-4 h-4" />
                      </button>
                      <button
                        data-action="delete"
                        title="Delete"
                        className="text-gray-600 hover:text-red-600 p-0.5 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>


              </div>
            </div>

            {/* Skills / Languages — now simple lists (visual styling preserved) */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200"
              style={{ flex: "0 0 auto" }}
            >
              <div className="p-6 relative group" data-section="skills">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold tracking-wide border-b-2 border-black pb-1">
                    Skills
                  </h2>

                  <div className="cursor-pointer">
                    <AISparkle section="skills" onGenerate={handleAIGenerate} />
                  </div>
                </div>

                <ul id="skills-list" className="space-y-3">
                  <li className="text-sm relative group flex items-baseline gap-2 leading-snug">
                    <span>•</span>
                    <span contentEditable suppressContentEditableWarning>
                      Skill 1
                    </span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button
                        data-action="duplicate"
                        className="text-gray-600 rounded p-1 shadow-md"
                      >
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button
                        data-action="delete"
                        className="text-gray-600 rounded p-1 shadow-md"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                  <li className="text-sm relative group flex items-baseline gap-2 leading-snug">
                    <span>•</span>
                    <span contentEditable suppressContentEditableWarning>
                      Skill 2
                    </span>
                    <div className="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                      <button
                        data-action="duplicate"
                        className="text-gray-600 rounded p-1 shadow-md"
                      >
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button
                        data-action="delete"
                        className="text-gray-600 rounded p-1 shadow-md"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-6 relative group" data-section="languages">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-bold tracking-wide border-b-2 border-black pb-1">
                    Languages
                  </h2>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    {" "}
                  </div>
                </div>

                <ul id="lang-list" className="space-y-3 text-sm">
                  <li
                    className="relative group"
                    contentEditable
                    suppressContentEditableWarning
                  >
                    English
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                      <button data-action="duplicate" className="p-1">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="p-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                  <li
                    className="relative group"
                    contentEditable
                    suppressContentEditableWarning
                  >
                    Spanish
                    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
                      <button data-action="duplicate" className="p-1">
                        <CopyPlus className="w-3 h-3" />
                      </button>
                      <button data-action="delete" className="p-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
