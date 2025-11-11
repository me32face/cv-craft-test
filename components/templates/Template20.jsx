"use client";
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Phone, Mail, MapPin, CopyPlus, Trash2, Menu, Upload, Monitor, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette } from 'lucide-react';
import AISparkle from '../AISparkle';
import { geminiService } from '../../lib/gemini';

// --- UTILITY FUNCTIONS & INITIAL DATA ---

// Unique ID generator for new items
const generateId = () => crypto.randomUUID();

const DND_ITEM_TYPE = {
  TIMELINE: 'timeline',
  SKILL: 'skill',
  LANGUAGE: 'language',
};

const INITIAL_RESUME_DATA = {
  profile: {
    name: "DANIEL GALLEGO",
    role: "DEVELOPER",
    summary: "I am a developer interested in mobile applications. I have a systematic working style and a creative process that I created by myself.",
    image: null,
  },
  contact: {
    phone: "+123-456-7890",
    email: "hello@reallygreatsite.com",
    address: "123 Anywhere St., Any City, St 12345",
  },
  timeline: [
    { id: generateId(), year: 2014, title: "Bachelor Degree", subtitle: "University", isAbove: true },
    { id: generateId(), year: 2016, title: "Master Degree", subtitle: "University", isAbove: false },
    { id: generateId(), year: 2017, title: "Internship", subtitle: "Aldenaire & Partners", isAbove: true },
    { id: generateId(), year: 2019, title: "Award", subtitle: "First Prize", isAbove: false },
    { id: generateId(), year: 2019, title: "Jr. Developer", subtitle: "Wardlere Inc.", isAbove: true },
    { id: generateId(), year: 2020, title: "Developer", subtitle: "Wardlere Inc.", isAbove: false },
    { id: generateId(), year: 2021, title: "Freelance Developer", subtitle: "Wardlere Inc.", isAbove: true },
    { id: generateId(), year: 2022, title: "Developer and Owner", subtitle: "Thynk Unlimited", isAbove: false },
  ],
  skills: [
    { id: generateId(), label: "Skill 1", value: 30 },
    { id: generateId(), label: "Skill 2", value: 45 },
    { id: generateId(), label: "Skill 3", value: 35 },
    { id: generateId(), label: "Skill 4", value: 55 },
  ],
  languages: [
    { id: generateId(), label: "Language 1", value: 70 },
    { id: generateId(), label: "Language 1.1", value: 90 },
    { id: generateId(), label: "Language 3", value: 80 },
    { id: generateId(), label: "Language 4", value: 40 },
  ],
};

// --- GLOBAL FORMATTING SYSTEM ---

// Global formatting functions that can be applied to any element
const globalFormatting = {
  // Text formatting
  bold: (element) => {
    if (element) {
      const isBold = element.style.fontWeight === 'bold';
      element.style.fontWeight = isBold ? 'normal' : 'bold';
    }
  },
  
  italic: (element) => {
    if (element) {
      const isItalic = element.style.fontStyle === 'italic';
      element.style.fontStyle = isItalic ? 'normal' : 'italic';
    }
  },
  
  underline: (element) => {
    if (element) {
      const isUnderlined = element.style.textDecoration === 'underline';
      element.style.textDecoration = isUnderlined ? 'none' : 'underline';
    }
  },
  
  // Text alignment
  alignLeft: (element) => {
    if (element) element.style.textAlign = 'left';
  },
  
  alignCenter: (element) => {
    if (element) element.style.textAlign = 'center';
  },
  
  alignRight: (element) => {
    if (element) element.style.textAlign = 'right';
  },
  
  // Color formatting
  setColor: (element, color) => {
    if (element) element.style.color = color;
  },
  
  setBackgroundColor: (element, color) => {
    if (element) element.style.backgroundColor = color;
  },
  
  // Font size
  setFontSize: (element, size) => {
    if (element) element.style.fontSize = size;
  },
  
  // Font family
  setFontFamily: (element, fontFamily) => {
    if (element) element.style.fontFamily = fontFamily;
  },
  
  // Reset formatting
  reset: (element) => {
    if (element) {
      element.style.fontWeight = '';
      element.style.fontStyle = '';
      element.style.textDecoration = '';
      element.style.textAlign = '';
      element.style.color = '';
      element.style.backgroundColor = '';
      element.style.fontSize = '';
      element.style.fontFamily = '';
    }
  }
};

