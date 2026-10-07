"use client";

import { useState } from "react";
import Link from "next/link";

/* =========================================================
   ICON COMPONENT
========================================================= */

function Icon({
  name,
  size = 18,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="6" height="6" rx="1" />
          <rect x="14" y="4" width="6" height="6" rx="1" />
          <rect x="4" y="14" width="6" height="6" rx="1" />
          <rect x="14" y="14" width="6" height="6" rx="1" />
        </svg>
      );

    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 20h14" />
        </svg>
      );

    case "timeline":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "care":
      return (
        <svg {...common}>
          <path d="M6 4h12v5c0 5-3 8-6 10-3-2-6-5-6-10z" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "spark":
      return (
        <svg {...common}>
          <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
          <path d="m19 17 .7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z" />
        </svg>
      );

    case "family":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3.5 20c.5-4 2.2-6 5.5-6s5 2 5.5 6" />
          <path d="M14 15c3.5 0 5.5 1.7 6 5" />
        </svg>
      );

    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          <circle cx="12" cy="15" r="1" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="m16 16 5 5" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common}>
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="M18 6 6 18" />
        </svg>
      );

    case "share":
      return (
        <svg {...common}>
          <circle cx="18" cy="5" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="19" r="2" />
          <path d="m8 11 8-5" />
          <path d="m8 13 8 5" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4" />
          <path d="M8 3v4" />
          <path d="M3 10h18" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function CareGapsPage() {
  const [activeTab, setActiveTab] =
    useState<"attention" | "watching" | "completed">(
      "attention"
    );

  const [completed, setCompleted] =
    useState(false);

  const [showShare, setShowShare] =
    useState(false);

  const [showCopilot, setShowCopilot] =
    useState(false);

  const [showSchedule, setShowSchedule] =
    useState(false);

  /* =======================================================
     COMPLETE ACTION
  ======================================================= */

  function handleComplete() {
    setCompleted(true);
  }

  /* =======================================================
     DOWNLOAD CARE PLAN
  ======================================================= */

  function downloadCarePlan() {
    const content = `
HOMEHEALTH 360

2026 CARE PLAN

7 of 9 on track
78%

Preventive care plan

Suggested sequence

1. Book eye screening
   Aim for October

2. Confirm flu vaccine
   Before November

This care plan is based on the information
available in your connected health records.

HOMEHEALTH 360
`;

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download =
      "HOMEHEALTH-360-care-plan.txt";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#f5f7f4] text-[#183d36]">
      <div className="flex min-h-screen">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[198px] flex-col bg-[#09271f] text-white lg:flex">
          {/* LOGO */}

          <div className="flex h-[67px] items-center gap-3 px-4">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-white text-[#0b3028]">
              <span className="text-[17px]">
                ♡
              </span>
            </div>

            <div className="leading-none">
              <div className="font-serif text-[13px] font-medium">
                HOMEHEALTH
              </div>

              <div className="mt-[3px] text-[6px] font-semibold tracking-[0.05em] text-[#b8c9c3]">
                360
              </div>
            </div>
          </div>

          {/* NAVIGATION */}

          <nav className="px-2">
            <Link
              href="/dashboard"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b8c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="dashboard"
                size={14}
              />

              Dashboard
            </Link>

            <Link
              href="/health-records"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b8c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="upload"
                size={14}
              />

              Upload report
            </Link>

            <Link
              href="/health-timeline"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b8c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="timeline"
                size={14}
              />

              Health timeline
            </Link>

            <Link
              href="/care-gaps"
              className="relative flex h-[40px] items-center gap-2 rounded-[9px] bg-[#14483d] px-3 text-[12px] font-medium text-white"
            >
              <Icon
                name="care"
                size={14}
              />

              Care gaps

              <span className="absolute right-3 h-[5px] w-[5px] rounded-full bg-[#55d7b7]" />
            </Link>

            <Link
              href="/reminders"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b8c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="bell"
                size={14}
              />

              Reminders
            </Link>

            <Link
              href="/ai-care-copilot"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b8c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="spark"
                size={14}
              />

              AI Care Copilot
            </Link>

            <Link
              href="/family-healthcare"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b8c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="family"
                size={14}
              />

              Family healthcare
            </Link>
          </nav>

          {/* PRIVACY CENTER */}

          <div className="mt-auto px-2 pb-5">
            <div className="rounded-[11px] border border-[#1c5145] bg-[#0e362d] p-3">
              <div className="flex items-center gap-2">
                <Icon
                  name="lock"
                  size={13}
                />

                <span className="text-[10px] font-medium">
                  Privacy center
                </span>
              </div>

              <p className="mt-2 text-[9px] leading-[1.45] text-[#9db4ad]">
                Your health data is encrypted
                and shared only with your
                permission.
              </p>
            </div>
          </div>
        </aside>

        {/* =================================================
            MAIN
        ================================================= */}

        <div className="min-w-0 flex-1 lg:ml-[198px]">
          {/* TOP BAR */}

          <header className="h-[62px] border-b border-[#e1e6e3] bg-[#f9faf8]">
            <div className="flex h-full items-center justify-between gap-4 px-5 sm:px-7">
              {/* SEARCH */}

              <div className="flex h-[36px] w-full max-w-[285px] items-center gap-2 rounded-[9px] border border-[#e1e6e3] bg-white px-3 text-[#7e8d88]">
                <Icon
                  name="search"
                  size={15}
                />

                <span className="truncate text-[11px]">
                  Search reports, medications,
                  events…
                </span>

                <span className="ml-auto whitespace-nowrap text-[9px] text-[#a0aaa6]">
                  ⌘K
                </span>
              </div>

              {/* USER AREA */}

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full bg-[#e4f3ee] px-3 py-[6px] text-[10px] font-medium text-[#18735f] sm:flex">
                  <span className="h-[6px] w-[6px] rounded-full bg-[#168f72]" />

                  All data synced
                </div>

                <div className="text-[15px]">
                  🔔
                </div>

                <div className="flex h-[29px] w-[29px] items-center justify-center rounded-full bg-[#dcece6] text-[9px] font-bold text-[#356259]">
                  AM
                </div>

                <div className="hidden leading-tight sm:block">
                  <p className="text-[11px] font-semibold text-[#334844]">
                    Alex Morgan
                  </p>

                  <p className="text-[8px] text-[#8c9894]">
                    Premium plan
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT */}

          <section className="px-4 pb-12 pt-6 sm:px-6 lg:px-7">
            {/* TITLE */}

            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#388676]">
                  PREVENTIVE CARE
                </p>

                <h1 className="mt-1 text-[30px] font-semibold leading-none tracking-[-0.04em] text-[#173d36]">
                  Care gaps
                </h1>

                <p className="mt-2 max-w-[690px] text-[11px] text-[#818e8a] sm:text-[12px]">
                  Potential opportunities to stay on
                  track, based on available records and
                  common care guidelines—not a
                  diagnosis.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowShare(true)
                }
                className="flex h-[34px] items-center justify-center gap-2 self-start rounded-[8px] border border-[#dfe5e2] bg-white px-4 text-[10px] font-medium text-[#405a54] shadow-sm transition hover:bg-[#f9faf9] xl:self-auto"
              >
                <Icon
                  name="share"
                  size={13}
                />

                Share with care team
              </button>
            </div>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {/* PRIORITY */}

              <div className="rounded-[13px] border border-[#e0e6e3] bg-white px-4 py-4 shadow-[0_3px_12px_rgba(38,65,57,0.035)]">
                <p className="text-[9px] text-[#899590]">
                  Priority
                </p>

                <p className="mt-2 text-[19px] font-semibold text-[#294941]">
                  2 gaps
                </p>

                <p className="mt-1 text-[8px] text-[#8b9692]">
                  Recommended to address this month
                </p>
              </div>

              {/* WATCHING */}

              <div className="rounded-[13px] border border-[#e0e6e3] bg-white px-4 py-4 shadow-[0_3px_12px_rgba(38,65,57,0.035)]">
                <p className="text-[9px] text-[#899590]">
                  Watching
                </p>

                <p className="mt-2 text-[19px] font-semibold text-[#294941]">
                  2 items
                </p>

                <p className="mt-1 text-[8px] text-[#8b9692]">
                  No immediate action required
                </p>
              </div>

              {/* COMPLETED */}

              <div className="rounded-[13px] border border-[#e0e6e3] bg-white px-4 py-4 shadow-[0_3px_12px_rgba(38,65,57,0.035)]">
                <p className="text-[9px] text-[#899590]">
                  Completed
                </p>

                <p className="mt-2 text-[19px] font-semibold text-[#294941]">
                  5 this year
                </p>

                <p className="mt-1 text-[8px] text-[#8b9692]">
                  Last completed Sep 21
                </p>
              </div>

              {/* DATA CONFIDENCE */}

              <div className="rounded-[13px] border border-[#e0e6e3] bg-white px-4 py-4 shadow-[0_3px_12px_rgba(38,65,57,0.035)]">
                <p className="text-[9px] text-[#899590]">
                  Data confidence
                </p>

                <p className="mt-2 text-[19px] font-semibold text-[#294941]">
                  High
                </p>

                <p className="mt-1 text-[8px] text-[#8b9692]">
                  6 connected record sources
                </p>
              </div>
            </div>

            {/* =================================================
                MAIN GRID
            ================================================= */}

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_265px]">
              {/* LEFT */}

              <div className="min-w-0">
                {/* TABS */}

                <div className="flex min-h-[48px] items-center gap-2 rounded-[13px] border border-[#e0e6e3] bg-white px-3 shadow-[0_3px_12px_rgba(38,65,57,0.035)]">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "attention"
                      )
                    }
                    className={`rounded-full px-3 py-[6px] text-[9px] font-medium ${
                      activeTab ===
                      "attention"
                        ? "bg-[#087d67] text-white"
                        : "border border-[#e1e7e4] text-[#60716c]"
                    }`}
                  >
                    Needs attention · 2
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "watching"
                      )
                    }
                    className={`rounded-full px-3 py-[6px] text-[9px] font-medium ${
                      activeTab ===
                      "watching"
                        ? "bg-[#087d67] text-white"
                        : "border border-[#e1e7e4] text-[#60716c]"
                    }`}
                  >
                    Watching · 2
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab(
                        "completed"
                      )
                    }
                    className={`rounded-full px-3 py-[6px] text-[9px] font-medium ${
                      activeTab ===
                      "completed"
                        ? "bg-[#087d67] text-white"
                        : "border border-[#e1e7e4] text-[#60716c]"
                    }`}
                  >
                    Completed · 5
                  </button>
                </div>

                {/* MAIN CARE GAP */}

                {activeTab ===
                  "attention" && (
                  <section className="mt-4 rounded-[17px] border border-[#e0e6e3] bg-white p-5 shadow-[0_4px_18px_rgba(35,62,54,0.045)]">
                    {/* TOP */}

                    <div className="flex items-start gap-3">
                      <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[9px] bg-[#fbf0d1] text-[#8a6c22]">
                        <Icon
                          name="eye"
                          size={14}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-[#f8edca] px-2 py-[3px] text-[7px] font-semibold text-[#86681d]">
                            ● Priority
                          </span>

                          <span className="text-[8px] text-[#899590]">
                            Recommended this month
                          </span>
                        </div>

                        <h2 className="mt-2 text-[14px] font-semibold text-[#294a42]">
                          Diabetic retinal eye
                          screening
                        </h2>
                      </div>
                    </div>

                    {/* DESCRIPTION */}

                    <p className="mt-4 text-[10px] leading-[1.65] text-[#687874]">
                      Your record shows type 2
                      diabetes and no retinal eye
                      screening result in the past 12
                      months. A screening can help
                      identify changes before they
                      affect vision.
                    </p>

                    {/* WHY */}

                    <div className="mt-4 rounded-[10px] bg-[#f2f5f2] px-3.5 py-3">
                      <p className="text-[8px] font-semibold uppercase tracking-[0.04em] text-[#687671]">
                        WHY THIS IS SHOWN
                      </p>

                      <p className="mt-1 text-[8.5px] leading-[1.5] text-[#8a9591]">
                        Based on the latest available
                        ADA Standards of Care and your
                        connected records. Your clinician
                        may recommend a different
                        interval for your individual
                        circumstances.
                      </p>
                    </div>

                    {/* ACTIONS */}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setShowSchedule(true)
                        }
                        className="flex h-[33px] items-center gap-1.5 rounded-[8px] bg-[#087d67] px-4 text-[9px] font-medium text-white transition hover:bg-[#066e5c]"
                      >
                        <Icon
                          name="calendar"
                          size={12}
                        />

                        Schedule
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleComplete
                        }
                        className={`flex h-[33px] items-center gap-1.5 rounded-[8px] border px-4 text-[9px] font-medium transition ${
                          completed
                            ? "border-[#b8d8ce] bg-[#edf8f4] text-[#287865]"
                            : "border-[#dfe5e2] bg-white text-[#52645f]"
                        }`}
                      >
                        <Icon
                          name="check"
                          size={12}
                        />

                        {completed
                          ? "Completed"
                          : "Mark complete"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setShowCopilot(true)
                        }
                        className="ml-auto text-[9px] font-medium text-[#388576] underline decoration-[#b9d5cd] underline-offset-2"
                      >
                        Ask Copilot
                      </button>
                    </div>
                  </section>
                )}

                {/* WATCHING */}

                {activeTab ===
                  "watching" && (
                  <section className="mt-4 rounded-[17px] border border-[#e0e6e3] bg-white p-5 shadow-[0_4px_18px_rgba(35,62,54,0.045)]">
                    <div className="flex items-start gap-3">
                      <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[9px] bg-[#e9f2ee] text-[#348473]">
                        <span className="text-[13px]">
                          •
                        </span>
                      </div>

                      <div>
                        <span className="rounded-full bg-[#e6f1ed] px-2 py-[3px] text-[7px] font-semibold text-[#3c7d70]">
                          Watching
                        </span>

                        <h2 className="mt-2 text-[14px] font-semibold text-[#294a42]">
                          Preventive care items
                        </h2>
                      </div>
                    </div>

                    <p className="mt-4 text-[10px] leading-[1.6] text-[#71807b]">
                      Two preventive care items are
                      being monitored based on the
                      information currently connected
                      to your health record.
                    </p>
                  </section>
                )}

                {/* COMPLETED */}

                {activeTab ===
                  "completed" && (
                  <section className="mt-4 rounded-[17px] border border-[#e0e6e3] bg-white p-5 shadow-[0_4px_18px_rgba(35,62,54,0.045)]">
                    <div className="flex items-start gap-3">
                      <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[9px] bg-[#e3f3ed] text-[#348473]">
                        <Icon
                          name="check"
                          size={14}
                        />
                      </div>

                      <div>
                        <span className="rounded-full bg-[#e4f2ed] px-2 py-[3px] text-[7px] font-semibold text-[#367b6d]">
                          Completed
                        </span>

                        <h2 className="mt-2 text-[14px] font-semibold text-[#294a42]">
                          Preventive actions
                          completed this year
                        </h2>
                      </div>
                    </div>

                    <p className="mt-4 text-[10px] leading-[1.6] text-[#71807b]">
                      Five preventive actions have
                      been completed this year. The
                      latest completion was recorded
                      on September 21.
                    </p>
                  </section>
                )}
              </div>

              {/* =================================================
                  RIGHT COLUMN
              ================================================= */}

              <aside className="space-y-4">
                {/* CARE PLAN */}

                <section className="rounded-[17px] bg-[#092b23] p-5 text-white shadow-[0_5px_20px_rgba(15,55,46,0.12)]">
                  <p className="text-[8px] font-medium uppercase tracking-[0.07em] text-[#87b7aa]">
                    2026 CARE PLAN
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[16px] font-semibold">
                        7 of 9 on track
                      </p>

                      <p className="mt-3 text-[8.5px] leading-[1.5] text-[#a9c0ba]">
                        You've completed five
                        preventive actions this year.
                        Two recommended items remain.
                      </p>
                    </div>

                    {/* CIRCLE */}

                    <div
                      className="relative flex h-[59px] w-[59px] shrink-0 items-center justify-center rounded-full"
                      style={{
                        background:
                          "conic-gradient(#65d9b9 78%, #21483f 78% 100%)",
                      }}
                    >
                      <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#092b23]">
                        <span className="text-[10px] font-semibold text-white">
                          78%
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={
                      downloadCarePlan
                    }
                    className="mt-4 flex h-[32px] items-center gap-2 rounded-[8px] bg-[#087d67] px-3 text-[9px] font-medium text-white transition hover:bg-[#0a8a73]"
                  >
                    <Icon
                      name="download"
                      size={12}
                    />

                    Download care plan
                  </button>
                </section>

                {/* SUGGESTED SEQUENCE */}

                <section className="rounded-[17px] border border-[#e0e6e3] bg-white p-5 shadow-[0_4px_18px_rgba(35,62,54,0.045)]">
                  <h2 className="text-[13px] font-semibold text-[#345149]">
                    Suggested sequence
                  </h2>

                  <p className="mt-1 text-[8.5px] text-[#899590]">
                    A practical way to address open
                    items.
                  </p>

                  {/* STEP 1 */}

                  <div className="mt-5 flex gap-3">
                    <div className="flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full bg-[#e1f3ed] text-[9px] font-semibold text-[#277a68]">
                      1
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-[#3c554f]">
                        Book eye screening
                      </p>

                      <p className="mt-0.5 text-[8px] text-[#89948f]">
                        Aim for October
                      </p>
                    </div>
                  </div>

                  <div className="my-4 border-t border-[#e5e9e7]" />

                  {/* STEP 2 */}

                  <div className="flex gap-3">
                    <div className="flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full bg-[#e1f3ed] text-[9px] font-semibold text-[#277a68]">
                      2
                    </div>

                    <div>
                      <p className="text-[10px] font-semibold text-[#3c554f]">
                        Confirm flu vaccine
                      </p>

                      <p className="mt-0.5 text-[8px] text-[#89948f]">
                        Before November
                      </p>
                    </div>
                  </div>
                </section>
              </aside>
            </div>

            {/* BOTTOM SMALL STATUS */}

            <div className="mt-5 flex items-center justify-between px-2">
              <span className="text-[8px] text-[#9aa5a1]">
                Needs attention · 2&nbsp;&nbsp; Watching ·
                2&nbsp;&nbsp; Completed · 5
              </span>

              <span className="text-[8px] text-[#a1aaa7]">
                HOMEHEALTH 360
              </span>
            </div>
          </section>
        </div>
      </div>

      {/* =====================================================
          SHARE MODAL
      ===================================================== */}

      {showShare && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06261f]/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[430px] rounded-[17px] bg-white p-6 shadow-[0_25px_80px_rgba(10,45,37,0.25)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#398676]">
                  CARE TEAM
                </p>

                <h2 className="mt-1 text-[19px] font-semibold text-[#294940]">
                  Share with care team
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowShare(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f2] text-[#66736f]"
              >
                <Icon
                  name="close"
                  size={15}
                />
              </button>
            </div>

            <p className="mt-4 text-[10px] leading-5 text-[#7b8985]">
              Your care-gap summary can be shared
              with members of your care team. Review
              the information before sharing.
            </p>

            <div className="mt-5 rounded-[10px] bg-[#f3f7f5] p-3">
              <p className="text-[9px] font-semibold text-[#47615a]">
                Care gap summary
              </p>

              <p className="mt-1 text-[9px] text-[#81908b]">
                2 priority gaps · 2 watching · 5
                completed this year
              </p>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowShare(false)
                }
                className="h-9 rounded-[8px] border border-[#dfe6e2] px-4 text-[10px] text-[#5b6d67]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowShare(false)
                }
                className="h-9 rounded-[8px] bg-[#087d67] px-4 text-[10px] font-medium text-white"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          COPILOT MODAL
      ===================================================== */}

      {showCopilot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06261f]/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[450px] rounded-[17px] bg-white p-6 shadow-[0_25px_80px_rgba(10,45,37,0.25)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#398676]">
                  AI CARE COPILOT
                </p>

                <h2 className="mt-1 text-[19px] font-semibold text-[#294940]">
                  About this care gap
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowCopilot(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f2] text-[#66736f]"
              >
                <Icon
                  name="close"
                  size={15}
                />
              </button>
            </div>

            <div className="mt-5 rounded-[11px] bg-[#f2f6f4] p-4">
              <p className="text-[10px] leading-[1.6] text-[#65736f]">
                This care gap is shown because the
                available record does not currently
                contain a retinal eye screening result
                within the displayed interval.
              </p>

              <p className="mt-3 text-[9px] leading-[1.6] text-[#87938f]">
                This is an informational observation,
                not a diagnosis or replacement for
                advice from your clinician.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowCopilot(false)
              }
              className="mt-5 h-9 w-full rounded-[8px] bg-[#087d67] text-[10px] font-medium text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* =====================================================
          SCHEDULE MODAL
      ===================================================== */}

      {showSchedule && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#06261f]/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[430px] rounded-[17px] bg-white p-6 shadow-[0_25px_80px_rgba(10,45,37,0.25)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-[#398676]">
                  SCHEDULE
                </p>

                <h2 className="mt-1 text-[19px] font-semibold text-[#294940]">
                  Book eye screening
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowSchedule(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f4f2] text-[#66736f]"
              >
                <Icon
                  name="close"
                  size={15}
                />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-[10px] border border-[#dfe6e2] px-3 py-3">
                <p className="text-[8px] text-[#8a9692]">
                  Recommended timing
                </p>

                <p className="mt-1 text-[10px] font-medium text-[#405852]">
                  Aim for October
                </p>
              </div>

              <div className="rounded-[10px] border border-[#dfe6e2] px-3 py-3">
                <p className="text-[8px] text-[#8a9692]">
                  Next step
                </p>

                <p className="mt-1 text-[10px] font-medium text-[#405852]">
                  Contact your clinician or eye-care
                  provider.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowSchedule(false)
              }
              className="mt-5 h-9 w-full rounded-[8px] bg-[#087d67] text-[10px] font-medium text-white"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </main>
  );
}