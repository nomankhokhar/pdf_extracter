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
import PdfView from "./PDFView";
import OCRView from "./OCRView";

// Set the PDF worker (browser only)
// if (typeof window !== "undefined") {
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// }

// PDF DATA
// type WordData = {
//   text: string;
//   bbox: [number, number, number, number];
// };

// type PageData = {
//   page: number;
//   words: WordData[];
// };

// type PdfData = {
//   text: PageData[];
// };

// const pdfData: PdfData = {
//   text: [
//     {
//       page: 1,
//       words: [
//         { text: "The ", bbox: [143.56, 413.33, 159.35, 423.39] },
//         { text: "dominant ", bbox: [162.16, 413.33, 200.55, 423.39] },
//         { text: "sequence ", bbox: [203.34, 413.33, 240.59, 423.39] },
//         { text: "transduction ", bbox: [243.39, 413.33, 293.63, 423.39] },
//         { text: "models ", bbox: [296.44, 413.33, 325.79, 423.39] },
//         { text: "are ", bbox: [328.59, 413.33, 341.0, 423.39] },
//         { text: "based ", bbox: [343.8, 413.33, 366.94, 423.39] },
//         { text: "on ", bbox: [369.74, 413.33, 379.91, 423.39] },
//         { text: "complex ", bbox: [382.71, 413.33, 417.56, 423.39] },
//         { text: "recurrent ", bbox: [420.36, 413.33, 457.04, 423.39] },
//         { text: "or ", bbox: [459.83, 413.33, 468.29, 423.39] },
//         { text: "convolutional ", bbox: [143.86, 424.24, 199.15, 434.3] },
//       ],
//     },
//   ],
// };

// OCR DATA

interface WordData {
  text: string;
  bbox: number[][];
}

interface PageData {
  page: number;
  content: WordData[];
}

interface PDFData {
  text: PageData[];
}

