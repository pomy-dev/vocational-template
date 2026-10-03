import { useState } from "react";
import type { FormEvent } from "react";
import { AppData, Schedule } from "@/lib/types";
import { toast } from "sonner";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { CalendarDays } from "lucide-react";
import { Check, MoreHorizontal } from "lucide-react";


export function LecturerSchedules({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [editing, setEditing] = useState<Schedule | null>(null);
  const [menu, setMenu] = useState<string | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next: Schedule = {
      id: editing?.id || crypto.randomUUID(),
      title: String(form.get("title") || "New class"),
      kind: String(form.get("kind") || "Class"),
      date: String(form.get("date") || "2026-06-10"),
      time: String(form.get("time") || "09:00 – 11:00"),
      location: String(form.get("location") || "Workshop 2")
    };
    setData((old) => ({
      ...old,
      schedules: editing ? old.schedules.map((item) => item.id === editing.id ? next : item) : [...old.schedules, next]
    }));
    setEditing(null);
    toast.success("Schedule saved and published to the class calendar.");
  };

  return (
    <>
      <PageHeading eyebrow="Timetable builder" title="Schedules" body="Create and edit class, assignment and examination schedules with time and location." />
      <div className="grid gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <div className="portal-card">
          <p className="eyebrow">{editing ? "Edit schedule" : "Create schedule"}</p>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <label>Title<input name="title" className="field" required defaultValue={editing?.title || ""} placeholder="Engineering Science" /></label>
            <label>Type<select name="kind" className="field" defaultValue={editing?.kind || "Class"}>
              <option>Class</option>
              <option>Assignment</option>
              <option>Exam</option>
            </select>
            </label>
            <label>Date<input name="date" className="field" type="date" required defaultValue={editing?.date || "2026-06-10"} /></label>
            <label>Time<input name="time" className="field" required defaultValue={editing?.time || "09:00 – 11:00"} /></label>
            <label>Location<input name="location" className="field" required defaultValue={editing?.location || "Workshop 2 · Wynberg"} /></label>
            <div className="flex gap-3 mt-6">
              <Button type="submit">{editing ? "Save changes" : "Publish schedule"} <Check className="h-4 w-4" /></Button>
              {editing && <Button variant="light" onClick={() => setEditing(null)}>Cancel</Button>}
            </div>
          </form>
        </div>
        <div className="portal-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Published timetable</p>
              <h3 className="mt-2 font-display text-2xl text-slate-950">Upcoming events</h3>
            </div>
            <CalendarDays className="text-[#a27e10]" />
          </div>
          <div className="mt-4 space-y-2">
            {data.schedules.map((item) =>
              <div className="schedule-row rounded-xl border border-slate-200 p-3" key={item.id}>
                <div className="date-tile">
                  <strong>{new Date(item.date).getDate()}</strong>
                  <span>{new Date(item.date).toLocaleDateString("en", { month: "short" })}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.kind} · {item.time} · {item.location}</p>
                </div>
                <div className="relative"><button className="icon-btn" onClick={() => setMenu(menu === item.id ? null : item.id)}><MoreHorizontal /></button>{menu === item.id && <div className="absolute right-0 top-10 z-10 w-32 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"><button className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold hover:bg-slate-50" onClick={() => { setEditing(item); setMenu(null); }}>Edit</button><button className="w-full rounded-lg px-3 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50" onClick={() => { setData((old) => ({ ...old, schedules: old.schedules.filter((s) => s.id !== item.id) })); setMenu(null); toast.success("Schedule removed."); }}>Remove</button></div>}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}