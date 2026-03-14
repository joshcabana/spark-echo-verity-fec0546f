import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import FeaturedDropPanel from "@/components/landing/FeaturedDropPanel";
import { Button } from "@/components/ui/button";
import { usePublicDrops } from "@/hooks/usePublicDrops";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";
import { getFeaturedDrop } from "@/lib/dropSchedule";

const CTASection = () => {
  const { data: drops = [], error, isLoading } = usePublicDrops();
  const featuredDrop = getFeaturedDrop(drops);

  return (
    <section className="py-24 md:py-32">
      <div className="container mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="mb-6 font-serif text-3xl leading-tight text-foreground md:text-4xl lg:text-5xl">
            Get verified before the room{" "}
            <span className="text-gold-gradient italic">fills.</span>
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground">
            Verity only works if the first Drop feels trustworthy, clear, and worth showing up for. That means one verified room, one schedule, and no ambiguity.
          </p>

          <div className="mx-auto mb-10 max-w-3xl">
            <FeaturedDropPanel
              drop={featuredDrop}
              errorMessage={error instanceof Error ? error.message : null}
              isLoading={isLoading}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              variant="gold"
              size="xl"
              className="group w-full sm:w-auto"
              onClick={() =>
                trackEvent(ANALYTICS_EVENTS.landingPrimaryCtaClicked, {
                  source: "footer_cta",
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
              <Link to="/drops">View all Drops</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
