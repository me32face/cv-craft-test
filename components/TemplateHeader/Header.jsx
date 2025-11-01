import React from 'react'
import { Download, Undo2, Redo2 } from 'lucide-react'
import { usePDF } from '../../contexts/PDFContext'
import { useUndoRedo } from '../../contexts/UndoRedoContext'

const Header = () => {
  const { triggerPDF } = usePDF()
  const { undo, redo, canUndo, canRedo } = useUndoRedo()

  const handleUndo = () => {
    const prevState = undo();
    if (prevState) {
      // Dispatch custom event to notify template components
      window.dispatchEvent(new CustomEvent('undoRedo', { 
        detail: { type: 'undo', state: prevState } 
      }));
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      // Dispatch custom event to notify template components
      window.dispatchEvent(new CustomEvent('undoRedo', { 
        detail: { type: 'redo', state: nextState } 
      }));
    }
  };

  return (
    <div className="w-full h-14 bg-gradient-to-r from-[#00C9C8] to-[#3D5AFE] flex items-center justify-between px-4">
      {/* Left side - Undo / Redo */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-2 rounded-full transition-colors ${
            canUndo ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <Undo2 className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={`p-2 rounded-full transition-colors ${
            canRedo ? 'hover:bg-white/20' : 'opacity-50 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <Redo2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Right side - Download */}
      <button
        onClick={triggerPDF}
        className="flex items-center gap-2 px-3 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  )
}

export default Header
