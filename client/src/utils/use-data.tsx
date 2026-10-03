import { useEffect, useState } from "react";
import { loadData } from "../utils/load-data";
import { AppData } from "../lib/types";

export function useData() {
  const [data, setData] = useState<AppData>(loadData);
  useEffect(() => { localStorage.setItem("nstc-data", JSON.stringify(data)); }, [data]);
  return [data, setData] as const;
}