import { useEffect, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { Assignment, Schedule } from "../lib/types";

// Calendar Drawer Component
export async function CalendarDrawer({ schedules, assignments, onClose }: {
  schedules: Schedule[];
  assignments: Assignment[];
  onClose: () => void
}) {
  const [view, setView] = useState<"month" | "week">("month");
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const events = [
    ...schedules.map((item) => ({ day: Number(item.date.slice(-2)), title: item.title, meta: `${item.time} · ${item.kind}`, tone: item.kind === "Exam" ? "exam" : "class" })),
    ...assignments.map((item) => ({ day: Number(item.due.slice(-2)), title: item.title, meta: "Assignment due", tone: "assignment" }))
  ];
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <aside className="calendar-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
          <div><p className="eyebrow">Academic calendar</p><h2 className="mt-2 font-display text-3xl text-slate-950">June 2026</h2><p className="mt-1 text-sm text-slate-500">Classes, assignments and examinations in one view.</p></div>
          <button className="icon-btn" onClick={onClose} aria-label="Close calendar"><X /></button>
        </div>
        <div className="mt-5 flex items-center justify-between"><div className="flex gap-2"><button className={`filter-chip ${view === "month" ? "active" : ""}`} onClick={() => setView("month")}>Month</button><button className={`filter-chip ${view === "week" ? "active" : ""}`} onClick={() => setView("week")}>Week</button></div><button className="icon-btn" onClick={() => toast.info("Calendar navigation is ready for the next teaching cycle.")}><ChevronRight /></button></div>
        {view === "month" ? <div className="calendar-grid mt-5"><div className="calendar-weekdays">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-days">{days.map((day) => { const dayEvents = events.filter((event) => event.day === day); return <div className={`calendar-day ${day === 8 ? "today" : ""}`} key={day}><span className="calendar-day-number">{day}</span>{dayEvents.slice(0, 2).map((event) => <div className={`calendar-event ${event.tone}`} key={`${day}-${event.title}`} title={`${event.title} · ${event.meta}`}>{event.title}</div>)}</div>; })}</div></div> : <div className="mt-5 space-y-3"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">08–14 June 2026</p>{[...schedules, ...assignments.map((a) => ({ id: a.id, title: a.title, kind: "Assignment", date: a.due, time: "Due by 23:59", location: "Online submission" }))].map((item) => <div key={item.id} className="schedule-row rounded-xl border border-slate-200 p-3"><div className="date-tile"><strong>{new Date(item.date).getDate()}</strong><span>{new Date(item.date).toLocaleDateString("en", { month: "short" })}</span></div><div><p className="text-sm font-semibold text-slate-950">{item.title}</p><p className="mt-1 text-xs text-slate-500">{item.time} · {item.location}</p></div></div>)}</div>}
        <div className="mt-6 border-t border-slate-200 pt-5"><p className="eyebrow">Legend</p><div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500"><span><i className="legend-dot class" /> Class</span><span><i className="legend-dot assignment" /> Assignment</span><span><i className="legend-dot exam" /> Exam</span></div></div>
      </aside>
    </div>
  );
}