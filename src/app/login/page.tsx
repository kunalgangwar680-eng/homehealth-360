"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LoginResponse = {
  success?: boolean;
  error?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || !data?.success || !data?.user) {
        throw new Error(
          data?.error || "Invalid email or password."
        );
      }

      if (remember) {
        localStorage.setItem(
          "healthcare360_remember_device",
          "true"
        );
      } else {
        localStorage.removeItem(
          "healthcare360_remember_device"
        );
      }

      if (data.user.role === "DOCTOR") {
        router.replace("/doctor/dashboard");
        return;
      }

      if (data.user.role === "ADMIN") {
        router.replace("/admin/dashboard");
        return;
      }

      if (data.user.role === "LAB") {
        router.replace("/lab/dashboard");
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f6f3] text-[#25382f]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            LEFT PANEL
        ====================================================== */}

        <section className="relative hidden min-h-screen overflow-hidden bg-[#0d3027] lg:block">

          {/* Brand */}

          <div className="absolute left-9 top-7">
            <Link href="/login" className="block">
              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white text-[#579079]">
                  <span className="text-[17px] leading-none">
                    ♡
                  </span>
                </div>

                <div>
                  <div className="text-[16px] font-bold tracking-[-0.035em] text-white">
                    HOMEHEALTH
                  </div>

                  <div className="mt-0.5 text-[8px] font-bold tracking-[0.18em] text-[#b4cbbf]">
                    360
                  </div>
                </div>

              </div>
            </Link>
          </div>

          {/* Main left content */}

          <div className="absolute bottom-[50px] left-9 right-10">

            {/* Pill */}

            <div className="inline-flex items-center gap-2 rounded-full border border-[#6ca690]/25 bg-[#ffffff0d] px-3 py-1.5">

              <span className="h-1.5 w-1.5 rounded-full bg-[#82b8a2]" />

              <span className="text-[9px] font-medium tracking-[0.01em] text-[#bdd0c7]">
                Private health intelligence, centered on you
              </span>

            </div>

            {/* Heading */}

            <h1 className="mt-5 max-w-[470px] text-[38px] font-light leading-[1.03] tracking-[-0.05em] text-white xl:text-[42px]">
              Your health story,
              <br />
              clearly connected.
            </h1>

            {/* Description */}

            <p className="mt-5 max-w-[470px] text-[12px] leading-5 text-[#afc3ba]">
              Bring reports, appointments, reminders, and trusted
              family support into one calm, secure place—guided by
              responsible AI.
            </p>

            {/* Health snapshot mock card */}

            <div className="mt-7 max-w-[355px] rounded-[14px] border border-[#71a896]/20 bg-[#153d33] px-4 py-4 shadow-[0_12px_35px_rgba(0,0,0,0.12)]">

              {/* top row */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2.5">

                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#eef5ef] text-[9px] font-bold text-[#467564]">
                    AM
                  </div>

                  <div>
                    <div className="text-[9px] font-semibold text-white">
                      Good morning, Alex
                    </div>

                    <div className="text-[7px] text-[#91b0a2]">
                      Health record updated today
                    </div>
                  </div>

                </div>

                <div className="text-right">
                  <div className="text-[20px] font-semibold leading-none text-[#75b29b]">
                    82
                  </div>

                  <div className="mt-0.5 text-[7px] text-[#8eaaa0]">
                    health snapshot
                  </div>
                </div>

              </div>

              {/* divider */}

              <div className="my-3 border-t border-[#ffffff10]" />

              {/* bottom stats */}

              <div className="grid grid-cols-3 gap-3">

                <div>
                  <div className="text-[7px] text-[#719488]">
                    Heart health
                  </div>

                  <div className="mt-1 text-[9px] font-medium text-[#dce8e2]">
                    On track
                  </div>
                </div>

                <div>
                  <div className="text-[7px] text-[#719488]">
                    Next action
                  </div>

                  <div className="mt-1 text-[9px] font-medium text-[#e4c76a]">
                    Book eye exam
                  </div>
                </div>

                <div>
                  <div className="text-[7px] text-[#719488]">
                    Family
                  </div>

                  <div className="mt-1 text-[9px] font-medium text-[#dce8e2]">
                    3 connected
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* =====================================================
            RIGHT PANEL
        ====================================================== */}

        <section className="flex min-h-screen items-center justify-center bg-[#f5f6f3] px-5 py-10 sm:px-8">

          <div className="w-full max-w-[390px]">

            {/* Mobile brand */}

            <div className="mb-8 lg:hidden">
              <Link
                href="/login"
                className="inline-flex items-center gap-3"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-[#123a30] text-white">
                  <span className="text-[17px] leading-none">
                    ♡
                  </span>
                </div>

                <div>
                  <div className="text-[16px] font-bold tracking-[-0.035em] text-[#274137]">
                    HOMEHEALTH
                  </div>

                  <div className="text-[8px] font-bold tracking-[0.18em] text-[#719084]">
                    360
                  </div>
                </div>
              </Link>
            </div>

            {/* Login card */}

            <section className="rounded-[17px] bg-white px-5 py-6 shadow-[0_16px_45px_rgba(35,55,46,0.08)] sm:px-6 sm:py-7">

              {/* Heading */}

              <div>
                <h2 className="text-[22px] font-semibold tracking-[-0.035em] text-[#2c4037]">
                  Welcome back
                </h2>

                <p className="mt-1 text-[10px] leading-4 text-[#8a948f]">
                  Sign in to continue to your personal health
                  <br />
                  workspace.
                </p>
              </div>

              {/* Google */}

              <button
                type="button"
                disabled
                className="mt-5 flex h-[36px] w-full items-center justify-center gap-2 rounded-[9px] border border-[#e2e6e2] bg-white text-[10px] font-medium text-[#4f5e57] opacity-100"
              >
                <span className="flex h-4 w-4 items-center justify-center text-[11px] font-bold text-[#4d82ee]">
                  ■
                </span>

                Continue with Google
              </button>

              {/* Divider */}

              <div className="my-4 flex items-center gap-3">

                <span className="h-px flex-1 bg-[#e8ebe8]" />

                <span className="text-[8px] font-medium uppercase tracking-[0.08em] text-[#a0a8a4]">
                  OR USE EMAIL
                </span>

                <span className="h-px flex-1 bg-[#e8ebe8]" />

              </div>

              {/* Error */}

              {error && (
                <div className="mb-4 rounded-[9px] border border-[#ecd1ce] bg-[#fff5f4] px-3 py-2.5 text-[9px] leading-4 text-[#a24e47]">
                  {error}
                </div>
              )}

              {/* Login form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-3"
              >

                {/* Email */}

                <label className="block">

                  <span className="mb-1.5 block text-[9px] font-semibold text-[#5f6e67]">
                    Email address
                  </span>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="alex.morgan@example.com"
                    autoComplete="email"
                    required
                    className="h-[37px] w-full rounded-[8px] border border-[#dfe4df] bg-white px-3 text-[10px] text-[#35463e] outline-none transition placeholder:text-[#9ba49f] focus:border-[#78a38e] focus:ring-2 focus:ring-[#e1eee6]"
                  />

                </label>

                {/* Password */}

                <label className="block">

                  <span className="mb-1.5 block text-[9px] font-semibold text-[#5f6e67]">
                    Password
                  </span>

                  <input
                    type="password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="h-[37px] w-full rounded-[8px] border border-[#dfe4df] bg-white px-3 text-[10px] text-[#35463e] outline-none transition placeholder:text-[#a7afab] focus:border-[#78a38e] focus:ring-2 focus:ring-[#e1eee6]"
                  />

                </label>

                {/* Remember / Forgot */}

                <div className="flex items-center justify-between pt-0.5">

                  <label className="flex cursor-pointer items-center gap-1.5">

                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(event) =>
                        setRemember(event.target.checked)
                      }
                      className="h-[11px] w-[11px] accent-[#147862]"
                    />

                    <span className="text-[9px] text-[#718078]">
                      Remember this device
                    </span>

                  </label>

                  <button
                    type="button"
                    className="text-[9px] font-medium text-[#568975]"
                    onClick={() => {
                      setError(
                        "Password recovery is not connected yet."
                      );
                    }}
                  >
                    Forgot password?
                  </button>

                </div>

                {/* Sign in */}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 inline-flex min-h-[36px] items-center justify-center rounded-[8px] bg-[#147862] px-3.5 text-[10px] font-semibold text-white shadow-[0_3px_8px_rgba(36,96,76,0.14)] transition hover:bg-[#116951] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Signing in..."
                    : "→ Sign in securely"}
                </button>

              </form>

              {/* Passkey */}

              <button
                type="button"
                disabled
                className="mt-4 block w-full text-center text-[9px] font-medium text-[#4d8b79] underline underline-offset-2 opacity-100"
              >
                Sign in with a passkey
              </button>

              {/* Lab login */}

              <div className="mt-5 border-t border-[#edf0ed] pt-4 text-center">

                <div className="text-[8px] text-[#929b96]">
                  Are you a laboratory?
                </div>

                <Link
                  href="/lab/login"
                  className="mt-1 inline-block text-[9px] font-semibold text-[#4f806a] hover:text-[#315f4d]"
                >
                  Lab Login
                </Link>

              </div>

            </section>

            {/* Mobile supporting text */}

            <p className="mt-5 text-center text-[8px] leading-4 text-[#98a19c] lg:hidden">
              Private health intelligence, centered on you.
            </p>

          </div>
        </section>

      </div>
    </main>
  );
}