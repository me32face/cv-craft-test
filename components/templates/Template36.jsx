'use client';
import React from 'react';
import { Phone, Mail } from 'lucide-react';
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput'; // kept as-is (we shadow it below)
import SocialLinkDisplay from "../SocialLinkDisplay";

export default function TemplateGracePerfect({ data = {}, onClickSection }) {
  const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

  const defaults = {
    name: 'GRACE JACKSON',
    title: 'Data Scientist | Advanced Analytics | Machine Learning',
    phone: '+1-(234)-555-1234',
    email: 'help@enhancv.com',
    location: '',
    profileImage: null,
    imageShape: 'circle', // 'circle' | 'rounded' | 'square'
    summary: '',
    experiences: [],
    projects: [],
    education: [],
    skills: [],
    achievements: [],
    certificates: [],
    languages: [],
    socialLinks: [],
    awards: [],
    references: [],
    visibleSections: {},
  };

  // Merge incoming data but keep defaults for missing fields
  const mergedRaw = { ...defaults, ...data };

  // Safe profile image (avoid empty string src) - but no fallback image
  const profileImage =
    mergedRaw.profileImage && String(mergedRaw.profileImage).trim()
      ? mergedRaw.profileImage
      : null;

  // Simple header location like Template30 (address or location)
  const headerLocation =
    (mergedRaw.address && String(mergedRaw.address).trim()) ||
    (mergedRaw.location && String(mergedRaw.location).trim()) ||
    '';

  const merged = { ...mergedRaw, profileImage };

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
  const awards = toArray(merged.awards);
  const references = toArray(merged.references);
  const socialArray = toArray(merged.socialLinks);

  // 🔹 Normalize social links for SocialLinkDisplay
  const normalizedSocialLinks = socialArray
    .filter(Boolean)
    .map((item) => {
      // String -> treat as URL
      if (typeof item === 'string') {
        const url = item.trim();
        if (!url) return null;
        const clean = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
        return {
          url,
          label: clean,
          useIcon: true,
        };
      }

      // Object with various possible keys
      if (typeof item === 'object') {
        const url =
          item.url ||
          item.link ||
          item.value ||
          item.href ||
          '';

        if (!url) return null;

        const clean = String(url)
          .replace(/^https?:\/\//, '')
          .replace(/\/$/, '');

        const label =
          item.label ||
          item.platform ||
          item.type ||
          item.name ||
          clean;

        const useIcon =
          typeof item.useIcon === 'boolean' ? item.useIcon : true;

        return { url, label, useIcon };
      }

      return null;
    })
    .filter(Boolean);

  // Achievements (no more auto-promoting certificates)
  const achievementsToShow = achievements;

  // Date helpers (similar spirit to Template30)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const getDateText = (obj) => {
    if (!obj) return '';
    if (obj.date) return String(obj.date);
    if (obj.year) return String(obj.year);

    if (obj.start || obj.end || obj.current) {
      const start = obj.start ? formatDate(obj.start) : '';
      const end = obj.current ? 'Present' : obj.end ? formatDate(obj.end) : '';
      if (start && end) return `${start} - ${end}`;
      if (start) return start;
      if (end) return end;
    }
    return '';
  };

  // ===== Description helpers (Template30-compatible descFormat) =====

  const splitLines = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) {
      return raw
        .map((v) => String(v).trim())
        .filter(Boolean);
    }

    if (typeof raw === 'string') {
      const s = raw.trim();
      if (!s) return [];

      // First: split by real line breaks
      const byNewline = s
        .split('\n')
        .map((l) => l.trim())
        .filter(Boolean);
      if (byNewline.length > 1) return byNewline;

      // Single line but contains multiple bullets: "• a • b • c"
      const bulletParts = s
        .split('•')
        .map((l) => l.trim())
        .filter(Boolean);
      if (bulletParts.length > 1) return bulletParts;

      // Single line but contains multiple numbers: "1. a 2. b 3. c"
      const numberedParts = s
        .split(/\d+\.\s*/)
        .map((l) => l.trim())
        .filter(Boolean);
      if (numberedParts.length > 1) return numberedParts;

      // Fallback: just one line
      return [s];
    }

    return [];
  };

  const renderLinesWithFormat = (raw, format) => {
    const lines = splitLines(raw);
    if (!lines.length) return null;

    if (format === 'bullet') {
      return (
        <ul className="mt-1.5 space-y-0.5 pl-4 list-disc list-outside">
          {lines.map((line, idx) => (
            <li
              key={idx}
              className="text-[12px] text-gray-700 leading-relaxed break-words"
            >
              {line
                .replace(/^•\s*/, '')
                .replace(/^\d+\.\s*/, '')}
            </li>
          ))}
        </ul>
      );
    }

    // ---- NUMBERED LIST ----
    if (format === 'number') {
      return (
        <ol className="mt-1.5 space-y-0.5 pl-4 list-decimal list-outside">
          {lines.map((line, idx) => (
            <li
              key={idx}
              className="text-[12px] text-gray-700 leading-relaxed break-words"
            >
              {line
                .replace(/^\d+\.\s*/, '')
                .replace(/^•\s*/, '')}
            </li>
          ))}
        </ol>
      );
    }

    // ---- PLAIN TEXT (no bullets) ----
    if (typeof raw === 'string') {
      return (
        <p className="text-[12px] text-gray-700 leading-relaxed mt-1.5 break-words">
          {raw}
        </p>
      );
    }

    return lines.map((line, idx) => (
      <p
        key={idx}
        className="text-[12px] text-gray-700 leading-relaxed mt-1.5 break-words"
      >
        {line}
      </p>
    ));
  };

  const renderExperienceDesc = (exp) => {
    if (!exp) return null;
    const raw = exp.desc ?? exp.description ?? '';
    const format = exp.descFormat || 'bullet'; // default bullet like Template30
    return renderLinesWithFormat(raw, format);
  };

  const renderEducationDesc = (edu) => {
    if (!edu) return null;
    const raw = edu.description ?? edu.desc ?? edu.notes ?? '';
    if (!raw) return null;
    const format = edu.descFormat || 'bullet';
    return renderLinesWithFormat(raw, format);
  };

  const renderProjectDesc = (proj) => {
    if (!proj) return null;
    const raw = proj.desc ?? proj.description ?? '';

    const looksNumbered =
      typeof raw === 'string' && /\d+\.\s*\S/.test(raw);
    const looksBulleted =
      typeof raw === 'string' && raw.includes('•');

    let format = proj.descFormat;
    if (!format) {
      if (looksNumbered) format = 'number';
      else if (looksBulleted || Array.isArray(raw)) format = 'bullet';
    }

    if (format === 'number' || format === 'bullet') {
      return renderLinesWithFormat(raw, format);
    }

    if (typeof raw === 'string' && raw.trim()) {
      return (
        <p className="text-[12px] text-gray-700 mt-1 break-words">
          {raw}
        </p>
      );
    }
    return null;
  };

  // Local renderLanguage: override/shadow imported renderLanguage so we can control font-size/layout in this file
  const renderLanguageLocal = (langObj, key) => {
    const obj = langObj || {};
    const name = obj.name || '';
    const displayFormat =
      obj.displayFormat ||
      (obj.proficiency !== undefined
        ? 'percentage'
        : obj.level
          ? 'level'
          : 'simple');
    const proficiency = obj.proficiency ?? null;
    const level = obj.level ?? '';

    return (
      <div key={key} className="text-[12px] text-gray-800">
        <div className="flex justify-between items-start">
          <span className="font-medium break-words">{name}</span>

          {displayFormat === 'level' && (
            <span className="text-[10px] opacity-70 ml-2">{level}</span>
          )}

          {displayFormat === 'percentage' && (
            <span className="text-[10px] opacity-70 ml-2 mt-2">
              {proficiency}%
            </span>
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

  const displayLocation = headerLocation;

  // Awards + References defaults (Template30-style)
  const awardsToShow = awards.length
    ? awards
    : [
        'Oct 2024 | Employee of the Year',
        'Dec 2025 | Best Employee',
      ];

  const referencesToShow = references.length
    ? references
    : [
        {
          name: 'Harumi Kobayashi',
          title: 'CEO',
          company: 'Reality Corp',
          phone: '123-456-7890',
          email: 'hello@reality.com',
        },
        {
          name: 'Bailey Dupont',
          title: 'CEO',
          company: 'Reality Corp',
          phone: '123-456-7890',
          email: 'hello@reality.com',
        },
      ];

  // Languages fallback like Template30
  const languagesArray =
    languages.length > 0
      ? languages
      : ['Spanish', 'Arabic', 'English'];

  // 🔹 Image shape classes: circle | rounded | square
  const imageShapeClass =
    merged.imageShape === 'circle'
      ? 'rounded-full'
      : merged.imageShape === 'rounded'
      ? 'rounded-xl'
      : 'rounded-none'; // explicit square

  return (
    <div
      id="pdf-template"
      className="mx-auto bg-white"
      style={{
        width: '794px',
        minHeight: '1123px',
        margin: '0 auto',
        boxSizing: 'border-box',
        fontFamily: 'Poppins, Inter, Arial, sans-serif',
      }}
    >
      <div className="px-10 py-8" style={{ minHeight: '297mm', height: 'auto' }}>
        {/* HEADER */}
        <div className="flex justify-between items-start cv-section">
          <div className="max-w-[70%]">
            <h1 className="text-[28px] font-extrabold tracking-tight text-blue-900 leading-tight break-words">
              {merged.name}
            </h1>
            <div className="text-[13px] font-semibold text-orange-500 mt-1 break-words">
              {merged.title}
            </div>

            {/* header location line */}
            <div className="mt-1 text-[12px] text-gray-700 break-words">
              {displayLocation}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600 mt-2.5 cv-header-contacts">
              {merged.phone && (
                <div className="flex items-center gap-1 break-words">
                  <Phone className="w-3 h-3" />
                  <span>{merged.phone}</span>
                </div>
              )}
              {merged.email && (
                <div className="flex items-center gap-1 break-words">
                  <Mail className="w-3 h-3" />
                  <span>{merged.email}</span>
                </div>
              )}

              {isSectionVisible('socialLinks') &&
                normalizedSocialLinks.length > 0 &&
                normalizedSocialLinks.map((link, i) => (
                  <SocialLinkDisplay key={i} link={link} />
                ))}
            </div>
          </div>

          <div className="flex-shrink-0 text-right">
            {profileImage && (
              <div
                className={`overflow-hidden ${imageShapeClass}`}
                style={{ width: 120, height: 120, margin: '0 auto' }}
              >
                <img
                  src={profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        {isSectionVisible('summary') && (
          <div className="mt-3 cv-section">
            <h2
              className="text-[14px] font-bold text-blue-800 mb-2 cursor-pointer"
              onClick={() => onClickSection && onClickSection('summary')}
            >
              SUMMARY
            </h2>
            <p className="text-[12px] text-gray-700 leading-relaxed break-words">
              {merged.summary ||
                'A dedicated professional with extensive experience in the field.'}
            </p>
          </div>
        )}

        {/* EXPERIENCE */}
        {isSectionVisible('experience') && (
          <div className="mt-3 cv-section">
            <h2
              className="text-[14px] font-bold text-blue-800 mb-3 cursor-pointer"
              onClick={() => onClickSection && onClickSection('experience')}
            >
              EXPERIENCE
            </h2>
            <div className="relative">
              <div className="absolute left-[135px] top-0 bottom-0 w-[2px] bg-[#D0D0D0]" />

              <div className="space-y-6">
                {(experiences.length
                  ? experiences
                  : [
                      {
                        date: '02/2020 - Present',
                        location: 'San Francisco, CA',
                        role: 'Senior Data Scientist',
                        company: 'Tech Innovations Inc.',
                        desc: ['Led a team to optimize algorithm performance.'],
                      },
                    ]
                ).map((exp, idx) => {
                  const dateText = getDateText(exp);
                  const expLocation =
                    exp.location || exp.place || exp.address || exp.city || '';
                  const rawRef = exp.reference ?? exp.ref ?? exp.references ?? '';
                  let refLines = [];
                  if (Array.isArray(rawRef)) {
                    refLines = rawRef.filter(Boolean).map(String);
                  } else if (typeof rawRef === 'string') {
                    refLines = rawRef
                      .split('\n')
                      .map((l) => l.trim())
                      .filter(Boolean);
                  }

                  return (
                    <div
                      key={idx}
                      className="grid grid-cols-[150px,1fr] gap-5 items-start cv-item"
                    >
                      <div className="relative">
                        <div className="text-[12px] font-semibold text-blue-800 break-words">
                          {dateText}
                        </div>
                        <div className="text-[12px] text-orange-500 mt-0.5 break-words">
                          {exp.company || ''}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5 break-words">
                          {expLocation}
                        </div>
                        <span className="absolute right-[-10px] top-[-15px] text-blue-900 text-[35px] leading-none">
                          •
                        </span>
                      </div>

                      <div>
                        <div className="text-[13px] font-semibold text-blue-900 break-words">
                          {exp.role || exp.title || ''}
                        </div>
                        <div className="mt-1.5">
                          {renderExperienceDesc(exp)}
                        </div>

                        {refLines.length > 0 && (
                          refLines.length === 1 ? (
                            <div className="mt-1 text-[12px] text-gray-600 italic break-words">
                              Reference: {refLines[0]}
                            </div>
                          ) : (
                            <div className="mt-1">
                              <div className="text-[12px] font-medium text-gray-700">
                                References:
                              </div>
                              <ul className="list-disc list-inside mt-1 space-y-0.5">
                                {refLines.map((r, ri) => (
                                  <li
                                    key={ri}
                                    className="text-[12px] text-gray-600 break-words"
                                  >
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
              className="text-[14px] font-bold text-blue-800 mb-3 cursor-pointer"
              onClick={() => onClickSection && onClickSection('projects')}
            >
              PROJECTS
            </h2>

            <div className="grid grid-cols-2 gap-6">
              {(projects.length
                ? projects
                : [
                    {
                      name: 'Market Trend Predictor',
                      year: '2022',
                      link: '',
                      desc: [
                        'Built a time-series forecasting model used to predict monthly sales.',
                      ],
                    },
                  ]
              ).map((proj, pidx) => {
                const projYear = proj.year || proj.date || '';
                const projLink = proj.link || proj.url || '';
                const linkLabel =
                  proj.useCustomLabel && proj.linkLabel
                    ? proj.linkLabel
                    : projLink;

                return (
                  <div key={pidx} className="mb-0 cv-item">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[13px] font-semibold text-blue-900 break-words">
                          {proj.name || proj.title || 'Project'}
                        </div>
                      </div>
                      <div className="text-[11px] text-gray-600">
                        {projYear}
                      </div>
                    </div>

                    <div className="mt-1">
                      {renderProjectDesc(proj)}
                    </div>

                    {projLink && (
                      <div className="mt-1.5">
                        <a
                          href={projLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-blue-700 underline project-link break-all"
                        >
                          {linkLabel}
                        </a>
                      </div>
                    )}
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
              className="text-[14px] font-bold text-blue-800 mb-2 cursor-pointer"
              onClick={() => onClickSection && onClickSection('education')}
            >
              EDUCATION
            </h2>
            <div className="relative">
              <div className="absolute left-[135px] top-0 bottom-0 w-[2px] bg-[#D0D0D0]" />
              <div className="space-y-6">
                {(education.length
                  ? education
                  : [
                      {
                        date: '01/2012 - 01/2014',
                        location: 'Berkeley, CA',
                        course: 'MSc Applied Mathematics',
                        school: 'University of California, Berkeley',
                      },
                    ]
                ).map((edu, idx) => {
                  const dateText = getDateText(edu);
                  const eduLocation =
                    edu.location || edu.place || edu.address || edu.city || '';
                  return (
                    <div
                      key={idx}
                      className="grid grid-cols-[150px,1fr] gap-5 items-start cv-item"
                    >
                      <div className="relative min-w-0">
                        <div className="text-[12px] font-semibold text-blue-800 break-words">
                          {dateText}
                        </div>
                        <div className="text-[11px] text-gray-500 mt-0.5 break-words">
                          {eduLocation}
                        </div>
                        <span className="absolute right-[-10px] top-[-10px] text-blue-900 text-[35px] leading-none">
                          •
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-blue-900 break-words">
                          {edu.course || edu.degree || ''}
                        </div>
                        <div className="text-[12px] text-orange-500 mt-0.5 break-words">
                          {edu.school || ''}
                        </div>
                        {edu.field && (
                          <div className="text-[12px] text-gray-600 mt-1 break-words">
                            {edu.field}
                          </div>
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
                <div className="min-w-0">
                  <h2
                    className="text-[14px] font-bold text-blue-800 mb-3 cursor-pointer"
                    onClick={() => onClickSection && onClickSection('skills')}
                  >
                    SKILLS
                  </h2>
                  <div className="flex flex-wrap gap-1 mt-2 text-[12px] text-gray-700">
                    {(skills.length
                      ? skills
                      : [
                          'Statistical Modeling',
                          'Data Visualization',
                          'Data Wrangling',
                          'R',
                          'Python',
                          'SQL',
                        ]
                    ).map((s, i) => {
                      if (typeof s === 'string' || typeof s === 'number') {
                        return (
                          <div
                            key={i}
                            className="px-2.5 py-1.5 border-b border-gray-300 break-words"
                          >
                            {String(s)}
                          </div>
                        );
                      }
                      if (s && typeof s === 'object') {
                        if (s.category && Array.isArray(s.items || s.skills)) {
                          const items = Array.isArray(s.items)
                            ? s.items
                            : s.skills;
                          return (
                            <div
                              key={i}
                              className="px-2.5 py-1.5 border-b border-gray-300 break-words"
                            >
                              <span className="font-medium">
                                {s.category}:
                              </span>{' '}
                              {items.filter(Boolean).join(', ')}
                            </div>
                          );
                        }
                        if (s.proficiency !== undefined) {
                          return (
                            <div key={i} className="w-full mb-2">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-[12px] text-gray-800 break-words flex-1 min-w-0">
                                  {s.name || s.label}
                                </span>
                                <span className="text-[11px] text-gray-500 flex-shrink-0">
                                  {String(s.proficiency)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                                <div
                                  className="bg-blue-900 h-1 rounded-full"
                                  style={{
                                    width: `${Number(s.proficiency)}%`,
                                  }}
                                />
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div
                            key={i}
                            className="px-2.5 py-1.5 border-b border-gray-300 break-words"
                          >
                            {String(s.name || s.label || 'Skill')}
                          </div>
                        );
                      }
                      return (
                        <div
                          key={i}
                          className="px-2.5 py-1.5 border-b border-gray-300"
                        >
                          Skill
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {isSectionVisible('languages') && (
                <div>
                  <h2 className="text-[14px] font-bold text-blue-800 mb-3">
                    LANGUAGES
                  </h2>
                  <div>
                    {languagesArray.map((l, i) => {
                      let langObj;
                      if (typeof l === 'string') {
                        langObj = { name: l, displayFormat: 'simple' };
                      } else {
                        langObj = { ...l };
                      }
                      if (!langObj.displayFormat) {
                        if (
                          langObj.proficiency !== undefined &&
                          langObj.proficiency !== null
                        )
                          langObj.displayFormat = 'percentage';
                        else if (langObj.level) langObj.displayFormat = 'level';
                        else langObj.displayFormat = 'simple';
                      }
                      return (
                        <div key={i} className="mb-1">
                          {renderLanguageLocal(langObj, i)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AWARDS */}
        {isSectionVisible('awards') && (
          <div className="mt-3 cv-section">
            <h2 className="text-[14px] font-bold text-blue-800 mb-3">
              AWARDS
            </h2>
            <div className="space-y-1 text-[12px] text-gray-700">
              {awardsToShow.map((a, i) => {
                if (typeof a === 'string') {
                  return <div key={i} className="break-words">{a}</div>;
                }

                const title =
                  a.title || a.name || a.award || 'Award';
                const issuer = a.issuer || a.organization || a.company || '';
                const date = a.date || a.year || '';
                const description =
                  a.description || a.desc || a.details || '';

                return (
                  <div key={i} className="mb-1">
                    <div className="font-semibold text-blue-900 break-words">
                      {title}
                    </div>
                    {(issuer || date) && (
                      <div className="text-[11px] text-gray-600 break-words">
                        {issuer}
                        {issuer && date ? ' • ' : ''}
                        {date}
                      </div>
                    )}
                    {description && (
                      <div className="text-[11px] text-gray-700 mt-0.5 break-words">
                        {description}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* KEY ACHIEVEMENTS */}
        {isSectionVisible('achievements') && achievementsToShow.length > 0 && (
          <div className="mt-3 cv-section">
            <h2 className="text-[14px] font-bold text-blue-800 mb-3">
              KEY ACHIEVEMENTS
            </h2>
            <div className="grid grid-cols-2 gap-6 text-[12px] text-gray-700">
              {achievementsToShow.map((a, i) => (
                <div key={i}>
                  <div className="text-[13px] font-semibold text-blue-900 break-words">
                    {a.title}
                  </div>
                  <div className="mt-0.5 break-words">{a.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {isSectionVisible('certificates') && certificates.length > 0 && (
          <div className="mt-8 cv-section">
            <h2 className="text-[14px] font-bold text-blue-800 mb-3">
              CERTIFICATIONS
            </h2>
            <div className="space-y-2 text-[12px] text-gray-700">
              {certificates.map((c, i) => {
                const certDate =
                  (c.date && String(c.date).trim()) ||
                  (c.year && String(c.year).trim()) ||
                  '';
                return (
                  <div key={i}>
                    <div className="font-semibold text-orange-500 break-words">
                      {c.name}
                    </div>
                    <div className="text-[11px] text-gray-500 break-words">
                      {c.issuer || ''}
                      {certDate ? ` • ${certDate}` : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REFERENCES */}
        {isSectionVisible('references') && (
          <div className="mt-3 cv-section">
            <h2 className="text-[14px] font-bold text-blue-800 mb-3">
              REFERENCES
            </h2>
            <div className="grid grid-cols-2 gap-6 text-[12px] text-gray-700">
              {referencesToShow.map((r, i) => (
                <div key={i} className="mb-3">
                  <div className="font-semibold text-blue-900 break-words">
                    {r.name}
                  </div>
                  {r.title && (
                    <div className="text-[12px] break-words">{r.title}</div>
                  )}
                  {r.company && (
                    <div className="text-[12px] break-words">{r.company}</div>
                  )}
                  {r.phone && (
                    <div className="text-[12px] text-gray-700 break-words">
                      Phone: {r.phone}
                    </div>
                  )}
                  {r.email && (
                    <div className="text-[12px] text-gray-700 break-words">
                      Email: {r.email}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Global styles for header social links */}
      <style jsx global>{`
        .cv-header-contacts a.social-link {
          display: inline-flex !important;
          align-items: center !important;
          font-size: 11px !important;
          color: #1f2937 !important; /* gray-800 */
          gap: 0.3rem !important;    /* spacing between icon & text */
          line-height: 1.25 !important;
        }

        .cv-header-contacts a.social-link span {
          font-size: 11px !important;
          color: #1f2937 !important;
          line-height: 1.25 !important;
        }

        .cv-header-contacts a.social-link svg {
          width: 14px !important;
          height: 14px !important;
          stroke: #4b5563 !important; /* gray-600 */
        }
      `}</style>
    </div>
  );
}