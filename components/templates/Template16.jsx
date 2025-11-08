"use client";
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Mail, Phone, MapPin, Trash2, CopyPlus, User, Briefcase, GraduationCap, Globe } from 'lucide-react'; 
import Draggable from "react-draggable";

import AISparkle from '../AISparkle';
import Image from 'next/image';

// --- INITIAL RESUME DATA ---
const initialResumeData = {
    name: "HANSON JOHNSON JR.",
    title: "UI/UX DESIGNER",
    profileImage: '/templateprofile/template01profile.jpg', 
    contact: [
        { icon: Mail, value: 'hello@reallygreatsite.com', label: 'E', breakAll: true },
        { icon: Phone, value: '123-456-7890', label: 'P', breakAll: false },
        { icon: MapPin, value: '123 Anywhere St., Any City', label: 'A', breakAll: false },
    ],
    welcome: "WELCOME TO MY RESUME",
    profile: "Assists the department head in carrying out digital marketing companies works closely with the marketing head for digital promotions and others. My skills are excellent, and I have a strong commitment to research.",
    objective: "5+ years of experience as a Creative Director. A dynamic and strategic leader known for developing and executing inventive and creative brand-building experiences. Successful in devising and applying new ideas and innovation to build a client's company competitive advantage.",
    workExperience: [
        { yearRange: '2014 - 2016', details: 'Senior Graphic Designer', company: 'Borcelle Studios', description: 'Post Graduated in Graphics Designing.\nAssists the department head in carrying out digital marketing companies works closely with promotions.' },
        { yearRange: '2014 - 2016', details: 'Junior Graphic Designer', company: 'Borcelle Studios', description: 'Post Graduated in Graphics Designing.\nAssists the department head in carrying out digital marketing companies works closely with promotions.' },
        { yearRange: '2014 - 2016', details: 'Master Graphic Designer', company: 'Borcelle Studios', description: 'Post Graduated in Graphics Designing.\nAssists the department head in carrying out digital marketing companies works closely with promotions.' },
    ],
    education: [
        { yearRange: '2005 - 2009', details: 'Bachelor of Design', university: 'Fauget University' },
        { yearRange: '2005 - 2009', details: 'Master of Design', university: 'Fauget University' },
    ],
    skills: [
        { name: 'Web Design', level: 90 }, { name: 'Branding', level: 75 },
        { name: 'Photography', level: 85 }, { name: 'Video Editing', level: 80 },
        { name: 'SEO', level: 95 }, { name: 'Marketing', level: 88 }
    ],
    references: [
        { name: 'Harper Russo', title: 'Wardiere Inc.', phone: '123-456-7890' },
        { name: 'Francois Mercer', title: 'Wardiere Inc.', phone: '123-456-7890' },
    ],
};

