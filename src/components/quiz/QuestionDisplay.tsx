import { motion } from "framer-motion";
import { QuizQuestion } from "@/types/quiz";

interface QuestionDisplayProps {
  question: QuizQuestion;
  selectedAnswer: string | null;
  onAnswer: (value: string) => void;
}

export const QuestionDisplay = ({ question, selectedAnswer, onAnswer }: QuestionDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-lg mx-auto space-y-6"
    >
      <h2 className="text-2xl font-serif text-center sm:text-3xl text-foreground mt-4 mb-8">
        {question.question_text}
      </h2>
      <div className="space-y-3">
        {question.options.map((opt) => {
          const isSelected = selectedAnswer === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              className={`w-full p-4 rounded-xl border text-left transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30 shadow-sm"
                  : "border-border bg-card hover:bg-muted/40 hover:border-border/80"
              }`}
            >
              <span className={`text-base font-medium ${isSelected ? "text-foreground" : "text-foreground/90"}`}>
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};
