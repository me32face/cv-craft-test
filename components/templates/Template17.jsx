"use client";
import { useState, useRef, useEffect } from "react";
import {
  CopyPlus,
  Trash,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const initialData = {
  name: "HANNA MORALES",
  title: "DIGITAL MARKETING",
  about:
    "Energetic digital marketing with 5+ years of experience in digital marketing company. Skilled in data processing and documentation analysis. At Liceria & Co. helped to increase work efficiency by 10% by implementing a new documentation workflow system.",
  contact: {
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    address: "123 Anywhere St., Any City",
  },
  skills: [
    "Program",
    "Marketing Analysis",
    "Team Work",
    "Technology",
    "Marketing",
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

// Helper component for auto-resizing textarea
function AutoResizeTextarea({ value, onChange, className = "", ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);

  return (
    <textarea
      {...props}
      ref={ref}
      value={value}
      onChange={onChange}
      className={`resize-none overflow-hidden ${className}`}
      rows={1}
      spellCheck={false}
    />
  );
}

function App() {
  const [name, setName] = useState(initialData.name);
  const [title, setTitle] = useState(initialData.title);
  const [about, setAbout] = useState(initialData.about);
  const [contact, setContact] = useState(initialData.contact);
  const [skills, setSkills] = useState(initialData.skills);
  const [languages, setLanguages] = useState(initialData.languages);
  const [workExperience, setWorkExperience] = useState(initialData.workExperience);
  const [education, setEducation] = useState(initialData.education);
  const [profileImage, setProfileImage] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);

  // Global download function
  const downloadCV = async () => {
    if (!cvRef.current || isDownloading) return;
    
    setIsDownloading(true);
    
    try {
      const cvElement = cvRef.current;
      
      // Store original scale
      const originalScale = editorContainerRef.current?.style.transform || '';
      
      // Reset scale for capture
      if (editorContainerRef.current) {
        editorContainerRef.current.style.transform = 'scale(1)';
        editorContainerRef.current.style.marginTop = '0';
      }

      // Use html2canvas to capture the CV
      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: cvElement.scrollWidth,
        height: cvElement.scrollHeight,
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Download the PDF
      pdf.save(`${name.replace(/\s+/g, '_')}_CV.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      // Restore original scale
      if (editorContainerRef.current) {
        editorContainerRef.current.style.transform = originalScale;
        editorContainerRef.current.style.marginTop = '';
      }
      setIsDownloading(false);
    }
  };

  // Add global keyboard shortcut (Ctrl+D or Cmd+D)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        downloadCV();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [downloadCV]);

  // Make download function globally available
  useEffect(() => {
    // Add to window object for global access
    window.downloadCV = downloadCV;
    
    return () => {
      // Cleanup
      delete window.downloadCV;
    };
  }, [downloadCV]);

  // Duplicate / delete handlers
  function duplicateItem(list, setList, id) {
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return;
    const itemToDuplicate = list[index];
    const newItem = {
      ...itemToDuplicate,
      id: Math.max(...list.map((i) => i.id)) + 1,
      details: itemToDuplicate.details ? [...itemToDuplicate.details] : undefined,
    };
    const newList = [...list];
    newList.splice(index + 1, 0, newItem);
    setList(newList);
  }

  function deleteItem(list, setList, id) {
    if (list.length === 1) return;
    setList(list.filter((item) => item.id !== id));
  }

  function duplicateSimpleItem(arr, setArr, index) {
    const newArr = [...arr];
    newArr.splice(index + 1, 0, newArr[index]);
    setArr(newArr);
  }

  function deleteSimpleItem(arr, setArr, index) {
    if (arr.length === 1) return;
    const newArr = [...arr];
    newArr.splice(index, 1);
    setArr(newArr);
  }

  function updateWorkDetail(weIndex, detailIndex, value) {
    const newWE = [...workExperience];
    newWE[weIndex].details[detailIndex] = value;
    setWorkExperience(newWE);
  }

  function addWorkDetail(weIndex) {
    const newWE = [...workExperience];
    newWE[weIndex].details.push("");
    setWorkExperience(newWE);
  }

  function deleteWorkDetail(weIndex, detailIndex) {
    const newWE = [...workExperience];
    if (newWE[weIndex].details.length === 1) return;
    newWE[weIndex].details.splice(detailIndex, 1);
    setWorkExperience(newWE);
  }

  function duplicateWorkDetail(weIndex, detailIndex) {
    const newWE = [...workExperience];
    newWE[weIndex].details.splice(detailIndex + 1, 0, newWE[weIndex].details[detailIndex]);
    setWorkExperience(newWE);
  }

  function handleImageChange(e) {
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
    <div className="w-[210mm] h-[297mm] bg-white shadow-2xl flex overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-[35%] bg-black text-white flex flex-col items-center py-6 px-8 leading-relaxed">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-black bg-gray-300 mb-6 relative cursor-pointer">
          <img
            src={profileImage || "/profile-placeholder.png"}
            alt="Profile"
            className="w-full h-full object-cover"
            draggable={false}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Contact */}
        <section className="w-full mb-6">
          <h2 className="font-bold text-xl border-b border-white pb-1 mb-4 tracking-wide">
            CONTACT
          </h2>
          <div className="space-y-3">
            {[
              { icon: <Phone size={16} />, value: contact.phone, key: "phone" },
              { icon: <Mail size={16} />, value: contact.email, key: "email" },
              { icon: <MapPin size={16} />, value: contact.address, key: "address" },
            ].map(({ icon, value, key }) => (
              <div
                key={key}
                className="group flex items-center gap-2 relative"
              >
                {icon}
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setContact((c) => ({ ...c, [key]: e.target.value }))
                  }
                  className="bg-transparent outline-none flex-1 text-sm"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="w-full mb-6">
          <h2 className="font-bold text-xl border-b border-white pb-1 mb-4 tracking-wide">
            SKILLS
          </h2>
          <ul className="space-y-2">
            {skills.map((skill, i) => (
              <li
                key={i}
                className="group flex items-center justify-between gap-2 relative"
              >
                <span className="text-lg select-none">•</span>
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => {
                    const newSkills = [...skills];
                    newSkills[i] = e.target.value;
                    setSkills(newSkills);
                  }}
                  className="bg-transparent outline-none flex-1 text-sm"
                />
                <div className="flex gap-2 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyPlus
                    size={16}
                    className="cursor-pointer hover:text-gray-400"
                    onClick={() => duplicateSimpleItem(skills, setSkills, i)}
                  />
                  <Trash
                    size={16}
                    className="cursor-pointer hover:text-gray-400"
                    onClick={() => deleteSimpleItem(skills, setSkills, i)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Language */}
        <section className="w-full">
          <h2 className="font-bold text-xl border-b border-white pb-1 mb-4 tracking-wide">
            LANGUAGE
          </h2>
          <ul className="space-y-2">
            {languages.map((lang, i) => (
              <li
                key={i}
                className="group flex items-center justify-between gap-2 relative"
              >
                <span className="text-lg select-none">•</span>
                <input
                  type="text"
                  value={lang}
                  onChange={(e) => {
                    const newLangs = [...languages];
                    newLangs[i] = e.target.value;
                    setLanguages(newLangs);
                  }}
                  className="bg-transparent outline-none flex-1 text-sm"
                />
                <div className="flex gap-2 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyPlus
                    size={16}
                    className="cursor-pointer hover:text-gray-400"
                    onClick={() => duplicateSimpleItem(languages, setLanguages, i)}
                  />
                  <Trash
                    size={16}
                    className="cursor-pointer hover:text-gray-400"
                    onClick={() => deleteSimpleItem(languages, setLanguages, i)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </aside>

      {/* Right Content */}
      <section className="flex-1 bg-white p-8 leading-relaxed text-gray-900">
        {/* Name and Title */}
        <header className="mb-6">
          <input
            type="text"
            className="font-bold text-3xl leading-tight w-full border-b-2 border-gray-400 focus:outline-none focus:border-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="uppercase tracking-widest text-gray-700 font-semibold text-base mt-1 w-full bg-transparent outline-none border-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </header>

        {/* About Me */}
        <section className="mb-6">
          <h2 className="font-bold text-xl border-b-2 border-black mb-4 tracking-wide">
            ABOUT ME
          </h2>
          <AutoResizeTextarea
            className="w-full bg-transparent border-none focus:outline-none text-sm leading-normal"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </section>

        {/* Work Experience */}
        <section className="mb-6">
          <h2 className="font-bold text-xl border-b-2 border-black mb-4 tracking-wide">
            WORK EXPERIENCE
          </h2>
          <div className="flex flex-col gap-6 relative">
            {workExperience.map((job, i) => (
              <div key={job.id} className="relative pl-6">
                <div className="absolute left-0 top-1 h-full flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-900 mb-6"></div>
                  {i !== workExperience.length - 1 && (
                    <div className="w-[1px] bg-gray-900 flex-1"></div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-2 group relative">
                  <input
                    type="text"
                    className="font-semibold text-base w-full bg-transparent outline-none"
                    value={job.position}
                    onChange={(e) => {
                      const newWE = [...workExperience];
                      newWE[i].position = e.target.value;
                      setWorkExperience(newWE);
                    }}
                  />
                  <div className="flex gap-2 ml-3 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyPlus
                      size={16}
                      className="cursor-pointer hover:text-gray-400"
                      onClick={() => duplicateItem(workExperience, setWorkExperience, job.id)}
                    />
                    <Trash
                      size={16}
                      className="cursor-pointer hover:text-gray-400"
                      onClick={() => deleteItem(workExperience, setWorkExperience, job.id)}
                    />
                  </div>
                </div>

                <input
                  type="text"
                  className="font-semibold mb-3 text-sm w-full bg-transparent outline-none text-gray-600"
                  value={job.duration}
                  onChange={(e) => {
                    const newWE = [...workExperience];
                    newWE[i].duration = e.target.value;
                    setWorkExperience(newWE);
                  }}
                />

                <ul className="list-disc list-inside space-y-1">
                  {job.details.map((detail, dI) => (
                    <li
                      key={dI}
                      className="group flex items-center gap-2 relative text-sm"
                    >
                      <AutoResizeTextarea
                        className="flex-1 bg-transparent outline-none text-sm leading-tight"
                        value={detail}
                        onChange={(e) =>
                          updateWorkDetail(i, dI, e.target.value)
                        }
                      />
                      <div className="flex gap-2 absolute right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <CopyPlus
                          size={14}
                          className="cursor-pointer hover:text-gray-400"
                          onClick={() =>
                            duplicateWorkDetail(i, dI)
                          }
                        />
                        <Trash
                          size={14}
                          className="cursor-pointer hover:text-gray-400"
                          onClick={() =>
                            deleteWorkDetail(i, dI)
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="font-bold text-xl border-b-2 border-black mb-4 tracking-wide">
            EDUCATION
          </h2>
          <ul className="space-y-4">
            {education.map((edu, idx) => (
              <li key={edu.id} className="relative group">
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => {
                    const newEdu = [...education];
                    const index = newEdu.findIndex((ed) => ed.id === edu.id);
                    if (index === -1) return;
                    newEdu[index].degree = e.target.value;
                    setEducation(newEdu);
                  }}
                  className="font-semibold text-base w-full bg-transparent outline-none"
                />
                <AutoResizeTextarea
                  className="w-full bg-transparent outline-none text-sm"
                  value={edu.description}
                  onChange={(e) => {
                    const newEdu = [...education];
                    const index = newEdu.findIndex((ed) => ed.id === edu.id);
                    if (index === -1) return;
                    newEdu[index].description = e.target.value;
                    setEducation(newEdu);
                  }}
                />

                {/* Duplicate & Delete buttons */}
                <div className="absolute right-0 top-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <CopyPlus
                    size={14}
                    className="cursor-pointer hover:text-gray-400"
                    onClick={() => {
                      const newEdu = [...education];
                      newEdu.splice(idx + 1, 0, { ...edu, id: Date.now() });
                      setEducation(newEdu);
                    }}
                  />
                  <Trash
                    size={14}
                    className="cursor-pointer hover:text-gray-400"
                    onClick={() => {
                      const newEdu = education.filter((_, i) => i !== idx);
                      setEducation(newEdu);
                    }}
                  />
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
      <div
        ref={editorContainerRef}
        data-editor-container
        className="flex flex-col items-center scale-[0.5] origin-top transition-transform duration-500 pt-10"
      >
        <div ref={cvRef} data-cv-page>
          <CVPage />
        </div>
      </div>
    </div>
  );
}

export default App;