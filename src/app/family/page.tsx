"use client";

import { useState } from "react";
import Link from "next/link";

type IconName =
  | "dashboard"
  | "upload"
  | "timeline"
  | "gaps"
  | "reminders"
  | "ai"
  | "family"
  | "lock"
  | "search"
  | "bell"
  | "plus"
  | "user"
  | "calendar"
  | "doctor"
  | "records"
  | "close"
  | "check"
  | "arrow";

function Icon({
  name,
  size = 20,
}: {
  name: IconName;
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
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
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
          <path d="M6 4v16" />
          <circle cx="6" cy="6" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="6" cy="18" r="2" />
          <path d="M10 6h8" />
          <path d="M10 12h6" />
          <path d="M10 18h8" />
        </svg>
      );

    case "gaps":
      return (
        <svg {...common}>
          <path d="M5 19V9" />
          <path d="M12 19V5" />
          <path d="M19 19v-7" />
          <path d="M3 19h18" />
        </svg>
      );

    case "reminders":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "ai":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="3" />
          <path d="M9 9h6v6H9z" />
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
        </svg>
      );

    case "family":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M3 20c0-3.2 2.6-5 6-5s6 1.8 6 5" />
          <path d="M15 15c3 0 5 1.6 5 5" />
        </svg>
      );

    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );

    case "doctor":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" />
          <path d="M5 21a7 7 0 0 1 14 0" />
          <path d="M19 5v4M17 7h4" />
        </svg>
      );

    case "records":
      return (
        <svg {...common}>
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M15 3v4h4" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      );

    default:
      return null;
  }
}

function SidebarItem({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: IconName;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
        active
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center">
        <Icon name={icon} size={21} />
      </span>

      <span>{label}</span>
    </Link>
  );
}

type FamilyMember = {
  id: number;
  name: string;
  relation: string;
  age: number;
  status: string;
  initials: string;
  color: string;
};

const initialMembers: FamilyMember[] = [
  {
    id: 1,
    name: "Alex Morgan",
    relation: "Self",
    age: 20,
    status: "Primary account",
    initials: "AM",
    color: "bg-[#dcefe8] text-[#174f43]",
  },
  {
    id: 2,
    name: "Family Member",
    relation: "Parent",
    age: 48,
    status: "Health profile active",
    initials: "FM",
    color: "bg-[#e8edf5] text-[#46556e]",
  },
];

