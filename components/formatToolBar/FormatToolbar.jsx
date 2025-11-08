"use client";
import React from "react";
import { Bold, Italic, Underline, Minus, Plus, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";
import { useState, useEffect } from "react";

export default function FormatToolbar() {
  const [fontSize, setFontSize] = useState(16);
  const [visible, setVisible] = useState(false);
  const [alignMode, setAlignMode] = useState("left");

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel.rangeCount) {
        setVisible(false);
        return;
      }

      const node = sel.getRangeAt(0).startContainer;
      const editableParent =
        node &&
        node.parentElement &&
       node.parentElement.closest("[contenteditable]");

      if (!editableParent) {
        setVisible(false);
        return;
      }

      setVisible(true);

      const size = parseInt(window.getComputedStyle(node.parentElement).fontSize);
      setFontSize(size);
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, []);

 const apply = (cmd) => {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const node = sel.getRangeAt(0).startContainer.parentElement;

  // force focus on editable node
  if(node && node.closest("[contenteditable]")) {
    node.closest("[contenteditable]").focus();
  }

  document.execCommand(cmd, false, null);
};


  const updateFont = (size) => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const node = sel.getRangeAt(0).startContainer.parentElement;
    node.style.fontSize = `${size}px`;
    setFontSize(size);
  };

  const cycleAlign = () => {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  
  const node = sel.getRangeAt(0).startContainer.parentElement;
  if(node && node.closest("[contenteditable]")) {
    node.closest("[contenteditable]").focus();
  }

  const modes = ["left", "center", "right", "justify"];
  const idx = modes.indexOf(alignMode);
  const next = modes[(idx + 1) % modes.length];
  setAlignMode(next);

  const cmd =
    next === "left"
      ? "justifyLeft"
      : next === "center"
      ? "justifyCenter"
      : next === "right"
      ? "justifyRight"
      : "justifyFull";

  document.execCommand(cmd, false, null);
};

  const alignIcon =
    alignMode === "left"
      ? <AlignLeft size={18} />
      : alignMode === "center"
      ? <AlignCenter size={18} />
      : alignMode === "right"
      ? <AlignRight size={18} />
      : <AlignJustify size={18} />;

  if (!visible) return null;

  return (
   <div
    className="
      w-full max-w-max h-10 
      bg-white/90 border shadow rounded-lg 
      flex items-center gap-2 px-2

      overflow-x-auto scrollbar-none   /* ✅ mobile friendly */
      sm:gap-3 sm:px-3 sm:h-12
    "
  >
    <button onClick={() => apply("bold")}><Bold size={14} className="sm:w-5 sm:h-5" /></button>
    <button onClick={() => apply("italic")}><Italic size={14} className="sm:w-5 sm:h-5" /></button>
    <button onClick={() => apply("underline")}><Underline size={14} className="sm:w-5 sm:h-5" /></button>

    <button onClick={cycleAlign}>{alignIcon && React.cloneElement(alignIcon, { size: 14, className: "sm:w-5 sm:h-5"})}</button>

    {/* Font Size Control */}
    <div className="flex items-center gap-1 ml-1 sm:ml-3">
      <button onClick={() => updateFont(fontSize - 1)}><Minus size={14} className="sm:w-5 sm:h-5" /></button>
      <input
        type="number"
        min={6}
        max={122}
        value={fontSize}
        onChange={(e)=>updateFont(parseInt(e.target.value))}
        className="w-10 border rounded px-1 text-center text-xs sm:w-14 sm:text-sm"
      />
      <button onClick={() => updateFont(fontSize + 1)}><Plus size={14} className="sm:w-5 sm:h-5" /></button>
    </div>
  </div>
  );
}
