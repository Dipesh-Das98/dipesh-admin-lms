"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  createPostCategory,
  updatePostCategory,
} from "@/actions/dashboard/community/post-category";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/hooks/use-sheet";
import { useModal } from "@/hooks/use-modal";
import { Upload } from "lucide-react";

// Form schemas
const postCategoryFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(100, { message: "Name must not exceed 100 characters." }),
  iconUrl: z.string().url({ message: "Please provide a valid URL." }),
  isActive: z.boolean(),
});

type PostCategoryFormData = z.infer<typeof postCategoryFormSchema>;

// Sheet content component that will be used by the provider
export function PostCategoryFormContent() {
  const queryClient = useQueryClient();
  const { isOpen, onClose, type, data } = useSheet();
  const { openModal } = useModal();

  const isPostCategoryFormOpen = isOpen && type === "post-category-form";
  const { mode = "create", postCategory } = data;
  const isEditMode = mode === "edit";

  const form = useForm<PostCategoryFormData>({
    resolver: zodResolver(postCategoryFormSchema),
    defaultValues: {
      name: postCategory?.name || "",
      iconUrl: postCategory?.iconUrl || "",
      isActive: postCategory?.isActive ?? true,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPostCategory,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Post category created successfully!");
        // Invalidate and refetch post categories queries
        queryClient.invalidateQueries({ queryKey: ["post-categories"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create post category error:", error);
      toast.error("Failed to create post category. Please try again.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updatePostCategory,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Post category updated successfully!");
        // Invalidate and refetch post categories queries
        queryClient.invalidateQueries({ queryKey: ["post-categories"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update post category error:", error);
      toast.error("Failed to update post category. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Reset form when sheet opens or post category data changes
  React.useEffect(() => {
    if (isPostCategoryFormOpen) {
      form.reset({
        name: postCategory?.name || "",
        iconUrl: postCategory?.iconUrl || "",
        isActive: postCategory?.isActive ?? true,
      });
    }
  }, [isPostCategoryFormOpen, postCategory, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
      // Reset form when closing
      form.reset({
        name: "",
        iconUrl: "",
        isActive: true,
      });
    }
  };

  const handleIconUpload = () => {
    openModal("media-uplaod-model", {
      handleUpdate: (
        files?: {
          key: string;
          url: string;
          name: string;
          originalName: string;
          size: number;
          category: string;
        }[]
      ) => {
        if (files && files.length > 0) {
          const file = files[0];
          form.setValue("iconUrl", file.url);
        }
      },
    });
  };

  const onSubmit = async (data: PostCategoryFormData) => {
    if (isEditMode && postCategory) {
      updateMutation.mutate({
        id: postCategory.id,
        ...data,
      });
    } else {
      // For create, only send name and iconUrl as per API spec
      createMutation.mutate({
        name: data.name,
        iconUrl: data.iconUrl,
      });
    }
  };

  return (
    <Sheet open={isPostCategoryFormOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Post Category" : "Create Post Category"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the post category details below."
              : "Fill in the details to create a new post category."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Post category name"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, concise name for the post category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Icon URL Field */}
              <FormField
                control={form.control}
                name="iconUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/icon.png"
                          {...field}
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleIconUpload}
                          className="shrink-0"
                          disabled={isSubmitting}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an icon image for the post category.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status Field */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Active Status</FormLabel>
                      <FormDescription>
                        Enable or disable this post category.
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

            <SheetFooter>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={form.handleSubmit(onSubmit)}
              >
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Creating..."
                  : isEditMode
                  ? "Update Post Category"
                  : "Create Post Category"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
