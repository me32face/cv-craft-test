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
//         <span className="opacity-70">({lang.proficiency || 'Fluent'})</span>
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
      className="cv-sidebar w-[794px] min-h-[1123px] bg-gray-50 mx-auto font-sans"
    >
      {/* Header Section */}
      <div className="flex items-center justify-between  px-10 pt-5 pb-5">
        {/* Left: Name and Title */}
        <div className="cursor-pointer ml-36" onClick={() => onClickSection && onClickSection("personal")}>
          <h1 className="text-4xl font-bold text-gray-900 mb-1">
            {data?.name || "Alec Fischer"}
          </h1>
          <p className="text-lg text-gray-600">
            {data?.title || "English Teacher"}
          </p>
        </div>

        {/* Right: Profile Image */}
        <div>
          {/* Profile Image */}
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
        </div>
      </div>

      {/* Main Content */}
      <div className="px-10 pb-10">
        {/* Profile Summary Section */}
        {data?.visibleSections?.summary !== false && (
          <section className="mb-6 pt-3 cursor-pointer border-2 rounded-xl" onClick={() => onClickSection && onClickSection("summary")}>
            <div className="flex items-start gap-3 mb-2">
              <div className="w-1 h-5 bg-gray-500 flex-shrink-0"></div>
              <h2 className="text-sm font-bold text-gray-900 uppercase">Profile Summary</h2>
            </div>
            <p className="text-xs leading-relaxed text-gray-700 mb-5 ml-4">
              {data?.summary || "I am a fresh graduate with a teaching license, focused on providing quality English education to high school students."}
            </p>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10 border-t p-5">
          {/* LEFT SIDE */}
          <div className="space-y-6">
            {/* Contact Section */}
            <section className="cursor-pointer" onClick={() => onClickSection && onClickSection("personal")}>
              <div className="flex items-start gap-3 mb-2">
                <div className="w-1 h-5 bg-gray-600"></div>
                <h2 className="text-sm font-semibold text-gray-700 uppercase">Contact</h2>
              </div>
              <div>
                <div className="mb-4">
                  <p className="text-sm mt-1">📞 {data?.phone || "123-456-7890"}</p>
                  <p className="text-sm mt-1">📧 {data?.email || "hello@email.com"}</p>
                  <p className="text-sm mt-1">📍 {data?.address || "123 Anywhere St., Any City"}</p>
                  {data?.visibleSections?.socialLinks !== false && (
                    <>
                      {socialLinks.length > 0 && (
                        <div className="">
                          {socialLinks.map((link, i) => (
                            <p key={i} className="text-xs mt-1 break-all"> <span >🔗</span>
                              <span className="ml-1">{link}</span>
                            </p>))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>
            {/* Skills */}
            {data?.visibleSections?.skills !== false && (
              <div className="mb-4">
                <div className="mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-1 h-5 bg-gray-600"></div>
                    <h2 className="text-sm font-semibold text-gray-700 uppercase">SKILLS</h2>
                  </div>
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

            {/* Education */}
            {data?.visibleSections?.education !== false && (
              <div className=" cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-1 h-5 bg-gray-600"></div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase">EDUCATION</h2>
                </div>
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
            {/* Languages */}
            {data?.visibleSections?.languages !== false && (
              <section className="cursor-pointer" onClick={() => onClickSection("languages")}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-1 h-5 bg-gray-600"></div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase">Languages</h2>
                </div>

                <div className="ml-4  gap-x-4 gap-y-1">
                  {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) =>
                    renderLanguage(l, i)
                  )}
                </div>
              </section>
            )}

            {/* AWARDS */}
          {data?.visibleSections?.awards !== false && Awards.length > 0 && (
            <div className="mt-6"  onClick={() => onClickSection?.("awards")}>
               <div className="flex items-start gap-3 mb-2">
                  <div className="w-1 h-5 bg-gray-600"></div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase">AWARDS</h2>
                </div>
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
             <div className="flex items-start gap-3 mb-2">
                  <div className="w-1 h-5 bg-gray-600"></div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase">References</h2>
                </div>
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

          {/* RIGHT SIDE */}
          <div className="space-y-6">
            {/* Certifications */}
            {data?.visibleSections?.certificates !== false && (
              <section className="cursor-pointer" onClick={() => onClickSection("certificates")}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-1 h-5 bg-gray-600"></div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase">Certifications</h2>
                </div>
                <div className="ml-4 grid grid-cols-1 gap-6">
                  {(certificates.length ? certificates : [
                    { name: "Teaching License", issuer: "State Department", year: "July 2024" },
                    { name: "CPR & First Aid", issuer: "Heart Health Org" }
                  ]).map((cert, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-gray-600">
                        {cert.name} {cert.year && `| ${cert.year}`}
                      </p>
                      {cert.issuer && (
                        <p className="text-xs text-gray-600">{cert.issuer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Work Experience */}
            {data?.visibleSections?.experience !== false && (
              <section className="cursor-pointer" onClick={() => onClickSection("experience")}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-1 h-5 bg-gray-600"></div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase">Work Experience</h2>
                </div>
                <div className="ml-4 space-y-4">
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
                    <div key={i}>

                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <p className="text-sm font-semibold text-slate-600">{exp.role}</p>
                          <p className="text-xs text-slate-600 italic mb-1">{exp.company}</p>
                        </div>
                        <p className="text-xs opacity-60">
                          {exp.start}
                          {exp.start && (exp.end || exp.current) && " - "}
                          {exp.current ? "Present" : exp.end}
                        </p>
                      </div>

                      {exp.desc && (
                        exp.descFormat === "bullet" ? (
                          exp.desc.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-justify text-gray-700 break-words">• {line}</p>)
                        ) : exp.descFormat === "number" ? (
                          exp.desc.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-justify text-gray-700 break-words">{idx + 1}. {line}</p>)
                        ) : (
                          <p className="text-sm mt-1 text-justify text-gray-700 break-words">{exp.desc}</p>
                        )
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Projects */}
            {data?.visibleSections?.projects !== false && (
              <section
                className="cursor-pointer"
                onClick={() => onClickSection && onClickSection("projects")}
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-1 h-5 bg-gray-600"></div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase">Projects</h2>
                </div>
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
    </div>
  );
}