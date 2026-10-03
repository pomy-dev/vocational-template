import { PortalShell } from "@/components/portal-shell";
import { toast } from "sonner";
import { fee } from "@/const";
import { AppData } from "@/lib/types";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { MetricCard } from "@/components/metric-card";
import { Download, FileText, CircleDollarSign, Plus, WalletCards } from "lucide-react";

export async function AdminFinance({ data, navigate }: {
  data: AppData;
  navigate: (path: string) => void
}) {
  return (
    <PortalShell role="Admin" active="/admin/finance" onNavigate={navigate}>
      <PageHeading eyebrow="Finance desk" title="Payments & statements" body="Update learner payments and print account statements."
        actions={
          <Button onClick={() => toast.success("Finance report downloaded.")}><Download className="h-4 w-4" /> Export report</Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Collected this month" value={fee(32500)} detail="+14% versus last month" icon={CircleDollarSign} tone="green" />
        <MetricCard label="Outstanding" value={fee(data.students.reduce((sum, s) => sum + s.balance, 0))} detail={`${data.students.filter((s) => s.balance > 0).length} learners owing`} icon={WalletCards} tone="red" />
        <MetricCard label="Payment records" value="128" detail="Across both campuses" icon={FileText} />
      </div>
      <div className="mt-6 portal-card">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Learner</th>
                <th>Programme</th>
                <th>Balance</th>
                <th>Last payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.students.map((s) =>
                <tr key={s.id}>
                  <td className="font-semibold">{s.name}</td>
                  <td>{s.course}</td>
                  <td className={s.balance ? "font-bold text-red-600" : "text-emerald-600"}>{s.balance ? fee(s.balance) : "Clear"}</td>
                  <td>03 Mar 2026 · {fee(s.balance ? 3000 : 500)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Button variant="light" onClick={() => toast.success("Payment update form opened.")}><Plus className="h-4 w-4" /> Payment</Button>
                      <button className="icon-btn" onClick={() => toast.success("Learner statement downloaded.")}><Download /></button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PortalShell>
  );
}