"use client";

import { Course } from "@/types/course.type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Copy 
} from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";
import { deleteCourse } from "@/actions/dashboard/course/delete-course";

interface CellActionProps {
  course: Course;
}

const CellAction = ({ course }: CellActionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCourse,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Course deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["courses"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete course error:", error);
      toast.error("Failed to delete course. Please try again.");
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/course/edit/${course.id}`);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(course.id);
    toast.success("Course ID copied to clipboard!");
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "course",
      handleConfirm() {
        deleteMutation.mutate(course.id);
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Course
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Course
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { CellAction };
