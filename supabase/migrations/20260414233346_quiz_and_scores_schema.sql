-- QUIZ QUESTIONS
CREATE TABLE public.quiz_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions" 
ON public.quiz_questions FOR SELECT 
TO authenticated 
USING (true);

-- QUIZ RESPONSES
CREATE TABLE public.quiz_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
    answer_value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(user_id, question_id)
);

ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own responses
CREATE POLICY "Users can insert their own responses" 
ON public.quiz_responses FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Allow users to view their own responses
CREATE POLICY "Users can view their own responses" 
ON public.quiz_responses FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Allow users to update their own responses
CREATE POLICY "Users can update their own responses" 
ON public.quiz_responses FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- VERITY SCORES
CREATE TABLE public.verity_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score_type TEXT NOT NULL,
    score_value INTEGER NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    UNIQUE(user_id, score_type)
);

ALTER TABLE public.verity_scores ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own scores (inserted by a secure edge function / trigger)
CREATE POLICY "Users can view their own scores" 
ON public.verity_scores FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);
