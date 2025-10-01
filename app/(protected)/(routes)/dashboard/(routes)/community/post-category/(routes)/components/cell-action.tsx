"use client";
import { PostCategory } from "@/actions/dashboard/community/post-category";
import { Button } from "@/components/ui/button";
import { Copy, MoreHorizontal, Trash2, Edit } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostCategory } from "@/actions/dashboard/community/post-category";
import { useSheet } from "@/hooks/use-sheet";

interface CellActionProps {
  postCategory: PostCategory;
}

const CellAction = ({ postCategory }: CellActionProps) => {
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const { openSheet } = useSheet();

  // Delete post category mutation
  const deleteMutation = useMutation({
    mutationFn: deletePostCategory,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Post category deleted successfully!");
        // Invalidate and refetch post categories queries
        queryClient.invalidateQueries({ queryKey: ["post-categories"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete post category error:", error);
      toast.error("Failed to delete post category. Please try again.");
    },
  });

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "post category",
      handleConfirm() {
        deleteMutation.mutate(postCategory.id);
      },
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(postCategory.id);
    toast.success("Post category ID copied to clipboard!");
  };

  const handleEditClick = () => {
    openSheet("post-category-form", {
      mode: "edit",
      postCategory: postCategory,
    });
  };

  return (
    <div className="flex justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center">
          <DropdownMenuItem onClick={handleCopyId}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Post Category
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Post Category
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
