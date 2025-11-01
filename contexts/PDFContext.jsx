import React, { createContext, useContext, useState } from 'react';

const PDFContext = createContext();

export const PDFProvider = ({ children }) => {
  const [pdfFunction, setPdfFunction] = useState(null);

  const registerPDFFunction = (func) => {
    setPdfFunction(() => func);
  };

  const triggerPDF = () => {
    if (pdfFunction && typeof pdfFunction === 'function') {
      pdfFunction();
    } else {
      console.warn('No PDF function registered');
    }
  };

  return (
    <PDFContext.Provider value={{ registerPDFFunction, triggerPDF }}>
      {children}
    </PDFContext.Provider>
  );
};

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
};