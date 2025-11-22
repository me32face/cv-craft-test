"use client";

import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';

export default function Template43({ data, onClickSection }) {
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const experiences = toArray(data?.experiences);
  const education = toArray(data?.education);
  const skills = toArray(data?.skills);
  const languages = toArray(data?.languages);
  const certificates = toArray(data?.certificates);
  const references = toArray(data?.references);
  const projects = toArray(data?.projects);
  const interests = toArray(data?.interests);
  const socialLinks = toArray(data?.socialLinks);

  return (
    <div
      id="cv-preview"
      className="w-[794px] min-h-[1123px] bg-white mx-auto font-sans relative overflow-hidden"
    >
      {/* Diagonal Header Design */}
      <div className="relative h-[200px]">
        {/* Dark blue diagonal section */}
        <svg viewBox="0 0 794 180" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <polygon points="0,0 794,0 394,120 100,200 0,200" fill="#aeacbc" />

          <polygon points="100,0 794,0 794,200 418,190" fill="#8f8c9f" />
        </svg>

        {/* Profile Image */}
        <div className="absolute left-8 top-8 z-10">
          {data?.profileImage && (
            <div
              className={`overflow-hidden mb-6 border-2 ${data.imageShape === "circle"
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
        </div>

        {/* Name and Job Title */}
        <div className="absolute right-16 top-14 text-right cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
          <h1 className="text-4xl font-bold text-slate-100 mb-1">
            {data?.name?.toUpperCase() || "NAME AND SURNAME"}
          </h1>
          <p className="text-sm text-gray-100 uppercase tracking-wide">
            {data?.title || "JOB"}
          </p>
        </div>
      </div>

      {/* Profile Summary - Full Width */}
      {data?.visibleSections?.summary !== false && (
        <div className="px-10 py-1 mb-5 cursor-pointer" onClick={() => onClickSection && onClickSection("summary")}>
          <p className="text-xs leading-relaxed text-gray-700 text-justify">
            {data?.summary || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
          </p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-[300px] bg-[#f1eff7] px-8 py-6 flex-shrink-0">
          {/* Profile Section */}
          <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
            <h2 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wide pb-2 border-b-2 border-[#8f8c9f]">
              Contact
            </h2>
            <div className="flex flex-wrap gap-x-1 gap-y-1 text-gray-500 text-xs">
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
                {data?.visibleSections?.socialLinks !== false && (
                  <>
                    {socialLinks.length > 0 && (
                      <div className="">
                        {socialLinks.map((link, i) => (
                          <p key={i} className="text-xs break-all"> <span >🔗</span>
                            <span className="ml-1">{link}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </>
                )} </div>
            </div>
          </section>

          {/* Languages */}
          {data?.visibleSections?.languages !== false && (
            <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("languages")}>
              <h2 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wide pb-2 border-b-2 border-[#8f8c9f]">
                Languages
              </h2>
              <div className="space-y-1">
                {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) =>
                  renderLanguage(l, i)
                )}
              </div>
            </section>
          )}

          {/* Skills */}
          {data?.visibleSections?.skills !== false && (
            <div className="mb-4">
              <div className="mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>
                <h2 className="text-sm font-bold text-slate-600 mb-3 pb-2 border-b-2 border-[#8f8c9f]">
                  SKILLS
                </h2>          {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation"]).map((s, i) => {
                  if (typeof s === 'string') {
                    return <p key={i} className="text-sm mb-1">• {s}</p>;
                  }

                  if (s.proficiency !== undefined) {
                    return (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{s.name}</span>
                          <span className="text-xs  opacity-70">{s.proficiency}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                          <div
                            className="bg-slate-600 h-1 rounded-full transition-all"
                            style={{ width: `${s.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }

                  if (s.category && s.skills) {
                    return (
                      <p key={i} className="text-sm mb-1">
                        <span className="font-medium">{s.category}:</span> {s.skills.filter(item => item && item.trim()).join(", ")}
                      </p>
                    );
                  }

                  return <p key={i} className="text-sm mb-1">• {s.name || "Skill"}</p>;
                })}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data?.visibleSections?.certificates !== false && (
            <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("certificates")}>
              <h2 className="text-sm font-bold text-slate-600 mb-3 pb-2 border-b-2 border-[#8f8c9f]">
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
        </div>

        {/* Right Main Content */}
        <div className="flex-1 px-8 py-6">
          {/* Professional Experience */}
          {data?.visibleSections?.experience !== false && (
            <section className="mb-5 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
              <h2 className="text-base font-bold text-slate-600 mb-4 pb-2 border-b-2 border-[#d4d2db]">
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
                ]).map((exp, i) => (
                  <div key={i} className="relative pl-1 ">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{exp.role}</p>
                        <p className="text-xs text-slate-600 italic">{exp.company}</p>
                      </div>
                      <p className="text-xs opacity-60">
                        {exp.start}
                        {exp.start && (exp.end || exp.current) && " - "}
                        {exp.current ? "Present" : exp.end}
                      </p>
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

          {/* Education */}
          {data?.visibleSections?.education !== false && (
            <div className="">
              <h2 className="text-md font-bold text-slate-600 mt-2 mb-3 border-b-2 pb-1 cursor-pointer border-[#d4d2db]" onClick={() => onClickSection && onClickSection("education")}>
                EDUCATION
              </h2>
              {education.map((edu, i) => (
                <div key={i} className=" mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold !text-sm text-gray-700">{edu.degree}</p>
                      <p className="text-sm opacity-80">{edu.school}</p>
                      {edu.field && <p className="text-xs opacity-70">{edu.field}</p>}
                    </div>
                    <p className="text-xs opacity-60">
                      {edu.start && formatDate(edu.start)}
                      {edu.start && (edu.end || edu.current) && " - "}
                      {edu.current ? "Present" : edu.end && formatDate(edu.end)}
                    </p>
                  </div>
                  {edu.description && (
                    edu.descFormat === "bullet" ? (
                      edu.description.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700 text-justify break-words">• {line}</p>)
                    ) : edu.descFormat === "number" ? (
                      edu.description.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700 text-justify break-words">{idx + 1}. {line}</p>)
                    ) : (
                      <p className="text-sm mt-1 text-gray-700 text-justify break-words">{edu.description}</p>
                    )
                  )}                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {data?.visibleSections?.projects !== false && (
            <section
              className="cursor-pointer"
              onClick={() => onClickSection && onClickSection("projects")}
            >
              <h2 className="text-base uppercase font-bold text-slate-600 mb-4 pb-2 border-b-2 border-[#d4d2db]">
                Projects
              </h2>
              <div className="space-y-4 ml-4">
                {projects.map((project, i) => (
                  <div key={i}>
                    <p className="text-[15px] font-bold text-gray-800">{project.name}</p>
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