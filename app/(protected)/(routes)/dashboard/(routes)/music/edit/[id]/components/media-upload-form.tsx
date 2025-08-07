"use client";

import React from "react";
import { updateMusic } from "@/actions/dashboard/music/update-music";
import { Music } from "@/types";
import { GenericMediaForm } from "@/components/forms/generic-media-form";
import { useRouter } from "next/navigation";

interface MediaFormProps {
  music: Music;
}

export function MediaForm({ music }: MediaFormProps) {
  const router = useRouter();

  const handleUpdate = async (data: { mediaUrl: string }) => {
    const result = await updateMusic({
      id: music.id,
      mediaUrl: data.mediaUrl,
    });
    return result;
  };

  // Custom validator for music media URLs (prioritizing audio)
  const isValidMusicMediaUrl = (url: string) => {
    if (!url) return false;

    const audioExtensions = [
      ".mp3",
      ".wav",
      ".aac",
      ".ogg",
      ".m4a",
      ".flac",
      ".wma",
    ];
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
      // Audio formats (preferred for music)
      audioExtensions.some((ext) => lowercaseUrl.includes(ext)) ||
      // Video formats (also allowed)
      videoExtensions.some((ext) => lowercaseUrl.includes(ext)) ||
      // Common CDN and streaming services
      lowercaseUrl.includes("blob:") ||
      lowercaseUrl.includes("cdn") ||
      lowercaseUrl.includes("stream.mux.com") ||
      lowercaseUrl.includes("cloudflare") ||
      lowercaseUrl.includes("amazonaws.com") ||
      // Music streaming platforms
      lowercaseUrl.includes("soundcloud.com") ||
      lowercaseUrl.includes("spotify.com") ||
      lowercaseUrl.includes("youtube.com") ||
      lowercaseUrl.includes("youtu.be") ||
      lowercaseUrl.includes("vimeo.com")
    );
  };

  return (
    <GenericMediaForm
      initialData={music}
      onUpdate={handleUpdate}
      title="Music Media"
      description="Add audio or video content for your music"
      mediaUrlField="mediaUrl"
      placeholder="Paste CDN media URL here (e.g., https://cdn.example.com/music.mp3)"
      queryKeys={[["musics"], ["music", music.id]]}
      emptyStateText="No music media uploaded yet"
      successMessage="Music media updated successfully!"
      errorMessage="Failed to update music media"
      supportedFormats={{
        audio: [".mp3", ".wav", ".aac", ".ogg", ".m4a", ".flac", ".wma"],
        video: [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"],
        streaming: [".m3u8", ".mpd"],
        platforms: ["SoundCloud", "Spotify", "YouTube", "Vimeo"],
      }}
      customUrlValidator={isValidMusicMediaUrl}
      routerRefresh={() => router.refresh()}
    />
  );
}
