"use client";
import React from "react";
import { User, Briefcase, GraduationCap } from "lucide-react";

export default function Template37({ data, onClickSection }) {
  const toArray = (v) =>
    !v ? [] : Array.isArray(v) ? v : typeof v === "string" ? [v] : [];

  const safeObj = (v) => (typeof v === "object" && v !== null ? v : {});

  const safeText = (v, fallback = "") => {
    if (v === 0) return "0";
    if (!v) return fallback;
    if (typeof v === "string" || typeof v === "number") return v;
    if (typeof v === "object") {
      return (
        v.name ||
        v.title ||
        v.course ||
        v.role ||
        v.company ||
        v.school ||
        fallback
      );
    }
    return fallback;
  };

  // --------------------------
  // 🔧 PATCH: ignore CVBuilder's mock defaults so Template37 can use Template01-style defaults
  // --------------------------

  // Experiences
  const rawExperiences = toArray(data?.experiences);
  const isDefaultCvBuilderExperience =
    rawExperiences.length === 1 &&
    safeText(rawExperiences[0]?.company) === "Google" &&
    safeText(rawExperiences[0]?.role) === "Developer" &&
    safeText(rawExperiences[0]?.year) === "2020 - 2022";
  const experiences = isDefaultCvBuilderExperience ? [] : rawExperiences;

  // Education
  const rawEducation = toArray(data?.education);
  const isDefaultCvBuilderEducation =
    rawEducation.length === 1 &&
    safeText(rawEducation[0]?.course) === "BCA" &&
    safeText(rawEducation[0]?.school) === "ABC College";
  const education = isDefaultCvBuilderEducation ? [] : rawEducation;

  // Skills (no CVBuilder default, so normal)
  const skills = toArray(data?.skills);

  // Languages
  const rawLanguages = toArray(data?.languages);
  const isDefaultCvBuilderLanguages =
    rawLanguages.length === 2 &&
    safeText(rawLanguages[0]?.name) === "English" &&
    safeText(rawLanguages[1]?.name) === "Hindi";
  const languages = isDefaultCvBuilderLanguages ? [] : rawLanguages;

  // Certificates
  const rawCertificates = toArray(data?.certificates);
  const isDefaultCvBuilderCertificates =
    rawCertificates.length === 2 &&
    safeText(rawCertificates[0]?.name) === "Full Stack Development" &&
    safeText(rawCertificates[0]?.issuer) === "Tech Academy" &&
    safeText(rawCertificates[1]?.name) === "Data Structures & Algorithms" &&
    safeText(rawCertificates[1]?.issuer) === "Code Institute";
  const certificates = isDefaultCvBuilderCertificates ? [] : rawCertificates;

  // References & awards (no special handling)
  const references = toArray(data?.references);
  const awards = toArray(data?.awards);

  const profileImage = data?.profileImage;

  return (
    <div
      id="cv-preview"
      className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-visible flex"
      style={{
        WebkitFontSmoothing: "antialiased",
        textRendering: "geometricPrecision",
        imageRendering: "crisp-edges",
      }}
    >
      {/* Left Sidebar */}
      <div className="w-[35%] bg-gray-100 p-6 pl-8">
        {/* Profile Image */}
        <div className="mb-6">
          <div
            className="w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => onClickSection && onClickSection("image")}
          >
            <img
              src={profileImage || "/templateprofile/template01profile.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div
          className="mb-6 cursor-pointer"
          onClick={() => onClickSection && onClickSection("personal")}
        >
          <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Contact
          </h3>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-700">
                {safeText(data?.phone, "+123-456-7890")}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-700 break-all">
                {safeText(data?.email, "hello@reallygreatsite.com")}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-700">
                {safeText(data?.address, "123 Anywhere St., Any City")}
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs text-gray-700 break-all">
                {safeText(data?.website, "www.reallygreatsite.com")}
              </span>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div
          className="mb-6 section-container"
          data-section="skills"
          onClick={() => onClickSection && onClickSection("skills")}
        >
          <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Skills
          </h3>
          <div className="space-y-1.5 text-gray-700 text-xs">
            {(skills.length
              ? skills
              : [
                  "Project Management",
                  "Public Relations",
                  "Teamwork",
                  "Time Management",
                  "Leadership",
                  "Effective Communication",
                  "Critical Thinking",
                  "Digital Marketing",
                ]
            ).map((s, i) => {
              if (typeof s === "string") {
                return (
                  <div key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{s}</span>
                  </div>
                );
              }

              const sk = safeObj(s);

              // Skill with proficiency bar
              if (sk.proficiency !== undefined) {
                return (
                  <div key={i}>
                    <div className="flex justify-between items-center">
                      <span>{safeText(sk.name, "Skill")}</span>
                      <span className="text-[10px] opacity-70">
                        {sk.proficiency}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-300 h-1 rounded-full mt-1">
                      <div
                        className="h-1 rounded-full bg-slate-700"
                        style={{ width: `${sk.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                );
              }

              // Skill category with items
              if (sk.category && sk.items) {
                const items = Array.isArray(sk.items)
                  ? sk.items.filter((it) => it && it.toString().trim())
                  : [];
                return (
                  <div key={i}>
                    <span className="font-semibold">
                      {safeText(sk.category)}:
                    </span>{" "}
                    <span>{items.join(", ")}</span>
                  </div>
                );
              }

              return (
                <div key={i} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{safeText(sk.name, "Skill")}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Languages Section */}
        <div
          className="mb-6 cursor-pointer"
          onClick={() => onClickSection && onClickSection("languages")}
        >
          <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Languages
          </h3>
          <div className="space-y-1.5 text-gray-700 text-xs">
            {(languages.length
              ? languages
              : [
                  "English (Fluent)",
                  "French (Fluent)",
                  "German (Basic)",
                  "Spanish (Intermediate)",
                ]
            ).map((l, i) => {
              if (typeof l === "string") {
                return (
                  <div key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{l}</span>
                  </div>
                );
              }

              const lang = safeObj(l);

              return (
                <div key={i}>
                  <div className="flex justify-between items-center">
                    <span>{safeText(lang.name, "Language")}</span>
                    {lang.displayFormat === "level" && lang.level && (
                      <span className="text-[10px] opacity-70">
                        {lang.level}
                      </span>
                    )}
                    {lang.displayFormat === "percentage" &&
                      lang.proficiency !== undefined && (
                        <span className="text-[10px] opacity-70">
                          {lang.proficiency}%
                        </span>
                      )}
                  </div>
                  {lang.displayFormat === "percentage" &&
                    lang.proficiency !== undefined && (
                      <div className="w-full bg-gray-300 h-1 rounded-full mt-1">
                        <div
                          className="h-1 bg-slate-700 rounded-full"
                          style={{ width: `${lang.proficiency}%` }}
                        ></div>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reference Section */}
        <div
          className="mb-6 cursor-pointer"
          onClick={() => onClickSection && onClickSection("references")}
        >
          <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Reference
          </h3>
          <div className="text-xs text-gray-700">
            {(references.length
              ? references
              : [
                  {
                    name: "Estelle Darcy",
                    title: "Wardiere Inc. / CTO",
                    phone: "123-456-7890",
                    email: "hello@reallygreatsite.com",
                  },
                ]
            ).map((ref, i) => {
              const r = safeObj(ref);
              return (
                <div key={i} className="mb-3">
                  <p className="font-semibold mb-1">
                    {safeText(r.name, "Referee Name")}
                  </p>
                  <p className="text-gray-600 mb-1">
                    {safeText(r.title, "Company / Position")}
                  </p>
                  <p className="text-gray-600">
                    Phone: {safeText(r.phone, "123-456-7890")}
                  </p>
                  <p className="text-gray-600 break-all">
                    Email: {safeText(r.email, "hello@reallygreatsite.com")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificate Section */}
        <div
          className="mt-5 cursor-pointer"
          onClick={() => onClickSection && onClickSection("certificates")}
        >
          <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
            Certificate
          </h3>
          <div className="text-xs text-gray-700 space-y-3">
            {(certificates.length
              ? certificates
              : [
                  {
                    name: "Project Management",
                    issuer: "Project Management Institute",
                    detail: "Risk Management and Mitigation",
                    year: "2028",
                    extra: "Internal Auditors Team",
                  },
                ]
            ).map((c, i) => {
              if (typeof c === "string") {
                return <p key={i}>{c}</p>;
              }
              const cert = safeObj(c);
              return (
                <div key={i}>
                  <p className="font-semibold mb-1">
                    {safeText(cert.name, "Certificate Name")}
                  </p>
                  <p className="text-gray-600 mb-1">
                    {safeText(cert.issuer, "Project Management Institute")}
                  </p>
                  <p className="font-semibold">
                    {safeText(cert.detail, "")}
                    {cert.year ? ` | ${cert.year}` : ""}
                  </p>
                  {cert.extra && (
                    <p className="text-gray-600 break-all">{cert.extra}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Awards (optional, if provided) */}
        {awards.length > 0 && (
          <div
            className="mt-5 cursor-pointer"
            onClick={() => onClickSection && onClickSection("awards")}
          >
            <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
              Awards
            </h3>
            <ul className="text-xs text-gray-700 space-y-1 list-disc pl-4">
              {awards.map((a, i) => (
                <li key={i}>{safeText(a)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Right Content */}
      <div className="w-[65%] bg-white">
        {/* Header with dark background */}
        <div
          className="bg-slate-700 text-white px-6 py-8 cursor-pointer"
          onClick={() => onClickSection && onClickSection("personal")}
        >
          <h1 className="text-3xl font-bold mb-1">
            {safeText(data?.name, "RICHARD SANCHEZ")}
          </h1>
          <p className="text-sm uppercase tracking-widest">
            {safeText(data?.title, "Marketing Manager")}
          </p>
        </div>

        <div className="px-6 py-5 pt-8">
          {/* Profile Section */}
          <div
            className="mb-5 section-container group cursor-pointer"
            data-section="profile"
            onClick={() => onClickSection && onClickSection("summary")}
          >
            <div className="flex items-center gap-2 mb-2 relative">
              <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Profile
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-0 w-0.5 h-full bg-gray-300"></div>
              <div className="pl-8 ml-3">
                <p className="text-xs text-gray-700 leading-relaxed">
                  {safeText(
                    data?.summary,
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Work Experience Section */}
          <div
            className="pt-4 section-container cursor-pointer"
            data-section="work-experience"
            onClick={() => onClickSection && onClickSection("experience")}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Work Experience
              </h2>
            </div>

            <div className="pl-8 border-l-2 border-gray-300 ml-3 space-y-4 text-xs text-gray-700">
              {(experiences.length
                ? experiences
                : [
                    {
                      company: "Borcelle Studio",
                      role: "Marketing Manager & Specialist",
                      year: "2030 - PRESENT",
                      desc:
                        "Develop and execute comprehensive marketing strategies...\nLead, mentor, and manage the marketing team...\nMonitor campaign performance...",
                      descFormat: "bullet",
                    },
                    {
                      company: "Fauget Studio",
                      role: "Marketing Manager & Specialist",
                      year: "2025 - 2029",
                      desc:
                        "Create and manage the marketing budget, ensuring efficient allocation of resources and maximizing ROI.\nOversee market research to identify emerging trends, customer needs, and competitive intelligence.",
                      descFormat: "bullet",
                    },
                    {
                      company: "Studio Shodwe",
                      role: "Marketing Manager & Specialist",
                      year: "2024 - 2025",
                      desc:
                        "Develop and maintain strong relationships with partners, agencies, and vendors to support marketing initiatives.\nMonitor and maintain brand consistency across all marketing channels and materials.",
                      descFormat: "bullet",
                    },
                  ]
              ).map((exp, i) => {
                const e = safeObj(exp);
                const desc = e.desc || "";
                const lines = desc ? desc.split("\n").map((l) => l.trim()) : [];

                return (
                  <div key={i}>
                    <div className="flex justify-between items-start mt-1 mb-1">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">
                          {safeText(e.company, "Company Name")}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {safeText(
                            e.role,
                            "Marketing Manager & Specialist"
                          )}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {safeText(e.year, "Year")}
                      </span>
                    </div>

                    {desc && (
                      <>
                        {e.descFormat === "bullet" ? (
                          <ul className="ml-4 text-xs text-gray-700 mt-1 space-y-1">
                            {lines.map(
                              (line, idx) =>
                                line && (
                                  <li key={idx} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span>{line}</span>
                                  </li>
                                )
                            )}
                          </ul>
                        ) : e.descFormat === "number" ? (
                          <ol className="ml-4 text-xs text-gray-700 mt-1 space-y-1 list-decimal">
                            {lines.map(
                              (line, idx) => line && <li key={idx}>{line}</li>
                            )}
                          </ol>
                        ) : (
                          <p className="text-xs text-gray-700 leading-relaxed mt-1">
                            {desc}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Education Section */}
          <div
            className="mt-8 cursor-pointer"
            onClick={() => onClickSection && onClickSection("education")}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                Education
              </h2>
            </div>

            <div className="pl-8 border-l-2 border-gray-300 ml-3 space-y-3 text-xs text-gray-700">
              {(education.length
                ? education
                : [
                    {
                      course: "Executive MBA (EMBA)",
                      school:
                        "Senior-level business | Wardiere University",
                      gpa: "GPA: 3.8 / 4.0",
                      year: "2029 - 2031",
                    },
                    {
                      course: "Master of Business Management",
                      school: "School of business | Wardiere University",
                      gpa: "GPA: 3.8 / 4.0",
                      year: "2029 - 2031",
                    },
                    {
                      course: "Bachelor of Business Management",
                      school: "School of business | Wardiere University",
                      gpa: "GPA: 3.9 / 4.0",
                      year: "2025 - 2029",
                    },
                  ]
              ).map((edu, i) => {
                const ed = safeObj(edu);
                return (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-0.5">
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">
                          {safeText(
                            ed.course,
                            "Bachelor of Business Management"
                          )}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {safeText(
                            ed.school,
                            "School of business | Wardiere University"
                          )}
                        </p>
                        {ed.gpa && (
                          <p className="text-xs text-gray-500">
                            {safeText(ed.gpa)}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {safeText(ed.year, "Year")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
