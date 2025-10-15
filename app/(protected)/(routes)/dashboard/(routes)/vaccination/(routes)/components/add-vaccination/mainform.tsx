// components/add-vaccination/mainform.tsx
"use client";

import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import LeftColumn, { LeftColumnFormValues } from "./leftColumn"; 
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { createVaccination } from "@/actions/dashboard/vaccination/createVaccination";
import { updateVaccination } from "@/actions/dashboard/vaccination/updateVaccination";

const vaccinationSchema = z.object({
  id: z.string().optional(),
  vaccineName: z.string().min(1, "Vaccine Name is required"),
  weekNumber: z.coerce.number().min(1, "Week Number is required and must be at least 1"),
  description: z.string().min(1, "Description is required"),
  isActive: z.boolean(),
});

export type CreateVaccinationFormValues = z.infer<typeof vaccinationSchema>;

interface MainFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<CreateVaccinationFormValues>;
}

const MainForm: React.FC<MainFormProps> = ({ mode, initialValues }) => {

  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateVaccinationFormValues>({
    resolver: zodResolver(vaccinationSchema),
    defaultValues: {
      id: mode === "edit" ? initialValues?.id || "" : undefined,
      vaccineName: "", // Updated field
      weekNumber: 0,   // Updated field
      description: "", // Updated field
      isActive: false,
      ...(mode === "edit" ? initialValues : {}),
    },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: CreateVaccinationFormValues) => {
    try {
      console.log("Submitting form with values:", values);

      if (mode === "create") {
        const response = await createVaccination(values); 
        if (!response?.success || !response.data) {
          console.error("Create failed:", response?.message);
          toast.error(response?.message || "Failed to create vaccination record. Please try again.");
          return;
        }

        const createdId = response.data.id;
        // 5. UPDATED SUCCESS MESSAGE
        toast.success("Vaccination record created successfully!");

        form.reset();

        // 5. UPDATED REDIRECT PATH
        router.push(`/dashboard/vaccination/edit/${createdId}`);

      } else if (mode === "edit" && values.id) {
        
        // Extract fields for update. We MUST exclude the ID from the body
        const { id, ...updateData } = values; 

        // 4. CALL NEW UPDATE ACTION
        const response = await updateVaccination(id, updateData);

        if (!response?.success) {
          console.error("Update failed:", response.message);
          toast.error(response?.message || "Update failed. Please try again.");
          return;
        }

        // 5. UPDATED SUCCESS MESSAGE
        toast.success("Vaccination record updated successfully!");
        
        // 5. UPDATED REDIRECT PATH
        router.push(`/dashboard/vaccination`);
      }

    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong.");
    }
    queryClient.invalidateQueries({ queryKey: ["all-vaccinations"] })
  };


  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 col-span-1"
        >
=          <LeftColumn form={form as unknown as UseFormReturn<LeftColumnFormValues>} />
          <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-amber-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Fields marked with{" "}
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500" /> are required
                  </span>
                </p>
              </div>

              {/* Buttons */}
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
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={
                            mode === "create"
                              ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                              : "M5 13l4 4L19 7"
                          }
                        />
                      </svg>
                      {/* 5. UPDATED BUTTON TEXT */}
                      <span>
                        {mode === "create" ? "Create Vaccination" : "Update Vaccination"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Form>
  );

};

export default MainForm;