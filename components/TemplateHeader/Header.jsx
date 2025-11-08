import React, { useCallback, useState } from "react";
import { Download, Undo2, Redo2, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { usePDF } from "../../contexts/PDFContext";
import { useUndoRedo } from "../../contexts/UndoRedoContext";
import FormatToolbar from "../formatToolBar/FormatToolbar";
import { SelectedElementProvider } from "@/contexts/SelectedElementContext";
const Header = () => {
  const { triggerPDF } = usePDF();
  const [isDownloading, setIsDownloading] = useState(false);
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  const downloadPDF = useCallback(async () => {
    setIsDownloading(true);

    const cvElement = document.querySelector("[data-cv-page]");
    if (!cvElement) {
      console.error("No CV page found to download.");
      setIsDownloading(false);
      return;
    }

    const parentContainer = document.querySelector("[data-editor-container]");
    if (!parentContainer) {
      console.error("Could not find parent scaling container.");
      setIsDownloading(false);
      return;
    }

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Clone the element to avoid affecting the original
    const clonedElement = cvElement.cloneNode(true);

    // Remove all buttons from clone
    clonedElement.querySelectorAll("button").forEach((btn) => btn.remove());

    // Remove all transforms from Draggable elements in clone
    clonedElement.querySelectorAll(".react-draggable").forEach((el) => {
      el.style.transform = "none";
    });

    // Create temporary container
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.left = "-9999px";
    tempContainer.style.top = "0";
    tempContainer.style.width = "210mm";
    tempContainer.style.height = "297mm";
    tempContainer.appendChild(clonedElement);
    document.body.appendChild(tempContainer);

    try {
      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        pixelRatio: 1,
        removeContainer: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      pdf.addImage(
        imgData,
        "PNG",
        imgX,
        imgY,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("CV.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      // Remove temporary container
      document.body.removeChild(tempContainer);
      setIsDownloading(false);
    }
  }, []);

  const handleUndo = () => {
    const prevState = undo();
    if (prevState) {
      // Dispatch custom event to notify template components
      window.dispatchEvent(
        new CustomEvent("undoRedo", {
          detail: { type: "undo", state: prevState },
        })
      );
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState) {
      // Dispatch custom event to notify template components
      window.dispatchEvent(
        new CustomEvent("undoRedo", {
          detail: { type: "redo", state: nextState },
        })
      );
    }
  };

  return (
    <div className=" w-full
      bg-gradient-to-r from-[#00C9C8] to-[#3D5AFE]
      flex flex-col sm:flex-row
      items-center
      justify-between
      gap-2
      px-4 py-2">
      {/* Left side - Undo / Redo */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleUndo}
          disabled={!canUndo}
          className={`p-2 rounded-full transition-colors ${
            canUndo ? "hover:bg-white/20" : "opacity-50 cursor-not-allowed"
          }`}
          title="Undo"
        >
          <Undo2 className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={handleRedo}
          disabled={!canRedo}
          className={`p-2 rounded-full transition-colors ${
            canRedo ? "hover:bg-white/20" : "opacity-50 cursor-not-allowed"
          }`}
          title="Redo"
        >
          <Redo2 className="w-5 h-5 text-white" />
        </button>
      </div>

      <SelectedElementProvider>
        <FormatToolbar />
      </SelectedElementProvider>

      {/* Right side - Download */}
      <button
        onClick={downloadPDF}
        disabled={isDownloading}
        className="flex items-center gap-2 px-3 py-2 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDownloading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isDownloading ? "Downloading..." : "Download"}
      </button>
    </div>
  );
};

export default Header;
