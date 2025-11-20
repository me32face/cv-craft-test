"use client";

import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';

// const renderLanguage = (lang, index) => {
//   if (typeof lang === 'string') {
//     return <p key={index} className="text-gray-700 text-xs mb-1">• {lang}</p>;
//   }
//   return (
//     <div key={index} className="mb-2">
//       <div className="flex justify-between items-center text-gray-700 text-xs">
//         <span>{lang.name}</span>
//         <span className="opacity-70">{lang.proficiency || 'Fluent'}</span>
//       </div>
//     </div>
//   );
// };

export default function Template42({ data, onClickSection }) {
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const experiences = toArray(data?.experiences);
  const education = toArray(data?.education);
  const skills = toArray(data?.skills);
  const languages = toArray(data?.languages);
  const certificates = toArray(data?.certificates);
  const references = toArray(data?.references);
  const projects = toArray(data?.projects);

  return (
    <div
      id="cv-preview"
      className="w-[794px] min-h-[1123px] bg-white mx-auto font-sans"
    >
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-500 to-slate-700 px-10 py-10">
        <div className="flex items-center justify-between">
          {data?.profileImage && (
            <div
              className={`overflow-hidden mb-6 ${data.imageShape === "circle"
                ? "rounded-full"
                : data.imageShape === "rounded"
                  ? "rounded-xl"
                  : ""
                }`}
              style={{ width: 120, height: 120, margin: "0 auto" }}
            >
              <img
                src={data.profileImage}
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>
          )}
          <div className="flex-1 ml-11 cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
            <h1 className="text-4xl  font-bold text-white mb-2">
              {data?.name || "Your Name"}
            </h1>
            <p className="text-xl text-slate-200 mb-4">
              {data?.title || "Professional Title"}
            </p>
            <div className="flex flex-wrap gap-x-1 gap-y-1 text-white text-xs">
              <div className="flex items-center gap-1.5">
                <span >📞</span>
                <span>{data?.phone || "+123-456-7890"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span >✉️</span>
                <span>{data?.email || "hello@reallygreatsite.com"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>📍</span>
                <span>{data?.address || "123 Anywhere St., Any City"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {data?.github && (<p className="text-xs ">🧑‍💻 {data?.github || ""}</p>)}
              </div>
              <div className="flex items-center ">
                {data?.linkedin && (<p className="text-xs ">🔗 {data?.linkedin}</p>)}
              </div>
              <div className="flex items-center gap-1.5">
                {data?.portfolio && (<p className="text-xs ">💻 {data?.portfolio || ""}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Column */}
        <div className="w-[300px] bg-slate-50 px-6 py-8 flex-shrink-0">
          {/* Professional Summary */}
          {data?.visibleSections?.summary !== false && (
            <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("summary")}>
              <h2 className="text-base font-bold text-slate-800 mb-3 pb-2 border-b-2 border-slate-300">
                PROFILE
              </h2>
              <p className="text-xs leading-relaxed text-gray-700 text-justify">
                {data?.summary || "A dedicated professional with expertise in delivering high-quality results and driving organizational success through innovative solutions and strategic thinking."}
              </p>
            </section>
          )}

          {/* Skills */}
          {data?.visibleSections?.skills !== false && (
            <div className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>
              <h2 className="text-base font-bold text-slate-800 mb-3 pb-2 border-b-2 border-slate-300">
                SKILLS
              </h2>
              {/* ADDED ml-4 HERE */}
              <div >
                {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation", "Critical Thinking", "Leadership"]).map((s, i) => {
                  if (typeof s === 'string') {
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-gray-700">{s}</span>
                      </div>
                    );
                  }
                  if (s.proficiency !== undefined) {
                    return (
                      <div key={i} className="mb-4">
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
            </div>
          )}

          {/* Education */}
          {data?.visibleSections?.education !== false && (
            <section className="mb-4 cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
              <h2 className="text-base font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300">
                EDUCATION
              </h2>
              <div className="space-y-5">
                {(education.length ? education : [
                  {
                    course: "Master of Business Administration",
                    school: "University Name",
                    year: "2014 - 2016",
                    gpa: "GPA: 3.8/4.0"
                  },
                  {
                    course: "Bachelor of Science",
                    school: "University Name",
                    year: "2010 - 2014",
                    gpa: "GPA: 3.7/4.0"
                  }
                ]).map((edu, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-slate-300">
                    <div className="absolute -left-1.5 top-0 w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-sm  font-bold text-slate-800">{edu.course}</p>
                        <p className="text-xs text-slate-600">{edu.school}</p>
                        {edu.gpa && <p className="text-xs  text-gray-600 mt-0.5">{edu.gpa}</p>}
                      </div>
                      <p className="text-xs text-gray-500 ml-4">{edu.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data?.visibleSections?.certificates !== false && (
            <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("certificates")}>
              <h2 className="text-base font-bold text-slate-800 mb-3 pb-2 border-b-2 border-slate-300">
                CERTIFICATIONS
              </h2>
              <div className="space-y-3">
                {certificates.map((cert, i) => {
                  if (typeof cert === 'string') {
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-600 flex-shrink-0">▪</span>
                        <span className="text-xs text-gray-700">{cert}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={i}>
                      <p className="text-xs font-semibold text-gray-800">{cert.name}</p>
                      {cert.issuer && <p className="text-xs text-gray-600 mt-0.5">{cert.issuer}</p>}
                      {cert.year && <p className="text-xs text-gray-500 mt-0.5">{cert.year}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Languages */}
           {data?.visibleSections?.languages !== false && (
              <section className="cursor-pointer" onClick={() => onClickSection("languages")}>
                 <h2 className="text-base uppercase font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300">
                Languages
              </h2>

                <div className="ml-4  gap-x-4 gap-y-1">
                  {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) =>
                    renderLanguage(l, i)
                  )}
                </div>
              </section>
            )}
        </div>

        {/* Right Column */}
        <div className="flex-1 px-8 py-8">
          {/* Work Experience */}
          {data?.visibleSections?.experience !== false && (
            <section className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
              <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300">
                WORK EXPERIENCE
              </h2>
              <div className="space-y-5">
                {(experiences.length ? experiences : [
                  {
                    role: "Senior Manager",
                    company: "Company Name",
                    year: "2020 - Present",
                    desc: "Led cross-functional teams to deliver strategic initiatives and drive business growth. Implemented innovative solutions that improved operational efficiency by 30%."
                  },
                  {
                    role: "Manager",
                    company: "Previous Company",
                    year: "2018 - 2020",
                    desc: "Managed daily operations and team development. Successfully executed multiple high-impact projects that enhanced customer satisfaction and revenue."
                  },
                  {
                    role: "Team Lead",
                    company: "Another Company",
                    year: "2016 - 2018",
                    desc: "Coordinated team activities and mentored junior staff. Developed processes that streamlined workflows and increased productivity."
                  }
                ]).map((exp, i) => (
                  <div key={i} className="relative pl-6 border-l-2 border-slate-300">
                    <div className="absolute -left-1.5 top-0 w-2.5 h-2.5  rounded-full bg-slate-700"></div>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{exp.role}</p>
                        <p className="text-xs text-slate-600 italic">{exp.company}</p>
                      </div>
                      <p className="text-xs text-gray-500 ml-4">{exp.year}</p>
                    </div>
                    {exp.desc && (
                      <div className="mt-1 text-xs text-gray-700 leading-relaxed">
                        {exp.descFormat === "bullet" ? (
                          exp.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <p key={idx} className="mb-1">• {line.trim()}</p>
                            )
                          )
                        ) : exp.descFormat === "number" ? (
                          exp.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <p key={idx} className="mb-1">{idx + 1}. {line.trim()}</p>
                            )
                          )
                        ) : (
                          <p className="text-justify">{exp.desc}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data?.visibleSections?.projects !== false && (
            <section
              className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("projects")}>
              <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300">
                PROJECTS
              </h2>
              <div className="space-y-4 ml-4">
                {projects.map((project, i) => (
                  <div key={i}>
                    <p className="text-[16px] font-bold text-gray-800">{project.name}</p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12px] text-blue-600 underline block mt-0.5"
                      >
                        {project.link}
                      </a>
                    )}
                    {project.year && (
                      <p className="text-[12px] text-gray-500 mt-0.5">{project.year}</p>
                    )}
                    {project.desc && (
                      <div className="mt-1.5 text-[12px] text-gray-700 leading-relaxed">
                        {project.descFormat === "bullet" ? (
                          project.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <p key={idx} className="mb-0.5">• {line.trim()}</p>
                            )
                          )
                        ) : project.descFormat === "number" ? (
                          project.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <p key={idx} className="mb-0.5">{idx + 1}. {line.trim()}</p>
                            )
                          )
                        ) : (
                          <p>{project.desc}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}