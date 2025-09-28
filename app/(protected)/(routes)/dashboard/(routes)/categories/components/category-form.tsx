"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// UI Components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomColorPicker } from "@/components/ui/custom-color-picker";

// Types and Schema
import { CATEGORY_TYPES, CreateCategoryData } from "@/types/category.type";
import {
  createCategorySchema,
  CreateCategoryFormData,
} from "@/schema/category-schema";

// Actions
import { createCategory } from "@/actions/dashboard/category/create-category";

// Icons
import { Save, Loader2 } from "lucide-react";
import FormItemInfo from "@/components/ui/form-label";
import { gradeOptions } from "@/config/forms/common-form-options";

interface CategoryFormProps {
  handleClose?: () => void;
  onSuccess?: () => void;
}

const CategoryForm = ({ handleClose, onSuccess }: CategoryFormProps) => {
  const queryClient = useQueryClient();

  // Form setup for create mode only
  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      type: undefined,
      description: "",
       grade: "",
      backgroundColor: "#3b82f6", // Default blue color
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Category created successfully!");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        form.reset();
        onSuccess?.();
        handleClose?.();
      } else {
        toast.error(response.message || "Failed to create category");
      }
    },
    onError: (error) => {
      console.error("Create category error:", error);
      toast.error("Failed to create category. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending;

  // Handle form submission
  const handleSubmit = async (data: CreateCategoryFormData) => {
    try {
      createMutation.mutate(data as CreateCategoryData);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  }; 

  return (
    <div className="container mx-auto py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Category Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name (e.g., Adventure, Science)"
                      {...field}
                      className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="📝 A clear, descriptive name for your category" />
                </FormItem>
              )}
            />

            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Content Type
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CATEGORY_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{type}</span>
                            {type === "course" && "📚"}
                            {type === "library" && "📖"}
                            {type === "ethics" && "⚖️"}
                            {type === "language_corner" && "🗣️"}
                            {type === "music" && "🎵"}
                            {type === "movie" && "🎬"}
                            {type === "game" && "🎮"}
                            {type === "story" && "📝"}
                            {type === "variety" && "🗃️"}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="🏷️ Select what type of content this category will organize" />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what kind of content this category will contain..."
                      {...field}
                      rows={4}
                      disabled={isSubmitting}
                      className="border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="📄 Help users understand what content belongs in this category (max 500 characters)" />
                </FormItem>
              )}
            />

            {/* Grade */}
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Target Grade
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select grade level" />
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
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="🎓 Optional: Specify the target grade level for this category" />
                </FormItem>
              )}
            />

            {/* Background Color */}
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Background Color
                  </FormLabel>
                  <FormControl>
                    <CustomColorPicker
                      value={field.value || "#3b82f6"}
                      onChange={field.onChange}
                      disabled={isSubmitting}
                      name="Category"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="🎨 Choose a color that represents this category" />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t">
            {handleClose && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Category
                </>
              )}
            </Button>
          </div>

          <div className="text-sm text-muted-foreground text-center pt-4">
            After creating, you can organize content items into this category.
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
