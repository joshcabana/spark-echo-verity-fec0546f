import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Drop {
  id: string;
  title: string;
  region: string;
  max_capacity: number;
  scheduled_at: string;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "00:00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

const pulseVariants = {
  animate: {
    scale: [1, 1.04, 1],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export function NextDropCountdown() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<string>("--:--:--");

  const { data: drop, isLoading } = useQuery<Drop | null>({
    queryKey: ["next-drop"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("drops")
        .select("id, title, region, max_capacity, scheduled_at")
        .eq("status", "scheduled")
        .gt("scheduled_at", new Date().toISOString())
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    },
    refetchInterval: 60_000,
  });

  useEffect(() => {
    if (!drop) return;

    const target = new Date(drop.scheduled_at).getTime();

    const tick = () => {
      const remaining = target - Date.now();
      setCountdown(formatCountdown(remaining));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [drop]);

  if (isLoading || !drop) return null;

  return (
    <section className="w-full max-w-lg mx-auto px-4 py-6">
      <Card className="bg-card/60 border border-border/40 backdrop-blur-sm">
        <CardContent className="pt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs uppercase tracking-wider">
              Next Drop
            </Badge>
            <Badge variant="outline" className="text-xs">
              {drop.region}
            </Badge>
          </div>

          <p className="text-foreground font-serif text-lg text-center">{drop.title}</p>

          <motion.p
            variants={pulseVariants}
            animate="animate"
            className="text-4xl font-mono font-bold text-primary tabular-nums tracking-widest"
            aria-live="polite"
            aria-label={`Time until drop: ${countdown}`}
          >
            {countdown}
          </motion.p>

          <p className="text-xs text-muted-foreground">
            Up to {drop.max_capacity} participants
          </p>

          <Button
            variant="gold"
            size="lg"
            className="w-full mt-2"
            onClick={() => navigate("/lobby")}
          >
            Join Drop
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

export default NextDropCountdown;
