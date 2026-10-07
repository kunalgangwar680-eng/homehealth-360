"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

type IconName =
  | "home"
  | "upload"
  | "timeline"
  | "gap"
  | "bell"
  | "ai"
  | "lab"
  | "family"
  | "privacy"
  | "search"
  | "file"
  | "eye"
  | "vaccine"
  | "arrow"
  | "chevron"
  | "menu"
  | "close"
  | "logout";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: "home" as IconName,
  },
  {
    label: "Upload report",
    href: "/health-records",
    icon: "upload" as IconName,
  },
  {
    label: "Health timeline",
    href: "/health-timeline",
    icon: "timeline" as IconName,
  },
  {
    label: "Care gaps",
    href: "/care-gaps",
    icon: "gap" as IconName,
  },
  {
    label: "Reminders",
    href: "/reminders",
    icon: "bell" as IconName,
  },
  {
    label: "AI Care Copilot",
    href: "/ai-care-pilot",
    icon: "ai" as IconName,
  },
  {
    label: "Lab Tests",
    href: "/lab-tests",
    icon: "lab" as IconName,
  },
  {
    label: "Family healthcare",
    href: "/family",
    icon: "family" as IconName,
  },
  {
    label: "Privacy center",
    href: "/privacy",
    icon: "privacy" as IconName,
  },
];

const nextActions = [
  {
    title: "Schedule a diabetic eye screening",
    subtitle: "Recommended this month · based on care guideline",
    icon: "eye" as IconName,
    href: "/care-gaps",
  },
  {
    title: "Review your new lab summary",
    subtitle: "3-minute read · processed today",
    icon: "file" as IconName,
    href: "/health-records",
  },
  {
    title: "Confirm flu vaccine",
    subtitle: "Due before November",
    icon: "vaccine" as IconName,
    href: "/reminders",
  },
];

function Icon({
  name,
  size = 20,
  stroke = 1.8,
}: {
  name: IconName;
  size?: number;
  stroke?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: stroke,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9.5V21h14V9.5" />
          <path d="M9 21v-6h6v6" />
        </svg>
      );

    case "upload":
      return (
        <svg {...common}>
          <path d="M12 16V4" />
          <path d="m7 9 5-5 5 5" />
          <path d="M5 19h14" />
        </svg>
      );

    case "timeline":
      return (
        <svg {...common}>
          <path d="M5 4v16" />
          <circle cx="5" cy="7" r="1.5" />
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="5" cy="17" r="1.5" />
          <path d="M10 7h8" />
          <path d="M10 12h8" />
          <path d="M10 17h8" />
        </svg>
      );

    case "gap":
      return (
        <svg {...common}>
          <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />
          <path d="M12 8v4" />
          <path d="M12 15h.01" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "ai":
      return (
        <svg {...common}>
          <path d="M12 3 13.8 8.2 19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
          <path d="m19 16 .6 1.7 1.7.6-1.7.6-.6 1.7-.6-1.7-1.7-.6 1.7-.6L19 16Z" />
        </svg>
      );

    case "lab":
      return (
        <svg {...common}>
          <path d="M9 3v6.5L5 17a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-4-7.5V3" />
          <path d="M7 15h10" />
          <path d="M8 3h8" />
          <path d="M9 18h.01" />
          <path d="M12 18h.01" />
          <path d="M15 18h.01" />
        </svg>
      );

    case "family":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="9" r="2.3" />
          <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
          <path d="M14.5 16a4.5 4.5 0 0 1 6 4" />
        </svg>
      );

    case "privacy":
      return (
        <svg {...common}>
          <path d="M12 3 19 6v5c0 4.7-3 8.4-7 10-4-1.6-7-5.3-7-10V6l7-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.2" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      );

    case "file":
      return (
        <svg {...common}>
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M14 3v4h4" />
          <path d="M9 12h6" />
          <path d="M9 16h5" />
        </svg>
      );

    case "eye":
      return (
        <svg {...common}>
          <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
          <circle cx="12" cy="12" r="2.3" />
        </svg>
      );

    case "vaccine":
      return (
        <svg {...common}>
          <path d="m14 4 6 6" />
          <path d="m16 2 6 6" />
          <path d="m13 7-8.5 8.5" />
          <path d="m10 10 4 4" />
          <path d="M8 15 5 18" />
          <path d="m4 19-1 2 2-1" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h13" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    case "menu":
      return (
        <svg {...common}>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="m18 6-12 12" />
        </svg>
      );

    case "logout":
      return (
        <svg {...common}>
          <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />
          <path d="m14 8 4 4-4 4" />
          <path d="M18 12H9" />
        </svg>
      );

    default:
      return null;
  }
}

