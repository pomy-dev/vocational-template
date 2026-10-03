import { ReactNode } from "react";

// Button Component
export function Button({ children, variant = "gold", className = "", onClick, type = "button", disabled = false }: {
  children: ReactNode;
  variant?: "gold" | "dark" | "light" | "ghost" | "danger";
  className?: string; onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean
}) {
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`btn btn-${variant} ${className} ${disabled ? "opacity-60" : ""}`}>
      {children}
    </button>
  );
}