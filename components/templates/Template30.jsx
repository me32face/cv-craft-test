'use client';
import React from "react";

export default function Template30({ data, onClickSection }) {
  // Safety conversion
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const experiences = toArray(data?.experiences);
  const summary = toArray(data?.summary);
  const education = toArray(data?.education);
  const certificates = toArray(data?.certificates);
  const languages = toArray(data?.languages);
  const awards = toArray(data?.awards);
  const references = toArray(data?.references);

  return (
    <div id="cv-preview" className="w-[794px] min-h-[1123px] bg-white mx-auto shadow-lg border flex font-sans">

      {/* LEFT SIDEBAR */}
      <div className="w-1/3 bg-[#2C3E50] text-white p-6 flex flex-col">
        {/* Profile Image */}
        {data?.profileImage && (
          <div
            className={`overflow-hidden mb-6 ${data.imageShape === "circle" ? "rounded-full" : data.imageShape === "rounded" ? "rounded-xl" : ""}`}
            style={{ width: 120, height: 120, margin: "0 auto" }}
          >
            <img src={data.profileImage} className="w-full h-full object-cover" alt="profile" />
          </div>
        )}

        <h1 className="text-xl font-bold text-center">{data?.name || "Isabel Mercado"}</h1>
        <p className="text-sm text-center opacity-80">{data?.title || "Marketing Manager"}</p>

        <div className="border-t border-white/40 my-4"></div>

        {/* Contact */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-2">Contact</h2>
          <p className="text-sm mt-1">📞 {data?.phone || "123-456-7890"}</p>
          <p className="text-sm mt-1">📧 {data?.email || "hello@email.com"}</p>
          <p className="text-sm mt-1">📍 {data?.address || "123 Anywhere St., Any City"}</p>
        </div>

        {/* Expertise/Skills */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-2 cursor-pointer" onClick={() => onClickSection && onClickSection("skills")}>Expertise</h2>
          {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation", "Critical Thinking", "Leadership"]).map((s, i) => {
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
                  <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all"
                      style={{ width: `${s.proficiency}%` }}
                    ></div>
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

        {/* Languages */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-2">Language</h2>
          {(data?.languages?.length ? data.languages : ["Spanish", "Arabic", "English"]).map((l, i) => {
            const langObj = typeof l === 'string' ? { name: l, displayFormat: "simple" } : l;
            const { name, displayFormat, proficiency, level } = langObj;
            
            return (
              <div key={i} className="mb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">{name}</span>
                  {displayFormat === "level" && level && <span className="text-xs opacity-70">{level}</span>}
                  {displayFormat === "percentage" && proficiency && <span className="text-xs opacity-70">{proficiency}%</span>}
                </div>
                {displayFormat === "percentage" && proficiency && (
                  <div className="w-full bg-white/20 rounded-full h-1 mt-1">
                    <div
                      className="bg-white h-1 rounded-full transition-all"
                      style={{ width: `${proficiency}%` }}
                    ></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Awards */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-2">Awards</h2>
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
        <h2 className="text-xl font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("summary")}>
         Summary
        </h2>
        <p className="text-sm mb-4">{data?.summary || "A dedicated professional with extensive experience in the field."}</p>

        {/* Experience */}
        <h2 className="text-xl font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
          Experience
        </h2>
        {(experiences.length ? experiences : [
          { role: "Product Design Manager", company: "Arowwai Industries", year: "2020-2023", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          { role: "Product Design Manager", company: "Ingoude Company", year: "2019-2020", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          { role: "Product Design Manager", company: "Timmerman Industries", year: "2017-2019", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
        ]).map((exp, i) => (
          <div key={i} className="mb-0">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{exp.role}</p>
                <p className="text-sm opacity-80">{exp.company}</p>
              </div>
              <p className="text-xs opacity-60">{exp.year}</p>
            </div>
            {exp.descFormat === "bullet" ? (
              <ul className="text-sm mt-1 ml-4">{exp.desc?.split('\n').map((line, idx) => line.trim() && <li key={idx} className="list-disc">{line}</li>)}</ul>
            ) : exp.descFormat === "number" ? (
              <ol className="text-sm mt-1 ml-4">{exp.desc?.split('\n').map((line, idx) => line.trim() && <li key={idx} className="list-decimal">{line}</li>)}</ol>
            ) : (
              <p className="text-sm mt-1">{exp.desc}</p>
            )}
          </div>
        ))}

        {/* Education */}
        <h2 className="text-xl font-semibold mt-6 mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("education")}>
          Education
        </h2>
        {(education.length ? education : [
          { course: "Bachelor of Business Management", school: "Wardiere University", year: "2020-2023" },
          { course: "Bachelor of Business Management", school: "Wardiere University", year: "2016-2020" },
          { course: "Bachelor of Business Management", school: "Wardiere University", year: "2012-2016" }
        ]).map((edu, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{edu.course}</p>
                <p className="text-sm opacity-80">{edu.school}</p>
              </div>
              <p className="text-xs opacity-60">{edu.year}</p>
            </div>
          </div>
        ))}

        {/* Certifications */}
        <h2 className="text-xl font-semibold mt-2 mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("certificates")}>
          Certifications
        </h2>
        {(data?.certificates || [
          { name: "Project Management Professional (PMP)", issuer: "PMI", year: "2023" },
          { name: "Digital Marketing Certification", issuer: "Google", year: "2022" }
        ]).map((cert, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{cert.name}</p>
                <p className="text-sm opacity-80">{cert.issuer}</p>
              </div>
              <p className="text-xs opacity-60">{cert.year}</p>
            </div>
          </div>
        ))}

        {/* References */}
        <h2 className="text-xl font-semibold mt-6 mb-3 border-b pb-1">References</h2>
        {(references.length ? references : [
          { name: "Harumi Kobayashi", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" },
          { name: "Bailey Dupont", title: "CEO", phone: "123-456-7890", email: "hello@reality.com" }
        ]).map((r, i) => (
          <div key={i} className="mb-3">
            <p className="font-semibold">{r.name}</p>
            <p className="text-sm">{r.title}</p>
            <p className="text-sm">Phone: {r.phone}</p>
            <p className="text-sm">Email: {r.email}</p>
          </div>
        ))}

      </div>
    </div>
  );
}
