// components/add-hospitals/mainform.tsx
"use client";

import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
// FIX: Import ONLY the component LeftColumn.
import LeftColumn from "./leftColumn"; 
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";


import { CreateHospitalData, HospitalRecord } from "@/types/hospital.type"; 
import { createHospital } from "@/actions/dashboard/hospital/createHospital";
import { updateHospital } from "@/actions/dashboard/hospital/updateHospital";


// --- Zod Schema for Hospital Data (The authoritative definition) ---
const HospitalVaccinationSlotSchema = z.object({
  date: z.string().min(1, "Date is required"),
  start: z.string().min(1, "Start time is required"),
  end: z.string().min(1, "End time is required"),
  session: z.string().min(1, "Session is required"),
});

const HospitalVaccinationSchema = z.object({
  name: z.string().min(1, "Vaccination Name is required"),
  age_range: z.string().min(1, "Age Range is required"),
  description: z.string().min(1, "Description is required"),
  slots: z.array(HospitalVaccinationSlotSchema),
});


const hospitalSchema = z.object({
  id: z.string().optional(), 
  name: z.string().min(3, "Hospital Name is required"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().min(10, "Phone number is required"),
  emergencyContact: z.string().min(5, "Emergency Contact is required"),
  rating: z.number().min(0, "Rating must be 0 or higher").max(5, "Rating must be 5 or lower"),
  latitude: z.number().nullable().optional(), 
  longitude: z.number().nullable().optional(), 
  vaccinations: z.array(HospitalVaccinationSchema).optional(), 
  isActive: z.boolean(),
});

// FIX: EXPORT the authoritative form values type here for LeftColumn to import
export type HospitalFormValues = z.infer<typeof hospitalSchema>; 

interface MainFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<HospitalRecord>;
}

const MainForm: React.FC<MainFormProps> = ({ mode, initialValues }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<HospitalFormValues>({
    resolver: zodResolver(hospitalSchema),
    defaultValues: {
      id: mode === "edit" ? initialValues?.id || undefined : undefined,
      name: initialValues?.name || "",
      address: initialValues?.address || "",
      phone: initialValues?.phone || "",
      emergencyContact: initialValues?.emergencyContact || "",
      rating: initialValues?.rating || 0,
      latitude: initialValues?.latitude || undefined,
      longitude: initialValues?.longitude || undefined,
      vaccinations: initialValues?.vaccinations || [],
      isActive: initialValues?.isActive ?? true,
    },
  });


  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: HospitalFormValues) => {
    try {
      const { id, ...payload } = values; 
      
      const hospitalPayload: CreateHospitalData = {
          ...payload,
          rating: payload.rating, 
          latitude: payload.latitude ?? 0, 
          longitude: payload.longitude ?? 0, 
          vaccinations: payload.vaccinations ?? [],
      }


      let response;

      // 2. Execute API Call (Using direct action files)
      if (mode === "create") {
        response = await createHospital(hospitalPayload);
        
        if (!response.success || !response.data) {
          toast.error(response.message || "Failed to create Hospital. Please try again.");
          return;
        }
        
        toast.success(response.message || "Hospital created successfully!");
        form.reset();
        router.push(`/hospitals/edit/${response.data.id}`); 
        
      } else if (mode === "edit" && id) {
        response = await updateHospital(id, hospitalPayload);

        if (!response.success) {
          toast.error(response.message || "Update failed. Please try again.");
          return;
        }

        toast.success(response.message || "Hospital updated successfully!");
        router.push(`/hospitals`); 
      }

    } catch (error) {
      console.error("Unexpected error:", error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong.";
      toast.error(errorMessage);
    }

    queryClient.invalidateQueries({ queryKey: ["hospitals"] });
  };

  return (
    <Form {...form}>
      <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 col-span-1"
        >
        <div className="grid grid-cols-1 gap-8">
            <LeftColumn form={form as unknown as UseFormReturn<HospitalFormValues>} />
        </div>
        
        {/* Button Bar / Bottom Info Section (Remains the same) */}
        <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 mt-8">
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
                      <span>
                        {mode === "create" ? "Create Hospital" : "Update Hospital"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
    </Form>
  );
};

export default MainForm;