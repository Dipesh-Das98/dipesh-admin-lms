"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { ImageIcon } from "lucide-react";
import { GenericThumbnailForm } from "@/components/forms/generic-thumbnail-form";
import { Features } from "@/types";
import { updateHelpTopic } from "@/actions/dashboard/help-topics/edit-helptopics-by-id";

type FormValues = {
  id?: string;
  topicName: string;
  questions: string[];
  iconUrl: string | null;
};

interface RightColumnProps {
  form: UseFormReturn<FormValues>;
  topicId: string;
}

const RightColumn: React.FC<RightColumnProps> = ({ form, topicId }) => {
  const title = form.watch("topicName");
  const iconUrl = form.watch("iconUrl");

  const handleIconUpdate = async (data: { thumbnail: string }) => {
    if (!data.thumbnail) {
      return { success: false, message: "No icon provided" };
    }

    const result = await updateHelpTopic(topicId, {
      topicName: form.getValues("topicName"),
      questions: form.getValues("questions"),
      iconUrl: data.thumbnail,
    });

    if (result.success) {
      form.setValue("iconUrl", data.thumbnail);
      form.trigger("iconUrl");
    }

    return {
      success: result.success,
      message: result.message,
    };
  };

  return (
    <div className="space-y-6">
      <GenericThumbnailForm
        key={iconUrl}
        entity={{
          id: topicId,
          title: title || "Untitled",
          thumbnail: iconUrl || undefined,
        }}
        entityType="helpTopic"
        updateMutation={(data) =>
          handleIconUpdate({ thumbnail: data.thumbnail! })
        }
        queryKey={["help-topic-icon", topicId]}
        maxSize={2 * 1024 * 1024} // 2MB limit for icons
        acceptedFormats="image/*"
        recommendations={{
          size: "512x512px",
          aspectRatio: "1:1",
          formats: "PNG, JPG, WebP",
          maxFileSize: "2MB",
        }}
        displaySettings={{
          imageHeight: "h-40",
          headerIcon: <ImageIcon className="w-6 h-6 text-indigo-600" />,
          headerColor: "indigo",
          showImageInfo: true,
        }}
        feature={Features.HELP_TOPICS}
      />
    </div>
  );
};

export default RightColumn;