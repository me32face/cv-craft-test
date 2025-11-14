"use client";
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  Phone, Mail, MapPin, CopyPlus, Trash2, Menu, Upload, Monitor,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette,
  Briefcase, GraduationCap
} from 'lucide-react';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

// Safe top-level wrapper so export at bottom won't fail on server build
export const globalFormat = (...args) => {
  if (typeof window !== 'undefined' && typeof window.globalFormat === 'function') {
    return window.globalFormat(...args);
  }
  return null;
};

// --- UTILITY FUNCTIONS & INITIAL DATA ---
const generateId = () => crypto.randomUUID();

const DND_ITEM_TYPE = {
  WORK_EXP: 'work_exp',
  EDUCATION: 'education',
  SKILL: 'skill',
  LANGUAGE: 'language',
};

const INITIAL_RESUME_DATA = {
  profile: {
    name: "DANIEL GALLEGO",
    role: "DEVELOPER",
    summary: "Experienced mobile developer with strong frontend skills and team leadership experience.",
    image: null,
  },
  contact: {
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    address: "123 Anywhere St., Any City, St 12345",
  },
  workExperience: [
    { id: generateId(), company: "Tech Solutions Inc.", position: "Senior Developer", period: "2022 - Present", description: "Led development team\nDesigned core app architecture" },
    { id: generateId(), company: "Web Innovations", position: "Frontend Developer", period: "2020 - 2022", description: "Built responsive UI components\nImproved page load times" },
  ],
  education: [
    { id: generateId(), degree: "Master of Computer Science", institution: "State University", period: "2018 - 2020", description: "GPA: 3.8/4.0" },
    { id: generateId(), degree: "Bachelor of Software Engineering", institution: "City College", period: "2014 - 2018", description: "GPA: 3.9/4.0" },
  ],
  skills: [
    { id: generateId(), label: "Skill 1", value: 30 },
    { id: generateId(), label: "Skill 2", value: 45 },
    { id: generateId(), label: "Skill 3", value: 35 },
    { id: generateId(), label: "Skill 4", value: 55 },
  ],
  languages: [
    { id: generateId(), label: "English", value: 95 },
    { id: generateId(), label: "Spanish", value: 70 },
  ],
};

// --- GLOBAL FORMATTING SYSTEM ---
export const globalFormatting = {
  bold: (element) => { if (element) element.style.fontWeight = element.style.fontWeight === 'bold' ? '' : 'bold'; },
  italic: (element) => { if (element) element.style.fontStyle = element.style.fontStyle === 'italic' ? '' : 'italic'; },
  underline: (element) => { if (element) element.style.textDecoration = element.style.textDecoration === 'underline' ? '' : 'underline'; },
  alignLeft: (element) => { if (element) element.style.textAlign = 'left'; },
  alignCenter: (element) => { if (element) element.style.textAlign = 'center'; },
  alignRight: (element) => { if (element) element.style.textAlign = 'right'; },
  setColor: (element, color) => { if (element) element.style.color = color; },
  setBackgroundColor: (element, color) => { if (element) element.style.backgroundColor = color; },
  setFontSize: (element, size) => { if (element) element.style.fontSize = size; },
  setFontFamily: (element, fontFamily) => { if (element) element.style.fontFamily = fontFamily; },
  reset: (element) => {
    if (!element) return;
    element.style.fontWeight = '';
    element.style.fontStyle = '';
    element.style.textDecoration = '';
    element.style.textAlign = '';
    element.style.color = '';
    element.style.backgroundColor = '';
    element.style.fontSize = '';
    element.style.fontFamily = '';
  }
};

const useGlobalFormatting = () => {
  const [activeElement, setActiveElement] = useState(null);
  const applyFormatting = useCallback((formatFunction, ...args) => {
    if (activeElement) formatFunction(activeElement, ...args);
  }, [activeElement]);
  return { activeElement, setActiveElement, applyFormatting };
};

