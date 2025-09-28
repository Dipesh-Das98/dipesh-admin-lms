import { createCategorySchema, updateCategorySchema } from "@/schema";
import { z } from "zod";

export interface Category {
  id: string;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
  order: number;
  grade?: string | null;
  thumbnail?: string | null;
  backgroundColor?: string | null;
  videoUrl?: string | null;
  isDummyCategory?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type CreateCategoryData = z.infer<typeof createCategorySchema>

export type UpdateCategoryData = z.infer<typeof updateCategorySchema> ;

export type CategoryApiResponse = {
  success: boolean;
  data: {
    categories: Category[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
  message: string;
};

export type CategoryFilters = {
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
  search?: string;
  type?: string;
  isPublished?: boolean;
  language?: string;
};

export interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data?: Category;
}

export interface UpdateCategoryResponse {
  success: boolean;
  message: string;
  data?: Category;
}

export interface DeleteCategoryResponse {
  success: boolean;
  message: string;
}

export interface GetCategoryResponse {
  success: boolean;
  message: string;
  data?: Category;
}

export interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data?: {
    categories: Category[];
    meta: {
      total: number;
      page: number;
      limit: number;
      hasNext: boolean;
    };
  };
}

// Category types enum for form validation
export const CATEGORY_TYPES = [
  "course",
  "library", 
  "ethics",
  "language_corner",
  "music",
  "movie",
  "game",
  "story", 
  "variety",
] as const;

export type CategoryType = typeof CATEGORY_TYPES[number];
