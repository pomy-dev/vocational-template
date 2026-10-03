import { useState } from "react";
import { AppData } from "@/lib/types";
import { PortalShell } from "@/components/portal-shell";
import { PageHeading } from "@/components/page-heading";
import { MetricCard } from "@/components/metric-card";
import { Pill } from "@/components/pill";
import { CalendarDays, TrendingUp, Check, UserRound } from "lucide-react";
import { ProgressBar } from "@/components/progress-bar";


export function AdminAttendance({ data, navigate }: {
  data: AppData; navigate: (path: string) => void
}) {
  const [period, setPeriod] = useState("Today");
  const [course, setCourse] = useState("All courses");
  const [classFilter, setClassFilter] = useState("All lecturer classes");
  const coursesInData = Array.from(new Set(data.students.map((s) => s.course)));
  const active = data.students.filter((s) => s.status === "Active");
  const classes = data.lecturers.flatMap((l) => l.courses.map((c) => `${l.name} · ${c}`));
  const selectedClassCourse = classFilter === "All lecturer classes" ? "All courses" : classFilter.split(" · ").slice(1).join(" · ");
  const filtered = active.filter((s) => (course === "All courses" || s.course === course) && (selectedClassCourse === "All courses" || s.course === selectedClassCourse));
  const aggregate = filtered.length ? Math.round(filtered.reduce((sum, s) => sum + s.attendance, 0) / filtered.length) : 0;

  return (
    <PortalShell role="Admin" active="/admin/attendance" onNavigate={navigate}>
      <PageHeading eyebrow="Attendance analytics" title="Aggregated attendance" body="Review attendance performance by period, course and lecturer class. Individual registers remain with lecturers." />
      <div className="portal-card">
        <div className="grid gap-3 md:grid-cols-3">
          <select className="field mt-0" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option>Today</option>
            <option>This week</option>
            <option>This month</option>
            {period === "This week" && <option>Week 24 · 2026</option>}
            {period === "This month" && <option>June 2026</option>}
          </select>
          <select className="field mt-0" value={course} onChange={(e) => setCourse(e.target.value)}>
            <option>All courses</option>
            {coursesInData.map((v) => <option key={v}>{v}</option>)}
          </select>
          <select className="field mt-0" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option>All lecturer classes</option>
            {classes.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Selected period" value={period} detail="Reporting window" icon={CalendarDays} />
        <MetricCard label="Aggregate attendance" value={`${aggregate}%`} detail={`${filtered.length} active learners`} icon={TrendingUp} tone={aggregate < 80 ? "red" : "green"} />
        <MetricCard label="Above threshold" value={`${filtered.filter((s) => s.attendance >= 80).length}`} detail="Learners at 80% or higher" icon={Check} tone="green" />
        <MetricCard label="Classes included" value={classFilter === "All lecturer classes" ? classes.length : 1} detail="Lecturer class groups" icon={UserRound} />
      </div>
      <div className="mt-6 portal-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Aggregated view</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Attendance by course</h3>
          </div>
          <Pill tone={aggregate < 80 ? "red" : "green"}>{aggregate >= 80 ? "On track" : "Needs intervention"}</Pill>
        </div>
        <div className="mt-6 space-y-4">
          {coursesInData.filter((c) => (course === "All courses" || c === course) && (selectedClassCourse === "All courses" || c === selectedClassCourse)).map((c) => {
            const rows = active.filter((st) => st.course === c);
            const avg = rows.length ? Math.round(rows.reduce((sum, st) => sum + st.attendance, 0) / rows.length) : 0;

            return (
              <div key={c}>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-950">{c}</span>
                  <span className="font-bold">{avg}%</span>
                </div>
                <div className="mt-2">
                  <ProgressBar value={avg} />
                </div>
                <p className="mt-1 text-xs text-slate-400">{rows.length} active learners · {period}</p>
              </div>
            );
          })}
        </div>
      </div>
    </PortalShell>
  );
}