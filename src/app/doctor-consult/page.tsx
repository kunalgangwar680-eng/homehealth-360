"use client";

import { useEffect, useState } from "react";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  available: boolean;
};

type Appointment = {
  id: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  doctor: Doctor;
};

export default function DoctorConsultPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [cancellingId, setCancellingId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ];

  // Today's date
  function getToday() {
    const date = new Date();

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const today = getToday();

  // ================================
  // LOAD DOCTORS + APPOINTMENTS
  // ================================
  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const doctorResponse = await fetch(
        "/api/doctors",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const appointmentResponse = await fetch(
        "/api/appointments",
        {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        }
      );

      const doctorData =
        await doctorResponse.json();

      const appointmentData =
        await appointmentResponse.json();

      if (!doctorResponse.ok) {
        throw new Error(
          doctorData?.error ||
            "Doctors load nahi ho rahe."
        );
      }

      if (!appointmentResponse.ok) {
        throw new Error(
          appointmentData?.error ||
            "Appointments load nahi ho rahe."
        );
      }

      setDoctors(
        doctorData?.doctors || []
      );

      setAppointments(
        appointmentData?.appointments || []
      );
    } catch (err: any) {
      console.error(
        "LOAD DATA ERROR:",
        err
      );

      setError(
        err?.message ||
          "Data load karne mein problem hui."
      );
    } finally {
      setLoading(false);
    }
  }

  // Initial load
  useEffect(() => {
    loadData();
  }, []);

  // ================================
  // CHECK SLOT
  // ================================
  function isSlotBooked(time: string) {
    if (
      !selectedDoctor ||
      !selectedDate
    ) {
      return false;
    }

    return appointments.some(
      (appointment) =>
        appointment.doctor?.id ===
          selectedDoctor &&
        appointment.date ===
          selectedDate &&
        appointment.time === time &&
        (
          appointment.status ===
            "PENDING" ||
          appointment.status ===
            "CONFIRMED"
        )
    );
  }

  // ================================
  // SELECT DOCTOR
  // ================================
  function selectDoctor(
    doctor: Doctor
  ) {
    if (!doctor.available) {
      return;
    }

    setSelectedDoctor(doctor.id);
    setSelectedDate("");
    setSelectedTime("");

    setMessage("");
    setError("");
  }

  // ================================
  // SELECT DATE
  // ================================
  function selectDate(
    date: string
  ) {
    setSelectedDate(date);
    setSelectedTime("");

    setMessage("");
    setError("");
  }

  // ================================
  // SELECT TIME
  // ================================
  function selectTime(
    time: string
  ) {
    if (isSlotBooked(time)) {
      return;
    }

    setSelectedTime(time);

    setMessage("");
    setError("");
  }

  // ================================
  // BOOK APPOINTMENT
  // ================================
  async function bookAppointment() {
    setMessage("");
    setError("");

    if (!selectedDoctor) {
      setError(
        "Please select a doctor."
      );
      return;
    }

    if (!selectedDate) {
      setError(
        "Please select appointment date."
      );
      return;
    }

    if (!selectedTime) {
      setError(
        "Please select appointment time."
      );
      return;
    }

    if (isSlotBooked(selectedTime)) {
      setError(
        "This time slot is already booked."
      );

      setSelectedTime("");

      return;
    }

    try {
      setBooking(true);

      const response = await fetch(
        "/api/appointments",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            doctorId:
              selectedDoctor,
            date: selectedDate,
            time: selectedTime,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Appointment book nahi hua."
        );
      }

      setMessage(
        "Appointment booked successfully! 🎉"
      );

      setSelectedDoctor("");
      setSelectedDate("");
      setSelectedTime("");

      // Database se fresh appointments
      await loadData();
    } catch (err: any) {
      console.error(
        "BOOK APPOINTMENT ERROR:",
        err
      );

      setError(
        err?.message ||
          "Appointment book karne mein problem hui."
      );
    } finally {
      setBooking(false);
    }
  }

  // ================================
  // CANCEL APPOINTMENT
  // ================================
  async function cancelAppointment(
    appointmentId: string
  ) {
    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

    if (!confirmCancel) {
      return;
    }

    try {
      setCancellingId(
        appointmentId
      );

      setMessage("");
      setError("");

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
            appointmentId:
              appointmentId,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Appointment cancel nahi hua."
        );
      }

      setMessage(
        "Appointment cancelled successfully."
      );

      // Database se fresh data
      await loadData();
    } catch (err: any) {
      console.error(
        "CANCEL APPOINTMENT ERROR:",
        err
      );

      setError(
        err?.message ||
          "Appointment cancel karne mein problem hui."
      );
    } finally {
      setCancellingId("");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-8">

          <p className="text-sm font-medium uppercase tracking-[0.25em] text-cyan-400">
            Healthcare 360
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Doctor Consultation
          </h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Choose a doctor, select your preferred
            date and time, and book your consultation.
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {message && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {message}
          </div>
        )}

        {/* MAIN */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ========================= */}
          {/* DOCTORS */}
          {/* ========================= */}

          <section className="lg:col-span-2">

            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h2 className="text-xl font-semibold">
                    Available Doctors
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select a doctor for consultation.
                  </p>

                </div>

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs text-cyan-300">
                  {doctors.length} Doctors
                </span>

              </div>

              {loading ? (

                <div className="py-12 text-center text-slate-400">
                  Loading doctors...
                </div>

              ) : doctors.length === 0 ? (

                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-400">
                  No doctors available right now.
                </div>

              ) : (

                <div className="grid gap-4 sm:grid-cols-2">

                  {doctors.map(
                    (doctor) => {

                      const selected =
                        selectedDoctor ===
                        doctor.id;

                      return (

                        <button
                          key={doctor.id}
                          type="button"
                          disabled={
                            !doctor.available
                          }
                          onClick={() =>
                            selectDoctor(
                              doctor
                            )
                          }
                          className={`rounded-2xl border p-4 text-left transition ${
                            !doctor.available
                              ? "cursor-not-allowed border-slate-800 bg-slate-950 opacity-50"
                              : selected
                              ? "border-cyan-500 bg-cyan-500/10"
                              : "border-slate-800 bg-slate-950 hover:border-cyan-500/40"
                          }`}
                        >

                          <div className="flex items-start justify-between gap-3">

                            <div className="flex items-center gap-3">

                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-2xl">
                                👨‍⚕️
                              </div>

                              <div>

                                <h3 className="font-semibold">
                                  {doctor.name}
                                </h3>

                                <p className="text-sm text-cyan-400">
                                  {
                                    doctor.specialization
                                  }
                                </p>

                              </div>

                            </div>

                            {selected && (
                              <span className="text-cyan-400">
                                ✓
                              </span>
                            )}

                          </div>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs">

                            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                              ⭐{" "}
                              {doctor.rating}
                            </span>

                            <span className="rounded-full bg-slate-800 px-3 py-1 text-slate-300">
                              {
                                doctor.experience
                              }
                            </span>

                            <span
                              className={`rounded-full px-3 py-1 ${
                                doctor.available
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-red-500/10 text-red-400"
                              }`}
                            >
                              {doctor.available
                                ? "Available"
                                : "Unavailable"}
                            </span>

                          </div>

                        </button>

                      );
                    }
                  )}

                </div>

              )}

            </div>

          </section>

          {/* ========================= */}
          {/* BOOKING */}
          {/* ========================= */}

          <section>

            <div className="sticky top-6 rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">

              <h2 className="text-xl font-semibold">
                Book Consultation
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Select date and time.
              </p>

              {/* SELECTED DOCTOR */}

              <div className="mt-5 rounded-2xl bg-slate-950 p-4">

                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Selected Doctor
                </p>

                {selectedDoctor ? (

                  <p className="mt-2 font-medium text-cyan-300">

                    {
                      doctors.find(
                        (doctor) =>
                          doctor.id ===
                          selectedDoctor
                      )?.name
                    }

                  </p>

                ) : (

                  <p className="mt-2 text-sm text-slate-500">
                    No doctor selected
                  </p>

                )}

              </div>

              {/* DATE */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Appointment Date
                </label>

                <input
                  type="date"
                  min={today}
                  value={selectedDate}
                  onChange={(event) =>
                    selectDate(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-500"
                />

              </div>

              {/* TIME */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Appointment Time
                </label>

                {!selectedDoctor ||
                !selectedDate ? (

                  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950 p-4 text-center text-sm text-slate-500">
                    Select doctor and date first.
                  </div>

                ) : (

                  <div className="grid grid-cols-2 gap-2">

                    {timeSlots.map(
                      (time) => {

                        const booked =
                          isSlotBooked(
                            time
                          );

                        return (

                          <button
                            key={time}
                            type="button"
                            disabled={booked}
                            onClick={() =>
                              selectTime(
                                time
                              )
                            }
                            className={`rounded-xl border px-3 py-2 text-sm transition ${
                              booked
                                ? "cursor-not-allowed border-red-500/20 bg-red-500/10 text-red-400"
                                : selectedTime ===
                                  time
                                ? "border-cyan-500 bg-cyan-500 text-slate-950"
                                : "border-slate-700 bg-slate-950 text-slate-300 hover:border-cyan-500/50"
                            }`}
                          >

                            {booked
                              ? "🔴 Booked"
                              : selectedTime ===
                                time
                              ? "✓ Selected"
                              : time}

                          </button>

                        );
                      }
                    )}

                  </div>

                )}

              </div>

              {/* BOOK BUTTON */}

              <button
                type="button"
                onClick={
                  bookAppointment
                }
                disabled={
                  booking ||
                  !selectedDoctor ||
                  !selectedDate ||
                  !selectedTime
                }
                className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >

                {booking
                  ? "Booking..."
                  : "Confirm Appointment"}

              </button>

            </div>

          </section>

        </div>

        {/* ================================= */}
        {/* MY APPOINTMENTS */}
        {/* ================================= */}

        <section className="mt-8">

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-xl">

            <div className="mb-5">

              <h2 className="text-xl font-semibold">
                My Appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your appointments are loaded from the
                Healthcare 360 database.
              </p>

            </div>

            {appointments.length === 0 ? (

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center text-slate-500">
                No appointments booked yet.
              </div>

            ) : (

              <div className="space-y-4">

                {appointments.map(
                  (appointment) => {

                    const canCancel =
                      appointment.status ===
                        "PENDING" ||
                      appointment.status ===
                        "CONFIRMED";

                    return (

                      <div
                        key={
                          appointment.id
                        }
                        className="rounded-2xl border border-slate-800 bg-slate-950 p-5"
                      >

                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                          {/* DOCTOR */}

                          <div className="flex items-center gap-4">

                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/10 text-2xl">
                              👨‍⚕️
                            </div>

                            <div>

                              <h3 className="font-semibold text-white">

                                {
                                  appointment
                                    .doctor
                                    ?.name ||
                                  "Doctor"
                                }

                              </h3>

                              <p className="text-sm text-slate-500">

                                {
                                  appointment
                                    .doctor
                                    ?.specialization ||
                                  "Consultation"
                                }

                              </p>

                            </div>

                          </div>

                          {/* DETAILS */}

                          <div className="flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-300">
                              📅{" "}
                              {
                                appointment.date
                              }
                            </span>

                            <span className="rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-300">
                              🕐{" "}
                              {
                                appointment.time
                              }
                            </span>

                            {/* STATUS */}

                            <span
                              className={`rounded-full px-3 py-2 text-sm font-medium ${
                                appointment.status ===
                                "CANCELLED"
                                  ? "bg-red-500/10 text-red-400"
                                  : appointment.status ===
                                    "COMPLETED"
                                  ? "bg-green-500/10 text-green-400"
                                  : appointment.status ===
                                    "CONFIRMED"
                                  ? "bg-cyan-500/10 text-cyan-400"
                                  : "bg-yellow-500/10 text-yellow-400"
                              }`}
                            >

                              {appointment.status}

                            </span>

                            {/* CANCEL */}

                            {canCancel && (

                              <button
                                type="button"
                                onClick={() =>
                                  cancelAppointment(
                                    appointment.id
                                  )
                                }
                                disabled={
                                  cancellingId ===
                                  appointment.id
                                }
                                className="rounded-full border border-red-500/40 bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
                              >

                                {cancellingId ===
                                appointment.id
                                  ? "Cancelling..."
                                  : "Cancel Appointment"}

                              </button>

                            )}

                          </div>

                        </div>

                      </div>

                    );
                  }
                )}

              </div>

            )}

          </div>

        </section>

      </div>

    </main>
  );
}