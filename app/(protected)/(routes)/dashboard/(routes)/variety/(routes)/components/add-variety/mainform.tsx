"use client";

import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import LeftColumn, { LeftColumnFormValues } from "./leftColumn";
import RightColumn from "./rightColumn";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createVariety } from "@/actions/dashboard/variety/create-variety";
import { updateVariety } from "@/actions/dashboard/variety/update-variety-by-id";
import { useQueryClient } from "@tanstack/react-query";

const varietySchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  thumbnailUrl: z.union([z.string(), z.null()]),
  videoUrl: z.union([z.string(), z.null()]),
  isActive: z.boolean()
});

type CreateVarietyFormValues = z.infer<typeof varietySchema>;

interface MainFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<CreateVarietyFormValues>;
}

const MainForm: React.FC<MainFormProps> = ({ mode, initialValues }) => {

  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateVarietyFormValues>({
    resolver: zodResolver(varietySchema),
    defaultValues: {
      id: mode === "edit" ? initialValues?.id || "" : undefined,
      title: "",
      description: "",
      isActive: false,
      thumbnailUrl: null,
      videoUrl: null,
      ...(mode === "edit" ? initialValues : {}),
    },
  });

  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: CreateVarietyFormValues) => {
    try {
      console.log("Submitting form with values:", values);

      if (mode === "create") {
        const response = await createVariety(values);
        if (!response?.success || !response.data) {
          console.error("Create failed:", response?.message);
          toast.error("Failed to create story. Please try again.");
          return;
        }

        const createdId = response.data.id;
        toast.success("Story created successfully!");

        // Optional: reset form here
        form.reset();

        // Redirect to edit page
        router.push(`/dashboard/variety/edit/${createdId}`);
      } else if (mode === "edit" && values.id) {
        const { id, thumbnailUrl, videoUrl, ...rest } = values;

        const response = await updateVariety({
          id,
          ...rest,
          ...(thumbnailUrl !== null ? { thumbnailUrl } : {}),
          ...(videoUrl !== null ? { videoUrl } : {}),
        });

        if (!response?.success) {
          console.error("Update failed:", response.message);
          toast.error("Update failed. Please try again.");
          return;
        }

        toast.success("Story updated successfully!");
        router.push(`/dashboard/variety`);
      }

    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong.");
    }
    queryClient.invalidateQueries({ queryKey: ["variety-courses"] })
  };




  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left form and submission buttons inside the form */}
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 col-span-1"
        >
          <LeftColumn form={form as unknown as UseFormReturn<LeftColumnFormValues>} />
          <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Info note */}
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
                      <span>
                        {mode === "create" ? "Create Content" : "Update Content"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>

        {/* Right column: Thumbnail uploader (now outside form) */}
        {mode === "edit" && initialValues?.id && (
          <div className="col-span-1">
            <RightColumn
              form={form}
              storyId={initialValues.id}
            />
          </div>
        )}
      </div>
    </Form>
  );

};

export default MainForm;