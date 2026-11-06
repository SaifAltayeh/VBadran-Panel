"use client";

import { useCallback, useEffect, useState } from "react";

export function useResource<T>(loader: () => Promise<T>) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState<{ version: number; data: T | null; error: boolean } | null>(null);

  const reload = useCallback(() => {
    setVersion((current) => current + 1);
  }, []);

  const setData = useCallback((value: T | ((current: T | null) => T | null)) => {
    setResult((current) => {
      const previous = current?.data ?? null;
      const next = typeof value === "function" ? (value as (data: T | null) => T | null)(previous) : value;
      return { version: current?.version ?? 0, data: next, error: false };
    });
  }, []);

  useEffect(() => {
    let active = true;
    loader().then(
      (value) => {
        if (!active) return;
        setResult({ version, data: value, error: false });
      },
      () => {
        if (!active) return;
        setResult({ version, data: null, error: true });
      },
    );
    return () => {
      active = false;
    };
  }, [loader, version]);

  const status: "loading" | "ready" | "error" =
    !result || result.version !== version ? "loading" : result.error ? "error" : "ready";
  const data = result?.data ?? null;

  return { status, data, setData, reload };
}
