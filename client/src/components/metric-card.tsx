import { Icon } from "@/lib/types";

// Metric Card Component
export function MetricCard({ label, value, detail, icon: I, tone = "gold" }: {
  label: string;
  value: string | number;
  detail: string;
  icon: Icon;
  tone?: string
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon metric-${tone}`}><I className="h-5 w-5" /></div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-display text-3xl text-slate-950">{value}</p>
      <p className="mt-2 text-xs text-slate-500">{detail}</p>
    </div>
  );
}