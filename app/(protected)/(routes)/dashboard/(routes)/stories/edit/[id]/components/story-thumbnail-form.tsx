"use client";

import React from "react";
import { Features, Story } from "@/types";
import { updateStory } from "@/actions/dashboard/story/update-story";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { Book } from "lucide-react";

interface StoryThumbnailFormProps {
  story: Story;
}

export function StoryThumbnailForm({ story }: StoryThumbnailFormProps) {
  return (
    <GenericThumbnailForm
      entity={story}
      entityType="story"
      updateMutation={updateStory}
      queryKey={["stories"]}
      maxSize={5 * 1024 * 1024} // 5MB
      acceptedFormats="image/*"
      recommendations={{
        size: "1200x630px",
        aspectRatio: "16:9 or 1.91:1",
        formats: "JPG, PNG, WebP",
        maxFileSize: "5MB",
      }}
      displaySettings={{
        imageHeight: "h-96",
        headerIcon: <Book className="w-6 h-6 text-green-600" />,
        headerColor: "green",
        showImageInfo: true,
      }}
      feature={Features.STORIES}
    />
  );
}
