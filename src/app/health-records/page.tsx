"use client";

import Link from "next/link";
import {
  ChangeEvent,
  DragEvent,
  useRef,
  useState,
} from "react";

type UploadStatus =
  | "idle"
  | "selected"
  | "processing"
  | "complete";

type ReportFile = {
  name: string;
  size: number;
  type: string;
  file: File;
};

type LabResult = {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status:
    | "NORMAL"
    | "HIGH"
    | "LOW"
    | "UNKNOWN";
  explanation: string;
};

type ReportAnalysis = {
  patient: {
    name: string;
    age: string;
    gender: string;
  };

  report: {
    name: string;
    date: string;
  };

  results: LabResult[];

  summary: string;

  doctorReview: string;
};

function Icon({
  name,
  size = 18,
}: {
  name:
    | "grid"
    | "upload"
    | "clock"
    | "shield"
    | "bell"
    | "sparkle"
    | "users"
    | "lock"
    | "search"
    | "cloud"
    | "check"
    | "file"
    | "replace";
  size?: number;
}) {
  const props = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "grid":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );

    case "upload":
      return (
        <svg {...props}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      );

    case "clock":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4l3 2" />
        </svg>
      );

    case "shield":
      return (
        <svg {...props}>
          <path d="M12 3 19 6v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6l7-3Z" />
        </svg>
      );

    case "bell":
      return (
        <svg {...props}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "sparkle":
      return (
        <svg {...props}>
          <path d="m12 3 1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2L12 3Z" />
          <path d="m19 15 .6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6L19 15Z" />
        </svg>
      );

    case "users":
      return (
        <svg {...props}>
          <circle cx="9" cy="8" r="3" />
          <path d="M3 20c0-3.2 2.4-5 6-5s6 1.8 6 5" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8" />
          <path d="M17 15c2.4.4 4 2 4 5" />
        </svg>
      );

    case "lock":
      return (
        <svg {...props}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "search":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      );

    case "cloud":
      return (
        <svg {...props}>
          <path d="M7 18h10a4 4 0 0 0 .7-7.9A6 6 0 0 0 6.1 8.5 4.8 4.8 0 0 0 7 18Z" />
          <path d="M12 15V9" />
          <path d="m9.5 11.5 2.5-2.5 2.5 2.5" />
        </svg>
      );

    case "check":
      return (
        <svg {...props}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "file":
      return (
        <svg {...props}>
          <path d="M6 3h8l4 4v14H6z" />
          <path d="M14 3v5h4" />
          <path d="M9 13h6" />
          <path d="M9 16h5" />
        </svg>
      );

    case "replace":
      return (
        <svg {...props}>
          <path d="M4 7h12" />
          <path d="m13 4 3 3-3 3" />
          <path d="M20 17H8" />
          <path d="m11 14-3 3 3 3" />
        </svg>
      );

    default:
      return null;
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function HealthRecordsPage() {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [report, setReport] =
    useState<ReportFile | null>(null);

  const [analysis, setAnalysis] =
    useState<ReportAnalysis | null>(null);

  const [status, setStatus] =
    useState<UploadStatus>("idle");

  const [analysisLoading, setAnalysisLoading] =
    useState(false);

  const [dragActive, setDragActive] =
    useState(false);

  const [error, setError] =
    useState("");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const allowedExtensions = [
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  function validateFile(file: File) {
    const extension =
      "." +
      file.name
        .split(".")
        .pop()
        ?.toLowerCase();

    if (
      !allowedExtensions.includes(
        extension
      )
    ) {
      return (
        "Please upload a PDF, JPG, PNG or WEBP file."
      );
    }

    /*
     * Existing backend currently accepts
     * maximum 5 MB.
     */

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      return (
        "The maximum file size is 5 MB."
      );
    }

    return "";
  }

  function chooseFile(file: File) {
    setError("");
    setAnalysis(null);

    const validationError =
      validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setReport({
      name: file.name,
      size: file.size,
      type: file.type,
      file,
    });

    setStatus("selected");
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) return;

    chooseFile(file);
  }

  function handleDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    setDragActive(false);

    const file =
      event.dataTransfer.files?.[0];

    if (!file) return;

    chooseFile(file);
  }

  async function uploadFile() {
    if (!report) return;

    setStatus("processing");
    setAnalysisLoading(true);
    setError("");
    setAnalysis(null);

    try {
      /*
       * =====================================================
       * STEP 1
       * SEND ORIGINAL FILE TO MEDICAL AI
       * =====================================================
       */

      const analysisFormData =
        new FormData();

      analysisFormData.append(
        "file",
        report.file
      );

      const analysisResponse =
        await fetch(
          "/api/report-analyze",
          {
            method: "POST",
            body: analysisFormData,
          }
        );

      const analysisData =
        await analysisResponse
          .json()
          .catch(() => null);

      if (
        !analysisResponse.ok
      ) {
        throw new Error(
          analysisData?.error ||
            "Unable to analyze the medical report."
        );
      }

      if (
        !analysisData?.success ||
        !analysisData?.analysis
      ) {
        throw new Error(
          "AI could not generate a valid report analysis."
        );
      }

      /*
       * =====================================================
       * STEP 2
       * GET REAL AI RESULT
       * =====================================================
       */

      const aiAnalysis =
        analysisData.analysis as ReportAnalysis;

      setAnalysis(aiAnalysis);

      /*
       * =====================================================
       * STEP 3
       * SAVE ORIGINAL REPORT
       * =====================================================
       */

      const saveFormData =
        new FormData();

      saveFormData.append(
        "file",
        report.file
      );

      saveFormData.append(
        "reportName",
        aiAnalysis.report?.name?.trim() ||
          report.name
      );

      saveFormData.append(
        "recordType",
        "Medical Report"
      );

      let finalReportDate =
        aiAnalysis.report?.date?.trim();

      if (
        !finalReportDate ||
        finalReportDate.toLowerCase() ===
          "not provided"
      ) {
        finalReportDate =
          new Date()
            .toISOString()
            .split("T")[0];
      }

      saveFormData.append(
        "reportDate",
        finalReportDate
      );

      const saveResponse =
        await fetch(
          "/api/health-records",
          {
            method: "POST",
            body: saveFormData,
          }
        );

      const saveData =
        await saveResponse
          .json()
          .catch(() => null);

      if (
        !saveResponse.ok
      ) {
        throw new Error(
          saveData?.error ||
            "AI analysis completed, but the report could not be saved."
        );
      }

      /*
       * =====================================================
       * SUCCESS
       * =====================================================
       */

      setStatus("complete");

    } catch (error) {
      console.error(
        "HOMEHEALTH 360 REPORT PROCESSING ERROR:",
        error
      );

      setStatus("selected");

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while processing the report."
      );
    } finally {
      setAnalysisLoading(false);
    }
  }

  function browseFiles() {
    fileInputRef.current?.click();
  }

  function replaceReport() {
    setReport(null);
    setAnalysis(null);
    setStatus("idle");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  }

  return (
    <div className="min-h-screen bg-[#f5f6f3] text-[#19382f]">

      {/* ================================================= */}
      {/* MOBILE MENU */}
      {/* ================================================= */}

      {mobileMenu && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          onClick={() =>
            setMobileMenu(false)
          }
        >
          <div className="absolute inset-0 bg-black/25" />

          <aside
            className="relative h-full w-[245px] bg-[#0d2b23] px-4 py-5 text-white"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-8 flex items-center gap-3 px-2">

              <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white text-[#4c917d]">
                ♡
              </div>

              <div>
                <div className="text-[15px] font-semibold">
                  HOMEHEALTH
                </div>

                <div className="text-[9px] font-medium text-white/65">
                  360
                </div>
              </div>

            </div>

            <MobileNavigation
              onClose={() =>
                setMobileMenu(false)
              }
            />
          </aside>
        </div>
      )}

      {/* ================================================= */}
      {/* DESKTOP SIDEBAR */}
      {/* ================================================= */}

      <aside className="fixed left-0 top-0 hidden h-screen w-[226px] bg-[#0d2b23] px-4 py-4 text-white lg:block">

        <div className="flex items-center gap-3 px-2">

          <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[8px] bg-white text-[#58937f]">
            <span className="text-[19px]">
              ♡
            </span>
          </div>

          <div>
            <div className="text-[14px] font-semibold tracking-[-0.02em]">
              HOMEHEALTH
            </div>

            <div className="text-[9px] font-semibold text-white/65">
              360
            </div>
          </div>

        </div>

        <nav className="mt-7 space-y-1">

          <SidebarItem
            href="/dashboard"
            icon="grid"
            label="Dashboard"
          />

          <SidebarItem
            href="/health-records"
            icon="upload"
            label="Upload report"
            active
          />

          <SidebarItem
            href="/health-timeline"
            icon="clock"
            label="Health timeline"
          />

          <SidebarItem
            href="/care-gaps"
            icon="shield"
            label="Care gaps"
          />

          <SidebarItem
            href="/reminders"
            icon="bell"
            label="Reminders"
          />

          <SidebarItem
            href="/ai-care-copilot"
            icon="sparkle"
            label="AI Care Copilot"
          />

          <SidebarItem
            href="/family-healthcare"
            icon="users"
            label="Family healthcare"
          />

        </nav>

        <div className="absolute bottom-10 left-4 right-4 rounded-[11px] border border-[#255447] bg-[#12372d] p-3">

          <div className="flex items-center gap-2 text-[11px] font-semibold">

            <Icon
              name="lock"
              size={13}
            />

            Privacy center

          </div>

          <p className="mt-2 text-[9px] leading-[15px] text-white/55">
            Your health data is encrypted and shared only with your permission.
          </p>

        </div>

      </aside>

      {/* ================================================= */}
      {/* MAIN */}
      {/* ================================================= */}

      <div className="lg:pl-[226px]">

        {/* TOP HEADER */}

        <header className="h-[45px] border-b border-[#e0e3df] bg-[#f8f9f7]">

          <div className="flex h-full items-center justify-between px-4 sm:px-6">

            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  setMobileMenu(true)
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#e0e4df] bg-white text-[#53645d] lg:hidden"
              >
                ☰
              </button>

              <div className="hidden h-[31px] w-[310px] items-center gap-2 rounded-[8px] border border-[#e0e3df] bg-[#f1f3f0] px-3 text-[#8a9590] sm:flex">

                <Icon
                  name="search"
                  size={14}
                />

                <span className="text-[10px]">
                  Search reports, medications, events...
                </span>

                <span className="ml-auto text-[9px] text-[#9ba39f]">
                  ⌘K
                </span>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="hidden items-center gap-1.5 rounded-full bg-[#e4f2eb] px-3 py-[6px] text-[9px] font-semibold text-[#31745e] sm:flex">

                <span className="h-[6px] w-[6px] rounded-full bg-[#168164]" />

                All data synced

              </div>

              <div className="text-[15px]">
                🔔
              </div>

              <div className="flex items-center gap-2">

                <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#dcebe4] text-[9px] font-bold text-[#315f50]">
                  AM
                </div>

                <div className="hidden sm:block">

                  <div className="text-[10px] font-semibold text-[#40534b]">
                    Alex Morgan
                  </div>

                  <div className="text-[8px] text-[#89938e]">
                    Premium plan
                  </div>

                </div>

              </div>

            </div>

          </div>

        </header>

        {/* ================================================= */}
        {/* PAGE CONTENT */}
        {/* ================================================= */}

        <main className="px-4 pb-10 pt-5 sm:px-6 lg:px-7">

          {/* TITLE */}

          <div className="flex items-start justify-between gap-4">

            <div>

              <div className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#16806b]">
                HEALTH RECORDS
              </div>

              <h1 className="mt-1 text-[28px] font-bold leading-[32px] tracking-[-0.04em] text-[#153d32] sm:text-[30px]">
                Upload a medical report
              </h1>

              <p className="mt-1 max-w-[720px] text-[12px] text-[#75837c]">
                Add a PDF, image, or health document. We&apos;ll organize it and create a plain-language summary for your review.
              </p>

            </div>

            <button
              type="button"
              className="hidden h-[36px] shrink-0 rounded-[9px] border border-[#dfe3df] bg-white px-4 text-[10px] font-semibold text-[#465850] shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:block"
            >
              View all reports
            </button>

          </div>

          {/* ================================================= */}
          {/* PROGRESS */}
          {/* ================================================= */}

          <div className="mt-4 flex h-[47px] items-center rounded-[14px] bg-white px-5 shadow-[0_3px_12px_rgba(29,55,45,0.045)]">

            <ProgressStep
              number="✓"
              label="Choose file"
              completed
            />

            <div className="mx-3 h-[1px] flex-1 bg-[#d8ded9]" />

            <ProgressStep
              number="✓"
              label="Secure processing"
              completed
            />

            <div className="mx-3 h-[1px] flex-1 bg-[#d8ded9]" />

            <ProgressStep
              number="3"
              label="Review summary"
              active={
                status ===
                  "complete" ||
                analysisLoading
              }
            />

            <div className="mx-3 h-[1px] flex-1 bg-[#d8ded9]" />

            <ProgressStep
              number="4"
              label="Save to record"
              active={
                status ===
                "complete"
              }
            />

          </div>

          {/* ================================================= */}
          {/* CONTENT GRID */}
          {/* ================================================= */}

          <div className="mt-5 grid gap-4 xl:grid-cols-[1.02fr_0.98fr]">

            {/* ================================================= */}
            {/* LEFT */}
            {/* ================================================= */}

            <div className="space-y-4">

              {/* UPLOAD CARD */}

              <div className="rounded-[17px] bg-white p-5 shadow-[0_3px_14px_rgba(29,55,45,0.045)]">

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={
                    handleFileChange
                  }
                />

                <div
                  onDragEnter={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={(event) => {
                    event.preventDefault();
                    setDragActive(false);
                  }}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (!report) {
                      browseFiles();
                    }
                  }}
                  className={[
                    "flex h-[210px] flex-col items-center justify-center rounded-[14px] border-2 border-dashed text-center transition",
                    dragActive
                      ? "border-[#5cb79e] bg-[#dff2eb]"
                      : "border-[#74c9b0] bg-[#e0f2ec]",
                    !report
                      ? "cursor-pointer"
                      : "",
                  ].join(" ")}
                >

                  {!report && (
                    <>
                      <Icon
                        name="cloud"
                        size={22}
                      />

                      <div className="mt-3 text-[14px] font-bold text-[#24453b]">
                        Drop another report here
                      </div>

                      <div className="mt-1 text-[9px] text-[#718a81]">
                        PDF, JPG, PNG, or WEBP · Up to 5 MB
                      </div>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          browseFiles();
                        }}
                        className="mt-4 rounded-[8px] bg-white px-4 py-2 text-[10px] font-semibold text-[#45655b] shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
                      >
                        📂 Browse files
                      </button>
                    </>
                  )}

                  {report && (
                    <>
                      <div className="flex h-[42px] w-[42px] items-center justify-center rounded-[9px] bg-white text-[#478f79] shadow-sm">
                        <Icon
                          name="file"
                          size={21}
                        />
                      </div>

                      <div className="mt-3 max-w-[80%] truncate text-[13px] font-semibold text-[#24453b]">
                        {report.name}
                      </div>

                      <div className="mt-1 text-[9px] text-[#7b9189]">
                        {formatSize(
                          report.size
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={
                          status ===
                          "processing"
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          uploadFile();
                        }}
                        className="mt-4 rounded-[8px] bg-white px-4 py-2 text-[10px] font-semibold text-[#27715d] shadow-sm disabled:opacity-50"
                      >
                        {status ===
                        "processing"
                          ? "Processing..."
                          : "Process report"}
                      </button>
                    </>
                  )}

                </div>

                {error && (
                  <div className="mt-3 rounded-[8px] bg-[#fff4f2] px-3 py-2 text-[9px] leading-[14px] text-[#9a5a51]">
                    {error}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-center gap-1 text-[9px] text-[#8b9791]">

                  <Icon
                    name="lock"
                    size={10}
                  />

                  Encrypted during upload and at rest. Your file is never used to train shared AI models.

                </div>

              </div>

              {/* ================================================= */}
              {/* PROCESSING CARD */}
              {/* ================================================= */}

              <div className="rounded-[17px] bg-white p-5 shadow-[0_3px_14px_rgba(29,55,45,0.045)]">

                <div className="flex items-start justify-between">

                  <div>

                    <h2 className="text-[16px] font-bold text-[#24453b]">
                      {status ===
                        "processing"
                        ? "Processing report"
                        : "Processing complete"}
                    </h2>

                    <p className="mt-1 text-[10px] text-[#82908a]">
                      {status ===
                      "processing"
                        ? "AI is securely reviewing your uploaded medical report."
                        : analysis
                          ? `AI extracted ${analysis.results.length} readable results from this report.`
                          : "Upload a report to extract and organize its medical information."}
                    </p>

                  </div>

                  <div className="flex items-center gap-1 rounded-full bg-[#e1f3ec] px-3 py-1 text-[9px] font-semibold text-[#26765f]">

                    <span className="h-[6px] w-[6px] rounded-full bg-[#168269]" />

                    {status ===
                    "processing"
                      ? "Analyzing"
                      : analysis
                        ? "Ready to review"
                        : "Waiting"}

                  </div>

                </div>

                <div className="mt-4 flex items-center rounded-[11px] border border-[#e0e5e1] px-3 py-2.5">

                  <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[8px] bg-[#f9dfdf] text-[9px] font-semibold text-[#a45d5d]">
                    {report?.name
                      .split(".")
                      .pop()
                      ?.toUpperCase() ||
                      "PDF"}
                  </div>

                  <div className="ml-3 min-w-0 flex-1">

                    <div className="truncate text-[11px] font-semibold text-[#41554c]">
                      {report?.name ||
                        "No report selected"}
                    </div>

                    <div className="mt-0.5 text-[9px] text-[#8c9792]">
                      {report
                        ? `${formatSize(
                            report.size
                          )} · Uploaded just now`
                        : "Select a medical report to begin"}
                    </div>

                  </div>

                  {report && (
                    <button
                      type="button"
                      onClick={
                        replaceReport
                      }
                      className="flex items-center gap-1 text-[10px] font-medium text-[#40564d] hover:text-[#18735b]"
                    >
                      <Icon
                        name="replace"
                        size={12}
                      />

                      Replace
                    </button>
                  )}

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* RIGHT AI SUMMARY */}
            {/* ================================================= */}

            <div className="rounded-[17px] bg-white p-5 shadow-[0_3px_14px_rgba(29,55,45,0.045)]">

              <div className="flex items-start justify-between">

                <div>

                  <h2 className="text-[16px] font-bold text-[#24453b]">
                    AI-generated summary
                  </h2>

                  <p className="mt-1 text-[10px] text-[#82908a]">
                    Review for accuracy before saving.
                  </p>

                </div>

                <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#eee8fa] text-[#765d9d]">
                  <Icon
                    name="sparkle"
                    size={17}
                  />
                </div>

              </div>

              {/* SUMMARY */}

              <div className="mt-4 rounded-[11px] bg-[#dcefe9] px-4 py-3">

                <div className="text-[10px] font-bold text-[#28483e]">
                  What this report says
                </div>

                <p className="mt-2 text-[10px] leading-[16px] text-[#45645b]">

                  {analysisLoading
                    ? "AI is reviewing your uploaded medical report..."
                    : analysis?.summary ||
                      "Upload a medical report to generate a plain-language summary."}

                </p>

              </div>

              {/* PATIENT / REPORT INFO */}

              {analysis && (
                <div className="mt-3 grid grid-cols-2 gap-2">

                  <div className="rounded-[9px] bg-[#f5f7f5] px-3 py-2">

                    <div className="text-[8px] uppercase tracking-wide text-[#9aa59f]">
                      Patient
                    </div>

                    <div className="mt-1 truncate text-[10px] font-semibold text-[#40554c]">
                      {analysis.patient.name !==
                      "Not provided"
                        ? analysis.patient.name
                        : "Not provided"}
                    </div>

                  </div>

                  <div className="rounded-[9px] bg-[#f5f7f5] px-3 py-2">

                    <div className="text-[8px] uppercase tracking-wide text-[#9aa59f]">
                      Report date
                    </div>

                    <div className="mt-1 text-[10px] font-semibold text-[#40554c]">
                      {analysis.report.date ||
                        "Not provided"}
                    </div>

                  </div>

                </div>
              )}

              {/* RESULTS */}

              <div className="mt-3">

                {analysisLoading && (
                  <div className="rounded-[10px] bg-[#f5f8f5] px-4 py-7 text-center">

                    <div className="mx-auto h-5 w-5 animate-spin rounded-full border-2 border-[#d6e4de] border-t-[#19765f]" />

                    <p className="mt-3 text-[10px] text-[#7f8d86]">
                      Reading your report...
                    </p>

                  </div>
                )}

                {!analysisLoading &&
                  analysis?.results?.length ? (
                    analysis.results.map(
                      (
                        result,
                        index
                      ) => (
                        <LabRow
                          key={`${result.parameter}-${index}`}
                          name={
                            result.parameter
                          }
                          value={
                            result.value
                          }
                          unit={
                            result.unit
                          }
                          status={
                            result.status
                          }
                          referenceRange={
                            result.referenceRange
                          }
                          explanation={
                            result.explanation
                          }
                          last={
                            index ===
                            analysis.results
                              .length -
                              1
                          }
                        />
                      )
                    )
                  ) : null}

                {!analysisLoading &&
                  !analysis && (
                    <div className="rounded-[10px] bg-[#f7f9f7] px-4 py-7 text-center">

                      <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-[#e7f1ed] text-[#397b67]">
                        <Icon
                          name="file"
                          size={17}
                        />
                      </div>

                      <p className="mt-3 text-[10px] font-semibold text-[#61736b]">
                        No report analyzed yet
                      </p>

                      <p className="mt-1 text-[9px] text-[#99a49f]">
                        Upload a report and select Process report.
                      </p>

                    </div>
                  )}

              </div>

              {/* DOCTOR REVIEW */}

              {analysis && (
                <div className="mt-3 rounded-[11px] bg-[#fff0d0] px-3 py-2.5 text-[10px] leading-[14px] text-[#685b3c]">

                  {analysis.doctorReview ||
                    "Please review this report with a qualified healthcare professional."}

                </div>
              )}

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}

/* ===================================================== */
/* SIDEBAR ITEM */
/* ===================================================== */

function SidebarItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon:
    | "grid"
    | "upload"
    | "clock"
    | "shield"
    | "bell"
    | "sparkle"
    | "users";
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex h-[38px] items-center gap-2.5 rounded-[9px] px-3 text-[11px] font-medium transition",
        active
          ? "bg-[#16483b] text-white shadow-[inset_0_0_0_1px_rgba(105,180,153,0.12)]"
          : "text-white/70 hover:bg-white/[0.04] hover:text-white",
      ].join(" ")}
    >

      <Icon
        name={icon}
        size={14}
      />

      <span>
        {label}
      </span>

      {active && (
        <span className="ml-auto h-[6px] w-[6px] rounded-full bg-[#5ac19d]" />
      )}

    </Link>
  );
}

