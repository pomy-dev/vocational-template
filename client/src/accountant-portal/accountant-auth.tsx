import { useState } from "react";
import { Button } from "@/components/button";
import { WalletCards } from "lucide-react";
import { Field } from "@/components/field";
import { Logo } from "@/components/logo";

export function AccountantAuth({
  onAuthenticated,
}: {
  onAuthenticated: () => void;
}) {
  const [error, setError] = useState("");
  return (
    <div className="registration-page">
      <div className="registration-top"><Logo light />
        <a href="/" className="text-sm font-semibold text-white/60">Back to website</a>
      </div>
      <div className="registration-card max-w-[520px]">
        <WalletCards className="text-[#916e0a]" />
        <p className="eyebrow mt-4">MITC · Finance office</p>
        <h1 className="mt-2 font-display text-3xl">Accountant portal</h1>
        <form
          className="mt-6 space-y-4"
          onSubmit={e => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            if (
              f.get("email") === "accounts@nstc.example" &&
              f.get("password") === "accounts2026"
            ) {
              localStorage.setItem("nstc-accounting-session", "active");
              onAuthenticated();
            } else setError("Demo login: accounts@nstc.example / accounts2026");
          }}
        >
          <Field label="Email">
            <input name="email" className="field" type="email" required />
          </Field>
          <Field label="Password">
            <input name="password" className="field" type="password" required />
          </Field>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full justify-center" type="submit">Sign in to finance</Button>
        </form>
        <p className="mt-5 text-xs text-slate-500">
          Demo credentials: accounts@nstc.example · accounts2026
        </p>
      </div>
    </div>
  );
}