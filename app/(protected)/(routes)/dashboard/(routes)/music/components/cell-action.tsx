"use client";

import { Music } from "@/types";
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
import { deleteMusic } from "@/actions/dashboard/music/delete-music";

interface CellActionProps {
  music: Music;
}

const CellAction = ({ music }: CellActionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMusic,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Music deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["musics"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete music error:", error);
      toast.error("Failed to delete music. Please try again.");
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/music/edit/${music.id}`);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(music.id);
    toast.success("Music ID copied to clipboard!");
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "music",
      handleConfirm() {
        deleteMutation.mutate(music.id);
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
            Edit Music
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Music
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
