import { useState } from "react";
import type { FormEvent } from "react";
import { AppData } from "@/lib/types";
import { initials } from "@/const";
import { SectionTitle } from "@/components/section-title";
import { MapPin, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/button";
import { Modal } from "@/components/modal";



// Skills Section Component
export function Skills({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [category, setCategory] = useState("All skills");
  const [requestOpen, setRequestOpen] = useState(false);
  const [selected, setSelected] = useState("Artisans");
  const [done, setDone] = useState(false);
  const categories = ["All skills", "Artisans", "Carpentry", "Computer", "Plumbing", "Building"];
  const graduates = [
    {
      name: "Ayanda Ndlovu",
      skill: "Bricklayer",
      category: "Building",
      place: "Manzini"
    },
    {
      name: "Bongwa Simelane",
      skill: "Beautisan",
      category: "Artisans",
      place: "Manzini"
    },
    {
      name: "Ayanda Khumalo",
      skill: "Wood-Work",
      category: "Carpentry",
      place: "Matsapha"
    },
    {
      name: "Mpho Mthembu",
      skill: "Microsoft Office",
      category: "Computer",
      place: "Zulwini"
    },
    {
      name: "Melusi Tsela",
      skill: "Plumber",
      category: "Plumbing",
      place: "Manzini"
    }
  ];

  const visible = category === "All skills" ? graduates : graduates.filter((g) => g.category === category);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setData((old) => ({
      ...old,
      graduateRequests: [...old.graduateRequests,
      {
        id: crypto.randomUUID(),
        category: selected,
        quantity: Number(form.get("quantity") || 1),
        requester: String(form.get("requester") || "Company partner"),
        email: String(form.get("email") || ""),
        status: "New"
      }]
    }));
    setDone(true);
  };

  return (
    <section id="skills" className="section-pad bg-[#f2f5fa]">
      <div className="container">
        <SectionTitle eyebrow="Talent on demand" title="The hands that keep Eswatini moving." body="Our artisan, operator and occupational graduates leave with practical confidence. Companies can request talent by category and let our placement team make the connection." />
        <div className="mt-9 flex flex-wrap gap-2">{categories.map((item) => <button key={item} className={`filter-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {visible.map((graduate) => <div key={graduate.name} className="graduate-card">
            <div className="avatar-large">{initials(graduate.name)}</div>
            <div className="mt-5">
              <p className="eyebrow">{graduate.category}</p>
              <h3 className="mt-1 font-display text-xl text-slate-950">{graduate.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{graduate.skill}</p>
              <p className="mt-4 flex items-center gap-1 text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5" /> {graduate.place}</p>
            </div>
          </div>
          )}
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#d9cfb3] bg-[#fbf7e8] p-6 md:flex-row md:items-center">
          <div>
            <p className="eyebrow text-[#a27e10]">For employers & project partners</p>
            <h3 className="mt-2 font-display text-2xl text-slate-950">Request a graduate for your next team.</h3>
          </div>
          <Button onClick={() => { setDone(false); setRequestOpen(true); }}>Request graduate <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>
      {requestOpen &&
        (
          <Modal title="Request NSTC graduates" onClose={() => setRequestOpen(false)}>
            {done ? (
              <div className="py-7 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Check />
                </div>
                <h4 className="mt-4 font-display text-2xl">Request received.</h4>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">Our placement team will contact you with suitable graduate profiles.</p>
                <Button className="mt-6" onClick={() => setRequestOpen(false)}>Done</Button>
              </div>
            ) :
              (
                <form onSubmit={submit} className="mt-5 space-y-4">
                  <label>Skill category
                    <select name="category" value={selected} onChange={(e) => setSelected(e.target.value)} className="field">
                      <option>Artisan / Trade Testing</option>
                      <option>Machine operators</option>
                      <option>QCTO graduates</option>
                    </select>
                  </label>
                  <label>Number of graduates
                    <input name="quantity" className="field" type="number" min="1" defaultValue="1" />
                  </label>
                  <label>Company / requester
                    <input name="requester" className="field" required placeholder="Your organisation" />
                  </label>
                  <label>Work email
                    <input name="email" className="field" type="email" required placeholder="name@company.co.za" />
                  </label>
                  <div className="flex justify-end gap-3 pt-3">
                    <Button variant="light" onClick={() => setRequestOpen(false)}>Cancel</Button>
                    <Button type="submit">Send request <ArrowRight className="h-4 w-4" /></Button>
                  </div>
                </form>
              )}
          </Modal>
        )
      }
    </section>
  );
}