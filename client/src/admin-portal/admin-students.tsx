import { useState } from "react";
import { AppData, Student } from "@/lib/types";
import type { ChangeEvent } from "react";
import { delay } from "@/utils/delay";
import * as XLSX from 'xlsx';
import { initials } from "@/const";
import { PortalShell } from "@/components/portal-shell";
import { PageHeading } from "@/components/page-heading";
import { Download, Upload, Users, Search, ExternalLink } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { Pill } from "@/components/pill";
import { Modal } from "@/components/modal";
import { ProgressBar } from "@/components/progress-bar";


export function AdminStudents({ data, setData, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  navigate: (path: string) => void
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [startDate, setStartDate] = useState("All start dates");
  const [course, setCourse] = useState("All courses");
  const [profile, setProfile] = useState<Student | null>(null);
  const [importing, setImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importSummary, setImportSummary] = useState("");

  const handleBulkImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return; setImporting(true);
    setImportErrors([]);
    setImportSummary("");

    try {
      await delay(700);
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(workbook.Sheets[workbook.SheetNames[0]], { defval: "" });
      const required = ["name", "email", "phone", "studentNo", "campus", "course", "startDate", "status"];
      const errors: string[] = [];
      const accepted: Student[] = [];
      rows.forEach((row, index) => {
        const missing = required.filter((key) => !String(row[key] ?? "").trim());
        const statusValue = String(row.status || "Active");
        if (missing.length) { errors.push(`Row ${index + 2}: missing ${missing.join(", ")}.`); return; }
        if (!["Active", "Suspended", "Completed", "Alumni"].includes(statusValue)) {
          errors.push(`Row ${index + 2}: status must be Active, Suspended, Completed or Alumni.`);
          return;
        }
        accepted.push({
          id: crypto.randomUUID(),
          name: String(row.name),
          email: String(row.email),
          phone: String(row.phone),
          studentNo: String(row.studentNo),
          campus: String(row.campus),
          course: String(row.course),
          startDate: String(row.startDate),
          status: statusValue as Student["status"],
          attendance: Number(row.attendance) || 0,
          balance: Number(row.balance) || 0,
          termAverage: Number(row.termAverage) || 0,
          initials: initials(String(row.name)),
          guardian: String(row.guardian || "Not recorded"),
          remarks: String(row.remarks || "Imported in bulk")
        });
      });

      setData((old) => ({ ...old, students: [...accepted, ...old.students] }));

      setImportErrors(errors);
      setImportSummary(`${accepted.length} record${accepted.length === 1 ? "" : "s"} imported successfully${errors.length ? `; ${errors.length} failed validation` : ""}.`);
    } catch {
      setImportErrors(["The file could not be read. Upload a valid .csv, .xls or .xlsx file."]);
    } finally { setImporting(false); event.target.value = ""; }
  };

  const coursesInData = Array.from(new Set(data.students.map((s) => s.course)));
  const dates = Array.from(new Set(data.students.map((s) => s.startDate))).sort();
  const list = data.students.filter((s) =>
    (status === "All statuses" || s.status === status)
    && (startDate === "All start dates" || s.startDate === startDate)
    && (course === "All courses" || s.course === course)
    && `${s.name} ${s.studentNo} ${s.course}`.toLowerCase().includes(query.toLowerCase())
  );

  const studentSubjects = profile?.courseSubjects?.[profile.course] || profile?.subjects || ["Subjects to be confirmed"];
  return (
    <PortalShell role="Admin" active="/admin/students" onNavigate={navigate}>
      <PageHeading eyebrow="Student register" title="All learners" body={`${data.students.length} learner profiles in the local register.`}
        actions={
          <div className="flex flex-wrap gap-2">
            <button className="btn btn-light" type="button" onClick={() => toast.success("Template structure: name, email, phone, studentNo, campus, course, startDate, status, attendance, balance, termAverage, guardian, remarks.")}>
              <Download className="h-4 w-4" /> Template structure
            </button>
            <label className={`btn btn-gold cursor-pointer ${importing ? "pointer-events-none opacity-60" : ""}`}>
              {importing ?
                <Spinner label="Importing..." />
                : <><Upload className="h-4 w-4" /> Import CSV / Excel</>
              }
              <input className="hidden" type="file" accept=".csv,.xls,.xlsx" onChange={handleBulkImport} disabled={importing} />
            </label>
          </div>
        }
      />

      <div className="mb-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
        <div className="rounded-2xl border border-dashed border-[#D4AF37] bg-[#fffaf0] p-5">
          <p className="eyebrow">Bulk upload structure</p>
          <h3 className="mt-2 font-display text-xl text-slate-950">One row per learner</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Accepted columns are <strong>name, email, phone, studentNo, campus, course, startDate, status</strong>. Optional columns are attendance, balance, termAverage, guardian and remarks.</p><p className="mt-3 text-xs text-slate-500">Use CSV, XLS or XLSX. Status must be Active, Suspended, Completed or Alumni.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <p className="eyebrow">Import result</p>
          {importing ? <div className="mt-4"><Spinner label="Validating learner records..." /></div>
            : importSummary
              ? <p className="mt-4 text-sm font-semibold text-emerald-700">{importSummary}</p>
              : <p className="mt-4 text-sm text-slate-500">Choose a file to validate and import learner records.</p>
          }
          {importErrors.length > 0 &&
            <div className="mt-4 max-h-32 overflow-auto rounded-xl bg-red-50 p-3 text-xs text-red-700">
              <p className="font-bold">Rows not imported</p>
              <ul className="mt-1 list-disc pl-4">{importErrors.map((error) => <li key={error}>{error}</li>)}</ul>
            </div>
          }
        </div>
      </div>

      <div className="portal-card">
        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <label className="relative">
            <Search className="absolute left-3 top-[21px] h-4 w-4 text-slate-400" />
            <input className="field mt-0 pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search learner or programme" />
          </label>
          <select className="field mt-0" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All statuses</option>
            {["Active", "Suspended", "Completed", "Alumni"].map((v) =>
              <option key={v}>{v}</option>
            )}
          </select>
          <select className="field mt-0" value={startDate} onChange={(e) => setStartDate(e.target.value)}>
            <option>All start dates</option>
            {dates.map((v) => <option key={v}>{v}</option>)}
          </select>
          <select className="field mt-0" value={course} onChange={(e) => setCourse(e.target.value)}>
            <option>All courses</option>
            {coursesInData.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
        <div className="mt-6 flex gap-2">
          <Pill tone="green">{list.length} matching</Pill>
          <Pill tone="red">
            {list.filter((s) => s.status === "Suspended").length} suspended</Pill>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Programme</th>
                {/* <th>Campus</th> */}
                <th>Start date</th>
                <th>Status</th>
                {/* <th>Balance</th> */}
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {list.map((st) =>
                <tr key={st.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar-small">{st.initials}</div>
                      <div>
                        <p className="font-semibold text-slate-950">{st.name}</p>
                        <p className="text-xs text-slate-400">{st.studentNo} · {st.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>{st.course}</td>
                  {/* <td>{st.campus}</td> */}
                  <td>{st.startDate}</td>
                  <td>
                    <Pill tone={st.status === "Active" ? "green" : st.status === "Suspended" ? "red" : "slate"}>{st.status}</Pill>
                  </td>
                  {/* <td className={st.balance ? "font-bold text-red-600" : "text-slate-500"}>{fee(st.balance)}</td> */}
                  <td>
                    <button className="filter-chip" onClick={() => setProfile(st)}>
                      <ExternalLink className="mr-1 inline h-3.5 w-3.5" /> View profile
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!list.length && <div className="empty-state"><Users /><h3>No matching learners</h3><p>Adjust the status, start date, course or search filters.</p></div>}
        </div>
      </div>

      {profile &&
        <Modal title={`${profile.name} · Student profile`} onClose={() => setProfile(null)}>
          <div className="mt-5 grid gap-5 md:grid-cols-[110px_1fr]">
            <div className="h-28 w-28 overflow-hidden rounded-2xl bg-slate-100">
              <img src={profile.avatarUrl || "/assets/students-in-grad.jpg"} alt={`${profile.name} avatar`} className="h-full w-full object-cover" />
              <div className="-mt-9 ml-3 relative avatar-small">{profile.initials}</div>
            </div>
            <div>
              <h3 className="font-display text-2xl text-slate-950">{profile.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{profile.studentNo} · {profile.status}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <p className="text-sm">
                  <span className="block text-xs text-slate-400">Email</span>
                  <strong>{profile.email}</strong></p>
                <p className="text-sm">
                  <span className="block text-xs text-slate-400">Phone</span>
                  <strong>{profile.phone}</strong>
                </p>
                <p className="text-sm">
                  <span className="block text-xs text-slate-400">Campus</span>
                  <strong>{profile.campus}</strong>
                </p>
                <p className="text-sm">
                  <span className="block text-xs text-slate-400">Start date</span>
                  <strong>{profile.startDate}</strong>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="eyebrow">Courses</p>
              <p className="mt-2 text-sm font-semibold text-slate-950">{profile.course}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">Subjects in course</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {studentSubjects.map((subject) => <Pill key={subject} tone="slate">{subject}</Pill>)}
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="eyebrow">Academic indicators</p>
              <div className="mt-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Aggregated attendance</p>
                  <p className="mt-1 font-display text-3xl text-slate-950">{profile.attendance}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">CA average</p>
                  <p className="mt-1 font-display text-3xl text-slate-950">
                    {profile.termAverage}%</p>
                </div>
              </div>
              <div className="mt-4">
                <ProgressBar value={profile.attendance} />
                <p className="mt-2 text-xs text-slate-500">Attendance across current academic sessions</p>
              </div>
            </div>
          </div>
          <div className="mt-5 rounded-xl border border-slate-100 p-4">
            <p className="eyebrow">Next Of Kin</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <p className="text-sm">
                <span className="block text-xs text-slate-400">Name</span>
                <strong>{profile.guardian}</strong>
              </p>
              <p className="text-sm">
                <span className="block text-xs text-slate-400">Contact</span>
                <strong>{profile.nextOfKin?.phone || "N/A"}</strong>
              </p>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{profile.remarks}</p>
          </div>
        </Modal>
      }
    </PortalShell>
  );
}