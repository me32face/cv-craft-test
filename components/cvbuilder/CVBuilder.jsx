'use client';
import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { templates, templateInputs } from "../templates";
import { User, Camera, Link2, Code, GraduationCap, Briefcase, Globe, Award, Printer, Share2, Download, ZoomIn, ZoomOut, Expand, Sparkles, ChevronLeft, Menu, FolderCode, X, Home, FileText, Users,BookPlus ,ChevronUp} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PopupEditor from "./PopupEditor"; // reusable popup
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string";
import TemplateSelector from "./TemplateSelector";
import Toast from "../Toast";

import { LayoutTemplate } from "lucide-react";
export default function CVBuilder({ initialTemplate = "template31", onBack }) {
  const [template, setTemplate] = useState(initialTemplate.toLowerCase());
  const TemplateComponent = templates[template];
  const [openSection, setOpenSection] = useState(null); // for popup
  const [selectedMenu, setSelectedMenu] = useState("personal");
  const [scale, setScale] = useState(1);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [additionalOpen, setAdditionalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [resumeId, setResumeId] = useState(null);
  const [loading, setLoading] = useState(true);
  const shareMenuRef = useRef(null);
const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);  const exportMenuRef = useRef(null);

const router = useRouter();

const dropdownRef = useRef(null);
const additionalBtnRef = useRef(null);
const [additionalBtnX, setAdditionalBtnX] = useState(0);
const [additionalBtnY, setAdditionalBtnY] = useState(0);

  const [totalPages, setTotalPages] = useState(1);
  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const handleMenuItemClick = (key) => {
if (key === "additional") {
  setAdditionalOpen(!additionalOpen);

  if (additionalBtnRef.current) {
    const rect = additionalBtnRef.current.getBoundingClientRect();
    setAdditionalBtnX(rect.left);
    setAdditionalBtnY(rect.top);
  }
  return;
}

if (key === "templates") {
  setTemplateSelectorOpen(true);
  return;
}

    setOpenSection(key);
    setSelectedMenu(key);
    setMobileMenuOpen(false);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShareMenuOpen(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setExportMenuOpen(false);
      }
    };

    if (shareMenuOpen || exportMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [shareMenuOpen, exportMenuOpen]);


  const generatePdf = async () => {
    const element = document.getElementById("pdf-template");
    if (!element) return null;

    // Freeze alignment ONLY during PDF
    element.classList.remove("freeze-layout");
    const calculatedPages = adjustLayoutForPageBreaks(element);

    const canvas = await html2canvas(element, {
      scale: 1.5,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.85);
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    for (let page = 0; page < calculatedPages; page++) {
      if (page > 0) pdf.addPage();
      const yOffset = -(page * pageHeight);
      pdf.addImage(imgData, "JPEG", 0, yOffset, imgWidth, imgHeight);
      const linkElements = element.querySelectorAll(".social-link");

      linkElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const parentRect = element.getBoundingClientRect();

        // Calculate positions in PDF space
        const pxPerMM = element.offsetWidth / pageWidth;

        const x = (rect.left - parentRect.left) / pxPerMM;
        const y = (rect.top - parentRect.top) / pxPerMM;
        const w = rect.width / pxPerMM;
        const h = rect.height / pxPerMM;

        pdf.link(x, y - pageHeight * page, w, h, { url: el.href });
      });
    }

    resetLayout(element);
    return pdf;
  };



  const handleDownload = async () => {
    const pdf = await generatePdf();
    if (!pdf) return;
    pdf.save(`${data.name || "cv"}.pdf`);
  };

  const encodeDataForUrl = (payload) => {
    try {
      const json = JSON.stringify(payload);
      // Compress and make it URL-safe
      return compressToEncodedURIComponent(json);
    } catch (e) {
      console.error("Error encoding data for URL:", e);
      return "";
    }
  };

  const decodeDataFromUrl = (encoded) => {
    try {
      if (!encoded) return null;
      const json = decompressFromEncodedURIComponent(encoded);
      if (!json) return null;
      return JSON.parse(json);
    } catch (e) {
      console.error("Error decoding data from URL:", e);
      return null;
    }
  };

  const buildShareUrlWithData = (data) => {
    if (typeof window === "undefined") return "";

    const url = new URL(window.location.origin + "/resume-view");
    const shareId =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    const payload = {
      shareId,
      template, // from state: const [template, setTemplate] = useState(...)
      data,
    };

    const encoded = encodeDataForUrl(payload);
    if (!encoded) return url.toString();

    url.searchParams.set("cv", encoded);
    return url.toString();
  };

  const handleShareUrl = async () => {
    try {
      const shareUrl = buildShareUrlWithData(data);
      if (!shareUrl) {
        setToast("Could not build share URL.");
        return;
      }

      if (navigator.share) {
        await navigator.share({
          title: `${data.name || "My"} CV`,
          text: "Here is my resume.",
          url: shareUrl,
        });
      } else {
        // fallback: copy link
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareUrl);
          setToast("Link copied to clipboard!");
        } else {
          setToast("Sharing is not supported in this browser.");
        }
      }
    } catch (error) {
      console.error("Error sharing URL:", error);
      setToast("Could not share the link. Please try again.");
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = buildShareUrlWithData(data);
      if (!shareUrl) {
        setToast("Could not build share URL.");
        return;
      }

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        setToast("Link copied to clipboard! You can paste it into WhatsApp, Email, etc.");
      } else {
        setToast("Copy to clipboard is not supported in this browser.");
      }
    } catch (error) {
      console.error("Error copying link:", error);
      setToast("Could not copy the link. Please try again.");
    }
  };
  const handleSharePdf = async () => {
    try {
      const pdf = await generatePdf();
      if (!pdf) {
        setToast("Could not create PDF to share.");
        return;
      }

      const blob = pdf.output("blob");
      const fileName = `${data.name || "cv"}.pdf`;
      const file = new File([blob], fileName, { type: "application/pdf" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${data.name || "My"} CV`,
          text: "Here is my resume.",
          files: [file],
        });
      } else {
        setToast("Your browser does not support sharing files. Please use 'Export PDF' and share it manually.");
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      setToast("Could not share the PDF. Please try again.");
    }
  };


  // Smart page break detection
  const adjustLayoutForPageBreaks = (element) => {
    const pageHeight = 1123;

    // Calculate sidebar height first
    const sidebar = element.querySelector('.cv-sidebar');
    const mainContent = element.querySelector('[class*="w-2/3"]');
    let totalPages = 1;

    if (sidebar && mainContent) {
      const contentHeight = mainContent.scrollHeight;
      const sidebarHeight = sidebar.scrollHeight;
      const maxHeight = Math.max(contentHeight, sidebarHeight);
      totalPages = Math.ceil(maxHeight / pageHeight);
      const fullPagesHeight = totalPages * pageHeight;

      sidebar.style.minHeight = `${fullPagesHeight}px`;
      console.log('Content:', contentHeight, 'Sidebar:', sidebarHeight, 'Pages:', totalPages);
    } else {
      // Fallback if no sidebar layout
      const totalHeight = element.scrollHeight;
      totalPages = Math.ceil(totalHeight / pageHeight);
      console.log('No sidebar found, total height:', totalHeight, 'Pages:', totalPages);
    }

    // Only run smart breaks if content exceeds 1 page
    if (totalPages <= 1) {
      console.log('Content fits on 1 page, skipping smart breaks');
      return totalPages;
    }

    console.log('Running smart breaks for multi-page content');
    const items = element.querySelectorAll('.cv-item');

    items.forEach(item => {
      const rect = item.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const top = rect.top - elementRect.top;
      const bottom = top + rect.height;

      const pageNumber = Math.floor(top / pageHeight);
      const pageEnd = (pageNumber + 1) * pageHeight;

      if (bottom > pageEnd && top < pageEnd) {
        const pushDistance = pageEnd - top + 40;
        item.style.marginTop = `${pushDistance}px`;
        console.log('Pushed item by', pushDistance, 'px');
      }
    });

    return totalPages;
  };

  const resetLayout = (element) => {
    const items = element.querySelectorAll('.cv-item');
    items.forEach(item => {
      item.style.marginTop = '';
    });

    // Reset sidebar height
    const sidebar = element.querySelector('.cv-sidebar');
    if (sidebar) {
      sidebar.style.minHeight = '';
    }
  };

  const [data, setData] = useState({
    name: "John Doe",
    title: "Full Stack Developer",
    phone: "+91 987654321",
    email: "john@example.com",
    address: "New Delhi, India",
    socialLinks: [],
    profileImage: "",
    imageShape: "circle",
    imageAlign: "center",
    visibleSections: {
      summary: true,
      projects: true,
      skills: true,
      languages: true,
      experience: true,
      education: true,
      certificates: true,
      socialLinks: true,
    },

    languages: [
      { name: "English", proficiency: 90 },
      { name: "Hindi", proficiency: 85 },
    ],
    experiences: [
      { role: "Developer", company: "Google", start: "2020", end: "2022" },
      { role: "Software Engineer", company: "Wipro", start: "2022", end: "2023" },
    ],
    education: [
      { degree: "BCA", school: "Calicut university", start: "2020", end: "2022" },
      { degree: "Bcom", school: "Calicut university", start: "2020", end: "2022" },
    ],
    certificates: [
      { name: "Full Stack Development", issuer: "Tech Academy", year: "2023" },
      { name: "Data Structures & Algorithms", issuer: "Code Institute", year: "2022" },
    ],
    projects: [
      {
        name: "E-Commerce Website",
        desc: "Built a full-stack e-commerce platform with React and Node.js",
        year: "2023",
        link: "https://github.com/example",
      },
      {
        name: "Task Management App",
        desc: "Developed a task management application with real-time updates",
        year: "2022",
      },
    ],
    references: [],
    awards: [],
  });

  useEffect(() => {
    const element = document.getElementById('pdf-template');
    if (element) {
      const calculatedPages = adjustLayoutForPageBreaks(element);
      setTotalPages(calculatedPages);
    }

    // Also apply to preview pages
    setTimeout(() => {
      const previewPages = document.querySelectorAll('[data-preview-page]');
      previewPages.forEach(page => {
        const sidebar = page.querySelector('.cv-sidebar');
        const mainContent = page.querySelector('.w-2\\/3');
        if (sidebar && mainContent) {
          const contentHeight = mainContent.scrollHeight;
          const sidebarHeight = sidebar.scrollHeight;
          const maxHeight = Math.max(contentHeight, sidebarHeight);
          const pages = Math.ceil(maxHeight / 1123);
          sidebar.style.minHeight = `${pages * 1123}px`;
        }
      });
    }, 100);
  }, [data]);

  // Initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Load resume by ID from URL parameter
  useEffect(() => {
    const loadResumeById = async () => {
      if (typeof window === "undefined") return;

      const params = new URLSearchParams(window.location.search);
      const resumeIdParam = params.get('resumeId');
      
      if (!resumeIdParam) return;

      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`http://localhost:5000/api/resumes/${resumeIdParam}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const result = await response.json();
        
        if (result.success && result.resume) {
          setData(result.resume.templateData);
          setResumeId(result.resume._id);
          // setToast('Resume loaded successfully');
        }
      } catch (error) {
        console.error('Failed to load resume:', error);
        setToast('Failed to load resume');
      }
    };

    loadResumeById();
  }, []);

  // Load shared data from URL if present
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get("cv");
      if (!encoded) return;

      const payload = decodeDataFromUrl(encoded);
      if (!payload) return;

      // We encoded as { shareId, data }
      if (payload.data) {
        setData(payload.data);
      } else {
        // fallback in case we ever encode just data
        setData(payload);
      }
    } catch (e) {
      console.error("Failed to load shared CV data from URL:", e);
    }
  }, []);

  const allMenuItems = [
    { name: "Personal Details", key: "personal", icon: User, inputKey: "name" },
    { name: "Photo", key: "image", icon: Camera, inputKey: "profileImage" },
    { name: "Social Links", key: "sociallinks", icon: Link2, inputKey: "socialLinks" },
    { name: "Skills", key: "skills", icon: Code, inputKey: "skills" },
    { name: "Education", key: "education", icon: GraduationCap, inputKey: "education" },
    { name: "Work Experience", key: "experience", icon: Briefcase, inputKey: "experiences" },
    { name: "Languages", key: "languages", icon: Globe, inputKey: "languages" },
    { name: "projects", key: "projects", icon: FolderCode, inputKey: "project" },
    { name: "Additional Section", key: "additional", icon: BookPlus, inputKey: "additional" },
    { name: "Templates", key: "templates", icon: LayoutTemplate, inputKey: "templates" },
  ];

  const menuItems = useMemo(() => {
    const config = templateInputs[template] || {};
    return allMenuItems.filter(item => config[item.inputKey] !== false);
  }, [template]);

  const additionalMenuItems = useMemo(() => {
    const config = templateInputs[template] || {};
    const items = [
      { name: "Certificates", key: "certificates", icon: Award, inputKey: "certificates" },
      { name: "References", key: "references", icon: Users, inputKey: "references" },
      { name: "Awards", key: "awards", icon: FileText, inputKey: "awards" },
    ];
    return items.filter(item => !item.inputKey || config[item.inputKey] !== false);
  }, [template]);

  const ChevronDown = ({ className }) => (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );

  const handlePrint = () => {
    document.body.classList.add("print-mode");

    setTimeout(() => {
      window.print();

      setTimeout(() => {
        document.body.classList.remove("print-mode");
      }, 200);
    }, 200);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setToast('Please login to save resume');
        return;
      }

      const response = await fetch('http://localhost:5000/api/resumes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          resumeId: resumeId,
          resumeName: data.name || 'My Resume',
          templateId: template,
          templateData: data
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setResumeId(result.resume.id);
        setToast('Resume saved successfully!');
        setExportMenuOpen(false);
      } else {
        setToast(result.message || 'Failed to save resume');
      }
    } catch (error) {
      console.error('Save error:', error);
      setToast('Failed to save resume');
    }
  };

  const handleSaveAsNew = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setToast('Please login to save resume');
        return;
      }

      const response = await fetch('http://localhost:5000/api/resumes/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          // No resumeId - forces creation of new resume
          resumeName: `${data.name || 'My Resume'} - Copy`,
          templateId: template,
          templateData: data
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setResumeId(result.resume.id);
        setToast('New resume created successfully!');
        setExportMenuOpen(false);
      } else {
        setToast(result.message || 'Failed to create new resume');
      }
    } catch (error) {
      console.error('Save as new error:', error);
      setToast('Failed to create new resume');
    }
  };




  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="relative">

   
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      <div className="h-screen flex bg-[#F6F5F6] text-gray-800 overflow-hidden">
        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border border-indigo-100"
        >
          {mobileMenuOpen ? (
            <X size={24} className="text-indigo-600" />
          ) : (
            <Menu size={24} className="text-indigo-600" />
          )}
        </button>


        {/* SIDEBAR */}
        <aside
          className={`
          bg-white/70 border-r border-indigo-50 flex flex-col items-center lg:items-stretch transition-all duration-300
          fixed lg:static inset-y-0 left-0 z-40
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${collapsed ? 'w-20 lg:w-24' : 'w-64 sm:w-72 lg:w-76 xl:w-80'}
        `}
        >
          <div className="w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-start gap-2 sm:gap-3 border-b border-gray-200">
            {!collapsed && (
              <div className="relative flex-shrink-0 w-20 sm:w-24 lg:w-28 h-8 sm:h-9 lg:h-10">
                <Image src="/cvlogo.png" alt="Logo" fill className="object-contain" />
              </div>
            )}
            <button
              onClick={() => setCollapsed(prev => !prev)}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className={`
            ${collapsed ? "mx-auto" : "ml-auto"} 
            inline-flex items-center justify-center 
            w-7 h-7 sm:w-8 sm:h-8 
            text-indigo-600 rounded-full 
            hover:bg-[#F2F0FF] transition
          `}
            >
              <ChevronLeft
                size={22}
                className={`${collapsed ? "rotate-180" : ""} transition-transform`}
              />
            </button>

          </div>

          <nav
            className={`
          w-full 
          ${collapsed ? "px-6" : "px-3 sm:px-4 lg:px-8"} 
          py-4 sm:py-6 lg:py-6
          flex-1 overflow-auto transition-all duration-300
        `}
          >
            <div className="flex flex-col gap-2 sm:gap-3">
             {menuItems.map(item => {
  if (item.key === "templates") {
    // We render templates later, AFTER additional items
    return null;
  }

  return (
    <button
      key={item.key}
      ref={item.key === "additional" ? additionalBtnRef : null}
      onClick={() => handleMenuItemClick(item.key)}
      title={item.name}
      className={`
        flex items-center 
        ${collapsed ? "justify-center w-10 h-10 rounded-full"
                    : "gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full "}
        transition-all text-xs sm:text-sm font-medium       
        ${selectedMenu === item.key
                    ? "bg-gradient-to-r from-[#4B74F4] to-[#7642EE] text-white shadow-md scale-[1.02]"
                    : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
        }
      `}
    >
      <item.icon size={18} className={`${collapsed ? "mx-auto" : ""}`} />
      {!collapsed && (
        <span className="truncate flex items-center gap-1">
          {item.name}
          {item.key === "additional" && (
            additionalOpen ?
              <ChevronUp size={16}/> :
              <ChevronDown size={16}/>
          )}
        </span>
      )}
    </button>
  );
})}

