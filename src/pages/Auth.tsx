import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import VerityLogo from "@/components/VerityLogo";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const AuthSkeleton = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <div className="p-6">
      <Skeleton className="h-5 w-16" />
    </div>
    <div className="flex-1 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Skeleton className="h-9 w-24 mx-auto mb-2" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-md" />
          <Skeleton className="h-12 w-full rounded-md" />
        </div>
        <Skeleton className="h-4 w-52 mx-auto mt-6" />
      </div>
    </div>
  </div>
);

export { AuthSkeleton };

const Auth = () => {
  const [email, setEmail] = useState("");
  const [linkSent, setLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/lobby", { replace: true });
    }
  }, [user, navigate]);

  const sendMagicLink = async () => {
    if (!email.trim()) return;
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: window.location.origin + "/onboarding" },
      });
      if (error) throw error;
      setLinkSent(true);
      toast({
        title: "Magic link sent",
        description: "Check your inbox and click the link to continue.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast({ title: "Something went wrong", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <VerityLogo className="h-9 w-auto mx-auto mb-2" linkTo="/" />
            <p className="text-sm text-muted-foreground">
              Sign in with a magic link — no password needed.
            </p>
          </div>

          {!linkSent ? (
            <form onSubmit={(e) => { e.preventDefault(); sendMagicLink(); }} className="space-y-4">
              <div className="relative">
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
                className="w-full group"
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
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card/40 p-4">
                <p className="text-sm text-foreground mb-1">
                  Waiting for you to click the link…
                </p>
                <p className="text-xs text-muted-foreground">
                  Check inbox, spam, and promotions for{" "}
                  <span className="font-mono">{email}</span>.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => sendMagicLink()}
                className="w-full"
                disabled={loading}
              >
                {loading ? "Resending…" : "Resend magic link"}
              </Button>
              <div className="text-center">
                <button
                  onClick={() => setLinkSent(false)}
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Use a different email
                </button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-[10px] text-muted-foreground/60 tracking-wide">
            We never share your email. Ever.
          </p>
        </motion.div>
      </div>

      <div className="p-6 text-center">
        <p className="text-xs text-muted-foreground/40">
          By continuing, you agree to Verity's{" "}
          <Link to="/terms" className="underline hover:text-muted-foreground transition-colors">
            terms of service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="underline hover:text-muted-foreground transition-colors">
            privacy policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Auth;
