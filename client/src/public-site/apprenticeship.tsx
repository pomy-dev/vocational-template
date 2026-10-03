import { useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Check, MapPin } from "lucide-react";
import { SectionTitle } from "@/components/section-title";
import { Pill } from "@/components/pill";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";
import type { AppData, ApprenticeshipPost } from "../lib/types";

// Apprenticeships Section Component
export function Apprenticeships({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [selected, setSelected] = useState<ApprenticeshipPost | null>(null);
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setData((old) => ({
      ...old,
      suggestions: [...old.suggestions, {
        id: crypto.randomUUID(),
        name: String(f.get("name") || "Applicant"),
        email: String(f.get("email") || ""),
        category: `Apprenticeship application: ${selected?.title || "Open role"}`,
        message: `CV submitted: ${String(f.get("cv") || "No filename")}`,
        date: new Date().toISOString().slice(0, 10)
      }]
    }));

    setSent(true);
  };

  return (
    <section id="apprenticeships" className="section-pad bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionTitle eyebrow="Workplace experience" title="Your next opportunity starts here." body="Browse live internship and apprenticeship opportunities from NSTC industry partners. Submit your CV through our application sub-portal." />
          <Pill tone="green">{data.apprenticeships.length} open opportunities</Pill>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {data.apprenticeships.map((post) =>
            <article key={post.id} className="rounded-2xl border border-slate-200 bg-[#f2f5fa] p-6 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between gap-3">
                <Pill>{post.type}</Pill>
                <span className="text-xs text-slate-400">Closes {post.closing}</span>
              </div>
              <h3 className="mt-5 font-display text-2xl text-slate-950">{post.title}</h3>
              <p className="mt-2 text-sm font-semibold text-[#8b6b12]">{post.employer}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{post.description}</p>
              <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                <MapPin className="h-4 w-4 text-[#a27e10]" />{post.location}
              </p>
              <Button className="mt-6 w-full justify-center" onClick={() => { setSelected(post); setSent(false); }}>Apply with CV <ArrowRight className="h-4 w-4" /></Button>
            </article>
          )}
        </div>
      </div>
      {selected &&
        <Modal title={sent ? "Application received" : `Apply: ${selected.title}`} onClose={() => setSelected(null)}>
          {sent
            ?
            (
              <div className="py-8 text-center">
                <Check className="mx-auto h-10 w-10 text-emerald-600" />
                <h3 className="mt-4 font-display text-2xl">CV submitted successfully.</h3>
                <p className="mt-2 text-sm text-slate-600">The partner employer and NSTC placement team can now review your profile.</p>
                <Button className="mt-6" onClick={() => setSelected(null)}>Close</Button>
              </div>
            )
            :
            (
              <form onSubmit={submit} className="mt-5 space-y-4">
                <p className="rounded-xl bg-[#fbf7e8] p-4 text-sm text-slate-600">Applying for <strong className="text-slate-950">{selected.title}</strong> with {selected.employer}.</p>
                <label>Full name
                  <input name="name" className="field" required />
                </label>
                <label>Email address
                  <input name="email" className="field" type="email" required />
                </label>
                <label>Phone number
                  <input name="phone" className="field" required />
                </label>
                <label>Upload CV
                  <input name="cv" className="field" type="file" accept=".pdf,.doc,.docx" required />
                </label>
                <p className="text-xs leading-5 text-slate-400">Prototype note: your CV filename and application details are stored locally; production should connect this to secure file storage.</p>
                <Button type="submit" className="w-full justify-center">Submit application <ArrowRight className="h-4 w-4" /></Button>
              </form>
            )
          }
        </Modal>
      }
    </section>
  );
}