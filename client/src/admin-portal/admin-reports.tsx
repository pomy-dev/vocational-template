import { useState } from "react";
import type { AppData } from "@/lib/types";
import { PortalShell } from "@/components/portal-shell";
import { PageHeading } from "@/components/page-heading";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/button";
import {
  Users,
  ClipboardCheck,
  Printer,
  FileSpreadsheet,
  Bell,
  ChartNoAxesCombined,
} from "lucide-react";
import { exportCsv } from "@/lib/utils";
import { Field } from "@/components/field";
import { printReport } from "@/lib/utils";

export function AdminReports({
  data,
  navigate,
}: {
  data: AppData;
  navigate: (p: string) => void;
}) {
  const [course, setCourse] = useState("All courses"),
    [status, setStatus] = useState("All statuses"),
    [from, setFrom] = useState("2026-01-01"),
    [to, setTo] = useState("2026-12-31");
  const students = data.students.filter(
    s =>
      (course === "All courses" || s.course === course) &&
      (status === "All statuses" || s.status === status) &&
      s.startDate >= from &&
      s.startDate <= to
  );
  const complaints = data.complaints.filter(
    c => c.date >= from && c.date <= to
  );
  const average = students.length
    ? Math.round(
      students.reduce((a, s) => a + s.termAverage, 0) / students.length
    )
    : 0;
  const att = students.length
    ? Math.round(
      students.reduce((a, s) => a + s.attendance, 0) / students.length
    )
    : 0;
  const who = "NSTC Admin · Nomsa Dlamini";
  return (
    <PortalShell role="Admin" active="/admin/reports" onNavigate={navigate}>
      <PageHeading
        eyebrow="Analytics & exports"
        title="Institutional reports"
        body="Make reports and analysis for decision making."
        actions={
          <div className=" flex flex-wrap gap-3">
            <Button
              variant="light"
              onClick={() =>
                exportCsv("nstc-student-report", [
                  ["Report owner", who],
                  [
                    "Student number",
                    "Name",
                    "Course",
                    "Status",
                    "Attendance",
                    "Average",
                    "Enrollment date",
                  ],
                  ...students.map(s => [
                    s.studentNo,
                    s.name,
                    s.course,
                    s.status,
                    s.attendance,
                    s.termAverage,
                    s.startDate,
                  ]),
                ])
              }
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export CSV
            </Button>
            <Button onClick={printReport}>
              <Printer className="h-4 w-4" />
              Print report
            </Button>
          </div>
        }
      />
      <div className="portal-card grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Course">
          <select
            className="field"
            value={course}
            onChange={e => setCourse(e.target.value)}
          >
            <option>All courses</option>
            {Array.from(new Set(data.students.map(s => s.course))).map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Student status">
          <select
            className="field"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {["All statuses", "Active", "Suspended", "Completed", "Alumni"].map(
              x => (
                <option key={x}>{x}</option>
              )
            )}
          </select>
        </Field>
        <Field label="From">
          <input
            className="field"
            type="date"
            value={from}
            onChange={e => setFrom(e.target.value)}
          />
        </Field>
        <Field label="To">
          <input
            className="field"
            type="date"
            value={to}
            onChange={e => setTo(e.target.value)}
          />
        </Field>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Filtered students"
          value={students.length}
          detail="Enrollment records"
          icon={Users}
        />
        <MetricCard
          label="Average performance"
          value={`${average}%`}
          detail="Filtered cohort"
          icon={ChartNoAxesCombined}
        />
        <MetricCard
          label="Aggregated attendance"
          value={`${att}%`}
          detail="Selected date / course scope"
          icon={ClipboardCheck}
        />
        <MetricCard
          label="Complaints & queries"
          value={complaints.length}
          detail="Within selected dates"
          icon={Bell}
        />
      </div>
      <div className="portal-card mt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">
              Student roster · {from} to {to}
            </p>
            <h3 className="mt-2 font-display text-2xl">
              Enrollment, results & graduation register
            </h3>
          </div>
          <button className="filter-chip" onClick={() => printReport()}>
            <Printer className="mr-1 inline h-4 w-4" />
            Print
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Prepared by {who} · Demo data
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student #</th>
                <th>Name</th>
                <th>Course</th>
                <th>Status</th>
                <th>Attendance</th>
                <th>Average</th>
                <th>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.studentNo}</td>
                  <td>{s.name}</td>
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
        <h3 className="mt-7 font-display text-xl">
          Employees & support queries
        </h3>
        <div className="mt-3 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Status</th>
                <th>Query / complaint</th>
                <th>Date</th>
                <th>State</th>
              </tr>
            </thead>
            <tbody>
              {data.lecturers.map(l => {
                const c = data.complaints.find(x => x.email === l.email);
                return (
                  <tr key={l.id}>
                    <td>{l.name}</td>
                    <td>
                      {data.departments?.find(d => d.id === l.departmentId)
                        ?.name || "—"}
                    </td>
                    <td>{l.status}</td>
                    <td>{c?.subject || "No query"}</td>
                    <td>{c?.date || "—"}</td>
                    <td>{c?.status || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
}