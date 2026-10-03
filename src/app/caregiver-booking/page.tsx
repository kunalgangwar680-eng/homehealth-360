"use client";

import { useState } from "react";
import Link from "next/link";

type Caregiver = {
  id: string;
  name: string;
  role: string;
  experience: string;
  rating: string;
  icon: string;
};

const caregivers: Caregiver[] = [
  {
    id: "CG001",
    name: "Priya Sharma",
    role: "General Caregiver",
    experience: "5+ Years",
    rating: "4.9",
    icon: "👩‍⚕️",
  },
  {
    id: "CG002",
    name: "Neha Verma",
    role: "Elderly Care Specialist",
    experience: "7+ Years",
    rating: "4.8",
    icon: "👩‍⚕️",
  },
  {
    id: "CG003",
    name: "Rahul Kumar",
    role: "Home Care Assistant",
    experience: "4+ Years",
    rating: "4.7",
    icon: "👨‍⚕️",
  },
];

const services = [
  "Elderly Care",
  "Post-Hospital Care",
  "Patient Assistance",
  "Daily Home Care",
  "Medicine Assistance",
  "Recovery Support",
];

export default function CaregiverBooking() {
  const [selectedService, setSelectedService] = useState("");
  const [selectedCaregiver, setSelectedCaregiver] = useState("");
  const [patientName, setPatientName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [bookingStatus, setBookingStatus] = useState("PENDING");
  const [bookingLoading, setBookingLoading] = useState(false);

  async function bookCaregiver() {
    setError("");

    if (!selectedService) {
      setError("Please select a care service.");
      return;
    }

    if (!selectedCaregiver) {
      setError("Please select a caregiver.");
      return;
    }

    if (!patientName.trim()) {
      setError("Please enter patient name.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter mobile number.");
      return;
    }

    if (phone.trim().length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!address.trim()) {
      setError("Please enter home address.");
      return;
    }

    if (!date) {
      setError("Please select booking date.");
      return;
    }

    if (!time) {
      setError("Please select booking time.");
      return;
    }

    const selected = caregivers.find(
      (caregiver) => caregiver.id === selectedCaregiver
    );

    if (!selected) {
      setError("Selected caregiver was not found.");
      return;
    }

    try {
      setBookingLoading(true);

      const response = await fetch("/api/caregiver-bookings", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientName: patientName.trim(),
          phone: phone.trim(),
          address: address.trim(),
          service: selectedService,
          caregiver: selected.name,
          date,
          time,
          notes: notes.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong while creating the booking."
        );
      }

      setBookingId(data.booking.id);
      setBookingStatus(data.booking.status || "PENDING");
      setBookingComplete(true);
    } catch (err) {
      console.error("CAREGIVER BOOKING ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the booking."
      );
    } finally {
      setBookingLoading(false);
    }
  }

  if (bookingComplete) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <nav className="border-b border-white/10 bg-slate-950/90">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
            <Link href="/dashboard">
              <h1 className="text-2xl font-extrabold">
                HEALTHCARE
                <span className="text-cyan-400">360</span>
              </h1>

              <p className="text-xs text-slate-500">
                Connected Healthcare Ecosystem
              </p>
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        <section className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center px-6 py-10">
          <div className="w-full rounded-3xl border border-green-400/20 bg-green-400/5 p-8 text-center md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-400/10 text-4xl">
              ✓
            </div>

            <p className="mt-6 text-sm font-semibold text-green-400">
              CAREGIVER BOOKING CREATED
            </p>

            <h1 className="mt-3 text-4xl font-extrabold">
              Booking Successful
            </h1>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Your caregiver service request has been successfully saved to
              Healthcare 360.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-slate-900 p-6 text-left">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">Booking ID</p>

                  <p className="mt-1 break-all font-bold text-cyan-400">
                    {bookingId}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Status</p>

                  <p className="mt-1 font-bold text-yellow-400">
                    {bookingStatus}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Service</p>

                  <p className="mt-1 font-semibold">{selectedService}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Caregiver</p>

                  <p className="mt-1 font-semibold">
                    {
                      caregivers.find(
                        (caregiver) => caregiver.id === selectedCaregiver
                      )?.name
                    }
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Patient</p>

                  <p className="mt-1 font-semibold">{patientName}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Date & Time</p>

                  <p className="mt-1 font-semibold">
                    {date} • {time}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
              >
                Go to Dashboard
              </Link>

              <button
                onClick={() => {
                  setBookingComplete(false);
                  setBookingId("");
                  setBookingStatus("PENDING");
                }}
                className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 hover:bg-white/5"
              >
                New Booking
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/dashboard">
            <h1 className="text-2xl font-extrabold">
              HEALTHCARE
              <span className="text-cyan-400">360</span>
            </h1>

            <p className="text-xs text-slate-500">
              Connected Healthcare Ecosystem
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/5"
          >
            Dashboard
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-cyan-400">
            HOME CARE SERVICES
          </p>

          <h1 className="mt-2 text-4xl font-extrabold md:text-5xl">
            Caregiver Booking
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Request home-care assistance for elderly patients, recovery
            support and daily healthcare needs.
          </p>
        </div>

        {/* Services */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold">Select Care Service</h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const selected = selectedService === service;

              return (
                <button
                  key={service}
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className={`rounded-2xl border p-5 text-left transition ${
                    selected
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:border-cyan-400/40"
                  }`}
                >
                  <div className="text-3xl">
                    {service === "Elderly Care"
                      ? "👴"
                      : service === "Post-Hospital Care"
                        ? "🏥"
                        : service === "Patient Assistance"
                          ? "🧑‍⚕️"
                          : service === "Daily Home Care"
                            ? "🏠"
                            : service === "Medicine Assistance"
                              ? "💊"
                              : "❤️"}
                  </div>

                  <h3 className="mt-4 font-bold">{service}</h3>

                  {selected && (
                    <p className="mt-2 text-xs font-semibold text-cyan-400">
                      ✓ Selected
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Caregivers */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold">Select Caregiver</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-3">
            {caregivers.map((caregiver) => {
              const selected = selectedCaregiver === caregiver.id;

              return (
                <button
                  key={caregiver.id}
                  type="button"
                  onClick={() => setSelectedCaregiver(caregiver.id)}
                  className={`rounded-2xl border p-6 text-left transition ${
                    selected
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:border-cyan-400/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-3xl">
                      {caregiver.icon}
                    </div>

                    <span className="rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold text-yellow-300">
                      ⭐ {caregiver.rating}
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-bold">
                    {caregiver.name}
                  </h3>

                  <p className="mt-2 text-sm text-cyan-400">
                    {caregiver.role}
                  </p>

                  <p className="mt-3 text-sm text-slate-500">
                    Experience: {caregiver.experience}
                  </p>

                  {selected && (
                    <div className="mt-5 text-sm font-bold text-cyan-400">
                      ✓ Caregiver Selected
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Booking Form */}
        <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-2xl">
              🏠
            </div>

            <div>
              <h2 className="text-2xl font-bold">Booking Details</h2>

              <p className="text-sm text-slate-500">
                Enter patient and home-visit information.
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {/* Patient */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Patient Name
              </label>

              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter patient name"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Mobile Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, ""))
                }
                maxLength={10}
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Home Address
              </label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                placeholder="Enter complete home address"
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Service Date
              </label>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            {/* Time */}
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Preferred Time
              </label>

              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-cyan-400"
              >
                <option value="">Select time</option>
                <option value="08:00 AM">08:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
                <option value="08:00 PM">08:00 PM</option>
              </select>
            </div>

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold">
                Additional Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Any special care instructions..."
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Summary */}
          {(selectedService || selectedCaregiver) && (
            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
              <p className="text-sm font-semibold text-cyan-400">
                BOOKING SUMMARY
              </p>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-slate-500">Service:</span>{" "}
                  {selectedService || "Not selected"}
                </p>

                <p>
                  <span className="text-slate-500">Caregiver:</span>{" "}
                  {caregivers.find(
                    (caregiver) => caregiver.id === selectedCaregiver
                  )?.name || "Not selected"}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={bookCaregiver}
            disabled={bookingLoading}
            className="mt-7 w-full rounded-xl bg-cyan-400 px-6 py-4 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {bookingLoading
              ? "Creating Booking..."
              : "👩‍⚕️ Confirm Caregiver Booking"}
          </button>
        </div>

        {/* Prototype Notice */}
        <div className="mt-8 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-5 text-sm leading-6 text-yellow-200/70">
          <strong className="text-yellow-300">Prototype Notice:</strong>{" "}
          Caregiver profiles shown here are demo profiles. Booking requests
          are now stored in the Healthcare 360 backend.
        </div>
      </section>
    </main>
  );
}