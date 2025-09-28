"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { ImageIcon } from "lucide-react";
import { Features } from "@/types";
import { updateReadAlongStory } from "@/actions/dashboard/readAlongWith/update-read-along-with-by-story-id";

type FormValues = {
  title: string;
  author: string;
  illustratedBy: string;
  publishedBy: string;
  overAllScore: number;
  isActive: boolean;
  thumbnailUrl: string | null;
};

interface RightColumnProps {
  form: UseFormReturn<FormValues>;
  storyId: string;
}

const RightColumn: React.FC<RightColumnProps> = ({ form, storyId }) => {
  const formTitle = form.watch("title");
  const thumbnailUrl = form.watch("thumbnailUrl");

  const handleUpdateThumbnail = async (data: {
    id: string;
    thumbnail?: string;
  }) => {
    if (!data.thumbnail) {
      return {
        success: false,
        message: "No thumbnail provided",
      };
    }

    const result = await updateReadAlongStory(storyId, {
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

  return (
    <div className="space-y-6">
      <GenericThumbnailForm
        key={thumbnailUrl}
        entity={{
          id: storyId, // Use the real ID from props
          title: formTitle || "Untitled",
          thumbnail: thumbnailUrl || undefined,
        }}
        entityType="story"
        updateMutation={handleUpdateThumbnail}
        queryKey={["read-along-story-thumbnail"]}
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
        feature={Features.READ_ALONG}
      />
    </div>
  );
};

export default RightColumn;
