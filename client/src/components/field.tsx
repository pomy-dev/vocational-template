export const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className="block text-sm font-semibold text-slate-700">
    {label}
    {children}
  </label>
);