{/* Now insert additional submenu BEFORE Templates */}
{additionalOpen && (
  <div className={`
    ${collapsed
      ? "fixed z-[99999] bg-white shadow-xl border border-gray-200 rounded-xl p-2"
      : "ml-3 mt-2 flex flex-col border-l-4 border-indigo-400 pl-2"}
  `}
    style={
      collapsed
        ? { top: additionalBtnY, left: additionalBtnX + 50 }
        : {}
    }
  >
    <div className="text-[11px] uppercase text-indigo-400 font-semibold mb-1">
      Additional Fields
    </div>
    
    {additionalMenuItems.map(item => (
      <button
        key={item.key}
        onClick={() => handleMenuItemClick(item.key)}
        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-indigo-50 text-indigo-700 border border-indigo-200 mt-1"
      >
        <item.icon size={18}/>
        <span>{item.name}</span>
      </button>
    ))}
  </div>
)}

{/* Finally render Templates button here */}
{menuItems.find(it => it.key === "templates") && (
  <button
    key={"templates"}
    onClick={() => handleMenuItemClick("templates")}
    title="Templates"
    className={`
      flex items-center 
      ${collapsed ? "justify-center w-10 h-10 rounded-full"
                  : "gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full "}
      transition-all text-xs sm:text-sm font-medium       
      ${selectedMenu === "templates"
                  ? "bg-gradient-to-r from-[#4B74F4] to-[#7642EE] text-white shadow-md scale-[1.02]"
                  : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
      }
    `}
  >
    <LayoutTemplate size={18} className={`${collapsed ? "mx-auto" : ""}`} />
    {!collapsed && <span className="truncate">Templates</span>}
  </button>
)}

