import { AppData } from "@/lib/types";
import { PageHeading } from "@/components/page-heading";
import { Button } from "@/components/button";
import { toast } from "sonner";
import { MetricCard } from "@/components/metric-card";
import { fee } from "@/const";
import { Download, CircleDollarSign, WalletCards, CalendarDays } from "lucide-react";
import { Pill } from "@/components/pill";

// Student Finances Component
export function StudentFinances({ data }: { data: AppData }) {
  return (
    <>
      <PageHeading eyebrow="Account & payments" title="Your finances" body="A transparent view of your registration, tuition and account balance."
        actions={
          <Button onClick={() => toast.success("Payment statement generated.")}><Download className="h-4 w-4" /> Download statement</Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard label="Paid this year" value={fee(6500)} detail="3 recorded payments" icon={CircleDollarSign} tone="green" />
        <MetricCard label="Outstanding" value={fee(data.students[0].balance)} detail="No payment due" icon={WalletCards} />
        <MetricCard label="Next instalment" value="03 Jul" detail={fee(3000)} icon={CalendarDays} />
      </div>
      <div className="mt-6 portal-card">
        <p className="eyebrow">Payment history</p>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.payments.map((p) =>
                <tr key={p.id}>
                  <td className="font-semibold">{p.label}</td>
                  <td>{p.date}</td>
                  <td>{fee(p.amount)}</td>
                  <td><Pill tone="green">{p.status}</Pill></td>
                  <td>
                    <button className="icon-btn" onClick={() => toast.success("Receipt downloaded.")}><Download /></button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}