import { useState } from "react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { Check } from "lucide-react";


// Student Settings Component
export function StudentSettings({ onSignOut }: { onSignOut: () => void }) {
  const [saved, setSaved] = useState(false);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next = String(f.get("newPassword") || "");
    const confirm = String(f.get("confirmPassword") || "");
    if (next !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }

    if (next.length < 6) {
      toast.error("Use at least 6 characters.");
      return;
    }

    localStorage.setItem("nstc-password", next);
    setSaved(true);
  };

  return (
    <>
      <PageHeading eyebrow="Account settings" title="Keep your account secure" body="Update your student portal password and manage your current session." />
      <div className="grid gap-5 lg:grid-cols-[1fr_.8fr]">
        <div className="portal-card">
          <p className="eyebrow">Change password</p>
          {saved && <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">Password updated successfully.</p>}
          <form onSubmit={submit} className="mt-5 max-w-md space-y-5">
            <label>Current password
              <input name="currentPassword" className="field" type="password" required />
            </label>
            <label>New password
              <input name="newPassword" className="field" type="password" required minLength={6} />
            </label>
            <label>Confirm new password
              <input name="confirmPassword" className="field" type="password" required minLength={6} />
            </label>
            <Button type="submit">Update password <Check className="h-4 w-4" /></Button>
          </form>
        </div>
        <div className="portal-card bg-[#111] text-white">
          <p className="eyebrow text-[#D4AF37]">Session</p>
          <h3 className="mt-3 font-display text-2xl">Thabo Mokoena</h3>
          <div className="mt-5 grid gap-4 text-sm">
            <div><p className="text-xs uppercase tracking-wider text-white/35">Last login</p><p className="mt-1 text-white">08 June 2026 · 08:42</p></div>
            <div><p className="text-xs uppercase tracking-wider text-white/35">User email</p><p className="mt-1 text-white">thabo.mokoena@example.com</p></div>
            <div><p className="text-xs uppercase tracking-wider text-white/35">Current location</p><p className="mt-1 text-white">Wynberg Johannesburg, South Africa</p></div>
            <div><p className="text-xs uppercase tracking-wider text-white/35">Status</p><p className="mt-1 text-[#D4AF37]">Active session</p></div>
          </div>
          <Button variant="light" className="mt-6" onClick={onSignOut}>Sign out</Button>
        </div>
      </div>
    </>
  );
}