'use client';
import React from "react";

export default function Template30({ data, onClickSection }) {
  // Safety conversion
  const toArray = (value) => (!value ? [] : Array.isArray(value) ? value : [value]);

  const experiences = toArray(data?.experiences);
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
          <p className="text-sm">📞 {data?.phone || "123-456-7890"}</p>
          <p className="text-sm">📧 {data?.email || "hello@email.com"}</p>
          <p className="text-sm">📍 {data?.address || "123 Anywhere St., Any City"}</p>
        </div>

        {/* Expertise/Skills */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-2">Expertise</h2>
          {(data?.skills || ["Management Skills", "Creativity", "Digital Marketing", "Negotiation", "Critical Thinking", "Leadership"]).map((s, i) => (
            <p key={i} className="text-sm mb-1">• {s}</p>
          ))}
        </div>

        {/* Languages */}
        <div className="mb-4">
          <h2 className="font-semibold text-lg mb-2">Language</h2>
          {(languages.length ? languages : ["Spanish", "Arabic", "English"]).map((l, i) => (
            <p key={i} className="text-sm mb-1">{l}</p>
          ))}
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

        {/* Experience */}
        <h2 className="text-xl font-semibold mb-3 border-b pb-1 cursor-pointer" onClick={() => onClickSection && onClickSection("experience")}>
          Experience
        </h2>
        {(experiences.length ? experiences : [
          { role: "Product Design Manager", company: "Arowwai Industries", year: "2020-2023", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          { role: "Product Design Manager", company: "Ingoude Company", year: "2019-2020", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
          { role: "Product Design Manager", company: "Timmerman Industries", year: "2017-2019", desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." }
        ]).map((exp, i) => (
          <div key={i} className="mb-4">
            <p className="font-semibold">{exp.role}</p>
            <p className="text-sm opacity-80">{exp.company}</p>
            <p className="text-xs opacity-60">{exp.year}</p>
            <p className="text-sm mt-1">{exp.desc}</p>
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
            <p className="font-semibold">{edu.course}</p>
            <p className="text-sm opacity-80">{edu.school}</p>
            <p className="text-xs opacity-60">{edu.year}</p>
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
