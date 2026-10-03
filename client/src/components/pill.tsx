import { ReactNode } from "react";
// Custom Pill Component
export function Pill({ children, tone = "gold" }: {
  children: ReactNode;
  tone?: "gold" | "green" | "red" | "slate"
}) {
  return (
    <span className={`pill pill-${tone}`}>{children}</span>);
}