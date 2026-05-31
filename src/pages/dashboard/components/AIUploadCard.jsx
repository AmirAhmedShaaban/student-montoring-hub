import { useEffect, useRef, useState } from "react";
import {
  applyMockAnalysisResult,
  createMockAnalysisResponse,
} from "../../../mocks/dashboard.mock";

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
  const fileInputRef = useRef(null);
  const timerRefs = useRef([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    return () => {
      timerRefs.current.forEach((timerId) => clearTimeout(timerId));
      timerRefs.current = [];
    };
  }, []);

  const clearTimers = () => {
    timerRefs.current.forEach((timerId) => clearTimeout(timerId));
    timerRefs.current = [];
  };

  const queueState = (delay, nextStatus, nextProgress) => {
    const timerId = setTimeout(() => {
      setStatus(nextStatus);
      setProgress(nextProgress);
    }, delay);
    timerRefs.current.push(timerId);
  };

  const startUploadSimulation = (file) => {
    if (!file) {
      setStatus("failed");
      return;
    }

    clearTimers();

    const nextResult = createMockAnalysisResponse(file);

    setSelectedFile(file);
    setFileInfo({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    });

    setStatus("uploading");
    setProgress(15);

    queueState(400, "processing", 55);

    const completionTimer = setTimeout(() => {
      setStatus("completed");
      setProgress(100);
      applyMockAnalysisResult(nextResult);
    }, 1600);

    timerRefs.current.push(completionTimer);
  };

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    if (file) startUploadSimulation(file);
    event.target.value = "";
  };

  const openFilePicker = () => fileInputRef.current?.click();

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) startUploadSimulation(file);
  };

  const handleUploadClick = () => {
    if (status === "processing") return;
    if (selectedFile && status === "completed") {
      startUploadSimulation(selectedFile);
      return;
    }
    openFilePicker();
  };

  const handleRemoveFile = () => {
    clearTimers();
    setSelectedFile(null);
    setFileInfo(null);
    setStatus("idle");
    setProgress(0);
  };

  const isBusy = status === "uploading" || status === "processing";

  const buttonLabel =
    status === "idle"
      ? "Upload classroom media"
      : status === "completed"
        ? "Analyze again"
        : "Processing...";

  const statusLabel =
    status === "uploading"
      ? "Uploading media..."
      : status === "processing"
        ? "AI is analyzing..."
        : status === "completed"
          ? "Analysis completed successfully"
          : status === "failed"
            ? "Upload failed"
            : "Ready to upload";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,image/*"
        onChange={handleFileSelection}
        className="sr-only"
      />

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
                Upload video or image to get AI-powered behavior insights
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
              Drag & drop classroom media here, or{" "}
              <span className="font-semibold text-sky-600">browse files</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Supports MP4, MOV, JPG, PNG (Max 100MB)
            </p>
          </div>

          {/* Status & Progress */}
          {(status !== "idle" || fileInfo) && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">
                  {statusLabel}
                </span>
                <span className="font-mono text-slate-500">{progress}%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {fileInfo && (
                <div className="mt-3 flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-900">
                      {fileInfo.name}
                    </p>
                    <p className="text-xs text-slate-500">{fileInfo.size}</p>
                  </div>
                  {status === "completed" && (
                    <button
                      onClick={handleRemoveFile}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
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
  );
}
