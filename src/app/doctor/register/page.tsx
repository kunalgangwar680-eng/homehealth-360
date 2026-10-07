"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function DoctorRegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    medicalRegistrationNumber: "",
    specialization: "",
    qualification: "",
    experience: "",
    dob: "",
    clinicHospital: "",
    clinicAddress: "",
    password: "",
    confirmPassword: "",
  });

  const [identityDocument, setIdentityDocument] =
    useState<File | null>(null);

  const [medicalCertificate, setMedicalCertificate] =
    useState<File | null>(null);

  const [otherDocuments, setOtherDocuments] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (!identityDocument) {
      setError("Please upload an identity document.");
      return;
    }

    if (!medicalCertificate) {
      setError(
        "Please upload your medical registration certificate."
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("fullName", form.fullName);
      formData.append("email", form.email);
      formData.append("mobile", form.mobile);
      formData.append(
        "medicalRegistrationNumber",
        form.medicalRegistrationNumber
      );
      formData.append(
        "specialization",
        form.specialization
      );
      formData.append(
        "qualification",
        form.qualification
      );
      formData.append("experience", form.experience);
      formData.append("dob", form.dob);
      formData.append(
        "clinicHospital",
        form.clinicHospital
      );
      formData.append(
        "clinicAddress",
        form.clinicAddress
      );
      formData.append("password", form.password);

      formData.append(
        "identityDocument",
        identityDocument
      );

      formData.append(
        "medicalCertificate",
        medicalCertificate
      );

      if (otherDocuments) {
        formData.append(
          "otherDocuments",
          otherDocuments
        );
      }

      const response = await fetch(
        "/api/doctors/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.error ||
            "Doctor registration failed."
        );
        return;
      }

      setMessage(
        "Registration submitted successfully. Your application is now pending admin verification."
      );

      setForm({
        fullName: "",
        email: "",
        mobile: "",
        medicalRegistrationNumber: "",
        specialization: "",
        qualification: "",
        experience: "",
        dob: "",
        clinicHospital: "",
        clinicAddress: "",
        password: "",
        confirmPassword: "",
      });

      setIdentityDocument(null);
      setMedicalCertificate(null);
      setOtherDocuments(null);

      const identityInput =
        document.getElementById(
          "identityDocument"
        ) as HTMLInputElement | null;

      const certificateInput =
        document.getElementById(
          "medicalCertificate"
        ) as HTMLInputElement | null;

      const otherInput =
        document.getElementById(
          "otherDocuments"
        ) as HTMLInputElement | null;

      if (identityInput) {
        identityInput.value = "";
      }

      if (certificateInput) {
        certificateInput.value = "";
      }

      if (otherInput) {
        otherInput.value = "";
      }
    } catch (error) {
      console.error(
        "DOCTOR REGISTRATION ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="mb-3 text-sm font-medium text-cyan-400">
            HOMEHEALTH 360
          </div>

          <h1 className="text-3xl font-bold md:text-4xl">
            Doctor Registration
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-400">
            Create your professional profile and submit
            your documents for verification.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl md:p-8">
          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            <section>
              <h2 className="mb-4 text-xl font-semibold">
                Personal Information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Full Name *
                  </label>

                  <input
                    value={form.fullName}
                    onChange={(e) =>
                      updateField(
                        "fullName",
                        e.target.value
                      )
                    }
                    required
                    placeholder="Dr. Full Name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Email *
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateField(
                        "email",
                        e.target.value
                      )
                    }
                    required
                    placeholder="doctor@example.com"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Mobile *
                  </label>

                  <input
                    type="tel"
                    value={form.mobile}
                    onChange={(e) =>
                      updateField(
                        "mobile",
                        e.target.value
                      )
                    }
                    required
                    placeholder="10 digit mobile number"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Date of Birth *
                  </label>

                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) =>
                      updateField(
                        "dob",
                        e.target.value
                      )
                    }
                    required
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">
                Professional Information
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Medical Registration Number *
                  </label>

                  <input
                    value={
                      form.medicalRegistrationNumber
                    }
                    onChange={(e) =>
                      updateField(
                        "medicalRegistrationNumber",
                        e.target.value
                      )
                    }
                    required
                    placeholder="Registration number"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Specialization *
                  </label>

                  <input
                    value={form.specialization}
                    onChange={(e) =>
                      updateField(
                        "specialization",
                        e.target.value
                      )
                    }
                    required
                    placeholder="e.g. Cardiologist"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Qualification *
                  </label>

                  <input
                    value={form.qualification}
                    onChange={(e) =>
                      updateField(
                        "qualification",
                        e.target.value
                      )
                    }
                    required
                    placeholder="MBBS, MD, etc."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Experience *
                  </label>

                  <input
                    value={form.experience}
                    onChange={(e) =>
                      updateField(
                        "experience",
                        e.target.value
                      )
                    }
                    required
                    placeholder="e.g. 8 years"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">
                Clinic / Hospital
              </h2>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Clinic / Hospital Name *
                  </label>

                  <input
                    value={form.clinicHospital}
                    onChange={(e) =>
                      updateField(
                        "clinicHospital",
                        e.target.value
                      )
                    }
                    required
                    placeholder="Clinic or hospital name"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Clinic / Hospital Address
                  </label>

                  <textarea
                    value={form.clinicAddress}
                    onChange={(e) =>
                      updateField(
                        "clinicAddress",
                        e.target.value
                      )
                    }
                    rows={3}
                    placeholder="Complete address"
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-xl font-semibold">
                Verification Documents
              </h2>

              <p className="mb-5 text-sm text-slate-400">
                Upload clear documents for admin verification.
              </p>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                  <label
                    htmlFor="identityDocument"
                    className="mb-3 block text-sm font-medium"
                  >
                    Identity Document *
                  </label>

                  <input
                    id="identityDocument"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    onChange={(e) =>
                      setIdentityDocument(
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full text-sm text-slate-400"
                  />
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                  <label
                    htmlFor="medicalCertificate"
                    className="mb-3 block text-sm font-medium"
                  >
                    Medical Registration Certificate *
                  </label>

                  <input
                    id="medicalCertificate"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    onChange={(e) =>
                      setMedicalCertificate(
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full text-sm text-slate-400"
                  />
                </div>

                <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4">
                  <label
                    htmlFor="otherDocuments"
                    className="mb-3 block text-sm font-medium"
                  >
                    Other Documents
                  </label>

                  <input
                    id="otherDocuments"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      setOtherDocuments(
                        e.target.files?.[0] || null
                      )
                    }
                    className="w-full text-sm text-slate-400"
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">
                Account Security
              </h2>

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Password *
                  </label>

                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      updateField(
                        "password",
                        e.target.value
                      )
                    }
                    required
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Confirm Password *
                  </label>

                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) =>
                      updateField(
                        "confirmPassword",
                        e.target.value
                      )
                    }
                    required
                    minLength={8}
                    placeholder="Confirm password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </section>

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {message}
              </div>
            )}

            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-slate-300">
              Your application will remain{" "}
              <strong className="text-cyan-400">
                PENDING
              </strong>{" "}
              until an administrator verifies your
              professional details and documents.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-cyan-500 px-5 py-3.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Submitting Application..."
                : "Submit Doctor Registration"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-400">
            Already registered?{" "}
            <Link
              href="/doctor/login"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Doctor Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}