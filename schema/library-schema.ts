import { z } from "zod";

// ==================LIBRARY==================
export const createLibrarySchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
  language: z.string().min(1, {
    message: "Language is required",
  }),
  description: z
    .string()
    .min(1, {
      message: "Description is required",
    })
    .max(500, {
      message: "Description must be less than 500 characters",
    }),
  backgroundColor: z.string().min(1, {
    message: "Background color is required",
  }),
});

export const updateLibrarySchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title is required",
    })
    ,
  categoryId: z
    .string()
    .min(1, {
      message: "Category is required",
    })
    ,
  language: z
    .string()
    .min(1, {
      message: "Language is required",
    })
    ,
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

export const libraryThumbnailSchema = z.object({
  thumbnail: z.string().url({
    message: "Invalid URL",
  }),
});

export const libraryMediaSchema = z.object({
  mediaUrl: z.string().url({
    message: "Invalid URL",
  }),
});
