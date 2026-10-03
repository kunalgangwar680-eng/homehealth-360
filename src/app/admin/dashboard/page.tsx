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
  doctor?: {
    name: string;
    specialization?: string;
  };
};

type Booking = {
  id: string;
  patientName: string;
  status: string;
  date: string;
  time: string;
  service?: string;
  testNames?: string;
  caregiver?: string;
};

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [labBookings, setLabBookings] = useState<Booking[]>([]);
  const [caregiverBookings, setCaregiverBookings] = useState<Booking[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setMessage("");

      const [
        appointmentsResponse,
        labResponse,
        caregiverResponse,
        doctorsResponse,
      ] = await Promise.all([
        fetch("/api/appointments", {
          credentials: "include",
        }),
        fetch("/api/lab-bookings", {
          credentials: "include",
        }),
        fetch("/api/caregiver-bookings", {
          credentials: "include",
        }),
        fetch("/api/doctors", {
          credentials: "include",
        }),
      ]);

      const appointmentsData = await appointmentsResponse.json();
      const labData = await labResponse.json();
      const caregiverData = await caregiverResponse.json();
      const doctorsData = await doctorsResponse.json();

      if (appointmentsResponse.ok) {
        setAppointments(
          Array.isArray(appointmentsData)
            ? appointmentsData
            : appointmentsData.appointments || []
        );
      }

      if (labResponse.ok) {
        setLabBookings(
          Array.isArray(labData) ? labData : labData.bookings || []
        );
      }

      if (caregiverResponse.ok) {
        setCaregiverBookings(
          Array.isArray(caregiverData)
            ? caregiverData
            : caregiverData.bookings || []
        );
      }

      if (doctorsResponse.ok) {
        setDoctors(
          Array.isArray(doctorsData)
            ? doctorsData
            : doctorsData.doctors || []
        );
      }
    } catch {
      setMessage("Unable to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function updateAppointment(
    appointmentId: string,
    status: string
  ) {
    try {
      setUpdatingId(appointmentId);
      setMessage("");

      const response = await fetch("/api/appointments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          appointmentId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.error || "Unable to update appointment.");
        return;
      }

      setMessage(
        `Appointment ${status.toLowerCase()} successfully.`
      );

      await loadData();
    } catch {
      setMessage("Unable to update appointment.");
    } finally {
      setUpdatingId("");
    }
  }

  const pendingAppointments = appointments.filter(
    (item) => item.status === "PENDING"
  ).length;

  const confirmedAppointments = appointments.filter(
    (item) => item.status === "CONFIRMED"
  ).length;

  const completedAppointments = appointments.filter(
    (item) => item.status === "COMPLETED"
  ).length;

  const cancelledAppointments = appointments.filter(
    (item) => item.status === "CANCELLED"
  ).length;

  const pendingLabs = labBookings.filter(
    (item) => item.status === "PENDING"
  ).length;

  const pendingCaregiver = caregiverBookings.filter(
    (item) => item.status === "PENDING"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-medium text-cyan-400">
              HOMEHEALTH 360
            </p>

            <h1 className="text-3xl font-bold">
              Central Admin Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Manage the complete healthcare platform.
            </p>
          </div>

          <button
            onClick={loadData}
            className="rounded-xl border border-slate-700 bg-slate-900 px-5 py-3 text-sm font-semibold hover:border-cyan-500 hover:bg-slate-800"
          >
            ↻ Refresh
          </button>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-6 rounded-xl border border-cyan-800 bg-cyan-950/40 px-4 py-3 text-sm text-cyan-300">
            {message}
          </div>
        )}

        {/* MAIN STATS */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Doctors</p>
            <p className="mt-2 text-3xl font-bold text-cyan-400">
              {doctors.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Appointments</p>
            <p className="mt-2 text-3xl font-bold">
              {appointments.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Lab Bookings</p>
            <p className="mt-2 text-3xl font-bold">
              {labBookings.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Caregiver Bookings
            </p>
            <p className="mt-2 text-3xl font-bold">
              {caregiverBookings.length}
            </p>
          </div>

        </div>

        {/* APPOINTMENT STATUS */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl border border-yellow-900/50 bg-yellow-950/20 p-5">
            <p className="text-sm text-yellow-300">Pending</p>
            <p className="mt-2 text-3xl font-bold text-yellow-400">
              {pendingAppointments}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-900/50 bg-cyan-950/20 p-5">
            <p className="text-sm text-cyan-300">Confirmed</p>
            <p className="mt-2 text-3xl font-bold text-cyan-400">
              {confirmedAppointments}
            </p>
          </div>

          <div className="rounded-2xl border border-green-900/50 bg-green-950/20 p-5">
            <p className="text-sm text-green-300">Completed</p>
            <p className="mt-2 text-3xl font-bold text-green-400">
              {completedAppointments}
            </p>
          </div>

          <div className="rounded-2xl border border-red-900/50 bg-red-950/20 p-5">
            <p className="text-sm text-red-300">Cancelled</p>
            <p className="mt-2 text-3xl font-bold text-red-400">
              {cancelledAppointments}
            </p>
          </div>

        </div>

        {/* APPOINTMENT MANAGEMENT */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-5">
            <h2 className="text-xl font-semibold">
              Appointment Management
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Review and manage patient appointments.
            </p>
          </div>

          {loading ? (
            <div className="px-5 py-12 text-center text-slate-400">
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="px-5 py-12 text-center text-slate-400">
              No appointments found.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-5 hover:bg-slate-800/30"
                >

                  <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

                    {/* PATIENT */}
                    <div className="flex items-start gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-xl">
                        👤
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          {appointment.patient?.name || "Patient"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-400">
                          {appointment.patient?.email ||
                            "Email unavailable"}
                        </p>

                        {appointment.patient?.phone && (
                          <p className="mt-1 text-sm text-slate-400">
                            {appointment.patient.phone}
                          </p>
                        )}

                        {appointment.doctor && (
                          <p className="mt-2 text-xs text-cyan-400">
                            Doctor: {appointment.doctor.name}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* DETAILS */}
                    <div className="flex flex-wrap gap-2 text-sm">

                      <span className="rounded-lg bg-slate-800 px-3 py-2">
                        📅 {appointment.date}
                      </span>

                      <span className="rounded-lg bg-slate-800 px-3 py-2">
                        🕐 {appointment.time}
                      </span>

                      <span
                        className={`rounded-lg px-3 py-2 font-semibold ${
                          appointment.status === "CONFIRMED"
                            ? "bg-cyan-950 text-cyan-300"
                            : appointment.status === "COMPLETED"
                            ? "bg-green-950 text-green-300"
                            : appointment.status === "CANCELLED"
                            ? "bg-red-950 text-red-300"
                            : "bg-yellow-950 text-yellow-300"
                        }`}
                      >
                        {appointment.status}
                      </span>

                    </div>

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-2">

                      {appointment.status === "PENDING" && (
                        <>
                          <button
                            disabled={updatingId === appointment.id}
                            onClick={() =>
                              updateAppointment(
                                appointment.id,
                                "CONFIRMED"
                              )
                            }
                            className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold hover:bg-cyan-500 disabled:opacity-50"
                          >
                            Confirm
                          </button>

                          <button
                            disabled={updatingId === appointment.id}
                            onClick={() =>
                              updateAppointment(
                                appointment.id,
                                "CANCELLED"
                              )
                            }
                            className="rounded-lg border border-red-800 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-950 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {appointment.status === "CONFIRMED" && (
                        <>
                          <button
                            disabled={updatingId === appointment.id}
                            onClick={() =>
                              updateAppointment(
                                appointment.id,
                                "COMPLETED"
                              )
                            }
                            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-500 disabled:opacity-50"
                          >
                            Mark Completed
                          </button>

                          <button
                            disabled={updatingId === appointment.id}
                            onClick={() =>
                              updateAppointment(
                                appointment.id,
                                "CANCELLED"
                              )
                            }
                            className="rounded-lg border border-red-800 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-950 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {(appointment.status === "COMPLETED" ||
                        appointment.status === "CANCELLED") && (
                        <span className="rounded-lg bg-slate-800 px-4 py-2 text-sm text-slate-400">
                          No actions
                        </span>
                      )}

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* PENDING OPERATIONS */}
        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-5">
            <h2 className="text-xl font-semibold">
              Pending Operations
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Other bookings waiting for admin action.
            </p>
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between">

                <div>
                  <p className="font-semibold">
                    🧪 Lab Bookings
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Pending lab requests
                  </p>
                </div>

                <span className="rounded-full bg-yellow-950 px-4 py-2 font-bold text-yellow-400">
                  {pendingLabs}
                </span>

              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between">

                <div>
                  <p className="font-semibold">
                    👩‍⚕️ Caregiver Bookings
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    Pending caregiver requests
                  </p>
                </div>

                <span className="rounded-full bg-yellow-950 px-4 py-2 font-bold text-yellow-400">
                  {pendingCaregiver}
                </span>

              </div>
            </div>

          </div>

        </section>

        {/* DOCTORS */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900">

          <div className="border-b border-slate-800 px-5 py-5">
            <h2 className="text-xl font-semibold">
              Doctors
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Doctors currently registered in the platform.
            </p>
          </div>

          {doctors.length === 0 ? (
            <div className="px-5 py-10 text-center text-slate-400">
              No doctors found.
            </div>
          ) : (
            <div className="divide-y divide-slate-800">

              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between hover:bg-slate-800/30"
                >

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-xl">
                      🩺
                    </div>

                    <div>
                      <h3 className="font-semibold">
                        {doctor.name}
                      </h3>

                      <p className="text-sm text-slate-400">
                        {doctor.specialization ||
                          "General Physician"}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Experience:{" "}
                        {doctor.experience || "N/A"}
                      </p>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        doctor.available
                          ? "bg-green-950 text-green-400"
                          : "bg-red-950 text-red-400"
                      }`}
                    >
                      {doctor.available
                        ? "AVAILABLE"
                        : "UNAVAILABLE"}
                    </span>

                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                      ⭐ {doctor.rating ?? 5}
                    </span>

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}