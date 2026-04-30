"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  medicalStaff?: {
    staffType: string;
    specialty: string | null;
    department: string | null;
    licenseNo: string | null;
  } | null;
  patient?: {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string | null;
    bloodType: string | null;
    address: string | null;
    phone: string | null;
    insurance: string | null;
    emergencyContact: string | null;
  } | null;
}

const inputCls =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {children}
  </div>
);

function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}) {
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500",
  };

  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className={`fixed top-5 right-5 z-[100] px-4 py-3 rounded-xl text-white ${colors[type]}`}>
      {msg}
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  HOSPITAL_MANAGEMENT: "Hospital Management",
  MEDICAL_STAFF: "Medical Staff",
  PATIENT: "Patient",
};

export default function UserProfile() {
  const router = useRouter();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"view" | "edit" | "password" | "delete">("view");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warning" } | null>(null);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({ name: "", phone: "" });
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  // ================= FETCH PROFILE =================
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setProfile(data);
        setEditForm({
          name: data.name || "",
          phone: data.phone || "",
        });
      } else {
        setToast({ msg: "Failed to load profile", type: "error" });
      }
    } catch {
      setToast({ msg: "Failed to load profile", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= SAVE PROFILE =================
  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ msg: "Profile updated", type: "success" });
        setActiveSection("view");
        fetchProfile();
      } else {
        setToast({ msg: data.error || "Update failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ msg: "Something went wrong", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // ================= CHANGE PASSWORD =================
  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: pwForm.current,
          newPassword: pwForm.newPw,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({ msg: "Password changed", type: "success" });
        setPwForm({ current: "", newPw: "", confirm: "" });
        setActiveSection("view");
      } else {
        setToast({ msg: data.error || "Failed", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setToast({ msg: "Error occurred", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // ================= DELETE =================
  const deleteAccount = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", { method: "DELETE" });
      localStorage.clear();
      router.push("/login");
    } catch {
      setToast({ msg: "Delete failed", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!profile) return <p>Error loading profile</p>;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <h2 className="text-xl font-bold">{profile.name}</h2>

      {/* VIEW */}
      {activeSection === "view" && (
        <div>
          <p>{profile.email}</p>
          <button onClick={() => setActiveSection("edit")}>Edit</button>
        </div>
      )}

      {/* EDIT */}
      {activeSection === "edit" && (
        <form onSubmit={saveProfile}>
          <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
          <input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
          <button type="submit">{saving ? "Saving..." : "Save"}</button>
        </form>
      )}

      {/* PASSWORD */}
      {activeSection === "password" && (
        <form onSubmit={changePassword}>
          <input type="password" placeholder="Current" onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })} />
          <input type="password" placeholder="New" onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })} />
          <button type="submit">{saving ? "Updating..." : "Update Password"}</button>
        </form>
      )}

      {/* DELETE */}
      {activeSection === "delete" && (
        <button onClick={deleteAccount} className="bg-red-600 text-white p-2">
          Delete Account
        </button>
      )}
    </div>
  );
}