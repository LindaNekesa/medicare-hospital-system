"use client";
import { useRouter } from "next/navigation";
import { ReactNode, useState, useEffect } from "react";
import NotificationBell from "@/components/ui/NotificationBell";

interface Props {
  title: string;
  role: string;
  accentColor: string;
  icon: string;
  navItems: { label: string; icon: string; id: string }[];
  children: ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
  headerExtra?: ReactNode;
}

export default function DashboardShell({ title, role, accentColor, icon, navItems, children, activeTab, onTabChange, headerExtra }: Props) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userId, setUserId] = useState("guest");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setUserId(u.email || u.id || "guest");
    } catch { /* ignore */ }
  }, []);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-200 bg-white border-r flex flex-col shadow-sm`}>
        {/* Logo */}
        <div className={`flex items-center gap-3 p-4 border-b ${accentColor} text-white`}>
          <span className="text-2xl">{icon}</span>
          {sidebarOpen && (
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{title}</p>
              <p className="text-xs opacity-80 truncate">{role}</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-700 font-medium border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="text-lg shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t p-3">
          {sidebarOpen && (
            <div className="mb-2 px-1">
              <p className="text-xs font-medium text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          )}
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <span>🚪</span>
            {sidebarOpen && "Sign Out"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            {headerExtra}
            <NotificationBell userId={userId} />
            <span className="text-sm text-gray-500">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">
              {user.name?.charAt(0) || "U"}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
