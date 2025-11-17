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

    profileImage: "",
    imageShape: "circle",
    imageAlign: "center",

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

  // --- Download CV as PDF ---
  const handleDownload = async () => {
    const element = document.getElementById("pdf-template");
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit A4
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pdfHeight);
    pdf.save(`${data.name || "cv"}.pdf`);
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
          <LanguagesInput
            languages={data.languages}
            setLanguages={(v) => update("languages", v)}
          />
        </Popup>
      )}

      {openSection === "summary" && (
        <Popup title="Edit Professional Summary" onClose={() => setOpenSection(null)}>
          <SummaryInput 
          summary={data.summary} 
          setSummary={(v) => update("summary", v)} 
          />
          </Popup>
      )}
     

      {openSection === "experience" && (
        <Popup title="Edit Experience" onClose={() => setOpenSection(null)}>
          <ExperienceInput
            experiences={data.experiences}
            setExperiences={(v) => update("experiences", v)}
          />
        </Popup>
      )}

      {openSection === "skills" && (
        <Popup title="Edit Skills" onClose={() => setOpenSection(null)}>
          <SkillsInput
            skills={data.skills}
            setSkills={(v) => update("skills", v)}
          />
        </Popup>
      )}

    

      {openSection === "education" && (
        <Popup title="Edit Education" onClose={() => setOpenSection(null)}>
          <EducationInput
            education={data.education}
            setEducation={(v) => update("education", v)}
          />
        </Popup>
      )}

      {openSection === "certificates" && (
        <Popup title="Edit Certificates" onClose={() => setOpenSection(null)}>
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