"use client";
import React from "react";
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';
import { Phone, Mail, MapPin } from "lucide-react";
import SocialLinkDisplay from "../SocialLinkDisplay";
export default function Template40({ data, onClickSection }) {
 
  const defaultData = {
    name: "SARAH WILLIAMS",
    title: "Graphic Designer | Visual Creative",
    phone: "+1 234 567 8900",
    email: "sarah@email.com",
    address: "Los Angeles, CA",
    profileImage: "/templateprofile/template22profile.jpg",
    imageShape: "circle",

    summary: [
      "Creative and detail-oriented Graphic Designer with 5+ years of experience",
      "in brand identity, digital design, and visual storytelling.",
      "Skilled in Adobe Suite and modern design tools."
    ],

    skills: [
      { name: "Adobe Photoshop", proficiency: 90 },
      { name: "Illustrator", proficiency: 85 },
      { name: "UI/UX Design", proficiency: 80 },
      { name: "Brand Identity", proficiency: 75 },
      { name: "Figma", proficiency: 85 }
    ],

    languages: ["English", "Spanish"],

    certificates: [
      "Adobe Certified Expert (ACE)",
      "UI/UX Specialization – Coursera"
    ],

   
    experiences: [
      {
        role: "Senior Graphic Designer",
        company: "Creative Minds Studio",
        year: "2021 - Present",
        desc: "Led design projects.\nCreated brand identities.\nManaged digital campaigns."
      },
      {
        role: "Graphic Designer",
        company: "PixelWave Agency",
        year: "2018 - 2021",
        desc: "Worked on UI/UX.\nDesigned marketing creatives.\nCollaborated with design teams."
      }
    ],

    education: [
      {
        degree: "Bachelor of Fine Arts (BFA)",
        school: "Stanford School of Design",
        start: "2015",
        end: "2018",
        field: "Visual Arts",
        description: "Specialized in branding and illustration."
      }
    ],

    projects: [
      {
        name: "Brand Identity System – NovaTech",
        year: "2023",
        link: "https://behance.net/sampleproject",
        desc: "Developed the full visual branding including logo, color palette, and UI kit."
      },
      {
        name: "UI Redesign – Foodly App",
        year: "2022",
        desc: "Created a clean and modern UI improving user engagement by 40%."
      }
    ],

    socialLinks: [
      "https://linkedin.com/in/sarahwilliams",
      "https://behance.net/sarahdesigns",
      "https://dribbble.com/sarahcreates"
    ]
  };

  /** MERGE DEFAULTS + USER DATA */
  const finalData = { ...defaultData, ...data };
  const visible = finalData.visibleSections || {};

  /** Utility functions */
  const safeText = (item) => {
    if (!item) return "";
    if (typeof item === "string" || typeof item === "number") return item;
    if (typeof item === "object")
      return (
        item.name ||
        item.title ||
        item.course ||
        item.role ||
        item.company ||
        item.school ||
        item.experience ||
        JSON.stringify(item)
      );
    return String(item);
  };

  const safeObj = (item) =>
    typeof item === "object" && item !== null ? item : {};

  const toArray = (v) =>
    !v ? [] : Array.isArray(v) ? v : typeof v === "string" ? [v] : [];

  /** Build clean arrays */
  const skills = toArray(finalData.skills);
  const experiences = toArray(finalData.experiences);
  const education = toArray(finalData.education);
  const certificates = toArray(finalData.certificates);
  const languages = toArray(finalData.languages);
  const projects = toArray(finalData.projects);
  const socialLinks = toArray(finalData.socialLinks);
  const references = toArray(finalData.references);
  const awards = toArray(finalData.awards);
  const Certificates = toArray(finalData.certificates);

  const getSummaryText = () => {
    if (!finalData.summary) return "";
    if (Array.isArray(finalData.summary))
      return finalData.summary.map((item) => safeText(item)).join(" ");
    return safeText(finalData.summary);
  };

  /** ---------------------------
   *  TEMPLATE UI
   ----------------------------*/
  return (
    <div
      id="pdf-template"
      className="w-[794px] min-h-[1123px] mx-auto bg-white shadow-2xl font-sans"
    >
      {/* HEADER */}
     <div className="bg-gray-900 text-white px-8 py-4 border-b border-gray-700 flex justify-between items-center">
        <div className="flex-1">
          <h1
            className="text-4xl font-bold tracking-tight cursor-pointer mb-1"
            onClick={() => onClickSection("personal")}
          >
            {finalData.name}
          </h1>

          <p
            className="text-xl text-indigo-100 font-light tracking-wide cursor-pointer"
            onClick={() => onClickSection("personal")}
          >
            {finalData.title}
          </p>
        </div>

        {/* Profile Image */}
       <div 
  onClick={() => onClickSection("image")}
  className="flex items-center justify-center"
>
  <div
    className={`overflow-hidden border border-gray-300 cursor-pointer`}
    style={{
      width: finalData.imageSize || "110px",
      height: finalData.imageSize || "110px",
      borderRadius:
        finalData.imageShape === "circle"
          ? "50%"
          : finalData.imageShape === "rounded"
          ? "14px"
          : "0",
      objectFit: "cover",
    }}
  >
    <img
      src={finalData.profileImage}
      className="object-cover w-full h-full"
    />
  </div>
</div>

      </div>

      {/* FLEX LAYOUT */}
      <div className="flex">
        {/* LEFT SIDEBAR */}
       <div className="cv-sidebar w-1/3 bg-gray-50 px-6 py-6 min-h-[1123px] border-r border-gray-300">
          {/* CONTACT */}
          <section
            className="mb-6 cursor-pointer cv-item"
            onClick={() => onClickSection("personal")}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
              Contact
            </h3>

            <div className="space-y-2 text-sm text-gray-700">
                   {data.phone && (
               <p className="flex items-center gap-1">
                 <Phone size={14} /> {data.phone}
               </p>
             )}
             {data.email && (
               <p className="flex items-center gap-1">
                 <Mail size={14} /> {data.email}
               </p>
             )}
             {data.address && (
               <p className="flex items-center gap-1">
                 <MapPin size={14} /> {data.address}
               </p>
             )}

              {socialLinks.length > 0 && (
                <div
                  className="mt-3 cursor-pointer"
                  onClick={() => onClickSection("socialLinks")}
                >
                  <h4 className="text-sm font-semibold">Social Links</h4>
                  <div className="space-y-1 text-sm">
                   {socialLinks.map((link, i) => (
  <SocialLinkDisplay key={i} link={link} />
))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* SKILLS */}
          <section
            className="mb-6 cursor-pointer"
            onClick={() => onClickSection("skills")}
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
              Skills
            </h3>

            <div className="space-y-3">
              {skills.map((s, i) => {
                const skillObj = safeObj(s);

                if (skillObj.category && Array.isArray(skillObj.skills)) {
    return (
      <div key={i} className="cv-item text-sm">
        <p className="font-semibold text-indigo-700">{skillObj.category}</p>
        <ul className="ml-4 list-disc text-gray-700">
          {skillObj.skills.map((sk, idx) => (
            <li key={idx}>{sk}</li>
          ))}
        </ul>
      </div>
    );
  }


                return (
                  <div key={i} className="cv-item text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">
                        {safeText(skillObj.name || s)}
                      </span>
                      <span className="text-xs text-gray-600">
                        {skillObj.proficiency || 80}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div
                        className="h-2 rounded-full bg-gray-700"
                        style={{ width: `${skillObj.proficiency || 80}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* LANGUAGES */}
         <section
  className="mb-6 cursor-pointer"
  onClick={() => onClickSection("languages")}
>
  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
    Languages
  </h3>

  <div className="space-y-2 text-sm">
    {languages.map((l, i) =>
      renderLanguage(l, i, {
        container: "mb-2",
        name: "text-sm text-gray-800 font-medium",
        level: "text-xs text-gray-500",
        percentage: "text-xs text-gray-500",
        barContainer: "bg-gray-200 rounded-full h-1 mt-2",
        bar: "bg-indigo-600 h-1 rounded-full"
      })
    )}
  </div>
</section>

          {/* CERTIFICATIONS */}
         {visible.certificates !== false && certificates.length > 0 && (
  <section
    className="mb-6 cursor-pointer"
    onClick={() => onClickSection("certificates")}
  >
    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
      Certifications
    </h3>

    <ul className="space-y-2 text-sm">
      {certificates.map((c, i) => (
        <li key={i} className="cv-item flex items-start gap-2">
          <span className="text-indigo-600 mt-1">•</span>
         <span>
  {c.name || ""}
  {c.issuer ? ` — ${c.issuer}` : ""}
  {c.year ? ` (${c.year})` : ""}
</span>
        </li>
      ))}
    </ul>
  </section>
)}

    

    {/* AWARDS */}
{visible.awards !== false && awards.length > 0 && (
  <section
    className="mb-6 cursor-pointer"
    onClick={() => onClickSection("awards")}
  >
    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
      Awards
    </h3>

    <div className="space-y-2 text-sm">
      {awards.map((a, i) => {
        const award = safeObj(a);
        return (
          <div key={i} className="cv-item">
            <p className="font-semibold">{safeText(award.title)}</p>
            <p className="text-xs text-gray-600">
              {safeText(award.issuer)} {award.date && `• ${award.date}`}
            </p>
            {award.description && (
              <p className="text-xs text-gray-600 mt-1">
                {safeText(award.description)}
              </p>
            )}
          </div>
        );
      })}
    </div>
  </section>
)}


{/* REFERENCES */}
{visible.references !== false && references.length > 0 && (
  <section
    className="mb-6 cursor-pointer"
    onClick={() => onClickSection("references")}
  >
    <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 pb-2 border-b-2 border-indigo-200">
      References
    </h3>

    <div className="space-y-3 text-sm">
      {references.map((ref, i) => {
        const r = safeObj(ref);
        return (
          <div key={i} className="cv-item">
            <p className="font-semibold">{safeText(r.name)}</p>
            <p className="text-xs text-gray-600">
              {safeText(r.title)} — {safeText(r.company)}
            </p>
            {r.phone && <p className="text-xs text-gray-600">{r.phone}</p>}
            {r.email && (
              <p className="text-xs text-gray-600 break-all">{r.email}</p>
            )}
          </div>
        );
      })}
    </div>
  </section>
)}

        
        
        </div>

        {/* RIGHT SIDE */}
        <div className="w-2/3 px-8 py-6">
          {/* ABOUT */}
          <section
            className="mb-6 cursor-pointer cv-item"
            onClick={() => onClickSection("summary")}
          >
            <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 mb-3 pb-2 border-b-2 border-indigo-600">
              About Me
            </h3>
            <p className="text-sm leading-relaxed">{getSummaryText()}</p>
          </section>

          {/* EXPERIENCE */}
          <section
            className="mb-6 cursor-pointer"
            onClick={() => onClickSection("experience")}
          >
            <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 mb-3 pb-2 border-b-2 border-indigo-600">
              Work Experience
            </h3>

            <div className="space-y-4">
              {experiences.map((exp, i) => {
                const e = safeObj(exp);
                const lines = e.desc ? e.desc.split("\n") : [];
                return (
                  <div key={i} className="text-sm cv-item">
                    <div className="flex justify-between mb-1">
                      <p className="font-bold">{safeText(e.role)}</p>
                      <span className="text-xs text-gray-500">
                        {safeText(e.year)}
                      </span>
                    </div>
                    <p className="italic text-gray-600">
                      {safeText(e.company)}
                    </p>

                    {e.desc && (
                      <ul className="mt-2 ml-4 list-disc space-y-1">
                        {lines.map(
                          (line, idx) => line && <li key={idx}>{line}</li>
                        )}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* EDUCATION */}
          <section
            className="mb-6 cursor-pointer"
            onClick={() => onClickSection("education")}
          >
            <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 mb-3 pb-2 border-b-2 border-indigo-600">
              Education
            </h3>

            <div className="space-y-3">
              {education.map((ed, i) => {
                const currentLabel = ed.current ? "Present" : ed.end;
                return (
                  <div key={i} className="text-sm cv-item">
                    <p className="font-bold">
                      {safeText(ed.degree) || safeText(ed.course)}
                    </p>

                    <p className="text-xs text-gray-600">
                      {safeText(ed.school)}
                    </p>

                    <p className="text-xs text-gray-500">
                      {ed.start} – {currentLabel}
                    </p>

                    {ed.field && (
                      <p className="text-xs text-gray-700">
                        Field: {safeText(ed.field)}
                      </p>
                    )}

                    {ed.description && (
                      <p className="text-xs text-gray-600 mt-1">
                        {safeText(ed.description)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* PROJECTS */}
          <section
            className="cursor-pointer"
            onClick={() => onClickSection("projects")}
          >
            <h3 className="text-lg font-bold uppercase tracking-wide text-gray-800 mb-3 pb-2 border-b-2 border-indigo-600">
              Projects
            </h3>

            <div className="space-y-4">
              {projects.map((p, i) => (
                <div key={i} className="text-sm cv-item">
                  <div className="flex justify-between mb-1">
                    <p className="font-bold">{safeText(p.name)}</p>
                    <span className="text-xs text-gray-500">
                      {safeText(p.year)}
                    </span>
                  </div>

                               <a
    href={p.link}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-blue-600 underline project-link"
  >
   {p.useCustomLabel && p.linkLabel ? p.linkLabel : p.link}
  </a>
                  {p.desc && (
                    <p className="mt-2 text-gray-700">{safeText(p.desc)}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}