'use client';
import React from 'react';

/*
 Template40.jsx
 - Experience rendering fixes: bullet / numbered lists and defensive desc handling
 - JavaScript (not TypeScript)
*/

export default function Template40({ data = {}, onClickSection }) {
  const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

  // canonical arrays
  const experiences = toArray(data.experiences);
  const education = toArray(data.education);
  const certificates = toArray(data.certificates);
  const skills = toArray(data.skills);
  const languages = toArray(data.languages);
  const projects = toArray(data.projects);
  const awards = toArray(data.awards);
  const references = toArray(data.references);

  // safe summary text (handles string or array)
  const summaryText =
    Array.isArray(data.summary) ? data.summary.filter(Boolean).join(' ') : (data.summary ? String(data.summary) : '');

  const toText = (val) => {
    if (val == null) return '';
    if (typeof val === 'string' || typeof val === 'number') return String(val);
    if (typeof val === 'object') {
      // prefer common fields; fallback to JSON string for debugging
      return val.title || val.name || val.company || val.issuer || JSON.stringify(val);
    }
    return '';
  };

  const parsePct = (raw) => {
    if (raw == null) return 0;
    if (typeof raw === 'number') return Math.max(0, Math.min(100, Math.round(raw)));
    if (typeof raw === 'string') {
      const n = parseInt(raw.replace(/[^\d-]/g, ''), 10);
      return isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
    }
    if (typeof raw === 'object') {
      const candidate = raw.proficiency ?? raw.level ?? raw.value ?? 0;
      return parsePct(candidate);
    }
    return 0;
  };

  const normalizeDisplayFormat = (raw) => {
    if (raw === null || raw === undefined) return 'simple';
    const s = String(raw).trim().toLowerCase();
    if (!s) return 'simple';
    if (s.includes('level') || s.includes('text')) return 'level';
    if (s.includes('perc') || s.includes('%') || s.includes('percent')) return 'percentage';
    if (s.includes('simple') || s.includes('name')) return 'simple';
    if (/^\d+%?$/.test(s)) return 'percentage';
    return 'simple';
  };

  const initials = (name = '') =>
    (name || 'AE')
      .split(' ')
      .map((p) => (p ? p[0] : ''))
      .join('')
      .slice(0, 3)
      .toUpperCase();

  // Format a readable period string
  const formatPeriod = (exp) => {
    if (!exp) return '';
    const year = exp.year ? toText(exp.year).trim() : '';
    if (year) return year;
    const start = exp.start ? toText(exp.start).trim() : '';
    const end = exp.end ? toText(exp.end).trim() : '';
    if (start && end) return `${start} • ${end}`;
    if (start && !end) return `${start} • Present`;
    if (!start && end) return end;
    return '';
  };

  // NEW: robust description renderer for experience entries
  const renderDescription = (exp) => {
    // priority: bullets array -> metrics array -> desc field
    if (!exp) return null;

    // If explicit bullets array provided, render it
    if (Array.isArray(exp.bullets) && exp.bullets.length) {
      return (
        <ul className="mt-2 ml-4 list-disc text-sm text-gray-600">
          {exp.bullets.map((b, idx) => {
            const txt = toText(b);
            if (!txt || !String(txt).trim()) return null;
            return <li key={idx}>{txt}</li>;
          })}
        </ul>
      );
    }

    // Metrics as list (optional)
    if (Array.isArray(exp.metrics) && exp.metrics.length) {
      return (
        <ul className="mt-2 ml-4 list-disc text-sm text-gray-600">
          {exp.metrics.map((m, idx) => {
            const txt = toText(m);
            if (!txt || !String(txt).trim()) return null;
            return <li key={idx}>{txt}</li>;
          })}
        </ul>
      );
    }

    // desc may be string or array
    const desc = exp.desc;

    if (Array.isArray(desc) && desc.length) {
      // If descFormat indicates ordered, use ol; else use paragraphs
      if (exp.descFormat === 'number' || exp.descFormat === 'ordered') {
        return (
          <ol className="mt-2 ml-4 list-decimal text-sm text-gray-600">
            {desc.map((d, idx) => {
              const txt = toText(d);
              if (!txt || !String(txt).trim()) return null;
              return <li key={idx}>{txt}</li>;
            })}
          </ol>
        );
      }

      if (exp.descFormat === 'bullet' || exp.descFormat === 'list') {
        return (
          <ul className="mt-2 ml-4 list-disc text-sm text-gray-600">
            {desc.map((d, idx) => {
              const txt = toText(d);
              if (!txt || !String(txt).trim()) return null;
              return <li key={idx}>{txt}</li>;
            })}
          </ul>
        );
      }

      // default: paragraphs
      return (
        <div className="text-sm mt-2 text-gray-700">
          {desc.map((d, idx) => {
            const txt = toText(d);
            if (!txt || !String(txt).trim()) return null;
            return <p key={idx} className="mb-1">{txt}</p>;
          })}
        </div>
      );
    }

    if (typeof desc === 'string' && desc.trim()) {
      const lines = desc.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

      // If descFormat requests bullets
      if (exp.descFormat === 'bullet' || exp.descFormat === 'list') {
        return (
          <ul className="mt-2 ml-4 list-disc text-sm text-gray-600">
            {lines.map((line, idx) => <li key={idx}>{line}</li>)}
          </ul>
        );
      }

      // If descFormat requests ordered list
      if (exp.descFormat === 'number' || exp.descFormat === 'ordered') {
        return (
          <ol className="mt-2 ml-4 list-decimal text-sm text-gray-600">
            {lines.map((line, idx) => <li key={idx}>{line}</li>)}
          </ol>
        );
      }

      // Default: paragraphs (preserve line breaks as separate <p>)
      return (
        <div className="text-sm mt-2 text-gray-700">
          {lines.map((line, idx) => <p key={idx} className="mb-1">{line}</p>)}
        </div>
      );
    }

    // Nothing to render
    return null;
  };

  const imageUrl = data.profileImage ? toText(data.profileImage) : null;

  return (
    <div id="cv-preview" className="w-[794px] min-h-[1123px] bg-white mx-auto shadow-lg border font-sans text-gray-900">

      {/* Top bar */}
      <div className="h-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 flex items-center px-6 text-white">
        <div className="flex-1">
          <div className="text-sm uppercase tracking-wider font-semibold">{toText(data.title) || 'Professional Title'}</div>
        </div>
        <div className="text-xs opacity-90">{toText(data.name) || 'Your Name'}</div>
      </div>

      <div className="flex">
        {/* LEFT MAIN COLUMN */}
        <main className="flex-1 p-8">
          {/* Hero */}
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold leading-tight">{toText(data.name) || 'Alex Emerson'}</h1>
              <p className="text-sm text-gray-600 mt-1">
                {toText(data.headline) || summaryText || 'Experienced product leader who builds delightful, scalable experiences.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {data.phone && <span className="text-xs px-2 py-1 bg-gray-100 rounded">📞 {toText(data.phone)}</span>}
                {data.email && <span className="text-xs px-2 py-1 bg-gray-100 rounded">✉️ {toText(data.email)}</span>}
                {data.location && <span className="text-xs px-2 py-1 bg-gray-100 rounded">📍 {toText(data.location)}</span>}
                {data.website && <span className="text-xs px-2 py-1 bg-gray-100 rounded">🔗 {toText(data.website)}</span>}
              </div>
            </div>

            <div className="w-28 h-28 flex-shrink-0">
              {imageUrl ? (
                <img src={imageUrl} alt={toText(data.name)} className={`w-28 h-28 object-cover ${data.imageShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`} />
              ) : (
                <div className="w-28 h-28 rounded-lg bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500">
                  {initials(toText(data.name))}
                </div>
              )}
            </div>
          </div>

          {/* Experience */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Experience</h2>
              <button onClick={() => onClickSection && onClickSection('experience')} className="text-xs text-indigo-600">Edit</button>
            </div>

            <div className="mt-4 space-y-4">
              {experiences.length ? experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-6">
                  <div className="absolute left-0 top-1 w-2 flex flex-col items-center">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                    {idx < experiences.length - 1 && <div className="w-px h-full bg-gray-200 mt-1" />}
                  </div>

                  <div className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{toText(exp.role) || toText(exp.title)}</div>
                        <div className="text-sm text-gray-600">{toText(exp.company)}</div>
                      </div>
                      <div className="text-xs text-gray-500">{formatPeriod(exp)}</div>
                    </div>

                    {/* Render description / bullets / numbering robustly */}
                    {renderDescription(exp)}
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-500">No experience added.</div>
              )}
            </div>
          </section>

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mt-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Projects</h2>
                <button onClick={() => onClickSection && onClickSection('projects')} className="text-xs text-indigo-600">Edit</button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {projects.map((p, i) => (
                  <div key={i} className="border rounded-lg p-3 bg-gray-50">
                    <div className="font-semibold">{toText(p.title)}</div>
                    <div className="text-xs text-gray-600">{toText(p.role)}</div>
                    {p.desc && <p className="text-sm mt-2 text-gray-700">{toText(p.desc)}</p>}
                    {p.tech && p.tech.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{p.tech.map((t,ti)=>(<span key={ti} className="text-xs px-2 py-1 bg-white rounded border">{toText(t)}</span>))}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Education</h2>
              <button onClick={() => onClickSection && onClickSection('education')} className="text-xs text-indigo-600">Edit</button>
            </div>

            <div className="mt-4 space-y-3">
              {education.length ? education.map((ed, i) => (
                <div key={i} className="p-3 border rounded bg-white">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{toText(ed.course) || toText(ed.degree)}</div>
                      <div className="text-xs text-gray-600">{toText(ed.school)}</div>
                    </div>
                    <div className="text-xs text-gray-500">{toText(ed.year)}</div>
                  </div>
                </div>
              )) : (<div className="text-sm text-gray-500">No education added.</div>)}
            </div>
          </section>

          {/* Certificates */}
          <section className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Certificates</h2>
              <button onClick={() => onClickSection && onClickSection('certificates')} className="text-xs text-indigo-600">Edit</button>
            </div>

            <div className="mt-4 space-y-2">
              {certificates.length ? certificates.map((c, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded border">
                  <div>
                    <div className="font-medium">{toText(c.name)}</div>
                    <div className="text-xs text-gray-600">{toText(c.issuer)}</div>
                  </div>
                  <div className="text-xs text-gray-500">{toText(c.year)}</div>
                </div>
              )) : (<div className="text-sm text-gray-500">No certificates added.</div>)}
            </div>
          </section>

        </main>

        {/* RIGHT SLIM SIDEBAR */}
        <aside className="w-64 border-l bg-gradient-to-b from-white to-gray-50 p-6 flex flex-col gap-6">
          {/* Skills (supports category objects) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Skills</h4>
              <button onClick={() => onClickSection && onClickSection('skills')} className="text-xs text-indigo-600">Edit</button>
            </div>

            <div className="space-y-3 mt-2">
              {skills.length ? skills.map((s, i) => {
                if (s && typeof s === 'object' && s.category && Array.isArray(s.items)) {
                  return (
                    <div key={i} className="text-sm">
                      <div className="font-medium text-gray-700">{s.category}</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {s.items.filter(Boolean).map((it, j) => (
                          <span key={j} className="text-xs px-2 py-1 bg-indigo-50 rounded border">{toText(it)}</span>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (typeof s === 'string') {
                  return <div key={i} className="text-sm flex items-center justify-between"><span>{s}</span></div>;
                }

                const name = s?.name || s?.label || 'Skill';
                const pct = parsePct(s?.proficiency ?? s?.level ?? s?.value);

                return (
                  <div key={i} className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="truncate">{toText(name)}</span>
                      <span className="text-xs text-gray-500 ml-2">{pct}%</span>
                    </div>

                    <div
                      role="progressbar"
                      aria-label={`${toText(name)} proficiency`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={pct}
                      className="w-full bg-gray-100 h-2 rounded mt-1 overflow-hidden"
                    >
                      <div
                        className="h-2 rounded bg-indigo-500 transition-[width] duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              }) : (
                <div className="text-sm text-gray-500">Add skills</div>
              )}
            </div>
          </div>

          {/* Languages */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">Languages</h4>
              <button onClick={() => onClickSection && onClickSection('languages')} className="text-xs text-indigo-600">Edit</button>
            </div>
            <div className="space-y-2">
              {languages.length ? languages.map((l, i) => {
                const langObj = typeof l === 'string' ? { name: l, displayFormat: 'simple' } : (l || {});
                const name = langObj.name ?? langObj.language ?? 'Language';
                const displayFormat = normalizeDisplayFormat(langObj.displayFormat ?? langObj.display ?? '');
                const rawPct = langObj.proficiency ?? langObj.value ?? (typeof langObj.level === 'number' ? langObj.level : undefined);
                const pct = parsePct(rawPct);
                const textLevel = (typeof langObj.level === 'string') ? langObj.level : (langObj.levelText ?? langObj.levelLabel ?? null);

                return (
                  <div key={i} className="text-sm">
                    <div className="flex justify-between"><span>{toText(name)}</span><span className="text-xs text-gray-500">{displayFormat === 'percentage' ? `${pct}%` : (textLevel || '')}</span></div>
                    {displayFormat === 'percentage' && (
                      <div role="progressbar" aria-label={`${toText(name)} language proficiency`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="w-full bg-gray-100 h-1 rounded mt-1 overflow-hidden">
                        <div style={{ width: `${pct}%` }} className="h-1 bg-indigo-500 transition-[width] duration-300" />
                      </div>
                    )}
                  </div>
                );
              }) : <div className="text-sm text-gray-500">Add languages</div>}
            </div>
          </div>

          {/* Small contact card */}
          <div className="p-3 bg-white border rounded shadow-sm">
            <div className="text-sm font-semibold">Contact</div>
            <div className="text-xs text-gray-600 mt-1">{toText(data.email)}</div>
            <div className="text-xs text-gray-600">{toText(data.phone)}</div>
            {data.website && <div className="text-xs text-indigo-600 mt-2">{toText(data.website)}</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
