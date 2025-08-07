"use client";

import React from "react";
import { updateMovie } from "@/actions/dashboard/movie/update-movie";
import { Movie } from "@/types";
import { GenericMediaForm } from "@/components/forms/generic-media-form";
import { useRouter } from "next/navigation";

interface MediaFormProps {
  movie: Movie;
}

export function MediaForm({ movie }: MediaFormProps) {
  const router = useRouter();

  const handleUpdate = async (data: { mediaUrl: string }) => {
    const result = await updateMovie({
      id: movie.id,
      mediaUrl: data.mediaUrl,
    });
    return result;
  };

  return (
    <GenericMediaForm
      initialData={movie}
      onUpdate={handleUpdate}
      title="Movie Media"
      description="Add video or audio content for your movie"
      mediaUrlField="mediaUrl"
      placeholder="Paste CDN media URL here (e.g., https://cdn.example.com/media.mp4)"
      queryKeys={[["movies"], ["movie", movie.id]]}
      emptyStateText="No media uploaded yet"
      successMessage="Media updated successfully!"
      errorMessage="Failed to update media"
      supportedFormats={{
        video: [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"],
        audio: [".mp3", ".wav", ".aac", ".ogg", ".m4a", ".flac"],
        streaming: [".m3u8", ".mpd"],
        platforms: ["YouTube", "Vimeo", "SoundCloud"],
      }}
      routerRefresh={() => router.refresh()}
    />
  );
}
