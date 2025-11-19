"use client";
import React from "react";

export default function ModernTemplate({ data, onClickSection }) {
  /* ---------------- SAFE TEXT / FALLBACK ---------------- */
  const safeText = (item) => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      return (
        item.name ||
        item.title ||
        item.course ||
        item.role ||
        item.company ||
        item.school ||
        item.experience ||
        JSON.stringify(item)
      );
    }
    return String(item);
  };

  const safeObj = (item) => (typeof item === "object" && item !== null ? item : {});

  const toArray = (v) =>
    !v ? [] : Array.isArray(v) ? v : typeof v === "string" ? [v] : [];

  /* ---------------- SAMPLE DEFAULT DATA ---------------- */

  const defaultSkills = [
    "Client Relationship Building",
    "Negotiation Skills",
    "Target Achievement",
    "CRM Management",
    "Team Collaboration",
    "Lead Prospecting",
    "Communication Skills",
    "Strategic Planning",
  ];

  const defaultExperience = [
    {
      role: "Senior Sales Executive",
      company: "TechnoMart Pvt Ltd",
      year: "2021–Present",
      desc: "Managed enterprise-level accounts and achieved 150% of annual sales targets.\nLed a team of 5 sales representatives and mentored junior staff.",
      descFormat: "bullet",
    },
    {
      role: "Sales Executive",
      company: "ABC Corp",
      year: "2018–2021",
      desc: "Achieved 120% of quarterly sales targets consistently.\nDeveloped and maintained relationships with 50+ key clients.",
    },
  ];

  const defaultSummary =
    "Dynamic and results-driven Sales Executive with over 5 years of experience in driving revenue growth, building strong client relationships, and exceeding sales targets. Proven track record in strategic planning and team collaboration.";

  const defaultEducation = [
    {
      course: "Bachelor of Commerce (B.Com)",
      school: "Wardiere University",
      year: "2015–2018",
    },
    {
      course: "Higher Secondary",
      school: "St. Mary's Senior School",
      year: "2013–2015",
    },
  ];

  const defaultProjects = [
    {
      name: "Portfolio Website",
      year: "2023",
      link: "https://yourportfolio.com",
      desc: "Designed and developed a responsive personal portfolio using React and Tailwind CSS.\nImplemented reusable components and responsive layouts.",
      descFormat: "bullet",
    },
    {
      name: "Sales Dashboard",
      year: "2022",
      link: "https://github.com/yourusername/sales-dashboard",
      desc: "Built an interactive dashboard to visualize sales KPIs.\nIntegrated charts and filters for real-time insights.",
      descFormat: "number",
    },
  ];

  /* ---------------- SMART MERGING LOGIC ---------------- */

  const skills = data?.skills?.length ? data.skills : defaultSkills;
  const experiences =
    data?.experiences?.length ? data.experiences : defaultExperience;
  const summaryText =
    data?.summary && data.summary.toString().trim().length > 0
      ? Array.isArray(data.summary)
        ? data.summary.map((it) => safeText(it)).join(" ")
        : safeText(data.summary)
      : defaultSummary;
  const education =
    data?.education?.length ? data.education : defaultEducation;
  const projects =
    data?.projects?.length ? data.projects : defaultProjects;

  const certificates = toArray(data?.certificates);
  const languages = toArray(data?.languages);
  const awards = toArray(data?.awards);

  /* ------------------------------------------------------ */

  return (
    <div
      id="pdf-template"
      className="w-[794px] min-h-[1123px] mx-auto bg-white shadow-2xl font-sans"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-12 py-10">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1
              className="text-5xl font-bold tracking-tight cursor-pointer mb-2"
              onClick={() => onClickSection && onClickSection("personal")}
            >
              {data?.name || "DONNA STROUPE"}
            </h1>
            <p
              className="text-xl text-slate-300 font-light tracking-wide cursor-pointer"
              onClick={() => onClickSection && onClickSection("personal")}
            >
              {data?.title || "Professional Sales Executive"}
            </p>
          </div>

          {/* Profile Image */}
          <div
            className="ml-8"
            onClick={() => onClickSection && onClickSection("image")}
          >
            <div
              className={`
                w-36 h-36 overflow-hidden border-4 border-white shadow-xl cursor-pointer
                ${
                  data?.imageShape === "circle"
                    ? "rounded-full"
                    : data?.imageShape === "rounded"
                    ? "rounded-2xl"
                    : "rounded-lg"
                }
              `}
            >
              <img
                src={data?.profileImage || "/templateprofile/template22profile.jpg"}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div className="grid grid-cols-[38%_62%] gap-0">
        {/* LEFT SIDEBAR */}
        <div className="cv-sidebar bg-slate-100 px-8 py-10">
          {/* CONTACT */}
          <section
            className="mb-8 cursor-pointer"
            onClick={() => onClickSection && onClickSection("personal")}
          >
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-4 pb-2 border-b-2 border-slate-400">
              Contact
            </h3>

            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex items-start">
                <span className="font-semibold mr-2">📱</span>
                <span>{safeText(data?.phone) || "+1 234 567 890"}</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold mr-2">✉️</span>
                <span className="break-all">{safeText(data?.email) || "example@mail.com"}</span>
              </div>
              <div className="flex items-start">
                <span className="font-semibold mr-2">📍</span>
                <span>{safeText(data?.address) || "Your City, Country"}</span>
              </div>
              {(data?.portfolio || data?.linkedin || data?.github) && (
                <div className="mt-4 pt-4 border-t border-slate-300 space-y-2">
                  {data?.portfolio && (
                    <div className="flex items-start">
                      <span className="font-semibold mr-2">🌐</span>
                      <span className="break-all text-xs">{safeText(data.portfolio)}</span>
                    </div>
                  )}
                  {data?.linkedin && (
                    <div className="flex items-start">
                      <span className="font-semibold mr-2">💼</span>
                      <span className="break-all text-xs">{safeText(data.linkedin)}</span>
                    </div>
                  )}
                  {data?.github && (
                    <div className="flex items-start">
                      <span className="font-semibold mr-2">💻</span>
                      <span className="break-all text-xs">{safeText(data.github)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* SKILLS - Simple UI from Template34 */}
          {data?.visibleSections?.skills !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onClickSection && onClickSection("skills");
              }}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-4 pb-2 border-b-2 border-slate-400">
                Skills
              </h3>

              <div className="text-sm space-y-3">
                {(skills.length ? skills : defaultSkills).map((s, i) => {
                  // String – simple bullet item
                  if (typeof s === "string") {
                    return (
                      <div key={i} className="flex items-start text-slate-700">
                        <span className="mt-[3px] mr-2">•</span>
                        <span>{s}</span>
                      </div>
                    );
                  }

                  const skillObj = safeObj(s);

                  // Skill with proficiency bar
                  if (skillObj.proficiency !== undefined) {
                    return (
                      <div key={i} className="text-slate-700">
                        <div className="flex justify-between items-center">
                          <span>{safeText(skillObj.name)}</span>
                          <span className="text-xs text-slate-500">
                            {skillObj.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 rounded-full h-1 mt-1">
                          <div
                            className="h-1 rounded-full"
                            style={{
                              width: `${skillObj.proficiency}%`,
                              backgroundColor: "#4b5563",
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  }

                  // Skill category with items
                  if (skillObj.category && skillObj.items) {
                    const items = Array.isArray(skillObj.items)
                      ? skillObj.items.filter((it) => it && it.toString().trim())
                      : [];
                    return (
                      <div key={i} className="text-slate-700">
                        <span className="font-medium">{safeText(skillObj.category)}:</span>{" "}
                        <span>{items.join(", ")}</span>
                      </div>
                    );
                  }

                  // Fallback
                  return (
                    <div key={i} className="flex items-start text-slate-700">
                      <span className="mt-[3px] mr-2">•</span>
                      <span>{safeText(skillObj)}</span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {data?.visibleSections?.languages !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection && onClickSection("languages")}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-4 pb-2 border-b-2 border-slate-400">
                Languages
              </h3>

              <div className="text-sm space-y-3">
                {(languages.length
                  ? languages
                  : ["English (Fluent)", "Hindi (Fluent)", "Spanish (Basic)"]
                ).map((lang, i) => {
                  if (typeof lang === "string") {
                    return <p key={i} className="text-slate-700">{lang}</p>;
                  }

                  const l = safeObj(lang);
                  const { name, displayFormat, proficiency, level } = l;

                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-700 font-medium">{safeText(name)}</span>
                        {displayFormat === "level" && level && (
                          <span className="text-xs text-slate-500">
                            {safeText(level)}
                          </span>
                        )}
                        {displayFormat === "percentage" && proficiency && (
                          <span className="text-xs text-slate-500">
                            {proficiency}%
                          </span>
                        )}
                      </div>
                      {displayFormat === "percentage" && proficiency && (
                        <div className="w-full bg-slate-300 rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-slate-600 to-slate-800"
                            style={{
                              width: `${proficiency}%`,
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {data?.visibleSections?.certificates !== false && (
            <section
              className="cursor-pointer mb-8"
              onClick={() => onClickSection && onClickSection("certificates")}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-4 pb-2 border-b-2 border-slate-400">
                Certifications
              </h3>

              <ul className="text-sm space-y-2 text-slate-700">
                {(certificates.length
                  ? certificates
                  : [
                      "Certified Sales Expert — 2021",
                      "CRM Professional — 2020",
                      "Digital Marketing Basics — Google",
                      "Advanced Communication Skills Training",
                    ]
                ).map((c, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-slate-600 mr-2">•</span>
                    <span>{safeText(c)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* AWARDS */}
          {awards.length > 0 && (
            <section
              className="cursor-pointer"
              onClick={() => onClickSection && onClickSection("awards")}
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-800 mb-4 pb-2 border-b-2 border-slate-400">
                Awards
              </h3>

              <ul className="text-sm space-y-2 text-slate-700">
                {awards.map((a, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-slate-600 mr-2">★</span>
                    <span>{safeText(a)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-2/3" className="px-12 py-10">
          {/* PROFILE SUMMARY */}
          {data?.visibleSections?.summary !== false && (
            <section
              className="mb-10 cursor-pointer"
              onClick={() => onClickSection && onClickSection("summary")}
            >
              <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800 mb-3 pb-2 border-b-2 border-slate-800">
                Profile Summary
              </h3>

              <p className="text-sm text-slate-700 leading-relaxed">
                {summaryText}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          {data?.visibleSections?.experience !== false && (
            <section
              className="mb-10 cursor-pointer"
              onClick={() => onClickSection && onClickSection("experience")}
            >
              <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800 mb-3 pb-2 border-b-2 border-slate-800">
                Work Experience
              </h3>

              <div className="mt-4 space-y-6">
                {(experiences.length ? experiences : defaultExperience).map((exp, i) => {
                  const e = safeObj(exp);
                  const desc = e.desc ? e.desc.toString() : "";
                  const descLines = desc
                    ? desc.split("\n").map((line) => line.trim())
                    : [];

                  return (
                    <div key={i} className="cv-item relative pl-6 border-l-4 border-slate-300">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-slate-800 rounded-full"></div>
                      
                      <p className="text-base font-bold text-slate-800">{safeText(e.role)}</p>
                      <p className="text-sm text-slate-600 font-medium">{safeText(e.company)}</p>
                      <p className="text-xs text-slate-500 mb-2">{safeText(e.year)}</p>

                      {desc && (
                        <>
                          {e.descFormat === "bullet" ? (
                            <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-slate-700">
                              {descLines.map(
                                (line, idx) =>
                                  line && <li key={idx}>{line}</li>
                              )}
                            </ul>
                          ) : e.descFormat === "number" ? (
                            <ol className="mt-2 ml-4 list-decimal space-y-1 text-sm text-slate-700">
                              {descLines.map(
                                (line, idx) =>
                                  line && <li key={idx}>{line}</li>
                              )}
                            </ol>
                          ) : (
                            <p className="mt-2 text-sm text-slate-700">{desc}</p>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* EDUCATION */}
          {data?.visibleSections?.education !== false && (
            <section
              className="mb-10 cursor-pointer"
              onClick={() => onClickSection && onClickSection("education")}
            >
              <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800 mb-3 pb-2 border-b-2 border-slate-800">
                Education
              </h3>

              <div className="mt-4 space-y-4">
                {(education.length ? education : defaultEducation).map((edu, i) => {
                  const ed = safeObj(edu);
                  return (
                    <div key={i} className="cv-item pl-6 border-l-4 border-slate-300 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-slate-800 rounded-full"></div>
                      <p className="font-bold text-slate-800">{safeText(ed.course)}</p>
                      <p className="text-sm text-slate-600">{safeText(ed.school)}</p>
                      <p className="text-xs text-slate-500">{safeText(ed.year)}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {data?.visibleSections?.projects !== false && (
            <section
              className="cursor-pointer"
              onClick={() => onClickSection && onClickSection("projects")}
            >
              <h3 className="text-lg font-bold uppercase tracking-wide text-slate-800 mb-3 pb-2 border-b-2 border-slate-800">
                Projects
              </h3>

              <div className="mt-4 space-y-5">
                {(projects.length ? projects : defaultProjects).map((project, i) => {
                  const p = safeObj(project);
                  const desc = p.desc ? p.desc.toString() : "";
                  const descLines = desc
                    ? desc.split("\n").map((line) => line.trim())
                    : [];

                  return (
                    <div key={i} className="cv-item pl-6 border-l-4 border-slate-300 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-slate-800 rounded-full"></div>
                      
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-bold text-slate-800">
                          {safeText(p.name) || "Project Title"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {safeText(p.year)}
                        </p>
                      </div>

                      {p.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline break-all"
                        >
                          {p.link}
                        </a>
                      )}

                      {desc && (
                        <>
                          {p.descFormat === "bullet" ? (
                            <ul className="mt-2 ml-4 list-disc space-y-1 text-sm text-slate-700">
                              {descLines.map(
                                (line, idx) =>
                                  line && <li key={idx}>{line}</li>
                              )}
                            </ul>
                          ) : p.descFormat === "number" ? (
                            <ol className="mt-2 ml-4 list-decimal space-y-1 text-sm text-slate-700">
                              {descLines.map(
                                (line, idx) =>
                                  line && <li key={idx}>{line}</li>
                              )}
                            </ol>
                          ) : (
                            <p className="mt-2 text-sm text-slate-700">{desc}</p>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
