import { supabase } from "./supabase";
import type { Quest } from "@/types";

export function subscribeToQuests(
  onInsert: (quest: Quest) => void,
  onUpdate: (quest: Quest) => void,
): () => void {
  const channel = supabase
    .channel("quests-realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "quests" },
      (payload) => onInsert(payload.new as Quest)
    )
    .on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: "quests" },
      (payload) => onUpdate(payload.new as Quest)
    )
    .subscribe();

  // Explicitly typed as sync () => void so TS doesn't complain
  return () => {
    supabase.removeChannel(channel);
  };
}