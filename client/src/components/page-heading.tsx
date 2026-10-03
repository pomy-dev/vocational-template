import { ReactNode } from "react";

// Page Heading Component
export function PageHeading({ eyebrow, title, body, actions }: {
  eyebrow: string;
  title: string;
  body?: string;
  actions?: ReactNode
}) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl text-slate-950">{title}</h1>
        {body && <p className="mt-2 text-sm text-slate-500">{body}</p>}
      </div>
      {actions && <div>{actions}</div>}
    </div>
  );
}