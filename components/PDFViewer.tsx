"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  OpenFile,
  Tooltip,
  Button,
  Position,
} from "@react-pdf-viewer/core";
import { pdfjs } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/toolbar/lib/styles/index.css";
import { toolbarPlugin } from "@react-pdf-viewer/toolbar";
import type {
  ToolbarSlot,
  TransformToolbarSlot,
} from "@react-pdf-viewer/toolbar";
import {
  highlightPlugin,
  MessageIcon,
  RenderHighlightTargetProps,
} from "@react-pdf-viewer/highlight";

// Import styles
import "@react-pdf-viewer/highlight/lib/styles/index.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ExtractedText {
  text: string;
  bbox: [number, number, number, number]; // [x, y, width, height]
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
  const [blobUrl, setBlobUrl] = useState<string | null>(null); // Store Blob URL
  const [extractedText, setExtractedText] = useState<ExtractedText[]>([]);
  const [selectedText, setSelectedText] = useState<ExtractedText | null>(null);
  const [scale, setScale] = useState<number>(1);
  const pdfContainerRef = useRef<HTMLDivElement | null>(null);

  /** 🔹 Download the PDF as a Blob */
  useEffect(() => {
    const downloadPdfBlob = async () => {
      try {
        toast.loading("Downloading PDF...");
        const response = await axios.get(pdfUrl, { responseType: "blob" });

        if (!response.data) {
          throw new Error("Failed to load PDF");
        }

        const blob = new Blob([response.data], { type: "application/pdf" });
        const objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
        toast.success("PDF loaded successfully!");
      } catch {
        toast.error("Error loading PDF. Please try again.");
      } finally {
        toast.dismiss();
      }
    };

    if (pdfUrl) {
      downloadPdfBlob();
    }
  }, [pdfUrl]);

  /** 🔹 Extract Text from PDF */
  useEffect(() => {
    const extractTextFromPdf = async () => {
      try {
        toast.loading("Processing PDF...");
        const response = await axios.post<ApiResponse>("/api/extract", {
          url: pdfUrl,
        });

        if (!response.data.success) {
          throw new Error(response.data.error || "Failed to extract text");
        }

        setExtractedText(response.data.data);
        toast.success("Text extraction successful!");
      } catch {
        toast.error("Error extracting text. Please try again.");
      } finally {
        toast.dismiss();
      }
    };

    if (pdfUrl) {
      extractTextFromPdf();
    }
  }, [pdfUrl]);

  // Handle Text Click
  const handleTextClick = (text: ExtractedText) => {
    setSelectedText(text);
  };
  const toolbarPluginInstance = toolbarPlugin({
    getFilePlugin: {
      fileNameGenerator: (file: OpenFile) => {
        const fileName = file.name.substring(file.name.lastIndexOf("/") + 1);
        return `a-copy-of-${fileName}`;
      },
    },
    searchPlugin: {
      keyword: "PDF",
    },
  });
  const { renderDefaultToolbar, Toolbar } = toolbarPluginInstance;

  const transform: TransformToolbarSlot = (slot: ToolbarSlot) => ({
    ...slot,
    SwitchScrollMode: () => <></>,
    ShowSearchPopover: () => <></>,
    Open: () => <></>,
    Print: () => <></>,
    Download: () => <></>,
    EnterFullScreen: () => <></>,
    SwitchTheme: () => <></>,
  });
  const renderHighlightTarget = (props: RenderHighlightTargetProps) => (
    <div
      style={{
        background: "#eee",
        display: "flex",
        position: "absolute",
        left: `${props.selectionRegion.left}%`,
        top: `${props.selectionRegion.top + props.selectionRegion.height}%`,
        transform: "translate(0, 8px)",
        zIndex: 1,
      }}
    >
      <Tooltip
        position={Position.TopCenter}
        target={
          <Button onClick={props.toggle}>
            <MessageIcon />
          </Button>
        }
        content={() => <div style={{ width: "100px" }}>Add a note</div>}
        offset={{ left: 0, top: -8 }}
      />
    </div>
  );
  const highlightPluginInstance = highlightPlugin({ renderHighlightTarget });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Viewer with Bounding Boxes */}
        <div className="bg-white rounded-lg shadow-md h-[500px] overflow-hidden relative">
          {blobUrl ? (
            <Worker
              workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}
            >
              <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
              <Viewer
                theme="dark"
                plugins={[toolbarPluginInstance, highlightPluginInstance]}
                fileUrl={blobUrl}
                defaultScale={SpecialZoomLevel.PageFit}
                onZoom={(props) => setScale(props.scale)}
              />
            </Worker>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p>Loading PDF...</p>
            </div>
          )}

          {/* Bounding Boxes */}
          <div
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            ref={pdfContainerRef}
          >
            {extractedText.map((item, index) => (
              <div
                key={index}
                className={`absolute border-2 ${
                  selectedText === item ? "border-red-500" : "border-blue-400"
                }`}
                style={{
                  left: `${item.bbox[0] * scale}px`,
                  top: `${item.bbox[1] * scale}px`,
                  width: `${item.bbox[2] * scale}px`,
                  height: `${item.bbox[3] * scale}px`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Transcript Section */}
        <div className="bg-white rounded-lg shadow-md h-[500px] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto p-6">
            <div className="space-y-2">
              {extractedText.length > 0 ? (
                extractedText.map((item, index) => (
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
                ))
              ) : (
                <p className="text-gray-500">No extracted text found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
