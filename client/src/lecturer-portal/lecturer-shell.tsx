import { ReactNode, useState } from "react";
import { AppData } from "@/lib/types";
import {
  LayoutDashboard,
  X,
  Megaphone,
  Menu,
  MessageCircle,
  ExternalLink,
  Users,
  FileText,
  ClipboardCheck,
  BarChart3,
  Upload,
  CalendarDays,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { unreadNotificationCount } from "@/lib/unread-notification-count";

export function LecturerShell({
  children,
  active,
  onNavigate,
  onSignOut,
  data,
}: {
  children: ReactNode;
  active: string;
  onNavigate: (path: string) => void;
  onSignOut: () => void;
  data: AppData;
}) {
  const [open, setOpen] = useState(false);
  const items = [
    { label: "Overview", icon: LayoutDashboard, path: "/lecturer" },
    { label: "Students", icon: Users, path: "/lecturer/students" },
    { label: "Academics", icon: FileText, path: "/lecturer/resources" },
    { label: "Attendance", icon: ClipboardCheck, path: "/lecturer/attendance" },
    { label: "Student results", icon: BarChart3, path: "/lecturer/results" },
    { label: "Submissions", icon: Upload, path: "/lecturer/submissions" },
    { label: "Schedules", icon: CalendarDays, path: "/lecturer/schedules" },
    // { label: "Complaints", icon: MessageCircle, path: "/lecturer/complaints" }
  ];

  return (
    <div className="portal-shell lecturer-shell">
      <aside className={`portal-sidebar ${open ? "open" : ""}`}>
        <div className="p-6">
          <Logo />
          <div className="mt-10">
            <p className="eyebrow px-3">Teaching workspace</p>
            <div className="mt-3 space-y-1">
              {items.map(item => {
                const I = item.icon;
                return (
                  <button
                    key={item.path}
                    className={`side-link ${active === item.path ? "active" : ""}`}
                    onClick={() => {
                      onNavigate(item.path);
                      setOpen(false);
                    }}
                  >
                    <I className="h-4 w-4" />
                    {item.label}
                    {active === item.path && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-auto border-t border-slate-200 p-6">
          <button
            className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950"
            onClick={onSignOut}
          >
            <X className="h-3.5 w-3.5" /> Sign out
          </button>
          <a
            href="/"
            className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Public website
          </a>
        </div>
      </aside>
      <div className="portal-main">
        <header className="portal-header">
          <button className="icon-btn lg:hidden" onClick={() => setOpen(!open)}>
            <Menu />
          </button>
          <div>
            <p className="eyebrow">Lecturer portal</p>
            <p className="hidden text-sm font-semibold text-slate-950 sm:block">
              Make every class count.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className="notification-badge"
              onClick={() => {
                onNavigate("/lecturer/announcements");
                setOpen(false);
              }}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{unreadNotificationCount(data)}</span>
            </button>
            <button
              className="icon-btn border border-[#D4AF37] text-[#916e0a]"
              title="Push a complaint"
              onClick={() => {
                onNavigate("/lecturer/complaints");
                setOpen(false);
              }}
            >
              <Megaphone className="h-4 w-4" />
            </button>

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-950">
                Siyabonga Radebe
              </p>
              <p className="text-xs text-slate-500">Engineering faculty</p>
            </div>
            <div className="avatar-small">SR</div>
          </div>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
