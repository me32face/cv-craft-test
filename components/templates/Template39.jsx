"use client";

import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';

export default function template39({ data, onClickSection }) {
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const experiences = toArray(data.experiences);
  const education = toArray(data.education);
  const skills = toArray(data.skills);
  const languages = toArray(data.languages);
  const certificates = toArray(data.certificates);
  const references = toArray(data.references);
  const awards = toArray(data.awards);
  const courses = toArray(data.courses);
  const interests = toArray(data.interests);
  const projects = toArray(data?.projects);


  return (
    <div
      id="cv-preview"
      className="w-[794px] min-h-[1123px] bg-white mx-auto font-sans text-gray-700"
    >
      {/* TOP HEADER WITH IMAGE AND NAME */}
      <div className="flex items-start gap-5 px-8 pt-8 pb-6 border-b border-gray-200">
        {/* Profile Image */}
        <div className="mb-10 relative">
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
        {/* Name, Title, Contact */}
        <div
          className="flex-1 pt-2 cursor-pointer"
          onClick={() => onClickSection && onClickSection("personal")}
        >
          <h1 className="text-4xl font-bold text-amber-800 mb-1">
            {data?.name || "Daniel Gallego"}
          </h1>
          <p className="text-sm text-gray-600 mb-4">
            {data?.title || "Professional Marketing Manager"}
          </p>

          {/* Contact Icons Row */}
          <div className="flex flex-wrap gap-x-1 gap-y-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-amber-600">📞</span>
              <span>{data?.phone || "+123-456-7890"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-600">✉️</span>
              <span>{data?.email || "hello@reallygreatsite.com"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-600">📍</span>
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

      {/* TWO COLUMN LAYOUT */}
      <div className="flex">
        {/* LEFT COLUMN - Light Gray Background */}
        <div className="w-[280px]  px-6 py-6 flex-shrink-0">
          {/* Certifications */}
          {data?.visibleSections?.certificates !== false && (
            <section
              className="cursor-pointer mb-5"
              onClick={() => onClickSection && onClickSection("certificates")}
            >
              <h2 className="text-md font-semibold uppercase text-gray-800 mb-2 border-b-2 border-amber-700 pb-1.5">
                Certification
              </h2>
              <ul className="space-y-1.5">
                {(certificates.length ? certificates : [
                  "Google Marketing Platform Certification",
                  "Launch: A Guide to Marketing a Professional Certification",
                  "Fundamentals of Digital Marketing by Google",
                  "Professional Certified Marketer by the Disaster Marketing Association",
                  "Certified Email Marketing Professional",
                  "Certified Digital Marketer Professional by Unique Company",
                ]).map((cert, i) => {
                  if (typeof cert === 'string') {
                    return (
                      <li key={i} className="text-[10px] text-gray-700 flex items-start gap-1.5">
                        <span className="text-amber-700 font-bold">•</span>
                        <span>{cert}</span>
                      </li>
                    );
                  }
                  return (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-700 font-bold text-[10px]">•</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{cert.name}</p>
                        {cert.issuer && <p className="text-xs text-gray-600">{cert.issuer}</p>}
                        {cert.year && <p className="text-xs text-gray-500">{cert.year}</p>}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Skills */}
          {data?.visibleSections?.skills !== false && (
            <div className="mb-4 mt-8">
              <h2 className="font-semibold text-md mb-2 cursor-pointer border-b-2 border-amber-700 pb-1.5 " onClick={() => onClickSection && onClickSection("skills")}>SKILLS</h2>
              {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation", "Critical Thinking", "Leadership"]).map((s, i) => {
                if (typeof s === 'string') {
                  return <p key={i} className="text-xs mb-1">• {s}</p>;
                }
                if (s.proficiency !== undefined) {
                  return (
                    <div key={i} className="mb-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{s.name}</span>
                        <span className="text-xs opacity-70">{s.proficiency}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                        <div
                          className="bg-amber-700 h-1 rounded-full transition-all"
                          style={{ width: `${s.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                }
                if (s.category && s.items) {
                  return (
                    <p key={i} className="text-sm mb-1">
                      <span className="font-medium text-amber-700">{s.category}:</span> {s.items.filter(item => item && item.trim()).join(", ")}
                    </p>
                  );
                }
                return <p key={i} className="text-sm mb-1">• {s.name || "Skill"}</p>;
              })}
            </div>
          )}

          {/* Education */}
          {data?.visibleSections?.education !== false && (
            <section
              className="mb-6 cursor-pointer"
              onClick={() => onClickSection && onClickSection("education")}
            >
              <h2 className="text-md font-semibold uppercase text-gray-800 mb-2 border-b-2 border-amber-700 pb-1.5">
                Education
              </h2>
              <div className="space-y-3">
                {(education.length ? education : [
                  {
                    course: "Master of Science in Marketing",
                    school: "University of Torch Universities",
                    year: "January 2013 - February 2015",
                  },
                  {
                    course: "Bachelor of Digital Business",
                    school: "University of Torch Universities",
                    year: "January 2009 - February 2013",
                  },
                ]).map((edu, i) => (
                  <div key={i}>
                    <p className="text-sm font-bold text-gray-800 leading-tight">{edu.course}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{edu.school}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {data?.visibleSections?.languages !== false && (
            <div className="mb-4">
              <h2 className="font-semibold text-md mb-2 border-b-2 border-amber-700 pb-1.5">LANGUAGE</h2>
              {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) =>
                renderLanguage(l, i)
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - White Background */}
        <div className="flex-1 px-6 py-6 bg-gray-100">
          {/* Professional Summary */}
          {data?.visibleSections?.summary !== false && (
            <section
              className="mb-6 cursor-pointer"
              onClick={() => onClickSection && onClickSection("summary")}
            >
              <h2 className="text-md font-semibold uppercase text-gray-800 mb-2 border-b-2 border-amber-700 pb-1.5">
                Professional Summary
              </h2>
              <p className="text-xs leading-relaxed text-gray-700">
                {data?.summary ||
                  "Innovative marketing manager with 7+ years of experience leading successful marketing initiatives and campaigns. Proven track record in developing and implementing strategies that drive brand awareness and revenue growth. Exceptional communication skills and a talent for building and leading high-performing teams."}
              </p>
            </section>
          )}

          {/* Professional Experience */}
          {data?.visibleSections?.experience !== false && (
            <section
              className="mb-6 cursor-pointer"
              onClick={() => onClickSection && onClickSection("experience")}
            >
              <h2 className="text-md font-semibold uppercase text-gray-800 mb-3 border-b-2 border-amber-700 pb-1.5">
                Professional Experience
              </h2>
              <div className="space-y-4">
                {(experiences.length ? experiences : [
                  {
                    role: "Senior Marketing Manager",
                    company: "Borcelle Studios",
                    year: "March 2018 - Present",
                    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                  },
                  {
                    role: "Assistant Marketing Manager",
                    company: "Borcelle Studios",
                    year: "March 2016 - February 2018",
                    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                  },
                ]).map((exp, i) => (
                  <div key={i}>
                    <p className="text-[14px] font-bold text-gray-800">{exp.role}</p>
                    <div className="flex justify-between items-center mt-0.5">
                      <p className="text-[13px] italic text-gray-600">{exp.company}</p>
                      <p className="text-[11px] text-gray-500">{exp.year}</p>
                    </div>

                    {exp.desc && (
                      <div className="mt-1.5 text-[12px] text-gray-700 leading-relaxed">
                        {exp.descFormat === "bullet" ? (
                          exp.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <p key={idx} className="mb-0.5">• {line.trim()}</p>
                            )
                          )
                        ) : exp.descFormat === "number" ? (
                          exp.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <p key={idx} className="mb-0.5">{idx + 1}. {line.trim()}</p>
                            )
                          )
                        ) : (
                          <p>{exp.desc}</p>
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
              className="cursor-pointer"
              onClick={() => onClickSection && onClickSection("projects")}
            >
              <h2 className="text-md uppercase font-semibold text-gray-800 mb-3 border-b-2 border-amber-700 pb-1.5">
                Projects
              </h2>
              <div className="space-y-4">
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