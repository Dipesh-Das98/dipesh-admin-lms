import { z } from "zod";
import { CATEGORY_TYPES } from "@/types/category.type";

// ==================CATEGORY==================
export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  type: z.enum(CATEGORY_TYPES, {
    required_error: "Type is required",
    invalid_type_error: "Invalid category type",
  }),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  grade: z.string().optional(),
  backgroundColor: z.string().optional(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  type: z.enum(CATEGORY_TYPES).optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .optional(),
  isActive: z.boolean().optional(),
  order: z.number().min(0).optional(),
  grade: z.string().optional(),
  backgroundColor: z.string().optional(),
  thumbnail: z.string().optional(),
  videoUrl: z.string().optional(),
  isDummyCategory: z.boolean().optional(),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormData = z.infer<typeof updateCategorySchema>;
