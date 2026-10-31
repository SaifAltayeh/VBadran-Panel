"use client";

import { useEffect, useState } from "react";

export function useResource<T>(loader: () => Promise<T>) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    let active = true;
    loader().then(
      (value) => {
        if (!active) return;
        setData(value);
        setStatus("ready");
      },
      () => {
        if (!active) return;
        setStatus("error");
      },
    );
    return () => {
      active = false;
    };
  }, [loader]);

  return { status, data };
}