// --- CORE UTILITY COMPONENTS ---
const EditableText = ({ tag: Tag = 'div', value = '', onUpdate = () => {}, className = '', formattingEnabled = true, onFocus }) => {
  const ref = useRef(null);
  const { setActiveElement } = useGlobalFormatting();

  const handleFocus = (e) => {
    if (formattingEnabled) setActiveElement(e.currentTarget);
    if (onFocus) onFocus(e);
  };
  const handleBlur = (e) => onUpdate(e.currentTarget.textContent || '');
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.blur(); }
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`focus:outline-none focus:ring-0 rounded-sm cursor-text ${className}`}
    >
      {value}
    </Tag>
  );
};

// --- Editable bullet list used for Work/Education descriptions ---
const PointList = ({ value = '', onUpdate = () => {}, className = '' }) => {
  const ref = useRef(null);

  const escapeHtml = (str = '') => String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  useEffect(() => {
    if (!ref.current) return;
    const lines = String(value).split('\n').filter(Boolean);
    const items = lines.map(l => l.replace(/^[\u2022\-\*\s]+/, '').trim());
    ref.current.innerHTML = items.map(i => `<li>${escapeHtml(i)}</li>`).join('') || '<li><br></li>';
  }, [value]);

  const handleBlur = () => {
    if (!ref.current) return;
    const items = Array.from(ref.current.querySelectorAll('li')).map(li => li.textContent.trim()).filter(Boolean);
    onUpdate(items.join('\n'));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      document.execCommand('insertHTML', false, '<li><br></li>');
      e.preventDefault();
    }
  };

  return (
    <ul
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`${className} list-disc pl-6 space-y-1`}
      style={{ outline: 'none', minHeight: 28 }}
      aria-label="Editable bullet list"
    />
  );
};

