import { useState } from "react";
import {
  ArrowRight, Award,
  Check, Clock3,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { useAction } from "@/lib/use-action";
import { Assignment } from "@/lib/types";
import { PageHeading } from "@/components/page-heading";
import { MetricCard } from "@/components/metric-card";
import { AppData } from "@/lib/types";
import { Pill } from "@/components/pill";
import { Modal } from "@/components/modal";
import { Button } from "@/components/button";
import { Spinner } from "@/components/spinner";


// Student Assignments Component
export function StudentAssignments({ data }: { data: AppData }) {
  const [submitOpen, setSubmitOpen] = useState(false);
  const [selected, setSelected] = useState<Assignment | null>(null);
  const { loading, run } = useAction();

  return (
    <>
      <PageHeading eyebrow="Coursework" title="Assignments" body="Receive, submit and track your coursework across every subject." />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Completed" value="8" detail="This academic year" icon={Check} tone="green" />
        <MetricCard label="In progress" value="2" detail="Keep your momentum" icon={Clock3} />
        <MetricCard label="Average score" value="79%" detail="Across submitted work" icon={Award} />
      </div>
      <div className="mt-6 portal-card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Course</th>
                <th>Due date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.assignments.map((a) =>
                <tr key={a.id}>
                  <td>
                    <p className="font-semibold text-slate-950">{a.title}</p>
                    <p className="mt-1 text-xs text-slate-400">Assignment brief · PDF</p>
                  </td>
                  <td>{a.course}</td>
                  <td>{a.due}</td>
                  <td>
                    {a.status === "Submitted"
                      ? <Pill tone="green">Submitted · {a.score}%</Pill>
                      : <Pill>{a.status}</Pill>
                    }
                  </td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <button className="icon-btn" onClick={() => toast.success("Demo assignment brief downloaded.")}>
                        <Download />
                      </button>
                      {a.status !== "Submitted" && <Button onClick={() => { setSelected(a); setSubmitOpen(true); }}>Submit</Button>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {submitOpen && selected &&
        <Modal title={`Submit: ${selected.title}`} onClose={() => setSubmitOpen(false)}>
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">Upload is simulated for this prototype. Your submission will be recorded locally.</div>
          <label className="mt-5 block">Choose file<input className="field" type="file" /></label>
          <div className="mt-7 flex justify-end gap-3">
            <Button variant="light" onClick={() => setSubmitOpen(false)}>Cancel</Button>
            <Button onClick={() => run(() => { toast.success("Assignment submitted successfully."); setSubmitOpen(false); })} disabled={loading}>
              {loading
                ? <Spinner label="Submitting" />
                : <>Submit assignment <ArrowRight className="h-4 w-4" /></>
              }
            </Button>
          </div>
        </Modal>
      }
    </>
  );
}