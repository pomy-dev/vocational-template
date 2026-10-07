import { useState } from "react";
import type { AppData } from "@/lib/types";
import { AccountantAuth } from "./accountant-auth";
import { AccountantWorkspace } from "./accountant-dashboard";

export function AccountantPortal(props: {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  path: string;
  navigate: (p: string) => void;
}) {
  const [auth, setAuth] = useState(
    () => localStorage.getItem("nstc-accounting-session") === "active"
  );
  if (!auth)
    return (
      <AccountantAuth
        onAuthenticated={() => {
          setAuth(true);
          props.navigate("/accounting");
        }}
      />
    );
  return <AccountantWorkspace {...props} />;
}