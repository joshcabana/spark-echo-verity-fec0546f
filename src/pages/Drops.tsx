import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Clock, Sparkles, Bell, Mail, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { rooms } from "@/data/rooms";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Drops = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from("waitlist" as any)
        .insert({ email: email.trim().toLowerCase() } as any);
      if (error) {
        if (error.code === "23505") {
          toast({ title: "You're already on the list", description: "We'll email you when the first Drop goes live." });
          setSubmitted(true);
          return;
        }
        throw error;
      }
      setSubmitted(true);
      toast({ title: "You're on the waitlist!", description: "We'll be in touch soon." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      toast({ title: "Oops", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

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
              Coming soon
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
              Themed Drops
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each Drop is a scheduled, themed speed-dating event. Pick the room
              that matches your energy and show up when it feels right.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {rooms.map((room, i) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/20 transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <room.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-serif text-xl text-foreground">
                        {room.name}
                      </h2>
                      {room.premium && (
                        <Badge variant="outline" className="text-primary border-primary/30 text-[10px]">
                          Pass
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {room.tagline}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {room.peakHours}
                      </span>
                      <span className="flex items-center gap-1 text-primary/70">
                        <Sparkles className="w-3 h-3" /> First Drop coming soon
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Waitlist CTA */}
          <div className="text-center mt-16">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium">Get notified when Drops go live</span>
            </div>

            <div className="max-w-lg mx-auto">
              {!submitted ? (
                <form
                  onSubmit={handleWaitlist}
                  className="flex flex-col sm:flex-row items-stretch gap-3"
                >
                  <div className="relative flex-1">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 bg-card border-border"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="gold"
                    size="lg"
                    className="group h-12 whitespace-nowrap"
                    disabled={loading || !email.trim()}
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Notify me
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3 text-left">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-foreground">
                    You're on the list. We'll email you when the first Drop goes live.
                  </p>
                </div>
              )}
            </div>

            <p className="mt-4 text-xs text-muted-foreground/60 tracking-luxury uppercase">
              Verified 18+ required to join Drops
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Drops;
