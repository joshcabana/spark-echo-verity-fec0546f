import { Calendar, Clock, MapPin, Users } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  formatDropSchedule,
  getDropAvailability,
  getDropTimezoneLabel,
  type PublicDrop,
} from "@/lib/dropSchedule";
import { cn } from "@/lib/utils";

interface FeaturedDropPanelProps {
  drop: PublicDrop | null;
  errorMessage?: string | null;
  isLoading?: boolean;
}

const toneClasses = {
  full: "border-destructive/30 bg-destructive/5 text-destructive",
  limited: "border-primary/30 bg-primary/10 text-primary",
  open: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
} as const;

const FeaturedDropPanel = ({ drop, errorMessage, isLoading = false }: FeaturedDropPanelProps) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 p-6 text-left backdrop-blur">
        <Skeleton className="mb-4 h-4 w-36" />
        <Skeleton className="mb-3 h-8 w-72" />
        <Skeleton className="mb-6 h-4 w-full max-w-xl" />
        <div className="grid gap-3 sm:grid-cols-3">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!drop) {
    return (
      <div className="rounded-2xl border border-border bg-card/70 p-6 text-left backdrop-blur">
        <p className="mb-2 text-[11px] uppercase tracking-luxury text-primary/70">Next pilot Drop</p>
        <h2 className="font-serif text-2xl text-foreground">Schedule publishing soon</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {errorMessage ??
            "The public Drop feed is being wired up now. Production should not launch this page without a scheduled pilot Drop."}
        </p>
      </div>
    );
  }

  const availability = getDropAvailability(drop);

  return (
    <div className="rounded-2xl border border-primary/20 bg-card/80 p-6 text-left shadow-[0_0_40px_hsl(43_72%_55%/0.08)] backdrop-blur">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="mb-1 text-[11px] uppercase tracking-luxury text-primary/70">Featured next Drop</p>
          <div className="flex flex-wrap items-center gap-2">
            {drop.rooms?.name ? (
              <span className="rounded-full border border-primary/20 px-3 py-1 text-[11px] uppercase tracking-luxury text-primary/80">
                {drop.rooms.name}
              </span>
            ) : null}
            <span
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] uppercase tracking-luxury",
                toneClasses[availability.tone],
              )}
            >
              {availability.label}
            </span>
          </div>
        </div>
      </div>

      <h2 className="font-serif text-2xl text-foreground">{drop.title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        {drop.description ||
          "A verified, structured pilot Drop for early members who want one honest night of real chemistry."}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
          <div className="mb-2 flex items-center gap-2 text-primary/80">
            <Calendar className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-luxury">When</span>
          </div>
          <p className="text-sm font-medium text-foreground">{formatDropSchedule(drop)}</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
          <div className="mb-2 flex items-center gap-2 text-primary/80">
            <MapPin className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-luxury">Time zone</span>
          </div>
          <p className="text-sm font-medium text-foreground">{getDropTimezoneLabel(drop)}</p>
        </div>

        <div className="rounded-xl border border-border/60 bg-background/40 p-4">
          <div className="mb-2 flex items-center gap-2 text-primary/80">
            <Users className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-luxury">Room size</span>
          </div>
          <p className="text-sm font-medium text-foreground">
            {drop.rsvpCount} / {drop.max_capacity} confirmed
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-border/60 bg-background/30 px-4 py-3">
        <Clock className="mt-0.5 h-4 w-4 text-primary/80" />
        <p className="text-xs leading-relaxed text-muted-foreground">{availability.detail}</p>
      </div>
    </div>
  );
};

export default FeaturedDropPanel;
