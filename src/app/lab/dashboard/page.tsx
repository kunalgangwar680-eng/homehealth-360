import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LabDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/lab/login");
  }

  if (session.role !== "LAB") {
    redirect("/dashboard");
  }

  const lab = await prisma.lab.findUnique({
    where: {
      userId: session.userId,
    },
    include: {
      user: true,
      labBookings: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!lab) {
    redirect("/lab/register");
  }

  const pendingOrders = lab.labBookings.filter(
    (booking) =>
      booking.labStage === "PENDING" ||
      booking.labStage === "ACCEPTED" ||
      booking.labStage === "COLLECTOR_ASSIGNED"
  ).length;

  const completedOrders = lab.labBookings.filter(
    (booking) =>
      booking.labStage === "COMPLETED" ||
      booking.status === "COMPLETED"
  ).length;

  return (
    <main className="min-h-screen bg-[#f4f5f2] text-[#26362e]">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}

        <aside className="hidden w-[238px] shrink-0 bg-[#0d3027] lg:flex lg:flex-col">

          <div className="px-5 pt-5">
            <Link href="/lab/dashboard" className="block">

              <div className="text-[17px] font-bold text-white">
                HOMEHEALTH
              </div>

              <div className="mt-1 text-[9px] font-bold tracking-[0.18em] text-[#b4cbbf]">
                360 LAB NETWORK
              </div>

            </Link>
          </div>

          <nav className="mt-8 space-y-1 px-3">

            <NavItem
              href="/lab/dashboard"
              label="Lab Dashboard"
              active
            />

            <NavItem
              href="/lab/tests"
              label="My Tests"
            />

            <NavItem
              href="/lab/orders"
              label="Incoming Orders"
            />

            <NavItem
              href="/lab/profile"
              label="Lab Profile"
            />

          </nav>

          <div className="mt-auto px-3 pb-4">

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.055] p-3.5">

              <div className="text-[10px] font-semibold text-[#e1ebe5]">
                Lab ID
              </div>

              <div className="mt-1 text-[12px] font-bold tracking-[0.08em] text-white">
                {lab.labId}
              </div>

              <div className="mt-2 text-[9px] leading-4 text-[#a9beb5]">
                Your lab account is connected to HOMEHEALTH 360.
              </div>

            </div>

            <form
              action="/api/lab/auth/logout"
              method="POST"
              className="mt-2"
            >
              <button
                type="submit"
                className="flex min-h-9 w-full items-center rounded-lg px-2 text-left text-[11px] font-medium text-[#b9cbc3] hover:bg-white/[0.06] hover:text-white"
              >
                Sign out
              </button>
            </form>

          </div>
        </aside>

        {/* MAIN */}

        <div className="min-w-0 flex-1">

          <div className="mx-auto max-w-[1260px] px-4 pb-8 sm:px-6 lg:px-7">

            {/* HEADER */}

            <header className="flex min-h-[62px] items-center justify-between border-b border-[#e3e6e2]">

              <div>
                <div className="text-[9px] font-semibold uppercase tracking-[0.13em] text-[#929b96]">
                  LAB ACCOUNT
                </div>

                <div className="mt-1 text-[13px] font-semibold text-[#3a4b42]">
                  {lab.labName}
                </div>
              </div>

              <div className="text-right">

                <div className="text-[9px] text-[#8c9690]">
                  Lab ID
                </div>

                <div className="mt-0.5 text-[11px] font-bold tracking-[0.08em] text-[#35614f]">
                  {lab.labId}
                </div>

              </div>

            </header>

            {/* TITLE */}

            <section className="pt-6">

              <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#929b96]">
                LAB DASHBOARD
              </div>

              <h1 className="mt-1.5 text-[30px] font-semibold tracking-[-0.045em] text-[#24332b]">
                Welcome, {lab.ownerName}
              </h1>

              <p className="mt-2 max-w-[760px] text-[11px] leading-5 text-[#7f8983]">
                Manage your laboratory profile, tests, home sample
                collection and incoming patient orders.
              </p>

            </section>

            {/* SUMMARY */}

            <section className="mt-6 grid gap-3 sm:grid-cols-3">

              <SummaryCard
                title="Verification"
                value={lab.verificationStatus}
                subtitle="Current lab account status"
              />

              <SummaryCard
                title="Pending orders"
                value={String(pendingOrders)}
                subtitle="Orders currently in your queue"
              />

              <SummaryCard
                title="Completed"
                value={String(completedOrders)}
                subtitle="Completed orders in recent history"
              />

            </section>

            {/* VERIFICATION */}

            {lab.verificationStatus === "PENDING" && (
              <section className="mt-5 rounded-[16px] border border-[#eadfb9] bg-[#fffaf0] p-5">

                <div className="text-[12px] font-semibold text-[#705d2c]">
                  Verification pending
                </div>

                <p className="mt-1.5 max-w-[800px] text-[11px] leading-5 text-[#8b7742]">
                  Your lab account has been created successfully.
                  Patient-facing discovery can be enabled after the
                  laboratory verification process is completed.
                </p>

              </section>
            )}

            {/* PROFILE + COLLECTION */}

            <section className="mt-5 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">

              {/* PROFILE */}

              <section className="rounded-[17px] border border-[#e3e7e3] bg-white p-5">

                <div className="flex items-center justify-between">

                  <div>
                    <div className="text-[15px] font-semibold text-[#2e4037]">
                      Lab profile
                    </div>

                    <div className="mt-1 text-[11px] text-[#8b948f]">
                      Your information for area-wise lab discovery.
                    </div>
                  </div>

                  <Link
                    href="/lab/profile"
                    className="text-[10px] font-semibold text-[#50715f] hover:text-[#315d4b]"
                  >
                    Manage profile
                  </Link>

                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">

                  <InfoRow
                    label="Lab Name"
                    value={lab.labName}
                  />

                  <InfoRow
                    label="Owner / Manager"
                    value={lab.ownerName}
                  />

                  <InfoRow
                    label="Phone"
                    value={lab.phone}
                  />

                  <InfoRow
                    label="Area"
                    value={lab.area}
                  />

                  <InfoRow
                    label="City"
                    value={lab.city}
                  />

                  <InfoRow
                    label="Pincode"
                    value={lab.pincode}
                  />

                </div>

                <div className="mt-3 rounded-xl bg-[#fafbf9] p-3.5">

                  <div className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#929b96]">
                    Address
                  </div>

                  <div className="mt-1 text-[11px] leading-5 text-[#56675e]">
                    {lab.address}
                  </div>

                </div>

              </section>

              {/* HOME COLLECTION */}

              <section className="rounded-[17px] border border-[#e3e7e3] bg-white p-5">

                <div className="text-[15px] font-semibold text-[#2e4037]">
                  Home collection
                </div>

                <div className="mt-1 text-[11px] text-[#8b948f]">
                  Your sample collection service.
                </div>

                <div className="mt-5 rounded-[14px] bg-[#f0f7f2] p-4">

                  <div className="text-[12px] font-semibold text-[#416955]">
                    {lab.homeCollection
                      ? "Enabled"
                      : "Disabled"}
                  </div>

                  <p className="mt-1.5 text-[10px] leading-4 text-[#72847a]">
                    Patients can be matched with labs providing
                    home sample collection.
                  </p>

                </div>

                <div className="mt-4 grid gap-3">

                  <SlaCard
                    title="Sample collection target"
                    value="10 minutes"
                    description="Target from accepted order to sample collection."
                  />

                  <SlaCard
                    title="Report upload target"
                    value="1 hour"
                    description="Target from sample collection to report upload."
                  />

                </div>

              </section>

            </section>

            {/* ORDERS */}

            <section className="mt-5 rounded-[17px] border border-[#e3e7e3] bg-white p-5">

              <div className="flex items-center justify-between">

                <div>
                  <div className="text-[15px] font-semibold text-[#2e4037]">
                    Recent lab orders
                  </div>

                  <div className="mt-1 text-[11px] text-[#8b948f]">
                    Latest incoming requests for your laboratory.
                  </div>
                </div>

                <Link
                  href="/lab/orders"
                  className="text-[10px] font-semibold text-[#50715f] hover:text-[#315d4b]"
                >
                  View all
                </Link>

              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-[#edf0ec]">

                {lab.labBookings.length === 0 ? (

                  <div className="px-4 py-10 text-center">

                    <div className="text-[12px] font-semibold text-[#64736b]">
                      No lab orders yet
                    </div>

                    <p className="mt-1.5 text-[10px] text-[#929b96]">
                      Incoming patient lab requests will appear here.
                    </p>

                  </div>

                ) : (

                  lab.labBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex flex-col gap-3 border-b border-[#edf0ec] px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >

                      <div className="min-w-0">

                        <div className="text-[11px] font-semibold text-[#44554c]">
                          {booking.patientName}
                        </div>

                        <div className="mt-1 text-[9px] text-[#89938d]">
                          {booking.testNames}
                        </div>

                        <div className="mt-1 text-[9px] text-[#89938d]">
                          {booking.address}
                        </div>

                      </div>

                      <div className="shrink-0 sm:text-right">

                        <div className="inline-flex rounded-full bg-[#eef5ef] px-3 py-1.5 text-[8px] font-semibold text-[#5f7f6e]">
                          {booking.labStage}
                        </div>

                        <div className="mt-1 text-[8px] text-[#9aa39e]">
                          {booking.date} · {booking.time}
                        </div>

                      </div>

                    </div>
                  ))

                )}

              </div>

            </section>

            {/* FOOTER */}

            <div className="mt-5 flex items-center justify-between border-t border-[#e4e7e2] pt-3 text-[8px] text-[#9aa29d]">

              <span>
                HOMEHEALTH 360 · Lab Network
              </span>

              <span className="hidden sm:block">
                Laboratory information is subject to verification.
              </span>

            </div>

          </div>
        </div>
      </div>
    </main>
  );
}

