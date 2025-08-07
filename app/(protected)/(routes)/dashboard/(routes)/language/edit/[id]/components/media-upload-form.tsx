"use client";

import React from "react";
import { updateLanguageCorner } from "@/actions/dashboard/language/update-language";
import { LanguageCorner } from "@/types";
import { GenericMediaForm } from "@/components/forms/generic-media-form";
import { useRouter } from "next/navigation";

interface MediaFormProps {
  languageCorner: LanguageCorner;
}

export function MediaForm({ languageCorner }: MediaFormProps) {
  const router = useRouter();

  const handleUpdate = async (data: { mediaUrl: string }) => {
    return await updateLanguageCorner({
      id: languageCorner.id,
      mediaUrl: data.mediaUrl,
    });
  };

  return (
    <GenericMediaForm
      initialData={languageCorner}
      onUpdate={handleUpdate}
      title="Language Corner Media"
      description="Add video content to enhance your language learning material"
      mediaUrlField="mediaUrl"
      queryKeys={[["language-corner"]]}
      routerRefresh={() => router.refresh()}
      successMessage="Language corner media updated successfully!"
      errorMessage="Failed to update language corner media"
    />
  );
}
