"use client";

import React from "react";
import { updateEthics } from "@/actions/dashboard/ethics/update-ethics";
import { Ethics } from "@/types";
import { GenericMediaForm } from "@/components/forms/generic-media-form";
import { useRouter } from "next/navigation";

interface MediaFormProps {
  ethics: Ethics;
}

export function MediaForm({ ethics }: MediaFormProps) {
  const router = useRouter();

  const handleUpdate = async (data: { mediaUrl: string }) => {
    const result = await updateEthics({
      id: ethics.id,
      mediaUrl: data.mediaUrl,
    });
    return result;
  };

  // Custom validator for ethics media URLs (prioritizing audio)
  const isValidEthicsMediaUrl = (url: string) => {
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
      // Video formats (also allowed)
      videoExtensions.some((ext) => lowercaseUrl.includes(ext)) ||
      // Common CDN and streaming services
      lowercaseUrl.includes("blob:") ||
      lowercaseUrl.includes("cdn") ||
      lowercaseUrl.includes("stream.mux.com") ||
      lowercaseUrl.includes("cloudflare") ||
      lowercaseUrl.includes("amazonaws.com") ||
      // Ethics streaming platforms
      lowercaseUrl.includes("soundcloud.com") ||
      lowercaseUrl.includes("spotify.com") ||
      lowercaseUrl.includes("youtube.com") ||
      lowercaseUrl.includes("youtu.be") ||
      lowercaseUrl.includes("vimeo.com")
    );
  };

  return (
    <GenericMediaForm
      initialData={ethics}
      onUpdate={handleUpdate}
      title="Ethics Media"
      description="Add audio or video content for your ethics"
      mediaUrlField="mediaUrl"
      placeholder="Paste CDN media URL here (e.g., https://cdn.example.com/ethics.mp3)"
      queryKeys={[["ethics"], ["ethics", ethics.id]]}
      emptyStateText="No ethics media uploaded yet"
      successMessage="Ethics media updated successfully!"
      errorMessage="Failed to update ethics media"
      supportedFormats={{
        video: [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"],
        streaming: [".m3u8", ".mpd"],
        platforms: ["SoundCloud", "Spotify", "YouTube", "Vimeo"],
      }}
      customUrlValidator={isValidEthicsMediaUrl}
      routerRefresh={() => router.refresh()}
    />
  );
}
