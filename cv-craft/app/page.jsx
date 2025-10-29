'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

export default function Home() {
  const templates = [
    { id: 'Template01', component: dynamic(() => import('@/components/templates/Template01')) },
    { id: 'Template02', component: dynamic(() => import('@/components/templates/Template02')) },
    { id: 'Template03', component: dynamic(() => import('@/components/templates/Template03')) },
    { id: 'Template04', component: dynamic(() => import('@/components/templates/Template04')) },
    { id: 'Template05', component: dynamic(() => import('@/components/templates/Template05')) },
   
  ];

  return (
    <main className="min-h-screen p-8 bg-gray-400 from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Pick a Template and Build Your Resume in Minutes!
        </h1>
        <p className="text-center mb-10 text-gray-600">
          Click any template to start editing and download as PDF.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.map((t) => {
            const TemplateComponent = t.component;
            return (
              <Link
                key={t.id}
                href={`/templates/${t.id}`}
                className="w-full max-w-[300px] bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden block"
              >
                {/* Template preview area */}
                <div className="w-full h-100 bg-gray-50 overflow-hidden scale-90 origin-top pointer-events-none">
                  <TemplateComponent />
                </div>

                {/* Label below preview */}
                {/* <div className="p-3 text-center text-lg font-semibold bg-gray-100 border-t">
                  {t.id}
                </div> */}
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
