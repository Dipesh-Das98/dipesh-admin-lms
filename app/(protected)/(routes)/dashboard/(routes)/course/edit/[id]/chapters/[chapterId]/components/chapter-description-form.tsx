"use client";
import React, { FC } from "react";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

import { chapterDescriptionSchema } from "@/schema";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Chapter } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { updateChapter } from "@/actions/dashboard/course/chapter/update-chapter";

interface ChapterDescriptionFormProps {
  initialData: Chapter;
  courseId: string;
}
const ChapterDescriptionForm: FC<ChapterDescriptionFormProps> = ({
  initialData,
  courseId,
}) => {
  // ---------------------------------------hooks---------------------------------------
  const form = useForm<z.infer<typeof chapterDescriptionSchema>>({
    resolver: zodResolver(chapterDescriptionSchema),
    defaultValues: {
      description: initialData.description || "",
    },
  });

  const queryClient = useQueryClient();

  // ---------------------------------------state---------------------------------------
  const { isValid } = form.formState;
  const [isEditing, setIsEditing] = React.useState(false);

  // ---------------------------------------mutations---------------------------------------
  const updateMutation = useMutation({
    mutationFn: updateChapter,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Chapter description updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["chapter", initialData.id] });
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        setIsEditing(false);
      } else {
        toast.error(response.message || "Failed to update chapter description");
      }
    },
    onError: (error) => {
      console.error("Update chapter description error:", error);
      toast.error("Failed to update chapter description. Please try again.");
    },
  });

  //   ---------------------------------------handlers---------------------------------------

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSubmit = async (data: z.infer<typeof chapterDescriptionSchema>) => {
    try {
      updateMutation.mutate({
        id: initialData.id,
        courseId: courseId,
        description: data.description || "",
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="mt-6   bg-slate-100 dark:bg-neutral-800 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Description
        <div className="flex items-center">
          <Button onClick={toggleEdit} variant={"ghost"}>
            {isEditing ? (
              <>Cancel</>
            ) : (
              <>
                {" "}
                <Pencil className="iconsmright" />
                Edit chapter
              </>
            )}
          </Button>
        </div>
      </div>
      {!isEditing && (
        <div>
          <div className="mt-4">
            <div
              className="prose prose-slate dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: initialData.description || "",
              }}
            />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            <p>
              This description will be visible to students in the chapter
              section.
            </p>
          </div>
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={updateMutation.isPending}
                      placeholder="Write a detailed description of the chapter..."
                      className="resize-none"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <LoadingButton 
                type="submit" 
                isLoading={updateMutation.isPending}
                disabled={!isValid || updateMutation.isPending}
              >
                Save
              </LoadingButton>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ChapterDescriptionForm;
