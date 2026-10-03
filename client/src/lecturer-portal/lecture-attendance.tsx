import { useEffect, useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { MetricCard } from "@/components/metric-card";
import { toast } from "sonner";
import { Check, TrendingUp, BookOpen, ClipboardCheck } from "lucide-react";
import { initials } from "@/const";

export function LecturerAttendance() {
  const courseMap: Record<string, string[]> = {
    "Electrical Engineering N1–N6": ["Engineering Science", "Mathematics N2", "Electrical Trade Theory", "Logic Systems"],
    "Information Technology": ["Networking", "Database Fundamentals", "Technical Support"]
  };
  const [course, setCourse] = useState(lecturerCourses[0]);
  const subjects = courseMap[course] || [];
  const [subject, setSubject] = useState(subjects[0]);
  const [present, setPresent] = useState<Record<string, boolean>>({ s1: true, s2: true, s3: true, s4: false, s5: true });

  useEffect(() => setSubject(subjects[0]), [course]);
  const students = lecturerStudentRows.filter((st) => st.course === course || (course === lecturerCourses[0] && st.id === "s1"));
  const trend = subjects.map((item, i) => ({ item, value: 78 + ((i + course.length) * 7) % 19 }));

  return (
    <>
      <PageHeading eyebrow="Class register" title="Attendance" body="Choose a course, focus its subjects and monitor attendance as a responsive bar chart."
        actions={
          <Button onClick={() => toast.success(`Attendance saved for ${course} · ${subject}.`)}>Save attendance <Check className="h-4 w-4" /></Button>}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Selected course" value={course === lecturerCourses[0] ? "Electrical" : "IT"} detail={`${subjects.length} subjects available`} icon={BookOpen} />
        <MetricCard label="Present today" value={`${Object.values(present).filter(Boolean).length} / ${students.length}`} detail={subject} icon={ClipboardCheck} tone="green" />
        <MetricCard label="Aggregate attendance" value="94%" detail="Selected course trend" icon={TrendingUp} />
      </div>
      <div className="mt-6 portal-card">
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-5">
          {lecturerCourses.map((item) =>
            <button key={item} className={`filter-chip ${course === item ? "active" : ""}`} onClick={() => setCourse(item)}>{item}</button>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {subjects.map((item) =>
            <button key={item} className={`filter-chip ${subject === item ? "active" : ""}`} onClick={() => setSubject(item)}>{item}</button>
          )}
        </div>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <div className="portal-card">
          <p className="eyebrow">Mark attendance</p>
          <h3 className="mt-2 font-display text-2xl text-slate-950">08 June 2026 · {subject}</h3>
          <div className="mt-5">
            {students.map((student) =>
              <label className="attendance-row" key={student.id}>
                <span className="flex items-center gap-3">
                  <span className="avatar-small">{initials(student.name)}</span>
                  <span>
                    <strong className="block text-sm text-slate-950">{student.name}</strong>
                    <small className="text-xs text-slate-500">{student.course}</small>
                  </span>
                </span>
                <input type="checkbox" checked={Boolean(present[student.id])} onChange={(e) => setPresent((old) => ({ ...old, [student.id]: e.target.checked }))} />
              </label>
            )}
          </div>
        </div>
        <div className="portal-card">
          <p className="eyebrow">Attendance trend</p>
          <h3 className="mt-2 font-display text-2xl text-slate-950">{course}</h3>
          <div className="mt-6 flex h-56 items-end gap-3">
            {trend.map(({ item, value }) =>
              <div className="flex min-w-0 flex-1 flex-col items-center gap-2" key={item}>
                <span className="text-xs font-bold text-slate-700">{value}%</span>
                <div className="w-full rounded-t-md bg-[#D4AF37]" style={{ height: `${Math.max(28, value * 1.7)}px` }} />
                <span className="w-full truncate text-center text-[9px] text-slate-400" title={item}>{item}</span>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-slate-500">Figures recalculate when the course or subject focus changes.</p>
        </div>
      </div>
    </>
  );
}