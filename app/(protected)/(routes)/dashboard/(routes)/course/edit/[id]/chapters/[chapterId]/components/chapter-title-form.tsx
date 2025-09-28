"use client";
import React, { FC } from "react";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { chapterTitleSchema } from "@/schema";
import { Pencil } from "lucide-react";

import { LoadingButton } from "@/components/ui/loading-button";
import { Chapter } from "@/types";
import { updateChapter } from "@/actions/dashboard/course/chapter/update-chapter";

interface ChapterTitleFormProps {
  initialData: Chapter;
  courseId: string;
}
const ChapterTitleForm: FC<ChapterTitleFormProps> = ({
  initialData,
  courseId,
}) => {
  // ---------------------------------------hooks---------------------------------------
  const form = useForm<z.infer<typeof chapterTitleSchema>>({
    resolver: zodResolver(chapterTitleSchema),
    defaultValues: {
      title: initialData.title,
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
        toast.success("Chapter title updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["chapter", initialData.id] });
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        setIsEditing(false);
      } else {
        toast.error(response.message || "Failed to update chapter title");
      }
    },
    onError: (error) => {
      console.error("Update chapter title error:", error);
      toast.error("Failed to update chapter title. Please try again.");
    },
  });

  //   ---------------------------------------handlers---------------------------------------

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSubmit = async (data: z.infer<typeof chapterTitleSchema>) => {
    try {
      updateMutation.mutate({
        id: initialData.id,
        courseId: courseId,
        title: data.title,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };
  return (
    <div className="mt-6   bg-slate-100 dark:bg-neutral-800 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter Title
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {" "}
              <Pencil className="iconsmright" />
              Edit Title
            </>
          )}
        </Button>
      </div>
      {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={updateMutation.isPending}
                      placeholder="e.g. Introduction to the course"
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <LoadingButton
                isLoading={updateMutation.isPending}
                type="submit"
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

export default ChapterTitleForm;
