import { AppData } from "@/lib/types";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { MetricCard } from "@/components/metric-card";
import { Pill } from "@/components/pill";
import { ProgressBar } from "@/components/progress-bar";
import { fee } from "@/const";
import { ArrowRight, TrendingUp, ClipboardCheck, Award, WalletCards, Mail, CalendarDays, MessageCircle } from "lucide-react";

// Student Overview Component
export function StudentOverview({ data, onNavigate }: {
  data: AppData;
  onNavigate: (path: string) => void
}) {
  const student = data.students[0];
  return (
    <>
      <PageHeading eyebrow="Monday, 08 June 2026" title={`Good morning, ${student.name.split(" ")[0]}.`} body="Here is your learning snapshot for this week."
        actions={
          <Button onClick={() => onNavigate("/portal/learning")}>Continue learning <ArrowRight className="h-4 w-4" /></Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Course progress" value="68%" detail="On track for Trimester 2" icon={TrendingUp} />
        <MetricCard label="Attendance" value={`${student.attendance}%`} detail="Above the 80% target" icon={ClipboardCheck} tone="green" />
        <MetricCard label="Term average" value={`${student.termAverage}%`} detail="12% higher than last term" icon={Award} />
        <MetricCard label="Outstanding fees" value={fee(student.balance)} detail={student.balance ? "Payment plan available" : "Your account is clear"} icon={WalletCards} tone={student.balance ? "red" : "green"} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Your pathway</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">{student.course}</h3>
            </div>
            <Pill tone="green">Active</Pill>
          </div>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Current term</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">Trimester 2, 2026</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Study mode</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">Hybrid learning</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Tutor</p>
              <p className="mt-1 text-sm font-semibold text-slate-950">Siyabonga Radebe</p>
            </div>
          </div>
          <div className="mt-7">
            <div className="mb-2 flex justify-between text-xs">
              <span className="font-semibold text-slate-600">Programme completion</span>
              <span className="font-semibold text-slate-950">68%</span>
            </div>
            <ProgressBar value={68} />
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="dark" onClick={() => onNavigate("/portal/learning")}>Open learning hub</Button>
            <a href="mailto:tutor@nstc.example" className="btn btn-light">Email tutor <Mail className="h-4 w-4" /></a>
          </div>
        </div>
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Next up</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Your schedule</h3>
            </div>
            <CalendarDays className="text-[#a27e10]" />
          </div>
          <div className="mt-5 space-y-4">
            {data.schedules.map((item) =>
              <div className="schedule-row" key={item.id}>
                <div className="date-tile">
                  <strong>{new Date(item.date).getDate()}</strong>
                  <span>{new Date(item.date).toLocaleDateString("en", { month: "short" })}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.time} · {item.location}</p>
                </div>
              </div>)
            }
          </div>
          <button className="mt-5 text-sm font-bold text-slate-950" onClick={() => onNavigate("/portal/results")}>View full schedule <ArrowRight className="ml-1 inline h-4 w-4" /></button>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between"><div>
            <p className="eyebrow">Upcoming work</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Assignments</h3>
          </div>
            <button className="text-xs font-bold text-slate-500" onClick={() => onNavigate("/portal/assignments")}>View all</button>
          </div>
          <div className="mt-5 divide-y divide-slate-100">
            {data.assignments.map((assignment) =>
              <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0" key={assignment.id}>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-950">{assignment.title}</p>
                  <p className="mt-1 text-xs text-slate-500">Due {assignment.due} · {assignment.course}</p>
                </div>
                {assignment.status === "Submitted"
                  ? <Pill tone="green">{assignment.score}%</Pill>
                  : <Pill tone="gold">{assignment.status}</Pill>
                }
              </div>
            )}
          </div>
        </div>
        <div className="portal-card bg-[#111] text-white">
          <p className="eyebrow text-[#D4AF37]">Tutor connection</p>
          <div className="mt-4 flex items-center gap-3"><div className="avatar-large">{data.tutors[0]?.initials || "SR"}</div><div><h3 className="font-display text-2xl">{data.tutors[0]?.name || "Siyabonga Radebe"}</h3><p className="mt-1 text-xs text-white/50">Assigned tutor · Engineering faculty</p></div></div>
          <div className="mt-5"><p className="text-xs uppercase tracking-wider text-white/35">Courses & subjects</p><div className="mt-2 flex flex-wrap gap-2">{(data.tutors[0]?.courses || []).map((course) => <span key={course} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/70">{course}</span>)}</div></div>
          <div className="mt-6 flex gap-2"><a href="https://wa.me/27101234567" className="btn btn-gold"><MessageCircle className="h-4 w-4" /> WhatsApp</a><a href={`mailto:${data.tutors[0]?.email || "tutor@nstc.example"}`} className="btn btn-dark border border-white/15 bg-white/10 text-white hover:bg-white/15"><Mail className="h-4 w-4" /> Email</a></div>
        </div>
      </div>
      <div className="mt-5 portal-card">
        <div className="flex items-center justify-between"><div><p className="eyebrow">Announcements</p><h3 className="mt-2 font-display text-2xl text-slate-950">Stay in the loop</h3></div><span className="metric-icon"><MessageCircle className="h-5 w-5" /></span></div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">{data.announcements.map((announcement) => <div key={announcement.id} className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-semibold text-slate-400">{announcement.date} · {announcement.audience}</p><p className="mt-2 text-sm font-semibold text-slate-950">{announcement.title}</p><p className="mt-2 text-xs leading-5 text-slate-500">{announcement.body}</p></div>)}</div>
      </div>
    </>
  );
}