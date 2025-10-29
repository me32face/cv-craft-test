'use client';

import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

export default function TemplatePage() {
  const { id } = useParams();

  const templates = {
    Template01: dynamic(() => import('@/components/templates/Template01')),
    Template02: dynamic(() => import('@/components/templates/Template02')),
    Template03: dynamic(() => import('@/components/templates/Template03')),
  };

  const Template = templates[id];

  if (!Template) {
    return <div className="p-10 text-center text-red-500">Template not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">{id} — Editable Mode</h1>
      <div className="w-full max-w-4xl border shadow-lg bg-white p-8 rounded-lg">
        <Template />
      </div>
    </div>
  );
}
