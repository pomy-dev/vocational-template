import { Logo } from "@/components/logo";
import { corporateReferences } from "@/lib/data";
import { ExternalLink } from "lucide-react";

// Footer
export function Footer() {
  return (
    <footer className="bg-[#071a3a] py-12 text-white">
      <div className="container grid gap-10 lg:grid-cols-[1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/45">We Teach Skills to Change Lives. Your Future, Is Our Concern.</p>
        </div>
        <div>
          <p className="eyebrow text-[#D4AF37]">Bank details</p>
          <div className="mt-4 space-y-2 text-sm text-white/60">
            <p>First National Bank · Business Account</p>
            <p>Account number: <strong className="text-white">62447593436</strong></p>
            <p>Branch code: <strong className="text-white">250655</strong></p>
            <p>Reference: Initials & Surname</p>
          </div>
        </div>
        <div>
          <p className="eyebrow text-[#D4AF37]">Admission requirements</p>
          <ul className="mt-4 space-y-2 text-sm text-white/60">
            <li>Copies of relevant qualification</li>
            <li>Copy of ID, passport or asylum permit</li>
            <li>Completed registration form</li>
            <li>Payment of deposit</li>
          </ul>
        </div>
      </div>
      <div className="container mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/30 md:flex-row">
        <span>© 2026 MITC · Accredited learning pathways across Eswatini</span>

        <div className="lg:text-right">
          <p className="eyebrow text-[#D4AF37]">Technology partner</p>
          <p className="mt-3 text-sm text-white/60">Powered by: <a className="font-bold text-white underline decoration-[#D4AF37] underline-offset-4" href="https://indabuko-global.vercel.app" target="_blank" rel="noreferrer">Indabuko Tech Crafts</a></p>
          <p className="mt-2 text-sm text-white/60">Call <a className="text-white" href="tel:+26876957019">+268 78575 9259 / +268 7695 7019</a></p>
        </div>
      </div>
    </footer>
  );
}