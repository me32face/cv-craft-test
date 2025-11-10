"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    CopyPlus,
    Trash,
    Phone,
    Mail,
    MapPin,
    Globe,
    User, Briefcase, GraduationCap
} from "lucide-react";
import AISparkle from '../AISparkle'; // ADD THIS IMPORT
import { geminiService } from '../../lib/gemini'; // ADD THIS IMPORT

// --- INITIAL RESUME DATA (Based on Template 3 Image Content) ---
const initialResumeData = {
    name: "HANNA MORALES",
    title: "DIGITAL MARKETING",
    profileImage: "/profile-placeholder.png",
    about:
        "Energetic digital marketing with 5+ years of experience in digital marketing company. Skilled in data processing and documentation analysis. At Liceria & Co. helped to increase work efficiency by 10% by implementing a new documentation workflow system.",
    contact: [
        { icon: Phone, value: "+123-456-7890", key: "phone" },
        { icon: Mail, value: "hello@reallygreatsite.com", key: "email" },
        { icon: MapPin, value: "123 Anywhere St., Any City", key: "address" },
        { icon: Globe, value: "www.mywebsite.com", key: "website" }, 
    ],
    skills: [
        "Program", "Marketing Analysis", "Team Work", "Technology", "Marketing",
    ],
    languages: ["English", "French", "Spanish", "Korean"],
    workExperience: [
        {
            id: 1, 
            position: "Junior Digital Marketing",
            duration: "June 2030 - Present",
            details: [
                "Manager oversees company digital marketing to more client in social media.",
                "Managing team to handing social media.",
                "Product marketing",
                "Increated clien and customer.",
            ],
        },
        {
            id: 2,
            position: "Senior Digital Marketing",
            duration: "September 2023 - Present",
            details: [
                "Professional class in digital marketing.",
                "Creative idea for digital marketing.",
                "Organizes of social media post for editorial departemen.",
                "Handing social media campaign.",
            ],
        },
    ],
    education: [
        {
            id: 1,
            degree: "Bachelor of Digital Marketing",
            description: "Bachelor of Digital Marketing And Business",
        },
        {
            id: 2,
            degree: "Bachelor of Digital Marketing",
            description: "Bachelor of Digital Marketing And Business",
        },
    ],
};


