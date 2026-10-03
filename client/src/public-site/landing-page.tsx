import { Star } from "lucide-react";
import { AppData } from "@/lib/types";
import { Apprenticeships } from "@/public-site/apprenticeship";
import { AccreditationBodies } from "./accreditation-bodies";
import { About } from "./about";
import { Hero } from "./hero";
import { Stats } from "./stats";
import { PartnersShowcase } from "./partner-showcase";
import { Programmes } from "./programmes";
import { ScrollImageBand } from "./scroll-image";
import { Skills } from "./skills";
import { Fees } from "./fees";
import { OccupationalCertificates } from "./occupational-certificates";
import { DepartmentsStudy } from "./departments";
import { SuggestionBox } from "@/components/suggestion-box";
import { SalesPortal } from "./sales";
import { Contact } from "./contacts";
import { Footer } from "./footer";

// ============================ Static Images =============================== //
import StudentGrad from "/assets/gallery2.jpg";
import TertiaryExperience from "/assets/gallery6.jpg";
import GradOfTwo from "/assets/gallery7.jpg";

// Landing Page Component
export function Landing({ data, setData, onApply }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  onApply: () => void
}) {
  return (
    <div className="public-page">
      <Hero onApply={onApply} />
      <Stats />
      {/* <AccreditationBodies /> */}
      {/* <PartnersShowcase /> */}
      <About />
      <Programmes onApply={onApply} />
      <ScrollImageBand image={StudentGrad} eyebrow="Talent on demand" title="Learning that moves with the world of work." />
      <Skills data={data} setData={setData} />
      <Apprenticeships data={data} setData={setData} />
      <ScrollImageBand image={GradOfTwo} eyebrow="Workplace experience" title="Confidence built in the workshop, carried into the workplace." />
      <Fees />
      {/* <OccupationalCertificates /> */}
      {/* <DepartmentsStudy /> */}
      <section className="quote-band">
        <div className="container bg-white/[.05] p-6 boarder-radius rounded-xl flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <Star className="h-7 w-7 text-[#D4AF37]" />
            <p className="mt-4 max-w-3xl font-display text-2xl leading-tight text-white md:text-3xl">“Thanks to MITC and Department of Higher Education. I obtained my Diploma in Auto Electrical Engineering, it was not an easy journey, repeated some modules twice. I am now self-employed; running a sole-service trader company and afford a living.”</p>
            <p className="mt-4 text-sm text-white/45">— Phinda Dlamini, Auto Electrical</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <div className="avatar-large bg-white/10 text-white">PD</div>
            <div>
              <p className="text-sm font-semibold text-white">Graduate story</p>
              <p className="text-xs text-white/45">Engineering · 2025</p>
            </div>
          </div>
        </div>
      </section>
      <ScrollImageBand image={TertiaryExperience} eyebrow="Your voice matters" title="A better learning experience starts with a conversation." />
      <SuggestionBox data={data} setData={setData} />
      {/* <SalesPortal /> */}
      <Contact />
      <Footer />
    </div>
  );
}