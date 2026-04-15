import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ExcitementStep from "@/components/onboarding/ExcitementStep";
import MagicLinkStep from "@/components/onboarding/MagicLinkStep";
import VerifyStep from "@/components/onboarding/VerifyStep";
import ProfileStep from "@/components/onboarding/ProfileStep";
import PreferencesStep, { Preferences } from "@/components/onboarding/PreferencesStep";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics";

const TOTAL_STEPS = 5;
const STEP_KEYS = ["excitement", "magic_link", "verify", "profile", "preferences"] as const;

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
    
    // Resume at the saved step if available
    if (userTrust?.onboarding_step && step === 0) {
      const savedStep = Math.min(userTrust.onboarding_step, TOTAL_STEPS - 1);
      // Only advance if the saved step is further than current
      if (savedStep > step) {
        setStep(savedStep);
      }
    }
    
    // Auto-advance past auth steps if already authenticated
    if (user && step < 2) {
      setStep(2);
    }
  }, [userTrust, user, navigate, step]);

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
    void saveStep(3);
    setStep(3);
  };

  const handleProfileDone = () => {
    trackStepCompleted(3);
    void saveStep(4);
    setStep(4);
  };

  const handlePreferencesDone = async (prefs: Preferences) => {
    if (!user) return;
    trackStepCompleted(4);
    
    // Save preferences to user_trust
    const { error } = await supabase.from("user_trust").update({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- preferences is a jsonb column not yet reflected in the generated types
      preferences: prefs as any,
      onboarding_step: 5 // Logic for "post-onboarding steps"
    }).eq("user_id", user.id);

    if (error) {
       console.error("Failed to save preferences", error);
    }

    // Finally navigate to quiz
    navigate("/quiz", { replace: true });
  };

  const progress = ((step) / TOTAL_STEPS) * 100;

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
          {step === 3 && <ProfileStep key="profile" onNext={handleProfileDone} />}
          {step === 4 && <PreferencesStep key="preferences" onComplete={handlePreferencesDone} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
