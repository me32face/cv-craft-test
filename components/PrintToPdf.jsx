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

    // Temporarily remove scaling if any
    const prevTransform = el.style.transform;
    el.style.transform = 'scale(1)';
    el.style.transformOrigin = 'top left';

    const canvas = await html2canvas(el, {
      scale: 2,           // higher scale for crisp output
      useCORS: true,
      allowTaint: true,
      scrollY: -window.scrollY
    });

    const imgData = canvas.toDataURL('image/png');

    // A4 page size in pixels at 72 DPI
    const pdf = new jsPDF({
      unit: 'px',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Fit canvas image to A4
    const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(fileName);

    // Restore original transform
    el.style.transform = prevTransform;
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
