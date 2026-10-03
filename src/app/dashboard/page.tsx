"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: "PATIENT" | "DOCTOR" | "ADMIN";
};

export default function PatientDashboard() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data?.authenticated || !data?.user) {
        router.replace("/login");
        return;
      }

      const currentUser: User = data.user;

      if (currentUser.role === "DOCTOR") {
        router.replace("/doctor/dashboard");
        return;
      }

      if (currentUser.role === "ADMIN") {
        router.replace("/admin/dashboard");
        return;
      }

      setUser(currentUser);
    } catch (err) {
      console.error(err);
      setError("Unable to load your account.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
          <p className="text-slate-400">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <h1 className="text-xl font-bold text-red-400">
            Something went wrong
          </h1>

          <p className="mt-3 text-slate-300">
            {error}
          </p>

          <button
            onClick={loadUser}
            className="mt-6 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  const services = [
    {
      title: "AI Care Coordinator",
      description:
        "Get AI-powered healthcare guidance and assistance.",
      href: "/ai-care",
      icon: "🤖",
    },
    {
      title: "Doctor Consultation",
      description:
        "Find doctors and book your online consultation.",
      href: "/doctor-consult",
      icon: "👨‍⚕️",
    },
    {
      title: "Lab Tests",
      description:
        "Book diagnostic tests and home sample collection.",
      href: "/lab-tests",
      icon: "🧪",
    },
    {
      title: "Caregiver Booking",
      description:
        "Book healthcare caregivers for home assistance.",
      href: "/caregiver-booking",
      icon: "🧑‍⚕️",
    },
    {
      title: "Health Records",
      description:
        "Manage your medical reports and health records.",
      href: "/health-records",
      icon: "📋",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-wide text-cyan-400">
              HOMEHEALTH 360
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Patient Dashboard
            </h1>

            <p className="mt-2 text-slate-400">
              Welcome back, {user.name}.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              Account
            </p>

            <p className="mt-1 font-semibold text-cyan-400">
              Patient
            </p>
          </div>
        </div>

        <section className="mb-8 rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-slate-900 to-slate-950 p-6 sm:p-8">
          <p className="text-sm font-semibold text-cyan-400">
            YOUR HEALTHCARE HUB
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
            Your healthcare, connected in one place.
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-400">
            Access AI healthcare assistance, doctor consultations,
            lab services, caregivers, and your health records from
            one dashboard.
          </p>
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-2xl font-bold">
              Healthcare Services
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Choose a service to continue.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-cyan-500/50 hover:bg-slate-800"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-2xl">
                  {service.icon}
                </div>

                <h3 className="text-lg font-bold">
                  {service.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {service.description}
                </p>

                <div className="mt-5 text-sm font-semibold text-cyan-400">
                  Open Service →
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-6 py-5">
            <h2 className="text-xl font-bold">
              Account Information
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your registered account details.
            </p>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Name
              </p>

              <p className="mt-2 font-semibold">
                {user.name}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Email
              </p>

              <p className="mt-2 break-all font-semibold">
                {user.email}
              </p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">
                Phone
              </p>

              <p className="mt-2 font-semibold">
                {user.phone || "Not provided"}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5">
          <p className="text-sm leading-6 text-yellow-300">
            Healthcare 360 is currently a software prototype.
            Do not use this prototype for real medical emergencies.
          </p>
        </div>

      </div>
    </main>
  );
}