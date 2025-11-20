"use client";
import React from "react";

export default function Template35({ data, onClickSection }) {
  const toArray = (v) =>
    !v ? [] : Array.isArray(v) ? v : typeof v === "string" ? [v] : [];

  const safeObj = (v) => (typeof v === "object" && v !== null ? v : {});

  const experiences = toArray(data.experiences);
  const education = toArray(data.education);
  const skills = toArray(data.skills);
  const languages = toArray(data.languages);
  const certificates = toArray(data.certificates);
  const references = toArray(data.references);
  const awards = toArray(data.awards);
const  socialLinks = toArray(data.socialLinks);
  // visibility logic like Template30
  const visible = data?.visibleSections || {};

  return (
    <div
      id="cv-preview"
      className="w-[794px] min-h-[1123px] bg-white mx-auto p-10 font-sans text-gray-900 tracking-tight"
    >
      {/* HEADER */}
      {visible.personal !== false && (
       <header
  className="border-b pb-4 mb-6 cursor-pointer"
  onClick={() => onClickSection("personal")}
>
  <h1 className="text-4xl font-bold">
    {data.name || "ALEXANDER REED"}
  </h1>

  <p className="text-lg text-gray-600 mt-1">
    {data.title || "Software Engineer"}
  </p>

  <div className="flex flex-wrap gap-6 text-sm mt-3">
    {/* Phone */}
    {data.phone && <p>📞 {data.phone}</p>}

    {/* Email */}
    {data.email && <p>✉️ {data.email}</p>}

    {/* Address */}
    {data.address && <p>📍 {data.address}</p>}

    {/* Website (OPTIONAL FIELD) */}
  
  {/* SOCIAL LINKS (dynamic from SocialLinks.jsx) */}
{visible.socialLinks !== false && Array.isArray(data?.socialLinks) && data.socialLinks.length > 0 && (
  <div className="flex flex-wrap gap-4 mt-2 text-sm cursor-pointer"
       onClick={() => onClickSection("social")}
  >
    {data.socialLinks.map((link, i) => (
      <a
        key={i}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-all"
      >
        🔗 {link}
      </a>
    ))}
  </div>
)}
  </div>
</header>

      )}

      {/* SUMMARY */}
      {visible.summary !== false && (
        <section
          className="mb-8 cursor-pointer"
          onClick={() => onClickSection("summary")}
        >
          <h2 className="text-xl font-semibold border-b pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-sm leading-relaxed">
            {data.summary ||
              "Detail-oriented and driven professional with proven ability to deliver results. Skilled in problem-solving, collaboration, and developing efficient solutions."}
          </p>
        </section>
      )}

      <div className="grid grid-cols-[65%_35%] gap-8">
        {/* LEFT COLUMN */}
        <div>
          {/* EXPERIENCE */}
          {visible.experience !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection("experience")}
            >
              <h2 className="text-xl font-semibold border-b pb-1 mb-4">
                Work Experience
              </h2>

              {(experiences.length
                ? experiences
                : [
                    {
                      role: "Software Developer",
                      company: "TechCorp Pvt Ltd",
                      year: "2021 – Present",
                      desc: "Built scalable applications and optimized backend APIs.",
                    },
                  ]
              ).map((exp, i) => {
                const e = safeObj(exp);
                const desc = e.desc || "";
                const lines = desc ? desc.split("\n").map((l) => l.trim()) : [];

                return (
                  <div key={i} className="mb-5">
                    <div className="flex justify-between text-sm">
                      <p className="font-bold">{e.role}</p>
                      <p className="opacity-70">{e.year}</p>
                    </div>

                    <p className="text-sm opacity-80">{e.company}</p>

                    {desc && (
                      <>
                        {e.descFormat === "bullet" ? (
                          <ul className="list-disc pl-6 text-sm mt-1 space-y-1">
                            {lines.map(
                              (line, idx) => line && <li key={idx}>{line}</li>
                            )}
                          </ul>
                        ) : e.descFormat === "number" ? (
                          <ol className="list-decimal pl-6 text-sm mt-1 space-y-1">
                            {lines.map(
                              (line, idx) => line && <li key={idx}>{line}</li>
                            )}
                          </ol>
                        ) : (
                          <p className="text-sm mt-1 leading-relaxed">{desc}</p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          {/* {projects} */}

          {/* PROJECTS */}
          {visible.projects !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection("projects")}
            >
              <h2 className="text-xl font-semibold border-b pb-1 mb-3">
                Projects
              </h2>

              {(toArray(data.projects).length
                ? toArray(data.projects)
                : [
                    {
                      name: "Portfolio Website",
                      year: "2023",
                      link: "https://yourportfolio.com",
                      desc: "Built a full personal portfolio using React, Tailwind and Framer Motion.\nIntegrated contact form and dark mode.",
                      descFormat: "bullet",
                    },
                    {
                      name: "Task Manager App",
                      year: "2022",
                      link: "https://github.com/yourrepo",
                      desc: "Created a task manager with analytics.\nSupports drag & drop and filters.",
                      descFormat: "number",
                    },
                  ]
              ).map((project, i) => {
                const p = safeObj(project);
                const desc = p.desc || "";
                const lines = desc ? desc.split("\n").map((l) => l.trim()) : [];

                return (
                  <div key={i} className="mb-5">
                    <div className="flex justify-between text-sm mb-1">
                      <p className="font-bold">{p.name}</p>
                      <p className="opacity-70">{p.year}</p>
                    </div>

                    {/* Project link */}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        className="text-xs text-blue-600 underline break-all"
                      >
                        {p.link}
                      </a>
                    )}

                    {/* DESCRIPTION FORMATTING */}
                    {desc && (
                      <>
                        {p.descFormat === "bullet" ? (
                          <ul className="list-disc pl-6 text-sm mt-1 space-y-1">
                            {lines.map(
                              (line, idx) => line && <li key={idx}>{line}</li>
                            )}
                          </ul>
                        ) : p.descFormat === "number" ? (
                          <ol className="list-decimal pl-6 text-sm mt-1 space-y-1">
                            {lines.map(
                              (line, idx) => line && <li key={idx}>{line}</li>
                            )}
                          </ol>
                        ) : (
                          <p className="text-sm mt-1 leading-relaxed">{desc}</p>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          {/* EDUCATION */}
          {visible.education !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection("education")}
            >
              <h2 className="text-xl font-semibold border-b pb-1 mb-4">
                Education
              </h2>

              {(education.length
                ? education
                : [
                    {
                      course: "Bachelor of Computer Science",
                      school: "ABC College",
                      year: "2018 – 2021",
                    },
                  ]
              ).map((edu, i) => (
                <div key={i} className="mb-4">
                  <p className="font-bold">{edu.course}</p>
                  <p className="text-sm opacity-80">
                    {edu.school} — {edu.year}
                  </p>
                </div>
              ))}
            </section>
          )}

          {/* CERTIFICATES */}
          {visible.certificates !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection("certificates")}
            >
              <h2 className="text-xl font-semibold border-b pb-1 mb-4">
                Certifications
              </h2>

              <ul className="text-sm list-disc pl-4">
                {(certificates.length
                  ? certificates
                  : [
                      "AWS Certified Cloud Practitioner",
                      "Google UX Foundations",
                    ]
                ).map((c, i) => {
                  if (typeof c === "string") return <li key={i}>{c}</li>;

                  const cert = safeObj(c);
                  return (
                    <li key={i}>
                      {cert.name}
                      {cert.issuer ? ` — ${cert.issuer}` : ""}
                      {cert.year ? ` (${cert.year})` : ""}
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* AWARDS */}
          {visible.awards !== false && awards.length > 0 && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection("awards")}
            >
              <h2 className="text-xl font-semibold border-b pb-1 mb-4">
                Awards
              </h2>

              <ul className="text-sm list-disc pl-4">
                {awards.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div>
          {/* SKILLS */}
          {visible.skills !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection("skills")}
            >
              <h2 className="text-xl font-semibold border-b pb-1 mb-3">
                Skills
              </h2>

              <div className="text-sm space-y-2">
                {(skills.length
                  ? skills
                  : ["JavaScript", "React", "Node.js", "Problem Solving"]
                ).map((s, i) => {
                  if (typeof s === "string") return <p key={i}>• {s}</p>;

                  const sk = safeObj(s);

                  if (sk.proficiency !== undefined) {
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-sm">
                          <span>{sk.name}</span>
                          <span className="text-xs opacity-70">
                            {sk.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 h-1 rounded-full mt-1">
                          <div
                            className="h-1 rounded-full bg-gray-700"
                            style={{ width: `${sk.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }

                  if (sk.category && sk.items) {
                    return (
                      <p key={i}>
                        <span className="font-semibold">{sk.category}:</span>{" "}
                        {sk.items.join(", ")}
                      </p>
                    );
                  }

                  return <p key={i}>• {sk.name}</p>;
                })}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {visible.languages !== false && (
            <section
              className="mb-8 cursor-pointer"
              onClick={() => onClickSection("languages")}
            >
              <h2 className="text-xl font-semibold border-b pb-1 mb-3">
                Languages
              </h2>

              <div className="text-sm space-y-2">
                {(languages.length ? languages : ["English", "Hindi"]).map(
                  (l, i) => {
                    if (typeof l === "string") return <p key={i}>{l}</p>;

                    const lang = safeObj(l);

                    return (
                      <div key={i}>
                        <div className="flex justify-between">
                          <span>{lang.name}</span>

                          {lang.displayFormat === "level" && (
                            <span className="text-xs opacity-70">
                              {lang.level}
                            </span>
                          )}

                          {lang.displayFormat === "percentage" && (
                            <span className="text-xs opacity-70">
                              {lang.proficiency}%
                            </span>
                          )}
                        </div>

                        {lang.displayFormat === "percentage" && (
                          <div className="w-full bg-gray-300 h-1 rounded-full mt-1">
                            <div
                              className="h-1 rounded-full bg-gray-700"
                              style={{ width: `${lang.proficiency}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </section>
          )}

          {/* REFERENCES */}
          {visible.references !== false && (
            <section
              className="cursor-pointer"
              onClick={() => onClickSection("references")}
            >
              <h2 className="text-xl font-semibold border-b pb-1 mb-3">
                References
              </h2>

              {(references.length
                ? references
                : [
                    {
                      name: "John Doe",
                      title: "Project Manager",
                      phone: "9876543210",
                      email: "john@example.com",
                    },
                  ]
              ).map((ref, i) => (
                <div key={i} className="mb-3 text-sm">
                  <p className="font-semibold">{ref.name}</p>
                  <p className="opacity-80">{ref.title}</p>
                  <p>{ref.phone}</p>
                  <p>{ref.email}</p>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
