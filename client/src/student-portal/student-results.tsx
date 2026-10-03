import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { MetricCard } from "@/components/metric-card";
import { toast } from "sonner";
import { BookOpen, Award, Download, ClipboardCheck, CalendarDays } from "lucide-react";
import { ProgressBar } from "@/components/progress-bar";
import { Pill } from "@/components/pill";
import { AppData } from "@/lib/types";

// Student Results Component
export function StudentResults({ data }: { data: AppData }) {
  return (
    <>
      <PageHeading eyebrow="Progress record" title="Results & attendance" body="Trace your term performance and attendance history."
        actions={
          <Button onClick={() => toast.success("Statement of results generated.")}><Download className="h-4 w-4" /> Download statement</Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Term average" value="82%" detail="Trimester 2 · 2026" icon={Award} />
        <MetricCard label="Attendance" value="94%" detail="Target: 80%" icon={ClipboardCheck} tone="green" />
        <MetricCard label="Classes attended" value="32 / 34" detail="Last two weeks" icon={CalendarDays} />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <div className="portal-card">
          <p className="eyebrow">Results by subject</p>
          <div className="mt-5 divide-y divide-slate-100">
            {[
              ["Engineering Science", 86, "A"],
              ["Mathematics N2", 78, "B"],
              ["Electrical Trade Theory", 82, "B+"],
              ["Logic Systems", 74, "B"]
            ].map(([name, score, grade]) =>
              <div className="flex items-center gap-4 py-4 first:pt-0 last:pb-0" key={String(name)}>
                <div className="file-icon"><BookOpen /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-950">{name}</p>
                  <div className="mt-2"><ProgressBar value={Number(score)} /></div>
                </div>
                <span className="font-display text-xl text-slate-950">{score}%</span>
                <Pill tone="green">{grade}</Pill>
              </div>
            )}
          </div>
        </div>
        <div className="portal-card">
          <p className="eyebrow">Attendance reflection</p>
          <div className="mt-6 flex items-end gap-2">{[4, 5, 5, 4, 5, 5, 3, 5, 5, 4, 5, 5, 5, 5].map((subjectsAttended, i) =>
            <div className="flex flex-1 flex-col items-center gap-2" key={i}>
              <div className="w-full rounded-t-md bg-[#D4AF37]" style={{ height: `${Math.max(24, subjectsAttended * 18)}px`, opacity: subjectsAttended < 4 ? .45 : 1 }} title={`${subjectsAttended} subjects attended`} />
              <span className="text-[9px] text-slate-400">{i + 1}</span>
            </div>
          )}
          </div>
          <p className="mt-3 text-xs text-slate-500">Subjects attended per day · 5 scheduled subjects maximum</p>
          <div className="mt-5 flex justify-between text-xs text-slate-400">
            <span>Two weeks ago</span>
            <span>This week</span>
          </div>
        </div>
      </div>
      <div className="mt-5 portal-card">
        <p className="eyebrow">Lecturer remarks</p>
        <div className="mt-4 flex gap-4">
          <div className="avatar-small">SR</div>
          <div>
            <p className="text-sm leading-6 text-slate-600">“Thabo is showing excellent practical application in the workshop. Keep the same focus through examination preparation.”</p>
            <p className="mt-2 text-xs font-semibold text-slate-950">Siyabonga Radebe · Engineering lecturer</p>
          </div>
        </div>
      </div>
    </>
  );
}