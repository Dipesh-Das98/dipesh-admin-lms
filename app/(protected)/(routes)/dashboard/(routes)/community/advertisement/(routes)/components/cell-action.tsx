"use client";
import { Advertisement } from "@/actions/dashboard/community/advertisement";
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
import { deleteAdvertisement } from "@/actions/dashboard/community/advertisement";
import { useSheet } from "@/hooks/use-sheet";

interface CellActionProps {
  advertisement: Advertisement;
}

const CellAction = ({ advertisement }: CellActionProps) => {
  const { openModal } = useModal();
  const queryClient = useQueryClient();
  const { openSheet } = useSheet();

  // Delete advertisement mutation
  const deleteMutation = useMutation({
    mutationFn: deleteAdvertisement,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Advertisement deleted successfully!");
        // Invalidate and refetch advertisements queries
        queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error: Error) => {
      console.error("Delete advertisement error:", error);
      toast.error("Failed to delete advertisement. Please try again.");
    },
  });

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "advertisement",
      handleConfirm() {
        deleteMutation.mutate(advertisement.id as string);
      },
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(advertisement.id);
    toast.success("Advertisement ID copied to clipboard!");
  };

  const handleEditClick = () => {
    openSheet("advertisement-form", {
      mode: "edit",
      advertisement: advertisement,
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
            Edit Advertisement
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDeleteClick}
            className="text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Advertisement
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CellAction;
