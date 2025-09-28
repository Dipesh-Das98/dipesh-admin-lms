"use client";

import React from "react";
import { Features, LanguageCorner } from "@/types";
import { updateLanguageCorner } from "@/actions/dashboard/language/update-language";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { Languages as LanguageIcon } from "lucide-react";

interface LanguageCornerThumbnailFormProps {
  languageCorner: LanguageCorner;
}

export function LanguageCornerThumbnailForm({ languageCorner }: LanguageCornerThumbnailFormProps) {
  return (
    <GenericThumbnailForm
    feature={Features.LANGUAGE_CORNER}
      entity={languageCorner}
      entityType="language"
      updateMutation={updateLanguageCorner}
      queryKey={["language-corner"]}
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
        headerIcon: <LanguageIcon className="w-6 h-6 text-blue-600" />,
        headerColor: "blue",
        showImageInfo: true,
      }}
    />
  );
}