function NavItem({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={[
        "flex min-h-[42px] items-center rounded-[10px] px-3 text-[12px] font-medium transition",
        active
          ? "bg-white/10 text-white"
          : "text-[#c9d8d1] hover:bg-white/5 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[16px] border border-[#e3e7e3] bg-white px-5 py-5">

      <div className="text-[10px] font-semibold uppercase tracking-[0.11em] text-[#89958e]">
        {title}
      </div>

      <div className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#315b4b]">
        {value}
      </div>

      <div className="mt-2 text-[10px] leading-4 text-[#88928d]">
        {subtitle}
      </div>

    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#fafbf9] px-3.5 py-3">

      <div className="text-[9px] uppercase tracking-[0.08em] text-[#929b96]">
        {label}
      </div>

      <div className="mt-1 text-[11px] font-medium text-[#4b5d53]">
        {value}
      </div>

    </div>
  );
}

function SlaCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[14px] border border-[#e7ebe7] p-4">

      <div className="text-[10px] font-semibold text-[#66756d]">
        {title}
      </div>

      <div className="mt-1 text-[20px] font-semibold text-[#315f4d]">
        {value}
      </div>

      <div className="mt-1 text-[9px] leading-4 text-[#8a948f]">
        {description}
      </div>

    </div>
  );
}