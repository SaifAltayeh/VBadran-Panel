"use client";

import { useCallback, useEffect, useState } from "react";

export function useResource<T>(loader: () => Promise<T>) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [data, setData] = useState<T | null>(null);
  const [version, setVersion] = useState(0);

  const reload = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  useEffect(() => {
    let active = true;
    setStatus("loading");
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
  }, [loader, version]);

  return { status, data, setData, reload };
}
