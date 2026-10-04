"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
};

type CareNetworkItem = {
  title: string;
  status: string;
  description: string;
};

const careNetwork: CareNetworkItem[] = [
  {
    title: "AI Care Coordinator",
    status: "ACTIVE",
    description: "AI-guided care coordination",
  },
  {
    title: "Doctor Network",
    status: "AVAILABLE",
    description: "Connected medical specialists",
  },
  {
    title: "Diagnostics",
    status: "READY",
    description: "Lab and diagnostic services",
  },
  {
    title: "Health Records",
    status: "CONNECTED",
    description: "Digital health record system",
  },
  {
    title: "Care Follow-up",
    status: "ACTIVE",
    description: "Continuous care tracking",
  },
];

const quickActions = [
  {
    title: "AI Care",
    subtitle: "Start an intelligent care conversation",
    href: "/ai-care",
    icon: "✦",
  },
  {
    title: "Need a Doctor?",
    subtitle: "Continue to doctor consultation",
    href: "/doctor-consult",
    icon: "◎",
  },
  {
    title: "Need Diagnostics?",
    subtitle: "Explore available lab services",
    href: "/lab-tests",
    icon: "⌁",
  },
  {
    title: "View Records",
    subtitle: "Access your digital health records",
    href: "/health-records",
    icon: "▣",
  },
];

const journeyItems = [
  {
    number: "01",
    title: "Patient",
    subtitle: "Your healthcare need",
  },
  {
    number: "02",
    title: "AI Care",
    subtitle: "Understand & coordinate",
  },
  {
    number: "03",
    title: "Doctor",
    subtitle: "Clinical consultation",
  },
  {
    number: "04",
    title: "Diagnostics",
    subtitle: "Tests & reports",
  },
  {
    number: "05",
    title: "Follow-up",
    subtitle: "Continuous care",
  },
];

function BackgroundSystem() {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, index) => ({
        id: index,
        left: `${(index * 17.7) % 100}%`,
        top: `${(index * 29.3) % 100}%`,
        delay: `${(index % 8) * 0.8}s`,
        duration: `${5 + (index % 5)}s`,
        size: index % 3 === 0 ? 3 : 2,
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#02070b]">
      {/* Base grid */}
      <div
        className="absolute inset-0 opacity-[0.17]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34,211,238,0.13) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,211,238,0.13) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Secondary small grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px",
        }}
      />

      {/* Glow fields */}
      <div className="absolute left-[8%] top-[8%] h-[420px] w-[420px] rounded-full bg-cyan-400/[0.045] blur-[120px] animate-dashOrbOne" />

      <div className="absolute bottom-[5%] right-[4%] h-[500px] w-[500px] rounded-full bg-cyan-300/[0.035] blur-[140px] animate-dashOrbTwo" />

      {/* Vertical energy beam */}
      <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-cyan-400/[0.08] to-transparent" />

      {/* Floating particles */}
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute rounded-full bg-cyan-300/60 animate-dashParticle"
          style={{
            left: particle.left,
            top: particle.top,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
          }}
        />
      ))}
    </div>
  );
}

