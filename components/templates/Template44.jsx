
"use client";

import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';
import { Phone, Mail, MapPin } from "lucide-react";
import SocialLinkDisplay from "../SocialLinkDisplay";

export default function Template44({ data, onClickSection }) {
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
  const Awards = toArray(data?.awards);
  const references = toArray(data?.references);

  // Theme color from image
  const themeColor = "#a773c5"; // Muted Purple

  return (
    <div
      id="pdf-template"
      className="cv-sidebar w-[794px] min-h-[1123px] bg-white mx-auto font-sans relative overflow-hidden flex text-slate-800"
    >
      {/* --- BACKGROUND SVG WAVE --- */}
      <div className="absolute left-0 top-0 h-full w-full z-0 pointer-events-none">
        <svg
          viewBox="0 0 794 1123"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L320,0 C320,150 90,200 0,400"
            fill={themeColor}
            opacity="0.6"
          />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 h-full w-full z-0 pointer-events-none">
        <svg
          viewBox="0 0 794 1123"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <path
            d="M794,1123 L474,1123 C474,973 704,923 794,723"
            fill={themeColor}
            opacity="0.6"
          />
        </svg>
      </div>
      {/* --- LEFT COLUMN (Sidebar) --- */}
      <div className="cv-sidebar w-1/3 relative z-10 flex flex-col pt-10">
        {/* Profile Image (Positioned inside the top wave) */}
        <div className="flex justify-center mb-12 pr-8">
          <div
            className="mb-8"
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
        {/* Sidebar Content (Padded to sit to the right of the thin wave) */}
        <div className="pl-[60px] pr-6 flex flex-col gap-8">
          {/* Profile Section */}
          <section className="mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
            <h2 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide pb-2 border-b border-[#dfc3f1]">
              Contact
            </h2>
            {/* <div className="flex flex-wrap gap-x-1 gap-y-1 text-gray-700 text-xs"> */}
            <div className="mb-4 text-gray-700 text-xs flex flex-wrap gap-x-1 gap-y-1 ">
              <div className="flex items-center gap-2 leading-[1.4] text-sm">
                <Phone size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.phone || "123-456-7890"}</span>
              </div>
              <div className="flex items-center gap-2 leading-[1.4] text-sm">
                <Mail size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.email || "hello@email.com"}</span>
              </div>
              <div className="flex items-center gap-2 leading-[1.4] text-sm">
                <MapPin size={14} className="shrink-0 translate-y-[-1px]" />
                <span>{data?.address || "123 Anywhere St., Any City"}</span>
              </div>
              {data?.visibleSections?.socialLinks !== false && socialLinks.length > 0 && (
                <div className="flex flex-col gap-2 leading-[1.4] w-full mt-1">
                  {socialLinks.map((link, i) => (
                    <SocialLinkDisplay key={i} link={link} />
                  ))}
                </div>
              )}
            </div>
          </section>
          {/* Languages */}
          {data?.visibleSections?.languages !== false && (
            <section className="mb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("languages")}>
              <h2 className="text-sm font-bold text-gray-600 mb-3 uppercase tracking-wide pb-2 border-b-2 border-[#dfc3f1]">
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
              <h2 className="text-md text-gray-600 font-semibold mt-2 mb-3 border-b-2 border-[#dfc3f1] pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
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
          {/* Skills */}
          {data?.visibleSections?.skills !== false && (
            <div className="mb-0">
              <div className="mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>
                <h2 className="text-md text-gray-600 font-semibold  mb-3 pb-2 border-b-2 border-[#dfc3f1]">
                  SKILLS
                </h2>
                {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation"]).map((s, i) => {
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
          {/* AWARDS */}
          {data?.visibleSections?.awards !== false && Awards.length > 0 && (
            <div className="">
              <h2 className="text-md text-gray-600 font-semibold mt-2 mb-2 border-b-2 border-[#dfc3f1] pb-1 cursor-pointer" onClick={() => onClickSection?.("awards")}>
                AWARDS
              </h2>
              {(Awards.length ? Awards : [
                { name: "Employee of the Year", issuer: "Tech Company", year: "2023" },
                { name: "Best Innovation Award", issuer: "Industry Association", year: "2022" }
              ]).map((award, i) => (
                <div key={i} className="mb-0">
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
            <div className="">
              <h2 className="text-md text-gray-600 font-semibold mt-2 mb-2 uppercase border-b-2 border-[#dfc3f1] pb-1 cursor-pointer">
                references
              </h2>
              {(references.length ? references : [
                { name: "Harumi Kobayashi", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" },
                { name: "Bailey Dupont", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" }
              ]).map((r, i) => (
                <div key={i} className="">
                  <p className="font-semibold  !text-sm text-gray-700">{r.name}</p>
                  <p className="text-sm ">{r.title}</p>
                  <p className="text-sm ">{r.company}</p>
                  <p className="text-sm text-gray-700">Phone: {r.phone}</p>
                  <p className="text-sm text-gray-700">Email: {r.email}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- RIGHT COLUMN (Main Content) --- */}
      <div className="cv-sidebar w-2/3 pt-10 pr-12 pl-4 pb-10 flex flex-col gap-8">
        {/* Header */}
        <header onClick={() => onClickSection && onClickSection("personal")} className="cursor-pointer mb-2">
          <h1 className="text-5xl font-bold uppercase mb-2 ml-8 tracking-wide" >
            {data?.name || "NAME SURNAME"}
          </h1>
          <p className="text-sm ml-2 font-bold tracking-widest uppercase text-[#83549f]">
            {data?.title || "JOB TITLE"}
          </p>
        </header>

        {/* Profile / Summary */}
        {data?.visibleSections?.summary !== false && (
          <section onClick={() => onClickSection && onClickSection("summary")} className="cursor-pointer">
            <h2 className="text-sm text-[#83549f] font-bold tracking-widest uppercase mb-3  pb-2 border-b-2 border-[#dfc3f1]" >
              Profile
            </h2>
            <p className="text-xs leading-relaxed text-slate-700 text-justify break-words">
              {data?.summary || "Creative and versatile artist with a passion for bringing imagination to life through various mediums. Proficient in both traditional and digital art, with a strong foundation in illustration and design. Committed to delivering visually compelling and conceptually rich artwork."}
            </p>
          </section>
        )}

        {/* Professional Experience */}
        {data?.visibleSections?.experience !== false && (
          <section className="mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
            <h2 className="text-sm font-bold text-[#83549f] mb-4 pb-2 border-b-2 border-[#dfc3f1]">
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
            className="cursor-pointer "
            onClick={() => onClickSection && onClickSection("projects")}
          >
            <h2 className="text-sm uppercase font-bold text-[#83549f] mb-4 pb-2 border-b-2 border-[#dfc3f1]">
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
        {/* Certifications */}
        {data?.visibleSections?.certificates !== false && (
          <section className="mb-6 cursor-pointer" onClick={() => onClickSection && onClickSection("certificates")}>
            <h2 className="text-sm font-bold text-[#83549f] mb-3 pb-2 border-b-2 border-[#dfc3f1]">
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
