"use client";

import { Category } from "@/types/category.type";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory } from "@/actions/dashboard/category/delete-category";
import { useRouter } from "next/navigation";

interface CellActionProps {
  category: Category;
}

const CellAction = ({ category }: CellActionProps) => {
  const { openModal } = useModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Category deleted successfully!");
        // Invalidate and refetch categories queries
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete category error:", error);
      toast.error("Failed to delete category. Please try again.");
    },
  });

  const handleEditClick = () => {
    router.push(`/dashboard/categories/edit/${category.id}`);
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "category",
      handleConfirm() {
        deleteMutation.mutate(category.id);
      },
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
          <DropdownMenuItem onClick={handleEditClick}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(category.id);
              toast.success("Category ID copied to clipboard!");
            }}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
