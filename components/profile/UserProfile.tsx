"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  createdAt: string;
  medicalStaff?: { staffType: string; specialty: string | null; department: string | null; licenseNo: string | null } | null;
  patient?: { firstName: string; lastName: string; gender: string; dateOfBirth: string | null; bloodType: string | null; address: string | null; phone: string | null; insurance: string | null; emergencyContact: string | null } | null;
}

const inputCls = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>{children}</div>
);

function Toast({ msg, type, onClose }: { msg: string; type: "success"|"error"|"warning"; onClose: () => void }) {
  const colors = { success:"bg-green-600", error:"bg-red-600", warning:"bg-yellow-500" };
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${colors[type]}`}>
      <span>{type === "success" ? "✓" : type === "error" ? "✕" : "⚠"}</span>
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN:"Administrator", HOSPITAL_MANAGEMENT:"Hospital Management", MEDICAL_STAFF:"Medical Staff",
  PATIENT:"Patient", CAREGIVER:"Caregiver", INSURANCE:"Insurance Representative",
  GOVERNMENT:"Government / Regulatory Body", LAB_TECH:"Lab Technician",
};

export default function UserProfile() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"view"|"edit"|"password"|"delete">("view");
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error"|"warning" } | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarLetter, setAvatarLetter] = useState("U");

  // Edit form state
  const [editForm, setEditForm] = useState({ name:"", phone:"", specialty:"", department:"", licenseNo:"", staffType:"",
    firstName:"", lastName:"", gender:"", dateOfBirth:"", bloodType:"", address:"", insurance:"", emergencyContact:"" });

  // Password form state
  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const [showPw, setShowPw] = useState({ current:false, new:false, confirm:false });

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        setAvatarLetter(data.user.name?.charAt(0)?.toUpperCase() || "U");
        setEditForm({
          name: data.user.name || "",
          phone: data.user.phone || "",
          specialty: data.user.medicalStaff?.specialty || "",
          department: data.user.medicalStaff?.department || "",
          licenseNo: data.user.medicalStaff?.licenseNo || "",
          staffType: data.user.medicalStaff?.staffType || "",
          firstName: data.user.patient?.firstName || "",
          lastName: data.user.patient?.lastName || "",
          gender: data.user.patient?.gender || "",
          dateOfBirth: data.user.patient?.dateOfBirth ? data.user.patient.dateOfBirth.slice(0,10) : "",
          bloodType: data.user.patient?.bloodType || "",
          address: data.user.patient?.address || "",
          insurance: data.user.patient?.insurance || "",
          emergencyContact: data.user.patient?.emergencyContact || "",
        });
      }
    } catch { setToast({ msg: "Failed to load profile", type: "error" }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfile(); }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        // Update localStorage user
        const stored = localStorage.getItem("user");
        if (stored) {
          const u = JSON.parse(stored);
          localStorage.setItem("user", JSON.stringify({ ...u, name: editForm.name, phone: editForm.phone }));
        }
        setToast({ msg: "Profile updated successfully", type: "success" });
        setActiveSection("view");
        fetchProfile();
      } else {
        setToast({ msg: data.error || "Failed to update", type: "error" });
      }
    } catch { setToast({ msg: "Something went wrong", type: "error" }); }
    finally { setSaving(false); }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPw !== pwForm.confirm) { setToast({ msg: "New passwords do not match", type: "error" }); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ msg: "Password changed successfully", type: "success" });
        setPwForm({ current:"", newPw:"", confirm:"" });
        setActiveSection("view");
      } else {
        setToast({ msg: data.error || "Failed to change password", type: "error" });
      }
    } catch { setToast({ msg: "Something went wrong", type: "error" }); }
    finally { setSaving(false); }
  };

  const deleteAccount = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        setToast({ msg: data.error || "Cannot delete account", type: "error" });
        setActiveSection("view");
      }
    } catch { setToast({ msg: "Something went wrong", type: "error" }); }
    finally { setSaving(false); }
  };

  const PwInput = ({ label, field }: { label: string; field: "current"|"new"|"confirm" }) => (
    <Field label={label}>
      <div className="relative">
        <input type={showPw[field] ? "text" : "password"} value={field === "current" ? pwForm.current : field === "new" ? pwForm.newPw : pwForm.confirm}
          onChange={e => setPwForm(f => ({ ...f, [field === "current" ? "current" : field === "new" ? "newPw" : "confirm"]: e.target.value }))}
          className={`${inputCls} pr-10`} placeholder="••••••••" required />
        <button type="button" onClick={() => setShowPw(s => ({ ...s, [field]: !s[field] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
          {showPw[field] ? "Hide" : "Show"}
        </button>
      </div>
    </Field>
  );

  if (loading) return <div className="flex items-center justify-center py-20 text-gray-400">Loading profile...</div>;
  if (!profile) return <div className="text-center py-20 text-red-500">Failed to load profile</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Avatar + name card */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 flex items-center gap-5">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shrink-0">
          {avatarLetter}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {ROLE_LABELS[profile.role] || profile.role}
          </span>
        </div>
        <div className="text-xs text-gray-400 text-right shrink-0">
          <p>Member since</p>
          <p className="font-medium text-gray-600">{new Date(profile.createdAt).toLocaleDateString("en-US",{month:"short",year:"numeric"})}</p>
        </div>
      </div>

      {/* Action tabs */}
      <div className="flex gap-2 flex-wrap">
        {[["view","👤 View"],["edit","✏️ Edit"],["password","🔒 Password"],["delete","🗑️ Delete Account"]].map(([id,label])=>(
          <button key={id} onClick={() => setActiveSection(id as typeof activeSection)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection===id ? (id==="delete"?"bg-red-600 text-white":"bg-blue-600 text-white") : (id==="delete"?"text-red-600 border border-red-200 hover:bg-red-50":"text-gray-600 border border-gray-200 hover:bg-gray-50")}`}>
            {label}
          </button>
        ))}
      </div>

      {/* View section */}
      {activeSection === "view" && (
        <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {[["Full Name", profile.name], ["Email", profile.email], ["Phone", profile.phone || "Not set"], ["Role", ROLE_LABELS[profile.role] || profile.role]].map(([k,v])=>(
              <div key={k} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</p>
                <p className="text-gray-900 font-medium mt-0.5">{v}</p>
              </div>
            ))}
          </div>
          {profile.medicalStaff && (
            <>
              <h3 className="font-semibold text-gray-800 border-b pb-2 pt-2">Medical Staff Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[["Staff Type", profile.medicalStaff.staffType?.replace(/_/g," ")], ["Specialty", profile.medicalStaff.specialty || "Not set"], ["Department", profile.medicalStaff.department || "Not set"], ["License No.", profile.medicalStaff.licenseNo || "Not set"]].map(([k,v])=>(
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</p>
                    <p className="text-gray-900 font-medium mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          {profile.patient && (
            <>
              <h3 className="font-semibold text-gray-800 border-b pb-2 pt-2">Patient Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {[["Name", `${profile.patient.firstName} ${profile.patient.lastName}`], ["Gender", profile.patient.gender], ["Blood Type", profile.patient.bloodType || "Not set"], ["Date of Birth", profile.patient.dateOfBirth ? new Date(profile.patient.dateOfBirth).toLocaleDateString() : "Not set"], ["Address", profile.patient.address || "Not set"], ["Insurance", profile.patient.insurance || "Not set"], ["Emergency Contact", profile.patient.emergencyContact || "Not set"]].map(([k,v])=>(
                  <div key={k} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{k}</p>
                    <p className="text-gray-900 font-medium mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <button onClick={() => setActiveSection("edit")} className="mt-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            Edit Profile
          </button>
        </div>
      )}

      {/* Edit section */}
      {activeSection === "edit" && (
        <form onSubmit={saveProfile} className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Edit Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name"><input required className={inputCls} value={editForm.name} onChange={e=>setEditForm(f=>({...f,name:e.target.value}))} /></Field>
            <Field label="Phone Number"><input className={inputCls} value={editForm.phone} onChange={e=>setEditForm(f=>({...f,phone:e.target.value}))} placeholder="0700000000" /></Field>
          </div>
          {profile.role === "MEDICAL_STAFF" && (
            <>
              <h4 className="text-sm font-semibold text-gray-700 pt-1">Medical Staff Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Specialty"><input className={inputCls} value={editForm.specialty} onChange={e=>setEditForm(f=>({...f,specialty:e.target.value}))} placeholder="e.g. Cardiology" /></Field>
                <Field label="Department"><input className={inputCls} value={editForm.department} onChange={e=>setEditForm(f=>({...f,department:e.target.value}))} placeholder="e.g. Cardiology" /></Field>
                <Field label="License No."><input className={inputCls} value={editForm.licenseNo} onChange={e=>setEditForm(f=>({...f,licenseNo:e.target.value}))} placeholder="e.g. KMB-1234" /></Field>
              </div>
            </>
          )}
          {profile.role === "PATIENT" && (
            <>
              <h4 className="text-sm font-semibold text-gray-700 pt-1">Patient Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="First Name"><input className={inputCls} value={editForm.firstName} onChange={e=>setEditForm(f=>({...f,firstName:e.target.value}))} /></Field>
                <Field label="Last Name"><input className={inputCls} value={editForm.lastName} onChange={e=>setEditForm(f=>({...f,lastName:e.target.value}))} /></Field>
                <Field label="Gender">
                  <select className={inputCls} value={editForm.gender} onChange={e=>setEditForm(f=>({...f,gender:e.target.value}))}>
                    <option value="">Select</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </Field>
                <Field label="Date of Birth"><input type="date" className={inputCls} value={editForm.dateOfBirth} onChange={e=>setEditForm(f=>({...f,dateOfBirth:e.target.value}))} /></Field>
                <Field label="Blood Type">
                  <select className={inputCls} value={editForm.bloodType} onChange={e=>setEditForm(f=>({...f,bloodType:e.target.value}))}>
                    <option value="">Select</option>
                    {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map(b=><option key={b} value={b}>{b}</option>)}
                  </select>
                </Field>
                <Field label="Insurance"><input className={inputCls} value={editForm.insurance} onChange={e=>setEditForm(f=>({...f,insurance:e.target.value}))} placeholder="e.g. NHIF" /></Field>
                <Field label="Address"><input className={inputCls} value={editForm.address} onChange={e=>setEditForm(f=>({...f,address:e.target.value}))} /></Field>
                <Field label="Emergency Contact"><input className={inputCls} value={editForm.emergencyContact} onChange={e=>setEditForm(f=>({...f,emergencyContact:e.target.value}))} placeholder="Name & phone" /></Field>
              </div>
            </>
          )}
          <div className="flex gap-3 pt-2 border-t">
            <button type="button" onClick={() => setActiveSection("view")} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      )}

      {/* Password section */}
      {activeSection === "password" && (
        <form onSubmit={changePassword} className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-gray-800 border-b pb-2">Change Password</h3>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 space-y-0.5">
            <p className="font-semibold">Password requirements:</p>
            <p>• At least 8 characters &nbsp;• Starts with a capital letter</p>
            <p>• Contains lowercase letters &nbsp;• Contains a special character (e.g. @, #, !)</p>
          </div>
          <PwInput label="Current Password" field="current" />
          <PwInput label="New Password" field="new" />
          <PwInput label="Confirm New Password" field="confirm" />
          {pwForm.confirm && pwForm.newPw !== pwForm.confirm && (
            <p className="text-xs text-red-500">Passwords do not match</p>
          )}
          <div className="flex gap-3 pt-2 border-t">
            <button type="button" onClick={() => setActiveSection("view")} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      )}

      {/* Delete section */}
      {activeSection === "delete" && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-red-700 border-b border-red-100 pb-2">Delete Account</h3>
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-sm font-semibold text-red-800 mb-1">⚠ This action is permanent</p>
            <p className="text-sm text-red-700">Deleting your account will permanently remove all your data including profile information, appointments, and records. This cannot be undone.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setActiveSection("view")} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
            <button onClick={deleteAccount} disabled={saving}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">
              {saving ? "Deleting..." : "Yes, Delete My Account"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
