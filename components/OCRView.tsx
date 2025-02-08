import { OCRData } from "@/types/OCR";
import React, { useState, useEffect } from "react";

type OCRViewProps = {
  ocrData: OCRData;
};

const OCRView: React.FC<OCRViewProps> = ({ ocrData }) => {
  const [isSelecting, setIsSelecting] = useState<boolean>(false);

  const handleMouseDown = (event: MouseEvent) => {
    document.querySelectorAll(".highlighted, .selecting").forEach((word) => {
      word.classList.remove("highlighted", "selecting");
    });

    const word = (event.target as HTMLElement).closest(".word");
    if (word) {
      setIsSelecting(true);
      word.classList.add("selecting");
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isSelecting) return;
    const word = document.elementFromPoint(
      event.clientX,
      event.clientY
    ) as HTMLElement;
    if (word && word.classList.contains("word")) {
      word.classList.add("selecting");
    }
  };

  const handleMouseUp = () => {
    if (!isSelecting) return;
    document.querySelectorAll(".selecting").forEach((word) => {
      word.classList.remove("selecting");
      word.classList.add("highlighted");
    });
    setIsSelecting(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSelecting]);

  return (
    <div id="pdf-container">
      {ocrData.text.map((page, index) => (
        <div key={index} className="page-container">
          {page.content.map((wordData, idx) => {
            const [[x0, y0]] = wordData.bbox;
            return (
              <span
                key={idx}
                className="word"
                style={{ left: `${x0}px`, top: `${y0}px` }}
              >
                {wordData.text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default OCRView;
