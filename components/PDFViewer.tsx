"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ExtractedText from "./ExtractedText";

interface ExtractedText {
  text: string;
  bbox: [number, number, number, number];
}

interface ApiResponse {
  success: boolean;
  data: ExtractedText[];
  error?: string;
}

type PDFViewerProps = {
  pdfUrl: string;
};

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [extractedText, setExtractedText] = useState<ExtractedText[]>([]);
  const [selectedText, setSelectedText] = useState<ExtractedText | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);
  const [pdfLoader, setPdfLoader] = useState<boolean>(false);
  const loadPDF = async (): Promise<void> => {
    try {
      setPdfLoader(true);
      const response = await axios.get(pdfUrl, { responseType: "blob" });

      if (!response.data) throw new Error("Failed to load PDF");

      const blob = new Blob([response.data], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(blob);

      if (pdfContainerRef.current) {
        const objectElement = document.createElement("object");
        objectElement.data = objectUrl;
        objectElement.type = "application/pdf";
        objectElement.className = "w-full h-full";

        pdfContainerRef.current.innerHTML = "";
        pdfContainerRef.current.appendChild(objectElement);
      }
      setPdfLoader(false);
    } catch {
      toast.error("Error loading PDF. Please try again.");
      setPdfLoader(false);
    }
  };
  const handleUrlSubmit = async (): Promise<void> => {
    try {
      toast.loading("Processing PDF...");
      const response = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pdfUrl }),
      });

      if (!response.ok) throw new Error("Failed to process PDF");

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to extract text");
      }

      setExtractedText(result.data);
      toast.success("Text extraction successful!");
    } catch {
      toast.error("Error extracting text. Please try again.");
    } finally {
      toast.dismiss();
    }
  };

  const handleTextClick = (text: ExtractedText): void => {
    setSelectedText(text);
  };

  useEffect(() => {
    loadPDF();
    handleUrlSubmit();
  }, [pdfUrl]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* PDF Viewer and Text Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md h-[800px] overflow-hidden">
          {pdfLoader ? (
            <div className="flex items-center justify-center w-full h-full">
              Loading...
            </div>
          ) : (
            <div ref={pdfContainerRef} className="w-full h-full" />
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md h-[800px] overflow-hidden flex flex-col">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Extracted Text</h2>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-2">
              {/* {extractedText.map((item, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer transition-colors duration-200 ${
                    selectedText === item
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleTextClick(item)}
                >
                  <p className="text-gray-700">{item.text}</p>
                </div>
              ))} */}
              <ExtractedText />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
