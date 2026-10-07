"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LabLoginPage() {
  const router = useRouter();

  const [labId, setLabId] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const registeredLabId = params.get("labId");

    if (registeredLabId) {
      setLabId(registeredLabId.toUpperCase());
    }
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const normalizedLabId = labId.trim().toUpperCase();

    if (!normalizedLabId) {
      setError("Please enter your Lab ID.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/lab/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            labId: normalizedLabId,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.error ||
            "Invalid Lab ID or password."
        );
      }

      router.replace("/lab/dashboard");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f5f2] px-4 py-8 text-[#26362e]">

      <div className="w-full max-w-[450px]">

        {/* BRAND */}

        <div className="mb-7 text-center">

          <Link href="/dashboard" className="inline-block">
            <div className="text-[21px] font-bold tracking-[-0.035em] text-[#26372e]">
              HOMEHEALTH
            </div>

            <div className="mt-1 text-[9px] font-bold tracking-[0.22em] text-[#668072]">
              360 · LAB NETWORK
            </div>
          </Link>

        </div>

        {/* LOGIN CARD */}

        <section className="rounded-[20px] border border-[#e1e6e1] bg-white p-6 shadow-[0_12px_35px_rgba(30,55,45,0.06)] sm:p-8">

          <div className="text-center">

            {/* ICON */}

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[15px] bg-[#eef5ef] text-[#2d7159]">

              <svg
                width="27"
                height="27"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 3v6.5L5 17a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-4-7.5V3" />
                <path d="M7 15h10" />
                <path d="M8 3h8" />
                <path d="M9 18h.01" />
                <path d="M12 18h.01" />
                <path d="M15 18h.01" />
              </svg>

            </div>

            <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8c9791]">
              LAB ACCOUNT
            </div>

            <h1 className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#26372e]">
              Lab Login
            </h1>

            <p className="mx-auto mt-2 max-w-[340px] text-[11px] leading-5 text-[#7f8983]">
              Sign in to manage your laboratory profile,
              tests, home collection and patient orders.
            </p>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-[12px] border border-[#efd3d0] bg-[#fff5f4] px-4 py-3 text-[11px] font-medium leading-5 text-[#a34e46]">
              {error}
            </div>
          )}

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-4"
          >

            {/* LAB ID */}

            <label className="block">

              <span className="mb-1.5 block text-[10px] font-semibold text-[#65736b]">
                Lab ID
              </span>

              <input
                type="text"
                value={labId}
                onChange={(event) =>
                  setLabId(
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="LAB-XXXXXXXXXX"
                autoComplete="username"
                required
                className="h-[46px] w-full rounded-[10px] border border-[#dfe5e0] bg-white px-3 text-[12px] font-semibold tracking-[0.08em] text-[#33443b] outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-[#a0aaa4] focus:border-[#76a18c] focus:ring-2 focus:ring-[#dcebe2]"
              />

            </label>

            {/* PASSWORD */}

            <label className="block">

              <div className="mb-1.5 flex items-center justify-between">

                <span className="text-[10px] font-semibold text-[#65736b]">
                  Password
                </span>

              </div>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="h-[46px] w-full rounded-[10px] border border-[#dfe5e0] bg-white px-3 text-[12px] text-[#33443b] outline-none transition placeholder:text-[#a0aaa4] focus:border-[#76a18c] focus:ring-2 focus:ring-[#dcebe2]"
              />

            </label>

            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[48px] w-full items-center justify-center rounded-[12px] bg-[#147862] px-5 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(36,96,76,0.12)] transition hover:bg-[#116951] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : "Login to Lab"}
            </button>

          </form>

          {/* REGISTER */}

          <div className="mt-6 border-t border-[#edf0ec] pt-5 text-center">

            <div className="text-[10px] text-[#89938d]">
              Don&apos;t have a lab account?
            </div>

            <Link
              href="/lab/register"
              className="mt-2 inline-flex min-h-[42px] items-center justify-center rounded-[10px] border border-[#dfe6e1] px-5 text-[11px] font-semibold text-[#496e5b] transition hover:bg-[#f7faf7]"
            >
              Join as a Lab
            </Link>

          </div>

          {/* BACK */}

          <div className="mt-5 text-center">

            <Link
              href="/login"
              className="text-[10px] font-semibold text-[#89938d] hover:text-[#496e5b]"
            >
              ← Patient / Doctor Login
            </Link>

          </div>

        </section>

        {/* SECURITY NOTE */}

        <div className="mt-5 text-center text-[9px] leading-4 text-[#929b96]">
          Lab credentials are securely protected.
        </div>

      </div>

    </main>
  );
}