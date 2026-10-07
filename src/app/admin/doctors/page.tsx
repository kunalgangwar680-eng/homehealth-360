"use client";

import { useEffect, useState } from "react";

type DoctorStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

type DoctorApplication = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  mobile: string;
  medicalRegistrationNumber: string;
  specialization: string;
  qualification: string;
  experience: string;
  dob: string;
  clinicHospital: string;
  clinicAddress?: string | null;

  identityDocumentName: string;
  identityDocumentType: string;

  medicalCertificateName: string;
  medicalCertificateType: string;

  otherDocuments?: string | null;

  status: DoctorStatus;

  adminNotes?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;

  createdAt: string;
  updatedAt: string;
};

const STATUS_LABELS: Record<DoctorStatus, string> = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  SUSPENDED: "Suspended",
};

export default function AdminDoctorsPage() {
  const [applications, setApplications] = useState<
    DoctorApplication[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState<DoctorApplication | null>(null);

  const [actionLoading, setActionLoading] =
    useState(false);

  const [adminNotes, setAdminNotes] = useState("");

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/doctors",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to load doctor applications."
        );
      }

      setApplications(
        Array.isArray(data?.applications)
          ? data.applications
          : []
      );
    } catch (err: any) {
      console.error(
        "ADMIN DOCTORS LOAD ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to load doctor applications."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function updateStatus(
    applicationId: string,
    status: DoctorStatus
  ) {
    try {
      if (
        status === "REJECTED" &&
        !window.confirm(
          "Are you sure you want to reject this doctor application?"
        )
      ) {
        return;
      }

      if (
        status === "SUSPENDED" &&
        !window.confirm(
          "Are you sure you want to suspend this doctor?"
        )
      ) {
        return;
      }

      setActionLoading(true);

      const response = await fetch(
        "/api/admin/doctors",
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicationId,
            status,
            adminNotes:
              adminNotes.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to update doctor status."
        );
      }

      setSelectedDoctor(null);
      setAdminNotes("");

      await loadApplications();
    } catch (err: any) {
      console.error(
        "ADMIN DOCTOR STATUS ERROR:",
        err
      );

      window.alert(
        err?.message ||
          "Unable to update doctor status."
      );
    } finally {
      setActionLoading(false);
    }
  }

  const pendingCount = applications.filter(
    (item) => item.status === "PENDING"
  ).length;

  const reviewCount = applications.filter(
    (item) => item.status === "UNDER_REVIEW"
  ).length;

  const approvedCount = applications.filter(
    (item) => item.status === "APPROVED"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "REJECTED"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white md:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-cyan-400">
              HOMEHEALTH 360 ADMIN
            </p>

            <h1 className="text-3xl font-bold md:text-4xl">
              Doctor Verification
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Review professional applications,
              verify documents and manage doctor
              access.
            </p>
          </div>

          <button
            onClick={loadApplications}
            disabled={loading}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 font-medium transition hover:border-cyan-500 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Pending"
            value={pendingCount}
            description="Awaiting verification"
          />

          <StatCard
            title="Under Review"
            value={reviewCount}
            description="Currently being reviewed"
          />

          <StatCard
            title="Approved"
            value={approvedCount}
            description="Verified doctors"
          />

          <StatCard
            title="Rejected"
            value={rejectedCount}
            description="Rejected applications"
          />
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-semibold">
              Doctor Applications
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              All doctor registration requests
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-slate-400">
              Loading doctor applications...
            </div>
          ) : applications.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-3 text-4xl">
                🩺
              </div>

              <h3 className="text-lg font-semibold">
                No doctor applications yet
              </h3>

              <p className="mt-1 text-sm text-slate-400">
                New doctor registrations will appear
                here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {applications.map((doctor) => (
                <div
                  key={doctor.id}
                  className="px-6 py-6"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          {doctor.fullName}
                        </h3>

                        <StatusBadge
                          status={doctor.status}
                        />
                      </div>

                      <div className="mt-3 grid gap-2 text-sm text-slate-400 md:grid-cols-2">
                        <p>
                          <span className="text-slate-500">
                            Specialization:
                          </span>{" "}
                          {doctor.specialization}
                        </p>

                        <p>
                          <span className="text-slate-500">
                            Qualification:
                          </span>{" "}
                          {doctor.qualification}
                        </p>

                        <p>
                          <span className="text-slate-500">
                            Registration:
                          </span>{" "}
                          {doctor.medicalRegistrationNumber}
                        </p>

                        <p>
                          <span className="text-slate-500">
                            Experience:
                          </span>{" "}
                          {doctor.experience}
                        </p>

                        <p>
                          <span className="text-slate-500">
                            Email:
                          </span>{" "}
                          {doctor.email}
                        </p>

                        <p>
                          <span className="text-slate-500">
                            Mobile:
                          </span>{" "}
                          {doctor.mobile}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => {
                          setSelectedDoctor(
                            doctor
                          );
                          setAdminNotes(
                            doctor.adminNotes ||
                              ""
                          );
                        }}
                        className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm font-medium transition hover:border-cyan-500"
                      >
                        View Details
                      </button>

                      {doctor.status !==
                        "APPROVED" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              doctor.id,
                              "APPROVED"
                            )
                          }
                          disabled={actionLoading}
                          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                        >
                          Approve
                        </button>
                      )}

                      {doctor.status === "PENDING" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              doctor.id,
                              "UNDER_REVIEW"
                            )
                          }
                          disabled={actionLoading}
                          className="rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 disabled:opacity-50"
                        >
                          Review
                        </button>
                      )}

                      {doctor.status !==
                        "REJECTED" && (
                        <button
                          onClick={() =>
                            updateStatus(
                              doctor.id,
                              "REJECTED"
                            )
                          }
                          disabled={actionLoading}
                          className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold">
                  Doctor Details
                </h2>

                <p className="text-sm text-slate-400">
                  Verification application
                </p>
              </div>

              <button
                onClick={() =>
                  setSelectedDoctor(null)
                }
                className="rounded-lg px-3 py-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-8 p-6">
              <DetailSection title="Personal Information">
                <DetailItem
                  label="Full Name"
                  value={selectedDoctor.fullName}
                />
                <DetailItem
                  label="Email"
                  value={selectedDoctor.email}
                />
                <DetailItem
                  label="Mobile"
                  value={selectedDoctor.mobile}
                />
                <DetailItem
                  label="Date of Birth"
                  value={selectedDoctor.dob}
                />
              </DetailSection>

              <DetailSection title="Professional Information">
                <DetailItem
                  label="Medical Registration"
                  value={
                    selectedDoctor.medicalRegistrationNumber
                  }
                />
                <DetailItem
                  label="Specialization"
                  value={selectedDoctor.specialization}
                />
                <DetailItem
                  label="Qualification"
                  value={selectedDoctor.qualification}
                />
                <DetailItem
                  label="Experience"
                  value={selectedDoctor.experience}
                />
              </DetailSection>

              <DetailSection title="Clinic / Hospital">
                <DetailItem
                  label="Name"
                  value={selectedDoctor.clinicHospital}
                />
                <DetailItem
                  label="Address"
                  value={
                    selectedDoctor.clinicAddress ||
                    "Not provided"
                  }
                />
              </DetailSection>

              <DetailSection title="Documents">
                <DocumentCard
                  label="Identity Document"
                  fileName={
                    selectedDoctor.identityDocumentName
                  }
                  fileType={
                    selectedDoctor.identityDocumentType
                  }
                />

                <DocumentCard
                  label="Medical Registration Certificate"
                  fileName={
                    selectedDoctor.medicalCertificateName
                  }
                  fileType={
                    selectedDoctor.medicalCertificateType
                  }
                />

                {selectedDoctor.otherDocuments && (
                  <DocumentCard
                    label="Other Documents"
                    fileName={
                      selectedDoctor.otherDocuments
                    }
                    fileType="Uploaded"
                  />
                )}
              </DetailSection>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Admin Notes
                </label>

                <textarea
                  value={adminNotes}
                  onChange={(event) =>
                    setAdminNotes(
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Add verification notes..."
                  className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex flex-wrap gap-3 border-t border-slate-800 pt-6">
                <button
                  onClick={() =>
                    updateStatus(
                      selectedDoctor.id,
                      "APPROVED"
                    )
                  }
                  disabled={actionLoading}
                  className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50"
                >
                  {actionLoading
                    ? "Processing..."
                    : "Approve Doctor"}
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      selectedDoctor.id,
                      "UNDER_REVIEW"
                    )
                  }
                  disabled={actionLoading}
                  className="rounded-xl bg-amber-400 px-5 py-3 font-semibold text-slate-950 hover:bg-amber-300 disabled:opacity-50"
                >
                  Under Review
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      selectedDoctor.id,
                      "REJECTED"
                    )
                  }
                  disabled={actionLoading}
                  className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-3 font-semibold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      selectedDoctor.id,
                      "SUSPENDED"
                    )
                  }
                  disabled={actionLoading}
                  className="rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-3 font-semibold text-orange-300 hover:bg-orange-500/20 disabled:opacity-50"
                >
                  Suspend
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <p className="text-sm text-slate-400">
        {title}
      </p>

      <p className="mt-2 text-3xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: DoctorStatus;
}) {
  const styles: Record<DoctorStatus, string> = {
    PENDING:
      "bg-yellow-500/10 text-yellow-300 border-yellow-500/20",
    UNDER_REVIEW:
      "bg-amber-500/10 text-amber-300 border-amber-500/20",
    APPROVED:
      "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    REJECTED:
      "bg-red-500/10 text-red-300 border-red-500/20",
    SUSPENDED:
      "bg-orange-500/10 text-orange-300 border-orange-500/20",
  };

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-4 text-lg font-semibold">
        {title}
      </h3>

      <div className="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-5 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm text-slate-200">
        {value}
      </p>
    </div>
  );
}

function DocumentCard({
  label,
  fileName,
  fileType,
}: {
  label: string;
  fileName: string;
  fileType: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 md:col-span-2">
      <p className="text-sm font-medium">
        {label}
      </p>

      <div className="mt-2 flex flex-col gap-1 text-sm text-slate-400">
        <span>
          File: {fileName}
        </span>

        <span>
          Type: {fileType}
        </span>
      </div>
    </div>
  );
}