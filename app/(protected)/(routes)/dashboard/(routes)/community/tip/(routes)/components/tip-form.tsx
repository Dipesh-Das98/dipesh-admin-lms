"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  createTip,
  updateTip,
  TargetType,
  Tip,
} from "@/actions/dashboard/community/tip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Form schemas
const tipFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters." })
    .max(2000, { message: "Content must not exceed 2000 characters." }),
  authorName: z
    .string()
    .min(2, { message: "Author name must be at least 2 characters." })
    .max(50, { message: "Author name must not exceed 50 characters." }),
  authorDesignation: z
    .string()
    .min(2, { message: "Author designation must be at least 2 characters." })
    .max(100, {
      message: "Author designation must not exceed 100 characters.",
    }),
  isActive: z.boolean(),
  targetType: z.enum(["ALL", "PARENT"], {
    required_error: "Please select a target type.",
  }),
  grade: z
    .string()
    .min(1, { message: "Grade is required." })
    .max(20, { message: "Grade must not exceed 20 characters." }),
});

type TipFormData = z.infer<typeof tipFormSchema>;

interface TipFormProps {
  mode: "create" | "edit";
  tip?: Tip;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TipForm({ mode, tip, onSuccess, onCancel }: TipFormProps) {
  const queryClient = useQueryClient();
  const isEditMode = mode === "edit";

  const form = useForm<TipFormData>({
    resolver: zodResolver(tipFormSchema),
    defaultValues: {
      title: tip?.title || "",
      content: tip?.content || "",
      authorName: tip?.authorName || "",
      authorDesignation: tip?.authorDesignation || "",
      isActive: tip?.isActive ?? true,
      targetType: (tip?.targetType || "ALL") as TargetType,
      grade: tip?.grade || "",
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createTip,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Tip created successfully!");
        queryClient.invalidateQueries({ queryKey: ["tips"] });
        onSuccess();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create tip error:", error);
      toast.error("Failed to create tip. Please try again.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateTip,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Tip updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["tips"] });
        onSuccess();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update tip error:", error);
      toast.error("Failed to update tip. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Reset form when tip data changes
  React.useEffect(() => {
    if (tip) {
      form.reset({
        title: tip.title,
        content: tip.content,
        authorName: tip.authorName,
        authorDesignation: tip.authorDesignation,
        isActive: tip.isActive,
        targetType: tip.targetType as TargetType,
        grade: tip.grade,
      });
    }
  }, [tip, form]);

  const onSubmit = async (data: TipFormData) => {
    if (isEditMode && tip) {
      updateMutation.mutate({
        id: tip.id,
        ...data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Card className="max-w-full">
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Tip" : "Create New Tip"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter tip title"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, descriptive title for the tip.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Content Field */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter tip content"
                        className="min-h-32"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      The main content of the educational tip.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Author Name Field */}
                <FormField
                  control={form.control}
                  name="authorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter author name"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        The name of the tip author.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Author Designation Field */}
                <FormField
                  control={form.control}
                  name="authorDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author Designation</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Child Psychologist"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        The professional designation of the author.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Grade Field */}
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Grade</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Grade 1, Grade 2"
                          {...field}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        The target grade level for this tip.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Target Type Field */}
                <FormField
                  control={form.control}
                  name="targetType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select target type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ALL">All Users</SelectItem>
                          <SelectItem value="PARENT">Parents Only</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Who should this tip target?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Active Status Field */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this tip.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Tip"
                  : "Create Tip"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
