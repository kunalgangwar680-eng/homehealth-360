"use client";

import { useState } from "react";
import Link from "next/link";

type ReminderStatus = "Upcoming" | "Overdue" | "Completed";

type Reminder = {
  id: number;
  date: string;
  time: string;
  title: string;
  description: string;
  category: string;
  status: ReminderStatus;
  icon: "pill" | "vitals" | "refill" | "doctor";
};

const initialReminders: Reminder[] = [
  {
    id: 1,
    date: "TODAY",
    time: "8:00 PM",
    title: "Take atorvastatin",
    description: "20 mg · With evening routine",
    category: "Medication",
    status: "Upcoming",
    icon: "pill",
  },
  {
    id: 2,
    date: "OCT 7",
    time: "7:30 AM",
    title: "Check blood pressure",
    description: "Use completed cuff · Sit quietly for 5 minutes first",
    category: "Vitals",
    status: "Upcoming",
    icon: "vitals",
  },
  {
    id: 3,
    date: "OCT 9",
    time: "6:00 PM",
    title: "Refill lisinopril",
    description: "3 days remaining · Oak Street Pharmacy",
    category: "Medication",
    status: "Upcoming",
    icon: "refill",
  },
  {
    id: 4,
    date: "OCT 12",
    time: "9:30 AM",
    title: "Annual physical with Dr. Patel",
    description: "Lakeside Primary Care · Bring medication list",
    category: "Appointment",
    status: "Upcoming",
    icon: "doctor",
  },
];

