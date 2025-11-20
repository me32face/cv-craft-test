"use client";

import React from "react";

const renderLanguage = (lang, index) => {
  if (typeof lang === 'string') {
    return <p key={index} className="text-gray-700 text-xs mb-1">• {lang}</p>;
  }
  return (
    <div key={index} className="mb-2">
      <div className="flex justify-between items-center text-gray-700 text-xs">
        <span>{lang.name}</span>
        <span className="opacity-70">({lang.proficiency || 'Fluent'})</span>
      </div>
    </div>
  );
};

export default function Template41({ data, onClickSection }) {
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const experiences = toArray(data?.experiences);
  const education = toArray(data?.education);
  const skills = toArray(data?.skills);
  const languages = toArray(data?.languages);
  const certificates = toArray(data?.certificates);
  const projects = toArray(data?.projects);

  return (
    <div
      id="cv-preview"
      className="w-[794px] min-h-[1123px] bg-gray-50 mx-auto font-sans"
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
              <div className="mb-5">
                <p className="text-xs mt-2">📞 {data?.phone || "123-456-7890"}</p>
                <p className="text-xs mt-2">📧 {data?.email || "hello@email.com"}</p>
                <p className="text-xs mt-2  ">📍 {data?.address || "123 Anywhere St., Any City"}</p>
                {data?.linkedin && (<p className="text-xs mt-2">🔗 {data?.linkedin}</p>)}
                {data?.github && (<p className="text-xs mt-2">🧑‍💻 {data?.github || ""}</p>)}
                {data?.portfolio && (<p className="text-xs mt-2">💻 {data?.portfolio || ""}</p>)}
              </div>
            </section>
            {/* Skills */}
            {data?.visibleSections?.skills !== false && (
              <div className="mb-4 mt-8" onClick={() => onClickSection && onClickSection("skills")}>

                <div className="flex items-start gap-3 mb-2">
                  <div className="w-1 h-5 bg-gray-600"></div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase">SKILLS</h2>
                </div>

                {/* ADDED ml-4 HERE */}
                <div className="ml-4">
                  {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation", "Critical Thinking", "Leadership"]).map((s, i) => {

                    if (typeof s === 'string') {
                      return <p key={i} className="text-xs mb-1">• {s}</p>;
                    }
                    if (s.proficiency !== undefined) {
                      return (
                        <div key={i} className="mb-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">{s.name}</span>
                            <span className="text-xs opacity-70">{s.proficiency}%</span>
                          </div>

                          <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                            <div
                              className="bg-black h-1 rounded-full transition-all"
                              style={{ width: `${s.proficiency}%` }}
                            >
                            </div>
                          </div>
                        </div>
                      );
                    }
                    if (s.category && s.items) {
                      return (
                        <p key={i} className="text-sm mb-1">
                          <span className="font-medium">{s.category}:</span> {s.items.filter(item => item && item.trim()).join(", ")}
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
              <section className="cursor-pointer" onClick={() => onClickSection("education")}>
                <div className="flex items-start gap-3 mb-2">
                  <div className="w-1 h-5 bg-gray-800"></div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase">Education</h2>
                </div>
                <div className="ml-4 grid grid-cols-1 gap-2">
                  {(education.length ? education : [
                    {
                      course: "City College",
                      school: "Bachelor of Education in Secondary Education",
                      year: "2020-2024",
                      details: ["GPA: 3.5", "Member, Theater Club", "Volunteer, English Tutor"]
                    },
                    {
                      course: "City High School",
                      school: "High School Diploma",
                      year: "2016-2020",
                      details: ["Student Teacher", "Essay Competition Winner", "Member, Debate Team"]
                    }
                  ]).map((edu, i) => (
                    <div key={i}>
                      <p className="text-sm font-semibold text-gray-700">{edu.course} | {edu.year}</p>
                      <p className="text-xs text-gray-600 mb-1">{edu.school}</p>
                      {edu.details && (
                        <ul className="space-y-0.5">
                          {edu.details.map((d, idx) => (
                            <li key={idx} className="text-xs text-gray-700 flex items-start gap-1">
                              <span>•</span>
                              <span>{d}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
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
                      <p className="text-sm font-semibold text-gray-600">{exp.role}</p>
                      <p className="text-xs text-gray-600 italic mb-1">{exp.company} | {exp.year}</p>

                      {exp.desc && (
                        <ul className="space-y-0.5">
                          {exp.desc.split('\n').map((line, idx) =>
                            line.trim() && (
                              <li key={idx} className="text-xs text-gray-700 flex items-start gap-2">
                                <span>•</span>
                                <span>{line.trim()}</span>
                              </li>
                            )
                          )}
                        </ul>
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