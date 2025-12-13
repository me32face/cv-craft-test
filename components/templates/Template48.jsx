"use client";
import React from "react";
import SocialLinkDisplay from "../SocialLinkDisplay";

/* ================= DEFAULT TEMPLATE DATA ================= */
const defaultData = {
  name: "Mac Mercer",
  title: "Software Engineer",

  phone: "+91 98765 43210",
  email: "mac.mercer@email.com",
  address: "Bangalore, India",
  dob: "12-06-1998",
  maritalStatus: "Single",

  summary:
    "Detail-oriented Software Engineer with experience in building scalable web applications, APIs, and modern user interfaces.",

  skills: [
    "JavaScript",
    "React.js",
    "Node.js",
    "MongoDB",
    "HTML & CSS",
  ],

  languages: [
    { name: "English", level: "Fluent" },
    { name: "Hindi", level: "Professional" },
  ],

  certificates: [
    { name: "MERN Stack Certification", issuer: "Aviv Digital" },
    { name: "AWS Cloud Practitioner", issuer: "Amazon" },
  ],

  experiences: [
    {
      role: "Software Engineer",
      company: "TechNova Solutions",
      start: "2022",
      end: "2024",
      desc:
        "• Developed MERN stack applications\n• Integrated REST APIs\n• Improved application performance",
    },
  ],

  projects: [
    {
      name: "CV Craft – Resume Builder",
      tech: "React, Tailwind, Node.js",
      desc:
        "• Designed multiple ATS-friendly templates\n• Implemented PDF export\n• Responsive UI",
    },
  ],

  education: [
    {
      degree: "B.Sc Computer Science",
      school: "SHPM College",
      start: "2019",
      end: "2022",
      description: "Specialized in software development and databases",
    },
  ],

  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/macmercer" },
    { platform: "GitHub", url: "https://github.com/macmercer" },
  ],

  awards: [
    {
      title: "Best Project Award",
      issuer: "SHPM College",
      date: "2022",
      description: "Awarded for innovative final year project",
    },
  ],

  references: [
    {
      name: "John Mathew",
      title: "Tech Lead",
      company: "TechNova Solutions",
      phone: "+91 99887 66554",
      email: "john@technova.com",
    },
  ],

  visibleSections: {},
};

