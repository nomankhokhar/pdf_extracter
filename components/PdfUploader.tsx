"use client";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import PDFViewer from "./PDFViewer";

const PdfUploader = () => {
  const [pdfUrl, setPdfUrl] = useState<string>(
    "https://api31.ilovepdf.com/v1/download/Alp88zq9c5f9chqxhpvd94bdn130d8zyzvf12pj9An36bxg3qxh9z25j5kf6kjhlmd1Ajtbzlgwtmsnn8qAckncsz5xqz8t0v6zhAsz6sdfcy4y47sgxwhbspjt12m8sAhA7hb0zjxx9rldkb0m9t7hlfmpf8nl220ms9357bdkxdpt4tdt12"
  );
  const [inputUrl, setInputUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateAndLoadPdf = async () => {
      if (!inputUrl.trim()) return;

      setIsLoading(true);
      setError(null);

      setError("Invalid PDF URL.");
      toast.error("Invalid PDF URL.");

      toast.success("PDF Loaded Successfully!");
      setPdfUrl(inputUrl);
      setIsLoading(false);
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
