'use client';
import React from "react";
import { renderLanguage } from "../cvbuilder/inputsections/LanguagesInput";
import SocialLinkDisplay from "../SocialLinkDisplay";

export default function Template01({ data, onClickSection }) {
  const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric' });
  };

  const experiences = toArray(data?.experiences);
  const education = toArray(data?.education);
  const skills = toArray(data?.skills);
  const languages = toArray(data?.languages);
  const references = toArray(data?.references);
  const socialLinks = toArray(data?.socialLinks);
  const projects = toArray(data?.projects);
  const Awards = toArray(data?.awards);
  const maritalStatus = data?.maritalStatus || "";

  return (
    <div
      id="pdf-template"
      className="w-[794px] min-h-[1123px] bg-white flex"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      <div className="w-2/3 p-12" style={{ width: '100%' }}>
        {/* ================= HEADER ================= */}
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-bold break-words"> {data?.name || "DEEPAL SURVE"} </h1>
            <p className="text-lg  break-words"> {data?.title || "Office Manager"} </p>
          </div>

          <div className="text-sm text-right leading-5">
            <p className="break-words">{data?.phone || "+123-456-7890"}</p>
            <p className="break-words">{data?.address || "123 Anywhere St, Any City"}</p>
            <p className="break-words">{data?.email || "hello@reallygreatsite.com"}</p>

            {data?.visibleSections?.maritalStatus !== false && (
            <p className="break-words">Marital Staus:{data?.maritalStatus }</p>
            )}
          <p className="break-words">{data?.dob }</p>
            {data?.visibleSections?.socialLinks !== false && (
              <>
                {socialLinks.length > 0 && (
                  <div className="">
                    {data.socialLinks.map((link, i) => (
                      <div key={i} className="text-sm" style={{ color: 'inherit' }}>
                        <SocialLinkDisplay link={link} />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ================= ABOUT ME ================= */}
        <div className="mt-10">
        <h2
          className=" mb-1 text-lg font-semibold"
          onClick={() => onClickSection?.("summary")}
        >
          ABOUT ME
        </h2>
        </div>
        <p className="text-sm text-justify leading-relaxed break-words">
          {data?.summary ||
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}
        </p>

        {/* ================= TWO COLUMN LAYOUT ================= */}
        <div className="grid grid-cols-2 gap-10 mt-6">

          {/* LEFT COLUMN */}
          <div>
            {/* EDUCATION */}
            {data?.visibleSections?.education !== false && (
              <div className="">
                <h2 className="text-lg font-semibold mt-0 mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
                  EDUCATION
                </h2>
                {education.map((edu, i) => (
                  <div key={i} className=" mb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold !text-sm text-gray-700 break-words">{edu.degree}</p>
                        <p className="text-sm opacity-80 break-words">{edu.school}</p>
                        {edu.field && <p className="text-xs opacity-70 break-words">{edu.field}</p>}
                      </div>
                      <p className="text-xs opacity-60">
                        {edu.start && formatDate(edu.start)}
                        {edu.start && (edu.end || edu.current) && " - "}
                        {edu.current ? "Present" : edu.end && formatDate(edu.end)}
                      </p>
                    </div>
                    {edu.description && (
                      edu.descFormat === "bullet" ? (
                        edu.description.split('\n').map((line, idx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                          return <p key={idx} className="text-sm mt-1 text-gray-700 text-justify break-words">{hasPrefix ? trimmed : `• ${trimmed}`}</p>;
                        })
                      ) : edu.descFormat === "number" ? (
                        edu.description.split('\n').map((line, idx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                          return <p key={idx} className="text-sm mt-1 text-gray-700 text-justify break-words">{hasPrefix ? trimmed : `${idx + 1}. ${trimmed}`}</p>;
                        })
                      ) : (
                        <p className="text-sm mt-1 text-gray-700 text-justify break-words">{edu.description}</p>
                      )
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* SKILL */}
            {data?.visibleSections?.skills !== false && (
              <div className="mb-4 mt-4">
                <h2 className="text-lg font-semibold mb-2 cursor-pointer " onClick={() => onClickSection && onClickSection("skills")}>EXPERTISE</h2>
                {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation"]).map((s, i) => {
                  if (typeof s === 'string') {
                    return <p key={i} className="text-sm mb-1">• {s}</p>;
                  }

                  if (s.proficiency !== undefined) {
                    return (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{s.name}</span>
                          <span className="text-xs opacity-70">{s.proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div
                            className="bg-gray-700 h-1 rounded-full transition-all"
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
            )}

            {/* LANGUAGE */}
            <h2 className="text-lg font-semibold mt-6 mb-3 border-b pb-1">
              LANGUAGE
            </h2>

            {(languages.length ? languages : ["Hindi", "English"]).map((lang, i) =>
              renderLanguage(lang, i, {
                barContainer: "w-full bg-gray-200 rounded-full h-1 mt-2",
                bar: "bg-gray-700 h-1 rounded-full transition-all"
              })
            )}

            {/* REFERENCE */}
            {data?.visibleSections?.references !== false && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-3 border-b pb-1">
                  REFERENCE
                </h2>
                {(references.length ? references : [
                  {
                    name: "Alexander Aronowitz",
                    title: "Rimberio University",
                    phone: "+123-456-7890",
                    email: "www.reallygreatsite.com",
                  }
                ]).map((ref, i) => (
                  <div key={i} className="mb-3">
                    <p className="font-bold text-sm break-words">{ref.name}</p>
                    <p className="text-sm break-words">{ref.title}</p>
                    <p className="text-sm break-words">{ref.phone}</p>
                    <p className="text-sm break-words">{ref.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          {data?.visibleSections?.experience !== false && (
            <div>

              <h2
                className="text-lg font-semibold mb-3 border-b pb-1 cursor-pointer"
                onClick={() => onClickSection?.("experience")}
              >
                WORK EXPERIENCE
              </h2>

              {experiences.map((exp, i) => (
                <div key={i} className="cv-item mb-6">
                  <div className="flex justify-between">
                    <p className="font-bold break-words">{exp.company}</p>
                    <p className="text-xs opacity-70">
                      {exp.start}
                      {exp.start && (exp.end || exp.current) && " - "}
                      {exp.current ? "Present" : exp.end}
                    </p>
                  </div>

                  <p className="text-sm font-medium break-words">{exp.role}</p>
                  {exp.location && <p className="text-xs opacity-70 break-words">{exp.location}</p>}

                  {exp.desc && (
                    exp.descFormat === "bullet" ? (
                      exp.desc.split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                        return <p key={idx} className="text-sm mt-1 break-words">{hasPrefix ? trimmed : `• ${trimmed}`}</p>;
                      })
                    ) : exp.descFormat === "number" ? (
                      exp.desc.split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                        return <p key={idx} className="text-sm mt-1 break-words">{hasPrefix ? trimmed : `${idx + 1}. ${trimmed}`}</p>;
                      })
                    ) : (
                      <p className="text-sm mt-1 break-words">{exp.desc}</p>
                    )
                  )}
                  {exp.reference && (
                    <p className="text-xs mt-1 italic text-gray-600 break-words">Reference: {exp.reference}</p>
                  )}
                </div>
              ))}

              {/* PROJECTS */}
              {data?.visibleSections?.projects !== false && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection?.("projects")}>
                    PROJECTS
                  </h2>
                  {(projects.length ? projects : [
                    { name: "E-Commerce Website", desc: "Built a full-stack e-commerce platform with React and Node.js", year: "2023" },
                    { name: "Task Management App", desc: "Developed a task management application with real-time updates", year: "2022" }
                  ]).map((project, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm break-words">{project.name || "E-Commerce"}</p>
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 break-all">
                              {project.link}
                            </a>
                          )}
                        </div>
                        <p className="text-xs opacity-60">{project.year}</p>
                      </div>
                      {project.descFormat === "bullet" ? (
                        project.desc?.split('\n').map((line, idx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                          return <p key={idx} className="text-sm mt-1 break-words">{hasPrefix ? trimmed : `• ${trimmed}`}</p>;
                        })
                      ) : project.descFormat === "number" ? (
                        project.desc?.split('\n').map((line, idx) => {
                          const trimmed = line.trim();
                          if (!trimmed) return null;
                          const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                          return <p key={idx} className="text-sm mt-1 break-words">{hasPrefix ? trimmed : `${idx + 1}. ${trimmed}`}</p>;
                        })
                      ) : (
                        project.desc && <p className="text-sm mt-1 break-words">{project.desc}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* AWARDS */}
              {data?.visibleSections?.awards !== false && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection?.("awards")}>
                    AWARDS
                  </h2>
                  {(Awards.length ? Awards : [
                    { title: "Employee of the Year", issuer: "Tech Company", date: "2023" },
                    { title: "Best Innovation Award", issuer: "Industry Association", date: "2022" }
                  ]).map((award, i) => (
                    <div key={i} className="mb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm break-words">{award.title}</p>
                          <p className="text-sm opacity-80 break-words">{award.issuer}</p>
                        </div>
                        <p className="text-xs opacity-60">{award.date}</p>
                      </div>
                      {award.description && (
                        <p className="text-sm mt-1 break-words">{award.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}
        </div>


      </div>
      <div className="cv-sidebar" style={{ width: '0px', minHeight: '100%' }}></div>
    </div>
  );
}
