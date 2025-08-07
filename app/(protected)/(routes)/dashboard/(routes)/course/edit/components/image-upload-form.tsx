"use client";

import React, { FC } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { BackendFileUpload } from "@/components/forms/backend-file-upload";
import { updateCourse } from "@/actions/dashboard/course/update-course";
import { Course, Features } from "@/types";
import { placeholderBlurhash } from "@/lib/utils";

interface ImageUploadFormProps {
  initialData: Course;
  courseId: string;
}

const ImageUploadForm: FC<ImageUploadFormProps> = ({
  initialData,
  courseId,
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = React.useState(false);

  // ---------------------------------------mutations---------------------------------------
  const updateMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Course thumbnail updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        setIsEditing(false);
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update course error:", error);
      toast.error("Failed to update course thumbnail. Please try again.");
    },
  });

  // ---------------------------------------handlers---------------------------------------
  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleImageUpload = (imageUrl: string) => {
    updateMutation.mutate({
      id: courseId,
      thumbnail: imageUrl,
    });
  };

  return (
    <div className="mt-6 bg-slate-100 dark:bg-neutral-800 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course Thumbnail
        <Button onClick={toggleEdit} variant="ghost" size="sm">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit Thumbnail
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div className="mt-4">
          {initialData.thumbnail ? (
            <div className="relative aspect-video w-full ">
              <Image
                alt="Course thumbnail"
                fill
                blurDataURL={placeholderBlurhash}
                className="object-cover rounded-md w-full"
                src={initialData.thumbnail}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-60 bg-slate-200 dark:bg-slate-700 rounded-md ">
              <ImageIcon className="w-10 h-10 text-slate-500" />
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="mt-4">
          <BackendFileUpload
            feature={Features.COURSES}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            maxFiles={1}
            onUploadComplete={(files) => {
              if (files.length > 0 && files[0].success) {
                handleImageUpload(files[0].data.file.url);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadForm;