// Hook to manage global formatting
const useGlobalFormatting = () => {
  const [activeElement, setActiveElement] = useState(null);
  
  const applyFormatting = useCallback((formatFunction, ...args) => {
    if (activeElement) {
      formatFunction(activeElement, ...args);
    }
  }, [activeElement]);
  
  return {
    activeElement,
    setActiveElement,
    applyFormatting
  };
};

// --- CORE UTILITY COMPONENTS ---

/**
 * Enhanced EditableText component with formatting support
 */
const EditableText = ({ 
  tag: Tag, 
  value, 
  onUpdate, 
  className, 
  formattingEnabled = true,
  onFocus,
  ...props 
}) => {
  const ref = useRef(null);
  const { setActiveElement } = useGlobalFormatting();

  const handleFocus = (e) => {
    if (formattingEnabled) {
      setActiveElement(e.currentTarget);
    }
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    onUpdate(e.currentTarget.textContent || '');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`focus:outline-none focus:ring-1 focus:ring-gray-400/50 rounded-sm cursor-text ${className}`}
      {...props}
    >
      {value}
    </Tag>
  );
};

/**
 * Floating Formatting Toolbar
 */
const FormattingToolbar = () => {
  const { activeElement, applyFormatting } = useGlobalFormatting();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);

  if (!activeElement) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-lg p-2 flex items-center space-x-1 z-50 border border-gray-200">
      {/* Text Formatting */}
      <button
        onClick={() => applyFormatting(globalFormatting.bold)}
        className="p-2 hover:bg-gray-100 rounded transition"
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => applyFormatting(globalFormatting.italic)}
        className="p-2 hover:bg-gray-100 rounded transition"
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => applyFormatting(globalFormatting.underline)}
        className="p-2 hover:bg-gray-100 rounded transition"
        title="Underline"
      >
        <Underline className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      {/* Alignment */}
      <button
        onClick={() => applyFormatting(globalFormatting.alignLeft)}
        className="p-2 hover:bg-gray-100 rounded transition"
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => applyFormatting(globalFormatting.alignCenter)}
        className="p-2 hover:bg-gray-100 rounded transition"
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      
      <button
        onClick={() => applyFormatting(globalFormatting.alignRight)}
        className="p-2 hover:bg-gray-100 rounded transition"
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      {/* Color Picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 hover:bg-gray-100 rounded transition"
          title="Text Color"
        >
          <Palette className="w-4 h-4" />
        </button>
        
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 grid grid-cols-4 gap-1 z-50">
            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF'].map(color => (
              <button
                key={color}
                onClick={() => applyFormatting(globalFormatting.setColor, color)}
                className="w-6 h-6 rounded border border-gray-300"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Font Size */}
      <div className="relative">
        <button
          onClick={() => setShowFontSize(!showFontSize)}
          className="p-2 hover:bg-gray-100 rounded transition text-sm font-medium"
          title="Font Size"
        >
          Aa
        </button>
        
        {showFontSize && (
          <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-lg p-2 grid grid-cols-2 gap-1 z-50">
            {['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'].map(size => (
              <button
                key={size}
                onClick={() => applyFormatting(globalFormatting.setFontSize, size)}
                className="px-2 py-1 hover:bg-gray-100 rounded text-sm"
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="w-px h-6 bg-gray-300 mx-1"></div>
      
      {/* Reset */}
      <button
        onClick={() => applyFormatting(globalFormatting.reset)}
        className="p-2 hover:bg-gray-100 rounded transition text-sm font-medium"
        title="Reset Formatting"
      >
        Reset
      </button>
    </div>
  );
};

/**
 * Renders the controls (drag handle, delete, duplicate) for a list item.
 */
const ItemControls = ({ onDelete, onDuplicate, dragRef, handleStyle = "w-6 h-6", orientation = "horizontal" }) => (
  <div 
    className={`absolute p-1 flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/70 backdrop-blur-sm shadow-md z-10 print:hidden ${
      orientation === "horizontal" 
        ? "top-0 right-0 space-x-1 rounded-bl-lg" 
        : "right-0 flex-col space-y-1 rounded-l-lg"
    }`}
    role="toolbar"
    aria-label="Item controls"
  >
    <button
      onClick={onDuplicate}
      title="Duplicate"
      className="text-gray-600 hover:text-blue-600 p-0.5 rounded-full hover:bg-blue-50 transition"
      aria-label="Duplicate item"
    >
      <CopyPlus className="w-4 h-4" />
    </button>
    <button
      onClick={onDelete}
      title="Delete"
      className="text-gray-600 hover:text-red-600 p-0.5 rounded-full hover:bg-red-50 transition"
      aria-label="Delete item"
    >
      <Trash2 className="w-4 h-4" />
    </button>
    <div
      ref={dragRef}
      title="Drag to Reorder"
      className={`text-gray-600 cursor-grab active:cursor-grabbing p-0.5 rounded-full hover:bg-gray-100 transition ${handleStyle}`}
      aria-label="Drag handle"
      role="button"
      tabIndex={0}
    >
      <Menu className="w-4 h-4" />
    </div>
  </div>
);

// --- IMAGE UPLOAD COMPONENT ---

/**
 * Component for handling image upload with fallback to computer logo
 */
const ImageUpload = ({ image, onImageChange }) => {
  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file (JPEG, PNG, etc.)');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target.result);
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    onImageChange(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleImageClick();
    }
  };

  return (
    <div className="relative group">
      <div
        className="w-32 h-32 mr-8 flex-shrink-0 cursor-pointer relative"
        onClick={handleImageClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Upload profile image"
      >
        {/* Display uploaded image or fallback */}
        {image ? (
          <img
            src={image}
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-gray-200"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-100 border-4 border-gray-200 flex items-center justify-center">
            <Monitor className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {/* Upload overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
          <Upload className="w-6 h-6 text-white" />
        </div>

        {/* Remove button - only show when image exists */}
        {image && (
          <button
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
            title="Remove image"
            aria-label="Remove profile image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Profile image upload"
      />
    </div>
  );
};

// --- DYNAMIC LIST COMPONENTS ---

/**
 * Draggable component for a single skill or language bar.
 */
const DraggableChartItem = ({ item, section, index, updateItem, moveItem, deleteItem, duplicateItem }) => {
  const ref = useRef(null);
  const barRef = useRef(null);
  const type = section === 'skills' ? DND_ITEM_TYPE.SKILL : DND_ITEM_TYPE.LANGUAGE;

  // --- DND for Reordering (Vertical) ---
  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id: item.id, index, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));
  
  // --- Drag Logic for Adjusting Value ---
  const handleAdjust = useCallback((e) => {
    const x = e.clientX || (e.touches?.[0]?.clientX);
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
    <div
      ref={ref}
      className={`group relative py-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {/* Dynamic Controls (Reordering) */}
      <ItemControls
        onDelete={() => deleteItem(item.id)}
        onDuplicate={() => duplicateItem(item)}
        dragRef={ref}
        handleStyle="w-5 h-5"
      />

      {/* Content */}
      <div className="flex items-center space-x-4 mb-1">
        <EditableText
          tag="div"
          value={item.label}
          onUpdate={(newValue) => updateItem(item.id, 'label', newValue)}
          className="w-24 text-sm font-semibold text-black"
        />
      </div>

      {/* Chart Bar Container */}
      <div
        ref={barRef}
        className="h-2.5 w-full bg-gray-200 rounded-full overflow-visible relative cursor-ew-resize print:hidden"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        role="slider"
        aria-label={`Adjust ${item.label} value`}
        aria-valuenow={item.value}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            const newValue = Math.min(100, item.value + 5);
            updateItem(item.id, 'value', newValue);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            const newValue = Math.max(0, item.value - 5);
            updateItem(item.id, 'value', newValue);
          }
        }}
      >
        <div
          className="h-full bg-black rounded-full transition-all duration-300 relative pointer-events-none"
          style={{ width: `${item.value}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Draggable component for a single timeline event.
 */
const DraggableTimelineItem = ({ item, index, updateItem, moveItem, deleteItem, duplicateItem, itemWidth }) => {
  const ref = useRef(null);
  const type = DND_ITEM_TYPE.TIMELINE;

  const [{ isDragging }, drag] = useDrag({
    type,
    item: { id: item.id, index, type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: type,
    hover(draggedItem, monitor) {
      if (!ref.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(ref));

  const dotClasses = "absolute w-3 h-3 bg-black rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 z-20";
  const contentClasses = "absolute w-full px-2 text-center";

  return (
    <div 
      ref={ref} 
      className={`relative flex-shrink-0 h-48 group ${isDragging ? 'opacity-50' : 'opacity-100'}`} 
      style={{ width: itemWidth }}
    >
      {/* Timeline Dot */}
      <div className={dotClasses}></div>

      {/* Content Container */}
      <div className={`${contentClasses} ${item.isAbove ? 'top-0 pt-2' : 'bottom-0 pb-4'}`}> 
        <EditableText
          tag="div"
          value={item.year.toString()}
          onUpdate={(newValue) => {
            const parsedYear = parseInt(newValue);
            if (!isNaN(parsedYear) && parsedYear >= 1900 && parsedYear <= 2100) {
              updateItem(item.id, 'year', parsedYear);
            }
          }}
          className="text-sm font-bold text-black"
        />
        <EditableText
          tag="div"
          value={item.title}
          onUpdate={(newValue) => updateItem(item.id, 'title', newValue)}
          className="text-xs font-medium text-black"
        />
        <EditableText
          tag="div"
          value={item.subtitle}
          onUpdate={(newValue) => updateItem(item.id, 'subtitle', newValue)}
          className="text-xs text-black"
        />
      </div>

      {/* Controls */}
      <ItemControls
        onDelete={() => deleteItem(item.id)}
        onDuplicate={() => duplicateItem(item)}
        dragRef={ref}
        orientation="vertical"
        handleStyle="w-5 h-5"
      />
    </div>
  );
};

/**
 * Main Application Component
 */
const App = () => {
  const [resumeData, setResumeData] = useState(INITIAL_RESUME_DATA);
  const [aiLoading, setAiLoading] = useState(false);
  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);
  
  const { activeElement, setActiveElement, applyFormatting } = useGlobalFormatting();
  const timelineItemCount = resumeData.timeline.length;
  const itemWidth = `${100 / timelineItemCount}%`;

  // Global formatting function that can be called from anywhere
  const globalFormat = (formatType, ...args) => {
    if (activeElement) {
      globalFormatting[formatType]?.(activeElement, ...args);
    }
  };

  // Expose global formatting to window for external access
  useEffect(() => {
    window.globalFormat = globalFormat;
    window.globalFormatting = globalFormatting;
    window.setActiveElement = setActiveElement;
    
    return () => {
      delete window.globalFormat;
      delete window.globalFormatting;
      delete window.setActiveElement;
    };
  }, [activeElement]);

  // ADD AI GENERATION FUNCTION
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
          
          setResumeData(prev => ({
            ...prev,
            profile: {
              ...prev.profile,
              summary: finalContent
            }
          }));
          break;

        case 'skills':
          const skills = generatedContent.split('\n').filter(skill => skill.trim());
          const newSkills = skills.slice(0, 6).map((skill, index) => ({
            id: generateId(),
            label: skill.trim(),
            value: Math.floor(Math.random() * 100) + 1
          }));
          
          setResumeData(prev => ({
            ...prev,
            skills: newSkills
          }));
          break;

        case 'languages':
          const languages = generatedContent.split('\n').filter(lang => lang.trim());
          const newLanguages = languages.slice(0, 4).map((lang, index) => ({
            id: generateId(),
            label: lang.trim(),
            value: Math.floor(Math.random() * 100) + 1
          }));
          
          setResumeData(prev => ({
            ...prev,
            languages: newLanguages
          }));
          break;

        default:
          if (process.env.NODE_ENV === 'development') {
            console.log('Generated content:', generatedContent);
          }
      }
    } catch (error) {
      console.error('AI Generation error:', error);
      alert('Failed to generate content. Please check your API key and try again.');
    } finally {
      setAiLoading(false);
    }
  };

  // --- GENERAL UPDATE & MANAGEMENT FUNCTIONS ---

  const updateStaticField = useCallback((section, key, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  }, []);

  const updateListItem = useCallback((section, id, key, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item =>
        item.id === id ? { ...item, [key]: value } : item
      )
    }));
  }, []);

  const deleteListItem = useCallback((section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  }, []);

  const duplicateListItem = useCallback((section, item) => {
    setResumeData(prev => {
      const arr = prev[section];
      const index = arr.findIndex(i => i.id === item.id);
      if (index === -1) return prev;

      const newItem = { ...item, id: generateId() };

      return {
        ...prev,
        [section]: [...arr.slice(0, index + 1), newItem, ...arr.slice(index + 1)]
      };
    });
  }, []);

  const moveListItem = useCallback((section, dragIndex, hoverIndex) => {
    setResumeData(prev => {
      const arr = [...prev[section]];
      const dragItem = arr[dragIndex];

      arr.splice(dragIndex, 1);
      arr.splice(hoverIndex, 0, dragItem);

      return {
        ...prev,
        [section]: arr
      };
    });
  }, []);

  // Handle image change
  const handleImageChange = useCallback((imageData) => {
    updateStaticField('profile', 'image', imageData);
  }, [updateStaticField]);

  // Memoized action wrappers
  const timelineActions = useMemo(() => ({
    update: (id, key, value) => updateListItem('timeline', id, key, value),
    delete: (id) => deleteListItem('timeline', id),
    duplicate: (item) => duplicateListItem('timeline', item),
    move: (dragIndex, hoverIndex) => moveListItem('timeline', dragIndex, hoverIndex),
  }), [updateListItem, deleteListItem, duplicateListItem, moveListItem]);

  const skillsActions = useMemo(() => ({
    update: (id, key, value) => updateListItem('skills', id, key, value),
    delete: (id) => deleteListItem('skills', id),
    duplicate: (item) => duplicateListItem('skills', item),
    move: (dragIndex, hoverIndex) => moveListItem('skills', dragIndex, hoverIndex),
  }), [updateListItem, deleteListItem, duplicateListItem, moveListItem]);

  const languagesActions = useMemo(() => ({
    update: (id, key, value) => updateListItem('languages', id, key, value),
    delete: (id) => deleteListItem('languages', id),
    duplicate: (item) => duplicateListItem('languages', item),
    move: (dragIndex, hoverIndex) => moveListItem('languages', dragIndex, hoverIndex),
  }), [updateListItem, deleteListItem, duplicateListItem, moveListItem]);

  // CV Page Component
  const CVPage = () => (
    <div className="w-[210mm] h-[297mm] bg-white shadow-2xl rounded-lg border border-gray-300 overflow-hidden">
      {/* Header Section */}
      <header className="flex items-center p-8 border-b border-gray-200">
        {/* Image/Avatar with upload functionality */}
        <ImageUpload 
          image={resumeData.profile.image}
          onImageChange={handleImageChange}
        />

        {/* Name and Role */}
        <div className="flex-grow">
          <EditableText
            tag="h1"
            value={resumeData.profile.name}
            onUpdate={(v) => updateStaticField('profile', 'name', v)}
            className="text-4xl font-extrabold tracking-widest text-black mb-1 cursor-text"
          />
          <EditableText
            tag="p"
            value={resumeData.profile.role}
            onUpdate={(v) => updateStaticField('profile', 'role', v)}
            className="text-lg tracking-widest text-black"
          />
        </div>
      </header>

      {/* Main Content: Profile & Contact */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200 border-b border-gray-200">
        {/* Profile Section with AI */}
        <div className="p-8 md:col-span-2 bg-gray-50/50 relative group" data-section="profile">
          <div className="flex items-center justify-between mb-4">
            <EditableText
              tag="h2"
              value="Profile"
              onUpdate={(v) => {}}
              className="text-xl font-bold tracking-widest border-b-2 border-black pb-1 text-black"
            />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <AISparkle section="Profile" onGenerate={handleAIGenerate} disabled={aiLoading} />
            </div>
          </div>
          <EditableText
            tag="p"
            value={resumeData.profile.summary}
            onUpdate={(v) => updateStaticField('profile', 'summary', v)}
            className="text-black leading-relaxed text-sm"
          />
        </div>

        {/* Contact Section */}
        <div className="p-8">
          <EditableText
            tag="h2"
            value="Contact"
            onUpdate={(v) => {}}
            className="text-xl font-bold tracking-widest mb-4 border-b-2 border-black pb-1 text-black"
          />
          <ul className="space-y-3 text-sm text-black">
            <li className="flex items-start space-x-2">
              <Phone className="w-4 h-4 text-black mt-1 flex-shrink-0" />
              <EditableText
                tag="span"
                value={resumeData.contact.phone}
                onUpdate={(v) => updateStaticField('contact', 'phone', v)}
                className="cursor-text"
              />
            </li>
            <li className="flex items-start space-x-2">
              <Mail className="w-4 h-4 text-black mt-1 flex-shrink-0" />
              <EditableText
                tag="span"
                value={resumeData.contact.email}
                onUpdate={(v) => updateStaticField('contact', 'email', v)}
                className="cursor-text"
              />
            </li>
            <li className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-black mt-1 flex-shrink-0" />
              <EditableText
                tag="span"
                value={resumeData.contact.address}
                onUpdate={(v) => updateStaticField('contact', 'address', v)}
                className="leading-snug cursor-text"
              />
            </li>
          </ul>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="p-8 border-b border-gray-200">
        <EditableText
          tag="h2"
          value="Timeline"
          onUpdate={(v) => {}}
          className="text-2xl font-bold tracking-widest mb-4 border-b-2 border-black pb-1 text-black"
        />
        
        <div className="relative w-full pb-4">
          {/* Central Horizontal Line */}
          <div className="absolute top-1/2 transform -translate-y-1/2 h-px bg-gray-400 w-full z-0"></div>
          
          {/* Timeline Items */}
          <div className="flex items-center relative z-10 w-full">
            {resumeData.timeline.map((item, index) => (
              <DraggableTimelineItem
                key={item.id}
                item={item}
                index={index}
                updateItem={timelineActions.update}
                deleteItem={timelineActions.delete}
                duplicateItem={timelineActions.duplicate}
                moveItem={timelineActions.move}
                itemWidth={itemWidth}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Skills and Languages Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-200">
        {/* Skills with AI */}
        <div className="p-8 relative group" data-section="skills">
          <div className="flex items-center justify-between mb-4">
            <EditableText
              tag="h2"
              value="Skills"
              onUpdate={(v) => {}}
              className="text-2xl font-bold tracking-widest border-b-2 border-black pb-1 text-black"
            />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <AISparkle section="Skills" onGenerate={handleAIGenerate} disabled={aiLoading} />
            </div>
          </div>
          <div className="space-y-4">
            {resumeData.skills.map((item, index) => (
              <DraggableChartItem
                key={item.id}
                item={item}
                section="skills"
                index={index}
                updateItem={skillsActions.update}
                deleteItem={skillsActions.delete}
                duplicateItem={skillsActions.duplicate}
                moveItem={skillsActions.move}
              />
            ))}
          </div>
        </div>

        {/* Languages with AI */}
        <div className="p-8 relative group" data-section="languages">
          <div className="flex items-center justify-between mb-4">
            <EditableText
              tag="h2"
              value="Languages"
              onUpdate={(v) => {}}
              className="text-2xl font-bold tracking-widest border-b-2 border-black pb-1 text-black"
            />
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <AISparkle section="Languages" onGenerate={handleAIGenerate} disabled={aiLoading} />
            </div>
          </div>
          <div className="space-y-4">
            {resumeData.languages.map((item, index) => (
              <DraggableChartItem
                key={item.id}
                item={item}
                section="languages"
                index={index}
                updateItem={languagesActions.update}
                deleteItem={languagesActions.delete}
                duplicateItem={languagesActions.duplicate}
                moveItem={languagesActions.move}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div 
        className="min-h-screen flex items-center justify-center bg-gray-200 overflow-auto cursor-pointer"
        onClick={() => setActiveElement(null)} // Clear active element when clicking outside
      >
        <FormattingToolbar />
        <div
          ref={editorContainerRef}
          data-editor-container
          className="flex flex-col items-center scale-[0.55] origin-top transition-transform duration-500 pt-16"
        >
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