import { useState } from "react";
import type { FormEvent } from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/button";
import { ArrowRight } from "lucide-react";


// Student Authentication Component
export function StudentAuth({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<"login" | "forgot" | "reset">("login");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (mode === "login") {
      const email = String(f.get("email") || "");
      const number = String(f.get("studentNo") || "");
      const password = String(f.get("password") || "");
      if (email === "thabo.mokoena@example.com" && number === "NSTC-26-0014" && password === (localStorage.getItem("nstc-password") || "nstc2026")) {
        localStorage.setItem("nstc-portal-session", "active");
        onAuthenticated();
      } else setError("Invalid credentials. Use correct student details or reset your password.");
    } else if (mode === "forgot") {
      setMessage("If the account exists, request a reset link.");
      setMode("reset");
    } else {
      const next = String(f.get("newPassword") || "");
      if (next.length < 6) setError("Use at least 6 characters.");
      else {
        localStorage.setItem("nstc-password", next);
        setMessage("Password updated. You can now sign in.");
        setMode("login");
      }
    }
  };

  return (
    <div className="registration-page">
      <div className="registration-top">
        <Logo light />
        <a href="/" className="text-sm font-semibold text-white/60">Back to website</a>
      </div>
      <div className="registration-card max-w-[520px]">
        <p className="eyebrow">Secure student access</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950">
          {mode === "login" ? "Welcome back." : mode === "forgot" ? "Recover your access." : "Set a new password."}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {mode === "login"
            ? "Sign in with your NSTC learner details to view your academic workspace."
            : mode === "forgot"
              ? "Enter your student email and we will guide you through a password reset."
              : "Choose a new password for your student portal account."
          }
        </p>
        {message && <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={submit} className="mt-7 space-y-5">
          {mode !== "reset" &&
            <>
              <label>Email address<input name="email" className="field" type="email" required placeholder="student@email.com" /></label>
              <label>Student number<input name="studentNo" className="field" required placeholder="NSTC-26-0014" /></label>
            </>
          }
          {mode === "login" && <label>Password<input name="password" className="field" type="password" required placeholder="Your password" /></label>}
          {mode === "reset" && <label>New password<input name="newPassword" className="field" type="password" required placeholder="At least 6 characters" /></label>}
          <Button type="submit" className="w-full justify-center mt-8">{mode === "login" ? "Sign in to student portal" : mode === "forgot" ? "Send reset instructions" : "Save new password"} <ArrowRight className="h-4 w-4" /></Button>
        </form>
        <div className="mt-6 flex flex-wrap justify-between gap-3 text-sm font-semibold text-slate-500">
          {mode === "login"
            ? <button onClick={() => { setMode("forgot"); setError(""); }}>Forgot password?</button>
            : <button onClick={() => { setMode("login"); setError(""); }}>Back to sign in</button>
          }
          <a href="/parent">Family / next-of-kin access</a>
        </div>
      </div>
    </div>
  );
}