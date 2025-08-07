"use client";

import { Game } from "@/types";
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
import { deleteGame } from "@/actions/dashboard/game/delete-game";

interface CellActionProps {
  game: Game;
}

const CellAction = ({ game }: CellActionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteGame,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Game deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["games"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete game error:", error);
      toast.error("Failed to delete game. Please try again.");
    },
  });


  const handleEdit = () => {
    router.push(`/dashboard/games/edit/${game.id}`);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(game.id);
    toast.success("Game ID copied to clipboard!");
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "game",
      handleConfirm() {
        deleteMutation.mutate(game.id);
      }
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
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export { CellAction };
