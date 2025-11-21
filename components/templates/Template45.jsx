"use client";

import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';

export default function Template45({ data, onClickSection }) {
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
  const projects = toArray(data?.projects);
  const interests = toArray(data?.interests);
  const socialLinks = toArray(data?.socialLinks);

  const themeColor = "#2c2c2c"; // Dark gray/black

  return (
    <div
      id="cv-preview"
      className="w-[794px] min-h-[1123px] bg-gray-50 mx-auto font-sans relative overflow-hidden flex text-slate-800"
    >
      {/* SVG Background Design - Top */}
      <svg
        className="absolute left-0 top-0 w-full h-full z-0 pointer-events-none"
        viewBox="0 0 794 1123"
        preserveAspectRatio="none"
      >
        {/* Large diagonal shape in top left */}
        <path
          d="M 244 0 L 0 0 L 0 450 Q 104 380, 244 320 Z"
          fill="#e7e6e6"
          opacity="0.5"
        />
        {/* Subtle curved accent top left */}
        <path
          d="M 144 0 Q 44 180, 0 320 L 0 0 Z"
          fill="#a59f9f"
          opacity="0.4"
        />
        {/* Additional top layer (left) */}
        <path
          d="M 94 0 L 0 0 L 0 250 Q 44 220, 94 180 Z"
          fill="#8f8b8b"
          opacity="0.3"
        />
      </svg>

      {/* SVG Background Design - Right */}
      <svg
        className="absolute right-0 bottom-0 w-full h-full z-0 pointer-events-none"
        viewBox="0 0 794 1123"
        preserveAspectRatio="none"
      >
        {/* Large diagonal shape on right */}
        <path
          d="M 794 1123 L 794 643 Q 794 850, 304 1153 L 854 1123 Z"
          fill="#e7e6e6"
          opacity="0.5"
        />
        {/* Subtle curved accent right */}
        <path
          d="M 794 1123 L 794 703 Q 784 920, 444 1150 L 794 1123 Z"
          fill="#a59f9f"
          opacity="0.4"
        />
        {/* Additional right layer */}
        <path
          d="M 794 1123 L 794 823 Q 774 980, 554 1150 L 794 1123 Z"
          fill="#8f8b8b"
          opacity="0.3"
        />
      </svg>

      {/* --- LEFT COLUMN (Sidebar) --- */}
      <div className="w-[38%] relative z-10 flex flex-col pt-16 pb-10 bg-[#]">
        {/* Profile Image with circular border */}
        <div className="flex justify-center mb-12 px-8">
          <div
            className="cursor-pointer"
            onClick={() => onClickSection && onClickSection("personal")}
          >
            {data?.profileImage && (
              <div
                className={`overflow-hidden mb-  ${data.imageShape === "circle"
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
        </div>

        {/* Sidebar Content */}
        <div className="px-8 flex flex-col gap-8">
          {/* Profile Section */}
          <section className="mb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
            <h2 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wide pb-2 border-b-2 border-[#d4d2db]">
              Contact
            </h2>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-gray-500 text-xs">
              {/* Phone */}
              <div className="flex items-center gap-1.5">
                <span>📞</span>
                <span>{data?.phone || "+123-456-7890"}</span>
              </div>
              {/* Email */}
              <div className="flex items-center gap-1.5">
                <span>✉️</span>
                <span>{data?.email || "hello@reallygreatsite.com"}</span>
              </div>
              {/* Address */}
              <div className="flex items-center gap-1.5">
                <span>📍</span>
                <span>{data?.address || "123 Anywhere St., Any City"}</span>
              </div>
              {/* SOCIAL LINKS → always bottom line */}
              {data?.visibleSections?.socialLinks !== false && socialLinks.length > 0 && (
                <div className="w-full flex flex-col gap-1 mt-1">
                  {socialLinks.map((link, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs break-all">
                      <span>🔗</span>
                      <span>{link}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </section>

          {/* Languages */}
          {data?.visibleSections?.languages !== false && (
            <section className="mb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("languages")}>
              <h2 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wide pb-2 border-b-2 border-[#d4d2db]">
                Languages
              </h2>
              <div className="space-y-1">
                {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) =>
                  renderLanguage(l, i)
                )}
              </div>
            </section>
          )}

          {/* Education */}
          {data?.visibleSections?.education !== false && (
            <div className="">
              <h2 className="text-md font-semibold mt-2 mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
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
                  {edu.description && <p className="text-sm mt-1 text-gray-700 text-justify">{edu.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {data?.visibleSections?.skills !== false && (
            <div className="mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>
              <h2 className="text-sm font-bold text-slate-600 mb-3 pb-2 border-b-2 border-[#8f8c9f]">
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
        </div>
      </div>

      {/* --- RIGHT COLUMN (Main Content) --- */}
      <div className="w-[62%] pt-16 pr-12 pl-8 pb-10 flex flex-col gap-8">

        {/* Header */}
        <header onClick={() => onClickSection && onClickSection("personal")} className="cursor-pointer mb-2">
          <h1 className="text-5xl font-bold uppercase mb-2 ml-8 tracking-wide" >
            {data?.name || "NAME SURNAME"}
          </h1>
          <p className="text-sm ml-14 font-bold tracking-widest uppercase text-[#787677]">
            {data?.title || "JOB TITLE"}
          </p>
        </header>

        {/* Profile / Summary */}
        {data?.visibleSections?.summary !== false && (
          <section onClick={() => onClickSection && onClickSection("summary")} className="cursor-pointer">
            <h2 className="text-sm font-bold tracking-widest uppercase mb-3  pb-2 border-b-2 border-[#8f8c9f]" style={{ color: themeColor }}>
              Profile
            </h2>
            <p className="text-xs leading-relaxed text-slate-700 text-justify">
              {data?.summary || "Creative and versatile artist with a passion for bringing imagination to life through various mediums. Proficient in both traditional and digital art, with a strong foundation in illustration and design. Committed to delivering visually compelling and conceptually rich artwork."}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {data?.visibleSections?.experience !== false && (
          <section className="mb-0 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
            <h2 className="text-sm font-bold text-[#475569] mb-4 pb-2 border-b-2 border-[#8f8c9f]">
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
                <div key={i} className="relative  ">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{exp.role}</p>
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
            className="cursor-pointer -mb-1 "
            onClick={() => onClickSection && onClickSection("projects")}
          >
            <h2 className="text-sm uppercase font-bold text-[#475569] mb-4 pb-2 border-b-2 border-[#8f8c9f]">
              Projects
            </h2>
            <div className="space-y-4 ">
              {projects.map((project, i) => (
                <div key={i}>
                  <p className="text-[15px] font-semibold text-gray-700">{project.name}</p>
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

        {/* Certifications */}
        {data?.visibleSections?.certificates !== false && (
          <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("certificates")}>
            <h2 className="text-sm font-bold text-[#475569] mb-3 pb-2 border-b-2 border-[#8f8c9f]">
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
                    <p className="text-xs font-semibold text-gray-700">{cert.name}</p>
                    {cert.issuer && <p className="text-xs text-gray-600 mt-0.5">{cert.issuer}</p>}
                    {cert.year && <p className="text-xs text-gray-500 mt-0.5">{cert.year}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}