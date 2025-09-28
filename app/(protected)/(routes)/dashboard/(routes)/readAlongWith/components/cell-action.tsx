"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Copy, Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal";
import { deleteReadAlongStory } from "@/actions/dashboard/readAlongWith/delete-read-along-with-by-story-id";
import { ReadAlongStory } from "@/types/readAlongWith.types";

interface CellActionProps {
  story: ReadAlongStory;
}

const CellAction = ({ story }: CellActionProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteReadAlongStory,
    onSuccess: (response) => {
      if (response.success) {
        toast.success("Story deleted successfully!");
        queryClient.invalidateQueries({ queryKey: ["read-along-stories"] });
      } else {
        toast.error(response.message || "Failed to delete story.");
      }
    },
    onError: (error) => {
      console.error("Delete story error:", error);
      toast.error("Unexpected error. Try again.");
    },
  });

  const handleEdit = () => {
    router.push(`/dashboard/readAlongWith/edit/${story.id}`);
  };
  const handleManageSlides = () => {
    router.push(`/dashboard/readAlongWith/manage-slides/${story.id}`);
  };

  const handleDelete = () => {
    openModal("confirmation-model", {
      confirmText: "story",
      handleConfirm() {
        deleteMutation.mutate(story.id);
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
          <DropdownMenuItem onClick={handleEdit}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Story
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleManageSlides}>
            <Edit2 className="mr-2 h-4 w-4" />
            Manage Slides
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Story
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              navigator.clipboard.writeText(story.id);
              toast.success("Story ID copied to clipboard!");
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
