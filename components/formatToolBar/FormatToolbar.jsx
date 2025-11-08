"use client";

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
        node.parentElement.closest("[contenteditable='true']");

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

  const apply = (cmd) => document.execCommand(cmd, false, null);

  const updateFont = (size) => {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const node = sel.getRangeAt(0).startContainer.parentElement;
    node.style.fontSize = `${size}px`;
    setFontSize(size);
  };

  const cycleAlign = () => {
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
    <div className="w-fit h-12 bg-white/90 border shadow rounded-lg flex items-center gap-3 px-3">
      <button onClick={() => apply("bold")}><Bold size={18} /></button>
      <button onClick={() => apply("italic")}><Italic size={18} /></button>
      <button onClick={() => apply("underline")}><Underline size={18} /></button>

      {/* single cycle alignment button */}
      <button onClick={cycleAlign}>
        {alignIcon}
      </button>

      {/* Canva style font size control */}
      <div className="flex items-center gap-1 ml-3">
        <button onClick={() => updateFont(fontSize - 1)}><Minus size={18} /></button>
        <input
          type="number"
          min={6}
          max={122}
          value={fontSize}
          onChange={(e)=>updateFont(parseInt(e.target.value))}
          className="w-14 border rounded px-1 text-center text-sm"
        />
        <button onClick={() => updateFont(fontSize + 1)}><Plus size={18} /></button>
      </div>
    </div>
  );
}
