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
import { Input } from "@/components/ui/input";
import { titleSchema } from "@/schema";
import { Pencil } from "lucide-react";
import { LoadingButton } from "@/components/ui/loading-button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "@/actions/dashboard/course/update-course";
import { toast } from "sonner";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}
const TitleForm: FC<TitleFormProps> = ({ initialData, courseId }) => {
  // ---------------------------------------hooks---------------------------------------
  const form = useForm<z.infer<typeof titleSchema>>({
    resolver: zodResolver(titleSchema),
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
    mutationFn: updateCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Course title updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });

        toggleEdit();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update course error:", error);
      toast.error("Failed to update course title. Please try again.");
    },
  });

  //   ---------------------------------------handlers---------------------------------------

  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSubmit = async (data: z.infer<typeof titleSchema>) => {
    try {
      updateMutation.mutate({
        id: courseId,
        title: data.title,
      });
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };
  return (
    <div className="mt-6   bg-slate-100 dark:bg-neutral-800 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Title
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
                      placeholder="e.g. Introduction to JavaScript"
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

export default TitleForm;
