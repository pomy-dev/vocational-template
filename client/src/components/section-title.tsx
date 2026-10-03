// Custome Section Title Component
export function SectionTitle({ eyebrow, title, body, light = false }: {
  eyebrow: string;
  title: string;
  body?: string;
  light?: boolean
}) {
  return (
    <div className="max-w-2xl">
      <p className={`eyebrow ${light ? "text-[#D4AF37]" : "text-[#a27e10]"}`}>{eyebrow}</p>
      <h2 className={`mt-3 font-display text-4xl leading-tight md:text-5xl ${light ? "text-white" : "text-slate-950"}`}>{title}</h2>
      {body &&
        <p className={`mt-4 text-base leading-7 ${light ? "text-white/60" : "text-slate-600"}`}>{body}</p>
      }
    </div>
  );
}