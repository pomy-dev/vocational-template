import { useState } from "react";
import type { AppData, DepartmentRecord, AuditRecord } from "@/lib/types";
import { PortalShell } from "@/components/portal-shell";
import { PageHeading } from "@/components/page-heading";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { Pill } from "@/components/pill";
import { toast } from "sonner";
import {
  Building2,
  Users,
  GraduationCap,
  ClipboardCheck,
  WalletCards,
  ShieldCheck,
  Search,
  Printer,
  FileSpreadsheet,
  Plus,
  Bell,
  CircleDollarSign,
  ChartNoAxesCombined,
} from "lucide-react";

const courses = [
  "Electrical Engineering N1–N6",
  "Information Technology",
  "Business Management N4–N6",
  "Occupational Certificate: Bricklayer",
  "Health & Safety Officer",
];
const currency = (n: number) =>
  `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const printReport = () => window.print();
const exportCsv = (name: string, rows: (string | number)[][]) => {
  const csv = rows
    .map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};
const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block text-sm font-semibold text-slate-700">
    {label}
    {children}
  </label>
);

export function AdminDepartments({
  data,
  setData,
  navigate,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  navigate: (p: string) => void;
}) {
  const departments = data.departments || [];
  const [editing, setEditing] = useState<DepartmentRecord | null>(null);
  const [name, setName] = useState("");
  const [hod, setHod] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const edit = (d?: DepartmentRecord) => {
    setEditing(
      d || {
        id: "",
        name: "",
        code: "",
        hodId: "",
        courseNames: [],
        programmeNames: [],
        subjectNames: [],
        active: true,
      }
    );
    setName(d?.name || "");
    setHod(d?.hodId || "");
    setSelected(d?.courseNames || []);
  };
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hod) {
      toast.error("Designate HOD personnel before saving this department.");
      return;
    }
    const chosen = selected;
    const existing = departments.find(d => d.id === editing?.id);
    const record: DepartmentRecord = {
      id: editing?.id || crypto.randomUUID(),
      name,
      code:
        editing?.code ||
        name
          .trim()
          .split(/\s+/)
          .map(x => x[0])
          .join("")
          .toUpperCase()
          .slice(0, 5),
      hodId: hod,
      courseNames: chosen,
      programmeNames: chosen.filter(
        x => x.includes("Occupational") || x.includes("Certificate")
      ),
      subjectNames: Array.from(
        new Set(
          data.lecturers
            .filter(l => l.departmentId === editing?.id)
            .flatMap(l => l.subjects)
        )
      ),
      active: true,
    };
    setData(old => ({
      ...old,
      departments: existing
        ? departments.map(d => (d.id === record.id ? record : d))
        : [record, ...departments],
      lecturers: old.lecturers.map(l =>
        l.id === hod ? { ...l, departmentId: record.id } : l
      ),
    }));
    setEditing(null);
    toast.success("Department record saved and HOD allocated.");
  };
  return (
    <PortalShell role="Admin" active="/admin/departments" onNavigate={navigate}>
      <PageHeading
        eyebrow="Academic structure"
        title="Departments & HODs"
        body="Maintain department records, designate HOD personnel, and associate courses, programmes and subjects."
        actions={
          <Button onClick={() => edit()}>
            <Plus className="h-4 w-4" />
            Add department
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Departments"
          value={departments.length}
          detail="Academic units"
          icon={Building2}
        />
        <MetricCard
          label="HODs assigned"
          value={departments.filter(d => d.hodId).length}
          detail="Portal accounts linked"
          icon={ShieldCheck}
        />
        <MetricCard
          label="Courses allocated"
          value={new Set(departments.flatMap(d => d.courseNames)).size}
          detail="Across departments"
          icon={GraduationCap}
        />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {departments.map(d => (
          <section className="portal-card" key={d.id}>
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">{d.code} · Department</p>
                <h3 className="mt-2 font-display text-2xl">{d.name}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  HOD:{" "}
                  {data.lecturers.find(l => l.id === d.hodId)?.name ||
                    "Unassigned"}
                </p>
              </div>
              <Building2 className="text-[#916e0a]" />
            </div>
            <div className="mt-5">
              <p className="text-xs font-bold uppercase text-slate-400">
                Courses / programmes
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {d.courseNames.map(c => (
                  <span className="filter-chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs font-bold uppercase text-slate-400">
                Subjects
              </p>
              <p className="mt-2 text-sm text-slate-600">
                {d.subjectNames.join(" · ") ||
                  "Subjects inherit from course assignments"}
              </p>
            </div>
            <Button variant="light" className="mt-5" onClick={() => edit(d)}>
              Edit department
            </Button>
          </section>
        ))}
      </div>
      {editing && (
        <Modal
          title={editing.id ? "Edit department" : "Create department"}
          onClose={() => setEditing(null)}
        >
          <form onSubmit={save} className="mt-5 space-y-4">
            <Field label="Department name">
              <input
                className="field"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Field>
            <Field label="Department code">
              <input
                className="field"
                value={editing.code}
                onChange={e =>
                  setEditing({ ...editing, code: e.target.value.toUpperCase() })
                }
                required
              />
            </Field>
            <Field label="Head of department">
              <select
                className="field"
                value={hod}
                onChange={e => setHod(e.target.value)}
              >
                <option value="">Choose HOD personnel</option>
                {data.lecturers.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} · {l.employeeNo}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Courses and programmes">
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {courses.map(c => (
                  <label className="check-option" key={c}>
                    <input
                      type="checkbox"
                      checked={selected.includes(c)}
                      onChange={e =>
                        setSelected(s =>
                          e.target.checked ? [...s, c] : s.filter(v => v !== c)
                        )
                      }
                    />
                    {c}
                  </label>
                ))}
              </div>
            </Field>
            <div className="flex justify-end gap-2">
              <Button
                variant="light"
                type="button"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save department</Button>
            </div>
          </form>
        </Modal>
      )}
    </PortalShell>
  );
}

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
        body="Filter student, employee, attendance, performance, complaints and query data, then print or export a named report."
        actions={
          <>
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
          </>
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

export function HodAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [error, setError] = useState("");
  return (
    <div className="min-h-screen bg-slate-50 px-5 py-20">
      <div className="mx-auto max-w-md portal-card">
        <ShieldCheck className="text-[#916e0a]" />
        <p className="eyebrow mt-4">NSTC · Department leadership</p>
        <h1 className="mt-2 font-display text-3xl">HOD portal</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to review your department's students, staff and reports.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={e => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            if (
              f.get("email") === "hod@nstc.example" &&
              f.get("password") === "hod2026"
            ) {
              localStorage.setItem("nstc-hod-session", "active");
              onAuthenticated();
            } else setError("Demo login: hod@nstc.example / hod2026");
          }}
        >
          <Field label="Email">
            <input name="email" className="field" type="email" required />
          </Field>
          <Field label="Password">
            <input name="password" className="field" type="password" required />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full justify-center">
            Sign in to HOD portal
          </Button>
        </form>
        <p className="mt-5 text-xs text-slate-500">
          Demo credentials: hod@nstc.example · hod2026
        </p>
      </div>
    </div>
  );
}
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
  if (!auth) return <HodAuth onAuthenticated={() => setAuth(true)} />;
  const dept =
    (data.departments || []).find(
      d => d.id === data.lecturers.find(l => l.id === d.hodId)?.departmentId
    ) || data.departments?.[0];
  const dc = dept?.courseNames || courses.slice(0, 2);
  const students = data.students.filter(
    s =>
      dc.includes(s.course) && (course === "All courses" || s.course === course)
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
            {dc.map(c => (
              <option key={c}>{c}</option>
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

export function ItAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [e, setE] = useState("");
  return (
    <div className="min-h-screen bg-slate-50 px-5 py-20">
      <div className="mx-auto max-w-md portal-card">
        <ShieldCheck className="text-[#916e0a]" />
        <p className="eyebrow mt-4">Protected operations</p>
        <h1 className="mt-2 font-display text-3xl">IT Officer sign in</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={ev => {
            ev.preventDefault();
            const f = new FormData(ev.currentTarget);
            if (
              f.get("email") === "it@nstc.example" &&
              f.get("password") === "it2026"
            ) {
              localStorage.setItem("nstc-it-session", "active");
              onAuthenticated();
            } else setE("Demo login: it@nstc.example / it2026");
          }}
        >
          <Field label="Email">
            <input className="field" name="email" type="email" required />
          </Field>
          <Field label="Password">
            <input className="field" name="password" type="password" required />
          </Field>
          {e && <p className="text-sm text-red-600">{e}</p>}
          <Button className="w-full justify-center">Open IT operations</Button>
        </form>
        <p className="mt-5 text-xs text-slate-500">
          Demo credentials: it@nstc.example · it2026
        </p>
      </div>
    </div>
  );
}
export function ItPortal({
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
      () => localStorage.getItem("nstc-it-session") === "active"
    ),
    [q, setQ] = useState("");
  if (!auth) return <ItAuth onAuthenticated={() => setAuth(true)} />;
  const hits = [
    ...data.students.map(x => ({
      id: x.id,
      name: x.name,
      email: x.email,
      number: x.studentNo,
      status: x.status,
      kind: "Student",
    })),
    ...data.lecturers.map(x => ({
      id: x.id,
      name: x.name,
      email: x.email,
      number: x.employeeNo,
      status: x.status,
      kind: "Employee",
    })),
  ].filter(x =>
    `${x.name} ${x.email} ${x.number}`.toLowerCase().includes(q.toLowerCase())
  );
  const act = (id: string, kind: string, label: string) => {
    const audit: AuditRecord = {
      id: crypto.randomUUID(),
      entityId: id,
      entityType: kind,
      action: label,
      actor: "IT Officer · Kabelo Mokoena",
      date: new Date().toISOString().slice(0, 10),
      details: "Updated in local demo portal",
    };
    setData(old => ({ ...old, auditLog: [audit, ...(old.auditLog || [])] }));
    toast.success(`${label} recorded in audit log.`);
  };
  const toggle = (r: (typeof hits)[number]) => {
    if (r.kind === "Student") {
      const s = data.students.find(x => x.id === r.id)!;
      const status = s.status === "Suspended" ? "Active" : "Suspended";
      setData(old => ({
        ...old,
        students: old.students.map(x => (x.id === r.id ? { ...x, status } : x)),
      }));
      act(r.id, r.kind, status);
    } else {
      const s = data.lecturers.find(x => x.id === r.id)!;
      const status = s.status === "Active" ? "Disabled" : "Active";
      setData(old => ({
        ...old,
        lecturers: old.lecturers.map(x =>
          x.id === r.id ? { ...x, status } : x
        ),
      }));
      act(r.id, r.kind, status);
    }
  };
  return (
    <PortalShell role="IT Officer" active={path} onNavigate={navigate}>
      <PageHeading
        eyebrow="Identity, access & audit"
        title="IT operations"
        body="Search user accounts, record password reset requests, enable or disable status and review an audit trail."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="User accounts"
          value={data.students.length + data.lecturers.length}
          detail="Students and employees"
          icon={Users}
        />
        <MetricCard
          label="Audit events"
          value={data.auditLog?.length || 0}
          detail="Recorded demo changes"
          icon={ShieldCheck}
        />
        <MetricCard
          label="Departments"
          value={data.departments?.length || 0}
          detail="Unique codes available"
          icon={Building2}
        />
      </div>
      <div className="portal-card mt-5">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
          <input
            className="field pl-10"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search name, email, student number or employee number"
          />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Type</th>
                <th>Unique ID</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {hits.map(u => (
                <tr key={u.id}>
                  <td>
                    {u.name}
                    <small className="block text-slate-400">{u.email}</small>
                  </td>
                  <td>{u.kind}</td>
                  <td>{u.number}</td>
                  <td>
                    <Pill tone={u.status === "Active" ? "green" : "red"}>
                      {u.status}
                    </Pill>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="filter-chip"
                        onClick={() => {
                          const password = `NSTC-${Math.random().toString(36).slice(2, 8).toUpperCase()}!`;
                          setData(old => ({
                            ...old,
                            students: old.students.map(s => s.id === u.id && u.kind === "Student" ? { ...s, temporaryPassword: password, mustResetPassword: true } : s),
                            lecturers: old.lecturers.map(l => l.id === u.id && u.kind === "Employee" ? { ...l, temporaryPassword: password } : l),
                          }));
                          act(u.id, u.kind, "Temporary password reset generated");
                          toast.success(`Temporary demo password: ${password}`);
                        }}
                      >
                        Reset password
                      </button>
                      <button className="filter-chip" onClick={() => toggle(u)}>
                        Enable / disable
                      </button>
                      <button
                        className="filter-chip"
                        onClick={() => {
                          const existing = data.userPermissions?.find(
                            p =>
                              p.userId === u.id &&
                              p.permissionKey === "reports.view"
                          );
                          const granted = !existing?.granted;
                          setData(old => ({
                            ...old,
                            userPermissions: [
                              ...(old.userPermissions || []).filter(
                                p =>
                                  !(
                                    p.userId === u.id &&
                                    p.permissionKey === "reports.view"
                                  )
                              ),
                              {
                                userId: u.id,
                                permissionKey: "reports.view",
                                granted,
                                changedBy: "IT Officer · Kabelo Mokoena",
                                changedAt: new Date().toISOString(),
                              },
                            ],
                          }));
                          act(
                            u.id,
                            u.kind,
                            `${granted ? "Granted" : "Revoked"} reports.view permission`
                          );
                        }}
                      >
                        Toggle report access
                      </button>
                      {u.kind === "Student" && (
                        <button
                          className="filter-chip"
                          onClick={() => {
                            const number = `NSTC-EX-${new Date().getFullYear()}-${u.number.replace(/\D/g, "").slice(-5).padStart(5, "0")}`;
                            setData(old => ({
                              ...old,
                              students: old.students.map(s =>
                                s.id === u.id
                                  ? { ...s, examinationNumber: number }
                                  : s
                              ),
                            }));
                            act(u.id, u.kind, `Generated exam ID ${number}`);
                            toast.success(`Examination number: ${number}`);
                          }}
                        >
                          Generate exam ID
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="portal-card mt-5">
        <h3 className="font-display text-2xl">Department ID register</h3>
        <p className="mt-2 text-sm text-slate-500">
          Unique codes generated for each department (demo).
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(data.departments || []).map(d => (
            <div
              className="flex items-center justify-between rounded-xl bg-slate-50 p-4"
              key={d.id}
            >
              <span>{d.name}</span>
              <strong className="font-mono">{d.code}</strong>
            </div>
          ))}
        </div>
        <Button
          className="mt-4"
          variant="light"
          onClick={() => {
            exportCsv("department-id-register", [
              ["Department", "Unique ID"],
              ...(data.departments || []).map(d => [d.name, d.code]),
            ]);
            act(
              "departments",
              "Department",
              "Generated department ID register"
            );
          }}
        >
          <Printer className="h-4 w-4" />
          Generate / print IDs
        </Button>
      </div>
      <div className="portal-card mt-5">
        <h3 className="font-display text-2xl">User change history</h3>
        {(data.auditLog || []).map(a => (
          <div
            className="mt-3 flex flex-wrap justify-between gap-2 border-b py-3 text-sm"
            key={a.id}
          >
            <span>
              <b>{a.action}</b> · {a.entityType} · {a.details}
            </span>
            <span className="text-slate-500">
              {a.date} · {a.actor}
            </span>
          </div>
        ))}
        {!data.auditLog?.length && (
          <p className="mt-3 text-sm text-slate-500">
            Account changes will appear here.
          </p>
        )}
      </div>
      <Button
        variant="light"
        className="mt-5"
        onClick={() => {
          localStorage.removeItem("nstc-it-session");
          setAuth(false);
        }}
      >
        Sign out
      </Button>
    </PortalShell>
  );
}

function AccountantWorkspace({
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
  const [filter, setFilter] = useState("All courses"),
    [selected, setSelected] = useState<string[]>([]),
    [email, setEmail] = useState(
      "Payment reminder: your next tuition instalment is due soon. Please contact the finance office if you need assistance."
    );
  const fees = data.feePlans || [];
  const ledger = data.ledgerEntries || [];
  const filtered = data.students.filter(
    s => filter === "All courses" || s.course === filter
  );
  const paid = ledger
    .filter(x => x.kind === "Payment")
    .reduce((a, x) => a + x.amount, 0);
  const owed = filtered.reduce((a, s) => a + s.balance, 0);
  const due = filtered.filter(s => s.balance > 0);
  const reminders = filtered.filter(s => selected.includes(s.id));
  return (
    <PortalShell role="Accountant" active="/accounting" onNavigate={navigate}>
      <PageHeading
        eyebrow="Finance office"
        title="Student accounts & fee ledger"
        body="Allocate course fees and payment intervals, record transactions, review balances and prepare student statements. Prepared by Thandi Maseko · Accountant · Demo data."
        actions={
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print finance report
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Accumulated payments"
          value={currency(paid)}
          detail="Recorded ledger entries"
          icon={CircleDollarSign}
        />
        <MetricCard
          label="Outstanding balance"
          value={currency(owed)}
          detail="Filtered student accounts"
          icon={WalletCards}
        />
        <MetricCard
          label="Due accounts"
          value={due.length}
          detail="Students with amount owed"
          icon={Bell}
        />
        <MetricCard
          label="Recent payments"
          value={ledger.filter(x => x.kind === "Payment").slice(0, 3).length}
          detail="Latest ledger entries"
          icon={ClipboardCheck}
        />
      </div>
      <section className="portal-card mt-5">
        <p className="eyebrow">Course fee schedule</p>
        <h3 className="mt-2 font-display text-2xl">Fees & payment intervals</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Total fee</th>
                <th>Intervals</th>
                <th>Payment options</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(f => (
                <tr key={f.course}>
                  <td>{f.course}</td>
                  <td>{currency(f.total)}</td>
                  <td>{f.intervals.join(" · ")}</td>
                  <td>{f.options.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <FeePlanEditor data={data} setData={setData} />
      <div className="portal-card mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Student financial statements</p>
            <h3 className="mt-2 font-display text-2xl">Ledger & balances</h3>
          </div>
          <select
            className="field max-w-xs"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option>All courses</option>
            {Array.from(new Set(data.students.map(s => s.course))).map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Student</th>
                <th>Course</th>
                <th>Fees</th>
                <th>Paid</th>
                <th>Owed</th>
                <th>Statement</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const entries = ledger.filter(x => x.studentId === s.id);
                const p = entries
                  .filter(x => x.kind === "Payment")
                  .reduce((a, x) => a + x.amount, 0);
                const f =
                  fees.find(x => x.course === s.course)?.total || s.balance + p;
                return (
                  <tr key={s.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(s.id)}
                        onChange={e =>
                          setSelected(v =>
                            e.target.checked
                              ? [...v, s.id]
                              : v.filter(x => x !== s.id)
                          )
                        }
                      />
                    </td>
                    <td>
                      {s.name}
                      <small className="block text-slate-400">
                        {s.studentNo}
                      </small>
                    </td>
                    <td>{s.course}</td>
                    <td>{currency(f)}</td>
                    <td>{currency(p)}</td>
                    <td>{currency(s.balance)}</td>
                    <td>
                      <button
                        className="filter-chip"
                        onClick={() => {
                          exportCsv(`statement-${s.studentNo}`, [
                            ["Financial statement", s.name],
                            ["Prepared by", "NSTC Accountant · Thandi Maseko"],
                            ["Date", new Date().toISOString().slice(0, 10)],
                            ["Transaction", "Date", "Amount", "Reference"],
                            ...entries.map(x => [
                              x.label,
                              x.date,
                              x.amount,
                              x.reference,
                            ]),
                            ["Amount owed", s.balance],
                          ]);
                        }}
                      >
                        Download / print
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h4 className="mt-6 font-semibold">Recent transactions</h4>
        {ledger.slice(0, 8).map(x => (
          <p className="mt-2 border-b py-2 text-sm" key={x.id}>
            {x.date} · {x.studentName} · {x.label} · {currency(x.amount)}{" "}
            <span className="text-slate-400">{x.reference}</span>
          </p>
        ))}
      </div>
      <PaymentRecorder data={data} setData={setData} />
      <div className="portal-card mt-5">
        <p className="eyebrow">Due-date notifications</p>
        <h3 className="mt-2 font-display text-2xl">Payment reminders</h3>
        <p className="mt-2 text-sm text-slate-500">
          Select students above, then prepare individual emails or one bulk
          message. Demo only; no email is sent.
        </p>
        <textarea
          className="field mt-4 min-h-24"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Button
          className="mt-3"
          onClick={() => {
            if (!reminders.length) {
              toast.error("Select at least one account first.");
              return;
            }
            setData(old => ({
              ...old,
              financeNotices: [
                ...(old.financeNotices || []),
                ...reminders.map(s => ({
                  studentId: s.id,
                  studentName: s.name,
                  email: s.email,
                  message: email,
                  date: new Date().toISOString().slice(0, 10),
                })),
              ],
            }));
            toast.success(
              `Prepared reminder for ${reminders.length} selected account(s); saved to demo notices.`
            );
          }}
        >
          <Bell className="h-4 w-4" />
          Prepare email to selected ({reminders.length})
        </Button>
      </div>
    </PortalShell>
  );
}

export function AccountantAuth({
  onAuthenticated,
}: {
  onAuthenticated: () => void;
}) {
  const [error, setError] = useState("");
  return (
    <div className="min-h-screen bg-slate-50 px-5 py-20">
      <div className="mx-auto max-w-md portal-card">
        <WalletCards className="text-[#916e0a]" />
        <p className="eyebrow mt-4">NSTC · Finance office</p>
        <h1 className="mt-2 font-display text-3xl">Accountant portal</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={e => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            if (
              f.get("email") === "accounts@nstc.example" &&
              f.get("password") === "accounts2026"
            ) {
              localStorage.setItem("nstc-accounting-session", "active");
              onAuthenticated();
            } else setError("Demo login: accounts@nstc.example / accounts2026");
          }}
        >
          <Field label="Email">
            <input name="email" className="field" type="email" required />
          </Field>
          <Field label="Password">
            <input name="password" className="field" type="password" required />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full justify-center">Sign in to finance</Button>
        </form>
        <p className="mt-5 text-xs text-slate-500">
          Demo credentials: accounts@nstc.example · accounts2026
        </p>
      </div>
    </div>
  );
}
export function AccountantPortal(props: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (p: string) => void;
}) {
  const [auth, setAuth] = useState(
    () => localStorage.getItem("nstc-accounting-session") === "active"
  );
  if (!auth) return <AccountantAuth onAuthenticated={() => setAuth(true)} />;
  return <AccountantWorkspace {...props} />;
}

function FeePlanEditor({
  data,
  setData,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}) {
  const [course, setCourse] = useState(
    data.feePlans?.[0]?.course || courses[0]
  );
  const current = data.feePlans?.find(x => x.course === course);
  const [total, setTotal] = useState(String(current?.total || 0));
  const [intervals, setIntervals] = useState(
    current?.intervals.join(", ") || "Monthly, Per term"
  );
  return (
    <section className="portal-card mt-5">
      <p className="eyebrow">Accountant controls</p>
      <h3 className="mt-2 font-display text-2xl">
        Update course fees & instalment intervals
      </h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Field label="Course">
          <select
            className="field"
            value={course}
            onChange={e => {
              setCourse(e.target.value);
              const plan = data.feePlans?.find(
                x => x.course === e.target.value
              );
              setTotal(String(plan?.total || 0));
              setIntervals(plan?.intervals.join(", ") || "Monthly, Per term");
            }}
          >
            {courses.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Total course fee (R)">
          <input
            className="field"
            type="number"
            min="0"
            value={total}
            onChange={e => setTotal(e.target.value)}
          />
        </Field>
        <Field label="Payment intervals (comma separated)">
          <input
            className="field"
            value={intervals}
            onChange={e => setIntervals(e.target.value)}
          />
        </Field>
      </div>
      <Button
        className="mt-3"
        onClick={() => {
          const plan = {
            course,
            total: Number(total),
            intervals: intervals
              .split(",")
              .map(x => x.trim())
              .filter(Boolean),
            options: ["EFT", "Card", "Cash office"],
          };
          setData(old => ({
            ...old,
            feePlans: (old.feePlans || []).some(x => x.course === course)
              ? old.feePlans!.map(x => (x.course === course ? plan : x))
              : [...(old.feePlans || []), plan],
          }));
          toast.success("Course fee plan updated in the demo ledger.");
        }}
      >
        Save fee plan
      </Button>
    </section>
  );
}
function PaymentRecorder({
  data,
  setData,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}) {
  const [studentId, setStudentId] = useState(data.students[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  return (
    <section className="portal-card mt-5">
      <p className="eyebrow">Transaction entry</p>
      <h3 className="mt-2 font-display text-2xl">Record a student payment</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Field label="Student">
          <select
            className="field"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
          >
            {data.students.map(s => (
              <option value={s.id} key={s.id}>
                {s.name} · {s.studentNo}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Amount (R)">
          <input
            className="field"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </Field>
        <Field label="Receipt / transaction reference">
          <input
            className="field"
            value={reference}
            onChange={e => setReference(e.target.value)}
            placeholder="Receipt number"
          />
        </Field>
      </div>
      <Button
        className="mt-3"
        onClick={() => {
          const student = data.students.find(x => x.id === studentId);
          const value = Number(amount);
          if (!student || value <= 0) {
            toast.error(
              "Choose a student and enter a positive payment amount."
            );
            return;
          }
          const row = {
            id: crypto.randomUUID(),
            studentId,
            studentName: student.name,
            kind: "Payment" as const,
            label: "Tuition payment",
            amount: value,
            date: new Date().toISOString().slice(0, 10),
            reference: reference || `DEMO-${Date.now()}`,
          };
          setData(old => ({
            ...old,
            ledgerEntries: [row, ...(old.ledgerEntries || [])],
            students: old.students.map(s =>
              s.id === studentId
                ? { ...s, balance: Math.max(0, s.balance - value) }
                : s
            ),
          }));
          setAmount("");
          setReference("");
          toast.success("Payment recorded; student balance updated.");
        }}
      >
        Post payment
      </Button>
    </section>
  );
}
