/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Video, PlusCircle, Pencil } from "lucide-react";

// Generic schema for media URL with video validation
const genericMediaSchema = z.object({
  mediaUrl: z.string()
    .min(1, { message: "Video URL is required" })
    .url({ message: "Please enter a valid URL" })
    .refine((url) => {
      const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
      const streamingExtensions = [".m3u8", ".mpd"];
      const lowercaseUrl = url.toLowerCase();
      
      const hasVideoExtension = videoExtensions.some((ext) => lowercaseUrl.includes(ext));
      const hasStreamingExtension = streamingExtensions.some((ext) => lowercaseUrl.includes(ext));
      const isVideoProvider = (
        lowercaseUrl.includes("blob:") ||
        lowercaseUrl.includes("stream.mux.com") ||
        lowercaseUrl.includes("youtube.com") ||
        lowercaseUrl.includes("youtu.be") ||
        lowercaseUrl.includes("vimeo.com")
      );
      
      return hasVideoExtension || hasStreamingExtension || isVideoProvider;
    }, { message: "Only video URLs are allowed. Please provide a valid video file or streaming URL." })
});

export interface GenericMediaFormProps<T = any> {
  // Required props
  initialData: T;
  onUpdate: (data: { mediaUrl: string }) => Promise<{ success: boolean; message?: string }>;
  
  // Optional customization props
  title?: string;
  description?: string;
  mediaUrlField?: keyof T;
  placeholder?: string;
  queryKeys?: string[][];
  routerRefresh?: () => void;
  
  // UI customization
  className?: string;
  emptyStateText?: string;
  successMessage?: string;
  errorMessage?: string;
  
  // Video validation (only video formats supported)
  supportedFormats?: {
    audio?: string[];
    video?: string[];
    streaming?: string[];
    platforms?: string[];
  };
  customUrlValidator?: (url: string) => boolean;
}

