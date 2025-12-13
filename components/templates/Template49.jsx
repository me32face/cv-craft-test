"use client";

import React from "react";
import { Phone, Mail, MapPin, Link, Calendar } from "lucide-react";
import SocialLinkDisplay from "../SocialLinkDisplay";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';


export default function Template43({ data, onClickSection }) {
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric' });
  };

  const experiences = toArray(data?.experiences);
  const education = toArray(data?.education);
  const skills = toArray(data?.skills);
  const languages = toArray(data?.languages);
  const certificates = toArray(data?.certificates);
  const projects = toArray(data?.projects);
  const interests = toArray(data?.interests);
  const socialLinks = toArray(data?.socialLinks);
  const references = toArray(data?.references);
  const Awards = toArray(data?.awards);

  const purpleAccent = "#6b5b95"; // Purple accent color

  return (
    <div
      id="cv-preview"
      className="w-[794px] min-h-[1123px] bg-white mx-auto font-sans relative overflow-hidden"
    >

      {/* Main Content Container */}
      <div className="flex cv-sidebar px-12 py-10 gap-5">
        {/* LEFT COLUMN - Main Content */}
        <div className="flex-1 cv-sidebar w-2/3">

          {/* Header */}
          <header onClick={() => onClickSection && onClickSection("personal")} className="cursor-pointer mb-8">
            <h1 className="text-5xl font-bold mb-1" style={{ color: purpleAccent }}>
              {data?.name || "First Last"}
            </h1>
            <p className="text-md text-gray-700">
              {data?.title || "Entry-Level Production Assistant"}
            </p>
          </header>

          {/* Summary */}
          {data?.visibleSections?.summary !== false && (
            <section className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("summary")}>
              <p className="text-sm leading-relaxed text-gray-700 text-justify">
                {data?.summary || "Entry-level production assistant with 10 years of experience performing complex tasks professionally and following through in various project goals. Key achievements: helped cinematographers set up 20 flags, 30 C-stands, and 40 bounce boards, enhancing the desired lighting on film by 80%. Assisted in operating 10 cameras, including the Sony FDR-AX33 in 4K at 60fps during 10 hours of shooting, 85 FPS on a 5-segment workflow, including the Sony CineAlta and Canon 5D Mark II, in capturing footage for T.3K projects with crew members."}
              </p>
            </section>
          )}

          {/* Professional Experience */}
        {data?.visibleSections?.experience !== false && (
          <section className="mb-5 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
            <h2 className="text-md font-bold  mb-3" style={{ color: purpleAccent }}>
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
                    <p className="text-xs opacity-60">
                      {exp.start
                        ? new Date(exp.start).toLocaleString("en-US", { month: "short", year: "numeric" })
                        : ""}
                      {exp.start && (exp.end || exp.current) && " - "}
                      {exp.current
                        ? "Present"
                        : exp.end
                          ? new Date(exp.end).toLocaleString("en-US", { month: "short", year: "numeric" })
                          : ""}
                    </p>
                  </div>
                  {exp.desc && (
                    exp.descFormat === "bullet" ? (
                      exp.desc.split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                        return <p key={idx} className="text-sm mt-1 text-justify text-gray-700 break-words">{hasPrefix ? trimmed : `• ${trimmed}`}</p>;
                      })
                    ) : exp.descFormat === "number" ? (
                      exp.desc.split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                        return <p key={idx} className="text-sm mt-1 text-justify text-gray-700 break-words">{hasPrefix ? trimmed : `${idx + 1}. ${trimmed}`}</p>;
                      })
                    ) : (
                      <p className="text-sm mt-1 text-justify text-gray-700 break-words">{exp.desc}</p>
                    )
                  )}
                  {exp.reference && (
                    <p className="text-xs mt-1 italic text-gray-600 break-words">Reference: {exp.reference}</p>
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
            <h2 className="text-md uppercase font-bold  mb-4" style={{ color: purpleAccent }}>
              Projects
            </h2>
            <div className="space-y-4 ">
              {projects.map((project, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-800 !text-sm">{project.name}</p>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 underline project-link"
                        >
                          {project.useCustomLabel
                            ? project.linkLabel
                            : project.link}
                        </a>
                      )}
                    </div>
                    <p className="text-xs opacity-60">{project.year}</p>
                  </div>
                  {project.desc && (
                    project.descFormat === "bullet" ? (
                      project.desc.split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                        return <p key={idx} className="text-sm mt-1 text-justify text-gray-700 break-words">{hasPrefix ? trimmed : `• ${trimmed}`}</p>;
                      })
                    ) : project.descFormat === "number" ? (
                      project.desc.split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                        return <p key={idx} className="text-sm mt-1 text-justify text-gray-700 break-words">{hasPrefix ? trimmed : `${idx + 1}. ${trimmed}`}</p>;
                      })
                    ) : (
                      <p className="text-sm mt-1 text-gray-700 text-justify break-words">{project.desc}</p>
                    )
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        </div>

        {/* RIGHT COLUMN - Sidebar */}
        <div className="cv-sidebar w-1/3 flex-shrink-0 p-5  rounded-xl bg-purple-50">

          {/* Contact */}
          <section className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
            <h2 className="text-md font-bold uppercase tracking-wide mb-3" style={{ color: purpleAccent }}>
              Contact
            </h2>
            <div className="flex flex-wrap gap-x-2 gap-y-1 text-gray-500 text-xs">
              {/* Phone */}
              <div className="flex items-center gap-1.5">
                <Phone size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.phone || "+123-456-7890"}</span>
              </div><br />
              {/* Email */}
              <div className="flex items-center gap-1.5  leading-[1.4]">
                <Mail size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.email || "hello@reallygreatsite.com"}</span>
              </div>
              {/* Address */}
              <div className="flex items-center gap-1.5 leading-[1.4]">
                <MapPin size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.address || "123 Anywhere St., Any City"}</span>
              </div>
              <div className="flex flex-col">

              </div>
              {data?.dob && (
                <div className="flex items-center gap-1.5  leading-[1.4]">
                  <Calendar size={14} className="shrink-0 translate-y-[-1px]" />
                  <span>{data?.dob}</span>
                </div>
              )}
              {
                data?.visibleSections?.maritalStatus !== false && data?.maritalStatus && (
                  <div className="flex items-center gap-1.5  leading-[1.4]">
                    <span className="font-medium">Marital Status:</span>
                    <span>{data?.maritalStatus}</span>
                  </div>
                )
              }


              {/* SOCIAL LINKS → always bottom line */}
              {data?.visibleSections?.socialLinks !== false && socialLinks.length > 0 && (
                <div className="w-full flex flex-col gap-1">
                  {socialLinks.length > 0 && (
                    <div className="">
                      {data.socialLinks.map((link, i) => (
                        <SocialLinkDisplay key={i} link={link} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* Skills */}
          {data?.visibleSections?.skills !== false && (
            <div className="mb-6">
              <div className="mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>
                <h2 className="text-md font-bold text-slate-600 mb-2" style={{ color: purpleAccent }}>
                  SKILLS
                </h2>          {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation", "Frontend Development", "Backend Development", "API Integration", "Database Management"]).map((s, i) => {
                  if (typeof s === 'string') {
                    return <p key={i} className="text-sm mb-1 text-gray-600">• {s}</p>;
                  }

                  if (s.proficiency !== undefined) {
                    return (
                      <div key={i} className="mb-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">{s.name}</span>
                          <span className="text-xs text-gray-600 opacity-70">{s.proficiency}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                          <div
                            className="bg-slate-500 h-1 rounded-full transition-all"
                            style={{ width: `${s.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }

                  if (s.category && s.skills) {
                    return (
                      <p key={i} className="text-sm mb-1">
                        <span className="font-medium text-gray-600">{s.category}:</span> {s.skills.filter(item => item && item.trim()).join(", ")}
                      </p>
                    );
                  }

                  return <p key={i} className="text-sm mb-1 text-gray-600">• {s.name || "Skill"}</p>;
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {data?.visibleSections?.education !== false && (
            <div className="mb-6">
              <h2 className="text-md  font-bold mb-2  pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("education")} style={{ color: purpleAccent }}>
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
                    <p className="text-[10px] opacity-60">
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
                        return <p key={idx} className="text-sm mt-1 text-justify text-gray-700 break-words">{hasPrefix ? trimmed : `• ${trimmed}`}</p>;
                      })
                    ) : edu.descFormat === "number" ? (
                      edu.description.split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;
                        const hasPrefix = trimmed.startsWith('•') || /^\d+\./.test(trimmed);
                        return <p key={idx} className="text-sm mt-1 text-justify text-gray-700 break-words">{hasPrefix ? trimmed : `${idx + 1}. ${trimmed}`}</p>;
                      })
                    ) : (
                      <p className="text-sm mt-1 text-gray-700 text-justify break-words">{edu.description}</p>
                    )
                  )}
                </div>
              ))}
            </div>
          )}


          {/* Certifications */}
          {data?.visibleSections?.certificates !== false && (
            <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("certificates")}>
              <h2 className="text-md font-bold  mb-2" style={{ color: purpleAccent }}>
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
                      <p className="text-xs font-semibold text-gray-700 break-words">{cert.name}</p>
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
            <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("languages")}>
              <h2 className="text-md font-bold  mb-2 uppercase tracking-wide " style={{ color: purpleAccent }}>
                Languages
              </h2>
              <div className="space-y-1">
                {(data?.languages?.length ? data.languages : ["Malayalam", "Hindi", "English"]).map((l, i) =>
                  renderLanguage(l, i, {
                    barContainer: "w-full bg-gray-200 rounded-full h-1 mt-2",
                    bar: "bg-gray-500 h-1 rounded-full transition-all"
                  })
                )}
              </div>
            </section>
          )}

          {/*References*/}
          {data?.visibleSections?.references !== false  && (
            <div className="mb-4">
              <h2 className="text-md font-bold  mb-1 uppercase" style={{ color: purpleAccent }}>
                references
              </h2>
              {(references.length ? references : [
                { name: "Harumi Kobayashi", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" },
                { name: "Bailey Dupont", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" }
              ]).map((r, i) => (
                <div key={i} className="mb-1">
                  <p className="font-semibold  !text-sm text-gray-700">{r.name}</p>
                  <p className="text-sm ">{r.title}</p>
                  <p className="text-sm ">{r.company}</p>
                  <p className="text-sm text-gray-700">Phone: {r.phone}</p>
                  <p className="text-sm text-gray-700">Email: {r.email}</p>
                </div>
              ))}
            </div>
          )}

          {/* AWARDS */}
          {data?.visibleSections?.awards !== false && references.length > 0 &&  (
            <div className="">
              <h2 className="text-md font-bold  mb-2 " onClick={() => onClickSection?.("awards")} style={{ color: purpleAccent }}>
                AWARDS
              </h2>
              {(Awards.length ? Awards : [
                { name: "Employee of the Year", issuer: "Tech Company", year: "2023" },
                { name: "Best Innovation Award", issuer: "Industry Association", year: "2022" }
              ]).map((award, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm text-gray-600 break-words">{award.name}</p>
                      <p className="text-sm opacity-80 break-words">{award.issuer}</p>
                    </div>
                    <p className="text-xs opacity-60">{award.year}</p>
                  </div>
                  {award.description && (
                    <p className="text-sm mt-1 break-words">{award.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}