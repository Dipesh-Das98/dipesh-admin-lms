"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCourseSchema } from "@/schema";
import { LoadingButton } from "@/components/ui/loading-button";
import { SheetClose } from "@/components/ui/sheet";
import { Category } from "@/types";import { gradeOptions } from "@/config/forms/common-form-options";
import { createCourse } from "@/actions/dashboard/course/create-course";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface CourseFormProps {
  type?: "sheet" | "page";
  categories: Category[];
  handleClose?: () => void;
}
const CourseForm = ({ type = "page", categories,handleClose }: CourseFormProps) => {
  // ---------------------------------------hooks---------------------------------------
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof createCourseSchema>>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      grade: "",
    },
  });

  const router = useRouter();

  // ---------------------------------------state---------------------------------------

  const { isSubmitting, isValid } = form.formState;

  // ---------------------------------------handlers---------------------------------------
  const createMutation = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course created successfully");
      form.reset();
      if (type === "sheet") {
        handleClose?.();
      }
      router.push("/dashboard/course");
    },
    onError: () => {
      toast.error("Failed to create course");
    },
  });

  const handleSubmit = async (data: z.infer<typeof createCourseSchema>) => {
    createMutation.mutate({ data });
  };

  return (
    <Form {...form}>
      <form
        className="mt-6 space-y-8 "
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="title">Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={isSubmitting}
                  placeholder="e.g. Introduction to JavaScript"
                />
              </FormControl>

              <FormDescription>
                What will students learn in your course?
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className={cn("grid grid-cols-1 sm:grid-cols-2 gap-4",type === "sheet" && "sm:grid-cols-1")}>
          {/* Category */}
          <div>
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the category that best fits your course content.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            {/* Grade */}
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a grade level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {gradeOptions.map((grade) => (
                        <SelectItem key={grade.value} value={grade.value}>
                          {grade.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the appropriate grade level for this course.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center gap-x-2">
          {type === "sheet" ? (
            <SheetClose asChild>
              <Button type="button" variant={"ghost"}>
                Cancel
              </Button>
            </SheetClose>
          ) : (
            <Link href="/dashboard/teacher/courses">
              <Button type="button" variant={"ghost"}>
                Cancel
              </Button>
            </Link>
          )}

          <LoadingButton
            type="submit"
            disabled={!isValid || isSubmitting}
            isLoading={isSubmitting}
          >
            Continue
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
