"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Step = "id" | "otp" | "success";

export default function PatientLoginPage() {
  const router = useRouter();

  const [step, setStep]             = useState<Step>("id");
  const [nationalId, setNationalId] = useState("");
  const [otp, setOtp]               = useState(["", "", "", "", "", ""]);
  const [patientName, setPatientName] = useState("");
  const [devOtp, setDevOtp]         = useState("");
  const [error, setError]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [countdown, setCountdown]   = useState(0);
  const [canResend, setCanResend]   = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer for OTP expiry
  useEffect(() => {
    if (step === "otp" && countdown > 0) {
      timerRef.current = setInterval(() => {
        setCountdown(c => {
          if (c <= 1) {
            clearInterval(timerRef.current!);
            setCanResend(true);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [step, countdown]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  // Step 1: Request OTP by National ID
  const requestOtp = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/patient-otp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ nationalId: nationalId.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      setPatientName(data.patientName);
      setDevOtp(data.devOtp || "");
      setStep("otp");
      setCountdown(600); // 10 minutes
      setCanResend(false);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError("Cannot reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit input
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  };

  // Step 2: Verify OTP
  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Please enter all 6 digits"); return; }
    setError("");
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/patient-verify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ nationalId: nationalId.trim().toUpperCase(), otp: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }

      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setStep("success");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setError("Cannot reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setCanResend(false);
    setLoading(true);
    try {
      const res  = await fetch("/api/auth/patient-otp", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ nationalId: nationalId.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setDevOtp(data.devOtp || "");
      setCountdown(600);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-teal-50">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-green-700 via-teal-600 to-cyan-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute -bottom-24 -left-12 w-72 h-72 bg-white/5 rounded-full" />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v8M8 12h8" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-xl leading-none">Medicare Hospital</p>
            <p className="text-green-200 text-xs font-medium mt-0.5">Patient Portal</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-4xl font-extrabold text-white leading-tight">
              Secure Patient<br />Access
            </h2>
            <p className="text-green-100 mt-4 text-lg leading-relaxed">
              Your health records are protected. Sign in with your National ID to access your appointments, prescriptions, and medical history.
            </p>
          </div>

          <div className="space-y-3">
            {[
              ["🪪", "National ID Login", "No password needed — just your ID number"],
              ["🔐", "OTP Verification", "One-time code sent to your registered phone"],
              ["⏱️", "10-Minute Expiry", "OTP expires automatically for your security"],
              ["🏥", "Full Access", "View appointments, bills, prescriptions & records"],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="flex items-start gap-3 bg-white/10 rounded-xl p-3 border border-white/15">
                <span className="text-xl shrink-0">{icon}</span>
                <div>
                  <p className="text-white font-semibold text-sm">{title as string}</p>
                  <p className="text-green-200 text-xs mt-0.5">{desc as string}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-green-300 text-xs">
          © {new Date().getFullYear()} Medicare Hospital · Patient Portal
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg">Medicare Hospital</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-7">
              {[["1", "Enter ID"], ["2", "Verify OTP"]].map(([num, label], i) => (
                <div key={num} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    (i === 0 && (step === "id" || step === "otp" || step === "success")) ||
                    (i === 1 && (step === "otp" || step === "success"))
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}>{step === "success" ? "✓" : num}</div>
                  <span className={`text-xs font-medium ${i === 0 && step === "id" ? "text-gray-900" : i === 1 && step === "otp" ? "text-gray-900" : "text-gray-400"}`}>{label}</span>
                  {i === 0 && <div className="w-8 h-px bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2.5">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* ── Step 1: Enter National ID ── */}
            {step === "id" && (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Patient Sign In</h1>
                  <p className="text-gray-500 text-sm mt-1">Enter your National ID or Passport number to receive an OTP</p>
                </div>
                <form onSubmit={requestOtp} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">National ID / Passport Number</label>
                    <div className="relative">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={nationalId}
                        onChange={e => setNationalId(e.target.value.toUpperCase())}
                        required
                        disabled={loading}
                        placeholder="e.g. 12345678 or A1234567"
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 bg-gray-50 focus:bg-white transition-colors uppercase"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5">Your ID must be registered at the hospital reception</p>
                  </div>

                  <button type="submit" disabled={loading || !nationalId.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm">
                    {loading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Sending OTP...</>
                    ) : <>Send OTP Code <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg></>}
                  </button>
                </form>
              </>
            )}

            {/* ── Step 2: Enter OTP ── */}
            {step === "otp" && (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Enter OTP Code</h1>
                  <p className="text-gray-500 text-sm mt-1">
                    Welcome, <strong className="text-gray-800">{patientName}</strong>. Enter the 6-digit code sent to your registered phone.
                  </p>
                </div>

                {/* Dev OTP hint */}
                {devOtp && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                    <p className="font-semibold text-xs uppercase tracking-wide mb-0.5">Development Mode</p>
                    <p>Your OTP is: <strong className="text-lg tracking-widest font-mono">{devOtp}</strong></p>
                    <p className="text-xs text-amber-600 mt-0.5">This message only appears in development</p>
                  </div>
                )}

                {/* Countdown */}
                <div className={`mb-5 flex items-center justify-between p-3 rounded-xl border ${countdown > 60 ? "bg-green-50 border-green-200 text-green-700" : countdown > 0 ? "bg-orange-50 border-orange-200 text-orange-700" : "bg-red-50 border-red-200 text-red-700"}`}>
                  <span className="text-sm font-medium">
                    {countdown > 0 ? `OTP expires in ${formatTime(countdown)}` : "OTP has expired"}
                  </span>
                  <span className="text-xs font-mono font-bold">{countdown > 0 ? formatTime(countdown) : "00:00"}</span>
                </div>

                <form onSubmit={verifyOtp} className="space-y-5">
                  {/* 6-digit OTP input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">6-Digit OTP Code</label>
                    <div className="flex gap-2 justify-between" onPaste={handleOtpPaste}>
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={el => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={e => handleOtpChange(i, e.target.value)}
                          onKeyDown={e => handleOtpKeyDown(i, e)}
                          disabled={loading || countdown === 0}
                          className={`w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-colors disabled:opacity-40 ${
                            digit ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 bg-gray-50 text-gray-900 focus:border-green-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button type="submit" disabled={loading || otp.join("").length < 6 || countdown === 0}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                    {loading ? (
                      <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Verifying...</>
                    ) : "Verify & Sign In"}
                  </button>

                  <div className="flex items-center justify-between text-sm">
                    <button type="button" onClick={() => { setStep("id"); setOtp(["","","","","",""]); setError(""); }}
                      className="text-gray-500 hover:text-gray-700">← Change ID</button>
                    <button type="button" onClick={resendOtp} disabled={!canResend || loading}
                      className={`font-medium ${canResend ? "text-green-600 hover:text-green-800" : "text-gray-300 cursor-not-allowed"}`}>
                      Resend OTP
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* ── Step 3: Success ── */}
            {step === "success" && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Verified!</h2>
                <p className="text-gray-500 text-sm mt-1">Welcome, {patientName}. Redirecting to your dashboard...</p>
                <div className="mt-4 flex justify-center">
                  <svg className="w-5 h-5 animate-spin text-green-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </div>
              </div>
            )}
          </div>

          {/* Links */}
          {step === "id" && (
            <div className="mt-5 text-center space-y-2">
              <p className="text-xs text-gray-400">
                Not registered? Visit the <strong className="text-gray-600">Reception Desk</strong> to register your National ID.
              </p>
              <p className="text-xs text-gray-400">
                Staff member?{" "}
                <Link href="/login" className="text-blue-600 font-medium hover:underline">Sign in with email →</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
