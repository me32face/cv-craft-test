"use client";
import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Heart } from 'lucide-react';
import Image from "next/image";

export default function Footer() {
    const footerSections = [
        {
            title: 'Product',
            links: [
                { name: 'Resume Builder', href: '#' },
                { name: 'Templates', href: '#' },
                { name: 'AI Tools', href: '#' },
                { name: 'Cover Letters', href: '#' }
            ]
        },
        {
            title: 'Resources',
            links: [
                { name: 'Blog', href: '#' },
                { name: 'Career Guides', href: '#' },
                { name: 'Resume Examples', href: '#' },
                { name: 'FAQs', href: '#' }
            ]
        },
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '#' },
                { name: 'Contact', href: '#' },
                { name: 'Careers', href: '#' },
                { name: 'Press Kit', href: '#' }
            ]
        },
        {
            title: 'Legal',
            links: [
                { name: 'Privacy Policy', href: '#' },
                { name: 'Terms of Service', href: '#' },
                { name: 'Cookie policy', href: '#' }
            ]
        }
    ];

    const socialLinks = [
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' },
        { icon: Instagram, href: '#', label: 'Instagram' }
    ];

    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div>
                                <Image
                                    src="/footerlogo.png"
                                    alt="CV Craft Logo"
                                    width={160}
                                    height={40}
                                    unoptimized
                                    className="relative object-contain sm:w-[80px] sm:h-[35px] lg:w-[160px] lg:h-[45px] transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                        <p className="text-md font-semibold text-[#929292] mb-6">
                            Create professional resumes in minutes with the power of AI.
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-purple-100 hover:text-purple-600 transition-all duration-200"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {footerSections.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-lg font-bold text-[#342D4C] mb-4">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-md text-[#7d7d7d]  hover:text-[#524e5f] transition-colors duration-200"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-base text-gray-500 text-center sm:text-left">

                            © 2025 ESTA AI Resume Builder. All rights reserved.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base md:text-base text-gray-600 text-center">
                            <span>Built with</span>
                            <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-red-600 text-red-600 animate-pulse" />
                            <span>for job seekers worldwide</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}