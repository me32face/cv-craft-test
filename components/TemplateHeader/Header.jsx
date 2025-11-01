import React from 'react'
import { Download, Undo2, Redo2 } from 'lucide-react'
import { usePDF } from '../../contexts/PDFContext'

const Header = () => {
  const { triggerPDF } = usePDF()

  return (
    <div className="w-full h-14 bg-gradient-to-r from-[#00C9C8] to-[#3D5AFE] flex items-center justify-between px-4">
      {/* Left side - Undo / Redo */}
      <div className="flex items-center gap-4">
        <button
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
          title="Undo"
        >
          <Undo2 className="w-5 h-5 text-white" />
        </button>
        <button
          className="p-2 rounded-full hover:bg-white/20 transition-colors"
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
