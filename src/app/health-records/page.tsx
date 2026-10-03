"use client";

import { ChangeEvent, useEffect, useState } from "react";

type HealthRecord = {
  id: string;
  name: string;
  type: string;
  date: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  dataUrl: string;
};

type AnalysisResult = {
  patient?: {
    name?: string;
    age?: string;
    gender?: string;
  };
  report?: {
    name?: string;
    date?: string;
  };
  results?: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: string;
    explanation: string;
  }[];
  summary?: string;
  doctorReview?: string;
  rawAnalysis?: string;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export default function HealthRecordsPage() {
  const [records, setRecords] = useState<HealthRecord[]>([]);

  const [recordName, setRecordName] = useState("");
  const [recordType, setRecordType] = useState("Blood Report");
  const [recordDate, setRecordDate] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisFileName, setAnalysisFileName] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/health-records", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load health records.");
      }

      setRecords(data.records || []);
    } catch (err) {
      console.error("LOAD HEALTH RECORDS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setMessage("");
    setAnalysis(null);
    setAnalysisFileName("");

    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only PDF, JPG, PNG and WEBP files are allowed.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("File size must be 5 MB or less.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const saveRecord = async () => {
    setError("");
    setMessage("");

    if (!recordName.trim()) {
      setError("Please enter report name.");
      return;
    }

    if (!recordType.trim()) {
      setError("Please select record type.");
      return;
    }

    if (!recordDate) {
      setError("Please select report date.");
      return;
    }

    if (!selectedFile) {
      setError("Please upload a report file.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();

      formData.append("reportName", recordName.trim());
      formData.append("recordType", recordType.trim());
      formData.append("reportDate", recordDate);
      formData.append("file", selectedFile);

      const response = await fetch("/api/health-records", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save health record.");
      }

      setMessage("Health record saved successfully.");

      setRecordName("");
      setRecordType("Blood Report");
      setRecordDate("");
      setSelectedFile(null);

      const fileInput = document.getElementById(
        "health-record-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await loadRecords();
    } catch (err) {
      console.error("SAVE HEALTH RECORD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the record."
      );
    } finally {
      setSaving(false);
    }
  };

  const analyzeReport = async () => {
    setError("");
    setMessage("");
    setAnalysis(null);

    if (!selectedFile) {
      setError("Please select a medical report first.");
      return;
    }

    try {
      setAnalyzing(true);

      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/report-analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Unable to analyze the medical report."
        );
      }

      setAnalysis(data.analysis || null);
      setAnalysisFileName(selectedFile.name);

      setMessage("Medical report analyzed successfully.");
    } catch (err) {
      console.error("REPORT ANALYSIS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while analyzing the report."
      );
    } finally {
      setAnalyzing(false);
    }
  };

  const deleteRecord = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this health record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await fetch("/api/health-records", {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete health record.");
      }

      setRecords((currentRecords) =>
        currentRecords.filter((record) => record.id !== id)
      );

      setMessage("Health record deleted successfully.");
    } catch (err) {
      console.error("DELETE HEALTH RECORD ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the record."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const viewRecord = (record: HealthRecord) => {
    const newWindow = window.open("", "_blank");

    if (!newWindow) {
      setError("Please allow pop-ups to view the report.");
      return;
    }

    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${record.name}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              background: #0a0f14;
              color: white;
              font-family: Arial, sans-serif;
              text-align: center;
            }

            h2 {
              margin-bottom: 20px;
            }

            iframe {
              width: 100%;
              height: 85vh;
              border: none;
              border-radius: 12px;
              background: white;
            }

            img {
              max-width: 95%;
              max-height: 85vh;
              object-fit: contain;
              border-radius: 12px;
            }
          </style>
        </head>

        <body>
          <h2>${record.name}</h2>

          ${
            record.fileType === "application/pdf"
              ? `<iframe src="${record.dataUrl}"></iframe>`
              : `<img src="${record.dataUrl}" alt="${record.name}" />`
          }
        </body>
      </html>
    `);

    newWindow.document.close();
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";

    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getStatusClass = (status: string) => {
    const normalized = status.toUpperCase();

    if (normalized === "NORMAL") {
      return "border-green-400/30 bg-green-400/10 text-green-300";
    }

    if (normalized === "HIGH") {
      return "border-red-400/30 bg-red-400/10 text-red-300";
    }

    if (normalized === "LOW") {
      return "border-orange-400/30 bg-orange-400/10 text-orange-300";
    }

    return "border-gray-400/30 bg-gray-400/10 text-gray-300";
  };

  return (
    <main className="min-h-screen bg-[#05080c] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-[0.25em] text-cyan-400">
            HEALTHCARE 360
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Health Records
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-400 md:text-base">
            Securely store, access and understand your medical reports with
            AI-powered analysis.
          </p>
        </div>

        {/* MESSAGES */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {message}
          </div>
        )}

        {/* UPLOAD SECTION */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl md:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Add Health Record
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Upload your medical report and optionally analyze it with AI.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* REPORT NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Report Name
              </label>

              <input
                type="text"
                value={recordName}
                onChange={(e) => setRecordName(e.target.value)}
                placeholder="e.g. Complete Blood Count"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-cyan-400"
              />
            </div>

            {/* TYPE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Record Type
              </label>

              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              >
                <option value="Blood Report">Blood Report</option>
                <option value="Prescription">Prescription</option>
                <option value="X-Ray">X-Ray</option>
                <option value="MRI">MRI</option>
                <option value="CT Scan">CT Scan</option>
                <option value="Ultrasound">Ultrasound</option>
                <option value="Health Checkup">Health Checkup</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Report Date
              </label>

              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* FILE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Upload Report
              </label>

              <input
                id="health-record-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-xl border border-white/10 bg-black/30 text-sm text-gray-400 file:mr-4 file:border-0 file:bg-cyan-500 file:px-4 file:py-3 file:font-medium file:text-black hover:file:bg-cyan-400"
              />

              <p className="mt-2 text-xs text-gray-500">
                PDF, JPG, PNG or WEBP • Maximum 5 MB
              </p>

              {selectedFile && (
                <p className="mt-2 text-xs text-cyan-300">
                  Selected: {selectedFile.name} (
                  {formatFileSize(selectedFile.size)})
                </p>
              )}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={saveRecord}
              disabled={saving || analyzing}
              className="rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Health Record"}
            </button>

            <button
              onClick={analyzeReport}
              disabled={analyzing || saving || !selectedFile}
              className="rounded-xl border border-purple-400/40 bg-purple-500/10 px-6 py-3 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {analyzing
                ? "🤖 Analyzing Report..."
                : "🤖 Analyze with AI"}
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-purple-400/10 bg-purple-400/[0.04] p-4">
            <p className="text-xs leading-5 text-gray-400">
              <span className="font-semibold text-purple-300">
                AI Medical Report Analyzer:
              </span>{" "}
              The AI extracts information visible in the uploaded report,
              compares values with the report&apos;s reference ranges when
              available, and explains the findings in simple language. It does
              not replace a qualified doctor.
            </p>
          </div>
        </section>

        {/* AI ANALYSIS */}
        {analysis && (
          <section className="mb-8 rounded-2xl border border-purple-400/20 bg-purple-400/[0.03] p-5 shadow-2xl md:p-7">

            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-purple-300">
                  AI MEDICAL REPORT ANALYZER
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Analysis Result
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Analyzed file: {analysisFileName}
                </p>
              </div>

              <div className="rounded-full border border-purple-400/20 bg-purple-400/10 px-4 py-2 text-xs text-purple-300">
                AI Analysis
              </div>
            </div>

            {/* PATIENT */}
            {analysis.patient && (
              <div className="mb-5 rounded-xl border border-white/10 bg-black/20 p-5">
                <h3 className="mb-4 font-semibold text-white">
                  Patient Information
                </h3>

                <div className="grid gap-4 text-sm md:grid-cols-3">
                  <div>
                    <p className="text-gray-500">Name</p>
                    <p className="mt-1 text-gray-200">
                      {analysis.patient.name || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Age</p>
                    <p className="mt-1 text-gray-200">
                      {analysis.patient.age || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="mt-1 text-gray-200">
                      {analysis.patient.gender || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* REPORT */}
            {analysis.report && (
              <div className="mb-5 rounded-xl border border-white/10 bg-black/20 p-5">
                <h3 className="mb-4 font-semibold text-white">
                  Report Information
                </h3>

                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div>
                    <p className="text-gray-500">Report Name</p>
                    <p className="mt-1 text-gray-200">
                      {analysis.report.name || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-500">Report Date</p>
                    <p className="mt-1 text-gray-200">
                      {analysis.report.date || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* RESULTS */}
            {analysis.results && analysis.results.length > 0 && (
              <div className="mb-5">
                <h3 className="mb-4 font-semibold text-white">
                  Medical Parameters
                </h3>

                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full min-w-[800px] text-left text-sm">
                    <thead className="border-b border-white/10 bg-white/[0.04]">
                      <tr>
                        <th className="px-4 py-4">Parameter</th>
                        <th className="px-4 py-4">Value</th>
                        <th className="px-4 py-4">Unit</th>
                        <th className="px-4 py-4">Reference Range</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4">Explanation</th>
                      </tr>
                    </thead>

                    <tbody>
                      {analysis.results.map((item, index) => (
                        <tr
                          key={`${item.parameter}-${index}`}
                          className="border-b border-white/5 last:border-0"
                        >
                          <td className="px-4 py-4 font-medium text-white">
                            {item.parameter}
                          </td>

                          <td className="px-4 py-4 text-gray-200">
                            {item.value}
                          </td>

                          <td className="px-4 py-4 text-gray-400">
                            {item.unit}
                          </td>

                          <td className="px-4 py-4 text-gray-400">
                            {item.referenceRange}
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </td>

                          <td className="max-w-xs px-4 py-4 text-gray-400">
                            {item.explanation}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUMMARY */}
            {analysis.summary && (
              <div className="mb-5 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-5">
                <h3 className="mb-3 font-semibold text-cyan-300">
                  🧠 Simple Explanation
                </h3>

                <p className="text-sm leading-7 text-gray-300">
                  {analysis.summary}
                </p>
              </div>
            )}

            {/* DOCTOR REVIEW */}
            {analysis.doctorReview && (
              <div className="rounded-xl border border-orange-400/20 bg-orange-400/[0.04] p-5">
                <h3 className="mb-3 font-semibold text-orange-300">
                  👨‍⚕️ Doctor Review
                </h3>

                <p className="text-sm leading-7 text-gray-300">
                  {analysis.doctorReview}
                </p>
              </div>
            )}

            {/* RAW FALLBACK */}
            {analysis.rawAnalysis && (
              <div className="rounded-xl border border-white/10 bg-black/20 p-5">
                <h3 className="mb-3 font-semibold">
                  AI Analysis
                </h3>

                <pre className="whitespace-pre-wrap text-sm leading-6 text-gray-300">
                  {analysis.rawAnalysis}
                </pre>
              </div>
            )}

            {/* SAFETY NOTICE */}
            <div className="mt-5 rounded-xl border border-red-400/10 bg-red-400/[0.03] p-4">
              <p className="text-xs leading-5 text-gray-500">
                <span className="font-semibold text-red-300">
                  Important:
                </span>{" "}
                This AI analysis is informational and is not a medical
                diagnosis. Medical decisions should be made by a qualified
                healthcare professional.
              </p>
            </div>
          </section>
        )}

        {/* SAVED RECORDS */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Your Health Records
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {records.length} record
                {records.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-gray-400">
              Loading health records...
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <div className="mb-3 text-4xl">📄</div>

              <h3 className="text-lg font-semibold">
                No health records yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Upload your first medical report above.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                        {record.fileType === "application/pdf"
                          ? "📕"
                          : "🖼️"}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-white">
                          {record.name}
                        </h3>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>{record.type}</span>
                          <span>{record.date}</span>
                          <span>{record.fileName}</span>
                          <span>
                            {formatFileSize(record.fileSize)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-3">
                      <button
                        onClick={() => viewRecord(record)}
                        className="rounded-lg border border-cyan-400/30 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/10"
                      >
                        View
                      </button>

                      <button
                        onClick={() => deleteRecord(record.id)}
                        disabled={deletingId === record.id}
                        className="rounded-lg border border-red-400/30 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
                      >
                        {deletingId === record.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* NOTICE */}
        <div className="mt-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">
          <p className="text-sm leading-6 text-gray-400">
            <span className="font-semibold text-cyan-300">
              Health Records:
            </span>{" "}
            Your uploaded reports are stored through the Healthcare 360
            backend and associated with your authenticated account.
          </p>
        </div>

      </div>
    </main>
  );
}