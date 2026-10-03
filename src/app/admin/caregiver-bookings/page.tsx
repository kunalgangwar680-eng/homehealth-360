"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  patientName: string;
  phone: string;
  address: string;
  service: string;
  caregiver: string;
  date: string;
  time: string;
  notes?: string | null;
  status: string;
};

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadBookings() {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch("/api/caregiver-bookings");

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Unable to load bookings");
        return;
      }

      setBookings(data.bookings || []);
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      setMessage("");

      const response = await fetch(
        "/api/caregiver-bookings",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Failed to update booking");
        return;
      }

      await loadBookings();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong");
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  const pending = bookings.filter(
    (b) => b.status === "PENDING"
  ).length;

  const confirmed = bookings.filter(
    (b) => b.status === "CONFIRMED"
  ).length;

  const completed = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  const cancelled = bookings.filter(
    (b) => b.status === "CANCELLED"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <p className="text-cyan-400 font-semibold">
            HOMEHEALTH 360
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Admin Caregiver Bookings
          </h1>

          <p className="text-slate-400 mt-2">
            Manage patient caregiver service bookings.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
            {message}
          </div>
        )}

        {/* Statistics */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">
              Pending
            </p>

            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {pending}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">
              Confirmed
            </p>

            <p className="text-3xl font-bold text-green-400 mt-2">
              {confirmed}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">
              Completed
            </p>

            <p className="text-3xl font-bold text-cyan-400 mt-2">
              {completed}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">
              Cancelled
            </p>

            <p className="text-3xl font-bold text-red-400 mt-2">
              {cancelled}
            </p>
          </div>

        </div>

        {/* Header */}

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-xl font-semibold">
            All Caregiver Bookings
          </h2>

          <button
            onClick={loadBookings}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700"
          >
            Refresh
          </button>

        </div>

        {loading ? (
          <div className="bg-slate-900 rounded-2xl p-10 text-center">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl p-10 text-center text-slate-400">
            No caregiver bookings found.
          </div>
        ) : (
          <div className="space-y-5">

            {bookings.map((booking) => (

              <div
                key={booking.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >

                <div className="flex flex-col md:flex-row md:justify-between gap-4">

                  <div>
                    <h2 className="text-xl font-semibold">
                      {booking.patientName}
                    </h2>

                    <p className="text-xs text-slate-500 mt-1">
                      Booking ID: {booking.id}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 h-fit rounded-full text-sm font-semibold ${
                      booking.status === "PENDING"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : booking.status === "CONFIRMED"
                        ? "bg-green-500/10 text-green-400"
                        : booking.status === "COMPLETED"
                        ? "bg-cyan-500/10 text-cyan-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="grid md:grid-cols-2 gap-5 mt-6">

                  <div>
                    <p className="text-sm text-slate-500">
                      Phone
                    </p>

                    <p className="mt-1">
                      {booking.phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Service
                    </p>

                    <p className="mt-1">
                      {booking.service}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Caregiver
                    </p>

                    <p className="mt-1">
                      {booking.caregiver}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Date
                    </p>

                    <p className="mt-1">
                      {booking.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Time
                    </p>

                    <p className="mt-1">
                      {booking.time}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500">
                      Address
                    </p>

                    <p className="mt-1">
                      {booking.address}
                    </p>
                  </div>

                  {booking.notes && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-slate-500">
                        Notes
                      </p>

                      <p className="mt-1">
                        {booking.notes}
                      </p>
                    </div>
                  )}

                </div>

                {/* Status Controls */}

                <div className="border-t border-slate-800 mt-6 pt-5">

                  <p className="text-sm text-slate-400 mb-3">
                    Change Status
                  </p>

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "CONFIRMED"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500"
                    >
                      Confirm
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "COMPLETED"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500"
                    >
                      Complete
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "CANCELLED"
                        )
                      }
                      className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500"
                    >
                      Cancel
                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>
        )}

      </div>
    </main>
  );
}