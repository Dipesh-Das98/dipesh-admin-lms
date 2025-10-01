"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  createAdvertisement,
  updateAdvertisement,
} from "@/actions/dashboard/community/advertisement";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSheet } from "@/hooks/use-sheet";
import { useModal } from "@/hooks/use-modal";
import { Upload } from "lucide-react";

// Form schemas
const advertisementFormSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(100, { message: "Title must not exceed 100 characters." }),
  mediaUrl: z
    .string()
    .url({ message: "Please provide a valid media URL." })
    .min(1, { message: "Media URL is required." }),
  redirectUrl: z
    .string()
    .url({ message: "Please provide a valid redirect URL." })
    .min(1, { message: "Redirect URL is required." }),
  isActive: z.boolean(),
});

type AdvertisementFormData = z.infer<typeof advertisementFormSchema>;

// Sheet content component that will be used by the provider
export function AdvertisementFormContent() {
  const queryClient = useQueryClient();
  const { isOpen, onClose, type, data } = useSheet();
  const { openModal } = useModal();

  const isAdvertisementFormOpen = isOpen && type === "advertisement-form";
  const { mode = "create", advertisement } = data;
  const isEditMode = mode === "edit";

  const form = useForm<AdvertisementFormData>({
    resolver: zodResolver(advertisementFormSchema),
    defaultValues: {
      title: advertisement?.title || "",
      mediaUrl: advertisement?.mediaUrl || "",
      redirectUrl: advertisement?.redirectUrl || "",
      isActive: advertisement?.isActive ?? true,
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: createAdvertisement,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Advertisement created successfully!");
        // Invalidate and refetch advertisements queries
        queryClient.invalidateQueries({ queryKey: ["advertisements"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Create advertisement error:", error);
      toast.error("Failed to create advertisement. Please try again.");
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateAdvertisement,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Advertisement updated successfully!");
        // Invalidate and refetch advertisements queries
        queryClient.invalidateQueries({ queryKey: ["advertisements"] });
        onClose();
        form.reset();
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update advertisement error:", error);
      toast.error("Failed to update advertisement. Please try again.");
    },
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Reset form when sheet opens or advertisement data changes
  React.useEffect(() => {
    if (isAdvertisementFormOpen) {
      form.reset({
        title: advertisement?.title || "",
        mediaUrl: advertisement?.mediaUrl || "",
        redirectUrl: advertisement?.redirectUrl || "",
        isActive: advertisement?.isActive ?? true,
      });
    }
  }, [isAdvertisementFormOpen, advertisement, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      onClose();
      // Reset form when closing
      form.reset({
        title: "",
        mediaUrl: "",
        redirectUrl: "",
        isActive: true,
      });
    }
  };

  const handleMediaUpload = () => {
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
          form.setValue("mediaUrl", file.url);
        }
      },
    });
  };

  const onSubmit = async (data: AdvertisementFormData) => {
    if (isEditMode && advertisement) {
      updateMutation.mutate({
        id: advertisement.id,
        ...data,
      });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Sheet open={isAdvertisementFormOpen} onOpenChange={handleOpenChange}>
      <SheetContent className="sm:max-w-md p-4">
        <SheetHeader>
          <SheetTitle>
            {isEditMode ? "Edit Advertisement" : "Create Advertisement"}
          </SheetTitle>
          <SheetDescription>
            {isEditMode
              ? "Update the advertisement details below."
              : "Fill in the details to create a new advertisement."}
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 py-4">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Advertisement title"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      A clear, concise title for your advertisement.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Redirect URL Field */}
              <FormField
                control={form.control}
                name="redirectUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redirect URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      The URL where users will be redirected when clicking the
                      ad.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Media URL Field */}
              <FormField
                control={form.control}
                name="mediaUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input
                          placeholder="https://example.com/media.mp4"
                          {...field}
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleMediaUpload}
                          className="shrink-0"
                          disabled={isSubmitting}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload an image or video for your advertisement.
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
                        Enable or disable this advertisement.
                      </FormDescription>
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
                  ? "Update Advertisement"
                  : "Create Advertisement"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
