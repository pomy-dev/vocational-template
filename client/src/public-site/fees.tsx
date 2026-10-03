import { SectionTitle } from "@/components/section-title";
import { shortCourses, subNum, feeRows, monNum, machineCourses, firstClassFields, artisanFields, weldingFields } from "@/lib/data";
import { fee } from "@/const";
import { Hammer, BriefcaseBusiness, Sparkles } from "lucide-react";

// Fees Section Component
export function Fees() {
  return (
    <section id="fees" className="section-pad bg-[#071a3a] text-white">
      <div className="container">
        <SectionTitle light eyebrow="Straightforward investment" title="Fee Structure" body="(100% EMPLOYMENT)Pay less for hight quality. Start with a R500 registration fee and choose the learning pathway that matches your goals." />
        <div className="cash-discount-banner discount-promo mt-8" role="status">
          <span className="discount-badge">10%<br />OFF</span>
          <p className="font-display text-xl text-[#f1d36d] sm:text-2xl">10% discount on cash payment this season</p>
        </div>

        <div className="mt-11 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-[1.5fr_.8fr_.8fr_.8fr] border-b border-white/10 bg-white/[.05] px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-white/45">
              <span>Short course</span>
              <span>Duration</span>
              <span>Reg.</span>
              <span>Total</span>
            </div>
            {shortCourses.map(([name, duration, reg, monthly, total]) =>
              <div key={name} className="grid grid-cols-[1.5fr_.8fr_.8fr_.8fr] border-b border-white/5 px-5 py-4 text-sm last:border-0">
                <span className="text-white/80">{name}</span>
                <span className="text-white/45">{duration}</span>
                <span className="text-white/55">{reg ? fee(reg) : "—"}</span>
                <span className="font-semibold text-[#D4AF37]">{fee(total)}</span>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {/* Engineering Card */}
            <div className="dark-info-card flex-col gap-4 overflow-hidden">
              <div className="flex items-start gap-3">
                <Hammer className="mt-0.5 shrink-0 text-[#D4AF37]" />
                <div className="min-w-0 flex-1">
                  <h4>Engineering Studies N2-N6 Fees</h4>
                  <p className="mt-1">Registration - R500.00 (No Refund). Deposit - R2,000.00 (No Refund). <strong>Complete admission = Reg + Deposit</strong>.</p>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
                <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 bg-white/[0.03] p-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  <div className="px-2 py-1.5">Subjects</div>
                  {subNum.map((level) => (
                    <div key={level} className="px-1 py-1.5 text-center">{level}</div>
                  ))}
                </div>

                {feeRows.engineering.map((row) => (
                  <div key={row[0]} className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 border-t border-white/5 p-1.5 text-[10px]">
                    <div className="flex items-center px-2 py-1.5 text-left text-white/75">{row[0]}</div>
                    {row.slice(1).map((cell, index) => (
                      <div key={`${row[0]}-${index}`} className="break-words rounded-md bg-white/[0.025] px-1 py-1.5 text-center leading-tight text-white/80">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Management Card */}
            <div className="dark-info-card flex-col gap-4 overflow-hidden">
              <div className="flex items-start gap-3">
                <BriefcaseBusiness className="text-[#D4AF37]" />
                <div className="min-w-0 flex-1">
                  <h4>Management & Business Studies N4-N6 Fees</h4>
                  <p className="mt-1">Registration - R500.00 (No Refund). Deposit - R2,000.00 (No Refund). <strong>Complete admission = Reg + Deposit</strong>.</p>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
                <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 bg-white/[0.03] p-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  <div className="px-2 py-1.5">Subjects</div>
                  {subNum.map((level) => (
                    <div key={level} className="px-1 py-1.5 text-center">{level}</div>
                  ))}
                </div>
                {feeRows.business.map((row) => (
                  <div key={row[0]} className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 border-t border-white/5 p-1.5 text-[10px]">
                    <div className="flex items-center px-2 py-1.5 text-left text-white/75">{row[0]}</div>
                    {row.slice(1).map((cell, index) => (
                      <div key={`${row[0]}-${index}`} className="break-words rounded-md bg-white/[0.025] px-1 py-1.5 text-center leading-tight text-white/80">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Occupational Card */}
            <div className="dark-info-card flex-col gap-4 overflow-hidden">
              <div className="flex items-start gap-3">
                <Sparkles className="text-[#D4AF37]" />
                <div className="min-w-0 flex-1">
                  <h4>Occupational Qualifications Fees</h4>
                  <p className="mt-1">Registration - R500.00 (No Refund). Deposit - R2,000.00 (No Refund). <strong>Complete admission = Reg + Deposit</strong>.</p>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
                <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 bg-white/[0.03] p-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  <div className="px-2 py-1.5">Period</div>
                  {monNum.map((level) => (
                    <div key={level} className="px-1 py-1.5 text-center">{level}</div>
                  ))}
                </div>
                {feeRows.occupational.map((row) => (
                  <div key={row[0]} className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 border-t border-white/5 p-1.5 text-[10px]">
                    <div className="flex items-center px-2 py-1.5 text-left text-white/75">{row[0]}</div>
                    {row.slice(1).map((cell, index) => (
                      <div key={`${row[0]}-${index}`} className="break-words rounded-md bg-white/[0.025] px-1 py-1.5 text-center leading-tight text-white/80">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Matric Card */}
            {/* <div className="dark-info-card flex-col gap-4 overflow-hidden">
              <div className="flex items-start gap-3">
                <BookOpenIcon className="text-[#D4AF37]" />
                <div>
                  <h4>Matric Upgrade & Rewrite Fees</h4>
                  <p className="mt-1">Registration - R500.00 (No Refund). Deposit - R2,000.00 (No Refund). <strong>Complete admission = Reg + Deposit</strong>.</p>
                </div>
              </div>

              <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/10">
                <div className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 bg-white/[0.03] p-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  <div className="px-2 py-1.5">Subjects</div>
                  <div className="px-1 py-1.5 text-center">Sub-7&6</div>
                  {subNum.map((level) => (
                    <div key={level} className="px-1 py-1.5 text-center">{level}</div>
                  ))}
                </div>
                {feeRows.matric.map((row) => (
                  <div key={row[0]} className="grid grid-cols-[minmax(0,1.4fr)_repeat(5,minmax(0,0.7fr))] gap-1 border-t border-white/5 p-1.5 text-[10px]">
                    <div className="flex items-center px-2 py-1.5 text-left text-white/75">{row[0]}</div>
                    {row.slice(1).map((cell, index) => (
                      <div key={`${row[0]}-${index}`} className="break-words rounded-md bg-white/[0.025] px-1 py-1.5 text-center leading-tight text-white/80">
                        {cell}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}