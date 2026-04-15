export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question_text: string;
  // Supabase JSONB comes back as an array of objects
  options: QuizOption[];
  order_index: number;
}
