"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loginUser() {
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

      // Get the logged-in user's actual role
      const meResponse = await fetch("/api/auth/me", {
        cache: "no-store",
      });

      if (!meResponse.ok) {
        router.replace("/dashboard");
        return;
      }

      const meData = await meResponse.json();

      const role = meData?.user?.role;

      if (role === "DOCTOR") {
        router.replace("/doctor/dashboard");
        return;
      }

      if (role === "ADMIN") {
        router.replace("/admin/dashboard");
        return;
      }

      // PATIENT
      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-10 text-white">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <Link href="/">
            <h1 className="text-3xl font-extrabold tracking-tight">
              HEALTHCARE
              <span className="text-cyan-400">360</span>
            </h1>
          </Link>

          <p className="mt-2 text-sm text-slate-500">
            Connected Healthcare Ecosystem
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">

          <div className="mb-8">
            <p className="text-sm font-semibold text-cyan-400">
              WELCOME BACK
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Login to Healthcare 360
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Access your healthcare dashboard and AI Care Coordinator.
            </p>
          </div>

          <div className="space-y-5">

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-300"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={loginUser}
              disabled={loading}
              className="w-full rounded-xl bg-cyan-400 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </div>

          <div className="mt-7 text-center text-sm text-slate-400">
            Don't have an account?{" "}

            <Link
              href="/signup"
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Create Account
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-600">
          Healthcare 360 is currently a software prototype.
          Do not use this prototype for real medical emergencies.
        </p>

      </div>
    </main>
  );
}