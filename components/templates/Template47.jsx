'use client';
import React from 'react';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import SocialLinkDisplay from "../SocialLinkDisplay";

// --- Static Resume Data (kept as sample defaults) ---
const resumeData = {
  name: 'DANI MARTINEZ',
  title: 'EXECUTIVE REAL ESTATE SALES MANAGER | LEADER OF HIGH-PERFORMING TEAMS',
  summary:
    'A high-impact, results-driven Real Estate Sales Manager with 10+ years of experience leading multi-million dollar residential and commercial property sales campaigns. Proven expertise in strategic market development, digital lead generation (40% growth), team leadership, contract negotiation, and CRM integration. Dedicated to optimizing sales funnels and exceeding demanding quarterly quotas.',
  contact: {
    phone: '+1 234 567 8900',
    email: 'dani.martinez@executiveresume.com',
    address: '123 Anywhere St., Any City | Available for relocation.',
  },
  experience: [
    {
      years: '2019 - Present',
      company: 'Handover and Take Company',
      role: 'Sales Director, EMEA Region',
      location: 'London, UK',
      description: [
        '**Strategic Leadership:** Managed a team of 15 senior agents, increasing total regional sales volume by 32% year-over-year.',
        '**Market Penetration:** Successfully launched and sold out three major residential developments (€50M+ total value) by deploying targeted, data-driven marketing funnels.',
        '**Digital Transformation:** Re-architected digital presence, overseeing SEO and website development, resulting in a 40% increase in inbound qualified leads and a 15% reduction in CAC.',
        "**Negotiation:** Personally closed the company's largest deal in Q3 2023, a $12M multi-unit commercial contract.",
      ],
    },
    {
      years: '2016 - 2019',
      company: 'Shadows Company',
      role: 'Marketing & Sales Manager',
      location: 'Madrid, Spain',
      description: [
        'Planned and executed all regional marketing strategies for new property acquisitions, managing a budget of €1.5M.',
        'Led cross-functional teams to develop all new asset signage and collateral, boosting sales and rental volume by 25% in high-density areas.',
        'Implemented HubSpot CRM migration, streamlining lead tracking and pipeline management for the entire sales force.',
      ],
    },
  ],
  education: [
    {
      years: '2014 - 2016',
      institution: 'Western University',
      degree: 'Master of Marketing and Business Administration (MBA)',
    },
    {
      years: '2013 - 2014',
      institution: 'Vitabria University',
      degree: 'Bachelor of Marketing, Minor in Finance',
    },
  ],
  skills: {
    'Technical Proficiencies': [
      'CRM (Salesforce, HubSpot, Pipedrive)',
      'SEO/SEM',
      'Google Analytics',
      'SQL Basic',
      'Microsoft Suite (Expert)',
    ],
    'Core Competencies': [
      'Team Leadership (15+ reports)',
      'Strategic Planning',
      'Complex Contract Negotiation',
      'P&L Management',
      'Market Analysis',
    ],
    'Industry Expertise': [
      'Residential Sales',
      'Commercial Leasing',
      'Property Valuation',
      'Real Estate Law Compliance',
    ],
  },
  awards: [
    'Top Sales Director Award - Handover & Take Company (2022, 2023)',
    'Marketing Innovation Prize - Shadows Company (2018)',
  ],
};

// --- Color Palette ---
const navyAccent = '#1e40af';
const darkText = '#111827';

// ===== Helpers =====
const toArray = (v) => (!v ? [] : Array.isArray(v) ? v : [v]);

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

const splitLines = (raw) => {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw.map((v) => String(v).trim()).filter(Boolean);
  }
  if (typeof raw === 'string') {
    return raw
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
  }
  return [];
};

const renderListItemsWithFormat = (raw, format) => {
  const lines = splitLines(raw);
  if (!lines.length) return null;

  return lines.map((line, idx) => {
    const hasPrefix = line.startsWith('•') || /^\d+\./.test(line);
    let text = line;

    if (format === 'number' && !hasPrefix) {
      text = `${idx + 1}. ${line}`;
    } else if (format === 'bullet' && !hasPrefix) {
      text = `• ${line}`;
    }

    return <li key={idx}>{text}</li>;
  });
};

const renderExperienceItems = (exp) => {
  if (!exp) return null;
  const raw = exp.desc ?? exp.description ?? '';
  const format = exp.descFormat || 'bullet';
  return renderListItemsWithFormat(raw, format);
};

