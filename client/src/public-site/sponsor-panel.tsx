import { useEffect, useState } from "react";
import { HeartHandshake, ArrowUpRight, Award, Users, BookOpen } from "lucide-react";

// Sponsor Panel Component
export function SponsorPanel() {

  const messages = [
    { title: "Compliance & financial benefits", body: "Tax exemptions · B-BBEE scorecard integration · WSP / ATR alignment · SDL grants · CSI compliance", background: "/assets/gallery12.jpg", variant: "slide-left" },
    { title: "Direct sponsorship opportunities", body: "Sponsor a student or an AI laptop and connect your contribution to practical community skills.", background: "/assets/gallery4.jpg", variant: "spin-front" },
    { title: "Community upliftment ethos", body: "We rise by lifting others · Sivuka ngokuphakamisa abanye · Ons styg deur ander op te hef", background: "/assets/gallery9.jpg", variant: "slide-right" }
  ];

  const [active, setActive] = useState(0);
  const principles = [
    { label: "Love", icon: HeartHandshake },
    { label: "Support", icon: Users },
    { label: "Education", icon: BookOpen }
  ];

  useEffect(() => {
    const timer = window.setInterval(() => setActive((old) => (old + 1) % messages.length), 5200);
    return () => window.clearInterval(timer);
  }, [messages.length]);

  return (
    <div className="hero-card-wrap">
      <div className="hero-card sponsor-card">
        <div className="flex items-start justify-between">
          <span className="eyebrow text-white/45">Latest Updates</span>
          <span className="rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-black">News & Gallery</span>
        </div>
        <div className="sponsor-message-stack" aria-live="polite">
          {messages[active] && (
            <div
              key={active}
              className={`sponsor-message sponsor-message--${messages[active].variant} is-active`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(16, 24, 40, 0.15), rgba(9, 11, 18, 0.72)), url(${messages[active].background})`
              }}
            >
              <p className="text-sm text-[#f7d77e]">Manzini Industrial Training Center</p>
              <h3 className="mt-3 max-w-md font-display text-3xl leading-tight text-white">{messages[active].title}</h3>
              <p className="mt-4 text-sm leading-6 text-white/70">{messages[active].body}</p>
            </div>
          )}
        </div>
        <div className="mt-9 flex gap-2">
          {messages.map((_, i) =>
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i === active ? "bg-[#D4AF37]" : "bg-white/15"}`} />
          )}
        </div>

        <div className="mt-7 border-t border-white/10 pt-5">
          <a href="#contact" className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15">Talk to partnerships <ArrowUpRight className="h-4 w-4" /></a>
        </div>

        <div className="mt-5 space-y-3">
          <div className="sponsor-principles">
            {principles.map(({ label, icon: Icon }) => (
              <div key={label} className="sponsor-principle">
                <span className="sponsor-principle-icon"><Icon className="h-4 w-4" /></span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p className="sponsor-verse">Philippians 4:13 — I Can Do All Things Through Christ</p>
        </div>
      </div>
      <div className="hero-stamp">
        <Award className="h-5 w-5" />
        <span>ESHEC<br /><b>Verified</b></span>
      </div>
    </div>
  );
}