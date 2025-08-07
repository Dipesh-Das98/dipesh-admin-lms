import { z } from "zod";
import { subscriptionTypeSchema } from "./subscription-schema";

export const paymentStatusSchema = z.enum([
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
]);

export const childPlanSchema = z.object({
  childId: z.string().min(1, { message: "childId is required" }),
  planType: subscriptionTypeSchema,
  planId: z.string().min(1, { message: "planId is required" }),
});

export const createPaymentSchema = z.object({
  parentId: z.string().min(1, { message: "parentId is required" }),
  status: paymentStatusSchema,
  childPlans: z
    .array(childPlanSchema)
    .min(1, { message: "At least one child plan is required" }),
});

export const updatePaymentSchema = z.object({
  id: z.string().min(1, { message: "Payment ID is required" }),
  status: paymentStatusSchema,
});

export type CreatePaymentSchema = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentSchema = z.infer<typeof updatePaymentSchema>;