function AIOrb() {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center">
      {/* Outer rings */}
      <div className="absolute inset-0 rounded-full border border-cyan-400/10 animate-aiRingOne" />

      <div className="absolute inset-[7px] rounded-full border border-cyan-300/10 animate-aiRingTwo" />

      <div className="absolute inset-[14px] rounded-full border border-cyan-400/15 border-dashed animate-aiRingThree" />

      {/* Core glow */}
      <div className="absolute h-12 w-12 rounded-full bg-cyan-400/[0.07] blur-xl animate-aiCoreGlow" />

      {/* Core */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/30 bg-[#07131a]/90 shadow-[0_0_30px_rgba(34,211,238,0.16)]">
        <span className="text-sm text-cyan-300">✦</span>
      </div>

      <div className="absolute -bottom-3 whitespace-nowrap rounded-full border border-cyan-300/10 bg-[#061015]/90 px-2.5 py-1 text-[7px] font-semibold tracking-[0.18em] text-cyan-300/70">
        AI CORE ONLINE
      </div>
    </div>
  );
}

function StatusDot() {
  return (
    <span className="relative flex h-2.5 w-2.5 items-center justify-center">
      <span className="absolute h-2.5 w-2.5 rounded-full bg-cyan-300/20 animate-statusPulse" />

      <span className="relative h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_9px_rgba(103,232,249,0.75)]" />
    </span>
  );
}

function CareNetworkCard({
  item,
  index,
}: {
  item: CareNetworkItem;
  index: number;
}) {
  const delay = `${index * 0.18}s`;

  return (
    <div
      className="care-network-entry group relative overflow-hidden rounded-xl border border-white/[0.055] bg-white/[0.018] px-3 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:translate-x-1 hover:border-cyan-300/20 hover:bg-cyan-300/[0.035] hover:shadow-[0_0_26px_rgba(34,211,238,0.06)]"
      style={
        {
          "--care-delay": delay,
        } as React.CSSProperties & { "--care-delay": string }
      }
    >
      {/* moving energy line */}
      <span
        className="pointer-events-none absolute inset-y-0 -left-24 w-20 bg-gradient-to-r from-transparent via-cyan-300/[0.10] to-transparent blur-md animate-careScan"
        style={{
          animationDelay: `${index * 0.5}s`,
        }}
      />

      {/* left accent */}
      <span className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-cyan-400/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center gap-3">
        <StatusDot />

        <div className="min-w-0 flex-1">
          <div className="truncate text-[10px] font-medium text-slate-200 transition-colors duration-300 group-hover:text-cyan-100">
            {item.title}
          </div>

          <div className="mt-0.5 truncate text-[7px] tracking-wide text-slate-600">
            {item.description}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-[6px] font-semibold tracking-[0.14em] text-cyan-300/60 transition-all duration-300 group-hover:text-cyan-200 group-hover:drop-shadow-[0_0_7px_rgba(103,232,249,0.35)]">
            {item.status}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({
  title,
  subtitle,
  href,
  icon,
}: {
  title: string;
  subtitle: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-white/[0.055] bg-white/[0.018] px-3 py-2.5 transition-all duration-300 hover:border-cyan-300/20 hover:bg-cyan-300/[0.035] hover:shadow-[0_0_26px_rgba(34,211,238,0.05)]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.04] text-[12px] text-cyan-300 transition-all duration-300 group-hover:border-cyan-300/20 group-hover:bg-cyan-300/[0.08] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.08)]">
          {icon}
        </div>

        <div className="min-w-0">
          <div className="truncate text-[9px] font-medium text-slate-200 transition-colors group-hover:text-cyan-100">
            {title}
          </div>

          <div className="mt-0.5 truncate text-[7px] text-slate-600">
            {subtitle}
          </div>
        </div>
      </div>

      <span className="ml-3 text-[10px] text-cyan-300/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-200">
        →
      </span>
    </Link>
  );
}

