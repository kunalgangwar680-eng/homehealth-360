"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type LabForm = {
  labName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  area: string;
  city: string;
  pincode: string;
  password: string;
  confirmPassword: string;
};

export default function LabRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<LabForm>({
    labName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    area: "",
    city: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [createdLabId, setCreatedLabId] = useState("");

  function updateField(
    field: keyof LabForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setCreatedLabId("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/lab/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            phone: form.phone.replace(/\D/g, ""),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(
          data?.error ||
            "Unable to create the lab account."
        );
      }

      const labId = data?.lab?.labId;

      if (!labId) {
        throw new Error(
          "Lab account was created but Lab ID was not returned."
        );
      }

      setCreatedLabId(labId);

      setTimeout(() => {
        router.push(
          `/lab/login?labId=${encodeURIComponent(
            labId
          )}`
        );
      }, 2500);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create the lab account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f4f5f2] px-4 py-8 text-[#26362e]">
      <div className="mx-auto w-full max-w-[760px]">

        {/* Top navigation */}

        <div className="mb-6">
          <Link
            href="/lab/login"
            className="text-[11px] font-semibold text-[#4c715f] hover:text-[#2f5948]"
          >
            ← Back to Lab Login
          </Link>
        </div>

        {/* Main card */}

        <section className="rounded-[20px] border border-[#e1e6e1] bg-white shadow-[0_12px_35px_rgba(30,55,45,0.06)]">

          {/* Header */}

          <div className="border-b border-[#edf0ec] px-6 py-6 sm:px-8">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[13px] bg-[#eef5ef] text-[#2d7159]">

                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 3v6.5L5 17a3 3 0 0 0 2.6 4.5h8.8A3 3 0 0 0 19 17l-4-7.5V3" />
                  <path d="M7 15h10" />
                  <path d="M8 3h8" />
                  <path d="M9 18h.01" />
                  <path d="M12 18h.01" />
                  <path d="M15 18h.01" />
                </svg>

              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8c9791]">
                  HOMEHEALTH 360
                </div>

                <h1 className="mt-1.5 text-[28px] font-semibold tracking-[-0.04em] text-[#26372e]">
                  Join as a Lab
                </h1>

                <p className="mt-1.5 max-w-[580px] text-[11px] leading-5 text-[#7d8982]">
                  Create your laboratory account and become part of
                  the HOMEHEALTH 360 lab network.
                </p>
              </div>

            </div>

          </div>

          {/* Success */}

          {createdLabId ? (
            <div className="px-6 py-8 sm:px-8">

              <div className="rounded-[16px] border border-[#cfe1d5] bg-[#f0f7f2] p-7 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#dceee1] text-[#2e765a]">

                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>

                </div>

                <div className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#648170]">
                  Registration successful
                </div>

                <div className="mt-2 text-[13px] text-[#65756c]">
                  Your unique Lab ID is
                </div>

                <div className="mt-2 text-[30px] font-bold tracking-[0.1em] text-[#195e49]">
                  {createdLabId}
                </div>

                <p className="mx-auto mt-3 max-w-[440px] text-[11px] leading-5 text-[#718078]">
                  Save this Lab ID. You will use it together with
                  your password to access your Lab Dashboard.
                </p>

                <div className="mt-5 inline-flex rounded-[10px] bg-white px-4 py-2 text-[10px] font-semibold text-[#5d7568] shadow-sm">
                  Redirecting to Lab Login...
                </div>

              </div>

            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="px-6 py-7 sm:px-8"
            >

              {/* Error */}

              {error && (
                <div className="mb-5 rounded-[12px] border border-[#efd3d0] bg-[#fff5f4] px-4 py-3 text-[11px] font-medium text-[#a34e46]">
                  {error}
                </div>
              )}

              {/* Lab details */}

              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78867f]">
                Lab information
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <Field
                  label="Lab Name"
                  value={form.labName}
                  placeholder="ABC Diagnostics"
                  onChange={(value) =>
                    updateField("labName", value)
                  }
                  required
                />

                <Field
                  label="Owner / Manager Name"
                  value={form.ownerName}
                  placeholder="Full name"
                  onChange={(value) =>
                    updateField("ownerName", value)
                  }
                  required
                />

              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <Field
                  label="Email Address"
                  type="email"
                  value={form.email}
                  placeholder="lab@example.com"
                  onChange={(value) =>
                    updateField("email", value)
                  }
                  required
                />

                <Field
                  label="Mobile Number"
                  value={form.phone}
                  placeholder="10 digit mobile number"
                  inputMode="numeric"
                  onChange={(value) =>
                    updateField(
                      "phone",
                      value.replace(/\D/g, "").slice(0, 10)
                    )
                  }
                  required
                />

              </div>

              {/* Location */}

              <div className="mt-7 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78867f]">
                Lab location
              </div>

              <div className="mt-4">

                <Field
                  label="Full Address"
                  value={form.address}
                  placeholder="Complete laboratory address"
                  onChange={(value) =>
                    updateField("address", value)
                  }
                  required
                />

              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">

                <Field
                  label="Area"
                  value={form.area}
                  placeholder="Area / locality"
                  onChange={(value) =>
                    updateField("area", value)
                  }
                  required
                />

                <Field
                  label="City"
                  value={form.city}
                  placeholder="Agra"
                  onChange={(value) =>
                    updateField("city", value)
                  }
                  required
                />

                <Field
                  label="Pincode"
                  value={form.pincode}
                  placeholder="282001"
                  inputMode="numeric"
                  onChange={(value) =>
                    updateField(
                      "pincode",
                      value.replace(/\D/g, "").slice(0, 6)
                    )
                  }
                  required
                />

              </div>

              {/* Home collection */}

              <div className="mt-7 rounded-[14px] border border-[#e2e9e3] bg-[#f8fbf8] p-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#e8f2eb] text-[#4c755f]">

                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 11.5 12 4l9 7.5" />
                      <path d="M5 10.5V20h14v-9.5" />
                      <path d="M9 20v-6h6v6" />
                    </svg>

                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-[#52665a]">
                      Home sample collection
                    </div>

                    <p className="mt-1 text-[10px] leading-4 text-[#7e8b84]">
                      Your lab will be registered with home sample
                      collection enabled. The service can be managed
                      from your Lab Dashboard.
                    </p>
                  </div>

                </div>

              </div>

              {/* Login credentials */}

              <div className="mt-7 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78867f]">
                Create your Lab Login
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">

                <Field
                  label="Password"
                  type="password"
                  value={form.password}
                  placeholder="Minimum 8 characters"
                  onChange={(value) =>
                    updateField("password", value)
                  }
                  required
                />

                <Field
                  label="Confirm Password"
                  type="password"
                  value={form.confirmPassword}
                  placeholder="Enter password again"
                  onChange={(value) =>
                    updateField(
                      "confirmPassword",
                      value
                    )
                  }
                  required
                />

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="mt-7 flex min-h-[48px] w-full items-center justify-center rounded-[12px] bg-[#147862] px-5 text-[12px] font-semibold text-white shadow-[0_4px_12px_rgba(36,96,76,0.12)] transition hover:bg-[#116951] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating Lab Account..."
                  : "Create Lab Account"}
              </button>

              <div className="mt-4 text-center text-[9px] leading-4 text-[#8d9791]">
                By creating an account, you agree that your lab
                information may be reviewed before becoming
                patient-facing.
              </div>

            </form>
          )}

          {/* Footer */}

          <div className="border-t border-[#edf0ec] px-6 py-5 text-center sm:px-8">

            <span className="text-[10px] text-[#89938d]">
              Already have a lab account?
            </span>

            <Link
              href="/lab/login"
              className="ml-1.5 text-[10px] font-semibold text-[#4a715d] hover:text-[#2f5948]"
            >
              Lab Login
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  inputMode?:
    | "text"
    | "numeric"
    | "decimal"
    | "tel"
    | "email"
    | "url"
    | "search"
    | "none";
}) {
  return (
    <label className="block">

      <span className="mb-1.5 block text-[10px] font-semibold text-[#65736b]">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        className="h-[44px] w-full rounded-[10px] border border-[#dfe5e0] bg-white px-3 text-[12px] text-[#33443b] outline-none transition placeholder:text-[#a0aaa4] focus:border-[#76a18c] focus:ring-2 focus:ring-[#dcebe2]"
      />

    </label>
  );
}