import React, { useCallback, useState } from "react";
import { Download, Undo2, Redo2, Loader2, ArrowLeft } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { usePDF } from "../../contexts/PDFContext";
import { useUndoRedo } from "../../contexts/UndoRedoContext";
import FormatToolbar from "../formatToolBar/FormatToolbar";
import { SelectedElementProvider } from "@/contexts/SelectedElementContext";
import { useRouter } from "next/navigation";

const Header = () => {
  const { triggerPDF } = usePDF();
  const [isDownloading, setIsDownloading] = useState(false);
  const { undo, redo, canUndo, canRedo } = useUndoRedo();
  const router = useRouter();

  const downloadPDF = useCallback(async () => {
    setIsDownloading(true);

    const cvElement = document.querySelector("[data-cv-page]");
    if (!cvElement) return setIsDownloading(false);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const clonedElement = cvElement.cloneNode(true);
    clonedElement.querySelectorAll("button, .ai-icon").forEach((el) => el.remove());
    clonedElement.querySelectorAll(".react-draggable").forEach((el) => {
      el.style.transform = "none";
    });

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
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

      pdf.addImage(
        imgData,
        "PNG",
        (pdfWidth - imgWidth * ratio) / 2,
        0,
        imgWidth * ratio,
        imgHeight * ratio
      );
      pdf.save("CV.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      document.body.removeChild(tempContainer);
      setIsDownloading(false);
    }
  }, []);

  return (
    <div className="flex flex-col w-full">
      {/* Header Bar */}
      <div className="w-full bg-gradient-to-r from-[#4F8DF9] to-[#8A3FFC] flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-2">
        {/* Undo / Redo */}
        <div className="flex items-center gap-4">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-2 rounded-full transition-colors ${canUndo ? "hover:bg-white/20" : "opacity-50 cursor-not-allowed"
              }`}
            title="Undo"
          >
            <Undo2 className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-2 rounded-full transition-colors ${canRedo ? "hover:bg-white/20" : "opacity-50 cursor-not-allowed"
              }`}
            title="Redo"
          >
            <Redo2 className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Format Toolbar */}
        <SelectedElementProvider>
          <FormatToolbar />
        </SelectedElementProvider>

        {/* Download Button */}
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-2 px-3 py-2 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          {isDownloading ? "Downloading..." : "Download"}
        </button>
      </div>

      {/* ✅ Simple Back Button */}
      <div className="flex bg-[#F3F4F6] p-4">
        <button
          onClick={() => router.push("/#template")}
          className="ml-5 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors shadow-md"
          title="Back to Home"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default Header;