export default function FamilyHealthcarePage() {
  const [members, setMembers] =
    useState<FamilyMember[]>(initialMembers);

  const [showAdd, setShowAdd] = useState(false);

  const [name, setName] = useState("");
  const [relation, setRelation] = useState("");
  const [age, setAge] = useState("");

  function addFamilyMember() {
    const trimmedName = name.trim();
    const trimmedRelation = relation.trim();

    if (!trimmedName || !trimmedRelation) {
      return;
    }

    const newMember: FamilyMember = {
      id: Date.now(),
      name: trimmedName,
      relation: trimmedRelation,
      age: Number(age) || 0,
      status: "Health profile active",
      initials: trimmedName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      color: "bg-[#f1e9df] text-[#76583d]",
    };

    setMembers((current) => [...current, newMember]);

    setName("");
    setRelation("");
    setAge("");
    setShowAdd(false);
  }

  return (
    <div className="min-h-screen bg-[#f7f8f6] text-slate-800">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}

        <aside className="hidden w-[250px] shrink-0 bg-[#123d35] text-white lg:flex lg:flex-col">
          <div className="px-5 pb-5 pt-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <span className="text-lg font-bold text-emerald-100">
                  H
                </span>
              </div>

              <div>
                <div className="text-[15px] font-bold tracking-wide">
                  HOMEHEALTH
                </div>

                <div className="text-xs font-medium tracking-[0.18em] text-emerald-200">
                  360
                </div>
              </div>
            </Link>
          </div>

          <div className="px-4">
            <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
              Main
            </div>

            <nav className="space-y-1">
              <SidebarItem
                href="/dashboard"
                icon="dashboard"
                label="Dashboard"
              />

              <SidebarItem
                href="/health-records"
                icon="upload"
                label="Health Records"
              />

              <SidebarItem
                href="/health-timeline"
                icon="timeline"
                label="Health Timeline"
              />

              <SidebarItem
                href="/care-gaps"
                icon="gaps"
                label="Care Gaps"
              />

              <SidebarItem
                href="/reminders"
                icon="reminders"
                label="Reminders"
              />

              <SidebarItem
                href="/ai-care-pilot"
                icon="ai"
                label="AI Care Pilot"
              />

              <SidebarItem
                href="/family"
                icon="family"
                label="Family healthcare"
                active
              />
            </nav>
          </div>

          <div className="mt-auto px-4 pb-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-200">
                  <Icon name="lock" size={18} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Privacy center
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-white/50">
                    Your health data is encrypted and shared only with your
                    permission.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                  AM
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    Alex Morgan
                  </p>

                  <p className="text-xs text-white/45">
                    Premium plan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}

        <main className="min-w-0 flex-1">
          {/* TOP HEADER */}

          <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div className="flex min-w-0 items-center">
              <div className="hidden h-10 w-[320px] items-center gap-2 rounded-xl border border-slate-200 bg-[#fafbfa] px-3 text-slate-400 lg:flex">
                <Icon name="search" size={18} />

                <span className="text-xs">
                  Search reports, medications, events...
                </span>

                <span className="ml-auto text-[10px] text-slate-400">
                  ⌘K
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700 sm:flex">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                All data synced
              </div>

              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-50"
              >
                <Icon name="bell" size={19} />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
              </button>

              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dcefe8] text-xs font-bold text-[#174f43]">
                  AM
                </div>

                <div className="hidden sm:block">
                  <p className="text-xs font-semibold text-slate-800">
                    Alex Morgan
                  </p>

                  <p className="text-[10px] text-slate-400">
                    Premium plan
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* PAGE */}

          <div className="p-5 sm:p-7 lg:p-8">
            <div className="mx-auto max-w-[1450px]">
              {/* PAGE TITLE */}

              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                    FAMILY HEALTHCARE
                  </p>

                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                    Family healthcare
                  </h1>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Manage healthcare profiles for the people you care about
                    and keep important health information organized in one
                    place.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdd(true)}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#174f43] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#123d35]"
                >
                  <Icon name="plus" size={18} />
                  Add family member
                </button>
              </div>

              {/* PRIVACY NOTICE */}

              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-[#f0f8f5] p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700">
                  <Icon name="lock" size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#174f43]">
                    Family health information stays private
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Family profiles are kept separate so each person's
                    healthcare information can be managed with appropriate
                    permission.
                  </p>
                </div>
              </div>

              {/* SUMMARY CARDS */}

              <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e7f3ef] text-[#17624f]">
                      <Icon name="family" size={21} />
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      Profiles
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-bold text-slate-900">
                    {members.length}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Family members
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef2f8] text-[#50617c]">
                      <Icon name="calendar" size={21} />
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      Upcoming
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-bold text-slate-900">
                    2
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Family appointments
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5efe8] text-[#76583d]">
                      <Icon name="records" size={21} />
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      Records
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-bold text-slate-900">
                    18
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Shared health records
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef6e9] text-[#547344]">
                      <Icon name="check" size={21} />
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      Status
                    </span>
                  </div>

                  <p className="mt-5 text-3xl font-bold text-slate-900">
                    100%
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Profiles up to date
                  </p>
                </div>
              </div>

              {/* CONTENT GRID */}

              <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
                {/* FAMILY MEMBERS */}

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900">
                        Family members
                      </h2>

                      <p className="mt-1 text-xs text-slate-400">
                        Select a profile to view or manage their care.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAdd(true)}
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <Icon name="plus" size={16} />
                      Add
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="flex flex-col gap-4 px-5 py-5 transition hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold ${member.color}`}
                          >
                            {member.initials}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900">
                                {member.name}
                              </h3>

                              {member.relation === "Self" && (
                                <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                                  Primary
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs text-slate-500">
                              {member.relation}
                              {member.age > 0 ? ` · ${member.age} years` : ""}
                            </p>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                              <span className="text-[11px] text-slate-400">
                                {member.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                          View profile
                          <Icon name="arrow" size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* RIGHT SIDE */}

                <aside className="space-y-5">
                  {/* CARE QUICK ACTIONS */}

                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-900">
                      Family care
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Quickly access healthcare services for a family member.
                    </p>

                    <div className="mt-4 space-y-2">
                      <Link
                        href="/doctor-consult"
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-emerald-100 hover:bg-emerald-50/50"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                          <Icon name="doctor" size={20} />
                        </span>

                        <span className="flex-1">
                          <span className="block text-xs font-semibold text-slate-800">
                            Doctor consultation
                          </span>

                          <span className="mt-1 block text-[11px] text-slate-400">
                            Find a doctor
                          </span>
                        </span>

                        <Icon
                          name="arrow"
                          size={16}
                        />
                      </Link>

                      <Link
                        href="/health-records"
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-emerald-100 hover:bg-emerald-50/50"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                          <Icon name="records" size={20} />
                        </span>

                        <span className="flex-1">
                          <span className="block text-xs font-semibold text-slate-800">
                            Health records
                          </span>

                          <span className="mt-1 block text-[11px] text-slate-400">
                            View medical records
                          </span>
                        </span>

                        <Icon
                          name="arrow"
                          size={16}
                        />
                      </Link>

                      <Link
                        href="/reminders"
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 transition hover:border-emerald-100 hover:bg-emerald-50/50"
                      >
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                          <Icon name="reminders" size={20} />
                        </span>

                        <span className="flex-1">
                          <span className="block text-xs font-semibold text-slate-800">
                            Reminders
                          </span>

                          <span className="mt-1 block text-[11px] text-slate-400">
                            Manage care reminders
                          </span>
                        </span>

                        <Icon
                          name="arrow"
                          size={16}
                        />
                      </Link>
                    </div>
                  </section>

                  {/* PRIVACY */}

                  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <Icon name="lock" size={19} />
                      </div>

                      <div>
                        <h2 className="text-sm font-bold text-slate-900">
                          Privacy & permissions
                        </h2>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Family healthcare information should only be shared
                          with the appropriate person's permission.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3">
                        <Icon
                          name="check"
                          size={16}
                        />

                        <span className="text-[11px] font-medium text-emerald-800">
                          Health data protected
                        </span>
                      </div>

                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                        <Icon
                          name="user"
                          size={16}
                        />

                        <span className="text-[11px] font-medium text-slate-600">
                          Separate family profiles
                        </span>
                      </div>
                    </div>
                  </section>
                </aside>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ADD FAMILY MEMBER MODAL */}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[2px]">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Add family member
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Create a healthcare profile.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700"
              >
                <Icon name="close" size={19} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Full name
                </label>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter full name"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Relationship
                </label>

                <input
                  value={relation}
                  onChange={(event) => setRelation(event.target.value)}
                  placeholder="e.g. Parent, Spouse, Child"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700">
                  Age
                </label>

                <input
                  type="number"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                  placeholder="Age"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-emerald-300 focus:ring-4 focus:ring-emerald-50"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="h-11 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={addFamilyMember}
                  className="h-11 flex-1 rounded-xl bg-[#174f43] text-sm font-semibold text-white hover:bg-[#123d35]"
                >
                  Add member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}