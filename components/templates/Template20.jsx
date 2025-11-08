"use client";
import React, { useState, useCallback, useRef, useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Phone, Mail, MapPin, CopyPlus, Trash2, Menu, Upload, Monitor } from 'lucide-react';

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
    image: null, // Added image field
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

// --- CORE UTILITY COMPONENTS ---

/**
 * Reusable component for in-place editing. Updates state on blur.
 */
const EditableText = ({ tag: Tag, value, onUpdate, className, ...props }) => {
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onUpdate(e.currentTarget.textContent || '')}
      className={`focus:outline-none focus:ring-1 focus:ring-gray-400/50 rounded-sm cursor-text ${className}`}
      {...props}
    >
      {value}
    </Tag>
  );
};

/**
 * Renders the controls (drag handle, delete, duplicate) for a list item.
 */
const ItemControls = ({ onDelete, onDuplicate, dragRef, handleStyle = "w-6 h-6", orientation = "horizontal" }) => (
  // Controls are hidden when printing using 'print:hidden'
  <div className={`absolute p-1 flex opacity-0 group-hover:opacity-100 transition-opacity bg-white/70 backdrop-blur-sm shadow-md z-10 print:hidden ${
    orientation === "horizontal" 
      ? "top-0 right-0 space-x-1 rounded-bl-lg" 
      : "right-0 flex-col space-y-1 rounded-l-lg"
  }`}>
    <button
      onClick={onDuplicate}
      title="Duplicate"
      className="text-gray-600 hover:text-blue-600 p-0.5 rounded-full hover:bg-blue-50 transition"
    >
      <CopyPlus className="w-4 h-4" />
    </button>
    <button
      onClick={onDelete}
      title="Delete"
      className="text-gray-600 hover:text-red-600 p-0.5 rounded-full hover:bg-red-50 transition"
    >
      <Trash2 className="w-4 h-4" />
    </button>
    <div
      ref={dragRef}
      title="Drag to Reorder"
      className={`text-gray-600 cursor-grab active:cursor-grabbing p-0.5 rounded-full hover:bg-gray-100 transition ${handleStyle}`}
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
      const reader = new FileReader();
      reader.onload = (e) => {
        onImageChange(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    onImageChange(null);
  };

  return (
    <div className="relative group">
      <div
        className="w-32 h-32 mr-8 flex-shrink-0 cursor-pointer relative"
        onClick={handleImageClick}
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
      />
    </div>
  );
};

// --- DYNAMIC LIST COMPONENTS ---

/**
 * Draggable component for a single skill or language bar. (Vertical Drag/Drop and Bar Adjustment)
 */
const DraggableChartItem = ({ item, section, index, updateItem, moveItem, deleteItem, duplicateItem }) => {
  const ref = useRef(null); // Ref for the main item container (for DND reordering)
  const barRef = useRef(null); // Ref for the bar adjustment container
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
    // Determine client X based on mouse or touch event
    const x = e.clientX || (e.touches?.[0]?.clientX);
    if (!x || !barRef.current) return;

    // Get the bounding box of the bar container
    const rect = barRef.current.getBoundingClientRect();
    
    // Calculate the distance from the start of the bar
    const offsetX = x - rect.left;
    
    // Calculate the percentage (min 0, max 100)
    let percentage = (offsetX / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, Math.round(percentage)));

    // Update the item value immediately
    updateItem(item.id, 'value', percentage);
    e.preventDefault(); // Prevent text selection/scrolling during adjustment
  }, [item.id, updateItem]);

  const handleDragStart = useCallback((e) => {
    // Start drag: Attach move/end listeners globally
    document.addEventListener('mousemove', handleAdjust);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleAdjust, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    document.body.style.userSelect = 'none'; // Prevent text selection during drag
    handleAdjust(e); // Update value immediately on click/touch start
  }, [handleAdjust]);

  const handleDragEnd = useCallback(() => {
    // End drag: Remove global listeners
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
      style={{ opacity: isDragging ? 0.5 : 1 }}
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
        {/* Percentage display removed permanently from here */}
      </div>

      {/* Chart Bar Container (Made draggable over its entire area) */}
      <div
        ref={barRef}
        className="h-2.5 w-full bg-gray-200 rounded-full overflow-visible relative cursor-ew-resize print:hidden"
        onMouseDown={handleDragStart} // Mouse down starts drag on the bar area
        onTouchStart={handleDragStart} // Touch start starts drag on the bar area
      >
        <div
          // Bar color changed to dark gray/black to match the original design's aesthetic
          className="h-full bg-black rounded-full transition-all duration-300 relative pointer-events-none"
          style={{ width: `${item.value}%` }}
        >
          {/* REMOVED: The red dot visual indicator */}
        </div>
      </div>

       {/* REMOVED: The temporary visual percentage display */}
    </div>
  );
};

