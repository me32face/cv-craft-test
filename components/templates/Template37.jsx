"use client";
import React from "react";
import { User, Briefcase, GraduationCap } from "lucide-react";

export default function Template37({ data, onClickSection }) {
  /* ----------------------------------------
     SAFE HELPERS
  ----------------------------------------- */
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

  // visibleSections just like Template30
  const visible = data?.visibleSections || {};


 
  const rawExperiences = toArray(data?.experiences);
  const experiences = rawExperiences.length
    ? rawExperiences
    : [
        {
          company: "Borcelle Studio",
          role: "Marketing Manager",
          year: "2030 - PRESENT",
          desc:
            "Develop and execute marketing strategies...\nLead the marketing team...",
          descFormat: "bullet",
        },
        {
          company: "Fauget Studio",
          role: "Marketing Specialist",
          year: "2025 - 2029",
          desc:
            "Create and manage campaign budgets...\nConduct market research...",
          descFormat: "bullet",
        },
      ];

  // Education
  const education = toArray(data?.education).length
    ? toArray(data?.education)
    : [
        {
          course: "Executive MBA (EMBA)",
          school: "Wardiere University",
          gpa: "GPA: 3.8 / 4.0",
          year: "2029 - 2031",
        },
        {
          course: "Bachelor of Business Management",
          school: "Wardiere University",
          gpa: "GPA: 3.9 / 4.0",
          year: "2025 - 2029",
        },
      ];

  // Skills
  const skills = toArray(data?.skills);

  // Languages
  const languages = toArray(data?.languages).length
    ? toArray(data?.languages)
    : ["English (Fluent)", "French (Fluent)", "German (Basic)"];

  // Certificates
  const certificates = toArray(data?.certificates);

  // Awards
  const awards = toArray(data?.awards);

  // Projects
  const projects = toArray(data?.projects).length
    ? toArray(data?.projects)
    : [
        {
          name: "Portfolio Website",
          year: "2023",
          link: "https://yourwebsite.com",
          desc: "Built a full responsive portfolio...\nUsed React + Tailwind.",
          descFormat: "bullet",
        },
        {
          name: "Marketing Dashboard",
          year: "2022",
          link: "https://github.com/yourrepo",
          desc:
            "Created an analytics dashboard...\nIntegrated charts and KPIs.",
          descFormat: "number",
        },
      ];

  const profileImage = data?.profileImage;

  /* ----------------------------------------
     TEMPLATE UI
  ----------------------------------------- */

  return (
    <div
      id="cv-preview"
      className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-visible flex"
    >
      {/* LEFT SIDEBAR */}
      <div className="w-[35%] bg-gray-100 p-6 pl-8">

        {/* Profile Image */}
        <div
          className={`mb-6 ${
            data?.imageAlign === "left"
              ? "flex justify-start"
              : data?.imageAlign === "right"
              ? "flex justify-end"
              : "flex justify-center"
          }`}
        >
          <div
            className={`
              w-36 h-36 overflow-hidden border-4 border-white shadow-lg cursor-pointer 
              ${
                data?.imageShape === "circle"
                  ? "rounded-full"
                  : data?.imageShape === "rounded"
                  ? "rounded-xl"
                  : "rounded-none"
              }
            `}
            onClick={() => onClickSection("image")}
          >
            <img
              src={profileImage || "/templateprofile/template01profile.jpg"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Contact */}
        {visible.personal !== false && (
          <div className="mb-6 cursor-pointer" onClick={() => onClickSection("personal")}>
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              Contact
            </h3>
            <div className="space-y-2 text-xs">
              <p>{safeText(data?.phone, "+123-456-7890")}</p>
              <p className="break-all">
                {safeText(data?.email, "hello@reallygreatsite.com")}
              </p>
              <p>{safeText(data?.address, "123 Anywhere St., Any City")}</p>
              <p>{safeText(data?.website, "www.reallygreatsite.com")}</p>
            </div>
          </div>
        )}

        {/* Skills */}
        {visible.skills !== false && (
          <div
            className="mb-6 cursor-pointer"
            onClick={() => onClickSection("skills")}
          >
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              Skills
            </h3>

            <div className="text-xs space-y-1.5">
              {(skills.length
                ? skills
                : ["Communication", "Teamwork", "Planning"]
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

                // Proficiency bar
                if (sk.proficiency !== undefined) {
                  return (
                    <div key={i}>
                      <div className="flex justify-between">
                        <span>{safeText(sk.name)}</span>
                        <span className="text-[10px] opacity-70">
                          {sk.proficiency}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-300 h-1 mt-1 rounded-full">
                        <div
                          className="h-1 bg-slate-700 rounded-full"
                          style={{ width: `${sk.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                }

                // Category
                if (sk.category && sk.items) {
                  return (
                    <p key={i}>
                      <b>{sk.category}:</b> {sk.items.join(", ")}
                    </p>
                  );
                }

                return (
                  <p key={i}>• {safeText(sk.name, "Skill")}</p>
                );
              })}
            </div>
          </div>
        )}

        {/* Languages */}
        {visible.languages !== false && (
          <div
            className="mb-6 cursor-pointer"
            onClick={() => onClickSection("languages")}
          >
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              Languages
            </h3>

            <div className="text-xs space-y-1.5">
              {languages.map((l, i) => {
                if (typeof l === "string") {
                  return (
                    <p key={i} className="flex items-start">
                      <span className="mr-2">•</span> {l}
                    </p>
                  );
                }

                const lang = safeObj(l);
                return (
                  <div key={i}>
                    <div className="flex justify-between">
                      <span>{safeText(lang.name)}</span>

                      {lang.displayFormat === "level" && lang.level && (
                        <span className="text-[10px] opacity-70">{lang.level}</span>
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
                        <div className="w-full bg-gray-300 h-1 mt-1 rounded-full">
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
        )}

        {/* Certificates */}
        {visible.certificates !== false && (
          <div
            className="mt-5 cursor-pointer"
            onClick={() => onClickSection("certificates")}
          >
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              Certificates
            </h3>

            <div className="text-xs space-y-3">
              {(certificates.length
                ? certificates
                : [
                    {
                      name: "Project Management",
                      issuer: "Project Institute",
                      year: "2028",
                    },
                  ]
              ).map((c, i) => {
                const cert = safeObj(c);
                return (
                  <div key={i}>
                    <p className="font-semibold">{safeText(cert.name)}</p>
                    <p className="text-gray-600">
                      {safeText(cert.issuer)} {cert.year && `| ${cert.year}`}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Awards */}
        {visible.awards !== false && awards.length > 0 && (
          <div
            className="mt-5 cursor-pointer"
            onClick={() => onClickSection("awards")}
          >
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              Awards
            </h3>
            <ul className="text-xs list-disc pl-4 space-y-1">
              {awards.map((a, i) => (
                <li key={i}>{safeText(a)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-[65%] bg-white">

        {/* HEADER */}
        {visible.personal !== false && (
          <div
            className="bg-slate-700 text-white px-6 py-8 cursor-pointer"
            onClick={() => onClickSection("personal")}
          >
            <h1 className="text-3xl font-bold mb-1">
              {safeText(data?.name, "RICHARD SANCHEZ")}
            </h1>
            <p className="text-sm uppercase tracking-widest">
              {safeText(data?.title, "Marketing Manager")}
            </p>
          </div>
        )}

        <div className="px-6 py-5 pt-8">

          {/* PROFILE */}
          {visible.summary !== false && (
            <div
              className="mb-5 cursor-pointer"
              onClick={() => onClickSection("summary")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  Profile
                </h2>
              </div>

              <div className="relative">
                <div className="absolute left-3 top-0 w-0.5 h-full bg-gray-300"></div>
                <div className="pl-8 ml-3">
                  <p className="text-xs leading-relaxed text-gray-700">
                    {safeText(
                      data?.summary,
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {visible.experience !== false && (
            <div
              className="pt-4 cursor-pointer"
              onClick={() => onClickSection("experience")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                  <Briefcase className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  Work Experience
                </h2>
              </div>

              <div className="pl-8 border-l-2 border-gray-300 ml-3 space-y-4 text-xs">
                {experiences.map((exp, i) => {
                  const e = safeObj(exp);
                  const lines = e.desc ? e.desc.split("\n") : [];

                  return (
                    <div key={i}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold">{safeText(e.company)}</h3>
                          <p className="text-xs text-gray-600">
                            {safeText(e.role)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {safeText(e.year)}
                        </span>
                      </div>

                      {/* DESC FORMATTING */}
                      {e.desc &&
                        (e.descFormat === "bullet" ? (
                          <ul className="ml-4 space-y-1">
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
                          <ol className="ml-4 list-decimal space-y-1">
                            {lines.map(
                              (line, idx) => line && <li key={idx}>{line}</li>
                            )}
                          </ol>
                        ) : (
                          <p className="text-xs mt-1">{e.desc}</p>
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {visible.education !== false && (
            <div
              className="mt-8 cursor-pointer"
              onClick={() => onClickSection("education")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  Education
                </h2>
              </div>

              <div className="pl-8 border-l-2 border-gray-300 ml-3 space-y-3 text-xs">
                {education.map((edu, i) => {
                  const ed = safeObj(edu);

                  return (
                    <div key={i}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-bold">{safeText(ed.course)}</h3>
                          <p className="text-xs text-gray-600">{safeText(ed.school)}</p>
                          {ed.gpa && <p className="text-xs">{ed.gpa}</p>}
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {safeText(ed.year)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {visible.projects !== false && (
            <div
              className="mt-8 cursor-pointer"
              onClick={() => onClickSection("projects")}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
                  <Briefcase className="w-3 h-3 text-white" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-wide">
                  Projects
                </h2>
              </div>

              <div className="pl-8 border-l-2 border-gray-300 ml-3 space-y-4 text-xs">
                {projects.map((p, i) => {
                  const pr = safeObj(p);
                  const lines = pr.desc ? pr.desc.split("\n") : [];

                  return (
                    <div key={i}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold">{safeText(pr.name)}</h3>

                          {pr.link && (
                            <a
                              href={pr.link}
                              target="_blank"
                              className="text-[10px] text-blue-600 underline break-all"
                            >
                              {pr.link}
                            </a>
                          )}
                        </div>

                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {safeText(pr.year)}
                        </span>
                      </div>

                      {pr.desc &&
                        (pr.descFormat === "bullet" ? (
                          <ul className="ml-4 space-y-1">
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
                        ) : pr.descFormat === "number" ? (
                          <ol className="ml-4 list-decimal space-y-1">
                            {lines.map(
                              (line, idx) => line && <li key={idx}>{line}</li>
                            )}
                          </ol>
                        ) : (
                          <p className="text-xs mt-1">{pr.desc}</p>
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
