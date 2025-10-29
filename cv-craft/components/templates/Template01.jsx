import React, { useState } from 'react';
import PrintToPdf from '@/components/PrintToPdf';
import ImageUploader from '@/components/ImageUploader';

export default function Template01() {
  const [loading, setLoading] = useState(false);

  const handleGenerateAI = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jordan Bennett',
          role: 'Systems Designer',
          skills: 'System Architecture, Cloud, Documentation',
          experience: '5 years in system design and software architecture',
        }),
      });

      const data = await res.json();

      const summaryEl = document.getElementById('summary-text');
      if (data.summary && summaryEl) {
        summaryEl.innerText = data.summary;
      } else {
        alert('No summary generated.');
      }
    } catch (err) {
      console.error(err);
      alert('Error generating summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex items-start justify-center">
      <div className="w-full max-w-4xl">
        {/* Resume Layout */}
        <div id="resume-root" className="bg-white rounded p-6 shadow">
          <div className="flex gap-4 items-center">
            <div className="w-28 h-28 rounded-full overflow-hidden border">
              <div className="w-full h-full">
                <ImageUploader
                  keyName="photo1"
                  initial="/profile-placeholder.png"
                  className="w-full h-full"
                />
              </div>
            </div>
            <div>
              <h1
                contentEditable
                suppressContentEditableWarning
                className="text-2xl font-bold font-serif"
              >
                Jordan Bennett
              </h1>
              <p
                contentEditable
                suppressContentEditableWarning
                className="text-sm text-gray-600"
              >
                Systems Designer — Architecting resilient and scalable systems
              </p>
            </div>
            <div className="ml-auto text-sm text-gray-600">
              <div contentEditable suppressContentEditableWarning>
                +123-456-7890
              </div>
              <div contentEditable suppressContentEditableWarning>
                hello@reallygreatsite.com
              </div>
            </div>
          </div>

          {/* Summary & Other Sections */}
          <div className="mt-4 grid md:grid-cols-2 gap-4 font-serif">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-indigo-700">Summary</h4>
                <button
                  onClick={handleGenerateAI}
                  disabled={loading}
                  className="px-2 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Generating...' : '✨ Generate with AI'}
                </button>
              </div>

              <p
                id="summary-text"
                contentEditable
                suppressContentEditableWarning
                className="mt-2 text-sm"
              >
                Systems Design Professional with extensive experience in
                architecture and cloud.
              </p>

              <h4 className="mt-4 font-semibold text-indigo-700">Experience</h4>
              <div contentEditable suppressContentEditableWarning className="mt-2">
                Senior Systems Engineer — The IT Company (2030–2035)
              </div>
            </div>

            <aside className="bg-gray-50 p-3 rounded">
              <h4 className="font-semibold text-indigo-700">Skills</h4>
              <ul
                className="mt-2 text-sm"
                contentEditable
                suppressContentEditableWarning
              >
                <li>System Architecture</li>
                <li>Cloud</li>
              </ul>
              <h4 className="mt-4 font-semibold text-indigo-700">Education</h4>
              <div
                contentEditable
                suppressContentEditableWarning
                className="text-sm mt-2"
              >
                Master — North State University (2025–2027)
              </div>
            </aside>
          </div>
        </div>

        {/* PDF Button */}
        <div className="mt-4 flex justify-end gap-2 print:hidden">
          <PrintToPdf rootId="resume-root" fileName="Template01.pdf" />
        </div>
      </div>
    </div>
  );
}
