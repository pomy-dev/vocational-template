import { SectionTitle } from "@/components/section-title";
import { occupationalColleges } from "@/lib/data";
import { Check } from "lucide-react";

// Occupational Certificates Section Component
export function OccupationalCertificates() {
  return (
    <section id="occupational" className="section-pad bg-[#f2f5fa]">
      <div className="container">
        <SectionTitle eyebrow="Occupational certificates" title="Practical routes into the world of work." body="Explore the colleges and SETA-aligned certificates that build opportunity in communities across South Africa." />
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {occupationalColleges.map(([college, accreditor, programmes]) =>
            <article className="catalog-card" key={college}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow text-[#a27e10]">{accreditor}</p>
                  <h3 className="mt-2 font-display text-2xl text-slate-950">{college}</h3>
                </div>
                <span className="catalog-mark">{accreditor.slice(0, 2)}</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {programmes.map((item) =>
                  <li className="flex gap-2" key={item}><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#a27e10]" />{item}</li>)}</ul>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}