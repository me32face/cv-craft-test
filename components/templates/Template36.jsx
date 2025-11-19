'use client';
import React from 'react';

/*
 Template-PHP-Alt.jsx
 A fresh, unique CV design for a senior PHP developer (now at Amazon).
 JavaScript (not TypeScript). Self-contained sample defaults if `data` is empty.
*/

export default function TemplatePHPAlt({ data = {}, onClickSection }) {
  // ---------------------
  // Helpers
  // ---------------------
  const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);
  const safe = (v, fallback = '') => (v == null ? fallback : String(v));
  const toText = (val) => {
    if (val == null) return '';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') return val.title || val.name || val.company || val.role || JSON.stringify(val);
    return '';
  };
  const parsePct = (raw) => {
    if (raw == null) return 0;
    if (typeof raw === 'number') return Math.max(0, Math.min(100, Math.round(raw)));
    if (typeof raw === 'string') {
      const n = parseInt(raw.replace(/[^\d-]/g, ''), 10);
      return Number.isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
    }
    if (typeof raw === 'object') {
      return parsePct(raw.proficiency ?? raw.level ?? raw.value ?? 0);
    }
    return 0;
  };
  const initials = (name = '') =>
    (name || 'PH')
      .split(' ')
      .map((p) => (p ? p[0] : ''))
      .join('')
      .slice(0, 3)
      .toUpperCase();

  // Formats period display (prefer year or start/end)
  const formatPeriod = (exp) => {
    if (!exp) return '';
    if (exp.year) return toText(exp.year);
    const s = exp.start ? toText(exp.start) : '';
    const e = exp.end ? toText(exp.end) : '';
    if (s && e) return `${s} — ${e}`;
    if (s && !e) return `${s} — Present`;
    if (!s && e) return e;
    return '';
  };

  // Description renderer (string with newlines | array | bullets)
  const renderDescription = (exp) => {
    if (!exp) return null;

    // bullets array has highest priority
    if (Array.isArray(exp.bullets) && exp.bullets.length) {
      return (
        <ul className="mt-2 ml-5 list-disc text-sm">
          {exp.bullets.map((b, idx) => {
            const t = toText(b).trim();
            if (!t) return null;
            return <li key={idx}>{t}</li>;
          })}
        </ul>
      );
    }

    // desc as array
    if (Array.isArray(exp.desc) && exp.desc.length) {
      if (exp.descFormat === 'number' || exp.descFormat === 'ordered') {
        return (
          <ol className="mt-2 ml-5 list-decimal text-sm">
            {exp.desc.map((d, idx) => {
              const t = toText(d).trim();
              if (!t) return null;
              return <li key={idx}>{t}</li>;
            })}
          </ol>
        );
      }

      if (exp.descFormat === 'bullet' || exp.descFormat === 'list') {
        return (
          <ul className="mt-2 ml-5 list-disc text-sm">
            {exp.desc.map((d, idx) => {
              const t = toText(d).trim();
              if (!t) return null;
              return <li key={idx}>{t}</li>;
            })}
          </ul>
        );
      }

      return (
        <div className="mt-2 text-sm">
          {exp.desc.map((d, idx) => {
            const t = toText(d).trim();
            if (!t) return null;
            return <p key={idx} className="mb-1">{t}</p>;
          })}
        </div>
      );
    }

    // desc as string: split on new lines
    if (typeof exp.desc === 'string' && exp.desc.trim()) {
      const lines = exp.desc.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

      if (exp.descFormat === 'number' || exp.descFormat === 'ordered') {
        return (
          <ol className="mt-2 ml-5 list-decimal text-sm">
            {lines.map((line, idx) => <li key={idx}>{line}</li>)}
          </ol>
        );
      }
      if (exp.descFormat === 'bullet' || exp.descFormat === 'list') {
        return (
          <ul className="mt-2 ml-5 list-disc text-sm">
            {lines.map((line, idx) => <li key={idx}>{line}</li>)}
          </ul>
        );
      }
      return (
        <div className="mt-2 text-sm">
          {lines.map((line, idx) => <p key={idx} className="mb-1">{line}</p>)}
        </div>
      );
    }

    return null;
  };

  // ---------------------
  // Data canonicalization & defaults (PHP developer at Amazon sample)
  // ---------------------
  const experiences = toArray(data.experiences ?? [
    {
      role: 'Senior PHP Developer',
      company: 'Amazon (AWS Retail Systems)',
      start: 'Aug 2021',
      end: 'Present',
      descFormat: 'bullet',
      bullets: [
        'Lead backend services for high-throughput order-processing microservices handling 50k+ TPS during peak.',
        'Designed and migrated legacy monolith to modular PHP + Lumen microservices; reduced latency by 40%.',
        'Implemented CI/CD pipelines (GitHub Actions) with zero-downtime deployments across 8 regions.',
      ],
    },
    {
      role: 'PHP Team Lead',
      company: 'TechNova Solutions',
      start: '2017',
      end: '2021',
      desc: 'Managed a team of 6 PHP engineers.\nDelivered 12+ client projects including e-commerce, logistics and payment integrations.',
      descFormat: 'bullet',
    },
    {
      role: 'PHP / Fullstack Developer',
      company: 'WebCraft Studios',
      start: '2013',
      end: '2017',
      descFormat: 'number',
      desc: [
        'Built custom CMS and integrations in Laravel and Symfony.',
        'Optimised database queries and created caching layers; improved page load by 60%.',
      ],
    },
  ]);

  const education = toArray(data.education ?? [
    { degree: 'B.Sc. Computer Science', school: 'University of Chennai', year: '2013' },
  ]);

  const certificates = toArray(data.certificates ?? [
    { name: 'AWS Certified Developer – Associate', issuer: 'Amazon', year: '2022' },
    { name: 'Zend Certified PHP Engineer', issuer: 'Zend', year: '2016' },
  ]);

  const skills = toArray(data.skills ?? [
    { name: 'PHP', proficiency: 95 },
    { name: 'Laravel', proficiency: 90 },
    { name: 'Symfony', proficiency: 80 },
    { name: 'MySQL', proficiency: 88 },
    { name: 'Redis', proficiency: 75 },
    { name: 'Docker', proficiency: 80 },
    { name: 'AWS (EC2, RDS, SQS)', proficiency: 85 },
    'Unit Testing',
    'REST APIs',
  ]);

  const languages = toArray(data.languages ?? [
    { name: 'English', level: 'Native', displayFormat: 'level' },
    { name: 'Tamil', level: 'Native', displayFormat: 'level' },
  ]);

  const projects = toArray(data.projects ?? [
    {
      title: 'Global Order Service',
      role: 'Lead Backend Engineer',
      desc: 'High-availability order processing system for retail platform. Implemented event-driven architecture with SQS and Lambda adapters for asynchronous workflows.',
      tech: ['PHP', 'Lumen', 'SQS', 'RDS', 'Redis'],
    },
  ]);

  const awards = toArray(data.awards ?? ['Amazon Spot Award 2023 — Operational Excellence']);
  const references = toArray(data.references ?? [{ name: 'R. Srinivasan', title: 'Engineering Manager, Amazon', email: 'rsrin@amazon.com' }]);

  // allow template-level override of basic fields (name/title/contact)
  const personName = toText(data.name) || 'Karthik R';
  const personTitle = toText(data.title) || 'Senior PHP Developer';
  const personEmail = safe(data.email, 'karthik.r@example.com');
  const personPhone = safe(data.phone, '+91 98765 43210');
  const personLocation = safe(data.location, 'Bengaluru, India');
  const profileImage = data.profileImage || null;

  // ---------------------
  // Rendering
  // ---------------------
  return (
    <div id="cv-preview" className="w-[794px] min-h-[1123px] bg-white mx-auto shadow-lg border font-sans text-gray-900">
      {/* header with Amazon accent */}
      <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-gray-900">
        <div>
          <div className="text-2xl font-extrabold tracking-tight">{personName}</div>
          <div className="text-sm font-medium opacity-90">{personTitle} — <span className="italic">PHP & Backend</span></div>
        </div>

        <div className="flex items-center gap-4">
          {profileImage ? (
            <img src={profileImage} alt={personName} className="w-16 h-16 object-cover rounded-full border-2 border-white" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-xl font-bold text-yellow-700">
              {initials(personName)}
            </div>
          )}
          <div className="text-right text-xs">
            <div>{personLocation}</div>
            <div className="mt-1">{personPhone}</div>
            <div>{personEmail}</div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* left: profile / quick info */}
        <aside className="w-72 bg-gray-50 p-6 border-r flex flex-col gap-6">
          {/* Summary box */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-600">Profile</h3>
            <p className="mt-2 text-sm text-gray-700">
              {toText(data.headline) ||
                data.summary ||
                'Senior PHP developer with 12+ years building scalable backend systems, microservices and integrations. Currently driving backend initiatives at Amazon.'}
            </p>
          </div>

          {/* Skills compact */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-600">Top Skills</h3>
            <div className="mt-3 space-y-3">
              {skills.slice(0, 6).map((s, i) => {
                if (typeof s === 'string') {
                  return (
                    <div key={i} className="text-sm bg-white p-2 rounded border">{s}</div>
                  );
                }
                const name = toText(s.name || s.label);
                const pct = parsePct(s.proficiency ?? s.level ?? s.value);
                return (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{name}</span>
                      <span className="opacity-70">{pct}%</span>
                    </div>
                    <div className="w-full bg-white rounded h-2">
                      <div className="h-2 bg-yellow-500 rounded" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-600">Languages</h3>
            <div className="mt-2 space-y-1 text-sm">
              {languages.map((l, i) => {
                const name = toText(typeof l === 'string' ? l : l.name || l.language);
                const level = typeof l === 'object' && (l.level || l.levelText || l.levelLabel);
                return (
                  <div key={i} className="flex justify-between">
                    <span>{name}</span>
                    <span className="opacity-70">{level || ''}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificates */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-gray-600">Certifications</h3>
            <div className="mt-2 space-y-2 text-sm">
              {certificates.map((c, i) => (
                <div key={i} className="bg-white p-2 rounded border">
                  <div className="font-medium">{toText(c.name)}</div>
                  <div className="text-xs opacity-80">{toText(c.issuer)} • {toText(c.year)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact CTA */}
          <div className="mt-auto">
            <div className="text-xs text-gray-500">Available for interviews — Open to relocation</div>
            <div className="mt-3">
              <button className="w-full bg-yellow-600 text-white py-2 rounded text-sm font-semibold"
                onClick={() => onClickSection && onClickSection('contact')}>Contact</button>
            </div>
          </div>
        </aside>

        {/* right: main content */}
        <main className="flex-1 p-8">
          {/* Current company banner */}
          <div className="mb-6 p-4 rounded-lg border-l-4 border-yellow-500 bg-white shadow-sm flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">Current Role</div>
              <div className="text-lg font-bold">{experiences[0] ? toText(experiences[0].role) : 'Senior PHP Developer'}</div>
              <div className="text-sm opacity-80">{experiences[0] ? toText(experiences[0].company) : 'Amazon'}</div>
            </div>
            <div className="text-xs text-gray-600">{formatPeriod(experiences[0] || {})}</div>
          </div>

          {/* Experience timeline */}
          <section className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Experience</h2>
            </div>

            <div className="mt-4 space-y-6">
              {experiences.map((exp, idx) => (
                <article key={idx} className="relative">
                  <div className="absolute left-0 top-1">
                    {/* <div className="w-3 h-3 bg-yellow-500 rounded-full border-2 border-white" /> */}
                    {idx < experiences.length - 1 && <div className="w-px h-full bg-gray-200 mt-2" style={{ height: '80%' }} />}
                  </div>

                  <div className="bg-white p-4 rounded border shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{toText(exp.role)}</div>
                        <div className="text-sm opacity-80">{toText(exp.company)}</div>
                      </div>
                      <div className="text-xs text-gray-500">{formatPeriod(exp)}</div>
                    </div>

                    {renderDescription(exp)}

                    {/* optional tech tags */}
                    {exp.tech && exp.tech.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {exp.tech.map((t, ti) => <span key={ti} className="text-xs px-2 py-1 bg-gray-100 rounded border">{toText(t)}</span>)}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Projects */}
          {/* <section className="mb-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Selected Projects</h2>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              {projects.map((p, i) => (
                <div key={i} className="p-3 border rounded bg-gray-50">
                  <div className="font-semibold">{toText(p.title)}</div>
                  <div className="text-xs opacity-80">{toText(p.role)}</div>
                  {p.desc && <p className="text-sm mt-2">{toText(p.desc)}</p>}
                  {p.tech && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {p.tech.map((t, ti) => <span key={ti} className="text-xs px-2 py-1 bg-white rounded border">{toText(t)}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section> */}

          {/* Education & Awards & References */}
          <section className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold">Education</h3>
              <div className="mt-3 space-y-3">
                {education.map((e, i) => (
                  <div key={i} className="p-3 bg-white rounded border">
                    <div className="font-medium">{toText(e.degree || e.course)}</div>
                    <div className="text-xs opacity-80">{toText(e.school)} • {toText(e.year)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Awards & References</h3>
              <div className="mt-3 space-y-3">
                {awards.map((a, i) => <div key={i} className="text-sm p-2 bg-white rounded border">{toText(a)}</div>)}
                <div className="mt-2">
                  <div className="text-sm font-medium">References</div>
                  <div className="mt-2 text-sm">
                    {references.map((r, i) => (
                      <div key={i} className="mb-2">
                        <div className="font-medium">{toText(r.name)}</div>
                        <div className="text-xs opacity-80">{toText(r.title)} • {toText(r.email)}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}