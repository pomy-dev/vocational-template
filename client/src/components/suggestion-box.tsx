import { useState } from "react";
import type { FormEvent } from "react";
import { SectionTitle } from "./section-title";
import { Button } from "./button";
import { AppData } from "@/lib/types";
import { ArrowRight, Check } from "lucide-react";

// Suggestion Box Section Component
export function SuggestionBox({ data, setData }: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>
}) {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);

    setData((old) => ({
      ...old,
      suggestions: [...old.suggestions, {
        id: crypto.randomUUID(),
        name: String(f.get("name") || "Anonymous"),
        email: String(f.get("email") || ""),
        category: String(f.get("category") || "General improvement"),
        message: String(f.get("message") || ""),
        date: new Date().toISOString().slice(0, 10)
      }]
    }));

    setSent(true);
  };

  return (
    <section id="suggestions" className="section-pad bg-[#fbf7e8]">
      <div className="container grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <SectionTitle eyebrow="Your voice shapes NSTC" title="Leave a suggestion." body="Tell us what would make your learning, campus or support experience stronger. Suggestions are reviewed by the student success team." />
        {sent
          ?
          (
            <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <Check className="mx-auto h-10 w-10 text-emerald-600" />
              <h3 className="mt-4 font-display text-3xl text-slate-950">Thank you for sharing.</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Your suggestion has been added to the student voice register.</p>
              <Button className="mt-6" onClick={() => setSent(false)}>Share another suggestion</Button>
            </div>
          )
          :
          (
            <form onSubmit={submit} className="rounded-2xl bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,.07)] md:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <label>Your name
                  <input name="name" className="field" placeholder="Optional" />
                </label>
                <label>Email address
                  <input name="email" className="field" type="email" placeholder="Optional" />
                </label>
              </div>
              <label className="mt-5 block">Suggestion type
                <select name="category" className="field">
                  <option>General improvement</option>
                  <option>Teaching & learning</option>
                  <option>Campus facilities</option>
                  <option>Student support</option>
                  <option>Anonymous feedback</option>
                </select>
              </label>
              <label className="mt-5 block">Your suggestion
                <textarea name="message" required className="field min-h-[130px] py-3" placeholder="What should NSTC know?" />
              </label>
              <Button type="submit" className="mt-5">Submit suggestion <ArrowRight className="h-4 w-4" /></Button>
            </form>
          )
        }
      </div>
    </section>
  );
}