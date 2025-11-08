"use client"
import { createContext, useContext, useState } from "react";

const SelectedElementContext = createContext();

export function SelectedElementProvider({ children }) {
  const [selectedEl, setSelectedEl] = useState(null);
  return (
    <SelectedElementContext.Provider value={{ selectedEl, setSelectedEl }}>
      {children}
    </SelectedElementContext.Provider>
  );
}

export function useSelectedElement() {
  return useContext(SelectedElementContext);
}
