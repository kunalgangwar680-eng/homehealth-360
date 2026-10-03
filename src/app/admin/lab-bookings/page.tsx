"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: string;
  patientName: string;
  mobile: string;
  address: string;
  testNames: string;
  date: string;
  time: string;
  status: string;
};

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadBookings() {
    try {
      setLoading(true);

      const response = await fetch("/api/lab-bookings");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to load bookings");
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

      const response = await fetch("/api/lab-bookings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update booking");
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

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <p className="text-cyan-400 font-semibold">
            HOMEHEALTH 360
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Admin Lab Bookings
          </h1>

          <p className="text-slate-400 mt-2">
            Manage patient laboratory test bookings.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300">
            {message}
          </div>
        )}

        {loading ? (
          <div className="bg-slate-900 rounded-2xl p-8 text-center">
            Loading bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-slate-900 rounded-2xl p-8 text-center text-slate-400">
            No lab bookings found.
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

                    <p className="text-sm text-slate-400 mt-1">
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
                      Mobile
                    </p>
                    <p className="mt-1">
                      {booking.mobile}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Collection Date
                    </p>
                    <p className="mt-1">
                      {booking.date}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Time Slot
                    </p>
                    <p className="mt-1">
                      {booking.time}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Tests
                    </p>
                    <p className="mt-1">
                      {booking.testNames}
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <p className="text-sm text-slate-500">
                      Collection Address
                    </p>
                    <p className="mt-1">
                      {booking.address}
                    </p>
                  </div>

                </div>

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