"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

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
        setError(data?.error || "Invalid email or password.");
        return;
      }

      /*
       * Save the logged-in user for the existing
       * HOMEHEALTH 360 frontend flow.
       */
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "healthcare360_user",
          JSON.stringify(data.user || data)
        );

        localStorage.setItem("healthcare360_logged_in", "true");
      }

      /*
       * Keep role-based redirect if backend returns a role.
       */
      const user = data.user || data;
      const role = user?.role;

      if (role === "ADMIN") {
        router.push("/admin");
      } else if (role === "LAB") {
        router.push("/lab-dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">

        {/* ================= LEFT SIDE ================= */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-emerald-700">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          >
            <source
              src="/homehealth360-ai-healthcare-hero.mp4"
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 bg-emerald-900/50" />

          <div className="relative z-10 flex h-full w-full flex-col justify-between p-12 text-white">

            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                  <span className="text-2xl font-bold">H</span>
                </div>

                <div>
                  <h1 className="text-xl font-bold">
                    HOMEHEALTH 360
                  </h1>

                  <p className="text-sm text-emerald-100">
                    AI-Powered Healthcare
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">
                Welcome Back
              </p>

              <h2 className="text-4xl font-bold leading-tight xl:text-5xl">
                Your healthcare,
                <br />
                connected in one place.
              </h2>

              <p className="mt-6 max-w-lg text-base leading-7 text-emerald-50">
                Manage your healthcare journey, book services, access health
                records and stay connected with your care network.
              </p>
            </div>

            <div className="text-sm text-emerald-100">
              © {new Date().getFullYear()} HOMEHEALTH 360
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex w-full items-center justify-center px-5 py-10 lg:w-1/2">
          <div className="w-full max-w-md">

            {/* Mobile Logo */}
            <div className="mb-8 flex items-center justify-center lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <span className="text-xl font-bold">H</span>
                </div>

                <div>
                  <h1 className="font-bold text-gray-900">
                    HOMEHEALTH 360
                  </h1>

                  <p className="text-xs text-gray-500">
                    AI-Powered Healthcare
                  </p>
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-emerald-600">
                Welcome Back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Access your HOMEHEALTH 360 healthcare dashboard.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* ================= LOGIN FORM ================= */}
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
                    onClick={() => {
                      alert(
                        "For the demo, please contact the administrator to reset your password."
                      );
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  required
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  Remember me
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-emerald-600 px-4 py-3.5 font-semibold text-white shadow-sm transition hover:bg-emerald-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing In..." : "Login"}
              </button>
            </form>

            {/* ================= CREATE ACCOUNT ================= */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
                OR
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account yet?
              </p>

              <Link
                href="/signup"
                className="mt-2 inline-block font-semibold text-emerald-600 transition hover:text-emerald-700 hover:underline"
              >
                Create Account
              </Link>
            </div>

            {/* Bottom text */}
            <p className="mt-7 text-center text-xs leading-5 text-gray-400">
              By continuing, you agree to the HOMEHEALTH 360 terms and
              privacy policy.
            </p>

          </div>
        </div>
      </div>
    </main>
  );
}