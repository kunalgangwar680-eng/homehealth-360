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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load records from database
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

  // File selection
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError("");
    setMessage("");

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

  // Save record to database
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

    if (!ALLOWED_TYPES.includes(selectedFile.type)) {
      setError("Only PDF, JPG, PNG and WEBP files are allowed.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be 5 MB or less.");
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

  // Delete record from database
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

  // View uploaded report
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

  return (
    <main className="min-h-screen bg-[#05080c] text-white px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold tracking-[0.25em] text-cyan-400">
            HEALTHCARE 360
          </p>

          <h1 className="text-3xl font-bold md:text-4xl">
            Health Records
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-400 md:text-base">
            Securely store and access your medical reports in one place.
          </p>
        </div>

        {/* Messages */}
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

        {/* Add Record */}
        <section className="mb-8 rounded-2xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl md:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Add Health Record</h2>

            <p className="mt-1 text-sm text-gray-400">
              Upload your medical report securely.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Report Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Report Name
              </label>

              <input
                type="text"
                value={recordName}
                onChange={(e) => setRecordName(e.target.value)}
                placeholder="e.g. Complete Blood Count"
                className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-cyan-400"
              />
            </div>

            {/* Record Type */}
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

            {/* Date */}
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

            {/* File */}
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

          {/* Save Button */}
          <button
            onClick={saveRecord}
            disabled={saving}
            className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Health Record"}
          </button>
        </section>

        {/* Records */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Your Health Records</h2>

              <p className="mt-1 text-sm text-gray-400">
                {records.length} record{records.length !== 1 ? "s" : ""} saved
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
                          <span>{formatFileSize(record.fileSize)}</span>
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
                        {deletingId === record.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Notice */}
        <div className="mt-8 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5">
          <p className="text-sm leading-6 text-gray-400">
            <span className="font-semibold text-cyan-300">
              Health Records:
            </span>{" "}
            Your uploaded reports are now stored through the Healthcare 360
            backend and associated with your authenticated account.
          </p>
        </div>
      </div>
    </main>
  );
}