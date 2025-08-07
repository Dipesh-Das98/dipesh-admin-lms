"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { GenericMediaForm } from "@/components/forms/generic-media-form";
import { Features } from "@/types";
import { updateFamilyHealthCourse } from "@/actions/dashboard/familyHealth/update-family-health-course-by-id";



type FormValues = {
  title: string;
  description: string;
  isActive: boolean;
  thumbnailUrl: string | null;
  videoUrl: string | null;
};

interface RightColumnProps {
  form: UseFormReturn<FormValues>;
  storyId: string;
}

const RightColumn: React.FC<RightColumnProps> = ({ form, storyId }) => {
  const title = form.watch("title");
  const thumbnailUrl = form.watch("thumbnailUrl");
  const videoUrl = form.watch("videoUrl");
  const router = useRouter();

  const handleThumbnailUpdate = async (data: { thumbnail: string }) => {
    if (!data.thumbnail) {
      return { success: false, message: "No thumbnail provided" };
    }

    const result = await updateFamilyHealthCourse({
      id: storyId,
      thumbnailUrl: data.thumbnail,
    });

    if (result.success) {
      form.setValue("thumbnailUrl", data.thumbnail);
      form.trigger("thumbnailUrl");
    }

    return {
      success: result.success,
      message: result.message,
    };
  };

  const handleVideoUpdate = async (data: { mediaUrl: string }) => {
    const result = await updateFamilyHealthCourse({
      id: storyId,
      videoUrl: data.mediaUrl,
    });

    if (result.success) {
      form.setValue("videoUrl", data.mediaUrl);
      form.trigger("videoUrl");
    }

    return {
      success: result.success,
      message: result.message,
    };
  };

  return (
    <div className="space-y-6">
      <GenericThumbnailForm
        key={thumbnailUrl}
        entity={{
          id: storyId,
          title: title || "Untitled",
          thumbnail: thumbnailUrl || undefined,
        }}
        entityType="familyHealth"
        updateMutation={(data) =>
          handleThumbnailUpdate({ thumbnail: data.thumbnail! })
        }
        queryKey={["family-health-course-thumbnail", storyId]}
        maxSize={5 * 1024 * 1024}
        acceptedFormats="image/*"
        recommendations={{
          size: "1200x630px",
          aspectRatio: "16:9 or 1.91:1",
          formats: "JPG, PNG, WebP",
          maxFileSize: "5MB",
        }}
        displaySettings={{
          imageHeight: "h-80",
          headerIcon: <ImageIcon className="w-6 h-6 text-blue-600" />,
          headerColor: "blue",
          showImageInfo: true,
        }}
        feature={Features.FAMILY_HEALTH}
      />
      <GenericMediaForm
        initialData={{
          id: storyId,
          videoUrl: videoUrl || undefined,
        }}
        onUpdate={handleVideoUpdate}
        title="Course Media"
        description="Add a video URL for this course"
        mediaUrlField="videoUrl"
        placeholder="Paste course video URL (e.g., https://cdn.example.com/video.mp4)"
        queryKeys={[["family-health-course-video", storyId]]}
        emptyStateText="No video uploaded yet"
        successMessage="Video URL updated successfully"
        errorMessage="Failed to update video"
        supportedFormats={{
          audio: [],
          video: [".mp4", ".webm", ".mov", ".mkv"],
          streaming: [".m3u8", ".mpd"],
          platforms: ["YouTube", "Vimeo"],
        }}
         routerRefresh={() => router.refresh()}
      />
    </div>
  );
};

export default RightColumn;
