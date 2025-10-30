'use client';

import Link from 'next/link';
import Image from 'next/image';
import TemplatePreview from '@/components/TemplatePreview';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const templates = [
    { id: 'Template01', name: 'Professional Classic', image: '/template/template01.png' },
    { id: 'Template02', name: 'Modern Minimal', image: '/template/template02.png' },
    { id: 'Template03', name: 'Creative Bold', image: '/template/template03.png' },
    { id: 'Template04', name: 'Executive Style', image: '/template/template04.png' },
    { id: 'Template05', name: 'Clean Layout', image: '/template/template05.png' },
    { id: 'Template06', name: 'Sample Layout', image: '/template/template06.png' },
  ];

  const duplicatedTemplates = [...templates, ...templates];

  const scrollPrev = () => {
    scrollRef.current?.scrollBy({ left: -640, behavior: 'smooth' });
  };

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 640, behavior: 'smooth' });
  };

  const updateActiveIndex = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollLeft = scrollContainer.scrollLeft;
    const cardWidth = 320;
    const index = Math.round(scrollLeft / cardWidth) % templates.length;
    setActiveIndex(index);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', updateActiveIndex);

    // const scroll = () => {
    //   const cardWidth = 320;
    //   const { scrollLeft } = scrollContainer;
    //   const maxScroll = templates.length * cardWidth;

    //   if (scrollLeft >= maxScroll) {
    //     scrollContainer.scrollLeft = 0;
    //   }

    //   scrollContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
    // };

    // const interval = setInterval(scroll, 3000);
    // return () => {
    //   clearInterval(interval);
    //   scrollContainer.removeEventListener('scroll', updateActiveIndex);
    // };
  }, [templates.length]);

  return (
    <main className="min-h-screen   from-gray-50 to-white">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-5xl font-bold mb-5 text-center text-gray-500">
          Professional Resume Templates
        </h1>
        <p className="text-center mb-7 text-gray-500 text-lg">
          Choose from our collection of expertly designed resume templates
        </p>

        <div className="flex justify-center gap-4 mb-10">
          {['All', 'Modern', 'Creative', 'Professional', 'Simple'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={activeFilter === filter
                ? "px-6 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-[#4F8DF9] to-[#8A3FFC] hover:opacity-90 transition cursor-pointer"
                : "px-4 py-2 border border-gray-400 rounded-full text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              }
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={scrollPrev}
            className="absolute left-10 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-10 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div ref={scrollRef} className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-6 min-w-max">
              {duplicatedTemplates.map((template, index) => (
                <Link
                  key={`${template.id}-${index}`}
                  href={`/templates/${template.id}`}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden block flex-shrink-0 w-80"
                >
                  <div className="p-4">
                    {template.image ? (
                      <Image
                        src={template.image}
                        alt={template.name}
                        width={288}
                        height={200}
                        className="w-full h-58 object-contain rounded-lg shadow-lg"
                      />
                    ) : (
                      <TemplatePreview templateId={template.id} />
                    )}
                  </div>
                  <div className="p-6 -mt-1">
                    <h3 className="text-gray-700 group-hover:text-gray-600 transition-colors">
                      {template.name.split(' ')[0]}
                    </h3>
                    <h3 className="font-bold text-xl text-gray-700 group-hover:text-gray-600 transition-colors">
                      {template.name}
                    </h3>

                    <div className="flex items-center justify-center mt-3">
                      <p className="text-sm text-gray-500 border border-gray-500 px-4 py-2 rounded-full w-full text-center">
                        Use Template
                      </p>
                    </div>
                  </div>

                </Link>
              ))}
            </div>
          </div>
          <div className="flex justify-center mt-6 gap-2">
            {templates.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index
                    ? 'bg-indigo-600 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                onClick={() => {
                  const cardWidth = 320;
                  scrollRef.current?.scrollTo({
                    left: index * cardWidth,
                    behavior: 'smooth'
                  });
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
