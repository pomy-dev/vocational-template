import { useState } from "react";
import type { FormEvent } from "react";
import { AppData } from "@/lib/types";
import { PortalShell } from "@/components/portal-shell";
import { Complaint } from "@/lib/types";
import { toast } from "sonner";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { ArrowRight, MessageCircle, Check } from "lucide-react";
import { Modal } from "@/components/modal";
import { Pill } from "@/components/pill";

export function AdminComplaints({ data, setData, navigate }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  navigate: (path: string) => void
}) {
  const [status, setStatus] = useState("All statuses");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const list = data.complaints.filter((c) =>
    (status === "All statuses" || c.status === status) && !c.deleted);
  const saveReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const f = new FormData(event.currentTarget);
    const nextStatus = String(f.get("status") || "Acted upon");
    const reply = String(f.get("reply") || "");
    setData((old) => ({
      ...old,
      complaints: old.complaints.map((c) => c.id === selected.id
        ? { ...c, status: nextStatus, reply, repliedBy: "Admin · Nomsa Dlamini", repliedAt: new Date().toISOString() }
        : c)
    }));
    setSelected({ ...selected, status: nextStatus, reply, repliedBy: "Admin · Nomsa Dlamini" });
    toast.success("Complaint response saved.");
  };
  return <PortalShell role="Admin" active="/admin/complaints" onNavigate={navigate}>
    <PageHeading eyebrow="Student success desk" title="Complaints submitted" body="Review complaints, reply to the submitter and record the action taken." />
    <div className="portal-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow">Case queue</p>
          <h3 className="mt-2 font-display text-2xl text-slate-950">
            {list.length} submitted cases
          </h3>
        </div>
        <select className="field mt-0 max-w-xs" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option>All statuses</option>
          {["Open", "Investigating", "Acted upon", "Resolved"].map((v) =>
            <option key={v}>{v}</option>)}
        </select>
      </div>
      <div className="mt-6 space-y-3">{list.map((c) =>
        <button className="list-row w-full text-left" key={c.id} onClick={() => setSelected(c)}>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-slate-950">{c.subject}</p>
              <Pill tone={c.status === "Resolved" ? "green" : c.status === "Acted upon" ? "gold" : "slate"}>{c.status}</Pill>
            </div>
            <p className="mt-1 truncate text-sm text-slate-600">{c.message}</p>
            <p className="mt-1 text-xs text-slate-400">{c.date} · {c.time || "Time not recorded"} · {c.source || "Student"}{c.repliedBy ? ` · Reply by ${c.repliedBy}` : " · No response yet"}</p>
          </div>
          <ArrowRight className="shrink-0 text-slate-400" />
        </button>)}{!list.length && <div className="empty-state">
          <MessageCircle />
          <h3>No complaints submitted</h3>
          <p>New complaints will appear here when students or lecturers submit support requests.</p>
        </div>
        }
      </div>
    </div>
    {selected &&
      <Modal title={`Respond · ${selected.subject}`} onClose={() => setSelected(null)}>
        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="eyebrow">Original complaint</p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{selected.message}</p>
          <p className="mt-3 text-xs text-slate-400">
            {selected.anonymous ? "Anonymous" : selected.name || "Name not recorded"} · {selected.email || selected.phone || "Contact withheld"}
          </p>
        </div>
        <form onSubmit={saveReply} className="mt-5 space-y-4">
          <label>Update status
            <select className="field" name="status" defaultValue={selected.status}>
              <option>Open</option>
              <option>Investigating</option>
              <option>Acted upon</option>
              <option>Resolved</option>
            </select>
          </label>
          <label>Reply
            <textarea className="field min-h-[130px] py-3" name="reply" required defaultValue={selected.reply || ""} placeholder="Write the response and action taken." />
          </label>
          <p className="text-xs text-slate-500">The response will show as <strong>Admin · Gcinile Nxumalo</strong> in the lecturer tracking view.</p>
          <div className="flex justify-end gap-3">
            <Button variant="light" type="button" onClick={() => setSelected(null)}>Cancel</Button>
            <Button type="submit">Save reply & status <Check className="h-4 w-4" /></Button>
          </div>
        </form>
      </Modal>
    }
  </PortalShell>;
}