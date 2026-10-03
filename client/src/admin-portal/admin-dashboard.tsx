import { useState } from "react";
import { AppData, Student } from "@/lib/types";
import { useAction } from "@/utils/use-action";
import { toast } from "sonner";
import { PortalShell } from "@/components/portal-shell";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { MetricCard } from "@/components/metric-card";
import { Plus, GraduationCap, UserRound, BarChart3, Users, Award, ArrowRight, TrendingUp, ClipboardCheck } from "lucide-react";
import { Pill } from "@/components/pill";
import { MoreHorizontal } from "lucide-react";
import { ProgressBar } from "@/components/progress-bar";
import { Confirm } from "@/components/confirm";
import { Modal } from "@/components/modal";


export function AdminDashboard({ data, setData, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  navigate: (path: string) => void
}) {
  const [confirm, setConfirm] = useState<Student | null>(null);
  const [announcementOpen, setAnnouncementOpen] = useState(false);
  const { loading, run } = useAction();
  const counts = {
    active: data.students.filter((s) => s.status === "Active").length,
    suspended: data.students.filter((s) => s.status === "Suspended").length,
    completed: data.students.filter((s) => s.status === "Completed").length,
    alumni: data.students.filter((s) => s.status === "Alumni").length
  };
  const absent = data.students.filter((s) => s.attendance < 80);
  const overallAttendance = data.students.length ? Math.round(data.students.reduce((sum, student) => sum + student.attendance, 0) / data.students.length) : 0;
  const courseCounts = Array.from(new Set(data.students.map((student) => student.course))).map((course) => ({ course, count: data.students.filter((student) => student.course === course).length }));
  const maxCourseCount = Math.max(...courseCounts.map((item) => item.count), 1);
  const pieTotal = Math.max(counts.active + counts.alumni, 1); const activeShare = Math.round((counts.active / pieTotal) * 100);

  const remove = () => {
    if (!confirm) return;
    run(() => {
      setData((old) => ({ ...old, students: old.students.filter((s) => s.id !== confirm.id) }));
      setConfirm(null);
      toast.success("Student removed from demo register.");
    });
  };

  return (
    <PortalShell role="Admin" active="/admin" onNavigate={navigate}>
      <PageHeading eyebrow="Monday, 08 June 2026" title="Good morning, admin." body="A live demo view of the NSTC student body."
        actions={
          <Button onClick={() => setAnnouncementOpen(true)}><Plus className="h-4 w-4" /> New announcement</Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total learners" value={data.students.length} detail="Across 2 campuses" icon={Users} />
        <MetricCard label="Active" value={counts.active} detail="Currently enrolled" icon={TrendingUp} tone="green" />
        {/* <MetricCard label="Owing" value={data.students.filter((s) => s.balance > 0).length} detail="Needs finance follow-up" icon={WalletCards} tone="red" /> */}
        <MetricCard label="Alumni" value={counts.alumni} detail="In graduate network" icon={Award} />
        <MetricCard label="Attendance · past 2 weeks" value={`${overallAttendance}%`} detail="All courses and students" icon={ClipboardCheck} tone={overallAttendance >= 80 ? "green" : "red"} />
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_.99fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Student register</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Recent learners</h3>
            </div>
            <button onClick={() => navigate("/admin/students")} className="text-sm font-bold text-slate-500">View all <ArrowRight className="ml-1 inline h-4 w-4" /></button>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Learner</th>
                  <th>Programme</th>
                  <th>Campus</th>
                  <th>Status</th>
                  <th>Attendance</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.students.slice(0, 5).map((s) =>
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar-small">{s.initials}</div>
                        <div>
                          <p className="font-semibold text-slate-950">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.studentNo}</p>
                        </div>
                      </div>
                    </td>
                    <td>{s.course}</td>
                    <td>{s.campus}</td>
                    <td>
                      <Pill tone={s.status === "Suspended" ? "red" : s.status === "Active" ? "green" : "slate"}>{s.status}</Pill>
                    </td>
                    <td>
                      <span className={s.attendance < 80 ? "font-bold text-red-600" : "text-slate-600"}>{s.attendance}%</span>
                    </td>
                    <td>
                      <button className="icon-btn" onClick={() => setConfirm(s)}><MoreHorizontal /></button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-5">
          <div className="portal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Needs attention</p>
                <h3 className="mt-2 font-display text-2xl text-slate-950">Absenteeism watch</h3>
              </div>
              <Pill tone="red">{absent.length} flagged</Pill>
            </div>
            <div className="mt-5 space-y-4">
              {absent.length
                ? absent.map((s) =>
                  <div key={s.id}>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-slate-950">{s.name}</span>
                      <span className="text-red-600">{s.attendance}%</span>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={s.attendance} />
                    </div>
                  </div>
                ) :
                <p className="text-sm text-slate-500">No learners are currently flagged.</p>
              }
            </div>
            <button onClick={() => navigate("/admin/attendance")} className="mt-5 text-sm font-bold text-slate-950">Open attendance register <ArrowRight className="ml-1 inline h-4 w-4" /></button>
          </div>
          <div className="portal-card">
            <p className="eyebrow">Announcements</p>
            <div className="mt-4 space-y-4">{data.announcements.slice(0, 3).map((a) =>
              <div key={a.id}>
                <p className="text-sm font-semibold text-slate-950">{a.title}</p>
                <p className="mt-1 text-xs text-slate-500">{a.date} · {a.audience}</p>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="dark-mini-card">
          <GraduationCap />
          <span><strong>{counts.completed}</strong><small>Ready to graduate</small></span>
        </div>
        <div className="dark-mini-card">
          <UserRound />
          <span><strong>{data.lecturers.filter((l) => l.status === "Active").length}</strong><small>Active lecturers</small></span>
        </div>
      </div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.3fr_.7fr]">
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Programme mix</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Students by course</h3>
            </div>
            <BarChart3 className="text-[#916e0a]" />
          </div>
          <div className="mt-6 space-y-4">
            {courseCounts.map((item) =>
              <div key={item.course}>
                <div className="flex justify-between gap-3 text-sm">
                  <span className="truncate font-semibold text-slate-950">{item.course}</span>
                  <strong>{item.count}</strong>
                </div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-[#D4AF37] transition-all" style={{ width: `${(item.count / maxCourseCount) * 100}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="portal-card">
          <p className="eyebrow">Student lifecycle</p>
          <h3 className="mt-2 font-display text-2xl text-slate-950">Active vs alumni</h3>
          <div className="mt-6 flex items-center gap-6">
            <div className="h-36 w-36 shrink-0 rounded-full" style={{ background: `conic-gradient(#D4AF37 0 ${activeShare}%, #172033 ${activeShare}% 100%)` }} />
            <div className="space-y-3 text-sm">
              <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#D4AF37]" />Active <strong className="ml-2">{counts.active}</strong></p>
              <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-[#172033]" />Alumni <strong className="ml-2">{counts.alumni}</strong></p>
              <p className="text-xs text-slate-500">{activeShare}% of active/alumni records are active.</p>
            </div>
          </div>
        </div>
      </div>
      {confirm &&
        <Confirm title="Remove learner from register?" body={`This will remove ${confirm.name} from the local demo register. This action cannot be undone.`} onCancel={() => setConfirm(null)} onConfirm={remove} loading={loading} />
      }
      {announcementOpen &&
        <Modal title="Create announcement" onClose={() => setAnnouncementOpen(false)}>
          <form className="mt-5 space-y-4" onSubmit={(e) => {
            e.preventDefault();
            setData((old) => ({
              ...old,
              announcements: [{
                id: crypto.randomUUID(),
                title: "New campus update",
                body: "An update has been published by the admin team.",
                date: new Date().toISOString().slice(0, 10),
                audience: "All students"
              },
              ...old.announcements]
            }));
            setAnnouncementOpen(false);
            toast.success("Announcement published.");
          }}>
            <label>Title
              <input className="field" required defaultValue="New campus update" />
            </label>
            <label>Announcement
              <textarea className="field min-h-[100px] py-3" required defaultValue="An update has been published by the admin team." />
            </label>
            <Button type="submit" className="w-full justify-center">Publish announcement <ArrowRight className="h-4 w-4" /></Button>
          </form>
        </Modal>
      }
    </PortalShell>
  );
}