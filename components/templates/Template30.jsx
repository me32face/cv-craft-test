'use client';
import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';

export default function Template30({ data, onClickSection }) {
  // Safety conversion
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const experiences = toArray(data?.experiences);
  const summary = toArray(data?.summary);
  const education = toArray(data?.education);
  const certificates = toArray(data?.certificates);
  const languages = toArray(data?.languages);
  const awards = toArray(data?.awards);
  const references = toArray(data?.references);
  const projects = toArray(data?.projects);
  const socialLinks = toArray(data?.socialLinks);

  return (
    <div id="pdf-template" className="w-[794px] min-h-[1123px] bg-white flex pb-8" style={{ fontFamily: 'Poppins, sans-serif' }}>

      {/* LEFT SIDEBAR */}
      
      <div className="cv-sidebar w-1/3 bg-[#2C3E50] text-white p-6 flex flex-col">
        {/* Profile Image */}
        {data?.profileImage && (
          <div
            className={`overflow-hidden mb-6 ${data.imageShape === "circle" ? "rounded-full" : data.imageShape === "rounded" ? "rounded-xl" : ""}`}
            style={{ width: 120, height: 120, margin: "0 auto" }}
          >
            <img src={data.profileImage} className="w-full h-full object-cover" alt="profile" />
          </div>
        )}

        <h1 className="text-xl font-bold text-center break-words">{data?.name || "Isabel Mercado"}</h1>
        <p className="text-sm text-center opacity-80 break-words">{data?.title || "Marketing Manager"}</p>

        <div className="border-t border-white/40 my-4"></div>

        {/* Contact */}
        <div className="mb-4">
          <h2 className="font-semibold text-md mb-2">CONTACT</h2>
          <p className="text-sm mt-1 break-words">📞 {data?.phone || "123-456-7890"}</p>
          <p className="text-sm mt-1 break-words">📧 {data?.email || "hello@email.com"}</p>
          <p className="text-sm mt-1 break-words">📍 {data?.address || "123 Anywhere St., Any City"}</p>
          {data?.visibleSections?.socialLinks !== false && (
            <>
              {socialLinks.length > 0 && (
                <div className="">
                  {socialLinks.map((link, i) => (
                    <p key={i} className="text-sm break-all">🔗 {link}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Expertise/Skills */}
        {data?.visibleSections?.skills !== false && (
          <div className="mb-4">
            <h2 className="font-semibold text-md mb-2 cursor-pointer " onClick={() => onClickSection && onClickSection("skills")}>EXPERTISE</h2>
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
            
            return <p key={i} className="text-sm mb-1">• {s.name || "Skill"}</p>;
          })}
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

        {/* Awards */}
        <div className="mb-4">
          <h2 className="font-semibold text-md mb-2">AWARDS</h2>
          {(awards.length ? awards : [
            "Oct 2019 | Employee of the Year",
            "May 2015 | Best Employee"
          ]).map((a, i) => (
            <p key={i} className="text-sm mb-1">{a}</p>
          ))}
        </div>
      </div>

      {/* RIGHT MAIN CONTENT */}
      <div className="w-2/3 p-8 flex flex-col">

        {/* Summary */}
        {data?.visibleSections?.summary !== false && (
          <div className=" mb-4">
            <h2 className="text-md font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("summary")}>
             SUMMARY
            </h2>
            <p className="text-sm text-gray-700 text-justify break-words">{data?.summary || "A dedicated professional with extensive experience in the field."}</p>
          </div>
        )}

        {/* Projects */}
        {data?.visibleSections?.projects !== false && (
          <>
            <h2 className="text-md font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("projects")}>
              PROJECTS
            </h2>
        {projects.map((project, i) => (
          <div key={i} className=" mb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800 !text-sm break-words">{project.name}</p>
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 break-all">
                    {project.link}
                  </a>
                )}
              </div>
              <p className="text-xs opacity-60">{project.year}</p>
            </div>
            {project.descFormat === "bullet" ? (
              project.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700 text-justify break-words">• {line}</p>)
            ) : project.descFormat === "number" ? (
              project.desc?.split('\n').map((line, idx) => line.trim() && <p key={idx} className="text-sm mt-1 text-gray-700 text-justify break-words">{idx + 1}. {line}</p>)
            ) : (
              <p className="text-sm mt-1 text-gray-700 text-justify break-words">{project.desc}</p>
            )}
          </div>
        ))}
          </>
        )}

        {/* Experience */}
        {data?.visibleSections?.experience !== false && (
          <>
            <h2 className="text-md font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
              EXPERIENCE
            </h2>
        {experiences.map((exp, i) => (
          <div key={i} className=" mb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800 !text-sm break-words">{exp.role}</p>
                <p className="text-sm opacity-80 break-words">{exp.company}</p>
                {exp.location && <p className="text-xs opacity-70 break-words">{exp.location}</p>}
              </div>
              <p className="text-xs opacity-60">
                {exp.start}
                {exp.start && (exp.end || exp.current) && " - "}
                {exp.current ? "Present" : exp.end}
              </p>
            </div>
            {exp.desc && (
              <p className="text-sm mt-1 text-justify text-gray-700 break-words">{exp.desc}</p>
            )}
            {exp.reference && (
              <p className="text-xs mt-1 italic text-gray-600 break-words">Reference: {exp.reference}</p>
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
            {edu.description && <p className="text-sm mt-1 text-gray-700 text-justify break-words">{edu.description}</p>}
          </div>
        ))}
          </div>
        )}

        {/* Certifications */}
        {data?.visibleSections?.certificates !== false && (
          <div className="">
            <h2 className="text-md font-semibold mt-2 mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("certificates")}>
              CERTIFICATIONS
            </h2>
        {(data?.certificates || [
          { name: "Project Management Professional (PMP)", issuer: "PMI", year: "2023" },
          { name: "Digital Marketing Certification", issuer: "Google", year: "2022" }
        ]).map((cert, i) => (
          <div key={i} className=" mb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold !text-sm text-gray-700 break-words">{cert.name}</p>
                <p className="text-sm opacity-80 break-words">{cert.issuer}</p>
              </div>
              <p className="text-xs opacity-60">{cert.year}</p>
            </div>
          </div>
        ))}
          </div>
        )}

        {/* References
        <h2 className="text-md font-semibold mt-2 mb-3 border-b pb-1">REFERENCES</h2>
        {(references.length ? references : [
          { name: "Harumi Kobayashi", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" },
          { name: "Bailey Dupont", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" }
        ]).map((r, i) => (
          <div key={i} className="mb-3">
            <p className="font-semibold  !text-sm text-gray-700">{r.name}</p>
            <p className="text-sm ">{r.title}</p>
            <p className="text-sm text-gray-700">Phone: {r.phone}</p>
            <p className="text-sm text-gray-700">Email: {r.email}</p>
          </div>
        ))} */}

      </div>
    </div>
  );
}
