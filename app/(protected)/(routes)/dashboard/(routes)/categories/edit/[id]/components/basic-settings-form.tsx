"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCategory } from "@/actions/dashboard/category/update-category";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CustomColorPicker } from "@/components/ui/custom-color-picker";
import { Category, CATEGORY_TYPES } from "@/types/category.type";
import { Save, Loader2, FolderOpen } from "lucide-react";
import { updateCategorySchema } from "@/schema";
import { gradeOptions } from "@/config/forms/common-form-options";

type BasicSettingsFormData = z.infer<typeof updateCategorySchema>;

interface BasicSettingsFormProps {
  category: Category;
}

export function BasicSettingsForm({ category }: BasicSettingsFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<BasicSettingsFormData>({
    resolver: zodResolver(updateCategorySchema),
    defaultValues: {
      name: category.name || "",
      type: category.type as (typeof CATEGORY_TYPES)[number],
      description: category.description || "",
      isActive: category.isActive ?? true,
      order: category.order || 0,
      grade: category.grade || "none", // Use "none" instead of empty string
      backgroundColor: category.backgroundColor || "#6366f1",
      isDummyCategory: category.isDummyCategory || false,
    },
  });

  const { mutate: updateCategoryMutation, isPending } = useMutation({
    mutationFn: (data: BasicSettingsFormData) =>
      updateCategory(data, category.id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Category updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["categories"] });
        queryClient.invalidateQueries({ queryKey: ["category", category.id] });
      } else {
        toast.error(response.message || "Failed to update category");
      }
    },
    onError: (error: Error) => {
      console.error("Update category error:", error);
      toast.error("Failed to update category. Please try again.");
    },
  });

  const onSubmit = (data: BasicSettingsFormData) => {
    // For "none" grade value, we'll exclude it from the data sent to the API
    const updatedData = { ...data };
    
    if (updatedData.grade === "none") {
      // Set to empty string, which will be handled in the API as null
      updatedData.grade = "";
    }
    
    updateCategoryMutation(updatedData);
  };

  return (
    <div className="bg-card border border-dashed rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <FolderOpen className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Basic Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure the basic information for this category
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter category name..."
                    {...field}
                    className="bg-background"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category Type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Category Type <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select category type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        <span className="capitalize">
                          {type.replace("_", " ")}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter category description..."
                    className="bg-background min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Grade (Optional) */}
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || "none"}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Not specified</SelectItem>
                    {gradeOptions.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  Optional: Specify the target grade level for this category
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Order */}
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="bg-background"
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Lower numbers appear first in lists
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Background Color */}
          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <CustomColorPicker
                    value={field.value || "#6366f1"}
                    onChange={field.onChange}
                    name="Category"
                  />
                </FormControl>
                <div className="text-sm text-muted-foreground">
                  Choose a color theme for this category
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Active Status */}
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    {field.value
                      ? "This category is currently active and visible"
                      : "This category is currently inactive and hidden"}
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
                  <FormField
            control={form.control}
            name="isDummyCategory"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 bg-background">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Dummy Status</FormLabel>
                  <div className="text-sm text-muted-foreground">
                    {field.value
                      ? "This category is currently a dummy category"
                      : "This category is not a dummy category"}
                  </div>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="min-w-[120px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
