"use client";

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
import { deleteEthics } from "@/actions/dashboard/ethics/delete-ethics";
import { Ethics } from "@/types";

interface CellActionProps {
  ethics: Ethics;
}

const CellAction = ({ ethics }: CellActionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteEthics,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Ethics deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["ethics"] });
      } else {
        const errorMessage = response.message.includes("Unauthorized")
          ? "You are not authorized to delete this ethics"
          : response.message;
        toast.error(errorMessage || "Failed to delete ethics");
      }
    },
    onError: (error) => {
      console.error("Delete ethics error:", error);
      toast.error("Failed to delete ethics. Please try again.");
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/ethics/edit/${ethics.id}`);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(ethics.id);
    toast.success("Ethics ID copied to clipboard!");
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "ethics",
      handleConfirm() {
        deleteMutation.mutate(ethics.id);
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
          <DropdownMenuItem onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Ethics
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Ethics
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
