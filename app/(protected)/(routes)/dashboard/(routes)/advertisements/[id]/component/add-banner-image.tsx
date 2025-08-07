'use client';
import { updateAds } from "@/actions/dashboard/ads/update-ads";
import { BackendFileUpload } from "@/components/forms/backend-file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Ads } from "@/types/ads.type";
import { Features, UploadResponse } from "@/types/upload.type";
import { ImageIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface AddBannerProps {
  initialData: Ads;
}

const AddBanner = ({ initialData }: AddBannerProps) => {
  const [imageUrl, setImageUrl] = useState<string>(initialData?.imageUrl || "");
  const router = useRouter();
  const queryClient = useQueryClient();

  const updateBannerMutation = useMutation({
    mutationFn: async (newImageUrl: string) => {
      if (!initialData || !initialData.id) {
        throw new Error("Advertisement ID is required for update");
      }
      
      return updateAds({
        id: initialData.id,
        imageUrl: newImageUrl,
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      if (!response.success) {
        console.error("Failed to update advertisement banner:", response);
        toast.error(`Failed to update advertisement banner: ${response.message}`);
        return;
      }
      toast.success("Advertisement banner updated successfully!");
      router.refresh();
    },
    onError: (error) => {
      console.error("Error updating advertisement banner:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update advertisement banner"
      );
    },
  });

  function handleUploadComplete(files: UploadResponse[]) {
    if (files.length > 0 && files[0].data.file?.url) {
      const url = files[0].data.file.url;
      setImageUrl(url);
      
      // Auto-save the image URL
      updateBannerMutation.mutate(url);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          Update Advertisement Banner
        </CardTitle>
        <CardDescription>
          Change the banner image for this advertisement. The image will be displayed to users.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {initialData?.imageUrl && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-2">Current Banner Image:</p>
            <div className="relative border rounded-md overflow-hidden w-full h-96">
              <Image
                src={initialData.imageUrl}
                alt="Current ad banner"
                fill
                className="w-full h-auto object-cover aspect-[16/9]"
              />
            </div>
          </div>
        )}

        <BackendFileUpload
          feature={Features.ADS}
          accept="image/*"
          maxSize={5 * 1024 * 1024} // 5MB
          maxFiles={1}
          onUploadComplete={handleUploadComplete}
        />
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <p className="text-sm text-muted-foreground">
          {updateBannerMutation.isPending ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Updating banner...
            </span>
          ) : imageUrl !== initialData?.imageUrl ? (
            "Banner will be updated automatically after upload."
          ) : (
            "Upload a new image to replace the current banner."
          )}
        </p>
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          disabled={updateBannerMutation.isPending}
        >
          Back
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AddBanner;
