'use client';
import React from 'react';

// Template37.jsx
// Unique, modern single-page resume template (JSX + Tailwind)
// - A4 aware container (w-[794px] min-h-[1123px])
// - Left vertical accent rail with monogram and quick stats
// - Right main area with bold header, compact timeline experience, project cards, and tool chips
// - Uses defensive data handling and onClickSection hooks

export default function Template37({ data = {}, onClickSection }) {
  const safeArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

  const experiences = safeArray(data.experiences);
  const education = safeArray(data.education);
  const projects = safeArray(data.projects);
  const skills = safeArray(data.skills);
  const tools = (data.tools && data.tools.categories) || [];
  const languages = safeArray(data.languages);
  const certificates = safeArray(data.certificates);
  const references = safeArray(data.references);

  const initials = (name = '') => (name || 'JD').split(' ').map(s => s[0]).join('').slice(0,3).toUpperCase();

  return (
    <div className="w-[794px] min-h-[1123px] bg-white mx-auto shadow-lg border font-sans text-gray-800">

      <div className="flex">
        {/* LEFT RAIL */}
        <aside className="w-52 bg-gradient-to-b from-indigo-600 to-cyan-500 text-white p-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-white/20 flex items-center justify-center text-2xl font-bold">{initials(data.name)}</div>
            <div>
              <div className="text-sm font-semibold">{data.name || 'John Doe'}</div>
              <div className="text-xs opacity-90">{data.title || 'Full Stack Developer'}</div>
            </div>
          </div>

          <div className="text-sm">
            <div className="uppercase text-xs opacity-80 mb-1">Contact</div>
            <div className="text-xs">📞 {data.phone || '-'}</div>
            <div className="text-xs">✉️ {data.email || '-'}</div>
            {data.address && <div className="text-xs">📍 {data.address}</div>}
            {data.website && <div className="text-xs">🔗 {data.website}</div>}
          </div>

          <div>
            <div className="uppercase text-xs opacity-80 mb-2">Skills</div>
            <div className="flex flex-wrap gap-2">
              {skills.slice(0,8).map((s, i) => (
                <span key={i} className="text-xs bg-white/20 px-2 py-1 rounded">{typeof s === 'string' ? s : s.name}</span>
              ))}
            </div>
          </div>

          <div>
            <div className="uppercase text-xs opacity-80 mb-2">Languages</div>
            <div className="text-xs space-y-1">{languages.length ? languages.map((l,i)=>(<div key={i}>{l}</div>)) : <div>-</div>}</div>
          </div>

          <div className="mt-auto text-xs opacity-80">
            <div className="uppercase text-xs mb-1">Certificates</div>
            <div className="space-y-1">
              {certificates.slice(0,3).map((c,i)=> (
                <div key={i}>{typeof c === 'string' ? c : c.title}</div>
              ))}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">{data.name || 'John Doe'}</h1>
              <p className="text-sm text-gray-600 mt-1">{data.title || 'Full Stack Developer'}</p>
              {data.summary && <p className="mt-3 text-sm text-gray-700 max-w-3xl">{data.summary}</p>}
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-2 bg-gradient-to-r from-indigo-100 to-cyan-50 rounded text-sm font-semibold">{data.totalExperienceYears ? `${data.totalExperienceYears}+ yrs` : `${experiences.length} roles`}</div>
              <div className="mt-3 text-xs text-gray-500">Projects: {projects.length}</div>
            </div>
          </div>

          {/* Experience timeline */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" onClick={() => onClickSection && onClickSection('experience')}>Experience</h2>
              <div className="text-sm text-gray-400">{experiences.length} {experiences.length === 1 ? 'role' : 'roles'}</div>
            </div>

            <div className="mt-4 relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-200" />
              <div className="pl-12">
                {experiences.length ? experiences.map((exp, i) => (
                  <div key={i} className="mb-6 relative">
                    <div className="absolute -left-8 top-1 w-3 h-3 rounded-full bg-indigo-600 border-2 border-white" />
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{exp.role} <span className="text-sm text-gray-500">@ {exp.company}</span></div>
                        <div className="text-xs text-gray-400">{exp.year || `${exp.start || ''} - ${exp.end || ''}`}</div>
                        {exp.desc && <div className="text-sm text-gray-700 mt-2">{exp.desc}</div>}
                        {exp.metrics && exp.metrics.length > 0 && (
                          <ul className="list-disc ml-4 text-sm text-gray-600 mt-2">
                            {exp.metrics.map((m,mi)=>(<li key={mi}>{m}</li>))}
                          </ul>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">&nbsp;</div>
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-gray-500">No experience added.</div>
                )}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold" onClick={() => onClickSection && onClickSection('projects')}>Selected Projects</h2>
              <div className="text-sm text-gray-400">{projects.length}</div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {projects.length ? projects.map((p,i) => (
                <div key={i} className="p-4 border rounded shadow-sm hover:shadow-md transition">
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.role}</div>
                  <div className="text-sm text-gray-700 mt-2">{p.desc}</div>
                  {p.tech && p.tech.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tech.map((t,ti)=>(<span key={ti} className="text-xs px-2 py-1 bg-gray-100 rounded">{t}</span>))}
                    </div>
                  )}
                  {p.link && <div className="mt-2 text-xs text-cyan-600">{p.link}</div>}
                </div>
              )) : (
                <div className="text-sm text-gray-500 col-span-2">No projects added.</div>
              )}
            </div>
          </section>

          {/* Tools & Certificates */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold">Tools & Technologies</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {tools.length ? tools.flatMap(c=>c.items.map((it,idx)=>({it,cat:c.name+'-'+idx}))).map((t,i)=> (
                  <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded">{t.it}</span>
                )) : <div className="text-sm text-gray-500">No tools added.</div>}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">Awards & Certificates</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-700">
                {certificates.length ? certificates.map((c,i)=>(<div key={i} className="p-2 border rounded bg-gray-50">{typeof c==='string'?c:c.title}</div>)) : <div className="text-gray-500">No certificates.</div>}
              </div>
            </div>
          </div>

          {/* Education + References */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold">Education</h3>
              <div className="mt-3 text-sm text-gray-700 space-y-3">
                {education.length ? education.map((e,i)=>(
                  <div key={i} className="">
                    <div className="font-semibold">{e.course}</div>
                    <div className="text-xs text-gray-500">{e.school} • {e.year}</div>
                  </div>
                )) : <div className="text-gray-500">No education added.</div>}
              </div>
            </div>

            <div>
              <h3 className="font-semibold">References</h3>
              <div className="mt-3 text-sm text-gray-700 space-y-3">
                {data.showReferences ? (references.length ? references.map((r,i)=>(
                  <div key={i} className="p-2 border rounded bg-gray-50">
                    <div className="font-semibold">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.title}</div>
                    <div className="text-xs">{r.phone}</div>
                    <div className="text-xs">{r.email}</div>
                  </div>
                )) : <div className="text-gray-500">No references added.</div>) : (<div className="text-sm text-gray-500">References hidden.</div>)}
              </div>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}