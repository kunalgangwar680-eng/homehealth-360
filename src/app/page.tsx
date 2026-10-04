"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const services = [
  {
    number: "01",
    icon: "✦",
    title: "AI Care Coordinator",
    text: "Intelligent coordination across the patient's healthcare journey.",
  },
  {
    number: "02",
    icon: "◉",
    title: "Doctor Consultation",
    text: "Connect patients with doctors through a modern digital care experience.",
  },
  {
    number: "03",
    icon: "⌁",
    title: "Home Diagnostics",
    text: "Coordinate diagnostic testing and convenient sample collection.",
  },
  {
    number: "04",
    icon: "▣",
    title: "Digital Health Records",
    text: "Keep healthcare reports and important records organized in one place.",
  },
  {
    number: "05",
    icon: "＋",
    title: "Caregiver Services",
    text: "Coordinate caregiving support for patients and families.",
  },
  {
    number: "06",
    icon: "↗",
    title: "AI Follow-up",
    text: "Continue the care journey with intelligent follow-up coordination.",
  },
];

const careFlow = [
  {
    step: "01",
    title: "Patient",
    text: "Health need detected",
  },
  {
    step: "02",
    title: "AI Care",
    text: "Understands and coordinates",
  },
  {
    step: "03",
    title: "Doctor",
    text: "Clinical consultation",
  },
  {
    step: "04",
    title: "Diagnostics",
    text: "Reports and testing",
  },
  {
    step: "05",
    title: "Follow-up",
    text: "Continuous care",
  },
];

function useScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
}

