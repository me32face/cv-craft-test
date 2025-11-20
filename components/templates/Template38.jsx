"use client";
import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';

export default function Template38({ data, onClickSection }) {
  const toArray = (v) => !v ? [] : Array.isArray(v) ? v : typeof v === "string" ? [v] : [];

  const safeObj = (v) => (typeof v === "object" && v !== null ? v : {});
  const experiences = toArray(data.experiences);
  const education = toArray(data.education);
  const skills = toArray(data.skills);
  const languages = toArray(data.languages);
  const certificates = toArray(data.certificates);
  const references = toArray(data.references);
  const awards = toArray(data.awards);
  const projects = toArray(data?.projects);

  return (
    <div
      id="cv-preview"
      className="w-[794px] min-h-[1123px] bg-white mx-auto  text-gray-900"
    >
      {/* HEADER */}
      <header
        className="border-b-2 border-gray-800 py-8 px-12 cursor-pointer"
        onClick={() => onClickSection("personal")}
      >
        <h1 className="text-5xl font-serif tracking-[0.1em] text-center mb-2">
          {(data.name || "ADELINE PALMERSTON").toUpperCase()}
        </h1>
      </header>

      <div className="grid grid-cols-[38%_62%] min-h-screen">
        {/* LEFT COLUMN */}
        <div className="bg-gray-50 px-8 py-8">
          {/* Contact */}
          <div className="mb-8">
            <h2 className="font-semibold text-lg mb-2 ml-4">CONTACT</h2>
            <p className="text-xs mt-2">📞 {data?.phone || "123-456-7890"}</p>
            <p className="text-xs mt-2">📧 {data?.email || "hello@email.com"}</p>
            <p className="text-xs mt-2  ">📍 {data?.address || "123 Anywhere St., Any City"}</p>
            {data?.linkedin && (<p className="text-xs mt-2">🔗 {data?.linkedin}</p>)}
            {data?.github && (<p className="text-xs mt-2">🧑‍💻 {data?.github || ""}</p>)}
            {data?.portfolio && (<p className="text-xs mt-2">💻 {data?.portfolio || ""}</p>)}
          </div>

          {/* Certifications */}
          {data?.visibleSections?.certificates !== false && (
            <>
              <h2 className="text-md font-semibold mt-2 mb-3  pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("certificates")}>
                CERTIFICATIONS
              </h2>
              {(data?.certificates || [
                { name: "Project Management Professional (PMP)", issuer: "PMI", year: "2023" },
                { name: "Digital Marketing Certification", issuer: "Google", year: "2022" }
              ]).map((cert, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold !text-sm text-gray-700">{cert.name}</p>
                      <p className="text-xs opacity-80">{cert.issuer}</p>
                    </div>
                    <p className="text-xs opacity-60">{cert.year}</p>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* SKILLS */}
          {data?.visibleSections?.skills !== false && (
            <div className="mb-4 mt-8">
              <h2 className="font-semibold text-md mb-2 cursor-pointer " onClick={() => onClickSection && onClickSection("skills")}>SKILLS</h2>
              {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation", "Critical Thinking", "Leadership"]).map((s, i) => {
                if (typeof s === 'string') {
                  return <p key={i} className="text-xs mb-1">• {s}</p>;
                }
                if (s.proficiency !== undefined) {
                  return (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{s.name}</span>
                        <span className="text-xs opacity-70">{s.proficiency}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                        <div
                          className="bg-black h-1 rounded-full transition-all"
                          style={{ width: `${s.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                }
                if (s.category && s.items) {
                  return (
                    <p key={i} className="text-sm mb-1">
                      <span className="font-medium">{s.category}:</span> {s.items.filter(item => item && item.trim()).join(", ")}
                    </p>
                  );
                }
                return <p key={i} className="text-sm mb-1">• {s.name || "Skill"}</p>;
              })}
            </div>
          )}

          {/* Languages */}
          {data?.visibleSections?.languages !== false && (
            <div className="mb-4 mt-6">
              <h2 className="font-semibold   text-md mb-2">LANGUAGE</h2>
              {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) =>
                renderLanguage(l, i)
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="px-8 py-8">
          {/* Summary */}
          {data?.visibleSections?.summary !== false && (
            <>
              <h2 className="text-md font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("summary")}>
                SUMMARY
              </h2>
              <p className="text-xs mb-4 text-gray-700">{data?.summary || "A dedicated professional with extensive experience in the field."}</p>
            </>
          )}

          {/* Projects */}
          {data?.visibleSections?.projects !== false && (
            <>
              <h2 className="text-md font-semibold mb-5 mt-8 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("projects")}>
                PROJECTS
              </h2>
              {projects.map((project, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800 !text-sm">{project.name}</p>
                      {project.link && (
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">
                          {project.link}
                        </a>
                      )}
                    </div>
                    <p className="text-xs opacity-60">{project.year}</p>
                  </div>
                  {project.descFormat === "bullet" ? (
                    project.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700">• {line}</p>)
                  ) : project.descFormat === "number" ? (
                    project.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700">{idx + 1}. {line}</p>)
                  ) : (
                    <p className="text-sm mt-1 text-gray-700">{project.desc}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Experience */}
          {data?.visibleSections?.experience !== false && (
            <>
              <h2 className="text-md font-semibold mb-5 mt-8 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
                EXPERIENCE
              </h2>
              {(experiences.length ? experiences : [
                { role: "Product Design Manager", company: "Arowwai Industries", year: "2020-2023", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
                { role: "Product Design Manager", company: "Ingoude Company", year: "2019-2020", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
                { role: "Product Design Manager", company: "Timmerman Industries", year: "2017-2019", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
              ]).map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800 !text-sm">{exp.role}</p>
                      <p className="text-sm opacity-80">{exp.company}</p>
                    </div>
                    <p className="text-xs opacity-60">{exp.year}</p>
                  </div>
                  {exp.descFormat === "bullet" ? (
                    exp.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700">• {line}</p>)
                  ) : exp.descFormat === "number" ? (
                    exp.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700">{idx + 1}. {line}</p>)
                  ) : (
                    <p className="text-xs mt-1">{exp.desc}</p>
                  )}
                </div>
              ))}
            </>
          )}

          {/* Education */}
          {data?.visibleSections?.education !== false && (
            <>
              <h2 className="text-md font-semibold mt-8 mb-3  border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
                EDUCATION
              </h2>
              {(education.length ? education : [
                { course: "Bachelor of Business Management", school: "Wardiere University", year: "2020-2023" },
                { course: "Bachelor of Business Management", school: "Wardiere University", year: "2016-2020" },
                { course: "Bachelor of Business Management", school: "Wardiere University", year: "2012-2016" }
              ]).map((edu, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold !text-sm text-gray-700">{edu.course}</p>
                      <p className="text-xs opacity-80">{edu.school}</p>
                    </div>
                    <p className="text-xs opacity-60">{edu.year}</p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}