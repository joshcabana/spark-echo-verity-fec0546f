import type { Database } from "@/integrations/supabase/types";

type PlatformStats = Database["public"]["Tables"]["platform_stats"]["Row"] | null;

export const TRANSPARENCY_ACCURACY_THRESHOLD = 100;

export type TransparencyPhase = "prelaunch" | "early-live" | "full-live";

export function getTransparencyPhase(stats: PlatformStats): TransparencyPhase {
  const totalCalls = stats?.total_calls ?? 0;
  const moderationActions = stats?.moderation_flags_count ?? 0;

  if (totalCalls <= 0) {
    return "prelaunch";
  }

  if (moderationActions < TRANSPARENCY_ACCURACY_THRESHOLD) {
    return "early-live";
  }

  return "full-live";
}

export function isAccuracyMetricReady(stats: PlatformStats): boolean {
  return getTransparencyPhase(stats) === "full-live" && stats?.ai_accuracy != null;
}
