"use client";

import React, { FC } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { CustomColorPicker } from "@/components/ui/custom-color-picker";
import { LoadingButton } from "@/components/ui/loading-button";
import { backgroundColorSchema } from "@/schema";
import { updateCourse } from "@/actions/dashboard/course/update-course";
import { Course } from "@/types";
import { backgroundColorOptions } from "@/config/forms/story-form-options";

interface BackgroundColorFormProps {
  initialData: Course;
  courseId: string;
}

const BackgroundColorForm: FC<BackgroundColorFormProps> = ({ initialData, courseId }) => {
  // ---------------------------------------hooks---------------------------------------
  const form = useForm<z.infer<typeof backgroundColorSchema>>({
    resolver: zodResolver(backgroundColorSchema),
    defaultValues: {
      backgroundColor: initialData.backgroundColor || "",
    },
  });

  const queryClient = useQueryClient();

  // ---------------------------------------state---------------------------------------
  const { isValid } = form.formState;
  const [isEditing, setIsEditing] = React.useState(false);

  // ---------------------------------------mutations---------------------------------------
  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Course background color updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        setIsEditing(false);
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update course error:", error);
      toast.error("Failed to update course background color. Please try again.");
    },
  });

  // ---------------------------------------handlers---------------------------------------
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      form.reset({ backgroundColor: initialData.backgroundColor || "" });
    }
  };

  const handleSubmit = (data: z.infer<typeof backgroundColorSchema>) => {
    updateMutation.mutate({
      id: courseId,
      backgroundColor: data.backgroundColor,
    });
  };

  const selectedColor = backgroundColorOptions.find(color => color.value === initialData.backgroundColor);

  return (
    <div className="mt-6 bg-slate-100 dark:bg-neutral-800 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Background Color
        <Button onClick={toggleEdit} variant="ghost" size="sm">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Color
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4">
          {initialData.backgroundColor ? (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-neutral-700 rounded-lg border border-slate-200 dark:border-neutral-600">
              <div 
                className="w-8 h-8 rounded-lg border-2 border-white shadow-sm" 
                style={{ 
                  backgroundColor: initialData.backgroundColor,
                  boxShadow: `0 0 0 1px ${initialData.backgroundColor}, 0 2px 4px rgba(0,0,0,0.1)`
                }}
              />
              <div className="flex-1">
                <div className="text-sm font-medium">
                  {selectedColor ? selectedColor.label : 'Custom Color'}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {initialData.backgroundColor}
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-neutral-600 px-2 py-1 rounded">
                {selectedColor ? 'Curated' : 'Custom'}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-neutral-700 rounded-lg border border-dashed border-slate-300 dark:border-neutral-600">
              <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-neutral-600 border border-slate-300 dark:border-neutral-500 flex items-center justify-center">
                <span className="text-xs text-slate-400">?</span>
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400 italic">
                No background color selected
              </span>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="backgroundColor"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomColorPicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={updateMutation.isPending}
                      name="Course Background"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <LoadingButton
                isLoading={updateMutation.isPending}
                type="submit"
                size="sm"
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

export default BackgroundColorForm;
