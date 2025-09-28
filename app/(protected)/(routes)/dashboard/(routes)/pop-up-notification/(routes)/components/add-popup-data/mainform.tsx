// /dashboard/pop-up-notifications/add/components/add-popup-data/mainform.tsx

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import LeftColumn from "./leftColumn";
import RightColumn from "./rightColumn";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// NOTE: Placeholder API actions - replace with your actual imports
import { createPopupNotificationTemplate } from "@/actions/dashboard/pop-up-notification/create-pop-up";
import { updatePopupNotificationTemplate } from "@/actions/dashboard/pop-up-notification/update-pop-up-by-id";

// Helper function for ISO 8601 conversion
const toISOString = (dateTimeLocalString: string): string => {
    if (!dateTimeLocalString) return "";
    return new Date(dateTimeLocalString).toISOString();
};

// --- Pop-up Notification Schema Definition ---
const popupNotificationSchema = z.object({
  id: z.string().optional(),
  imageUrl: z.string().url("Image URL must be a valid URL").min(1, "Image is required"),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message content is required"),
  
  // Button fields
  button1Label: z.string().min(1, "Button 1 Label is required"),
  button2Label: z.string().min(1, "Button 2 Label is required"),
  button2RedirectUrl: z.string().url("Redirect URL must be a valid URL"),
  
  // Audience - Using the confirmed values
  targetAudience: z.enum(["ALL_USERS", "PARENTS_ONLY"], {
    required_error: "Target audience is required",
  }),

  // Date/Time
  startTime: z.string().min(1, "Start Time is required"),
  endTime: z.string().min(1, "End Time is required"),
});

export type PopupNotificationFormValues = z.infer<typeof popupNotificationSchema>;

interface MainFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<PopupNotificationFormValues>;
}

const MainForm: React.FC<MainFormProps> = ({ mode, initialValues }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Function to convert ISO 8601 to "YYYY-MM-DDTHH:MM" for datetime-local input
  const toDateTimeLocalFormat = (isoString?: string) => {
    if (!isoString) return "";
    return new Date(isoString).toJSON().slice(0, 16); 
  }

  const form = useForm<PopupNotificationFormValues>({
    resolver: zodResolver(popupNotificationSchema),
    defaultValues: {
      id: mode === "edit" ? initialValues?.id || "" : undefined,
      imageUrl: mode === "edit" ? initialValues?.imageUrl || "" : "",
      title: mode === "edit" ? initialValues?.title || "" : "",
      message: mode === "edit" ? initialValues?.message || "" : "",
      button1Label: mode === "edit" ? initialValues?.button1Label || "" : "",
      button2Label: mode === "edit" ? initialValues?.button2Label || "" : "",
      button2RedirectUrl: mode === "edit" ? initialValues?.button2RedirectUrl || "" : "",
      targetAudience: initialValues?.targetAudience || "ALL_USERS",
      startTime: mode === "edit" ? toDateTimeLocalFormat(initialValues?.startTime) : "",
      endTime: mode === "edit" ? toDateTimeLocalFormat(initialValues?.endTime) : "",
    },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: PopupNotificationFormValues) => {
    try {
      // Convert date/time strings to ISO 8601 format for the backend
      const payload = {
        ...values,
        startTime: toISOString(values.startTime), 
        endTime: toISOString(values.endTime),    
      };

      if (mode === "create") {
        const response = await createPopupNotificationTemplate(payload);
        if (!response?.success || !response.data) {
          toast.error("Failed to create Pop-up Notification. Please try again.");
          return;
        }
        toast.success("Pop-up Notification created successfully!");
        form.reset();
        router.push(`/dashboard/pop-up-notification`); 
      } else if (mode === "edit" && values.id) {
        const response = await updatePopupNotificationTemplate(values.id, payload);

        if (!response?.success) {
          toast.error("Update failed. Please try again.");
          return;
        }

        toast.success("Pop-up Notification updated successfully!");
        router.push(`/dashboard/pop-up-notification`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong.");
    }

    queryClient.invalidateQueries({ queryKey: ["pop-up-notifications"] });
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 col-span-1"
        >
          {/* Left Column for content inputs */}
          <LeftColumn form={form} /> 
          
          {/* Actions Bar (Footer) */}
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
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
                        {mode === "create" ? "Create Pop-up" : "Update Pop-up"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Right Column for Image Upload */}
        <div className="col-span-1">
          <RightColumn form={form} />
        </div>
        
      </div>
    </Form>
  );
};

export default MainForm;