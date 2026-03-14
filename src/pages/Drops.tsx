import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, CalendarOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicDrops } from "@/hooks/usePublicDrops";
import {
  formatDropSchedule,
  getDropAvailability,
  getDropTimezoneLabel,
  type PublicDrop,
} from "@/lib/dropSchedule";
import { cn } from "@/lib/utils";

const toneClasses = {
  full: "border-destructive/30 bg-destructive/5 text-destructive",
  limited: "border-primary/30 bg-primary/10 text-primary",
  open: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
} as const;

const DropCard = ({ drop, index }: { drop: PublicDrop; index: number }) => {
  const availability = getDropAvailability(drop);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="bg-card border border-border rounded-lg p-6 hover:border-primary/20 transition-all duration-500"
    >
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {drop.rooms?.name && (
          <span className="rounded-full border border-primary/20 px-3 py-1 text-[11px] uppercase tracking-luxury text-primary/80">
            {drop.rooms.name}
          </span>
        )}
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-[11px] uppercase tracking-luxury",
            toneClasses[availability.tone],
          )}
        >
          {availability.label}
        </span>
      </div>

      <h2 className="font-serif text-xl text-foreground mb-2">{drop.title}</h2>

      {drop.description && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {drop.description}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 text-primary/60 shrink-0" />
          <span>{formatDropSchedule(drop)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary/60 shrink-0" />
          <span>{getDropTimezoneLabel(drop)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4 text-primary/60 shrink-0" />
          <span>
            {drop.rsvpCount} / {drop.max_capacity} confirmed
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Drops = () => {
  const { data: drops, isLoading, isError } = usePublicDrops();

  const upcomingDrops = (drops ?? []).filter(
    (d) => new Date(d.scheduled_at).getTime() > Date.now(),
  );

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Drops Schedule — Verity | Themed Speed Dating Events</title>
        <meta
          name="description"
          content="Browse Verity's themed Drop schedule. Night Owls, Tech Professionals, Creatives, Over 35, and more. RSVP for your next anonymous speed date."
        />
        <link rel="canonical" href="https://getverity.com.au/drops" />
        <meta property="og:title" content="Drops Schedule — Verity | Themed Speed Dating Events" />
        <meta property="og:description" content="Browse Verity's themed Drop schedule. Night Owls, Tech Professionals, Creatives, Over 35, and more. RSVP for your next anonymous speed date." />
        <meta property="og:url" content="https://getverity.com.au/drops" />
        <meta property="og:image" content="https://getverity.com.au/og-logo.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Drops Schedule — Verity | Themed Speed Dating Events" />
        <meta name="twitter:description" content="Browse Verity's themed Drop schedule. Night Owls, Tech Professionals, Creatives, Over 35, and more." />
        <meta name="twitter:image" content="https://getverity.com.au/og-logo.png" />
      </Helmet>

      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="text-xs tracking-luxury uppercase text-primary/60 mb-4 block">
              Drop schedule
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Upcoming Drops
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each Drop is a scheduled, themed speed-dating event. Pick the room
              that matches your energy and show up when it feels right.
            </p>
          </motion.div>

          {isLoading && (
            <div className="grid gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card border border-border rounded-lg p-6">
                  <Skeleton className="h-5 w-32 mb-3" />
                  <Skeleton className="h-7 w-64 mb-2" />
                  <Skeleton className="h-4 w-full max-w-lg mb-4" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-36" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && (isError || upcomingDrops.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-16"
            >
              <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground/40 mb-4" />
              <h2 className="font-serif text-2xl text-foreground mb-3">
                No upcoming Drops scheduled yet
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Get verified now so you're ready when the first Drop goes live.
                Verified members are the first to know.
              </p>
              <Link to="/onboarding">
                <Button variant="gold" size="lg" className="group">
                  Get verified for the first Drop
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          )}

          {!isLoading && !isError && upcomingDrops.length > 0 && (
            <>
              <div className="grid gap-6">
                {upcomingDrops.map((drop, i) => (
                  <DropCard key={drop.id} drop={drop} index={i} />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center mt-16"
              >
                <Link to="/onboarding">
                  <Button variant="gold" size="lg" className="group">
                    Get verified for the first Drop
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <p className="mt-4 text-xs text-muted-foreground/60 tracking-luxury uppercase">
                  Verified 18+ required to join Drops
                </p>
              </motion.div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Drops;
