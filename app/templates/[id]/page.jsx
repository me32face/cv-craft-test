"use client";

import { Suspense, use } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { PDFProvider } from "@/contexts/PDFContext";
import { UndoRedoProvider } from "@/contexts/UndoRedoContext";
import { SelectedElementProvider } from "@/contexts/SelectedElementContext";
import Header from "@/components/TemplateHeader/Header";
import FormatToolbar from "@/components/formatToolBar/FormatToolbar";
// import { PageManagerProvider } from "../../../contexts/PageManagerContext";
// import { usePageManager } from "../../../contexts/PageManagerContext";
const templateComponents = {
  Template01: dynamic(() => import("@/components/templates/Template01"), {
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
  Template02: dynamic(() => import("@/components/templates/Template02"), {
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
  Template03: dynamic(() => import("@/components/templates/Template03"), {
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
  Template04: dynamic(() => import("@/components/templates/Template04"), {
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
  Template05: dynamic(() => import("@/components/templates/Template05"), {
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
  Template06: dynamic(() => import("@/components/templates/Template06"), {
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
    Template07: dynamic(() => import('@/components/templates/Template07'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
   Template13: dynamic(() => import('@/components/templates/Template13'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
  Template14: dynamic(() => import('@/components/templates/Template14'), { 
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
  Template15: dynamic(() => import("@/components/templates/Template15"), {
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
  Template16: dynamic(() => import("@/components/templates/Template16"), {
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
  Template17: dynamic(() => import('@/components/templates/Template17'), { 
     ssr: false,
    loading: () => <TemplateLoader />
  }),
   
  Template18: dynamic(() => import('@/components/templates/Template18'), { 
     ssr: false,
    loading: () => <TemplateLoader />
  }),

   Template08: dynamic(() => import('@/components/templates/Template08'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
  Template09: dynamic(() => import('@/components/templates/Template09'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
  Template10: dynamic(() => import('@/components/templates/Template10'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
  Template12: dynamic(() => import('@/components/templates/Template12'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
 
  Template19: dynamic(() => import('@/components/templates/Template19'), { 
    ssr: false,
    loading: () => <TemplateLoader />
  }),
  Template20: dynamic(() => import('@/components/templates/Template20'), { 
    ssr: false,
    loading: () => <TemplateLoader />,
  }),
};

function TemplateLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}

// function PageRenderer({ TemplateComponent }) {
//   const { pages, duplicatePage, deletePage } = usePageManager();

//   return (
//     <div className="w-full">

//       {pages.map((page) => (
//         <div key={page.id} className="mb-10 border border-gray-300 p-4 bg-white">

//           {/* show the template page */}
//           <TemplateComponent pageId={page.id} />

//           <div className="mt-4 flex justify-end gap-3">
//             <button
//               onClick={() => duplicatePage(page.id)}
//               className="px-4 py-2 bg-indigo-600 text-white rounded-md"
//             >
//               Duplicate Page
//             </button>

//             <button
//               onClick={() => deletePage(page.id)}
//               className="px-4 py-2 bg-red-600 text-white rounded-md"
//             >
//               Delete Page
//             </button>
//           </div>

//         </div>
//       ))}
//     </div>
//   );
// }

export default function TemplatePage({ params }) {
  const { id } = use(params);
  const TemplateComponent = templateComponents[id];

  if (!TemplateComponent) {
    notFound();
  }

  return (
    <PDFProvider>
      <UndoRedoProvider>
        <SelectedElementProvider>
          <>
            <Header />
            <Suspense fallback={<TemplateLoader />}>
              <TemplateComponent />
            </Suspense>
          </>
        </SelectedElementProvider>
      </UndoRedoProvider>
    </PDFProvider>
  );
}
