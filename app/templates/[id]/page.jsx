'use client';

import { Suspense, use } from 'react';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';
import { PDFProvider } from '@/contexts/PDFContext';
import Header from '@/components/TemplateHeader/Header';

const templateComponents = {
  Template01: dynamic(() => import('@/components/templates/Template01'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
  Template02: dynamic(() => import('@/components/templates/Template02'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
  Template03: dynamic(() => import('@/components/templates/Template03'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
  Template04: dynamic(() => import('@/components/templates/Template04'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
  Template05: dynamic(() => import('@/components/templates/Template05'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
};

function TemplateLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}

export default function TemplatePage({ params }) {
  const { id } = use(params);
  const TemplateComponent = templateComponents[id];

  if (!TemplateComponent) {
    notFound();
  }

  return (
    <PDFProvider>
      <Header />
      <Suspense fallback={<TemplateLoader />}>
        <TemplateComponent />
      </Suspense>
    </PDFProvider>
  );
}