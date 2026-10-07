"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
};

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
  | "send"
  | "book"
  | "lab"
  | "caregiver"
  | "records"
  | "close";

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

    case "send":
      return (
        <svg {...common}>
          <path d="m22 2-7 20-4-9-9-4Z" />
          <path d="M22 2 11 13" />
        </svg>
      );

    case "book":
      return (
        <svg {...common}>
          <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z" />
          <path d="M4 5.5v16" />
        </svg>
      );

    case "lab":
      return (
        <svg {...common}>
          <path d="M9 3v6l-5 9a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 18l-5-9V3" />
          <path d="M8 3h8" />
          <path d="M7 15h10" />
        </svg>
      );

    case "caregiver":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3" />
          <path d="M5 21a7 7 0 0 1 14 0" />
          <path d="M18 5v4M16 7h4" />
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
          ? "bg-white/12 text-white"
          : "text-white/70 hover:bg-white/8 hover:text-white"
      }`}
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
          active ? "bg-white/10" : ""
        }`}
      >
        <Icon name={icon} size={21} />
      </span>

      <span>{label}</span>
    </Link>
  );
}

function QuickAction({
  icon,
  title,
  description,
  onClick,
}: {
  icon: IconName;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/50"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
        <Icon name={icon} size={21} />
      </span>

      <span className="min-w-0">
        <span className="block text-sm font-semibold text-slate-800">
          {title}
        </span>

        <span className="mt-0.5 block text-xs leading-5 text-slate-500">
          {description}
        </span>
      </span>
    </button>
  );
}

