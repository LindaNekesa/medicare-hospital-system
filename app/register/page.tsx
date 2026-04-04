"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Role options — Medical Staff types shown directly, no "Medical Staff" group ──
const ROLES = [
  // Non-clinical
  { value: "PATIENT",             label: "Patient",                          group: "General" },
  { value: "CAREGIVER",           label: "Caregiver / Family Member",        group: "General" },
  { value: "INSURANCE",           label: "Insurance Representative",         group: "General" },
  { value: "GOVERNMENT",          label: "Government / Regulatory Body",     group: "General" },
  { value: "HOSPITAL_MANAGEMENT", label: "Hospital Management",              group: "General" },
  { value: "ADMIN",               label: "Administrator",                    group: "General" },
  // Clinical — doctors
  { value: "DOCTOR",              label: "Medical Doctor (General)",         group: "Clinical" },
  { value: "SURGEON",             label: "Surgeon",                          group: "Clinical" },
  { value: "SPECIALIST",          label: "Medical Specialist",               group: "Clinical" },
  { value: "RESIDENT_DOCTOR",     label: "Resident Doctor",                  group: "Clinical" },
  { value: "INTERN_DOCTOR",       label: "Intern Doctor",                    group: "Clinical" },
  { value: "ANESTHESIOLOGIST",    label: "Anaesthesiologist",                group: "Clinical" },
  { value: "ICU_SPECIALIST",      label: "ICU / Critical Care Specialist",   group: "Clinical" },
  { value: "PSYCHIATRIST",        label: "Psychiatrist",                     group: "Clinical" },
  // Nursing
  { value: "NURSE",               label: "Registered Nurse (RN)",            group: "Nursing" },
  { value: "SENIOR_NURSE",        label: "Senior / Charge Nurse",            group: "Nursing" },
  { value: "MIDWIFE",             label: "Midwife",                          group: "Nursing" },
  { value: "NURSE_ANESTHETIST",   label: "Nurse Anaesthetist",               group: "Nursing" },
  // Allied Health
  { value: "CLINICAL_OFFICER",    label: "Clinical Officer",                 group: "Allied Health" },
  { value: "PHARMACIST",          label: "Pharmacist",                       group: "Allied Health" },
  { value: "PHARMACY_TECH",       label: "Pharmacy Technician",              group: "Allied Health" },
  { value: "LAB_TECH",            label: "Laboratory Technician",            group: "Allied Health" },
  { value: "LAB_SCIENTIST",       label: "Medical Laboratory Scientist",     group: "Allied Health" },
  { value: "RADIOLOGIST",         label: "Radiologist",                      group: "Allied Health" },
  { value: "RADIOGRAPHER",        label: "Radiographer / Sonographer",       group: "Allied Health" },
  { value: "PHYSIOTHERAPIST",     label: "Physiotherapist",                  group: "Allied Health" },
  { value: "NUTRITIONIST",        label: "Nutritionist / Dietitian",         group: "Allied Health" },
  { value: "DENTAL_OFFICER",      label: "Dental Officer",                   group: "Allied Health" },
  { value: "OPTOMETRIST",         label: "Optometrist",                      group: "Allied Health" },
  // Emergency & Support
  { value: "PARAMEDIC",           label: "Paramedic",                        group: "Emergency" },
  { value: "EMT",                 label: "Emergency Medical Technician",     group: "Emergency" },
  { value: "RECEPTIONIST",        label: "Receptionist / Front Desk",        group: "Support" },
  { value: "SOCIAL_WORKER",       label: "Social Worker",                    group: "Support" },
];

// Groups for <optgroup>
const GROUPS = ["General", "Clinical", "Nursing", "Allied Health", "Emergency", "Support"];

// Roles that route to the staff dashboard
const CLINICAL_ROLES = new Set(ROLES.filter(r => r.group !== "General").map(r => r.value));

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Starts with a capital letter", ok: /^[A-Z]/.test(password) },
    { label: "Contains lowercase letters",   ok: /[a-z]/.test(password) },
    { label: "Contains a special character", ok: /[^A-Za-z0-9]/.test(password) },
    { label: "At least 8 characters",        ok: password.length >= 8 },
  ];
  if (!password) return null;
  return (
    <ul className="mt-2 space-y-1">
      {checks.map(c => (
        <li key={c.label} className={`flex items-center gap-1.5 text-xs ${c.ok ? "text-green-600" : "text-gray-400"}`}>
          <span>{c.ok ? "✓" : "○"}</span>{c.label}
        </li>
      ))}
    </ul>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "", role: "PATIENT",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim())  { setError("Full name is required."); return; }
    if (!form.email.trim()) { setError("Email address is required."); return; }
    if (!form.phone.trim()) { setError("Phone number is required."); return; }
    if (!form.role)         { setError("Please select your role."); return; }
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (!form.email.toLowerCase().endsWith("@medicare.com")) {
      setError("Email must use the @medicare.com domain (e.g. yourname@medicare.com).");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          role: form.role,
          // Map clinical roles to MEDICAL_STAFF for DB, keep staffType for profile
          staffType: CLINICAL_ROLES.has(form.role) ? form.role : undefined,
          dbRole: CLINICAL_ROLES.has(form.role) ? "MEDICAL_STAFF" : form.role,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); return; }
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div className="text-center mb-7">
          <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Medicare Hospital System</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input type="text" required value={form.name} onChange={set("name")} disabled={loading}
              placeholder="Jane Doe" className={inputCls} />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input type="email" required value={form.email} onChange={set("email")} disabled={loading}
              placeholder="yourname@medicare.com"
              className={`${inputCls} ${form.email && !form.email.toLowerCase().endsWith("@medicare.com") ? "border-red-400" : ""}`} />
            {form.email && !form.email.toLowerCase().endsWith("@medicare.com") && (
              <p className="text-xs text-red-500 mt-1">Must end with @medicare.com</p>
            )}
            {form.email && form.email.toLowerCase().endsWith("@medicare.com") && (
              <p className="text-xs text-green-600 mt-1">✓ Valid Medicare email</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input type="tel" required value={form.phone} onChange={set("phone")} disabled={loading}
              placeholder="0700000000" className={inputCls} />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role / Position <span className="text-red-500">*</span>
            </label>
            <select required value={form.role} onChange={set("role")} disabled={loading}
              className={`${inputCls} bg-white`}>
              {GROUPS.map(group => (
                <optgroup key={group} label={`── ${group} ──`}>
                  {ROLES.filter(r => r.group === group).map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {CLINICAL_ROLES.has(form.role) && (
              <p className="text-xs text-blue-600 mt-1">
                ✓ You will be registered as Medical Staff — {ROLES.find(r => r.value === form.role)?.label}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input type={showPw ? "text" : "password"} required value={form.password} onChange={set("password")}
                disabled={loading} placeholder="e.g. Admin@123"
                className={`${inputCls} pr-10`} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
            <PasswordStrength password={form.password} />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input type="password" required value={form.confirm} onChange={set("confirm")} disabled={loading}
              placeholder="Re-enter password"
              className={`${inputCls} ${form.confirm && form.confirm !== form.password ? "border-red-400" : ""}`} />
            {form.confirm && form.confirm !== form.password && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1">
            {loading
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Creating account...</>
              : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
