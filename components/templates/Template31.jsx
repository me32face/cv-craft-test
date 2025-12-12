"use client";
import React from "react";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiLink,
  FiLinkedin,
  FiGithub,
} from "react-icons/fi";
import { GiLaurelsTrophy, GiBigDiamondRing } from "react-icons/gi";
import { BsFillBriefcaseFill } from "react-icons/bs";
import { AiFillTool } from "react-icons/ai";
import { MdOutlineLanguage, MdSchool } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { renderLanguage } from "../cvbuilder/inputsections/LanguagesInput";
import SocialLinkDisplay from "../SocialLinkDisplay";
import { Calendar } from "lucide-react";

export default function Template31({ data = {}, onClickSection, activeTheme }) {
  const toArray = (value) =>
    !value ? [] : Array.isArray(value) ? value : [value];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const experiences = toArray(data?.experiences);
  const education = toArray(data?.education);
  const certificates = toArray(data?.certificates);
  const languages = toArray(data?.languages);
  const awards = toArray(data?.awards);
  const references = toArray(data?.references);
  const projects = toArray(data?.projects);
  const socialLinks = toArray(data?.socialLinks);

  // Compact Theme Settings
  const themeColor = activeTheme?.color || "#3b82f6";
  const sidebarBg = "#f8fafc";

  // Dense Description Renderer
  const renderDescription = (text, format) => {
    if (!text) return null;
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) return null;

    if (format === "bullet") {
      return (
        <ul className="list-none m-0 p-0 mt-1">
          {lines.map((line, idx) => (
            <li
              key={idx}
              className="flex items-start text-[10px] text-gray-700 mb-0.5 leading-snug"
            >
              <span className="mr-1.5 mt-1 w-0.5 h-0.5 rounded-full bg-gray-500 flex-shrink-0" />
              <span>{line.replace(/^[•\-\*]\s*/, "")}</span>
            </li>
          ))}
        </ul>
      );
    }

    if (format === "number") {
      return (
        <ol className="list-decimal list-inside m-0 p-0 mt-1 text-[10px] text-gray-700 leading-snug">
          {lines.map((line, idx) => (
            <li key={idx} className="mb-0.5">
              {line.replace(/^\d+\.\s*/, "")}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p className="text-[10px] mt-1 text-gray-700 leading-snug whitespace-pre-line">
        {text}
      </p>
    );
  };

  const handleClick = (key) => {
    if (typeof onClickSection === "function") onClickSection(key);
  };

  return (
    <div
      className="mx-auto bg-white shadow-lg flex flex-row min-h-[1123px]"
      style={{
        width: "794px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* --- LEFT SIDEBAR (Compact) --- */}
      <aside
        className="w-[28%] p-5 flex flex-col gap-6 border-r border-gray-200"
        style={{ backgroundColor: sidebarBg }}
      >
        {/* Profile Image */}
        <div className="flex justify-start">
          <div
            className={`relative w-24 h-24 bg-white shadow-sm border border-gray-200 ${
              data?.imageShape === "circle" ? "rounded-full" : "rounded-lg"
            }`}
          >
            {data?.profileImage ? (
              <img
                src={data.profileImage}
                alt="Profile"
                className={`w-full h-full object-cover ${
                  data?.imageShape === "circle" ? "rounded-full" : "rounded-lg"
                }`}
              />
            ) : (
              <div
                className={`w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 ${
                  data?.imageShape === "circle" ? "rounded-full" : "rounded-lg"
                }`}
              >
                <FaUserCircle size={40} />
              </div>
            )}
          </div>
        </div>

        {/* Contact Info - Compact List */}
        <div className="flex flex-col gap-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-1">
            Contact
          </h3>

          <div className="flex flex-col gap-1.5 text-[10px] text-gray-600">
            {data?.email && (
              <div className="flex items-center gap-2">
                <FiMail
                  size={12}
                  style={{ color: themeColor }}
                  className="flex-shrink-0"
                />
                <span className="break-all">{data.email}</span>
              </div>
            )}
            {data?.phone && (
              <div className="flex items-center gap-2">
                <FiPhone
                  size={12}
                  style={{ color: themeColor }}
                  className="flex-shrink-0"
                />
                <span>{data.phone}</span>
              </div>
            )}
            {data?.address && (
              <div className="flex items-center gap-2">
                <FiMapPin
                  size={12}
                  style={{ color: themeColor }}
                  className="flex-shrink-0"
                />
                <span className="leading-tight">{data.address}</span>
              </div>
            )}
            {data?.dob && data?.visibleSections?.dob !== false && (
              <div className="flex items-center gap-2">
                <Calendar
                  size={12}
                  style={{ color: themeColor }}
                  className="flex-shrink-0"
                />
                <span>{data.dob}</span>
              </div>
            )}
            {data?.maritalStatus &&
              data?.visibleSections?.maritalStatus !== false && (
                <div className="flex items-center gap-2">
                  <GiBigDiamondRing
                    size={12}
                    style={{ color: themeColor }}
                    className="flex-shrink-0"
                  />
                  <span>{data.maritalStatus}</span>
                </div>
              )}
          </div>

          {/* Compact Socials */}
          {(data?.linkedin ||
            data?.github ||
            data?.portfolio ||
            (socialLinks.length > 0 &&
              data?.visibleSections?.socialLinks !== false)) && (
            <div className="flex flex-col gap-1.5 mt-1 text-[10px] text-gray-600">
              {data?.linkedin && (
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-blue-600 transition"
                >
                  <FiLinkedin size={12} className="flex-shrink-0" />
                  <span className="truncate">LinkedIn</span>
                </a>
              )}
              {data?.github && (
                <a
                  href={data.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-black transition"
                >
                  <FiGithub size={12} className="flex-shrink-0" />
                  <span className="truncate">GitHub</span>
                </a>
              )}
              {data?.portfolio && (
                <a
                  href={data.portfolio}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-blue-500 transition"
                >
                  <FiLink size={12} className="flex-shrink-0" />
                  <span className="truncate">Portfolio</span>
                </a>
              )}
              {data?.visibleSections?.socialLinks !== false &&
                socialLinks.map((link, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 transform scale-90 origin-left"
                  >
                    <SocialLinkDisplay link={link} />
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Skills - Simple List */}
        {data?.visibleSections?.skills !== false && (
          <div onClick={() => handleClick("skills")} className="cursor-pointer">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">
              Skills
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {(
                data?.skills || ["Leadership", "Communication", "Strategy"]
              ).map((skill, index) => {
                const skillName =
                  typeof skill === "string" ? skill : skill.name;
                return (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-white border border-gray-300 rounded text-[10px] font-medium text-gray-700"
                  >
                    {skillName}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Languages - Compact */}
        {data?.visibleSections?.languages !== false && (
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">
              Languages
            </h3>
            <div className="flex flex-col gap-1 transform scale-95 origin-top-left">
              {(languages.length ? languages : ["English", "Spanish"]).map(
                (lang, i) => renderLanguage(lang, i)
              )}
            </div>
          </div>
        )}

        {/* Awards - Minimal */}
        {data?.visibleSections?.awards !== false && awards.length > 0 && (
          <div onClick={() => handleClick("awards")} className="cursor-pointer">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-1 mb-2">
              Awards
            </h3>
            <div className="flex flex-col gap-2">
              {awards.map((award, i) => (
                <div key={i} className="text-[10px] leading-tight">
                  <p className="font-semibold text-gray-800">
                    {typeof award === "string" ? award : award.title}
                  </p>
                  {typeof award !== "string" &&
                    (award.issuer || award.date) && (
                      <p className="text-[9px] text-gray-500 mt-0.5">
                        {award.issuer} {award.date && `• ${award.date}`}
                      </p>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* --- RIGHT CONTENT (Dense) --- */}
      <main className="flex-1 p-8 flex flex-col gap-5">
        {/* Header - Left Aligned */}
        <header className="border-b border-gray-200 pb-4">
          <h1
            className="text-2xl font-bold text-gray-900 uppercase tracking-tight mb-1"
            style={{ color: themeColor }}
          >
            {data?.name || "Your Name"}
          </h1>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {data?.title || "Professional Role"}
          </p>
        </header>

        {/* Summary */}
        {data?.visibleSections?.summary !== false && (
          <section
            onClick={() => handleClick("summary")}
            className="cursor-pointer"
          >
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-1 flex items-center gap-2">
              <span
                className="w-1 h-4 rounded-sm"
                style={{ backgroundColor: themeColor }}
              ></span>
              Professional Profile
            </h2>
            <p className="text-[10px] text-gray-700 leading-relaxed text-justify">
              {data?.summary ||
                "A concise professional summary highlighting key achievements and skills. Keep it brief and focused."}
            </p>
          </section>
        )}

        {/* Experience - Minimal List */}
        {data?.visibleSections?.experience !== false && (
          <section
            onClick={() => handleClick("experience")}
            className="cursor-pointer"
          >
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
              <span
                className="w-1 h-4 rounded-sm"
                style={{ backgroundColor: themeColor }}
              ></span>
              Experience
            </h2>

            <div className="flex flex-col gap-4">
              {experiences.map((exp, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-[12px] font-bold text-gray-800">
                      {exp.role}
                    </h4>
                    <span className="text-[10px] font-medium text-gray-500">
                      {exp.start ? formatDate(exp.start) : ""} –{" "}
                      {exp.current
                        ? "Present"
                        : exp.end
                        ? formatDate(exp.end)
                        : ""}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-gray-600 mb-1">
                    {exp.company}{" "}
                    {exp.location && (
                      <span className="font-normal text-gray-400">
                        | {exp.location}
                      </span>
                    )}
                  </div>

                  {exp.desc && (
                    <div className="text-[10px] text-gray-700">
                      {renderDescription(exp.desc, exp.descFormat)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data?.visibleSections?.projects !== false && projects.length > 0 && (
          <section
            onClick={() => handleClick("projects")}
            className="cursor-pointer"
          >
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
              <span
                className="w-1 h-4 rounded-sm"
                style={{ backgroundColor: themeColor }}
              ></span>
              Projects
            </h2>

            <div className="flex flex-col gap-3">
              {projects.map((project, i) => (
                <div key={i} className="">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-[11px] font-bold text-gray-800">
                      {project.name}
                    </h4>
                    <span className="text-[9px] font-medium text-gray-500">
                      {project.year}
                    </span>
                  </div>

                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[9px] text-blue-600 hover:underline mb-1 block"
                    >
                      {project.link}
                    </a>
                  )}

                  {project.desc && (
                    <div className="text-[10px] text-gray-700 leading-snug">
                      {renderDescription(project.desc, project.descFormat)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data?.visibleSections?.education !== false && (
          <section
            onClick={() => handleClick("education")}
            className="cursor-pointer"
          >
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-2">
              <span
                className="w-1 h-4 rounded-sm"
                style={{ backgroundColor: themeColor }}
              ></span>
              Education
            </h2>

            <div className="flex flex-col gap-3">
              {education.map((edu, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div>
                    <h4 className="text-[12px] font-bold text-gray-800">
                      {edu.degree}
                    </h4>
                    <p className="text-[11px] text-gray-600 font-medium">
                      {edu.school}
                    </p>
                    {edu.field && (
                      <p className="text-[10px] text-gray-500">{edu.field}</p>
                    )}
                    {edu.description && (
                      <p className="text-[10px] text-gray-500 italic mt-0.5">
                        {edu.description}
                      </p>
                    )}
                  </div>
                  <div className="text-[10px] font-medium text-gray-500 whitespace-nowrap text-right">
                    {edu.start ? formatDate(edu.start) : ""} –{" "}
                    {edu.current
                      ? "Present"
                      : edu.end
                      ? formatDate(edu.end)
                      : ""}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications (Grid) */}
        {data?.visibleSections?.certificates !== false &&
          certificates.length > 0 && (
            <section
              onClick={() => handleClick("certificates")}
              className="cursor-pointer"
            >
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-2 flex items-center gap-2">
                <span
                  className="w-1 h-4 rounded-sm"
                  style={{ backgroundColor: themeColor }}
                ></span>
                Certifications
              </h2>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {certificates.map((cert, i) => (
                  <div key={i} className="text-[10px]">
                    <p className="font-bold text-gray-800 leading-tight">
                      {cert.name}
                    </p>
                    <p className="text-[9px] text-gray-500">
                      {cert.issuer} {cert.year ? `| ${cert.year}` : ""}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
      </main>
    </div>
  );
}
