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

  useEffect(() => {
    const encoded = searchParams.get("cv");
    if (!encoded) return;

    const payload = decodeDataFromUrl(encoded);
    if (!payload) return;

    if (payload.template) {
      setTemplateKey(payload.template.toLowerCase());
    }

    if (payload.data) {
      setData(payload.data);
    } else {
      setData(payload);
    }
  }, [searchParams]);

  const TemplateComponent = templates[templateKey];

  if (!TemplateComponent || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading resume...</p>
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
