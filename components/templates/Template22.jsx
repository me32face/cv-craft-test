// Template22.jsx
"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  CopyPlus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Draggable from "react-draggable";

import { usePDF } from "@/contexts/PDFContext";
import AISparkle from "../AISparkle";
import { geminiService } from "../../lib/gemini";
import { useUndoRedo } from "../../contexts/UndoRedoContext";

export default function Template22() {
  // --- State ---
  const [profileImage, setProfileImage] = useState(null);
  const [contentState, setContentState] = useState({});
  const { saveState } = useUndoRedo();

  // Refs
  const cvRef = useRef(null);
  const editorContainerRef = useRef(null);

  // PDF
  const { registerPDFFunction, downloadPDF } = usePDF();
  useEffect(() => {
    if (registerPDFFunction) registerPDFFunction();
  }, [registerPDFFunction]);

  async function handleDownloadPDF() {
    if (cvRef.current) await downloadPDF(cvRef.current, "Salesman_CV.pdf");
  }

  const handleImageUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      // save previous state, then update
      saveState({ profileImage, contentState });
      setProfileImage(e.target.result);
      // also save new state
      if (cvRef.current) {
        const html = cvRef.current.innerHTML;
        setContentState({ html });
        saveState({ profileImage: e.target.result, contentState: { html } });
      }
    };
    reader.readAsDataURL(file);
  };

  // ---------------- Button actions (duplicate/delete) ----------------
  const handleButtonClick = useCallback(
    (e) => {
      const button = e.target.closest("button");
      if (!button) return;

      const action = button.getAttribute("data-action");
      const section =
        button.closest(".relative.group") ||
        button.closest("[data-section-item]");

      if (!section) return;

      try {
        if (action === "duplicate") {
          const draggableParent = section.parentElement;
          // handle react-draggable wrappers
          if (
            draggableParent &&
            draggableParent.classList.contains("react-draggable")
          ) {
            const outerDraggable = draggableParent.parentElement;
            const clone = outerDraggable.cloneNode(true);
            outerDraggable.parentNode.insertBefore(
              clone,
              outerDraggable.nextSibling
            );
          } else {
            const clone = section.cloneNode(true);
            section.parentNode.insertBefore(clone, section.nextSibling);
          }

          // save new state after duplication
          if (cvRef.current) {
            const html = cvRef.current.innerHTML;
            setContentState({ html });
            saveState({ profileImage, contentState: { html } });
          }
        } else if (action === "delete") {
          const draggableParent = section.parentElement;
          if (
            draggableParent &&
            draggableParent.classList.contains("react-draggable")
          ) {
            const outerDraggable = draggableParent.parentElement;
            outerDraggable.remove();
          } else {
            section.remove();
          }

          // save new state after deletion
          if (cvRef.current) {
            const html = cvRef.current.innerHTML;
            setContentState({ html });
            saveState({ profileImage, contentState: { html } });
          }
        }
      } catch (err) {
        // ignore DOM errors
        console.error(err);
      }
    },
    [profileImage, contentState, saveState]
  );

  // attach click handler to the CV container
  useEffect(() => {
    const el = cvRef.current;
    if (!el) return;
    el.addEventListener("click", handleButtonClick);
    return () => el.removeEventListener("click", handleButtonClick);
  }, [handleButtonClick]);

  // ---------------- AI generation (AISparkle) ----------------

  const handleAIGenerate = async (section, keywords) => {
    if (!geminiService.genAI) {
      const apiKey = prompt("Please enter your Gemini API key:");
      if (!apiKey) return;
      geminiService.initialize(apiKey);
    }

    try {
      const generatedContent = await geminiService.generateContent(
        section,
        keywords
      );

      let cleaned = generatedContent
        .replace(/^#{1,6}\s+.+$/gm, "")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

      // PROFILE / SUMMARY
      if (
        section.toLowerCase().includes("profile") ||
        section.toLowerCase().includes("summary")
      ) {
        const el = document.getElementById("profile-text");
        if (el) {
          const paragraphs = cleaned
            .split("\n\n")
            .filter(
              (p) =>
                p.trim().length > 80 &&
                !/here are|choose|option|example|tip/i.test(p)
            );
          const finalText = paragraphs[0]?.trim() || cleaned;
          el.textContent = finalText;
        }
      }

      // SKILLS
      else if (section.toLowerCase().includes("skills")) {
        const skillsElement = document.getElementById("skills-list");
        if (skillsElement) {
          const lines = cleaned
            .split("\n")
            .filter((line) => line.trim().length > 1);
          skillsElement.innerHTML = lines
            .map(
              (skill) => `
            <li class="text-sm flex items-start relative group">
              <span class="mr-2">•</span>
              <span contentEditable suppressContentEditableWarning>${skill.trim()}</span>
              <div class="absolute -right-4 -top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                <button data-action="duplicate" class="text-gray-600 rounded p-1 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                </button>
                <button data-action="delete" class="text-gray-600 rounded p-1 shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </li>`
            )
            .join("");
        }
      }

      // WORK EXPERIENCE
      else if (section.toLowerCase().includes("experience")) {
        const expList = document.getElementById("exp-list");
        if (expList) {
          const experiences = cleaned
            .split(/\n|•|-/)
            .filter((line) => line.trim().length > 2);
          expList.innerHTML = experiences
            .map(
              (exp) =>
                `<li contentEditable suppressContentEditableWarning>${exp.trim()}</li>`
            )
            .join("");
        }
      }

      // Save to undo/redo
      if (cvRef.current) {
        const html = cvRef.current.innerHTML;
        setContentState({ html });
        saveState({ profileImage, contentState: { html } });
      }
    } catch (error) {
      alert("AI generation failed. Please check your API key or try again.");
      console.error(error);
    }
  };

  // ---------------- Autosave (debounced) on input ----------------
  useEffect(() => {
    const el = cvRef.current;
    if (!el) return;

    let timeoutId = null;
    const onInput = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const html = el.innerHTML;
        setContentState({ html });
        saveState({ profileImage, contentState: { html } });
      }, 800);
    };

    el.addEventListener("input", onInput);
    return () => {
      el.removeEventListener("input", onInput);
      clearTimeout(timeoutId);
    };
  }, [profileImage, saveState]);

  // ---------------- Undo / Redo listener ----------------
  useEffect(() => {
    const handleUndoRedo = (event) => {
      const { state } = event.detail || {};
      if (!state) return;
      if (state.profileImage !== undefined)
        setProfileImage(state.profileImage || null);
      if (state.contentState?.html && cvRef.current) {
        cvRef.current.innerHTML = state.contentState.html;
      }
    };
    window.addEventListener("undoRedo", handleUndoRedo);
    return () => window.removeEventListener("undoRedo", handleUndoRedo);
  }, []);

  // ---------------- Initial save (push base state) ----------------
  useEffect(() => {
    if (cvRef.current) {
      const html = cvRef.current.innerHTML;
      setContentState({ html });
      saveState({ profileImage: null, contentState: { html } });
    }
  }, [saveState]);

  // ------------- Helpful small list behaviors (enter/backspace) -------------
  // handle adding new li on Enter for lists (skills/experience) by delegating to keydown on container
  const handleListKeyDown = (e) => {
    // Enter inside LI -> create new li
    if (e.key === "Enter") {
      const sel = window.getSelection();
      let node = sel?.anchorNode;
      while (node && node.tagName !== "LI") node = node.parentElement;
      if (node) {
        e.preventDefault();
        const newLi = document.createElement("li");
        newLi.setAttribute("contentEditable", "true");
        newLi.setAttribute("suppressContentEditableWarning", "true");
        newLi.innerHTML = "\u200B"; // zero width to start
        node.parentNode.insertBefore(newLi, node.nextSibling);

        // place caret inside newLi
        const range = document.createRange();
        range.selectNodeContents(newLi);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
    // Backspace cleanup handled by autosave / duplicate-delete logic as well
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div
          ref={cvRef}
          data-cv-page
          className="relative bg-white shadow-lg overflow-visible"
          style={{
            width: "210mm",
            height: "297mm",
            padding: "18mm",
            borderRadius: "8px",
          }}
          onKeyDown={handleListKeyDown}
        >
          {/* Header */}
          <div className="relative mb-8">
            <div className="flex items-center bg-[#e8eef4] rounded-r-full p-6 w-[620px] shadow-sm">
              <div
                className="relative w-32 h-32 rounded-full overflow-hidden -ml-16 bg-white border-4 border-white shadow-md cursor-pointer"
                onClick={() =>
                  document.getElementById("profileImageInput").click()
                }
              >
                <img
                  src={ "/templateprofile/template22profile.jpg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="ml-8">
                <h1
                  className="text-4xl font-bold text-gray-800 tracking-wide"
                  contentEditable
                  suppressContentEditableWarning
                >
                  DONNA STROUPE
                </h1>
                <p
                  className="text-lg text-gray-600 font-medium mt-1"
                  contentEditable
                  suppressContentEditableWarning
                >
                  Professional Sales Executive
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="grid grid-cols-[35%_65%] gap-6 text-gray-800 ">
            {/* Left Sidebar */}
            <div className="bg-[#f3f6fa] rounded-2xl p-5 flex flex-col justify-start  ">
              {/* Contact */}
              <section className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-2">
                  Contact
                </h3>
                <div className="space-y-2" data-section-item>
                  <div className="flex items-center gap-2">
                  
                    <span contentEditable suppressContentEditableWarning>
                      +1 234 567 890
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      className="break-all"
                    >
                      donna.s@businessmail.com
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                   
                    <span contentEditable suppressContentEditableWarning>
                      789 Elm Street, Springfield, USA
                    </span>
                  </div>

                  <div className="absolute -right-4 -top-12 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10"></div>
                </div>
              </section>

              {/* Skills */}
              <section className="mb-6 section-container" data-section="skills">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1">
                    Skills
                  </h3>
                  <AISparkle section="skills" onGenerate={handleAIGenerate} />
                </div>

                <ul
                  id="skills-list"
                  className="text-sm mt-2 list-disc pl-4 space-y-1"
                  onKeyDown={(e) => {
                    // cleanup empty lis on backspace
                    if (e.key === "Backspace") {
                      const lis = e.currentTarget.querySelectorAll("li");
                      lis.forEach((li) => {
                        if (!li.textContent.trim()) li.remove();
                      });
                    }
                  }}
                >
                 <li className="text-sm relative group flex items-baseline gap-2 leading-snug">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>
                      Client Relationship Building
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
                  <li className="text-sm flex items-start relative group">
                    <span className="mr-2">•</span>
                    <span contentEditable suppressContentEditableWarning>
                      Target Achievement
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
              </section>


              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-2">
                  Language
                </h3>
               <ul className="text-sm space-y-1">
  <li className="relative group" contentEditable suppressContentEditableWarning>
    English
    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
      <button data-action="duplicate" className="p-1"><CopyPlus className="w-3 h-3" /></button>
      <button data-action="delete" className="p-1"><Trash2 className="w-3 h-3" /></button>
    </div>
  </li>

  <li className="relative group" contentEditable suppressContentEditableWarning>
    Hindi
    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
      <button data-action="duplicate" className="p-1"><CopyPlus className="w-3 h-3" /></button>
      <button data-action="delete" className="p-1"><Trash2 className="w-3 h-3" /></button>
    </div>
  </li>
</ul>

              </section>

              

            

              {/* Certifications */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-2">
                  Certifications
                </h3>
               <ul className="text-sm space-y-1">
  <li className="relative group" contentEditable suppressContentEditableWarning>
    Certified Sales Expert (CSE) — 2021
    <div className="absolute right-0 opacity-0 group-hover:opacity-100 flex gap-1">
      <button data-action="duplicate" className="p-1"><CopyPlus className="w-3 h-3" /></button>
      <button data-action="delete" className="p-1"><Trash2 className="w-3 h-3" /></button>
    </div>
  </li>

  <li className="relative group" contentEditable suppressContentEditableWarning>
    CRM Professional — 2020
    <div className="absolute right-0 opacity-0 group-hover:opacity-100 flex gap-1">
      <button data-action="duplicate" className="p-1"><CopyPlus className="w-3 h-3" /></button>
      <button data-action="delete" className="p-1"><Trash2 className="w-3 h-3" /></button>
    </div>
  </li>
</ul>

              </section>
            </div>

            {/* Right Main */}
            <div className="p-4">
              {/* Profile */}
              <section
                className="mb-8 section-container group"
                data-section="profile"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1">
                    Profile
                  </h3>
                 <AISparkle section="profile" onGenerate={handleAIGenerate} />

                </div>
                <p
                  id="profile-text"
                  className="text-sm leading-relaxed mt-2"
                  contentEditable
                  suppressContentEditableWarning
                >
                  Dynamic Sales Executive with 5+ years of experience exceeding
                  revenue goals through strategic relationship management and
                  strong negotiation skills.
                </p>
              </section>

              {/* Experience */}
              <section
                className="mb-8 section-container"
                data-section="work-experience"
              >
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1">
                    Work Experience
                  </h3>
                
                </div>

              <div className="ml-2 mt-3 space-y-2 border-l-2 border-gray-300 pl-5">
  <ul
    id="exp-list"
    className="text-sm space-y-2"
  >
    <li className="flex items-baseline gap-2 leading-snug relative group">
      <span className="text-base">•</span>
      <span contentEditable suppressContentEditableWarning className="inline-block align-top">
        Achieved 120% of quarterly sales targets across the region.
      </span>
        <div className="absolute right-0 opacity-0 group-hover:opacity-100 flex gap-1">
    <button data-action="duplicate" className="p-1"><CopyPlus className="w-3 h-3" /></button>
    <button data-action="delete" className="p-1"><Trash2 className="w-3 h-3" /></button>
  </div>
    </li>

    <li className="flex items-baseline gap-2 leading-snug relative group">
      <span className="text-base">•</span>
      <span contentEditable suppressContentEditableWarning className="inline-block align-top">
        Developed B2B partnerships increasing revenue by $1.2M.
      </span>
          <div className="absolute right-0 opacity-0 group-hover:opacity-100 flex gap-1">
    <button data-action="duplicate" className="p-1"><CopyPlus className="w-3 h-3" /></button>
    <button data-action="delete" className="p-1"><Trash2 className="w-3 h-3" /></button>
  </div>
    </li>

    <li className="flex items-baseline gap-2 leading-snug relative group">
      <span className="text-base">•</span>
      <span contentEditable suppressContentEditableWarning className="inline-block align-top">
        Implemented CRM strategies improving retention by 35%.
      </span>
          <div className="absolute right-0 opacity-0 group-hover:opacity-100 flex gap-1">
    <button data-action="duplicate" className="p-1"><CopyPlus className="w-3 h-3" /></button>
    <button data-action="delete" className="p-1"><Trash2 className="w-3 h-3" /></button>
  </div>``
    </li>
  </ul>
</div>

              </section>


                {/* Education */}
              <section className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-2">
                  Education
                </h3>
               <div className="relative group p-1">
    <p
      contentEditable
      suppressContentEditableWarning
      className="font-semibold"
    >
      Bachelor of Commerce (B.Com)
    </p>
    <p
      className="text-xs text-gray-600"
      contentEditable
      suppressContentEditableWarning
    >
      Wardiere University — 2015–2018
    </p>

    {/* Duplicate / Delete Buttons */}
    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
      <button data-action="duplicate" className="p-1 text-gray-600">
        <CopyPlus className="w-3 h-3" />
      </button>
      <button data-action="delete" className="p-1 text-gray-600">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>
              </section>

              {/* References */}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-gray-300 pb-1 mb-2">
                  References
                </h3>
                <div className="text-sm space-y-4">

  {/* Reference 1 */}
  <div className="relative group p-1">
    <p
      className="font-semibold"
      contentEditable
      suppressContentEditableWarning
    >
      John Smith — Sales Director, Timmerman Industries
    </p>
    <p
      className="text-xs text-gray-600"
      contentEditable
      suppressContentEditableWarning
    >
      john.smith@company.com | +1 222 333 4444
    </p>

    {/* Duplicate / Delete Buttons */}
    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
      <button data-action="duplicate" className="p-1 text-gray-600">
        <CopyPlus className="w-3 h-3" />
      </button>
      <button data-action="delete" className="p-1 text-gray-600">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>

  {/* Reference 2 */}
  <div className="relative group p-1">
    <p
      className="font-semibold"
      contentEditable
      suppressContentEditableWarning
    >
      Sarah Johnson — Marketing Head, Borcelle Co.
    </p>
    <p
      className="text-xs text-gray-600"
      contentEditable
      suppressContentEditableWarning
    >
      sarah.j@borcelle.com | +1 999 888 7777
    </p>

    {/* Duplicate / Delete Buttons */}
    <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex gap-1">
      <button data-action="duplicate" className="p-1 text-gray-600">
        <CopyPlus className="w-3 h-3" />
      </button>
      <button data-action="delete" className="p-1 text-gray-600">
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  </div>

</div>

              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
