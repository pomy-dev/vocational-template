import { ShieldCheck } from "lucide-react";
import { SectionTitle } from "@/components/section-title";

import { accreditationBodies } from "../lib/data";

// Accreditation Bodies Section Component
export function AccreditationBodies() {
  const marqueeBodies = [...accreditationBodies, ...accreditationBodies];

  return (
    <section className="accreditation-section section-pad">
      <div className="container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionTitle
            eyebrow="Accredited by leading bodies"
            title="Accredited with Department of Higher Education & Training."
            body="Our learning pathways are shaped by the quality frameworks that matter most to employers, learners and communities across South Africa."
          />
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d7bf6f] bg-[#f9f1d2] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#795e0e]">
            <ShieldCheck className="h-4 w-4" />
            Trusted network
          </div>
        </div>

        <div className="accreditation-marquee mt-10">
          <div className="accreditation-track">
            {marqueeBodies.map(({ code, name, logo, description }, index) => (
              <article className="accreditation-card" key={`${code}-${index}`}>
                <div className="accreditation-logo-wrap">
                  <img src={logo} alt={`${name} logo`} className="accreditation-logo" />
                </div>
                <div className="accreditation-card-body">
                  <p className="eyebrow text-[#a27e10]">{code}</p>
                  <h3 className="mt-2 font-display text-xl text-slate-950">{name}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-600">{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}