{/* Quick Tips Section */}
{!collapsed && (
  <div className="p-4 bg-[#F4EEFF] rounded-xl mt-4 border border-indigo-100">
    <h3 className="text-sm font-semibold text-[#6C4CCF]">Quick Tips</h3>
    <ul className="mt-2 text-xs text-[#6C4CCF] leading-relaxed space-y-1">
      <li>• Click any section to start editing</li>
      <li>• Changes save automatically</li>
      <li>• Download as PDF when ready</li>
      <li>• Try different templates</li>
    </ul>
  </div>
)}

            </div>



          </nav>
        </aside>

        {/* OVERLAY FOR MOBILE MENU */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* TEMPLATE PREVIEW */}
        <div className="flex-1 flex flex-col overflow-hidden pt-16 lg:pt-0">
          {/* Topbar */}
          <div className="flex items-center justify-between px-4 sm:px-8 lg:px-20 pt-4 sm:pt-6 lg:pt-8 bg-transparent">
            {/* LEFT → HOME BUTTON */}
            <div>
              <button
                onClick={() => router.push('/')}
                title="Back to Home Page"
                className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-2 py-1.5 sm:py-2 
              rounded-lg bg-white/80 text-[#634BC9] hover:bg-[#634BC9] hover:text-white transition text-xs sm:text-sm">
                <Home
                  className="w-4 h-4 sm:w-6 sm:h-6 "
                />
              </button>
            </div>
            {/* RIGHT → OTHER ACTION BUTTONS */}
            <div className="flex items-center justify-end gap-2 sm:gap-4">
              {/* Print */}
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-[#634BC9] text-white hover:bg-indigo-700 transition text-xs sm:text-sm">
                <Printer size={14} className="sm:w-3 sm:h-3" />
                <span className="hidden sm:inline">Print</span>
              </button>


              {/* Share dropdown (URL / Copy / PDF) */}
              <div ref={shareMenuRef} className="relative">
                <button
                  onClick={() => setShareMenuOpen(prev => !prev)}
                  className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-[#634BC9] text-white hover:bg-indigo-700 transition text-xs sm:text-sm shadow-sm">
                  <Share2 size={14} className="sm:w-3 sm:h-3" />
                  <span className="hidden sm:inline">Share</span>
                </button>
                {shareMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur border border-indigo-100 rounded-2xl shadow-xl z-30 text-xs sm:text-sm overflow-hidden">
                    {/* Top label */}
                    <div className="px-3 py-2 bg-gradient-to-r from-[#F3F0FF] to-[#E9F1FF] border-b border-indigo-50">
                      <p className="text-[11px] sm:text-xs font-medium text-[#5B46C8]">
                        Share your resume
                      </p>
                      <p className="text-[10px] text-[#8E7FD9]">
                        Choose how you want to send it
                      </p>
                    </div>
                    {/* Share as PDF */}
                    <button
                      onClick={() => {
                        setShareMenuOpen(false);
                        handleSharePdf();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-indigo-50/70 transition text-left"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100">
                        <Download size={14} className="text-[#634BC9]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#342768] text-[11px] sm:text-xs">
                          Share as PDF
                        </span>
                        <span className="text-[10px] text-[#8E7FD9]">
                          Perfect for email & print
                        </span>
                      </div>
                    </button>
                    {/* Share URL */}
                    <button
                      onClick={() => {
                        setShareMenuOpen(false);
                        handleShareUrl();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-indigo-50/70 transition text-left"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50">
                        <Link2 size={14} className="text-emerald-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#342768] text-[11px] sm:text-xs">
                          Share URL
                        </span>
                        <span className="text-[10px] text-[#8E7FD9]">
                          Open resume directly in browser
                        </span>
                      </div>
                    </button>
                    {/* Copy link */}
                    <button
                      onClick={() => {
                        setShareMenuOpen(false);
                        handleCopyLink();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-indigo-50/70 transition text-left border-t border-dashed border-indigo-100"
                    >
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFF7E6]">
                        <Share2 size={14} className="text-amber-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#342768] text-[11px] sm:text-xs">
                          Copy link
                        </span>
                        <span className="text-[10px] text-[#8E7FD9]">
                          Paste into WhatsApp, Mail, etc.
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
              {/* Export Menu */}
              <div ref={exportMenuRef} className="relative">
              <button
                  onClick={() => setExportMenuOpen(prev => !prev)}
                  className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-[#634BC9] text-white hover:bg-indigo-700 transition text-xs sm:text-sm shadow-sm"
                >
                  <Download size={14} className="sm:w-3 sm:h-3" />
                  <span className="hidden md:inline">Export</span>
                  <span className="md:hidden">PDF</span>
                </button>
  
              {exportMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur border border-indigo-100 rounded-2xl shadow-xl z-30 text-xs sm:text-sm overflow-hidden">
                  {/* Top label */}
                  <div className="px-3 py-2 bg-gradient-to-r from-[#F3F0FF] to-[#E9F1FF] border-b border-indigo-50">
                    <p className="text-[11px] sm:text-xs font-medium text-[#5B46C8]">
                      Save & Export Options
                    </p>
                    <p className="text-[10px] text-[#8E7FD9]">
                      Choose how to save your resume
                    </p>
                  </div>
                    {/* Save */}
                  <button
                    onClick={handleSave}
                    className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-indigo-50/70 transition text-left"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100">
                      <FileText size={14} className="text-green-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#342768] text-[11px] sm:text-xs">
                        Save
                      </span>
                      <span className="text-[10px] text-[#8E7FD9]">
                        Update existing resume
                      </span>
                    </div>
                  </button>

                  {/* Save As New */}
                  <button
                    onClick={handleSaveAsNew}
                    className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-indigo-50/70 transition text-left"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                      <FileText size={14} className="text-blue-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#342768] text-[11px] sm:text-xs">
                        Save As New
                      </span>
                      <span className="text-[10px] text-[#8E7FD9]">
                        Create a new resume copy
                      </span>
                    </div>
                  </button>

                  {/* Export PDF */}
                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      handleDownload();
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2.5 hover:bg-indigo-50/70 transition text-left border-t border-dashed border-indigo-100"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100">
                      <Download size={14} className="text-[#634BC9]" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-[#342768] text-[11px] sm:text-xs">
                        Export PDF
                      </span>
                      <span className="text-[10px] text-[#8E7FD9]">
                        Download as PDF file
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
          {/* Preview area */}
          <div className="flex-1 overflow-auto px-3 sm:px-6 lg:px-20 py-3 sm:py-6 lg:py-8">
            <div className="mx-auto max-w-6xl">
              <div className="shadow-lg border border-gray-100 overflow-hidden rounded-xl sm:rounded-2xl">
                <div className="relative">
                  <div className="h-14 sm:h-16 lg:h-20 rounded-t-xl sm:rounded-t-2xl bg-[#F2F5FC] border border-[#E4DEF3] border-b-0 flex items-center justify-between px-3 sm:px-4 lg:px-6 relative z-10">
                    <div className="flex items-center gap-1.5 sm:gap-2 pb-1 sm:pb-2">
                      <span className="text-[#7B61FF]">
                        <Sparkles size={18} className="sm:w-5 sm:h-5 lg:w-[22px] lg:h-[22px] animate-[spin_3s_linear_infinite,zoom_2s_ease-in-out_infinite]" />
                      </span>
                      <h2 className="text-sm sm:text-base lg:text-xl font-semibold text-[#9C90DD] whitespace-nowrap">
                        AI Generated Preview
                      </h2>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-4 pb-1 sm:pb-2">
                      <button
                        onClick={handleZoomIn}
                        className="flex p-1.5 sm:p-2 rounded-full border border-[#C7BFF3] hover:bg-white transition"
                      >
                        <ZoomIn size={14} className="sm:w-4 sm:h-4 text-[#7B61FF]" />
                      </button>
                      <button
                        onClick={handleZoomOut}
                        className="flex p-1.5 sm:p-2 rounded-full border border-[#C7BFF3] hover:bg-white transition"
                      >
                        <ZoomOut size={14} className="sm:w-4 sm:h-4 text-[#7B61FF]" />
                      </button>
                      <button
                        onClick={() => setPreviewOpen(true)}
                        className="hidden sm:flex p-1.5 sm:p-2 rounded-full border border-[#C7BFF3] hover:bg-white transition">
                        <Expand size={14} className="sm:w-4 sm:h-4 text-[#7B61FF]" />
                      </button>
                    </div>
                    <div className="h-6 sm:h-8 bg-gradient-to-r from-[#4B74F4] to-[#7642EE] rounded-t-xl sm:rounded-t-2xl absolute left-0 right-0 -bottom-3 sm:-bottom-4 z-20"></div>
                  </div>
                  <div className="w-full overflow-auto bg-gray-50 pt-4">
                    {TemplateComponent ? (
                      <div
                        className="space-y-5"
                        style={{
                          transform: `scale(${scale})`,
                          transformOrigin: "top center",
                          transition: "transform 0.2s ease-in-out",
                        }}
                      >
                        {Array.from({ length: totalPages }).map((_, pageIndex) => (
                          <div
                            key={pageIndex}
                            data-preview-page
                            style={{
                              height: "1123px",
                              width: "794px",
                              overflow: "hidden",
                              position: "relative",
                            }}
                            className="bg-white shadow-xl mx-auto"
                          >
                            {pageIndex > 0 && (
                              <button
                                onClick={() => setTotalPages(pageIndex)}
                                className="absolute top-3 left-3 z-10 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 flex items-center justify-center shadow-lg"
                                title="Remove this page"
                              >
                                ✕
                              </button>
                            )}
                            <div
                              style={{
                                position: "absolute",
                                top: -(pageIndex * 1123),
                                left: 0,
                                width: "100%",
                              }}
                            >
                              <TemplateComponent data={data} />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="p-5 text-red-500">Template not found.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reusable Popup */}
        <PopupEditor
          visible={!!openSection}
          section={openSection}
          onClose={() => setOpenSection(null)}
          selectedTemplate={template}
          data={data}
          update={update}
          onNext={(nextSection) => {
            setOpenSection(nextSection);
            setSelectedMenu(nextSection);
          }}
        />
        {/* Hidden PDF template */}
        <div
          id="pdf-template"
          className="fixed top-0 left-0 m-0 p-0"
          style={{
            width: "794px",
            minHeight: "1123px",
            overflow: "hidden",
            position: "absolute",
            top: "-99999px",
            left: "-99999px",
            background: "white",
          }}
        >
          {TemplateComponent && <TemplateComponent data={data} />}
        </div>
        {previewOpen && (
          <div className="absolute inset-0 bg-black bg-opacity-80 z-[9999] flex justify-center py-6  overflow-auto">
            {/* Template wrapper */}
            <div
              className="bg-white rounded-lg shadow-lg relative   "
              style={{ width: "794px" }}
            >
              {/* Close button */}
              <button
                onClick={() => setPreviewOpen(false)}
                className="absolute top-3 right-3 z-50 bg-white text-black p-1 rounded-full shadow-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
              {/* Template */}
              <TemplateComponent data={data} />
            </div>
          </div>
        )}
      </div>
      <TemplateSelector
  open={templateSelectorOpen}
  selectedTemplate={template}
  onClose={() => setTemplateSelectorOpen(false)}
  onSelectTemplate={(key) => {
    setTemplate(key.toLowerCase());
    setTemplateSelectorOpen(false);
  }}
/>
 </div>
    </>
  );
}