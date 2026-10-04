"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const loginResponse = await fetch("/api/auth/login", {
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

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        setError(
          loginData?.error || "Invalid email or password."
        );
        return;
      }

      /*
       * Check the actual logged-in user's role.
       */
      const meResponse = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const meData = await meResponse.json();

      if (!meResponse.ok || !meData?.authenticated) {
        setError("Unable to verify your admin account.");
        return;
      }

      /*
       * Only ADMIN users can enter the Admin Panel.
       */
      if (meData?.user?.role !== "ADMIN") {
        setError(
          "This login is only for administrators."
        );
        return;
      }

      /*
       * Admin login successful.
       */
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/20">
            <span className="text-3xl">🛡️</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight">
            HOMEHEALTH 360
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Administrator Portal
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
          <div className="mb-6">
            <h2 className="text-xl font-semibold">
              Admin Login
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Sign in to manage the HOMEHEALTH 360 platform.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Admin Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="admin@example.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter admin password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login as Admin"}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-5 text-center">
            <p className="text-xs text-slate-500">
              Restricted access • HOMEHEALTH 360 Administration
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}