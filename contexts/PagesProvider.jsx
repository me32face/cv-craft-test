// // PagesContext.jsx

// const PagesContext = createContext()

// export function PagesProvider({children}) {
//   const [pages, setPages] = useState([{ id: crypto.randomUUID(), html: "<div>default page</div>" }])

//   const duplicatePage = (pageId) => {
//     const target = pages.find(p => p.id === pageId)
//     setPages([
//       ...pages,
//       { id: crypto.randomUUID(), html: target.html }  // exact copy
//     ])
//   }

//   const addBlankPage = () => {
//     setPages([
//       ...pages,
//       { id: crypto.randomUUID(), html: "" }  // empty page
//     ])
//   }

//   return <PagesContext.Provider value={{pages, duplicatePage, addBlankPage}}>
//     {children}
//   </PagesContext.Provider>
// }

// export const usePages = () => useContext(PagesContext)
