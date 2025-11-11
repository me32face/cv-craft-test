"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Copy, Trash2, CopyPlus, Trash, Globe, Phone, Mail, MapPin,
    User, Briefcase, GraduationCap 
} from "lucide-react"; 
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

// --- INITIAL DATA (Retaining Template 3 content structure) ---
const initialData = {
    name: "Juliana Silva",
    title: "Psychologist",
    profile:
      "Knowledgeable and qualified Clinical Psychologist with a proven track record of success in conducting comprehensive psychological evaluations, developing custom treatment plans, and providing professional individual and group psychotherapy.",
    experience: [
      {
        id: 1,
        role: "Head Clinical Psychologist",
        company: "BORCELLE HOSPITAL",
        years: "1997 - 2020",
      },
    ],
    education: [
      {
        id: 1,
        degree: "Doctorate - Clinical Psychology",
        school: "UNIVERSITY OF GINYARD",
        years: "1997 - 2020",
      },
    ],
    skills: [
      "Counseling", "Psychotherapy", "Evidence-Based Therapy", 
      "Behavior Modification", "Coaching", "Communication", 
      "Interpersonal", "Active Listening", "Writing Reports",
    ],
    contact: {
      address: "123 Anywhere St. Any City",
      phone: "+123-456-7890",
      email: "hello@reallygreatsite.com",
    },
};

// --- Reusable Editable Component ---
const EditableText = React.forwardRef(({ value, onUpdate, className = "", tagName = 'span', ...props }, ref) => {
    const Tag = tagName;
    
    return (
        <Tag
            ref={ref}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
                if (onUpdate) {
                    const sanitizedText = e.target.innerHTML.replace(/<br\s*\/?>/gi, '\n').replace(/&nbsp;/gi, ' ').trim();
                    onUpdate(sanitizedText);
                }
            }}
            dangerouslySetInnerHTML={{ __html: value?.replace(/\n/g, '<br/>') || '' }}
            className={`focus:outline-none focus:ring-1 focus:ring-yellow-300 rounded block resize-none ${className}`}
            {...props}
        />
    );
});
EditableText.displayName = 'EditableText';

// --- Editable Header Component ---
const EditableHeader = ({ children, className = "" }) => {
    return (
        <h2 
            contentEditable 
            suppressContentEditableWarning
            className={`text-yellow-600 font-semibold tracking-widest text-base sm:text-lg ${className}`}
        >
            {children}
        </h2>
    );
};

