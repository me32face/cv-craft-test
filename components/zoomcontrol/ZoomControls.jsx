"use client";
import { useEffect } from "react";
import { ZoomOut, ZoomIn, Repeat2 } from "lucide-react";

export default function ZoomControls({ onZoomIn, onZoomOut, onReset, scale }) {
  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        onZoomIn?.();
      } else if (e.key === "-") {
        e.preventDefault();
        onZoomOut?.();
      } else if (e.key === "0") {
        e.preventDefault();
        onReset?.();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onZoomIn, onZoomOut, onReset]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md bg-white/40 border border-gray-200 shadow-xl rounded-2xl w-56 p-2">
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onZoomIn}
          className="p-3 rounded-full bg-white/40  hover:bg-blue-300/60 border active:scale-95 transition"
        >
          <ZoomIn className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-3 rounded-full bg-white/40 hover:bg-blue-300/60 border active:scale-95 transition"
        >
          <ZoomOut className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={onReset}
          className="p-3 rounded-full bg-white/40  hover:bg-blue-300/60 border active:scale-95 transition"
        >
          <Repeat2 className="w-5 h-5 text-blue-600" />
        </button>
      </div>

      <div className="text-sm text-gray-500/80 text-center mt-3">
        Zoom: {(scale * 100).toFixed(0)}%
      </div>
    </div>
  );
}
