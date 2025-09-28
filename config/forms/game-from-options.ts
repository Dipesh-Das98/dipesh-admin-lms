import { z } from 'zod';

export const GameDifficultyEnum = z.enum(['easy', 'medium', 'hard']);

export const GameQuestionTypeEnum = z.enum(['quiz', 'image', 'audio', 'text', 'matching']);

export const GameQuestionSchema = z.object({
  id: z.string(),
  difficulty: GameDifficultyEnum,
  type: GameQuestionTypeEnum,
  thumbnail: z.string().optional(),
  mediaUrl: z.string().optional(),
  order_no: z.number().int().positive(),
  feedback: z.string().optional(),
  hint: z.string().optional(),
  questionText: z.string().optional(),      // for quiz-type
  options: z.array(z.union([z.string(), z.number()])).optional(), // for quiz-type
  answer: z.union([z.string(), z.number()]).optional(),           // for quiz-type
});

export type GameQuestion = z.infer<typeof GameQuestionSchema>;