/**
 * Draggable component for a single timeline event. (Horizontal Drag/Drop)
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

  // Tailwind classes for the position relative to the main line (now horizontal)
  const dotClasses = "absolute w-3 h-3 bg-black rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 z-20";
  const contentClasses = "absolute w-full px-2 text-center";

  // Applied calculated itemWidth to ensure horizontal fit
  return (
    // FIX: Increased height from h-40 to h-48 to provide ample space for wrapping text without clipping.
    <div ref={ref} className="relative flex-shrink-0 h-48 group" style={{ opacity: isDragging ? 0.5 : 1, width: itemWidth }}>

      {/* Timeline Dot (always centered vertically within the h-48 container) */}
      <div className={dotClasses}></div>

      {/* Content Container - Group for visibility of controls */}
      <div className={`${contentClasses} ${item.isAbove ? 'top-0 pt-2' : 'bottom-0 pb-4'}`}> 
        {/* Content - FIX: All text colors are now text-black for maximum contrast */}
        <EditableText
          tag="div"
          value={item.year.toString()}
          onUpdate={(newValue) => updateItem(item.id, 'year', parseInt(newValue) || 0)}
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

      {/* FIX: Controls moved to appear on the SIDE instead of on top */}
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
 * Main Application Component (equivalent to Next.js page)
 */
const App = () => {
  const [resumeData, setResumeData] = useState(INITIAL_RESUME_DATA);
  const editorContainerRef = useRef(null);
  const cvRef = useRef(null);
  
  // FIX: Calculate the dynamic width for timeline items to ensure non-scrollable fit
  const timelineItemCount = resumeData.timeline.length;
  const itemWidth = `${100 / timelineItemCount}%`;

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

      // Create a new item with a new unique ID
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

      // Array manipulation to move the item
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

  // Memoized action wrappers for specific sections to pass down to Draggable components
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
        {/* Profile Section */}
        <div className="p-8 md:col-span-2 bg-gray-50/50">
          <h2 className="text-xl font-bold tracking-widest mb-4 border-b-2 border-black pb-1 text-black">Profile</h2>
          <EditableText
            tag="p"
            value={resumeData.profile.summary}
            onUpdate={(v) => updateStaticField('profile', 'summary', v)}
            className="text-black leading-relaxed text-sm"
          />
        </div>

        {/* Contact Section */}
        <div className="p-8">
          <h2 className="text-xl font-bold tracking-widest mb-4 border-b-2 border-black pb-1 text-black">Contact</h2>
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

      {/* Timeline Section - Horizontal Layout, Dynamically Scaled (FIXED) */}
      <div className="p-8 border-b border-gray-200">
        <h2 className="text-2xl font-bold tracking-widest mb-4 border-b-2 border-black pb-1 text-black">Timeline</h2>
        
        {/* Timeline container is NOT scrollable (no overflow-x-auto) */}
        <div className="relative w-full pb-4">
          
          {/* Central Horizontal Line */}
          <div className="absolute top-1/2 transform -translate-y-1/2 h-px bg-gray-400 w-full z-0"></div>
          
          {/* Timeline Items - Flex container ensures horizontal layout and equal distribution */}
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
        {/* Skills */}
        <div className="p-8">
          <h2 className="text-2xl font-bold tracking-widest mb-4 border-b-2 border-black pb-1 text-black">Skills</h2>
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

        {/* Languages */}
        <div className="p-8">
          <h2 className="text-2xl font-bold tracking-widest mb-4 border-b-2 border-black pb-1 text-black">Languages</h2>
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
    // A4 paper size container with proper scaling
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex items-center justify-center bg-gray-200 overflow-auto cursor-pointer">
        <div
          ref={editorContainerRef}
          data-editor-container
          className="flex flex-col items-center scale-[0.55] origin-top transition-transform duration-500 pt-16"
        >
          <div ref={cvRef} data-cv-page>
            <CVPage />
          </div>
        </div>
      </div>
    </DndProvider>
  );
};

export default App;