function SidebarItem({
  href,
  label,
  icon,
  active = false,
  onClick,
}: {
  href: string;
  label: string;
  icon: IconName;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "flex min-h-[42px] items-center gap-3 rounded-[10px] px-3 text-[13px] font-medium transition-all duration-200",
        active
          ? "bg-[#ffffff18] text-white"
          : "text-[#c9d8d1] hover:bg-[#ffffff0d] hover:text-white",
      ].join(" ")}
    >
      <span className="flex w-6 shrink-0 items-center justify-center">
        <Icon name={icon} size={19} />
      </span>

      <span>{label}</span>
    </Link>
  );
}

function SnapshotCard({
  title,
  value,
  subtitle,
  highlighted = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  highlighted?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-[16px] border px-5 py-5",
        highlighted
          ? "border-[#cfe0d6] bg-[#f0f7f2]"
          : "border-[#e5e8e4] bg-white",
      ].join(" ")}
    >
      <div className="text-[12px] font-medium text-[#7c8982]">
        {title}
      </div>

      <div className="mt-3 text-[27px] font-semibold tracking-[-0.035em] text-[#263a32]">
        {value}
      </div>

      <div className="mt-3 text-[11px] leading-5 text-[#7e8983]">
        {subtitle}
      </div>
    </div>
  );
}