// --- Main Component ---
export default function Template18() {
    const [resume, setResume] = useState(initialData);
    const [photo, setPhoto] = useState("/profile.jpg");
    const [aiLoading, setAiLoading] = useState(false);
    
    const fileInputRef = useRef(null);
    const editorContainerRef = useRef(null);
    const cvRef = useRef(null);
    const profileTextareaRef = useRef(null);

    // FIXED AI GENERATION FUNCTION - No DOM manipulation
    const handleAIGenerate = async (section, keywords) => {
        if (!geminiService.genAI) {
            const apiKey = prompt('Please enter your Gemini API key:');
            if (!apiKey) return;
            geminiService.initialize(apiKey);
        }

        setAiLoading(true);
        try {
            const generatedContent = await geminiService.generateContent(section, keywords);

            switch (section.toLowerCase()) {
                case 'profile':
                    let cleanedContent = generatedContent
                        .replace(/^#{1,6}\s+.+$/gm, '')
                        .replace(/\*\*(.+?)\*\*/g, '$1')
                        .replace(/\*(.+?)\*/g, '$1')
                        .trim();

                    const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim().length > 50);
                    const actualProfile = paragraphs.find(p =>
                        !p.toLowerCase().includes('here are') &&
                        !p.toLowerCase().includes('of course') &&
                        !p.toLowerCase().includes('choose the option') &&
                        !p.toLowerCase().includes('pro-tip') &&
                        p.length > 100
                    );

                    const finalContent = actualProfile?.trim() || paragraphs[0]?.trim() || cleanedContent;
                    
                    // Update state only - no DOM manipulation
                    setResume(prev => ({
                        ...prev,
                        profile: finalContent
                    }));
                    break;

                case 'skills':
                    const skills = generatedContent.split('\n').filter(skill => skill.trim());
                    const newSkills = skills.slice(0, 10).map(skill => skill.trim());
                    
                    // Update state only - no DOM manipulation
                    setResume(prev => ({
                        ...prev,
                        skills: newSkills
                    }));
                    break;

                default:
                    console.log('Generated content:', generatedContent);
            }
        } catch (error) {
            alert('Failed to generate content. Please check your API key and try again.');
        } finally {
            setAiLoading(false);
        }
    };

    // ---- handlers ----
    const handleEdit = (path, value) => {
        setResume((prev) => {
            const keys = path.split(".");
            let newData = { ...prev };
            
            if (keys.length === 1) {
                newData[keys[0]] = value;
            } else if (keys.length === 2) {
                newData = { ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } };
            } else if (keys.length === 3) {
                const section = keys[0];
                const index = parseInt(keys[1], 10);
                const field = keys[2];
                const newArr = [...prev[section]];
                newArr[index] = { ...newArr[index], [field]: value };
                newData[section] = newArr;
            }
            return newData;
        });
    };

    const duplicateItem = (section, index) => {
        setResume((prev) => {
            const newArr = [...prev[section]];
            const newItem = { ...newArr[index], id: Date.now() }; 
            newArr.splice(index + 1, 0, newItem);
            return { ...prev, [section]: newArr };
        });
    };

    const deleteItem = (section, index) => {
        setResume((prev) => {
            if (prev[section].length <= 1) return prev;
            const newArr = prev[section].filter((_, i) => i !== index);
            return { ...prev, [section]: newArr };
        });
    };
    
    // --- SKILL HANDLERS ---
    const updateSkill = (index, value) => {
        setResume(prev => {
            const newSkills = [...prev.skills];
            newSkills[index] = value;
            return { ...prev, skills: newSkills };
        });
    };
    
    const duplicateSkill = (index) => {
        setResume(prev => {
            const newSkills = [...prev.skills];
            newSkills.splice(index + 1, 0, newSkills[index]);
            return { ...prev, skills: newSkills };
        });
    };
    
    const deleteSkill = (index) => {
        setResume(prev => {
            if (prev.skills.length <= 1) return prev;
            const newSkills = prev.skills.filter((_, i) => i !== index);
            return { ...prev, skills: newSkills };
        });
    };

    // ---- image upload ----
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPhoto(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Initialize textarea height
    useEffect(() => {
        if (profileTextareaRef.current) {
            profileTextareaRef.current.style.height = profileTextareaRef.current.scrollHeight + 'px';
        }
    }, [resume.profile]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 overflow-auto cursor-pointer">
            {/* AI Loading Indicator */}
            {aiLoading && (
                <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
                    Generating content with AI...
                </div>
            )}
            
            <div
                ref={editorContainerRef}
                data-editor-container
                className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-24"
            >
                {/* A4 Paper Container */}
                <div
                    ref={cvRef}
                    data-cv-page
                    className="bg-white border-[6px] border-yellow-500 font-sans text-black shadow-2xl"
                    style={{
                        width: "210mm",
                        height: "297mm",
                    }}
                >
                    <div className="p-8 sm:p-10 md:p-12 h-full overflow-hidden">
                        {/* HEADER */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
                            {/* Profile image */}
                            <div
                                className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full border-[4px] sm:border-[6px] border-yellow-500 overflow-hidden cursor-pointer relative group flex-shrink-0"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <img
                                    src={photo}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs sm:text-sm font-medium text-center p-2">
                                    Click to Change
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            
                            {/* Name and title */}
                            <div className="flex-1 min-w-0 text-center sm:text-left">
                                <EditableText
                                    tagName="h1"
                                    value={resume.name}
                                    onUpdate={(v) => handleEdit("name", v)}
                                    className="text-4xl sm:text-5xl lg:text-6xl font-bold text-yellow-600 bg-transparent outline-none w-full mb-2 sm:mb-3 leading-tight text-center sm:text-left"
                                    placeholder="Your Name"
                                />
                                <EditableText
                                    tagName="h2"
                                    value={resume.title}
                                    onUpdate={(v) => handleEdit("title", v)}
                                    className="block text-lg sm:text-xl lg:text-2xl uppercase tracking-widest text-black bg-transparent outline-none w-full font-semibold text-center sm:text-left"
                                    placeholder="Your Title"
                                />
                            </div>
                        </div>

                        {/* MAIN CONTENT GRID */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8">
                            {/* LEFT COLUMN */}
                            <div className="space-y-6 lg:space-y-8">
                                {/* PROFILE with AI */}
                                <section className="relative group" data-section="profile">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <EditableHeader>PROFILE</EditableHeader>
                                        <div className="absolute left-0 -top-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <AISparkle section="Profile" onGenerate={handleAIGenerate} disabled={aiLoading} />
                                        </div>
                                    </div>
                                    <div className="min-h-[80px] sm:min-h-[100px]">
                                        <EditableText
                                            ref={profileTextareaRef}
                                            value={resume.profile}
                                            onUpdate={(v) => handleEdit("profile", v)}
                                            tagName="div"
                                            className="w-full bg-transparent outline-none leading-relaxed text-black border border-transparent hover:border-gray-200 rounded p-2 transition-colors text-sm sm:text-base"
                                            placeholder="Enter your professional profile summary..."
                                            style={{ minHeight: "80px", height: "auto" }}
                                        />
                                    </div>
                                </section>

                                {/* EXPERIENCE */}
                                <section>
                                    <EditableHeader className="mb-2 sm:mb-3">EXPERIENCE</EditableHeader>
                                    <div className="space-y-3 sm:space-y-4">
                                        {resume.experience.map((exp, i) => (
                                            <div
                                                key={exp.id || i}
                                                className="group relative p-2 sm:p-3 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors section-item"
                                            >
                                                <div className="absolute right-1 sm:right-2 top-1 sm:top-2 hidden group-hover:flex space-x-1 sm:space-x-2 bg-white rounded shadow-sm p-1">
                                                    <button 
                                                        onClick={() => duplicateItem("experience", i)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Copy className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteItem("experience", i)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Trash2 className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
                                                    </button>
                                                </div>
                                                <EditableText
                                                    value={exp.role}
                                                    onUpdate={(v) => handleEdit(`experience.${i}.role`, v)}
                                                    className="block text-base sm:text-lg font-semibold bg-transparent outline-none w-full mb-1"
                                                    placeholder="Job Title"
                                                />
                                                <EditableText
                                                    value={exp.company}
                                                    onUpdate={(v) => handleEdit(`experience.${i}.company`, v)}
                                                    className="block uppercase font-bold bg-transparent outline-none w-full mb-1 text-sm sm:text-base"
                                                    placeholder="Company Name"
                                                />
                                                <EditableText
                                                    value={exp.years}
                                                    onUpdate={(v) => handleEdit(`experience.${i}.years`, v)}
                                                    className="italic text-gray-700 text-xs sm:text-sm bg-transparent outline-none w-full"
                                                    placeholder="Years"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* EDUCATION */}
                                <section>
                                    <EditableHeader className="mb-2 sm:mb-3">EDUCATION</EditableHeader>
                                    <div className="space-y-3 sm:space-y-4">
                                        {resume.education.map((edu, i) => (
                                            <div
                                                key={edu.id || i}
                                                className="group relative p-2 sm:p-3 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors section-item"
                                            >
                                                <div className="absolute right-1 sm:right-2 top-1 sm:top-2 hidden group-hover:flex space-x-1 sm:space-x-2 bg-white rounded shadow-sm p-1">
                                                    <button 
                                                        onClick={() => duplicateItem("education", i)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Copy className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteItem("education", i)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Trash2 className="text-gray-600 w-3 h-3 sm:w-4 sm:h-4" />
                                                    </button>
                                                </div>
                                                <EditableText
                                                    value={edu.degree}
                                                    onUpdate={(v) => handleEdit(`education.${i}.degree`, v)}
                                                    className="block text-base sm:text-lg font-semibold bg-transparent outline-none w-full mb-1"
                                                    placeholder="Degree"
                                                />
                                                <EditableText
                                                    value={edu.school}
                                                    onUpdate={(v) => handleEdit(`education.${i}.school`, v)}
                                                    className="block uppercase font-bold bg-transparent outline-none w-full mb-1 text-sm sm:text-base"
                                                    placeholder="School Name"
                                                />
                                                <EditableText
                                                    value={edu.years}
                                                    onUpdate={(v) => handleEdit(`education.${i}.years`, v)}
                                                    className="italic text-gray-700 text-xs sm:text-sm bg-transparent outline-none w-full"
                                                    placeholder="Years"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-6 lg:space-y-8">
                                {/* SKILLS with AI */}
                                <section className="relative group" data-section="skills">
                                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                                        <EditableHeader>SKILLS</EditableHeader>
                                        <div className="absolute left-0 -top-5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <AISparkle section="Skills" onGenerate={handleAIGenerate} disabled={aiLoading} />
                                        </div>
                                    </div>
                                    <ul className="space-y-1 sm:space-y-2">
                                        {resume.skills.map((skill, i) => (
                                            <li
                                                key={i}
                                                className="group flex justify-between items-center p-1 sm:p-2 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors section-item"
                                            >
                                                <EditableText
                                                    value={skill}
                                                    onUpdate={(v) => updateSkill(i, v)}
                                                    className="bg-transparent outline-none w-full text-black text-sm sm:text-base"
                                                    placeholder="Skill"
                                                />
                                                <div className="hidden group-hover:flex space-x-1">
                                                    <button 
                                                        onClick={() => duplicateSkill(i)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Copy className="text-gray-600 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteSkill(i)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Trash2 className="text-gray-600 w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                {/* CONTACT */}
                                <section>
                                    <EditableHeader className="mb-2 sm:mb-3">CONTACT</EditableHeader>
                                    <div className="space-y-1 sm:space-y-2 text-black">
                                        {/* Address */}
                                        <div className="p-1 sm:p-2 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors">
                                            <EditableText
                                                value={resume.contact.address}
                                                onUpdate={(v) => handleEdit("contact.address", v)}
                                                className="block bg-transparent outline-none w-full text-sm sm:text-base"
                                                placeholder="Address"
                                            />
                                        </div>
                                        {/* Phone */}
                                        <div className="p-1 sm:p-2 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors">
                                            <EditableText
                                                value={resume.contact.phone}
                                                onUpdate={(v) => handleEdit("contact.phone", v)}
                                                className="block bg-transparent outline-none w-full text-sm sm:text-base"
                                                placeholder="Phone"
                                            />
                                        </div>
                                        {/* Email */}
                                        <div className="p-1 sm:p-2 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors">
                                            <EditableText
                                                value={resume.contact.email}
                                                onUpdate={(v) => handleEdit("contact.email", v)}
                                                className="block bg-transparent outline-none w-full text-sm sm:text-base"
                                                placeholder="Email"
                                            />
                                        </div>
                                        {/* Globe Example */}
                                        <div className="p-1 sm:p-2 rounded border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center gap-2 text-sm sm:text-base text-gray-500">
                                                <Globe className="w-4 h-4" />
                                                <EditableText
                                                    value="linkedin.com/myprofile"
                                                    onUpdate={(v) => console.log('Link updated:', v)}
                                                    className="bg-transparent outline-none w-full text-sm sm:text-base text-black"
                                                    placeholder="Website/LinkedIn"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}