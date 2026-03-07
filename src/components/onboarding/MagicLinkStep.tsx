import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface MagicLinkStepProps {
  onNext: () => void;
}

const MagicLinkStep = ({ onNext }: MagicLinkStepProps) => {
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Auto-advance if user is already authenticated
  useEffect(() => {
    if (user && !verified) {
      setVerified(true);
      const t = setTimeout(onNext, 1200);
      return () => clearTimeout(t);
    }
  }, [user, verified, onNext]);

  const handleSendLink = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin + "/onboarding" },
      });
      if (error) throw error;
      setLinkSent(true);
      toast({ title: "Magic link sent", description: "Check your inbox and click the link to continue." });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (verified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center text-center px-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6"
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
        <h2 className="font-serif text-2xl text-foreground mb-2">
          ✨ Magic link verified!
        </h2>
        <p className="text-sm text-muted-foreground">Taking you to the final step…</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center text-center px-6 max-w-sm mx-auto w-full"
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Mail className="w-7 h-7 text-primary" />
      </div>

      <h2 className="font-serif text-2xl sm:text-3xl text-foreground mb-3">
        {linkSent ? "Check your inbox" : "One email. Instant magic."}
      </h2>
      <p className="text-muted-foreground max-w-md mb-8 text-sm leading-relaxed">
        {linkSent
          ? `We sent a one-time login link to ${email}. Click it to continue.`
          : "We'll send you a magic link — no password needed."}
      </p>

      {!linkSent ? (
        <div className="w-full space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-11 h-12 bg-card border-border"
              onKeyDown={(e) => e.key === "Enter" && handleSendLink()}
            />
          </div>
          <Button
            variant="gold"
            size="lg"
            onClick={handleSendLink}
            className="group w-full"
            disabled={loading || !email.trim()}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Send magic link
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="w-full space-y-4">
          <div className="rounded-lg border border-border bg-card/40 p-4">
            <p className="text-sm text-foreground mb-1">Waiting for you to click the link…</p>
            <p className="text-xs text-muted-foreground">
              Check inbox, spam, and promotions for <span className="font-mono">{email}</span>.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { handleSendLink(); }}
            className="w-full"
            disabled={loading}
          >
            {loading ? "Resending…" : "Resend magic link"}
          </Button>
          <button
            onClick={() => { setLinkSent(false); }}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Use a different email
          </button>
        </div>
      )}

      <p className="mt-8 text-[10px] text-muted-foreground/60 tracking-wide">
        We never share your email. Ever.
      </p>
    </motion.div>
  );
};

export default MagicLinkStep;
