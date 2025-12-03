'use client';

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { templates } from "@/components/templates";
import { decompressFromEncodedURIComponent } from "lz-string";

// Same decode logic as in CVBuilder
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

function ResumeViewContent() {
  const searchParams = useSearchParams();
  const [templateKey, setTemplateKey] = useState("template31");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        setLoading(true);
        
        // Check for new share ID format
        const shareId = searchParams.get("id");
        
        if (shareId) {
          // Fetch from backend using share ID
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/share/${shareId}`);
          
          if (!response.ok) {
            throw new Error('Failed to load shared resume');
          }
          
          const result = await response.json();
          
          if (result.success) {
            setTemplateKey(result.templateId.toLowerCase());
            setData(result.templateData);
          } else {
            throw new Error('Resume not found');
          }
        } else {
          // Fallback: Check for old encoded format
          const encoded = searchParams.get("cv");
          if (!encoded) {
            setError('No resume data found');
            return;
          }

          const payload = decodeDataFromUrl(encoded);
          if (!payload) {
            setError('Invalid resume data');
            return;
          }

          if (payload.template) {
            setTemplateKey(payload.template.toLowerCase());
          }

          if (payload.data) {
            setData(payload.data);
          } else {
            setData(payload);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading resume:', err);
        setError(err.message || 'Failed to load resume');
        setLoading(false);
      }
    };

    loadResume();
  }, [searchParams]);

  const TemplateComponent = templates[templateKey];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">The link may be invalid or expired.</p>
        </div>
      </div>
    );
  }

  if (!TemplateComponent || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Resume not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 py-10">
      <div
        style={{ width: "794px", minHeight: "1123px" }}
        className="bg-white shadow-xl"
      >
        <TemplateComponent data={data} />
      </div>
    </div>
  );
}

export default function ResumeViewPage() {
  return (
    <Suspense fallback={<div>Loading resume...</div>}>
      <ResumeViewContent />
    </Suspense>
  );
}
