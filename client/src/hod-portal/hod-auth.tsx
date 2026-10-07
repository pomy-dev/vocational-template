import { useState } from "react";
import { Button } from "@/components/button";
import { ShieldCheck } from "lucide-react";
import { Field } from "@/components/field";
import { Logo } from "@/components/logo";

export function HodAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [error, setError] = useState("");
  return (
    <div className="registration-page">
      <div className="registration-top"><Logo light />
        <a href="/" className="text-sm font-semibold text-white/60">Back to website</a>
      </div>
      <div className="registration-card max-w-[520px]">
        <ShieldCheck className="text-[#916e0a]" />
        <p className="eyebrow mt-4">MITC · Department leadership</p>
        <h1 className="mt-2 font-display text-3xl">HOD portal</h1>
        <p className="mt-2 text-sm text-slate-500">
          Sign in to review your department's students, staff and reports.
        </p>
        <form
          className="mt-6 space-y-4"
          onSubmit={e => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            if (
              f.get("email") === "hod@nstc.example" &&
              f.get("password") === "hod2026"
            ) {
              localStorage.setItem("nstc-hod-session", "active");
              onAuthenticated();
            } else setError("Demo login: hod@nstc.example / hod2026");
          }}
        >
          <Field label="Email">
            <input name="email" className="field" type="email" required />
          </Field>
          <Field label="Password">
            <input name="password" className="field" type="password" required />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full justify-center" type="submit">
            Sign in to HOD portal
          </Button>
        </form>
        <p className="mt-5 text-xs text-slate-500">
          Demo credentials: hod@nstc.example · hod2026
        </p>
      </div>
    </div>
  );
}