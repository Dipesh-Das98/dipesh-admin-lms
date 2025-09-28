"use client";
import React, { FC } from "react";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Loader2, Pencil } from "lucide-react";

import { createChapterForm } from "@/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Course } from "@/types";
import { cn } from "@/lib/utils";
import ChaptersList from "./chapter-list";
import { createChapter } from "@/actions/dashboard/course/create-chapter";
import { reorderChapters } from "@/actions/dashboard/course/reorder-chapters";

interface ChaptersFormProps {
  initialData: Course;
  courseId: string;
}
const ChaptersForm: FC<ChaptersFormProps> = ({ initialData, courseId }) => {
  // ---------------------------------------hooks---------------------------------------
  const form = useForm<z.infer<typeof createChapterForm>>({
    resolver: zodResolver(createChapterForm),
    defaultValues: {
      title: "",
    },
  });

  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  // ---------------------------------------state---------------------------------------
  const { isValid } = form.formState;
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);

  // ---------------------------------------mutations---------------------------------------
  const createChapterMutation = useMutation({
    mutationFn: createChapter,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Chapter created successfully!");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        setIsCreating(false);
        form.reset();
        router.refresh();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create chapter error:", error);
      toast.error("Failed to create chapter. Please try again.");
    },
  });

  const reorderChaptersMutation = useMutation({
    mutationFn: reorderChapters,
    onSuccess: async (response) => {
      if (response.success) {
        toast.success("Chapters reordered successfully!");
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Reorder chapters error:", error);
      toast.error("Failed to reorder chapters. Please try again.");
    },
    onSettled: () => {
      setIsUpdating(false);
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  //   ---------------------------------------handlers---------------------------------------

  const toggleCreate = () => {
    setIsCreating((prev) => !prev);
    if (isCreating) {
      form.reset();
    }
  };

  const handleSubmit = async (data: z.infer<typeof createChapterForm>) => {
    try {
      createChapterMutation.mutate({
        courseId,
        title: data.title,
      });
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay
      reorderChaptersMutation.mutate({
        courseId,
        chapters: updateData,
      });
    } catch (err) {
      console.error("Reorder error:", err);
      setIsUpdating(false);
    }
  };

  const onEdit = (chapterId: string) => {
    router.push(`${pathname}/chapters/${chapterId}`);
  };

  return (
    <div className="mt-6 relative  bg-slate-100 dark:bg-neutral-800 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full flex items-center justify-center w-full bg-slate-500/20 top-0 right-0 rounded-md">
          <Loader2 className="animate-spin size-4" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Course Chapters
        <div className="flex items-center">
          <Button onClick={toggleCreate} variant={"ghost"}>
            {isCreating ? (
              <>Cancel</>
            ) : (
              <>
                {" "}
                <Pencil className="iconsmright" />
                Edit Chapters
              </>
            )}
          </Button>
          {/* undo */}
        </div>
      </div>

      {isCreating && (
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
                      disabled={createChapterMutation.isPending}
                      placeholder="e.g. 'Chapter 1: Introduction to React'"
                    />
                  </FormControl>
                  <FormMessage {...field} />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2 ">
              <LoadingButton
                isLoading={createChapterMutation.isPending}
                type="submit"
                disabled={!isValid || createChapterMutation.isPending}
              >
                create
              </LoadingButton>
            </div>
          </form>
        </Form>
      )}

      {
        <div
          className={cn(
            "text-sm mt-2 ",
            !initialData.chapters?.length &&
              "text-slate-500 italic dark:text-slate-400"
          )}
        >
          {!initialData.chapters?.length && "No Chapters"}

          <ChaptersList
            onEdit={onEdit}
            onReadOrder={onReorder}
            items={initialData.chapters || []}
          />
        </div>
      }
      {initialData.chapters && initialData.chapters?.length > 0 && (
        <p className="text-sm mt-2 text-slate-500 dark:text-slate-400">
          Drag and drop chapters here to add them to the course
        </p>
      )}
    </div>
  );
};

export default ChaptersForm;
