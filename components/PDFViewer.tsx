"use client";
import React, { useState, useEffect } from "react";
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
import PdfView from "./PDFView";
import OCRView from "./OCRView";
import { OCRData } from "@/types/OCR";
import { PDFData } from "@/types/PDF";

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
}

type PDFViewerProps = {
  pdfUrl: string;
};

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <p>Loading PDF...</p>
    </div>
  );
};

const ExtractingText = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <p>Extracting text...</p>
    </div>
  );
};
const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [ocrData, setOcrData] = useState<OCRData>();
  const [pdfData, setPdfData] = useState<PDFData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
        setIsLoading(true);
        toast.loading("Processing PDF...");
        const response = await axios.post("http://localhost:8000/extract", {
          pdf_url: pdfUrl,
        });

        if (response?.data) {
          if (response?.data?.text[0]?.content) {
            setOcrData(response.data);
          } else if (response?.data?.text[0]?.words) {
            setPdfData(response.data);
          }
          toast.success("Text extraction successful!");
        } else {
          setOcrData(undefined);
          setPdfData(undefined);
          toast.error("Failed to extract text from PDF.");
        }
      } catch {
        toast.error("Error extracting text. Please try again.");
      } finally {
        toast.dismiss();
        setIsLoading(false);
      }
    };

    if (pdfUrl) {
      extractTextFromPdf();
    }
  }, [pdfUrl]);

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
        <div className="bg-white rounded-lg shadow-md h-[500px] overflow-auto relative">
          {blobUrl ? (
            <div>
              <h1 className="text-3xl font-bold mb-6">Link PDF View</h1>
              <Worker
                workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`}
              >
                <Toolbar>{renderDefaultToolbar(transform)}</Toolbar>
                <Viewer
                  theme="dark"
                  plugins={[toolbarPluginInstance, highlightPluginInstance]}
                  fileUrl={blobUrl}
                  defaultScale={SpecialZoomLevel.PageFit}
                />
              </Worker>
            </div>
          ) : (
            Loader()
          )}
        </div>
        <div className="bg-white rounded-lg shadow-md h-[500px] overflow-auto p-2 flex flex-col">
          <h1 className="text-3xl font-bold mb-6">
            {ocrData ? "OCR Text" : "PDF Text"}
          </h1>
          {ocrData && <OCRView ocrData={ocrData} />}
          {pdfData && <PdfView pdfData={pdfData} />}
          {isLoading && ExtractingText()}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