/* ===================================================== */
/* MOBILE NAVIGATION */
/* ===================================================== */

function MobileNavigation({
  onClose,
}: {
  onClose: () => void;
}) {
  return (
    <nav className="space-y-1">

      <SidebarItem
        href="/dashboard"
        icon="grid"
        label="Dashboard"
      />

      <SidebarItem
        href="/health-records"
        icon="upload"
        label="Upload report"
        active
      />

      <SidebarItem
        href="/health-timeline"
        icon="clock"
        label="Health timeline"
      />

      <SidebarItem
        href="/care-gaps"
        icon="shield"
        label="Care gaps"
      />

      <SidebarItem
        href="/reminders"
        icon="bell"
        label="Reminders"
      />

      <SidebarItem
        href="/ai-care-copilot"
        icon="sparkle"
        label="AI Care Copilot"
      />

      <SidebarItem
        href="/family-healthcare"
        icon="users"
        label="Family healthcare"
      />

      <button
        type="button"
        onClick={onClose}
        className="mt-5 w-full rounded-lg bg-white/10 py-2 text-[10px] text-white/70"
      >
        Close
      </button>

    </nav>
  );
}

/* ===================================================== */
/* PROGRESS STEP */
/* ===================================================== */

function ProgressStep({
  number,
  label,
  active = false,
  completed = false,
}: {
  number: string;
  label: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">

      <div
        className={[
          "flex h-[21px] w-[21px] items-center justify-center rounded-full text-[8px] font-bold",
          completed || active
            ? "bg-[#19765f] text-white"
            : "border border-[#c9d1cc] bg-white text-[#7f8c85]",
        ].join(" ")}
      >
        {number}
      </div>

      <span
        className={[
          "hidden text-[10px] font-semibold sm:block",
          active || completed
            ? "text-[#2d4b41]"
            : "text-[#718078]",
        ].join(" ")}
      >
        {label}
      </span>

    </div>
  );
}

