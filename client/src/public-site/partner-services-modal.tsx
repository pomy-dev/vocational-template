import { useEffect } from "react";
import { Check, ShieldCheck, ArrowRight, X } from "lucide-react";
import { partnerServices } from "@/lib/data";

// Partner Service Modal Component
export function PartnerServiceModal({ service, onClose }: { service: typeof partnerServices[number]; onClose: () => void }) {

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div className="service-modal p-6" role="dialog" aria-modal="true" aria-labelledby="service-modal-title">
      <button className="service-modal-backdrop" aria-label="Close service details" onClick={onClose} />
      <section className="service-modal-panel">
        <div className="service-modal-header">
          <div>
            <p className="eyebrow text-[#D4AF37]">{service.kicker}</p>
            <h2 id="service-modal-title" className="mt-3 font-display text-3xl text-white md:text-5xl">{service.title}</h2>
          </div>
          <button className="service-close" onClick={onClose} aria-label="Close service details">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="service-modal-body">
          <p className="max-w-3xl text-lg leading-8 text-white/75">{service.summary}</p>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <p className="eyebrow text-[#D4AF37]">Who it is for</p>
              <p className="mt-3 text-sm leading-7 text-white/70">{service.who}</p>
            </div>
            <div>
              <p className="eyebrow text-[#D4AF37]">Expected outputs</p>
              <ul className="mt-3 space-y-3 text-sm leading-6 text-white/70">
                {service.deliverables.map((item) =>
                  <li key={item}><Check className="mr-2 inline h-4 w-4 text-[#D4AF37]" />{item}</li>
                )}
              </ul>
            </div>
          </div>
          <div className="service-guardrail mt-10">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#D4AF37]" />
            <p><strong className="text-white">Responsible-service note.</strong> {service.guardrail}</p>
          </div>
          <a className="btn btn-gold mt-10" href="#contact" onClick={onClose}>Request a consultation <ArrowRight className="h-4 w-4" /></a>
        </div>
      </section>
    </div>
  );
}