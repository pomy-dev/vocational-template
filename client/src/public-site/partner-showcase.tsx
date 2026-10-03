import { SectionTitle } from "@/components/section-title";
import { partners } from "@/lib/data";

// Partners Showcase Section Component
export function PartnersShowcase() {
  return (
    <section id="partners" className="section-pad bg-white">
      <div className="container">
        <SectionTitle eyebrow="Partners & Stakeholders" title="Our partners in trust" body="" />
        <div className="partner-grid mt-10">
          {partners.map(([name, logo]) =>
            <article className="partner-card" key={name}>
              <div className="partner-logo">
                <img src={logo} alt={`${name} logo`} className="rounded-lg" />
              </div>
            </article>
          )}
        </div>
      </div>
    </section>
  );
}