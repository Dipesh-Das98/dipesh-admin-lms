"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { PregnancyNutritionFormValues } from "./mainColumn";
import { Features } from "@/types";

type FormValues = PregnancyNutritionFormValues;

interface RightColumnProps {
  form: UseFormReturn<FormValues, any, FormValues>;
  mode: "create" | "edit";
  tipId?: string; 
}

const RightColumn: React.FC<RightColumnProps> = ({ form, mode, tipId }) => {
  const title = form.watch("foodName"); 
  const imageUrl = form.watch("foodImage"); 
  const id = tipId || form.watch("id"); 
  const entityId = id || "new-nutrition-tip"; 

  const handleThumbnailUpdate = async (data: { thumbnail: string }) => {
    if (data.thumbnail) {
      form.setValue("foodImage", data.thumbnail, { shouldValidate: true });
      form.trigger("foodImage"); 
      return {
        success: true,
        message: "Image URL updated locally in the form.",
      };
    }
    return { success: false, message: "No image URL received from upload." };
  };

  return (
    <div className="space-y-6">
      <GenericThumbnailForm
        key={imageUrl} 
        entity={{
          id: entityId,
          title: title || "Untitled Tip",
          thumbnail: imageUrl || undefined, 
        }}
        entityType="pregnancy-nutrition-tip" 
        updateMutation={(data) =>
          handleThumbnailUpdate({ thumbnail: data.thumbnail! })
        }
        queryKey={["nutrition-tip-image", entityId]}
        maxSize={5 * 1024 * 1024}
        acceptedFormats="image/*"
        recommendations={{
          size: "Recommended for tips",
          aspectRatio: "e.g., 16:9 for banners",
          formats: "JPG, PNG, WebP",
          maxFileSize: "5MB",
        }}
        displaySettings={{
          imageHeight: "h-80",
          headerIcon: <ImageIcon className="w-6 h-6 text-emerald-600" />,
          headerColor: "emerald",
          showImageInfo: true,
        }}
        feature={Features.PREGNANCY_NUTRITION}
      />
    </div>
  );
};

export default RightColumn;
