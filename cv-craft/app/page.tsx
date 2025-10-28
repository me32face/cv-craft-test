'use client';

import Link from 'next/link';

export default function Home() {
  const templates = Array.from({ length: 50 }, (_, i) => `Template${String(i + 1).padStart(2, '0')}`);

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          CV Maker — Professional Templates
        </h1>
        <p className="text-center mb-6">
          Click any template to edit and download as PDF.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {templates.map((t) => (
            <Link
              key={t}
              href={`/templates/${t}`}
              className="block bg-white p-4 rounded shadow text-center hover:shadow-md"
            >
              {t}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
