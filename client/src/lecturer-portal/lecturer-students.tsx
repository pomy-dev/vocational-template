import { useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { initials } from "@/const";
import { Search, Users, ChevronDown, ExternalLink } from "lucide-react";
import { Pill } from "@/components/pill";
import { Modal } from "@/components/modal";
import { ProgressBar } from "@/components/progress-bar";
import { Button } from "@/components/button";


export function LecturerStudents() {
  const [course, setCourse] = useState("All courses");
  const [subject, setSubject] = useState("All subjects");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [profile, setProfile] = useState<typeof lecturerStudentRows[number] | null>(null);
  const [subjectsOpen, setSubjectsOpen] = useState<string | null>(null);
  const filtered = lecturerStudentRows.filter((student) =>
    (course === "All courses" || student.course === course)
    && (subject === "All subjects" || student.allSubjects.includes(subject))
    && `${student.name} ${student.email} ${student.course}`.toLowerCase().includes(search.toLowerCase())
  );
  const pageRows = filtered.slice((page - 1) * 10, page * 10);

  const courseAssignments = (courseName: string) => {
    const total = courseName === "Electrical Engineering N1–N6" ? 3 : 2;
    const written = courseName === "Electrical Engineering N1–N6" ? 2 : 1;
    return `${written}/${total}`;
  };

  return <>
    <PageHeading eyebrow="Learner directory" title="Students" body="Filter assigned learners, inspect every subject and open the same academic profile used by administration." />
    <div className="portal-card">
      <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr]">
        <select className="field mt-0" value={course} onChange={(e) => {
          setCourse(e.target.value); setPage(1)
        }}>
          <option>All courses</option>
          {lecturerCourses.map((item) =>
            <option key={item}>{item}</option>
          )}
        </select>
        <select className="field mt-0" value={subject} onChange={(e) => {
          setSubject(e.target.value);
          setPage(1)
        }}>
          <option>All subjects</option>
          {Array.from(new Set(lecturerStudentRows.flatMap((student) => student.allSubjects))).map((item) =>
            <option key={item}>{item}</option>
          )}</select>
        <label className="relative">
          <Search className="absolute left-3 top-[21px] h-4 w-4 text-slate-400" />
          <input className="field mt-0 pl-10" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search name, email or course" />
        </label>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="data-table lecturer-table">
          <thead>
            <tr>
              <th>Full name & contacts</th>
              <th>Course</th>
              <th>Subject</th>
              <th>Profile</th>
              <th>Status</th>
              <th>Next of kin</th>
            </tr>
          </thead>
          <tbody>
            {pageRows.map((student) => <tr key={student.id}><td>
              <div className="flex items-center gap-3">
                <div className="avatar-small">
                  {initials(student.name)}
                </div>
                <div>
                  <p className="font-semibold text-slate-950">{student.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{student.email}<br />{student.phone}</p>
                </div>
              </div>
            </td>
              <td>
                <p>{student.course}</p>
                <p className="mt-1 text-xs font-semibold text-[#916e0a]">Assignments written: {courseAssignments(student.course)}</p>
              </td>
              <td>
                <div className="relative">
                  <button className="filter-chip" onClick={() => setSubjectsOpen(subjectsOpen === student.id ? null : student.id)}>{student.subject} <ChevronDown className="ml-1 inline h-3 w-3" /></button>
                  {subjectsOpen === student.id && <div className="absolute left-0 top-10 z-20 min-w-[220px] rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">All subjects</p>
                    <div className="mt-2 space-y-1">{student.allSubjects.map((item) => <button className="block w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-slate-50" key={item} onClick={() => {
                      setSubject(item); setSubjectsOpen(null)
                    }}>{item}</button>
                    )}
                    </div>
                  </div>
                  }
                </div>
              </td>
              <td>
                <button className="filter-chip" onClick={() => setProfile(student)}>
                  <ExternalLink className="mr-1 inline h-3.5 w-3.5" />View profile
                </button>
              </td>
              <td>
                <Pill tone={student.status === "Suspended" ? "red" : "green"}>{student.status}</Pill>
              </td>
              <td>{student.kin}</td></tr>
            )}
          </tbody>
        </table>
        {!pageRows.length && <div className="empty-state">
          <Users />
          <h3>No matching students</h3>
          <p>Try a different course, subject or search term.</p>
        </div>
        }
      </div>
      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>Showing {pageRows.length} of {filtered.length} records · 10 per page</span>
        <div className="flex gap-2">
          <button className="filter-chip" disabled={page === 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>Previous</button>
          <button className="filter-chip" disabled={page * 10 >= filtered.length} onClick={() => setPage((v) => v + 1)}>Next</button>
        </div>
      </div>
    </div>
    {profile &&
      <Modal title={`${profile.name} · Student profile`} onClose={() => setProfile(null)}>
        <div className="mt-5 grid gap-5 md:grid-cols-[110px_1fr]">
          <img src={profile.avatarUrl} alt={`${profile.name} avatar`} className="h-28 w-28 rounded-2xl object-cover" />
          <div>
            <h3 className="font-display text-2xl text-slate-950">{profile.name}</h3>
            <p className="mt-1 text-sm text-slate-500">{profile.id.toUpperCase()} · {profile.status}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <p className="text-sm">
                <span className="block text-xs text-slate-400">Email</span>
                <strong>{profile.email}</strong>
              </p>
              <p className="text-sm">
                <span className="block text-xs text-slate-400">Phone</span>
                <strong>{profile.phone}</strong>
              </p>
              <p className="text-sm">
                <span className="block text-xs text-slate-400">Campus</span>
                <strong>{profile.campus}</strong>
              </p>
              <p className="text-sm"><span className="block text-xs text-slate-400">Start date</span>
                <strong>{profile.startDate}</strong>
              </p>
              <p className="text-sm">
                <span className="block text-xs text-slate-400">Attendance</span>
                <strong>{profile.attendance}%</strong>
              </p>
              <p className="text-sm">
                <span className="block text-xs text-slate-400">CA average</span>
                <strong>{profile.termAverage}%</strong></p>
              <p className="text-sm">
                <span className="block text-xs text-slate-400">Next of kin</span>
                <strong>{profile.kin}</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="eyebrow">Course & subjects</p>
            <p className="mt-2 font-semibold text-slate-950">{profile.course}</p>
            <div className="mt-3 flex flex-wrap gap-2">{profile.allSubjects.map((item) => <Pill key={item}>{item}</Pill>)}</div>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="eyebrow">Assignments written</p>
            <div className="mt-3 space-y-3">
              {lecturerCourses.map((item) =>
                <div key={item}>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">{item}</span>
                    <strong>{courseAssignments(item)}</strong>
                  </div>
                  <ProgressBar value={item === profile.course ? 67 : 50} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={() => setProfile(null)}>Close</Button>
        </div>
      </Modal>
    }
  </>;
}