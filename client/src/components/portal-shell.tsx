import { ReactNode, useState } from "react";
import { Logo } from "./logo";
import { ExternalLink, Menu, X, LayoutDashboard, BookOpen, ClipboardCheck, BarChart3, WalletCards, MessageCircle, ShieldCheck, Users, UserCog } from "lucide-react";

// Portal Shell Component
export function PortalShell({ children, active, onNavigate, role = "Student" }: {
  children: ReactNode;
  active: string;
  onNavigate: (path: string) => void;
  role?: string
}) {
  const [open, setOpen] = useState(false);
  const onSignOut = () => { localStorage.removeItem("nstc-admin-session"); window.location.href = "/admin"; };
  const items = role === "Student"
    ? [
      { label: "Overview", icon: LayoutDashboard, path: "/portal" },
      { label: "My learning", icon: BookOpen, path: "/portal/learning" },
      { label: "Assignments", icon: ClipboardCheck, path: "/portal/assignments" },
      { label: "Results & attendance", icon: BarChart3, path: "/portal/results" },
      { label: "Finances", icon: WalletCards, path: "/portal/finances" },
      { label: "Complaints & queries", icon: MessageCircle, path: "/portal/support" },
      { label: "Account settings", icon: ShieldCheck, path: "/portal/settings" }
    ] :
    [
      { label: "Overview", icon: LayoutDashboard, path: "/admin" },
      { label: "Students", icon: Users, path: "/admin/students" },
      { label: "Staff Members", icon: UserCog, path: "/admin/lecturers" },
      // { label: "Academics", icon: BookOpen, path: "/admin/academics" },
      { label: "Attendance", icon: ClipboardCheck, path: "/admin/attendance" },
      { label: "Complaints", icon: MessageCircle, path: "/admin/complaints" },
      // { label: "Finance", icon: WalletCards, path: "/admin/finance" }
    ];

  return (
    <div className="portal-shell">
      <aside className={`portal-sidebar ${open ? "open" : ""}`}>
        <div className="p-6">
          <Logo />
          <div className="mt-10">
            <p className="eyebrow px-3">{role === "Student" ? "My workspace" : "Management"}</p>
            <div className="mt-3 space-y-1">
              {items.map((item) => {
                const I = item.icon;
                return (
                  <button key={item.path} className={`side-link ${active === item.path ? "active" : ""}`} onClick={() => { onNavigate(item.path); setOpen(false); }}>
                    <I className="h-4 w-4" />
                    {item.label}{active === item.path && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="mt-auto border-t border-slate-200 p-6">
          {role === "Student" && <div className="flex items-center gap-3">
            <div className="avatar-small">TM</div>
            <div>
              <p className="text-sm font-semibold text-slate-950">{role === "Student" ? "Thabo Mokoena" : "NSTC Admin"}</p>
              <p className="text-xs text-slate-500">{role} account</p>
            </div>
          </div>
          }
          {role === "Admin" &&
            <button className="mt-0 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950" onClick={onSignOut}><X className="h-3.5 w-3.5" /> Sign out</button>}
          <a href="/" className={`${role === "Admin" ? "mt-3" : "mt-5"} flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-950`}>
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
            <p className="eyebrow">{role === "Student" ? "Student portal" : "Management system"}</p>
            <p className="hidden text-sm font-semibold text-slate-950 sm:block">
              {role === "Student" ? "Keep moving forward." : "A clear view of every learner."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-950">{role === "Student" ? "Thabo Mokoena" : "Admin account"}</p>
              <p className="text-xs text-slate-500">{role === "Student" ? "NSTC-26-0014" : "Full access"}</p>
            </div>
            <div className="avatar-small">{role === "Student" ? "TM" : "AD"}</div>
          </div>
        </header>
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}