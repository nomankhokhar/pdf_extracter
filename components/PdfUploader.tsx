"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import PDFViewer from "./PDFViewer";

// Function to validate if URL is a valid PDF
const validatePdfUrl = async (url: string) => {
  const isPdfByExtension = url.toLowerCase().endsWith(".pdf");

  const isPdfByContentType = async () => {
    try {
      const response = await axios.head(url);
      return response.headers["content-type"].includes("application/pdf");
    } catch {
      return false; // If there's an error, it's not a PDF
    }
  };

  const isPdfByFetch = async () => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const contentType = response.headers["content-type"];
      return contentType.includes("application/pdf");
    } catch {
      return false; // If fetching fails, it's not a PDF
    }
  };

  // Run validation checks
  const isValidPdf =
    isPdfByExtension || (await isPdfByContentType()) || (await isPdfByFetch());

  return isValidPdf;
};

const PdfUploader = () => {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [validatedPdfUrl, setValidatedPdfUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [isValidPdf, setIsValidPdf] = useState<boolean>(true); // To track if PDF URL is valid

  // API Call Function
  const extractPdfData = async () => {
    if (!validatedPdfUrl.trim()) return;

    // setIsLoading(true);
    // setError(null);
    // setResponseMessage(null);

    // // Validate PDF URL
    // const validPdf = await validatePdfUrl(validatedPdfUrl);
    // setIsValidPdf(validPdf); // Set validity

    // if (!validPdf) {
    //   setError("Invalid PDF URL.");
    //   toast.error("Invalid PDF URL.");
    //   setIsLoading(false);
    //   return;
    // }

    setPdfUrl(validatedPdfUrl);
    // try {
    //   const response = await axios.post("/api/extract", { pdfUrl: pdfUrl });

    //   if (response.status === 200) {
    //     setResponseMessage("PDF Extracted Successfully!");
    //     toast.success("PDF Extracted Successfully!");
    //     console.log("Extracted Data:", response.data);
    //   }
    // } catch (error) {
    //   if (axios.isAxiosError(error)) {
    //     setError(error.response?.data?.error || "Failed to extract PDF.");
    //     toast.error(error.response?.data?.error || "Failed to extract PDF.");
    //   } else {
    //     setError("Error occurred during extraction.");
    //     toast.error("Error occurred during extraction.");
    //   }
    // } finally {
    //   setIsLoading(false);
    // }
  };

  function uploadAnotherPdf() {
    setPdfUrl("");
    setValidatedPdfUrl("");
    setResponseMessage(null);
    setError(null);
    setIsValidPdf(true); // Reset PDF validity on upload
  }

  useEffect(() => {
    if (validatedPdfUrl.trim()) {
      extractPdfData();
    }
  }, [validatedPdfUrl]);

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
                value={validatedPdfUrl}
                onChange={(e) => setValidatedPdfUrl(e.target.value)}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/path/to/pdf.pdf"
                required
              />
            </div>

            {isLoading && (
              <div className="text-blue-500 text-center mt-4">
                Extracting...
              </div>
            )}
            {error && (
              <div className="text-red-500 text-center mt-4">{error}</div>
            )}
            {responseMessage && (
              <div className="text-green-500 text-center mt-4">
                {responseMessage}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <button
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition"
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
