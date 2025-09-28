"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { updateCategory } from "@/actions/dashboard/category/update-category";
import { GenericMediaForm } from "@/components/forms/generic-media-form";
import { Category } from "@/types";

interface CategoryMediaFormProps {
  category: Category;
}

export function CategoryMediaForm({ category }: CategoryMediaFormProps) {
  const router = useRouter();

  const handleUpdate = async (data: { mediaUrl: string }) => {
    const result = await updateCategory(
      {
        videoUrl: data.mediaUrl,
      },
      category.id
    );
    return result;
  };

  

  return (
    <GenericMediaForm
      initialData={category}
      onUpdate={handleUpdate}
      title="Category Media"
      description="Add video content for your category"
      mediaUrlField="videoUrl"
      placeholder="Paste CDN Category URL here (e.g., https://cdn.example.com/music.mp3)"
      queryKeys={[["category"], ["category", category.id]]}
      emptyStateText="No media content uploaded yet"
      successMessage="Category Media updated successfully!"
      errorMessage="Failed to update category media"
      supportedFormats={{
        audio: [".mp3", ".wav", ".aac", ".ogg", ".m4a", ".flac", ".wma"],
        video: [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"],
        streaming: [".m3u8", ".mpd"],
        platforms: ["SoundCloud", "Spotify", "YouTube", "Vimeo"],
      }}
      routerRefresh={() => router.refresh()}
    />
  );
}