/* ===================================================== */
/* DYNAMIC LAB ROW */
/* ===================================================== */

function LabRow({
  name,
  value,
  unit,
  status,
  referenceRange,
  explanation,
  last = false,
}: {
  name: string;
  value: string;
  unit: string;
  status:
    | "NORMAL"
    | "HIGH"
    | "LOW"
    | "UNKNOWN";
  referenceRange: string;
  explanation: string;
  last?: boolean;
}) {
  const statusConfig = {
    NORMAL: {
      label: "In range",
      className:
        "bg-[#e0f1eb] text-[#34745f]",
      dot: "bg-[#1a876c]",
    },

    HIGH: {
      label: "High",
      className:
        "bg-[#fff0d0] text-[#8b6b27]",
      dot: "bg-[#c28b27]",
    },

    LOW: {
      label: "Low",
      className:
        "bg-[#fff0d0] text-[#8b6b27]",
      dot: "bg-[#c28b27]",
    },

    UNKNOWN: {
      label: "Review",
      className:
        "bg-[#eeeeeb] text-[#737c77]",
      dot: "bg-[#89928d]",
    },
  };

  const current =
    statusConfig[status] ||
    statusConfig.UNKNOWN;

  return (
    <div
      className={[
        "py-[12px]",
        !last
          ? "border-b border-[#e1e5e2]"
          : "",
      ].join(" ")}
    >

      <div className="flex items-center">

        <div className="flex-1 text-[10px] font-medium text-[#41554c]">
          {name}
        </div>

        <div className="mr-3 text-right">

          <span className="text-[10px] font-bold text-[#33483f]">
            {value}
          </span>

          {unit &&
            unit !== "Not provided" && (
              <span className="ml-1 text-[9px] font-semibold text-[#50635a]">
                {unit}
              </span>
            )}

        </div>

        <div
          className={[
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-[8px] font-semibold",
            current.className,
          ].join(" ")}
        >

          <span
            className={[
              "h-[6px] w-[6px] rounded-full",
              current.dot,
            ].join(" ")}
          />

          {current.label}

        </div>

      </div>

      {explanation &&
        explanation !== "Not provided" && (
          <div className="mt-2 pr-2 text-[9px] leading-[14px] text-[#84918b]">
            {explanation}
          </div>
        )}

      {referenceRange &&
        referenceRange !== "Not provided" && (
          <div className="mt-1 text-[8px] text-[#a0aaa5]">
            Reference range: {referenceRange}
          </div>
        )}

    </div>
  );
}