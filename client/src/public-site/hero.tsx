import { useState } from "react";
import { ChevronDown, Play, ArrowRight } from "lucide-react";
import { PublicNav } from "./nav";
import { Button } from "@/components/button";
import { PartnerServicesFeature } from "./partner-service-features";
import { SponsorPanel } from "./sponsor-panel";

// Hero Section Component
export function Hero({ onApply }: { onApply: () => void }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <section className="hero">
      <div className="hero-grid" />
      <PublicNav onApply={onApply} />
      <div className="container relative grid min-h-[660px] items-center gap-10 pb-16 pt-20 lg:grid-cols-[1.05fr_.95fr] mt-12">
        <div className="max-w-2xl">
          <div className="eyebrow text-[#D4AF37]">Future Skills · Skills In Demand · Learn Today Lead Tomorrow</div>
          <h1 className="mt-5 font-display text-4xl leading-[.98] text-white md:text-8l">Fighting Unemployment <span className="gold-text">& Poverty Through Education.</span></h1>
          <div className="mt-7 max-w-xl text-lg leading-8 text-white/65">
            <p>An Occupational Certificate is a nationally recognized qualification developed by the Quality Council for Trades and Occupations.</p>
            <div id="certificate-outcomes" className="mt-5 border-l-2 border-[#D4AF37] pl-5 text-base leading-7 text-white/70">
              <p className="mb-3 text-sm font-bold uppercase tracking-[.16em] text-white/45">It equips you with</p>
              <ul className="space-y-3">
                <li><strong className="text-white">Knowledge</strong><span className="text-white/45"> · Theory</span> — concepts and principles for your chosen occupation.</li>
                <li><strong className="text-white">Practical skills</strong> — hands-on training in a simulated or controlled environment.</li>
                <li><strong className="text-white">Workplace experience</strong> — real-life training in a workplace setting.</li>
              </ul>
            </div>
          </div>

          {/* Application handles */}
          <div className="mt-9 flex flex-wrap gap-3">
            <Button onClick={onApply}>Start your application <ArrowRight className="h-4 w-4" /></Button>
            <a className="hero-link" href="#programmes"><Play className="h-4 w-4 fill-current" /> Explore programmes</a>
          </div>

          {/* partners for services */}
          {/* <PartnerServicesFeature /> */}

        </div>
        <SponsorPanel />
      </div>
    </section>
  );
}