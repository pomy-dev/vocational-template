import { useState } from "react";
import type { AppData } from "@/lib/types";
import { Button } from "@/components/button";
import { toast } from "sonner";
import { Field } from "@/components/field";

export function PaymentRecorder({
  data,
  setData,
}: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}) {
  const [studentId, setStudentId] = useState(data.students[0]?.id || "");
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  return (
    <section className="portal-card mt-5">
      <p className="eyebrow">Transaction entry</p>
      <h3 className="mt-2 font-display text-2xl">Record a student payment</h3>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <Field label="Student">
          <select
            className="field"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
          >
            {data.students.map(s => (
              <option value={s.id} key={s.id}>
                {s.name} · {s.studentNo}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Amount (R)">
          <input
            className="field"
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </Field>
        <Field label="Receipt / transaction reference">
          <input
            className="field"
            value={reference}
            onChange={e => setReference(e.target.value)}
            placeholder="Receipt number"
          />
        </Field>
      </div>
      <Button
        className="mt-3"
        onClick={() => {
          const student = data.students.find(x => x.id === studentId);
          const value = Number(amount);
          if (!student || value <= 0) {
            toast.error(
              "Choose a student and enter a positive payment amount."
            );
            return;
          }
          const row = {
            id: crypto.randomUUID(),
            studentId,
            studentName: student.name,
            kind: "Payment" as const,
            label: "Tuition payment",
            amount: value,
            date: new Date().toISOString().slice(0, 10),
            reference: reference || `DEMO-${Date.now()}`,
          };
          setData(old => ({
            ...old,
            ledgerEntries: [row, ...(old.ledgerEntries || [])],
            students: old.students.map(s =>
              s.id === studentId
                ? { ...s, balance: Math.max(0, s.balance - value) }
                : s
            ),
          }));
          setAmount("");
          setReference("");
          toast.success("Payment recorded; student balance updated.");
        }}
      >
        Post payment
      </Button>
    </section>
  );
}