const ocrData: PDFData = {
  text: [
    {
      page: 2,
      content: [
        {
          text: "Project Proposal: PDF Upload and Extract System",
          bbox: [
            [69.0, 121.0],
            [303.0, 121.0],
            [303.0, 135.0],
            [69.0, 135.0],
          ],
        },
        {
          text: "Overview",
          bbox: [
            [69.0, 162.0],
            [114.0, 162.0],
            [114.0, 173.0],
            [69.0, 173.0],
          ],
        },
        {
          text: "Develop a website to upload PDF URLs, extract the information (text and bounding boxes). and render",
          bbox: [
            [69.0, 185.0],
            [512.0, 185.0],
            [512.0, 198.0],
            [69.0, 198.0],
          ],
        },
        {
          text: "transcripts. The solution will handle OCR, support zooming, and maintain bounding box accuracy.",
          bbox: [
            [69.0, 198.0],
            [489.0, 198.0],
            [489.0, 212.0],
            [69.0, 212.0],
          ],
        },
        {
          text: "Requirements",
          bbox: [
            [69.0, 226.0],
            [135.0, 226.0],
            [135.0, 237.0],
            [69.0, 237.0],
          ],
        },
        {
          text: "We support PDF uploads and a major bottleneck for us is cptimizing for speed, accuracy while keeping",
          bbox: [
            [68.0, 240.0],
            [513.0, 242.0],
            [513.0, 255.0],
            [68.0, 253.0],
          ],
        },
        {
          text: "costs down. We are rapidly pushing out new features while scaling to more and more users and hence",
          bbox: [
            [69.0, 254.0],
            [512.0, 254.0],
            [512.0, 268.0],
            [69.0, 268.0],
          ],
        },
        {
          text: "are always looking for ways to optimize our codebase in every way possible.",
          bbox: [
            [69.0, 267.0],
            [399.0, 267.0],
            [399.0, 281.0],
            [69.0, 281.0],
          ],
        },
        {
          text: "We believe this project provides a good overview of what your role would look like at YouLearn. You will",
          bbox: [
            [69.0, 292.0],
            [516.0, 292.0],
            [516.0, 307.0],
            [69.0, 307.0],
          ],
        },
        {
          text: "be spending time on all parts of the stack(frontend, backend, cloud) and the feature development cycle",
          bbox: [
            [69.0, 306.0],
            [513.0, 306.0],
            [513.0, 319.0],
            [69.0, 319.0],
          ],
        },
        {
          text: "(ideating. implementing. maintaining/improving).",
          bbox: [
            [69.0, 318.0],
            [276.0, 319.0],
            [276.0, 333.0],
            [68.0, 332.0],
          ],
        },
        {
          text: "Deadline-5Days",
          bbox: [
            [69.0, 343.0],
            [153.0, 344.0],
            [153.0, 358.0],
            [68.0, 357.0],
          ],
        },
        {
          text: "Backend",
          bbox: [
            [69.0, 396.0],
            [113.0, 396.0],
            [113.0, 407.0],
            [69.0, 407.0],
          ],
        },
        {
          text: "●Develop a Python-based API service with the following specifications:",
          bbox: [
            [86.0, 420.0],
            [404.0, 420.0],
            [404.0, 433.0],
            [86.0, 433.0],
          ],
        },
        {
          text: "0REST endpoint for PDF processing (/extract)",
          bbox: [
            [121.0, 434.0],
            [349.0, 434.0],
            [349.0, 447.0],
            [121.0, 447.0],
          ],
        },
        {
          text: "0Request will contain a valid PDF url",
          bbox: [
            [121.0, 447.0],
            [295.0, 447.0],
            [295.0, 460.0],
            [121.0, 460.0],
          ],
        },
        {
          text: "Do not worry too much about invalid urls,retuming a generic error for those",
          bbox: [
            [156.0, 460.0],
            [500.0, 459.0],
            [500.0, 474.0],
            [156.0, 475.0],
          ],
        },
        {
          text: "cases is sufficient.",
          bbox: [
            [174.0, 473.0],
            [254.0, 473.0],
            [254.0, 487.0],
            [174.0, 487.0],
          ],
        },
        {
          text: "○Response should contain: List of {text: str, bbox: list(flcat, float, float, float]",
          bbox: [
            [120.0, 485.0],
            [461.0, 486.0],
            [461.0, 500.0],
            [120.0, 499.0],
          ],
        },
        {
          text: "You may use another response format as long as it ateast contains this",
          bbox: [
            [173.0, 499.0],
            [484.0, 499.0],
            [484.0, 512.0],
            [173.0, 512.0],
          ],
        },
        {
          text: "information",
          bbox: [
            [173.0, 513.0],
            [223.0, 513.0],
            [223.0, 524.0],
            [173.0, 524.0],
          ],
        },
        {
          text: "OCR capability for non-searchable PDFs (You may use an LLM or any preferred method)",
          bbox: [
            [138.0, 524.0],
            [525.0, 524.0],
            [525.0, 538.0],
            [138.0, 538.0],
          ],
        },
        {
          text: "Containerized deployment (Docker)",
          bbox: [
            [138.0, 537.0],
            [295.0, 537.0],
            [295.0, 551.0],
            [138.0, 551.0],
          ],
        },
        {
          text: "Performance Requirements",
          bbox: [
            [86.0, 551.0],
            [233.0, 551.0],
            [233.0, 564.0],
            [86.0, 564.0],
          ],
        },
        {
          text: "Processing time: < 75 seconds per PDF",
          bbox: [
            [136.0, 563.0],
            [313.0, 563.0],
            [313.0, 577.0],
            [136.0, 577.0],
          ],
        },
        {
          text: "0",
          bbox: [
            [122.0, 577.0],
            [139.0, 577.0],
            [139.0, 588.0],
            [122.0, 588.0],
          ],
        },
        {
          text: "100% accuracy for searchable text",
          bbox: [
            [137.0, 575.0],
            [293.0, 576.0],
            [293.0, 590.0],
            [137.0, 589.0],
          ],
        },
        {
          text: "0",
          bbox: [
            [123.0, 591.0],
            [142.0, 591.0],
            [142.0, 599.0],
            [123.0, 599.0],
          ],
        },
        {
          text: "Readlable output for OCR-processed documents",
          bbox: [
            [138.0, 589.0],
            [349.0, 589.0],
            [349.0, 602.0],
            [138.0, 602.0],
          ],
        },
        {
          text: "0At Most 1 req / sec",
          bbox: [
            [120.0, 600.0],
            [224.0, 601.0],
            [224.0, 615.0],
            [120.0, 614.0],
          ],
        },
        {
          text: "·Resource Limits",
          bbox: [
            [86.0, 614.0],
            [182.0, 614.0],
            [182.0, 627.0],
            [86.0, 627.0],
          ],
        },
        {
          text: "Max Container Size: 2vCPU, 2GiB RAM",
          bbox: [
            [136.0, 626.0],
            [314.0, 626.0],
            [314.0, 641.0],
            [136.0, 641.0],
          ],
        },
        {
          text: "PDF size: ≤ 50MB",
          bbox: [
            [138.0, 640.0],
            [220.0, 640.0],
            [220.0, 653.0],
            [138.0, 653.0],
          ],
        },
        {
          text: "0Page count:≤ 2000 pages",
          bbox: [
            [120.0, 652.0],
            [256.0, 653.0],
            [256.0, 667.0],
            [120.0, 666.0],
          ],
        },
      ],
    },
    {
      page: 2,
      content: [
        {
          text: "Project Proposal: PDF Upload and Extract System",
          bbox: [
            [69.0, 121.0],
            [303.0, 121.0],
            [303.0, 135.0],
            [69.0, 135.0],
          ],
        },
        {
          text: "Overview",
          bbox: [
            [69.0, 162.0],
            [114.0, 162.0],
            [114.0, 173.0],
            [69.0, 173.0],
          ],
        },
        {
          text: "Develop a website to upload PDF URLs, extract the information (text and bounding boxes). and render",
          bbox: [
            [69.0, 185.0],
            [512.0, 185.0],
            [512.0, 198.0],
            [69.0, 198.0],
          ],
        },
        {
          text: "transcripts. The solution will handle OCR, support zooming, and maintain bounding box accuracy.",
          bbox: [
            [69.0, 198.0],
            [489.0, 198.0],
            [489.0, 212.0],
            [69.0, 212.0],
          ],
        },
        {
          text: "Requirements",
          bbox: [
            [69.0, 226.0],
            [135.0, 226.0],
            [135.0, 237.0],
            [69.0, 237.0],
          ],
        },
        {
          text: "We support PDF uploads and a major bottleneck for us is cptimizing for speed, accuracy while keeping",
          bbox: [
            [68.0, 240.0],
            [513.0, 242.0],
            [513.0, 255.0],
            [68.0, 253.0],
          ],
        },
        {
          text: "costs down. We are rapidly pushing out new features while scaling to more and more users and hence",
          bbox: [
            [69.0, 254.0],
            [512.0, 254.0],
            [512.0, 268.0],
            [69.0, 268.0],
          ],
        },
        {
          text: "are always looking for ways to optimize our codebase in every way possible.",
          bbox: [
            [69.0, 267.0],
            [399.0, 267.0],
            [399.0, 281.0],
            [69.0, 281.0],
          ],
        },
        {
          text: "We believe this project provides a good overview of what your role would look like at YouLearn. You will",
          bbox: [
            [69.0, 292.0],
            [516.0, 292.0],
            [516.0, 307.0],
            [69.0, 307.0],
          ],
        },
        {
          text: "be spending time on all parts of the stack(frontend, backend, cloud) and the feature development cycle",
          bbox: [
            [69.0, 306.0],
            [513.0, 306.0],
            [513.0, 319.0],
            [69.0, 319.0],
          ],
        },
        {
          text: "(ideating. implementing. maintaining/improving).",
          bbox: [
            [69.0, 318.0],
            [276.0, 319.0],
            [276.0, 333.0],
            [68.0, 332.0],
          ],
        },
        {
          text: "Deadline-5Days",
          bbox: [
            [69.0, 343.0],
            [153.0, 344.0],
            [153.0, 358.0],
            [68.0, 357.0],
          ],
        },
        {
          text: "Backend",
          bbox: [
            [69.0, 396.0],
            [113.0, 396.0],
            [113.0, 407.0],
            [69.0, 407.0],
          ],
        },
        {
          text: "●Develop a Python-based API service with the following specifications:",
          bbox: [
            [86.0, 420.0],
            [404.0, 420.0],
            [404.0, 433.0],
            [86.0, 433.0],
          ],
        },
        {
          text: "0REST endpoint for PDF processing (/extract)",
          bbox: [
            [121.0, 434.0],
            [349.0, 434.0],
            [349.0, 447.0],
            [121.0, 447.0],
          ],
        },
        {
          text: "0Request will contain a valid PDF url",
          bbox: [
            [121.0, 447.0],
            [295.0, 447.0],
            [295.0, 460.0],
            [121.0, 460.0],
          ],
        },
        {
          text: "Do not worry too much about invalid urls,retuming a generic error for those",
          bbox: [
            [156.0, 460.0],
            [500.0, 459.0],
            [500.0, 474.0],
            [156.0, 475.0],
          ],
        },
        {
          text: "cases is sufficient.",
          bbox: [
            [174.0, 473.0],
            [254.0, 473.0],
            [254.0, 487.0],
            [174.0, 487.0],
          ],
        },
        {
          text: "○Response should contain: List of {text: str, bbox: list(flcat, float, float, float]",
          bbox: [
            [120.0, 485.0],
            [461.0, 486.0],
            [461.0, 500.0],
            [120.0, 499.0],
          ],
        },
        {
          text: "You may use another response format as long as it ateast contains this",
          bbox: [
            [173.0, 499.0],
            [484.0, 499.0],
            [484.0, 512.0],
            [173.0, 512.0],
          ],
        },
        {
          text: "information",
          bbox: [
            [173.0, 513.0],
            [223.0, 513.0],
            [223.0, 524.0],
            [173.0, 524.0],
          ],
        },
        {
          text: "OCR capability for non-searchable PDFs (You may use an LLM or any preferred method)",
          bbox: [
            [138.0, 524.0],
            [525.0, 524.0],
            [525.0, 538.0],
            [138.0, 538.0],
          ],
        },
        {
          text: "Containerized deployment (Docker)",
          bbox: [
            [138.0, 537.0],
            [295.0, 537.0],
            [295.0, 551.0],
            [138.0, 551.0],
          ],
        },
        {
          text: "Performance Requirements",
          bbox: [
            [86.0, 551.0],
            [233.0, 551.0],
            [233.0, 564.0],
            [86.0, 564.0],
          ],
        },
        {
          text: "Processing time: < 75 seconds per PDF",
          bbox: [
            [136.0, 563.0],
            [313.0, 563.0],
            [313.0, 577.0],
            [136.0, 577.0],
          ],
        },
        {
          text: "0",
          bbox: [
            [122.0, 577.0],
            [139.0, 577.0],
            [139.0, 588.0],
            [122.0, 588.0],
          ],
        },
        {
          text: "100% accuracy for searchable text",
          bbox: [
            [137.0, 575.0],
            [293.0, 576.0],
            [293.0, 590.0],
            [137.0, 589.0],
          ],
        },
        {
          text: "0",
          bbox: [
            [123.0, 591.0],
            [142.0, 591.0],
            [142.0, 599.0],
            [123.0, 599.0],
          ],
        },
        {
          text: "Readlable output for OCR-processed documents",
          bbox: [
            [138.0, 589.0],
            [349.0, 589.0],
            [349.0, 602.0],
            [138.0, 602.0],
          ],
        },
        {
          text: "0At Most 1 req / sec",
          bbox: [
            [120.0, 600.0],
            [224.0, 601.0],
            [224.0, 615.0],
            [120.0, 614.0],
          ],
        },
        {
          text: "·Resource Limits",
          bbox: [
            [86.0, 614.0],
            [182.0, 614.0],
            [182.0, 627.0],
            [86.0, 627.0],
          ],
        },
        {
          text: "Max Container Size: 2vCPU, 2GiB RAM",
          bbox: [
            [136.0, 626.0],
            [314.0, 626.0],
            [314.0, 641.0],
            [136.0, 641.0],
          ],
        },
        {
          text: "PDF size: ≤ 50MB",
          bbox: [
            [138.0, 640.0],
            [220.0, 640.0],
            [220.0, 653.0],
            [138.0, 653.0],
          ],
        },
        {
          text: "0Page count:≤ 2000 pages",
          bbox: [
            [120.0, 652.0],
            [256.0, 653.0],
            [256.0, 667.0],
            [120.0, 666.0],
          ],
        },
      ],
    },
  ],
};
type PDFViewerProps = {
  pdfUrl: string;
};

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<[]>([]);

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
        const response = await axios.post("http://localhost:8000/extract", {
          pdf_url: pdfUrl,
        });

        if (response?.data) {
          setExtractedText(response.data);
          toast.success("Text extraction successful!");
        } else {
          setExtractedText([]);
          toast.error("Failed to extract text from PDF.");
        }
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
              />
            </Worker>
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p>Loading PDF...</p>
            </div>
          )}
        </div>

        {/* Transcript Section */}
        <div className="bg-white rounded-lg shadow-md h-[500px] overflow-auto p-2 flex flex-col">
          <OCRView ocrData={ocrData} />
          {/* <PdfView pdfData={pdfData} /> */}
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
