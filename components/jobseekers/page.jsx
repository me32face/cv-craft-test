"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function JobSeekers() {
    const stats = [
        { value: 10, suffix: 'M+', label: 'Resumes Created' },
        { value: 15, suffix: 'M+', label: 'Interviews Landed' },
        { value: 4.9, suffix: '/5', label: 'User Rating', decimal: true },
        { value: 95, suffix: '%', label: 'Success Rate' }
    ];

    const testimonials = [
        {
            id: 1,
            quote: "The AI suggestions helped me land interviews at top tech companies. Within 2 weeks, I had 5 offers!",
            name: "Sarah Johnson",
            role: "Software Engineer"
        },
        {
            id: 2,
            quote:
                "Clean, responsive layout and smart AI suggestions. This resume builder helped me clearly showcase my experience and skills.",
            name: "Michael Lee",
            role: "Full Stack Developer"
        },
        {
            id: 3,
            quote:
                "Super easy to use and the templates look premium. My resume now stands out, and I landed two interviews within a week.",
            name: "Rachel Gomez",
            role: "Product Manager"
        }
    ];

    return (
        <section className="w-full min-h-screen bg-[#EDEEFC] py-16 px-4 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
                {/* Stats Section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => (
                        <StatCard key={index} stat={stat} />
                    ))}
                </div>

                {/* Heading */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#424242] mb-4">
                        Loved by Job Seekers Worldwide          </h2>
                    <p className="text-base sm:text-lg text-[#6D6D6D]">
                        See what our users have to say about their success
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
                        >
                            {/* Quote Icon */}
                            <div className="text-gray-300 mb-4">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#a3a3a3"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-8 h-8"
                                >
                                    <g id="SVGRepo_iconCarrier">
                                        <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
                                        <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
                                    </g>
                                </svg>

                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-[#10cb54] animate-pulse"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-gray-700 text-base font-medium mb-6 leading-relaxed font-geist-mono">
                                "{testimonial.quote}"
                            </p>

                            {/* Author */}
                            <div className=" pt-4">
                                <div className="font-bold text-gray-800 text-lg font-geist-sans">
                                    {testimonial.name}
                                </div>
                                <div className="text-gray-500 text-sm">
                                    {testimonial.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
    function StatCard({ stat }) {
        const [count, setCount] = useState(0);
        const [isVisible, setIsVisible] = useState(false);
        const ref = useRef(null);

        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                    }
                },
                { threshold: 0.1 }
            );

            if (ref.current) {
                observer.observe(ref.current);
            }

            return () => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            };
        }, []);

        useEffect(() => {
            if (!isVisible) return;

            const duration = 2000;
            const steps = 60;
            const increment = stat.value / steps;
            const stepDuration = duration / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                if (currentStep <= steps) {
                    setCount(increment * currentStep);
                } else {
                    setCount(stat.value);
                    clearInterval(timer);
                }
            }, stepDuration);

            return () => clearInterval(timer);
        }, [isVisible, stat.value]);

        const displayValue = stat.decimal
            ? count.toFixed(1)
            : Math.floor(count);

        return (
            <div ref={ref} className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#6D6D6D] mb-2">
                    {displayValue}{stat.suffix}
                </div>
                <div className="text-sm sm:text-base text-[#6D6D6D] font-medium">
                    {stat.label}
                </div>
            </div>)
    }
}