"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

// UI Components
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Actions
import { getCategoryByType } from "@/actions/dashboard/category/get-category";

// Icons
import { Languages, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomColorPicker } from "@/components/ui/custom-color-picker";
import { LanguageCornerCategory } from "@/types";
import { createLanguageCorner } from "@/actions/dashboard/language/create-language";
import { CreateLanguageCornerFormSchema } from "@/schema";

type LanguageCornerFormData = z.infer<typeof CreateLanguageCornerFormSchema>;

export function CreateLanguageCornerForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  //----------------- FETCH CATEGORIES -----------------
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    LanguageCornerCategory[]
  >({
    queryKey: ["categories", "language_corner"],
    queryFn: () => getCategoryByType("language_corner"),
  });

  //----------------- FORM HANDLING -----------------
  const form = useForm<LanguageCornerFormData>({
    resolver: zodResolver(CreateLanguageCornerFormSchema),
    defaultValues: {
      title: "",
      description: "",
      backgroundColor: "#FF5733",
      categoryId: "",
    },
  });

  //----------------- API MUTATION -----------------
  const createMutation = useMutation({
    mutationFn: createLanguageCorner,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Language corner content created successfully!");
        queryClient.invalidateQueries({ queryKey: ["language-corner"] });
        console.log("Language corner created successfully:", result);
        form.reset();
        // Redirect to edit page after creation
        setTimeout(() => {
          router.push(`/dashboard/language/edit/${result.data?.id}`);
        }, 1000); // Delay to allow toast to show
      } else {
        toast.error(result.message || "Failed to create language corner content");
        console.error("Create language corner failed:", result);
      }
    },
    onError: (error) => {
      console.error("Create language corner error:", error);
      toast.error("Failed to create language corner content. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending;

  // Handle form submission
  const handleSubmit = async (data: LanguageCornerFormData) => {
    try {
      createMutation.mutate(data);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  //----------------- HANDLER PROPS -----------------
  const onCancel = () => {
    router.push("/dashboard/language");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Languages className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create New Language Corner Content</CardTitle>
                <CardDescription>
                  Create basic language learning content that you can enhance with media later
                </CardDescription>
              </div>
            </div>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Cancel
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Details</CardTitle>
              <CardDescription>
                Provide the basic information about your language learning content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter content title"
                        {...field}
                        className="h-11"
                        disabled={isSubmitting}
                      />
                    </FormControl>
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
                    <FormLabel className="text-sm font-semibold">
                      Description <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Enter content description"
                        {...field}
                        rows={4}
                        disabled={isSubmitting}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of the content (max 500 characters)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Category <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting || categoriesLoading}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue
                            placeholder={
                              categoriesLoading
                                ? "Loading categories..."
                                : "Select category"
                            }
                          />
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
                    <FormLabel className="text-sm font-semibold">
                      Background Color <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <CustomColorPicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                        name="Language Corner"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-end gap-4">
                {onCancel && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
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
                  <Save className="w-4 h-4" />
                  {isSubmitting ? "Creating..." : "Create Content"}
                </Button>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                After creating, you&apos;ll be redirected to the edit page to
                add media content and finalize your language corner content.
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
