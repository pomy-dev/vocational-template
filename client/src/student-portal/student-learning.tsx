import { useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { Download, CalendarDays, FileText } from "lucide-react";
import { AppData } from "@/lib/types";
import { ProgressBar } from "@/components/progress-bar";
import { toast } from "sonner";
import { Pill } from "@/components/pill";
import { CalendarDrawer } from "@/components/calendar";

// Student Learning Component
export function StudentLearning({ data, onNavigate }: { data: AppData; onNavigate: (path: string) => void }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  return (
    <>
      <PageHeading eyebrow="My learning" title="Your learning hub" body="Everything you need for your current pathway, in one place."
        actions={<Button variant="dark" onClick={() => toast.success("Learning resources prepared for download.")}><Download className="h-4 w-4" /> Download resource pack</Button>}
      />
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="portal-card"><p className="eyebrow">Enrolled programme</p><h3 className="mt-2 font-display text-3xl text-slate-950">Electrical Engineering N1–N6</h3><p className="mt-2 text-sm text-slate-500">Trimester 2 · Hybrid · Tutor: Siyabonga Radebe</p><div className="mt-8 space-y-5">{["Engineering Science", "Mathematics N2", "Electrical Trade Theory"].map((subject, i) => <div key={subject}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-slate-800">{subject}</span><span className="text-slate-400">{[82, 74, 61][i]}%</span></div><ProgressBar value={[82, 74, 61][i]} /></div>)}</div></div>
        <div className="portal-card"><p className="eyebrow">Learning resources</p><div className="mt-4 space-y-3">{data.resources.filter((resource) => resource.published).map((resource) => <button key={resource.id} className="resource-row" onClick={() => toast.success("Demo download started.")}><div className="file-icon"><FileText /></div><span>{resource.title} · {resource.fileType}</span><Download className="ml-auto h-4 w-4 text-slate-400" /></button>)}</div></div>
      </div>
      <div className="mt-5 portal-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Upcoming timetable</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Classes and assessments</h3>
          </div>
          <Button variant="light" onClick={() => setCalendarOpen(true)}>Open calendar <CalendarDays className="h-4 w-4" /></Button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Type</th>
                <th>Date</th>
                <th>Time</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {data.schedules.map((r) =>
                <tr key={r.id}>
                  <td className="font-semibold">{r.title}</td>
                  <td><Pill tone={r.kind === "Exam" ? "red" : "slate"}>{r.kind}</Pill></td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.location}</td>
                </tr>)}
            </tbody>
          </table>
        </div>
      </div>
      {calendarOpen && <CalendarDrawer schedules={data.schedules} assignments={data.assignments} onClose={() => setCalendarOpen(false)} />}
    </>
  );
}