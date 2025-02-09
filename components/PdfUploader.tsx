"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PDFViewer from "./PDFViewer";

const PdfUploader = () => {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [inputUrl, setInputUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAndLoadPdf = async () => {
      if (!inputUrl.trim()) return;

      setIsLoading(true);

      try {
        const urlPattern =
          /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlPattern.test(inputUrl)) {
          throw new Error("Invalid URL format.");
        }

        // Check if the URL ends with .pdf or has the correct MIME type
        const response = await fetch(inputUrl, {
          method: "GET",
          redirect: "follow",
        });
        if (!response.ok) {
          toast.error("Failed to load the pdf");
          return;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/pdf")) {
          toast.error("The URL does not point to a PDF file.");
          return;
        }

        setPdfUrl(inputUrl);
      } catch {
        toast.error("Failed to load the pdf");
      } finally {
        setIsLoading(false);
      }
    };

    // Only validate if inputUrl changes
    if (inputUrl) {
      validateAndLoadPdf();
    }
  }, [inputUrl]);
  const uploadAnotherPdf = () => {
    setPdfUrl("");
    setInputUrl("");
    setError(null);
  };

  return (
    <>
      {!pdfUrl ? (
        <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-4">
              Extract PDF Data from URL
            </h2>
            <div className="mb-4">
              <label
                htmlFor="pdfUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Enter PDF URL:
              </label>
              <input
                id="pdfUrl"
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/path/to/pdf.pdf"
                required
              />
            </div>

            {isLoading && (
              <div className="text-blue-500 text-center mt-4">
                Validating...
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center mt-4">{error}</div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <button
            className="fixed top-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
            onClick={uploadAnotherPdf}
          >
            Upload Another PDF
          </button>
          <PDFViewer pdfUrl={pdfUrl} />
        </div>
      )}
    </>
  );
};

export default PdfUploader;