const renderEducationItems = (edu) => {
  if (!edu) return null;
  const raw = edu.description ?? edu.desc ?? edu.notes ?? '';
  if (!raw) return null;
  const format = edu.descFormat || 'bullet';
  return renderListItemsWithFormat(raw, format);
};

// --- Main component ---
const Template47 = ({ data = {}, onClickSection }) => {
  // Defaults built from static resumeData
  const defaults = {
    name: resumeData.name,
    title: resumeData.title,
    phone: resumeData.contact.phone,
    email: resumeData.contact.email,
    website: resumeData.contact.website, // can be overridden by data
    address: resumeData.contact.address,
    location: '',
    profileImage: null,
    imageShape: 'circle',
    summary: resumeData.summary,

    experiences: resumeData.experience.map((job) => ({
      company: job.company,
      role: job.role,
      location: job.location,
      date: job.years,
      desc: job.description,
      descFormat: 'bullet',
    })),

    education: resumeData.education.map((edu) => ({
      school: edu.institution,
      course: edu.degree,
      date: edu.years,
      location: '',
    })),

    // default skills as array of { category, items }
    skills: [
      {
        category: 'Technical Proficiencies',
        items: resumeData.skills['Technical Proficiencies'] || [],
      },
      {
        category: 'Core Competencies',
        items: resumeData.skills['Core Competencies'] || [],
      },
      {
        category: 'Industry Expertise',
        items: resumeData.skills['Industry Expertise'] || [],
      },
    ],

    awards: resumeData.awards,

    projects: [],
    achievements: [],
    certificates: [],
    languages: [],
    socialLinks: [],
    references: [],
    visibleSections: {},
  };

  const mergedRaw = { ...defaults, ...data };
  const merged = { ...mergedRaw };

    // --- Normalize social links into the shape SocialLinkDisplay expects ---
  const rawSocialLinks = toArray(merged.socialLinks);

  const normalizedSocialLinks = rawSocialLinks
    .filter(Boolean)
    .map((item) => {
      // If it's just a string, treat it as the URL
      if (typeof item === "string") {
        const url = item.trim();
        if (!url) return null;
        return {
          url,
          label: url,
          useIcon: true,
        };
      }

      if (typeof item === "object") {
        // try common field names for the URL
        const url =
          item.url ||
          item.link ||
          item.value ||
          item.href ||
          "";

        if (!url) return null;

        const label =
          item.label ||
          item.platform ||
          item.type ||
          item.name ||
          url;

        const useIcon =
          typeof item.useIcon === "boolean" ? item.useIcon : true;

        return { url, label, useIcon };
      }

      return null;
    })
    .filter(Boolean);

  const isSectionVisible = (key) =>
    merged.visibleSections?.[key] !== false;

  const experiences = toArray(merged.experiences);
  const education = toArray(merged.education);
  const skillsArray = toArray(merged.skills);
  const awardsArray = toArray(merged.awards);

  const headerLocation =
    (merged.address && String(merged.address).trim()) ||
    (merged.location && String(merged.location).trim()) ||
    '';

  const ContactItem = ({ icon: Icon, text }) => {
    if (!text) return null;
    return (
      <div className="flex items-center text-xs mx-3 text-gray-700">
        <Icon
          className="w-3 h-3 mr-1 flex-shrink-0"
          style={{ color: navyAccent }}
        />
        <span className="truncate">{text}</span>
      </div>
    );
  };

  // ---- Normalize skills so we can always render like screenshot ----
  const normalizeSkills = () => {
    const list = skillsArray;
    const categories = [];

    list.forEach((s) => {
      if (!s) return;

      // { category, items / skills }
      if (
        typeof s === 'object' &&
        s.category &&
        (Array.isArray(s.items) || Array.isArray(s.skills))
      ) {
        const items = Array.isArray(s.items) ? s.items : s.skills;
        categories.push({
          label: s.category,
          items: items.filter(Boolean).map(String),
        });
        return;
      }

      // original skills object style
      if (
        typeof s === 'object' &&
        !s.category &&
        !s.proficiency &&
        !s.name &&
        !s.label
      ) {
        Object.entries(s).forEach(([key, value]) => {
          const arr = Array.isArray(value) ? value : [value];
          categories.push({
            label: key,
            items: arr.filter(Boolean).map(String),
          });
        });
        return;
      }

      // simple string skills
      if (typeof s === 'string' || typeof s === 'number') {
        categories.push({
          label: 'Skills',
          items: [String(s)],
        });
        return;
      }

      // objects with name/label only
      if (typeof s === 'object' && (s.name || s.label)) {
        categories.push({
          label: 'Skills',
          items: [String(s.name || s.label)],
        });
        return;
      }

      // objects with proficiency
      if (typeof s === 'object' && s.proficiency !== undefined) {
        categories.push({
          label: s.name || s.label || 'Skill',
          items: [`${s.proficiency}%`],
        });
      }
    });

    // fallback to static defaults if nothing
    if (!categories.length) {
      Object.entries(resumeData.skills).forEach(([key, value]) => {
        const arr = Array.isArray(value) ? value : [value];
        categories.push({
          label: key,
          items: arr.filter(Boolean).map(String),
        });
      });
    }

    return categories;
  };

  const normalizedSkills = normalizeSkills();

  // Awards behavior like TemplateGracePerfect (with fallback)
  const awardsToShow = awardsArray.length
    ? awardsArray
    : [
        'Oct 2024 | Employee of the Year',
        'Dec 2025 | Best Employee',
      ];

  // ---- RENDER ----
  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 flex justify-center font-sans text-gray-900">
      <div className="w-full max-w-4xl bg-white p-6 md:p-4">
        {/* HEADER */}
        <header
          className="mb-4 text-center pb-2 border-b-4"
          style={{ borderColor: darkText }}
        >
          <h1
            className="text-4xl font-extrabold tracking-widest uppercase mb-1"
            style={{ color: darkText }}
          >
            {merged.name}
          </h1>
          <h2 className="text-sm tracking-wide uppercase font-medium text-gray-600">
            {merged.title}
          </h2>
        </header>

        {/* CONTACT BAR */}
        <div className="flex flex-wrap justify-center mb-6 pb-4 border-b border-gray-300">
          <ContactItem icon={Phone} text={merged.phone} />
          <ContactItem icon={Mail} text={merged.email} />
          <ContactItem icon={Globe} text={merged.website} />
          <ContactItem icon={MapPin} text={headerLocation} />

          {/* SOCIAL LINKS – inline with others, wrap when needed */}
          {normalizedSocialLinks.length > 0 &&
            normalizedSocialLinks.map((link, idx) => (
              <div key={idx} className="flex items-center text-xs mx-3 text-gray-700">
                <SocialLinkDisplay link={link} />
              </div>
            ))
          }
        </div>

        {/* SUMMARY */}
        {isSectionVisible('summary') && (
          <section className="mb-6">
            <h3
              className="text-base font-extrabold tracking-wider uppercase pb-0.5 mb-2 border-b-2 cursor-pointer"
              style={{ color: darkText, borderColor: navyAccent }}
              onClick={() => onClickSection && onClickSection('summary')}
            >
              Profile
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed italic">
              {merged.summary ||
                'A dedicated professional with extensive experience in the field.'}
            </p>
          </section>
        )}

        {/* EXPERIENCE */}
        {isSectionVisible('experience') && (
          <section className="mb-6">
            <h3
              className="text-base font-extrabold tracking-wider uppercase pb-0.5 mb-3 border-b-2 cursor-pointer"
              style={{ color: darkText, borderColor: navyAccent }}
              onClick={() => onClickSection && onClickSection('experience')}
            >
              Professional Experience
            </h3>
            {experiences.map((job, index) => {
              const dateText = getDateText(job) || job.years || '';
              const jobLocation =
                job.location || job.place || job.city || '';

              return (
                <div key={index} className="mb-4 pb-2">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-bold uppercase">
                      {job.role || job.title || ''}
                    </h4>
                    <p
                      className="text-xs font-semibold whitespace-nowrap"
                      style={{ color: navyAccent }}
                    >
                      {dateText}
                    </p>
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h5 className="text-sm font-medium italic text-gray-700">
                      {job.company || ''}
                    </h5>
                    <p className="text-xs text-gray-500">{jobLocation}</p>
                  </div>
                  <ul className="list-disc list-outside ml-5 space-y-0.5 text-xs text-gray-700 leading-snug">
                    {renderExperienceItems(job)}
                  </ul>
                </div>
              );
            })}
          </section>
        )}

        {/* EDUCATION + AWARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isSectionVisible('education') && (
            <section className="col-span-2">
              <h3
                className="text-base font-extrabold tracking-wider uppercase pb-0.5 mb-3 border-b-2 cursor-pointer"
                style={{ color: darkText, borderColor: navyAccent }}
                onClick={() => onClickSection && onClickSection('education')}
              >
                Education
              </h3>
              {education.map((edu, index) => {
                const dateText = getDateText(edu) || edu.years || '';
                const eduLocation =
                  edu.location || edu.place || edu.city || '';

                return (
                  <div key={index} className="mb-2">
                    <div className="flex justify-between items-start">
                      <h4
                        className="text-sm font-bold"
                        style={{ color: darkText }}
                      >
                        {edu.course || edu.degree || ''}
                      </h4>
                      <p
                        className="text-xs font-semibold whitespace-nowrap"
                        style={{ color: navyAccent }}
                      >
                        {dateText}
                      </p>
                    </div>
                    <h5 className="text-sm italic text-gray-600">
                      {edu.school || edu.institution || ''}
                    </h5>
                    {eduLocation && (
                      <p className="text-xs text-gray-500">{eduLocation}</p>
                    )}
                    {renderEducationItems(edu) && (
                      <ul className=" list-outside ml-1 mt-1 space-y-0.5 text-xs text-gray-700 leading-snug">
                        {renderEducationItems(edu)}
                      </ul>
                    )}
                  </div>
                );
              })}
            </section>
          )}

          {/* AWARDS – single, with bullet descriptions */}
          {isSectionVisible('awards') && (
            <section className="col-span-1">
              <h3
                className="text-base font-extrabold tracking-wider uppercase pb-0.5 mb-3 border-b-2 cursor-pointer"
                style={{ color: darkText, borderColor: navyAccent }}
                onClick={() => onClickSection && onClickSection('awards')}
              >
                Awards
              </h3>

              <div className="space-y-3 text-[13px] text-gray-700 leading-snug">
                {awardsToShow.map((a, i) => {
                  if (typeof a === 'string') {
                    // simple string awards
                    return <div key={i}>{a}</div>;
                  }

                  // object-based awards (TemplateGracePerfect-style)
                  const title = a.title || a.name || a.award || 'Award';
                  const issuer =
                    a.issuer || a.organization || a.company || '';
                  const date = a.date || a.year || '';
                  const description =
                    a.description || a.desc || a.details || '';

                  const descLines = Array.isArray(description)
                    ? description
                    : typeof description === 'string'
                      ? description
                          .split('\n')
                          .map((l) => l.trim())
                          .filter(Boolean)
                      : [];

                  return (
                    <div key={i}>
                      <div className="font-semibold text-blue-900">
                        {title}
                      </div>
                      {(issuer || date) && (
                        <div className="text-[12px] text-gray-600">
                          {issuer}
                          {issuer && date ? ' • ' : ''}
                          {date}
                        </div>
                      )}
                      {descLines.length > 0 && (
                        <ul className="list-disc ml-5 mt-1 space-y-0.5 text-[12px] text-gray-700">
                          {descLines.map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {/* TECHNICAL & CORE COMPETENCIES (skills) */}
        {isSectionVisible('skills') && (
          <section className="mt-6">
            <h3
              className="text-base font-extrabold tracking-wider uppercase pb-0.5 mb-3 border-b-2 cursor-pointer"
              style={{ color: darkText, borderColor: navyAccent }}
              onClick={() => onClickSection && onClickSection('skills')}
            >
              Technical &amp; Core Competencies
            </h3>

            {normalizedSkills.map((cat, idx) => (
              <div key={idx} className="mb-2.5">
                <span
                  className="text-sm font-bold mr-2 uppercase"
                  style={{ color: navyAccent }}
                >
                  {cat.label}:
                </span>
                <span className="text-xs text-gray-700 leading-relaxed">
                  {cat.items.join(' • ')}
                </span>
              </div>
            ))}
          </section>
        )}
      </div>
      <style jsx global>{`
        /* Make social link text same size & color as other contact items */
        a.social-link {
          font-size: 0.75rem !important;          /* text-xs */
          color: #374151 !important;              /* gray-700 */
        }

        a.social-link span {
          font-size: 0.75rem !important;          /* override inline 14px */
          line-height: 1rem !important;
          color: #374151 !important;              /* gray-700 */
        }

        /* Icon color & size like other contact icons */
        a.social-link svg {
          width: 0.75rem;                         /* 12px */
          height: 0.75rem;
          stroke: ${navyAccent};
        }
      `}</style>
    </div>
  );
};

export default Template47;