import { useState } from "react";
import { delay } from "./delay";

// Custom hook to handle async actions with loading state
export function useAction() {
  const [loading, setLoading] = useState(false);
  const run = async (action: () => void | Promise<void>) => {
    setLoading(true);
    try {
      await delay();
      await action();
    } finally {
      setLoading(false);
    }
  };
  return { loading, run };
}