'use client';
import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { templates, templateInputs } from "../templates";
import { User, Camera, Link2, Code, GraduationCap, Briefcase, Globe, Award, Printer, Share2, Download, ZoomIn, ZoomOut, Expand, Sparkles, ChevronLeft, Menu, FolderCode, X, Home, FileText, Users } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PopupEditor from "./PopupEditor"; // reusable popup

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

  const router = useRouter();


  const [totalPages, setTotalPages] = useState(1);
  const update = (key, value) => setData(prev => ({ ...prev, [key]: value }));

  const handleMenuItemClick = (key) => {
    setOpenSection(key);
    setSelectedMenu(key);
    setMobileMenuOpen(false);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));

  const handleDownload = async () => {
    const element = document.getElementById("pdf-template");
    if (!element) return;

    // Freeze alignment ONLY during PDF
    element.classList.remove("freeze-layout");
    const calculatedPages = adjustLayoutForPageBreaks(element);

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    for (let page = 0; page < calculatedPages; page++) {
      if (page > 0) pdf.addPage();
      const yOffset = -(page * pageHeight);
      pdf.addImage(imgData, "PNG", 0, yOffset, imgWidth, imgHeight);
    }

    resetLayout(element);
    pdf.save(`${data.name || "cv"}.pdf`);
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
      socialLinks: true
    },

    languages: [
      { name: "English", proficiency: 90 },
      { name: "Hindi", proficiency: 85 }
    ],
    experiences: [
      { role: "Developer", company: "Google", start: "2020", end: "2022" },
      { role: "Software Engineer", company: "Wipro", start: "2022", end: "2023" }
    ],
    education: [
      { degree: "BCA", school: "Calicut university", start: "2020", end: "2022" },
      { degree: "Bcom", school: "Calicut university", start: "2020", end: "2022" }
    ],
    certificates: [
      { name: "Full Stack Development", issuer: "Tech Academy", year: "2023" },
      { name: "Data Structures & Algorithms", issuer: "Code Institute", year: "2022" }
    ],
    projects: [
      { name: "E-Commerce Website", desc: "Built a full-stack e-commerce platform with React and Node.js", year: "2023", link: "https://github.com/example" },
      { name: "Task Management App", desc: "Developed a task management application with real-time updates", year: "2022" }
    ],
    references: [],
    awards: []
  });

  // Apply page breaks in real-time preview
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


  const allMenuItems = [
    { name: "Personal Details", key: "personal", icon: User, inputKey: "name" },
    { name: "Photo", key: "image", icon: Camera, inputKey: "profileImage" },
    { name: "Social Links", key: "sociallinks", icon: Link2, inputKey: "socialLinks" },
    { name: "Skills", key: "skills", icon: Code, inputKey: "skills" },
    { name: "Education", key: "education", icon: GraduationCap, inputKey: "education" },
    { name: "Work Experience", key: "experience", icon: Briefcase, inputKey: "experiences" },
    { name: "Languages", key: "languages", icon: Globe, inputKey: "languages" },
    { name: "projects", key: "projects", icon: FolderCode, inputKey: "project" },
  ];

  const menuItems = useMemo(() => {
    const config = templateInputs[template] || {};
    return allMenuItems.filter(item => config[item.inputKey] !== false);
  }, [template]);

  const additionalMenuItems = useMemo(() => {
    const config = templateInputs[template] || {};
    const items = [
      { name: "Awards", key: "awards", icon: FileText, inputKey: "awards" },
      { name: "References", key: "references", icon: Users, inputKey: "references" },
      { name: "Certificates", key: "certificates", icon: Award, inputKey: "certificates" },
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




  return (
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
            {menuItems.map(item => (
              <button
                key={item.key}
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
                {!collapsed && <span className="truncate">{item.name}</span>}
              </button>
            ))}
          </div>

          {!collapsed && (
            <>
              <div className="mt-4">
                <button
                  onClick={() => setAdditionalOpen(!additionalOpen)}
                  className="flex items-center justify-between w-full gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full transition-all text-xs sm:text-sm font-medium bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                >
                  <span className="truncate">Additional Section</span>
                  <ChevronDown className={`transition-transform ${additionalOpen ? 'rotate-180' : ''}`} />
                </button>

                {additionalOpen && (
                  <div className="flex flex-col gap-2 sm:gap-3 mt-2 ml-2">
                    {additionalMenuItems.map(item => (
                      <button
                        key={item.key}
                        onClick={() => handleMenuItemClick(item.key)}
                        title={item.name}
                        className={`
                          flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full
                          transition-all text-xs sm:text-sm font-medium
                          ${selectedMenu === item.key
                            ? "bg-gradient-to-r from-[#4B74F4] to-[#7642EE] text-white shadow-md scale-[1.02]"
                            : "bg-white text-indigo-700 border border-indigo-200 hover:bg-indigo-50"
                          }
                        `}
                      >
                        <item.icon size={18} />
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-[#F4EEFF] rounded-xl mt-4">
                <h3 className="text-sm font-semibold text-[#6C4CCF]">Quick Tips</h3>
                <ul className="mt-2 text-xs text-[#6C4CCF] leading-relaxed space-y-1">
                  <li>• Click any section to start editing</li>
                  <li>• Changes save automatically</li>
                  <li>• Download as PDF when ready</li>
                  <li>• Try different templates</li>
                </ul>
              </div>
            </>
          )}
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
              rounded-lg bg-white/80 text-[#634BC9] hover:bg-[#634BC9] hover:text-white transition text-xs sm:text-sm"
            >
              <Home
                className="w-4 h-4 sm:w-6 sm:h-6 "
              />
            </button>
          </div>


          {/* RIGHT → OTHER ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-[#634BC9] text-white hover:bg-indigo-700 transition text-xs sm:text-sm">
              <Printer size={14} className="sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-[#634BC9] text-white hover:bg-indigo-700 transition text-xs sm:text-sm">
              <Share2 size={14} className="sm:w-3 sm:h-3" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg bg-[#634BC9] text-white hover:bg-indigo-700 transition text-xs sm:text-sm"
            >
              <Download size={14} className="sm:w-3 sm:h-3" />
              <span className="hidden md:inline">Export PDF</span>
              <span className="md:hidden">PDF</span>
            </button>
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
                      <Sparkles size={18} className="sm:w-5 sm:h-5 lg:w-[22px] lg:h-[22px]" />
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
        <div className="absolute inset-0 bg-black bg-opacity-60 z-[9999] flex justify-center py-6  overflow-auto">
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
  );
}