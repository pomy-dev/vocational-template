import { SectionTitle } from "@/components/section-title";
import { ArrowRight } from "lucide-react";
import { courses, academicFields, qcto } from "@/lib/data";
import { Button } from "@/components/button";
import { FlipCard } from "@/components/filp-card";
import ExperienceOne from "/assets/gallery1.jpg";

// Programmes Section Component
export function Programmes({ onApply }: { onApply: () => void }) {
  return (
    <section id="programmes" className="section-pad bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle eyebrow="Learn with direction" title="Pathways for every kind." body="From National Certificates to occupational qualifications and short practical programmes, choose the route that fits your ambitions." />
          <Button variant="gold" onClick={onApply}>Find your programme <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {courses.slice(0, 8).map((course, index) =>
            <FlipCard key={course.id} course={course} image={course?.image} />
          )}
        </div>
        <div className="mt-16 rounded-2xl catalogue-panel bg-[#071a3a] p-7 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
            {/* catelogue part */}
            <div className="catalogue-intro h-[100%] rounded-xl p-6 md:p-8" style={{ backgroundImage: `linear-gradient(110deg, rgba(10,10,10,.94), rgba(10,10,10,.68)), url(${ExperienceOne})` }}>
              <p className="eyebrow text-[#D4AF37]">Academic catalogue</p>
              <h3 className="mt-3 font-display text-3xl">Skills & Certificate</h3>
              <p className="mt-3 max-w-lg text-sm leading-6 text-white/55">Explore the full catalogue from Auto Electrical and Agriculture to Computer, Building, Carpentry & Joinery and Electrical Installation, Metal-Work and Motor Mechanics.</p>
            </div>

            {/* fields part */}
            <div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {academicFields.map((field) =>
                  <div key={field} className="rounded-xl border border-white/10 bg-white/[.04] p-3 text-xs text-white/70">{field}</div>
                )}
              </div>
              <p className="mt-5 eyebrow text-[#D4AF37]">Skills pathways</p>
              <div className="mt-3 flex flex-wrap gap-2">{qcto.slice(0, 12).map((item) =>
                <span key={item} className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/60">{item}</span>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}