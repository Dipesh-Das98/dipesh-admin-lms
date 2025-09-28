"use client";

import React from "react";
import { Ethics, Features  } from "@/types";
import { updateEthics } from "@/actions/dashboard/ethics/update-ethics";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { BookOpen as EthicsIcon } from "lucide-react";

interface EthicsThumbnailFormProps {
  ethics: Ethics;
}

export function EthicsThumbnailForm({ ethics }: EthicsThumbnailFormProps) {
  return (
    <GenericThumbnailForm
      entity={ethics}
      entityType="ethics"
      updateMutation={updateEthics}
      queryKey={["ethics"]}
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
        headerIcon: <EthicsIcon className="w-6 h-6 text-purple-600" />,
        headerColor: "purple",
        showImageInfo: true,
      }}
      feature={Features.ETHICS}
    />
  );
}
