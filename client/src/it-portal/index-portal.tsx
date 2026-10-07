import { useState } from "react";
import type { AppData, AuditRecord } from "@/lib/types";
import { PortalShell } from "@/components/portal-shell";
import { PageHeading } from "@/components/page-heading";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/button";
import { Pill } from "@/components/pill";
import { toast } from "sonner";
import {
  Building2,
  Users,
  ShieldCheck,
  Search,
  Printer
} from "lucide-react";
import { exportCsv } from "@/lib/utils";
import { ItAuth } from "./it-auth";

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
  if (!auth)
    return (
      <ItAuth
        onAuthenticated={() => {
          setAuth(true);
          navigate("/it");
        }}
      />
    );
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