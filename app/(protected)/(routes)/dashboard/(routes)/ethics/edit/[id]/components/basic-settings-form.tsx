"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateEthics,
  UpdateEthicsData,
} from "@/actions/dashboard/ethics/update-ethics";
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
import { Ethics, EthicsCategory } from "@/types";
import { Language } from "@/config/forms/child-form-options";
import { languageOptions } from "@/config/forms/common-form-options";

import { BookOpen, Save, Loader2 } from "lucide-react";
import FormItemInfo from "@/components/ui/form-label";
import { updateEthicsSchema } from "@/schema";

type BasicSettingsFormData = z.infer<typeof updateEthicsSchema>;

interface BasicSettingsFormProps {
  ethics: Ethics;
  categories: EthicsCategory[];
}

export function BasicSettingsForm({
  ethics,
  categories,
}: BasicSettingsFormProps) {
  const queryClient = useQueryClient();

  const form = useForm<BasicSettingsFormData>({
    resolver: zodResolver(updateEthicsSchema),
    defaultValues: {
      title: ethics.title || "",
      description: ethics.description || "",
      backgroundColor: ethics.backgroundColor || "#3b82f6",
      language: ethics.language || "",
      categoryId: ethics.categoryId || "",
      isActive: ethics.isActive || true,
      order: ethics.order || 0,
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateEthicsData) => updateEthics(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Basic settings updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["ethics"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update ethics error:", error);
      toast.error("Failed to update ethics. Please try again.");
    },
  });

  const isSubmitting = updateMutation.isPending;

  const handleSubmit = async (data: BasicSettingsFormData) => {
    try {
      const updateData: UpdateEthicsData = {
        id: ethics.id,
        title: data.title,
        description: data.description,
        backgroundColor: data.backgroundColor,
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
              Update the core information for this ethics
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
                    Ethics Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter the ethics title"
                      {...field}
                      className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="📚 A catchy title that captures the essence of your ethics" />
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
                    Ethics Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a brief description of the ethics"
                      {...field}
                      rows={4}
                      className="border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="📝 A compelling description that helps users understand what the ethics is about (max 500 characters)" />
                </FormItem>
              )}
            />

            {/* Two Column Layout for Selects */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <SelectValue placeholder="Select the ethics language" />
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

              {/* Order */}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      Display Order
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter display order (e.g., 1, 2, 3...)"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                    <FormItemInfo message="🔢 Lower numbers appear first in the ethics list" />
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
                    Ethics Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Choose a category for the ethics" />
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
                  <FormItemInfo message="🏷️ Categorizing helps organize and filter ethics effectively" />
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
                      name="Ethics"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="🎨 The background color helps create visual distinction and mood for the ethics" />
                </FormItem>
              )}
            />

            {/* Active Status */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Active Status
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        {field.value 
                          ? "✅ This ethics is active and visible to users" 
                          : "⏸️ This ethics is inactive and hidden from users"
                        }
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </FormControl>
                  </div>
                  <FormMessage className="text-xs" />
                  <FormItemInfo message="🔄 Toggle to control whether this ethics appears in the public ethics list" />
                </FormItem>
              )}
            />

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
