import { z } from "zod";

// ==================LANGUAGE CORNER==================
export const CreateLanguageCornerFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  backgroundColor: z.string().min(1, "Background color is required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const updateLanguageCornerSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .max(500, {
      message: "Description must be less than 500 characters",
    }),
  backgroundColor: z.string(),
  isActive: z.boolean(),
  order: z.number(),
});
