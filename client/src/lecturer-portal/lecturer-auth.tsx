import { useState } from "react";
import type { FormEvent } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/button";
import { ArrowRight } from "lucide-react";


export function LecturerAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [error, setError] = useState("");

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    if (email === "lecturer@nstc.example" && password === "lecturer2026") {
      localStorage.setItem("nstc-lecturer-session", "active");
      onAuthenticated();
    } else setError("Demo login: lecturer@nstc.example · lecturer2026");
  };

  return (
    <div className="registration-page">
      <div className="registration-top">
        <Logo light /><a href="/" className="text-sm font-semibold text-white/60">Back to website</a>
      </div>
      <div className="registration-card max-w-[520px]">
        <p className="eyebrow">Lecturer & tutor access</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950">Lead learning with clarity.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Sign in to manage classes, resources, attendance, assessments and student progress.</p>
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label>Email address<input className="field" name="email" type="email" required placeholder="lecturer@nstc.example" /></label>
          <label>Password<input className="field" name="password" type="password" required placeholder="Your password" /></label>
          <Button type="submit" className="w-full justify-center mt-6">Sign in to lecturer portal <ArrowRight className="h-4 w-4" /></Button>
        </form>
        <p className="mt-7 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">Demo credentials: <strong>lecturer@nstc.example</strong> with password <strong>lecturer2026</strong>.</p>
      </div>
    </div>
  );
}