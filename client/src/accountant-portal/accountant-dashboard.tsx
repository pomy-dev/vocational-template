import { useState } from "react";
import type { AppData } from "@/lib/types";
import { PortalShell } from "@/components/portal-shell";
import { PageHeading } from "@/components/page-heading";
import { MetricCard } from "@/components/metric-card";
import { Button } from "@/components/button";
import { toast } from "sonner";
import {
  ClipboardCheck,
  WalletCards,
  Printer,
  Bell,
  CircleDollarSign,
} from "lucide-react";
import { FeePlanEditor } from "@/accountant-portal/fee-plan-editor";
import { PaymentRecorder } from "@/accountant-portal/payment-recorder";
import { exportCsv, currency } from "@/lib/utils";

export function AccountantWorkspace({
  data,
  setData,
  path,
  navigate,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (p: string) => void;
}) {
  const [filter, setFilter] = useState("All courses"),
    [selected, setSelected] = useState<string[]>([]),
    [email, setEmail] = useState(
      "Payment reminder: your next tuition instalment is due soon. Please contact the finance office if you need assistance."
    );
  const fees = data.feePlans || [];
  const ledger = data.ledgerEntries || [];
  const filtered = data.students.filter(
    s => filter === "All courses" || s.course === filter
  );
  const paid = ledger
    .filter(x => x.kind === "Payment")
    .reduce((a, x) => a + x.amount, 0);
  const owed = filtered.reduce((a, s) => a + s.balance, 0);
  const due = filtered.filter(s => s.balance > 0);
  const reminders = filtered.filter(s => selected.includes(s.id));
  return (
    <PortalShell role="Accountant" active="/accounting" onNavigate={navigate}>
      <PageHeading
        eyebrow="Finance office"
        title="Student accounts & fee ledger"
        body="Allocate course fees and payment intervals, record transactions, review balances and prepare student statements. Prepared by Thandi Maseko · Accountant · Demo data."
        actions={
          <Button onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
            Print finance report
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Accumulated payments"
          value={currency(paid)}
          detail="Recorded ledger entries"
          icon={CircleDollarSign}
        />
        <MetricCard
          label="Outstanding balance"
          value={currency(owed)}
          detail="Filtered student accounts"
          icon={WalletCards}
        />
        <MetricCard
          label="Due accounts"
          value={due.length}
          detail="Students with amount owed"
          icon={Bell}
        />
        <MetricCard
          label="Recent payments"
          value={ledger.filter(x => x.kind === "Payment").slice(0, 3).length}
          detail="Latest ledger entries"
          icon={ClipboardCheck}
        />
      </div>
      <section className="portal-card mt-5">
        <p className="eyebrow">Course fee schedule</p>
        <h3 className="mt-2 font-display text-2xl">Fees & payment intervals</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Total fee</th>
                <th>Intervals</th>
                <th>Payment options</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(f => (
                <tr key={f.course}>
                  <td>{f.course}</td>
                  <td>{currency(f.total)}</td>
                  <td>{f.intervals.join(" · ")}</td>
                  <td>{f.options.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <FeePlanEditor data={data} setData={setData} />
      <div className="portal-card mt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Student financial statements</p>
            <h3 className="mt-2 font-display text-2xl">Ledger & balances</h3>
          </div>
          <select
            className="field max-w-xs"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option>All courses</option>
            {Array.from(new Set(data.students.map(s => s.course))).map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Student</th>
                <th>Course</th>
                <th>Fees</th>
                <th>Paid</th>
                <th>Owed</th>
                <th>Statement</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const entries = ledger.filter(x => x.studentId === s.id);
                const p = entries
                  .filter(x => x.kind === "Payment")
                  .reduce((a, x) => a + x.amount, 0);
                const f =
                  fees.find(x => x.course === s.course)?.total || s.balance + p;
                return (
                  <tr key={s.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selected.includes(s.id)}
                        onChange={e =>
                          setSelected(v =>
                            e.target.checked
                              ? [...v, s.id]
                              : v.filter(x => x !== s.id)
                          )
                        }
                      />
                    </td>
                    <td>
                      {s.name}
                      <small className="block text-slate-400">
                        {s.studentNo}
                      </small>
                    </td>
                    <td>{s.course}</td>
                    <td>{currency(f)}</td>
                    <td>{currency(p)}</td>
                    <td>{currency(s.balance)}</td>
                    <td>
                      <button
                        className="filter-chip"
                        onClick={() => {
                          exportCsv(`statement-${s.studentNo}`, [
                            ["Financial statement", s.name],
                            ["Prepared by", "NSTC Accountant · Thandi Maseko"],
                            ["Date", new Date().toISOString().slice(0, 10)],
                            ["Transaction", "Date", "Amount", "Reference"],
                            ...entries.map(x => [
                              x.label,
                              x.date,
                              x.amount,
                              x.reference,
                            ]),
                            ["Amount owed", s.balance],
                          ]);
                        }}
                      >
                        Download / print
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <h4 className="mt-6 font-semibold">Recent transactions</h4>
        {ledger.slice(0, 8).map(x => (
          <p className="mt-2 border-b py-2 text-sm" key={x.id}>
            {x.date} · {x.studentName} · {x.label} · {currency(x.amount)}{" "}
            <span className="text-slate-400">{x.reference}</span>
          </p>
        ))}
      </div>
      <PaymentRecorder data={data} setData={setData} />
      <div className="portal-card mt-5">
        <p className="eyebrow">Due-date notifications</p>
        <h3 className="mt-2 font-display text-2xl">Payment reminders</h3>
        <p className="mt-2 text-sm text-slate-500">
          Select students above, then prepare individual emails or one bulk
          message. Demo only; no email is sent.
        </p>
        <textarea
          className="field mt-4 min-h-24"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <Button
          className="mt-3"
          onClick={() => {
            if (!reminders.length) {
              toast.error("Select at least one account first.");
              return;
            }
            setData(old => ({
              ...old,
              financeNotices: [
                ...(old.financeNotices || []),
                ...reminders.map(s => ({
                  studentId: s.id,
                  studentName: s.name,
                  email: s.email,
                  message: email,
                  date: new Date().toISOString().slice(0, 10),
                })),
              ],
            }));
            toast.success(
              `Prepared reminder for ${reminders.length} selected account(s); saved to demo notices.`
            );
          }}
        >
          <Bell className="h-4 w-4" />
          Prepare email to selected ({reminders.length})
        </Button>
      </div>
    </PortalShell>
  );
}