'use client';

import Link from 'next/link';
import Image from 'next/image';
import TemplatePreview from '@/components/TemplatePreview';
import { useEffect, useRef, useState } from 'react';
import Navbar from '../components/navbar/page'
import BuildSection from '../components/builder-page/page'
import HowItWorks from '../components/how-works/page'
import AIContent from '../components/ai-writes/page'
import JobSeekers from '../components/jobseekers/page'
import WhyChooseUs from '../components/whychoose/page'
import FAQ from '../components/faquestions/page'
import Footer from '../components/footer/page'
import DreamJob from '../components/dreamjob/page'
import Toast from '../components/Toast'
// import Signup from './signup/page'
// import Login from './login/page'

export default function Home() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showToast, setShowToast] = useState(false);
  const templates = [

    { id: 'Template01', name: 'Professional Classic', key: 'Richard Sanchez', image: '/template/template01n.png', category: 'modern' },
    { id: 'Template06', name: 'Sample Layout', key: 'Olivia Schwaiger', image: '/template/template06.png', category: 'modern' },
    { id: 'Template04', name: 'Executive Style', key: 'Mariana Anderson', image: '/template/template04n.png', category: 'creative' },
    { id: 'Template02', name: 'Modern Minimal', key: 'Olivia Wilson', image: '/template/template02.png', category: 'simple' },
    { id: 'Template03', name: 'Creative Bold', key: 'Lorna Alvarado', image: '/template/template03.png', category: 'proffessional' },
    { id: 'Template05', name: 'Clean Layout', key: 'Richard Sanchez', image: '/template/template05.png', category: 'modern' },
    { id: 'Template06', name: 'Sample Layout', key: 'Sharya Singh', image: '/template/template06.png', category: 'simple' },
    { id: 'Template07', name: 'Professional Classic', key: 'Olivia Wilson', image: '/template/template07.png', category: 'creative' },
    { id: 'Template08', name: 'Beige Whait', key: 'Olivia Wilson', image: '/template/template09.png', category: 'modern' },
    { id: 'Template10', name: 'Elegant Layout', key: 'Sahib Khan', image: '/template/template10.png', category: 'creative' },
    { id: 'Template13', name: 'Clean Layout', key: 'Jonathan Patterson', image: '/template/template13.png', category: 'proffessional' },
    { id: 'Template14', name: 'Clean Layout', key: 'Deepal Surve', image: '/template/template14.png', category: 'proffessional' },
    { id: 'Template15', name: 'Sample Layout', key: 'Richard Sanchez', image: '/template/template15.png', category: 'proffessional' },
    { id: 'Template16', name: 'Classic Layout', key: 'Hanson johnson', image: '/template/template16.png', category: 'creative' },
    { id: 'Template17', name: 'Elegant Layout', key: 'Hanna Morales', image: '/template/template17.png', category: 'creative' },
    { id: 'Template12', name: 'Elegant Layout', key: 'Andry gardon', image: '/template/template12.png', category: 'modern' },
    { id: 'Template18', name: 'Unique Layout', key: 'Juliana silva', image: '/template/template18.png', category: 'simple' },
    { id: 'Template19', name: 'Modest Layout', key: 'isabel mercado', image: '/template/template19.png', category: 'proffessional' },
    { id: 'Template20', name: 'Infographic Developer Template', key: 'daniel Gallego', image: '/template/template20.png', category: 'creative' },

  ];

  const filteredTemplates = activeFilter === 'All'
    ? templates
    : templates.filter(template => template.category.toLowerCase() === activeFilter.toLowerCase());

  const duplicatedTemplates = [...filteredTemplates, ...filteredTemplates];

  const scrollPrev = () => {
    scrollRef.current?.scrollBy({ left: -344, behavior: 'smooth' });
  };

  const scrollNext = () => {
    scrollRef.current?.scrollBy({ left: 344, behavior: 'smooth' });
  };

  const updateActiveIndex = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollLeft = scrollContainer.scrollLeft;
    const cardWidth = 344; // 320px width + 24px gap
    const index = Math.round(scrollLeft / cardWidth) % templates.length;
    setActiveIndex(index);
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    scrollContainer.addEventListener('scroll', updateActiveIndex);

    const scroll = () => {
      const cardWidth = 344;
      const nextIndex = (currentIndex + 1) % templates.length;

      // scrollContainer.scrollTo({
      //   left: nextIndex * cardWidth,
      //   behavior: 'smooth'
      // });

      setCurrentIndex(nextIndex);
    };

    const interval = setInterval(scroll, 3000);
    return () => {
      clearInterval(interval);
      // scrollContainer.removeEventListener('scroll', updateActiveIndex);
    };
  }, [currentIndex, templates.length]);


  return (
    <>
      <Navbar />
      <BuildSection />
      <HowItWorks />
      <main  id='template'  className="min-h-screen   from-gray-50 to-white mt-10 py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-8xl mx-auto">
          <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-5xl font-bold mb-5 text-center text-gray-500">
            Professional Resume Templates
          </h1>
          <p className="text-center mb-7 text-gray-500 text-lg">
            Choose from our collection of expertly designed resume templates
          </p>

          <div className="flex justify-center mb-10 overflow-x-auto scrollbar-hide pl-44 sm:pl-44 md:pl-0 lg:pl-0 xl:pl-0">
            <div className="flex gap-4 mx-auto min-w-max px-2">
              {['All', 'Modern', 'Creative', 'Proffessional', 'Simple'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={
                    activeFilter === filter
                      ? "px-6 py-2 whitespace-nowrap rounded-full text-white font-semibold bg-gradient-to-r from-[#4F8DF9] to-[#8A3FFC] hover:opacity-90 transition cursor-pointer"
                      : "px-4 py-2 whitespace-nowrap border border-gray-400 rounded-full text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                  }
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>


          <div className="relative">
            <button
              onClick={scrollPrev}
              className="absolute left-10 top-1/2 -translate-y-1/2 z-10 bg-gray-400/80  rounded-full p-2 shadow-lg transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-10 top-1/2 -translate-y-1/2 z-10 bg-gray-400/80  rounded-full p-2 shadow-lg transition-all"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div ref={scrollRef} className="overflow-x-auto pb-4 scrollbar-hide scroll-smooth">
              <div className="flex gap-6 min-w-max mt-2" style={{ scrollSnapType: 'x mandatory' }}>
                {duplicatedTemplates.map((template, index) => (
                  <div
                    key={`${template.id}-${index}`}
                    className="group relative bg-gradient-to-b from-[#f6f9fc] to-[#e8edf5] rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden block flex-shrink-0 w-80 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100"
                    style={{ scrollSnapAlign: 'start' }}
                  >
                    <div className="p-4">
                      {template.image ? (
                        <Image
                          src={template.image}
                          alt={template.name}
                          width={288}
                          height={200}
                          unoptimized
                          className="w-full h-58 object-contain rounded-lg shadow-lg"
                        />
                      ) : (
                        <TemplatePreview templateId={template.id} />
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full p-6 pt-3 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-md bg-white/30 rounded-b-2xl">
                      <h3 className="text-gray-700 group-hover:text-gray-600 transition-colors">
                        {template.name.split(' ')[0]}
                      </h3>
                      <h3 className="font-bold text-xl text-gray-700 group-hover:text-gray-600 transition-colors">
                        {template.name}
                      </h3>

                      <div className="flex items-center justify-center mt-3">
                        <button
                          className="text-sm text-gray-700 border border-gray-500 px-4 py-2 rounded-full w-full text-center backdrop-blur-lg bg-white/40 hover:bg-white/60 transition"
                          onClick={() => {
                            const token = localStorage.getItem('token');

                            if (!token) {
                              // User not logged in → store redirect path → go to login
                              localStorage.setItem("redirectAfterLogin", `/templates/${template.id}`);
                              setShowToast(true);
                              setTimeout(() => window.location.href = '/login', 1500);
                            } else {
                              // User logged in → go directly to the template page
                              window.location.href = `/templates/${template.id}`;
                            }
                          }}
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            </div>
            <div className="flex justify-center mt-6 gap-2">
              {templates.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-indigo-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  onClick={() => {
                    const cardWidth = 344; // card width + gap
                    scrollRef.current?.scrollTo({
                      left: (index + 1) * cardWidth, // +1 to skip the first clone
                      behavior: 'smooth'
                    });
                    setActiveIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <AIContent />
      <JobSeekers />
      <WhyChooseUs />
      <FAQ />
      <DreamJob />
      <Footer />
      {showToast && (
        <Toast
          message="Please login to continue"
          onClose={() => setShowToast(false)}
        />
      )}
      {/* <Signup />
      <Login /> */}
    </>
  );
}
