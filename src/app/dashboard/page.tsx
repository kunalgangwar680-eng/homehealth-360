"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
};

const services = [
  {
    icon: "🤖",
    title: "AI Care Coordinator",
    description:
      "Your AI-powered healthcare coordination assistant.",
    href: "/ai-care",
    active: true,
    button: "Open AI Care →",
  },
  {
    icon: "👨‍⚕️",
    title: "Doctor Consultation",
    description:
      "Connect with doctors for online consultation.",
    href: "/doctor-consult",
    active: true,
    button: "Consult a Doctor →",
  },
  {
    icon: "🧪",
    title: "Lab Tests",
    description:
      "Book diagnostic tests and home sample collection.",
    href: "/lab-tests",
    active: true,
    button: "Book Lab Test →",
  },
  {
    icon: "📄",
    title: "Health Records",
    description:
      "Manage your reports, prescriptions and health records.",
    href: "/health-records",
    active: true,
    button: "Open Health Records →",
  },
  {
    icon: "👩‍⚕️",
    title: "Caregiver Booking",
    description:
      "Find and request home-care assistance.",
    href: "/caregiver-booking",
    active: true,
    button: "Book Caregiver →",
  },
  {
    icon: "📅",
    title: "Appointments",
    description:
      "Manage your upcoming healthcare appointments.",
    href: "/doctor-consult",
    active: true,
    button: "View Appointments →",
  },
];

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [labBookingCount, setLabBookingCount] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  const [caregiverBookingCount, setCaregiverBookingCount] =
    useState(0);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // 1. Check logged-in user
        const userResponse = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const userData = await userResponse.json();

        if (
          !userResponse.ok ||
          !userData.authenticated ||
          !userData.user
        ) {
          router.replace("/login");
          return;
        }

        setUser(userData.user);

        // 2. Load all dashboard data from database APIs
        const [
          appointmentResponse,
          labResponse,
          healthRecordResponse,
          caregiverResponse,
        ] = await Promise.all([
          fetch("/api/appointments", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch("/api/lab-bookings", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch("/api/health-records", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),

          fetch("/api/caregiver-bookings", {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        // Convert responses to JSON
        const [
          appointmentData,
          labData,
          healthRecordData,
          caregiverData,
        ] = await Promise.all([
          appointmentResponse.json(),
          labResponse.json(),
          healthRecordResponse.json(),
          caregiverResponse.json(),
        ]);

        // 3. Appointment count
        if (appointmentResponse.ok) {
          setAppointmentCount(
            Array.isArray(appointmentData.appointments)
              ? appointmentData.appointments.length
              : 0
          );
        }

        // 4. Lab booking count
        if (labResponse.ok) {
          setLabBookingCount(
            Array.isArray(labData.bookings)
              ? labData.bookings.length
              : 0
          );
        }

        // 5. Health records count
        if (healthRecordResponse.ok) {
          setRecordCount(
            Array.isArray(healthRecordData.records)
              ? healthRecordData.records.length
              : 0
          );
        }

        // 6. Caregiver booking count
        if (caregiverResponse.ok) {
          setCaregiverBookingCount(
            Array.isArray(caregiverData.bookings)
              ? caregiverData.bookings.length
              : 0
          );
        }

        console.log("DASHBOARD DATA:", {
          appointments: appointmentData,
          labBookings: labData,
          healthRecords: healthRecordData,
          caregiverBookings: caregiverData,
        });
      } catch (error) {
        console.error("DASHBOARD LOAD ERROR:", error);
        router.replace("/login");
      } finally {
        setLoadingUser(false);
      }
    }

    loadDashboard();
  }, [router]);

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }

    router.replace("/login");
  }

  if (loadingUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="text-4xl">🏥</div>

          <p className="mt-4 text-slate-400">
            Loading your healthcare dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/dashboard">
            <h1 className="text-2xl font-extrabold">
              HEALTHCARE
              <span className="text-cyan-400">360</span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-400 sm:block">
              {user?.name}
            </span>

            <button
              onClick={logout}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold transition hover:border-red-400/40 hover:text-red-400"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Welcome */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <p className="text-sm font-semibold text-cyan-400">
          PATIENT DASHBOARD
        </p>

        <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
          Welcome, {user?.name} 👋
        </h1>

        <p className="mt-3 max-w-2xl text-slate-400">
          Manage your healthcare services, appointments,
          records and consultations from one place.
        </p>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Appointments */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-500">
              Appointments
            </p>

            <p className="mt-2 text-3xl font-bold">
              {appointmentCount}
            </p>

            <p className="mt-1 text-xs text-cyan-400">
              From database
            </p>
          </div>

          {/* Lab Bookings */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-500">
              Lab Bookings
            </p>

            <p className="mt-2 text-3xl font-bold">
              {labBookingCount}
            </p>

            <p className="mt-1 text-xs text-cyan-400">
              From database
            </p>
          </div>

          {/* Health Records */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-500">
              Health Records
            </p>

            <p className="mt-2 text-3xl font-bold">
              {recordCount}
            </p>

            <p className="mt-1 text-xs text-cyan-400">
              From database
            </p>
          </div>

          {/* Caregiver Bookings */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-500">
              Caregiver Bookings
            </p>

            <p className="mt-2 text-3xl font-bold">
              {caregiverBookingCount}
            </p>

            <p className="mt-1 text-xs text-cyan-400">
              From database
            </p>
          </div>
        </div>

        {/* Services */}
        <div className="mt-12">
          <div>
            <p className="text-sm font-semibold text-cyan-400">
              HEALTHCARE SERVICES
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              What would you like to do?
            </h2>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-cyan-400/30 hover:bg-white/[0.07]"
              >
                <div className="text-4xl">
                  {service.icon}
                </div>

                <h3 className="mt-5 text-xl font-bold">
                  {service.title}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">
                  {service.description}
                </p>

                {service.active ? (
                  <Link
                    href={service.href}
                    className="mt-6 inline-block rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
                  >
                    {service.button}
                  </Link>
                ) : (
                  <span className="mt-6 inline-block rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-500">
                    {service.button}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* AI Care */}
        <div className="mt-12 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-8">
          <p className="text-sm font-semibold text-cyan-400">
            AI CARE COORDINATOR
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            Your healthcare, coordinated in one place.
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-slate-400">
            Healthcare 360 connects your doctor consultations,
            laboratory services, health records and caregiving
            services through a unified healthcare experience.
          </p>

          <Link
            href="/ai-care"
            className="mt-6 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 hover:bg-cyan-300"
          >
            Open AI Care Coordinator →
          </Link>
        </div>

        {/* Prototype Notice */}
        <div className="mt-10 rounded-2xl border border-yellow-400/10 bg-yellow-400/5 p-5 text-sm leading-6 text-yellow-300/80">
          Healthcare 360 is currently a software prototype.
          Do not use this prototype for real medical emergencies.
        </div>
      </section>
    </main>
  );
}