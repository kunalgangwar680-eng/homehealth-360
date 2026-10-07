"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("Please enter your full name.");
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("Please accept the terms to create your account.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
        }),
      });

      const responseText = await response.text();

      let data: any = {};

      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          `Server returned an invalid response (${response.status}).`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to create your account."
        );
      }

      /*
       * Backend signup successful.
       *
       * Store the user information locally as the existing
       * HomeHealth 360 frontend expects these keys.
       */
      if (data?.user) {
        localStorage.setItem(
          "healthcare360_user",
          JSON.stringify(data.user)
        );
      }

      localStorage.setItem("healthcare360_logged_in", "true");

      setSuccess("Account created successfully. Opening your dashboard...");

      /*
       * Small delay so the user can see the success message.
       */
      setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 500);
    } catch (err: any) {
      console.error("SIGNUP ERROR:", err);

      setError(
        err?.message || "Something went wrong while creating your account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f5f2] text-[#26362e]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">

        {/* LEFT BRAND PANEL */}

        <section className="relative hidden overflow-hidden bg-[#0d3027] lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[#2d7960]/20 blur-3xl" />

          <div className="absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-[#579079]/15 blur-3xl" />

          <div className="relative z-10 p-10 xl:p-14">

            <Link href="/" className="inline-block">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-[11px] bg-white text-[#579079]">
                  <span className="text-[21px]">♡</span>
                </div>

                <div>
                  <div className="text-[19px] font-bold tracking-[-0.04em] text-white">
                    HOMEHEALTH
                  </div>

                  <div className="mt-0.5 text-[10px] font-bold tracking-[0.2em] text-[#b4cbbf]">
                    360
                  </div>
                </div>

              </div>

            </Link>

            <div className="mt-20 max-w-[510px]">

              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#91b3a3]">
                Private health intelligence, centered on you
              </div>

              <h1 className="mt-5 text-[48px] font-semibold leading-[1.03] tracking-[-0.055em] text-white xl:text-[58px]">
                Your health story,
                <span className="block text-[#8fc8ad]">
                  clearly connected.
                </span>
              </h1>

              <p className="mt-6 max-w-[450px] text-[14px] leading-7 text-[#b9ccc3]">
                Bring your health records, reports, reminders and
                care information into one calm, secure workspace.
              </p>

            </div>

          </div>

          <div className="relative z-10 p-10 pt-0 xl:p-14 xl:pt-0">

            <div className="max-w-[430px] border-t border-white/[0.1] pt-5">

              <div className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[#8ca99d]">
                Secure by design
              </div>

              <p className="mt-2 text-[11px] leading-5 text-[#9fb6ad]">
                Your healthcare workspace is protected with
                secure authentication and permission-based access.
              </p>

            </div>

          </div>
        </section>

        {/* RIGHT SIGNUP */}

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">

          <div className="w-full max-w-[470px]">

            {/* MOBILE BRAND */}

            <div className="mb-10 lg:hidden">

              <Link href="/" className="inline-flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#0d3027] text-white">
                  ♡
                </div>

                <div>
                  <div className="text-[16px] font-bold tracking-[-0.04em] text-[#26362e]">
                    HOMEHEALTH
                  </div>

                  <div className="text-[8px] font-bold tracking-[0.18em] text-[#718178]">
                    360
                  </div>
                </div>

              </Link>

            </div>

            {/* HEADER */}

            <div>

              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#87918b]">
                HOMEHEALTH 360
              </div>

              <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.045em] text-[#26362e]">
                Create your account
              </h2>

              <p className="mt-2 text-[12px] leading-5 text-[#7d8881]">
                Start your personal health workspace securely.
              </p>

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSignup}
              className="mt-7"
            >

              {/* FULL NAME */}

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#65736b]"
                >
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  disabled={loading}
                  className="h-12 w-full rounded-[10px] border border-[#dfe4df] bg-white px-4 text-[13px] text-[#26362e] outline-none transition placeholder:text-[#a1aaa5] focus:border-[#6f9a86] focus:ring-2 focus:ring-[#dcebe3]"
                />

              </div>

              {/* EMAIL */}

              <div className="mt-4">

                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#65736b]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  disabled={loading}
                  className="h-12 w-full rounded-[10px] border border-[#dfe4df] bg-white px-4 text-[13px] text-[#26362e] outline-none transition placeholder:text-[#a1aaa5] focus:border-[#6f9a86] focus:ring-2 focus:ring-[#dcebe3]"
                />

              </div>

              {/* PASSWORD */}

              <div className="mt-4">

                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#65736b]"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  disabled={loading}
                  className="h-12 w-full rounded-[10px] border border-[#dfe4df] bg-white px-4 text-[13px] text-[#26362e] outline-none transition placeholder:text-[#a1aaa5] focus:border-[#6f9a86] focus:ring-2 focus:ring-[#dcebe3]"
                />

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="mt-4">

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#65736b]"
                >
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Repeat your password"
                  disabled={loading}
                  className="h-12 w-full rounded-[10px] border border-[#dfe4df] bg-white px-4 text-[13px] text-[#26362e] outline-none transition placeholder:text-[#a1aaa5] focus:border-[#6f9a86] focus:ring-2 focus:ring-[#dcebe3]"
                />

              </div>

              {/* TERMS */}

              <label className="mt-5 flex cursor-pointer items-start gap-3">

                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(event) => setAgree(event.target.checked)}
                  disabled={loading}
                  className="mt-0.5 h-4 w-4 rounded border-[#cfd8d2] accent-[#28735a]"
                />

                <span className="text-[10px] leading-5 text-[#7e8982]">
                  I understand that HOMEHEALTH 360 provides
                  healthcare coordination and informational support,
                  not autonomous diagnosis or treatment.
                </span>

              </label>

              {/* ERROR */}

              {error && (
                <div className="mt-4 rounded-[10px] border border-[#efd4d1] bg-[#fff5f4] px-4 py-3 text-[11px] leading-5 text-[#a04b42]">
                  {error}
                </div>
              )}

              {/* SUCCESS */}

              {success && (
                <div className="mt-4 rounded-[10px] border border-[#cfe4d6] bg-[#f0f8f3] px-4 py-3 text-[11px] leading-5 text-[#39745b]">
                  {success}
                </div>
              )}

              {/* CREATE ACCOUNT BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex min-h-[50px] w-full items-center justify-center gap-2 rounded-[10px] bg-[#147862] px-5 text-[12px] font-semibold text-white shadow-[0_5px_16px_rgba(30,102,79,0.16)] transition hover:bg-[#116951] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Creating your account...
                  </>
                ) : (
                  <>→ Create account securely</>
                )}
              </button>

            </form>

            {/* LOGIN */}

            <div className="mt-7 border-t border-[#e4e8e4] pt-5 text-center">

              <span className="text-[11px] text-[#89938d]">
                Already have an account?
              </span>

              <Link
                href="/login"
                className="ml-1.5 text-[11px] font-semibold text-[#39745f] hover:text-[#245b48] hover:underline"
              >
                Sign in
              </Link>

            </div>

            <div className="mt-6 text-center text-[9px] leading-4 text-[#a0a8a3]">
              Your health information remains protected and is
              accessed according to your permissions.
            </div>

          </div>

        </section>

      </div>
    </main>
  );
}