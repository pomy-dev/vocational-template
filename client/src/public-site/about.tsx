import { HeartHandshake, ShieldCheck } from "lucide-react";
import { SectionTitle } from "@/components/section-title";

// ============================ Static Images =============================== //
import DayOne from "/assets/gallery3.jpg";

// About Section Component
export function About() {
  return (
    <section id="about" className="section-pad bg-[#f2f5fa]">
      <div className="container grid gap-14 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        {/* histor card */}
        <div className="about-art">
          <div className="about-art-inner about-image-art" style={{ backgroundImage: `linear-gradient(145deg, rgba(10,10,10,.25), rgba(10,10,10,.72)), url(${DayOne})` }}>
            <span className="eyebrow text-[#D4AF37]">Since day one</span>
            <div className="flex items-end justify-between">
              <span className="font-display text-2xl text-white">We teach skills<br />to change lives.</span>
              <span className="text-right text-xs uppercase tracking-widest text-white/65">Manzini</span>
            </div>
          </div>
        </div>

        <div>
          <SectionTitle eyebrow="The NSTC difference" title="Education that meets the real world." body="National Skills & Technical College brings together academic knowledge, workshop confidence and the kind of mentorship that helps learners take the next step. Our classrooms are designed around opportunity: for school leavers, working adults, companies and communities." />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="feature-line">
              <ShieldCheck className="text-[#a27e10]" />
              <div>
                <h4>Recognised pathways</h4>
                <p>TVET, Ministry Of Education, Ministry Of Labour and ESHEC-aligned learning options.</p>
              </div>
            </div>
            <div className="feature-line">
              <HeartHandshake className="text-[#a27e10]" />
              <div>
                <h4>Mentorship included</h4>
                <p>Guidance from registration through to graduation and work.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}