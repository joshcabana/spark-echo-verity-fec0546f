import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

import FeaturedDropPanel from "@/components/landing/FeaturedDropPanel";
import { Button } from "@/components/ui/button";
import { usePublicDrops } from "@/hooks/usePublicDrops";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { getFeaturedDrop } from "@/lib/dropSchedule";

const trustChips = ["18+ only", "45-second calls", "Anonymous video"];

const HeroSection = () => {
  const { data: drops = [], error, isLoading } = usePublicDrops();
  const featuredDrop = getFeaturedDrop(drops);

  return (
    <section className="relative flex min-h-[85vh] items-start justify-center overflow-hidden pt-28 md:pt-32">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="hidden h-full w-full object-cover opacity-40 md:block"
          poster=""
        >
          <source
            src="https://cdn.jsdelivr.net/gh/joshcabana/GetVerity.1@main/public/videos/verity-hero-background.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-background md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative z-10 container mx-auto max-w-5xl px-6 pt-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-2"
        >
          {trustChips.map((chip) => (
            <span
              key={chip}
              className="rounded-full border border-primary/20 px-3 py-1.5 text-[10px] uppercase tracking-luxury text-primary/80"
            >
              {chip}
            </span>
          ))}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mb-8 font-serif text-4xl leading-[1.05] text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Anonymous first.
          <br />
          <span className="text-gold-gradient italic">Mutual reveal only.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mx-auto mb-10 max-w-3xl text-lg font-light leading-relaxed text-muted-foreground md:text-xl"
        >
          RSVP to a scheduled Drop, meet one verified stranger in a 45-second anonymised video call,
          then both choose Spark or Pass. Raw video and audio are never stored.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button
            asChild
            variant="gold"
            size="xl"
            className="group w-full sm:w-auto"
            onClick={() =>
              trackEvent(ANALYTICS_EVENTS.landingPrimaryCtaClicked, {
                source: "hero",
                featured_drop_id: featuredDrop?.id ?? null,
              })
            }
          >
            <Link to="/onboarding">
              Get verified for the first Drop
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button asChild variant="gold-outline" size="xl" className="w-full sm:w-auto">
            <Link to="/how-it-works">How it works</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="mx-auto max-w-4xl"
        >
          <FeaturedDropPanel
            drop={featuredDrop}
            errorMessage={error instanceof Error ? error.message : null}
            isLoading={isLoading}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.35 }}
          className="mt-6 text-xs text-muted-foreground/70"
        >
          <CheckCircle2 className="mr-1 inline h-3.5 w-3.5 text-primary/80" />
          Safety transcript snippets and call metadata may be retained for up to 30 days for moderation review.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-6 text-xs uppercase tracking-luxury text-muted-foreground/60"
        >
          Already have an account?{" "}
          <Link to="/auth" className="text-primary transition-colors hover:text-primary/80">
            Sign in
          </Link>
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.65 }}
          className="mt-12 text-xs uppercase tracking-luxury text-muted-foreground/60"
        >
          Built by one person in Canberra for people tired of what dating apps became.
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
