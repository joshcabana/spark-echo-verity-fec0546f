import type { Database } from "@/integrations/supabase/types";

type DropRow = Database["public"]["Tables"]["drops"]["Row"];
type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];

type PublicDropRecord = Pick<
  DropRow,
  | "id"
  | "title"
  | "description"
  | "scheduled_at"
  | "duration_minutes"
  | "max_capacity"
  | "status"
  | "room_id"
  | "timezone"
  | "is_friendfluence"
> & {
  rooms: Pick<RoomRow, "name"> | null;
};

export type PublicDrop = PublicDropRecord & {
  rsvpCount: number;
};

export type DropAvailability = {
  label: string;
  detail: string;
  remainingSpots: number;
  tone: "open" | "limited" | "full";
};

const DEFAULT_DROP_TIMEZONE = "Australia/Sydney";

export async function fetchPublicDrops(): Promise<PublicDrop[]> {
  const { supabase } = await import("@/integrations/supabase/client");

  const { data, error } = await supabase.rpc("get_public_drop_schedule" as any);

  if (error) {
    throw error;
  }

  return ((data ?? []) as any[]).map((drop: any) => ({
    id: drop.id,
    title: drop.title,
    description: drop.description,
    scheduled_at: drop.scheduled_at,
    duration_minutes: drop.duration_minutes,
    max_capacity: drop.max_capacity,
    status: drop.status,
    room_id: drop.room_id,
    timezone: drop.timezone,
    is_friendfluence: drop.is_friendfluence,
    rooms: drop.room_name ? ({ name: drop.room_name } as Pick<RoomRow, "name">) : null,
    rsvpCount: drop.rsvp_count,
  }));
}

export function getFeaturedDrop(drops: PublicDrop[], now = new Date()): PublicDrop | null {
  const nowMs = now.getTime();

  return (
    [...drops]
      .filter((drop) => new Date(drop.scheduled_at).getTime() > nowMs)
      .sort(
        (left, right) =>
          new Date(left.scheduled_at).getTime() - new Date(right.scheduled_at).getTime(),
      )[0] ?? null
  );
}

export function getUpcomingDrops(drops: PublicDrop[], now = new Date()): PublicDrop[] {
  const featuredDrop = getFeaturedDrop(drops, now);

  return drops.filter((drop) => drop.id !== featuredDrop?.id && new Date(drop.scheduled_at) > now);
}

export function getDropAvailability(drop: Pick<PublicDrop, "max_capacity" | "rsvpCount">): DropAvailability {
  const remainingSpots = Math.max(drop.max_capacity - drop.rsvpCount, 0);

  if (remainingSpots === 0) {
    return {
      label: "Capacity reached",
      detail: "This Drop is currently full.",
      remainingSpots,
      tone: "full",
    };
  }

  if (remainingSpots <= 5) {
    return {
      label: `${remainingSpots} spot${remainingSpots === 1 ? "" : "s"} left`,
      detail: "Small-room pilot. Verification is required before RSVP opens.",
      remainingSpots,
      tone: "limited",
    };
  }

  return {
    label: `${remainingSpots} spots remaining`,
    detail: "Get verified now so you can RSVP before the room fills.",
    remainingSpots,
    tone: "open",
  };
}

export function formatDropDate(drop: Pick<PublicDrop, "scheduled_at" | "timezone">): string {
  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: drop.timezone || DEFAULT_DROP_TIMEZONE,
  }).format(new Date(drop.scheduled_at));
}

export function formatDropTime(drop: Pick<PublicDrop, "scheduled_at" | "timezone">): string {
  return new Intl.DateTimeFormat("en-AU", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: drop.timezone || DEFAULT_DROP_TIMEZONE,
    timeZoneName: "short",
  }).format(new Date(drop.scheduled_at));
}

export function formatDropSchedule(drop: Pick<PublicDrop, "scheduled_at" | "timezone">): string {
  return `${formatDropDate(drop)} · ${formatDropTime(drop)}`;
}

export function getDropTimezoneLabel(drop: Pick<PublicDrop, "timezone">): string {
  const timezone = drop.timezone || DEFAULT_DROP_TIMEZONE;

  if (timezone === "Australia/Sydney") {
    return "Sydney time";
  }

  return timezone.replace("Australia/", "").replace("_", " ");
}
