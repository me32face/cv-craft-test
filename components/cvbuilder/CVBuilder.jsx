'use client';
import React, { useState } from "react";
import { templates } from "../templates";

// Input components
import PersonalInfo from "./inputsections/PersonalInfo";
import SummaryInput from "./inputsections/SummaryInput";
import ImageUploader from "./inputsections/ImageUploader";
import SkillsInput from "./inputsections/SkillsInput";
import LanguagesInput from "./inputsections/LanguagesInput";
import ExperienceInput from "./inputsections/ExperienceInput";
import EducationInput from "./inputsections/EducationInput";
import CertificatesInput from "./inputsections/CertificatesInput";
import ProjectInput from "./inputsections/ProjectInput";

// Popup wrapper
function Popup({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-start z-50 p-8"
      onClick={onClose}
    >

      <div
        className="bg-white w-[450px] max-h-[80vh] rounded shadow-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-red-500 text-lg">✕</button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// PDF generation
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CVBuilder({ initialTemplate = "template30", onBack }) {

  const [template, setTemplate] = useState(initialTemplate.toLowerCase());
  const TemplateComponent = templates[template];

  const [openSection, setOpenSection] = useState(null);

  const [data, setData] = useState({
    name: "John Doe",
    title: "Full Stack Developer",
    phone: "+91 987654321",
    email: "john@example.com",
    address: "New Delhi, India",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    portfolio: "http://johndoe.com",


    profileImage: "",
    imageShape: "circle",
    imageAlign: "center",

    visibleSections: {
      summary: true,
      projects: true,
      skills: true,
      languages: true,
      experience: true,
      education: true,
      certificates: true
    },

    languages: [
      { name: "English", proficiency: 90 },
      { name: "Hindi", proficiency: 85 }
    ],
    experiences: [
      { role: "Developer", company: "Google", year: "2020 - 2022" }
    ],
    education: [
      { course: "BCA", school: "ABC College", year: "2017 - 2020" }
    ],
    certificates: [
      { name: "Full Stack Development", issuer: "Tech Academy", year: "2023" },
      { name: "Data Structures & Algorithms", issuer: "Code Institute", year: "2022" }
    ]
  });

  const update = (key, value) => {
    setData({ ...data, [key]: value });
  };

  // --- Download CV as PDF with Smart Page Break Detection ---
  const handleDownload = async () => {
    const element = document.getElementById("pdf-template");
    if (!element) return;

    // Adjust layout to prevent content splitting
    adjustLayoutForPageBreaks(element);

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    // A4 page height at scale 2: 1123px * 2 = 2246px
    const A4_HEIGHT_PX = 2246;
    const totalPages = Math.ceil(canvas.height / A4_HEIGHT_PX);

    console.log('Canvas height:', canvas.height);
    console.log('Total pages:', totalPages);

    for (let page = 0; page < totalPages; page++) {
      if (page > 0) pdf.addPage();
      const yOffset = -(page * pageHeight);
      pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
    }

    // Reset layout
    resetLayout(element);

    pdf.save(`${data.name || "cv"}.pdf`);
  };

  // Smart page break detection
  const adjustLayoutForPageBreaks = (element) => {
    const totalHeight = element.scrollHeight;
    const pageHeight = 1123;

    console.log('Element height before adjustments:', totalHeight);

    // Only run smart breaks if content exceeds 1 page
    if (totalHeight <= pageHeight * 1.05) {
      console.log('Content fits on 1 page, skipping smart breaks');
      return;
    }

    console.log('Running smart breaks for multi-page content');
    const items = element.querySelectorAll('.cv-item');

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const top = rect.top - elementRect.top;
      const bottom = top + rect.height;

      const pageNumber = Math.floor(top / pageHeight);
      const pageEnd = (pageNumber + 1) * pageHeight;

      if (bottom > pageEnd && top < pageEnd) {
        const pushDistance = pageEnd - top + 20;
        item.style.marginTop = `${pushDistance}px`;
        console.log('Pushed item by', pushDistance, 'px');
      }
    });

    // Extend sidebar to match total content height
    const sidebar = element.querySelector('.cv-sidebar');
    if (sidebar) {
      const totalHeightAfterAdjustments = element.scrollHeight;
      sidebar.style.minHeight = `${totalHeightAfterAdjustments}px`;
      console.log('Sidebar extended to:', totalHeightAfterAdjustments, 'px');
    }
  };

  const resetLayout = (element) => {
    const items = element.querySelectorAll('.cv-item');
    items.forEach(item => {
      item.style.marginTop = '';
    });

    // Reset sidebar height
    const sidebar = element.querySelector('.cv-sidebar');
    if (sidebar) {
      sidebar.style.minHeight = '';
    }
  };

  return (
    <div className="flex gap-6 p-6">

      {/* LEFT SIDE — TEMPLATE SELECTOR + INPUT BUTTONS */}
      <div className="w-1/3 space-y-6">

        {onBack && (
          <button
            onClick={onBack}
            className="w-full p-3 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ← Back to Templates
          </button>
        )}

        {/* Template selector */}
        {/* <div>
          <label className="font-semibold">Select Template</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full border p-2 rounded"
          >
            {Object.keys(templates).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div> */}

        {/* Input section buttons */}
        {[
          { name: "Personal Info", key: "personal" },
          { name: "summary", key: "summary" },
          { name: "projects", key: "projects" },
          { name: "Profile Image", key: "image" },
          { name: "skills", key: "skills" },
          { name: "Languages", key: "languages" },
          { name: "Experience", key: "experience" },
          { name: "Education", key: "education" },
          { name: "Certificates", key: "certificates" },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setOpenSection(item.key)}
            className="w-full p-3 border rounded bg-gray-100 text-left hover:bg-gray-200"
          >
            ✏️ Edit {item.name}
          </button>
        ))}

        {/* --- Global Download Button --- */}
        <button
          onClick={handleDownload}
          className="w-full p-3 mt-4 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ⬇️ Download CV
        </button>

      </div>

      {/* RIGHT SIDE — TEMPLATE PREVIEW */}
      <div className="w-2/3 border shadow-lg overflow-auto">
        {TemplateComponent ? (
          <div id="cv-preview">
            <div id="template-content">
              <TemplateComponent data={data} />
            </div>
          </div>
        ) : (
          <p className="p-5 text-red-500">Template not found.</p>
        )}
      </div>

      {/* POPUP SECTIONS */}
      {openSection === "personal" && (
        <Popup title="Edit Personal Info" onClose={() => setOpenSection(null)}>
          <input
            placeholder="Name"
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            placeholder="Title"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            placeholder="Phone"
            value={data.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            placeholder="Email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <input
            placeholder="Address"
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
            className="w-full border p-2 rounded"
          />
           <input
            placeholder="Linkedin"
            value={data.linkedin}
            onChange={(e) => update("linkedin", e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="Github"
            value={data.github}
            onChange={(e) => update("github", e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            placeholder="Portfolio"
            value={data.portfolio}
            onChange={(e) => update("portfolio", e.target.value)}
            className="w-full border p-2 rounded"
          />
        </Popup>
      )}

      {openSection === "image" && (
        <Popup title="Edit Profile Image" onClose={() => setOpenSection(null)}>
          <ImageUploader
            image={data.profileImage}
            setImage={(v) => update("profileImage", v)}
            setShape={(v) => update("imageShape", v)}
            setAlign={(v) => update("imageAlign", v)}
          />
        </Popup>
      )}

      {openSection === "languages" && (
        <Popup title="Edit Languages" onClose={() => setOpenSection(null)}>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded">
            <span className="font-medium">Show this section in CV</span>
            <input
              type="checkbox"
              checked={data.visibleSections?.languages !== false}
              onChange={(e) => update("visibleSections", { ...data.visibleSections, languages: e.target.checked })}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <LanguagesInput
            languages={data.languages}
            setLanguages={(v) => update("languages", v)}
          />
        </Popup>
      )}

      {openSection === "summary" && (
        <Popup title="Edit Professional Summary" onClose={() => setOpenSection(null)}>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded">
            <span className="font-medium">Show this section in CV</span>
            <input
              type="checkbox"
              checked={data.visibleSections?.summary !== false}
              onChange={(e) => update("visibleSections", { ...data.visibleSections, summary: e.target.checked })}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <SummaryInput
            summary={data.summary}
            setSummary={(v) => update("summary", v)}
          />
        </Popup>
      )}

      {openSection === "projects" && (
        <Popup title="Edit Projects" onClose={() => setOpenSection(null)}>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded">
            <span className="font-medium">Show this section in CV</span>
            <input
              type="checkbox"
              checked={data.visibleSections?.projects !== false}
              onChange={(e) => update("visibleSections", { ...data.visibleSections, projects: e.target.checked })}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <ProjectInput
            projects={data.projects}
            setProjects={(v) => update("projects", v)}
          />
        </Popup>
      )}

      {openSection === "experience" && (
        <Popup title="Edit Experience" onClose={() => setOpenSection(null)}>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded">
            <span className="font-medium">Show this section in CV</span>
            <input
              type="checkbox"
              checked={data.visibleSections?.experience !== false}
              onChange={(e) => update("visibleSections", { ...data.visibleSections, experience: e.target.checked })}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <ExperienceInput
            experiences={data.experiences}
            setExperiences={(v) => update("experiences", v)}
          />
        </Popup>
      )}

      {openSection === "skills" && (
        <Popup title="Edit Skills" onClose={() => setOpenSection(null)}>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded">
            <span className="font-medium">Show this section in CV</span>
            <input
              type="checkbox"
              checked={data.visibleSections?.skills !== false}
              onChange={(e) => update("visibleSections", { ...data.visibleSections, skills: e.target.checked })}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <SkillsInput
            skills={data.skills}
            setSkills={(v) => update("skills", v)}
          />
        </Popup>
      )}

      {openSection === "education" && (
        <Popup title="Edit Education" onClose={() => setOpenSection(null)}>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded">
            <span className="font-medium">Show this section in CV</span>
            <input
              type="checkbox"
              checked={data.visibleSections?.education !== false}
              onChange={(e) => update("visibleSections", { ...data.visibleSections, education: e.target.checked })}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <EducationInput
            education={data.education}
            setEducation={(v) => update("education", v)}
          />
        </Popup>
      )}

      {openSection === "certificates" && (
        <Popup title="Edit Certificates" onClose={() => setOpenSection(null)}>
          <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded">
            <span className="font-medium">Show this section in CV</span>
            <input
              type="checkbox"
              checked={data.visibleSections?.certificates !== false}
              onChange={(e) => update("visibleSections", { ...data.visibleSections, certificates: e.target.checked })}
              className="w-5 h-5 cursor-pointer"
            />
          </div>
          <CertificatesInput
            certificates={data.certificates}
            setCertificates={(v) => update("certificates", v)}
          />
        </Popup>
      )}

      {/* Hidden template for PDF generation */}
      <div id="pdf-template" className="fixed -top-[9999px] -left-[9999px]">
        {TemplateComponent && <TemplateComponent data={data} />}
      </div>

    </div>
  );
}       