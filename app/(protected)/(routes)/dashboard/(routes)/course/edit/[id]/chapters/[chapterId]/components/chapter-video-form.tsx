"use client";
import React, { FC } from "react";
import { updateChapter } from "@/actions/dashboard/course/chapter/update-chapter";
import { Chapter } from "@/types";
import { GenericMediaForm } from "@/components/forms/generic-media-form";

interface ChapterVideoFormProps {
  initialData: Chapter;
  chapterId: string;
  courseId: string;
}

const ChapterVideoForm: FC<ChapterVideoFormProps> = ({
  initialData,
  courseId,
  chapterId,
}) => {
  const handleUpdate = async (data: { mediaUrl: string }) => {
    const result = await updateChapter({
      id: chapterId,
      courseId: courseId,
      videoUrl: data.mediaUrl,
    });
    return result;
  };

  // Custom validator for video-only content
  const isValidVideoUrl = (url: string) => {
    if (!url) return false;

    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv", ".m3u8", ".mpd"];
    const lowercaseUrl = url.toLowerCase();

    return (
      videoExtensions.some((ext) => lowercaseUrl.includes(ext)) ||
      lowercaseUrl.includes("blob:") ||
      lowercaseUrl.includes("cdn") ||
      lowercaseUrl.includes("stream.mux.com") ||
      lowercaseUrl.includes("cloudflare") ||
      lowercaseUrl.includes("amazonaws.com")
    );
  };

  return (
    <GenericMediaForm
      initialData={initialData}
      onUpdate={handleUpdate}
      title="Chapter Video"
      mediaUrlField="videoUrl"
      placeholder="Paste CDN video URL here (e.g., https://cdn.example.com/video.mp4)"
      queryKeys={[
        ["chapter", chapterId],
        ["course", courseId],
        ["courses"],
      ]}
      emptyStateText="No video uploaded yet"
      successMessage="Chapter video updated successfully!"
      errorMessage="Failed to update chapter video"
      supportedFormats={{
        video: [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"],
        streaming: [".m3u8", ".mpd"],
      }}
      customUrlValidator={isValidVideoUrl}
    />
  );
};

export default ChapterVideoForm;
