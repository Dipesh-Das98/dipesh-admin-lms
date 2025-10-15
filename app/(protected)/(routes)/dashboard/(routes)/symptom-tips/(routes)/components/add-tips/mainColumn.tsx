// /symptom-tips/(routes)/add/components/add-tips/mainColumn.tsx

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import LeftColumn from "./leftColumn"; 
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// 1. Import necessary actions and types for Symptom Tips
import { SymptomReliefTip } from "@/types/symptom-relief-tip.type"; 
import { createSymptomReliefTip } from "@/actions/dashboard/symptom-relief/create-symptom-relief-tip";
import { updateSymptomReliefTip } from "@/actions/dashboard/symptom-relief/update-symptom-relief-tip-by-id";

// --- Zod Schema Definition ---
const SymptomReliefTipSchema = z.object({
  id: z.string().optional(),
  symptomName: z.string().min(1, "Symptom Name is required"),
  tip: z.string().min(10, "The tip message must be at least 10 characters"),
  // z.boolean() is used (no .default()) to avoid TS error
  isActive: z.boolean(), 
});

export type SymptomReliefTipFormValues = z.infer<typeof SymptomReliefTipSchema>;

interface MainColumnProps {
  mode: "create" | "edit";
  initialValues?: SymptomReliefTip; 
}

const MainColumn: React.FC<MainColumnProps> = ({ mode, initialValues }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Initialize the form with zod resolver and default values
  const form = useForm<SymptomReliefTipFormValues>({
    resolver: zodResolver(SymptomReliefTipSchema),
    defaultValues: {
      id: mode === "edit" ? initialValues?.id : undefined,
      symptomName: mode === "edit" ? initialValues?.symptomName : "",
      tip: mode === "edit" ? initialValues?.tip : "",
      // MODIFIED: Set to false in 'create' mode.
      isActive: mode === "edit" ? initialValues?.isActive ?? false : false, 
    },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: SymptomReliefTipFormValues) => {
    try {
      let response;
      const payload = {
        symptomName: values.symptomName,
        tip: values.tip,
        isActive: values.isActive, 
      };

      if (mode === "create") {
        response = await createSymptomReliefTip({
            symptomName: payload.symptomName,
            tip: payload.tip,
        });
        if (!response.success || !response.data) {
          toast.error(response.message || "Failed to create Symptom Relief Tip.");
          return;
        }
        toast.success("Symptom Relief Tip created successfully!");
        form.reset();
        router.push(`/dashboard/symptom-tips/edit/${response.data.data.id}`); 
        
      } else if (mode === "edit" && values.id) {
        response = await updateSymptomReliefTip(values.id, payload);

        if (!response.success) {
          toast.error(response.message || "Update failed. Please try again.");
          return;
        }

        toast.success("Symptom Relief Tip updated successfully!");
        router.push(`/dashboard/symptom-tips`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong.");
    }

    queryClient.invalidateQueries({ queryKey: ["symptom-relief-tips"] });
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          
          <LeftColumn form={form} mode={mode} />

          {/* Submission Bar (Footer) */}
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 mt-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fields marked with{" "}
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" /> are required
                    </span>
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    className="min-w-[140px] h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-md hover:shadow-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>Saving...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                              mode === "create"
                                ? "M12 6v6m0 0v6m0-6h6m-6 0H6" 
                                : "M5 13l4 4L19 7"
                            }
                          />
                        </svg>
                        <span>
                          {mode === "create" ? "Create Tip" : "Update Tip"}
                        </span>
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
        </div>
      </form>
    </Form>
  );
};

export default MainColumn;