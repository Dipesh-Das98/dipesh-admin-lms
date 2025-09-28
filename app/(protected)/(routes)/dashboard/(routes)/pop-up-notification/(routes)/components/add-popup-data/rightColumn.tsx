"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form"; // Import your component
import { PopupNotificationFormValues } from "./mainform"; // Import the Pop-up Form Values
import { Features } from "@/types";

interface RightColumnProps {
  form: UseFormReturn<PopupNotificationFormValues>;
}

const RightColumn: React.FC<RightColumnProps> = ({ form }) => {
  // Watch the fields needed for the GenericThumbnailForm props
  const title = form.watch("title");
  const imageUrl = form.watch("imageUrl");
  const id = form.watch("id");
  
  // NOTE: For the purpose of the GenericThumbnailForm, we need a unique ID.
  // We use the Pop-up ID if it's an edit mode, or a placeholder if it's a create mode.
  const entityId = id || "new-popup-notification"; 

  // --- HANDLER FOR GENERIC THUMBNAIL FORM ---
  // When the GenericThumbnailForm successfully processes an image, 
  // it calls the updateMutation function. We use this opportunity 
  // to update the local form state with the new URL.
  const handleThumbnailUpdate = async (data: { thumbnail: string }) => {
    if (data.thumbnail) {
        // 1. Update the local form state with the new URL
        form.setValue("imageUrl", data.thumbnail, { shouldValidate: true });
        form.trigger("imageUrl");

        // 2. Return a successful result object, but DO NOT call an external API mutation here.
        // The actual API call happens when the user clicks the main 'Create/Update' button.
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
        key={imageUrl} // Use key to re-render if the image changes
        entity={{
          id: entityId, 
          title: title || "Untitled Pop-up",
          thumbnail: imageUrl || undefined,
        }}
        entityType="pop-up-notification"
        // Pass our local handler that only updates the form state
        updateMutation={(data) =>
          handleThumbnailUpdate({ thumbnail: data.thumbnail! })
        }
        queryKey={["pop-up-image", entityId]}
        maxSize={5 * 1024 * 1024}
        acceptedFormats="image/*"
        recommendations={{
          size: "Optimal size for pop-up",
          aspectRatio: "Varies (e.g., 4:3 or 16:9)",
          formats: "JPG, PNG, WebP",
          maxFileSize: "5MB",
        }}
        displaySettings={{
          imageHeight: "h-80",
          headerIcon: <ImageIcon className="w-6 h-6 text-emerald-600" />,
          headerColor: "emerald",
          showImageInfo: true,
        }}
        feature={Features.POPUP_NOTIFICATION}
      />
      {/* Removed GenericMediaForm as it's not needed for pop-ups */}
    </div>
  );
};

export default RightColumn;