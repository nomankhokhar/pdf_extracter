import { PDFData } from "@/types/PDF";
import React, { useState, useEffect, useRef } from "react";

type PdfViewProps = {
  pdfData: PDFData;
};

const PdfView: React.FC<PdfViewProps> = ({ pdfData }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [startWord, setStartWord] = useState<HTMLSpanElement | null>(null);
  const [currentWords, setCurrentWords] = useState<HTMLSpanElement[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isSelecting || !startWord) return;
      const word = document.elementFromPoint(
        event.clientX,
        event.clientY
      ) as HTMLSpanElement;
      if (word && word.classList.contains("word")) {
        updateHighlight(word);
      }
    };

    const handleMouseUp = () => {
      if (!isSelecting) return;
      currentWords.forEach((word) => {
        word.classList.remove("selecting");
        word.classList.add("highlighted");
      });
      setIsSelecting(false);
      setStartWord(null);
      setCurrentWords([]);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSelecting, startWord, currentWords]);

  const handleMouseDown = (event: React.MouseEvent) => {
    document.querySelectorAll(".highlighted, .selecting").forEach((word) => {
      word.classList.remove("highlighted", "selecting");
    });

    const word = (event.target as HTMLElement).closest(
      ".word"
    ) as HTMLSpanElement;
    if (word) {
      setIsSelecting(true);
      setStartWord(word);
      word.classList.add("selecting");
    }
  };

  const updateHighlight = (currentWord: HTMLSpanElement) => {
    if (!startWord) return;
    document.querySelectorAll(".selecting").forEach((word) => {
      word.classList.remove("selecting");
    });

    const currentPage = currentWord.closest(
      ".page-container"
    ) as HTMLDivElement;
    if (!currentPage) return;

    const allWordsInPage = Array.from(
      currentPage.querySelectorAll(".word")
    ) as HTMLSpanElement[];
    const selectedWords = getWordsBetween(
      startWord,
      currentWord,
      allWordsInPage
    );
    setCurrentWords(selectedWords);
    selectedWords.forEach((word) => word.classList.add("selecting"));
  };

  const getWordsBetween = (
    word1: HTMLSpanElement,
    word2: HTMLSpanElement,
    allWords: HTMLSpanElement[]
  ) => {
    const rect1 = word1.getBoundingClientRect();
    const rect2 = word2.getBoundingClientRect();
    const left = Math.min(rect1.left, rect2.left);
    const right = Math.max(rect1.right, rect2.right);
    const top = Math.min(rect1.top, rect2.top);
    const bottom = Math.max(rect1.bottom, rect2.bottom);

    return allWords.filter((word) => {
      const rect = word.getBoundingClientRect();
      return (
        rect.left >= left - 5 &&
        rect.right <= right + 5 &&
        rect.top >= top - 5 &&
        rect.bottom <= bottom + 5
      );
    });
  };

  return (
    <div ref={containerRef} onMouseDown={handleMouseDown}>
      {pdfData.text.map((pageData, pageIndex) => (
        <div
          key={pageIndex}
          className="page-container"
          style={{
            width: 595,
            height: 842,
            position: "relative",
            border: "1px solid #ccc",
            backgroundColor: "white",
          }}
        >
          {pageData.words.map((wordData, wordIndex) => {
            const [x0, y0] = wordData.bbox;
            return (
              <span
                key={wordIndex}
                className="word"
                style={{
                  position: "absolute",
                  left: x0,
                  top: y0,
                  fontSize: "12px",
                  fontFamily: "Times New Roman, serif",
                  cursor: "pointer",
                  userSelect: "none",
                  padding: "2px 4px",
                }}
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

export default PdfView;