function AnimatedWord({
  text,
  startDelay = 0,
  gradient = false,
}: {
  text: string;
  startDelay?: number;
  gradient?: boolean;
}) {
  return (
    <span
      className={`inline-flex ${
        gradient
          ? "bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 bg-clip-text text-transparent"
          : ""
      }`}
      aria-label={text}
    >
      {text.split("").map((letter, index) => (
        <span
          key={`${text}-${index}`}
          className="hero-letter"
          style={{
            animationDelay: `${startDelay + index * 75}ms`,
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

    if (!finePointer) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let frame = 0;

    const move = (event: MouseEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const animate = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${ringX + 18}px, ${
          ringY + 18
        }px, 0)`;
      }

      frame = requestAnimationFrame(animate);
    };

    const enterInteractive = (
      event: Event
    ) => {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>(
        "[data-cursor]"
      );

      if (!element) return;

      const text =
        element.getAttribute("data-cursor") || "";

      ringRef.current?.classList.add("cursor-active");

      if (labelRef.current) {
        labelRef.current.textContent = text;
        labelRef.current.classList.add("cursor-label-visible");
      }
    };

    const leaveInteractive = (
      event: Event
    ) => {
      const target = event.target as HTMLElement | null;
      const element = target?.closest<HTMLElement>(
        "[data-cursor]"
      );

      if (!element) return;

      ringRef.current?.classList.remove("cursor-active");
      labelRef.current?.classList.remove(
        "cursor-label-visible"
      );
    };

    document.addEventListener("mousemove", move);
    document.addEventListener(
      "pointerover",
      enterInteractive
    );
    document.addEventListener(
      "pointerout",
      leaveInteractive
    );

    frame = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener(
        "mousemove",
        move
      );
      document.removeEventListener(
        "pointerover",
        enterInteractive
      );
      document.removeEventListener(
        "pointerout",
        leaveInteractive
      );
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        aria-hidden="true"
      />

      <div
        ref={ringRef}
        className="custom-cursor-ring"
        aria-hidden="true"
      />

      <div
        ref={labelRef}
        className="custom-cursor-label"
        aria-hidden="true"
      />
    </>
  );
}

export default function Home() {
  useScrollReveal();

  return (
    <>
      <CustomCursor />

      <main className="min-h-screen overflow-x-hidden bg-[#02070b] text-white">

        {/* ================= NAVBAR ================= */}

        <nav className="fixed inset-x-0 top-0 z-50">
          <div className="mx-auto max-w-[1500px] px-5 pt-4 md:px-8 md:pt-6">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#031017]/55 px-4 py-3 backdrop-blur-2xl md:px-6">

              <Link
                href="/"
                data-cursor="HOME"
                className="group flex items-center gap-3"
              >
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
                  <span className="text-sm font-black text-cyan-300">
                    H
                  </span>

                  <span className="absolute inset-0 animate-ping rounded-xl border border-cyan-300/10" />
                </div>

                <div className="leading-none">
                  <div className="text-base font-black tracking-[-0.04em] sm:text-lg md:text-xl">
                    HOMEHEALTH
                    <span className="ml-1 text-cyan-400">
                      360
                    </span>
                  </div>

                  <div className="mt-1 text-[7px] font-semibold tracking-[0.28em] text-slate-500 sm:text-[8px]">
                    AI HEALTHCARE PLATFORM
                  </div>
                </div>
              </Link>

              <div className="hidden items-center gap-8 lg:flex">
                <a
                  href="#platform"
                  data-cursor="EXPLORE"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 transition hover:text-cyan-300"
                >
                  Platform
                </a>

                <a
                  href="#care"
                  data-cursor="CARE FLOW"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 transition hover:text-cyan-300"
                >
                  Care Flow
                </a>

                <a
                  href="#services"
                  data-cursor="SERVICES"
                  className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300 transition hover:text-cyan-300"
                >
                  Services
                </a>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/login"
                  data-cursor="LOGIN"
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-bold transition hover:border-cyan-300/40 hover:bg-white/10 sm:px-5 sm:text-sm"
                >
                  Login
                </Link>

                <Link
                  href="/signup"
                  data-cursor="START"
                  className="rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:scale-[1.03] hover:bg-cyan-300 sm:px-5 sm:text-sm"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* ================= HERO ================= */}

        <section className="relative min-h-screen overflow-hidden">

          <video
            className="absolute inset-0 h-full w-full scale-105 object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            style={{
              filter:
                "brightness(1.18) contrast(1.18) saturate(1.12)",
            }}
          >
            <source
              src="/homehealth360-ai-healthcare-hero.mp4"
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 bg-[#02070b]/25" />

          <div className="absolute inset-0 bg-gradient-to-r from-[#02070b]/90 via-[#02070b]/35 to-transparent" />

          <div className="absolute inset-0 bg-gradient-to-t from-[#02070b] via-transparent to-[#02070b]/40" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_40%,rgba(34,211,238,0.10),transparent_28%)]" />

          <div className="relative z-10 mx-auto flex min-h-screen max-w-[1500px] items-center px-5 pb-20 pt-36 md:px-8">

            <div className="w-full">

              <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">

                {/* LEFT */}

                <div>

                  <div
                    data-reveal
                    className="reveal-item mb-7 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-[#041118]/55 px-4 py-2.5 backdrop-blur-xl"
                  >
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-70" />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-300" />
                    </span>

                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                      AI-Powered Healthcare
                    </span>
                  </div>

                  <h1 className="max-w-6xl text-[4.1rem] font-black leading-[0.86] tracking-[-0.065em] sm:text-[5.5rem] md:text-[7rem] lg:text-[8.2rem] xl:text-[9.3rem]">

                    <span className="block text-white">
                      <AnimatedWord
                        text="HOMEHEALTH"
                        startDelay={200}
                      />
                    </span>

                    <span className="mt-2 block">
                      <AnimatedWord
                        text="360"
                        startDelay={1100}
                        gradient
                      />
                    </span>

                  </h1>

                  <div
                    data-reveal
                    className="reveal-item reveal-delay-1 mt-7 max-w-3xl"
                  >
                    <h2 className="text-2xl font-semibold leading-tight text-white sm:text-3xl md:text-4xl">
                      One intelligent system
                      <span className="text-cyan-300">
                        {" "}for your entire health journey.
                      </span>
                    </h2>

                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg md:text-xl md:leading-8">
                      From AI care coordination to doctors,
                      diagnostics, caregivers and digital
                      health records — HOMEHEALTH 360
                      connects the pieces that matter.
                    </p>
                  </div>

                  <div
                    data-reveal
                    className="reveal-item reveal-delay-2 mt-9 flex flex-col gap-3 sm:flex-row"
                  >
                    <Link
                      href="/signup"
                      data-cursor="CREATE ACCOUNT"
                      className="rounded-2xl bg-cyan-400 px-8 py-4 text-center text-sm font-black text-slate-950 shadow-2xl shadow-cyan-500/25 transition hover:-translate-y-1 hover:bg-cyan-300 sm:text-base"
                    >
                      Start Your Care Journey
                    </Link>

                    <Link
                      href="/ai-care"
                      data-cursor="AI CARE"
                      className="rounded-2xl border border-white/15 bg-[#041118]/35 px-8 py-4 text-center text-sm font-bold text-white backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/10 sm:text-base"
                    >
                      Explore AI Care
                    </Link>
                  </div>

                  <div
                    data-reveal
                    className="reveal-item reveal-delay-3 mt-8 flex flex-wrap gap-2"
                  >
                    <span className="glass-pill">
                      AI Coordination
                    </span>
                    <span className="glass-pill">
                      Doctor Network
                    </span>
                    <span className="glass-pill">
                      Home Diagnostics
                    </span>
                    <span className="glass-pill">
                      Digital Records
                    </span>
                  </div>
                </div>

                {/* RIGHT AI PANEL */}

                <div
                  data-reveal
                  className="reveal-item lg:justify-self-end"
                >
                  <div className="relative mx-auto w-full max-w-[470px]">

                    <div className="absolute -inset-8 rounded-[3rem] bg-cyan-400/10 blur-3xl" />

                    <div className="relative overflow-hidden rounded-[2rem] border border-cyan-300/15 bg-[#041118]/70 p-5 shadow-[0_25px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-6">

                      <div className="flex items-center justify-between border-b border-white/10 pb-5">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-300/70">
                            HOMEHEALTH 360
                          </p>

                          <h3 className="mt-1 text-xl font-bold">
                            AI Care Center
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-200">
                            Active
                          </span>
                        </div>
                      </div>

                      {/* Health metrics */}

                      <div className="mt-5 grid grid-cols-2 gap-3">

                        <div className="metric-card">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Heart Rate
                          </span>
                          <div className="mt-2 flex items-end justify-between">
                            <span className="text-2xl font-black">
                              78
                            </span>
                            <span className="text-xs text-cyan-300">
                              BPM
                            </span>
                          </div>
                        </div>

                        <div className="metric-card">
                          <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            AI Status
                          </span>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
                            <span className="text-sm font-bold text-emerald-200">
                              Monitoring
                            </span>
                          </div>
                        </div>

                      </div>

                      {/* AI analysis */}

                      <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-300">
                            AI health analysis
                          </span>

                          <span className="text-xs text-cyan-300">
                            82%
                          </span>
                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                          <span>Data processing</span>
                          <span>Real-time</span>
                        </div>
                      </div>

                      {/* connected services */}

                      <div className="mt-4">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                          Connected care network
                        </p>

                        <div className="space-y-2">
                          {[
                            ["Patient", "Connected"],
                            ["Doctor", "Available"],
                            ["Laboratory", "Ready"],
                            ["Health Records", "Synced"],
                            ["AI Follow-up", "Active"],
                          ].map(([title, status], index) => (
                            <div
                              key={title}
                              className="network-row"
                              style={{
                                animationDelay: `${500 + index * 140}ms`,
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <span className="network-dot" />

                                <span className="text-sm font-medium text-slate-200">
                                  {title}
                                </span>
                              </div>

                              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
                                {status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-5 rounded-2xl border border-cyan-300/10 bg-cyan-300/5 p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
                            ✦
                          </div>

                          <div>
                            <p className="text-xs font-bold">
                              AI Care Coordinator
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-500">
                              Connecting your next best action
                            </p>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Scroll marker */}

          <a
            href="#platform"
            data-cursor="SCROLL"
            className="absolute bottom-7 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
              Explore
            </span>

            <span className="flex h-11 w-7 items-start justify-center rounded-full border border-white/15 bg-black/10 p-1.5 backdrop-blur-md">
              <span className="h-2.5 w-1 animate-bounce rounded-full bg-cyan-300" />
            </span>
          </a>

        </section>

        {/* ================= PLATFORM INTRO ================= */}

        <section
          id="platform"
          className="relative border-t border-white/10 bg-[#02070b] px-5 py-24 md:px-8 md:py-32"
        >
          <div className="mx-auto max-w-[1500px]">

            <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">

              <div data-reveal className="reveal-item">
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-400">
                  A New Healthcare Layer
                </p>

                <h2 className="mt-4 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  Built around
                  <span className="block text-cyan-400">
                    the patient.
                  </span>
                </h2>
              </div>

              <div
                data-reveal
                className="reveal-item reveal-delay-1"
              >
                <p className="max-w-4xl text-lg leading-8 text-slate-400 md:text-xl">
                  Healthcare services often live in
                  separate places. HOMEHEALTH 360 connects
                  them through an intelligent digital layer
                  designed around the patient's real-world
                  journey.
                </p>
              </div>

            </div>

            {/* animated principles */}

            <div className="mt-16 grid gap-4 md:grid-cols-3">

              {[
                ["01", "Understand", "AI interprets the patient's need."],
                ["02", "Connect", "The right healthcare service is connected."],
                ["03", "Continue", "Care stays connected after the consultation."],
              ].map(([num, title, text], index) => (
                <div
                  key={num}
                  data-reveal
                  className={`reveal-item ${
                    index === 1
                      ? "reveal-delay-1"
                      : index === 2
                      ? "reveal-delay-2"
                      : ""
                  } rounded-3xl border border-white/10 bg-white/[0.025] p-7`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-cyan-400">
                      {num}
                    </span>

                    <span className="h-px flex-1 bg-white/10 mx-4" />

                    <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                      SYSTEM
                    </span>
                  </div>

                  <h3 className="mt-8 text-2xl font-bold">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {text}
                  </p>

                </div>
              ))}

            </div>

          </div>
        </section>

        {/* ================= CARE FLOW ================= */}

        <section
          id="care"
          className="relative overflow-hidden border-t border-white/10 bg-[#030b10] px-5 py-24 md:px-8 md:py-32"
        >
          <div className="mx-auto max-w-[1500px]">

            <div
              data-reveal
              className="reveal-item max-w-3xl"
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-400">
                Intelligent Care Flow
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl md:text-6xl">
                Every step.
                <span className="text-cyan-400">
                  {" "}Connected.
                </span>
              </h2>
            </div>

            <div className="relative mt-16">

              <div className="absolute left-5 right-5 top-5 hidden h-px bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent md:block" />

              <div className="grid gap-4 md:grid-cols-5">
                {careFlow.map((item, index) => (
                  <div
                    key={item.step}
                    data-reveal
                    className={`reveal-item ${
                      index === 1
                        ? "reveal-delay-1"
                        : index === 2
                        ? "reveal-delay-2"
                        : index === 3
                        ? "reveal-delay-3"
                        : index === 4
                        ? "reveal-delay-4"
                        : ""
                    }`}
                  >
                    <div className="relative rounded-3xl border border-white/10 bg-[#061119]/75 p-6 backdrop-blur-xl">
                      <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-300/10 text-xs font-black text-cyan-300">
                        {item.step}
                      </div>

                      <h3 className="mt-7 text-xl font-bold">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {item.text}
                      </p>

                      <div className="mt-6 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-emerald-300/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                        connected
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ================= SERVICES ================= */}

        <section
          id="services"
          className="relative border-t border-white/10 bg-[#02070b] px-5 py-24 md:px-8 md:py-32"
        >
          <div className="mx-auto max-w-[1500px]">

            <div
              data-reveal
              className="reveal-item flex flex-col justify-between gap-6 md:flex-row md:items-end"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-400">
                  Platform Capabilities
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-[-0.04em] sm:text-5xl md:text-6xl">
                  One platform.
                  <span className="block text-cyan-400">
                    Multiple care layers.
                  </span>
                </h2>
              </div>

              <p className="max-w-xl text-sm leading-7 text-slate-500 md:text-right md:text-base">
                Designed to connect patients, healthcare
                professionals and support services through
                one intelligent digital experience.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <div
                  key={service.number}
                  data-reveal
                  data-cursor={service.title}
                  className={`reveal-item ${
                    index % 3 === 1
                      ? "reveal-delay-1"
                      : index % 3 === 2
                      ? "reveal-delay-2"
                      : ""
                  } service-card`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-black text-cyan-400">
                      {service.number}
                    </span>

                    <span className="text-xl text-cyan-300/70">
                      {service.icon}
                    </span>
                  </div>

                  <h3 className="mt-14 text-2xl font-bold">
                    {service.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    {service.text}
                  </p>

                  <div className="mt-8 h-px w-full bg-gradient-to-r from-cyan-300/35 via-white/10 to-transparent" />

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                      HOMEHEALTH 360
                    </span>

                    <span className="text-xs text-cyan-300 transition group-hover:translate-x-1">
                      ↗
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ================= CTA ================= */}

        <section className="relative overflow-hidden border-t border-white/10 bg-[#030b10] px-5 py-24 md:px-8 md:py-32">

          <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[120px]" />

          <div
            data-reveal
            className="reveal-item relative z-10 mx-auto max-w-4xl text-center"
          >
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-cyan-400">
              The next step in healthcare
            </p>

            <h2 className="mt-5 text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-5xl md:text-7xl">
              Your health.
              <span className="block text-cyan-400">
                Intelligently connected.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Experience an AI-powered healthcare
              ecosystem designed to connect the entire
              care journey.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                data-cursor="JOIN"
                className="rounded-2xl bg-cyan-400 px-8 py-4 font-black text-slate-950 shadow-2xl shadow-cyan-500/20 transition hover:-translate-y-1 hover:bg-cyan-300"
              >
                Create Your Account
              </Link>

              <Link
                href="/doctor/register"
                data-cursor="DOCTORS"
                className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold backdrop-blur-md transition hover:-translate-y-1 hover:border-cyan-300/30 hover:bg-white/10"
              >
                Join as a Doctor
              </Link>
            </div>
          </div>
        </section>

        {/* ================= FOOTER ================= */}

        <footer className="border-t border-white/10 bg-[#02070b] px-5 py-8 md:px-8">

          <div className="mx-auto flex max-w-[1500px] flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <div className="text-xl font-black tracking-[-0.04em]">
                HOMEHEALTH
                <span className="ml-1 text-cyan-400">
                  360
                </span>
              </div>

              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                AI Powered Healthcare Platform
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              <Link
                href="/login"
                data-cursor="LOGIN"
                className="transition hover:text-cyan-300"
              >
                Login
              </Link>

              <Link
                href="/signup"
                data-cursor="SIGN UP"
                className="transition hover:text-cyan-300"
              >
                Sign Up
              </Link>

              <Link
                href="/ai-care"
                data-cursor="AI CARE"
                className="transition hover:text-cyan-300"
              >
                AI Care
              </Link>

              <Link
                href="/doctor/register"
                data-cursor="DOCTOR"
                className="transition hover:text-cyan-300"
              >
                Doctor
              </Link>
            </div>

          </div>
        </footer>

        {/* ================= GLOBAL STYLES ================= */}

        <style jsx global>{`
          @media (pointer: fine) {
            body,
            a,
            button,
            input,
            textarea,
            select {
              cursor: none !important;
            }
          }

          .custom-cursor-dot {
            position: fixed;
            top: 0;
            left: 0;
            width: 7px;
            height: 7px;
            margin-left: -3.5px;
            margin-top: -3.5px;
            border-radius: 9999px;
            background: #67e8f9;
            box-shadow:
              0 0 10px rgba(103, 232, 249, 0.95),
              0 0 24px rgba(103, 232, 249, 0.45);
            pointer-events: none;
            z-index: 99999;
            will-change: transform;
          }

          .custom-cursor-ring {
            position: fixed;
            top: 0;
            left: 0;
            width: 34px;
            height: 34px;
            margin-left: -17px;
            margin-top: -17px;
            border: 1px solid rgba(103, 232, 249, 0.55);
            border-radius: 9999px;
            background: rgba(103, 232, 249, 0.035);
            pointer-events: none;
            z-index: 99998;
            backdrop-filter: blur(2px);
            transition:
              width 180ms ease,
              height 180ms ease,
              margin 180ms ease,
              background 180ms ease,
              border-color 180ms ease;
            will-change: transform;
          }

          .custom-cursor-ring.cursor-active {
            width: 52px;
            height: 52px;
            margin-left: -26px;
            margin-top: -26px;
            border-color: rgba(103, 232, 249, 0.8);
            background: rgba(103, 232, 249, 0.08);
          }

          .custom-cursor-label {
            position: fixed;
            top: 0;
            left: 0;
            padding: 6px 8px;
            border: 1px solid rgba(103, 232, 249, 0.2);
            border-radius: 8px;
            background: rgba(2, 7, 11, 0.82);
            color: #a5f3fc;
            font-size: 8px;
            font-weight: 800;
            letter-spacing: 0.14em;
            opacity: 0;
            pointer-events: none;
            z-index: 99997;
            backdrop-filter: blur(10px);
            white-space: nowrap;
            transition: opacity 140ms ease;
            will-change: transform;
          }

          .cursor-label-visible {
            opacity: 1;
          }

          .hero-letter {
            display: inline-block;
            opacity: 0;
            transform: translateY(28px) scale(0.96);
            filter: blur(8px);
            animation: heroLetterIn 760ms
              cubic-bezier(0.16, 1, 0.3, 1)
              forwards;
          }

          @keyframes heroLetterIn {
            0% {
              opacity: 0;
              transform: translateY(28px) scale(0.96);
              filter: blur(8px);
            }

            55% {
              opacity: 1;
            }

            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
              filter: blur(0);
            }
          }

          .glass-pill {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(2, 7, 11, 0.35);
            padding: 9px 13px;
            border-radius: 9999px;
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(14px);
          }

          .reveal-item {
            opacity: 0;
            transform: translateY(38px);
            filter: blur(8px);
            transition:
              opacity 850ms cubic-bezier(0.16, 1, 0.3, 1),
              transform 850ms cubic-bezier(0.16, 1, 0.3, 1),
              filter 850ms cubic-bezier(0.16, 1, 0.3, 1);
          }

          .reveal-item.is-visible {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }

          .reveal-delay-1 {
            transition-delay: 120ms;
          }

          .reveal-delay-2 {
            transition-delay: 240ms;
          }

          .reveal-delay-3 {
            transition-delay: 360ms;
          }

          .reveal-delay-4 {
            transition-delay: 480ms;
          }

          .metric-card {
            border: 1px solid rgba(255, 255, 255, 0.08);
            background: rgba(255, 255, 255, 0.025);
            border-radius: 18px;
            padding: 14px;
          }

          .network-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid rgba(255, 255, 255, 0.06);
            background: rgba(255, 255, 255, 0.025);
            border-radius: 14px;
            padding: 12px 13px;
            opacity: 0;
            transform: translateX(-10px);
            animation: networkIn 700ms
              cubic-bezier(0.16, 1, 0.3, 1)
              forwards;
          }

          .network-dot {
            width: 6px;
            height: 6px;
            border-radius: 9999px;
            background: #67e8f9;
            box-shadow:
              0 0 8px rgba(103, 232, 249, 0.75),
              0 0 18px rgba(103, 232, 249, 0.25);
          }

          @keyframes networkIn {
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          .service-card {
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 28px;
            background:
              linear-gradient(
                145deg,
                rgba(255, 255, 255, 0.04),
                rgba(255, 255, 255, 0.018)
              );
            padding: 28px;
            transition:
              transform 280ms ease,
              border-color 280ms ease,
              background 280ms ease,
              box-shadow 280ms ease;
          }

          .service-card::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 30%;
            height: 1px;
            background: linear-gradient(
              90deg,
              rgba(103, 232, 249, 0.7),
              transparent
            );
          }

          .service-card:hover {
            transform: translateY(-6px);
            border-color: rgba(103, 232, 249, 0.24);
            background:
              linear-gradient(
                145deg,
                rgba(103, 232, 249, 0.055),
                rgba(255, 255, 255, 0.025)
              );
            box-shadow:
              0 20px 70px rgba(0, 0, 0, 0.35),
              0 0 40px rgba(34, 211, 238, 0.05);
          }

          @media (max-width: 767px) {
            .hero-letter {
              animation-duration: 600ms;
            }

            .custom-cursor-dot,
            .custom-cursor-ring,
            .custom-cursor-label {
              display: none !important;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 1ms !important;
              animation-iteration-count: 1 !important;
              scroll-behavior: auto !important;
              transition-duration: 1ms !important;
            }

            .reveal-item {
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }

            .hero-letter {
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
            }

            .network-row {
              opacity: 1 !important;
              transform: none !important;
            }
          }
        `}</style>

      </main>
    </>
  );
}