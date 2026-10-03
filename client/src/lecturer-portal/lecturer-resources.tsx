import { useState } from "react";
import { AppData, Assignment } from "@/lib/types";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { Upload, X, FileText, Plus, Check } from "lucide-react";
import { Pill } from "@/components/pill";



export function LecturerResources({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [message, setMessage] = useState("");
  const [sheet, setSheet] = useState(false);
  const [month, setMonth] = useState("All months");
  const [date, setDate] = useState("All dates");
  const [mockAssignments, setMockAssignments] = useState<Assignment[]>(
    [{
      id: "mock-as-1",
      title: "Electrical installation rules case study",
      course: "Electrical Engineering N1–N6",
      subject: "Electrical Trade Theory",
      due: "2026-06-12",
      status: "Published",
      createdAt: "2026-06-02"
    },
    {
      id: "mock-as-2",
      title: "Workshop risk assessment",
      course: "Electrical Engineering N1–N6",
      subject: "Engineering Science",
      due: "2026-06-20",
      status: "Published",
      createdAt: "2026-06-05"
    },
    {
      id: "mock-as-3",
      title: "Networking fundamentals quiz",
      course: "Information Technology",
      subject: "Networking",
      due: "2026-07-04",
      status: "Draft",
      createdAt: "2026-06-08"
    }
    ]);

  const submitResource = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    setData((old) => ({
      ...old,
      resources: [
        {
          id: crypto.randomUUID(),
          title: String(f.get("title") || "New learning resource"),
          course: String(f.get("course") || lecturerCourses[0]),
          subject: String(f.get("subject") || lecturerSubjects[0]),
          fileType: "PDF",
          published: f.get("publish") === "on",
          uploaded: "2026-06-08"
        },
        ...old.resources
      ]
    }));
    event.currentTarget.reset();
    setMessage("Resource uploaded and saved to your teaching library.");
  };
  const assignments = [...mockAssignments, ...data.assignments];
  const months = Array.from(new Set(assignments.map((a) => a.due.slice(0, 7))));
  const dates = Array.from(new Set(assignments.map((a) => a.due)));
  const visible = assignments.filter((a) => (month === "All months" || a.due.startsWith(month)) && (date === "All dates" || a.due === date));

  const createAssignment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const document = f.get("document");
    const assignment: Assignment = {
      id: crypto.randomUUID(),
      title: String(f.get("title") || "New assignment"),
      course: String(f.get("course") || lecturerCourses[0]),
      subject: String(f.get("subject") || lecturerSubjects[0]),
      due: String(f.get("due") || "2026-06-30"),
      status: "Published",
      instructions: String(f.get("instructions") || ""),
      documentName: document instanceof File && document.name ? document.name : undefined,
      documentType: document instanceof File && document.name ? document.type || "application/octet-stream" : undefined,
      createdAt: "2026-06-08"
    };
    setMockAssignments((old) => [assignment, ...old]);
    setSheet(false);
    toast.success("Assignment added to the mock lecturer workspace.");
  };

  return (
    <>
      <PageHeading eyebrow="Teaching library" title="Resources & assignments" body="Upload learning materials and manage coursework in one place." />
      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="portal-card">
          <p className="eyebrow">Upload & publish resource</p>
          <form onSubmit={submitResource} className="mt-5 space-y-4">
            <label>Resource title<input name="title" className="field" required placeholder="e.g. Motor control workbook" /></label>
            <label>Course<select name="course" className="field">
              {lecturerCourses.map((item) => <option key={item}>{item}</option>)}
            </select>
            </label>
            <label>Subject
              <select name="subject" className="field">
                {lecturerSubjects.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <label>File<input className="field" type="file" required />
            </label>
            <label className="check-option">
              <input name="publish" type="checkbox" defaultChecked /> Publish to enrolled students now</label>
            <Button type="submit"><Upload className="h-4 w-4" /> Upload resource</Button>
            {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
          </form>
        </div>
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Published library</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Learning resources</h3>
            </div>
            <Pill>{data.resources.length} files</Pill>
          </div>
          <div className="mt-4 space-y-2">
            {data.resources.map((resource) =>
              <div className="resource-row" key={resource.id}>
                <div className="file-icon"><FileText /></div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{resource.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{resource.course} · {resource.subject} · {resource.uploaded}</p>
                </div>
                <Pill tone={resource.published ? "green" : "slate"}>{resource.published ? "Published" : "Draft"}</Pill>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 portal-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Assignment activity</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Assignments</h3>
          </div>
          <Button onClick={() => setSheet(true)}><Plus className="h-4 w-4" /> New assignment</Button>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">{[
          ["Published", assignments.filter((a) => a.status === "Published").length],
          ["Drafts", assignments.filter((a) => a.status === "Draft").length],
          ["Due this month", assignments.filter((a) => a.due.startsWith("2026-06")).length]
        ].map(([label, value]) =>
          <div className="rounded-xl bg-slate-50 p-4" key={String(label)}>
            <p className="text-xs text-slate-500">{label}</p>
            <p className="mt-1 font-display text-3xl text-slate-950">{value}</p>
          </div>
        )}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <select className="field mt-0 max-w-[190px]" value={month} onChange={(e) => setMonth(e.target.value)}>
            <option>All months</option>
            {months.map((m) => <option key={m}>{m}</option>)}
          </select>
          <select className="field mt-0 max-w-[190px]" value={date} onChange={(e) => setDate(e.target.value)}>
            <option>All dates</option>
            {dates.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="mt-4 space-y-2">
          {visible.map((a) =>
            <div className="list-row" key={a.id}>
              <div className="min-w-0">
                <p className="font-semibold text-slate-950">{a.title}</p>
                <p className="mt-1 text-xs text-slate-500">{a.course} · {a.subject || "General"} · Due {a.due}</p>
              </div>
              <Pill tone={a.status === "Published" ? "green" : "slate"}>{a.status}</Pill>
            </div>
          )}
        </div>
      </div>
      {sheet &&
        <div className="sheet-backdrop" onClick={() => setSheet(false)}>
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Coursework composer</p>
                <h3 className="mt-2 font-display text-2xl text-slate-950">Add a new assignment</h3>
              </div>
              <button className="icon-btn" onClick={() => setSheet(false)}><X /></button>
            </div>
            <form onSubmit={createAssignment} className="mt-6 grid gap-4 md:grid-cols-2">
              <label className="md:col-span-2">Assignment title<input name="title" className="field" required /></label>
              <label>Course
                <select name="course" className="field">
                  {lecturerCourses.map((item) => <option key={item}>{item}</option>)}</select>
              </label>
              <label>Subject
                <select name="subject" className="field">
                  {lecturerSubjects.map((item) => <option key={item}>{item}</option>)}
                </select>
              </label>
              <label>Due date<input name="due" className="field" type="date" required /></label>
              <label>Instructions<textarea name="instructions" className="field min-h-[110px] py-3" /></label><label>Assignment document<span className="mt-1 block text-xs text-slate-400">Upload the brief or assessment document.</span><input name="document" className="field" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" /></label>
              <div className="flex justify-end gap-3 md:col-span-2">
                <Button variant="light" type="button" onClick={() => setSheet(false)}>Cancel</Button>
                <Button type="submit"><Check className="h-4 w-4" /> Publish assignment</Button>
              </div>
            </form>
          </div>
        </div>
      }
    </>
  );
}