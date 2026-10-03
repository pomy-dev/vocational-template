import { useState } from "react";
import type { FormEvent } from "react";
import { AppData, Complaint } from "@/lib/types";
import { PageHeading } from "@/components/page-heading";
import { toast } from "sonner";
import { Button } from "@/components/button";
import { Plus } from "lucide-react";
import { Pill } from "@/components/pill";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Modal } from "@/components/modal";


export function LecturerComplaints({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [compose, setCompose] = useState(false);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const complaints = data.complaints.filter((c) => c.source === "Lecturer" && !c.deleted);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    setData((old) => ({
      ...old,
      complaints: [{
        id: crypto.randomUUID(),
        source: "Lecturer",
        subject: String(f.get("subject") || "Lecturer complaint"),
        category: "Lecturer complaint",
        message: String(f.get("message") || ""),
        status: "Open",
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        name: "Siyabonga Radebe",
        email: "lecturer@nstc.example",
        phone: "+27 71 000 0000"
      },
      ...old.complaints]
    }));
    setCompose(false);
    toast.success("Complaint pushed to the admin complaints queue.");
  };

  return <>
    <PageHeading eyebrow="Staff support channel" title="My complaints" body="Push a complaint to administration and track whether it has been addressed or acted upon." actions={
      <Button onClick={() => setCompose(true)}>
        <Plus className="h-4 w-4" /> Push complaint
      </Button>
    } />
    <div className="portal-card">
      <p className="eyebrow">Complaint tracking</p>
      <div className="mt-5 space-y-3">
        {complaints.map((c) => <button key={c.id} className="list-row w-full text-left" onClick={() => setSelected(c)}><div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-slate-950">{c.subject}</p>
            <Pill tone={c.status === "Resolved" ? "green" : c.status === "Acted upon" ? "gold" : "slate"}>{c.status}</Pill>
          </div>
          <p className="mt-1 truncate text-sm text-slate-600">{c.message}</p>
          <p className="mt-1 text-xs text-slate-400">{c.date} · {c.time || "Time not recorded"}{c.reply ? ` · Reply from ${c.repliedBy || "Admin"}` : " · Awaiting admin action"}</p>
        </div>
          <ArrowRight className="shrink-0 text-slate-400" /></button>
        )}
        {!complaints.length && <div className="empty-state">
          <MessageCircle />
          <h3>No lecturer complaints yet</h3>
          <p>Use Push complaint to send a concern to the admin team.</p>
        </div>
        }
      </div>
    </div>
    {compose &&
      <Modal title="Push a lecturer complaint" onClose={() => setCompose(false)}>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label>Subject<input className="field" name="subject" required placeholder="Short complaint title" /></label>
          <label>Details<textarea className="field min-h-[150px] py-3" name="message" required placeholder="Describe the issue, impact and requested action." /></label>
          <div className="flex justify-end gap-3">
            <Button variant="light" type="button" onClick={() => setCompose(false)}>Cancel</Button>
            <Button type="submit">Push complaint <ArrowRight className="h-4 w-4" /></Button>
          </div>
        </form>
      </Modal>
    }
    {selected &&
      <Modal title={`Complaint · ${selected.subject}`} onClose={() => setSelected(null)}>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <p className="text-sm">
            <span className="block text-xs text-slate-400">Status</span>
            <Pill tone={selected.status === "Resolved" ? "green" : "gold"}>{selected.status}</Pill>
          </p>
          <p className="text-sm">
            <span className="block text-xs text-slate-400">Submitted</span><strong>{selected.date} · {selected.time}</strong></p>
        </div>
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">{selected.message}</div>
        {selected.reply && <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Response · {selected.repliedBy}</p>
          <p className="mt-2 text-sm leading-6 text-emerald-900">{selected.reply}</p>
        </div>
        }
        <div className="mt-5 flex justify-end gap-3">
          {(selected.status === "Resolved" || selected.status === "Acted upon") &&
            <Button variant="light" onClick={() => {
              setData((old) => ({
                ...old,
                complaints: old.complaints.map((c) => c.id === selected.id
                  ? { ...c, deleted: true } : c)
              }));
              setSelected(null);
              toast.success("Addressed complaint archived from your tracking list.");
            }}>Delete / archive
            </Button>
          }
          <Button onClick={() => setSelected(null)}>Close</Button>
        </div>
      </Modal>
    }
  </>;
}