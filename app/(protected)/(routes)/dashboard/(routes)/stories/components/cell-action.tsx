"use client";

import { Story } from "@/types";
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
import { deleteStory } from "@/actions/dashboard/story/delete-story";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal";

interface CellActionProps {
  story: Story;
}

const CellAction = ({ story }: CellActionProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openModal } = useModal();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteStory,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Story deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["stories"] });
      } else {
        toast.error(response.message);
      }
    },
    onError: (error) => {
      console.error("Delete story error:", error);
      toast.error("Failed to delete story. Please try again.");
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/stories/edit/${story.id}`);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(story.id);
    toast.success("Story ID copied to clipboard!");
  };

  const handleDeleteClick = () => {
    openModal("confirmation-model", {
      confirmText: "story",
      handleConfirm() {
        deleteMutation.mutate(story.id);
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
            Edit Story
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleDeleteClick}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Story
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
