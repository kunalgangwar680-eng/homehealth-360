"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LabTest = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type LabBooking = {
  id: string;
  patientName: string;
  mobile: string;
  address: string;
  testNames: string;
  date: string;
  time: string;
  status: string;
  createdAt: string;
};

const labTests: LabTest[] = [
  {
    id: "cbc",
    name: "Complete Blood Count (CBC)",
    description: "Basic blood health screening.",
    price: 399,
  },
  {
    id: "sugar",
    name: "Blood Sugar Test",
    description: "Blood glucose screening.",
    price: 199,
  },
  {
    id: "thyroid",
    name: "Thyroid Profile",
    description: "TSH, T3 and T4 screening.",
    price: 499,
  },
  {
    id: "vitamin-d",
    name: "Vitamin D Test",
    description: "Vitamin D level screening.",
    price: 799,
  },
  {
    id: "liver",
    name: "Liver Function Test",
    description: "Basic liver health screening.",
    price: 599,
  },
  {
    id: "kidney",
    name: "Kidney Function Test",
    description: "Basic kidney health screening.",
    price: 499,
  },
];

const timeSlots = [
  "8:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 2:00 PM",
  "2:00 PM - 4:00 PM",
  "4:00 PM - 6:00 PM",
];

export default function LabTests() {
  const [selectedTests, setSelectedTests] =
    useState<string[]>([]);

  const [patientName, setPatientName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [bookings, setBookings] =
    useState<LabBooking[]>([]);

  const [loadingBookings, setLoadingBookings] =
    useState(true);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [bookingId, setBookingId] =
    useState("");

  const today =
    new Date().toLocaleDateString("en-CA");

  // ==========================================
  // SELECTED TESTS
  // ==========================================

  const selectedTestObjects =
    labTests.filter((test) =>
      selectedTests.includes(test.id)
    );

  const total =
    selectedTestObjects.reduce(
      (sum, test) =>
        sum + test.price,
      0
    );

  // ==========================================
  // LOAD LAB BOOKINGS
  // ==========================================

  async function loadBookings() {
    try {
      setLoadingBookings(true);

      const response =
        await fetch(
          "/api/lab-bookings",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to load lab bookings."
        );
      }

      setBookings(
        data?.bookings || []
      );
    } catch (err: any) {
      console.error(
        "LOAD LAB BOOKINGS ERROR:",
        err
      );

      setError(
        err?.message ||
          "Lab bookings load nahi ho rahi."
      );
    } finally {
      setLoadingBookings(false);
    }
  }

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadBookings();
  }, []);

  // ==========================================
  // SELECT / UNSELECT TEST
  // ==========================================

  function toggleTest(id: string) {
    setSelectedTests((current) => {
      if (current.includes(id)) {
        return current.filter(
          (testId) =>
            testId !== id
        );
      }

      return [
        ...current,
        id,
      ];
    });

    setError("");
    setMessage("");
  }

  // ==========================================
  // BOOK LAB TEST
  // ==========================================

  async function handleBooking() {
    setError("");
    setMessage("");
    setBookingId("");

    if (
      selectedTests.length === 0
    ) {
      setError(
        "Please select at least one lab test."
      );
      return;
    }

    if (!patientName.trim()) {
      setError(
        "Please enter patient name."
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Please enter mobile number."
      );
      return;
    }

    if (
      !/^[6-9]\d{9}$/.test(phone)
    ) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    if (!address.trim()) {
      setError(
        "Please enter home collection address."
      );
      return;
    }

    if (!date) {
      setError(
        "Please select collection date."
      );
      return;
    }

    if (date < today) {
      setError(
        "Please select today or a future date."
      );
      return;
    }

    if (!time) {
      setError(
        "Please select collection time."
      );
      return;
    }

    try {
      setBookingLoading(true);

      const testNames =
        selectedTestObjects
          .map(
            (test) =>
              test.name
          )
          .join(", ");

      const response =
        await fetch(
          "/api/lab-bookings",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            credentials:
              "include",

            body: JSON.stringify({
              patientName:
                patientName.trim(),

              mobile: phone,

              address:
                address.trim(),

              testNames,

              date,

              time,
            }),
          }
        );

      const data =
        await response.json();

      console.log(
        "LAB BOOKING STATUS:",
        response.status
      );

      console.log(
        "LAB BOOKING RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data?.error ||
            "Unable to create lab booking."
        );
      }

      setBookingId(
        data?.booking?.id ||
          ""
      );

      setMessage(
        "Lab booking created successfully! 🎉"
      );

      // Clear selected tests
      setSelectedTests([]);

      // Refresh database bookings
      await loadBookings();
    } catch (err: any) {
      console.error(
        "LAB BOOKING ERROR:",
        err
      );

      setError(
        err?.message ||
          "Something went wrong while creating the lab booking."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  // ==========================================
  // STATUS STYLE
  // ==========================================

  function getStatusClass(
    status: string
  ) {
    if (
      status === "CONFIRMED"
    ) {
      return "bg-cyan-400/10 text-cyan-300 border-cyan-400/20";
    }

    if (
      status === "COMPLETED"
    ) {
      return "bg-green-400/10 text-green-300 border-green-400/20";
    }

    if (
      status === "CANCELLED"
    ) {
      return "bg-red-400/10 text-red-300 border-red-400/20";
    }

    return "bg-yellow-400/10 text-yellow-300 border-yellow-400/20";
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav className="border-b border-white/10 bg-slate-950/90">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/dashboard">

            <h1 className="text-2xl font-extrabold tracking-tight">
              HEALTHCARE
              <span className="text-cyan-400">
                360
              </span>
            </h1>

            <p className="text-xs text-slate-500">
              Connected Healthcare Ecosystem
            </p>

          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5"
          >
            Dashboard
          </Link>

        </div>

      </nav>

      {/* ======================================
          MAIN
      ====================================== */}

      <section className="mx-auto max-w-7xl px-6 py-10">

        {/* HEADER */}

        <div>

          <p className="text-sm font-semibold text-cyan-400">
            LAB TESTS & HOME SAMPLE COLLECTION
          </p>

          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Book Lab Tests
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Select the tests you need and request
            a home sample collection through
            Healthcare 360.
          </p>

        </div>

        {/* ======================================
            SUCCESS MESSAGE
        ====================================== */}

        {message && (
          <div className="mt-6 rounded-2xl border border-green-400/20 bg-green-400/10 px-5 py-4 text-sm text-green-300">
            {message}

            {bookingId && (
              <span className="ml-2 font-bold">
                Booking ID: {bookingId}
              </span>
            )}
          </div>
        )}

        {/* ======================================
            ERROR MESSAGE
        ====================================== */}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        {/* ======================================
            STEP 1
        ====================================== */}

        <div className="mt-10">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
              1
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Select Lab Tests
              </h2>

              <p className="text-sm text-slate-500">
                Choose one or more tests.
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {labTests.map(
              (test) => {

                const selected =
                  selectedTests.includes(
                    test.id
                  );

                return (

                  <button
                    type="button"
                    key={test.id}
                    onClick={() =>
                      toggleTest(
                        test.id
                      )
                    }
                    className={`rounded-2xl border p-6 text-left transition duration-300 ${
                      selected
                        ? "border-cyan-400 bg-cyan-400/10"
                        : "border-white/10 bg-white/5 hover:-translate-y-1 hover:border-cyan-400/40"
                    }`}
                  >

                    <div className="flex items-start justify-between">

                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-2xl">
                        🧪
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          selected
                            ? "bg-cyan-400 text-slate-950"
                            : "bg-white/5 text-slate-500"
                        }`}
                      >
                        {selected
                          ? "SELECTED"
                          : "SELECT"}
                      </span>

                    </div>

                    <h3 className="mt-6 text-lg font-bold">
                      {test.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {test.description}
                    </p>

                    <p className="mt-5 text-xl font-extrabold text-cyan-400">
                      ₹{test.price}
                    </p>

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* ======================================
            STEP 2
        ====================================== */}

        <div className="mt-12">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
              2
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Patient Details
              </h2>

              <p className="text-sm text-slate-500">
                Enter details for home collection.
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">

            <div className="grid gap-6 md:grid-cols-2">

              {/* NAME */}

              <div>

                <label
                  htmlFor="patientName"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Full Name
                </label>

                <input
                  id="patientName"
                  type="text"
                  value={patientName}
                  onChange={(e) =>
                    setPatientName(
                      e.target.value
                    )
                  }
                  placeholder="Enter patient name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />

              </div>

              {/* PHONE */}

              <div>

                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Mobile Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />

              </div>

              {/* ADDRESS */}

              <div className="md:col-span-2">

                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Home Collection Address
                </label>

                <textarea
                  id="address"
                  value={address}
                  onChange={(e) =>
                    setAddress(
                      e.target.value
                    )
                  }
                  placeholder="House number, street, city, PIN code"
                  rows={4}
                  autoComplete="street-address"
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-cyan-400"
                />

              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            STEP 3
        ====================================== */}

        <div className="mt-12">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-bold text-slate-950">
              3
            </div>

            <div>

              <h2 className="text-2xl font-bold">
                Collection Schedule
              </h2>

              <p className="text-sm text-slate-500">
                Select preferred date and time.
              </p>

            </div>

          </div>

          <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">

            <div className="grid gap-6 md:grid-cols-2">

              {/* DATE */}

              <div>

                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Collection Date
                </label>

                <input
                  id="date"
                  type="date"
                  min={today}
                  value={date}
                  onChange={(e) =>
                    setDate(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                />

              </div>

              {/* TIME */}

              <div>

                <label
                  htmlFor="time"
                  className="mb-2 block text-sm font-semibold text-slate-300"
                >
                  Preferred Time
                </label>

                <select
                  id="time"
                  value={time}
                  onChange={(e) =>
                    setTime(
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-cyan-400"
                >

                  <option value="">
                    Select time
                  </option>

                  {timeSlots.map(
                    (slot) => (
                      <option
                        key={slot}
                        value={slot}
                      >
                        {slot}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================
            SUMMARY
        ====================================== */}

        <div className="mt-12 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-6 md:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm font-semibold text-cyan-400">
                BOOKING SUMMARY
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                {selectedTests.length} Test
                {selectedTests.length !== 1
                  ? "s"
                  : ""}{" "}
                Selected
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Home sample collection
              </p>

            </div>

            <div className="md:text-right">

              <p className="text-sm text-slate-500">
                Total
              </p>

              <p className="text-3xl font-extrabold text-cyan-400">
                ₹{total}
              </p>

            </div>

          </div>

          <button
            type="button"
            onClick={
              handleBooking
            }
            disabled={
              bookingLoading
            }
            className="mt-7 w-full rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {bookingLoading
              ? "Creating Booking..."
              : "🧪 Create Home Collection Request →"}
          </button>

        </div>

        {/* ======================================
            MY LAB BOOKINGS
        ====================================== */}

        <section className="mt-12">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">

            <div className="mb-6">

              <p className="text-sm font-semibold text-cyan-400">
                DATABASE
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                My Lab Bookings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your lab collection requests are loaded
                directly from the Healthcare 360 database.
              </p>

            </div>

            {loadingBookings ? (

              <div className="rounded-2xl border border-white/10 bg-slate-950 p-6 text-center text-slate-500">
                Loading lab bookings...
              </div>

            ) : bookings.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-950 p-8 text-center">

                <div className="text-4xl">
                  🧪
                </div>

                <p className="mt-3 font-semibold">
                  No lab bookings yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Your bookings will appear here after
                  creating a collection request.
                </p>

              </div>

            ) : (

              <div className="space-y-4">

                {bookings.map(
                  (booking) => (

                    <div
                      key={booking.id}
                      className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                    >

                      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                        {/* TESTS */}

                        <div>

                          <h3 className="font-bold">
                            🧪 Lab Test Collection
                          </h3>

                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                            {booking.testNames}
                          </p>

                        </div>

                        {/* STATUS */}

                        <div className="flex flex-wrap items-center gap-2">

                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                            📅 {booking.date}
                          </span>

                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                            🕐 {booking.time}
                          </span>

                          <span
                            className={`rounded-full border px-3 py-2 text-sm font-semibold ${getStatusClass(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>

                        </div>

                      </div>

                      {/* BOOKING DETAILS */}

                      <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-2 lg:grid-cols-4">

                        <div>

                          <p className="text-xs text-slate-600">
                            Booking ID
                          </p>

                          <p className="mt-1 break-all text-sm font-semibold text-slate-300">
                            {booking.id}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-600">
                            Patient
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {booking.patientName}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-600">
                            Mobile
                          </p>

                          <p className="mt-1 text-sm font-semibold text-slate-300">
                            {booking.mobile}
                          </p>

                        </div>

                        <div>

                          <p className="text-xs text-slate-600">
                            Address
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            {booking.address}
                          </p>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </section>

        {/* NOTICE */}

        <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5 text-sm leading-6 text-yellow-200/70">

          <strong className="text-yellow-300">
            Prototype Notice:
          </strong>{" "}
          This is currently a software prototype.
          The test names and prices are illustrative.
          No real laboratory, payment gateway or
          home sample collection service is connected yet.

        </div>

      </section>

    </main>
  );
}