/* ================= TEMPLATE ================= */
export default function Template48({ data }) {
const mergedData = {
  ...defaultData,
  ...data,

  experiences:
    data?.experiences?.length > 0
      ? data.experiences
      : defaultData.experiences,

  projects:
    data?.projects?.length > 0
      ? data.projects
      : defaultData.projects,

  education:
    data?.education?.length > 0
      ? data.education
      : defaultData.education,

  skills:
    data?.skills?.length > 0
      ? data.skills
      : defaultData.skills,

  languages:
    data?.languages?.length > 0
      ? data.languages
      : defaultData.languages,

  certificates:
    data?.certificates?.length > 0
      ? data.certificates
      : defaultData.certificates,

  awards:
    data?.awards?.length > 0
      ? data.awards
      : defaultData.awards,

  references:
    data?.references?.length > 0
      ? data.references
      : defaultData.references,

  socialLinks:
    data?.socialLinks?.length > 0
      ? data.socialLinks
      : defaultData.socialLinks,
};

  const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

  const experiences = toArray(mergedData.experiences);
  const education = toArray(mergedData.education);
  const projects = toArray(mergedData.projects);
  const certificates = toArray(mergedData.certificates);
  const languages = toArray(mergedData.languages);
  const skills = toArray(mergedData.skills);
  const socialLinks = toArray(mergedData.socialLinks);
  const awards = toArray(mergedData.awards);
  const references = toArray(mergedData.references);

  return (
    <div className="w-[794px] bg-white p-8 font-sans text-black leading-[1.55] text-[13px]">

      {/* ================= HEADER ================= */}
      <h1 className="text-3xl font-bold tracking-wide break-words">
        {mergedData.name}
      </h1>

      <p className="text-xl tracking-wide opacity-80">
        {mergedData.title}
      </p>

      <div className="text-sm mt-2 flex flex-wrap gap-x-6 gap-y-1">
        {mergedData.phone && <span><strong>Phone:</strong> {mergedData.phone}</span>}
        {mergedData.email && <span><strong>Email:</strong> {mergedData.email}</span>}
        {mergedData.address && <span><strong>Address:</strong> {mergedData.address}</span>}
      </div>


      <div className="mt-1 text-sm space-y-1">
        {mergedData.dob && <p><strong>DOB:</strong> {mergedData.dob}</p>}

        {mergedData.visibleSections?.maritalStatus !== false &&
          mergedData.maritalStatus && (
            <p><strong>Marital Status:</strong> {mergedData.maritalStatus}</p>
          )}
      </div>

    {mergedData?.visibleSections?.socialLinks !== false && (
  <>
    {socialLinks.length > 0 && (
      <div className="mt-2 space-y-1 text-sm leading-relaxed">
        {socialLinks.map((link, i) => (
          <SocialLinkDisplay key={i} link={link} />
        ))}
      </div>
    )}
  </>
)}
      <hr className="my-4 border-gray-300" />

      {/* ================= SUMMARY ================= */}
      {mergedData.visibleSections?.summary !== false &&
        mergedData.summary && (
          <section className="mb-5">
            <h2 className="bg-gray-200 px-2 py-1 font-bold uppercase tracking-widest">
              Summary
            </h2>
            <p className="mt-2">{mergedData.summary}</p>
          </section>
        )}

      {/* ================= TWO COLUMN ================= */}
      <div className="grid grid-cols-12 gap-6">

        {/* ---------- LEFT ---------- */}
        <div className="col-span-4 space-y-6">

          {/* Skills */}
          {mergedData.visibleSections?.skills !== false && skills.length > 0 && (
            <section>
              <h2 className="bg-gray-200 px-2 py-1 font-bold uppercase tracking-widest">
                Skills
              </h2>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {skills.map((s, i) => (
                  <li key={i}>{typeof s === "string" ? s : s.name}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Languages */}
          {mergedData.visibleSections?.languages !== false &&
            languages.length > 0 && (
              <section>
                <h2 className="bg-gray-200 px-2 py-1 font-bold uppercase tracking-widest">
                  Languages
                </h2>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {languages.map((l, i) => (
                    <li key={i}>
                      {l.name} {l.level && `(${l.level})`}
                    </li>
                  ))}
                </ul>
              </section>
            )}

          {/* Certifications */}
          {mergedData.visibleSections?.certificates !== false &&
            certificates.length > 0 && (
              <section>
                <h2 className="bg-gray-200 px-2 py-1 font-bold uppercase tracking-widest">
                  Certifications
                </h2>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {certificates.map((c, i) => (
                    <li key={i}>
                      {c.name} {c.issuer && `– ${c.issuer}`}
                    </li>
                  ))}
                </ul>
              </section>
            )}

          {/* Awards */}
          {mergedData.visibleSections?.awards !== false && awards.length > 0 && (
            <section>
              <h2 className="bg-gray-200 px-2 py-1 font-bold uppercase tracking-widest">
                Awards
              </h2>
              {awards.map((a, i) => (
                <div key={i} className="mt-2">
                  <p className="font-semibold">
                    {a.title} {a.date && `(${a.date})`}
                  </p>
                  {a.issuer && <p className="text-xs">{a.issuer}</p>}
                  {a.description && <p>{a.description}</p>}
                </div>
              ))}
            </section>
          )}

          {/* References */}
          {mergedData.visibleSections?.references !== false &&
            references.length > 0 && (
              <section>
                <h2 className="bg-gray-200 px-2 py-1 font-bold uppercase tracking-widest">
                  References
                </h2>
                {references.map((r, i) => (
                  <div key={i} className="mt-2">
                    <p className="font-semibold">{r.name}</p>
                    {r.title && <p>{r.title}</p>}
                    {r.company && <p>{r.company}</p>}
                    {r.phone && <p>{r.phone}</p>}
                    {r.email && <p>{r.email}</p>}
                  </div>
                ))}
              </section>
            )}
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className="col-span-8 space-y-6">

          {/* Experience */}
          {mergedData.visibleSections?.experiences !== false &&
            experiences.length > 0 && (
              <section>
                <h2 className="bg-gray-200 px-2 py-1 font-bold uppercase tracking-widest">
                  Experience
                </h2>
                {experiences.map((e, i) => (
                  <div key={i} className="mt-3">
                    <p className="font-semibold">{e.role}</p>
                    <div className="flex justify-between italic text-sm">
                      <span>{e.company}</span>
                      <span>{e.start} – {e.end}</span>
                    </div>
                    {e.desc &&
                      e.desc.split("\n").map((l, idx) => (
                        <p key={idx}>{l}</p>
                      ))}
                  </div>
                ))}
              </section>
            )}

          {/* Projects */}
          {mergedData.visibleSections?.projects !== false &&
            projects.length > 0 && (
              <section>
                <h2 className="bg-gray-200 px-2 py-1 font-bold uppercase tracking-widest">
                  Projects
                </h2>
                {projects.map((p, i) => (
                  <div key={i} className="mt-3">
                    <p className="font-semibold">{p.name}</p>
                    {p.tech && <p className="italic text-sm">{p.tech}</p>}
                    {p.desc &&
                      p.desc.split("\n").map((l, idx) => (
                        <p key={idx}>{l}</p>
                      ))}
                  </div>
                ))}
              </section>
            )}

          {/* Education */}
          {mergedData.visibleSections?.education !== false &&
            education.length > 0 && (
              <section>
                <h2 className="bg-gray-200 px-2 py-1 font-bold uppercase tracking-widest">
                  Education
                </h2>
                {education.map((edu, i) => (
                  <div key={i} className="mt-3">
                    <p className="font-semibold">{edu.degree}</p>
                    <div className="flex justify-between italic text-sm">
                      <span>{edu.school}</span>
                      <span>{edu.start} – {edu.end}</span>
                    </div>
                    {edu.description &&
                      edu.description.split("\n").map((l, idx) => (
                        <p key={idx}>{l}</p>
                      ))}
                  </div>
                ))}
              </section>
            )}
        </div>
      </div>
    </div>
  );
}
