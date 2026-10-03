import { AppData } from "@/lib/types";
import { PageHeading } from "@/components/page-heading";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/button";
import { ArrowRight, Award, CalendarDays, BookOpen, FileText, ClipboardCheck, Users } from "lucide-react";
import { Pill } from "@/components/pill";

export function LecturerOverview({ data, onNavigate }: {
  data: AppData; onNavigate: (path: string) => void
}) {
  const unread = data.lecturerNotifications.filter((item) => !item.read);
  const assignedStudents = lecturerStudentRows.filter((student) => lecturerCourses.includes(student.course));
  const assignedAttendance = assignedStudents.length ? Math.round(assignedStudents.reduce((sum, student) => sum + (student?.attendance || 0), 0) / assignedStudents.length) : 0;
  return (
    <>
      <PageHeading eyebrow="Monday, 08 June 2026" title="Good morning, Siyabonga." body="Your teaching workspace for classes, learners and assessments."
        actions={
          <Button onClick={() => onNavigate("/lecturer/schedules")}>Edit timetable <CalendarDays className="h-4 w-4" /></Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-4">
        <MetricCard label="Courses + subjects" value="2 + 4" detail="Across your teaching load" icon={BookOpen} />
        <MetricCard label="Assignments created" value={data.assignments.length + 4} detail="2 awaiting review" icon={FileText} />
        <MetricCard label="Total students" value={assignedStudents.length} detail={`${assignedStudents.filter((student) => student.status === "Suspended").length} require attention`} icon={Users} tone="green" />
        <MetricCard label="My student attendance" value={`${assignedAttendance}%`} detail="Aggregated assigned classes" icon={ClipboardCheck} tone={assignedAttendance >= 80 ? "green" : "red"} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">My teaching load</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Courses, subjects & class sizes</h3>
            </div>
            <Pill tone="green">Active term</Pill>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {
              [{
                course: "Electrical Engineering N1–N6",
                subject: "Engineering Science",
                count: 14,
                time: "Mon · 09:00"
              },
              {
                course: "Electrical Engineering N1–N6",
                subject: "Electrical Trade Theory",
                count: 12,
                time: "Wed · 13:00"
              },
              {
                course: "Information Technology",
                subject: "Networking",
                count: 8,
                time: "Thu · 10:00"
              },
              {
                course: "Information Technology",
                subject: "Database Fundamentals",
                count: 7,
                time: "Fri · 09:00"
              }
              ].map((item) =>
                <div className="rounded-xl border border-slate-200 p-4" key={`${item.course}-${item.subject}`}>
                  <p className="text-sm font-semibold text-slate-950">{item.subject}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.course}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.count} students</span>
                    <span className="text-slate-400">{item.time}</span>
                  </div>
                </div>
              )}
          </div>
        </div>
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Notifications</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Needs your attention</h3>
            </div>
            <Pill>{unread.length} unread</Pill>
          </div>
          <div className="mt-4 space-y-3">
            {unread.slice(0, 3).map((item) =>
              <div className="rounded-xl bg-slate-50 p-3" key={item.id}>
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">{item.body}</p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{item.date}</p>
              </div>
            )}
          </div>
          <button className="mt-5 text-sm font-bold text-slate-950" onClick={() => onNavigate("/lecturer/announcements")}>View all notifications <ArrowRight className="ml-1 inline h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="dark-mini-card">
          <Users />
          <div><strong>5</strong><small>students to follow up</small></div>
        </div>
        <div className="dark-mini-card">
          <ClipboardCheck />
          <div>
            <strong>{assignedAttendance}%</strong><small>aggregated attendance</small>
          </div>
        </div>

        <div className="dark-mini-card"><Award /><div><strong>79%</strong><small>average class score</small></div></div>
      </div>
    </>
  );
}