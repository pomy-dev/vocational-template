import { useState } from "react";
import type { FormEvent } from "react";
import { useAction } from "@/utils/use-action";
import { SectionTitle } from "@/components/section-title";
import { MapView } from "@/components/Map";
import { MapPin, Mail, Phone, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/button";
import { Spinner } from "@/components/spinner";

// Contact Section Component
export function Contact() {
  const [sent, setSent] = useState(false);
  const { loading, run } = useAction();

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    run(() => setSent(true));
  };

  return (
    <section id="contact" className="section-pad bg-[#f2f5fa]">
      <div className="container grid gap-12 lg:grid-cols-[.9fr_1.1fr]">
        {/* locations */}
        <div>
          <SectionTitle eyebrow="Start a conversation" title="Come build your next future with us." body="Visit one of our campuses, call the admissions team, or send a question and we will point you in the right direction." />
          <div className="mt-8 space-y-4">
            <div className="contact-line">
              <MapPin />
              <div>
                <strong>Manzini, Moyeni</strong>
                <span>next to St. Micheals</span>
              </div>
            </div>
            <div className="contact-line">
              <Mail />
              <div>
                <strong>Secretary</strong>
                <span>support@mitc.com</span>
              </div>
            </div>
            <div className="contact-line">
              <Mail />
              <div>
                <strong>Administration</strong>
                <span>admin@mitc.com</span>
              </div>
            </div>
            <div className="contact-line">
              <Phone />
              <div>
                <strong>Admissions desk</strong>
                <span>+268 7623 3500 · Mon–Fri, 08:00–16:30</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,.07)] md:p-10">
          <p className="eyebrow">Admissions enquiry</p>
          {sent ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700"><Check /></div>
              <h3 className="mt-5 font-display text-3xl text-slate-950">Thank you for reaching out.</h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">A member of the NSTC admissions team will respond using the contact details provided.</p>
              <Button className="mt-7" onClick={() => setSent(false)}>Send another message</Button>
            </div>
          ) :
            (
              <form onSubmit={submit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label>First name<input className="field" required /></label>
                  <label>Last name<input className="field" required /></label>
                </div>
                <label>Email address<input className="field" type="email" required /></label>
                <label>What are you interested in?
                  <select className="field">
                    <option>National Certificate</option>
                    <option>Short course</option>
                    <option>Artisan / trade test</option>
                    <option>Corporate sponsorship</option>
                  </select>
                </label>
                <label>Your message<textarea className="field min-h-[120px] py-3" required /></label>
                <Button type="submit" disabled={loading} className="w-full justify-center mt-12">
                  {loading
                    ? (<Spinner label="Sending message" />)
                    : (<>Send enquiry <ArrowRight className="h-4 w-4" /></>)
                  }
                </Button>
              </form>
            )}
        </div>
      </div>
      <div className="container contact-map-email mt-8">
        <div className="h-92 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <MapView
            className="h-full w-full"
            initialCenter={{ lat: -25.94, lng: 28.74 }}
            initialZoom={7}
            // MITC Manzini campus coordinates:
            // -26.484688266900275, 31.381542493924844
            markers={[
              { id: "mitc", lat: -26.484688266900275, lng: 31.381542493924844, label: "Manzini Indusrial Training Center", sublabel: "St Michael's Road, Emakhonweni" }
            ]}
          />
        </div>
      </div>
    </section>
  );
}