export function GenericMediaForm<T extends Record<string, any>>({
  initialData,
  onUpdate,
  routerRefresh,
  title = "Video",
  description,
  mediaUrlField = "mediaUrl" as keyof T,
  placeholder = "Paste video URL here (e.g., https://cdn.example.com/video.mp4)",
  queryKeys = [],
  className = "mt-6 bg-slate-100 dark:bg-neutral-800 rounded-md p-4",
  emptyStateText = "No video uploaded yet",
  successMessage = "Video updated successfully!",
  errorMessage = "Failed to update video",
  supportedFormats = {
    video: [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"],
    streaming: [".m3u8", ".mpd"],
    platforms: ["YouTube", "Vimeo"],
  },
  customUrlValidator,
}: GenericMediaFormProps<T>) {
  // ---------------------------------------helpers---------------------------------------
  const isValidMediaUrl = React.useCallback((url: string) => {
    if (!url) return false;
    console.log(url)
    // Use custom validator if provided
    if (customUrlValidator) {
      return customUrlValidator(url);
    }

    // Only allow video URLs - exclude audio and other formats
    const videoExtensions = supportedFormats.video || [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];
    const streamingExtensions = supportedFormats.streaming || [".m3u8", ".mpd"];
    
    const lowercaseUrl = url.toLowerCase();

    // Check for video file extensions
    const hasVideoExtension = videoExtensions.some((ext) => lowercaseUrl.includes(ext));
    
    // Check for streaming extensions
    const hasStreamingExtension = streamingExtensions.some((ext) => lowercaseUrl.includes(ext));
    
    // Check for video platforms and CDN providers that serve video
    const isVideoProvider = (
      lowercaseUrl.includes("blob:") ||
      lowercaseUrl.includes("stream.mux.com") ||
      lowercaseUrl.includes("youtube.com") ||
      lowercaseUrl.includes("youtu.be") ||
      lowercaseUrl.includes("vimeo.com") ||
      (lowercaseUrl.includes("cdn") && hasVideoExtension) ||
      (lowercaseUrl.includes("cloudflare") && hasVideoExtension) ||
      (lowercaseUrl.includes("amazonaws.com") && hasVideoExtension)
    );

    return hasVideoExtension || hasStreamingExtension || isVideoProvider;
  }, [customUrlValidator, supportedFormats]);

  // ---------------------------------------hooks---------------------------------------
  const form = useForm<z.infer<typeof genericMediaSchema>>({
    resolver: zodResolver(genericMediaSchema),
    defaultValues: {
      mediaUrl: (initialData[mediaUrlField] as string) || "",
    },
  });

  const queryClient = useQueryClient();

  // ---------------------------------------state---------------------------------------
  const { isValid } = form.formState;
  const [isEditing, setIsEditing] = React.useState(false);

  // Watch for URL changes to validate CDN links
  const watchedUrl = form.watch("mediaUrl");
  const isValidCdnUrl = React.useMemo(() => {
    return isValidMediaUrl(watchedUrl || "");
  }, [watchedUrl, isValidMediaUrl]);

  // ---------------------------------------mutations---------------------------------------
  const updateMutation = useMutation({
    mutationFn: onUpdate,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(successMessage);
        // Invalidate all provided query keys
        queryKeys.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
        // Optionally refresh the router if provided
        if (routerRefresh) {
          routerRefresh();
        }

        setIsEditing(false);
      } else {
        toast.error(response.message || errorMessage);
      }
    },
    onError: (error) => {
      console.error("Update media error:", error);
      toast.error(`${errorMessage}. Please try again.`);
    },
  });

  // ---------------------------------------handlers---------------------------------------
  const toggleEdit = () => setIsEditing(!isEditing);

  const handleSubmit = async (data: z.infer<typeof genericMediaSchema>) => {
    try {
      updateMutation.mutate({
        mediaUrl: data.mediaUrl,
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const currentMediaUrl = initialData[mediaUrlField] as string;

  return (
    <div className={className}>
      <div className="font-medium flex items-center justify-between">
        {title}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && <>Cancel</>}
          {!isEditing && !currentMediaUrl && (
            <>
              <PlusCircle className="iconsmright" />
              Add {title}
            </>
          )}
          {!isEditing && currentMediaUrl && (
            <>
              <Pencil className="iconsmright" />
              Edit {title}
            </>
          )}
        </Button>
      </div>

      {description && !isEditing && (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      )}

      {!isEditing &&
        (!currentMediaUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 dark:bg-slate-700 rounded-md">
            <div className="text-center">
              <Video className="w-10 h-10 text-slate-500 mx-auto mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {emptyStateText}
              </p>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <ReactPlayer
              url={currentMediaUrl}
              controls
              width="100%"
              height="100%"
              className="rounded-md overflow-hidden"
              config={{
                file: {
                  attributes: {
                    preload: "metadata",
                  },
                },
              }}
            />
          </div>
        ))}

      {isEditing && (
        <Form {...form}>
          <form
            className="mt-4 space-y-4"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="mediaUrl"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={updateMutation.isPending}
                      placeholder={placeholder}
                      className="min-h-[44px]"
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    <p>✅ Supported video formats:</p>
                    <ul className="list-disc list-inside pl-2 space-y-1">
                      {supportedFormats.video && (
                        <li>
                          Video: {supportedFormats.video.join(", ")} (Recommended: MP4)
                        </li>
                      )}
                      {supportedFormats.streaming && (
                        <li>Streaming: {supportedFormats.streaming.join(", ")}</li>
                      )}
                      {supportedFormats.platforms && (
                        <li>Platforms: {supportedFormats.platforms.join(", ")}</li>
                      )}
                    </ul>
                    <p className="text-green-600 dark:text-green-400 mt-2">
                      ✅ Video CDN and streaming URLs are supported (Mux, Cloudflare, AWS, etc.)
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <LoadingButton
                isLoading={updateMutation.isPending}
                type="submit"
                disabled={!isValid || updateMutation.isPending}
              >
                Save {title}
              </LoadingButton>
            </div>

            {/* Preview Section */}
            {watchedUrl && isValidCdnUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-2">
                  Preview:
                </p>
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                  <ReactPlayer
                    url={watchedUrl}
                    controls
                    width="100%"
                    height="100%"
                    config={{
                      file: {
                        attributes: {
                          preload: "metadata",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </form>
        </Form>
      )}

      {currentMediaUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
          <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
            🎬 {title} Information
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            Users will be able to watch this video content.
          </p>
          <p className="text-blue-600 dark:text-blue-400 mt-1">
            {title} URL:{" "}
            <span className="font-mono text-xs break-all">
              {currentMediaUrl}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
