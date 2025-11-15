'use client';
import React, { useRef, useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

const CVPage = () => {
  const cvRef = useRef(null);
  const [name, setName] = useState('Samira Alcaraz');
  const [title, setTitle] = useState('Mechanical Engineer');

  const [contact, setContact] = useState({
    phone: 'Phone: +123-456-7890',
    email: 'Email: cvcraft@gmail.com',
    address: 'Address: 123 Anywhere St., Any City',
    portfolio: 'Portfolio: www.cvcraft.in',
  });

  const [educationRight, setEducationRight] = useState([
    {
      id: 'edR1',
      institution: 'North State University | 2025–2027',
      degree: 'Master of Science in Mechanical Engineering',
      bullets: ['GPA: 3.8', 'Best Thesis Award'],
    },
    {
      id: 'edR2',
      institution: 'South City College | 2021–2025',
      degree: 'Bachelor of Science in Mechanical Engineering',
      bullets: ['GPA: 3.8', 'Editor-in-Chief, SCC Newsletter'],
    },
  ]);

  const [experiences, setExperiences] = useState([
    {
      id: 'exp1',
      title: 'Research and Development Engineer | 2030–2035',
      company: 'The Innovation Lab',
      bullets: [
        'Spearheaded the development of advanced materials, resulting in a 15% increase in product efficiency',
        'Conducted comprehensive experiments and data analysis, leading to three published journal papers',
        'Collaborated with cross-functional teams to ideate and prototype innovative solutions for industry-specific challenges',
      ],
    },
    {
      id: 'exp2',
      title: 'Mechanical Engineer | 2027–2030',
      company: 'Science and Tech Co.',
      bullets: [
        'Assisted in optimizing mechanical systems for manufacturing processes, improving production speed by 20%',
        'Drafted and implemented quality control procedures, reducing defects and inconsistencies by 30%',
        'Supported the creation of detailed project reports and documentation for senior stakeholders',
      ],
    },
  ]);

  const [certificates, setCertificates] = useState([
    { id: 'c1', title: 'Project Management | 2027', org: 'The Project Management Institute' },
    { id: 'c2', title: 'System Optimization | 2028', org: 'Scrum Learning Society' },
    { id: 'c3', title: 'Risk Management and Mitigation | 2028', org: 'Internal Auditors Team' },
    { id: 'c4', title: 'Vendor Relations | 2030', org: 'South City College' },
  ]);

  const onEdit = (setter) => (e) => setter(e.currentTarget.textContent);
  const updateContact = (f, v) => setContact((p) => ({ ...p, [f]: v }));

  const updateExpField = (id, f, v) =>
    setExperiences((p) => p.map((ex) => (ex.id === id ? { ...ex, [f]: v } : ex)));
  const updateExpBullet = (id, i, v) =>
    setExperiences((p) =>
      p.map((ex) =>
        ex.id === id ? { ...ex, bullets: ex.bullets.map((b, idx) => (idx === i ? v : b)) } : ex
      )
    );
  const addExpBullet = (id) =>
    setExperiences((p) => p.map((ex) => (ex.id === id ? { ...ex, bullets: [...ex.bullets, 'New point'] } : ex)));
  const delExpBullet = (id, i) =>
    setExperiences((p) => p.map((ex) => (ex.id === id ? { ...ex, bullets: ex.bullets.filter((_, idx) => idx !== i) } : ex)));
  const addExperience = () =>
    setExperiences((p) => [...p, { id: `exp${Date.now()}`, title: 'New Role | YYYY–YYYY', company: 'Company', bullets: ['Point'] }]);
  const removeExperience = (id) => setExperiences((p) => p.filter((ex) => ex.id !== id));

  const updateEduRField = (id, f, v) =>
    setEducationRight((p) => p.map((ed) => (ed.id === id ? { ...ed, [f]: v } : ed)));
  const updateEduRBullet = (id, i, v) =>
    setEducationRight((p) =>
      p.map((ed) =>
        ed.id === id ? { ...ed, bullets: ed.bullets.map((b, idx) => (idx === i ? v : b)) } : ed
      )
    );
  const addEduRBullet = (id) =>
    setEducationRight((p) => p.map((ed) => (ed.id === id ? { ...ed, bullets: [...ed.bullets, 'New item'] } : ed)));
  const delEduRBullet = (id, i) =>
    setEducationRight((p) => p.map((ed) => (ed.id === id ? { ...ed, bullets: ed.bullets.filter((_, idx) => idx !== i) } : ed)));
  const addEducationRight = () =>
    setEducationRight((p) => [...p, { id: `ed${Date.now()}`, institution: 'New Institution | YYYY–YYYY', degree: 'Degree', bullets: ['Detail'] }]);
  const removeEducationRight = (id) => setEducationRight((p) => p.filter((ed) => ed.id !== id));

  const updateCertificate = (id, f, v) =>
    setCertificates((p) => p.map((c) => (c.id === id ? { ...c, [f]: v } : c)));
  const addCertificate = () =>
    setCertificates((p) => [...p, { id: `c${Date.now()}`, title: 'New Certificate | YYYY', org: 'Org' }]);
  const removeCertificate = (id) => setCertificates((p) => p.filter((c) => c.id !== id));

  return (
    <div
      ref={cvRef}
      className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-lg p-[16mm]"
      style={{
        boxSizing: 'border-box',
        fontFamily: 'Inter, Roboto, system-ui, sans-serif',
      }}
    >
      {/* Header */}
      <header className="flex justify-between items-start pb-4 border-b border-gray-300 mb-4">
        <h1
          contentEditable
          suppressContentEditableWarning
          className="text-3xl font-bold tracking-tight"
          onBlur={onEdit(setName)}
        >
          {name}
        </h1>
        <p
          contentEditable
          suppressContentEditableWarning
          className="text-sm text-gray-700 text-right"
          onBlur={onEdit(setTitle)}
        >
          {title}
        </p>
      </header>

      <div className="space-y-6">
        {/* CONTACT */}
        <section className="flex gap-8 border-b border-gray-300 pb-4">
          <div className="w-[25%]">
            <h3 className="text-xs font-semibold uppercase text-gray-700 tracking-wider">
              CONTACT
            </h3>
          </div>
          <div className="w-[75%] grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-700">
            {Object.entries(contact).map(([key, val]) => (
              <span
                key={key}
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => updateContact(key, e.currentTarget.textContent)}
              >
                {val}
              </span>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="flex gap-8 border-b border-gray-300 pb-4">
          <div className="w-[25%]">
            <h3 className="text-xs font-semibold uppercase text-gray-700 tracking-wider">
              PROFESSIONAL EXPERIENCE
            </h3>
          </div>
          <div className="w-[75%] text-sm space-y-6">
            {experiences.map((ex) => (
              <div key={ex.id}>
                <div className="flex justify-between mb-2">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateExpField(ex.id, 'title', e.currentTarget.textContent)}
                    className="font-semibold"
                  >
                    {ex.title}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => addExpBullet(ex.id)} className="opacity-50 hover:opacity-100 text-xs">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeExperience(ex.id)} className="opacity-50 hover:opacity-100 text-xs">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <ul className="ml-3 text-xs space-y-1">
                  {ex.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateExpBullet(ex.id, i, e.currentTarget.textContent)}
                        className="flex-1 outline-none"
                      >
                        {b}
                      </span>
                      <button onClick={() => delExpBullet(ex.id, i)} className="opacity-50 hover:opacity-100">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={addExperience} className="text-xs opacity-50 hover:opacity-100 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Experience
            </button>
          </div>
        </section>

        {/* EDUCATION */}
        <section className="flex gap-8 border-b border-gray-300 pb-4">
          <div className="w-[25%]">
            <h3 className="text-xs font-semibold uppercase text-gray-700 tracking-wider">
              EDUCATION
            </h3>
          </div>
          <div className="w-[75%] text-sm space-y-4">
            {educationRight.map((ed) => (
              <div key={ed.id}>
                <div className="flex justify-between">
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateEduRField(ed.id, 'institution', e.currentTarget.textContent)}
                    className="font-semibold"
                  >
                    {ed.institution}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addEduRBullet(ed.id)} className="opacity-50 hover:opacity-100 text-xs">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeEducationRight(ed.id)} className="opacity-50 hover:opacity-100 text-xs">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => updateEduRField(ed.id, 'degree', e.currentTarget.textContent)}
                  className="text-xs text-gray-600 mb-2"
                >
                  {ed.degree}
                </div>
                <ul className="ml-3 text-xs space-y-1">
                  {ed.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="select-none">•</span>
                      <span
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateEduRBullet(ed.id, i, e.currentTarget.textContent)}
                        className="flex-1 outline-none"
                      >
                        {b}
                      </span>
                      <button onClick={() => delEduRBullet(ed.id, i)} className="opacity-50 hover:opacity-100">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button onClick={addEducationRight} className="text-xs opacity-50 hover:opacity-100 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add Education
            </button>
          </div>
        </section>

        {/* CERTIFICATES */}
        <section className="flex gap-8">
          <div className="w-[30%]">
            <h3 className="text-xs font-semibold uppercase text-gray-700 tracking-wider">
              CERTIFICATES
            </h3>
          </div>
          <div className="w-[70%] grid grid-cols-2 gap-4 text-xs text-gray-700">
            {certificates.map((c) => (
              <div key={c.id} className="relative group">
                <div contentEditable suppressContentEditableWarning onBlur={(e) => updateCertificate(c.id, 'title', e.currentTarget.textContent)}>
                  {c.title}
                </div>
                <div contentEditable suppressContentEditableWarning onBlur={(e) => updateCertificate(c.id, 'org', e.currentTarget.textContent)} className="text-gray-500 text-[11px]">
                  {c.org}
                </div>
                <button
                  onClick={() => removeCertificate(c.id)}
                  className="absolute right-0 top-0 p-1 text-gray-500 hover:text-red-600 opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addCertificate} className="text-xs opacity-50 hover:opacity-100 flex items-center gap-1 mt-3">
            <Plus className="w-3 h-3" /> Add Certificate
          </button>
        </section>
      </div>
    </div>
  );
};

export default function Template25Wrapper() {
  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
      >
        <div ref={cvRef} data-cv-page>
          <CVPage />
        </div>
      </div>
    </div>
  );
}
