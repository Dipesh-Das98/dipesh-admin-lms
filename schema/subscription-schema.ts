import { z } from "zod";

// Subscription Type Enum
export const subscriptionTypeSchema = z.enum(['FULL_YEAR', 'HALF_YEAR', 'MONTHLY', 'WEEKLY']);

// Create Subscription Schema
export const createSubscriptionSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }).max(100, {
    message: "Name must be less than 100 characters",
  }),
  description: z.string().min(1, {
    message: "Description is required",
  }).max(500, {
    message: "Description must be less than 500 characters",
  }),
  price: z.number().min(0, {
    message: "Price must be a positive number",
  }),
  type: subscriptionTypeSchema,
  discount: z.number().min(0).max(100).nullable().optional(),
  duration: z.number().min(1, {
    message: "Duration must be at least 1",
  }),
  meta: z.record(z.unknown()).optional(),
});

// Update Subscription Schema
export const updateSubscriptionSchema = createSubscriptionSchema.partial().extend({
  id: z.string().min(1, {
    message: "ID is required",
  }),
});

// Individual field schemas for partial updates
export const subscriptionNameSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }).max(100, {
    message: "Name must be less than 100 characters",
  }),
});

export const subscriptionDescriptionSchema = z.object({
  description: z.string().min(1, {
    message: "Description is required",
  }).max(500, {
    message: "Description must be less than 500 characters",
  }),
});

export const subscriptionPriceSchema = z.object({
  price: z.number().min(0, {
    message: "Price must be a positive number",
  }),
});

export const subscriptionTypeFieldSchema = z.object({
  type: subscriptionTypeSchema,
});

export const subscriptionDiscountSchema = z.object({
  discount: z.number().min(0).max(100).nullable().optional(),
});

export const subscriptionDurationSchema = z.object({
  duration: z.number().min(1, {
    message: "Duration must be at least 1",
  }),
});

// Export types
export type CreateSubscriptionSchema = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionSchema = z.infer<typeof updateSubscriptionSchema>;
export type SubscriptionType = z.infer<typeof subscriptionTypeSchema>;
