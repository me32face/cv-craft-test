"use client";

import React from "react";
import { Phone, Mail, MapPin, Link } from "lucide-react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';

// const renderLanguage = (lang, index) => {
//   if (typeof lang === 'string') {
//     return <p key={index} className="text-white text-sm mb-2">→ {lang}</p>;
//   }
//   return (
//     <div key={index} className="mb-3">
//       <div className="flex justify-between items-center text-white text-sm">
//         <span className="font-medium">{lang.name}</span>
//         <span className="text-xs opacity-80">({lang.proficiency || 'Fluent'})</span>
//       </div>
//     </div>
//   );
// };

export default function Template41({ data, onClickSection }) {
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
  const socialLinks = toArray(data?.socialLinks);
  const Awards = toArray(data?.awards);
  const references = toArray(data.references);

  return (
    <div
      id="cv-preview"
      className="cv-sidebar w-[794px] min-h-[1123px] mx-auto font-sans bg-white flex"
    >
      {/* LEFT SIDEBAR - Dark Background */}
      <div className="w-[280px] bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 text-white  p-8 flex-shrink-0">
        {/* Profile Image */}
        <div className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
          {data?.profileImage && (
            <div
              className={`overflow-hidden mx-auto border-4 border-[#a680c9] shadow-2xl ${data.imageShape === "circle"
                ? "rounded-full"
                : data.imageShape === "rounded"
                  ? "rounded-2xl"
                  : ""
                }`}
              style={{ width: 150, height: 150 }}
            >
              <img
                src={data.profileImage}
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>
          )}
        </div>

        {/* Contact Section */}
        <section className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
          <h2 className="text-lg font-bold mb-4 pb-2 border-b border-[#c3c3c3] uppercase tracking-wider">Contact</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2 leading-[1.4] text-sm">
              <Phone size={14} className="shrink-0 translate-y-[-1px] text-[#c5a0e7]" />
              <span>{data?.phone || "123-456-7890"}</span>
            </div>
            <div className="flex items-center gap-2 leading-[1.4] text-sm">
              <Mail size={14} className="shrink-0 translate-y-[-1px] text-[#c5a0e7]" />
              <span>{data?.email || "hello@email.com"}</span>
            </div>
            <div className="flex items-center gap-2 leading-[1.4] text-sm">
              <MapPin size={14} className="shrink-0 translate-y-[-1px] text-[#c5a0e7]" />
              <span>{data?.address || "123 Anywhere St., Any City"}</span>
            </div>
            {data?.visibleSections?.socialLinks !== false && (
              <>
                {socialLinks.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {socialLinks.map((link, i) => (
                      <div key={i} className="flex items-start gap-3 break-all leading-[1.4]">
                        <Link size={14} className="shrink-0 translate-y-[-1px] text-[#c5a0e7]" />
                        <span className="break-all text-xs">{link}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Skills */}
        {data?.visibleSections?.skills !== false && (
          <div className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-[#c3c3c3] uppercase tracking-wider">Skills</h2>
            <div className="space-y-3">
              {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation"]).map((s, i) => {
                if (typeof s === 'string') {
                  return <p key={i} className="text-sm mb-1 "><span className="text-[#c5a0e7] w-1 h-1">•</span> {s}</p>;
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
                          className="bg-white h-1 rounded-full transition-all"
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
                return <p key={i} className="text-sm mb-1 ">• {s.name || "Skill"}</p>;
              })}
            </div>
          </div>
        )}

        {data?.visibleSections?.languages !== false && (
          <div className="mb-4">
            <h2 className="font-semibold text-md mb-2 border-b border-[#c3c3c3] pb-1.5">LANGUAGE</h2>
            {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) =>
              renderLanguage(l, i)
            )}
          </div>
        )}

        {/* Certifications */}
        {data?.visibleSections?.certificates !== false && (
          <section className="cursor-pointer" onClick={() => onClickSection("certificates")}>
            <h2 className="text-lg font-bold mb-4 pb-2 border-b border-[#c3c3c3] uppercase tracking-wider">Certifications</h2>
            <div className="space-y-4">
              {(certificates.length ? certificates : [
                { name: "Teaching License", issuer: "State Department", year: "July 2024" },
                { name: "CPR & First Aid", issuer: "Heart Health Org" }
              ]).map((cert, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-white">
                    {cert.name}
                  </p>
                  {cert.year && <p className="text-xs mt-1">{cert.year}</p>}
                  {cert.issuer && <p className="text-xs opacity-80">{cert.issuer}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* RIGHT CONTENT AREA - White Background */}
      <div className="flex-1 p-10">
        {/* Header */}
        <div className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
          <h1 className="text-5xl font-black text-slate-900 mb-2 tracking-tight uppercase">
            {data?.name || "Alec Fischer"}
          </h1>
          <p className="text-2xl text-slate-600 font-light tracking-wide">
            {data?.title || "English Teacher"}
          </p>
          <div className="w-28 h-1 bg-[#a680c9] mt-4"></div>
        </div>

        {/* Profile Summary */}
        {data?.visibleSections?.summary !== false && (
          <section className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("summary")}>
            <h2 className="text-lg font-bold text-slate-600 mb-3 uppercase tracking-wide flex items-center gap-3">
              <span className="w-2 h-2 bg-[#a680c9] rounded-full"></span>
              Profile Summary
            </h2>
            <p className="text-sm leading-relaxed text-slate-700 pl-5">
              {data?.summary || "I am a fresh graduate with a teaching license, focused on providing quality English education to high school students."}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {data?.visibleSections?.experience !== false && (
          <section className="mb-8 cursor-pointer" onClick={() => onClickSection("experience")}>
            <h2 className="text-lg font-bold text-slate-600 mb-4 uppercase tracking-wide flex items-center gap-3">
              <span className="w-2 h-2 bg-[#a680c9] rounded-full"></span>
              Work Experience
            </h2>
            <div className="space-y-6 pl-2">
              {(experiences.length ? experiences : [
                {
                  role: "English Teacher | Internship",
                  company: "Plumeria High School",
                  year: "June 2024 - Present",
                  desc: "Provides one-on-one tutoring...\nDevelops comprehensive study plans..."
                },
                {
                  role: "Intern",
                  company: "The Learning Center",
                  year: "2023-2024",
                  desc: "Assisted in creating educational materials...\nHelped organize events..."
                }
              ]).map((exp, i) => (
                <div key={i} className="relative pl-4">
                  {/* <div className="absolute left-0 top-2 w-3 h-3 bg-yellow-400 rounded-full -ml-[26px]"></div> */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-base font-bold text-slate-700">{exp.role}</p>
                      <p className="text-sm text-slate-600 font-medium italic">{exp.company}</p>
                    </div>
                    <p className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                      {exp.start}
                      {exp.start && (exp.end || exp.current) && " - "}
                      {exp.current ? "Present" : exp.end}
                    </p>
                  </div>

                  {exp.desc && (
                    exp.descFormat === "bullet" ? (
                      exp.desc.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-slate-700 break-words">• {line}</p>)
                    ) : exp.descFormat === "number" ? (
                      exp.desc.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-slate-700 break-words">{idx + 1}. {line}</p>)
                    ) : (
                      <p className="text-sm mt-1 text-slate-700 break-words">{exp.desc}</p>
                    )
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data?.visibleSections?.education !== false && (
          <div className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
            <h2 className="text-lg font-bold text-slate-600 mb-4 uppercase tracking-wide flex items-center gap-3">
              <span className="w-2 h-2 bg-[#a680c9] rounded-full"></span>
              Education
            </h2>
            <div className="space-y-5 pl-2">
              {education.map((edu, i) => (
                <div key={i} className="relative pl-4">
                  {/* <div className="absolute left-0 top-2 w-3 h-3 bg-yellow-400 rounded-full -ml-[26px]"></div> */}
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="font-bold text-base text-slate-700">{edu.degree}</p>
                      <p className="text-sm text-slate-600 font-medium">{edu.school}</p>
                      {edu.field && <p className="text-xs text-slate-500 mt-0.5">{edu.field}</p>}
                    </div>
                    <p className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
                      {edu.start && formatDate(edu.start)}
                      {edu.start && (edu.end || edu.current) && " - "}
                      {edu.current ? "Present" : edu.end && formatDate(edu.end)}
                    </p>
                  </div>
                  {edu.description && (
                    edu.descFormat === "bullet" ? (
                      edu.description.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-slate-700 break-words">• {line}</p>)
                    ) : edu.descFormat === "number" ? (
                      edu.description.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-slate-700 break-words">{idx + 1}. {line}</p>)
                    ) : (
                      <p className="text-sm mt-1 text-slate-700 break-words">{edu.description}</p>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Projects */}
        {data?.visibleSections?.projects !== false && (
          <section className="mb-8 cursor-pointer" onClick={() => onClickSection && onClickSection("projects")}>
            <h2 className="text-lg font-bold text-slate-600 mb-4 uppercase tracking-wide flex items-center gap-3">
              <span className="w-2 h-2 bg-[#a680c9] rounded-full"></span>
              Projects
            </h2>
            <div className="space-y-5 pl-5">
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
            </div>
          </section>
        )}

        {/* Awards */}
        {data?.visibleSections?.awards !== false && Awards.length > 0 && (
          <div className="mb-8 cursor-pointer" onClick={() => onClickSection?.("awards")}>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide flex items-center gap-3">
              <span className="w-2 h-2 bg-[#a680c9] rounded-full"></span>
              Awards
            </h2>
            <div className="space-y-4 pl-5">
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
          </div>
        )}

        {/* References */}
        {data?.visibleSections?.references !== false && references.length > 0 && (
          <div className="cursor-pointer" onClick={() => onClickSection?.("references")}>
            <h2 className="text-xl font-bold text-slate-900 mb-4 uppercase tracking-wide flex items-center gap-3">
              <span className="w-2 h-2 bg-[#a680c9] rounded-full"></span>
              References
            </h2>
            <div className="grid grid-cols-2 gap-4 pl-5">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}