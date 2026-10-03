"use client";

import { useEffect, useState } from "react";

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  patient?: {
    name: string;
    email: string;
    phone?: string | null;
  };
};

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/appointments",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data?.error ||
            "Unable to load appointments."
        );
        return;
      }

      setAppointments(
        Array.isArray(data)
          ? data
          : data.appointments || []
      );
    } catch {
      setMessage(
        "Unable to connect to server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(
    appointmentId: string,
    status: string
  ) {
    try {
      setMessage("");

      const response = await fetch(
        "/api/appointments",
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            appointmentId,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data?.error ||
            "Unable to update appointment."
        );
        return;
      }

      await loadAppointments();

      setMessage(
        `Appointment ${status.toLowerCase()}.`
      );
    } catch {
      setMessage(
        "Unable to update appointment."
      );
    }
  }

  const pendingCount =
    appointments.filter(
      (item) =>
        item.status === "PENDING"
    ).length;

  const confirmedCount =
    appointments.filter(
      (item) =>
        item.status === "CONFIRMED"
    ).length;

  const completedCount =
    appointments.filter(
      (item) =>
        item.status === "COMPLETED"
    ).length;

  const cancelledCount =
    appointments.filter(
      (item) =>
        item.status === "CANCELLED"
    ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-cyan-400">
              HOMEHEALTH 360
            </p>

            <h1 className="text-3xl font-bold">
              Doctor Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Manage your appointments and patients.
            </p>
          </div>

          <button
            onClick={loadAppointments}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold transition hover:border-cyan-500 hover:bg-slate-800"
          >
            ↻ Refresh
          </button>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 rounded-xl border border-cyan-800 bg-cyan-950/40 px-4 py-3 text-sm text-cyan-300">
            {message}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-cyan-400">
              {confirmedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-400">
              {completedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Cancelled
            </p>

            <p className="mt-2 text-3xl font-bold text-red-400">
              {cancelledCount}
            </p>
          </div>

        </div>

        {/* Appointments */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-5">
            <h2 className="text-xl font-semibold">
              My Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              View and manage patient appointments.
            </p>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-slate-400">
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="text-4xl">
                📅
              </div>

              <p className="mt-4 text-lg font-medium">
                No appointments yet
              </p>

              <p className="mt-2 text-sm text-slate-400">
                Patient appointments will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {appointments.map(
                (appointment) => (
                  <div
                    key={appointment.id}
                    className="p-5 transition hover:bg-slate-800/40"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                      {/* Patient */}
                      <div className="flex items-start gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xl">
                          👤
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {appointment.patient?.name ||
                              "Patient"}
                          </h3>

                          <p className="mt-1 text-sm text-slate-400">
                            {appointment.patient?.email ||
                              "Email not available"}
                          </p>

                          {appointment.patient?.phone && (
                            <p className="mt-1 text-sm text-slate-400">
                              {appointment.patient.phone}
                            </p>
                          )}
                        </div>

                      </div>

                      {/* Appointment details */}
                      <div className="flex flex-wrap gap-3 text-sm">

                        <div className="rounded-lg bg-slate-800 px-4 py-2">
                          📅 {appointment.date}
                        </div>

                        <div className="rounded-lg bg-slate-800 px-4 py-2">
                          🕐 {appointment.time}
                        </div>

                        <div
                          className={`rounded-lg px-4 py-2 font-medium ${
                            appointment.status ===
                            "CONFIRMED"
                              ? "bg-cyan-950 text-cyan-300"
                              : appointment.status ===
                                "COMPLETED"
                              ? "bg-green-950 text-green-300"
                              : appointment.status ===
                                "CANCELLED"
                              ? "bg-red-950 text-red-300"
                              : "bg-yellow-950 text-yellow-300"
                          }`}
                        >
                          {appointment.status}
                        </div>

                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">

                        {appointment.status ===
                          "PENDING" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(
                                  appointment.id,
                                  "CONFIRMED"
                                )
                              }
                              className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold transition hover:bg-cyan-500"
                            >
                              Confirm
                            </button>

                            <button
                              onClick={() =>
                                updateStatus(
                                  appointment.id,
                                  "CANCELLED"
                                )
                              }
                              className="rounded-lg border border-red-800 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-950"
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {appointment.status ===
                          "CONFIRMED" && (
                          <button
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                "COMPLETED"
                              )
                            }
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold transition hover:bg-green-500"
                          >
                            Mark Completed
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}