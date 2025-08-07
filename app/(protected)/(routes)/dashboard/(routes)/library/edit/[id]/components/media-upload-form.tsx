"use client";

import React from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLibrary } from "@/actions/dashboard/library";
import { Button } from "@/components/ui/button";
import { Library, UpdateLibraryData } from "@/types";
import { FileText, Edit, X, Loader } from "lucide-react";
import { BackendFileUpload } from "@/components/forms/backend-file-upload";
import { Features, UploadResponse } from "@/types/upload.type";
import { useRouter } from "next/navigation";

interface MediaFormProps {
  library: Library;
}

export function MediaForm({ library }: MediaFormProps) {
  //--------------------------- hooks---------------------------------------------
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);

  //   ---------------------------------------handlers---------------------------------------
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const updateMutation = useMutation({
    mutationFn: (data: UpdateLibraryData) => updateLibrary(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success("PDF updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["stories"] });
        setIsEditing(false);
        router.refresh(); // Refresh the page to reflect changes
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update library error:", error);
      toast.error("Failed to update PDF. Please try again.");
    },
  });

  const handleFileUploadComplete = (uploadResults: UploadResponse[]) => {
    if (uploadResults.length > 0 && uploadResults[0].data.file.url) {
      const mediaUrl = uploadResults[0].data.file.url;

      // Auto-submit the media update after successful upload
      const updateData: UpdateLibraryData = {
        id: library.id,
        mediaUrl: mediaUrl,
      };

      updateMutation.mutate(updateData);
    }
  };

  const renderMediaPreview = (mediaUrl: string) => {
    const fileName = mediaUrl.split("/").pop();

    return (
      <div className="w-full max-w-full p-4 border rounded-lg bg-muted/30">
        <div className="text-center">
          <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-2">
            PDF file: {fileName}
          </p>
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline block"
          >
            Open PDF file
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">
                PDF Settings
              </h3>
              <p className="text-sm text-muted-foreground">
                Upload PDF files for your library
              </p>
            </div>
          </div>
          <Button onClick={toggleEdit} variant="outline" size="sm">
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

        {/* Current Media Display */}
        {!isEditing && (
          <div className="space-y-4">
            {library.mediaUrl ? (
              <div className="relative">
                {renderMediaPreview(library.mediaUrl)}
              </div>
            ) : (
              <div className="w-full h-48 bg-muted rounded-lg border border-dashed border-muted-foreground/25 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    No PDF uploaded
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* File Upload Interface */}
        {isEditing && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">
                Upload PDF
              </h4>
              <p className="text-sm text-muted-foreground">
                Upload PDF files for your library. Supported format: PDF only.
                Maximum file size: 10MB.
              </p>
            </div>

            <BackendFileUpload
              feature={Features.LIBRARY}
              accept="application/pdf,.pdf"
              maxSize={20 * 1024 * 1024} // 20MB
              maxFiles={1}
              onUploadComplete={handleFileUploadComplete}
            />

            {updateMutation.isPending && (
              <div className="text-sm text-muted-foreground">
                <Loader className="inline mr-2 w-4 h-4 animate-spin" />
                Updating PDF
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