function JourneyCard({
  number,
  title,
  subtitle,
}: {
  number: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="group relative flex min-h-[88px] flex-1 flex-col justify-between rounded-xl border border-white/[0.055] bg-white/[0.018] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/15 hover:bg-cyan-300/[0.025]">
      <div className="flex items-center justify-between">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-cyan-300/10 bg-cyan-300/[0.04] text-[7px] font-semibold text-cyan-300">
          {number}
        </div>

        <span className="h-1.5 w-1.5 rounded-full bg-cyan-300/50 shadow-[0_0_8px_rgba(103,232,249,0.35)] transition-all duration-300 group-hover:scale-125 group-hover:bg-cyan-200" />
      </div>

      <div>
        <div className="text-[9px] font-medium text-slate-200">
          {title}
        </div>

        <div className="mt-1 text-[7px] text-slate-600">
          {subtitle}
        </div>
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const router = useRouter();

  const [patient, setPatient] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const data = await response.json();
        const user = data?.user as User | undefined;

        if (!user) {
          router.replace("/login");
          return;
        }

        if (user.role === "DOCTOR") {
          router.replace("/doctor/dashboard");
          return;
        }

        if (user.role === "ADMIN") {
          router.replace("/admin/dashboard");
          return;
        }

        if (mounted) {
          setPatient(user);
          setLoading(false);
        }
      } catch (error) {
        console.error("Unable to load current user:", error);
        router.replace("/login");
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  const firstName = patient?.name
    ? patient.name.trim().split(/\s+/)[0]
    : "Patient";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.replace("/login");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#02070b] text-white">
        <BackgroundSystem />

        <div className="flex min-h-screen items-center justify-center">
          <div className="flex flex-col items-center">
            <AIOrb />

            <div className="mt-10 text-[8px] tracking-[0.28em] text-cyan-300/60">
              INITIALIZING PATIENT CORE
            </div>

            <div className="mt-3 h-px w-44 overflow-hidden bg-white/[0.05]">
              <div className="h-full w-1/2 animate-loadingBar bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#02070b] text-white">
      <BackgroundSystem />

      {/* Ambient top gradient */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[70vw] -translate-x-1/2 bg-cyan-300/[0.025] blur-[100px]" />

      <div className="relative mx-auto w-full max-w-[1100px] px-5 pb-10 pt-5 sm:px-7 lg:px-8">
        {/* ========================================================= */}
        {/* TOP NAVIGATION */}
        {/* ========================================================= */}

        <header className="mb-4 flex items-center justify-between border-b border-white/[0.055] pb-4">
          <Link href="/dashboard" className="group">
            <div className="text-[11px] font-semibold tracking-[0.16em] text-white transition-colors group-hover:text-cyan-100">
              HOMEHEALTH <span className="text-cyan-300">360</span>
            </div>

            <div className="mt-0.5 text-[6px] tracking-[0.28em] text-slate-600">
              AI HEALTHCARE OPERATING SYSTEM
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="hidden rounded-full border border-emerald-300/10 bg-emerald-300/[0.025] px-2.5 py-1.5 sm:block">
              <div className="flex items-center gap-2">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-300/40" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-300/70" />
                </span>

                <span className="text-[6px] font-medium tracking-[0.18em] text-emerald-300/60">
                  SYSTEM ONLINE
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-1.5 text-[7px] tracking-[0.1em] text-slate-400 transition-all duration-300 hover:border-red-300/20 hover:bg-red-300/[0.025] hover:text-red-200"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* ========================================================= */}
        {/* WELCOME AREA */}
        {/* ========================================================= */}

        <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_180px]">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.055] bg-gradient-to-br from-white/[0.025] via-white/[0.015] to-cyan-300/[0.015] p-5 sm:p-6">
            {/* panel glow */}
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/[0.035] blur-3xl" />

            <div className="relative">
              <div className="text-[6px] font-semibold tracking-[0.25em] text-cyan-300/70">
                PATIENT COMMAND INTERFACE
              </div>

              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Hello,{" "}
                <span className="text-cyan-200">{firstName}</span>.
              </h1>

              <p className="mt-2 max-w-xl text-[8px] leading-5 text-slate-500 sm:text-[9px]">
                Your connected healthcare environment is ready. Start with AI
                guidance, doctor consultation, diagnostics, caregiver
                support, or your health records.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href="/ai-care"
                  className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-[7px] font-semibold tracking-[0.08em] text-cyan-100 transition-all duration-300 hover:bg-cyan-300/[0.10] hover:shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                >
                  OPEN AI CARE
                </Link>

                <Link
                  href="/doctor-consult"
                  className="rounded-lg border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-[7px] font-semibold tracking-[0.08em] text-slate-300 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
                >
                  FIND A DOCTOR
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden items-center justify-center rounded-2xl border border-white/[0.055] bg-white/[0.015] lg:flex">
            <AIOrb />
          </div>
        </section>

        {/* ========================================================= */}
        {/* QUICK NAV */}
        {/* ========================================================= */}

        <section className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {[
            {
              label: "AI Care",
              href: "/ai-care",
              icon: "✦",
            },
            {
              label: "Doctors",
              href: "/doctor-consult",
              icon: "◎",
            },
            {
              label: "Lab Tests",
              href: "/lab-tests",
              icon: "⌁",
            },
            {
              label: "Caregiver",
              href: "/caregiver-booking",
              icon: "+",
            },
            {
              label: "Health Records",
              href: "/health-records",
              icon: "▣",
            },
          ].map((item, index) => (
            <Link
              key={item.label}
              href={item.href}
              className="group rounded-xl border border-white/[0.055] bg-white/[0.018] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300/15 hover:bg-cyan-300/[0.025]"
              style={{
                animation: `dashboardCardIn 0.65s ease ${index * 0.08}s both`,
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-300/10 bg-cyan-300/[0.035] text-[10px] text-cyan-300 transition-all duration-300 group-hover:border-cyan-300/20 group-hover:bg-cyan-300/[0.07]">
                  {item.icon}
                </div>

                <span className="text-[8px] text-slate-700 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-cyan-300/60">
                  ↗
                </span>
              </div>

              <div className="mt-3 text-[8px] font-medium text-slate-300 group-hover:text-cyan-100">
                {item.label}
              </div>

              <div className="mt-1 text-[5.5px] tracking-[0.14em] text-slate-700">
                OPEN MODULE
              </div>
            </Link>
          ))}
        </section>

        {/* ========================================================= */}
        {/* COMMAND CENTER + CARE NETWORK */}
        {/* ========================================================= */}

        <section className="mb-5 grid gap-4 lg:grid-cols-[1.45fr_0.82fr]">
          {/* LEFT */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.055] bg-white/[0.014] p-4 sm:p-5">
            <div className="pointer-events-none absolute -left-20 top-0 h-48 w-48 rounded-full bg-cyan-300/[0.025] blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[6px] font-semibold tracking-[0.25em] text-cyan-300/65">
                    AI INTELLIGENCE
                  </div>

                  <h2 className="mt-1.5 text-sm font-semibold text-white sm:text-base">
                    Care Command Center
                  </h2>

                  <p className="mt-1.5 max-w-xl text-[7px] leading-4 text-slate-500">
                    Start from your healthcare need and HOMEHEALTH 360 can
                    guide you toward the appropriate platform service.
                  </p>
                </div>

                <div className="rounded-full border border-emerald-300/10 bg-emerald-300/[0.025] px-2 py-1 text-[5px] font-semibold tracking-[0.16em] text-emerald-300/70">
                  AI READY
                </div>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {quickActions.map((action) => (
                  <QuickActionCard key={action.title} {...action} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CARE NETWORK */}
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.055] bg-white/[0.014] p-4 sm:p-5">
            <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-cyan-300/[0.025] blur-3xl" />

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[6px] font-semibold tracking-[0.25em] text-cyan-300/65">
                    LIVE SYSTEM
                  </div>

                  <h2 className="mt-1.5 text-sm font-semibold text-white sm:text-base">
                    Care Network
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-emerald-300 shadow-[0_0_7px_rgba(110,231,183,0.45)] animate-statusPulse" />

                  <span className="text-[5px] font-semibold tracking-[0.14em] text-emerald-300/70">
                    CONNECTED
                  </span>
                </div>
              </div>

              {/* Animated network line */}
              <div className="pointer-events-none absolute left-[20px] top-[84px] h-[calc(100%-108px)] w-px overflow-hidden bg-white/[0.04]">
                <div className="absolute left-0 top-0 h-10 w-px bg-gradient-to-b from-transparent via-cyan-300/60 to-transparent animate-networkBeam" />
              </div>

              <div className="mt-5 space-y-2 pl-0.5">
                {careNetwork.map((item, index) => (
                  <CareNetworkCard
                    key={item.title}
                    item={item}
                    index={index}
                  />
                ))}
              </div>

              <div className="mt-3 rounded-xl border border-cyan-300/[0.08] bg-cyan-300/[0.02] px-3 py-2.5">
                <div className="text-[5px] font-semibold tracking-[0.18em] text-cyan-300/60">
                  AI SYSTEM MESSAGE
                </div>

                <div className="mt-1 text-[6px] leading-4 text-slate-600">
                  Your connected healthcare modules are ready for your next
                  action.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CONNECTED CARE JOURNEY */}
        {/* ========================================================= */}

        <section className="mb-5 rounded-2xl border border-white/[0.055] bg-white/[0.014] p-4 sm:p-5">
          <div className="text-[6px] font-semibold tracking-[0.25em] text-cyan-300/65">
            CONNECTED CARE JOURNEY
          </div>

          <h2 className="mt-1.5 text-sm font-semibold text-white sm:text-base">
            Your healthcare, one continuous flow.
          </h2>

          <p className="mt-1.5 max-w-2xl text-[7px] leading-4 text-slate-500">
            HOMEHEALTH 360 is designed to connect different parts of your
            healthcare journey through one digital platform.
          </p>

          <div className="relative mt-5">
            {/* Journey connector */}
            <div className="pointer-events-none absolute left-[8%] right-[8%] top-[23px] hidden h-px bg-gradient-to-r from-transparent via-cyan-300/15 to-transparent md:block" />

            <div className="relative grid gap-2 sm:grid-cols-2 md:grid-cols-5">
              {journeyItems.map((item, index) => (
                <JourneyCard key={item.number} {...item} />
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* PATIENT PROFILE */}
        {/* ========================================================= */}

        <section className="mb-4 rounded-2xl border border-white/[0.055] bg-white/[0.014] p-4 sm:p-5">
          <div className="text-[6px] font-semibold tracking-[0.25em] text-cyan-300/65">
            IDENTITY
          </div>

          <h2 className="mt-1.5 text-sm font-semibold text-white sm:text-base">
            Patient Profile
          </h2>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.055] bg-white/[0.018] p-3">
              <div className="text-[5px] font-semibold tracking-[0.18em] text-slate-600">
                NAME
              </div>

              <div className="mt-2 truncate text-[9px] text-slate-200">
                {patient?.name || "Not provided"}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.055] bg-white/[0.018] p-3">
              <div className="text-[5px] font-semibold tracking-[0.18em] text-slate-600">
                EMAIL
              </div>

              <div className="mt-2 truncate text-[9px] text-slate-200">
                {patient?.email || "Not provided"}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.055] bg-white/[0.018] p-3">
              <div className="text-[5px] font-semibold tracking-[0.18em] text-slate-600">
                PHONE
              </div>

              <div className="mt-2 truncate text-[9px] text-slate-200">
                {patient?.phone || "Not provided"}
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* DISCLAIMER */}
        {/* ========================================================= */}

        <div className="rounded-xl border border-amber-300/[0.08] bg-amber-300/[0.015] px-3 py-2.5">
          <p className="text-[6px] leading-4 text-amber-200/45">
            HOMEHEALTH 360 is currently a software prototype. Do not use this
            prototype for real medical emergencies or as a replacement for
            professional medical advice.
          </p>
        </div>

        {/* ========================================================= */}
        {/* FOOTER */}
        {/* ========================================================= */}

        <footer className="mt-5 flex flex-col gap-3 border-t border-white/[0.05] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-[7px] font-semibold tracking-[0.14em] text-white/70">
              HOMEHEALTH <span className="text-cyan-300">360</span>
            </div>

            <div className="mt-1 text-[5.5px] text-slate-700">
              AI Healthcare Operating System
            </div>
          </div>

          <div className="flex items-center gap-4 text-[5.5px] text-slate-700">
            <Link
              href="/ai-care"
              className="transition-colors hover:text-cyan-300"
            >
              AI Care
            </Link>

            <Link
              href="/doctor-consult"
              className="transition-colors hover:text-cyan-300"
            >
              Doctors
            </Link>

            <Link
              href="/lab-tests"
              className="transition-colors hover:text-cyan-300"
            >
              Labs
            </Link>

            <Link
              href="/health-records"
              className="transition-colors hover:text-cyan-300"
            >
              Records
            </Link>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        /* ==========================================================
           GLOBAL DASHBOARD ANIMATIONS
           ========================================================== */

        @keyframes dashParticle {
          0% {
            opacity: 0;
            transform: translate3d(0, 10px, 0) scale(0.8);
          }

          20% {
            opacity: 0.5;
          }

          50% {
            opacity: 0.85;
            transform: translate3d(0, -14px, 0) scale(1);
          }

          80% {
            opacity: 0.35;
          }

          100% {
            opacity: 0;
            transform: translate3d(0, 12px, 0) scale(0.8);
          }
        }

        @keyframes dashOrbOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(18px, 15px, 0) scale(1.08);
          }
        }

        @keyframes dashOrbTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }

          50% {
            transform: translate3d(-24px, -18px, 0) scale(1.05);
          }
        }

        @keyframes aiRingOne {
          0% {
            transform: rotate(0deg) scale(1);
          }

          50% {
            transform: rotate(180deg) scale(1.035);
          }

          100% {
            transform: rotate(360deg) scale(1);
          }
        }

        @keyframes aiRingTwo {
          0% {
            transform: rotate(360deg) scale(1);
          }

          50% {
            transform: rotate(180deg) scale(1.025);
          }

          100% {
            transform: rotate(0deg) scale(1);
          }
        }

        @keyframes aiRingThree {
          0% {
            transform: rotate(0deg);
          }

          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes aiCoreGlow {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.9);
          }

          50% {
            opacity: 0.75;
            transform: scale(1.15);
          }
        }

        @keyframes statusPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.85);
          }

          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @keyframes networkBeam {
          0% {
            transform: translateY(-40px);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          75% {
            opacity: 0.75;
          }

          100% {
            transform: translateY(260px);
            opacity: 0;
          }
        }

        @keyframes careScan {
          0% {
            transform: translateX(0);
            opacity: 0;
          }

          15% {
            opacity: 0.8;
          }

          45% {
            opacity: 1;
          }

          70% {
            opacity: 0.2;
          }

          100% {
            transform: translateX(430px);
            opacity: 0;
          }
        }

        @keyframes careNetworkEntry {
          0% {
            opacity: 0;
            transform: translate3d(-14px, 6px, 0);
            filter: blur(3px);
          }

          55% {
            opacity: 1;
            transform: translate3d(3px, 0, 0);
            filter: blur(0);
          }

          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            filter: blur(0);
          }
        }

        @keyframes dashboardCardIn {
          0% {
            opacity: 0;
            transform: translateY(8px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes loadingBar {
          0% {
            transform: translateX(-100%);
          }

          100% {
            transform: translateX(260%);
          }
        }

        .animate-dashParticle {
          animation-name: dashParticle;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .animate-dashOrbOne {
          animation: dashOrbOne 9s ease-in-out infinite;
        }

        .animate-dashOrbTwo {
          animation: dashOrbTwo 11s ease-in-out infinite;
        }

        .animate-aiRingOne {
          animation: aiRingOne 12s linear infinite;
        }

        .animate-aiRingTwo {
          animation: aiRingTwo 16s linear infinite;
        }

        .animate-aiRingThree {
          animation: aiRingThree 10s linear infinite;
        }

        .animate-aiCoreGlow {
          animation: aiCoreGlow 3.5s ease-in-out infinite;
        }

        .animate-statusPulse {
          animation: statusPulse 2.2s ease-in-out infinite;
        }

        .animate-networkBeam {
          animation: networkBeam 4.2s linear infinite;
        }

        .animate-careScan {
          animation: careScan 4.8s linear infinite;
        }

        .animate-loadingBar {
          animation: loadingBar 1.9s ease-in-out infinite;
        }

        .care-network-entry {
          animation: careNetworkEntry 0.8s cubic-bezier(0.22, 1, 0.36, 1)
            var(--care-delay) both;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.001ms !important;
          }
        }
      `}</style>
    </main>
  );
}