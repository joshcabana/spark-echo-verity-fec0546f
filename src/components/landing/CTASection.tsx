import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
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
    <section className="py-24 md:py-32">
      <div className="container max-w-3xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 leading-tight">
            Your next Drop is{" "}
            <span className="text-gold-gradient italic">waiting.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Verity is verification-required and safety-first. We're not building the biggest platform — just the most honest one.
          </p>

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
                      Join the waitlist
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
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
