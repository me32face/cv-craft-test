'use client';
import React from 'react';
import { FiPhone, FiMail, FiMapPin, FiLink, FiLinkedin } from 'react-icons/fi';
import { GiLaurelsTrophy } from 'react-icons/gi';
import { BsFillBriefcaseFill } from 'react-icons/bs';
import { AiFillTool } from 'react-icons/ai';
import { MdOutlineLanguage } from 'react-icons/md';
import { FaGithub } from 'react-icons/fa';
import { renderLanguage } from '../cvbuilder/inputsections/LanguagesInput';
import SocialLinkDisplay from "../SocialLinkDisplay";

export default function TemplateFromRefs({ data = {}, onClickSection }) {
  const toArray = (value) =>
    !value ? [] : Array.isArray(value) ? value : [value];

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const experiences = toArray(data?.experiences);
  const education = toArray(data?.education);
  const certificates = toArray(data?.certificates);
  const languages = toArray(data?.languages);
  const awards = toArray(data?.awards);
  const references = toArray(data?.references);
  const projects = toArray(data?.projects);
  const socialLinks = toArray(data?.socialLinks);

  const renderDescription = (text, format) => {
    if (!text) return null;

    const hasBulletChar = text.includes("•");
    const looksNumbered = /^\s*\d+\./m.test(text);

    let lines = text.split(/\r?\n/);

    if (lines.length === 1 && hasBulletChar) {
      lines = text.split("•");
    }

    lines = lines
      .map(line => line.trim())
      .filter(line => line.length > 0);

    if (!lines.length) return null;

    if (format === "bullet" || (!format && hasBulletChar)) {
      return (
        <ul className="mt-1 text-[11px] text-gray-700 leading-relaxed list-disc list-outside pl-5 space-y-1">
          {lines.map((line, idx) => (
            <li key={idx} className="break-words">
              {line.replace(/^•\s*/, "")}
            </li>
          ))}
        </ul>
      );
    }

    if (format === "number" || (!format && looksNumbered)) {
      return (
        <ol className="mt-1 text-[11px] text-gray-700 leading-relaxed list-decimal list-outside pl-5 space-y-1">
          {lines.map((line, idx) => (
            <li key={idx} className="break-words">
              {line.replace(/^\d+\.\s*/, "")}
            </li>
          ))}
        </ol>
      );
    }

    return (
      <p className="text-[11px] mt-1 text-gray-700 leading-relaxed break-words">
        {text}
      </p>
    );
  };

  const handleClick = (key) => {
    if (typeof onClickSection === 'function') onClickSection(key);
  };

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

  const CONTENT_GUTTER_CLASS = 'pl-11';

  const defaultAwards = [
    'Oct 2024 | Employee of the Year',
    'Dec 2025 | Best Employee',
  ];

  const defaultReferences = [
    {
      name: 'Harumi Kobayashi',
      title: 'CEO',
      phone: '123-456-7890',
      email: 'hello@reality.com',
    },
    {
      name: 'Bailey Dupont',
      title: 'CEO',
      phone: '123-456-7890',
      email: 'hello@reality.com',
    },
  ];

  const referenceItems = references.length ? references : defaultReferences;

  return (
    <div
      id="pdf-template"
      className="mx-auto bg-white shadow-sm print:shadow-none print:border-0"
      style={{
        width: '794px',
        minHeight: '1123px',
        margin: '0 auto',
        padding: 32,
        boxSizing: 'border-box',
        fontFamily: 'Inter, Poppins, Arial, sans-serif',
      }}
    >
      <div className="flex gap-6 items-start">
        {/* LEFT */}
        <aside className="cv-sidebar w-1/3 pr-4 pl-2">
          <div className="mb-4 flex justify-center">
            {data?.profileImage ? (
              <img
                src={data.profileImage}
                alt="profile"
                className={`w-28 h-28 object-cover ${
                  data.imageShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                }`}
              />
            ) : (
              <div
                className={`w-28 h-28 flex items-center justify-center ${
                  data.imageShape === 'circle' ? 'rounded-full' : 'rounded-lg'
                } bg-green-50`}
              >
                <span className="text-2xl text-gray-400 font-bold">
                  {(data?.name || 'YN')
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </span>
              </div>
            )}
          </div>

          {/* Contacts */}
          <div className="mb-5">
            <div className="flex items-center gap-2 text-green-700 font-semibold pb-2">
              <Icon>
                <FiMail className="w-4 h-4" />
              </Icon>
              <span>CONTACTS</span>
            </div>
            <div className="text-gray-700 text-[12px] space-y-2 pl-2">
              <div className="flex items-center gap-2">
                <IconSmall>
                  <FiPhone className="w-4 h-4" />
                </IconSmall>
                <span className='pl-1.5'>{data?.phone || 'Phone'}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconSmall>
                  <FiMail className="w-4 h-4" />
                </IconSmall>
                <span className='pl-1.5'>{data?.email || 'Email'}</span>
              </div>
              {data?.linkedin && (
                <div className="flex items-center gap-2">
                  <IconSmall>
                    <FiLinkedin className="w-4 h-4" />
                  </IconSmall>
                  <a
                    className="pl-1.5 no-underline hover:underline text-green-800 break-words"
                    href={data.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.linkedin}
                  </a>
                </div>
              )}
              {data?.github && (
                <div className="flex items-center gap-2">
                  <IconSmall>
                    <FaGithub className="w-4 h-4" />
                  </IconSmall>
                  <a
                    className="no-underline hover:underline text-green-800 break-words pl-1.5"
                    href={data.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.github}
                  </a>
                </div>
              )}
              {data?.portfolio ? (
                <div className="flex items-center gap-2">
                  <IconSmall>
                    <FiLink className="w-4 h-4" />
                  </IconSmall>
                  <a
                    className="no-underline hover:underline text-green-800 break-words pl-1.5"
                    href={data.portfolio}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {data.portfolio}
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <IconSmall>
                    <FiMapPin className="w-4 h-4" />
                  </IconSmall>
                  <span className='pl-1.5'>{data?.address || 'Location'}</span>
                </div>
              )}

            {data?.visibleSections?.socialLinks !== false &&
              socialLinks.length > 0 && (
                <div className="pt-0 flex flex-col gap-1 pl-0.5">
                  {socialLinks.map((link, i) => (
                    <SocialLinkDisplay key={i} link={link} />
                  ))}
                </div>
              )
            }
            </div>
          </div>

          {/* Awards*/}
          {data?.visibleSections?.awards !== false && (
            <div className="mb-5">
              <div className="flex items-center gap-2 text-green-700 font-semibold pb-2">
                <Icon>
                  <GiLaurelsTrophy className="w-4 h-4" />
                </Icon>
                <span>AWARDS</span>
              </div>

              <div className="text-gray-700 text-[12px] space-y-3 pl-3">
                {(awards.length ? awards : defaultAwards).map((award, i) => {
                  if (typeof award === 'string') {
                    return (
                      <div key={i} className="flex items-start">
                        <span className="text-[16px] leading-none mr-2 mt-[2px]">
                          •
                        </span>
                        <span className="leading-tight pl-3.5">{award}</span>
                      </div>
                    );
                  }

                  // Award object from AwardInput
                  const title = award.title || 'Award Title';
                  const issuer = award.issuer || '';
                  const date = award.date || '';
                  const description = award.description || '';

                  return (
                    <div key={i} className="flex items-start">
                      <span className="text-[16px] leading-none mr-2 mt-[4px]">
                        •
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold">{title}</div>
                        {(issuer || date) && (
                          <div className="text-[11px] text-gray-500">
                            {issuer}
                            {issuer && date ? ' • ' : ''}
                            {date}
                          </div>
                        )}
                        {description && (
                          <div className="text-[11px] text-gray-600 mt-1">
                            {description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Certificates / Key Achievements */}
          {data?.visibleSections?.certificates !== false && (
            <div className="mb-5">
              <div className="flex items-center gap-2 text-green-700 font-semibold pb-2">
                <Icon>
                  <GiLaurelsTrophy className="w-4 h-4" />
                </Icon>
                <span
                  className="cursor-pointer"
                  onClick={() => handleClick('certificates')}
                >
                  KEY ACHIEVEMENTS
                </span>
              </div>
              <div className="text-gray-700 text-[12px] space-y-3 pl-3">
                {certificates.map((cert, i) => (
                  <div key={i} className="flex items-start">
                    <span className="text-[16px] leading-none mr-2 pr-3.5 mt-[4px]">
                      •
                    </span>
                    <div>
                      <div className="font-semibold">
                        {cert.name || cert.title || 'Certification'}
                      </div>
                      {(cert.issuer || cert.year) && (
                        <div className="text-[12px] text-gray-500">
                          {cert.issuer}
                          {cert.issuer && cert.year ? ' • ' : ''}
                          {cert.year || ''}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {data?.visibleSections?.skills !== false && (
            <div className="mb-5">
              <div className="flex items-center gap-2 text-green-700 font-semibold pb-2">
                <Icon>
                  <AiFillTool className="w-4 h-4" />
                </Icon>
                <span>SKILLS</span>
              </div>

              <div className="text-gray-700 pl-3.5">
                {(data?.skills || [
                  'Management Skills',
                  'Creativity',
                  'Digital Marketing',
                  'Negotiation',
                ]).map((s, i) => {
                  if (typeof s === 'string') {
                    return (
                      <div
                        key={i}
                        className="flex items-start mb-1 text-[12px]"
                      >
                        <span className="text-[20px] leading-none mr-5">
                          •
                        </span>
                        <span>{s}</span>
                      </div>
                    );
                  }

                  if (s.proficiency !== undefined) {
                    return (
                      <div key={i} className="mb-2 pl-6">
                        <div className="flex justify-between items-center">
                          <span className="text-[12px]">{s.name}</span>
                          <span className="text-[10px] opacity-70">
                            {s.proficiency}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className="bg-gray-700 h-2 rounded-full transition-all"
                            style={{ width: `${s.proficiency}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  }

                  if (s.category && s.skills) {
                    return (
                      <div key={i} className="mb-1 text-[12px] pl-7">
                        <span className="font-medium">{s.category}:</span>{' '}
                        {s.skills
                          .filter((item) => item && item.trim())
                          .join(', ')}
                      </div>
                    );
                  }

                  return (
                    <div
                      key={i}
                      className="flex items-start mb-1 text-[12px]"
                    >
                      <span className="text-[16px] leading-none mr-2">
                        •
                      </span>
                      <span>{s.name || 'Skill'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Languages */}
          {data?.visibleSections?.languages !== false && (
            <div>
              <div className="flex items-center gap-2 text-green-700 font-semibold pb-2">
                <Icon>
                  <MdOutlineLanguage className="w-4 h-4" />
                </Icon>
                <span>LANGUAGES</span>
              </div>
              <div className="text-gray-700 pl-10">
                {(languages.length
                  ? languages
                  : ['Spanish', 'Arabic', 'English']
                ).map((l, i) => renderLanguage(l, i))}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT */}
        <main className="w-2/3 pl-3 mt-6">
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 pl-3">
              {data?.name || 'YOUR NAME'}
            </h1>
            <div className="inline-block mt-3 ">
              <div>
                <span className="text-green-800 font-semibold text-[12px] px-4 py-1 inline-block text-left">
                  {data?.title || 'THE ROLE YOU ARE APPLYING FOR'}
                </span>
              </div>
            </div>
          </header>

          {/* Summary */}
          {data?.visibleSections?.summary !== false && (
            <section className="mb-6 cv-item">
              <div className="flex items-center gap-3 pb-2">
                <Icon>
                  <FiMail className="w-4 h-4" />
                </Icon>
                <div
                  className="text-green-700 font-semibold cursor-pointer"
                  onClick={() => handleClick('summary')}
                >
                  SUMMARY
                </div>
              </div>
              <div className={CONTENT_GUTTER_CLASS}>
                <p className="text-gray-600 leading-5 text-xs">
                  {data?.summary ||
                    'A dedicated professional with extensive experience in the field.'}
                </p>
              </div>
            </section>
          )}

          {/* Projects */}
          {data?.visibleSections?.projects !== false && (
            <section className="mb-6">
              <div className="flex items-center gap-3 pb-2">
                <Icon>
                  <FiLink className="w-4 h-4" />
                </Icon>
                <div
                  className="text-green-700 font-semibold cursor-pointer"
                  onClick={() => handleClick('projects')}
                >
                  PROJECTS
                </div>
              </div>

              <div className={CONTENT_GUTTER_CLASS}>
                {projects.map((project, i) => (
                  <div key={i} className="mb-5 cv-item">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-semibold text-gray-800 text-[13px]">
                            {project.name}
                          </div>
                        </div>
                      </div>
                      <div className="text-[12px] text-gray-500 text-right min-w-[110px]">
                        {project.year}
                      </div>
                    </div>

                    <div className="mt-3">
                      {renderDescription(project.desc, project.descFormat)}
                    </div>

                    {project.link && (
                      <div className="mt-2">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 underline project-link"
                        >
                          {project.useCustomLabel ? project.linkLabel : project.link}
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {data?.visibleSections?.experience !== false && (
            <section className="mb-6">
              <div className="flex items-center gap-3 pb-2">
                <Icon>
                  <BsFillBriefcaseFill className="w-4 h-4" />
                </Icon>
                <div
                  className="text-green-700 font-semibold cursor-pointer"
                  onClick={() => handleClick('experience')}
                >
                  EXPERIENCE
                </div>
              </div>

              <div className={CONTENT_GUTTER_CLASS}>
                {experiences.map((exp, i) => (
                  <div key={i} className="mb-6 cv-item">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="font-semibold text-gray-800 text-[13px]">
                            {exp.role} -
                          </div>
                          {exp.company && (
                            <span className="text-[12px] text-gray-800">
                              {exp.company}
                            </span>
                          )}
                        </div>
                        {exp.location && (
                          <div className="text-[11px] text-gray-500 mt-1">
                            {exp.location}
                          </div>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 text-right min-w-[110px]">
                        {exp.start}
                        {exp.start && (exp.end || exp.current) && ' - '}
                        {exp.current ? 'Present' : exp.end}
                      </div>
                    </div>

                    <div className="mt-3">
                      {renderDescription(exp.desc, exp.descFormat)}
                    </div>

                    {exp.reference && (
                      <p className="text-[10px] mt-1 italic text-gray-600 break-words">
                        Reference: {exp.reference}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data?.visibleSections?.education !== false && (
            <section className="mb-6">
              <div className="flex items-center gap-3 pb-2">
                <Icon>
                  <svg
                    className="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2L1 7l11 5 9-4v6h2V6L12 2z" />
                  </svg>
                </Icon>
                <div
                  className="text-green-700 font-semibold cursor-pointer"
                  onClick={() => handleClick('education')}
                >
                  EDUCATION
                </div>
              </div>

              <div className={CONTENT_GUTTER_CLASS}>
                {education.map((edu, i) => (
                  <div
                    key={i}
                    className="cv-item flex justify-between items-start mb-4"
                  >
                    <div>
                      <div className="font-semibold text-gray-800 text-[14px]">
                        {edu.degree}
                      </div>
                      <div className="text-[12px] text-gray-600">
                        {edu.school}
                      </div>
                      {edu.field && (
                        <div className="text-[11px] text-gray-600 mt-1">
                          {edu.field}
                        </div>
                      )}

                      <div className="mt-2">
                        {renderDescription(edu.description, edu.descFormat)}
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-500">
                      {edu.start && formatDate(edu.start)}
                      {edu.start && (edu.end || edu.current) && ' - '}
                      {edu.current ? 'Present' : edu.end && formatDate(edu.end)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {data?.visibleSections?.references !== false && (
            <section className="mt-3">
              <div className="flex items-center gap-3 pb-2">
                <Icon>
                  <FiPhone className="w-4 h-4" />
                </Icon>
                <div className="text-green-700 font-semibold">
                  REFERENCES
                </div>
              </div>

              <div className={CONTENT_GUTTER_CLASS}>
                {referenceItems.map((r, i) => (
                  <div key={i} className="mb-3">
                    <div className="font-semibold text-[13px]">
                      {r.name}
                    </div>
                    <div className="text-[12px]">
                      {r.title}
                    </div>
                    {r.company && (
                      <div className="text-[12px]">
                        {r.company}
                      </div>
                    )}
                    {r.phone && (
                      <div className="text-[12px]">
                        Phone: {r.phone}
                      </div>
                    )}
                    {r.email && (
                      <div className="text-[12px]">
                        Email: {r.email}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
      <style jsx global>{`
        /* SOCIAL LINKS — make them match the other contact rows */
        .cv-sidebar a.social-link {
          display: flex !important;
          align-items: center !important;
          font-size: 0.75rem !important;      /* 12px, like other contacts */
          color: #374151 !important;          /* gray-700 */
          line-height: 1.25 !important;
          gap: 0 !important;                  /* we'll control spacing manually */
          text-decoration: none !important;
        }

        /* First span = icon container (behave like IconSmall) */
        .cv-sidebar a.social-link > span:first-child {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 1.25rem !important;          /* 20px, like IconSmall w-5 */
          height: 1.25rem !important;
          flex-shrink: 0 !important;
        }

        /* Second span = label text (behave like pl-1.5) */
        .cv-sidebar a.social-link > span:last-child {
          margin-left: 0.75rem !important;   /* pl-1.5 ≈ 6px */
          font-size: 0.75rem !important;      /* 12px */
          color: #374151 !important;          /* gray-700 */
          line-height: 2 !important;
        }

        /* Icon itself */
        .cv-sidebar a.social-link svg {
          width: 1rem !important;             /* 16px, like w-4 */
          height: 1rem !important;
          stroke: #4a5568 !important;         /* gray-500, same tone as others */
          flex-shrink: 0 !important;
        }
      `}</style>
    </div>
  );
}