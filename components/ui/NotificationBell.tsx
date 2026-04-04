"use client";
import { useState, useEffect } from "react";
import { notifications, Notification } from "@/lib/store";

interface Props { userId: string }

const TYPE_COLORS: Record<string, string> = {
  message:     "bg-blue-100 text-blue-700",
  appointment: "bg-green-100 text-green-700",
  payment:     "bg-yellow-100 text-yellow-700",
  alert:       "bg-red-100 text-red-700",
  lab:         "bg-purple-100 text-purple-700",
  info:        "bg-gray-100 text-gray-700",
};

export default function NotificationBell({ userId }: Props) {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const refresh = () => setNotifs(notifications.getByUser(userId));

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [userId]);

  const unread = notifs.filter(n => !n.read).length;

  const markRead = (id: string) => { notifications.markRead(id); refresh(); };
  const markAll = () => { notifications.markAllRead(userId); refresh(); };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 rounded-lg hover:bg-white/20 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-2xl border z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <span className="font-semibold text-gray-800 text-sm">Notifications</span>
            <div className="flex items-center gap-2">
              {unread > 0 && <span className="text-xs text-blue-600 font-medium">{unread} unread</span>}
              {unread > 0 && <button onClick={markAll} className="text-xs text-gray-400 hover:text-gray-600">Mark all read</button>}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">No notifications</div>
            ) : notifs.map(n => (
              <div key={n.id} onClick={() => markRead(n.id)}
                className={`px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? "bg-blue-50" : ""}`}>
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 px-1.5 py-0.5 rounded text-xs font-medium shrink-0 ${TYPE_COLORS[n.type] || "bg-gray-100 text-gray-700"}`}>{n.type}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? "font-medium text-gray-900" : "text-gray-600"}`}>{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{n.createdAt}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1.5" />}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t bg-gray-50">
            <button onClick={() => setOpen(false)} className="text-xs text-gray-400 hover:text-gray-600">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
