import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

const AISparkle = ({ section, onGenerate, className = "" }) => {
  const [showPopover, setShowPopover] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setShowPopover(false);
      }
    };
    if (showPopover) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPopover]);

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    setIsGenerating(true);
    try {
      await onGenerate(section, keywords);
      setShowPopover(false);
      setKeywords('');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative" ref={popoverRef} onClick={(e) => e.stopPropagation()}>
      <Sparkles 
        className={`w-3 h-3 text-purple-600 hover:text-purple-700 cursor-pointer ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setShowPopover(!showPopover);
        }}
      />
      
      {showPopover && (
        <div 
          className="absolute left-0 top-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-[9999]"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">AI Generate Profile</h3>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPopover(false);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter keywords for your profile:
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder={getSampleKeywords(section)}
              className="w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows="4"
              autoFocus
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 border-t border-gray-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowPopover(false);
                setKeywords('');
              }}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleGenerate();
              }}
              disabled={!keywords.trim() || isGenerating}
              className="flex-1 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
const getSampleKeywords = (section) => {
  switch (section.toLowerCase()) {
    case 'summary':
    case 'profile':
      return 'marketing manager, 5 years experience, digital campaigns';
    case 'skills':
      return 'project management, leadership, communication';
    case 'work experience':
      return 'marketing manager, digital campaigns, team leadership';
    case 'education':
      return 'business administration, marketing degree, university';
    case 'languages':
      return 'english, spanish, french';
    default:
      return 'relevant keywords for this section';
  }
};

export default AISparkle;