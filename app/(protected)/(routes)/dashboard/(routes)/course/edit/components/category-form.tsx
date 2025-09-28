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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingButton } from "@/components/ui/loading-button";
import { categorySchema } from "@/schema";
import { updateCourse } from "@/actions/dashboard/course/update-course";
import { Course } from "@/types";
import { useCategory } from "@/hooks/use-category";

interface Category {
  id: string;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
}

const CategoryForm: FC<CategoryFormProps> = ({ initialData, courseId }) => {
  // ---------------------------------------hooks---------------------------------------
  const form = useForm<z.infer<typeof categorySchema>>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      categoryId: initialData.categoryId || "",
    },
  });

  const queryClient = useQueryClient();

  // Fetch categories
  const {
    data: categories = [],
    isLoading: categoriesLoading,
  } = useCategory<Category[]>("course");

  // ---------------------------------------state---------------------------------------
  const { isValid } = form.formState;
  const [isEditing, setIsEditing] = React.useState(false);

  // ---------------------------------------mutations---------------------------------------
  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Course category updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        setIsEditing(false);
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update course error:", error);
      toast.error("Failed to update course category. Please try again.");
    },
  });

  // ---------------------------------------handlers---------------------------------------
  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      form.reset({ categoryId: initialData.categoryId || "" });
    }
  };

  const handleSubmit = (data: z.infer<typeof categorySchema>) => {
    updateMutation.mutate({
      id: courseId,
      categoryId: data.categoryId,
    });
  };

  const selectedCategory = categories.find((cat: Category) => cat.id === initialData.categoryId);

  return (
    <div className="mt-6 bg-slate-100 dark:bg-neutral-800 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Category
        <Button onClick={toggleEdit} variant="ghost" size="sm">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Category
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className={`text-sm mt-2 ${!selectedCategory && "text-slate-500 italic"}`}>
          {selectedCategory?.name || "No category selected"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="categoryId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={updateMutation.isPending || categoriesLoading}
                    >
                      <SelectTrigger className="h-12 w-full border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category: Category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default CategoryForm;