function NextActionCard({
  title,
  subtitle,
  icon,
  href,
}: {
  title: string;
  subtitle: string;
  icon: IconName;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 border-b border-[#e8ece8] py-4 last:border-b-0"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#eef5ef] text-[#5f7f6e]">
        <Icon name={icon} size={19} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-medium leading-5 text-[#394a42] group-hover:text-[#28634e]">
          {title}
        </span>

        <span className="mt-0.5 block text-[10px] leading-4 text-[#858f89]">
          {subtitle}
        </span>
      </span>

      <span className="text-[#9da7a1] transition-transform group-hover:translate-x-0.5 group-hover:text-[#4c745f]">
        <Icon name="chevron" size={17} />
      </span>
    </Link>
  );
}

export default function PatientDashboard() {
  const router = useRouter();

  const [patient, setPatient] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
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
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  /*
   * INDIA DATE + TIME
   *
   * 5:00 AM - 11:59 AM  = Good Morning
   * 12:00 PM - 4:59 PM  = Good Afternoon
   * 5:00 PM - 4:59 AM   = Good Evening
   *
   * Date always follows India Standard Time (Asia/Kolkata).
   */
  const [greeting, setGreeting] = useState("Good Evening");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      const indiaDateParts = new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "numeric",
        hour12: false,
      }).formatToParts(now);

      const hour = Number(
        indiaDateParts.find((part) => part.type === "hour")?.value ?? 0
      );

      if (hour >= 5 && hour < 12) {
        setGreeting("Good Morning");
      } else if (hour >= 12 && hour < 17) {
        setGreeting("Good Afternoon");
      } else {
        setGreeting("Good Evening");
      }

      const formattedDate = new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Kolkata",
      }).format(now);

      setCurrentDate(formattedDate);
    };

    updateDateTime();

    /*
     * Every 30 seconds we check again.
     * So if the user keeps the dashboard open,
     * greeting/date will automatically stay current.
     */
    const interval = window.setInterval(updateDateTime, 30000);

    return () => window.clearInterval(interval);
  }, []);

  const firstName = patient?.name
    ? patient.name.trim().split(/\s+/)[0]
    : "Patient";

  const initials = patient?.name
    ? patient.name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join("")
        .toUpperCase()
    : "P";

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
      <main className="flex min-h-screen items-center justify-center bg-[#f4f5f2]">
        <div className="rounded-2xl border border-[#e2e6e1] bg-white px-10 py-8 text-center shadow-[0_10px_30px_rgba(35,54,45,0.05)]">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#d7e4dc] border-t-[#39705b]" />

          <p className="mt-4 text-[13px] font-medium text-[#647169]">
            Preparing your health workspace...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f2] text-[#26362e]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-[238px] shrink-0 bg-[#0d3027] lg:flex lg:flex-col">

          <div className="px-5 pt-4">
            <Link href="/dashboard" className="block">

              <div className="flex items-start gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white text-[#579079]">
                  <span className="text-[17px]">♡</span>
                </div>

                <div>
                  <div className="text-[16px] font-bold tracking-[-0.035em] text-white">
                    HOMEHEALTH
                  </div>

                  <div className="mt-0.5 text-[9px] font-bold tracking-[0.18em] text-[#b4cbbf]">
                    360
                  </div>
                </div>

              </div>

              <div className="mt-2 text-[7px] font-medium uppercase tracking-[0.14em] text-[#8fa99d]">
                Private health intelligence
              </div>

            </Link>
          </div>

          <div className="mt-7 px-3">
            <nav className="space-y-1">

              {navItems.map((item) => (
                <SidebarItem
                  key={item.label}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={item.label === "Dashboard"}
                />
              ))}

            </nav>
          </div>

          <div className="mt-auto px-3 pb-4">

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.055] p-3.5">

              <div className="flex items-center gap-2 text-[10px] font-semibold text-[#e1ebe5]">
                <Icon name="privacy" size={17} />
                Your health data is encrypted
              </div>

              <p className="mt-1.5 text-[9px] leading-4 text-[#a9beb5]">
                Shared only with your permission.
              </p>

            </div>

            <button
              onClick={handleLogout}
              className="mt-2 flex min-h-9 w-full items-center gap-2 rounded-lg px-2 text-[11px] font-medium text-[#b9cbc3] hover:bg-white/[0.06] hover:text-white"
            >
              <Icon name="logout" size={17} />
              Sign out
            </button>

          </div>
        </aside>

        {/* MOBILE DRAWER */}

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">

            <button
              aria-label="Close navigation"
              className="absolute inset-0 bg-[#12342b]/35 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />

            <aside className="relative h-full w-[270px] bg-[#0d3027] px-4 py-5 text-white shadow-[14px_0_30px_rgba(12,48,39,0.16)]">

              <div className="flex items-start justify-between">

                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className="text-[17px] font-bold">
                    HOMEHEALTH
                  </div>

                  <div className="text-[9px] font-bold tracking-[0.18em] text-[#b4cbbf]">
                    360
                  </div>
                </Link>

                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-[#c5d5cd] hover:bg-white/[0.08]"
                >
                  <Icon name="close" size={21} />
                </button>

              </div>

              <nav className="mt-8 space-y-1">

                {navItems.map((item) => (
                  <SidebarItem
                    key={item.label}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={item.label === "Dashboard"}
                    onClick={() => setMobileOpen(false)}
                  />
                ))}

              </nav>

            </aside>
          </div>
        )}

        {/* MAIN */}

        <div className="min-w-0 flex-1">

          <div className="mx-auto max-w-[1260px] px-4 pb-8 sm:px-6 lg:px-7">

            {/* TOP BAR */}

            <header className="flex h-[58px] items-center justify-between border-b border-[#e3e6e2]">

              <div className="flex items-center gap-2 lg:hidden">

                <button
                  aria-label="Open navigation"
                  onClick={() => setMobileOpen(true)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#dfe4df] bg-white text-[#63716a]"
                >
                  <Icon name="menu" size={20} />
                </button>

                <span className="text-[13px] font-semibold text-[#3a4a42]">
                  HOMEHEALTH 360
                </span>

              </div>

              <div className="hidden text-[10px] font-medium text-[#919a95] lg:block">
                Personal health workspace
              </div>

              <div className="ml-auto flex items-center gap-3">

                <div className="hidden h-9 items-center gap-2 rounded-lg border border-[#e2e6e2] bg-white px-3 text-[10px] text-[#7f8b84] sm:flex">

                  <Icon name="search" size={15} />

                  <span>
                    Search reports, medications, events...
                  </span>

                  <span className="ml-2 text-[8px] text-[#a0a8a3]">
                    ⌘K
                  </span>

                </div>

                <span className="hidden rounded-full bg-[#e7f2eb] px-3 py-1.5 text-[8px] font-semibold text-[#477360] sm:block">
                  ● All data synced
                </span>

                <span className="text-[17px]">
                  🔔
                </span>

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dce9df] text-[9px] font-bold text-[#315e4d]">
                  {initials}
                </div>

                <div className="hidden leading-[1.1] sm:block">

                  <div className="max-w-[100px] truncate text-[10px] font-semibold text-[#314038]">
                    {patient?.name || "Patient"}
                  </div>

                  <div className="mt-0.5 text-[8px] text-[#8d9791]">
                    Premium plan
                  </div>

                </div>

              </div>
            </header>

            {/* GREETING */}

            <section className="pt-5">

              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#929b96]">
                {currentDate}
              </div>

              <div className="mt-1.5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                <div>

                  <h1 className="text-[30px] font-semibold tracking-[-0.045em] text-[#24332b] sm:text-[32px]">
                    {greeting}, {firstName}
                  </h1>

                  <p className="mt-1.5 text-[11px] text-[#7f8983]">
                    Here&apos;s what deserves your attention across your health
                    record today.
                  </p>

                </div>

                <div className="flex gap-2">

                  <Link
                    href="/ai-care-pilot"
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#dfe5e0] bg-white px-4 text-[10px] font-semibold text-[#496b5a] shadow-[0_1px_3px_rgba(30,48,40,0.03)] hover:bg-[#f8faf8]"
                  >
                    <Icon name="ai" size={16} />
                    Ask Care Copilot
                  </Link>

                  <Link
                    href="/health-records"
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#147862] px-4 text-[10px] font-semibold text-white shadow-[0_3px_10px_rgba(36,96,76,0.14)] hover:bg-[#116951]"
                  >
                    <Icon name="upload" size={16} />
                    Upload report
                  </Link>

                </div>

              </div>
            </section>

            {/* SNAPSHOT */}

            <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">

              <SnapshotCard
                title="Health snapshot"
                value="82 / 100"
                subtitle="Stable · 3 signals improved this month"
                highlighted
              />

              <SnapshotCard
                title="Care gaps"
                value="2 priority"
                subtitle="One preventive screening is due"
              />

              <SnapshotCard
                title="Upcoming"
                value="4 items"
                subtitle="Next: Annual physical on Oct 12"
              />

              <SnapshotCard
                title="Records"
                value="18 reports"
                subtitle="Latest lab report processed today"
              />

            </section>

            {/* MAIN CONTENT */}

            <section className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_0.85fr]">

              {/* HEALTH SNAPSHOT */}

              <div className="space-y-4">

                <section className="rounded-[17px] border border-[#e3e7e3] bg-white p-5">

                  <div className="flex items-start justify-between gap-2">

                    <div>

                      <div className="text-[15px] font-semibold text-[#2e4037]">
                        Your health snapshot
                      </div>

                      <div className="mt-1 text-[11px] text-[#8b948f]">
                        A simple view of recent signals—not a diagnosis.
                      </div>

                    </div>

                    <span className="rounded-full bg-[#e9f4ed] px-3 py-1.5 text-[8px] font-semibold text-[#5c806b]">
                      ● Updated today
                    </span>

                  </div>

                  <div className="mt-4 rounded-xl bg-[#f7faf7] px-4 py-4">

                    <div className="flex items-center gap-5">

                      <div className="relative flex h-[114px] w-[114px] shrink-0 items-center justify-center rounded-full border-[12px] border-[#d9ebe0] bg-white">

                        <div className="absolute inset-[-12px] rounded-full border-[12px] border-transparent border-l-[#19745a] border-t-[#19745a] border-r-[#19745a]" />

                        <div className="text-center">

                          <div className="text-[28px] font-semibold leading-none text-[#355f4e]">
                            82
                          </div>

                          <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-[#789086]">
                            Stable
                          </div>

                        </div>

                      </div>

                      <div className="min-w-0 flex-1 space-y-4">

                        <div>

                          <div className="mb-1.5 flex items-center justify-between text-[11px]">

                            <span className="font-medium text-[#63716a]">
                              Blood pressure{" "}
                              <strong className="text-[#384b41]">
                                118 / 76
                              </strong>
                            </span>

                            <span className="text-[#819087]">
                              Within your usual range
                            </span>

                          </div>

                          <div className="h-[6px] overflow-hidden rounded-full bg-[#e5ebe6]">
                            <div className="h-full w-[68%] rounded-full bg-[#176d57]" />
                          </div>

                        </div>

                        <div>

                          <div className="mb-1.5 flex items-center justify-between text-[11px]">

                            <span className="font-medium text-[#63716a]">
                              LDL cholesterol{" "}
                              <strong className="text-[#384b41]">
                                104 mg/dL
                              </strong>
                            </span>

                            <span className="text-[#819087]">
                              Improved from 119 in April
                            </span>

                          </div>

                          <div className="h-[6px] overflow-hidden rounded-full bg-[#e5ebe6]">
                            <div className="h-full w-[55%] rounded-full bg-[#4b86af]" />
                          </div>

                        </div>

                        <div>

                          <div className="mb-1.5 flex items-center justify-between text-[11px]">

                            <span className="font-medium text-[#63716a]">
                              A1C{" "}
                              <strong className="text-[#384b41]">
                                5.6%
                              </strong>
                            </span>

                            <span className="text-[#819087]">
                              Monitor at next routine labs
                            </span>

                          </div>

                          <div className="h-[6px] overflow-hidden rounded-full bg-[#e5ebe6]">
                            <div className="h-full w-[42%] rounded-full bg-[#c67e2a]" />
                          </div>

                        </div>

                      </div>
                    </div>

                  </div>
                </section>

                {/* LATEST REPORTS */}

                <section className="rounded-[17px] border border-[#e3e7e3] bg-white p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <div className="text-[15px] font-semibold text-[#2e4037]">
                        Latest reports
                      </div>

                      <div className="mt-1 text-[11px] text-[#8b948f]">
                        AI-assisted plain-language summaries of your uploaded
                        records.
                      </div>

                    </div>

                    <Link
                      href="/health-records"
                      className="text-[11px] font-semibold text-[#50715f] hover:text-[#2d5f4b]"
                    >
                      View all reports
                    </Link>

                  </div>

                  <div className="mt-4 flex items-center gap-3 border-t border-[#edf0ec] pt-4">

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#eef4f1] text-[#5f7d6d]">
                      <Icon name="file" size={19} />
                    </span>

                    <div className="min-w-0 flex-1">

                      <div className="truncate text-[12px] font-semibold text-[#3f4e46]">
                        Comprehensive metabolic panel
                      </div>

                      <div className="mt-1 text-[9px] text-[#8b948f]">
                        Mercy Health · Oct 5, 2026
                      </div>

                    </div>

                    <span className="rounded-full bg-[#e9f4ed] px-3 py-1.5 text-[8px] font-semibold text-[#5b806a]">
                      Ready to review
                    </span>

                  </div>

                </section>

              </div>

              {/* NEXT BEST ACTIONS */}

              <section className="rounded-[17px] border border-[#e3e7e3] bg-white p-5">

                <div>

                  <div className="text-[15px] font-semibold text-[#2e4037]">
                    Next best actions
                  </div>

                  <div className="mt-1 text-[11px] text-[#8b948f]">
                    Prioritized from your record and preferences.
                  </div>

                </div>

                <div className="mt-3">

                  {nextActions.map((action) => (
                    <NextActionCard
                      key={action.title}
                      {...action}
                    />
                  ))}

                </div>

                <Link
                  href="/care-gaps"
                  className="mt-3 flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#dfe6e1] bg-[#fbfcfa] text-[10px] font-semibold text-[#486b58] hover:bg-[#f3f7f3]"
                >
                  → Review care plan
                </Link>

              </section>

            </section>

            {/* FOOTER */}

            <div className="mt-5 flex items-center justify-between border-t border-[#e4e7e2] pt-3 text-[8px] text-[#9aa29d]">

              <span>
                HOMEHEALTH 360 · Your health story, clearly connected.
              </span>

              <span className="hidden sm:block">
                Health information is not a diagnosis.
              </span>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}