const FormattingToolbar = () => {
  const { activeElement, applyFormatting } = useGlobalFormatting();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  if (!activeElement) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center space-x-1 z-50 border border-gray-200">
      <button onClick={() => applyFormatting(globalFormatting.bold)} className="p-2 hover:bg-gray-100 rounded transition" title="Bold"><Bold className="w-4 h-4" /></button>
      <button onClick={() => applyFormatting(globalFormatting.italic)} className="p-2 hover:bg-gray-100 rounded transition" title="Italic"><Italic className="w-4 h-4" /></button>
      <button onClick={() => applyFormatting(globalFormatting.underline)} className="p-2 hover:bg-gray-100 rounded transition" title="Underline"><Underline className="w-4 h-4" /></button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button onClick={() => applyFormatting(globalFormatting.alignLeft)} className="p-2 hover:bg-gray-100 rounded transition" title="Align Left"><AlignLeft className="w-4 h-4" /></button>
      <button onClick={() => applyFormatting(globalFormatting.alignCenter)} className="p-2 hover:bg-gray-100 rounded transition" title="Align Center"><AlignCenter className="w-4 h-4" /></button>
      <button onClick={() => applyFormatting(globalFormatting.alignRight)} className="p-2 hover:bg-gray-100 rounded transition" title="Align Right"><AlignRight className="w-4 h-4" /></button>
      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="relative">
        <button onClick={() => setShowColorPicker(v => !v)} className="p-2 hover:bg-gray-100 rounded transition" title="Text Color"><Palette className="w-4 h-4" /></button>
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 grid grid-cols-4 gap-1 z-50">
            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#444444'].map(c => (
              <button key={c} onClick={() => applyFormatting(globalFormatting.setColor, c)} className="w-6 h-6 rounded border" style={{ backgroundColor: c }} />
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button onClick={() => setShowFontSize(v => !v)} className="p-2 hover:bg-gray-100 rounded transition text-sm font-medium" title="Font Size">Aa</button>
        {showFontSize && (
          <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 grid grid-cols-2 gap-1 z-50">
            {['12px','14px','16px','18px','20px','22px','24px','28px'].map(sz => (
              <button key={sz} onClick={() => applyFormatting(globalFormatting.setFontSize, sz)} className="px-2 py-1 hover:bg-gray-100 rounded text-sm">{sz}</button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      <button onClick={() => applyFormatting(globalFormatting.reset)} className="p-2 hover:bg-gray-100 rounded transition text-sm font-medium">Reset</button>
    </div>
  );
};

const ItemControls = ({ onDelete, onDuplicate, dragRef, handleStyle = "w-6 h-6", orientation = "horizontal" }) => (
  <div className={`absolute p-1 flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm shadow-md z-10 print:hidden ${orientation === "horizontal" ? "top-0 right-0 space-x-1 rounded-bl-lg" : "right-0 flex-col space-y-1 rounded-l-lg"}`} role="toolbar" aria-label="Item controls">
    <button onClick={onDuplicate} title="Duplicate" className="text-gray-600 hover:text-blue-600 p-0.5 rounded-full hover:bg-blue-50 transition" aria-label="Duplicate item"><CopyPlus className="w-4 h-4" /></button>
    <button onClick={onDelete} title="Delete" className="text-gray-600 hover:text-red-600 p-0.5 rounded-full hover:bg-red-50 transition" aria-label="Delete item"><Trash2 className="w-4 h-4" /></button>
    <div ref={dragRef} title="Drag to Reorder" className={`text-gray-600 cursor-grab active:cursor-grabbing p-0.5 rounded-full hover:bg-gray-100 transition ${handleStyle}`} aria-label="Drag handle" role="button" tabIndex={0}><Menu className="w-4 h-4" /></div>
  </div>
);

// --- IMAGE UPLOAD COMPONENT ---
const ImageUpload = ({ image, onImageChange }) => {
  const fileInputRef = useRef(null);
  const handleImageClick = () => fileInputRef.current?.click();
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select a valid image file'); return; }
    if (file.size > 5*1024*1024) { alert('Image must be < 5MB'); return; }
    const reader = new FileReader();
    reader.onload = (e) => onImageChange(e.target.result);
    reader.readAsDataURL(file);
  };
  const handleRemoveImage = (e) => { e.stopPropagation(); onImageChange(null); };
  return (
    <div className="relative group">
      <div className="w-28 h-28 mr-6 flex-shrink-0 cursor-pointer relative" onClick={handleImageClick} role="button" tabIndex={0} aria-label="Upload profile image">
        {image ? (
          <img src={image} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-gray-200" />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
            <Monitor className="w-10 h-10 text-gray-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
          <Upload className="w-5 h-5 text-white" />
        </div>
        {image && (
          <button onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-20" title="Remove image" aria-label="Remove profile image">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" aria-label="Profile image upload" />
    </div>
  );
};

// --- DYNAMIC LIST COMPONENTS ---
const DraggableChartItem = ({ item, section, index, updateItem, moveItem, deleteItem, duplicateItem }) => {
  const ref = useRef(null);
  const barRef = useRef(null);
  const type = section === 'skills' ? DND_ITEM_TYPE.SKILL : DND_ITEM_TYPE.LANGUAGE;

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id: item.id, index, type },
    collect: (m) => ({ isDragging: m.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const handleAdjust = useCallback((e) => {
    const x = e.clientX || e.touches?.[0]?.clientX;
    if (!x || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const offsetX = x - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, Math.round(percentage)));
    updateItem(item.id, 'value', percentage);
    e.preventDefault();
  }, [item.id, updateItem]);

  const handleDragStart = useCallback((e) => {
    document.addEventListener('mousemove', handleAdjust);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleAdjust, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.body.style.userSelect = 'none';
    handleAdjust(e);
  }, [handleAdjust]);

  const handleDragEnd = useCallback(() => {
    document.removeEventListener('mousemove', handleAdjust);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchmove', handleAdjust);
    document.removeEventListener('touchend', handleDragEnd);
    document.body.style.userSelect = '';
  }, [handleAdjust]);

  return (
    <div ref={ref} className={`group relative py-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
      <ItemControls onDelete={() => deleteItem(item.id)} onDuplicate={() => duplicateItem(item)} dragRef={ref} handleStyle="w-5 h-5" />
      <div className="flex items-center space-x-4 mb-1">
        <EditableText tag="div" value={item.label} onUpdate={(v) => updateItem(item.id, 'label', v)} className="w-32 text-sm font-semibold text-black" />
      </div>
      <div ref={barRef} className="h-2.5 w-full bg-gray-200 rounded-full overflow-visible relative cursor-ew-resize print:hidden" onMouseDown={handleDragStart} onTouchStart={handleDragStart} role="slider" aria-label={`Adjust ${item.label} value`} aria-valuenow={item.value} tabIndex={0} onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); updateItem(item.id, 'value', Math.min(100, item.value + 5)); }
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); updateItem(item.id, 'value', Math.max(0, item.value - 5)); }
      }}>
        <div className="h-full bg-black rounded-full transition-all duration-300 relative pointer-events-none" style={{ width: `${item.value}%` }} />
      </div>
    </div>
  );
};

const DraggableExperienceItem = ({ item, section, index, updateItem, moveItem, deleteItem, duplicateItem }) => {
  const ref = useRef(null);
  const type = section === 'workExperience' ? DND_ITEM_TYPE.WORK_EXP : DND_ITEM_TYPE.EDUCATION;

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id: item.id, index, type },
    collect: (m) => ({ isDragging: m.isDragging() }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  return (
    <div ref={ref} className={`group relative p-3 bg-white rounded border border-gray-200 mb-3 ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
      <ItemControls onDelete={() => deleteItem(item.id)} onDuplicate={() => duplicateItem(item)} dragRef={ref} handleStyle="w-5 h-5" />
      <div className="space-y-2">
        {section === 'workExperience' ? (
          <>
            <div className="flex justify-between items-start">
              <EditableText tag="div" value={item.company} onUpdate={(v) => updateItem(item.id, 'company', v)} className="text-sm font-bold text-black" />
              <EditableText tag="div" value={item.period} onUpdate={(v) => updateItem(item.id, 'period', v)} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded" />
            </div>
            <EditableText tag="div" value={item.position} onUpdate={(v) => updateItem(item.id, 'position', v)} className="text-sm text-blue-600 font-medium" />
          </>
        ) : (
          <>
            <div className="flex justify-between items-start">
              <EditableText tag="div" value={item.degree} onUpdate={(v) => updateItem(item.id, 'degree', v)} className="text-sm font-bold text-black" />
              <EditableText tag="div" value={item.period} onUpdate={(v) => updateItem(item.id, 'period', v)} className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded" />
            </div>
            <EditableText tag="div" value={item.institution} onUpdate={(v) => updateItem(item.id, 'institution', v)} className="text-sm text-blue-600 font-medium" />
          </>
        )}
        {/* DESCRIPTION: editable bullet list */}
        <PointList
          value={item.description}
          onUpdate={(v) => updateItem(item.id, 'description', v)}
          className="text-sm text-gray-700"
        />
      </div>
    </div>
  );
};

// --- MAIN APP ---
const App = () => {
  const [resumeData, setResumeData] = useState(INITIAL_RESUME_DATA);
  const [aiLoading, setAiLoading] = useState(false);
  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);

  const { activeElement, setActiveElement, applyFormatting } = useGlobalFormatting();

  const globalFormatLocal = (formatType, ...args) => { if (activeElement) globalFormatting[formatType]?.(activeElement, ...args); };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.globalFormat = (...args) => globalFormatLocal(...args);
      window.globalFormatting = globalFormatting;
      window.setActiveElement = setActiveElement;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete window.globalFormat;
        delete window.globalFormatting;
        delete window.setActiveElement;
      }
    };
  }, [activeElement, setActiveElement]);

  // Helper: parse AI output into array of short items
  const parseItems = (raw, max = 6) => {
    if (!raw) return [];
    const t = String(raw).trim();
    // split lines, commas, semicolons, bullets, numbers
    const parts = t.split(/\r?\n|[,;•·]|(?:\d+\.)/).map(s => s.trim()).filter(Boolean);
    // try to further split long items by sentence, keep short ones first
    const small = parts.flatMap(p => p.split(/\.\s+/).map(s => s.trim()).filter(Boolean));
    // filter out extremely long lines and duplicates, keep up to max
    const uniq = [];
    for (const p of small) {
      const clean = p.replace(/^[\u2022\-\*\s]+/, '').trim();
      if (!clean) continue;
      if (uniq.find(u => u.toLowerCase() === clean.toLowerCase())) continue;
      // drop excessively long nonsense lines > 140 chars
      if (clean.length > 140) continue;
      uniq.push(clean);
      if (uniq.length >= max) break;
    }
    return uniq;
  };

  const handleAIGenerate = async (section, keywords) => {
    if (!geminiService.genAI) {
      const apiKey = prompt('Please enter your Gemini API key:');
      if (!apiKey) return;
      geminiService.initialize(apiKey);
    }
    setAiLoading(true);
    try {
      const generatedContent = await geminiService.generateContent(section, keywords);
      const cleaned = String(generatedContent || '').trim();

      switch (section.toLowerCase()) {
        case 'profile': {
          // pick first 1-2 sentences for a short paragraph
          const sentences = cleaned.replace(/\r/g,'').split(/(?<=[.?!])\s+/).map(s=>s.trim()).filter(Boolean);
          let final = sentences.slice(0,2).join(' ');
          if (!final) final = cleaned.split('\n').map(l=>l.trim()).filter(Boolean)[0] || cleaned;
          // keep it concise: trim to 300 chars if needed
          if (final.length > 350) final = final.slice(0,347) + '...';
          setResumeData(prev => ({ ...prev, profile: { ...prev.profile, summary: final } }));
          break;
        }
        case 'skills': {
          // parse into short skill names and populate skill bars
          const items = parseItems(cleaned, 8);
          const skills = items.length ? items.map(it => ({ id: generateId(), label: it, value: Math.min(95, Math.max(20, Math.round((it.length % 80) + 40))) })) :
            [{ id: generateId(), label: cleaned.slice(0,30), value: 50 }];
          setResumeData(prev => ({ ...prev, skills }));
          break;
        }
        case 'languages': {
          // parse into short language labels and populate language bars
          const items = parseItems(cleaned, 6);
          const langs = items.length ? items.map(it => ({ id: generateId(), label: it, value: Math.min(95, Math.max(20, 60 + Math.floor(Math.random()*35))) })) :
            [{ id: generateId(), label: cleaned.slice(0,30), value: 60 }];
          setResumeData(prev => ({ ...prev, languages: langs }));
          break;
        }
        default:
          if (process.env.NODE_ENV === 'development') console.log('Generated:', generatedContent);
      }
    } catch (err) {
      console.error('AI error', err);
      alert('Failed to generate content. Check API key.');
    } finally {
      setAiLoading(false);
    }
  };

  const updateStaticField = useCallback((section, key, value) => {
    setResumeData(prev => ({ ...prev, [section]: { ...prev[section], [key]: value } }));
  }, []);

  const updateListItem = useCallback((section, id, key, value) => {
    setResumeData(prev => ({ ...prev, [section]: prev[section].map(it => it.id === id ? { ...it, [key]: value } : it) }));
  }, []);

  const deleteListItem = useCallback((section, id) => {
    setResumeData(prev => ({ ...prev, [section]: prev[section].filter(it => it.id !== id) }));
  }, []);

  const duplicateListItem = useCallback((section, item) => {
    setResumeData(prev => {
      const arr = prev[section];
      const index = arr.findIndex(i => i.id === item.id);
      if (index === -1) return prev;
      const newItem = { ...item, id: generateId() };
      return { ...prev, [section]: [...arr.slice(0,index+1), newItem, ...arr.slice(index+1)] };
    });
  }, []);

  const moveListItem = useCallback((section, dragIndex, hoverIndex) => {
    setResumeData(prev => {
      const arr = [...prev[section]];
      const [item] = arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, item);
      return { ...prev, [section]: arr };
    });
  }, []);

  const handleImageChange = useCallback((imageData) => updateStaticField('profile', 'image', imageData), [updateStaticField]);

  const workExpActions = useMemo(() => ({ update: (id, k, v) => updateListItem('workExperience', id, k, v), delete: (id) => deleteListItem('workExperience', id), duplicate: (item) => duplicateListItem('workExperience', item), move: (d,h) => moveListItem('workExperience', d, h) }), [updateListItem, deleteListItem, duplicateListItem, moveListItem]);
  const educationActions = useMemo(() => ({ update: (id, k, v) => updateListItem('education', id, k, v), delete: (id) => deleteListItem('education', id), duplicate: (item) => duplicateListItem('education', item), move: (d,h) => moveListItem('education', d, h) }), [updateListItem, deleteListItem, duplicateListItem, moveListItem]);
  const skillsActions = useMemo(() => ({ update: (id, k, v) => updateListItem('skills', id, k, v), delete: (id) => deleteListItem('skills', id), duplicate: (item) => duplicateListItem('skills', item), move: (d,h) => moveListItem('skills', d, h) }), [updateListItem, deleteListItem, duplicateListItem, moveListItem]);
  const languagesActions = useMemo(() => ({ update: (id, k, v) => updateListItem('languages', id, k, v), delete: (id) => deleteListItem('languages', id), duplicate: (item) => duplicateListItem('languages', item), move: (d,h) => moveListItem('languages', d, h) }), [updateListItem, deleteListItem, duplicateListItem, moveListItem]);

  // CV Page Component - true A4 size and styles
  const CVPage = () => (
    <div
      style={{
        width: '210mm',
        height: '297mm',
        boxSizing: 'border-box',
        background: '#fff',
        borderRadius: 6,
        overflow: 'hidden',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
      }}
      className="cv-a4-page"
    >
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          html, body { height: 100%; }
          .cv-a4-page { box-shadow: none !important; border: none !important; width: auto !important; height: auto !important; }
        }
      `}</style>

      {/* Header */}
      <header className="flex items-center p-6 border-b border-gray-200 ">
        <ImageUpload image={resumeData.profile.image} onImageChange={handleImageChange} />
        <div className="flex-grow">
          <EditableText tag="h1" value={resumeData.profile.name} onUpdate={(v) => updateStaticField('profile','name',v)} className="text-4xl font-extrabold tracking-wide text-black mb-1" />
          <EditableText tag="p" value={resumeData.profile.role} onUpdate={(v) => updateStaticField('profile','role',v)} className="text-lg tracking-wide text-black" />
        </div>
      </header>

      {/* Profile & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200 border-b border-gray-200 " style={{ flex: '0 0 auto' }}>
        <div className="p-6 md:col-span-2 bg-gray-50 relative group" data-section="profile">
          <div className="flex items-center justify-between">
            <EditableText tag="h2" value="Profile" onUpdate={() => {}} className="text-lg font-bold tracking-wide border-b-2 border-black" />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity pb-5">
              <AISparkle section="Profile" onGenerate={handleAIGenerate} disabled={aiLoading} />
            </div>
          </div>

          {/* Profile is now a short paragraph (editable) */}
          <EditableText tag="p" value={resumeData.profile.summary} onUpdate={(v) => updateStaticField('profile','summary',v)} className="text-base leading-relaxed text-black" />
        </div>

        <div className="p-6">
          <EditableText tag="h2" value="Contact" onUpdate={() => {}} className="text-lg font-bold tracking-wide mb-3 border-b-2 border-black pb-1" />
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <Phone className="w-4 h-4 text-black mt-1 flex-shrink-0" />
              <EditableText tag="span" value={resumeData.contact.phone} onUpdate={(v)=> updateStaticField('contact','phone',v)} className="cursor-text" />
            </li>
            <li className="flex items-start space-x-2">
              <Mail className="w-4 h-4 text-black mt-1 flex-shrink-0" />
              <EditableText tag="span" value={resumeData.contact.email} onUpdate={(v)=> updateStaticField('contact','email',v)} className="cursor-text" />
            </li>
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-black mt-1 flex-shrink-0" />
              <EditableText tag="span" value={resumeData.contact.address} onUpdate={(v)=> updateStaticField('contact','address',v)} className="leading-snug cursor-text" />
            </li>
          </ul>
        </div>
      </div>

      {/* Work / Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200 border-b border-gray-200" style={{ overflow: 'visible' }}>
        <div className="p-6">
          <div className="flex items-center mb-3">
            <Briefcase className="w-5 h-5 text-black mr-2" />
            <EditableText tag="h2" value="Work Experience" onUpdate={() => {}} className="text-xl font-bold tracking-wide border-b-2 border-black pb-1" />
          </div>
          <div className="space-y-3">
            {resumeData.workExperience.map((item, index) => (
              <DraggableExperienceItem key={item.id} item={item} section="workExperience" index={index} updateItem={workExpActions.update} deleteItem={workExpActions.delete} duplicateItem={workExpActions.duplicate} moveItem={workExpActions.move} />
            ))}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-3">
            <GraduationCap className="w-5 h-5 text-black mr-2" />
            <EditableText tag="h2" value="Education" onUpdate={() => {}} className="text-xl font-bold tracking-wide border-b-2 border-black pb-1" />
          </div>
          <div className="space-y-3">
            {resumeData.education.map((item, index) => (
              <DraggableExperienceItem key={item.id} item={item} section="education" index={index} updateItem={educationActions.update} deleteItem={educationActions.delete} duplicateItem={educationActions.duplicate} moveItem={educationActions.move} />
            ))}
          </div>
        </div>
      </div>

      {/* Skills / Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200" style={{ flex: '0 0 auto' }}>
        <div className="p-6 relative group" data-section="skills">
          <div className="flex items-center justify-between mb-3">
            <EditableText tag="h2" value="Skills" onUpdate={() => {}} className="text-xl font-bold tracking-wide border-b-2 border-black pb-1" />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity"><AISparkle section="Skills" onGenerate={handleAIGenerate} disabled={aiLoading} /></div>
          </div>
          <div className="space-y-3">
            {resumeData.skills.map((item, index) => (
              <DraggableChartItem key={item.id} item={item} section="skills" index={index} updateItem={skillsActions.update} deleteItem={skillsActions.delete} duplicateItem={skillsActions.duplicate} moveItem={skillsActions.move} />
            ))}
          </div>
        </div>

        <div className="p-6 relative group" data-section="languages">
          <div className="flex items-center justify-between mb-3">
            <EditableText tag="h2" value="Languages" onUpdate={() => {}} className="text-xl font-bold tracking-wide border-b-2 border-black pb-1" />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity"><AISparkle section="Languages" onGenerate={handleAIGenerate} disabled={aiLoading} /></div>
          </div>

          {/* Short description area (editable) */}
          <EditableText tag="p" value={resumeData.languagesDescription || ''} onUpdate={(v) => setResumeData(prev => ({ ...prev, languagesDescription: v }))} className="text-sm text-gray-700 leading-tight mb-2" />

          <div className="space-y-3">
            {resumeData.languages.map((item, index) => (
              <DraggableChartItem key={item.id} item={item} section="languages" index={index} updateItem={languagesActions.update} deleteItem={languagesActions.delete} duplicateItem={languagesActions.duplicate} moveItem={languagesActions.move} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex items-center justify-center bg-gray-200 overflow-auto">
        <FormattingToolbar />
        {/* scale so the entire A4 is visible on most screens; adjust scale if needed */}
        <div ref={editorContainerRef} data-editor-container className="flex flex-col items-center scale-[0.52] origin-top transition-transform duration-500 pt-12">
          {aiLoading && (
            <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
              Generating content with AI...
            </div>
          )}
          <div ref={cvRef} data-cv-page>
            <CVPage />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;
export { globalFormatting, globalFormat };