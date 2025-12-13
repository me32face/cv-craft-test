"use client";
import React, { useRef, useState, useEffect } from "react";
import { renderLanguage } from "../cvbuilder/inputsections/LanguagesInput";
import SocialLinkDisplay from "../SocialLinkDisplay";

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
  const languages = toArray(data?.languages);
  const projects = toArray(data?.projects);
  const socialLinks = toArray(data?.socialLinks);

  // Modern ATS: Clean Sans-Serif, Open Layout
  const fontFamily = "'Inter', 'Roboto', 'Arial', sans-serif";
  const themeColor = activeTheme?.color || "#374151"; // Default to dark gray

  // Dynamic Page Height
  const contentRef = useRef(null);
  const [pageHeight, setPageHeight] = useState(1123); // Start with 1 page

  useEffect(() => {
    if (!contentRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const contentHeight = entry.contentRect.height;
        const pageCount = Math.ceil((contentHeight + 80) / 1123); // +80 for padding
        setPageHeight(Math.max(1123, pageCount * 1123));
      }
    });

    resizeObserver.observe(contentRef.current);
    return () => resizeObserver.disconnect();
  }, [data]);

  // Helper for Description (Moved down/up as needed, just context)
  const renderDescription = (text) => {
    if (!text) return null;
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) return null;

    return (
      <ul className="list-disc ml-4 mt-2 space-y-1">
        {lines.map((line, idx) => (
          <li
            key={idx}
            className="text-[12px] leading-relaxed text-gray-700 pl-1 marker:text-gray-400"
          >
            {line.replace(/^[•\-\*]\s*/, "")}
          </li>
        ))}
      </ul>
    );
  };

  const handleClick = (key) => {
    if (typeof onClickSection === "function") onClickSection(key);
  };

  const SectionTitle = ({ title, onClick }) => (
    <div
      className="mb-3 mt-4 pb-1 border-b border-gray-200 cursor-pointer hover:bg-gray-50 flex items-center"
      onClick={onClick}
    >
      <h2
        className="text-[14px] font-bold uppercase tracking-wider"
        style={{ color: themeColor }}
      >
        {title}
      </h2>
    </div>
  );

  return (
    <div
      className="mx-auto bg-white shadow-xl transition-all duration-300 ease-in-out p-6"
      style={{
        width: "794px",
        minHeight: `${pageHeight}px`,
        fontFamily: fontFamily,
        color: "#1F2937", // Gray-800
      }}
    >
      <div ref={contentRef} className="p-10">
        {/* --- HEADER --- */}
        <header className="mb-8 flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2 uppercase">
              {data?.name || "YOUR NAME"}
            </h1>
            <p className="text-lg font-medium text-gray-600 mb-4">
              {data?.title || "Professional Role / Title"}
            </p>

            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-gray-600">
              {data?.phone && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">Phone:</span>{" "}
                  {data.phone}
                </div>
              )}
              {data?.email && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">Email:</span>{" "}
                  {data.email}
                </div>
              )}
              {data?.dob && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">DOB:</span>{" "}
                  {data.dob}
                </div>
              )}
              {data?.maritalStatus &&
                data?.visibleSections?.maritalStatus !== false && (
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      Marital Status:
                    </span>{" "}
                    {data.maritalStatus}
                  </div>
                )}
              {data?.address && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold text-gray-900">Location:</span>{" "}
                  {data.address}
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-gray-600 mt-2">
              {socialLinks.map((link, i) => (
                <div key={i} className="" style={{ color: themeColor }}>
                  <SocialLinkDisplay link={link} />
                </div>
              ))}
            </div>
          </div>
        </header>

        {/* --- SUMMARY --- */}
        {data?.visibleSections?.summary !== false && (
          <section onClick={() => handleClick("summary")}>
            <SectionTitle title="Summary" />
            <p className="text-[12px] text-gray-700 leading-relaxed">
              {data?.summary ||
                "Highly motivated professional with X years of experience in [Industry]. Proven track record of delivering results in fast-paced environments. Expert in [Key Skill 1] and [Key Skill 2]. Committed to driving business success through innovative strategies."}
            </p>
          </section>
        )}

        {/* --- SKILLS --- */}
        {data?.visibleSections?.skills !== false && (
          <section onClick={() => handleClick("skills")}>
            <SectionTitle title="Core Competencies" />
            <div className="flex flex-wrap gap-2">
              {(
                data?.skills || [
                  "Strategic Planning",
                  "Project Management",
                  "Team Leadership",
                  "Data Analysis",
                ]
              ).map((skill, i) => {
                if (typeof skill === "string") {
                  return (
                    <span
                      key={i}
                      className="bg-gray-100 text-gray-700 text-[11px] px-2 py-1 rounded font-medium"
                    >
                      {skill}
                    </span>
                  );
                }

                if (skill.category && skill.skills) {
                  return (
                    <div
                      key={i}
                      className="w-full mb-1 text-[11px] text-gray-700"
                    >
                      <span className="font-bold">{skill.category}: </span>
                      {Array.isArray(skill.skills)
                        ? skill.skills.join(", ")
                        : skill.skills}
                    </div>
                  );
                }

                if (skill.proficiency) {
                  return (
                    <div key={i} className="w-full sm:w-[48%] mb-2">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-[11px] font-medium text-gray-700">
                          {skill.name}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {skill.proficiency}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 ">
                        <div
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${skill.proficiency}%`,
                            backgroundColor: themeColor,
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                }

                return (
                  <span
                    key={i}
                    className="bg-gray-100 text-gray-700 text-[11px] px-2 py-1 rounded font-medium"
                  >
                    {skill.name}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* --- EXPERIENCE --- */}
        {data?.visibleSections?.experience !== false && (
          <section onClick={() => handleClick("experience")}>
            <SectionTitle title="Experience" />
            <div className="flex flex-col gap-6">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[14px] font-bold text-gray-900">
                      {exp.role}
                    </h3>
                    <span className="text-[12px] font-medium text-gray-500">
                      {exp.start ? formatDate(exp.start) : "Start"} –{" "}
                      {exp.current
                        ? "Present"
                        : exp.end
                        ? formatDate(exp.end)
                        : "End"}
                    </span>
                  </div>

                  <div
                    className="text-[12px] font-semibold mb-2"
                    style={{ color: themeColor }}
                  >
                    {exp.company} | {exp.location || "City, State"}
                  </div>

                  <div className="text-[12px] text-gray-700">
                    {exp.desc &&
                      (exp.descFormat === "bullet" ? (
                        <ul className="list-disc ml-4">
                          {exp.desc.split("\n").map((line, idx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            return (
                              <li key={idx} className="pl-1">
                                {trimmed.replace(/^[•\-\*]\s*/, "")}
                              </li>
                            );
                          })}
                        </ul>
                      ) : exp.descFormat === "number" ? (
                        <ol className="list-decimal ml-4">
                          {exp.desc.split("\n").map((line, idx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            return (
                              <li key={idx} className="pl-1">
                                {trimmed.replace(/^\d+\.\s*/, "")}
                              </li>
                            );
                          })}
                        </ol>
                      ) : (
                        <p className="whitespace-pre-line text-justify">
                          {exp.desc}
                        </p>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- PROJECTS --- */}
        {data?.visibleSections?.projects !== false && projects.length > 0 && (
          <section onClick={() => handleClick("projects")}>
            <SectionTitle title="Key Projects" />
            <div className="flex flex-col gap-4">
              {projects.map((proj, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[13px] font-bold text-gray-800">
                      {proj.name}
                    </h3>
                    <span className="text-[11px] text-gray-500">
                      {proj.year}
                    </span>
                  </div>
                  {proj.link && (
                    <a
                      href={proj.link}
                      className="text-[11px] underline block mb-1"
                      style={{ color: themeColor }}
                    >
                      {proj.link}
                    </a>
                  )}
                  <div className="text-[12px]">
                    {proj.desc &&
                      (proj.descFormat === "bullet" ? (
                        <ul className="list-disc ml-4">
                          {proj.desc.split("\n").map((line, idx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            return (
                              <li key={idx} className="pl-1 mb-0.5">
                                {trimmed.replace(/^[•\-\*]\s*/, "")}
                              </li>
                            );
                          })}
                        </ul>
                      ) : proj.descFormat === "number" ? (
                        <ol className="list-decimal ml-4">
                          {proj.desc.split("\n").map((line, idx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            return (
                              <li key={idx} className="pl-1 mb-0.5">
                                {trimmed.replace(/^\d+\.\s*/, "")}
                              </li>
                            );
                          })}
                        </ol>
                      ) : (
                        <p className="whitespace-pre-line text-justify leading-snug">
                          {proj.desc}
                        </p>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- EDUCATION --- */}
        {data?.visibleSections?.education !== false && (
          <section onClick={() => handleClick("education")}>
            <SectionTitle title="Education" />
            <div className="flex flex-col gap-4">
              {education.map((edu, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="text-[13px] font-bold text-gray-900">
                        {edu.school}
                      </h3>
                      <div className="text-[12px] text-gray-700 mt-0.5">
                        <span className="font-semibold">{edu.degree}</span>{" "}
                        {edu.field ? `in ${edu.field}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-gray-500 whitespace-nowrap">
                        {edu.start ? formatDate(edu.start) : ""}
                        {edu.start && (edu.end || edu.current) && " – "}
                        {edu.current
                          ? "Present"
                          : edu.end
                          ? formatDate(edu.end)
                          : ""}
                      </span>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {edu.location || ""}
                      </div>
                    </div>
                  </div>

                  {edu.description && (
                    <div className="text-[11px] mt-1 text-gray-600">
                      {edu.descFormat === "bullet" ? (
                        <ul className="list-disc ml-4">
                          {edu.description.split("\n").map((line, idx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            return (
                              <li key={idx} className="pl-1">
                                {trimmed.replace(/^[•\-\*]\s*/, "")}
                              </li>
                            );
                          })}
                        </ul>
                      ) : edu.descFormat === "number" ? (
                        <ol className="list-decimal ml-4">
                          {edu.description.split("\n").map((line, idx) => {
                            const trimmed = line.trim();
                            if (!trimmed) return null;
                            return (
                              <li key={idx} className="pl-1">
                                {trimmed.replace(/^\d+\.\s*/, "")}
                              </li>
                            );
                          })}
                        </ol>
                      ) : (
                        <p className="whitespace-pre-line text-justify">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- CERTIFICATIONS & AWARDS --- */}

        {/* --- LANGUAGES --- */}
        {data?.visibleSections?.languages !== false && languages.length > 0 && (
          <section onClick={() => handleClick("languages")}>
            <SectionTitle title="Languages" />
            <div className="grid grid-cols-2 gap-4">
              {languages.map((l, i) =>
                renderLanguage(l, i, {
                  container: "mb-1",
                  header: "flex justify-between items-center",
                  name: "text-[12px] font-bold text-gray-800",
                  level: "text-[11px] text-gray-500",
                  percentage: "text-[11px] text-gray-500",
                  barContainer: "w-full bg-gray-200 rounded-full h-1.5 mt-1",
                  bar: "bg-gray-800 h-1.5 rounded-full transition-all",
                })
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
