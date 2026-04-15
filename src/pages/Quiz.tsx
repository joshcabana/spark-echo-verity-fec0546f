import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuizQuestion } from "@/types/quiz";
import { QuestionDisplay } from "@/components/quiz/QuestionDisplay";
import VerityLogo from "@/components/VerityLogo";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Quiz = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const { data, error } = await supabase
          // eslint-disable-next-line @typescript-eslint/no-explicit-any -- table not yet in generated types
          .from("quiz_questions" as any)
          .select("*")
          .order("order_index", { ascending: true });

        if (error) throw error;
        setQuestions((data as unknown as QuizQuestion[]) || []);
      } catch (err: unknown) {
        console.error("Failed to load quiz", err);
        toast.error("Failed to load the quiz. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = (value: string) => {
    if (!questions[currentIndex]) return;
    const qid = questions[currentIndex].id;
    setAnswers((prev) => ({ ...prev, [qid]: value }));

    // Auto-advance after short delay
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((c) => c + 1);
      } else {
        handleComplete({ ...answers, [qid]: value });
      }
    }, 400);
  };

  const handleComplete = async (finalAnswers: Record<string, string>) => {
    if (!user) return;
    setSubmitting(true);
    try {
      const payloads = Object.entries(finalAnswers).map(([question_id, value]) => ({
        user_id: user.id,
        question_id,
        answer_value: { value },
      }));

      // Insert all responses
      const { error: responseError } = await supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- table not yet in generated types
        .from("quiz_responses" as any)
        .upsert(payloads, { onConflict: "user_id, question_id" });

      if (responseError) throw responseError;

      // Create initial Verity Score (Authenticity baseline)
      const { error: scoreError } = await supabase
        .from("verity_scores")
        .upsert(
          { 
            user_id: user.id, 
            score_type: "authenticity", 
            score_value: 100 // Starting baseline for completing onboarding
          },
          { onConflict: "user_id, score_type" }
        );

      if (scoreError) throw scoreError;

      // Mark onboarding as complete globally
      const { error: trustError } = await supabase
        .from("user_trust")
        .upsert(
          { user_id: user.id, onboarding_complete: true },
          { onConflict: "user_id" }
        );

      if (trustError) throw trustError;

      toast.success("Profile complete! Welcome to Verity.");
      navigate("/lobby", { replace: true });
    } catch (err) {
      console.error(err);
      toast.error("Failed to save your answers. Please try again.");
      setSubmitting(false);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) setCurrentIndex((c) => c - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground mb-4">No quiz questions configured.</p>
        <Button onClick={() => navigate("/lobby", { replace: true })}>
          Skip to Lobby
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header & Progress */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between text-xs text-muted-foreground font-mono px-1">
              <span>{Math.round(progress)}% completion</span>
              <span>{currentIndex + 1}/{questions.length}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          <VerityLogo className="h-5 w-auto" />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full px-5 py-12 relative">
        {submitting ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-foreground font-serif animate-pulse">Calculating your Verity profile...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <QuestionDisplay
              key={currentQuestion.id}
              question={currentQuestion}
              selectedAnswer={answers[currentQuestion.id] || null}
              onAnswer={handleAnswer}
            />
          </AnimatePresence>
        )}
      </div>

      {!submitting && currentIndex > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2">
          <Button variant="ghost" size="sm" onClick={goBack} className="text-muted-foreground hover:text-foreground">
            Back to previous question
          </Button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
