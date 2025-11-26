// 'use client';

// import React, { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { templates } from "@/components/templates"; // ⬅️ adjust path if needed

// // Minimal decoder (same logic as in CVBuilder)
// const decodeDataFromUrl = (encoded) => {
//   try {
//     if (!encoded) return null;
//     const json = decodeURIComponent(atob(encoded));
//     return JSON.parse(json);
//   } catch (e) {
//     console.error("Error decoding data from URL:", e);
//     return null;
//   }
// };

// export default function ResumeViewPage() {
//   const searchParams = useSearchParams();
//   const [templateKey, setTemplateKey] = useState("template31");
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     const encoded = searchParams.get("cv");
//     if (!encoded) return;

//     const payload = decodeDataFromUrl(encoded);
//     if (!payload) return;

//     // We encoded as { shareId, template, data }
//     if (payload.template) {
//       setTemplateKey(payload.template.toLowerCase());
//     }

//     if (payload.data) {
//       setData(payload.data);
//     } else {
//       setData(payload);
//     }
//   }, [searchParams]);

//   const TemplateComponent = templates[templateKey];

//   if (!TemplateComponent || !data) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-black text-white">
//         <p>Loading resume...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex justify-center items-start bg-gray-100 py-10">
//       <div
//         style={{ width: "794px", minHeight: "1123px" }}
//         className="bg-white shadow-xl"
//       >
//         <TemplateComponent data={data} />
//       </div>
//     </div>
//   );
// }





'use client';

import React, { useEffect, useState } from "react";
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

export default function ResumeViewPage() {
  const searchParams = useSearchParams();
  const [templateKey, setTemplateKey] = useState("template31");
  const [data, setData] = useState(null);

  useEffect(() => {
    const encoded = searchParams.get("cv");
    if (!encoded) return;

    const payload = decodeDataFromUrl(encoded);
    if (!payload) return;

    // We encoded as: { shareId, template, data }
    if (payload.template) {
      setTemplateKey(payload.template.toLowerCase());
    }

    if (payload.data) {
      setData(payload.data);
    } else {
      // fallback if we ever encode plain data
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