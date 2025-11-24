'use client';
import React from 'react';
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput'; // kept as-is (we shadow it below)

export default function TemplateGracePerfect({ data = {}, onClickSection }) {
  const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

  const defaults = {
    name: 'GRACE JACKSON',
    title: 'Data Scientist | Advanced Analytics | Machine Learning',
    phone: '+1-(234)-555-1234',
    email: 'help@enhancv.com',
    location: '',
    // image defaults like Template30
    profileImage: null,
    imageShape: 'circle',
    summary: '',
    experiences: [],
    projects: [],
    education: [],
    skills: [],
    achievements: [],
    certificates: [],
    languages: [],
    socialLinks: [],
    visibleSections: {},
  };

  // Merge incoming data but keep defaults for missing fields
  const mergedRaw = { ...defaults, ...data };

  // Safe profile image (avoid empty string src) - but no fallback image
  const profileImage =
    mergedRaw.profileImage && String(mergedRaw.profileImage).trim()
      ? mergedRaw.profileImage
      : null;

  // Place detection prioritizes 'place' then many fallbacks (important: reads 'address' used by PersonalInfo)
  const placeText =
    (mergedRaw.place && String(mergedRaw.place).trim())
      ? mergedRaw.place
      : (mergedRaw.city && String(mergedRaw.city).trim())
        ? mergedRaw.city
        : (mergedRaw.town && String(mergedRaw.town).trim())
          ? mergedRaw.town
          : (mergedRaw.region && String(mergedRaw.region).trim())
            ? mergedRaw.region
            : (mergedRaw.address && String(mergedRaw.address).trim())
              ? mergedRaw.address
              : (mergedRaw.location && String(mergedRaw.location).trim())
                ? mergedRaw.location
                : '';

  // For backward compatibility show header location (address or location)
  const headerLocation =
    (mergedRaw.address && String(mergedRaw.address).trim())
      ? mergedRaw.address
      : (mergedRaw.location && String(mergedRaw.location).trim())
        ? mergedRaw.location
        : '';

  const merged = { ...mergedRaw, profileImage, place: placeText, location: headerLocation };

  // visibility helper (like Template30)
  const isSectionVisible = (key) => merged.visibleSections?.[key] !== false;

  // Arrays
  const experiences = toArray(merged.experiences);
  const projects = toArray(merged.projects);
  const education = toArray(merged.education);
  const skills = toArray(merged.skills);
  const achievements = toArray(merged.achievements);
  const certificates = toArray(merged.certificates);
  const languages = toArray(merged.languages);
  const socialLinksRaw = merged.socialLinks || merged.social || merged.socialLinksArray || [];

  // Social normalization
  const detectKnownLinksFromArray = (arr = []) =>
    (Array.isArray(arr) ? arr : []).filter(Boolean).map((s) => String(s).trim()).filter(Boolean);

  const getSocialArray = () => {
    if (Array.isArray(socialLinksRaw) && socialLinksRaw.length) return detectKnownLinksFromArray(socialLinksRaw);
    if (socialLinksRaw && typeof socialLinksRaw === 'object' && !Array.isArray(socialLinksRaw)) {
      return Object.values(socialLinksRaw).filter(Boolean).map(String).map((s) => s.trim()).filter(Boolean);
    }
    const fallback = [];
    ['linkedin', 'github', 'portfolio', 'twitter'].forEach((k) => {
      if (merged[k] && String(merged[k]).trim()) fallback.push(String(merged[k]).trim());
    });
    return Array.from(new Set(fallback));
  };

  const socialArray = getSocialArray();

  // Achievements fallback -> promote certificates if achievements empty
  const achievementsToShow =
    achievements.length > 0
      ? achievements
      : (isSectionVisible('certificates') && certificates.length > 0
          ? certificates.map((c) => ({
              title: c.name || 'Certification',
              desc:
                (c.issuer ? `${c.issuer}` : '') +
                (c.year || c.date ? ` • ${c.year || c.date}` : ''),
            }))
          : []);

  // Date helpers (keeps previous flexible parsing)
  const isYearString = (s) => typeof s === 'string' && /^\d{4}$/.test(s.trim());
  const formatDate = (dateStr) => {
    if (!dateStr && dateStr !== 0) return '';
    if (isYearString(String(dateStr))) return String(dateStr).trim();
    try {
      const d = new Date(dateStr);
      if (Number.isNaN(d.getTime())) return String(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return String(dateStr);
    }
  };

  const getDateText = (obj) => {
    if (!obj) return '';
    if (typeof obj.date === 'string' && obj.date.trim()) return obj.date.trim();
    if (typeof obj.year === 'string' && obj.year.trim()) return obj.year.trim();

    if (obj.start || obj.end || obj.current) {
      const startRaw = obj.start ?? '';
      const endRaw = obj.end ?? '';
      const startIsYear = isYearString(String(startRaw));
      const endIsYear = isYearString(String(endRaw));
      const start = startRaw ? (startIsYear ? String(startRaw).trim() : formatDate(startRaw)) : '';
      const end = obj.current ? 'Present' : endRaw ? (endIsYear ? String(endRaw).trim() : formatDate(endRaw)) : '';

      if (start && end) return `${start} - ${end}`;
      if (start) return start;
      if (end) return end;
    }

    return '';
  };

  // Render helpers
  const renderBullets = (items) =>
    items?.length ? (
      <div className="mt-1.5 space-y-1">
        {items.map((it, idx) => (
          <div key={idx} className="text-[10px] text-gray-700 leading-relaxed flex gap-2">
            <span className="select-none">•</span>
            <span>{String(it)}</span>
          </div>
        ))}
      </div>
    ) : null;

  const renderExperienceDesc = (exp) => {
    if (!exp) return null;
    const raw = exp.desc ?? exp.description ?? '';
    let lines = [];
    if (Array.isArray(raw)) lines = raw;
    else if (typeof raw === 'string') lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
    return renderBullets(lines);
  };

  const renderEducationDesc = (edu) => {
    if (!edu) return null;
    const raw = edu.description ?? edu.desc ?? edu.notes ?? '';
    if (!raw) return null;
    if (Array.isArray(raw)) return renderBullets(raw);
    if (typeof raw === 'string') {
      const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
      return renderBullets(lines);
    }
    return null;
  };

  const renderProjectDesc = (proj) => {
    if (!proj) return null;
    const raw = proj.desc ?? proj.description ?? '';
    let lines = [];
    if (Array.isArray(raw)) lines = raw;
    else if (typeof raw === 'string') lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);
    return renderBullets(lines);
  };

  // Local renderLanguage: override/shadow imported renderLanguage so we can control font-size/layout in this file
  const renderLanguageLocal = (langObj, key) => {
    const obj = langObj || {};
    const name = obj.name || '';
    const displayFormat = obj.displayFormat || (obj.proficiency !== undefined ? 'percentage' : obj.level ? 'level' : 'simple');
    const proficiency = obj.proficiency ?? null;
    const level = obj.level ?? '';

    return (
      <div key={key} className="text-[10px] text-gray-800">
        <div className="flex justify-between items-start">
          <span className="font-medium">{name}</span>

          {displayFormat === 'level' && (
            <span className="text-[8px] opacity-70 ml-2">{level}</span>
          )}

          {displayFormat === 'percentage' && (
            <span className="text-[8px] opacity-70 ml-2 mt-2">{proficiency}%</span>
          )}
        </div>

        {displayFormat === 'percentage' && (
          <div className="w-full bg-gray-200 h-1 rounded-full mt-2">
            <div
              className="h-1 rounded-full bg-blue-900"
              style={{ width: `${Number(proficiency || 0)}%` }}
            />
          </div>
        )}
      </div>
    );
  };

  const displayPlace = merged.place || '';
  const displayLocation = merged.location || '';

  return (
    <div
      id="pdf-template"
      className="mx-auto"
      style={{ width: '794px', minHeight: '1123px', margin: '0 auto', boxSizing: 'border-box', fontFamily: 'Poppins, Inter, Arial, sans-serif' }}
    >
      <div className="px-10 py-8" style={{ minHeight: '297mm', height: 'auto' }}>
        {/* HEADER */}
        <div className="flex justify-between items-start cv-section">
          <div className="max-w-[70%]">
            <h1 className="text-[22px] font-extrabold tracking-tight text-blue-900 leading-tight">{merged.name}</h1>
            <div className="text-[11px] font-semibold text-orange-500 mt-1">{merged.title}</div>

            {/* header location line */}
            <div className="mt-1 text-[10px] text-gray-700">{displayLocation}</div>

            <div className="flex flex-wrap items-center gap-1 text-[9px] text-gray-600 mt-2.5">
              {merged.phone && (
                <div className="flex items-center gap-1">
                  <span>📞</span><span>{merged.phone}</span>
                </div>
              )}
              {merged.email && (
                <div className="flex items-center gap-1">
                  <span>✉️</span><span>{merged.email}</span>
                </div>
              )}

              {isSectionVisible('socialLinks') && socialArray.length > 0 && (
                <div className="flex flex-wrap items-center gap-3">
                  {socialArray.map((lnk, i) => {
                    if (!lnk) return null;
                    const href = String(lnk).startsWith('http') ? lnk : `https://${lnk}`;
                    const label = String(lnk).replace(/^https?:\/\//, '');
                    return (
                      <a
                        key={i}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-700 underline text-[9px]"
                      >
                        {label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            {profileImage && (
              <div
                className={`overflow-hidden ${
                  merged.imageShape === 'circle'
                    ? 'rounded-full'
                    : merged.imageShape === 'rounded'
                    ? 'rounded-xl'
                    : ''
                }`}
                style={{ width: 120, height: 120, margin: '0 auto' }}
              >
                <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        {isSectionVisible('summary') && (
          <div className="mt-3 cv-section">
            <h2
              className="text-[12px] font-bold text-blue-800 mb-2 cursor-pointer"
              onClick={() => onClickSection && onClickSection('summary')}
            >
              SUMMARY
            </h2>
            <p className="text-[10px] text-gray-700 leading-relaxed">{merged.summary || ''}</p>
          </div>
        )}

        {/* EXPERIENCE */}
        {isSectionVisible('experience') && (
          <div className="mt-3 cv-section">
            <h2
              className="text-[12px] font-bold text-blue-800 mb-3 cursor-pointer"
              onClick={() => onClickSection && onClickSection('experience')}
            >
              EXPERIENCE
            </h2>
            <div className="relative">
              <div className="absolute left-[135px] top-0 bottom-0 w-[2px] bg-[#D0D0D0]" />

              <div className="space-y-6">
                {(experiences.length ? experiences : [
                  { date: '02/2020 - Present', location: 'San Francisco, CA', role: 'Senior Data Scientist', company: 'Tech Innovations Inc.', desc: ['Led a team to optimize algorithm performance.'] },
                ]).map((exp, idx) => {
                  const dateText = getDateText(exp);
                  const expLocation = exp.location || exp.place || exp.address || exp.city || '';
                  const rawRef = exp.reference ?? exp.ref ?? exp.references ?? '';
                  let refLines = [];
                  if (Array.isArray(rawRef)) refLines = rawRef.filter(Boolean).map(String);
                  else if (typeof rawRef === 'string') refLines = rawRef.split('\n').map((l) => l.trim()).filter(Boolean);

                  return (
                    <div key={idx} className="grid grid-cols-[150px,1fr] gap-5 items-start cv-item">
                      <div className="relative">
                        <div className="text-[10px] font-semibold text-blue-800">{dateText}</div>
                        <div className="text-[10px] text-orange-500 mt-0.5">{exp.company || ''}</div>
                        <div className="text-[9px] text-gray-500 mt-0.5">{expLocation}</div>
                        <span
                          className="absolute right-[-10px] top-[-10px] text-blue-900 text-[35px] leading-none"
                        >
                          •
                        </span>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-blue-900">{exp.role || exp.title || ''}</div>
                        <div className="mt-1.5">{renderExperienceDesc(exp)}</div>

                        {refLines.length > 0 && (
                          refLines.length === 1 ? (
                            <div className="mt-1 text-[10px] text-gray-600 italic">Reference: {refLines[0]}</div>
                          ) : (
                            <div className="mt-1">
                              <div className="text-[10px] font-medium text-gray-700">References:</div>
                              <ul className="list-disc list-inside mt-1 space-y-0.5">
                                {refLines.map((r, ri) => (
                                  <li key={ri} className="text-[10px] text-gray-600">
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS */}
        {isSectionVisible('projects') && (
          <div className="mt-3 cv-section">
            <h2
              className="text-[12px] font-bold text-blue-800 mb-3 cursor-pointer"
              onClick={() => onClickSection && onClickSection('projects')}
            >
              PROJECTS
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {(projects.length ? projects : [
                { name: 'Market Trend Predictor', year: '2022', link: '', desc: ['Built a time-series forecasting model used to predict monthly sales.'] }
              ]).map((proj, pidx) => {
                const projYear = proj.year || proj.date || '';
                const projLink = proj.link || proj.url || '';
                return (
                  <div key={pidx} className="mb-0 cv-item">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] font-semibold text-blue-900">
                          {proj.name || proj.title || 'Project'}
                        </div>
                        {projLink ? (
                          <a
                            href={projLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] underline"
                          >
                            {String(projLink).replace(/^https?:\/\//, '')}
                          </a>
                        ) : null}
                      </div>
                      <div className="text-[9px] text-gray-600">{projYear}</div>
                    </div>

                    <div className="mt-1">
                      {proj.descFormat === 'bullet' || Array.isArray(proj.desc) ? (
                        renderProjectDesc(proj)
                      ) : proj.descFormat === 'number' ? (
                        (proj.desc || '').split('\n').map(
                          (line, li) =>
                            line.trim() && (
                              <p key={li} className="text-[10px] mt-1">
                                {' '}
                                {li + 1}. {line}
                              </p>
                            )
                        )
                      ) : (
                        <p className="text-[10px] text-gray-700 mt-1">{proj.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* EDUCATION */}
        {isSectionVisible('education') && (
          <div className="mt-3 cv-section">
            <h2
              className="text-[12px] font-bold text-blue-800 mb-2 cursor-pointer"
              onClick={() => onClickSection && onClickSection('education')}
            >
              EDUCATION
            </h2>
            <div className="relative">
              <div className="absolute left-[135px] top-0 bottom-0 w-[2px] bg-[#D0D0D0]" />
              <div className="space-y-6">
                {(education.length ? education : [
                  { date: '01/2012 - 01/2014', location: 'Berkeley, CA', course: 'MSc Applied Mathematics', school: 'University of California, Berkeley' },
                ]).map((edu, idx) => {
                  const dateText = getDateText(edu);
                  const eduLocation = edu.location || edu.place || edu.address || edu.city || '';
                  return (
                    <div key={idx} className="grid grid-cols-[150px,1fr] gap-5 items-start cv-item">
                      <div className="relative">
                        <div className="text-[10px] font-semibold text-blue-800">{dateText}</div>
                        <div className="text-[9px] text-gray-500 mt-0.5">{eduLocation}</div>
                        <span
                          className="absolute right-[-10px] top-[-10px] text-blue-900 text-[35px] leading-none"
                        >
                          •
                        </span>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-blue-900">
                          {edu.course || edu.degree || ''}
                        </div>
                        <div className="text-[10px] text-orange-500 mt-0.5">{edu.school || ''}</div>
                        {edu.field && (
                          <div className="text-[10px] text-gray-600 mt-1">{edu.field}</div>
                        )}
                        {renderEducationDesc(edu)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* SKILLS & LANGUAGES */}
        {(isSectionVisible('skills') || isSectionVisible('languages')) && (
          <div className="mt-3 cv-section">
            <div className="grid grid-cols-2 gap-6">
              {isSectionVisible('skills') && (
                <div>
                  <h2
                    className="text-[12px] font-bold text-blue-800 mb-3 cursor-pointer"
                    onClick={() => onClickSection && onClickSection('skills')}
                  >
                    SKILLS
                  </h2>
                  <div className="flex flex-wrap gap-1 mt-2 text-[10px] text-gray-700">
                    {(skills.length ? skills : ['Statistical Modeling','Data Visualization','Data Wrangling','R','Python','SQL']).map((s, i) => {
                      if (typeof s === 'string' || typeof s === 'number') {
                        return (
                          <div key={i} className="px-2.5 py-1.5 border-b border-gray-300">
                            {String(s)}
                          </div>
                        );
                      }
                      if (s && typeof s === 'object') {
                        if (s.category && Array.isArray(s.items || s.skills)) {
                          const items = Array.isArray(s.items) ? s.items : s.skills;
                          return (
                            <div key={i} className="px-2.5 py-1.5 border-b border-gray-300">
                              <span className="font-medium">{s.category}:</span>{' '}
                              {items.filter(Boolean).join(', ')}
                            </div>
                          );
                        }
                        if (s.proficiency !== undefined) {
                          return (
                            <div key={i} className="w-full mb-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] text-gray-800">
                                  {s.name || s.label}
                                </span>
                                <span className="text-[9px] text-gray-500">
                                  {String(s.proficiency)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                <div
                                  className="bg-blue-900 h-1 rounded-full"
                                  style={{ width: `${Number(s.proficiency)}%` }}
                                />
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={i} className="px-2.5 py-1.5 border-b border-gray-300">
                            {String(s.name || s.label || 'Skill')}
                          </div>
                        );
                      }
                      return (
                        <div key={i} className="px-2.5 py-1.5 border-b border-gray-300">
                          Skill
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isSectionVisible('languages') && (
                <div>
                  <h2 className="text-[12px] font-bold text-blue-800 mb-3">LANGUAGES</h2>
                  <div>
                    {languages.length > 0
                      ? languages.map((l, i) => {
                          let langObj;
                          if (typeof l === 'string') langObj = { name: l, displayFormat: 'simple' };
                          else langObj = { ...l };
                          if (!langObj.displayFormat) {
                            if (langObj.proficiency !== undefined && langObj.proficiency !== null)
                              langObj.displayFormat = 'percentage';
                            else if (langObj.level) langObj.displayFormat = 'level';
                            else langObj.displayFormat = 'simple';
                          }
                          return (
                            <div key={i} className="mb-1">
                              {renderLanguageLocal(langObj, i)}
                            </div>
                          );
                        })
                      : null}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* KEY ACHIEVEMENTS */}
        {isSectionVisible('achievements') && achievementsToShow.length > 0 && (
          <div className="mt-3 cv-section">
            <h2 className="text-[12px] font-bold text-blue-800 mb-3">KEY ACHIEVEMENTS</h2>
            <div className="grid grid-cols-2 gap-6 text-[10px] text-gray-700">
              {achievementsToShow.map((a, i) => (
                <div key={i}>
                  <div className="text-[11px] font-semibold text-blue-900">{a.title}</div>
                  <div className="mt-0.5">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {isSectionVisible('certificates') && achievements.length > 0 && certificates.length > 0 && (
          <div className="mt-8 cv-section">
            <h2 className="text-[12px] font-bold text-blue-800 mb-3">CERTIFICATIONS</h2>
            <div className="space-y-2 text-[10px] text-gray-700">
              {certificates.map((c, i) => {
                const certDate =
                  (c.date && String(c.date).trim()) ||
                  (c.year && String(c.year).trim()) ||
                  '';
                return (
                  <div key={i}>
                    <div className="font-semibold text-orange-500">{c.name}</div>
                    <div className="text-[9px] text-gray-500">
                      {c.issuer || ''}
                      {certDate ? ` • ${certDate}` : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}