// --- CORE TEMPLATE COMPONENT ---
export default function Template17() {
    const [contentState, setContentState] = useState(initialResumeData);
    const [profileImage, setProfileImage] = useState(null); 
    
    const saveState = useCallback((state) => {
        console.log('Saving state:', state);
    }, []);

    const editorContainerRef = useRef(null);
    const cvRef = useRef(null);
    
    // Refs for Draggable/Section containers
    const headerRef = useRef(null);
    const aboutRef = useRef(null);
    const workExpSectionRef = useRef(null);
    const educationSectionRef = useRef(null);
    const contactSectionRef = useRef(null);
    const skillsSectionRef = useRef(null);

    // ADD AI GENERATION FUNCTION FOR ABOUT ME AND SKILLS
    const handleAIGenerate = async (section, keywords) => {
        if (!geminiService.genAI) {
            const apiKey = prompt('Please enter your Gemini API key:');
            if (!apiKey) return;
            geminiService.initialize(apiKey);
        }

        try {
            const generatedContent = await geminiService.generateContent(section, keywords);

            switch (section.toLowerCase()) {
                case 'about me':
                case 'about':
                    const aboutElement = document.querySelector('[data-section="about"] [contenteditable]');
                    if (aboutElement) {
                        let cleanedContent = generatedContent
                            .replace(/^#{1,6}\s+.+$/gm, '')
                            .replace(/\*\*(.+?)\*\*/g, '$1')
                            .replace(/\*(.+?)\*/g, '$1')
                            .trim();

                        const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim().length > 50);
                        const actualAbout = paragraphs.find(p =>
                            !p.toLowerCase().includes('here are') &&
                            !p.toLowerCase().includes('of course') &&
                            !p.toLowerCase().includes('choose the option') &&
                            !p.toLowerCase().includes('pro-tip') &&
                            p.length > 100
                        );

                        const finalContent = actualAbout?.trim() || paragraphs[0]?.trim() || cleanedContent;
                        aboutElement.textContent = finalContent;
                        
                        // Update state
                        setContentState(prev => ({
                            ...prev,
                            about: finalContent
                        }));
                    }
                    break;

                case 'skills':
                    const skillsContainer = document.querySelector('[data-section="skills"] ul');
                    if (skillsContainer) {
                        const skills = generatedContent.split('\n').filter(skill => skill.trim());
                        const newSkills = skills.slice(0, 8); // Limit to 8 skills
                        
                        // Update state
                        setContentState(prev => ({
                            ...prev,
                            skills: newSkills.map(skill => skill.trim())
                        }));
                    }
                    break;

                default:
                    console.log('Generated content:', generatedContent);
            }
        } catch (error) {
            alert('Failed to generate content. Please check your API key and try again.');
        }
    };

    // Generic Duplication/Deletion logic for complex sections
    const handleButtonClick = useCallback((e) => {
        const button = e.target.closest('button');
        if (!button) return;

        const action = button.getAttribute('data-action');
        const section = button.closest('.section-item'); 
        
        if (!section) return;

        if (action === 'duplicate') {
            const clone = section.cloneNode(true);
            clone.setAttribute('data-id', Date.now()); 
            section.parentNode.insertBefore(clone, section.nextSibling);
        } else if (action === 'delete') {
            section.remove();
        }
    }, []);

    // Helper for handling keypress and clean up lists
    const handleListEnter = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const selection = window.getSelection();
            let currentLi = selection.anchorNode;
            
            while (currentLi && currentLi.tagName !== 'LI') {
                currentLi = currentLi.parentElement;
            }
            
            if (currentLi) {
                const newLi = document.createElement('li');
                newLi.className = currentLi.className;
                newLi.innerHTML = '<span contentEditable suppressContentEditableWarning>\u200B</span>';
                currentLi.parentNode.insertBefore(newLi, currentLi.nextSibling);
                
                const textSpan = newLi.querySelector('span');
                const range = document.createRange();
                range.setStart(textSpan.firstChild, 1);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };
    
    const handleListCleanup = (e) => {
        const lis = e.currentTarget.querySelectorAll('li');
        lis.forEach(li => {
            if (!li.textContent.trim()) li.remove();
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setProfileImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }

    // CV Page Component
    const CVPage = () => (
        <div className="w-[210mm] h-[297mm] bg-white shadow-2xl flex overflow-hidden relative">
            {/* Left Sidebar (Dark Column) */}
            <aside className="w-[35%] bg-black text-white flex flex-col items-center py-6 px-8 leading-relaxed" onClick={handleButtonClick}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black bg-gray-300 mb-6 relative cursor-pointer">
                    <img
                        src={profileImage || initialResumeData.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        draggable={false}
                    />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer"/>
                </div>

                {/* Contact Section */}
                <section className="w-full mb-6 section-item" data-section="contact">
                    <h2 className="font-bold text-xl border-b border-white pb-1 mb-4 tracking-wide" contentEditable suppressContentEditableWarning>
                        CONTACT
                    </h2>
                    <div className="space-y-3">
                        {contentState.contact.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div key={index} className="group flex items-center gap-2 relative section-item">
                                    {Icon && <Icon size={16} />}
                                    <span 
                                        contentEditable 
                                        suppressContentEditableWarning
                                        className="text-sm outline-none focus:bg-gray-700/50 rounded flex-1"
                                    >{item.value}</span>
                                    <div className="flex gap-1 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button data-action="duplicate" className="text-gray-400 rounded p-1"><CopyPlus size={14} /></button>
                                        <button data-action="delete" className="text-gray-400 rounded p-1"><Trash size={14} /></button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Skills Section with AI */}
                <section className="w-full mb-6 section-item" data-section="skills">
                    <div className="relative group">
                        <h2 className="font-bold text-xl border-b border-white pb-1 mb-4 tracking-wide" contentEditable suppressContentEditableWarning>
                            SKILLS
                        </h2>
                        {/* AI Button positioned close to Skills heading */}
                        <div className="absolute right-0 -top-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <AISparkle section="Skills" onGenerate={handleAIGenerate} />
                        </div>
                    </div>
                    <ul className="space-y-2" onKeyDown={handleListEnter} onBlur={handleListCleanup}>
                        {contentState.skills.map((skill, i) => (
                            <li key={i} className="group flex items-center justify-between gap-2 relative section-item">
                                <span className="text-lg select-none">•</span>
                                <span 
                                    contentEditable 
                                    suppressContentEditableWarning
                                    className="outline-none flex-1 text-sm focus:bg-gray-700/50 rounded"
                                >{skill}</span>
                                <div className="flex gap-1 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button data-action="duplicate" className="text-gray-400 rounded p-1"><CopyPlus size={14} /></button>
                                    <button data-action="delete" className="text-gray-400 rounded p-1"><Trash size={14} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Language Section */}
                <section className="w-full section-item" data-section="languages">
                    <h2 className="font-bold text-xl border-b border-white pb-1 mb-4 tracking-wide" contentEditable suppressContentEditableWarning>
                        LANGUAGE
                    </h2>
                    <ul className="space-y-2" onKeyDown={handleListEnter} onBlur={handleListCleanup}>
                        {contentState.languages.map((lang, i) => (
                            <li key={i} className="group flex items-center justify-between gap-2 relative section-item">
                                <span className="text-lg select-none">•</span>
                                <span 
                                    contentEditable 
                                    suppressContentEditableWarning
                                    className="outline-none flex-1 text-sm focus:bg-gray-700/50 rounded"
                                >{lang}</span>
                                <div className="flex gap-1 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button data-action="duplicate" className="text-gray-400 rounded p-1"><CopyPlus size={14} /></button>
                                    <button data-action="delete" className="text-gray-400 rounded p-1"><Trash size={14} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </aside>

            {/* Right Content (White Column) */}
            <section className="flex-1 bg-white p-8 leading-relaxed text-gray-900">
                {/* Name and Title */}
                <header className="mb-6">
                    <span
                        contentEditable
                        suppressContentEditableWarning
                        className="font-bold text-3xl leading-tight w-full border-b-2 border-gray-400 focus:outline-none focus:border-black block"
                    >{contentState.name}</span>
                    <span
                        contentEditable
                        suppressContentEditableWarning
                        className="uppercase tracking-widest text-gray-700 font-semibold text-base mt-1 w-full block"
                    >{contentState.title}</span>
                </header>

                {/* About Me with AI */}
                <section className="mb-6 section-item" data-section="about">
                    <div className="relative group">
                        <h2 className="font-bold text-xl border-b-2 border-black mb-4 tracking-wide" contentEditable suppressContentEditableWarning>
                            ABOUT ME
                        </h2>
                        {/* AI Button positioned close to About Me heading */}
                        <div className="absolute left-0 -top-5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <AISparkle section="About Me" onGenerate={handleAIGenerate} />
                        </div>
                    </div>
                    <div 
                        contentEditable 
                        suppressContentEditableWarning
                        className="w-full focus:outline-none text-sm leading-normal focus:bg-gray-100/50 min-h-[40px]"
                    >{contentState.about}</div>
                </section>

                {/* Work Experience */}
                <section className="mb-6" data-section="work">
                    <h2 className="font-bold text-xl border-b-2 border-black mb-4 tracking-wide" contentEditable suppressContentEditableWarning>
                        WORK EXPERIENCE
                    </h2>
                    <div className="flex flex-col gap-6 relative">
                        {contentState.workExperience.map((job, i) => (
                            <div key={job.id} className="relative pl-6 section-item" data-id={job.id}>
                                <div className="absolute left-0 top-1 h-full flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-gray-900 mb-6"></div>
                                    {i !== contentState.workExperience.length - 1 && (
                                        <div className="w-[1px] bg-gray-900 flex-1"></div>
                                    )}
                                </div>

                                <div className="flex justify-between items-start mb-1 group relative">
                                    <div className="flex-1 pr-10">
                                        <span
                                            contentEditable
                                            suppressContentEditableWarning
                                            className="font-semibold text-base block focus:bg-gray-100/50"
                                        >{job.position}</span>
                                        <span
                                            contentEditable
                                            suppressContentEditableWarning
                                            className="font-semibold mb-3 text-sm block text-gray-600 focus:bg-gray-100/50"
                                        >{job.duration}</span>
                                    </div>
                                    <div className="flex gap-2 ml-3 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button data-action="duplicate" className="text-gray-600 rounded p-1"><CopyPlus size={16} /></button>
                                        <button data-action="delete" className="text-gray-600 rounded p-1"><Trash size={16} /></button>
                                    </div>
                                </div>

                                <ul className="list-disc list-inside space-y-1" onKeyDown={handleListEnter} onBlur={handleListCleanup}>
                                    {job.details.map((detail, dI) => (
                                        <li
                                            key={`${job.id}-${dI}`}
                                            className="group flex items-start gap-2 relative section-item"
                                        >
                                            <span
                                                contentEditable
                                                suppressContentEditableWarning
                                                className="flex-1 text-sm leading-tight focus:bg-gray-100/50"
                                            >{detail}</span>
                                            <div className="flex gap-2 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button data-action="duplicate" className="text-gray-600 rounded p-1"><CopyPlus size={14} /></button>
                                                <button data-action="delete" className="text-gray-600 rounded p-1"><Trash size={14} /></button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Education */}
                <section data-section="education">
                    <h2 className="font-bold text-xl border-b-2 border-black mb-4 tracking-wide" contentEditable suppressContentEditableWarning>
                        EDUCATION
                    </h2>
                    <ul className="space-y-4">
                        {contentState.education.map((edu, idx) => (
                            <li key={edu.id} className="relative group pr-10 section-item">
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    className="font-semibold text-base w-full block focus:bg-gray-100/50"
                                >{edu.degree}</span>
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    className="w-full block text-sm focus:bg-gray-100/50"
                                >{edu.description}</span>

                                <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button data-action="duplicate" className="text-gray-600 rounded p-1"><CopyPlus size={14} /></button>
                                    <button data-action="delete" className="text-gray-600 rounded p-1"><Trash size={14} /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </section>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
            {/* AI Popup Container - Positioned outside the scaled container */}
            <div id="ai-popup-container" className="fixed inset-0 pointer-events-none z-50">
                {/* This container will hold AI popups via portal */}
            </div>

            <div
                ref={editorContainerRef}
                data-editor-container
                className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-10 relative"
            >
                <div ref={cvRef} data-cv-page>
                    <CVPage />
                </div>
            </div>
        </div>
    );
}