function Icon({
  name,
  size = 20,
}: {
  name:
    | "grid"
    | "upload"
    | "timeline"
    | "shield"
    | "bell"
    | "sparkle"
    | "users"
    | "lock"
    | "search"
    | "plus"
    | "pill"
    | "vitals"
    | "refill"
    | "doctor"
    | "chevron"
    | "check"
    | "x";
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (name) {
    case "grid":
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
          <circle cx="6" cy="6" r="2" />
          <circle cx="6" cy="12" r="2" />
          <circle cx="6" cy="18" r="2" />
          <path d="M6 8v2M6 14v2" />
          <path d="M11 6h8M11 12h8M11 18h8" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 4.5 6v5.5c0 4.8 3 7.9 7.5 9.5 4.5-1.6 7.5-4.7 7.5-9.5V6z" />
        </svg>
      );

    case "bell":
      return (
        <svg {...common}>
          <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
          <path d="M10 21h4" />
        </svg>
      );

    case "sparkle":
      return (
        <svg {...common}>
          <path d="m12 3 1.3 5.2L18 10l-4.7 1.8L12 17l-1.3-5.2L6 10l4.7-1.8z" />
          <path d="m19 15 .6 2.4L22 18l-2.4.6L19 21l-.6-2.4L16 18l2.4-.6z" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" />
          <circle cx="17" cy="10" r="2.2" />
          <path d="M3.5 20c.5-3.3 2.5-5 5.5-5s5 1.7 5.5 5" />
          <path d="M14 16c2.7-.2 5 1.2 6 4" />
        </svg>
      );

    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      );

    case "search":
      return (
        <svg {...common}>
          <circle cx="10.8" cy="10.8" r="6.3" />
          <path d="m16 16 4.5 4.5" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );

    case "pill":
      return (
        <svg {...common}>
          <path d="M8.7 4.5a4.5 4.5 0 0 1 6.4 0l4.4 4.4a4.5 4.5 0 0 1-6.4 6.4l-4.4-4.4a4.5 4.5 0 0 1 0-6.4Z" />
          <path d="m7.7 12.3 5-5" />
        </svg>
      );

    case "vitals":
      return (
        <svg {...common}>
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      );

    case "refill":
      return (
        <svg {...common}>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M9 8h6M9 12h6M9 16h3" />
          <path d="M17 14v5" />
        </svg>
      );

    case "doctor":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" />
          <path d="M5 21c.5-4.3 2.8-7 7-7s6.5 2.7 7 7" />
          <path d="M17 4v4M15 6h4" />
        </svg>
      );

    case "chevron":
      return (
        <svg {...common}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "x":
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
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: Parameters<typeof Icon>[0]["name"];
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex h-[46px] items-center gap-2.5 rounded-[10px] px-3 text-[13px] transition ${
        active
          ? "bg-[#19493f] text-white"
          : "text-[#d2dfda] hover:bg-[#173f36] hover:text-white"
      }`}
    >
      <span className="flex w-[20px] items-center justify-center">
        <Icon name={icon} size={16} />
      </span>

      <span>{label}</span>

      {active && (
        <span className="ml-auto h-[5px] w-[5px] rounded-full bg-[#63d7b7]" />
      )}
    </Link>
  );
}

function ReminderIcon({
  type,
}: {
  type: Reminder["icon"];
}) {
  return (
    <div className="flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-[8px] bg-[#e8f0f7] text-[#56809b]">
      <Icon
        name={type}
        size={17}
      />
    </div>
  );
}

function StatusPill({
  children,
  type,
}: {
  children: string;
  type: "category" | "status";
}) {
  return (
    <span
      className={`inline-flex h-[22px] items-center gap-1 rounded-full px-2.5 text-[10px] font-medium ${
        type === "category"
          ? "bg-[#edf1ee] text-[#62736d]"
          : "bg-[#e9f0fa] text-[#4679b7]"
      }`}
    >
      <span
        className={`h-[6px] w-[6px] rounded-full ${
          type === "category" ? "bg-[#7c9189]" : "bg-[#4d83c2]"
        }`}
      />
      {children}
    </span>
  );
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>(initialReminders);

  const [tab, setTab] = useState<ReminderStatus>("Upcoming");

  const [title, setTitle] = useState("Schedule eye screening");
  const [date, setDate] = useState("October 22, 2026");
  const [time, setTime] = useState("9:00 AM");
  const [category, setCategory] = useState("Preventive care");
  const [repeat, setRepeat] = useState(false);

  const [showMobileModal, setShowMobileModal] = useState(false);

  const filteredReminders = reminders.filter(
    (reminder) => reminder.status === tab
  );

  function markComplete(id: number) {
    setReminders((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Completed",
            }
          : item
      )
    );

    setTab("Completed");
  }

  function saveReminder() {
    if (!title.trim()) return;

    const newReminder: Reminder = {
      id: Date.now(),
      date: "OCT 22",
      time: time || "9:00 AM",
      title: title.trim(),
      description: repeat
        ? "Repeats automatically"
        : "One-time reminder",
      category: category || "Preventive care",
      status: "Upcoming",
      icon: "doctor",
    };

    setReminders((current) => [...current, newReminder]);
    setTab("Upcoming");
    setShowMobileModal(false);
  }

  return (
    <div className="min-h-screen bg-[#f5f7f5] text-[#183a33]">
      <div className="flex min-h-screen">
        {/* ================= SIDEBAR ================= */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[202px] bg-[#0d2d26] lg:flex lg:flex-col">
          {/* LOGO */}
          <div className="flex h-[64px] items-center px-[12px]">
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5"
            >
              <div className="flex h-[29px] w-[29px] items-center justify-center rounded-[8px] bg-white text-[#137361]">
                <span className="text-[18px] leading-none">♥</span>
              </div>

              <div className="leading-none">
                <div className="text-[13px] font-medium tracking-[-0.02em] text-white">
                  HOMEHEALTH
                </div>

                <div className="mt-[4px] text-[8px] font-medium text-[#b8c9c4]">
                  360
                </div>
              </div>
            </Link>
          </div>

          {/* NAVIGATION */}
          <nav className="px-[7px] pt-[10px]">
            <SidebarItem
              href="/dashboard"
              label="Dashboard"
              icon="grid"
            />

            <SidebarItem
              href="/health-records"
              label="Upload report"
              icon="upload"
            />

            <SidebarItem
              href="/health-timeline"
              label="Health timeline"
              icon="timeline"
            />

            <SidebarItem
              href="/care-gaps"
              label="Care gaps"
              icon="shield"
            />

            <SidebarItem
              href="/reminders"
              label="Reminders"
              icon="bell"
              active
            />

            <SidebarItem
              href="/ai-care-copilot"
              label="AI Care Copilot"
              icon="sparkle"
            />

            <SidebarItem
              href="/family-healthcare"
              label="Family healthcare"
              icon="users"
            />
          </nav>

          {/* PRIVACY */}
          <div className="mt-[17px] px-[7px]">
            <div className="rounded-[11px] border border-[#245046] bg-[#123b32] px-[11px] py-[10px]">
              <div className="flex items-center gap-2 text-[12px] font-medium text-[#dbe7e3]">
                <Icon name="lock" size={13} />
                Privacy center
              </div>

              <p className="mt-[7px] text-[10px] leading-[14px] text-[#92aaa3]">
                Your health data is encrypted
                <br />
                and shared only with
                <br />
                your permission.
              </p>
            </div>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="min-w-0 flex-1 lg:ml-[202px]">
          {/* TOP BAR */}
          <header className="h-[58px] border-b border-[#e0e5e2] bg-[#fafcfb]">
            <div className="flex h-full items-center justify-between px-[24px]">
              {/* SEARCH */}
              <div className="flex h-[32px] w-[290px] items-center gap-2 rounded-[9px] border border-[#e1e6e3] bg-[#f5f7f6] px-[11px] text-[#879590]">
                <Icon name="search" size={15} />

                <span className="text-[11px]">
                  Search reports, medications, events...
                </span>

                <span className="ml-auto text-[10px] text-[#a0aaa7]">
                  ⌘K
                </span>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-[12px]">
                <div className="hidden h-[25px] items-center gap-[6px] rounded-full bg-[#e8f4ef] px-[11px] text-[10px] font-medium text-[#397b69] sm:flex">
                  <span className="h-[6px] w-[6px] rounded-full bg-[#238c72]" />
                  All data synced
                </div>

                <button
                  type="button"
                  className="text-[16px] text-[#7c7560]"
                  aria-label="Notifications"
                >
                  🔔
                </button>

                <div className="flex items-center gap-[7px]">
                  <div className="flex h-[29px] w-[29px] items-center justify-center rounded-full bg-[#e2eeea] text-[10px] font-semibold text-[#3c7062]">
                    AM
                  </div>

                  <div className="hidden leading-tight sm:block">
                    <div className="text-[11px] font-medium text-[#31453f]">
                      Alex Morgan
                    </div>
                    <div className="text-[9px] text-[#899590]">
                      Premium plan
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="px-[24px] pb-[35px] pt-[20px]">
            {/* PAGE HEADING */}
            <div className="flex items-end justify-between gap-5">
              <div>
                <div className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#167462]">
                  PERSONAL HEALTH PLAN
                </div>

                <h1 className="mt-[2px] text-[29px] font-semibold tracking-[-0.04em] text-[#173d35]">
                  Reminders
                </h1>

                <p className="mt-[1px] text-[12px] text-[#7d8d87]">
                  Stay ahead of appointments, medications, labs, and everyday
                  health tasks.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowMobileModal(true)}
                className="flex h-[34px] items-center gap-[6px] rounded-[9px] bg-[#0d7663] px-[14px] text-[11px] font-medium text-white shadow-sm transition hover:bg-[#086653]"
              >
                <Icon name="plus" size={14} />
                Add reminder
              </button>
            </div>

            {/* ================= SUMMARY ================= */}
            <div className="mt-[16px] grid grid-cols-2 gap-[12px] xl:grid-cols-4">
              <SummaryCard
                label="This week"
                value="4"
              />

              <SummaryCard
                label="Overdue"
                value="1"
              />

              <SummaryCard
                label="Completed"
                value="12"
              />

              <SummaryCard
                label="Adherence"
                value="92%"
              />
            </div>

            {/* ================= LOWER GRID ================= */}
            <div className="mt-[17px] grid gap-[14px] xl:grid-cols-[minmax(0,1fr)_376px]">
              {/* REMINDER LIST */}
              <section className="rounded-[16px] bg-white px-[17px] pb-[16px] pt-[14px] shadow-[0_3px_16px_rgba(25,50,43,0.045)]">
                {/* TABS */}
                <div className="flex items-center gap-[7px]">
                  <TabButton
                    active={tab === "Upcoming"}
                    onClick={() => setTab("Upcoming")}
                  >
                    Upcoming
                  </TabButton>

                  <TabButton
                    active={tab === "Overdue"}
                    onClick={() => setTab("Overdue")}
                  >
                    Overdue
                  </TabButton>

                  <TabButton
                    active={tab === "Completed"}
                    onClick={() => setTab("Completed")}
                  >
                    Completed
                  </TabButton>
                </div>

                {/* DATE GROUP */}
                <div className="mt-[10px]">
                  {filteredReminders.length === 0 ? (
                    <div className="flex min-h-[180px] items-center justify-center text-[12px] text-[#8b9893]">
                      No reminders in this category.
                    </div>
                  ) : (
                    <>
                      {tab === "Upcoming" && (
                        <>
                          <div className="mb-[3px] text-[9px] font-medium uppercase tracking-[0.07em] text-[#778883]">
                            TODAY · OCTOBER 5
                          </div>

                          <ReminderRow
                            reminder={filteredReminders[0]}
                            onComplete={markComplete}
                          />

                          <div className="mt-[8px] text-[9px] font-medium uppercase tracking-[0.07em] text-[#778883]">
                            THIS WEEK
                          </div>

                          {filteredReminders
                            .slice(1)
                            .map((reminder) => (
                              <ReminderRow
                                key={reminder.id}
                                reminder={reminder}
                                onComplete={markComplete}
                              />
                            ))}
                        </>
                      )}

                      {tab !== "Upcoming" &&
                        filteredReminders.map((reminder) => (
                          <ReminderRow
                            key={reminder.id}
                            reminder={reminder}
                            onComplete={markComplete}
                          />
                        ))}
                    </>
                  )}
                </div>
              </section>

              {/* ================= ADD REMINDER ================= */}
              <aside className="rounded-[16px] bg-white px-[18px] pb-[17px] pt-[17px] shadow-[0_3px_16px_rgba(25,50,43,0.045)]">
                <h2 className="text-[16px] font-semibold text-[#25443c]">
                  Add a reminder
                </h2>

                <p className="mt-[1px] text-[11px] text-[#8a9792]">
                  Create a one-time or repeating task.
                </p>

                {/* TITLE */}
                <FormLabel label="Reminder title">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-[36px] w-full rounded-[9px] border border-[#dfe5e2] bg-white px-[11px] text-[11px] text-[#374b45] outline-none transition focus:border-[#74a99c]"
                  />
                </FormLabel>

                {/* DATE */}
                <FormLabel label="Date">
                  <input
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-[36px] w-full rounded-[9px] border border-[#dfe5e2] bg-white px-[11px] text-[11px] text-[#374b45] outline-none transition focus:border-[#74a99c]"
                  />
                </FormLabel>

                {/* TIME */}
                <FormLabel label="Time">
                  <input
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-[36px] w-full rounded-[9px] border border-[#dfe5e2] bg-white px-[11px] text-[11px] text-[#374b45] outline-none transition focus:border-[#74a99c]"
                  />
                </FormLabel>

                {/* CATEGORY */}
                <FormLabel label="Category">
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-[36px] w-full rounded-[9px] border border-[#dfe5e2] bg-white px-[11px] text-[11px] text-[#374b45] outline-none transition focus:border-[#74a99c]"
                  />
                </FormLabel>

                {/* REPEAT */}
                <div className="mt-[14px] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-medium text-[#49605a]">
                      Repeat reminder
                    </div>

                    <div className="mt-[1px] text-[9px] text-[#9aa5a1]">
                      {repeat ? "Repeats automatically" : "One-time reminder"}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setRepeat(!repeat)}
                    className={`relative h-[18px] w-[31px] rounded-full transition ${
                      repeat ? "bg-[#0d8069]" : "bg-[#d9dfdc]"
                    }`}
                    aria-label="Toggle repeat reminder"
                  >
                    <span
                      className={`absolute top-[3px] h-[12px] w-[12px] rounded-full bg-white shadow-sm transition ${
                        repeat ? "left-[16px]" : "left-[3px]"
                      }`}
                    />
                  </button>
                </div>

                {/* SAVE */}
                <button
                  type="button"
                  onClick={saveReminder}
                  className="mt-[14px] h-[34px] w-full rounded-[8px] bg-[#0d7965] text-[11px] font-medium text-white transition hover:bg-[#086653]"
                >
                  Save reminder
                </button>
              </aside>
            </div>
          </div>
        </main>
      </div>

      {/* ================= MOBILE MODAL ================= */}
      {showMobileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c2d26]/25 p-5 backdrop-blur-[2px] lg:hidden">
          <div className="w-full max-w-[400px] rounded-[16px] bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#25443c]">
                Add a reminder
              </h2>

              <button
                type="button"
                onClick={() => setShowMobileModal(false)}
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#f1f4f2] text-[#66756f]"
              >
                <Icon name="x" size={16} />
              </button>
            </div>

            <div className="mt-5">
              <FormLabel label="Reminder title">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-[40px] w-full rounded-[9px] border border-[#dfe5e2] px-3 text-[12px] outline-none"
                />
              </FormLabel>

              <FormLabel label="Date">
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-[40px] w-full rounded-[9px] border border-[#dfe5e2] px-3 text-[12px] outline-none"
                />
              </FormLabel>

              <FormLabel label="Time">
                <input
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-[40px] w-full rounded-[9px] border border-[#dfe5e2] px-3 text-[12px] outline-none"
                />
              </FormLabel>

              <FormLabel label="Category">
                <input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-[40px] w-full rounded-[9px] border border-[#dfe5e2] px-3 text-[12px] outline-none"
                />
              </FormLabel>

              <button
                type="button"
                onClick={saveReminder}
                className="mt-4 h-[40px] w-full rounded-[9px] bg-[#0d7965] text-[12px] font-medium text-white"
              >
                Save reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="h-[102px] rounded-[16px] bg-white px-[18px] py-[17px] shadow-[0_3px_16px_rgba(25,50,43,0.045)]">
      <div className="text-[11px] text-[#8a9792]">{label}</div>

      <div className="mt-[10px] text-[23px] font-semibold tracking-[-0.03em] text-[#193b34]">
        {value}
      </div>
    </div>
  );
}

function TabButton({
  children,
  active,
  onClick,
}: {
  children: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[27px] rounded-full border px-[13px] text-[10px] font-medium transition ${
        active
          ? "border-[#08745f] bg-[#08745f] text-white"
          : "border-[#dce2df] bg-white text-[#46554f] hover:bg-[#f5f7f6]"
      }`}
    >
      {children}
    </button>
  );
}

