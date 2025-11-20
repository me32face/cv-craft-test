'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiMapPin, FiLink, FiLinkedin } from 'react-icons/fi';
import { GiLaurelsTrophy } from 'react-icons/gi';
import { BsFillBriefcaseFill } from 'react-icons/bs';
import { AiFillTool } from 'react-icons/ai';
import { MdOutlineLanguage } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';

// New CV component: preserves Template30 behaviours but styled referencing Template32.
// Props: { data, onClickSection }

export default function TemplateFromRefs({ data = {}, onClickSection }) {
  // --- merge defaults ---
  const defaults = {
    name: 'Your Name',
    title: 'Your Role',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
    portfolio: '',
    address: '',
    profileImage: null,
    imageShape: 'circle',
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    certificates: [],
    references: [],
    projects: [],
    visibleSections: {},
  };
  const merged = { ...defaults, ...data };

  // --- helpers ---
  const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);
  const safeText = (v, fb = '') => {
    if (v === 0) return '0';
    if (v === null || v === undefined || v === '') return fb;
    if (typeof v === 'string' || typeof v === 'number') return v;
    if (typeof v === 'object') return v.name || v.title || v.label || fb;
    return fb;
  };
  const clamp = (n, min = 0, max = 100) => {
    const num = Number(n);
    if (Number.isNaN(num)) return min;
    return Math.max(min, Math.min(max, num));
  };

  const makeHref = (raw) => {
    if (!raw) return null;
    const s = String(raw).trim();
    if (s.includes('@') && !s.startsWith('http') && !s.startsWith('mailto:')) return `mailto:${s}`;
    if (!s.startsWith('http://') && !s.startsWith('https://') && !s.startsWith('mailto:')) return `https://${s}`;
    return s;
  };

  // language normalizer (compatible with both string and object inputs)
  const parseProficiency = (val) => {
    if (val == null || val === '') return null;
    if (typeof val === 'number') return clamp(val);
    if (typeof val === 'string') {
      const percent = val.match(/(-?\d+(?:\.\d+)?)(?=\s*%)/);
      if (percent) return clamp(Number(percent[1]));
      const number = val.match(/(-?\d+(?:\.\d+)?)/);
      if (number) {
        const n = Number(number[1]);
        if (n > 0 && n <= 1 && val.includes('.')) return clamp(Math.round(n * 100));
        return clamp(n);
      }
    }
    return null;
  };

  const proficiencyToTextLevel = (p) => {
    if (p == null) return null;
    if (p <= 20) return 'Beginner';
    if (p <= 45) return 'Intermediate';
    if (p <= 75) return 'Advanced';
    if (p <= 94) return 'Fluent';
    return 'Native';
  };

  const normalizeLang = (raw) => {
    if (raw == null) return { name: 'Language', displayFormat: 'default', proficiency: null, textLevel: null };
    if (typeof raw === 'string') {
      const paren = raw.match(/^(.+?)\s*\((.+)\)\s*$/);
      if (paren) return { name: paren[1].trim(), displayFormat: 'text', proficiency: null, textLevel: paren[2].trim() };
      return { name: raw.trim(), displayFormat: 'default', proficiency: null, textLevel: null };
    }
    const name = raw.name || raw.label || raw.language || 'Language';
    let fmt = (raw.displayFormat || raw.format || raw.showAs || merged.languageDisplayFormat || 'default').toString().toLowerCase();
    if (!['percentage', 'text', 'level', 'default'].includes(fmt)) fmt = 'default';
    const profVal = raw.proficiency ?? raw.proficiencyValue ?? raw.levelValue ?? raw.score ?? raw.value ?? raw.percent ?? raw.percentage;
    const prof = parseProficiency(profVal);
    const textLevel = raw.textLevel || raw.level || raw.proficiencyLabel || raw.proficiencyText || raw.label || null;
    return { name: safeText(name, 'Language'), displayFormat: fmt, proficiency: prof, textLevel: textLevel || null };
  };

  // render language (keeps parity with Template30 renderLanguage)
  const renderLanguage = (l, i) => {
    const lang = normalizeLang(l);
    const fmt = lang.displayFormat || 'default';
    const prof = lang.proficiency;
    const derived = lang.textLevel || (prof != null ? proficiencyToTextLevel(prof) : null);

    return (
      <div key={i} className="mb-3">
        <div className="flex justify-between items-center text-[12px] uppercase tracking-wide text-gray-700">
          <div>{safeText(lang.name)}</div>
          <div className="text-[12px] text-gray-500">{(fmt === 'text' || fmt === 'level') ? (derived || '—') : ''}</div>
        </div>
        {(fmt === 'percentage' || (fmt === 'default' && prof != null)) && (
          <div className="mt-2 w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div className="h-2 rounded" style={{ width: `${prof != null ? clamp(prof) : 0}%`, background: 'linear-gradient(90deg,#16a34a,#0f766e)' }} />
          </div>
        )}
      </div>
    );
  };

  // Bullet span - now returns a single span (not a div) and default size smaller (thin)
  const Bullet = ({ size = 6, colorClass = 'bg-gray-700', mt = 'mt-1' }) => (
    <span
      role="presentation"
      className={`${mt} inline-block flex-shrink-0`}
      style={{ width: `${size}px`, height: `${size}px`, lineHeight: 0 }}
    >
      {/* single span circle */}
      <span
        className={`${colorClass} rounded-full block`}
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </span>
  );

  // Render skill item using Bullet spans for alignment
  const renderSkillItem = (s, idx) => {
    if (typeof s === 'string') {
      return (
        <div key={idx} className="flex items-start gap-3 mb-2">
          <Bullet size={6} colorClass="bg-gray-700" />
          <div className="text-[12px] leading-tight">{s}</div>
        </div>
      );
    }
    const sk = typeof s === 'object' ? s : { name: s };

    if (sk.category && Array.isArray(sk.items)) {
      return (
        <div key={idx} className="mb-2">
          <div className="font-medium text-[12px] mb-1">{safeText(sk.category)}:</div>
          {sk.items.filter(Boolean).map((it, j) => (
            <div key={j} className="flex items-start gap-3 mb-1">
              <Bullet size={5} colorClass="bg-gray-700" />
              <div className="text-[12px] leading-tight">{it}</div>
            </div>
          ))}
        </div>
      );
    }

    if (sk.proficiency !== undefined && sk.proficiency !== null) {
      const p = clamp(sk.proficiency);
      return (
        <div key={idx} className="mb-3">
          <div className="flex justify-between items-center text-[12px]">
            <div>{safeText(sk.name || sk.label, 'Skill')}</div>
            <div className="text-[12px] text-gray-500">{p}%</div>
          </div>
          <div className="mt-2 w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div className="h-2 rounded" style={{ width: `${p}%`, background: 'linear-gradient(90deg,#16a34a,#0f766e)' }} />
          </div>
        </div>
      );
    }

    return (
      <div key={idx} className="flex items-start gap-3 mb-2">
        <Bullet size={6} colorClass="bg-gray-700" />
        <div className="text-[12px] leading-tight">{safeText(sk.name || sk.label, 'Skill')}</div>
      </div>
    );
  };

  // --- prepared sections ---
  const experiences = toArray(merged.experiences);
  const projects = toArray(merged.projects);
  const education = toArray(merged.education);
  const certificates = toArray(merged.certificates);
  const skills = toArray(merged.skills);
  const languages = toArray(merged.languages).map(normalizeLang);
  const references = toArray(merged.references || []);
  const summary = typeof merged.summary === 'string' ? merged.summary : Array.isArray(merged.summary) ? merged.summary[0] || '' : '';

  const visible = {
    summary: merged.visibleSections?.summary !== false,
    projects: merged.visibleSections?.projects !== false,
    experience: merged.visibleSections?.experience !== false,
    education: merged.visibleSections?.education !== false,
    skills: merged.visibleSections?.skills !== false,
    languages: merged.visibleSections?.languages !== false,
    certificates: merged.visibleSections?.certificates !== false,
  };

  const click = (key) => { if (typeof onClickSection === 'function') onClickSection(key); };

  const linkedinHref = makeHref(merged.linkedin);
  const githubHref = makeHref(merged.github);
  const portfolioHref = makeHref(merged.portfolio || merged.website);

  // consistent gutter used for content blocks under section headers
  const CONTENT_GUTTER_CLASS = 'pl-14';

  // small helper to render an icon with fixed size (no internal padding so baseline is stable)
  const Icon = ({ children }) => (
    <span className="w-8 h-8 flex items-center justify-center bg-green-50 rounded-md">
      {children}
    </span>
  );

  const IconSmall = ({ children }) => (
    <span className="w-5 h-5 flex items-center justify-center flex-shrink-0">
      {children}
    </span>
  );

  // --- component render ---
  return (
    <div id="pdf-template" className="mx-auto bg-white border shadow-sm print:shadow-none print:border-0" style={{ width: '794px', minHeight: '1123px', margin: '0 auto', padding: 32, boxSizing: 'border-box', fontFamily: 'Inter, Poppins, Arial, sans-serif' }}>
      <div className="flex gap-6 items-start">
        {/* LEFT */}
        <aside className="cv-sidebar w-1/3 pr-4 pl-2">
          <div className="mb-4 flex justify-center">
            {merged.profileImage ? (
              <img src={merged.profileImage} alt="profile" className={`w-28 h-28 object-cover ${merged.imageShape === 'circle' ? 'rounded-full' : 'rounded-lg'}`} />
            ) : (
              <div className={`w-28 h-28 flex items-center justify-center ${merged.imageShape === 'circle' ? 'rounded-full' : 'rounded-lg'} bg-green-50`}>
                <span className="text-2xl text-gray-400 font-bold mb-4">{(merged.name||'YN').split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
              </div>
            )}
          </div>

          {/* Contacts */}
          <div className="mb-5">
            <div className="flex items-center gap-2 text-green-700 font-semibold">
              <Icon><FiMail className="w-4 h-4" /></Icon>
              <span className='mb-4'>CONTACTS</span>
            </div>
            <div className="text-gray-700 text-[12px] space-y-2 pl-2">
              <div className="flex items-center gap-2">
                <IconSmall><FiPhone className="w-4 h-4" /></IconSmall>
                <span>{safeText(merged.phone, 'Phone')}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconSmall><FiMail className="w-4 h-4" /></IconSmall>
                <span>{safeText(merged.email, 'Email')}</span>
              </div>
              {linkedinHref && (
                <div className="flex items-center gap-2">
                  <IconSmall><FiLinkedin className="w-4 h-4" /></IconSmall>
                  <a className="no-underline hover:underline text-green-800 break-words" href={linkedinHref} target="_blank" rel="noreferrer">{merged.linkedin}</a>
                </div>
              )}
              {githubHref && (
                <div className="flex items-center gap-2">
                  <IconSmall><FaGithub className="w-4 h-4" /></IconSmall>
                  <a className="no-underline hover:underline text-green-800 break-words" href={githubHref} target="_blank" rel="noreferrer">{merged.github}</a>
                </div>
              )}
              {portfolioHref ? (
                <div className="flex items-center gap-2">
                  <IconSmall><FiLink className="w-4 h-4" /></IconSmall>
                  <a className="no-underline hover:underline text-green-800 break-words" href={portfolioHref} target="_blank" rel="noreferrer">{merged.portfolio || merged.website}</a>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <IconSmall><FiMapPin className="w-4 h-4" /></IconSmall>
                  <span>{safeText(merged.address, 'Location')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Achievements / Certs */}
          {visible.certificates && (
            <div className="mb-5">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <Icon><GiLaurelsTrophy className="w-4 h-4" /></Icon>
                <span className='mb-4'>KEY ACHIEVEMENTS</span>
              </div>
              <div className="text-gray-700 text-[12px] space-y-3 pl-6">
                {certificates.length ? certificates.slice(0,4).map((c,i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="w-2 h-2 rounded-full bg-gray-700 mt-2 block" />
                    <div>
                      <div className="font-semibold">{safeText(c.name || c.title, 'Achievement')}</div>
                      {c.issuer && <div className="text-[12px] text-gray-500">{c.issuer} • {c.year || ''}</div>}
                    </div>
                  </div>
                )) : (
                  <div className="text-gray-500">Add notable certifications or achievements to highlight impact.</div>
                )}
              </div>
            </div>
          )}

          {/* Skills */}
          {visible.skills && (
            <div className="mb-5">
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <Icon><AiFillTool className="w-4 h-4"/></Icon>
                <span className='mb-4'>SKILLS</span>
              </div>
              <div className="text-gray-700 pl-6">
                {skills.length ? skills.map((s,i) => renderSkillItem(s,i)) : <div className="text-gray-500">Your top skills</div>}
              </div>
            </div>
          )}

          {/* Languages */}
          {visible.languages && (
            <div>
              <div className="flex items-center gap-2 text-green-700 font-semibold">
                <Icon><MdOutlineLanguage className="w-4 h-4" /></Icon>
                <span className='mb-4'>LANGUAGES</span>
              </div>
              <div className="text-gray-700 pl-10">
                {languages.length ? languages.map((l, idx) => renderLanguage(l, idx)) : <div className="text-gray-500">English</div>}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT */}
        <main className="w-2/3 pl-3">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 pl-3">{safeText(merged.name, 'YOUR NAME')}</h1>
            <div className="inline-block mt-3 ">
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className="inline-block bg-green-100 rounded-full"
              >
                <span className="text-green-800 font-semibold text-[12px] px-4 py-1 inline-block text-left mb-4">
                  {safeText(merged.title, 'THE ROLE YOU ARE APPLYING FOR')}
                </span>
              </motion.div>
            </div>
          </header>

          {/* Summary */}
          {visible.summary && (
            <section className="mb-6 cv-item">
              <div className="flex items-center gap-3">
                <Icon><FiMail className="w-4 h-4" /></Icon>
                <div className="text-green-700 font-semibold cursor-pointer mb-4" onClick={() => click('summary')}>SUMMARY</div>
              </div>
              <div className={CONTENT_GUTTER_CLASS}>
                <p className="text-gray-600 leading-6 text-xs">{summary || 'A concise professional summary goes here.'}</p>
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {visible.projects && (
            <section className="mb-6">
              <div className="flex items-center gap-3">
                <Icon><FiLink className="w-4 h-4" /></Icon>
                <div className="text-green-700 font-semibold cursor-pointer mb-4" onClick={() => click('projects')}>PROJECTS</div>
              </div>

              <div className={CONTENT_GUTTER_CLASS}>
                {projects.length ? projects.map((proj, i) => {
                  const desc = proj.desc || '';
                  const lines = desc.split('\n').map(l => l.trim()).filter(Boolean);
                  return (
                    <div key={i} className="mb-5 cv-item">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-semibold text-gray-800 text-[13px]">{safeText(proj.name || proj.title)}</div>
                            {proj.link && (
                              <a href={makeHref(proj.link)} target="_blank" rel="noreferrer" className="text-[12px] no-underline hover:underline text-green-800 break-words">{proj.link}</a>
                            )}
                          </div>
                          {proj.role && <div className="text-[12px] text-green-800 font-medium mt-1">{proj.role}</div>}
                        </div>
                        <div className="text-[12px] text-gray-500 text-right min-w-[110px]">{safeText(proj.year)}</div>
                      </div>

                      {proj.descFormat === 'bullet' && lines.length > 0 && (
                        <div className="mt-3">
                          {lines.map((ln, idx) => (
                            <div key={idx} className="flex gap-3 items-start mb-2">
                              <Bullet size={6} colorClass="bg-gray-700 mt-2" />
                              <span className="text-gray-700 text-[11px] leading-tight">{ln}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {proj.descFormat === 'number' && lines.length > 0 && (
                        <div className="mt-3">
                          {lines.map((ln, idx) => (
                            <div key={idx} className="flex gap-3 items-start mb-2">
                              <span className="inline-block mt-1 text-[11px] leading-5 w-4 text-right">{idx+1}.</span>
                              <span className="text-gray-700 text-[11px] leading-tight">{ln}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {proj.descFormat !== 'bullet' && proj.descFormat !== 'number' && proj.desc && (
                        <div className="mt-3 text-gray-700 text-[11px] leading-tight">{proj.desc}</div>
                      )}
                    </div>
                  );
                }) : (
                  <div className="text-gray-500">Add projects you worked on — include role, year and short impact bullets.</div>
                )}
              </div>
            </section>
          )}

          {/* Experience */}
          {visible.experience && (
            <section className="mb-6">
              <div className="flex items-center gap-3">
                <Icon><BsFillBriefcaseFill className="w-4 h-4" /></Icon>
                <div className="text-green-700 font-semibold cursor-pointer mb-4" onClick={() => click('experience')}>EXPERIENCE</div>
              </div>

              <div className={CONTENT_GUTTER_CLASS}>
                {experiences.length ? experiences.map((exp, i) => {
                  const desc = exp.desc || '';
                  const lines = desc.split('\n').map(l=>l.trim()).filter(Boolean);
                  return (
                    <div key={i} className="mb-6 cv-item">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div className="font-semibold text-gray-800 text-[13px]">{exp.company}</div>
                            {exp.location && <span className="text-[12px] text-gray-500">• {exp.location}</span>}
                          </div>
                          <div className="text-[12px] text-green-800 font-medium mt-1">{exp.role}</div>
                        </div>
                        <div className="text-[12px] text-gray-500 text-right min-w-[110px]">{exp.year}</div>
                      </div>

                      {/* description */}
                      {exp.descFormat === 'bullet' && lines.length > 0 && (
                        <div className="mt-3">
                          {lines.map((ln, idx) => (
                            <div key={idx} className="flex gap-3 items-start mb-2">
                              <Bullet size={6} colorClass="bg-gray-700 mt-2" />
                              <span className="text-gray-700 text-[11px] leading-tight">{ln}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {exp.descFormat === 'number' && lines.length > 0 && (
                        <div className="mt-3">
                          {lines.map((ln, idx) => (
                            <div key={idx} className="flex gap-3 items-start mb-2">
                              <span className="inline-block mt-1 text-[11px] leading-5 w-4 text-right">{idx+1}.</span>
                              <span className="text-gray-700 text-[11px] leading-tight">{ln}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {exp.descFormat !== 'bullet' && exp.descFormat !== 'number' && exp.desc && (
                        <div className="mt-3 text-gray-700 text-[11px] leading-tight">{exp.desc}</div>
                      )}
                    </div>
                  );
                }) : (
                  <div className="text-gray-500">Add your professional experience here. Include achievements and metrics where possible.</div>
                )}
              </div>
            </section>
          )}

          {/* Education */}
          {visible.education && (
            <section className="mb-6">
              <div className="flex items-center gap-3">
                <Icon>
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 7l11 5 9-4v6h2V6L12 2z"/></svg>
                </Icon>
                <div className="text-green-700 font-semibold cursor-pointer mb-4" onClick={() => click('education')}>EDUCATION</div>
              </div>

              <div className={CONTENT_GUTTER_CLASS}>
                {education.length ? education.map((edu, i) => (
                  <div key={i} className="cv-item flex justify-between items-start mb-4">
                    <div>
                      <div className="font-semibold text-gray-800 text-[14px]">{safeText(edu.course, 'Degree and Field')}</div>
                      <div className="text-[12px] text-gray-600">{safeText(edu.school, 'School or University')}</div>
                    </div>
                    <div className="text-[12px] text-gray-500">{safeText(edu.year, '')}</div>
                  </div>
                )) : (
                  <div className="text-gray-500">Add your education details here.</div>
                )}
              </div>
            </section>
          )}

          {/* References */}
          {references.length > 0 && (
            <section className="mt-3">
              <div className="font-semibold mb-3">REFERENCES</div>
              {references.map((r,i) => (
                <div key={i} className="mb-3">
                  <div className="font-semibold text-gray-800">{safeText(r.name)}</div>
                  <div className="text-[12px] text-gray-600">{safeText(r.title)}</div>
                  {r.phone && <div className="text-[12px]">Phone: {r.phone}</div>}
                  {r.email && <div className="text-[12px]">Email: {r.email}</div>}
                </div>
              ))}
            </section>
          )}

        </main>
      </div>
    </div>
  );
}