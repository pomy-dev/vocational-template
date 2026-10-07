import { useState } from "react";
import type { AppData, DepartmentRecord } from "@/lib/types";
import { PortalShell } from "@/components/portal-shell";
import { PageHeading } from "@/components/page-heading";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import { toast } from "sonner";
import {
  Building2,
  GraduationCap,
  ShieldCheck,
  Plus
} from "lucide-react";
import { Field } from "@/components/field";
import { courses } from "@/lib/data"


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
                {courses.map((c, id) => (
                  <label className="check-option" key={id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(c.name)}
                      onChange={e =>
                        setSelected(s =>
                          e.target.checked ? [...s, c.name] : s.filter(v => v !== c.name)
                        )
                      }
                    />
                    {c.name}
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