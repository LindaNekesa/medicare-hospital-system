"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Role → dashboard route
const ROLE_ROUTES: Record<string, string> = {
  ADMIN:              "/dashboard/admin",
  HOSPITAL_MANAGEMENT:"/dashboard/management",
  MEDICAL_STAFF:      "/dashboard/staff",       // fallback for generic staff
  PATIENT:            "/dashboard/patient",
  CAREGIVER:          "/dashboard/caregiver",
  INSURANCE:          "/dashboard/insurance",
  GOVERNMENT:         "/dashboard/government",
};

// staffType → specific staff dashboard (overrides MEDICAL_STAFF route)
const STAFF_TYPE_ROUTES: Record<string, string> = {
  // Lab
  LAB_TECH:            "/dashboard/labtech",
  LAB_SCIENTIST:       "/dashboard/labtech",
  // Radiology
  RADIOGRAPHER:        "/dashboard/radiographer",
  RADIOLOGIST:         "/dashboard/radiographer",
  // Nursing
  NURSE:               "/dashboard/nurse",
  SENIOR_NURSE:        "/dashboard/nurse",
  MIDWIFE:             "/dashboard/nurse",
  NURSE_ANESTHETIST:   "/dashboard/nurse",
  // Pharmacy
  PHARMACIST:          "/dashboard/pharmacy",
  PHARMACY_TECH:       "/dashboard/pharmacy",
  // Physiotherapy
  PHYSIOTHERAPIST:     "/dashboard/physiotherapy",
  OCCUPATIONAL_THERAPIST: "/dashboard/physiotherapy",
  // Emergency
  PARAMEDIC:           "/dashboard/emergency",
  EMT:                 "/dashboard/emergency",
  // Reception
  RECEPTIONIST:        "/dashboard/reception",
  // Doctors & Clinical → staff dashboard (has triage + lab requests)
  DOCTOR:              "/dashboard/staff",
  SURGEON:             "/dashboard/staff",
  SPECIALIST:          "/dashboard/staff",
  RESIDENT_DOCTOR:     "/dashboard/staff",
  INTERN_DOCTOR:       "/dashboard/staff",
  ANESTHESIOLOGIST:    "/dashboard/staff",
  ICU_SPECIALIST:      "/dashboard/staff",
  PSYCHIATRIST:        "/dashboard/staff",
  CLINICAL_OFFICER:    "/dashboard/staff",
  // Allied health
  DENTAL_OFFICER:      "/dashboard/dental",
  SOCIAL_WORKER:       "/dashboard/socialwork",
  // Others → staff dashboard (generic)
  NUTRITIONIST:        "/dashboard/staff",
  OPTOMETRIST:         "/dashboard/staff",
};

export default function DashboardRouter() {
  const router = useRouter();

  useEffect(() => {
    const route = async () => {
      try {
        const raw = localStorage.getItem("user");
        if (!raw) { router.replace("/login"); return; }
        let user = JSON.parse(raw);

        // If MEDICAL_STAFF but staffType is missing, fetch it from the profile API
        if (user.role === "MEDICAL_STAFF" && !user.staffType) {
          try {
            const token = localStorage.getItem("auth_token");
            const res = await fetch("/api/profile", {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            });
            if (res.ok) {
              const profile = await res.json();
              const fetchedStaffType = profile.medicalStaff?.staffType ?? null;
              if (fetchedStaffType) {
                user = { ...user, staffType: fetchedStaffType };
                localStorage.setItem("user", JSON.stringify(user));
              }
            }
          } catch {
            // If fetch fails, continue with what we have
          }
        }

        // Check staffType first for granular routing
        if (user.role === "MEDICAL_STAFF" && user.staffType) {
          const staffPath = STAFF_TYPE_ROUTES[user.staffType];
          if (staffPath) { router.replace(staffPath); return; }
        }

        // Fall back to role-based routing
        const path = ROLE_ROUTES[user.role] || "/dashboard/patient";
        router.replace(path);
      } catch {
        router.replace("/login");
      }
    };

    route();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-3 text-gray-500">
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Loading your dashboard...
      </div>
    </div>
  );
}
