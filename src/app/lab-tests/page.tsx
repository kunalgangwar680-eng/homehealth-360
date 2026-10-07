"use client";

import { useState } from "react";
import Link from "next/link";

type IconName =
  | "grid"
  | "upload"
  | "timeline"
  | "gaps"
  | "reminders"
  | "ai"
  | "family"
  | "privacy"
  | "search"
  | "bell"
  | "lab"
  | "clock"
  | "shield"
  | "home"
  | "check"
  | "arrow"
  | "calendar"
  | "user"
  | "report"
  | "close";

function Icon({
  name,
  size = 18,
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
    case "grid":
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
          <path d="M9 2v3M15 2v3M9 19v3M15 19v3" />
          <path d="M2 9h3M2 15h3M19 9h3M19 15h3" />
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

    case "privacy":
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

    case "lab":
      return (
        <svg {...common}>
          <path d="M9 3v6l-5 9a2 2 0 0 0 1.8 3h12.4A2 2 0 0 0 20 18l-5-9V3" />
          <path d="M8 3h8" />
          <path d="M7 15h10" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5c0 5.2-3.4 8.5-8 10-4.6-1.5-8-4.8-8-10V6z" />
          <path d="m8.5 12 2.2 2.2 4.8-5" />
        </svg>
      );

    case "home":
      return (
        <svg {...common}>
          <path d="m3 11 9-8 9 8" />
          <path d="M5 10v10h14V10" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 10h18" />
        </svg>
      );

    case "user":
      return (
        <svg {...common}>
          <circle cx="12" cy="7" r="3.5" />
          <path d="M5 21a7 7 0 0 1 14 0" />
        </svg>
      );

    case "report":
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
  label,
  icon,
  active = false,
}: {
  href: string;
  label: string;
  icon: IconName;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
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

type LabPackage = {
  name: string;
  description: string;
  price: string;
  popular?: boolean;
};

const labPackages: LabPackage[] = [
  {
    name: "Basic Health Check",
    description:
      "CBC, blood sugar, lipid profile, liver & kidney function",
    price: "₹1,499",
    popular: true,
  },
  {
    name: "Complete Health Check",
    description:
      "Basic tests plus thyroid, vitamin D, B12 and urine",
    price: "₹2,999",
  },
  {
    name: "Senior Health Package",
    description:
      "Heart, diabetes, kidney, liver and vitamin profile",
    price: "₹2,499",
  },
];

const individualTests = [
  {
    name: "CBC",
    description: "Blood count and general screening",
  },
  {
    name: "Blood Sugar",
    description: "FBS, PPBS and HbA1c",
  },
  {
    name: "Lipid Profile",
    description: "Cholesterol and heart health",
  },
  {
    name: "Liver Function",
    description: "Liver health markers",
  },
  {
    name: "Kidney Function",
    description: "Kidney health markers",
  },
  {
    name: "Thyroid Profile",
    description: "Thyroid hormone assessment",
  },
];

export default function LabTestsPage() {
  const [activeTab, setActiveTab] = useState<
    "series" | "rapid"
  >("series");

  const [selectedService, setSelectedService] =
    useState(false);

  const [showOrderPanel, setShowOrderPanel] =
    useState(false);

  const [orderPlaced, setOrderPlaced] =
    useState(false);

  const [selectedPackage, setSelectedPackage] =
    useState("Complete Blood Panel");

  function openOrder(serviceName: string) {
    setSelectedPackage(serviceName);
    setShowOrderPanel(true);
    setOrderPlaced(false);
  }

  function placeOrder() {
    setOrderPlaced(true);
    setSelectedService(true);
  }

  return (
    <main className="min-h-screen bg-[#f4f5f2] text-[#26362e]">
      <div className="flex min-h-screen">

        {/* ================================================= */}
        {/* DESKTOP SIDEBAR */}
        {/* ================================================= */}

        <aside className="fixed left-0 top-0 hidden h-screen w-[226px] bg-[#0d2b23] px-4 py-4 text-white lg:block">

          <div className="flex items-center gap-3 px-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex h-[35px] w-[35px] items-center justify-center rounded-[8px] bg-white text-[#58937f]">
                <span className="text-[19px]">♡</span>
              </div>

              <div>
                <div className="text-[14px] font-semibold tracking-[-0.02em]">
                  HOMEHEALTH
                </div>

                <div className="text-[9px] font-semibold text-white/65">
                  360
                </div>
              </div>
            </Link>
          </div>

          <nav className="mt-7 space-y-1">

            <SidebarItem
              href="/dashboard"
              icon="grid"
              label="Dashboard"
            />

            <SidebarItem
              href="/health-records"
              icon="upload"
              label="Upload report"
            />

            <SidebarItem
              href="/longitudinal-record"
              icon="timeline"
              label="Health timeline"
            />

            <SidebarItem
              href="/health-gaps"
              icon="gaps"
              label="Care gaps"
            />

            <SidebarItem
              href="/reminders"
              icon="reminders"
              label="Reminders"
            />

            <SidebarItem
              href="/ai-care-pilot"
              icon="ai"
              label="AI Care Copilot"
            />

            <SidebarItem
              href="/family"
              icon="family"
              label="Family healthcare"
            />

          </nav>

          <div className="absolute bottom-4 left-4 right-4">

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.055] p-3.5">

              <div className="flex items-center gap-2 text-[10px] font-semibold text-[#e1ebe5]">
                <Icon name="privacy" size={17} />
                Your health data is encrypted
              </div>

              <p className="mt-1.5 text-[9px] leading-4 text-[#a9beb5]">
                Shared only with your permission.
              </p>

            </div>

          </div>
        </aside>

        {/* ================================================= */}
        {/* MAIN */}
        {/* ================================================= */}

        <div className="min-w-0 flex-1 lg:ml-[226px]">

          {/* ================================================= */}
          {/* TOP BAR */}
          {/* ================================================= */}

          <header className="flex h-[66px] items-center justify-between border-b border-[#e2e6e2] bg-white px-5 sm:px-7">

            <div className="flex min-w-0 items-center gap-3">

              <div className="hidden sm:block">

                <div className="text-[11px] font-semibold text-[#65756d]">
                  LAB SERVICES
                </div>

                <div className="mt-0.5 text-[9px] text-[#9aa39e]">
                  Home diagnostics & sample collection
                </div>

              </div>

              <div className="flex items-center gap-2 rounded-lg border border-[#e3e8e4] bg-[#fbfcfa] px-3 py-2 text-[10px] text-[#89948e] lg:ml-4">

                <Icon
                  name="search"
                  size={15}
                />

                <span className="hidden sm:inline">
                  Search reports, medications, events…
                </span>

                <span className="sm:hidden">
                  Search
                </span>

              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f7f4] text-[#51645b]">

                <Icon
                  name="bell"
                  size={17}
                />

                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#2f8a69]" />

              </div>

              <div className="hidden items-center gap-2 sm:flex">

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#dcebe3] text-[10px] font-semibold text-[#35604e]">
                  AM
                </div>

                <div>
                  <div className="text-[10px] font-semibold text-[#3f4f47]">
                    Alex Morgan
                  </div>

                  <div className="text-[8px] text-[#929b96]">
                    Premium plan
                  </div>
                </div>

              </div>

            </div>

          </header>

          {/* ================================================= */}
          {/* CONTENT */}
          {/* ================================================= */}

          <div className="px-4 py-5 sm:px-6 lg:px-8">

            <div className="mx-auto max-w-[1180px]">

              {/* PAGE HEADER */}

              <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                <div>

                  <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#668077]">
                    DIAGNOSTICS
                  </div>

                  <h1 className="mt-1.5 text-[25px] font-semibold tracking-[-0.035em] text-[#263a32]">
                    Lab services
                  </h1>

                  <p className="mt-1.5 max-w-[620px] text-[11px] leading-5 text-[#7d8983]">
                    Book trusted diagnostic services from home and keep
                    your reports connected to your health record.
                  </p>

                </div>

                <div className="flex items-center gap-2 rounded-full bg-[#e9f4ed] px-3 py-2 text-[9px] font-semibold text-[#527562]">

                  <span className="h-1.5 w-1.5 rounded-full bg-[#2b8768]" />

                  Home sample collection available

                </div>

              </section>

              {/* ================================================= */}
              {/* RAPID SERVICE HIGHLIGHT */}
              {/* ================================================= */}

              <section className="mt-5 rounded-[17px] border border-[#dfe7e1] bg-[#eef6f0] p-5 sm:p-6">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-white text-[#35745c] shadow-sm">
                      <Icon
                        name="lab"
                        size={23}
                      />
                    </div>

                    <div>

                      <div className="flex flex-wrap items-center gap-2">

                        <h2 className="text-[17px] font-semibold text-[#29473b]">
                          Rapid Home Lab Service
                        </h2>

                        <span className="rounded-full bg-[#d8eee1] px-2.5 py-1 text-[8px] font-bold text-[#39735a]">
                          NEW SERVICE
                        </span>

                      </div>

                      <p className="mt-1.5 max-w-[650px] text-[10px] leading-5 text-[#708079]">
                        Order a blood test from home. Our lab partner
                        can arrange sample collection within 10 minutes
                        and upload the report within 1 hour,
                        subject to service availability.
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("rapid");
                      setSelectedService(true);
                    }}
                    className="flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#19765f] px-5 text-[10px] font-semibold text-white transition hover:bg-[#145f4d]"
                  >
                    Order service

                    <Icon
                      name="arrow"
                      size={15}
                    />
                  </button>

                </div>

                <div className="mt-5 grid gap-3 border-t border-[#d8e6dc] pt-4 sm:grid-cols-3">

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#39755e]">
                      <Icon
                        name="clock"
                        size={17}
                      />
                    </span>

                    <div>
                      <div className="text-[11px] font-semibold text-[#3a554a]">
                        10 minutes
                      </div>

                      <div className="text-[9px] text-[#83908a]">
                        Blood sample collection
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#39755e]">
                      <Icon
                        name="report"
                        size={17}
                      />
                    </span>

                    <div>
                      <div className="text-[11px] font-semibold text-[#3a554a]">
                        Within 1 hour
                      </div>

                      <div className="text-[9px] text-[#83908a]">
                        Report uploaded
                      </div>
                    </div>

                  </div>

                  <div className="flex items-center gap-3">

                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#39755e]">
                      <Icon
                        name="shield"
                        size={17}
                      />
                    </span>

                    <div>
                      <div className="text-[11px] font-semibold text-[#3a554a]">
                        Trusted lab partner
                      </div>

                      <div className="text-[9px] text-[#83908a]">
                        Secure report handling
                      </div>
                    </div>

                  </div>

                </div>

              </section>

              {/* ================================================= */}
              {/* TABS */}
              {/* ================================================= */}

              <div className="mt-5 border-b border-[#dfe4e0]">

                <div className="flex items-center gap-6">

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab("series")
                    }
                    className={[
                      "relative min-h-10 px-1 text-[11px] font-semibold",
                      activeTab === "series"
                        ? "text-[#28624e]"
                        : "text-[#89938e]",
                    ].join(" ")}
                  >
                    Lab series

                    {activeTab === "series" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#19765f]" />
                    )}

                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveTab("rapid")
                    }
                    className={[
                      "relative min-h-10 px-1 text-[11px] font-semibold",
                      activeTab === "rapid"
                        ? "text-[#28624e]"
                        : "text-[#89938e]",
                    ].join(" ")}
                  >
                    Rapid home service

                    {activeTab === "rapid" && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#19765f]" />
                    )}

                  </button>

                </div>

              </div>

              {/* ================================================= */}
              {/* LAB SERIES */}
              {/* ================================================= */}

              {activeTab === "series" && (
                <>

                  <section className="mt-5 rounded-[17px] border border-[#e3e7e3] bg-white p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <h2 className="text-[15px] font-semibold text-[#2e4037]">
                          Popular lab series
                        </h2>

                        <p className="mt-1 text-[10px] text-[#8b948f]">
                          Pre-defined health check packages for routine
                          monitoring and wellness.
                        </p>

                      </div>

                      <button
                        type="button"
                        className="hidden text-[9px] font-semibold text-[#47715e] sm:block"
                      >
                        View all →
                      </button>

                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-3">

                      {labPackages.map((item) => (
                        <div
                          key={item.name}
                          className="rounded-[14px] border border-[#e2e8e3] bg-[#fcfdfb] p-4"
                        >

                          <div className="flex items-start justify-between gap-2">

                            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#edf5ef] text-[#4d7b67]">
                              <Icon
                                name="lab"
                                size={18}
                              />
                            </div>

                            {item.popular && (
                              <span className="rounded-full bg-[#e8f3ec] px-2 py-1 text-[7px] font-bold text-[#568069]">
                                Most popular
                              </span>
                            )}

                          </div>

                          <h3 className="mt-3 text-[12px] font-semibold text-[#374940]">
                            {item.name}
                          </h3>

                          <p className="mt-1.5 min-h-[36px] text-[9px] leading-4 text-[#89938e]">
                            {item.description}
                          </p>

                          <div className="mt-4 flex items-end justify-between gap-2">

                            <div className="text-[17px] font-semibold text-[#293f35]">
                              {item.price}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                openOrder(item.name)
                              }
                              className="rounded-lg bg-[#19765f] px-3 py-2 text-[8px] font-semibold text-white hover:bg-[#145f4d]"
                            >
                              Book now
                            </button>

                          </div>

                        </div>
                      ))}

                    </div>

                  </section>

                  {/* INDIVIDUAL TESTS */}

                  <section className="mt-4 rounded-[17px] border border-[#e3e7e3] bg-white p-5">

                    <div>

                      <h2 className="text-[15px] font-semibold text-[#2e4037]">
                        Individual lab tests
                      </h2>

                      <p className="mt-1 text-[10px] text-[#8b948f]">
                        Choose an individual diagnostic test.
                      </p>

                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

                      {individualTests.map((test) => (
                        <button
                          type="button"
                          key={test.name}
                          onClick={() =>
                            openOrder(test.name)
                          }
                          className="group flex min-h-[72px] items-center gap-3 rounded-[12px] border border-[#e5e9e5] bg-[#fcfdfb] px-3 text-left transition hover:border-[#cbded2] hover:bg-[#f7faf7]"
                        >

                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#eef5ef] text-[#5c806e]">
                            <Icon
                              name="lab"
                              size={17}
                            />
                          </span>

                          <span className="min-w-0 flex-1">

                            <span className="block text-[10px] font-semibold text-[#415149]">
                              {test.name}
                            </span>

                            <span className="mt-1 block text-[8px] leading-4 text-[#919a95]">
                              {test.description}
                            </span>

                          </span>

                          <Icon
                            name="arrow"
                            size={14}
                          />

                        </button>
                      ))}

                    </div>

                  </section>

                </>
              )}

              {/* ================================================= */}
              {/* RAPID HOME SERVICE */}
              {/* ================================================= */}

              {activeTab === "rapid" && (
                <section className="mt-5 space-y-4">

                  {/* SERVICE CARD */}

                  <div className="rounded-[17px] border border-[#dfe7e1] bg-white p-5 sm:p-6">

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">

                      <div>

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#e9f4ed] text-[#39755e]">
                            <Icon
                              name="lab"
                              size={22}
                            />
                          </div>

                          <div>

                            <div className="flex items-center gap-2">

                              <h2 className="text-[17px] font-semibold text-[#2e4037]">
                                Rapid Home Blood Test
                              </h2>

                              <span className="rounded-full bg-[#e8f3ec] px-2 py-1 text-[7px] font-bold text-[#4e7a63]">
                                NEW
                              </span>

                            </div>

                            <p className="mt-1 text-[9px] text-[#89938e]">
                              Fast sample collection and report delivery.
                            </p>

                          </div>

                        </div>

                      </div>

                      <div className="rounded-xl bg-[#f5f8f5] px-4 py-3">

                        <div className="text-[8px] font-semibold uppercase tracking-[0.12em] text-[#87938c]">
                          Selected service
                        </div>

                        <div className="mt-1 text-[11px] font-semibold text-[#395047]">
                          {selectedService
                            ? "Rapid Home Blood Test"
                            : "Not selected"}
                        </div>

                      </div>

                    </div>

                    <div className="mt-6 grid gap-3 md:grid-cols-3">

                      <div className="rounded-[13px] bg-[#f7faf7] p-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4e7b66]">
                          <Icon
                            name="clock"
                            size={18}
                          />
                        </div>

                        <div className="mt-3 text-[12px] font-semibold text-[#3c5148]">
                          10-minute collection
                        </div>

                        <p className="mt-1 text-[9px] leading-4 text-[#8a948f]">
                          A lab partner comes to your selected address
                          for blood sample collection.
                        </p>

                      </div>

                      <div className="rounded-[13px] bg-[#f7faf7] p-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4e7b66]">
                          <Icon
                            name="report"
                            size={18}
                          />
                        </div>

                        <div className="mt-3 text-[12px] font-semibold text-[#3c5148]">
                          Report within 1 hour
                        </div>

                        <p className="mt-1 text-[9px] leading-4 text-[#8a948f]">
                          Once the test is processed, the report is
                          uploaded to your health record.
                        </p>

                      </div>

                      <div className="rounded-[13px] bg-[#f7faf7] p-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4e7b66]">
                          <Icon
                            name="shield"
                            size={18}
                          />
                        </div>

                        <div className="mt-3 text-[12px] font-semibold text-[#3c5148]">
                          Secure health record
                        </div>

                        <p className="mt-1 text-[9px] leading-4 text-[#8a948f]">
                          Your uploaded report stays connected to your
                          Healthcare 360 record.
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* HOW IT WORKS */}

                  <div className="rounded-[17px] border border-[#e3e7e3] bg-white p-5">

                    <h2 className="text-[15px] font-semibold text-[#2e4037]">
                      How it works
                    </h2>

                    <p className="mt-1 text-[10px] text-[#8b948f]">
                      A simple three-step service journey.
                    </p>

                    <div className="mt-5 grid gap-4 md:grid-cols-3">

                      <div className="relative">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9f4ed] text-[11px] font-bold text-[#39755e]">
                          1
                        </div>

                        <h3 className="mt-3 text-[11px] font-semibold text-[#405149]">
                          Place your order
                        </h3>

                        <p className="mt-1 text-[9px] leading-4 text-[#89938e]">
                          Select the test, address and preferred
                          collection details.
                        </p>

                      </div>

                      <div className="relative">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9f4ed] text-[11px] font-bold text-[#39755e]">
                          2
                        </div>

                        <h3 className="mt-3 text-[11px] font-semibold text-[#405149]">
                          Sample collection
                        </h3>

                        <p className="mt-1 text-[9px] leading-4 text-[#89938e]">
                          Our partner lab arranges home blood sample
                          collection within 10 minutes.
                        </p>

                      </div>

                      <div className="relative">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e9f4ed] text-[11px] font-bold text-[#39755e]">
                          3
                        </div>

                        <h3 className="mt-3 text-[11px] font-semibold text-[#405149]">
                          Report upload
                        </h3>

                        <p className="mt-1 text-[9px] leading-4 text-[#89938e]">
                          Your report is uploaded to your health record
                          within 1 hour, subject to processing.
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* ORDER FORM */}

                  <div className="rounded-[17px] border border-[#e3e7e3] bg-white p-5">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-[11px] bg-[#eef5ef] text-[#5b7d6b]">
                        <Icon
                          name="home"
                          size={19}
                        />
                      </div>

                      <div>

                        <h2 className="text-[15px] font-semibold text-[#2e4037]">
                          Collection details
                        </h2>

                        <p className="mt-1 text-[9px] text-[#8b948f]">
                          Enter the details for your home sample
                          collection.
                        </p>

                      </div>

                    </div>

                    <div className="mt-5 grid gap-4 md:grid-cols-2">

                      <div>

                        <label className="text-[9px] font-semibold text-[#65746c]">
                          Patient name
                        </label>

                        <div className="mt-1.5 flex h-10 items-center gap-2 rounded-lg border border-[#e1e6e2] bg-[#fbfcfa] px-3">

                          <Icon
                            name="user"
                            size={15}
                          />

                          <input
                            defaultValue="Alex Morgan"
                            className="w-full bg-transparent text-[10px] text-[#425249] outline-none"
                          />

                        </div>

                      </div>

                      <div>

                        <label className="text-[9px] font-semibold text-[#65746c]">
                          Select test
                        </label>

                        <select
                          defaultValue="Complete Blood Panel"
                          className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e6e2] bg-[#fbfcfa] px-3 text-[10px] text-[#425249] outline-none"
                        >
                          <option>
                            Complete Blood Panel
                          </option>
                          <option>
                            CBC
                          </option>
                          <option>
                            Blood Sugar
                          </option>
                          <option>
                            Lipid Profile
                          </option>
                          <option>
                            Liver Function
                          </option>
                          <option>
                            Kidney Function
                          </option>
                          <option>
                            Thyroid Profile
                          </option>
                        </select>

                      </div>

                      <div className="md:col-span-2">

                        <label className="text-[9px] font-semibold text-[#65746c]">
                          Collection address
                        </label>

                        <div className="mt-1.5 flex min-h-10 items-center gap-2 rounded-lg border border-[#e1e6e2] bg-[#fbfcfa] px-3">

                          <Icon
                            name="home"
                            size={15}
                          />

                          <input
                            defaultValue="Your saved healthcare address"
                            className="w-full bg-transparent text-[10px] text-[#425249] outline-none"
                          />

                        </div>

                      </div>

                      <div>

                        <label className="text-[9px] font-semibold text-[#65746c]">
                          Preferred date
                        </label>

                        <div className="mt-1.5 flex h-10 items-center gap-2 rounded-lg border border-[#e1e6e2] bg-[#fbfcfa] px-3">

                          <Icon
                            name="calendar"
                            size={15}
                          />

                          <input
                            type="date"
                            className="w-full bg-transparent text-[10px] text-[#425249] outline-none"
                          />

                        </div>

                      </div>

                      <div>

                        <label className="text-[9px] font-semibold text-[#65746c]">
                          Preferred time
                        </label>

                        <select
                          defaultValue="As soon as possible"
                          className="mt-1.5 h-10 w-full rounded-lg border border-[#e1e6e2] bg-[#fbfcfa] px-3 text-[10px] text-[#425249] outline-none"
                        >
                          <option>
                            As soon as possible
                          </option>
                          <option>
                            Morning
                          </option>
                          <option>
                            Afternoon
                          </option>
                          <option>
                            Evening
                          </option>
                        </select>

                      </div>

                    </div>

                    <div className="mt-5 rounded-xl border border-[#dfe9e1] bg-[#f4f9f5] p-3">

                      <div className="flex items-start gap-3">

                        <Icon
                          name="shield"
                          size={17}
                        />

                        <p className="text-[9px] leading-4 text-[#687971]">
                          Sample collection timing and report upload
                          depend on partner-lab availability and
                          processing. The service will show the
                          confirmed status after your order is placed.
                        </p>

                      </div>

                    </div>

                    {!orderPlaced ? (
                      <button
                        type="button"
                        onClick={placeOrder}
                        className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#19765f] text-[10px] font-semibold text-white transition hover:bg-[#145f4d]"
                      >
                        Place service order

                        <Icon
                          name="arrow"
                          size={15}
                        />
                      </button>
                    ) : (
                      <div className="mt-5 rounded-xl border border-[#cfe4d6] bg-[#edf7f0] p-4">

                        <div className="flex items-start gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#39755e]">
                            <Icon
                              name="check"
                              size={18}
                            />
                          </div>

                          <div>

                            <div className="text-[11px] font-semibold text-[#365548]">
                              Service order placed
                            </div>

                            <p className="mt-1 text-[9px] leading-4 text-[#718079]">
                              Your rapid home lab service request has
                              been recorded. The confirmed collection
                              status will appear here when the partner
                              lab accepts the request.
                            </p>

                          </div>

                        </div>

                      </div>
                    )}

                  </div>

                </section>
              )}

              {/* ================================================= */}
              {/* PRIVACY / SAFETY FOOTER */}
              {/* ================================================= */}

              <div className="mt-5 flex flex-col gap-3 rounded-[15px] border border-[#dfe7e1] bg-[#f0f7f2] px-4 py-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#4c7b66]">
                    <Icon
                      name="shield"
                      size={17}
                    />
                  </span>

                  <div>

                    <div className="text-[10px] font-semibold text-[#3e594d]">
                      Your health data stays protected
                    </div>

                    <div className="mt-0.5 text-[8px] text-[#829089]">
                      Lab reports remain connected to your private
                      Healthcare 360 record.
                    </div>

                  </div>

                </div>

                <div className="text-[8px] text-[#84918b]">
                  HOMEHEALTH 360 · Health information is not a diagnosis.
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ===================================================== */}
      {/* ORDER MODAL */}
      {/* ===================================================== */}

      {showOrderPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#173b30]/25 px-4 backdrop-blur-[2px]">

          <div className="w-full max-w-[430px] rounded-[18px] border border-[#dfe5e1] bg-white p-5 shadow-[0_20px_60px_rgba(20,50,40,0.16)]">

            <div className="flex items-start justify-between gap-3">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#eaf4ed] text-[#39755e]">
                    <Icon
                      name="lab"
                      size={18}
                    />
                  </div>

                  <div>
                    <h2 className="text-[14px] font-semibold text-[#30463c]">
                      Book lab service
                    </h2>

                    <p className="mt-0.5 text-[8px] text-[#89938e]">
                      {selectedPackage}
                    </p>
                  </div>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setShowOrderPanel(false)
                }
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#7d8983] hover:bg-[#f5f7f5]"
                aria-label="Close"
              >
                <Icon
                  name="close"
                  size={16}
                />
              </button>

            </div>

            <div className="mt-5 rounded-xl bg-[#f3f8f4] p-4">

              <div className="grid grid-cols-3 gap-3">

                <div>
                  <div className="text-[13px] font-semibold text-[#355447]">
                    10 min
                  </div>

                  <div className="mt-1 text-[8px] text-[#829089]">
                    Sample collection
                  </div>
                </div>

                <div>
                  <div className="text-[13px] font-semibold text-[#355447]">
                    1 hour
                  </div>

                  <div className="mt-1 text-[8px] text-[#829089]">
                    Report upload
                  </div>
                </div>

                <div>
                  <div className="text-[13px] font-semibold text-[#355447]">
                    Home
                  </div>

                  <div className="mt-1 text-[8px] text-[#829089]">
                    Collection
                  </div>
                </div>

              </div>

            </div>

            <div className="mt-4 space-y-2">

              <div className="flex items-center justify-between rounded-lg border border-[#e5e9e5] px-3 py-3">

                <span className="text-[9px] text-[#77837d]">
                  Collection
                </span>

                <span className="text-[9px] font-semibold text-[#3c5449]">
                  Home
                </span>

              </div>

              <div className="flex items-center justify-between rounded-lg border border-[#e5e9e5] px-3 py-3">

                <span className="text-[9px] text-[#77837d]">
                  Report
                </span>

                <span className="text-[9px] font-semibold text-[#3c5449]">
                  Health record
                </span>

              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                setShowOrderPanel(false);
                setActiveTab("rapid");
                setSelectedService(true);
              }}
              className="mt-5 flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#19765f] text-[10px] font-semibold text-white hover:bg-[#145f4d]"
            >
              Continue to service

              <Icon
                name="arrow"
                size={14}
              />
            </button>

          </div>

        </div>
      )}

    </main>
  );
}