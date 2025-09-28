"use client";

import React from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { BackendFileUpload } from "@/components/forms/backend-file-upload";
import { Features, UploadResponse } from "@/types/upload.type";
import {
  Image as ImageIcon,
  Edit,
  X,
  CheckCircle2,
  Loader,
} from "lucide-react";
import ThumbnailUplaodInstruction from "@/components/global/thumbail-instruction";
import Image from "next/image";

// Generic base interface that all entities must extend
interface BaseEntity {
  id?: string;
  title?: string;
  thumbnail?: string;
}

// Generic update data interface
interface BaseUpdateData {
  id: string;
  thumbnail?: string;
  imageUrl?: string; // Optional, can be used for different image types
}

// Generic response interface
interface BaseResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

// Props for the generic thumbnail form
interface GenericThumbnailFormProps<
  TEntity extends BaseEntity,
  TUpdateData extends BaseUpdateData
> {
  entity: TEntity;
  entityType: string; // "game", "music", "story", "movie"
  updateMutation: (data: TUpdateData) => Promise<BaseResponse>;
  queryKey: string[]; // Query key for React Query cache invalidation
  maxSize?: number; // Maximum file size in bytes
  acceptedFormats?: string; // Accepted file formats
  recommendations?: {
    size?: string;
    aspectRatio?: string;
    formats?: string;
    maxFileSize?: string;
  };
  displaySettings?: {
    imageHeight?: string; // Tailwind classes for image height
    headerIcon?: React.ReactNode;
    headerColor?: string; // Tailwind color classes
    showImageInfo?: boolean;
  };
  feature:Features; // Feature type for upload
}

export function GenericThumbnailForm<
  TEntity extends BaseEntity,
  TUpdateData extends BaseUpdateData
>({
  entity,
  entityType,
  updateMutation,
  queryKey,
  maxSize = 5 * 1024 * 1024, // 5MB default
  acceptedFormats = "image/*",
  recommendations = {
    size: "1200x630px",
    aspectRatio: "16:9 or 1.91:1",
    formats: "JPG, PNG, WebP",
    maxFileSize: "5MB",
  },
  displaySettings = {
    imageHeight: "h-80",
    headerColor: "blue",
    showImageInfo: true,
  },
  feature
}: GenericThumbnailFormProps<TEntity, TUpdateData>) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const mutation = useMutation({
    mutationFn: updateMutation,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Thumbnail updated successfully!");
        queryClient.invalidateQueries({ queryKey });
        setIsEditing(false);
        router.refresh(); // Refresh the page to reflect changes
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error(`Update ${entityType} error:`, error);
      toast.error(`Failed to update thumbnail. Please try again.`);
    },
  });

  const handleFileUploadComplete = (uploadResults: UploadResponse[]) => {
    if (uploadResults.length > 0 && uploadResults[0].data.file.url) {
      const thumbnailUrl = uploadResults[0].data.file.url;

      // Auto-submit the thumbnail update after successful upload
      const updateData = {
        id: entity.id,
        thumbnail: thumbnailUrl,
        imageUrl: thumbnailUrl, // Use imageUrl if needed
      } as TUpdateData;

      mutation.mutate(updateData);
    }
  };

  // Get header color classes
  const getHeaderColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string }> = {
      blue: { bg: "bg-blue-500/20", text: "text-blue-600" },
      green: { bg: "bg-green-500/20", text: "text-green-600" },
      purple: { bg: "bg-purple-500/20", text: "text-purple-600" },
      orange: { bg: "bg-orange-500/20", text: "text-orange-600" },
      red: { bg: "bg-red-500/20", text: "text-red-600" },
    };
    return colorMap[color] || colorMap.blue;
  };

  const headerColors = getHeaderColorClasses(
    displaySettings.headerColor || "blue"
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-6 space-y-8">
        {/* Enhanced Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`md:size-10 2xl:size-12 rounded-xl ${headerColors.bg} flex items-center justify-center shadow-sm`}
            >
              {displaySettings.headerIcon || (
                <ImageIcon className={`w-5 h-5 ${headerColors.text}`} />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">
                Thumbnail Settings
              </h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Upload a high-quality thumbnail image for your {entityType}.
                This will be the first thing users see.
              </p>
            </div>
          </div>

          <Button
            onClick={toggleEdit}
            variant={isEditing ? "destructive" : "outline"}
            size="sm"
            className="min-w-[100px] transition-all duration-200"
          >
            {isEditing ? (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </>
            )}
          </Button>
        </div>

        {/* Enhanced Current Thumbnail Display */}
        {!isEditing && (
          <div className="space-y-6">
            {entity.thumbnail ? (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-xl border border-border/50 bg-muted/20 h-80">
                  <Image
                    fill
                    src={entity.thumbnail}
                    alt={`${entity.title || entityType} thumbnail`}
                    className={`w-full ${displaySettings.imageHeight} object-cover transition-transform duration-300 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Image Info */}
                {displaySettings.showImageInfo && (
                  <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span>Thumbnail uploaded successfully</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <div
                  className={`w-full ${displaySettings.imageHeight} bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 border-dashed border-muted-foreground/25 flex items-center justify-center transition-colors hover:border-muted-foreground/40`}
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">
                        No thumbnail uploaded
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click edit to upload a thumbnail image
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Enhanced File Upload Interface */}
        {isEditing && (
          <div className="space-y-8">
            {/* Upload Instructions */}
            <ThumbnailUplaodInstruction name={entityType} />

            {/* Custom Recommendations if provided */}
            {recommendations && (
              <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                <h5 className="text-sm font-medium text-foreground mb-2">
                  Custom Recommendations for {entityType}
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  {recommendations.size && (
                    <div>Size: {recommendations.size}</div>
                  )}
                  {recommendations.aspectRatio && (
                    <div>Aspect Ratio: {recommendations.aspectRatio}</div>
                  )}
                  {recommendations.formats && (
                    <div>Formats: {recommendations.formats}</div>
                  )}
                  {recommendations.maxFileSize && (
                    <div>Max Size: {recommendations.maxFileSize}</div>
                  )}
                </div>
              </div>
            )}

            {/* File Upload Component */}
            <div className="relative">
              <BackendFileUpload
                feature={feature}
                accept={acceptedFormats}
                maxSize={maxSize}
                maxFiles={1}
                onUploadComplete={handleFileUploadComplete}
              />
            </div>

            {/* Loading State */}
            {mutation.isPending && (
              <div className="flex items-center justify-center p-6 rounded-lg bg-muted/20 border border-border/30">
                <div className="flex items-center gap-3">
                  <Loader className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Updating thumbnail...
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
