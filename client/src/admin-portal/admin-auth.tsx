import { useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/button";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

export function AdminAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [error, setError] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("email") === "admin@nstc.example" && f.get("password") === "admin2026") {
      localStorage.setItem("nstc-admin-session", "active");
      onAuthenticated();
    } else setError("For the demo, use admin@nstc.example / admin2026.");
  };

  return (
    <div className="registration-page">
      <div className="registration-top"><Logo light />
        <a href="/" className="text-sm font-semibold text-white/60">Back to website</a>
      </div>
      <div className="registration-card max-w-[520px]">
        <p className="eyebrow">NSTC secure access</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Manage learners, academics, finance and lecturer accounts.</p>
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-7 space-y-5">
          <label>Email address
            <input className="field" name="email" type="email" required placeholder="admin@nstc.example" />
          </label>
          <label>Password
            <input className="field" name="password" type="password" required />
          </label>
          <Button type="submit" className="w-full justify-center mt-6">Continue to admin dashboard <ArrowRight className="h-4 w-4" /></Button>
        </form>
        <p className="mt-7 rounded-xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">Demo credentials: <strong>admin@nstc.example / admin2026</strong></p>
        {/* <a href="/lecturer" className="mt-5 block text-center text-sm font-semibold text-slate-500">Lecturer login <ArrowRight className="ml-1 inline h-4 w-4" /></a> */}
      </div>
    </div>
  );
}