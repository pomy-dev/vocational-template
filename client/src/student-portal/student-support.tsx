import { useState } from "react";
import { AppData } from "@/lib/types";
import type { FormEvent } from "react";
import { PageHeading } from "@/components/page-heading";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/button";
import { Pill } from "@/components/pill";

// Student Support Component
export function StudentSupport({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    const evidenceFile = f.get("evidence");
    setData((old) => ({
      ...old,
      complaints: [...old.complaints, {
        id: crypto.randomUUID(),
        subject: String(f.get("subject") || "Support request"),
        category: String(f.get("category") || "Query"),
        message: String(f.get("message") || ""),
        evidence: evidenceFile instanceof File && evidenceFile.name ? evidenceFile.name : "",
        status: "Open",
        date: new Date().toISOString().slice(0, 10),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        name: "Thabo Mokoena",
        email: "thabo.mokoena@example.com",
        phone: "+27 71 234 8821"
      }]
    }));

    setSent(true);
  };

  return (
    <>
      <PageHeading eyebrow="Student support" title="Complaints & queries" body="Ask for help, report a concern or follow up on an unresolved student matter." />
      {sent
        ?
        (
          <div className="portal-card text-center">
            <Check className="mx-auto h-10 w-10 text-emerald-600" />
            <h3 className="mt-4 font-display text-2xl">Your support request is open.</h3>
            <p className="mt-2 text-sm text-slate-600">Student success will respond through your registered contact details.</p>
            <Button className="mt-6" onClick={() => setSent(false)}>Create another request</Button>
          </div>
        )
        :
        (
          <div className="portal-card max-w-2xl">
            <form onSubmit={submit} className="space-y-5">
              <label>Subject
                <input name="subject" className="field" required placeholder="What do you need help with?" />
              </label>
              <label>Request type
                <select name="category" className="field">
                  <option>Query</option>
                  <option>Complaint</option>
                  <option>Academic support</option>
                  <option>Finance support</option>
                  <option>Technical support</option>
                </select>
              </label>
              <label>Details
                <textarea name="message" className="field min-h-[150px] py-3" required placeholder="Tell us what happened or what you need." />
              </label>
              <label>Evidence document or image
                <input name="evidence" className="field" type="file" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" />
                <span className="mt-2 block text-xs font-normal text-slate-400">Attach a screenshot, letter or other supporting evidence.</span>
              </label>
              <Button type="submit">Submit to student success <ArrowRight className="h-4 w-4" /></Button>
            </form>
          </div>
        )
      }
      <div className="mt-6 portal-card">
        <p className="eyebrow">Your request history</p>
        <div className="mt-4 space-y-3">
          {data.complaints.length ? data.complaints.map((c) =>
            <div key={c.id} className="list-row"><div>
              <p className="font-semibold text-slate-950">{c.subject}</p>
              <p className="mt-1 text-xs text-slate-500">{c.category} · {c.date}{c.evidence ? ` · Evidence: ${c.evidence}` : ""}</p>
            </div>
              <Pill tone={c.status === "Open" ? "gold" : "green"}>{c.status}</Pill>
            </div>
          ) :
            <p className="mt-3 text-sm text-slate-500">No support requests yet.</p>
          }
        </div>
      </div>
    </>
  );
}