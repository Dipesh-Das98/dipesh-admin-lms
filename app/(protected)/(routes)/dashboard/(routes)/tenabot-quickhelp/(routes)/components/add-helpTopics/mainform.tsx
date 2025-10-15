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
import { createHelpTopic } from "@/actions/dashboard/help-topics/create-helptopics";
import { updateHelpTopic } from "@/actions/dashboard/help-topics/edit-helptopics-by-id";
import RightColumn from "./rightColumn";

const helpTopicSchema = z.object({
  id: z.string().optional(),
  topicName: z.string().min(1, "Topic Name is required"),
  questions: z.array(z.string().min(1, "Query cannot be empty")),
  iconUrl: z.union([z.string(), z.null()]),
});

type CreateHelpTopicFormValues = z.infer<typeof helpTopicSchema>;

interface MainFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<CreateHelpTopicFormValues>;
}

const MainForm: React.FC<MainFormProps> = ({ mode, initialValues }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateHelpTopicFormValues>({
    resolver: zodResolver(helpTopicSchema),
    defaultValues: {
      id: mode === "edit" ? initialValues?.id || "" : undefined,
      topicName: mode === "edit" ? initialValues?.topicName || "" : "",
      questions: mode === "edit" ? initialValues?.questions || [] : [],
      iconUrl: mode === "edit"
      ? initialValues?.iconUrl ?? null // ✅ keep existing if available
      : null,
    },
  });


  const { formState: { isSubmitting } } = form;

  const onSubmit = async (values: CreateHelpTopicFormValues) => {
    try {
      const payload = {
        topicName: values.topicName,
        questions: values.questions, // already string[]
      };

      if (mode === "create") {
        const response = await createHelpTopic(payload);
        if (!response?.success || !response.data) {
          toast.error("Failed to create Help Topic. Please try again.");
          return;
        }
        toast.success("Help Topic created successfully!");
        form.reset();
        router.push(`/dashboard/tenabot-quickhelp/edit/${response.data.data.id}`);
      } else if (mode === "edit" && values.id) {
        const iconUrl = values.iconUrl ?? undefined;
        const response = await updateHelpTopic(values.id, {...payload, iconUrl});

        if (!response?.success) {
          toast.error("Update failed. Please try again.");
          return;
        }

        toast.success("Help Topic updated successfully!");
        router.push(`/dashboard/tenabot-quickhelp`);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Something went wrong.");
    }

    queryClient.invalidateQueries({ queryKey: ["help-topics"] });
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 col-span-1"
        >
          <LeftColumn form={form as unknown as UseFormReturn<LeftColumnFormValues>} />
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
                        {mode === "create" ? "Create Help Topic" : "Update Help Topic"}
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
              topicId={initialValues.id}
            />
          </div>
        )}
      </div>
    </Form>
  );
};

export default MainForm;
