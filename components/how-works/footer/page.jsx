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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                           
                            <div>
                                <Image
                                    src="/footerlogo.png"
                                    alt="CV Craft Logo"
                                    width={100}
                                    height={30}
                                    className="object-contain sm:w-[75px] sm:h-[37px] lg:w-[90px] lg:h-[45px]"
                                />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
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
                            <h4 className="text-sm font-semibold text-gray-900 mb-4">
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200"
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
                        <p className="text-sm text-gray-500 text-center sm:text-left">
                            © 2025 ESTA AI Resume Builder. All rights reserved.
                        </p>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span>Built with</span>
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                            <span>for job seekers worldwide</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}