export default function AICarePilotPage() {
  const router = useRouter();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      text:
        "Hello! 👋 I’m your Healthcare 360 AI Care Pilot. I can help you understand your health records, prepare for doctor consultations, find relevant services, and guide you through your care journey.",
    },
  ]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();

    const trimmed = message.trim();

    if (!trimmed || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    const conversation = [...messages, userMessage];

    setMessages(conversation);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-care-pilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: trimmed,
          conversation,
        }),
        cache: "no-store",
      });

      const raw = await response.text();

      console.log("AI Care Pilot status:", response.status);
      console.log("AI Care Pilot response:", raw);

      let data: {
        success?: boolean;
        reply?: string;
        message?: string;
        error?: string;
        details?: string;
        model?: string;
      };

      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        throw new Error(
          `AI Care Pilot returned an invalid server response. HTTP ${response.status}`
        );
      }

      if (!response.ok || data.success === false) {
        const errorMessage =
          data.error ||
          data.details ||
          data.message ||
          `AI Care Pilot request failed. HTTP ${response.status}`;

        throw new Error(errorMessage);
      }

      const aiReply =
        typeof data.reply === "string"
          ? data.reply.trim()
          : typeof data.message === "string"
            ? data.message.trim()
            : "";

      if (!aiReply) {
        throw new Error(
          "AI Care Pilot returned no reply from the server."
        );
      }

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: aiReply,
        },
      ]);
    } catch (error) {
      console.error("AI Care Pilot error:", error);

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to connect to AI Care Pilot.";

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: `I’m having trouble connecting to AI Care Pilot right now.\n\n${errorMessage}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleQuickAction(action: string) {
    if (action === "doctor") {
      router.push("/doctor-consult");
      return;
    }

    if (action === "lab") {
      router.push("/lab-tests");
      return;
    }

    if (action === "caregiver") {
      router.push("/caregiver-booking");
      return;
    }

    if (action === "records") {
      router.push("/health-records");
      return;
    }
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
                href="/longitudinal-record"
                icon="timeline"
                label="Health Timeline"
              />

              <SidebarItem
                href="/health-gaps"
                icon="gaps"
                label="Health Gaps"
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
                active
              />

              <SidebarItem
                href="/family"
                icon="family"
                label="Family"
              />
            </nav>
          </div>

          <div className="mt-auto px-4 pb-5">
            <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-200">
                  <Icon name="lock" size={18} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-white">
                    Your privacy matters
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-white/50">
                    Your health information is private and protected.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                  KG
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    Kunal
                  </p>

                  <p className="truncate text-xs text-white/45">
                    Patient account
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">
          {/* TOP BAR */}
          <header className="flex h-[72px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
                Health Information Assistant
              </p>

              <h1 className="mt-1 text-lg font-bold text-slate-900 sm:text-xl">
                AI Care Pilot
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 sm:flex"
                aria-label="Search"
              >
                <Icon name="search" size={19} />
              </button>

              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                aria-label="Notifications"
              >
                <Icon name="bell" size={19} />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-600" />
              </button>

              <div className="ml-1 hidden items-center gap-2 border-l border-slate-200 pl-4 sm:flex">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfeee9] text-xs font-bold text-[#174f43]">
                  KG
                </div>
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-[1500px]">
              {/* TITLE */}
              <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e3f2ec] text-[#17624f]">
                      <Icon name="ai" size={25} />
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                        Your care, connected
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Get guidance across your health records, appointments,
                        reports and care services.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  AI Care Pilot is available
                </div>
              </div>

              {/* SAFETY NOTICE */}
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-[#fffaf0] p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  !
                </div>

                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Important health information
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-800/80">
                    AI Care Pilot provides general health information and care
                    coordination support. It does not replace a qualified
                    doctor or emergency medical care.
                  </p>
                </div>
              </div>

              {/* THREE COLUMN WORKSPACE */}
              <div className="mt-6 grid gap-5 xl:grid-cols-[250px_minmax(0,1fr)_280px]">
                {/* LEFT */}
                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Conversations
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Your recent care questions
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMessages([
                          {
                            id: Date.now(),
                            role: "assistant",
                            text:
                              "Hello! 👋 I’m your Healthcare 360 AI Care Pilot. How can I help you today?",
                          },
                        ]);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
                      aria-label="New conversation"
                    >
                      <Icon name="plus" size={18} />
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    <button
                      type="button"
                      className="w-full rounded-xl bg-[#edf6f2] p-3 text-left"
                    >
                      <p className="text-xs font-semibold text-[#174f43]">
                        Current health questions
                      </p>

                      <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-500">
                        Ask about your health records or next steps.
                      </p>
                    </button>

                    <button
                      type="button"
                      className="w-full rounded-xl p-3 text-left transition hover:bg-slate-50"
                    >
                      <p className="text-xs font-semibold text-slate-700">
                        Understanding my reports
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Previous conversation
                      </p>
                    </button>

                    <button
                      type="button"
                      className="w-full rounded-xl p-3 text-left transition hover:bg-slate-50"
                    >
                      <p className="text-xs font-semibold text-slate-700">
                        Doctor consultation preparation
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        Previous conversation
                      </p>
                    </button>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                      Quick actions
                    </p>

                    <div className="mt-3 space-y-2">
                      <QuickAction
                        icon="book"
                        title="Doctor consultation"
                        description="Find and book a doctor"
                        onClick={() => handleQuickAction("doctor")}
                      />

                      <QuickAction
                        icon="lab"
                        title="Lab tests"
                        description="Explore diagnostic services"
                        onClick={() => handleQuickAction("lab")}
                      />

                      <QuickAction
                        icon="caregiver"
                        title="Caregiver"
                        description="Arrange home care"
                        onClick={() => handleQuickAction("caregiver")}
                      />

                      <QuickAction
                        icon="records"
                        title="Health records"
                        description="View your uploaded records"
                        onClick={() => handleQuickAction("records")}
                      />
                    </div>
                  </div>
                </section>

                {/* CENTER */}
                <section className="flex min-h-[620px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3f2ec] text-[#17624f]">
                        <Icon name="ai" size={21} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          AI Care Pilot
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />

                          <span className="text-[11px] text-slate-400">
                            Ready to help
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setMessages([
                          {
                            id: Date.now(),
                            role: "assistant",
                            text:
                              "Hello! 👋 I’m your Healthcare 360 AI Care Pilot. How can I help you today?",
                          },
                        ]);
                      }}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-50"
                    >
                      Clear
                    </button>
                  </div>

                  {/* MESSAGES */}
                  <div className="flex-1 space-y-5 overflow-y-auto bg-[#fcfdfc] p-5 sm:p-6">
                    {messages.map((item) => (
                      <div
                        key={item.id}
                        className={`flex ${
                          item.role === "user"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex max-w-[86%] gap-3 ${
                            item.role === "user"
                              ? "flex-row-reverse"
                              : "flex-row"
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              item.role === "user"
                                ? "bg-[#dbece7] text-[#174f43]"
                                : "bg-[#e3f2ec] text-[#17624f]"
                            }`}
                          >
                            {item.role === "user" ? "KG" : "AI"}
                          </div>

                          <div
                            className={`rounded-2xl px-4 py-3 ${
                              item.role === "user"
                                ? "rounded-tr-md bg-[#174f43] text-white"
                                : "rounded-tl-md border border-slate-200 bg-white text-slate-700"
                            }`}
                          >
                            <p className="whitespace-pre-wrap text-sm leading-6">
                              {item.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {loading && (
                      <div className="flex justify-start">
                        <div className="flex max-w-[86%] gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e3f2ec] text-xs font-bold text-[#17624f]">
                            AI
                          </div>

                          <div className="rounded-2xl rounded-tl-md border border-slate-200 bg-white px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

                              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 [animation-delay:150ms]" />

                              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 [animation-delay:300ms]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* INPUT */}
                  <div className="border-t border-slate-100 bg-white p-4">
                    <form onSubmit={sendMessage}>
                      <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-[#fafbfa] p-2 transition focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-50">
                        <textarea
                          value={message}
                          onChange={(event) =>
                            setMessage(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (
                              event.key === "Enter" &&
                              !event.shiftKey
                            ) {
                              event.preventDefault();
                              void sendMessage();
                            }
                          }}
                          rows={2}
                          placeholder="Ask your care question..."
                          className="min-h-[48px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-400"
                        />

                        <button
                          type="submit"
                          disabled={!message.trim() || loading}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#174f43] text-white transition hover:bg-[#123d35] disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Send message"
                        >
                          <Icon name="send" size={19} />
                        </button>
                      </div>

                      <p className="mt-2 px-1 text-[10px] leading-4 text-slate-400">
                        AI responses are for information and care coordination
                        support only. For urgent symptoms, seek professional
                        medical care.
                      </p>
                    </form>
                  </div>
                </section>

                {/* RIGHT */}
                <section className="space-y-5">
                  {/* SOURCES */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Sources used
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        Information available to the assistant
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600">
                          <Icon name="records" size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700">
                            Health Records
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Uploaded reports
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600">
                          <Icon name="timeline" size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700">
                            Health Timeline
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Visits and health events
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600">
                          <Icon name="reminders" size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-700">
                            Reminders
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-400">
                            Personal health plan
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* RECORD ACCESS */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <Icon name="lock" size={19} />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          Record access
                        </h3>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          AI Care Pilot only uses information that is available
                          to your authenticated healthcare account.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl bg-emerald-50 px-3 py-3">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                        <span className="text-xs font-semibold text-emerald-800">
                          Protected session
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* HELP */}
                  <div className="rounded-2xl bg-[#174f43] p-5 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                      <Icon name="ai" size={21} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold">
                      Not sure what to ask?
                    </h3>

                    <p className="mt-2 text-xs leading-5 text-white/65">
                      Try asking about a recent report, your next appointment,
                      a reminder, or which care service may be appropriate.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setMessage(
                          "Help me understand my recent health records."
                        )
                      }
                      className="mt-4 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-[#174f43] transition hover:bg-emerald-50"
                    >
                      Try an example
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}