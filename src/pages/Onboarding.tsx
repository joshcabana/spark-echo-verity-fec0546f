import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ExcitementStep from "@/components/onboarding/ExcitementStep";
import MagicLinkStep from "@/components/onboarding/MagicLinkStep";
import VerifyStep from "@/components/onboarding/VerifyStep";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const TOTAL_STEPS = 3;
const STEP_KEYS = ["excitement", "magic_link", "verify"] as const;

const getStepKey = (stepIndex: number) => STEP_KEYS[stepIndex] ?? STEP_KEYS[0];

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const stepEnteredAtRef = useRef(Date.now());
  const navigate = useNavigate();
  const { user, userTrust } = useAuth();

  // SEO
  useEffect(() => {
    document.title = "Verity Onboarding • Real chemistry in 45 seconds";
  }, []);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.onboardingStepViewed, {
      step_index: step,
      step_key: getStepKey(step),
    });
    stepEnteredAtRef.current = Date.now();
  }, [step]);

  // Resume / redirect if already complete
  useEffect(() => {
    if (userTrust?.onboarding_complete) {
      navigate("/lobby", { replace: true });
      return;
    }
    // If user is already authenticated, skip to verify step
    if (user && step < 2) {
      setStep(2);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTrust, user, navigate]);

  const saveStep = async (nextStep: number) => {
    if (!user) return;
    const { error } = await supabase.from("user_trust").upsert(
      { user_id: user.id, onboarding_step: nextStep },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Failed to persist onboarding step", error);
    }
  };

  const trackStepCompleted = (stepIndex: number) => {
    trackEvent(ANALYTICS_EVENTS.onboardingStepCompleted, {
      elapsed_ms: Math.max(0, Date.now() - stepEnteredAtRef.current),
      step_index: stepIndex,
      step_key: getStepKey(stepIndex),
    });
  };

  const handleExcitementDone = () => {
    trackStepCompleted(0);
    // If already signed in, skip magic link
    if (user) {
      void saveStep(2);
      setStep(2);
    } else {
      setStep(1);
    }
  };

  const handleMagicLinkDone = () => {
    trackStepCompleted(1);
    void saveStep(2);
    setStep(2);
  };

  const handleVerifyDone = () => {
    trackStepCompleted(2);
    navigate("/lobby", { replace: true });
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-3">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-mono">
            {step + 1}/{TOTAL_STEPS}
          </span>
          <Progress value={progress} className="h-1.5 flex-1" />
          <span className="font-serif text-sm text-foreground">Verity</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center py-12">
        <AnimatePresence mode="wait">
          {step === 0 && <ExcitementStep key="excitement" onNext={handleExcitementDone} />}
          {step === 1 && <MagicLinkStep key="magic-link" onNext={handleMagicLinkDone} />}
          {step === 2 && <VerifyStep key="verify" onComplete={handleVerifyDone} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
