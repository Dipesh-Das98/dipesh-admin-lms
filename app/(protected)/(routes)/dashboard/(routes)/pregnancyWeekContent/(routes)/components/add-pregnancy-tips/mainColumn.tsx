// components/add-pregnancy-tips/mainColumn.tsx (Updated for Pregnancy Week Content)
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
// FIX: Update imports to use the new actions we created
import { useQueryClient } from "@tanstack/react-query";
// FIX: Update type import
import {
  PregnancyWeekContent,
  CreatePregnancyWeekData,
  UpdatePregnancyWeekData,
} from "@/types/pregnancy.type";
import { createPregnancyWeekContent } from "@/actions/dashboard/pregnancy/create-pregnancy";
import { updatePregnancyWeekContent } from "@/actions/dashboard/pregnancy/update-pregnancy-by-id";

// --- ZOD SCHEMA ---
// FIX: Replace the Nutrition schema with the Pregnancy Week Content schema
const pregnancyWeekContentSchema = z
  .object({
    id: z.string().optional(),
    week: z.number().int().min(1, "Week must be 1 or greater."),
    trimester: z.number().int().min(1).max(3, "Trimester must be 1, 2, or 3."),
    fetalSizeCm: z.number().min(0.1, "Fetal size is required."),
    sizeComparison: z.string().min(1, "Size comparison text is required."),
    comparisonImage: z.union([z.string().url("Must be a valid URL"), z.null()]),
    developmentMilestones: z
      .array(z.string().min(1, "Milestone text is required"))
      .min(1, "At least one development milestone is required"),
    maternalChanges: z
      .array(z.string().min(1, "Maternal change text is required"))
      .min(1, "At least one maternal change is required"),
    hasHeartbeat: z.boolean(),
    heartbeatAudio: z.union([z.string().url("Must be a valid URL"), z.null()]),
  })

// FIX: Update the form values type
export type PregnancyWeekContentFormValues = z.infer<
  typeof pregnancyWeekContentSchema
>;

interface MainFormProps {
  mode: "create" | "edit";
  // FIX: Use the correct initial values type
  initialValues?: Partial<PregnancyWeekContent>;
}

// FIX: Rename the component
const PregnancyWeekContentForm: React.FC<MainFormProps> = ({ mode, initialValues }) => {
  const router = useRouter();
  const queryClient = useQueryClient(); 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<PregnancyWeekContentFormValues, any, PregnancyWeekContentFormValues >({
    resolver: zodResolver(pregnancyWeekContentSchema),
    defaultValues: {
      // FIX: Update default values to match the new schema
      id: mode === "edit" ? initialValues?.id ?? "" : undefined,
      week: initialValues?.week ?? 1,
      trimester: initialValues?.trimester ?? 1,
      fetalSizeCm: initialValues?.fetalSizeCm ?? 0.1,
      sizeComparison: initialValues?.sizeComparison ?? "",
      comparisonImage: initialValues?.comparisonImage ?? null,
      developmentMilestones: initialValues?.developmentMilestones ?? [""],
      maternalChanges: initialValues?.maternalChanges ?? [""],
      hasHeartbeat: initialValues?.hasHeartbeat ?? true,
      heartbeatAudio: initialValues?.heartbeatAudio ?? null,
    },
    mode: "onChange",
  });

  const { isSubmitting } = form.formState; // --- Submission ---

  const onSubmit = async (values: PregnancyWeekContentFormValues) => {
    try {
      // FIX: Adjust cleanValues to match the new fields
      const cleanValues = {
        ...values,
        developmentMilestones: values.developmentMilestones.filter((b) => b.trim() !== ""),
        maternalChanges: values.maternalChanges.filter((c) => c.trim() !== ""),
        comparisonImage: values.comparisonImage?.trim() || "",
        heartbeatAudio: values.heartbeatAudio?.trim() || "",
      };

      let submittedId = cleanValues.id;

      if (mode === "create") {
        // FIX: Call the new create action
        // We cast to CreatePregnancyWeekData because we clean the empty array items
        const response = await createPregnancyWeekContent(cleanValues as CreatePregnancyWeekData); 
        if (!response?.success || !response.data) {
          toast.error(response?.message || "Failed to create pregnancy week content.");
          return;
        }
        // The data in createPregnancyWeekContent is nested under data: result.data.data
        submittedId = response.data.id; 
        toast.success("Pregnancy Week Content created successfully! 🎉");
        form.reset();
        // FIX: Update routing path
        router.push(`/dashboard/pregnancyWeekContent/edit/${submittedId}`);
      } else if (mode === "edit" && cleanValues.id) {
        // FIX: Call the new update action
        // We send the entire cleaned object for a PATCH request
        const response = await updatePregnancyWeekContent(
          cleanValues.id,
          cleanValues as UpdatePregnancyWeekData
        );
        if (!response?.success) {
          toast.error(response.message || "Update failed.");
          return;
        }
        toast.success("Pregnancy Week Content updated successfully! ✅");
        // FIX: Update routing path
        router.push(`/dashboard/pregnancyWeekContent`); 
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
    // FIX: Update query key
    queryClient.invalidateQueries({ queryKey: ["pregnancy-week-content"] });
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 col-span-1"
        >
          {/* Form fields will need to be updated in LeftColumn.tsx */}
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
                  ? "Create Content"
                  : "Update Content"} 
              </Button>
            </div>
          </div>
        </form>
        <div className="col-span-1">
          {/* RightColumn will need prop types and content updates */}
          <RightColumn
            form={form}
            mode={mode}
            contentId={initialValues?.id || form.watch("id")} // FIX: Rename prop to contentId
          />
        </div>
      </div>
    </Form>
  );
};

export default PregnancyWeekContentForm; // FIX: Export the renamed component