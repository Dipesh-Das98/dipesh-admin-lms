"use client";

import { Button } from "@/components/ui/button";
import { LoadingButton } from "@/components/ui/loading-button";
import { useModal } from "@/hooks/use-modal";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "@/actions/dashboard/course/update-course";
import { deleteCourse } from "@/actions/dashboard/course/delete-course";
import { toast } from "sonner";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

const CourseActions: FC<CourseActionsProps> = ({
  disabled,
  courseId,
  isPublished,
}) => {
  // ---------------------------------------hooks---------------------------------------
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  //  ---------------------------------------states---------------------------------------
  // Using mutation loading states instead of local loading state

  // ---------------------------------------mutations---------------------------------------
  const publishMutation = useMutation({
    mutationFn: updateCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(`Course ${isPublished ? 'unpublished' : 'published'} successfully!`);
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Update course error:", error);
      toast.error("Failed to update course status. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Course deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        router.push("/dashboard/course");
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete course error:", error);
      toast.error("Failed to delete course. Please try again.");
    },
  });

  //   ---------------------------------------functions---------------------------------------

  const handleDelete = async () => {
    try {
      deleteMutation.mutate(courseId);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePublish = async () => {
    try {
      publishMutation.mutate({
        id: courseId,
        isPublished: !isPublished,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <LoadingButton
        size="sm"
        isLoading={publishMutation.isPending}
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
            confirmText: "Course",
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

export default CourseActions;
