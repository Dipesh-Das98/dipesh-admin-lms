"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { SlideMode } from "./SlideManager";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Features } from "@/types";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { ReadAlongSlide } from "@/types/readAlongWith.types";
import { createReadAlongSlides } from "@/actions/dashboard/readAlongWith/create-read-along-slides";
import { updateReadAlongSlideById } from "@/actions/dashboard/readAlongWith/update-read-along-with-by-slide-id";

const formSchema = z.object({
  content: z.string().min(1, "Content is required"),
  orderNo: z
    .number({ invalid_type_error: "Order number is needed" })
    .min(1, "Order must be ≥ 1"),
  imageUrl: z.string().min(1, "Image URL is required"),
});


type FormData = z.infer<typeof formSchema>;

interface SlideFormProps {
  mode: SlideMode;
  storyId: string;
  slide: ReadAlongSlide | null;
  onSuccess: () => void;
}

export function SlideForm({ mode, storyId, slide, onSuccess }: SlideFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: slide?.content || "",
      orderNo: slide?.orderNo || 1,
      imageUrl: slide?.imageUrl || "",
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting },
  } = form;

  const imageUrl = watch("imageUrl");

  useEffect(() => {
    reset({
      content: slide?.content || "",
      orderNo: slide?.orderNo || 1,
      imageUrl: slide?.imageUrl || "",
    });
  }, [slide, reset]);

  const entityForThumbnail = {
    title: "Slide Image",
    thumbnail: imageUrl || undefined,
  };

  const updateMutation = async (data: { thumbnail?: string }) => {
    if (!data.thumbnail) {
      return { success: false, message: "Image upload failed" };
    }

    setValue("imageUrl", data.thumbnail);

    if (mode === "edit" && slide?.id) {
      const res = await updateReadAlongSlideById(slide.id, {
        readWithUsId: storyId,
        content: form.getValues("content"),
        imageUrl: data.thumbnail,
        orderNo: form.getValues("orderNo"),
      });

      return { success: res.success, message: res.message };
    }

    return { success: true, message: "Image uploaded" };
  };

  const onSubmit = async (data: FormData) => {
    if (mode === "add") {
      const res = await createReadAlongSlides({
        slideList: [
          {
            readWithUsId: storyId,
            content: data.content,
            imageUrl: data.imageUrl,
            orderNo: data.orderNo,
          },
        ],
      });
      if (res.success) {
        toast.success("Slide created!");
        onSuccess();
      } else {
        toast.error(res.message);
      }
    } else if (mode === "edit" && slide) {
      const res = await updateReadAlongSlideById(slide.id, {
        readWithUsId: storyId,
        content: data.content,
        imageUrl: data.imageUrl,
        orderNo: data.orderNo,
      });
      if (res.success) {
        toast.success("Slide updated!");
        onSuccess();
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <Form {...form}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div onClick={(e) => e.stopPropagation()}>
          <GenericThumbnailForm
            entity={entityForThumbnail}
            entityType="slide"
            updateMutation={updateMutation}
            queryKey={["slides", storyId]}
            feature={Features.READ_ALONG_SLIDES}
            displaySettings={{
              imageHeight: "h-64",
              headerColor: "green",
              headerIcon: undefined,
              showImageInfo: false,
            }}
          />
        </div>

        {/* Slide Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Content */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  Content
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the slide content..."
                    {...field}
                    className="resize-none h-32 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Order Number */}
          <FormField
            control={form.control}
            name="orderNo"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-semibold text-foreground">
                  Order Number
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    className="h-12 border-border/50 bg-background/50 focus:bg-background transition-colors duration-200 focus:ring-2 focus:ring-primary/20"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex gap-3">
            <Button
              type="submit"
              className="min-w-[140px] h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isSubmitting || !imageUrl}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={
                        mode === "add"
                          ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                          : "M5 13l4 4L19 7"
                      }
                    />
                  </svg>
                  <span>{mode === "add" ? "Create Slide" : "Update Slide"}</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
}
