"use client";

import React from "react";
import { updateStory } from "@/actions/dashboard/story/update-story";
import { Story } from "@/types";
import { GenericMediaForm } from "@/components/forms/generic-media-form";
import { useRouter } from "next/navigation";

interface MediaFormProps {
  story: Story;
}

export function MediaForm({ story }: MediaFormProps) {
  const router = useRouter();

  const handleUpdate = async (data: { mediaUrl: string }) => {
    const result = await updateStory({
      id: story.id,
      mediaUrl: data.mediaUrl,
    });
    return result;
  };

  // Custom validator for video media URLs
  const isValidVideoMediaUrl = (url: string) => {
    if (!url) return false;

    const videoExtensions = [
      ".mp4",
      ".webm",
      ".ogg",
      ".mov",
      ".avi",
      ".mkv",
      ".m3u8",
      ".mpd",
    ];
    const lowercaseUrl = url.toLowerCase();

    return (
      // Video formats
      videoExtensions.some((ext) => lowercaseUrl.includes(ext)) ||
      // Common CDN and streaming services
      lowercaseUrl.includes("blob:") ||
      lowercaseUrl.includes("cdn") ||
      lowercaseUrl.includes("stream.mux.com") ||
      lowercaseUrl.includes("cloudflare") ||
      lowercaseUrl.includes("amazonaws.com") ||
      // Video platforms
      lowercaseUrl.includes("youtube.com") ||
      lowercaseUrl.includes("youtu.be") ||
      lowercaseUrl.includes("vimeo.com")
    );
  };

  return (
    <GenericMediaForm
      initialData={story}
      onUpdate={handleUpdate}
      title="Story Video"
      description="Add video content for your story"
      mediaUrlField="mediaUrl"
      placeholder="Paste CDN video URL here (e.g., https://cdn.example.com/story.mp4)"
      queryKeys={[["stories"], ["story", story.id]]}
      emptyStateText="No video uploaded yet"
      successMessage="Story video updated successfully!"
      errorMessage="Failed to update story video"
      supportedFormats={{
        video: [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"],
        streaming: [".m3u8", ".mpd"],
        platforms: ["YouTube", "Vimeo"],
      }}
      customUrlValidator={isValidVideoMediaUrl}
      routerRefresh={() => router.refresh()}
    />
  );
}