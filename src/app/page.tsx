"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    try {
      /*
        =========================================================
        IMPORTANT:
        YAHAN APNA EXISTING LOGIN API / LOGIN LOGIC RAKHNA HAI.
        Aapka backend already working hai, isliye usko change
        mat karna.
        =========================================================
      */

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message || "Invalid email or password");
        return;
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("healthcare360_logged_in", "true");

        if (data?.user) {
          localStorage.setItem(
            "healthcare360_user",
            JSON.stringify(data.user)
          );
        }
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f8f5] text-[#17362d]">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            LEFT SIDE
        ===================================================== */}

        <section className="relative min-h-[720px] overflow-hidden bg-[#0c2d24] lg:min-h-screen">

          {/* VIDEO */}

          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src="/homehealth360-ai-healthcare-hero.mp4"
              type="video/mp4"
            />
          </video>

          {/* 
            VIDEO VISIBILITY
            Pehle dark overlay zyada tha.
            Ab video ko clearly visible rakha hai.
          */}

          <div className="absolute inset-0 bg-[#073b2f]/55" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0b2d24]/95 via-[#0b2d24]/35 to-[#0b2d24]/30" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#0b2d24]/45 to-transparent" />

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="relative z-10 px-8 pt-8 sm:px-10 lg:px-12 lg:pt-10">

            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm">
                <span className="text-sm text-[#0c8068]">
                  ♡
                </span>
              </div>

              <div className="leading-none">

                <div className="text-[13px] font-semibold tracking-[-0.02em] text-white">
                  HOMEHEALTH
                </div>

                <div className="mt-1 text-[7px] font-bold tracking-[0.08em] text-white/80">
                  360
                </div>

              </div>

            </Link>

          </div>

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="relative z-10 flex min-h-[620px] flex-col justify-end px-8 pb-10 sm:px-10 lg:min-h-[calc(100vh-90px)] lg:px-12 lg:pb-12">

            {/* BADGE */}

            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-[#9ed9c1]/30 bg-[#0c5a47]/50 px-3 py-1.5 backdrop-blur-md">

              <span className="h-1.5 w-1.5 rounded-full bg-[#c7f3d8]" />

              <span className="text-[10px] font-medium tracking-[0.03em] text-[#d6f3e2]">
                Private health intelligence, centered on you
              </span>

            </div>

            {/* HEADLINE */}

            <h1 className="max-w-[620px] text-5xl font-normal leading-[0.98] tracking-[-0.045em] text-white sm:text-6xl lg:text-[4.3rem] xl:text-[4.8rem]">

              Your health story,
              <br />

              clearly connected.

            </h1>

            {/* DESCRIPTION */}

            <p className="mt-6 max-w-[570px] text-sm leading-6 text-white/75 sm:text-base sm:leading-7">

              Bring reports, appointments, reminders, and trusted family
              <br className="hidden sm:block" />
              support into one calm, secure place—guided by responsible
              <br className="hidden sm:block" />
              AI.

            </p>

            {/* =================================================
                HEALTH SNAPSHOT CARD
            ================================================= */}

            <div className="mt-7 max-w-[585px] rounded-2xl border border-[#9ed9c1]/20 bg-[#104b3c]/75 p-4 shadow-2xl backdrop-blur-xl sm:p-5">

              {/* TOP */}

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#286453]">
                    AM
                  </div>

                  <div>

                    <p className="text-[11px] font-medium text-white">
                      Good morning, Alex
                    </p>

                    <p className="mt-0.5 text-[9px] text-white/50">
                      Health record updated today
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-2xl font-light text-[#82d8b3]">
                    82
                  </p>

                  <p className="text-[8px] text-white/45">
                    health snapshot
                  </p>

                </div>

              </div>

              {/* DIVIDER */}

              <div className="my-4 h-px bg-[#9ed9c1]/20" />

              {/* BOTTOM */}

              <div className="grid grid-cols-3 gap-3">

                <div>
                  <p className="text-[9px] text-white/45">
                    Heart health
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-white">
                    On track
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-white/45">
                    Next action
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-[#d5d96a]">
                    Book eye exam
                  </p>
                </div>

                <div>
                  <p className="text-[9px] text-white/45">
                    Family
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-white">
                    3 connected
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            RIGHT SIDE
        ===================================================== */}

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f9f6] px-6 py-12 sm:px-10">

          {/* subtle background */}

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(170,210,185,0.16),transparent_30%),radial-gradient(circle_at_15%_85%,rgba(198,220,203,0.12),transparent_30%)]" />

          {/* LOGIN CARD */}

          <div className="relative z-10 w-full max-w-[430px] rounded-[18px] border border-[#e5e9e5] bg-white p-7 shadow-[0_18px_55px_rgba(28,55,43,0.10)] sm:p-8">

            {/* HEADER */}

            <div>

              <h2 className="text-[25px] font-semibold tracking-[-0.035em] text-[#183b32]">
                Welcome back
              </h2>

              <p className="mt-1 max-w-[270px] text-[12px] leading-[1.35] text-[#8b9892]">
                Sign in to continue to your personal health workspace.
              </p>

            </div>

            {/* GOOGLE */}

            <button
              type="button"
              className="mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#dfe5e1] bg-white text-[13px] font-medium text-[#45534d] transition hover:bg-[#f8faf8]"
            >

              <span className="flex h-4 w-4 items-center justify-center text-[11px] font-bold text-[#4285f4]">
                ■
              </span>

              Continue with Google

            </button>

            {/* DIVIDER */}

            <div className="my-5 flex items-center gap-3">

              <div className="h-px flex-1 bg-[#e1e6e2]" />

              <span className="text-[9px] font-medium tracking-[0.08em] text-[#99a39e]">
                OR USE EMAIL
              </span>

              <div className="h-px flex-1 bg-[#e1e6e2]" />

            </div>

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-3"
            >

              {/* EMAIL */}

              <div>

                <label
                  htmlFor="email"
                  className="mb-1.5 block text-[11px] font-medium text-[#53615b]"
                >
                  Email address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  required
                  className="h-10 w-full rounded-lg border border-[#dfe5e1] bg-white px-3 text-[13px] text-[#243d34] outline-none transition placeholder:text-[#8d9893] focus:border-[#21866c] focus:ring-2 focus:ring-[#21866c]/10"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <label
                  htmlFor="password"
                  className="mb-1.5 block text-[11px] font-medium text-[#53615b]"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="h-10 w-full rounded-lg border border-[#dfe5e1] bg-white px-3 text-[13px] text-[#243d34] outline-none transition placeholder:text-[#8d9893] focus:border-[#21866c] focus:ring-2 focus:ring-[#21866c]/10"
                />

              </div>

              {/* REMEMBER + FORGOT */}

              <div className="flex items-center justify-between pt-0.5">

                <label className="flex cursor-pointer items-center gap-1.5">

                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-3.5 w-3.5 accent-[#23876d]"
                  />

                  <span className="text-[10px] text-[#53615b]">
                    Remember this device
                  </span>

                </label>

                <button
                  type="button"
                  className="text-[10px] font-medium text-[#24806b] hover:underline"
                >
                  Forgot password?
                </button>

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-1 h-10 rounded-lg bg-[#087c64] px-5 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#076e59] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading
                  ? "Signing in..."
                  : "→ Sign in securely"}

              </button>

            </form>

            {/* PASSKEY */}

            <button
              type="button"
              className="mt-4 block w-full text-center text-[11px] font-medium text-[#187762] underline underline-offset-2 hover:text-[#0b5f4e]"
            >
              Sign in with a passkey
            </button>

          </div>

        </section>

      </div>

      {/* =====================================================
          RESPONSIVE / EXTRA STYLING
      ===================================================== */}

      <style jsx global>{`

        html,
        body {
          margin: 0;
          padding: 0;
          background: #f7f9f6;
        }

        * {
          box-sizing: border-box;
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #243d34;
          transition: background-color 5000s ease-in-out 0s;
        }

        @media (max-width: 1023px) {

          .login-mobile-left {
            min-height: 650px;
          }

        }

        @media (max-width: 640px) {

          h1 {
            font-size: 3rem !important;
          }

        }

      `}</style>

    </main>
  );
}