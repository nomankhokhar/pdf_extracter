"use client";
import { useState, useRef } from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { pdfjs } from "react-pdf";
import { toast } from "react-hot-toast";

// Custom hook for managing bounding box highlights
const useBoundingBoxes = () => {
  const [highlightedText, setHighlightedText] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<{ [key: string]: any }>({});

  const addBox = (text: string, box: any) => {
    setBoxes((prevBoxes) => ({
      ...prevBoxes,
      [text]: box,
    }));
    setHighlightedText(text);
  };

  return { highlightedText, boxes, addBox };
};

const PdfWithTranscript = ({ pdfUrl }: { pdfUrl: string }) => {
  const { highlightedText, boxes, addBox } = useBoundingBoxes();
  const viewerRef = useRef(null);

  const [pageCount, setPageCount] = useState<number>(0);
  const [transcript, setTranscript] = useState<string[]>([
    // Example transcript text (in real use case, you would extract this from the PDF)
    "Hello world",
    "This is a sample PDF",
    "This is a bounding box example",
  ]);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setPageCount(numPages);
  };

  const renderBoundingBox = (text: string) => {
    return boxes[text] ? (
      <div
        style={{
          position: "absolute",
          left: `${boxes[text].x}%`,
          top: `${boxes[text].y}%`,
          width: `${boxes[text].width}%`,
          height: `${boxes[text].height}%`,
          border: "2px solid red",
        }}
      />
    ) : null;
  };

  const handleTranscriptClick = (text: string) => {
    // Simulate the bounding box calculation for the clicked text.
    // In a real scenario, you would get this from the PDF processing.
    const box = { x: 20, y: 30, width: 10, height: 5 }; // Replace with real bounding box coordinates.
    addBox(text, box);

    // Optionally show a toast on click
    toast.success(`Highlighted text: ${text}`);
  };

  return (
    <div className="flex justify-center items-start h-screen bg-gray-100">
      <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-lg flex space-x-4">
        {/* PDF Viewer */}
        <div className="w-1/2">
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
          >
            <Viewer
              fileUrl={pdfUrl}
              onLoadSuccess={onLoadSuccess}
              ref={viewerRef}
            />
            {Object.keys(boxes).map((text) => renderBoundingBox(text))}
          </Worker>
        </div>

        {/* Transcript */}
        <div className="w-1/2 overflow-y-auto max-h-screen">
          <h3 className="text-xl font-semibold mb-4">Transcript</h3>
          <div>
            {transcript.map((text, index) => (
              <div
                key={index}
                className="text-blue-600 cursor-pointer mb-2"
                onClick={() => handleTranscriptClick(text)}
              >
                {text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfWithTranscript;
