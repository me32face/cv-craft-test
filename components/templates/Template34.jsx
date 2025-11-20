"use client";
import React from "react";

export default function Template34({ data, onClickSection }) {
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

  const safeObj = (item) =>
    typeof item === "object" && item !== null ? item : {};

  const toArray = (v) =>
    !v ? [] : Array.isArray(v) ? v : typeof v === "string" ? [v] : [];

  const skills = toArray(data?.skills);
  const experiences = toArray(data?.experiences);
  const summaryArr = toArray(data?.summary);
  const education = toArray(data?.education);
  const certificates = toArray(data?.certificates);
  const languages = toArray(data?.languages);
  const awards = toArray(data?.awards);
  const projects = toArray(data?.projects);
  const socialLinks = toArray(data?.socialLinks);
  
  const getSummaryText = () => {
    if (!data?.summary) return "";
    if (Array.isArray(data.summary)) {
      return data.summary.map((item) => safeText(item)).join(" ");
    }
    return safeText(data.summary);
  };

  return (
    <div
      id="pdf-template"
      className="w-[794px] min-h-[1123px] mx-auto bg-white shadow-xl p-10 font-sans"
    >
      {/* HEADER */}
      <div className="relative mb-10 ml-20">
        <div className="flex items-center bg-[#e8eef4] rounded-r-full p-6 w-[620px] shadow-sm">
          {/* Profile Image */}
          <div
            className={`
              flex 
              ${
                data?.imageAlign === "left"
                  ? "justify-start"
                  : data?.imageAlign === "right"
                  ? "justify-end"
                  : "justify-center"
              }
            `}
            onClick={() => onClickSection && onClickSection("image")}
          >
            <div
              className={`
                w-32 h-32 overflow-hidden bg-white border-4 border-white shadow-md cursor-pointer
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
                src={
                  data?.profileImage || "/templateprofile/template22profile.jpg"
                }
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="ml-8">
            <h1
              className="text-4xl font-bold text-gray-800 tracking-wide cursor-pointer"
              onClick={() => onClickSection && onClickSection("personal")}
            >
              {data?.name || "DONNA STROUPE"}
            </h1>

            <p
              className="text-lg text-gray-600 font-medium mt-1 cursor-pointer"
              onClick={() => onClickSection && onClickSection("personal")}
            >
              {data?.title || "Professional Sales Executive"}
            </p>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div className="grid grid-cols-[45%_55%] gap-6 text-gray-800">
        {/* LEFT SIDEBAR */}
        <div className="cv-sidebar bg-[#f3f6fa] rounded-2xl p-5">
          {/* CONTACT */}
          <section
            className="mb-6 cursor-pointer"
            onClick={() => onClickSection && onClickSection("personal")}
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-1 mb-2">
              Contact
            </h3>

            <p className="text-sm">
              {safeText(data?.phone) || "+1 234 567 890"}
            </p>
            <p className="text-sm break-all">
              {safeText(data?.email) || "example@mail.com"}
            </p>
            <p className="text-sm">
              {safeText(data?.address) || "Your City, Country"}
            </p>
           
          </section>

          {/* SOCIAL LINKS (Works with checkbox toggle) */}
  {data?.visibleSections?.socialLinks !== false && (
  <section
    className="mb-6 cursor-pointer"
    onClick={() => onClickSection && onClickSection("socialLinks")}
  >
    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-1 mb-2">
      Social Links
    </h3>

    {socialLinks.length > 0 ? (
      <div className="text-sm space-y-1">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline break-all block"
          >
            {link}
          </a>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-400">No social links added</p>
    )}
  </section>
)}


          {/* SKILLS */}
          {data?.visibleSections?.skills !== false && (
            <section
              className="mb-6 cursor-pointer"
              onClick={() => onClickSection && onClickSection("skills")}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-1">
                Skills
              </h3>

              <div className="text-sm mt-2 space-y-2">
                {(skills.length
                  ? skills
                  : [
                      "Client Relationship Building",
                      "Negotiation Skills",
                      "Target Achievement",
                      "CRM Management",
                      "Team Collaboration",
                      "Lead Prospecting",
                      "Communication Skills",
                      "Strategic Planning",
                    ]
                ).map((s, i) => {
                  // String – simple bullet item
                  if (typeof s === "string") {
                    return (
                      <div key={i} className="flex items-start">
                        <span className="mt-[3px] mr-2">•</span>
                        <span>{s}</span>
                      </div>
                    );
                  }

                  const skillObj = safeObj(s);

                  // Skill with proficiency bar
                  if (skillObj.proficiency !== undefined) {
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center">
                          <span>{safeText(skillObj.name)}</span>
                          <span className="text-xs opacity-70">
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
                      ? skillObj.items.filter(
                          (it) => it && it.toString().trim()
                        )
                      : [];
                    return (
                      <div key={i}>
                        <span className="font-medium">
                          {safeText(skillObj.category)}:
                        </span>{" "}
                        <span>{items.join(", ")}</span>
                      </div>
                    );
                  }

                  // Fallback
                  return (
                    <div key={i} className="flex items-start">
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
              className="mb-6 cursor-pointer"
              onClick={() => onClickSection && onClickSection("languages")}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-1 mb-2">
                Language
              </h3>

              <div className="text-sm space-y-2">
                {(languages.length
                  ? languages
                  : ["English (Fluent)", "Hindi (Fluent)", "Spanish (Basic)"]
                ).map((lang, i) => {
                  // Simple string
                  if (typeof lang === "string") {
                    return <p key={i}>{lang}</p>;
                  }

                  const l = safeObj(lang);
                  const { name, displayFormat, proficiency, level } = l;

                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center">
                        <span>{safeText(name)}</span>
                        {displayFormat === "level" && level && (
                          <span className="text-xs opacity-70">
                            {safeText(level)}
                          </span>
                        )}
                        {displayFormat === "percentage" && proficiency && (
                          <span className="text-xs opacity-70">
                            {proficiency}%
                          </span>
                        )}
                      </div>
                      {displayFormat === "percentage" && proficiency && (
                        <div className="w-full bg-gray-300 rounded-full h-1 mt-1">
                          <div
                            className="h-1 rounded-full"
                            style={{
                              width: `${proficiency}%`,
                              backgroundColor: "#4b5563",
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
              className="cursor-pointer mb-6"
              onClick={() => onClickSection && onClickSection("certificates")}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-2 mb-3">
                Certifications
              </h3>

              <ul className="text-sm space-y-2">
                {(certificates.length
                  ? certificates
                  : [
                      "Certified Sales Expert — 2021",
                      "CRM Professional — 2020",
                      "Digital Marketing Basics — Google",
                      "Advanced Communication Skills Training",
                    ]
                ).map((c, i) => (
                  <li key={i}>{safeText(c)}</li>
                ))}
              </ul>
            </section>
          )}

          {/* AWARDS – only if data.awards exists */}
          {awards.length > 0 && (
            <section
              className="cursor-pointer mb-2"
              onClick={() => onClickSection && onClickSection("awards")}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-2 mb-3">
                Awards
              </h3>

              <ul className="text-sm space-y-1">
                {awards.map((a, i) => (
                  <li key={i}>{safeText(a)}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="w-2/3">
          {/* PROFILE SUMMARY */}
          {data?.visibleSections?.summary !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection && onClickSection("summary")}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-1">
                Profile Summary
              </h3>

              <p className="text-sm mt-2 leading-relaxed">
                {getSummaryText() ||
                  "Dynamic and results-driven Sales Executive with over 5 years of experience..."}
              </p>
            </section>
          )}

          {/* EXPERIENCE / WORK EXPERIENCE */}
          {data?.visibleSections?.experience !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection && onClickSection("experience")}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-1">
                Work Experience
              </h3>

              <div className="mt-3 space-y-3 border-l-2 border-gray-300 pl-4">
                {(experiences.length
                  ? experiences
                  : [
                      {
                        role: "Senior Sales Executive",
                        company: "TechnoMart Pvt Ltd",
                        year: "2021–Present",
                        desc: "Managed enterprise-level accounts...",
                      },
                      {
                        role: "Sales Executive",
                        company: "ABC Corp",
                        year: "2018–2021",
                        desc: "Achieved 120% of quarterly sales...",
                      },
                    ]
                ).map((exp, i) => {
                  const e = safeObj(exp);
                  const desc = e.desc ? e.desc.toString() : "";
                  const descLines = desc
                    ? desc.split("\n").map((line) => line.trim())
                    : [];

                  return (
                    <div key={i} className="cv-item text-sm">
                      <p className="font-semibold">{safeText(e.role)}</p>
                      <p className="opacity-70">{safeText(e.company)}</p>
                      <p className="text-xs opacity-60">{safeText(e.year)}</p>

                      {/* Description formats like Template30 */}
                      {desc && (
                        <>
                          {e.descFormat === "bullet" ? (
                            <ul className="mt-1 ml-4 list-disc space-y-1">
                              {descLines.map(
                                (line, idx) => line && <li key={idx}>{line}</li>
                              )}
                            </ul>
                          ) : e.descFormat === "number" ? (
                            <ol className="mt-1 ml-4 list-decimal space-y-1">
                              {descLines.map(
                                (line, idx) => line && <li key={idx}>{line}</li>
                              )}
                            </ol>
                          ) : (
                            <p className="mt-1">{desc}</p>
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
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection && onClickSection("education")}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-1 mb-2">
                Education
              </h3>

              {(education.length
                ? education
                : [
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
                  ]
              ).map((edu, i) => {
                const ed = safeObj(edu);
                return (
                  <div key={i} className="cv-item mb-3">
                    <p className="font-semibold">{safeText(ed.course)}</p>
                    <p className="text-xs opacity-70">
                      {safeText(ed.school)} — {safeText(ed.year)}
                    </p>
                  </div>
                );
              })}
            </section>
          )}

          {/* PROJECTS (replacing References) */}
          {data?.visibleSections?.projects !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection && onClickSection("projects")}
            >
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 border-b pb-1 mb-2">
                Projects
              </h3>

              {(projects.length
                ? projects
                : [
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
                  ]
              ).map((project, i) => {
                const p = safeObj(project);
                const desc = p.desc ? p.desc.toString() : "";
                const descLines = desc
                  ? desc.split("\n").map((line) => line.trim())
                  : [];

                return (
                  <div key={i} className="cv-item text-sm mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">
                          {safeText(p.name) || "Project Title"}
                        </p>
                        {p.link && (
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 underline break-all"
                          >
                            {p.link}
                          </a>
                        )}
                      </div>
                      <p className="text-xs opacity-60">{safeText(p.year)}</p>
                    </div>

                    {/* Description formats like Template30 */}
                    {desc && (
                      <>
                        {p.descFormat === "bullet" ? (
                          <ul className="mt-1 ml-4 list-disc space-y-1">
                            {descLines.map(
                              (line, idx) => line && <li key={idx}>{line}</li>
                            )}
                          </ul>
                        ) : p.descFormat === "number" ? (
                          <ol className="mt-1 ml-4 list-decimal space-y-1">
                            {descLines.map(
                              (line, idx) => line && <li key={idx}>{line}</li>
                            )}
                          </ol>
                        ) : (
                          <p className="mt-1">{desc}</p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
