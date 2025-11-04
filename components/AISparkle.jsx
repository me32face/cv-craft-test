import React, { useState } from 'react';
import { Sparkles, X, Loader2 } from 'lucide-react';

const AISparkle = ({ section, onGenerate, className = "" }) => {
  const [showModal, setShowModal] = useState(false);
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!keywords.trim()) return;
    
    setIsGenerating(true);
    try {
      await onGenerate(section, keywords);
      setShowModal(false);
      setKeywords('');
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Sparkle Icon */}
      <div 
        className={`ai-sparkle ${className}`}
        onClick={() => setShowModal(true)}
      >
        <Sparkles className="w-3 h-3 text-purple-600 hover:text-purple-600 cursor-pointer animate-pulse" />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed  flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                AI Generate {section}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter keywords for your {section.toLowerCase()}:
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder={`e.g., ${getSampleKeywords(section)}`}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows="3"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={!keywords.trim() || isGenerating}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </div>
      )}
    </>
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