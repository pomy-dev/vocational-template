import { useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { Pill } from "@/components/pill";
import { Search, Users, Download } from "lucide-react";
import { Button } from "@/components/button";
import { toast } from "sonner";




export function LecturerSubmissions() {
  const [course, setCourse] = useState("All courses");
  const [subject, setSubject] = useState("All subjects");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rows = lecturerStudentRows.filter(
    (student) => (course === "All courses" || student.course === course)
      && (subject === "All subjects" || student.subject === subject)
      && `${student.name} ${student.email} ${student.course}`.toLowerCase().includes(search.toLowerCase())
  );
  const pageRows = rows.slice((page - 1) * 10, page * 10);
  const [scores, setScores] = useState<Record<string, string>>({ s1: "86", s2: "78", s3: "82", s4: "74" });

  return (
    <>
      <PageHeading eyebrow="Marking queue" title="Submissions & marks" body="Preview submitted files, download evidence and update marks for each assignment." />
      <div className="portal-card">
        <div className="mb-5 items-start justify-between gap-4">
          <div className="flex flex-wrap items-center justify-start gap-6">
            <h3 className="mt-2 font-display text-2xl text-slate-950">Submitted assignment files</h3>
            <Pill tone="green">{rows.length} submitted</Pill>
          </div>
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr]">
            <select className="field mt-0" value={course} onChange={(e) => setCourse(e.target.value)}>
              <option>All courses</option>
              {lecturerCourses.map((item) =>
                <option key={item}>{item}</option>
              )}
            </select>
            <select className="field mt-0" value={subject} onChange={(e) => setSubject(e.target.value)}>
              <option>All subjects</option>
              {lecturerSubjects.map((item) =>
                <option key={item}>{item}</option>)
              }
            </select>
            <label className="relative">
              <Search className="absolute left-3 top-[21px] h-4 w-4 text-slate-400" />
              <input className="field mt-0 pl-10" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search name, email or course" />
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Submitted</th>
                <th>File</th>
                <th>Preview</th>
                <th>Marks / 100</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((student) =>
                <tr key={student.id}>
                  <td className="font-semibold text-slate-950">{student.name}</td>
                  <td>08 Jun 2026 · 08:20</td>
                  <td>
                    <button className="text-xs font-semibold text-slate-700 underline" onClick={() => toast.success("Demo file download started.")}><Download className="mr-1 inline h-3.5 w-3.5" />submission.pdf</button>
                  </td>
                  <td>
                    <button className="text-xs font-semibold text-[#916e0a] underline" onClick={() => toast.info("Preview opened in the marking workspace.")}>Preview</button>
                  </td>
                  <td><input className="field mt-0 w-24" value={scores[student.id] || ""} onChange={(event) => setScores((old) => ({ ...old, [student.id]: event.target.value }))} /></td>
                  <td><Button onClick={() => toast.success(`Score updated for ${student.name}.`)}>Update</Button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {!pageRows.length && <div className="empty-state"><Users /><h3>No matching students</h3><p>Try a different course, subject or search term.</p></div>}
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>Showing {pageRows.length} of {rows.length} records · 10 per page</span>
          <div className="flex gap-2">
            <button className="filter-chip" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>Previous</button>
            <button className="filter-chip" disabled={page * 10 >= rows.length} onClick={() => setPage((value) => value + 1)}>Next</button>
          </div>
        </div>
      </div>
    </>
  );
}