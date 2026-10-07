import { useState } from "react";
import { Button } from "@/components/button";
import { ShieldCheck } from "lucide-react";
import { Field } from "@/components/field";
import { Logo } from "@/components/logo";

export function ItAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [e, setE] = useState("");
  return (
    <div className="registration-page">
      <div className="registration-top"><Logo light />
        <a href="/" className="text-sm font-semibold text-white/60">Back to website</a>
      </div>
      <div className="registration-card max-w-[520px]">
        <ShieldCheck className="text-[#916e0a]" />
        <p className="eyebrow mt-4">Protected operations</p>
        <h1 className="mt-2 font-display text-3xl">IT Officer sign in</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={ev => {
            ev.preventDefault();
            const f = new FormData(ev.currentTarget);
            if (
              f.get("email") === "it@nstc.example" &&
              f.get("password") === "it2026"
            ) {
              localStorage.setItem("nstc-it-session", "active");
              onAuthenticated();
            } else setE("Demo login: it@nstc.example / it2026");
          }}
        >
          <Field label="Email">
            <input className="field" name="email" type="email" required />
          </Field>
          <Field label="Password">
            <input className="field" name="password" type="password" required />
          </Field>
          {e && <p className="text-sm text-red-600">{e}</p>}
          <Button className="w-full justify-center" type="submit">Open IT operations</Button>
        </form>
        <p className="mt-5 text-xs text-slate-500">
          Demo credentials: it@nstc.example · it2026
        </p>
      </div>
    </div>
  );
}