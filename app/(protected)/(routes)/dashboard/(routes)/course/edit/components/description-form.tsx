"use client";
import React, { FC } from "react";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { descriptionSchema } from "@/schema";
import { Pencil } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "@/actions/dashboard/course/update-course";
import { toast } from "sonner";
import { Course } from "@/types";

interface DescriptionFormProps {
  initialData: Course;
  courseId: string;
}
const DescriptionForm: FC<DescriptionFormProps> = ({
  initialData,
  courseId,
}) => {
  // ---------------------------------------hooks---------------------------------------
  const form = useForm<z.infer<typeof descriptionSchema>>({
    resolver: zodResolver(descriptionSchema),
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
    mutationFn: updateCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Course description updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        toggleEdit();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update course error:", error);
      toast.error("Failed to update course description. Please try again.");
    },
  });

  //   ---------------------------------------handlers---------------------------------------

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSubmit = async (data: z.infer<typeof descriptionSchema>) => {
    try {
      updateMutation.mutate({
        id: courseId,
        description: data.description,
      });
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  return (
    <div className="mt-6 bg-slate-100 dark:bg-neutral-800 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Description
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="iconsmright" />
              Edit Description
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={`text-sm mt-2 ${!initialData.description && "text-slate-500 italic"}`}>
          {initialData.description || "No description"}
        </p>
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
                      placeholder="e.g. This course is about..."
                      className="min-h-[120px] resize-none"
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
                size={"sm"}
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

export default DescriptionForm;
