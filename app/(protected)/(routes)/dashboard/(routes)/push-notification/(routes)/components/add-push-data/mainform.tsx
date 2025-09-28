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
// NOTE: You need to create these actions on your backend/server
import { createPushNotificationTemplate } from "@/actions/dashboard/push-notification/create-push-notification";
import { updatePushNotificationTemplate } from "@/actions/dashboard/push-notification/update-push-notification-by-id";
// This assumes the user's input time is in their local timezone and we want to convert it to UTC.
const toISOString = (dateTimeLocalString: string): string => {
    if (!dateTimeLocalString) return "";
    // Creates a Date object, interpreting the string as local time, then converts to ISO (Z means UTC)
    return new Date(dateTimeLocalString).toISOString();
};


// --- 1. Push Notification Schema Definition ---
const pushNotificationSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message content is required"),
  // datetime-local input returns a string like "YYYY-MM-DDTHH:MM"
  startTime: z.string().min(1, "Start Time is required"),
  endTime: z.string().min(1, "End Time is required"),
});

export type PushNotificationFormValues = z.infer<typeof pushNotificationSchema>;

interface MainFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<PushNotificationFormValues>;
}

const MainForm: React.FC<MainFormProps> = ({ mode, initialValues }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // NOTE: When setting initialValues for edit mode, if the backend sends ISO 8601
  // we must convert it back to the "YYYY-MM-DDTHH:MM" format for the input[type=datetime-local].
  const toDateTimeLocalFormat = (isoString?: string) => {
    if (!isoString) return "";
    // Date() will parse the ISO string (which should be UTC 'Z')
    const date = new Date(isoString);
    // Use toJSON() and slice to get the "YYYY-MM-DDTHH:MM" part for the input value
    return date.toJSON().slice(0, 16); 
  }

  const form = useForm<PushNotificationFormValues>({
    resolver: zodResolver(pushNotificationSchema),
    defaultValues: {
      id: mode === "edit" ? initialValues?.id || "" : undefined,
      title: mode === "edit" ? initialValues?.title || "" : "",
      message: mode === "edit" ? initialValues?.message || "" : "",
      startTime: mode === "edit" ? toDateTimeLocalFormat(initialValues?.startTime) : "",
      endTime: mode === "edit" ? toDateTimeLocalFormat(initialValues?.endTime) : "",
    },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: PushNotificationFormValues) => {
    try {
      // --- KEY CHANGE: Convert date/time strings to ISO 8601 format ---
      const payload = {
        title: values.title,
        message: values.message,
        startTime: toISOString(values.startTime), // Converted to ISO 8601
        endTime: toISOString(values.endTime),     // Converted to ISO 8601
      };

      if (mode === "create") {
        const response = await createPushNotificationTemplate(payload);
        // ... (rest of create logic)
        if (!response?.success || !response.data) {
          toast.error("Failed to create Push Notification. Please try again.");
          return;
        }
        toast.success("Push Notification created successfully!");
        form.reset();
        router.push(`/dashboard/push-notification`); 
      } else if (mode === "edit" && values.id) {
        // ... (rest of update logic)
        const response = await updatePushNotificationTemplate(values.id, payload);

        if (!response?.success) {
          toast.error("Update failed. Please try again.");
          return;
        }

        toast.success("Push Notification updated successfully!");
        router.push(`/dashboard/push-notification`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong.");
    }

    queryClient.invalidateQueries({ queryKey: ["push-notifications"] });
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 gap-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 col-span-1"
        >
          <LeftColumn form={form} /> 
          
          {/* Actions Bar (Kept the same) */}
          <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* ... (Info content) ... */}
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
                        {mode === "create" ? "Create Notification" : "Update Notification"}
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