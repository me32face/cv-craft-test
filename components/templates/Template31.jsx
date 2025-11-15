'use client';
import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Template31({ data }) {
  const handleDownload = async () => {
    const element = document.getElementById('cv-preview');
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('cv-template.pdf');
  };

  // destructure + fallback for flat data
  const {
    name,
    title,
    phone,
    email,
    address,
    portfolio,
    experienceTitle,
    experienceDescription,
    educationTitle,
    educationDetails,
    certificateOne,
    certificateTwo,
    experiences,
    education,
    certificates,
  } = data || {};

  // normalize single fields into arrays so template always renders
  const expList = experiences?.length
    ? experiences
    : experienceTitle
      ? [{ title: experienceTitle, bullets: [experienceDescription] }]
      : [];

  const eduList = education?.length
    ? education
    : educationTitle
      ? [{ institution: educationTitle, degree: educationDetails, bullets: [] }]
      : [];

  const certList = certificates?.length
    ? certificates
    : certificateOne || certificateTwo
      ? [
        { title: certificateOne, org: '' },
        { title: certificateTwo, org: '' },
      ].filter(c => c.title)
      : [];

  return (
    <div className="flex flex-col items-center p-10 bg-gray-100 min-h-screen">
      <div
        id="cv-preview"
        className="w-[210mm] h-[297mm] bg-white text-gray-900 shadow p-[16mm] overflow-hidden relative transition-all"
        style={{
          fontFamily: 'Inter, Roboto, system-ui, sans-serif',
        }}
      >
        {/* HEADER */}
        <header className="flex justify-between items-start pb-4 border-b border-gray-300 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            {name || 'Your Name'}
          </h1>
          <p className="text-sm text-gray-700 text-right flex items-center">
            {title || 'Your Title'}
          </p>
        </header>

        {/* CONTACT */}
        <section className="flex gap-8 border-b border-gray-300 pb-4 mb-4">
          <div className="w-[25%]">
            <h3 className="text-xs font-semibold uppercase text-gray-700 tracking-wider">
              CONTACT
            </h3>
          </div>
          <div className="w-[75%] grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-700">
            <span>Phone: {phone || 'Your Phone'}</span>
            <span>Email: {email || 'Your Email'}</span>
            <span>Address: {address || 'Your Address'}</span>
            <span>Portfolio: {portfolio || 'Your Portfolio'}</span>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="flex gap-8 border-b border-gray-300 pb-4 mb-4">
          <div className="w-[25%]">
            <h3 className="text-xs font-semibold uppercase text-gray-700 tracking-wider">
              PROFESSIONAL EXPERIENCE
            </h3>
          </div>
          <div className="w-[75%] text-sm space-y-6">
            {expList.map((ex, idx) => (
              <div key={idx}>
                <div className="font-semibold">{ex.title}</div>
                <ul className="ml-3 text-xs space-y-1">
                  {ex.bullets?.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* EDUCATION */}
        <section className="flex gap-8 border-b border-gray-300 pb-4 mb-4">
          <div className="w-[25%]">
            <h3 className="text-xs font-semibold uppercase text-gray-700 tracking-wider">
              EDUCATION
            </h3>
          </div>
          <div className="w-[75%] text-sm space-y-4">
            {eduList.map((ed, idx) => (
              <div key={idx}>
                <div className="font-semibold">{ed.institution}</div>
                <div className="text-xs text-gray-600 mb-2">{ed.degree}</div>
                {ed.bullets?.length > 0 && (
                  <ul className="ml-3 text-xs space-y-1 text-gray-700">
                    {ed.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span>•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>


        {/* CERTIFICATES */}
        {certList.length > 0 && (
          <section className="flex gap-8  pb-4 mb-4">
            <div className="w-[25%]">
              <h3 className="text-xs font-semibold uppercase text-gray-700 tracking-wider">
                CERTIFICATES
              </h3>
            </div>
            <div className="w-[75%] text-sm space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {certList.map((cert, idx) => (
                  <div key={idx} className="space-y-1  pb-2">
                    <div className="font-semibold">
                      {cert.title || "Certificate Title"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {cert.org || "Organization"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
