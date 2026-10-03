import { useState } from "react";
import type { FormEvent } from "react";
import { AppData } from "@/lib/types";
import { toast } from "sonner";
import { Download, GraduationCap, ClipboardCheck, Award, Clock3 } from "lucide-react";
import { Button } from "./button";
import { ArrowRight } from "lucide-react";
import { Pill } from "@/components/pill";
import { Logo } from "@/components/logo";
import { PageHeading } from "./page-heading";
import { MetricCard } from "./metric-card";
import { ProgressBar } from "./progress-bar";

export async function ParentPortal({ data, navigate }: {
  data: AppData;
  navigate: (path: string) => void
}) {
  const [logged, setLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const student = data.students[0];

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const found = data.students.find((s) => s.email === email.trim() && s.studentNo === number.trim() && s.phone === phone.trim());
    if (found) {
      setLogged(true);
      setError("");
    } else setError("For the demo, use thabo.mokoena@example.com · NSTC-26-0014 · +27 71 234 8821.");
  };

  if (!logged) return (
    <div className="parent-page">
      <div className="parent-top">
        <Logo />
        <a href="/" className="text-sm font-semibold text-slate-500">Back to public website</a>
      </div>
      <div className="parent-login">
        <div className="parent-login-art">
          <p className="eyebrow text-[#D4AF37]">Family access</p>
          <h1 className="mt-3 font-display text-5xl text-white">Progress is better when shared.</h1>
          <p className="mt-5 text-sm leading-6 text-white/55">A simple, read-only view of your learner’s journey at National Skills & Technical College.</p>
        </div>
        <form onSubmit={submit} className="parent-form">
          <p className="eyebrow">Parent portal</p>
          <h2 className="mt-2 font-display text-3xl text-slate-950">Sign in to view progress.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">Use the student’s email, NSTC student number and registered phone number.</p>
          <label className="mt-7 block">Student email
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="student@email.com" />
          </label>
          <label className="mt-5 block">Student number / ID
            <input className="field" value={number} onChange={(e) => setNumber(e.target.value)} required placeholder="NSTC-26-0014" />
          </label>
          <label className="mt-5 block">Registered phone number
            <input className="field" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+27 71 234 8821" />
          </label>
          {error &&
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-700">{error}</p>
          }
          <Button type="submit" className="mt-7 w-full justify-center">View learner profile <ArrowRight className="h-4 w-4" /></Button>
          <a href="/portal" className="mt-5 flex items-center justify-center text-sm font-semibold text-slate-500">Student login <ArrowRight className="ml-1 h-4 w-4" /></a>
        </form>
      </div>
    </div>
  );

  return (
    <div className="portal-shell">
      <div className="portal-main">
        <header className="portal-header">
          <div><Logo /></div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-500 sm:block">Read-only family access</span>
            <Button variant="light" onClick={() => setLogged(false)}>Sign out</Button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl p-5 md:p-8">
          <PageHeading eyebrow="Parent access · Read only" title={`${student.name}'s progress`} body="Your learner’s current academic and campus snapshot." actions={
            <Button onClick={() => toast.success("Statement of results downloaded.")}>
              <Download className="h-4 w-4" /> Statement of results
            </Button>
          } />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Current status" value={student.status} detail={student.course} icon={GraduationCap} tone="green" />
            <MetricCard label="Attendance" value={`${student.attendance}%`} detail="Across current term" icon={ClipboardCheck} />
            <MetricCard label="Average score" value={`${student.termAverage}%`} detail="Assignments + exams" icon={Award} />
            <MetricCard label="Course duration" value="3 years" detail={`Started ${student.startDate}`} icon={Clock3} />
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
            <div className="portal-card"><p className="eyebrow">Learner demographics</p>
              <div className="mt-5 grid gap-5 sm:grid-cols-2"><div>
                <p className="text-xs text-slate-400">Email</p>
                <p className="mt-1 text-sm font-semibold">{student.email}</p>
              </div>
                <div>
                  <p className="text-xs text-slate-400">Mobile</p>
                  <p className="mt-1 text-sm font-semibold">{student.phone}</p>
                </div><div><p className="text-xs text-slate-400">Campus</p>
                  <p className="mt-1 text-sm font-semibold">{student.campus}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Assigned tutor</p>
                  <p className="mt-1 text-sm font-semibold">Siyabonga Radebe</p>
                </div>
              </div>
              <div className="mt-7 rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Lecturer remark</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">“{student.remarks}”</p>
              </div>
            </div>
            <div className="portal-card">
              <p className="eyebrow">Academic snapshot</p>
              <h3 className="mt-2 font-display text-2xl">Results this term</h3>
              <div className="mt-5 space-y-5">
                {[["Engineering Science", 86], ["Mathematics N2", 78], ["Electrical Trade Theory", 82]].map(([name, value]) =>
                  <div key={String(name)}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="font-semibold">{name}</span>
                      <span>{value}%</span>
                    </div>
                    <ProgressBar value={Number(value)} />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 portal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Activities & assignments</p>
                <h3 className="mt-2 font-display text-2xl">Recent learning activity</h3>
              </div>
              <button onClick={() => navigate("/portal/results")} className="text-sm font-bold text-slate-500">View details <ArrowRight className="ml-1 inline h-4 w-4" /></button>
            </div>
            <div className="mt-5 overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Activity</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.assignments.map((a) =>
                    <tr key={a.id}>
                      <td className="font-semibold">{a.title}</td>
                      <td>{a.course}</td>
                      <td>
                        <Pill tone={a.status === "Submitted" ? "green" : "gold"}>{a.status}</Pill>
                      </td>
                      <td>{a.score ? `${a.score}%` : "Pending"}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}