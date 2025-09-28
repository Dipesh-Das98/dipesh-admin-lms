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

// Types and Config
import { Language } from "@/config/forms/child-form-options";
import { languageOptions } from "@/config/forms/common-form-options";

// Actions
import { getCategoryByType } from "@/actions/dashboard/category/get-category";

// Icons
import { BookOpen, Save, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { CustomColorPicker } from "@/components/ui/custom-color-picker";
import { EthicsCategory } from "@/types";
import { createEthics } from "@/actions/dashboard/ethics/create-ethics";
import { CreateEthicsFormSchema } from "@/schema";



type EthicsFormData = z.infer<typeof CreateEthicsFormSchema>;

export function CreateEthicsForm() {
  const queryClient = useQueryClient();
  const router = useRouter();

  //----------------- FETCH CATEGORIES -----------------
  const { data: categories = [], isLoading: categoriesLoading } = useQuery<
    EthicsCategory[]
  >({
    queryKey: ["categories", "ethics"],
    queryFn: () => getCategoryByType("ethics"),
  });

  //----------------- FORM HANDLING -----------------
  const form = useForm<EthicsFormData>({
    resolver: zodResolver(CreateEthicsFormSchema),
    defaultValues: {
      title: "",
      description: "",
      backgroundColor: "#FF5733",
      language: Language.ENGLISH,
      categoryId: "",
    },
  });

  //----------------- API MUTATION -----------------
  const createMutation = useMutation({
    mutationFn: createEthics,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Ethics created successfully!");
        queryClient.invalidateQueries({ queryKey: ["Ethics"] });
        console.log("Ethics created successfully:", result);
        form.reset();
        // Redirect to edit page after creation
        setTimeout(() => {
          router.push(`/dashboard/ethics/edit/${result.data?.id}`);
        }, 1000); // Delay to allow toast to show
      } else {
        toast.error(result.message || "Failed to create ethics");
        console.error("Create ethics failed:", result);
      }
    },
    onError: (error) => {
      console.error("Create ethics error:", error);
      toast.error("Failed to create ethics. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending;

  // Handle form submission
  const handleSubmit = async (data: EthicsFormData) => {
    try {
      createMutation.mutate(data);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  //----------------- HANDLER PROPS -----------------
  const onCancel = () => {
    router.push("/dashboard/ethics");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Create New Ethics</CardTitle>
                <CardDescription>
                  Create a basic ethics that you can enhance with media and
                  content later
                </CardDescription>
              </div>
            </div>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
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
              <CardTitle className="text-lg">Ethics Details</CardTitle>
              <CardDescription>
                Provide the basic information about your ethics
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
                      Ethics Title <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter ethics title"
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
                        placeholder="Enter ethics description"
                        {...field}
                        rows={4}
                        disabled={isSubmitting}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief description of the ethics (max 500
                      characters)
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

              {/* Grade and Language Row */}

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">
                      Language <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {languageOptions.map((language) => (
                          <SelectItem
                            key={language.value}
                            value={language.value}
                          >
                            {language.label}
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
                        name="Ethics"
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
                  {isSubmitting ? "Creating..." : "Create Ethics"}
                </Button>
              </div>

              <div className="mt-4 text-sm text-muted-foreground">
                After creating, you&lsquo;ll be redirected to the edit page to
                add media content and finalize your ethics.
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
