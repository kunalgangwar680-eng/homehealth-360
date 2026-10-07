"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";

type HealthRecord = {
  id: string;
  reportName?: string | null;
  recordType?: string | null;
  reportDate?: string | null;
  fileName?: string | null;
  fileType?: string | null;
  createdAt?: string | null;
};

type Appointment = {
  id: string;
  appointmentDate?: string | null;
  appointmentTime?: string | null;
  status?: string | null;
  reason?: string | null;
  notes?: string | null;
  doctor?: {
    id?: string;
    name?: string | null;
    specialization?: string | null;
  } | null;
};

type TimelineCategory =
  | "Visits"
  | "Labs"
  | "Medications"
  | "Imaging"
  | "Notes";

type Filter =
  | "All events"
  | "Visits"
  | "Labs"
  | "Medications"
  | "Imaging"
  | "Notes";

type TimelineEvent = {
  id: string;
  date: string;
  category: TimelineCategory;
  title: string;
  source: string;
  description: string;
  icon: "lab" | "medicine" | "visit" | "imaging" | "note";
};

/* =========================================================
   ICONS
========================================================= */

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}: {
  name: string;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
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

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
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

    case "download":
      return (
        <svg {...common}>
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
      );

    case "plus":
      return (
        <svg {...common}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );

    case "lab":
      return (
        <svg {...common}>
          <path d="M9 3h6" />
          <path d="M10 3v6l-5.5 9A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 9V3" />
          <path d="M8 14h8" />
        </svg>
      );

    case "medicine":
      return (
        <svg {...common}>
          <path d="m8.5 8.5 7 7" />
          <path d="M7.2 20.2a5 5 0 0 1 0-7.1l5.9-5.9a5 5 0 1 1 7.1 7.1l-5.9 5.9a5 5 0 0 1-7.1 0Z" />
        </svg>
      );

    case "visit":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3" />
          <path d="M5 20c.8-4.2 3-6 7-6s6.2 1.8 7 6" />
          <path d="M12 5v6" />
          <path d="M9 8h6" />
        </svg>
      );

    case "imaging":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <circle cx="12" cy="12" r="3" />
          <path d="M8 8h.01" />
          <path d="M16 16h.01" />
        </svg>
      );

    case "note":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8" />
          <path d="M8 12h8" />
          <path d="M8 16h5" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "link":
      return (
        <svg {...common}>
          <path d="M10 13a5 5 0 0 0 7.5.3l2-2a5 5 0 0 0-7.1-7.1l-1.2 1.2" />
          <path d="M14 11a5 5 0 0 0-7.5-.3l-2 2a5 5 0 0 0 7.1 7.1l1.2-1.2" />
        </svg>
      );

    case "close":
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="M18 6 6 18" />
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
   HELPERS
========================================================= */

function formatDate(date?: string | null) {
  if (!date) return "Date unavailable";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function shortDate(date?: string | null) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed
    .toLocaleDateString("en-IN", {
      month: "short",
      day: "2-digit",
    })
    .toUpperCase();
}

function monthName(date?: string | null) {
  if (!date) return "";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return parsed
    .toLocaleDateString("en-IN", {
      month: "long",
    })
    .toUpperCase();
}

function sortableDate(date?: string | null) {
  if (!date) return 0;

  const time = new Date(date).getTime();

  return Number.isNaN(time) ? 0 : time;
}

function normalizeCategory(
  recordType?: string | null,
  reportName?: string | null
): TimelineCategory {
  const value =
    `${recordType ?? ""} ${reportName ?? ""}`.toLowerCase();

  if (
    value.includes("medication") ||
    value.includes("medicine") ||
    value.includes("prescription") ||
    value.includes("drug") ||
    value.includes("pharmacy")
  ) {
    return "Medications";
  }

  if (
    value.includes("imaging") ||
    value.includes("mri") ||
    value.includes("ct") ||
    value.includes("x-ray") ||
    value.includes("xray") ||
    value.includes("ultrasound") ||
    value.includes("scan")
  ) {
    return "Imaging";
  }

  if (
    value.includes("note") ||
    value.includes("clinical note")
  ) {
    return "Notes";
  }

  return "Labs";
}

function categoryIcon(
  category: TimelineCategory
): TimelineEvent["icon"] {
  switch (category) {
    case "Labs":
      return "lab";

    case "Medications":
      return "medicine";

    case "Visits":
      return "visit";

    case "Imaging":
      return "imaging";

    case "Notes":
      return "note";
  }
}

function normalizeAppointment(
  appointment: Appointment
): TimelineEvent {
  const date =
    appointment.appointmentDate ||
    new Date().toISOString();

  const doctor =
    appointment.doctor?.name ||
    "Healthcare provider";

  return {
    id: `appointment-${appointment.id}`,
    date,
    category: "Visits",
    title:
      appointment.reason ||
      `${appointment.doctor?.specialization || "Medical"} follow-up`,
    source: doctor,
    description:
      appointment.notes ||
      appointment.status ||
      "Appointment recorded in your health timeline.",
    icon: "visit",
  };
}

