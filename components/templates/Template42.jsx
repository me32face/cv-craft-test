"use client";

import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';
import { Phone, Mail, MapPin, Link } from "lucide-react";
import SocialLinkDisplay from "../SocialLinkDisplay";

export default function Template42({ data, onClickSection }) {
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {  year: 'numeric' });
  };

  const experiences = toArray(data?.experiences);
  const education = toArray(data?.education);
  const skills = toArray(data?.skills);
  const languages = toArray(data?.languages);
  const certificates = toArray(data?.certificates);
  const references = toArray(data?.references);
  const projects = toArray(data?.projects);
  const socialLinks = toArray(data?.socialLinks);
  const Awards = toArray(data?.awards);

  return (
    <div
      // id="cv-preview"
      id="pdf-template"
      className="cv-sidebar w-[794px] min-h-[1123px] bg-white mx-auto font-sans"
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
            <h1 className="text-4xl font-bold text-white mb-2">
              {data?.name || "Your Name"}
            </h1>
            <p className="text-xl text-slate-200 mb-4">
              {data?.title || "Professional Title"}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-white text-xs">
              {/* Phone */}
              <div className="flex items-center gap-1.5 leading-[1.4] text-sm">
                <Phone size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.phone || "+123-456-7890"}</span>
              </div>
              {/* Email */}
              <div className="flex items-center gap-1.5 leading-[1.4] text-sm">
                <Mail size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.email || "hello@reallygreatsite.com"}</span>
              </div>
              {/* Address */}
              <div className="flex items-center gap-1.5 leading-[1.4] text-sm">
                <MapPin size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.address || "123 Anywhere St., Any City"}</span>
              </div>
              {/* SOCIAL LINKS */}
              <div className="flex items-center gap-1.5">
                {data?.visibleSections?.socialLinks !== false && socialLinks.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    {socialLinks.length > 0 && (
                      <div className="flex gap-3">
                        {data.socialLinks.map((link, i) => (
                          <SocialLinkDisplay key={i} link={link} />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=" cv-sidebar flex">
        {/* Left Column */}
        <div className="cv-sidebar w-1/3 bg-slate-50 px-6 py-8 flex-shrink-0">
          {/* Skills */}
          {data?.visibleSections?.skills !== false && (
            <div className="mb-4">
              <div className="mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>
                <h2 className="text-md font-bold  text-slate-800  mb-3 pb-2 border-b-2 ">
                  SKILLS
                </h2>
                {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation"]).map((s, i) => {
                  if (typeof s === 'string') {
                    return <p key={i} className="text-sm mb-1 break-words">• {s}</p>;
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
                      <p key={i} className="text-sm mb-1 break-words">
                        <span className="font-medium break-words">{s.category}:</span> {s.skills.filter(item => item && item.trim()).join(", ")}
                      </p>
                    );
                  }
                  return <p key={i} className="text-sm mb-1 break-words">• {s.name || "Skill"}</p>;
                })}
              </div>
            </div>
          )}
          {/* Education */}
          {data?.visibleSections?.education !== false && (
            <div className="">
              <h2 className="text-md font-bold mt-2  text-slate-800  mb-3 border-b-2 pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
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
                  )}
                </div>
              ))}
            </div>
          )}
          {/* Certifications */}
          {data?.visibleSections?.certificates !== false && (
            <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("certificates")}>
              <h2 className="text-base font-bold text-slate-800 mb-3 pb-2 border-b-2 ">
                CERTIFICATIONS
              </h2>
              <div className="space-y-3">
                {certificates.map((cert, i) => {
                  if (typeof cert === 'string') {
                    return (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-slate-600 flex-shrink-0">▪</span>
                        <span className="text-xs text-gray-700 break-words">{cert}</span>
                      </div>
                    );
                  }
                  return (
                    <div key={i}>
                      <p className="text-xs font-semibold text-gray-800 break-words">{cert.name}</p>
                      {cert.issuer && <p className="text-xs text-gray-600 mt-0.5 break-words">{cert.issuer}</p>}
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
              <h2 className="text-base uppercase font-bold text-slate-800 mb-4 pb-2 border-b-2 ">
                Languages
              </h2>

              <div className="ml-4  gap-x-4 gap-y-1">
                {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) =>
                  renderLanguage(l, i)
                )}
              </div>
            </section>
          )}
          {/* AWARDS */}
          {data?.visibleSections?.awards !== false && Awards.length > 0 && (
            <div className="mt-6">
              <h2 className="text-base uppercase font-bold text-slate-800 mb-4 pb-2 border-b-2 " onClick={() => onClickSection?.("awards")}>
                AWARDS
              </h2>
              {(Awards.length ? Awards : [
                { name: "Employee of the Year", issuer: "Tech Company", year: "2023" },
                { name: "Best Innovation Award", issuer: "Industry Association", year: "2022" }
              ]).map((award, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-sm break-words">{award.name}</p>
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
          {/*References*/}
          {data?.visibleSections?.references !== false && references.length > 0 && (
            <>
              <h2 className="text-base uppercase font-bold text-slate-800 mb-4 pb-2 border-b-2 ">
                references
              </h2>
              {(references.length ? references : [
                { name: "Harumi Kobayashi", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" },
                { name: "Bailey Dupont", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" }
              ]).map((r, i) => (
                <div key={i} className="mb-3">
                  <p className="font-semibold  !text-sm text-gray-700">{r.name}</p>
                  <p className="text-sm ">{r.title}</p>
                  <p className="text-sm ">{r.company}</p>
                  <p className="text-sm text-gray-700">Phone: {r.phone}</p>
                  <p className="text-sm text-gray-700">Email: {r.email}</p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="cv-sidebar w-2/3 flex-1 px-8 py-8">
          {/* Professional Summary */}
          {data?.visibleSections?.summary !== false && (
            <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("summary")}>
              <h2 className="text-base font-bold text-slate-800 mb-3 pb-2 border-b-2 ">
                PROFILE
              </h2>
              <p className="break-words text-xs leading-relaxed text-gray-700 text-justify">
                {data?.summary || "A dedicated professional with expertise in delivering high-quality results and driving organizational success through innovative solutions and strategic thinking."}
              </p>
            </section>
          )}
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
                      <p className="text-xs opacity-60">
                        {exp.start}
                        {exp.start && (exp.end || exp.current) && " - "}
                        {exp.current ? "Present" : exp.end}
                      </p>                    </div>
                    {exp.desc && (
                      <div className="mt-1 text-xs text-gray-700 leading-relaxed">
                        {exp.descFormat === "bullet" ? (
                          exp.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <p key={idx} className="mb-1 break-words">• {line.trim()}</p>
                            )
                          )
                        ) : exp.descFormat === "number" ? (
                          exp.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <p key={idx} className="mb-1 break-words">{idx + 1}. {line.trim()}</p>
                            )
                          )
                        ) : (
                          <p className="text-justify break-words">{exp.desc}</p>
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
              <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b-2 border-slate-300 ">
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
                        className="text-xs text-blue-600 underline project-link"
                      >
                        {project.useCustomLabel
                          ? project.linkLabel
                          : project.link}
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
                              <p key={idx} className="mb-0.5 break-words">• {line.trim()}</p>
                            )
                          )
                        ) : project.descFormat === "number" ? (
                          project.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <p key={idx} className="mb-0.5 break-words">{idx + 1}. {line.trim()}</p>
                            )
                          )
                        ) : (
                          <p className="break-words">{project.desc}</p>
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