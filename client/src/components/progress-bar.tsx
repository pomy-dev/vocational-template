// Progress Bar Component
export function ProgressBar({ value, color = "gold" }: { value: number; color?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div className={`h-full rounded-full ${color === "green" ? "bg-emerald-500" : "bg-[#D4AF37]"}`} style={{ width: `${value}%` }} />
    </div>
  );
}