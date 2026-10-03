import { useState } from "react";
import { PageHeading } from "@/components/page-heading";
import { Search, FileText } from "lucide-react";
import { Pill } from "@/components/pill";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import { toast } from "sonner";

export function LecturerResults() {
  const [course, setCourse] = useState("All courses");
  const [subject, setSubject] = useState("All subjects");
  const [search, setSearch] = useState("");
  const [profile, setProfile] = useState<typeof lecturerStudentRows[number] | null>(null);
  const [transcript, setTranscript] = useState<typeof lecturerStudentRows[number] | null>(null);
  const rows = lecturerStudentRows.filter((student) => (course === "All courses" || student.course === course) && (subject === "All subjects" || student.subject === subject) && student.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <PageHeading eyebrow="Assessment book" title="Student results" body="Review scores, progress and attendance rates before publishing the next academic update." />
      <div className="portal-card">
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr]">
          <select className="field mt-0" value={course} onChange={(event) => setCourse(event.target.value)}>
            <option>All courses</option>
            {lecturerCourses.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field mt-0" value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option>All subjects</option>
            {lecturerSubjects.map((item) => <option key={item}>{item}</option>)}
          </select>
          <label className="relative">
            <Search className="absolute left-3 top-[21px] h-4 w-4 text-slate-400" />
            <input className="field mt-0 pl-10" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student" />
          </label>
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="data-table lecturer-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Assignments written</th>
                <th>Aggregated score</th>
                <th>Total marks</th>
                <th>Attendance · 2 weeks</th>
                <th>Profile</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((student, index) =>
                <tr key={student.id}>
                  <td className="font-semibold text-slate-950">{student.name}</td>
                  <td>{student.course}</td>
                  <td>{[3, 4, 4, 4, 2][lecturerStudentRows.findIndex((row) => row.id === student.id)]} / 4</td>
                  <td className="font-semibold text-slate-950">{[86, 78, 82, 74, 53][lecturerStudentRows.findIndex((row) => row.id === student.id)] || 76}%</td>
                  <td>100</td>
                  <td>
                    <Pill tone={student.status === "Suspended" ? "red" : "green"}>{[94, 88, 91, 96, 71][lecturerStudentRows.findIndex((row) => row.id === student.id)] || 84}%</Pill></td>
                  <td>
                    <button className="text-xs font-bold text-slate-700 underline" onClick={() => setProfile(student)}>View profile</button><button className="ml-3 text-xs font-bold text-[#916e0a] underline" onClick={() => setTranscript(student)}>Transcript</button></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {profile &&
        <Modal title={`${profile.name} · Academic profile`} onClose={() => setProfile(null)}>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-slate-400">Course</p>
              <p className="mt-1 font-semibold">{profile.course}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Status</p>
              <Pill tone={profile.status === "Suspended" ? "red" : "green"}>
                {profile.status}
              </Pill>
            </div>
            <div>
              <p className="text-xs text-slate-400">Subject</p>
              <p className="mt-1 font-semibold">{profile.subject}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Progress</p>
              <p className="mt-1 font-semibold">On track · 68%</p>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lecturer remark</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Strong practical participation. Continue with weekly revision and submit outstanding work before the next assessment.</p>
          </div>
        </Modal>
      }

      {transcript &&
        <Modal title={`Generate transcript · ${transcript.name}`} onClose={() => setTranscript(null)}>
          <p className="mt-5 text-sm leading-6 text-slate-600">Add a lecturer remark that will appear on the student’s transcript and academic profile.</p>
          <textarea className="field mt-4 min-h-[130px]" defaultValue="Demonstrates consistent commitment and practical understanding across the current term." />
          <div className="mt-6 flex justify-end">
            <Button onClick={() => { toast.success(`Transcript generated for ${transcript.name}.`); setTranscript(null); }}>
              <FileText className="h-4 w-4" /> Generate transcript</Button>
          </div>
        </Modal>
      }
    </>
  );
}