// Main Component
export default function Template02() {
    const [contentState, setContentState] = useState(initialResumeData); 
    const [profileImage, setProfileImage] = useState(null); 
    
    const saveState = useCallback((state) => {
        console.log('Saving state:', state);
        const event = new CustomEvent('stateSaved', { detail: { state } });
        window.dispatchEvent(event);
    }, []);

    const editorContainerRef = useRef(null);
    const cvRef = useRef(null);
    
    // Refs for Draggable sections
    const headerRef = useRef(null);
    const welcomeRef = useRef(null);
    const workExpSectionRef = useRef(null);
    const educationSectionRef = useRef(null);
    const skillsSectionRef = useRef(null);
    const referencesSectionRef = useRef(null);
    const contactSectionRef = useRef(null);


    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                saveState({ profileImage, contentState });
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSimpleListEnter = (e) => {
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
                newLi.innerHTML = currentLi.innerHTML.includes('•') 
                    ? '<span class="mr-2">•</span><span contentEditable suppressContentEditableWarning>\u200B</span>'
                    : '\u200B';
                
                currentLi.parentNode.insertBefore(newLi, currentLi.nextSibling);
                
                const textSpan = newLi.querySelector('span[contenteditable]') || newLi.firstChild;
                const range = document.createRange();
                range.setStart(textSpan.firstChild, 1);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
        }
    };

    const handleSimpleListCleanup = (e) => {
        const listItems = e.currentTarget.querySelectorAll('li');
        listItems.forEach(li => {
            const editableContent = li.querySelector('[contentEditable]');
            if ((editableContent && !editableContent.textContent.trim()) || (!editableContent && !li.textContent.trim())) {
                li.remove();
            }
        });
    };

    const handleAIGenerate = async (section, keywords) => {
        console.log('AI Generation requested for:', section, keywords);
        alert(`AI generation mock for: ${section}. Content would be generated here.`);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            saveState({ profileImage, contentState });
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [contentState, profileImage, saveState]);
    
    useEffect(() => {
        const handleUndoRedo = (event) => {
            const { state } = event.detail;
            if (state) {
                setProfileImage(state.profileImage || null);
                setContentState(state.contentState || initialResumeData);
            }
        };

        window.addEventListener('undoRedo', handleUndoRedo);
        return () => window.removeEventListener('undoRedo', handleUndoRedo);
    }, []);

    useEffect(() => {
        saveState({ profileImage: null, contentState: initialResumeData });
    }, [saveState]);


    // --- GENERIC EDITABLE COMPONENTS (Self-closing and uses 'value' prop) ---
    const EditableText = ({ id, value, className, type = 'p', placeholder = '', ...props }) => {
        const Tag = type;
        
        // **CRITICAL FIX:** Ensure value is present before setting dangerouslySetInnerHTML
        // and that no children are passed to the component when using this prop.
        return (
            <Tag
                id={id}
                className={className}
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: value || placeholder }}
                {...props}
            />
        );
    };

    // --- REUSABLE SECTION HEADER ---
    const SectionHeader = ({ title, onGenerate, extraClass = '' }) => (
        <div className={`relative group mb-3 ${extraClass}`} data-section={title.toLowerCase().replace(/\s/g, '-')}>
            <div className="flex items-center gap-2">
                <h2 
                    contentEditable 
                    suppressContentEditableWarning 
                    className="text-base font-bold tracking-wider text-gray-800 border-b border-gray-400 pb-1 w-full"
                >
                    {title}
                </h2>
                {onGenerate && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 -top-2">
                        <AISparkle section={title} onGenerate={onGenerate} />
                    </div>
                )}
            </div>
        </div>
    );

    // --- CV PAGE COMPONENT ---
    const CVPage = () => {
        const handleButtonClick = useCallback((e) => {
            const button = e.target.closest('button');
            if (!button) return;

            const action = button.getAttribute('data-action');
            const section = button.closest('.relative.group') || button.closest('.draggable-item');
            
            if (!section) return;

            if (action === 'duplicate') {
                const draggableParent = section.parentElement;
                if (draggableParent && draggableParent.classList.contains('react-draggable')) {
                    const outerDraggable = draggableParent.parentElement;
                    const clone = outerDraggable.cloneNode(true);
                    outerDraggable.parentNode.insertBefore(clone, outerDraggable.nextSibling);
                } else {
                    const clone = section.cloneNode(true);
                    section.parentNode.insertBefore(clone, section.nextSibling);
                }
            } else if (action === 'delete') {
                const draggableParent = section.parentElement;
                if (draggableParent && draggableParent.classList.contains('react-draggable')) {
                    draggableParent.parentElement.remove();
                } else {
                    section.remove();
                }
            }
        }, []);
        
        return (
            <div 
                className="w-[210mm] h-[297mm] bg-white shadow-2xl overflow-visible" 
                onClick={handleButtonClick}
                style={{WebkitFontSmoothing: 'antialiased', textRendering: 'geometricPrecision', imageRendering: 'crisp-edges', padding: '30px'}}
            >
                {/* 1. HEADER SECTION (Matches Image Design) */}
                <Draggable nodeRef={headerRef}>
                    <div ref={headerRef} className="bg-red-50/70 border-b border-gray-300 relative group p-4 -m-4 mb-4">
                        <div className="flex justify-between items-start">
                            <div className='max-w-[70%]'>
                                <h4 className="text-[10px] font-semibold tracking-widest text-gray-600 mb-1">
                                    RESUME
                                </h4>
                                <h1
                                    className="text-3xl font-bold mb-1 text-gray-800"
                                    contentEditable
                                    suppressContentEditableWarning
                                >{contentState.name}</h1>
                                <p
                                    className="text-base font-medium uppercase tracking-widest text-gray-700"
                                    contentEditable
                                    suppressContentEditableWarning
                                >{contentState.title}</p>
                            </div>
                            <div className="text-xs text-right space-y-1 mt-2">
                                {/* Contact Info (Right Aligned) */}
                                {contentState.contact.map((item, index) => (
                                    <div key={index} className="text-gray-700">
                                        <span className="font-semibold">{item.label}</span>
                                        {/* FIX: Use value prop and make self-closing */}
                                        <EditableText
                                            value={item.value}
                                            className="inline ml-1 text-xs"
                                            type="span"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Drag/Delete controls for the entire Header block */}
                        <div className="absolute -right-4 -top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><CopyPlus className="w-4 h-4" /></button>
                            <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                </Draggable>

                {/* 2. WELCOME / PROFILE / OBJECTIVE (Full Width) */}
                <Draggable nodeRef={welcomeRef} bounds={false}>
                    <div ref={welcomeRef} className="relative group mb-5">
                        <div className="border-b border-gray-400 pb-1 mb-4">
                            <h3 className="text-lg font-normal tracking-normal text-gray-800">
                                {/* FIX: Use value prop and make self-closing */}
                                <EditableText
                                    value={contentState.welcome}
                                    className="font-normal"
                                    type="span"
                                />
                            </h3>
                        </div>

                        {/* Profile Section (with AI sparkle from Code 1) */}
                        <SectionHeader title="PROFILE" onGenerate={handleAIGenerate} />
                        <div className="relative group mb-4">
                            {/* FIX: Use value prop and make self-closing */}
                            <EditableText
                                type="div"
                                value={contentState.profile}
                                className="text-xs text-gray-700 leading-relaxed text-justify"
                                id="profile-text"
                            />
                        </div>

                        {/* Career Objective Section (similar style) */}
                        <SectionHeader title="CAREER OBJECTIVE" />
                        <div className="relative group">
                            {/* FIX: Use value prop and make self-closing */}
                            <EditableText
                                type="div"
                                value={contentState.objective}
                                className="text-xs text-gray-700 leading-relaxed text-justify"
                            />
                        </div>
                        {/* Drag/Delete controls for the entire block */}
                        <div className="absolute -right-4 -top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                            <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><CopyPlus className="w-4 h-4" /></button>
                            <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><Trash2 className="w-4 h-4" /></button>
                        </div>
                    </div>
                </Draggable>

                {/* 3. WORK EXPERIENCE (Full Width Timeline) */}
                <div className="section-container mb-6" data-section="work-experience">
                    <Draggable nodeRef={workExpSectionRef} >
                        <div ref={workExpSectionRef}>
                            <SectionHeader title="WORK EXPERIENCE" onGenerate={handleAIGenerate} />
                        </div>
                    </Draggable>
                    <div className="space-y-4 pt-1">
                        {contentState.workExperience.map((job, index) => {
                            const jobItemRef = useRef(null);
                            return (
                                <Draggable key={index} nodeRef={jobItemRef} bounds={false}>
                                    <div ref={jobItemRef} className="flex relative group draggable-item">
                                        {/* Timeline Dot and Line */}
                                        <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white border border-gray-800 rounded-full z-10"></div>
                                        <div className="absolute -left-1 top-3 w-px h-[calc(100%+10px)] bg-gray-400 z-0"></div>
                                        
                                        <div className="pl-4 flex w-full justify-between items-start">
                                            {/* Left Column (Details) */}
                                            <div className="pr-3 w-[45%]">
                                                {/* FIX: Use value prop and make self-closing */}
                                                <EditableText value={job.details} className="text-xs font-semibold text-gray-800" type="p" />
                                                {/* FIX: Use value prop and make self-closing */}
                                                <EditableText value={job.company} className="text-[10px] text-gray-700" type="p" />
                                                {/* FIX: Use value prop and make self-closing */}
                                                <EditableText value={job.yearRange} className="text-[10px] text-gray-500 mt-0.5" type="p" />
                                            </div>

                                            {/* Right Column (Description) */}
                                            <div className="w-[55%] pl-4 border-l border-gray-300">
                                                {/* FIX: Use value prop and make self-closing */}
                                                <EditableText
                                                    value={job.description}
                                                    className="text-xs text-gray-700 leading-relaxed"
                                                    type="div"
                                                />
                                            </div>
                                        </div>

                                        {/* Duplication/Deletion Controls */}
                                        <div className="absolute -right-4 -top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                            <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><CopyPlus className="w-4 h-4" /></button>
                                            <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                </Draggable>
                            );
                        })}
                    </div>
                </div>

                {/* 4. FOOTER SECTION (3-Column Split: Education | Skills | Reference) */}
                <div className="grid grid-cols-3 gap-x-6 mt-8">

                    {/* Education Section (Column 1) */}
                    <div className="col-span-1">
                        <Draggable nodeRef={educationSectionRef}>
                            <div ref={educationSectionRef}>
                                <SectionHeader title="EDUCATION" />
                            </div>
                        </Draggable>
                        <div className="space-y-3 pt-1">
                            {contentState.education.map((edu, index) => {
                                const eduItemRef = useRef(null);
                                return (
                                    <Draggable key={index} nodeRef={eduItemRef} bounds={false}>
                                        <div ref={eduItemRef} className="flex relative group draggable-item">
                                            {/* Timeline Dot */}
                                            <div className="absolute -left-1.5 top-0 w-3 h-3 bg-white border border-gray-800 rounded-full z-10"></div>
                                            <div className="absolute -left-1 top-3 w-px h-[calc(100%+10px)] bg-gray-400 z-0"></div>
                                            
                                            <div className="pl-4">
                                                {/* FIX: Use value prop and make self-closing */}
                                                <EditableText value={edu.yearRange} className="text-xs font-semibold text-gray-800" type="p" />
                                                {/* FIX: Use value prop and make self-closing */}
                                                <EditableText value={edu.details} className="text-[10px] text-gray-700 mt-0.5" type="p" />
                                                {/* FIX: Use value prop and make self-closing */}
                                                <EditableText value={edu.university} className="text-[10px] text-gray-500" type="p" />
                                            </div>

                                            {/* Duplication/Deletion Controls */}
                                            <div className="absolute -right-4 -top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                                <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><CopyPlus className="w-4 h-4" /></button>
                                                <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </Draggable>
                                );
                            })}
                        </div>
                    </div>

                    {/* Skills Section (Column 2) */}
                    <div className="col-span-1">
                        <Draggable nodeRef={skillsSectionRef}>
                            <div ref={skillsSectionRef}>
                                <SectionHeader title="MY SKILLS" onGenerate={handleAIGenerate} />
                            </div>
                        </Draggable>
                        <div className="space-y-2 pt-1">
                            {contentState.skills.map((skill, index) => {
                                const skillItemRef = useRef(null);
                                return (
                                    // Removed unnecessary Draggable here since it's redundant on a simple list item structure.
                                    <div key={index} className="text-xs group relative p-1 -m-1 draggable-item"> 
                                        {/* Skill Name and Level */}
                                        <div className="flex justify-between items-center mb-0.5">
                                            {/* FIX: Use value prop and make self-closing */}
                                            <EditableText
                                                value={skill.name}
                                                className="font-medium text-gray-700"
                                                type="span"
                                            />
                                            {/* FIX: Use value prop and make self-closing */}
                                            <EditableText
                                                value={String(skill.level)}
                                                className="text-xs font-semibold text-gray-500 w-6 text-right"
                                                type="span"
                                            />
                                        </div>
                                        {/* Skill Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-1">
                                            <div
                                                className="bg-gray-700 h-1 rounded-full"
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>

                                        {/* Duplication/Deletion Controls */}
                                        <div className="absolute -right-4 -top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                            <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><CopyPlus className="w-4 h-4" /></button>
                                            <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* References Section (Column 3) */}
                    <div className="col-span-1">
                        <Draggable nodeRef={referencesSectionRef}>
                            <div ref={referencesSectionRef}>
                                <SectionHeader title="REFERENCE" />
                            </div>
                        </Draggable>
                        <div className="space-y-3 pt-1 text-xs"> 
                            {contentState.references.map((ref, index) => {
                                const refItemRef = useRef(null);
                                return (
                                    <Draggable key={index} nodeRef={refItemRef} bounds={false}>
                                        <div ref={refItemRef} className="relative group draggable-item">
                                            {/* FIX: Use value prop and make self-closing */}
                                            <EditableText
                                                value={ref.name}
                                                className="font-bold text-gray-800"
                                                type="p"
                                            />
                                            {/* FIX: Use value prop and make self-closing */}
                                            <EditableText
                                                value={`${ref.title} | ${ref.phone}`}
                                                className="text-gray-600"
                                                type="p"
                                            />
                                            {/* Duplication/Deletion Controls */}
                                            <div className="absolute -right-4 -top-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                                                <button data-action="duplicate" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><CopyPlus className="w-4 h-4" /></button>
                                                <button data-action="delete" className="text-gray-600 rounded p-1.5 shadow-md bg-white"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                    </Draggable>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
            <div
                ref={editorContainerRef}
                data-editor-container
                className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
            >
                <div ref={cvRef} data-cv-page>
                    <CVPage />
                </div>
            </div>
        </div>
    );
}