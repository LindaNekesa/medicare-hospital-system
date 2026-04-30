import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ── Navigation ─────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Medical cross logo */}
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v8M8 12h8" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-lg leading-none">Medicare Hospital</p>
              <p className="text-xs text-blue-600 font-medium">Nairobi, Kenya</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-sm bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-white/5 rounded-full" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Accredited Healthcare Facility · Est. 2010
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Your Health,<br />
              <span className="text-cyan-200">Our Priority</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
              Medicare Hospital delivers world-class healthcare with compassion and precision.
              From emergency care to specialist consultations — we are here for you, every step of the way.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm">
                Book an Appointment
              </Link>
              <Link href="/login" className="border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm">
                Staff Portal →
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 mt-14 pt-10 border-t border-white/20 max-w-lg">
              {[["50,000+", "Patients Served"], ["200+", "Medical Staff"], ["24/7", "Emergency Care"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-3xl font-extrabold text-white">{v}</p>
                  <p className="text-blue-200 text-xs mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Welcome message ─────────────────────────────────────────────────── */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-3xl shadow-sm border border-blue-100 p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
            {/* Doctor illustration */}
            <div className="shrink-0 w-32 h-32 md:w-44 md:h-44 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center shadow-xl">
              <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">A Message from Our Team</p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                Welcome to Medicare Hospital
              </h2>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                &ldquo;We believe every patient deserves exceptional care delivered with dignity and respect.
                Our team of dedicated doctors, nurses, and specialists work tirelessly to ensure your health
                and well-being. Whether you are visiting us for a routine check-up or a complex procedure,
                you are in safe, caring hands.&rdquo;
              </p>
              <p className="mt-4 text-gray-500 text-sm font-medium">— Dr. Sarah Johnson, Chief Medical Officer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">What We Offer</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Comprehensive Healthcare Services</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">From prevention to treatment, we cover every aspect of your health journey.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[
              ["🫀", "Cardiology",       "Heart disease diagnosis and treatment"],
              ["🧠", "Neurology",        "Brain and nervous system care"],
              ["🦷", "Dental",           "Complete oral health services"],
              ["🔬", "Laboratory",       "Advanced diagnostic testing"],
              ["🩻", "Radiology",        "Imaging and diagnostic scans"],
              ["💊", "Pharmacy",         "In-house dispensing services"],
              ["🤱", "Maternity",        "Prenatal and postnatal care"],
              ["🚑", "Emergency",        "24/7 emergency and trauma care"],
              ["💪", "Physiotherapy",    "Rehabilitation and recovery"],
              ["👁️", "Ophthalmology",    "Eye care and vision services"],
              ["🧬", "Oncology",         "Cancer screening and treatment"],
              ["🏥", "General Medicine", "Primary care for all ages"],
            ].map(([icon, name, desc]) => (
              <div key={name as string} className="bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-2xl p-5 transition-all group cursor-default">
                <div className="text-3xl mb-3">{icon}</div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{name as string}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mission & Vision ────────────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-cyan-400 font-semibold text-sm uppercase tracking-widest mb-2">Who We Are</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Mission & Vision</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="w-14 h-14 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-gray-300 leading-relaxed">
                To provide accessible, affordable, and high-quality healthcare services to every individual
                in our community — regardless of background or circumstance. We are committed to healing
                with compassion, integrity, and clinical excellence.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
              <div className="w-14 h-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center mb-5">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-gray-300 leading-relaxed">
                To be the leading healthcare institution in East Africa — recognised for innovation,
                patient-centred care, and a commitment to improving health outcomes for all.
                We envision a healthier community built on trust, technology, and teamwork.
              </p>
            </div>
          </div>

          {/* Core values */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              ["🤝", "Compassion",   "We treat every patient with empathy and respect"],
              ["⭐", "Excellence",   "We pursue the highest standards in clinical care"],
              ["🔒", "Integrity",    "We act with honesty and transparency always"],
              ["💡", "Innovation",   "We embrace technology to improve patient outcomes"],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="text-center p-5 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-3xl mb-2">{icon}</div>
                <p className="font-bold text-white text-sm">{title as string}</p>
                <p className="text-gray-400 text-xs mt-1 leading-relaxed">{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why choose us ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-widest mb-2">Why Medicare</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Why Patients Choose Us</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              ["🏆", "Accredited Excellence", "Fully accredited by KENAS and the Ministry of Health. Our standards meet international benchmarks for patient safety and clinical quality."],
              ["⚡", "Fast & Efficient", "Minimal waiting times, streamlined digital records, and a dedicated team ensure you receive care quickly and without unnecessary delays."],
              ["🌍", "Community Focused", "We serve patients from all walks of life. Our outreach programmes, affordable pricing, and NHIF acceptance make quality care accessible to all."],
            ].map(([icon, title, desc]) => (
              <div key={title as string} className="text-center p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{title as string}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc as string}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to take charge of your health?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Create your patient account today and book your first appointment in minutes.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="bg-white text-blue-700 font-bold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm">
              Register as a Patient
            </Link>
            <Link href="/login" className="border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-sm">
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v8M8 12h8" />
                  </svg>
                </div>
                <span className="text-white font-bold text-lg">Medicare Hospital</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Providing compassionate, high-quality healthcare to the people of Kenya since 2010.
              </p>
              <div className="mt-4 space-y-1 text-sm">
                <p>📍 Kenyatta Avenue, Nairobi, Kenya</p>
                <p>📞 +254 700 000 000</p>
                <p>✉️ info@medicare.com</p>
              </div>
            </div>
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Quick Links</p>
              <ul className="space-y-2 text-sm">
                {[["Sign In", "/login"], ["Register", "/register"], ["Forgot Password", "/forgot-password"]].map(([l, h]) => (
                  <li key={l}><Link href={h} className="hover:text-white transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-4 text-sm">Emergency</p>
              <p className="text-sm leading-relaxed">
                For medical emergencies, call our 24/7 emergency line:
              </p>
              <p className="text-white font-bold text-xl mt-2">0800 720 000</p>
              <p className="text-xs mt-1">Toll-free · Available 24/7</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <p>© {new Date().getFullYear()} Medicare Hospital System. All rights reserved.</p>
            <p>Built with ❤️ for better healthcare in Kenya</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
