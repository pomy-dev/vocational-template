import { useState, useRef } from "react";
import type { FormEvent } from "react";
import { AppData } from "@/lib/types";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import { PortalShell } from "@/components/portal-shell";
import { LecturerRecord } from "@/lib/types";
import { courses } from "@/lib/data";
import { toast } from "sonner";
import { initials } from "@/const";
import { Plus, Users, ArrowRight, Check } from "lucide-react";
import { Pill } from "@/components/pill";
import { PageHeading } from "@/components/page-heading";

export function AdminLecturers({
  data,
  setData,
  navigate,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  navigate: (path: string) => void;
}) {
  const blank: LecturerRecord = {
    id: "",
    name: "",
    email: "",
    phone: "",
    employeeNo: "",
    campus: "Middelburg",
    courses: [],
    subjects: [],
    status: "Active",
    employeeType: "Permanent",
    profession: "",
    bankAccount: "",
    departmentId: "",
  };
  const [editing, setEditing] = useState<LecturerRecord | null>(null);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  const [notice, setNotice] = useState<LecturerRecord | null>(null);
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<LecturerRecord>(blank);
  const [courseSelections, setCourseSelections] = useState<string[]>([]);
  const [subjectSelections, setSubjectSelections] = useState<string[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const list = data.lecturers.filter(l =>
    `${l.name} ${l.email} ${l.employeeNo} ${l.profession || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );
  const selectedCourseObjects = courses.filter(c =>
    courseSelections.includes(c.name)
  );
  const availableSubjects = Array.from(
    new Set(selectedCourseObjects.flatMap(c => c.subjects.map(sub => sub.name)))
  );
  const openEditor = (record: LecturerRecord) => {
    setDraft(record);
    setCourseSelections(record.courses);
    setSubjectSelections(record.subjects);
    setStep(0);
    setErrors([]);
    setEditing(record);
  };
  const updateDraft = (key: keyof LecturerRecord, value: string) =>
    setDraft(old => ({ ...old, [key]: value }));

  const validateStep = (index: number) => {
    const next: string[] = [];
    if (index === 0) {
      if (!draft.name.trim()) next.push("Full name is required.");
      if (!draft.employeeNo.trim()) next.push("Employee number is required.");
      if (!draft.profession?.trim()) next.push("Profession is required.");
      const file = formRef.current?.elements.namedItem(
        "cv"
      ) as HTMLInputElement | null;
      if (!draft.id && !file?.files?.length)
        next.push("Upload a CV document before continuing.");
    }
    if (index === 1) {
      if (
        !draft.email.trim() ||
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.email)
      )
        next.push("Enter a valid employee email address.");
      if (!draft.phone.trim()) next.push("Phone number is required.");
      if (!draft.employeeType) next.push("Choose an employment type.");
      if (!draft.departmentId)
        next.push("Allocate this employee to a department.");
    }
    if (index === 2) {
      if (courseSelections.length && !subjectSelections.length)
        next.push("Select at least one subject for the selected course(s).");
    }
    setErrors(next);
    return next.length === 0;
  };
  const nextStep = () => {
    if (validateStep(step)) setStep(value => Math.min(2, value + 1));
  };

  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step !== 2 || !validateStep(0) || !validateStep(1) || !validateStep(2))
      return;
    const f = new FormData(e.currentTarget);
    const cvDoc = f.get("cv");
    const password = `NSTC-${Math.random().toString(36).slice(2, 8).toUpperCase()}!`;
    const next: LecturerRecord = {
      ...draft,
      id: draft.id || crypto.randomUUID(),
      courses: courseSelections,
      cv: cvDoc instanceof File && cvDoc.name ? cvDoc : draft.cv,
      subjects: subjectSelections,
      temporaryPassword: password,
    };
    setData(old => ({
      ...old,
      lecturers: draft.id
        ? old.lecturers.map(l => (l.id === draft.id ? next : l))
        : [next, ...old.lecturers],
    }));
    setEditing(null);
    setErrors([]);
    setTemporaryPassword(password);
    toast.success("Employee account created with a temporary password.");
  };

  const updateStatus = (status: LecturerRecord["status"]) => {
    if (!notice) return;
    const text =
      (document.getElementById("lecturer-notice") as HTMLTextAreaElement)
        ?.value || "Status changed by the NSTC admin team.";
    setData(old => ({
      ...old,
      lecturers: old.lecturers.map(l =>
        l.id === notice.id ? { ...l, status, notice: text } : l
      ),
    }));
    setNotice(null);
    toast.success(`${status} notice drafted for ${notice.email}.`);
  };

  return (
    <PortalShell role="Admin" active="/admin/lecturers" onNavigate={navigate}>
      <PageHeading
        eyebrow="People & permissions"
        title="Manage employees"
        body="Create employee accounts, record particulars and assign teaching courses where applicable."
        actions={
          <Button onClick={() => openEditor(blank)}>
            <Plus className="h-4 w-4" /> Create employee
          </Button>
        }
      />
      <div className="portal-card">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="eyebrow">Employee directory</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">
              Staff accounts
            </h3>
          </div>
          <input
            className="field mt-0 max-w-sm"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name, email, profession or employee no."
          />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map(l => (
            <details className="employee-card" key={l.id}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="avatar-small">{initials(l.name)}</div>
                    <div>
                      <p className="font-semibold text-slate-950">{l.name}</p>
                      <p className="text-xs text-slate-500">
                        {l.employeeNo} · {l.profession || "Employee"}
                      </p>
                    </div>
                  </div>
                </div>
                <Pill tone={l.status === "Active" ? "green" : "red"}>
                  {l.status}
                </Pill>
              </summary>
              <div className="mt-5 border-t border-slate-100 pt-4">
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <p>
                    <span className="block text-xs text-slate-400">Email</span>
                    <strong>{l.email}</strong>
                  </p>
                  <p>
                    <span className="block text-xs text-slate-400">Phone</span>
                    <strong>{l.phone}</strong>
                  </p>
                  <p>
                    <span className="block text-xs text-slate-400">Campus</span>
                    <strong>{l.campus}</strong>
                  </p>
                  <p>
                    <span className="block text-xs text-slate-400">
                      Employment
                    </span>
                    <strong>{l.employeeType || "Permanent"}</strong>
                  </p>
                  <p>
                    <span className="block text-xs text-slate-400">
                      Department
                    </span>
                    <strong>
                      {data.departments?.find(d => d.id === l.departmentId)
                        ?.name || "Unallocated"}
                    </strong>
                  </p>
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Courses
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {l.courses.join(" · ") || "No teaching allocation"}
                </p>
                <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Subjects
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  {l.subjects.join(" · ") || "No subjects assigned"}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button className="filter-chip" onClick={() => openEditor(l)}>
                    Edit
                  </button>
                  <button className="filter-chip" onClick={() => setNotice(l)}>
                    {l.status === "Active"
                      ? "Disable / remove"
                      : "Draft notice"}
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
        {!list.length && (
          <div className="empty-state">
            <Users />
            <h3>No employees found</h3>
            <p>Try a different search term.</p>
          </div>
        )}
      </div>
      {editing && (
        <Modal
          title={draft.id ? "Edit employee account" : "Create employee account"}
          onClose={() => setEditing(null)}
        >
          <div className="mt-5 flex gap-2 border-b border-slate-100 pb-4">
            {["Demographics", "Account", "Courses & subjects"].map(
              (label, index) => (
                <button
                  type="button"
                  key={label}
                  className={`filter-chip ${step === index ? "active" : ""}`}
                  onClick={() => index <= step && setStep(index)}
                >
                  {index + 1}. {label}
                </button>
              )
            )}
          </div>
          <form ref={formRef} onSubmit={save} className="mt-5">
            <div
              className={step === 0 ? "grid gap-4 md:grid-cols-2" : "hidden"}
            >
              <label>
                Full name
                <input
                  className="field"
                  value={draft.name}
                  onChange={e => updateDraft("name", e.target.value)}
                />
              </label>
              <label>
                Employee number
                <input
                  className="field"
                  value={draft.employeeNo}
                  onChange={e => updateDraft("employeeNo", e.target.value)}
                />
              </label>
              <label>
                Profession
                <input
                  className="field"
                  value={draft.profession || ""}
                  onChange={e => updateDraft("profession", e.target.value)}
                  placeholder="e.g. Lecturer, Finance Officer"
                />
              </label>
              <label>
                CV document
                <input
                  type="file"
                  name="cv"
                  className="field"
                  accept=".pdf,.doc,.docx"
                />
              </label>
            </div>
            <div
              className={step === 1 ? "grid gap-4 md:grid-cols-2" : "hidden"}
            >
              <label>
                Email address
                <input
                  className="field"
                  type="email"
                  value={draft.email}
                  onChange={e => updateDraft("email", e.target.value)}
                />
              </label>
              <label>
                Phone
                <input
                  className="field"
                  value={draft.phone}
                  onChange={e => updateDraft("phone", e.target.value)}
                />
              </label>
              <label>
                Bank account
                <input
                  className="field"
                  value={draft.bankAccount || ""}
                  onChange={e => updateDraft("bankAccount", e.target.value)}
                  placeholder="Account number / payroll reference"
                />
              </label>
              <label>
                Department allocation
                <select
                  className="field"
                  value={draft.departmentId || ""}
                  onChange={e => updateDraft("departmentId", e.target.value)}
                  required
                >
                  <option value="">Select a department</option>
                  {(data.departments || []).map(department => (
                    <option value={department.id} key={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <span className="field-label">Employment type</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Contract", "Permanent", "Part-time"].map(type => (
                    <button
                      type="button"
                      key={type}
                      className={`filter-chip ${draft.employeeType === type ? "active" : ""}`}
                      onClick={() => updateDraft("employeeType", type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className={step === 2 ? "space-y-5" : "hidden"}>
              <div>
                <p className="field-label">
                  Courses from the academic catalogue
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {courses.map(course => (
                    <label className="check-option" key={course.id}>
                      <input
                        type="checkbox"
                        checked={courseSelections.includes(course.name)}
                        onChange={e =>
                          setCourseSelections(old =>
                            e.target.checked
                              ? [...old, course.name]
                              : old.filter(v => v !== course.name)
                          )
                        }
                      />
                      {course.name}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="field-label">
                  Subjects corresponding to selected courses
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {availableSubjects.map(subject => (
                    <label className="check-option" key={subject}>
                      <input
                        type="checkbox"
                        checked={subjectSelections.includes(subject)}
                        onChange={e =>
                          setSubjectSelections(old =>
                            e.target.checked
                              ? [...old, subject]
                              : old.filter(v => v !== subject)
                          )
                        }
                      />
                      {subject}
                    </label>
                  ))}
                </div>
                {!availableSubjects.length && (
                  <p className="mt-2 text-sm text-slate-500">
                    Select at least one course to reveal its subjects.
                  </p>
                )}
              </div>
            </div>
            {errors.length > 0 && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <p className="font-bold">Please correct the following:</p>
                <ul className="mt-2 list-disc pl-5">
                  {errors.map(error => (
                    <li key={error}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-7 flex justify-between gap-3">
              <Button
                variant="light"
                type="button"
                onClick={() =>
                  step === 0 ? setEditing(null) : setStep(step - 1)
                }
              >
                {step === 0 ? "Cancel" : "Back"}
              </Button>
              {step < 2 ? (
                <Button type="button" onClick={nextStep}>
                  Validate & continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">
                  <Check className="h-4 w-4" /> Submit account
                </Button>
              )}
            </div>
          </form>
        </Modal>
      )}
      {temporaryPassword && (
        <Modal
          title="Temporary password generated"
          onClose={() => setTemporaryPassword("")}
        >
          <div className="mt-5 rounded-xl bg-slate-950 p-5 text-center">
            <p className="text-xs uppercase tracking-wider text-white/50">
              Temporary password
            </p>
            <p className="mt-3 font-mono text-2xl font-bold tracking-widest text-[#D4AF37]">
              {temporaryPassword}
            </p>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-600">
            Share this password securely with the employee. It must be reset
            when the account logs in for the first time.
          </p>
          <div className="mt-5 flex justify-end">
            <Button onClick={() => setTemporaryPassword("")}>Done</Button>
          </div>
        </Modal>
      )}
      {notice && (
        <Modal
          title={`Status notice · ${notice.name}`}
          onClose={() => setNotice(null)}
        >
          <p className="mt-5 text-sm leading-6 text-slate-600">
            Draft the reason for disabling or removing this employee. The notice
            will be addressed to <strong>{notice.email}</strong> when connected
            to the email service.
          </p>
          <textarea
            id="lecturer-notice"
            className="field mt-4 min-h-[130px] py-3"
            defaultValue={
              notice.notice ||
              "Your account has been placed under review because..."
            }
          />
          <div className="mt-5 flex flex-wrap justify-end gap-3">
            <Button variant="light" onClick={() => setNotice(null)}>
              Cancel
            </Button>
            <Button variant="light" onClick={() => updateStatus("Disabled")}>
              Disable
            </Button>
            <Button onClick={() => updateStatus("Removed")}>Remove</Button>
          </div>
        </Modal>
      )}
    </PortalShell>
  );
}
