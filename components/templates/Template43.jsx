"use client";

import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';
import { Phone, Mail, MapPin, Link, Calendar } from "lucide-react";
import SocialLinkDisplay from "../SocialLinkDisplay";

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
  const references = toArray(data?.references);
  const projects = toArray(data?.projects);
  const interests = toArray(data?.interests);
  const socialLinks = toArray(data?.socialLinks);
  const Awards = toArray(data?.awards);

  return (
    <div
      id='cv-preview'
      // id="pdf-template"
      className="cv-sidebar w-[794px] min-h-[1123px] bg-white mx-auto font-sans relative overflow-hidden"
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
          <div
            className={`overflow-hidden mb-6 ${data?.imageShape === "circle" ? "rounded-full" : data?.imageShape === "rounded" ? "rounded-xl" : ""}`}
            style={{ width: 120, height: 120, margin: "0 auto" }}
          >
            <img src={data?.profileImage || "/templateprofile/template43profile.jpg"} className="w-full h-full object-cover" alt="profile" />
          </div>
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
          <p className="text-xs leading-relaxed text-gray-700 text-justify break-words">
            {data?.summary || "Results-oriented Full Stack Developer with a proven ability to design,Results-oriented Full Stack Developer with a proven ability to design, develop, and deploy robust web applications."}
          </p>
        </div>
      )}
      {/* Two Column Layout */}
      <div className="cv-sidebar flex">
        {/* Left Sidebar */}
        <div className="cv-sidebar w-1/3 bg-[#f1eff7] min-h-[1123px] px-8 rounded-2xl ml-5 py-6 flex-shrink-0">
          {/* Profile Section */}
          <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
            <h2 className="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wide pb-2 border-b-2 border-[#8f8c9f]">
              Contact
            </h2>
            <div className="mb-4 text-gray-600 text-sm">
              <div className="flex items-center gap-2 leading-[1.4] text-sm">
                <Phone size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.phone || "123-456-7890"}</span>
              </div>
              <div className="flex items-center gap-2 leading-[1.4] text-sm ">
                <Mail size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.email || "hello@email.com"}</span>
              </div>
              <div className="flex items-center gap-2 leading-[1.4] text-sm">
                <MapPin size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.address || "123 Anywhere St., Any City"}</span>
              </div>
              {data?.dob && (
                 <div className="flex items-center gap-2 leading-[1.4] text-sm">
                <Calendar size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.dob }</span>
              </div>
              )}
              {data?.visibleSections?.socialLinks !== false && (
                <>
                  {socialLinks.length > 0 && (
                    <div className="">
                      {socialLinks.length > 0 && (
                        <div className="">
                          {data.socialLinks.map((link, i) => (
                            <SocialLinkDisplay key={i} link={link} />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
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
                  renderLanguage(l, i, {
                    barContainer: "w-full bg-gray-200 rounded-full h-1 mt-2",
                    bar: "bg-gray-500 h-1 rounded-full transition-all"
                  })
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
                  return <p key={i} className="text-sm mb-1 break-words">• {s.name || "Skill"}</p>;
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
                      <p className="text-xs font-semibold text-gray-800 break-words">{cert.name}</p>
                      {cert.issuer && <p className="text-xs text-gray-600 mt-0.5 break-words">{cert.issuer}</p>}
                      {cert.year && <p className="text-xs text-gray-500 mt-0.5">{cert.year}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {/* AWARDS */}
          {data?.visibleSections?.awards !== false && Awards.length > 0 && (
            <div className="mt-6">
              <h2 className="text-sm font-bold text-slate-600 mb-3 pb-2 border-b-2 border-[#8f8c9f]" onClick={() => onClickSection?.("awards")}>
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
              <h2 className="text-sm font-bold text-slate-600 mb-3 pb-2 border-b-2 border-[#8f8c9f] uppercase">
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
        {/* Right Main Content */}
        <div className="cv-sidebar w-2/3 flex-1 px-8 py-6">
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
                  <div key={i} className="relative  break-words">
                    <div className="flex justify-between items-start mb-1 break-words">
                      <div>
                        <p className="text-sm font-bold text-slate-800 break-words">{exp.role}</p>
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

          {/* Projects */}
          {data?.visibleSections?.projects !== false && (
            <section
              className="cursor-pointer"
              onClick={() => onClickSection && onClickSection("projects")}
            >
              <h2 className="text-base uppercase font-bold text-slate-600 mb-4 pb-2 border-b-2 border-[#d4d2db]">
                Projects
              </h2>
              <div className="space-y-4 ">
                {projects.map((project, i) => (
                  <div key={i}>
                    <p className="text-[15px] font-bold text-gray-800">{project.name}</p>
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
      </div>
    </div>
  );
}