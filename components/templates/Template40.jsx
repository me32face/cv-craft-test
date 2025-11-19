"use client";
import React from "react";

export default function Template40({ data, onClickSection }) {
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

  const skills = toArray(data?.skills);
  const experiences = toArray(data?.experiences);
  const education = toArray(data?.education);
  const certificates = toArray(data?.certificates);
  const languages = toArray(data?.languages);
  const awards = toArray(data?.awards);
  const projects = toArray(data?.projects);

  const getSummaryText = () => {
    if (!data?.summary) return "";
    if (Array.isArray(data.summary)) {
      return data.summary.map((item) => safeText(item)).join(" ");
    }
    return safeText(data.summary);
  };

  return (
    <div
      id="cv-preview"
      className="w-[794px] h-[1123px] mx-auto bg-white shadow-2xl font-sans overflow-hidden"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1
              className="text-4xl font-bold tracking-tight cursor-pointer mb-1"
              onClick={() => onClickSection && onClickSection("personal")}
            >
              {data?.name || "SARAH WILLIAMS"}
            </h1>
            <p
              className="text-xl text-indigo-100 font-light tracking-wide cursor-pointer"
              onClick={() => onClickSection && onClickSection("personal")}
            >
              {data?.title || "Graphic Designer | Visual Creative"}
            </p>
          </div>

          {/* Profile Image */}
          <div
            className="ml-6"
            onClick={() => onClickSection && onClickSection("image")}
          >
            <div
              className={`
                w-32 h-32 overflow-hidden border-4 border-white shadow-xl cursor-pointer
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
                alt="profile"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS */}
      <div className="grid grid-cols-[35%_65%] h-[calc(1123px-112px)]">
        {/* LEFT SIDEBAR */}
        <div className="bg-gray-50 px-6 py-6 overflow-y-auto">
          {/* CONTACT */}
          <section
            className="mb-6 cursor-pointer"
            onClick={() => onClickSection && onClickSection("personal")}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
              Contact
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <span className="text-indigo-600">📱</span>
                <span>{safeText(data?.phone) || "+1 234 567 8900"}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600">✉️</span>
                <span className="break-all">{safeText(data?.email) || "sarah.williams@email.com"}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-indigo-600">📍</span>
                <span>{safeText(data?.address) || "Los Angeles, CA"}</span>
              </div>
              {data?.portfolio && (
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600">🌐</span>
                  <span className="break-all text-xs">{safeText(data.portfolio)}</span>
                </div>
              )}
              {data?.linkedin && (
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600">💼</span>
                  <span className="break-all text-xs">{safeText(data.linkedin)}</span>
                </div>
              )}
              {data?.github && (
                <div className="flex items-start gap-2">
                  <span className="text-indigo-600">💻</span>
                  <span className="break-all text-xs">{safeText(data.github)}</span>
                </div>
              )}
            </div>
          </section>

          {/* SKILLS */}
          {data?.visibleSections?.skills !== false && (
            <section
              className="mb-6 cursor-pointer"
              onClick={() => onClickSection && onClickSection("skills")}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
                Skills
              </h3>

              <div className="space-y-3 text-sm">
                {(skills.length
                  ? skills
                  : [
                      { name: "Adobe Photoshop", proficiency: 95 },
                      { name: "Adobe Illustrator", proficiency: 90 },
                      { name: "Figma", proficiency: 88 },
                      { name: "InDesign", proficiency: 85 },
                      { name: "Brand Identity", proficiency: 92 },
                      { name: "Typography", proficiency: 90 },
                    ]
                ).map((s, i) => {
                  if (typeof s === "string") {
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800">{s}</span>
                          <span className="text-xs text-gray-600">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{ width: "85%" }}
                          ></div>
                        </div>
                      </div>
                    );
                  }

                  const skillObj = safeObj(s);

                  if (skillObj.proficiency !== undefined) {
                    return (
                      <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-gray-800">
                            {safeText(skillObj.name)}
                          </span>
                          <span className="text-xs text-gray-600">
                            {skillObj.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            style={{ width: `${skillObj.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }

                  if (skillObj.category && skillObj.items) {
                    const items = Array.isArray(skillObj.items)
                      ? skillObj.items.filter((it) => it && it.toString().trim())
                      : [];
                    return (
                      <div key={i} className="text-gray-700">
                        <span className="font-semibold text-gray-800">
                          {safeText(skillObj.category)}:
                        </span>{" "}
                        <span className="text-sm">{items.join(", ")}</span>
                      </div>
                    );
                  }

                  return (
                    <div key={i}>
                      <span className="text-gray-700">{safeText(skillObj)}</span>
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
                Languages
              </h3>

              <div className="text-sm space-y-2">
                {(languages.length
                  ? languages
                  : ["English (Native)", "Spanish (Fluent)", "French (Basic)"]
                ).map((lang, i) => {
                  if (typeof lang === "string") {
                    return <p key={i} className="text-gray-700">{lang}</p>;
                  }

                  const l = safeObj(lang);
                  const { name, displayFormat, proficiency, level } = l;

                  return (
                    <div key={i}>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">{safeText(name)}</span>
                        {displayFormat === "level" && level && (
                          <span className="text-xs text-gray-600">
                            {safeText(level)}
                          </span>
                        )}
                        {displayFormat === "percentage" && proficiency && (
                          <span className="text-xs text-gray-600">
                            {proficiency}%
                          </span>
                        )}
                      </div>
                      {displayFormat === "percentage" && proficiency && (
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
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
              className="cursor-pointer mb-6"
              onClick={() => onClickSection && onClickSection("certificates")}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
                Certifications
              </h3>

              <ul className="text-sm space-y-2 text-gray-700">
                {(certificates.length
                  ? certificates
                  : [
                      "Adobe Certified Expert (ACE)",
                      "UI/UX Design Specialization",
                      "Brand Identity Design - Coursera",
                    ]
                ).map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600 mt-1">•</span>
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
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
                Awards
              </h3>

              <ul className="text-sm space-y-2 text-gray-700">
                {awards.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-600">★</span>
                    <span>{safeText(a)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="px-8 py-6 overflow-y-auto">
          {/* PROFILE SUMMARY */}
          {data?.visibleSections?.summary !== false && (
            <section
              className="mb-6 cursor-pointer"
              onClick={() => onClickSection && onClickSection("summary")}
            >
              <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 mb-3 pb-2 border-b-2 border-indigo-600">
                About Me
              </h3>

              <p className="text-sm text-gray-700 leading-relaxed">
                {getSummaryText() ||
                  "Creative Graphic Designer with 5+ years of experience crafting compelling visual identities and marketing materials. Expert in Adobe Creative Suite, with a passion for typography and color theory. Proven track record in delivering high-impact designs that elevate brand presence and drive engagement."}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          {data?.visibleSections?.experience !== false && (
            <section
              className="mb-6 cursor-pointer"
              onClick={() => onClickSection && onClickSection("experience")}
            >
              <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 mb-3 pb-2 border-b-2 border-indigo-600">
                Work Experience
              </h3>

              <div className="mt-3 space-y-4">
                {(experiences.length
                  ? experiences
                  : [
                      {
                        role: "Senior Graphic Designer",
                        company: "Creative Studio Co.",
                        year: "2021–Present",
                        desc: "Led design projects for major brands including logo redesigns and marketing campaigns.\nManaged a team of 3 junior designers and mentored interns.\nIncreased client satisfaction by 40% through innovative visual solutions.",
                        descFormat: "bullet",
                      },
                      {
                        role: "Graphic Designer",
                        company: "Design Agency Inc.",
                        year: "2018–2021",
                        desc: "Created brand identities, social media graphics, and print materials for 30+ clients.\nCollaborated with marketing teams to deliver cohesive visual strategies.\nDeveloped design systems that improved workflow efficiency by 25%.",
                        descFormat: "bullet",
                      },
                    ]
                ).map((exp, i) => {
                  const e = safeObj(exp);
                  const desc = e.desc ? e.desc.toString() : "";
                  const descLines = desc
                    ? desc.split("\n").map((line) => line.trim())
                    : [];

                  return (
                    <div key={i} className="text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-bold text-gray-800">{safeText(e.role)}</p>
                          <p className="text-gray-600 italic">{safeText(e.company)}</p>
                        </div>
                        <p className="text-xs text-gray-500">{safeText(e.year)}</p>
                      </div>

                      {desc && (
                        <>
                          {e.descFormat === "bullet" ? (
                            <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-700">
                              {descLines.map(
                                (line, idx) =>
                                  line && <li key={idx}>{line}</li>
                              )}
                            </ul>
                          ) : e.descFormat === "number" ? (
                            <ol className="mt-2 ml-4 list-decimal space-y-1 text-gray-700">
                              {descLines.map(
                                (line, idx) =>
                                  line && <li key={idx}>{line}</li>
                              )}
                            </ol>
                          ) : (
                            <p className="mt-2 text-gray-700">{desc}</p>
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
              className="mb-6 cursor-pointer"
              onClick={() => onClickSection && onClickSection("education")}
            >
              <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 mb-3 pb-2 border-b-2 border-indigo-600">
                Education
              </h3>

              <div className="mt-3 space-y-3">
                {(education.length
                  ? education
                  : [
                      {
                        course: "Bachelor of Fine Arts (BFA) - Graphic Design",
                        school: "Rhode Island School of Design",
                        year: "2014–2018",
                      },
                    ]
                ).map((edu, i) => {
                  const ed = safeObj(edu);
                  return (
                    <div key={i} className="text-sm">
                      <p className="font-bold text-gray-800">{safeText(ed.course)}</p>
                      <p className="text-gray-600 text-xs">
                        {safeText(ed.school)} — {safeText(ed.year)}
                      </p>
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
              <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 mb-3 pb-2 border-b-2 border-indigo-600">
                Featured Projects
              </h3>

              <div className="mt-3 space-y-4">
                {(projects.length
                  ? projects
                  : [
                      {
                        name: "Brand Identity - Café Luna",
                        year: "2023",
                        link: "behance.net/cafeluna",
                        desc: "Complete brand system including logo, packaging, and menu design.\nCreated cohesive visual language across all touchpoints.",
                        descFormat: "bullet",
                      },
                      {
                        name: "Marketing Campaign - EcoWear",
                        year: "2022",
                        link: "behance.net/ecowear",
                        desc: "Designed social media assets and print materials for sustainable fashion brand.\nIncreased brand engagement by 60%.",
                        descFormat: "bullet",
                      },
                    ]
                ).map((project, i) => {
                  const p = safeObj(project);
                  const desc = p.desc ? p.desc.toString() : "";
                  const descLines = desc
                    ? desc.split("\n").map((line) => line.trim())
                    : [];

                  return (
                    <div key={i} className="text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="font-bold text-gray-800">
                            {safeText(p.name) || "Project Title"}
                          </p>
                          {p.link && (
                            <a
                              href={p.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-indigo-600 break-all"
                            >
                              {p.link}
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {safeText(p.year)}
                        </p>
                      </div>

                      {desc && (
                        <>
                          {p.descFormat === "bullet" ? (
                            <ul className="mt-2 ml-4 list-disc space-y-1 text-gray-700">
                              {descLines.map(
                                (line, idx) =>
                                  line && <li key={idx}>{line}</li>
                              )}
                            </ul>
                          ) : p.descFormat === "number" ? (
                            <ol className="mt-2 ml-4 list-decimal space-y-1 text-gray-700">
                              {descLines.map(
                                (line, idx) =>
                                  line && <li key={idx}>{line}</li>
                              )}
                            </ol>
                          ) : (
                            <p className="mt-2 text-gray-700">{desc}</p>
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