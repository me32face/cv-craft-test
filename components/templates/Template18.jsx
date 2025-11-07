"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Copy, Trash2 } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function Page() {
  const [resume, setResume] = useState({
    name: "Juliana Silva",
    title: "Psychologist",
    profile:
      "Knowledgeable and qualified Clinical Psychologist with a proven track record of success in conducting comprehensive psychological evaluations, developing custom treatment plans, and providing professional individual and group psychotherapy.",
    experience: [
      {
        role: "Head Clinical Psychologist",
        company: "BORCELLE HOSPITAL",
        years: "1997 - 2020",
      },
    ],
    education: [
      {
        degree: "Doctorate - Clinical Psychology",
        school: "UNIVERSITY OF GINYARD",
        years: "1997 - 2020",
      },
    ],
    skills: [
      "Counseling",
      "Psychotherapy",
      "Evidence-Based Therapy",
      "Behavior Modification",
      "Coaching",
      "Communication",
      "Interpersonal",
      "Active Listening",
      "Writing Reports",
    ],
    contact: {
      address: "123 Anywhere St. Any City",
      phone: "+123-456-7890",
      email: "hello@reallygreatsite.com",
    },
  });

  const [photo, setPhoto] = useState("/profile.jpg");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);

  // ---- handlers ----
  const handleEdit = (path, value) => {
    setResume((prev) => {
      const newData = { ...prev };
      const keys = path.split(".");
      let temp = newData;
      for (let i = 0; i < keys.length - 1; i++) temp = temp[keys[i]];
      temp[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const duplicateItem = (section, index) => {
    setResume((prev) => {
      const newArr = [...prev[section]];
      newArr.splice(index + 1, 0, { ...newArr[index] });
      return { ...prev, [section]: newArr };
    });
  };

  const deleteItem = (section, index) => {
    setResume((prev) => {
      const newArr = prev[section].filter((_, i) => i !== index);
      return { ...prev, [section]: newArr };
    });
  };

  // ---- image upload ----
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // ---- textarea auto expand ----
  const handleProfileChange = (e) => {
    handleEdit("profile", e.target.value);
    autoResizeTextarea(e.target);
  };

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  // ---- PDF Download Function ----
  const downloadPDF = useCallback(async () => {
    if (isGeneratingPDF) return;
    
    setIsGeneratingPDF(true);
    const cvElement = cvRef.current;

    if (!cvElement) {
      console.error("No CV page found to download.");
      setIsGeneratingPDF(false);
      return;
    }

    const parentContainer = editorContainerRef.current;
    if (!parentContainer) {
      console.error("Could not find parent scaling container.");
      setIsGeneratingPDF(false);
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let oldTransform, oldTransition;

    try {
      // Save old scale and set to normal for PDF generation
      oldTransform = parentContainer.style.transform;
      oldTransition = parentContainer.style.transition;
      parentContainer.style.transform = "scale(1)";
      parentContainer.style.transition = "none";
      
      // Wait for the DOM to update
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        ignoreElements: (el) => {
          // Hide interactive elements for PDF
          return el.tagName === "BUTTON" || 
                 el.classList.contains('group-hover:opacity-100') ||
                 el.classList.contains('opacity-0') ||
                 el.classList.contains('hidden');
        }
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);

      // Use the resume name for the filename
      const fileName = `${resume.name.replace(/\s+/g, '_')}_Resume.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      // Restore original scale
      parentContainer.style.transform = oldTransform;
      parentContainer.style.transition = oldTransition;
      setIsGeneratingPDF(false);
    }
  }, [isGeneratingPDF, resume.name]);

  // Register PDF function with global context (like the example)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.downloadResumePDF = downloadPDF;
    }
  }, [downloadPDF]);

  // Initialize textarea height on component mount and when profile changes
  useEffect(() => {
    if (textareaRef.current) {
      autoResizeTextarea(textareaRef.current);
    }
  }, [resume.profile]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      {/* Loading overlay for PDF generation */}
      {isGeneratingPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            <span className="text-gray-700">Generating PDF...</span>
          </div>
        </div>
      )}

      {/* Scaling Container - Exactly like the example */}
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        {/* A4 Paper Container */}
        <div
          ref={cvRef}
          data-cv-page
          className="bg-white border-[6px] border-yellow-500 font-sans text-black shadow-2xl"
          style={{
            width: "210mm",
            height: "297mm",
          }}
        >
          <div className="p-8 sm:p-10 md:p-12 h-full overflow-hidden">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
              {/* Profile image */}
              <div
                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-[4px] sm:border-[6px] border-yellow-500 overflow-hidden cursor-pointer relative group flex-shrink-0"
                onClick={() => fileInputRef.current.click()}
              >
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs sm:text-sm font-medium text-center p-2">
                  Click to Change
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              
              {/* Name and title */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <input
                  type="text"
                  value={resume.name}
                  onChange={(e) => handleEdit("name", e.target.value)}
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-600 bg-transparent outline-none w-full mb-2 sm:mb-3 leading-tight text-center sm:text-left"
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  value={resume.title}
                  onChange={(e) => handleEdit("title", e.target.value)}
                  className="block text-lg sm:text-xl lg:text-2xl uppercase tracking-widest text-black bg-transparent outline-none w-full font-semibold text-center sm:text-left"
                  placeholder="Your Title"
                />
              </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
              {/* LEFT COLUMN */}
              <div className="space-y-6 lg:space-y-8">
                {/* PROFILE */}
                <section>
                  <h2 className="text-yellow-600 font-semibold tracking-widest mb-2 sm:mb-3 text-base sm:text-lg">
                    PROFILE
                  </h2>
                  <div className="min-h-[80px] sm:min-h-[100px]">
                    <textarea
                      ref={textareaRef}
                      value={resume.profile}
                      onChange={handleProfileChange}
                      className="w-full bg-transparent outline-none resize-none leading-relaxed text-black border border-transparent hover:border-gray-200 rounded p-2 transition-colors text-sm sm:text-base"
                      style={{ 
                        minHeight: "80px",
                        overflow: "hidden",
                        height: "auto"
                      }}
                      placeholder="Enter your professional profile summary..."
                    />
                  </div>
                </section>

                {/* EXPERIENCE */}
                <section>
                  <h2 className="text-yellow-600 font-semibold tracking-widest mb-2 sm:mb-3 text-base sm:text-lg">
                    EXPERIENCE
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {resume.experience.map((exp, i) => (
                      <div
                        key={i}
                        className="group relative p-2 sm:p-3 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="absolute right-1 sm:right-2 top-1 sm:top-2 hidden group-hover:flex space-x-1 sm:space-x-2 bg-white rounded shadow-sm p-1">
                          <button 
                            onClick={() => duplicateItem("experience", i)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button 
                            onClick={() => deleteItem("experience", i)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) =>
                            handleEdit(`experience.${i}.role`, e.target.value)
                          }
                          className="block text-base sm:text-lg font-semibold bg-transparent outline-none w-full mb-1"
                          placeholder="Job Title"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            handleEdit(`experience.${i}.company`, e.target.value)
                          }
                          className="block uppercase font-bold bg-transparent outline-none w-full mb-1 text-sm sm:text-base"
                          placeholder="Company Name"
                        />
                        <input
                          type="text"
                          value={exp.years}
                          onChange={(e) =>
                            handleEdit(`experience.${i}.years`, e.target.value)
                          }
                          className="italic text-gray-700 text-xs sm:text-sm bg-transparent outline-none w-full"
                          placeholder="Years"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* EDUCATION */}
                <section>
                  <h2 className="text-yellow-600 font-semibold tracking-widest mb-2 sm:mb-3 text-base sm:text-lg">
                    EDUCATION
                  </h2>
                  <div className="space-y-3 sm:space-y-4">
                    {resume.education.map((edu, i) => (
                      <div
                        key={i}
                        className="group relative p-2 sm:p-3 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <div className="absolute right-1 sm:right-2 top-1 sm:top-2 hidden group-hover:flex space-x-1 sm:space-x-2 bg-white rounded shadow-sm p-1">
                          <button 
                            onClick={() => duplicateItem("education", i)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button 
                            onClick={() => deleteItem("education", i)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) =>
                            handleEdit(`education.${i}.degree`, e.target.value)
                          }
                          className="block text-base sm:text-lg font-semibold bg-transparent outline-none w-full mb-1"
                          placeholder="Degree"
                        />
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) =>
                            handleEdit(`education.${i}.school`, e.target.value)
                          }
                          className="block uppercase font-bold bg-transparent outline-none w-full mb-1 text-sm sm:text-base"
                          placeholder="School Name"
                        />
                        <input
                          type="text"
                          value={edu.years}
                          onChange={(e) =>
                            handleEdit(`education.${i}.years`, e.target.value)
                          }
                          className="italic text-gray-700 text-xs sm:text-sm bg-transparent outline-none w-full"
                          placeholder="Years"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6 lg:space-y-8">
                {/* SKILLS */}
                <section>
                  <h2 className="text-yellow-600 font-semibold tracking-widest mb-2 sm:mb-3 text-base sm:text-lg">
                    SKILLS
                  </h2>
                  <ul className="space-y-1 sm:space-y-2">
                    {resume.skills.map((skill, i) => (
                      <li
                        key={i}
                        className="group flex justify-between items-center p-1 sm:p-2 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <input
                          type="text"
                          value={skill}
                          onChange={(e) =>
                            handleEdit(`skills.${i}`, e.target.value)
                          }
                          className="bg-transparent outline-none w-full text-black text-sm sm:text-base"
                          placeholder="Skill"
                        />
                        <div className="hidden group-hover:flex space-x-1">
                          <button 
                            onClick={() => duplicateItem("skills", i)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Copy className="text-gray-600 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                          <button 
                            onClick={() => deleteItem("skills", i)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Trash2 className="text-gray-600 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* CONTACT */}
                <section>
                  <h2 className="text-yellow-600 font-semibold tracking-widest mb-2 sm:mb-3 text-base sm:text-lg">
                    CONTACT
                  </h2>
                  <div className="space-y-1 sm:space-y-2 text-black">
                    <div className="p-1 sm:p-2 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors">
                      <input
                        type="text"
                        value={resume.contact.address}
                        onChange={(e) =>
                          handleEdit("contact.address", e.target.value)
                        }
                        className="block bg-transparent outline-none w-full text-sm sm:text-base"
                        placeholder="Address"
                      />
                    </div>
                    <div className="p-1 sm:p-2 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors">
                      <input
                        type="text"
                        value={resume.contact.phone}
                        onChange={(e) =>
                          handleEdit("contact.phone", e.target.value)
                        }
                        className="block bg-transparent outline-none w-full text-sm sm:text-base"
                        placeholder="Phone"
                      />
                    </div>
                    <div className="p-1 sm:p-2 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors">
                      <input
                        type="text"
                        value={resume.contact.email}
                        onChange={(e) =>
                          handleEdit("contact.email", e.target.value)
                        }
                        className="block bg-transparent outline-none w-full text-sm sm:text-base"
                        placeholder="Email"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}