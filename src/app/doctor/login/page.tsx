"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DoctorLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginDoctor() {
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      const meResponse = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      if (!meResponse.ok) {
        setError("Unable to verify your account.");
        setLoading(false);
        return;
      }

      const meData = await meResponse.json();
      const user = meData?.user;

      if (!user) {
        setError("Unable to verify your account.");
        setLoading(false);
        return;
      }

      if (user.role !== "DOCTOR") {
        setError(
          "This login is only for doctors. Please use Patient Login."
        );
        setLoading(false);
        return;
      }

      router.replace("/doctor/dashboard");
    } catch (error) {
      console.error("Doctor login error:", error);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10 text-white">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-3xl">
            👨‍⚕️
          </div>

          <p className="text-sm font-semibold tracking-[0.2em] text-cyan-400">
            HOMEHEALTH 360
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Doctor Login
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Sign in to access your doctor dashboard.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Doctor Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="doctor@example.com"
              autoComplete="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <button
            type="button"
            onClick={loginDoctor}
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-cyan-400 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Doctor Login"}
          </button>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-slate-400 transition hover:text-cyan-400"
            >
              ← Patient Login
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 text-center">
          <p className="text-sm text-slate-400">
            Are you a doctor and don't have an account?
          </p>

          <p className="mt-2 text-sm font-semibold text-cyan-400">
            Doctor registration will be available soon.
          </p>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-600">
          Doctor access is intended only for healthcare professionals.
          Account activity may be reviewed for healthcare safety and
          platform compliance.
        </p>

      </div>
    </main>
  );
}