function normalizeRecord(
  record: HealthRecord
): TimelineEvent {
  const category = normalizeCategory(
    record.recordType,
    record.reportName
  );

  return {
    id: `record-${record.id}`,
    date:
      record.reportDate ||
      record.createdAt ||
      new Date().toISOString(),
    category,
    title:
      record.reportName ||
      record.fileName ||
      "Health record",
    source:
      record.recordType ||
      "Imported report",
    description:
      record.fileName
        ? `${record.fileName} was added to your health record.`
        : "Health record was added to your timeline.",
    icon: categoryIcon(category),
  };
}

/* =========================================================
   PAGE
========================================================= */

export default function HealthTimelinePage() {
  const [records, setRecords] = useState<HealthRecord[]>(
    []
  );

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [exporting, setExporting] =
    useState(false);

  const [activeFilter, setActiveFilter] =
    useState<Filter>("All events");

  const [showAddEvent, setShowAddEvent] =
    useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    category: "Notes" as TimelineCategory,
    description: "",
  });

  /* =======================================================
     LOAD REAL DATA
  ======================================================= */

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      try {
        setLoading(true);

        const [
          recordsResponse,
          appointmentsResponse,
        ] = await Promise.all([
          fetch("/api/health-records", {
            credentials: "include",
          }),
          fetch("/api/appointments", {
            credentials: "include",
          }),
        ]);

        if (recordsResponse.ok) {
          const data =
            await recordsResponse.json();

          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.records)
              ? data.records
              : [];

          if (mounted) {
            setRecords(list);
          }
        }

        if (appointmentsResponse.ok) {
          const data =
            await appointmentsResponse.json();

          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.appointments)
              ? data.appointments
              : [];

          if (mounted) {
            setAppointments(list);
          }
        }
      } catch (error) {
        console.error(
          "Health timeline loading error:",
          error
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      mounted = false;
    };
  }, []);

  /* =======================================================
     TIMELINE
  ======================================================= */

  const timelineEvents = useMemo(() => {
    const events: TimelineEvent[] = [
      ...appointments.map(normalizeAppointment),
      ...records.map(normalizeRecord),
    ];

    if (
      typeof window !== "undefined"
    ) {
      try {
        const saved =
          localStorage.getItem(
            "healthcare360_manual_timeline_events"
          );

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            events.push(...parsed);
          }
        }
      } catch {
        // Ignore malformed local timeline data.
      }
    }

    return events.sort(
      (a, b) =>
        sortableDate(b.date) -
        sortableDate(a.date)
    );
  }, [appointments, records]);

  const filteredEvents = useMemo(() => {
    if (activeFilter === "All events") {
      return timelineEvents;
    }

    return timelineEvents.filter(
      (event) =>
        event.category === activeFilter
    );
  }, [activeFilter, timelineEvents]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const counts = useMemo(
    () => ({
      visits: timelineEvents.filter(
        (event) =>
          event.category === "Visits"
      ).length,

      labs: timelineEvents.filter(
        (event) =>
          event.category === "Labs"
      ).length,

      medications: timelineEvents.filter(
        (event) =>
          event.category === "Medications"
      ).length,

      imaging: timelineEvents.filter(
        (event) =>
          event.category === "Imaging"
      ).length,

      notes: timelineEvents.filter(
        (event) =>
          event.category === "Notes"
      ).length,
    }),
    [timelineEvents]
  );

  /* =======================================================
     GROUP BY YEAR / MONTH
  ======================================================= */

  const groupedTimeline = useMemo(() => {
    const groups: {
      year: string;
      month: string;
      events: TimelineEvent[];
    }[] = [];

    for (const event of filteredEvents) {
      const date = new Date(event.date);

      if (Number.isNaN(date.getTime())) {
        continue;
      }

      const year =
        date.getFullYear().toString();

      const month =
        date.toLocaleDateString("en-IN", {
          month: "long",
        }).toUpperCase();

      let group = groups.find(
        (item) =>
          item.year === year &&
          item.month === month
      );

      if (!group) {
        group = {
          year,
          month,
          events: [],
        };

        groups.push(group);
      }

      group.events.push(event);
    }

    return groups;
  }, [filteredEvents]);

  /* =======================================================
     COMPLETENESS
  ======================================================= */

  const completeness = useMemo(() => {
    /*
     * Keep the original PDF's visual value.
     *
     * If real connected data exists, the score is based
     * on the sources currently available.
     */
    let score = 0;

    if (records.length > 0) {
      score += 35;
    }

    if (appointments.length > 0) {
      score += 30;
    }

    if (
      timelineEvents.some(
        (event) =>
          event.category === "Labs"
      )
    ) {
      score += 20;
    }

    if (
      timelineEvents.some(
        (event) =>
          event.category === "Medications"
      )
    ) {
      score += 10;
    }

    if (
      timelineEvents.some(
        (event) =>
          event.category === "Visits"
      )
    ) {
      score += 5;
    }

    return Math.min(score, 100);
  }, [
    records.length,
    appointments.length,
    timelineEvents,
  ]);

  /* =======================================================
     ADD EVENT
  ======================================================= */

  function saveManualEvent() {
    if (!newEvent.title.trim()) {
      return;
    }

    const event: TimelineEvent = {
      id: `manual-${Date.now()}`,
      date:
        newEvent.date ||
        new Date().toISOString(),
      category: newEvent.category,
      title: newEvent.title.trim(),
      source: "Added manually",
      description:
        newEvent.description.trim() ||
        "Health event added manually.",
      icon: categoryIcon(
        newEvent.category
      ),
    };

    try {
      const existingRaw =
        localStorage.getItem(
          "healthcare360_manual_timeline_events"
        );

      const existing = existingRaw
        ? JSON.parse(existingRaw)
        : [];

      const updated = Array.isArray(existing)
        ? [...existing, event]
        : [event];

      localStorage.setItem(
        "healthcare360_manual_timeline_events",
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error(
        "Unable to save manual event:",
        error
      );
    }

    setShowAddEvent(false);

    setNewEvent({
      title: "",
      date: "",
      category: "Notes",
      description: "",
    });

    window.location.reload();
  }

  /* =======================================================
     PROFESSIONAL PDF EXPORT
  ======================================================= */

  async function handleExport() {
    try {
      setExporting(true);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const margin = 17;

      let y = 20;

      const navy: [number, number, number] = [
        18,
        48,
        52,
      ];

      const green: [number, number, number] = [
        17,
        125,
        105,
      ];

      const lightGreen: [
        number,
        number,
        number
      ] = [232, 246, 242];

      const muted: [
        number,
        number,
        number
      ] = [105, 121, 121];

      const border: [
        number,
        number,
        number
      ] = [222, 230, 227];

      const text: [
        number,
        number,
        number
      ] = [48, 63, 65];

      function header() {
        pdf.setFillColor(
          navy[0],
          navy[1],
          navy[2]
        );

        pdf.rect(
          0,
          0,
          pageWidth,
          30,
          "F"
        );

        pdf.setTextColor(
          255,
          255,
          255
        );

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(17);

        pdf.text(
          "HOMEHEALTH",
          margin,
          13
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(7);

        pdf.text(
          "360",
          margin,
          19
        );

        pdf.setFontSize(7);

        pdf.text(
          "LONGITUDINAL HEALTH RECORD",
          pageWidth - margin,
          14,
          {
            align: "right",
          }
        );
      }

      function footer(page: number) {
        pdf.setDrawColor(
          border[0],
          border[1],
          border[2]
        );

        pdf.line(
          margin,
          pageHeight - 15,
          pageWidth - margin,
          pageHeight - 15
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(7);

        pdf.setTextColor(
          muted[0],
          muted[1],
          muted[2]
        );

        pdf.text(
          "HOMEHEALTH 360 • Personal health record",
          margin,
          pageHeight - 8
        );

        pdf.text(
          `Page ${page}`,
          pageWidth - margin,
          pageHeight - 8,
          {
            align: "right",
          }
        );
      }

      function newPage() {
        pdf.addPage();

        header();

        y = 40;
      }

      function ensureSpace(
        height: number
      ) {
        if (
          y + height >
          pageHeight - 23
        ) {
          newPage();
        }
      }

      header();

      y = 43;

      pdf.setTextColor(
        navy[0],
        navy[1],
        navy[2]
      );

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(22);

      pdf.text(
        "Health timeline report",
        margin,
        y
      );

      y += 8;

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(9);

      pdf.setTextColor(
        muted[0],
        muted[1],
        muted[2]
      );

      pdf.text(
        "Chronological summary of appointments and connected health records.",
        margin,
        y
      );

      y += 15;

      /* Overview */

      ensureSpace(40);

      pdf.setFillColor(
        247,
        250,
        249
      );

      pdf.roundedRect(
        margin,
        y,
        pageWidth - margin * 2,
        36,
        4,
        4,
        "F"
      );

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(8);

      pdf.setTextColor(
        navy[0],
        navy[1],
        navy[2]
      );

      pdf.text(
        "RECORD OVERVIEW",
        margin + 7,
        y + 8
      );

      const overview = [
        [
          "EVENTS",
          String(
            timelineEvents.length
          ),
        ],
        [
          "VISITS",
          String(counts.visits),
        ],
        [
          "REPORTS",
          String(records.length),
        ],
        [
          "COMPLETENESS",
          `${completeness}%`,
        ],
      ];

      overview.forEach(
        ([label, value], index) => {
          const x =
            margin +
            8 +
            index * 43;

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.setFontSize(15);

          pdf.setTextColor(
            green[0],
            green[1],
            green[2]
          );

          pdf.text(
            value,
            x,
            y + 20
          );

          pdf.setFont(
            "helvetica",
            "normal"
          );

          pdf.setFontSize(6.5);

          pdf.setTextColor(
            muted[0],
            muted[1],
            muted[2]
          );

          pdf.text(
            label,
            x,
            y + 27
          );
        }
      );

      y += 47;

      /* Timeline */

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(13);

      pdf.setTextColor(
        navy[0],
        navy[1],
        navy[2]
      );

      pdf.text(
        "Chronological timeline",
        margin,
        y
      );

      y += 10;

      for (
        const group of groupedTimeline
      ) {
        ensureSpace(22);

        pdf.setFont(
          "helvetica",
          "bold"
        );

        pdf.setFontSize(12);

        pdf.setTextColor(
          navy[0],
          navy[1],
          navy[2]
        );

        pdf.text(
          group.year,
          margin,
          y
        );

        pdf.setFont(
          "helvetica",
          "normal"
        );

        pdf.setFontSize(7);

        pdf.setTextColor(
          muted[0],
          muted[1],
          muted[2]
        );

        pdf.text(
          group.month,
          margin,
          y + 6
        );

        y += 12;

        for (
          const event of group.events
        ) {
          const titleLines =
            pdf.splitTextToSize(
              event.title,
              110
            );

          const descriptionLines =
            pdf.splitTextToSize(
              event.description,
              110
            );

          const cardHeight =
            Math.max(
              36,
              17 +
                titleLines.length * 4 +
                descriptionLines.length * 3.8
            );

          ensureSpace(
            cardHeight + 7
          );

          pdf.setFillColor(
            255,
            255,
            255
          );

          pdf.setDrawColor(
            border[0],
            border[1],
            border[2]
          );

          pdf.roundedRect(
            margin + 8,
            y,
            pageWidth -
              margin * 2 -
              8,
            cardHeight,
            3,
            3,
            "FD"
          );

          pdf.setFillColor(
            green[0],
            green[1],
            green[2]
          );

          pdf.circle(
            margin + 3,
            y + 10,
            2,
            "F"
          );

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.setFontSize(9.5);

          pdf.setTextColor(
            navy[0],
            navy[1],
            navy[2]
          );

          pdf.text(
            titleLines,
            margin + 16,
            y + 9
          );

          pdf.setFont(
            "helvetica",
            "bold"
          );

          pdf.setFontSize(6.5);

          pdf.setTextColor(
            green[0],
            green[1],
            green[2]
          );

          pdf.text(
            event.category.toUpperCase(),
            pageWidth - margin - 9,
            y + 8,
            {
              align: "right",
            }
          );

          pdf.setFont(
            "helvetica",
            "normal"
          );

          pdf.setFontSize(7);

          pdf.setTextColor(
            muted[0],
            muted[1],
            muted[2]
          );

          pdf.text(
            `${formatDate(event.date)} • ${event.source}`,
            margin + 16,
            y +
              12 +
              titleLines.length * 4
          );

          pdf.setFontSize(7.5);

          pdf.setTextColor(
            text[0],
            text[1],
            text[2]
          );

          pdf.text(
            descriptionLines,
            margin + 16,
            y +
              18 +
              titleLines.length * 4
          );

          y += cardHeight + 7;
        }
      }

      /* Record observations */

      ensureSpace(50);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(13);

      pdf.setTextColor(
        navy[0],
        navy[1],
        navy[2]
      );

      pdf.text(
        "Record completeness",
        margin,
        y
      );

      y += 8;

      pdf.setFillColor(
        lightGreen[0],
        lightGreen[1],
        lightGreen[2]
      );

      pdf.roundedRect(
        margin,
        y,
        pageWidth - margin * 2,
        30,
        4,
        4,
        "F"
      );

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(17);

      pdf.setTextColor(
        green[0],
        green[1],
        green[2]
      );

      pdf.text(
        `${completeness}%`,
        margin + 8,
        y + 12
      );

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(7.5);

      pdf.setTextColor(
        text[0],
        text[1],
        text[2]
      );

      pdf.text(
        "Based on currently connected health information.",
        margin + 8,
        y + 21
      );

      pdf.setFillColor(
        210,
        226,
        221
      );

      pdf.roundedRect(
        margin + 70,
        y + 9,
        pageWidth -
          margin * 2 -
          82,
        5,
        2.5,
        2.5,
        "F"
      );

      pdf.setFillColor(
        green[0],
        green[1],
        green[2]
      );

      pdf.roundedRect(
        margin + 70,
        y + 9,
        (pageWidth -
          margin * 2 -
          82) *
          (completeness / 100),
        5,
        2.5,
        2.5,
        "F"
      );

      y += 39;

      ensureSpace(35);

      pdf.setFont(
        "helvetica",
        "bold"
      );

      pdf.setFontSize(13);

      pdf.setTextColor(
        navy[0],
        navy[1],
        navy[2]
      );

      pdf.text(
        "Report note",
        margin,
        y
      );

      y += 8;

      pdf.setFont(
        "helvetica",
        "normal"
      );

      pdf.setFontSize(7.5);

      pdf.setTextColor(
        muted[0],
        muted[1],
        muted[2]
      );

      const note =
        "This document summarizes information available in HOMEHEALTH 360. It is intended to help organize your health history and is not a medical diagnosis.";

      const noteLines =
        pdf.splitTextToSize(
          note,
          pageWidth - margin * 2
        );

      pdf.text(
        noteLines,
        margin,
        y
      );

      const totalPages =
        pdf.getNumberOfPages();

      for (
        let page = 1;
        page <= totalPages;
        page++
      ) {
        pdf.setPage(page);
        footer(page);
      }

      const fileDate =
        new Date()
          .toISOString()
          .slice(0, 10);

      pdf.save(
        `HOMEHEALTH-360-Health-Timeline-${fileDate}.pdf`
      );
    } catch (error) {
      console.error(
        "PDF export error:",
        error
      );

      alert(
        "PDF generate nahi ho paaya. Please try again."
      );
    } finally {
      setExporting(false);
    }
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="min-h-screen bg-[#f4f6f3] text-[#183b36]">
      <div className="flex min-h-screen">
        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="fixed inset-y-0 left-0 z-40 hidden w-[198px] flex-col bg-[#09261f] text-white lg:flex">
          {/* Logo */}

          <div className="flex h-[67px] items-center gap-3 px-4">
            <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] bg-white text-[#0c2e26]">
              <span className="text-[17px]">
                ♡
              </span>
            </div>

            <div className="leading-none">
              <div className="font-serif text-[13px] font-medium tracking-[-0.02em]">
                HOMEHEALTH
              </div>

              <div className="mt-[3px] text-[6px] font-semibold tracking-[0.05em] text-[#b9c8c3]">
                360
              </div>
            </div>
          </div>

          {/* Navigation */}

          <nav className="px-2">
            <Link
              href="/dashboard"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b9c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="dashboard"
                size={14}
              />

              <span>
                Dashboard
              </span>
            </Link>

            <Link
              href="/health-records"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b9c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="upload"
                size={14}
              />

              <span>
                Upload report
              </span>
            </Link>

            <Link
              href="/health-timeline"
              className="relative flex h-[40px] items-center gap-2 rounded-[9px] bg-[#14463b] px-3 text-[12px] font-medium text-white"
            >
              <Icon
                name="clock"
                size={14}
              />

              <span>
                Health timeline
              </span>

              <span className="absolute right-3 h-[5px] w-[5px] rounded-full bg-[#56d6b8]" />
            </Link>

            <Link
              href="/care-gaps"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b9c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="care"
                size={14}
              />

              <span>
                Care gaps
              </span>
            </Link>

            <Link
              href="/reminders"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b9c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="bell"
                size={14}
              />

              <span>
                Reminders
              </span>
            </Link>

            <Link
              href="/ai-care-copilot"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b9c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="spark"
                size={14}
              />

              <span>
                AI Care Copilot
              </span>
            </Link>

            <Link
              href="/family-healthcare"
              className="flex h-[40px] items-center gap-2 rounded-[9px] px-3 text-[12px] text-[#b9c6c1] transition hover:bg-white/5 hover:text-white"
            >
              <Icon
                name="family"
                size={14}
              />

              <span>
                Family healthcare
              </span>
            </Link>
          </nav>

          {/* Privacy */}

          <div className="mt-auto px-2 pb-5">
            <div className="rounded-[11px] border border-[#1d5145] bg-[#0e352d] p-3">
              <div className="flex items-center gap-2">
                <Icon
                  name="lock"
                  size={13}
                />

                <span className="text-[10px] font-medium">
                  Privacy center
                </span>
              </div>

              <p className="mt-2 text-[9px] leading-[1.45] text-[#9fb5ae]">
                Your health data is encrypted
                and shared only with your
                permission.
              </p>
            </div>
          </div>
        </aside>

        {/* =================================================
            MAIN AREA
        ================================================= */}

        <div className="min-w-0 flex-1 lg:ml-[198px]">
          {/* TOP BAR */}

          <header className="h-[62px] border-b border-[#e0e5e1] bg-[#f8f9f7]">
            <div className="flex h-full items-center justify-between gap-4 px-5 sm:px-7">
              {/* Search */}

              <div className="flex h-[36px] w-full max-w-[285px] items-center gap-2 rounded-[9px] border border-[#e0e5e1] bg-white px-3 text-[#7e8c88] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <Icon
                  name="search"
                  size={15}
                />

                <span className="truncate text-[11px]">
                  Search reports, medications,
                  events…
                </span>

                <span className="ml-auto whitespace-nowrap text-[9px] text-[#a3aaa7]">
                  ⌘K
                </span>
              </div>

              {/* User */}

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

          {/* CONTENT */}

          <section className="px-4 pb-12 pt-6 sm:px-6 lg:px-7">
            {/* PAGE TITLE */}

            <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.09em] text-[#378678]">
                  LONGITUDINAL RECORD
                </p>

                <h1 className="mt-1 text-[29px] font-semibold leading-none tracking-[-0.04em] text-[#163d37] sm:text-[31px]">
                  Health timeline
                </h1>

                <p className="mt-2 text-[11px] text-[#81908c] sm:text-[12px]">
                  See appointments, reports,
                  medications, and important changes
                  in one chronological story.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExport}
                  disabled={
                    exporting ||
                    timelineEvents.length ===
                      0
                  }
                  className="flex h-[35px] items-center rounded-[8px] border border-[#dfe5e1] bg-white px-4 text-[11px] font-medium text-[#405b55] shadow-sm transition hover:bg-[#f9faf9] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {exporting
                    ? "Generating..."
                    : "Export summary"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setShowAddEvent(true)
                  }
                  className="flex h-[35px] items-center gap-1.5 rounded-[8px] bg-[#087a66] px-4 text-[11px] font-medium text-white shadow-sm transition hover:bg-[#066d5c]"
                >
                  <Icon
                    name="plus"
                    size={13}
                  />

                  Add health event
                </button>
              </div>
            </div>

            {/* FILTER BAR */}

            <div className="mt-5 flex min-h-[49px] items-center justify-between gap-4 overflow-x-auto rounded-[13px] border border-[#e0e6e2] bg-white px-4 shadow-[0_3px_12px_rgba(38,65,57,0.04)]">
              <div className="flex min-w-max items-center gap-1.5">
                {(
                  [
                    "All events",
                    "Visits",
                    "Labs",
                    "Medications",
                    "Imaging",
                    "Notes",
                  ] as Filter[]
                ).map((filter) => {
                  const active =
                    activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() =>
                        setActiveFilter(filter)
                      }
                      className={`rounded-full px-3 py-[6px] text-[10px] font-medium transition ${
                        active
                          ? "bg-[#087e68] text-white"
                          : "border border-[#e1e7e4] bg-white text-[#596b66] hover:bg-[#f7faf8]"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                className="hidden whitespace-nowrap text-[10px] text-[#788783] sm:block"
              >
                Past 12 months⌄
              </button>
            </div>

            {/* MAIN GRID */}

            <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_315px]">
              {/* TIMELINE CARD */}

              <section className="min-w-0 rounded-[17px] border border-[#e0e6e2] bg-white p-5 shadow-[0_4px_18px_rgba(35,62,54,0.045)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[17px] font-semibold text-[#294740]">
                      {new Date().getFullYear()}
                    </h2>

                    <span className="rounded-full bg-[#edf1ef] px-2 py-[3px] text-[8px] font-medium text-[#71807c]">
                      •{" "}
                      {timelineEvents.length}{" "}
                      events
                    </span>
                  </div>

                  <span className="text-[9px] text-[#84918e]">
                    Newest first ↓
                  </span>
                </div>

                {loading ? (
                  <div className="flex min-h-[310px] items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-[#d9e7e2] border-t-[#087d67]" />

                      <p className="mt-3 text-[10px] text-[#82908c]">
                        Loading timeline...
                      </p>
                    </div>
                  </div>
                ) : filteredEvents.length ===
                  0 ? (
                  <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#edf6f3] text-[#398a79]">
                      <Icon
                        name="clock"
                        size={22}
                      />
                    </div>

                    <h3 className="mt-3 text-[14px] font-semibold text-[#34514b]">
                      No timeline events
                    </h3>

                    <p className="mt-1 max-w-[340px] text-[10px] leading-5 text-[#82908c]">
                      Upload a report or add a health
                      event to start building your
                      longitudinal record.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4">
                    {groupedTimeline.map(
                      (group) => (
                        <div
                          key={`${group.year}-${group.month}`}
                          className="relative"
                        >
                          {/* Month */}

                          <div className="mb-2 mt-3 text-[9px] font-medium text-[#8c9894]">
                            {group.month}
                          </div>

                          <div className="relative">
                            {/* Timeline line */}

                            <div className="absolute bottom-0 left-[13px] top-0 w-px bg-[#d8e4df]" />

                            <div className="space-y-1">
                              {group.events.map(
                                (
                                  event,
                                  index
                                ) => {
                                  const iconBg =
                                    event.category ===
                                    "Medications"
                                      ? "bg-[#f2eafb]"
                                      : event.category ===
                                          "Labs"
                                        ? "bg-[#e5f5ef]"
                                        : "bg-[#edf7f4]";

                                  const iconColor =
                                    event.category ===
                                    "Medications"
                                      ? "text-[#7759aa]"
                                      : event.category ===
                                          "Labs"
                                        ? "text-[#318a76]"
                                        : "text-[#5a9a8c]";

                                  const badge =
                                    event.category ===
                                    "Medications"
                                      ? "bg-[#eee7f9] text-[#745ba4]"
                                      : event.category ===
                                          "Labs"
                                        ? "bg-[#e0f2eb] text-[#277b68]"
                                        : "bg-[#e7f1ef] text-[#4c8177]";

                                  return (
                                    <article
                                      key={
                                        event.id
                                      }
                                      className="relative flex gap-3 pb-3"
                                    >
                                      {/* ICON */}

                                      <div
                                        className={`relative z-10 mt-0.5 flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full border border-[#d7e7e1] bg-white ${iconColor}`}
                                      >
                                        <div
                                          className={`flex h-[23px] w-[23px] items-center justify-center rounded-full ${iconBg}`}
                                        >
                                          <Icon
                                            name={
                                              event.icon
                                            }
                                            size={14}
                                          />
                                        </div>
                                      </div>

                                      {/* CONTENT */}

                                      <div className="min-w-0 flex-1 pr-1">
                                        <div className="flex items-start justify-between gap-3">
                                          <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                              <h3 className="text-[11px] font-semibold text-[#35524c] sm:text-[12px]">
                                                {
                                                  event.title
                                                }
                                              </h3>

                                              <span
                                                className={`rounded-full px-2 py-[2px] text-[7px] font-semibold ${badge}`}
                                              >
                                                •{" "}
                                                {
                                                  event.category ===
                                                  "Medications"
                                                    ? "Medication"
                                                    : event.category ===
                                                        "Visits"
                                                      ? "Visit"
                                                      : event.category ===
                                                          "Labs"
                                                        ? "Lab"
                                                        : event.category
                                                }
                                              </span>
                                            </div>

                                            <p className="mt-1 text-[9px] text-[#74827e]">
                                              {
                                                event.source
                                              }
                                            </p>

                                            <p className="mt-0.5 max-w-[570px] text-[9px] leading-[1.45] text-[#7c8985]">
                                              {
                                                event.description
                                              }
                                            </p>

                                            <div className="mt-1.5 flex items-center gap-3">
                                              <button
                                                type="button"
                                                className="text-[8px] font-medium text-[#2b8171] underline decoration-[#acd1c8] underline-offset-2"
                                              >
                                                View details
                                              </button>

                                              <button
                                                type="button"
                                                className="text-[8px] font-medium text-[#788681] underline decoration-[#c7d0cd] underline-offset-2"
                                              >
                                                Add note
                                              </button>
                                            </div>
                                          </div>

                                          <span className="shrink-0 pt-0.5 text-[8px] font-medium text-[#7d8a86]">
                                            {shortDate(
                                              event.date
                                            )}
                                          </span>
                                        </div>
                                      </div>
                                    </article>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </section>

              {/* RIGHT SIDEBAR */}

              <aside className="space-y-4">
                {/* RECORD COMPLETENESS */}

                <section className="rounded-[17px] border border-[#e0e6e2] bg-white p-5 shadow-[0_4px_18px_rgba(35,62,54,0.045)]">
                  <h2 className="text-[14px] font-semibold text-[#34504a]">
                    Record completeness
                  </h2>

                  <p className="mt-1 text-[9px] text-[#899591]">
                    Based on your connected
                    sources.
                  </p>

                  <div className="mt-4 flex items-center gap-4">
                    {/* Donut */}

                    <div
                      className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full"
                      style={{
                        background: `conic-gradient(#087d67 ${completeness}%, #dce9e4 ${completeness}% 100%)`,
                      }}
                    >
                      <div className="flex h-[57px] w-[57px] items-center justify-center rounded-full bg-white">
                        <span className="text-[14px] font-semibold text-[#314b45]">
                          {completeness}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold text-[#34514a]">
                        Your history is well
                        connected
                      </p>

                      <p className="mt-1 text-[8.5px] leading-[1.45] text-[#82908d]">
                        Add your 2025 imaging
                        report to complete an
                        identified gap.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mt-4 flex h-[34px] w-full items-center justify-center gap-1.5 rounded-[8px] border border-[#e0e6e2] bg-white text-[10px] font-medium text-[#4c625c] transition hover:bg-[#f8faf9]"
                  >
                    <Icon
                      name="link"
                      size={13}
                    />

                    Connect another source
                  </button>
                </section>

                {/* PATTERNS */}

                <section className="rounded-[17px] border border-[#e0e6e2] bg-white p-5 shadow-[0_4px_18px_rgba(35,62,54,0.045)]">
                  <h2 className="text-[14px] font-semibold text-[#34504a]">
                    Patterns noticed
                  </h2>

                  <p className="mt-1 text-[9px] leading-[1.4] text-[#899591]">
                    Observations from your
                    record, not medical
                    conclusions.
                  </p>

                  <div className="mt-4">
                    {/* Pattern 1 */}

                    <div className="flex gap-3">
                      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[#e4f3ee] text-[#398776]">
                        <span className="text-[14px]">
                          ↗
                        </span>
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold text-[#36524c]">
                          Trending steadily
                        </p>

                        <p className="mt-0.5 text-[8.5px] leading-[1.45] text-[#81908c]">
                          Blood pressure has stayed
                          close to your usual range
                          across 3 months.
                        </p>
                      </div>
                    </div>

                    <div className="my-3 border-t border-[#e4e9e7]" />

                    {/* Pattern 2 */}

                    <div className="flex gap-3">
                      <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[9px] bg-[#f0e9fa] text-[#7457a5]">
                        <Icon
                          name="spark"
                          size={14}
                        />
                      </div>

                      <div>
                        <p className="text-[10px] font-semibold text-[#36524c]">
                          New this month
                        </p>

                        <p className="mt-0.5 text-[8.5px] leading-[1.45] text-[#81908c]">
                          One new lab report and
                          one medication refill were
                          added.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </aside>
            </div>
          </section>
        </div>
      </div>

      {/* =================================================
          ADD HEALTH EVENT MODAL
      ================================================= */}

      {showAddEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#08261f]/45 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[500px] rounded-[18px] border border-[#dce5e1] bg-white p-6 shadow-[0_25px_80px_rgba(10,45,37,0.25)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#398676]">
                  HEALTH TIMELINE
                </p>

                <h2 className="mt-1 text-[20px] font-semibold text-[#294940]">
                  Add health event
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setShowAddEvent(false)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f1f5f3] text-[#65736f]"
              >
                <Icon
                  name="close"
                  size={16}
                />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-[10px] font-semibold text-[#52645f]">
                  Event title
                </label>

                <input
                  value={newEvent.title}
                  onChange={(event) =>
                    setNewEvent(
                      (current) => ({
                        ...current,
                        title:
                          event.target.value,
                      })
                    )
                  }
                  placeholder="e.g. Follow-up consultation"
                  className="h-11 w-full rounded-[9px] border border-[#dce5e1] bg-[#fafcfa] px-3 text-[12px] text-[#344c47] outline-none focus:border-[#61a08f]"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold text-[#52645f]">
                    Date
                  </label>

                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(event) =>
                      setNewEvent(
                        (current) => ({
                          ...current,
                          date:
                            event.target.value,
                        })
                      )
                    }
                    className="h-11 w-full rounded-[9px] border border-[#dce5e1] bg-[#fafcfa] px-3 text-[12px] text-[#344c47] outline-none focus:border-[#61a08f]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[10px] font-semibold text-[#52645f]">
                    Category
                  </label>

                  <select
                    value={
                      newEvent.category
                    }
                    onChange={(event) =>
                      setNewEvent(
                        (current) => ({
                          ...current,
                          category:
                            event.target
                              .value as TimelineCategory,
                        })
                      )
                    }
                    className="h-11 w-full rounded-[9px] border border-[#dce5e1] bg-[#fafcfa] px-3 text-[12px] text-[#344c47] outline-none focus:border-[#61a08f]"
                  >
                    <option value="Visits">
                      Visits
                    </option>

                    <option value="Labs">
                      Labs
                    </option>

                    <option value="Medications">
                      Medications
                    </option>

                    <option value="Imaging">
                      Imaging
                    </option>

                    <option value="Notes">
                      Notes
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-semibold text-[#52645f]">
                  Description
                </label>

                <textarea
                  value={
                    newEvent.description
                  }
                  onChange={(event) =>
                    setNewEvent(
                      (current) => ({
                        ...current,
                        description:
                          event.target.value,
                      })
                    )
                  }
                  rows={4}
                  placeholder="Add a short description..."
                  className="w-full resize-none rounded-[9px] border border-[#dce5e1] bg-[#fafcfa] px-3 py-3 text-[12px] leading-5 text-[#344c47] outline-none focus:border-[#61a08f]"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() =>
                  setShowAddEvent(false)
                }
                className="h-10 rounded-[8px] border border-[#dce5e1] px-4 text-[11px] font-medium text-[#61726d]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={saveManualEvent}
                disabled={
                  !newEvent.title.trim()
                }
                className="h-10 rounded-[8px] bg-[#087a66] px-5 text-[11px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add to timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}