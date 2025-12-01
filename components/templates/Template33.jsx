"use client";

import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';
import { Phone, Mail, MapPin, Link } from "lucide-react";
import SocialLinkDisplay from "../SocialLinkDisplay";

export default function Template35({ data, onClickSection }) {
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric' });
  };

  const experiences = toArray(data.experiences);
  const education = toArray(data.education);
  const skills = toArray(data.skills);
  const languages = toArray(data.languages);
  const certificates = toArray(data.certificates);
  const references = toArray(data.references);
  const courses = toArray(data.courses);
  const interests = toArray(data.interests);
  const projects = toArray(data?.projects);
  const socialLinks = toArray(data?.socialLinks);
  const Awards = toArray(data?.awards);

  return (
    <div
      id="cv-preview"
      className="w-[794px] min-h-[1123px] bg-white mx-auto font-sans text-gray-700 tracking-tight flex" >
      {/* LEFT SIDEBAR */}
      <div className="cv-sidebar w-[280px] bg-gradient-to-b from-green-50 to-green-200 p-8 flex-shrink-0">
        {/* PROFILE IMAGE */}
        <div className="mb-10 relative">
          {/* Profile Image */}
          {data?.profileImage && (
            <div
              className={`overflow-hidden mb-6 ${data.imageShape === "circle" ? "rounded-full" : data.imageShape === "rounded" ? "rounded-xl" : ""}`}
              style={{ width: 120, height: 120, margin: "0 auto" }}
            >
              <img src={data.profileImage} className="w-full h-full object-cover" alt="profile" />
            </div>
          )}
        </div>
        {/* Contact */}
        <div>
          <div className="mb-4">
            <h2 className="font-semibold text-md mb-2">CONTACT</h2>
            <div className="flex items-center gap-2 leading-[1.4] text-sm break-words">
              <Phone size={14} className="shrink-0 translate-y-[-1px]" />
              <span>{data?.phone || "123-456-7890"}</span>
            </div>
            <div className="flex items-center gap-2 leading-[1.4] text-sm break-words">
              <Mail size={14} className="shrink-0 translate-y-[-1px]" />
              <span>{data?.email || "hello@email.com"}</span>
            </div>
            <div className="flex items-center gap-2 leading-[1.4] text-sm break-words">
              <MapPin size={14} className="shrink-0 translate-y-[-1px]" />
              <span>{data?.address || "123 Anywhere St., Any City"}</span>
            </div>
            {data?.visibleSections?.socialLinks !== false && (
              <>
                {socialLinks.length > 0 && (
                  <div className="">
                    {data.socialLinks.map((link, i) => (
                      <SocialLinkDisplay key={i} link={link} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* SKILLS */}
        {data?.visibleSections?.skills !== false && (
          <div className="mb-4">
            <div className="mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>
              <h2 className="text-md  font-semibold  mb-3  ">
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
                        <span className="text-sm break-words">{s.name}</span>
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
                      <span className="font-medium">{s.category}:</span> {s.skills.filter(item => item && item.trim()).join(", ")}
                    </p>
                  );
                }
                return <p key={i} className="text-sm mb-1 break-words">• {s.name || "Skill"}</p>;
              })}
            </div>
          </div>
        )}
        {/* Languages */}
        {data?.visibleSections?.languages !== false && (
          <div className="mb-4">
            <h2 className="font-semibold text-md mb-2">LANGUAGE</h2>
            {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) =>
              renderLanguage(l, i)
            )}
          </div>
        )}
        {/* AWARDS */}
        {data?.visibleSections?.awards !== false && Awards.length > 0 && (
          <div className="mt-6">
            <h2 className="text-md  font-semibold  mb-3 " onClick={() => onClickSection?.("awards")}>
              AWARDS
            </h2>
            {(Awards.length ? Awards : [
              { name: "Employee of the Year", issuer: "Tech Company", year: "2023" },
              { name: "Best Innovation Award", issuer: "Industry Association", year: "2022" }
            ]).map((award, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm break-words">{award.name}</p>
                    <p className="text-sm opacity-80 break-words">{award.issuer}</p>
                  </div>
                  <p className="text-xs opacity-60 flex-shrink-0">{award.year}</p>
                </div>
                {award.description && (
                  <p className="text-sm mt-1 break-words">{award.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {data?.visibleSections?.certificates !== false && (
          <>
            <h2 className="text-md font-semibold mt-2 mb-3  pb-1 cursor-pointer break-words" onClick={() => onClickSection && onClickSection("certificates")}>
              CERTIFICATIONS
            </h2>
            {(data?.certificates || [
              { name: "Project Management Professional (PMP)", issuer: "PMI", year: "2023" },
              { name: "Digital Marketing Certification", issuer: "Google", year: "2022" }
            ]).map((cert, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-700 break-words">{cert.name}</p>
                    <p className="text-sm opacity-80 break-words">{cert.issuer}</p>
                  </div>
                  <p className="text-xs opacity-60 flex-shrink-0">{cert.year}</p>
                </div>
              </div>
            ))}
          </>
        )}

        {/*References*/}
        {data?.visibleSections?.references !== false && references.length > 0 && (
          <>
            <h2 className="text-md  font-semibold  mb-3 uppercase ">
              references
            </h2>
            {(references.length ? references : [
              { name: "Harumi Kobayashi", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" },
              { name: "Bailey Dupont", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" }
            ]).map((r, i) => (
              <div key={i} className="mb-3">
                <p className="font-semibold  !text-sm text-gray-700 break-words">{r.name}</p>
                <p className="text-sm break-words">{r.title}</p>
                <p className="text-sm break-words">{r.company}</p>
                <p className="text-sm text-gray-700 break-words">Phone: {r.phone}</p>
                <p className="text-sm text-gray-700 break-words">Email: {r.email}</p>
              </div>
            ))}
          </>
        )}
      </div>

      {/* RIGHT CONTENT */}
      <div className="w-2/3 p-10">
        {/* HEADER */}
        <header
          className="mb-12 cursor-pointer"
          onClick={() => onClickSection("personal")}
        >
          <div className="inline-flex flex-col items-center border px-6  py-3 rounded-3xl">
            <h1 className="text-4xl font-bold text-gray-600 uppercase  tracking-wide break-words">
              {data.name || "YOUR NAME"}
            </h1>

            <p className="text-sm  font-medium text-green-900 uppercase tracking-wide mt-1 break-words">
              {data.title || "The role you are applying for?"}
            </p>
          </div>
        </header>
        {/* Summary */}
        {data?.visibleSections?.summary !== false && (
          <>
            <h2 className="text-md font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("summary")}>
              SUMMARY
            </h2>
            <p className="text-sm mb-4 text-gray-700 break-words">{data?.summary || "A dedicated professional with extensive experience in the field."}</p>
          </>
        )}
        {/* Experience */}
        {data?.visibleSections?.experience !== false && (
          <>
            <h2 className="text-md font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
              EXPERIENCE
            </h2>
            {(experiences.length ? experiences : [
              { role: "Product Design Manager", company: "Arowwai Industries", year: "2020-2023", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
              { role: "Product Design Manager", company: "Ingoude Company", year: "2019-2020", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
              { role: "Product Design Manager", company: "Timmerman Industries", year: "2017-2019", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
            ]).map((exp, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm break-words">{exp.role}</p>
                    <p className="text-sm opacity-80 break-words">{exp.company}</p>
                  </div>
                  <p className="text-xs opacity-60 flex-shrink-0">
                    {exp.start}
                    {exp.start && (exp.end || exp.current) && " - "}
                    {exp.current ? "Present" : exp.end}
                  </p>
                </div>
                {exp.descFormat === "bullet" ? (
                  exp.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700 break-words">• {line}</p>)
                ) : exp.descFormat === "number" ? (
                  exp.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700 break-words">{idx + 1}. {line}</p>)
                ) : (
                  <p className="text-sm mt-1 break-words">{exp.desc}</p>
                )}
              </div>
            ))}
          </>
        )}
        {/* Projects */}
        {data?.visibleSections?.projects !== false && (
          <>
            <h2 className="text-md font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("projects")}>
              PROJECTS
            </h2>
            {projects.map((project, i) => (
              <div key={i} className="mb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm break-words">{project.name}</p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 underline project-link break-all"
                      >
                        {project.useCustomLabel
                          ? project.linkLabel
                          : project.link}
                      </a>
                    )}
                  </div>
                  <p className="text-xs opacity-60 flex-shrink-0">{project.year}</p>
                </div>
                {project.descFormat === "bullet" ? (
                  project.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700 break-words">• {line}</p>)
                ) : project.descFormat === "number" ? (
                  project.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700 break-words">{idx + 1}. {line}</p>)
                ) : (
                  <p className="text-sm mt-1 text-gray-700 break-words">{project.desc}</p>
                )}
              </div>
            ))}
          </>
        )}
        {/* Education */}
        {data?.visibleSections?.education !== false && (
          <div className="">
            <h2 className="text-md font-semibold mt-2 mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
              EDUCATION
            </h2>
            {education.map((edu, i) => (
              <div key={i} className=" mb-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-gray-700 break-words">{edu.degree}</p>
                    <p className="text-sm opacity-80 break-words">{edu.school}</p>
                    {edu.field && <p className="text-xs opacity-70 break-words">{edu.field}</p>}
                  </div>
                  <p className="text-xs opacity-60 flex-shrink-0">
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
      </div>
    </div>
  )
}