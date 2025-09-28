"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateStory,
  UpdateStoryData,
} from "@/actions/dashboard/story/update-story";
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
import { Story } from "@/types";
import { Language } from "@/config/forms/child-form-options";
import {
  languageOptions,
  gradeOptions,
} from "@/config/forms/common-form-options";
import { StoryCategory } from "@/config/forms/story-form-options";
import { BookOpen, Save, Loader2 } from "lucide-react";
import FormItemInfo from "@/components/ui/form-label";
import { Switch } from "@/components/ui/switch";

const basicSettingsSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  backgroundColor: z.string().min(1, "Background color is required"),
  grade: z.string().min(1, "Grade is required"),
  language: z.string().min(1, "Language is required"),
  categoryId: z.string().min(1, "Category is required"),
  isActive: z.boolean(),
  order: z.number(),
});

type BasicSettingsFormData = z.infer<typeof basicSettingsSchema>;

interface BasicSettingsFormProps {
  story: Story;
  categories: StoryCategory[];
}

export function BasicSettingsForm({
  story,
  categories,
}: BasicSettingsFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<BasicSettingsFormData>({
    resolver: zodResolver(basicSettingsSchema),
    defaultValues: {
      title: story.title || "",
      description: story.description || "",
      backgroundColor: story.backgroundColor || "#3b82f6",
      grade: story.grade || "",
      language: story.language || "",
      categoryId: story.categoryId || "",
      isActive: story.isActive || false,
      order: story.order || 0,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateStoryData) => updateStory(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Basic settings updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["stories"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update story error:", error);
      toast.error("Failed to update story. Please try again.");
    },
  });

  const isSubmitting = updateMutation.isPending;

  const handleSubmit = async (data: BasicSettingsFormData) => {
    try {
      const updateData: UpdateStoryData = {
        id: story.id,
        title: data.title,
        description: data.description,
        backgroundColor: data.backgroundColor,
        grade: data.grade,
        language: data.language as Language,
        categoryId: data.categoryId,
        isActive: data.isActive,
        order: data.order,
      };

      updateMutation.mutate(updateData);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Basic Settings
            </h3>
            <p className="text-sm text-muted-foreground">
              Update the core information for this story
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Story Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the story title"
                      {...field}
                      className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="📚 A catchy title that captures the essence of your story" />
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
                    Story Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief description of the story"
                      {...field}
                      rows={4}
                      className="border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="📝 A compelling description that helps users understand what the story is about (max 500 characters)" />
                </FormItem>
              )}
            />

            {/* Two Column Layout for Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Grade */}
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Target Grade
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select grade level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-border/50">
                        {gradeOptions.map((grade) => (
                          <SelectItem
                            key={grade.value}
                            value={grade.value}
                            className="focus:bg-primary/10"
                          >
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Language */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500"></span>
                      Language
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select the story language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="border-border/50">
                        {languageOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="focus:bg-primary/10"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Category */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Story Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Choose a category for the story" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="border-border/50">
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id}
                          className="focus:bg-primary/10"
                        >
                          <div className="flex flex-col">
                            <span>{category.name}</span>
                            {category.description && (
                              <span className="text-xs text-muted-foreground">
                                {category.description}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="🏷️ Categorizing helps organize and filter stories effectively" />
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
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    Background Color
                  </FormLabel>
                  <FormControl>
                    <CustomColorPicker
                      value={field.value}
                      onChange={field.onChange}
                      name="Story"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="🎨 The background color helps create visual distinction and mood for the story" />
                </FormItem>
              )}
            />

            {/* Two Column Layout for Order and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                      Display Order
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter display order number"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        value={field.value.toString()}
                        className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                    <FormItemInfo message="📋 Controls the display order in lists and collections" />
                  </FormItem>
                )}
              />

              {/* Active Status */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="space-y-3 flex flex-col justify-end h-full">
                    <div className="flex flex-row items-center justify-between">
                      <div className="space-y-0.5">
                        <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          Activity Status
                        </FormLabel>
                        <p className="text-xs text-muted-foreground">
                          Set the story as active or inactive
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-xs" />
                    <FormItemInfo message="🚦 Active stories are visible to users, inactive ones are hidden" />
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
