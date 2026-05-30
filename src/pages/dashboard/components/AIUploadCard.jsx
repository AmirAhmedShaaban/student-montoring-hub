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

export default function AIUploadCard() {
  const fileInputRef = useRef(null);
  const timerRefs = useRef([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);

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
    setStatus("uploading");
    setProgress(12);

    queueState(450, "processing", 48);

    const completionTimer = setTimeout(() => {
      setStatus("completed");
      setProgress(100);
      applyMockAnalysisResult(nextResult);
    }, 1550);

    timerRefs.current.push(completionTimer);
  };

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];

    if (file) {
      startUploadSimulation(file);
    }

    event.target.value = "";
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
      startUploadSimulation(file);
    }
  };

  const handleUploadClick = () => {
    if (status === "processing") {
      return;
    }

    if (selectedFile && status === "completed") {
      startUploadSimulation(selectedFile);
      return;
    }

    openFilePicker();
  };

  const isBusy =
    status === "uploading" || status === "processing";
  const buttonLabel =
    status === "idle"
      ? "Upload video"
      : status === "completed"
        ? "Upload again"
        : "Processing";

  const statusLabel =
    status === "uploading"
      ? "Uploading..."
      : status === "processing"
        ? "Processing..."
        : status === "completed"
          ? "Analysis completed"
          : status === "failed"
            ? "Upload failed"
            : "Ready to upload";

  return (
    <section className="rounded-[1.6rem] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.32)] sm:p-4 lg:p-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,image/*"
        onChange={handleFileSelection}
        className="sr-only"
        aria-label="Upload classroom media"
      />

      <div className="grid gap-3 lg:grid-cols-[0.72fr_1.28fr] lg:items-start xl:gap-4">
        <div className="flex h-fit self-start flex-col justify-center rounded-[1.4rem] border border-slate-200 bg-white/80 p-3 shadow-sm sm:p-4">
          <div>
            <p className="text-sm font-semibold text-slate-950">
              Classroom media analysis
            </p>
            <p className="mt-2.5 max-w-md text-sm leading-5 text-slate-600 sm:text-[0.92rem]">
              Upload classroom media to trigger the analysis workflow.
            </p>
          </div>
        </div>

        <div className="h-fit self-start rounded-[1.4rem] border border-slate-200 bg-white/90 p-2 shadow-sm sm:p-2.5">
          <div
            role="button"
            tabIndex={0}
            onClick={openFilePicker}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFilePicker();
              }
            }}
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragging(false);
            }}
            onDrop={handleDrop}
            className={`group flex min-h-[4.25rem] w-full cursor-pointer flex-col items-center justify-center rounded-[1.35rem] border-2 border-dashed px-4 py-3 text-center transition outline-none sm:min-h-[4.25rem] sm:px-5 ${
              isDragging
                ? "border-sky-400 bg-sky-50 shadow-[0_16px_36px_-28px_rgba(14,165,233,0.8)]"
                : "border-slate-200 bg-slate-50/80 hover:border-sky-300 hover:bg-sky-50/70"
            } focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 group-hover:-translate-y-0.5 group-hover:scale-[1.01]">
              <UploadIcon />
            </div>

            <p className="mt-2.5 max-w-xl text-sm leading-5 text-slate-700 sm:text-[0.9rem]">
              Drag and drop classroom media here, or{" "}
              <span className="font-semibold text-sky-700">browse files</span>
            </p>
          </div>

          <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-600">
              <span>{statusLabel}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-1.5 h-1.5 rounded-full bg-slate-200">
              <div
                className="h-1.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="mt-1 text-[0.7rem] leading-4 text-slate-600">
              {selectedFile
                ? "Media selected. Analysis will update shared dashboard data."
                : "Choose a video or image to start the upload."}
            </p>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isBusy}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-sky-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition duration-300 hover:-translate-y-0.5 hover:bg-sky-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:translate-y-0"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="h-5 w-5"
              >
                <path
                  d="M12 16V4m0 0 4 4m-4-4-4 4M5 20h14"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {buttonLabel}
            </button>
          </div>

          <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-[0.7rem] leading-4 text-slate-600">
            {status === "completed"
              ? "Results are ready for review."
              : status === "failed"
                ? "Upload failed. Please try again."
                : "Processing classroom media..."}
          </div>
        </div>
      </div>
    </section>
  );
}
