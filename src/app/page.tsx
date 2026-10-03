"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/" className="text-2xl font-bold">
            HEALTHCARE<span className="text-cyan-400">360</span>
          </Link>

          <div className="flex gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white/10"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-300"
            >
              Sign Up
            </Link>
          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24">

        <div className="max-w-4xl">

          <div className="mb-6 inline-block rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            AI-Powered Healthcare Ecosystem
          </div>

          <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
            Healthcare
            <span className="block text-cyan-400">
              360°
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Connect with doctors, laboratories, caregivers and
            AI-powered healthcare coordination from one platform.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link
              href="/signup"
              className="rounded-xl bg-cyan-400 px-7 py-4 font-bold text-slate-950 hover:bg-cyan-300"
            >
              Create Account
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/20 px-7 py-4 font-semibold hover:bg-white/10"
            >
              Login
            </Link>

          </div>

        </div>

        {/* Services */}
        <div className="mt-20 grid gap-5 md:grid-cols-3">

          {[
            ["🤖", "AI Care Coordinator"],
            ["👨‍⚕️", "Doctor Consultation"],
            ["🧪", "Home Sample Collection"],
            ["📄", "Digital Health Records"],
            ["👩‍⚕️", "Caregiver Booking"],
            ["🔔", "AI Follow-up"],
          ].map(([icon, title]) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="text-4xl">{icon}</div>

              <h3 className="mt-4 text-lg font-bold">
                {title}
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Connected through the Healthcare 360 ecosystem.
              </p>
            </div>
          ))}

        </div>

      </section>

    </main>
  );
}