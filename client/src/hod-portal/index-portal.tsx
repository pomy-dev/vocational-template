import { useState } from "react";
import type { AppData } from "@/lib/types";
import { PortalShell } from "@/components/portal-shell";
import { PageHeading } from "@/components/page-heading";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/button";
import { toast } from "sonner";
import {
  Building2,
  Users,
  GraduationCap,
  ClipboardCheck,
  Printer
} from "lucide-react";
import { HodAuth } from "./hod-auth";

export function HodPortal({
  data,
  setData,
  path,
  navigate,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (p: string) => void;
}) {

  const [auth, setAuth] = useState(
    () => localStorage.getItem("nstc-hod-session") === "active"
  ),
    [course, setCourse] = useState("All courses"),
    [msg, setMsg] = useState("");

  if (!auth)
    return (
      <HodAuth
        onAuthenticated={() => {
          setAuth(true);
          navigate("/hod");
        }}
      />
    );

  const dept =
    (data.departments || []).find(
      d => d.id === data.lecturers.find(l => l.id === d.hodId)?.departmentId
    ) || data.departments?.[0];
  // const dc = dept?.courseNames || courses.slice(0, 2);
  const dc = dept?.courseNames;

  const students = data.students.filter(
    s =>
      dc?.includes(s.course) && (course === "All courses" || s.course === course)
  );
  const staff = data.lecturers.filter(l => l.departmentId === dept?.id);

  return (
    <PortalShell role="HOD" active={path} onNavigate={navigate}>
      <PageHeading
        eyebrow={`Head of department · ${dept?.name || "Department"}`}
        title="Department overview"
        body="Monitor assigned learners, employee activity, attendance, results and department communications. Prepared by Siyabonga Radebe · HOD · Demo data."
        actions={
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print department report
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Students"
          value={students.length}
          detail="In department courses"
          icon={Users}
        />
        <MetricCard
          label="Employees"
          value={staff.length}
          detail="Department staff"
          icon={Building2}
        />
        <MetricCard
          label="Mean performance"
          value={`${students.length ? Math.round(students.reduce((a, s) => a + s.termAverage, 0) / students.length) : 0}%`}
          detail="Current term"
          icon={GraduationCap}
        />
        <MetricCard
          label="Mean attendance"
          value={`${students.length ? Math.round(students.reduce((a, s) => a + s.attendance, 0) / students.length) : 0}%`}
          detail="Aggregated"
          icon={ClipboardCheck}
        />
      </div>
      <div className="portal-card mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-2xl">Department students</h3>
          <select
            className="field max-w-xs"
            value={course}
            onChange={e => setCourse(e.target.value)}
          >
            <option>All courses</option>
            {dc?.map(c => (
              <option key={c.toString()}>{c.toString()}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Status</th>
                <th>Attendance</th>
                <th>Performance</th>
                <th>Start date</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>
                    {s.name} · {s.studentNo}
                  </td>
                  <td>{s.course}</td>
                  <td>{s.status}</td>
                  <td>{s.attendance}%</td>
                  <td>{s.termAverage}%</td>
                  <td>{s.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="portal-card">
          <p className="eyebrow">Department employees</p>
          <h3 className="mt-2 font-display text-2xl">Staff directory</h3>
          {staff.map(s => (
            <p className="mt-3 border-b py-2 text-sm" key={s.id}>
              <b>{s.name}</b> · {s.profession || "Employee"} · {s.status}
            </p>
          ))}
        </section>
        <section className="portal-card">
          <p className="eyebrow">Communication</p>
          <h3 className="mt-2 font-display text-2xl">
            Announcements & queries
          </h3>
          <textarea
            className="field mt-4 min-h-24"
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="Write a department announcement or query for Admin..."
          />
          <Button
            className="mt-3"
            onClick={() => {
              if (!msg.trim()) return;
              setData(old => ({
                ...old,
                announcements: [
                  {
                    id: crypto.randomUUID(),
                    title: "Department update",
                    body: msg,
                    date: new Date().toISOString().slice(0, 10),
                    audience: dept?.name || "Department",
                  },
                  ...old.announcements,
                ],
              }));
              setMsg("");
              toast.success("Department notice recorded in the demo feed.");
            }}
          >
            Send department notice
          </Button>
          <p className="mt-4 text-xs text-slate-500">
            Notices are saved locally; cross-department routing and email
            require a connected service.
          </p>
        </section>
      </div>
      <Button
        variant="light"
        className="mt-5"
        onClick={() => {
          localStorage.removeItem("nstc-hod-session");
          setAuth(false);
        }}
      >
        Sign out
      </Button>
    </PortalShell>
  );
}