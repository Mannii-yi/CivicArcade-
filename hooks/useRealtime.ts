"use client";
import { useEffect } from "react";
import { subscribeToQuests } from "@/lib/realtime";
import type { Quest } from "@/types";

export function useRealtime(
  onInsert: (q: Quest) => void,
  onUpdate: (q: Quest) => void,
) {
  useEffect(() => {
    const unsub = subscribeToQuests(onInsert, onUpdate);
    // Return a sync cleanup function — Vercel's TS is strict about this
    return () => { unsub(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}