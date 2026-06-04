import { useState } from "react";
import { detectBehavior } from "../../../services/behaviorService";
import AIAnalysisResults from "./AIAnalysisResults";

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="h-10 w-10 text-slate-400"
    >
      <path
        d="M12 16V8m0 0-3 3m3-3 3 3M6.5 19a4.5 4.5 0 0 1-.7-8.95A6 6 0 0 1 17.8 8.1 4 4 0 1 1 18 19H6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function AIUploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  // status: "idle" | "uploading" | "completed" | "failed"
  const [status, setStatus] = useState("idle");
  const [fileInfo, setFileInfo] = useState(null);

  // Analysis results coming from the backend.
  const [results, setResults] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Run the real AI detection request for the given image file.
  const runDetection = async (file) => {
    if (!file) {
      setStatus("failed");
      setErrorMessage("No file selected.");
      return;
    }

    setSelectedFile(file);
    setFileInfo({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    });

    setStatus("uploading");
    setErrorMessage("");
    setResults(null);
    setResultMessage("");

    const response = await detectBehavior(file);

    if (response.success) {
      setResults(response.data);
      setResultMessage(response.message);
      setStatus("completed");
    } else {
      setStatus("failed");
      setErrorMessage(response.message || "Analysis failed. Please try again.");
    }
  };

  const openFilePicker = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (event) => {
      const file = event.target.files?.[0];
      if (file) runDetection(file);
    };
    input.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) runDetection(file);
  };

  const handleUploadClick = () => {
    if (status === "uploading") return;
    if (selectedFile && status === "completed") {
      runDetection(selectedFile);
      return;
    }
    openFilePicker();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileInfo(null);
    setStatus("idle");
    setResults(null);
    setResultMessage("");
    setErrorMessage("");
  };

  const isBusy = status === "uploading";

  const buttonLabel =
    status === "idle"
      ? "Upload classroom media"
      : status === "completed"
        ? "Analyze again"
        : status === "uploading"
          ? "Analyzing..."
          : "Try again";

  const statusLabel =
    status === "uploading"
      ? "AI is analyzing..."
      : status === "completed"
        ? "Analysis completed successfully"
        : status === "failed"
          ? "Analysis failed"
          : "Ready to upload";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          {/* Left Side - Info */}
          <div className="max-w-md">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3">
                <UploadIcon />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">
                  Classroom Media Analysis
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Upload an image to get AI-powered behavior insights
                </p>
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="flex-1 max-w-2xl">
            <div
              onClick={openFilePicker}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
              className={`group flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                isDragging
                  ? "border-sky-400 bg-sky-50"
                  : "border-slate-200 hover:border-sky-300 hover:bg-slate-50"
              }`}
            >
              <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                <UploadIcon />
              </div>
              <p className="text-sm font-medium text-slate-700">
                Drag & drop a classroom image here, or{" "}
                <span className="font-semibold text-sky-600">browse files</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Supports JPG, PNG (Max 100MB)
              </p>
            </div>

            {/* Status */}
            {(status !== "idle" || fileInfo) && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">
                    {statusLabel}
                  </span>
                  {status === "uploading" ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
                  ) : null}
                </div>

                {status === "uploading" ? (
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                    <div className="h-2 w-1/2 animate-pulse rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" />
                  </div>
                ) : null}

                {fileInfo && (
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-slate-900">
                        {fileInfo.name}
                      </p>
                      <p className="text-xs text-slate-500">{fileInfo.size}</p>
                    </div>
                    {status === "completed" || status === "failed" ? (
                      <button
                        onClick={handleRemoveFile}
                        className="text-xs font-medium text-rose-600 hover:text-rose-700"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                )}

                {status === "failed" && errorMessage ? (
                  <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {errorMessage}
                  </p>
                ) : null}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleUploadClick}
              disabled={isBusy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {buttonLabel}
            </button>
          </div>
        </div>
      </section>

      {/* Analysis Results (shown after a successful detection) */}
      {status === "completed" && results ? (
        <AIAnalysisResults results={results} message={resultMessage} />
      ) : null}
    </div>
  );
}
