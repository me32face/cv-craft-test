import React, { useCallback } from 'react'
import { Download, Undo2, Redo2 } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { usePDF } from '../../contexts/PDFContext'
import { useUndoRedo } from '../../contexts/UndoRedoContext'

const Header = () => {
  const { triggerPDF } = usePDF()
  const { undo, redo, canUndo, canRedo } = useUndoRedo()

  const downloadPDF = useCallback(async () => {
    const cvElement = document.querySelector('[data-cv-page]')
    if (!cvElement) {
      console.error('No CV page found to download.')
      return
    }

    const parentContainer = document.querySelector('[data-editor-container]')
    if (!parentContainer) {
      console.error('Could not find parent scaling container.')
      return
    }

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    let oldTransform, oldTransition

    try {
      oldTransform = parentContainer.style.transform
      oldTransition = parentContainer.style.transition
      parentContainer.style.transform = 'scale(1)'
      parentContainer.style.transition = 'none'
      await new Promise(resolve => setTimeout(resolve, 200))

      const canvas = await html2canvas(cvElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        ignoreElements: (el) => el.tagName === 'BUTTON'
      })

      const imgData = canvas.toDataURL('image/png')
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      pdf.save('CV.pdf')
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      parentContainer.style.transform = oldTransform
      parentContainer.style.transition = oldTransition
    }
  }, [])

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
        onClick={downloadPDF}
        className="flex items-center gap-2 px-3 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors shadow-md"
      >
        <Download className="w-4 h-4" />
        Download
      </button>
    </div>
  )
}

export default Header
