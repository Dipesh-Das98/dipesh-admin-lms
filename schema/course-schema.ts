import { z } from "zod";

// ==================COURSE==================
export const createCourseSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  grade: z.string().min(1, {
    message: "Grade is required",
  }),
});

export const titleSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const descriptionSchema = z.object({
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .optional(),
});

export const imageUploadSchema = z.object({
  imageUrl: z.string().url({
    message: "Invalid URL",
  }),
});

export const attachmentForm = z.object({
  url: z.string().url({
    message: "Invalid URL",
  }),
});

export const categorySchema = z.object({
  categoryId: z.string().min(1),
});

export const gradeSchema = z.object({
  grade: z.string().min(1, {
    message: "Grade is required",
  }),
});

export const languageSchema = z.object({
  language: z.string().min(1, {
    message: "Language is required",
  }),
});

export const backgroundColorSchema = z.object({
  backgroundColor: z.string().min(1, {
    message: "Background color is required",
  }),
});

// ==================CHAPTER==================
export const createChapterForm = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export const chapterTitleSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Chapter title is required",
    })
    .max(100, {
      message: "Chapter title must be less than 100 characters",
    }),
});

export const chapterDescriptionSchema = z.object({
  description: z
    .string()
    .max(1000, {
      message: "Description must be less than 1000 characters",
    })
    .optional(),
});

export const chapterVideoForm = z.object({
  videoUrl: z.string().min(1, {
    message: "Video URL is required",
  }),
});

// ==================MOVIE==================
export const mediaForm = z.object({
  mediaUrl: z.string().min(1, {
    message: "Media URL is required",
  }),
});

// ==================QUIZ==================

export const quizFormSchema = z.object({
  noOfQuestions: z.coerce
    .number()
    .min(1, {
      message: "Number of questions is required",
    })
    .max(15, {
      message: "Maximum number of questions is 15",
    }),
  questionTypes: z.array(z.enum(["multiple choice", "true/false"])).min(1, {
    message: "At least one question type is required",
  }),

  difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
});

// ==================ASSIGNMENT==================

export const assignmentQuizSchema = z.object({
  id: z.string().min(1, {
    message: "Question ID is required",
  }),
  question: z.string().min(1, {
    message: "Question is required",
  }),
  options: z
    .array(z.string())
    .min(2, {
      message: "At least 2 options are required",
    })
    .max(4, {
      message: "Maximum 4 options are allowed",
    }),
  answer: z.string().min(1, {
    message: "Correct answer is required",
  }),
  explanation: z.string().optional(),
});

export const chapterAssignmentSchema = z.object({
  title: z.string().min(1, {
    message: "Assignment title is required",
  }),
  description: z.string().optional(),
  isPublished: z.boolean().default(false),
  type: z.enum(["QUIZ"]).default("QUIZ"),
  questions: z.array(assignmentQuizSchema).min(1, {
    message: "At least one question is required",
  }),
});
