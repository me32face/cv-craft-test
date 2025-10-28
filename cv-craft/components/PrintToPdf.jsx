'use client';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React from 'react';

export default function PrintToPdf({ rootId = 'resume-root', fileName = 'resume.pdf' }) {
  const downloadPdf = async () => {
    const el = document.getElementById(rootId);
    if (!el) {
      alert('Could not find resume to export.');
      return;
    }

    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      unit: 'px',
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(fileName);
  };

  return (
    <button
      onClick={downloadPdf}
      className="px-3 py-1 rounded text-sm bg-emerald-600 text-white hover:bg-emerald-700"
    >
      Download as PDF
    </button>
  );
}
