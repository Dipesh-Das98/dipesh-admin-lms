"use client";

import React from "react";
// Import UseFormReturn for explicit typing in useForm call
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import LeftColumn from "./leftColumn";
import RightColumn from "./rightColumn";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPregnancyNutritionTip } from "@/actions/dashboard/pregnancy-nutrition/create-pregnancy-nutrition-tip";
import { updatePregnancyNutritionTip } from "@/actions/dashboard/pregnancy-nutrition/update-pregnancy-nutrition-tip-by-id";
import { useQueryClient } from "@tanstack/react-query";
import { PregnancyNutritionTip } from "@/types/pregnancy-nutrition.type";
// --- ZOD SCHEMA ---
// The original NutritionFactSchema was redundant as it was defined inline later,
// but we keep the inline definition clean here.

const pregnancyNutritionSchema = z
  .object({
    id: z.string().optional(),
    weekStart: z.number().int().min(1, "Start week must be 1 or greater."),
    weekEnd: z.number().int().min(1, "End week must be 1 or greater."),
    foodCategory: z.string().min(1, "Food category is required."),
    foodName: z.string().min(1, "Food name is required."),
    foodImage: z.union([z.string(), z.null()]),
    healthBenefits: z
      .array(z.string())
      .min(1, "At least one health benefit is required"),
    nutritionFacts: z.array(
      z.object({
        value: z.string().min(1),
        nutrient: z.string().min(1),
        dvPercentage: z.number().optional(), // Optional to allow null/undefined on append
      })
    ),
    isRecommended: z.boolean(), // Output is guaranteed boolean
  })
  .refine((data) => data.weekEnd >= data.weekStart, {
    message: "End week must be >= start week",
    path: ["weekEnd"],
  });

export type PregnancyNutritionFormValues = z.infer<
  typeof pregnancyNutritionSchema
>;

interface MainFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<PregnancyNutritionTip>;
}

const MainForm: React.FC<MainFormProps> = ({ mode, initialValues }) => {
  const router = useRouter();
  const queryClient = useQueryClient(); 

  const form = useForm<
    PregnancyNutritionFormValues,
    any, // TContext (often the cause of the error)
    PregnancyNutritionFormValues // TTransformedValues
  >({
    resolver: zodResolver(pregnancyNutritionSchema),
    defaultValues: {
      id: mode === "edit" ? initialValues?.id ?? "" : undefined,
      weekStart: initialValues?.weekStart ?? 1,
      weekEnd: initialValues?.weekEnd ?? 4,
      foodCategory: initialValues?.foodCategory ?? "",
      foodName: initialValues?.foodName ?? "",
      foodImage: null,
      healthBenefits: initialValues?.healthBenefits ?? [""],
      nutritionFacts: initialValues?.nutritionFacts ?? [
        { nutrient: "", value: "" },
      ],
      isRecommended: initialValues?.isRecommended ?? false,
    },
    mode: "onChange",
  });

  const { isSubmitting } = form.formState; // --- Submission ---

  const onSubmit = async (values: PregnancyNutritionFormValues) => {
    try {
      const cleanValues = {
        ...values,
        healthBenefits: values.healthBenefits.filter((b) => b.trim() !== ""),
        nutritionFacts: values.nutritionFacts.filter(
          (nf) => nf.nutrient.trim() !== "" && nf.value.trim() !== ""
        ),
        foodImage: values.foodImage?.trim() || "",
      };

      let submittedId = cleanValues.id;

      if (mode === "create") {
        const response = await createPregnancyNutritionTip(cleanValues as any);
        if (!response?.success || !response.data?.data) {
          toast.error(response?.message || "Failed to create tip.");
          return;
        }
        submittedId = response.data.data.id;
        toast.success("Nutrition tip created successfully! 🥗");
        form.reset();
        router.push(`/dashboard/pregnancy-tips/edit/${submittedId}`);
      } else if (mode === "edit" && cleanValues.id) {
        const response = await updatePregnancyNutritionTip(
          cleanValues.id,
          cleanValues as any
        );
        if (!response?.success) {
          toast.error(response.message || "Update failed.");
          return;
        }
        toast.success("Nutrition tip updated successfully! 🎉");
        router.push(`/dashboard/pregnancy-tips`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
    queryClient.invalidateQueries({ queryKey: ["pregnancy-nutrition"] });
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 col-span-1"
        >
          <LeftColumn form={form} mode={mode} /> 
          <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Fields marked with 
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> required
                 
                </span>
              </p>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[140px] h-12 bg-gradient-to-r from-primary to-primary/80"
              >
                {isSubmitting
                  ? "Saving..."
                  : mode === "create"
                  ? "Create Tip"
                  : "Update Tip"}
              </Button>
            </div>
          </div>
        </form>
        <div className="col-span-1">
          <RightColumn
            form={form}
            mode={mode}
            tipId={initialValues?.id || form.watch("id")}
          />
        </div>
      </div>
    </Form>
  );
};

export default MainForm;