function FormLabel({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="mt-[12px] block">
      <span className="mb-[5px] block text-[10px] font-medium text-[#50635c]">
        {label}
      </span>

      {children}
    </label>
  );
}

function ReminderRow({
  reminder,
  onComplete,
}: {
  reminder: Reminder;
  onComplete: (id: number) => void;
}) {
  return (
    <div className="flex min-h-[57px] items-center gap-[9px] border-b border-[#e4e8e6]">
      {/* CHECK CIRCLE */}
      <button
        type="button"
        onClick={() =>
          reminder.status !== "Completed" && onComplete(reminder.id)
        }
        className={`flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border ${
          reminder.status === "Completed"
            ? "border-[#58a994] bg-[#58a994] text-white"
            : "border-[#65a897] bg-white"
        }`}
        aria-label="Complete reminder"
      >
        {reminder.status === "Completed" && (
          <Icon name="check" size={12} />
        )}
      </button>

      {/* DATE */}
      <div className="w-[47px] shrink-0 text-center">
        <div className="text-[10px] font-semibold text-[#21705f]">
          {reminder.date}
        </div>

        <div className="mt-[1px] text-[8px] text-[#899691]">
          {reminder.time}
        </div>
      </div>

      {/* ICON */}
      <ReminderIcon type={reminder.icon} />

      {/* TEXT */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-medium text-[#344b44]">
          {reminder.title}
        </div>

        <div className="mt-[2px] truncate text-[9px] text-[#8a9792]">
          {reminder.description}
        </div>
      </div>

      {/* PILLS */}
      <div className="hidden shrink-0 items-center gap-[7px] md:flex">
        <StatusPill type="category">
          {reminder.category}
        </StatusPill>

        <StatusPill type="status">
          {reminder.status}
        </StatusPill>
      </div>
    </div>
  );
}