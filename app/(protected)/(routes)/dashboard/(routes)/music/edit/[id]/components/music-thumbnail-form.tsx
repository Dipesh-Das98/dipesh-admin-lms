"use client";

import React from "react";
import { Features, Music  } from "@/types";
import { updateMusic } from "@/actions/dashboard/music/update-music";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { Music as MusicIcon } from "lucide-react";

interface MusicThumbnailFormProps {
  music: Music;
}

export function MusicThumbnailForm({ music }: MusicThumbnailFormProps) {
  return (
    <GenericThumbnailForm
      entity={music}
      entityType="music"
      updateMutation={updateMusic}
      queryKey={["musics"]}
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
        headerIcon: <MusicIcon className="w-6 h-6 text-purple-600" />,
        headerColor: "purple",
        showImageInfo: true,
      }}
      feature={Features.MUSIC}
    />
  );
}
