-- Seed data for Onboarding Quiz Questions
INSERT INTO public.quiz_questions (category, question_text, options, order_index)
VALUES 
(
  'values',
  'When faced with a difficult decision, what do you prioritize?',
  '[{"label": "Logic and practicality", "value": "logic"}, {"label": "Impact on others'' feelings", "value": "empathy"}, {"label": "Long-term consequences", "value": "long_term"}, {"label": "Gut instinct", "value": "intuition"}]',
  1
),
(
  'lifestyle',
  'What does your ideal weekend look like?',
  '[{"label": "Outdoor adventures", "value": "outdoor"}, {"label": "Relaxing at home", "value": "home"}, {"label": "Socializing and parties", "value": "social"}, {"label": "Learning or hobbies", "value": "hobbies"}]',
  2
),
(
  'dealbreaker',
  'How do you handle conflict in a relationship?',
  '[{"label": "Address it immediately", "value": "direct"}, {"label": "Take time to cool off first", "value": "space"}, {"label": "Try to compromise", "value": "compromise"}, {"label": "Avoid if possible", "value": "avoid"}]',
  3
),
(
  'communication',
  'What is your primary love language?',
  '[{"label": "Words of Affirmation", "value": "words"}, {"label": "Quality Time", "value": "time"}, {"label": "Physical Touch", "value": "touch"}, {"label": "Acts of Service", "value": "acts"}, {"label": "Receiving Gifts", "value": "gifts"}]',
  4
),
(
  'future',
  'Where do you see yourself in 5 years?',
  '[{"label": "Building a career/business", "value": "career"}, {"label": "Starting a family", "value": "family"}, {"label": "Traveling the world", "value": "travel"}, {"label": "Figuring it out as I go", "value": "open"}]',
  5
)
ON CONFLICT DO NOTHING;
