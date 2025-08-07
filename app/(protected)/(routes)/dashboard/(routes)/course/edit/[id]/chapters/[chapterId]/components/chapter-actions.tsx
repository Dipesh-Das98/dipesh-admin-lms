"use client";

import { deleteChapter } from "@/actions/dashboard/course/chapter/delete-chapter";
import { publishChapter } from "@/actions/dashboard/course/chapter/publish-chapter";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useModal } from "@/hooks/use-modal";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ChapterActionsProps {
  disabled: boolean;
  chapterId: string;
  courseId: string;
  isPublished: boolean;
}

const ChapterActions: FC<ChapterActionsProps> = ({
  disabled,
  chapterId,
  courseId,
  isPublished,
}) => {
  const router = useRouter();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  // ---------------------------------------mutations---------------------------------------
  const deleteMutation = useMutation({
    mutationFn: deleteChapter,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Chapter deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        router.push(`/dashboard/course/edit/${courseId}`);
      } else {
        toast.error(response.message || "Failed to delete chapter");
      }
    },
    onError: (error) => {
      console.error("Delete chapter error:", error);
      toast.error("Failed to delete chapter. Please try again.");
    },
  });

  const publishMutation = useMutation({
    mutationFn: ({ chapterId, courseId, isPublished }: { chapterId: string; courseId: string; isPublished: boolean }) =>
      publishChapter(chapterId, courseId, isPublished),
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || `Chapter ${!isPublished ? 'published' : 'unpublished'} successfully!`);
        queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      } else {
        toast.error(response.message || "Failed to update chapter status");
      }
    },
    onError: (error) => {
      console.error("Publish chapter error:", error);
      toast.error("Failed to update chapter status. Please try again.");
    },
  });

  //   ---------------------------------------functions---------------------------------------

  const handleDelete = async () => {
    try {
      deleteMutation.mutate(chapterId);
    } catch (error) {
      console.error("Delete chapter error:", error);
    }
  };

  const handlePublish = async () => {
    try {
      publishMutation.mutate({
        chapterId,
        courseId,
        isPublished: !isPublished,
      });
    } catch (error) {
      console.error("Publish chapter error:", error);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <LoadingButton
        isLoading={publishMutation.isPending}
        size="sm"
        disabled={disabled || publishMutation.isPending}
        variant={"outline"}
        onClick={handlePublish}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </LoadingButton>

      <Button
        size="sm"
        onClick={() =>
          openModal("confirmation-model", {
            confirmText: "chapter",
            handleConfirm: handleDelete,
          })
        }
        disabled={deleteMutation.isPending}
      >
        <Trash />
      </Button>
    </div>
  );
};

export default ChapterActions;
