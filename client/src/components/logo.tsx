import LogoFile from "/assets/logo.png"

// Logo Component
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <a href="/" className={`flex items-center gap-3 ${light ? "text-white" : "text-slate-950"}`}>
      <img src={LogoFile} alt="NSTC Logo" className="logo-mark" />
      <span>
        <span className="block font-display text-2xl leading-none">Manzini Industrial</span>
        <span className={`block text-[12px] font-bold uppercase tracking-[.22em] ${light ? "text-white/55" : "text-slate-500"}`}>Training Center</span>
      </span>
    </a>
  );
}