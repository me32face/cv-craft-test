// "use client"
// import { createContext, useContext, useState } from "react";

// const PageManagerContext = createContext();

// export function PageManagerProvider({ children }) {
//   const [pages, setPages] = useState([
//     { id: Date.now(), type: "template1" },
//   ]);
// const duplicatePage = (pageId) => {
//   setPages(prev => {
//     const page = prev.find(p => p.id === pageId)
//     return [...prev, { ...page, id: Date.now() }]
//   })
// }

// const deletePage = (pageId) => {
//   setPages(prev => prev.filter(p => p.id !== pageId))
// }

//   return (
//     <PageManagerContext.Provider value={{ pages, setPages, duplicatePage, deletePage }}>
//       {children}
//     </PageManagerContext.Provider>
//   );
// }

// export const usePageManager = () => useContext(PageManagerContext);
