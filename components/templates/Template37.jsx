"use client";
import React from "react";
import { User, Briefcase, GraduationCap } from "lucide-react";
import SocialLinkDisplay from "../SocialLinkDisplay";

export default function Template37({ data }) {
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
  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    return d.toLocaleString("en-US", {
      month: "short",
      year: "numeric",
    });
  };
  const experiences = rawExperiences.length
    ? rawExperiences
    : [
        {
          company: "Borcelle Studio",
          role: "Marketing Manager",
          year: "2030 - PRESENT",
          desc: "Develop and execute marketing strategies...\nLead the marketing team...",
          descFormat: "bullet",
        },
        {
          company: "Fauget Studio",
          role: "Marketing Specialist",
          year: "2025 - 2029",
          desc: "Create and manage campaign budgets...\nConduct market research...",
          descFormat: "bullet",
        },
      ];

  // Education
  const educationArray = toArray(data?.education);
  const education = educationArray.length
    ? educationArray
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
  const references = toArray(data?.references);

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
          desc: "Created an analytics dashboard...\nIntegrated charts and KPIs.",
          descFormat: "number",
        },
      ];

  const profileImage = data?.profileImage;

  /* ----------------------------------------
     TEMPLATE UI
  ----------------------------------------- */

  return (
    <div
      id="pdf-template"
      className="w-[210mm] min-h-[297mm]
 bg-white shadow-2xl overflow-visible flex"
    >
      {/* LEFT SIDEBAR */}
      <div className="w-[35%] bg-gray-100 p-6 pl-8 ">
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
              w-36 h-36 overflow-hidden border-4 border-white shadow-lg  
              ${
                data?.imageShape === "circle"
                  ? "rounded-full"
                  : data?.imageShape === "rounded"
                  ? "rounded-xl"
                  : "rounded-none"
              }
            `}
          >
            <img
              src={profileImage || "/templateprofile/template37profile.jpg"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Contact */}
        {visible.personal !== false && (
          <div className="mb-6 ">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              Contact
            </h3>
            <div className="space-y-2 text-xs">
              <p>{safeText(data?.phone, "+123-456-7890")}</p>
              <p className="break-all">
                {safeText(data?.email, "hello@reallygreatsite.com")}
              </p>
              <p>{safeText(data?.address, "123 Anywhere St., Any City")}</p>
              {data?.dob && (
  <div className="flex items-center gap-2 leading-[1.4] text-xs mt-1">
    <span className="">Date of Birth:</span>
    <span>{safeText(data.dob)}</span>
  </div>
)}
               {visible.maritalStatus !== false && data?.maritalStatus && ( 
                  <p>Marital Status: {safeText(data?.maritalStatus)}</p>  
                )}

              {visible.socialLinks !== false &&
                Array.isArray(data?.socialLinks) &&
                data.socialLinks.length > 0 && (
                  <div className="mb-6 ">
                    <div className="space-y-2 text-xs break-all">
                      {data.socialLinks.map((link, i) => (
                        <SocialLinkDisplay key={i} link={link} />
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Skills */}
        {visible.skills !== false && (
          <div className="mb-6 ">
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
                    <div key={i} className="flex items-start cv-item">
                      <span className="mr-2">•</span>
                      <span>{s}</span>
                    </div>
                  );
                }

                const sk = safeObj(s);

                // Proficiency bar
                if (sk.proficiency !== undefined) {
                  return (
                    <div key={i} className="cv-item">
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
                if (sk.category && (sk.items || sk.skills)) {
                  const skillList = sk.items || sk.skills;
                  return (
                    <div key={i} className="cv-item">
                      <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
                        {sk.category}
                      </p>
                      <div className="text-xs ml-4 space-y-1">
                        {skillList.map((item, idx) => (
                          <div key={idx} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return <p key={i}>• {safeText(sk.name, "Skill")}</p>;
              })}
            </div>
          </div>
        )}

        {/* Languages */}
        {visible.languages !== false && (
          <div className="mb-6 ">
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
                  <div key={i} className="cv-item">
                    <div className="flex justify-between">
                      <span>{safeText(lang.name)}</span>

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
          <div className="mt-5 ">
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
                      year: "2023",
                    },
                  ]
              ).map((c, i) => {
                const cert = safeObj(c);
                return (
                  <div key={i} className="cv-item">
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
          <div className="mt-5 ">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              Awards
            </h3>
            <div className="text-xs space-y-2">
              {awards.map((a, i) => {
                const award = safeObj(a);
                return (
                  <div key={i} className="cv-item">
                    {/* Title */}
                    <p className="font-semibold break-words">
                      {safeText(award.title, safeText(a))}
                    </p>

                    {/* Issuer */}
                    {award.issuer && (
                      <p className="text-gray-600 break-words">
                        Issued by: {award.issuer}
                      </p>
                    )}

                    {/* Date */}
                    {award.date && (
                      <p className="text-gray-600 break-words">
                        Date: {award.date}
                      </p>
                    )}

                    {/* Description with multiline support */}
                    {award.description && (
                      <p className="text-gray-600 break-words whitespace-pre-line mt-1">
                        {award.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REFERENCES */}
        {visible.references !== false && references.length > 0 && (
          <div className="mt-5 ">
            <h3 className="text-sm font-bold mb-3 uppercase tracking-wide">
              References
            </h3>

            <div className="text-xs space-y-3">
              {references.map((ref, i) => {
                const r = safeObj(ref);
                return (
                  <div key={i}>
                    <p className="font-semibold">{safeText(r.name)}</p>
                    <p className="text-gray-600">
                      {safeText(r.title)} — {safeText(r.company)}
                    </p>
                    {r.phone && <p className="text-gray-600">{r.phone}</p>}
                    {r.email && (
                      <p className="text-gray-600 break-all">{r.email}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="w-2/3 bg-white cv-sidebar ">
        {/* HEADER */}
        {visible.personal !== false && (
          <div className="bg-slate-700 text-white px-6 py-8 ">
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
            <div className="mb-5 ">
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
                  <p className="text-xs leading-relaxed text-gray-700 break-words">
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
            <div className="pt-4 ">
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

                  const dateText =
                    e.start || e.end || e.current
                      ? e.current
                        ? `${formatDate(e.start)} – Present`
                        : `${formatDate(e.start)} – ${formatDate(e.end)}`
                      : e.year || "";

                  return (
                    <div key={i} className="cv-item">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold break-words">
                            {safeText(e.company)}
                          </h3>
                          <p className="text-xs text-gray-600 break-words">
                            {safeText(e.role)}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {dateText}
                        </span>
                      </div>

                      {e.desc &&
                        (e.descFormat === "bullet" ? (
                          <ul className="ml-4 space-y-1">
                            {lines.map(
                              (line, idx) =>
                                line && (
                                  <li key={idx} className="flex items-start">
                                    <span className="mr-2">•</span>
                                    <span className="break-words">
                                      {line.replace(/^[•\-*]\s*/, "")}
                                    </span>
                                  </li>
                                )
                            )}
                          </ul>
                        ) : e.descFormat === "number" ? (
                          <ol className="ml-4 list-decimal space-y-1">
                            {lines.map(
                              (line, idx) =>
                                line && (
                                  <li key={idx} className="break-words">
                                    {line}
                                  </li>
                                )
                            )}
                          </ol>
                        ) : (
                          <p className="text-xs mt-1 break-words">{e.desc}</p>
                        ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* EDUCATION */}
        {visible.education !== false && (
  <div className="mt-8 ">
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

        const formatDate = (date) => {
          if (!date) return "";
          return new Date(date).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          });
        };

        const start = ed.start ? formatDate(ed.start) : "";
        const end = ed.current
          ? "Present"
          : ed.end
          ? formatDate(ed.end)
          : "";

        const duration =
          start && end ? `${start} - ${end}` : start || end || "";

        // ✅ define lines (for bullet / number formats)
      const lines = ed.description ? ed.description.split("\n") : [];


        return (
          <div key={i} className="cv-item">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 pr-2">
                {/* DEGREE / COURSE */}
                <h3 className="text-sm font-bold break-words">
                  {safeText(ed.degree) ||
                    safeText(ed.course) ||
                    "Course Name"}
                </h3>

                {/* SCHOOL */}
                <p className="text-xs text-gray-600 break-words">
                  {safeText(ed.school, "School / University")}
                </p>

                {/* FIELD OF STUDY */}
                {ed.field && (
                  <p className="text-xs text-gray-600 break-words">
                    Field: {safeText(ed.field)}
                  </p>
                )}

                {/* DESCRIPTION */}
                {ed.description &&
  (ed.descFormat === "bullet" ? (
                    <ul className="ml-4 space-y-1 mt-1">
                      {lines.map(
                        (line, idx) =>
                          line && (
                            <li key={idx} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span className="break-words">
                                {line.replace(/^[•\-*]\s*/, "")}
                              </span>
                            </li>
                          )
                      )}
                    </ul>
                  ) : ed.descFormat === "number" ? (
                    <ol className="ml-4 list-decimal space-y-1 mt-1">
                      {lines.map(
                        (line, idx) =>
                          line && (
                            <li key={idx} className="break-words">
  {line.replace(/^\d+\.\s*/, "")}
</li>

                          )
                      )}
                    </ol>
                  ) : (
                    <p className="text-xs mt-1 break-words">{ed.description}</p>
                  ))}
              </div>

              {/* DURATION */}
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {duration}
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
            <div className="mt-8 cursor-pointer">
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
                    <div key={i} className="cv-item">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h3 className="text-sm font-bold break-words">
                            {safeText(pr.name)}
                          </h3>

                          {/* Project link */}
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 underline project-link break-all"
                          >
                            {p.useCustomLabel && p.linkLabel
                              ? p.linkLabel
                              : p.link}
                          </a>
                        </div>

                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {safeText(pr.year)}
                        </span>
                      </div>

                      {pr.descFormat === "bullet" ? (
                        <div className="ml-4 space-y-1">
                          {lines.map(
                            (line, idx) =>
                              line && (
                                <p
                                  key={idx}
                                  className="flex items-start text-xs"
                                >
                                  <span className="mr-2">•</span>
                                  <span className="break-words">
                                    {line.replace(/^[•\-*]+\s*/, "")}
                                  </span>
                                </p>
                              )
                          )}
                        </div>
                      ) : pr.descFormat === "number" ? (
                        <div className="ml-4 space-y-1">
                          {lines.map(
                            (line, idx) =>
                              line && (
                                <p
                                  key={idx}
                                  className="flex items-start text-xs"
                                >
                                  <span className="mr-2">{idx + 1}.</span>
                                  <span className="break-words">
                                    {line.replace(/^\d+\.\s*/, "")}
                                  </span>
                                </p>
                              )
                          )}
                        </div>
                      ) : (
                        <p className="text-xs mt-1 break-words whitespace-pre-line">
                          {pr.desc}
                        </p>
                      )}
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
